/**
 * Advanced Utilities Integration Layer
 * 
 * Integrates knowledge quality enhancement, semantic knowledge graphs,
 * and temporal knowledge management into the cross-mode workflows ecosystem.
 */

const { createKnowledgeQualityCore } = require('./knowledge-quality-enhancement/knowledge-quality-core.js');
const { createSemanticKnowledgeGraph } = require('./semantic-knowledge-graph/semantic-knowledge-graph-core.js');
const { createTemporalKnowledgeCore } = require('./temporal-knowledge-management/temporal-knowledge-core.js');

/**
 * Creates an advanced utilities integration manager
 * @param {Object} options Configuration options
 * @param {string} options.workspaceId ConPort workspace ID
 * @param {Object} options.conPortClient ConPort client instance
 * @param {Object} options.crossModeWorkflows Cross-mode workflows instance
 * @returns {Object} Advanced utilities integration methods
 */
function createAdvancedUtilitiesIntegration(options = {}) {
  const { workspaceId, conPortClient, crossModeWorkflows } = options;

  // Initialize advanced utility cores
  const qualityCore = createKnowledgeQualityCore({
    workspaceId,
    conPortClient
  });

  const semanticGraph = createSemanticKnowledgeGraph({
    workspaceId,
    conPortClient
  });

  const temporalCore = createTemporalKnowledgeCore({
    workspaceId,
    conPortClient
  });

  /**
   * Enhanced workflow execution with advanced utilities
   * @param {Object} workflowDef Workflow definition
   * @param {Object} context Execution context
   * @returns {Promise<Object>} Enhanced execution result
   */
  async function executeEnhancedWorkflow(workflowDef, context) {
    try {
      console.log(`[Advanced Integration] Starting enhanced workflow: ${workflowDef.name}`);

      // Pre-execution quality assessment
      const qualityBaseline = await assessWorkflowQuality(workflowDef, context);
      
      // Pre-execution semantic relationship discovery
      const semanticContext = await discoverSemanticRelationships(context);
      
      // Create temporal snapshot
      const temporalSnapshot = await createTemporalSnapshot(workflowDef, context);

      // Execute the core workflow with enhancements
      const result = await crossModeWorkflows.executeWorkflow(workflowDef, {
        ...context,
        qualityBaseline,
        semanticContext,
        temporalSnapshot,
        enhancementsEnabled: true
      });

      // Post-execution quality enhancement
      const qualityEnhancement = await enhanceWorkflowQuality(result, qualityBaseline);
      
      // Update semantic relationships
      const semanticUpdates = await updateSemanticRelationships(result, semanticContext);
      
      // Create final temporal version
      const temporalVersion = await createTemporalVersion(result, temporalSnapshot);

      return {
        ...result,
        enhancements: {
          quality: qualityEnhancement,
          semantic: semanticUpdates,
          temporal: temporalVersion
        },
        metadata: {
          ...result.metadata,
          advancedUtilitiesApplied: true,
          enhancementTimestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error(`[Advanced Integration] Error in enhanced workflow execution:`, error);
      // Fallback to standard workflow execution
      return await crossModeWorkflows.executeWorkflow(workflowDef, context);
    }
  }

  /**
   * Assesses workflow quality before execution
   * @param {Object} workflowDef Workflow definition
   * @param {Object} context Execution context
   * @returns {Promise<Object>} Quality assessment baseline
   */
  async function assessWorkflowQuality(workflowDef, context) {
    try {
      const assessments = [];

      // Assess input context quality
      if (context.sourceContent) {
        const assessment = await qualityCore.assessQuality({
          artifactType: 'workflow_context',
          artifactId: `${workflowDef.name}_${Date.now()}`,
          qualityDimensions: ['completeness', 'clarity', 'relevance'],
          includeContent: true,
          getArtifact: async () => ({
            content: { text: context.sourceContent },
            metadata: { workflowName: workflowDef.name }
          }),
          getQualityCriteria: async () => getWorkflowQualityCriteria()
        });

        assessments.push(assessment);
      }

      // Assess workflow definition quality
      const workflowAssessment = await qualityCore.assessQuality({
        artifactType: 'workflow_definition',
        artifactId: workflowDef.name,
        qualityDimensions: ['completeness', 'structure', 'clarity'],
        includeContent: false,
        getArtifact: async () => ({
          content: workflowDef,
          metadata: { type: 'workflow_definition' }
        }),
        getQualityCriteria: async () => getWorkflowQualityCriteria()
      });

      assessments.push(workflowAssessment);

      return {
        baseline: true,
        assessments,
        overallScore: Math.round(
          assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length
        ),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in workflow quality assessment:', error);
      return { baseline: false, error: error.message };
    }
  }

  /**
   * Discovers semantic relationships relevant to workflow
   * @param {Object} context Execution context
   * @returns {Promise<Object>} Semantic context with relationships
   */
  async function discoverSemanticRelationships(context) {
    try {
      const relationships = [];

      // Discover relationships for source content
      if (context.sourceType && context.sourceId) {
        const discovered = await semanticGraph.discoverRelationships({
          sourceType: context.sourceType,
          sourceId: context.sourceId,
          targetTypes: ['decision', 'system_pattern', 'custom_data', 'progress_entry'],
          similarityThreshold: 0.3,
          limit: 10
        });

        relationships.push(...discovered);
      }

      // Perform semantic search for workflow context
      if (context.searchQuery || context.conceptQuery) {
        const searchResults = await semanticGraph.semanticSearch({
          conceptQuery: context.searchQuery || context.conceptQuery,
          itemTypes: ['decision', 'system_pattern', 'custom_data'],
          limit: 5
        });

        relationships.push(...searchResults.map(r => ({
          type: 'semantic_match',
          item: r.item,
          relevance: r.relevance,
          matchScore: r.matchScore
        })));
      }

      return {
        discovered: true,
        relationships,
        relationshipCount: relationships.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in semantic relationship discovery:', error);
      return { discovered: false, error: error.message };
    }
  }

  /**
   * Creates temporal snapshot before workflow execution
   * @param {Object} workflowDef Workflow definition
   * @param {Object} context Execution context
   * @returns {Promise<Object>} Temporal snapshot
   */
  async function createTemporalSnapshot(workflowDef, context) {
    try {
      const snapshot = {
        workflowName: workflowDef.name,
        context: { ...context },
        versions: [],
        timestamp: new Date().toISOString()
      };

      // Create snapshots of relevant artifacts
      if (context.sourceType && context.sourceId) {
        try {
          const version = await temporalCore.createVersion({
            artifactType: context.sourceType,
            artifactId: context.sourceId,
            content: context.sourceContent || {},
            metadata: {
              snapshotReason: 'workflow_execution',
              workflowName: workflowDef.name
            },
            tags: ['workflow_snapshot', workflowDef.name]
          });

          snapshot.versions.push(version);
        } catch (versionError) {
          console.warn('Could not create version snapshot:', versionError);
        }
      }

      return snapshot;
    } catch (error) {
      console.error('Error creating temporal snapshot:', error);
      return { created: false, error: error.message };
    }
  }

  /**
   * Enhances workflow quality after execution
   * @param {Object} result Workflow execution result
   * @param {Object} qualityBaseline Quality baseline from pre-execution
   * @returns {Promise<Object>} Quality enhancement results
   */
  async function enhanceWorkflowQuality(result, qualityBaseline) {
    try {
      const enhancements = [];

      // Enhance output artifacts if present
      if (result.artifacts && Array.isArray(result.artifacts)) {
        for (const artifact of result.artifacts) {
          if (artifact.content) {
            const enhancement = await qualityCore.enhanceQuality({
              artifactType: artifact.type || 'workflow_output',
              artifactId: artifact.id || `output_${Date.now()}`,
              enhancementTypes: ['completeness', 'clarity', 'structure'],
              enhancementOptions: {
                completeness: {
                  requiredFields: ['summary', 'description'],
                  defaultValues: { summary: 'Generated by workflow' }
                },
                clarity: {
                  simplifyText: true,
                  reduceJargon: true
                },
                structure: {
                  addTableOfContents: true,
                  addSectionIds: true
                }
              },
              createNewVersion: false,
              getArtifact: async () => ({
                content: artifact.content,
                metadata: artifact.metadata || {}
              }),
              saveArtifact: async (enhanced) => {
                // Update the artifact in place
                Object.assign(artifact, enhanced);
                return { success: true };
              },
              createVersion: async () => ({ versionId: `v_${Date.now()}` })
            });

            enhancements.push(enhancement);
          }
        }
      }

      return {
        applied: enhancements.length > 0,
        enhancements,
        enhancementCount: enhancements.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in workflow quality enhancement:', error);
      return { applied: false, error: error.message };
    }
  }

  /**
   * Updates semantic relationships after workflow execution
   * @param {Object} result Workflow execution result
   * @param {Object} semanticContext Semantic context from pre-execution
   * @returns {Promise<Object>} Semantic update results
   */
  async function updateSemanticRelationships(result, semanticContext) {
    try {
      const updates = [];

      // Create relationships for new artifacts
      if (result.artifacts && Array.isArray(result.artifacts)) {
        for (const artifact of result.artifacts) {
          // Log new artifact in ConPort if it has significant content
          if (artifact.content && artifact.type) {
            try {
              await conPortClient.log_custom_data({
                workspace_id: workspaceId,
                category: 'workflow_artifacts',
                key: artifact.id || `artifact_${Date.now()}`,
                value: artifact
              });

              // Discover relationships for the new artifact
              if (artifact.id) {
                const relationships = await semanticGraph.discoverRelationships({
                  sourceType: 'custom_data',
                  sourceId: `workflow_artifacts:${artifact.id}`,
                  targetTypes: ['decision', 'system_pattern'],
                  similarityThreshold: 0.4,
                  limit: 5
                });

                updates.push(...relationships);
              }
            } catch (relationError) {
              console.warn('Could not update semantic relationships:', relationError);
            }
          }
        }
      }

      return {
        updated: updates.length > 0,
        updates,
        updateCount: updates.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error updating semantic relationships:', error);
      return { updated: false, error: error.message };
    }
  }

  /**
   * Creates temporal version after workflow execution
   * @param {Object} result Workflow execution result
   * @param {Object} temporalSnapshot Temporal snapshot from pre-execution
   * @returns {Promise<Object>} Temporal version results
   */
  async function createTemporalVersion(result, temporalSnapshot) {
    try {
      const versions = [];

      // Create versions for result artifacts
      if (result.artifacts && Array.isArray(result.artifacts)) {
        for (const artifact of result.artifacts) {
          if (artifact.content) {
            try {
              const version = await temporalCore.createVersion({
                artifactType: artifact.type || 'workflow_result',
                artifactId: artifact.id || `result_${Date.now()}`,
                content: artifact.content,
                metadata: {
                  workflowName: result.workflowName,
                  executionId: result.executionId,
                  createdByWorkflow: true
                },
                parentVersionId: temporalSnapshot.versions[0]?.versionId,
                tags: ['workflow_result', result.workflowName]
              });

              versions.push(version);
            } catch (versionError) {
              console.warn('Could not create temporal version:', versionError);
            }
          }
        }
      }

      return {
        created: versions.length > 0,
        versions,
        versionCount: versions.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating temporal versions:', error);
      return { created: false, error: error.message };
    }
  }

  /**
   * Builds comprehensive knowledge graph for workflow context
   * @param {Object} options Graph building options
   * @returns {Promise<Object>} Knowledge graph
   */
  async function buildWorkflowKnowledgeGraph(options) {
    const {
      rootItemType,
      rootItemId,
      depth = 2,
      relationshipTypes
    } = options;

    try {
      const graph = await semanticGraph.buildKnowledgeGraph({
        rootItemType,
        rootItemId,
        depth,
        relationshipTypes
      });

      // Enhance graph with temporal information
      for (const node of graph.nodes) {
        try {
          const versions = await temporalCore.listVersions({
            artifactType: node.type,
            artifactId: node.itemId,
            limit: 3
          });

          node.temporal = {
            versionCount: versions.length,
            latestVersion: versions[0]?.versionId,
            lastModified: versions[0]?.metadata?.createdAt
          };
        } catch (temporalError) {
          // Continue without temporal data
          node.temporal = { available: false };
        }
      }

      return graph;
    } catch (error) {
      console.error('Error building workflow knowledge graph:', error);
      throw error;
    }
  }

  /**
   * Performs comprehensive impact analysis
   * @param {Object} options Impact analysis options
   * @returns {Promise<Object>} Impact analysis results
   */
  async function performComprehensiveImpactAnalysis(options) {
    const {
      artifactType,
      artifactId,
      depth = 2
    } = options;

    try {
      // Get temporal impact analysis
      const temporalImpact = await temporalCore.analyzeImpact({
        artifactType,
        artifactId,
        depth,
        direction: 'both'
      });

      // Get semantic relationships
      const semanticRelationships = await semanticGraph.discoverRelationships({
        sourceType: artifactType,
        sourceId: artifactId,
        similarityThreshold: 0.3,
        limit: 20
      });

      // Get quality assessment
      const qualityAssessment = await qualityCore.assessQuality({
        artifactType,
        artifactId,
        includeContent: false,
        getArtifact: async () => {
          // Try to get artifact from ConPort
          try {
            switch (artifactType) {
              case 'decision':
                const decision = await conPortClient.get_decisions({
                  workspace_id: workspaceId,
                  limit: 1
                });
                return decision[0] || {};
              default:
                return {};
            }
          } catch {
            return {};
          }
        },
        getQualityCriteria: async () => getWorkflowQualityCriteria()
      });

      return {
        temporal: temporalImpact,
        semantic: {
          relationshipCount: semanticRelationships.length,
          relationships: semanticRelationships
        },
        quality: qualityAssessment,
        combinedInsights: {
          totalImpactedItems: temporalImpact.affects.length + temporalImpact.affectedBy.length + semanticRelationships.length,
          qualityScore: qualityAssessment.overallScore,
          riskLevel: calculateRiskLevel(temporalImpact, semanticRelationships, qualityAssessment)
        }
      };
    } catch (error) {
      console.error('Error in comprehensive impact analysis:', error);
      throw error;
    }
  }

  /**
   * Calculates risk level based on impact analysis
   * @param {Object} temporalImpact Temporal impact analysis
   * @param {Array} semanticRelationships Semantic relationships
   * @param {Object} qualityAssessment Quality assessment
   * @returns {string} Risk level ('low', 'medium', 'high', 'critical')
   */
  function calculateRiskLevel(temporalImpact, semanticRelationships, qualityAssessment) {
    let riskScore = 0;

    // Factor in temporal dependencies
    riskScore += (temporalImpact.affects.length + temporalImpact.affectedBy.length) * 2;

    // Factor in semantic relationships
    riskScore += semanticRelationships.length;

    // Factor in quality score (lower quality = higher risk)
    riskScore += (100 - qualityAssessment.overallScore) / 10;

    if (riskScore >= 30) return 'critical';
    if (riskScore >= 20) return 'high';
    if (riskScore >= 10) return 'medium';
    return 'low';
  }

  /**
   * Gets workflow quality criteria
   * @returns {Array<Object>} Quality criteria for workflows
   */
  function getWorkflowQualityCriteria() {
    return [
      {
        dimension: 'completeness',
        weight: 25,
        applicableTypes: ['workflow_context', 'workflow_definition'],
        description: 'Completeness of workflow inputs and definition',
        criteria: {
          requiredFields: ['name', 'steps'],
          minimumLength: 100
        }
      },
      {
        dimension: 'clarity',
        weight: 20,
        applicableTypes: ['workflow_context', 'workflow_definition'],
        description: 'Clarity and understandability of workflow',
        criteria: {
          readabilityLevel: 60,
          technicalJargon: 0.3,
          ambiguityScore: 0.2
        }
      },
      {
        dimension: 'structure',
        weight: 20,
        applicableTypes: ['workflow_definition'],
        description: 'Structural organization of workflow',
        criteria: {
          organization: 70,
          formatting: 60
        }
      },
      {
        dimension: 'relevance',
        weight: 15,
        applicableTypes: ['workflow_context'],
        description: 'Relevance to workflow objectives',
        criteria: {
          contextAlignment: 70,
          targetAudience: 60
        }
      },
      {
        dimension: 'accuracy',
        weight: 20,
        applicableTypes: ['workflow_context', 'workflow_definition'],
        description: 'Accuracy and correctness of workflow information',
        criteria: {
          factualConsistency: true,
          referencedSources: 1
        }
      }
    ];
  }

  return {
    // Core integration methods
    executeEnhancedWorkflow,
    buildWorkflowKnowledgeGraph,
    performComprehensiveImpactAnalysis,

    // Component access
    qualityCore,
    semanticGraph,
    temporalCore,

    // Utility methods
    assessWorkflowQuality,
    discoverSemanticRelationships,
    createTemporalSnapshot,
    enhanceWorkflowQuality,
    updateSemanticRelationships,
    createTemporalVersion
  };
}

module.exports = {
  createAdvancedUtilitiesIntegration
};