/**
 * Strategic Insight Validation System (SIVS) - Integration Layer
 * 
 * This module provides integration capabilities for the SIVS system,
 * connecting it with ConPort and other Phase 4 components.
 */

const { StrategicInsightValidator, ValidationContext } = require('./sivs-core');

/**
 * ConPortSIVSIntegration provides integration between SIVS and ConPort
 */
class ConPortSIVSIntegration {
  /**
   * Creates a new ConPortSIVSIntegration
   * @param {Object} conportClient - ConPort client instance
   * @param {Object} config - Configuration options
   */
  constructor(conportClient, config = {}) {
    this.conportClient = conportClient;
    this.config = {
      validationCategoryPrefix: config.validationCategoryPrefix || 'validation_results',
      validationHistoryLimit: config.validationHistoryLimit || 10,
      autoSaveResults: config.autoSaveResults !== undefined ? config.autoSaveResults : true,
      ...config
    };
    this.validator = new StrategicInsightValidator(config.validator || {});
  }

  /**
   * Initializes the integration with ConPort context
   * @param {string} workspaceId - ConPort workspace ID
   * @returns {Promise<ConPortSIVSIntegration>} This integration instance
   */
  async initialize(workspaceId) {
    this.workspaceId = workspaceId;
    
    try {
      // Load product context from ConPort
      const productContext = await this.conportClient.getProductContext({
        workspace_id: workspaceId
      });
      
      // Load active context from ConPort
      const activeContext = await this.conportClient.getActiveContext({
        workspace_id: workspaceId
      });
      
      // Create validation context from ConPort contexts
      const validationContext = ValidationContext.fromProductContext(productContext);
      validationContext.enhanceWithActiveContext(activeContext);
      
      // Set the context in the validator
      this.validator.setContext(validationContext);
      
      return this;
    } catch (error) {
      console.error('Failed to initialize SIVS with ConPort context:', error);
      throw error;
    }
  }

  /**
   * Validates a ConPort item
   * @param {string} itemType - Type of ConPort item
   * @param {string|number} itemId - ID of ConPort item
   * @returns {Promise<Object>} Validation results
   */
  async validateConPortItem(itemType, itemId) {
    try {
      // Retrieve item from ConPort
      let item;
      
      switch (itemType) {
        case 'decision':
          const decisions = await this.conportClient.getDecisions({
            workspace_id: this.workspaceId,
            decision_id: itemId
          });
          item = decisions[0];
          break;
        
        case 'system_pattern':
          const patterns = await this.conportClient.getSystemPatterns({
            workspace_id: this.workspaceId,
            pattern_id: itemId
          });
          item = patterns[0];
          break;
        
        case 'custom_data':
          // For custom data, itemId should be in the format "category:key"
          const [category, key] = itemId.split(':');
          const customData = await this.conportClient.getCustomData({
            workspace_id: this.workspaceId,
            category,
            key
          });
          item = {
            type: 'custom_data',
            category,
            key,
            content: typeof customData.value === 'string' ? 
              customData.value : JSON.stringify(customData.value)
          };
          break;
        
        default:
          throw new Error(`Unsupported ConPort item type: ${itemType}`);
      }
      
      if (!item) {
        throw new Error(`Item not found: ${itemType} ${itemId}`);
      }
      
      // Transform ConPort item to insight format
      const insight = this.transformConPortItemToInsight(item, itemType);
      
      // Validate the insight
      const validationResults = this.validator.validate(insight);
      
      // Optionally save validation results to ConPort
      if (this.config.autoSaveResults) {
        await this.saveValidationResults(itemType, itemId, validationResults);
      }
      
      return validationResults;
    } catch (error) {
      console.error(`Failed to validate ConPort item ${itemType} ${itemId}:`, error);
      throw error;
    }
  }

  /**
   * Transforms a ConPort item to insight format for validation
   * @param {Object} item - ConPort item
   * @param {string} itemType - Type of ConPort item
   * @returns {Object} Insight object for validation
   */
  transformConPortItemToInsight(item, itemType) {
    // Basic insight structure
    const insight = {
      type: itemType,
      content: '',
      timestamp: new Date().toISOString()
    };
    
    // Map fields based on item type
    switch (itemType) {
      case 'decision':
        insight.content = item.summary + 
          (item.rationale ? '\n\n' + item.rationale : '');
        insight.tags = item.tags || [];
        insight.author = item.author;
        insight.timestamp = item.timestamp || insight.timestamp;
        break;
      
      case 'system_pattern':
        insight.content = item.description || '';
        insight.tags = item.tags || [];
        insight.name = item.name;
        break;
      
      case 'custom_data':
        insight.content = typeof item.content === 'string' ? 
          item.content : JSON.stringify(item.content);
        insight.category = item.category;
        insight.key = item.key;
        break;
      
      default:
        // Generic mapping
        if (item.content) insight.content = item.content;
        if (item.tags) insight.tags = item.tags;
    }
    
    return insight;
  }

  /**
   * Saves validation results to ConPort
   * @param {string} itemType - Type of validated item
   * @param {string|number} itemId - ID of validated item
   * @param {Object} results - Validation results
   * @returns {Promise<Object>} Saved custom data entry
   */
  async saveValidationResults(itemType, itemId, results) {
    try {
      const category = `${this.config.validationCategoryPrefix}_${itemType}`;
      const key = `${itemId}_${new Date().toISOString()}`;
      
      // Save validation results as custom data
      const savedData = await this.conportClient.logCustomData({
        workspace_id: this.workspaceId,
        category,
        key,
        value: {
          itemType,
          itemId,
          validationResults: results,
          timestamp: new Date().toISOString()
        }
      });
      
      // Create a link between the validated item and validation results
      await this.conportClient.linkConPortItems({
        workspace_id: this.workspaceId,
        source_item_type: itemType,
        source_item_id: String(itemId),
        target_item_type: 'custom_data',
        target_item_id: `${category}:${key}`,
        relationship_type: 'has_validation',
        description: `Validation performed on ${new Date().toISOString()}`
      });
      
      // Prune old validation results if needed
      await this.pruneValidationHistory(itemType, itemId);
      
      return savedData;
    } catch (error) {
      console.error(`Failed to save validation results for ${itemType} ${itemId}:`, error);
      throw error;
    }
  }

  /**
   * Prunes old validation results to maintain history limit
   * @param {string} itemType - Type of validated item
   * @param {string|number} itemId - ID of validated item
   * @returns {Promise<void>}
   */
  async pruneValidationHistory(itemType, itemId) {
    try {
      // Get linked validation results for this item
      const linkedItems = await this.conportClient.getLinkedItems({
        workspace_id: this.workspaceId,
        item_type: itemType,
        item_id: String(itemId),
        relationship_type_filter: 'has_validation',
        linked_item_type_filter: 'custom_data'
      });
      
      // If we have more results than the limit, delete the oldest ones
      if (linkedItems.length > this.config.validationHistoryLimit) {
        // Sort by timestamp (assuming it's part of the custom_data key)
        linkedItems.sort((a, b) => {
          const aTime = a.target_item_id.split('_').pop();
          const bTime = b.target_item_id.split('_').pop();
          return new Date(aTime) - new Date(bTime);
        });
        
        // Delete oldest entries beyond the limit
        const toDelete = linkedItems.slice(0, linkedItems.length - this.config.validationHistoryLimit);
        
        for (const item of toDelete) {
          const [category, key] = item.target_item_id.split(':');
          await this.conportClient.deleteCustomData({
            workspace_id: this.workspaceId,
            category,
            key
          });
        }
      }
    } catch (error) {
      console.error(`Failed to prune validation history for ${itemType} ${itemId}:`, error);
      // Non-critical error, so we don't throw
    }
  }

  /**
   * Gets the latest validation results for a ConPort item
   * @param {string} itemType - Type of ConPort item
   * @param {string|number} itemId - ID of ConPort item
   * @returns {Promise<Object|null>} Latest validation results or null if none
   */
  async getLatestValidationResults(itemType, itemId) {
    try {
      // Get linked validation results for this item
      const linkedItems = await this.conportClient.getLinkedItems({
        workspace_id: this.workspaceId,
        item_type: itemType,
        item_id: String(itemId),
        relationship_type_filter: 'has_validation',
        linked_item_type_filter: 'custom_data'
      });
      
      if (linkedItems.length === 0) {
        return null;
      }
      
      // Sort by timestamp (assuming it's part of the custom_data key)
      linkedItems.sort((a, b) => {
        const aTime = a.target_item_id.split('_').pop();
        const bTime = b.target_item_id.split('_').pop();
        return new Date(bTime) - new Date(aTime); // Descending order
      });
      
      // Get the latest validation result
      const [category, key] = linkedItems[0].target_item_id.split(':');
      const validationData = await this.conportClient.getCustomData({
        workspace_id: this.workspaceId,
        category,
        key
      });
      
      return validationData.value;
    } catch (error) {
      console.error(`Failed to get validation results for ${itemType} ${itemId}:`, error);
      return null;
    }
  }
}

/**
 * KDAPSIVSIntegration provides integration between SIVS and KDAP
 */
class KDAPSIVSIntegration {
  /**
   * Creates a new KDAPSIVSIntegration
   * @param {Object} kdapClient - KDAP client instance
   * @param {Object} sivsIntegration - ConPortSIVSIntegration instance
   * @param {Object} config - Configuration options
   */
  constructor(kdapClient, sivsIntegration, config = {}) {
    this.kdapClient = kdapClient;
    this.sivsIntegration = sivsIntegration;
    this.config = config;
  }

  /**
   * Creates a knowledge-driven plan for improving an insight based on validation
   * @param {Object} insight - The insight to improve
   * @param {Object} validationResults - Validation results for the insight
   * @returns {Promise<Object>} Improvement plan
   */
  async createImprovementPlan(insight, validationResults) {
    try {
      // Prepare improvement goal based on validation results
      const improvementGoal = {
        target: `Improve ${insight.type || 'insight'} validation score`,
        currentScore: validationResults.overallScore,
        targetScore: Math.min(1, validationResults.overallScore + 0.2),
        dimensions: Object.keys(validationResults.dimensions)
          .filter(dim => validationResults.dimensions[dim].overallScore < 0.7)
          .map(dim => ({
            name: dim,
            currentScore: validationResults.dimensions[dim].overallScore,
            targetScore: Math.min(1, validationResults.dimensions[dim].overallScore + 0.25)
          }))
      };
      
      // Create an improvement plan using KDAP
      const plan = await this.kdapClient.createPlan({
        goal: improvementGoal,
        context: {
          insight,
          validationResults,
          suggestions: validationResults.suggestions || []
        },
        planType: 'improvementPlan'
      });
      
      return plan;
    } catch (error) {
      console.error('Failed to create improvement plan:', error);
      throw error;
    }
  }

  /**
   * Validates knowledge before it's used in a plan
   * @param {Object} kdapRequest - KDAP planning request
   * @returns {Promise<Object>} Enhanced planning request with validation results
   */
  async validatePlanningKnowledge(kdapRequest) {
    try {
      if (!kdapRequest.knowledgeSources || kdapRequest.knowledgeSources.length === 0) {
        return kdapRequest;
      }
      
      // Validate each knowledge source
      const validatedSources = await Promise.all(
        kdapRequest.knowledgeSources.map(async source => {
          if (source.type === 'conport' && source.itemType && source.itemId) {
            const validationResults = await this.sivsIntegration.validateConPortItem(
              source.itemType, source.itemId
            );
            
            return {
              ...source,
              validationResults,
              isValid: validationResults.isValid,
              score: validationResults.overallScore
            };
          }
          return source;
        })
      );
      
      // Filter out invalid sources if configured to do so
      const filteredSources = this.config.onlyUseValidKnowledge ?
        validatedSources.filter(source => source.isValid !== false) :
        validatedSources;
      
      // Sort sources by validation score (if available)
      filteredSources.sort((a, b) => {
        if (a.score !== undefined && b.score !== undefined) {
          return b.score - a.score;
        }
        return 0;
      });
      
      // Return enhanced request with validated sources
      return {
        ...kdapRequest,
        knowledgeSources: filteredSources
      };
    } catch (error) {
      console.error('Failed to validate planning knowledge:', error);
      return kdapRequest; // Return original request on error
    }
  }
}

/**
 * AKAFSIVSIntegration provides integration between SIVS and AKAF
 */
class AKAFSIVSIntegration {
  /**
   * Creates a new AKAFSIVSIntegration
   * @param {Object} akafClient - AKAF client instance
   * @param {Object} sivsIntegration - ConPortSIVSIntegration instance
   * @param {Object} config - Configuration options
   */
  constructor(akafClient, sivsIntegration, config = {}) {
    this.akafClient = akafClient;
    this.sivsIntegration = sivsIntegration;
    this.config = {
      minValidationScore: config.minValidationScore || 0.6,
      ...config
    };
  }

  /**
   * Validates knowledge before applying it
   * @param {Object} akafRequest - AKAF application request
   * @returns {Promise<Object>} Validated application request
   */
  async validateApplicationKnowledge(akafRequest) {
    try {
      if (!akafRequest.knowledge || !akafRequest.knowledge.source) {
        return akafRequest;
      }
      
      const source = akafRequest.knowledge.source;
      
      // Validate ConPort knowledge sources
      if (source.type === 'conport' && source.itemType && source.itemId) {
        const validationResults = await this.sivsIntegration.validateConPortItem(
          source.itemType, source.itemId
        );
        
        // Enhance request with validation results
        return {
          ...akafRequest,
          knowledge: {
            ...akafRequest.knowledge,
            source: {
              ...source,
              validationResults,
              isValid: validationResults.isValid,
              score: validationResults.overallScore
            }
          },
          validationPassed: validationResults.isValid && 
            validationResults.overallScore >= this.config.minValidationScore
        };
      }
      
      return akafRequest;
    } catch (error) {
      console.error('Failed to validate application knowledge:', error);
      return {
        ...akafRequest,
        validationPassed: false,
        validationError: error.message
      };
    }
  }

  /**
   * Filters patterns based on validation scores
   * @param {Array} patterns - Array of patterns to filter
   * @returns {Promise<Array>} Filtered and validated patterns
   */
  async filterAndValidatePatterns(patterns) {
    try {
      const validatedPatterns = await Promise.all(
        patterns.map(async pattern => {
          if (pattern.source && pattern.source.type === 'conport' && 
              pattern.source.itemType && pattern.source.itemId) {
            
            // Check if we have cached validation results
            if (pattern.source.validationResults) {
              return {
                ...pattern,
                validationScore: pattern.source.validationResults.overallScore,
                isValid: pattern.source.validationResults.isValid && 
                  pattern.source.validationResults.overallScore >= this.config.minValidationScore
              };
            }
            
            // Get validation results
            const validationResults = await this.sivsIntegration.validateConPortItem(
              pattern.source.itemType, pattern.source.itemId
            );
            
            return {
              ...pattern,
              validationScore: validationResults.overallScore,
              isValid: validationResults.isValid && 
                validationResults.overallScore >= this.config.minValidationScore
            };
          }
          
          return {
            ...pattern,
            isValid: true // Consider non-ConPort patterns valid by default
          };
        })
      );
      
      // Filter valid patterns and sort by validation score
      return validatedPatterns
        .filter(pattern => pattern.isValid !== false)
        .sort((a, b) => {
          if (a.validationScore !== undefined && b.validationScore !== undefined) {
            return b.validationScore - a.validationScore;
          }
          return 0;
        });
    } catch (error) {
      console.error('Failed to filter and validate patterns:', error);
      return patterns; // Return original patterns on error
    }
  }
}

/**
 * SIVSIntegrationManager provides a unified interface for all SIVS integrations
 */
class SIVSIntegrationManager {
  /**
   * Creates a new SIVSIntegrationManager
   * @param {Object} config - Configuration options
   */
  constructor(config = {}) {
    this.config = config;
    this.integrations = {};
  }

  /**
   * Initializes all integrations
   * @param {Object} clients - Object containing client instances
   * @param {string} workspaceId - ConPort workspace ID
   * @returns {Promise<SIVSIntegrationManager>} This manager instance
   */
  async initialize(clients, workspaceId) {
    try {
      // Initialize ConPort integration
      if (clients.conport) {
        this.integrations.conport = new ConPortSIVSIntegration(
          clients.conport, this.config.conport || {}
        );
        await this.integrations.conport.initialize(workspaceId);
      }
      
      // Initialize KDAP integration
      if (clients.kdap) {
        this.integrations.kdap = new KDAPSIVSIntegration(
          clients.kdap, this.integrations.conport, this.config.kdap || {}
        );
      }
      
      // Initialize AKAF integration
      if (clients.akaf) {
        this.integrations.akaf = new AKAFSIVSIntegration(
          clients.akaf, this.integrations.conport, this.config.akaf || {}
        );
      }
      
      return this;
    } catch (error) {
      console.error('Failed to initialize SIVS integrations:', error);
      throw error;
    }
  }

  /**
   * Gets a specific integration instance
   * @param {string} integrationType - Type of integration to get
   * @returns {Object} Integration instance
   */
  getIntegration(integrationType) {
    const integration = this.integrations[integrationType];
    
    if (!integration) {
      throw new Error(`Integration not found: ${integrationType}`);
    }
    
    return integration;
  }

  /**
   * Validates a ConPort item and returns results
   * @param {string} itemType - Type of ConPort item
   * @param {string|number} itemId - ID of ConPort item
   * @returns {Promise<Object>} Validation results
   */
  async validateConPortItem(itemType, itemId) {
    const conportIntegration = this.getIntegration('conport');
    return conportIntegration.validateConPortItem(itemType, itemId);
  }

  /**
   * Creates an improvement plan for a ConPort item
   * @param {string} itemType - Type of ConPort item
   * @param {string|number} itemId - ID of ConPort item
   * @returns {Promise<Object>} Improvement plan
   */
  async createImprovementPlan(itemType, itemId) {
    const conportIntegration = this.getIntegration('conport');
    const kdapIntegration = this.getIntegration('kdap');
    
    // First validate the item
    const validationResults = await conportIntegration.validateConPortItem(itemType, itemId);
    
    // Retrieve the item
    let item;
    switch (itemType) {
      case 'decision':
        const decisions = await conportIntegration.conportClient.getDecisions({
          workspace_id: conportIntegration.workspaceId,
          decision_id: itemId
        });
        item = decisions[0];
        break;
      
      case 'system_pattern':
        const patterns = await conportIntegration.conportClient.getSystemPatterns({
          workspace_id: conportIntegration.workspaceId,
          pattern_id: itemId
        });
        item = patterns[0];
        break;
      
      case 'custom_data':
        const [category, key] = itemId.split(':');
        const customData = await conportIntegration.conportClient.getCustomData({
          workspace_id: conportIntegration.workspaceId,
          category,
          key
        });
        item = {
          type: 'custom_data',
          category,
          key,
          content: customData.value
        };
        break;
      
      default:
        throw new Error(`Unsupported ConPort item type: ${itemType}`);
    }
    
    // Create improvement plan
    const insight = conportIntegration.transformConPortItemToInsight(item, itemType);
    return kdapIntegration.createImprovementPlan(insight, validationResults);
  }

  /**
   * Validates knowledge sources for KDAP planning
   * @param {Object} kdapRequest - KDAP planning request
   * @returns {Promise<Object>} Enhanced planning request with validation results
   */
  async validatePlanningKnowledge(kdapRequest) {
    const kdapIntegration = this.getIntegration('kdap');
    return kdapIntegration.validatePlanningKnowledge(kdapRequest);
  }

  /**
   * Validates knowledge for AKAF application
   * @param {Object} akafRequest - AKAF application request
   * @returns {Promise<Object>} Validated application request
   */
  async validateApplicationKnowledge(akafRequest) {
    const akafIntegration = this.getIntegration('akaf');
    return akafIntegration.validateApplicationKnowledge(akafRequest);
  }

  /**
   * Filters and validates patterns for AKAF
   * @param {Array} patterns - Array of patterns to filter
   * @returns {Promise<Array>} Filtered and validated patterns
   */
  async filterAndValidatePatterns(patterns) {
    const akafIntegration = this.getIntegration('akaf');
    return akafIntegration.filterAndValidatePatterns(patterns);
  }
}

// Export all integration classes
module.exports = {
  ConPortSIVSIntegration,
  KDAPSIVSIntegration,
  AKAFSIVSIntegration,
  SIVSIntegrationManager
};