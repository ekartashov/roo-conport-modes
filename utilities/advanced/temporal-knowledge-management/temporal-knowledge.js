/**
 * Temporal Knowledge Management Integration
 * 
 * This module integrates the validation and core components for Temporal Knowledge Management,
 * providing a simplified API for knowledge versioning, historical retrieval, and dependency tracking.
 */

const { validateTemporalKnowledge } = require('./temporal-knowledge-validation');
const { createTemporalKnowledgeCore } = require('./temporal-knowledge-core');

/**
 * Creates a temporal knowledge management system with integrated validation
 * @param {Object} options Configuration options
 * @param {string} options.workspaceId ConPort workspace ID
 * @param {Object} options.conPortClient ConPort client instance
 * @param {boolean} [options.enableValidation=true] Enable input validation
 * @param {boolean} [options.strictMode=false] Throw errors on validation failures
 * @returns {Object} Integrated temporal knowledge management API
 */
function createTemporalKnowledge(options = {}) {
  const {
    workspaceId,
    conPortClient,
    enableValidation = true,
    strictMode = false
  } = options;

  if (!workspaceId || !conPortClient) {
    throw new Error('Required options missing: workspaceId and conPortClient must be provided');
  }

  // Initialize validation functions
  const validation = validateTemporalKnowledge();

  // Initialize core functions
  const core = createTemporalKnowledgeCore({
    workspaceId,
    conPortClient
  });

  /**
   * Helper to run validation before a core function
   * @param {Function} validationFn Validation function to run
   * @param {any} input Input to validate
   * @param {Function} coreFn Core function to run if validation passes
   * @param {Array} args Arguments to pass to core function
   * @returns {any} Result of core function
   */
  function validateAndExecute(validationFn, input, coreFn, args = []) {
    if (enableValidation) {
      const validationResult = validationFn(input);
      
      if (!validationResult.valid) {
        const errorMessage = `Validation failed: ${validationResult.errors.join(', ')}`;
        
        if (strictMode) {
          throw new Error(errorMessage);
        } else {
          console.warn(errorMessage);
        }
      }
    }
    
    return coreFn(...args);
  }

  /**
   * Logs a temporal knowledge operation to ConPort
   * @param {string} operation The operation type
   * @param {Object} details Operation details
   * @returns {Promise<void>} 
   */
  async function logOperation(operation, details) {
    try {
      const logEntry = {
        operation,
        timestamp: new Date().toISOString(),
        details
      };

      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'temporal_knowledge_operations',
        key: `${operation}_${Date.now()}`,
        value: logEntry
      });
    } catch (error) {
      console.error('Failed to log operation:', error);
      // Non-critical error, continue execution
    }
  }

  /**
   * Creates or retrieves a ConPort decision for a significant temporal operation
   * @param {Object} operationData Operation data
   * @returns {Promise<Object>} Decision object with ID
   */
  async function recordOperationDecision(operationData) {
    const {
      operation,
      artifactType,
      artifactId,
      reason
    } = operationData;

    try {
      const decisionSummary = `${operation}: ${artifactType} ${artifactId}`;
      const decisionRationale = reason || 
        `${operation} performed on ${artifactType} ${artifactId} to preserve knowledge state`;

      const decision = await conPortClient.log_decision({
        workspace_id: workspaceId,
        summary: decisionSummary,
        rationale: decisionRationale,
        tags: ['temporal_knowledge', operation, artifactType]
      });

      return decision;
    } catch (error) {
      console.error('Failed to record operation decision:', error);
      // Return a placeholder object with error info
      return { 
        error: 'Failed to record decision', 
        errorDetails: error.message 
      };
    }
  }

  return {
    /**
     * Creates a new version of a knowledge artifact
     * @param {Object} versionData Version data
     * @returns {Promise<Object>} Created version
     */
    async createVersion(versionData) {
      return validateAndExecute(
        validation.validateVersionCreation,
        versionData,
        async () => {
          try {
            const version = await core.createVersion(versionData);
            
            // Log version creation
            await logOperation('version_created', {
              artifactType: versionData.artifactType,
              artifactId: versionData.artifactId,
              versionId: version.versionId
            });
            
            // Record significant versions as decisions (e.g., major updates)
            if (versionData.metadata && versionData.metadata.significant) {
              await recordOperationDecision({
                operation: 'Version creation',
                artifactType: versionData.artifactType,
                artifactId: versionData.artifactId,
                reason: versionData.metadata.reason || 'Significant version created'
              });
            }
            
            return version;
          } catch (error) {
            console.error('Error creating version:', error);
            throw error;
          }
        },
        [versionData]
      );
    },

    /**
     * Retrieves a specific version of a knowledge artifact
     * @param {Object} params Retrieval parameters
     * @returns {Promise<Object>} Retrieved version
     */
    async getVersion(params) {
      return validateAndExecute(
        validation.validateVersionRetrieval,
        params,
        async () => {
          try {
            const version = await core.getVersion(params);
            
            // Log version retrieval
            await logOperation('version_retrieved', {
              artifactType: params.artifactType,
              artifactId: params.artifactId,
              versionId: params.versionId,
              timestamp: params.timestamp
            });
            
            return version;
          } catch (error) {
            console.error('Error retrieving version:', error);
            throw error;
          }
        },
        [params]
      );
    },

    /**
     * Lists versions of a knowledge artifact
     * @param {Object} params Listing parameters
     * @returns {Promise<Array<Object>>} List of versions
     */
    async listVersions(params) {
      return validateAndExecute(
        validation.validateVersionListing,
        params,
        async () => {
          try {
            const versions = await core.listVersions(params);
            
            // Log version listing
            await logOperation('versions_listed', {
              artifactType: params.artifactType,
              artifactId: params.artifactId,
              count: versions.length
            });
            
            return versions;
          } catch (error) {
            console.error('Error listing versions:', error);
            return [];
          }
        },
        [params]
      );
    },

    /**
     * Compares two versions of a knowledge artifact
     * @param {Object} params Comparison parameters
     * @returns {Promise<Object>} Comparison result
     */
    async compareVersions(params) {
      return validateAndExecute(
        validation.validateVersionComparison,
        params,
        async () => {
          try {
            const comparison = await core.compareVersions(params);
            
            // Log version comparison
            await logOperation('versions_compared', {
              artifactType: params.artifactType,
              artifactId: params.artifactId,
              baseVersionId: params.baseVersionId,
              baseTimestamp: params.baseTimestamp,
              targetVersionId: params.targetVersionId,
              targetTimestamp: params.targetTimestamp
            });
            
            return comparison;
          } catch (error) {
            console.error('Error comparing versions:', error);
            throw error;
          }
        },
        [params]
      );
    },

    /**
     * Registers a dependency between knowledge artifacts
     * @param {Object} params Dependency parameters
     * @returns {Promise<Object>} Created dependency
     */
    async registerDependency(params) {
      return validateAndExecute(
        validation.validateDependencyRegistration,
        params,
        async () => {
          try {
            const dependency = await core.registerDependency(params);
            
            // Log dependency registration
            await logOperation('dependency_registered', {
              sourceType: params.sourceType,
              sourceId: params.sourceId,
              targetType: params.targetType,
              targetId: params.targetId,
              dependencyType: params.dependencyType,
              strength: params.strength
            });
            
            // Record dependency as system pattern for significant relationships
            if (params.strength === 'high' || params.metadata?.significant) {
              try {
                const patternName = `Dependency: ${params.sourceType}.${params.sourceId} → ${params.targetType}.${params.targetId}`;
                
                await conPortClient.log_system_pattern({
                  workspace_id: workspaceId,
                  name: patternName,
                  description: `${params.dependencyType} dependency between ${params.sourceType}.${params.sourceId} and ${params.targetType}.${params.targetId}`,
                  tags: ['temporal_knowledge', 'dependency', params.dependencyType]
                });
              } catch (error) {
                console.error('Failed to log system pattern for dependency:', error);
                // Non-critical error, continue execution
              }
            }
            
            return dependency;
          } catch (error) {
            console.error('Error registering dependency:', error);
            throw error;
          }
        },
        [params]
      );
    },

    /**
     * Updates lifecycle state of a knowledge artifact
     * @param {Object} params State update parameters
     * @returns {Promise<Object>} Updated state
     */
    async updateLifecycleState(params) {
      return validateAndExecute(
        validation.validateLifecycleStateUpdate,
        params,
        async () => {
          try {
            const stateChange = await core.updateLifecycleState(params);
            
            // Log state change
            await logOperation('lifecycle_state_updated', {
              artifactType: params.artifactType,
              artifactId: params.artifactId,
              state: params.state,
              versionId: params.versionId,
              reason: params.reason
            });
            
            // Record significant state changes as decisions
            const significantStates = ['deprecated', 'archived', 'deleted'];
            if (significantStates.includes(params.state)) {
              await recordOperationDecision({
                operation: `Lifecycle state changed to ${params.state}`,
                artifactType: params.artifactType,
                artifactId: params.artifactId,
                reason: params.reason || `Artifact lifecycle state changed to ${params.state}`
              });
            }
            
            return stateChange;
          } catch (error) {
            console.error('Error updating lifecycle state:', error);
            throw error;
          }
        },
        [params]
      );
    },

    /**
     * Performs impact analysis for a knowledge artifact
     * @param {Object} params Impact analysis parameters
     * @returns {Promise<Object>} Impact analysis results
     */
    async analyzeImpact(params) {
      return validateAndExecute(
        validation.validateImpactAnalysis,
        params,
        async () => {
          try {
            const results = await core.analyzeImpact(params);
            
            // Log impact analysis
            await logOperation('impact_analyzed', {
              artifactType: params.artifactType,
              artifactId: params.artifactId,
              versionId: params.versionId,
              depth: params.depth,
              direction: params.direction,
              affectsCount: results.affects.length,
              affectedByCount: results.affectedBy.length
            });
            
            return results;
          } catch (error) {
            console.error('Error analyzing impact:', error);
            throw error;
          }
        },
        [params]
      );
    },
    
    /**
     * Gets the complete history of an artifact including versions and state changes
     * @param {Object} params History parameters
     * @param {string} params.artifactType Type of artifact
     * @param {string|number} params.artifactId ID of artifact
     * @param {number} [params.limit=10] Maximum number of history items to return
     * @returns {Promise<Object>} Complete artifact history
     */
    async getArtifactHistory(params) {
      const { artifactType, artifactId, limit = 10 } = params;
      
      try {
        // Get versions
        const versions = await this.listVersions({
          artifactType,
          artifactId,
          limit
        });
        
        // Get state changes
        const stateChanges = [];
        try {
          // This is a simplified approach - in a real implementation, we'd query state changes directly
          const indexKey = `${artifactType}_${artifactId}`;
          const index = await conPortClient.get_custom_data({
            workspace_id: workspaceId,
            category: 'temporal_knowledge_indexes',
            key: indexKey
          });
          
          if (index && index.stateHistory) {
            stateChanges.push(...index.stateHistory);
          }
        } catch (error) {
          console.error('Error retrieving state changes:', error);
          // Continue despite error
        }
        
        // Combine and sort all history items by timestamp
        const historyItems = [
          ...versions.map(v => ({
            type: 'version',
            timestamp: v.metadata.createdAt,
            versionId: v.versionId,
            details: v
          })),
          ...stateChanges.map(sc => ({
            type: 'state_change',
            timestamp: sc.timestamp,
            from: sc.from,
            to: sc.to,
            reason: sc.reason,
            details: sc
          }))
        ];
        
        // Sort by timestamp (most recent first)
        historyItems.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        // Apply limit
        const limitedHistory = historyItems.slice(0, limit);
        
        // Log history retrieval
        await logOperation('history_retrieved', {
          artifactType,
          artifactId,
          count: limitedHistory.length
        });
        
        return {
          artifactType,
          artifactId,
          history: limitedHistory
        };
      } catch (error) {
        console.error('Error retrieving artifact history:', error);
        return {
          artifactType,
          artifactId,
          history: [],
          error: error.message
        };
      }
    },
    
    /**
     * Creates a branch from an existing version
     * @param {Object} params Branch parameters
     * @param {string} params.artifactType Type of artifact
     * @param {string|number} params.artifactId ID of artifact
     * @param {string|number} params.baseVersionId Version ID to branch from
     * @param {string} params.branchName Name for the new branch
     * @param {Object} [params.metadata={}] Additional metadata
     * @returns {Promise<Object>} Created branch
     */
    async createBranch(params) {
      const {
        artifactType,
        artifactId,
        baseVersionId,
        branchName,
        metadata = {}
      } = params;
      
      try {
        // Get base version
        const baseVersion = await this.getVersion({
          artifactType,
          artifactId,
          versionId: baseVersionId
        });
        
        if (!baseVersion) {
          throw new Error(`Base version ${baseVersionId} not found`);
        }
        
        // Create branch
        const branchId = `${artifactType}_${artifactId}_branch_${branchName}_${Date.now()}`;
        const branch = {
          branchId,
          artifactType,
          artifactId,
          branchName,
          baseVersionId,
          createdAt: new Date().toISOString(),
          metadata: {
            ...metadata,
            baseVersionCreatedAt: baseVersion.metadata.createdAt
          }
        };
        
        // Store branch in ConPort
        await conPortClient.log_custom_data({
          workspace_id: workspaceId,
          category: 'temporal_knowledge_branches',
          key: branchId,
          value: branch
        });
        
        // Create initial branch version
        const branchVersion = await this.createVersion({
          artifactType,
          artifactId: `${artifactId}_${branchName}`,
          content: baseVersion.content,
          metadata: {
            ...baseVersion.metadata,
            branchId,
            branchName,
            baseVersionId,
            createdAt: new Date().toISOString()
          },
          parentVersionId: baseVersionId,
          tags: [...(baseVersion.tags || []), 'branch', branchName]
        });
        
        // Log branch creation
        await logOperation('branch_created', {
          artifactType,
          artifactId,
          baseVersionId,
          branchId,
          branchName
        });
        
        return {
          branch,
          initialVersion: branchVersion
        };
      } catch (error) {
        console.error('Error creating branch:', error);
        throw error;
      }
    },
    
    /**
     * Lists branches for an artifact
     * @param {Object} params Parameters
     * @param {string} params.artifactType Type of artifact
     * @param {string|number} params.artifactId ID of artifact
     * @returns {Promise<Array<Object>>} List of branches
     */
    async listBranches(params) {
      const { artifactType, artifactId } = params;
      
      try {
        // Get all custom data in the branches category
        const allBranches = await conPortClient.get_custom_data({
          workspace_id: workspaceId,
          category: 'temporal_knowledge_branches'
        });
        
        if (!allBranches) {
          return [];
        }
        
        // Filter branches for this artifact
        const branches = Object.values(allBranches).filter(branch => 
          branch.artifactType === artifactType && branch.artifactId === artifactId
        );
        
        // Log branch listing
        await logOperation('branches_listed', {
          artifactType,
          artifactId,
          count: branches.length
        });
        
        return branches;
      } catch (error) {
        console.error('Error listing branches:', error);
        return [];
      }
    },

    /**
     * Exports temporal knowledge to ConPort custom data
     * @param {Object} params Export parameters
     * @param {string} params.artifactType Type of artifact
     * @param {string|number} params.artifactId ID of artifact
     * @param {string} [params.category='temporal_knowledge_exports'] ConPort category
     * @param {string} [params.key] ConPort key
     * @returns {Promise<Object>} Export result
     */
    async exportToConPort(params) {
      const {
        artifactType,
        artifactId,
        category = 'temporal_knowledge_exports',
        key
      } = params;
      
      try {
        // Get artifact versions
        const versions = await this.listVersions({
          artifactType,
          artifactId,
          limit: 100 // Get up to 100 versions
        });
        
        // Get dependencies
        const dependencies = await this.analyzeImpact({
          artifactType,
          artifactId,
          depth: 1,
          direction: 'both'
        });
        
        // Create export package
        const exportPackage = {
          artifactType,
          artifactId,
          exportedAt: new Date().toISOString(),
          versions,
          dependencies,
          exportFormat: 'temporal_knowledge_v1'
        };
        
        // Generate key if not provided
        const exportKey = key || `${artifactType}_${artifactId}_${Date.now()}`;
        
        // Store in ConPort
        await conPortClient.log_custom_data({
          workspace_id: workspaceId,
          category,
          key: exportKey,
          value: exportPackage
        });
        
        // Log export
        await logOperation('artifact_exported', {
          artifactType,
          artifactId,
          category,
          key: exportKey,
          versionsCount: versions.length
        });
        
        return {
          exported: true,
          artifactType,
          artifactId,
          category,
          key: exportKey
        };
      } catch (error) {
        console.error(`Error exporting ${artifactType} ${artifactId}:`, error);
        throw error;
      }
    }
  };
}

module.exports = {
  createTemporalKnowledge
};