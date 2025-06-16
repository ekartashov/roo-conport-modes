/**
 * Knowledge Quality Enhancement System - Integration Layer
 * 
 * This module provides the integration layer for the Knowledge Quality Enhancement System,
 * connecting the core functionality with ConPort and providing a simplified API for
 * assessing and enhancing knowledge quality.
 */

const {
  validateQualityAssessmentOptions,
  validateQualityCriteriaOptions,
  validateQualityEnhancementOptions,
  validateBatchQualityAssessmentOptions,
  validateQualityTrendOptions,
  validateQualityThresholdOptions
} = require('./knowledge-quality-validation');

const {
  assessQuality,
  enhanceQuality,
  analyzeQualityTrend,
  configureQualityThreshold,
  checkThresholdViolations,
  batchAssessQuality
} = require('./knowledge-quality-core');

/**
 * Creates a Knowledge Quality Enhancement System instance
 * @param {Object} options - Initialization options
 * @param {string} options.workspaceId - The ConPort workspace ID
 * @param {Object} options.conPortClient - The ConPort client for data persistence
 * @param {boolean} [options.enableValidation=true] - Whether to enable input validation
 * @param {boolean} [options.strictMode=false] - Whether to use strict validation
 * @returns {Object} The Knowledge Quality Enhancement API
 */
function createKnowledgeQuality(options) {
  if (!options || !options.workspaceId || !options.conPortClient) {
    throw new Error('Required initialization options missing: workspaceId and conPortClient must be provided');
  }

  const { 
    workspaceId, 
    conPortClient, 
    enableValidation = true, 
    strictMode = false 
  } = options;

  /**
   * Gets a knowledge artifact from ConPort
   * @param {Object} options - Retrieval options
   * @returns {Promise<Object>} The knowledge artifact
   */
  async function getArtifact(options) {
    const { artifactType, artifactId, versionId } = options;
    
    // Handle different artifact types
    switch (artifactType) {
      case 'decision': {
        // Get decision from ConPort
        const decision = await conPortClient.get_decisions({
          workspace_id: workspaceId,
          decision_id: parseInt(artifactId, 10)
        });
        
        if (!decision) {
          return null;
        }
        
        // If version ID is specified, get that specific version
        if (versionId) {
          // Get version from temporal_knowledge_versions
          const version = await conPortClient.get_custom_data({
            workspace_id: workspaceId,
            category: 'temporal_knowledge_versions',
            key: versionId
          });
          
          return version || null;
        }
        
        // Otherwise, return the current decision
        return {
          artifactType: 'decision',
          artifactId: decision.id.toString(),
          versionId: `decision_${decision.id}_${new Date(decision.timestamp).getTime()}`,
          content: {
            summary: decision.summary,
            rationale: decision.rationale,
            implementation_details: decision.implementation_details
          },
          metadata: {
            createdAt: decision.timestamp,
            tags: decision.tags || []
          },
          tags: decision.tags || []
        };
      }
      
      case 'system_pattern': {
        // Get system pattern from ConPort
        const pattern = await conPortClient.get_system_patterns({
          workspace_id: workspaceId,
          pattern_id: parseInt(artifactId, 10)
        });
        
        if (!pattern) {
          return null;
        }
        
        // If version ID is specified, get that specific version
        if (versionId) {
          // Get version from temporal_knowledge_versions
          const version = await conPortClient.get_custom_data({
            workspace_id: workspaceId,
            category: 'temporal_knowledge_versions',
            key: versionId
          });
          
          return version || null;
        }
        
        // Otherwise, return the current pattern
        return {
          artifactType: 'system_pattern',
          artifactId: pattern.id.toString(),
          versionId: `system_pattern_${pattern.id}_${new Date(pattern.timestamp || Date.now()).getTime()}`,
          content: {
            name: pattern.name,
            description: pattern.description
          },
          metadata: {
            createdAt: pattern.timestamp || new Date().toISOString(),
            tags: pattern.tags || []
          },
          tags: pattern.tags || []
        };
      }
      
      case 'progress': {
        // Get progress from ConPort
        const progress = await conPortClient.get_progress({
          workspace_id: workspaceId,
          progress_id: parseInt(artifactId, 10)
        });
        
        if (!progress) {
          return null;
        }
        
        // If version ID is specified, get that specific version
        if (versionId) {
          // Get version from temporal_knowledge_versions
          const version = await conPortClient.get_custom_data({
            workspace_id: workspaceId,
            category: 'temporal_knowledge_versions',
            key: versionId
          });
          
          return version || null;
        }
        
        // Otherwise, return the current progress
        return {
          artifactType: 'progress',
          artifactId: progress.id.toString(),
          versionId: `progress_${progress.id}_${new Date(progress.timestamp).getTime()}`,
          content: {
            description: progress.description,
            status: progress.status
          },
          metadata: {
            createdAt: progress.timestamp,
            parent_id: progress.parent_id
          },
          tags: []
        };
      }
      
      default: {
        // For custom data and other types, get from custom data
        let customData;
        
        if (versionId) {
          // Get specific version
          customData = await conPortClient.get_custom_data({
            workspace_id: workspaceId,
            category: 'temporal_knowledge_versions',
            key: versionId
          });
        } else {
          // Get latest version index
          const index = await conPortClient.get_custom_data({
            workspace_id: workspaceId,
            category: 'temporal_knowledge_indexes',
            key: `${artifactType}_${artifactId}`
          });
          
          if (index && index.latestVersionId) {
            // Get latest version
            customData = await conPortClient.get_custom_data({
              workspace_id: workspaceId,
              category: 'temporal_knowledge_versions',
              key: index.latestVersionId
            });
          } else {
            // Try direct lookup
            customData = await conPortClient.get_custom_data({
              workspace_id: workspaceId,
              category: artifactType,
              key: artifactId
            });
            
            if (customData) {
              // Convert to artifact format
              return {
                artifactType,
                artifactId,
                versionId: `${artifactType}_${artifactId}_${Date.now()}`,
                content: customData,
                metadata: {
                  createdAt: new Date().toISOString()
                },
                tags: []
              };
            }
          }
        }
        
        return customData || null;
      }
    }
  }

  /**
   * Gets quality criteria from ConPort
   * @returns {Promise<Array<Object>>} The quality criteria
   */
  async function getQualityCriteria() {
    // Get quality criteria index
    const criteriaIndex = await conPortClient.get_custom_data({
      workspace_id: workspaceId,
      category: 'quality_criteria_index',
      key: 'all_criteria'
    });
    
    if (!criteriaIndex || !criteriaIndex.criteria || !Array.isArray(criteriaIndex.criteria)) {
      // Return default criteria if none found
      return getDefaultQualityCriteria();
    }
    
    // Get each criterion
    const criteria = await Promise.all(
      criteriaIndex.criteria.map(async (criterionId) => {
        const criterion = await conPortClient.get_custom_data({
          workspace_id: workspaceId,
          category: 'quality_criteria',
          key: criterionId
        });
        
        return criterion;
      })
    );
    
    // Filter out null values
    return criteria.filter(criterion => criterion !== null);
  }

  /**
   * Gets default quality criteria
   * @returns {Array<Object>} The default quality criteria
   */
  function getDefaultQualityCriteria() {
    return [
      {
        dimension: 'completeness',
        description: 'Measures whether all required information is present',
        criteria: {
          requiredFields: ['title', 'description'],
          minimumLength: 200
        },
        weight: 80,
        applicableTypes: []
      },
      {
        dimension: 'accuracy',
        description: 'Measures correctness and factual consistency',
        criteria: {
          referencedSources: 2,
          factualConsistency: true
        },
        weight: 90,
        applicableTypes: ['decision', 'system_pattern']
      },
      {
        dimension: 'clarity',
        description: 'Measures how understandable the content is',
        criteria: {
          readabilityLevel: 70,
          technicalJargon: 0.2,
          ambiguityScore: 0.1
        },
        weight: 70,
        applicableTypes: []
      },
      {
        dimension: 'structure',
        description: 'Measures organization and formatting quality',
        criteria: {
          organization: 80,
          formatting: 70,
          navigationAids: 60
        },
        weight: 60,
        applicableTypes: []
      },
      {
        dimension: 'timeliness',
        description: 'Measures recency and update frequency',
        criteria: {
          maxAge: 90,
          updateFrequency: 30
        },
        weight: 50,
        applicableTypes: []
      }
    ];
  }

  /**
   * Saves a quality assessment to ConPort
   * @param {Object} assessment - The quality assessment to save
   * @returns {Promise<Object>} The saved assessment
   */
  async function saveQualityAssessment(assessment) {
    const { artifactType, artifactId, versionId } = assessment;
    const assessmentId = `${artifactType}_${artifactId}_${Date.now()}`;
    
    // Save assessment
    await conPortClient.log_custom_data({
      workspace_id: workspaceId,
      category: 'quality_assessments',
      key: assessmentId,
      value: assessment
    });
    
    // Update quality history index
    const historyKey = `${artifactType}_${artifactId}_history`;
    const historyIndex = await conPortClient.get_custom_data({
      workspace_id: workspaceId,
      category: 'quality_history_index',
      key: historyKey
    }) || { assessments: [] };
    
    historyIndex.assessments.push({
      assessmentId,
      timestamp: assessment.timestamp,
      overallScore: assessment.overallScore
    });
    
    // Sort by timestamp (newest first)
    historyIndex.assessments.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // Limit history size
    if (historyIndex.assessments.length > 100) {
      historyIndex.assessments = historyIndex.assessments.slice(0, 100);
    }
    
    await conPortClient.log_custom_data({
      workspace_id: workspaceId,
      category: 'quality_history_index',
      key: historyKey,
      value: historyIndex
    });
    
    // Update artifact with quality score
    if (versionId) {
      // Get version
      const version = await conPortClient.get_custom_data({
        workspace_id: workspaceId,
        category: 'temporal_knowledge_versions',
        key: versionId
      });
      
      if (version) {
        // Update version metadata
        version.metadata = {
          ...version.metadata,
          qualityScore: assessment.overallScore,
          qualityAssessmentId: assessmentId
        };
        
        await conPortClient.log_custom_data({
          workspace_id: workspaceId,
          category: 'temporal_knowledge_versions',
          key: versionId,
          value: version
        });
      }
    }
    
    return {
      ...assessment,
      assessmentId
    };
  }

  /**
   * Gets quality history for an artifact
   * @param {Object} options - The history options
   * @returns {Promise<Array<Object>>} The quality history
   */
  async function getQualityHistory(options) {
    const { artifactType, artifactId, startDate, endDate } = options;
    
    // Get quality history index
    const historyKey = `${artifactType}_${artifactId}_history`;
    const historyIndex = await conPortClient.get_custom_data({
      workspace_id: workspaceId,
      category: 'quality_history_index',
      key: historyKey
    });
    
    if (!historyIndex || !historyIndex.assessments) {
      return [];
    }
    
    // Filter by date range
    let assessments = historyIndex.assessments;
    
    if (startDate) {
      const startTime = new Date(startDate).getTime();
      assessments = assessments.filter(a => new Date(a.timestamp).getTime() >= startTime);
    }
    
    if (endDate) {
      const endTime = new Date(endDate).getTime();
      assessments = assessments.filter(a => new Date(a.timestamp).getTime() <= endTime);
    }
    
    // Get full assessment data
    const history = await Promise.all(
      assessments.map(async (assessment) => {
        const fullAssessment = await conPortClient.get_custom_data({
          workspace_id: workspaceId,
          category: 'quality_assessments',
          key: assessment.assessmentId
        });
        
        return fullAssessment;
      })
    );
    
    // Filter out null values and sort by timestamp
    return history
      .filter(a => a !== null)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  /**
   * Saves an enhanced artifact to ConPort
   * @param {Object} artifact - The enhanced artifact
   * @returns {Promise<Object>} The saved artifact
   */
  async function saveArtifact(artifact) {
    const { artifactType, artifactId } = artifact;
    
    // Handle different artifact types
    switch (artifactType) {
      case 'decision': {
        // Update decision in ConPort
        const result = await conPortClient.update_decision({
          workspace_id: workspaceId,
          decision_id: parseInt(artifactId, 10),
          summary: artifact.content.summary,
          rationale: artifact.content.rationale,
          implementation_details: artifact.content.implementation_details,
          tags: artifact.tags
        });
        
        return {
          ...artifact,
          versionId: `decision_${artifactId}_${Date.now()}`
        };
      }
      
      case 'system_pattern': {
        // Update system pattern in ConPort
        const result = await conPortClient.update_system_pattern({
          workspace_id: workspaceId,
          pattern_id: parseInt(artifactId, 10),
          name: artifact.content.name,
          description: artifact.content.description,
          tags: artifact.tags
        });
        
        return {
          ...artifact,
          versionId: `system_pattern_${artifactId}_${Date.now()}`
        };
      }
      
      case 'progress': {
        // Update progress in ConPort
        const result = await conPortClient.update_progress({
          workspace_id: workspaceId,
          progress_id: parseInt(artifactId, 10),
          description: artifact.content.description,
          status: artifact.content.status,
          parent_id: artifact.metadata.parent_id
        });
        
        return {
          ...artifact,
          versionId: `progress_${artifactId}_${Date.now()}`
        };
      }
      
      default: {
        // For custom data, store directly
        await conPortClient.log_custom_data({
          workspace_id: workspaceId,
          category: artifactType,
          key: artifactId,
          value: artifact.content
        });
        
        return {
          ...artifact,
          versionId: `${artifactType}_${artifactId}_${Date.now()}`
        };
      }
    }
  }

  /**
   * Creates a new version of an artifact
   * @param {Object} options - The version creation options
   * @returns {Promise<Object>} The created version
   */
  async function createVersion(options) {
    const { artifactType, artifactId, content, metadata, parentVersionId, tags } = options;
    
    // Generate version ID
    const timestamp = Date.now();
    const versionId = `${artifactType}_${artifactId}_${timestamp}`;
    
    // Create version
    const version = {
      versionId,
      artifactType,
      artifactId,
      content,
      metadata: {
        ...metadata,
        createdAt: metadata.createdAt || new Date().toISOString()
      },
      parentVersionId,
      tags: tags || [],
      lifecycleState: 'active'
    };
    
    // Save version
    await conPortClient.log_custom_data({
      workspace_id: workspaceId,
      category: 'temporal_knowledge_versions',
      key: versionId,
      value: version
    });
    
    // Update index
    const indexKey = `${artifactType}_${artifactId}`;
    const index = await conPortClient.get_custom_data({
      workspace_id: workspaceId,
      category: 'temporal_knowledge_indexes',
      key: indexKey
    }) || { artifactType, artifactId, versions: [] };
    
    index.versions = index.versions || [];
    index.versions.push({
      versionId,
      timestamp: version.metadata.createdAt
    });
    
    // Sort by timestamp (newest first)
    index.versions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    index.latestVersionId = index.versions[0].versionId;
    index.updatedAt = new Date().toISOString();
    
    await conPortClient.log_custom_data({
      workspace_id: workspaceId,
      category: 'temporal_knowledge_indexes',
      key: indexKey,
      value: index
    });
    
    return version;
  }

  /**
   * Saves a quality threshold configuration
   * @param {Object} threshold - The threshold configuration
   * @returns {Promise<Object>} The saved threshold
   */
  async function saveThreshold(threshold) {
    const { dimension } = threshold;
    const thresholdId = `threshold_${dimension}_${Date.now()}`;
    
    // Save threshold
    await conPortClient.log_custom_data({
      workspace_id: workspaceId,
      category: 'quality_thresholds',
      key: thresholdId,
      value: {
        ...threshold,
        id: thresholdId
      }
    });
    
    // Update threshold index
    const thresholdIndex = await conPortClient.get_custom_data({
      workspace_id: workspaceId,
      category: 'quality_threshold_index',
      key: 'all_thresholds'
    }) || { thresholds: {} };
    
    thresholdIndex.thresholds[dimension] = thresholdId;
    thresholdIndex.updatedAt = new Date().toISOString();
    
    await conPortClient.log_custom_data({
      workspace_id: workspaceId,
      category: 'quality_threshold_index',
      key: 'all_thresholds',
      value: thresholdIndex
    });
    
    return {
      ...threshold,
      id: thresholdId
    };
  }

  /**
   * Gets all quality thresholds
   * @returns {Promise<Array<Object>>} The quality thresholds
   */
  async function getThresholds() {
    // Get threshold index
    const thresholdIndex = await conPortClient.get_custom_data({
      workspace_id: workspaceId,
      category: 'quality_threshold_index',
      key: 'all_thresholds'
    });
    
    if (!thresholdIndex || !thresholdIndex.thresholds) {
      return [];
    }
    
    // Get each threshold
    const thresholds = await Promise.all(
      Object.values(thresholdIndex.thresholds).map(async (thresholdId) => {
        const threshold = await conPortClient.get_custom_data({
          workspace_id: workspaceId,
          category: 'quality_thresholds',
          key: thresholdId
        });
        
        return threshold;
      })
    );
    
    // Filter out null values
    return thresholds.filter(threshold => threshold !== null);
  }

  /**
   * Assesses the quality of a knowledge artifact
   * @param {Object} options - The assessment options
   * @returns {Promise<Object>} The quality assessment
   */
  async function assessArtifactQuality(options) {
    // Validate options
    const validatedOptions = enableValidation ? 
      validateQualityAssessmentOptions(options) : options;
    
    // Assess quality
    const assessment = await assessQuality({
      ...validatedOptions,
      getArtifact,
      getQualityCriteria
    });
    
    // Save assessment
    const savedAssessment = await saveQualityAssessment(assessment);
    
    // Check threshold violations
    const thresholds = await getThresholds();
    const violations = checkThresholdViolations(assessment, thresholds);
    
    if (violations.length > 0) {
      savedAssessment.thresholdViolations = violations;
      
      // Log violations
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'quality_violations',
        key: `${savedAssessment.assessmentId}_violations`,
        value: {
          assessmentId: savedAssessment.assessmentId,
          artifactType: savedAssessment.artifactType,
          artifactId: savedAssessment.artifactId,
          violations,
          timestamp: new Date().toISOString()
        }
      });
      
      // Update active context with violations
      try {
        const activeContext = await conPortClient.get_active_context({
          workspace_id: workspaceId
        });
        
        if (activeContext) {
          const openIssues = activeContext.open_issues || [];
          
          violations.forEach(violation => {
            if (violation.alertLevel === 'error' || violation.alertLevel === 'warning') {
              openIssues.push({
                type: 'quality_violation',
                description: `Quality issue in ${savedAssessment.artifactType}:${savedAssessment.artifactId} - ${violation.dimension} score (${violation.actual}) below threshold (${violation.threshold})`,
                level: violation.alertLevel,
                timestamp: new Date().toISOString()
              });
            }
          });
          
          await conPortClient.update_active_context({
            workspace_id: workspaceId,
            patch_content: {
              open_issues: openIssues
            }
          });
        }
      } catch (error) {
        // Log error but continue
        console.error('Failed to update active context with violations:', error);
      }
    }
    
    return savedAssessment;
  }

  /**
   * Enhances the quality of a knowledge artifact
   * @param {Object} options - The enhancement options
   * @returns {Promise<Object>} The enhancement result
   */
  async function enhanceArtifactQuality(options) {
    // Validate options
    const validatedOptions = enableValidation ? 
      validateQualityEnhancementOptions(options) : options;
    
    // Enhance quality
    const result = await enhanceQuality({
      ...validatedOptions,
      getArtifact,
      saveArtifact,
      createVersion
    });
    
    // Log enhancement in ConPort
    await conPortClient.log_custom_data({
      workspace_id: workspaceId,
      category: 'quality_enhancements',
      key: `${result.enhancedVersionId}_enhancement`,
      value: result
    });
    
    // Log decision
    await conPortClient.log_decision({
      workspace_id: workspaceId,
      summary: `Enhanced quality of ${result.artifactType}:${result.artifactId}`,
      rationale: `Applied quality enhancements: ${result.appliedEnhancements.map(e => e.type).join(', ')}`,
      tags: ['quality-enhancement', result.artifactType]
    });
    
    return result;
  }

  /**
   * Analyzes quality trends for an artifact
   * @param {Object} options - The trend analysis options
   * @returns {Promise<Object>} The trend analysis
   */
  async function analyzeArtifactQualityTrend(options) {
    // Validate options
    const validatedOptions = enableValidation ? 
      validateQualityTrendOptions(options) : options;
    
    // Analyze trend
    const trendAnalysis = await analyzeQualityTrend({
      ...validatedOptions,
      getQualityHistory
    });
    
    // Save trend analysis
    await conPortClient.log_custom_data({
      workspace_id: workspaceId,
      category: 'quality_trend_analyses',
      key: `${validatedOptions.artifactType}_${validatedOptions.artifactId}_trend_${Date.now()}`,
      value: trendAnalysis
    });
    
    return trendAnalysis;
  }

  /**
   * Defines quality criteria for assessment
   * @param {Object} options - The criteria options
   * @returns {Promise<Object>} The saved criteria
   */
  async function defineQualityCriteria(options) {
    // Validate options
    const validatedOptions = enableValidation ? 
      validateQualityCriteriaOptions(options) : options;
    
    const { dimension } = validatedOptions;
    const criterionId = `criterion_${dimension}_${Date.now()}`;
    
    // Save criterion
    await conPortClient.log_custom_data({
      workspace_id: workspaceId,
      category: 'quality_criteria',
      key: criterionId,
      value: {
        ...validatedOptions,
        id: criterionId
      }
    });
    
    // Update criteria index
    const criteriaIndex = await conPortClient.get_custom_data({
      workspace_id: workspaceId,
      category: 'quality_criteria_index',
      key: 'all_criteria'
    }) || { criteria: [] };
    
    criteriaIndex.criteria = criteriaIndex.criteria || [];
    criteriaIndex.criteria.push(criterionId);
    criteriaIndex.updatedAt = new Date().toISOString();
    
    await conPortClient.log_custom_data({
      workspace_id: workspaceId,
      category: 'quality_criteria_index',
      key: 'all_criteria',
      value: criteriaIndex
    });
    
    return {
      ...validatedOptions,
      id: criterionId
    };
  }

  /**
   * Sets a quality threshold for alerts
   * @param {Object} options - The threshold options
   * @returns {Promise<Object>} The threshold configuration
   */
  async function setQualityThreshold(options) {
    // Validate options
    const validatedOptions = enableValidation ? 
      validateQualityThresholdOptions(options) : options;
    
    // Configure threshold
    const thresholdConfig = await configureQualityThreshold({
      ...validatedOptions,
      saveThreshold
    });
    
    // Log decision
    await conPortClient.log_decision({
      workspace_id: workspaceId,
      summary: `Set quality threshold for ${validatedOptions.dimension}`,
      rationale: `Configured quality threshold of ${validatedOptions.threshold} for ${validatedOptions.dimension} dimension with alert level ${validatedOptions.alertLevel}`,
      tags: ['quality-threshold']
    });
    
    return thresholdConfig;
  }

  /**
   * Performs batch quality assessment on multiple artifacts
   * @param {Object} options - The batch assessment options
   * @returns {Promise<Object>} The batch assessment result
   */
  async function batchAssessArtifactQuality(options) {
    // Validate options
    const validatedOptions = enableValidation ? 
      validateBatchQualityAssessmentOptions(options) : options;
    
    // Perform batch assessment
    const batchResult = await batchAssessQuality({
      ...validatedOptions,
      assessQuality: assessArtifactQuality
    });
    
    // Save batch result
    await conPortClient.log_custom_data({
      workspace_id: workspaceId,
      category: 'quality_batch_assessments',
      key: `batch_assessment_${Date.now()}`,
      value: batchResult
    });
    
    // Log progress
    await conPortClient.log_progress({
      workspace_id: workspaceId,
      description: `Batch quality assessment of ${batchResult.totalAssessed} artifacts`,
      status: 'DONE'
    });
    
    return batchResult;
  }

  /**
   * Identifies high-priority quality issues across the knowledge base
   * @param {Object} [options] - Optional filter options
   * @returns {Promise<Object>} The quality issues report
   */
  async function identifyQualityIssues(options = {}) {
    const { 
      artifactTypes = [], 
      minimumSeverity = 'warning',
      limit = 50
    } = options;
    
    // Get recent quality violations
    const violationsKey = 'quality_violations';
    const violations = [];
    
    // This is a simplified implementation
    // In a real system, we would need pagination and better filtering
    const violationsList = await conPortClient.get_custom_data({
      workspace_id: workspaceId,
      category: 'quality_violations'
    });
    
    if (violationsList) {
      for (const key of Object.keys(violationsList).slice(0, 100)) {
        const violation = await conPortClient.get_custom_data({
          workspace_id: workspaceId,
          category: 'quality_violations',
          key
        });
        
        if (violation) {
          violations.push(violation);
        }
      }
    }
    
    // Filter violations
    const severityLevels = ['info', 'warning', 'error'];
    const minimumSeverityIndex = severityLevels.indexOf(minimumSeverity);
    
    const filteredViolations = violations
      .filter(v => {
        // Filter by artifact type
        if (artifactTypes.length > 0 && !artifactTypes.includes(v.artifactType)) {
          return false;
        }
        
        // Filter by severity
        const hasSevereViolation = v.violations.some(violation => {
          const severityIndex = severityLevels.indexOf(violation.alertLevel);
          return severityIndex >= minimumSeverityIndex;
        });
        
        return hasSevereViolation;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    
    // Group by artifact type
    const issuesByType = {};
    
    for (const violation of filteredViolations) {
      if (!issuesByType[violation.artifactType]) {
        issuesByType[violation.artifactType] = [];
      }
      
      issuesByType[violation.artifactType].push({
        artifactId: violation.artifactId,
        timestamp: violation.timestamp,
        violations: violation.violations
      });
    }
    
    // Generate report
    const report = {
      totalIssues: filteredViolations.length,
      issuesByType,
      timestamp: new Date().toISOString(),
      filters: {
        artifactTypes,
        minimumSeverity
      }
    };
    
    // Save report
    await conPortClient.log_custom_data({
      workspace_id: workspaceId,
      category: 'quality_issue_reports',
      key: `quality_issues_${Date.now()}`,
      value: report
    });
    
    return report;
  }

  /**
   * Generates a knowledge quality report for the workspace
   * @param {Object} [options] - Optional report options
   * @returns {Promise<Object>} The quality report
   */
  async function generateQualityReport(options = {}) {
    const {
      artifactTypes = ['decision', 'system_pattern', 'document'],
      includeDetails = false,
      includeTrends = true,
      sampleSize = 50
    } = options;
    
    // Get a sample of artifacts from each type
    const artifacts = [];
    
    for (const artifactType of artifactTypes) {
      try {
        let artifactIds = [];
        
        switch (artifactType) {
          case 'decision': {
            const decisions = await conPortClient.get_decisions({
              workspace_id: workspaceId,
              limit: sampleSize
            });
            
            if (decisions && Array.isArray(decisions)) {
              artifactIds = decisions.map(d => d.id.toString());
            }
            break;
          }
          
          case 'system_pattern': {
            const patterns = await conPortClient.get_system_patterns({
              workspace_id: workspaceId
            });
            
            if (patterns && Array.isArray(patterns)) {
              artifactIds = patterns.map(p => p.id.toString());
            }
            break;
          }
          
          default: {
            // For other types, try to get from temporal knowledge indexes
            const indexes = await conPortClient.get_custom_data({
              workspace_id: workspaceId,
              category: 'temporal_knowledge_indexes'
            });
            
            if (indexes) {
              artifactIds = Object.keys(indexes)
                .filter(key => key.startsWith(`${artifactType}_`))
                .map(key => key.substring(artifactType.length + 1))
                .slice(0, sampleSize);
            }
          }
        }
        
        // Add artifacts to list
        for (const artifactId of artifactIds) {
          artifacts.push({
            artifactType,
            artifactId
          });
        }
      } catch (error) {
        console.error(`Error getting artifacts of type ${artifactType}:`, error);
      }
    }
    
    // Perform batch assessment
    const batchResult = await batchAssessArtifactQuality({
      artifacts,
      includeContent: false
    });
    
    // Get quality thresholds
    const thresholds = await getThresholds();
    
    // Generate report
    const report = {
      workspaceId,
      timestamp: new Date().toISOString(),
      summary: {
        totalArtifacts: batchResult.totalAssessed,
        averageQuality: batchResult.averageOverallScore,
        highQualityCount: batchResult.highQualityArtifacts.length,
        lowQualityCount: batchResult.lowQualityArtifacts.length,
        qualityRating: getQualityRating(batchResult.averageOverallScore)
      },
      artifactTypes: {}
    };
    
    // Group by artifact type
    for (const artifactType of artifactTypes) {
      const typeResults = batchResult.results.filter(r => r.artifactType === artifactType);
      
      if (typeResults.length > 0) {
        const typeScores = typeResults.map(r => r.overallScore);
        const averageScore = Math.round(typeScores.reduce((sum, score) => sum + score, 0) / typeScores.length);
        
        report.artifactTypes[artifactType] = {
          count: typeResults.length,
          averageScore,
          qualityRating: getQualityRating(averageScore)
        };
        
        // Add dimension scores
        const dimensionScores = {};
        
        for (const result of typeResults) {
          for (const dimension of result.dimensionScores) {
            if (!dimensionScores[dimension.dimension]) {
              dimensionScores[dimension.dimension] = [];
            }
            
            dimensionScores[dimension.dimension].push(dimension.score);
          }
        }
        
        report.artifactTypes[artifactType].dimensionScores = {};
        
        for (const [dimension, scores] of Object.entries(dimensionScores)) {
          const averageDimensionScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
          
          report.artifactTypes[artifactType].dimensionScores[dimension] = {
            averageScore: averageDimensionScore,
            sampleSize: scores.length
          };
          
          // Add threshold status
          const dimensionThreshold = thresholds.find(t => t.dimension === dimension);
          
          if (dimensionThreshold) {
            report.artifactTypes[artifactType].dimensionScores[dimension].threshold = dimensionThreshold.threshold;
            report.artifactTypes[artifactType].dimensionScores[dimension].status = 
              averageDimensionScore >= dimensionThreshold.threshold ? 'pass' : 'fail';
          }
        }
      }
    }
    
    // Add trends if requested
    if (includeTrends) {
      try {
        report.trends = {};
        
        // Get historical data
        const batchReports = await conPortClient.get_custom_data({
          workspace_id: workspaceId,
          category: 'quality_batch_assessments'
        });
        
        if (batchReports) {
          const reports = [];
          
          // Get the last 10 reports
          const reportKeys = Object.keys(batchReports)
            .sort((a, b) => {
              const aTime = parseInt(a.split('_').pop(), 10);
              const bTime = parseInt(b.split('_').pop(), 10);
              return bTime - aTime;
            })
            .slice(0, 10);
          
          for (const key of reportKeys) {
            const report = await conPortClient.get_custom_data({
              workspace_id: workspaceId,
              category: 'quality_batch_assessments',
              key
            });
            
            if (report) {
              reports.push({
                timestamp: report.timestamp,
                averageOverallScore: report.averageOverallScore,
                totalAssessed: report.totalAssessed,
                highQualityCount: report.highQualityArtifacts.length,
                lowQualityCount: report.lowQualityArtifacts.length
              });
            }
          }
          
          // Sort by timestamp
          reports.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          
          report.trends.historical = reports;
          
          // Calculate trend direction
          if (reports.length >= 2) {
            const firstScore = reports[0].averageOverallScore;
            const lastScore = reports[reports.length - 1].averageOverallScore;
            
            report.trends.direction = lastScore > firstScore ? 'improving' : lastScore < firstScore ? 'declining' : 'stable';
            report.trends.change = lastScore - firstScore;
          }
        }
      } catch (error) {
        console.error('Error generating trend data:', error);
      }
    }
    
    // Add details if requested
    if (includeDetails) {
      report.details = {
        highQualityArtifacts: batchResult.highQualityArtifacts,
        lowQualityArtifacts: batchResult.lowQualityArtifacts
      };
      
      // Get quality issues
      try {
        const issues = await identifyQualityIssues({
          artifactTypes,
          minimumSeverity: 'warning',
          limit: 20
        });
        
        report.details.qualityIssues = issues;
      } catch (error) {
        console.error('Error identifying quality issues:', error);
      }
    }
    
    // Save report
    await conPortClient.log_custom_data({
      workspace_id: workspaceId,
      category: 'quality_reports',
      key: `quality_report_${Date.now()}`,
      value: report
    });
    
    // Update product context with quality status
    try {
      await conPortClient.update_product_context({
        workspace_id: workspaceId,
        patch_content: {
          quality_status: {
            overallScore: report.summary.averageQuality,
            rating: report.summary.qualityRating,
            lastUpdated: report.timestamp
          }
        }
      });
    } catch (error) {
      console.error('Error updating product context:', error);
    }
    
    return report;
  }

  /**
   * Gets a quality rating based on score
   * @param {number} score - The quality score
   * @returns {string} The quality rating
   */
  function getQualityRating(score) {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'satisfactory';
    if (score >= 60) return 'needs improvement';
    if (score >= 50) return 'poor';
    return 'inadequate';
  }

  // Create and return the public API
  return {
    // Quality assessment
    assessQuality: assessArtifactQuality,
    batchAssessQuality: batchAssessArtifactQuality,
    
    // Quality enhancement
    enhanceQuality: enhanceArtifactQuality,
    
    // Quality criteria
    defineQualityCriteria,
    getQualityCriteria,
    
    // Threshold management
    setQualityThreshold,
    getThresholds,
    
    // Analysis and reporting
    analyzeQualityTrend: analyzeArtifactQualityTrend,
    identifyQualityIssues,
    generateQualityReport,
    
    // Internal functions (exposed for testing)
    _internal: {
      getArtifact,
      saveArtifact,
      createVersion,
      getQualityHistory,
      saveQualityAssessment,
      checkThresholdViolations
    }
  };
}

module.exports = {
  createKnowledgeQuality
};