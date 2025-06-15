/**
 * Temporal Knowledge Management Core
 * 
 * This module implements core functionality for temporal knowledge management,
 * including versioning, historical retrieval, and dependency tracking.
 */

/**
 * Creates a temporal knowledge management core
 * @param {Object} options Configuration options
 * @param {string} options.workspaceId ConPort workspace ID
 * @param {Object} options.conPortClient ConPort client instance
 * @returns {Object} Temporal knowledge management methods
 */
function createTemporalKnowledgeCore(options = {}) {
  const { workspaceId, conPortClient } = options;

  /**
   * Creates a new version of a knowledge artifact
   * @param {Object} versionData Version data
   * @returns {Promise<Object>} Created version with metadata
   */
  async function createVersion(versionData) {
    const {
      artifactType,
      artifactId,
      content,
      metadata = {},
      parentVersionId = null,
      tags = []
    } = versionData;

    // Generate version ID
    const versionId = `${artifactType}_${artifactId}_${Date.now()}`;
    
    // Create version object
    const version = {
      versionId,
      artifactType,
      artifactId,
      content,
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString()
      },
      parentVersionId,
      tags,
      lifecycleState: 'active'
    };

    try {
      // Store version in ConPort
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'temporal_knowledge_versions',
        key: versionId,
        value: version
      });

      // Update artifact index for faster lookups
      await updateArtifactIndex(artifactType, artifactId, versionId);
      
      return version;
    } catch (error) {
      console.error('Error creating version:', error);
      throw new Error(`Failed to create version: ${error.message}`);
    }
  }

  /**
   * Updates artifact index for faster version lookups
   * @param {string} artifactType Type of artifact
   * @param {string|number} artifactId ID of artifact
   * @param {string} versionId New version ID to add
   * @returns {Promise<void>}
   */
  async function updateArtifactIndex(artifactType, artifactId, versionId) {
    const indexKey = `${artifactType}_${artifactId}`;
    
    try {
      // Get existing index
      let index = await conPortClient.get_custom_data({
        workspace_id: workspaceId,
        category: 'temporal_knowledge_indexes',
        key: indexKey
      });
      
      if (!index) {
        // Create new index if it doesn't exist
        index = {
          artifactType,
          artifactId,
          versions: [],
          latestVersionId: null,
          lifecycleState: 'active',
          updatedAt: new Date().toISOString()
        };
      }
      
      // Add new version to index
      const timestamp = new Date().toISOString();
      index.versions.push({
        versionId,
        timestamp
      });
      
      // Update latest version ID
      index.latestVersionId = versionId;
      index.updatedAt = timestamp;
      
      // Save updated index
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'temporal_knowledge_indexes',
        key: indexKey,
        value: index
      });
    } catch (error) {
      console.error('Error updating artifact index:', error);
      // Non-critical error, continue execution
    }
  }

  /**
   * Retrieves a specific version of a knowledge artifact
   * @param {Object} params Retrieval parameters
   * @param {string} params.artifactType Type of artifact
   * @param {string|number} params.artifactId ID of artifact
   * @param {string|number} [params.versionId] Specific version ID
   * @param {string|Date} [params.timestamp] Timestamp to retrieve version at
   * @returns {Promise<Object>} Retrieved version
   */
  async function getVersion(params) {
    const { artifactType, artifactId, versionId, timestamp } = params;
    
    try {
      if (versionId) {
        // Retrieve specific version by ID
        return await conPortClient.get_custom_data({
          workspace_id: workspaceId,
          category: 'temporal_knowledge_versions',
          key: versionId
        });
      } else if (timestamp) {
        // Retrieve version closest to timestamp
        const indexKey = `${artifactType}_${artifactId}`;
        const index = await conPortClient.get_custom_data({
          workspace_id: workspaceId,
          category: 'temporal_knowledge_indexes',
          key: indexKey
        });
        
        if (!index || !index.versions || index.versions.length === 0) {
          throw new Error(`No versions found for ${artifactType} ${artifactId}`);
        }
        
        // Convert timestamp to Date object
        const targetDate = timestamp instanceof Date ? timestamp : new Date(timestamp);
        
        // Find version closest to but not after the target timestamp
        let closestVersionId = null;
        let closestTimeDiff = Number.POSITIVE_INFINITY;
        
        for (const version of index.versions) {
          const versionDate = new Date(version.timestamp);
          const timeDiff = targetDate - versionDate;
          
          // Skip versions after the target date
          if (timeDiff < 0) continue;
          
          if (timeDiff < closestTimeDiff) {
            closestTimeDiff = timeDiff;
            closestVersionId = version.versionId;
          }
        }
        
        if (!closestVersionId) {
          throw new Error(`No version found before timestamp ${timestamp}`);
        }
        
        // Retrieve the closest version
        return await conPortClient.get_custom_data({
          workspace_id: workspaceId,
          category: 'temporal_knowledge_versions',
          key: closestVersionId
        });
      } else {
        // If neither versionId nor timestamp provided, get latest version
        const indexKey = `${artifactType}_${artifactId}`;
        const index = await conPortClient.get_custom_data({
          workspace_id: workspaceId,
          category: 'temporal_knowledge_indexes',
          key: indexKey
        });
        
        if (!index || !index.latestVersionId) {
          throw new Error(`No versions found for ${artifactType} ${artifactId}`);
        }
        
        return await conPortClient.get_custom_data({
          workspace_id: workspaceId,
          category: 'temporal_knowledge_versions',
          key: index.latestVersionId
        });
      }
    } catch (error) {
      console.error('Error retrieving version:', error);
      throw new Error(`Failed to retrieve version: ${error.message}`);
    }
  }

  /**
   * Lists versions of a knowledge artifact
   * @param {Object} params Listing parameters
   * @param {string} params.artifactType Type of artifact
   * @param {string|number} params.artifactId ID of artifact
   * @param {number} [params.limit=10] Maximum number of versions to return
   * @param {string|Date} [params.startTimestamp] Start timestamp for filtering
   * @param {string|Date} [params.endTimestamp] End timestamp for filtering
   * @param {string[]} [params.tags] Tags to filter by
   * @returns {Promise<Array<Object>>} List of versions
   */
  async function listVersions(params) {
    const { 
      artifactType, 
      artifactId, 
      limit = 10,
      startTimestamp,
      endTimestamp,
      tags
    } = params;
    
    try {
      // Get artifact index
      const indexKey = `${artifactType}_${artifactId}`;
      const index = await conPortClient.get_custom_data({
        workspace_id: workspaceId,
        category: 'temporal_knowledge_indexes',
        key: indexKey
      });
      
      if (!index || !index.versions || index.versions.length === 0) {
        return [];
      }
      
      // Apply timestamp filters
      let filteredVersions = [...index.versions];
      
      if (startTimestamp) {
        const startDate = startTimestamp instanceof Date ? 
          startTimestamp : new Date(startTimestamp);
        
        filteredVersions = filteredVersions.filter(v => 
          new Date(v.timestamp) >= startDate
        );
      }
      
      if (endTimestamp) {
        const endDate = endTimestamp instanceof Date ? 
          endTimestamp : new Date(endTimestamp);
        
        filteredVersions = filteredVersions.filter(v => 
          new Date(v.timestamp) <= endDate
        );
      }
      
      // Sort by timestamp (most recent first)
      filteredVersions.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      // Apply limit
      filteredVersions = filteredVersions.slice(0, limit);
      
      // Fetch full version objects
      const versionPromises = filteredVersions.map(v => 
        conPortClient.get_custom_data({
          workspace_id: workspaceId,
          category: 'temporal_knowledge_versions',
          key: v.versionId
        })
      );
      
      let versions = await Promise.all(versionPromises);
      
      // Filter null values (in case some versions were not found)
      versions = versions.filter(v => v !== null);
      
      // Apply tag filtering if needed
      if (tags && tags.length > 0) {
        versions = versions.filter(version => {
          if (!version.tags || !Array.isArray(version.tags)) {
            return false;
          }
          
          // Check if version has any of the requested tags
          return tags.some(tag => version.tags.includes(tag));
        });
      }
      
      return versions;
    } catch (error) {
      console.error('Error listing versions:', error);
      return [];
    }
  }

  /**
   * Compares two versions of a knowledge artifact
   * @param {Object} params Comparison parameters
   * @param {string} params.artifactType Type of artifact
   * @param {string|number} params.artifactId ID of artifact
   * @param {string|number} [params.baseVersionId] Base version ID
   * @param {string|Date} [params.baseTimestamp] Base timestamp
   * @param {string|number} [params.targetVersionId] Target version ID
   * @param {string|Date} [params.targetTimestamp] Target timestamp
   * @returns {Promise<Object>} Comparison result
   */
  async function compareVersions(params) {
    const {
      artifactType,
      artifactId,
      baseVersionId,
      baseTimestamp,
      targetVersionId,
      targetTimestamp
    } = params;
    
    try {
      // Retrieve base version
      const baseVersion = await getVersion({
        artifactType,
        artifactId,
        versionId: baseVersionId,
        timestamp: baseTimestamp
      });
      
      // Retrieve target version
      const targetVersion = await getVersion({
        artifactType,
        artifactId,
        versionId: targetVersionId,
        timestamp: targetTimestamp
      });
      
      if (!baseVersion || !targetVersion) {
        throw new Error('Could not retrieve versions for comparison');
      }
      
      // Compare base and target content
      let comparison = {};
      
      // Basic metadata comparison
      comparison.metadataChanges = compareObjects(
        baseVersion.metadata || {},
        targetVersion.metadata || {}
      );
      
      // Tags comparison
      comparison.tagsChanges = {
        added: (targetVersion.tags || []).filter(tag => 
          !(baseVersion.tags || []).includes(tag)
        ),
        removed: (baseVersion.tags || []).filter(tag => 
          !(targetVersion.tags || []).includes(tag)
        )
      };
      
      // Lifecycle state change
      comparison.lifecycleStateChanged = 
        baseVersion.lifecycleState !== targetVersion.lifecycleState;
      
      // Content comparison depends on content type
      if (typeof baseVersion.content === 'object' && typeof targetVersion.content === 'object') {
        // Compare objects
        comparison.contentChanges = compareObjects(baseVersion.content, targetVersion.content);
      } else if (typeof baseVersion.content === 'string' && typeof targetVersion.content === 'string') {
        // Compare strings
        comparison.contentChanges = compareStrings(baseVersion.content, targetVersion.content);
      } else {
        // Simple equality check for other types
        comparison.contentChanged = baseVersion.content !== targetVersion.content;
      }
      
      // Add version metadata
      comparison.baseVersion = {
        versionId: baseVersion.versionId,
        timestamp: baseVersion.metadata.createdAt
      };
      
      comparison.targetVersion = {
        versionId: targetVersion.versionId,
        timestamp: targetVersion.metadata.createdAt
      };
      
      return comparison;
    } catch (error) {
      console.error('Error comparing versions:', error);
      throw new Error(`Failed to compare versions: ${error.message}`);
    }
  }
  
  /**
   * Compares two objects and identifies added, removed, and changed properties
   * @param {Object} baseObj Base object
   * @param {Object} targetObj Target object
   * @returns {Object} Comparison result
   */
  function compareObjects(baseObj, targetObj) {
    const added = [];
    const removed = [];
    const changed = [];
    
    // Find added and changed properties
    for (const key in targetObj) {
      if (!(key in baseObj)) {
        added.push(key);
      } else if (JSON.stringify(baseObj[key]) !== JSON.stringify(targetObj[key])) {
        changed.push(key);
      }
    }
    
    // Find removed properties
    for (const key in baseObj) {
      if (!(key in targetObj)) {
        removed.push(key);
      }
    }
    
    return { added, removed, changed };
  }
  
  /**
   * Compares two strings and provides a simple diff
   * @param {string} baseStr Base string
   * @param {string} targetStr Target string
   * @returns {Object} String comparison result
   */
  function compareStrings(baseStr, targetStr) {
    // Simple string comparison with line counting
    const baseLines = baseStr.split('\n');
    const targetLines = targetStr.split('\n');
    
    // Compute line-level changes
    const added = targetLines.filter(line => !baseLines.includes(line)).length;
    const removed = baseLines.filter(line => !targetLines.includes(line)).length;
    const totalChanges = added + removed;
    
    // Calculate similarity percentage
    const maxLines = Math.max(baseLines.length, targetLines.length);
    const similarity = maxLines > 0 ? 
      (1 - (totalChanges / (maxLines * 2))) * 100 : 100;
    
    return {
      linesAdded: added,
      linesRemoved: removed,
      similarityPercentage: Math.round(similarity),
      lengthChange: targetStr.length - baseStr.length
    };
  }

  /**
   * Registers a dependency between knowledge artifacts
   * @param {Object} params Dependency parameters
   * @param {string} params.sourceType Source artifact type
   * @param {string|number} params.sourceId Source artifact ID
   * @param {string} params.targetType Target artifact type
   * @param {string|number} params.targetId Target artifact ID
   * @param {string} [params.dependencyType='references'] Type of dependency
   * @param {string|number} [params.strength='medium'] Strength of dependency
   * @param {Object} [params.metadata={}] Additional metadata
   * @returns {Promise<Object>} Created dependency
   */
  async function registerDependency(params) {
    const {
      sourceType,
      sourceId,
      targetType,
      targetId,
      dependencyType = 'references',
      strength = 'medium',
      metadata = {}
    } = params;
    
    // Generate dependency ID
    const dependencyId = `${sourceType}_${sourceId}_${dependencyType}_${targetType}_${targetId}`;
    
    // Create dependency object
    const dependency = {
      dependencyId,
      sourceType,
      sourceId,
      targetType,
      targetId,
      dependencyType,
      strength,
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString()
      }
    };
    
    try {
      // Store dependency in ConPort
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'temporal_knowledge_dependencies',
        key: dependencyId,
        value: dependency
      });
      
      // Update dependency indexes for both source and target
      await updateDependencyIndex(sourceType, sourceId, 'outgoing', dependencyId);
      await updateDependencyIndex(targetType, targetId, 'incoming', dependencyId);
      
      return dependency;
    } catch (error) {
      console.error('Error registering dependency:', error);
      throw new Error(`Failed to register dependency: ${error.message}`);
    }
  }
  
  /**
   * Updates dependency index for an artifact
   * @param {string} artifactType Type of artifact
   * @param {string|number} artifactId ID of artifact
   * @param {string} direction 'incoming' or 'outgoing'
   * @param {string} dependencyId Dependency ID to add
   * @returns {Promise<void>}
   */
  async function updateDependencyIndex(artifactType, artifactId, direction, dependencyId) {
    const indexKey = `${artifactType}_${artifactId}_${direction}`;
    
    try {
      // Get existing index
      let index = await conPortClient.get_custom_data({
        workspace_id: workspaceId,
        category: 'temporal_knowledge_dependency_indexes',
        key: indexKey
      });
      
      if (!index) {
        // Create new index if it doesn't exist
        index = {
          artifactType,
          artifactId,
          direction,
          dependencies: [],
          updatedAt: new Date().toISOString()
        };
      }
      
      // Add new dependency to index
      index.dependencies.push({
        dependencyId,
        addedAt: new Date().toISOString()
      });
      
      index.updatedAt = new Date().toISOString();
      
      // Save updated index
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'temporal_knowledge_dependency_indexes',
        key: indexKey,
        value: index
      });
    } catch (error) {
      console.error('Error updating dependency index:', error);
      // Non-critical error, continue execution
    }
  }

  /**
   * Updates lifecycle state of a knowledge artifact
   * @param {Object} params State update parameters
   * @param {string} params.artifactType Type of artifact
   * @param {string|number} params.artifactId ID of artifact
   * @param {string} params.state New lifecycle state
   * @param {string} [params.reason] Reason for state change
   * @param {string|number} [params.versionId] Specific version ID
   * @param {Object} [params.metadata={}] Additional metadata
   * @returns {Promise<Object>} Updated state
   */
  async function updateLifecycleState(params) {
    const {
      artifactType,
      artifactId,
      state,
      reason,
      versionId,
      metadata = {}
    } = params;
    
    try {
      // Update artifact index
      const indexKey = `${artifactType}_${artifactId}`;
      let index = await conPortClient.get_custom_data({
        workspace_id: workspaceId,
        category: 'temporal_knowledge_indexes',
        key: indexKey
      });
      
      if (!index) {
        throw new Error(`Artifact ${artifactType} ${artifactId} not found`);
      }
      
      // Update lifecycle state in index
      index.lifecycleState = state;
      index.updatedAt = new Date().toISOString();
      
      // Add state change metadata
      index.stateHistory = index.stateHistory || [];
      index.stateHistory.push({
        from: index.lifecycleState || 'unknown',
        to: state,
        timestamp: new Date().toISOString(),
        reason,
        ...metadata
      });
      
      // Save updated index
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'temporal_knowledge_indexes',
        key: indexKey,
        value: index
      });
      
      // If versionId provided, update specific version
      if (versionId) {
        const version = await conPortClient.get_custom_data({
          workspace_id: workspaceId,
          category: 'temporal_knowledge_versions',
          key: versionId
        });
        
        if (version) {
          version.lifecycleState = state;
          version.metadata.updatedAt = new Date().toISOString();
          
          // Save updated version
          await conPortClient.log_custom_data({
            workspace_id: workspaceId,
            category: 'temporal_knowledge_versions',
            key: versionId,
            value: version
          });
        }
      }
      
      // Create state change record
      const stateChangeId = `${artifactType}_${artifactId}_state_${Date.now()}`;
      const stateChange = {
        artifactType,
        artifactId,
        from: index.lifecycleState || 'unknown',
        to: state,
        timestamp: new Date().toISOString(),
        reason,
        versionId,
        metadata
      };
      
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'temporal_knowledge_state_changes',
        key: stateChangeId,
        value: stateChange
      });
      
      return stateChange;
    } catch (error) {
      console.error('Error updating lifecycle state:', error);
      throw new Error(`Failed to update lifecycle state: ${error.message}`);
    }
  }

  /**
   * Performs impact analysis for a knowledge artifact
   * @param {Object} params Impact analysis parameters
   * @param {string} params.artifactType Type of artifact
   * @param {string|number} params.artifactId ID of artifact
   * @param {string|number} [params.versionId] Specific version ID
   * @param {number} [params.depth=1] Depth of dependency traversal
   * @param {string} [params.direction='both'] Direction ('upstream', 'downstream', 'both')
   * @returns {Promise<Object>} Impact analysis results
   */
  async function analyzeImpact(params) {
    const {
      artifactType,
      artifactId,
      versionId,
      depth = 1,
      direction = 'both'
    } = params;
    
    try {
      const results = {
        artifact: {
          type: artifactType,
          id: artifactId,
          versionId
        },
        upstream: [],
        downstream: [],
        affectedBy: [],
        affects: []
      };
      
      // Get artifact version for reference
      let artifactVersion;
      try {
        artifactVersion = await getVersion({
          artifactType,
          artifactId,
          versionId
        });
      } catch (error) {
        // Continue even if version not found
        console.warn('Version not found for impact analysis:', error);
      }
      
      if (artifactVersion) {
        results.artifact.version = {
          versionId: artifactVersion.versionId,
          createdAt: artifactVersion.metadata.createdAt,
          lifecycleState: artifactVersion.lifecycleState
        };
      }
      
      // Process upstream dependencies if requested
      if (direction === 'upstream' || direction === 'both') {
        await processUpstreamDependencies(
          artifactType,
          artifactId,
          depth,
          results.upstream,
          results.affectedBy
        );
      }
      
      // Process downstream dependencies if requested
      if (direction === 'downstream' || direction === 'both') {
        await processDownstreamDependencies(
          artifactType,
          artifactId,
          depth,
          results.downstream,
          results.affects
        );
      }
      
      return results;
    } catch (error) {
      console.error('Error performing impact analysis:', error);
      throw new Error(`Failed to perform impact analysis: ${error.message}`);
    }
  }
  
  /**
   * Processes upstream dependencies for impact analysis
   * @param {string} artifactType Type of artifact
   * @param {string|number} artifactId ID of artifact
   * @param {number} depth Remaining depth
   * @param {Array} dependencyChain Array to store dependency chain
   * @param {Array} affectedBy Array to store direct affects
   * @returns {Promise<void>}
   */
  async function processUpstreamDependencies(
    artifactType,
    artifactId,
    depth,
    dependencyChain,
    affectedBy
  ) {
    if (depth <= 0) return;
    
    try {
      // Get incoming dependencies
      const indexKey = `${artifactType}_${artifactId}_incoming`;
      const index = await conPortClient.get_custom_data({
        workspace_id: workspaceId,
        category: 'temporal_knowledge_dependency_indexes',
        key: indexKey
      });
      
      if (!index || !index.dependencies || index.dependencies.length === 0) {
        return;
      }
      
      // Get full dependency objects
      const dependencyPromises = index.dependencies.map(dep => 
        conPortClient.get_custom_data({
          workspace_id: workspaceId,
          category: 'temporal_knowledge_dependencies',
          key: dep.dependencyId
        })
      );
      
      const dependencies = await Promise.all(dependencyPromises);
      
      // Process each dependency
      for (const dependency of dependencies.filter(d => d !== null)) {
        // Add to direct affects
        affectedBy.push({
          artifactType: dependency.sourceType,
          artifactId: dependency.sourceId,
          dependencyType: dependency.dependencyType,
          strength: dependency.strength
        });
        
        // Add to dependency chain
        const chainItem = {
          artifactType: dependency.sourceType,
          artifactId: dependency.sourceId,
          dependencyType: dependency.dependencyType,
          strength: dependency.strength,
          dependencies: []
        };
        
        dependencyChain.push(chainItem);
        
        // Recursively process upstream dependencies
        if (depth > 1) {
          await processUpstreamDependencies(
            dependency.sourceType,
            dependency.sourceId,
            depth - 1,
            chainItem.dependencies,
            affectedBy
          );
        }
      }
    } catch (error) {
      console.error('Error processing upstream dependencies:', error);
      // Continue despite error
    }
  }
  
  /**
   * Processes downstream dependencies for impact analysis
   * @param {string} artifactType Type of artifact
   * @param {string|number} artifactId ID of artifact
   * @param {number} depth Remaining depth
   * @param {Array} dependencyChain Array to store dependency chain
   * @param {Array} affects Array to store direct affects
   * @returns {Promise<void>}
   */
  async function processDownstreamDependencies(
    artifactType,
    artifactId,
    depth,
    dependencyChain,
    affects
  ) {
    if (depth <= 0) return;
    
    try {
      // Get outgoing dependencies
      const indexKey = `${artifactType}_${artifactId}_outgoing`;
      const index = await conPortClient.get_custom_data({
        workspace_id: workspaceId,
        category: 'temporal_knowledge_dependency_indexes',
        key: indexKey
      });
      
      if (!index || !index.dependencies || index.dependencies.length === 0) {
        return;
      }
      
      // Get full dependency objects
      const dependencyPromises = index.dependencies.map(dep => 
        conPortClient.get_custom_data({
          workspace_id: workspaceId,
          category: 'temporal_knowledge_dependencies',
          key: dep.dependencyId
        })
      );
      
      const dependencies = await Promise.all(dependencyPromises);
      
      // Process each dependency
      for (const dependency of dependencies.filter(d => d !== null)) {
        // Add to direct affects
        affects.push({
          artifactType: dependency.targetType,
          artifactId: dependency.targetId,
          dependencyType: dependency.dependencyType,
          strength: dependency.strength
        });
        
        // Add to dependency chain
        const chainItem = {
          artifactType: dependency.targetType,
          artifactId: dependency.targetId,
          dependencyType: dependency.dependencyType,
          strength: dependency.strength,
          dependencies: []
        };
        
        dependencyChain.push(chainItem);
        
        // Recursively process downstream dependencies
        if (depth > 1) {
          await processDownstreamDependencies(
            dependency.targetType,
            dependency.targetId,
            depth - 1,
            chainItem.dependencies,
            affects
          );
        }
      }
    } catch (error) {
      console.error('Error processing downstream dependencies:', error);
      // Continue despite error
    }
  }

  return {
    // Public API
    createVersion,
    getVersion,
    listVersions,
    compareVersions,
    registerDependency,
    updateLifecycleState,
    analyzeImpact
  };
}

module.exports = {
  createTemporalKnowledgeCore
};