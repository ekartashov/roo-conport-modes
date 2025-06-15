/**
 * Semantic Knowledge Graph Validation Checkpoints
 * 
 * This module provides validation checkpoints for semantic knowledge graph operations,
 * ensuring data integrity, relationship validity, and semantic consistency.
 */

const { ConPortValidationManager } = require('../../conport-validation-manager');

/**
 * Creates validation checkpoints for semantic knowledge graph operations
 * @param {Object} options Configuration options
 * @param {string} options.workspaceId ConPort workspace ID
 * @param {Object} options.conPortClient ConPort client instance
 * @returns {Object} Validation checkpoint methods
 */
function createSemanticGraphValidation(options = {}) {
  const { workspaceId, conPortClient } = options;
  const validationManager = new ConPortValidationManager({
    workspaceId,
    componentName: 'semantic-knowledge-graph',
    conPortClient
  });

  /**
   * Validates a semantic relationship between two knowledge items
   * @param {Object} relationship The relationship to validate
   * @param {string} relationship.sourceType Source item type
   * @param {string|number} relationship.sourceId Source item ID
   * @param {string} relationship.targetType Target item type
   * @param {string|number} relationship.targetId Target item ID
   * @param {string} relationship.relationType Type of relationship
   * @returns {Promise<Object>} Validation result with valid flag and messages
   */
  async function validateSemanticRelationship(relationship) {
    const {
      sourceType,
      sourceId,
      targetType,
      targetId,
      relationType
    } = relationship;

    // Basic validation checks
    const validationIssues = [];

    if (!sourceType || !sourceId || !targetType || !targetId || !relationType) {
      validationIssues.push('All relationship properties are required');
    }

    // Verify source and target items exist
    let sourceValid = false;
    let targetValid = false;

    if (sourceType && sourceId) {
      try {
        // Use appropriate ConPort method to check if the item exists
        // This would depend on the item type
        switch(sourceType) {
          case 'decision':
            // Example implementation, replace with actual ConPort API call
            const sourceDecision = await conPortClient.get_decisions({
              workspace_id: workspaceId,
              decision_id: Number(sourceId)
            });
            sourceValid = sourceDecision && sourceDecision.id;
            break;
            
          case 'system_pattern':
            // Example implementation, replace with actual ConPort API call
            const sourcePattern = await conPortClient.get_system_patterns({
              workspace_id: workspaceId,
              pattern_id: Number(sourceId)
            });
            sourceValid = sourcePattern && sourcePattern.id;
            break;
            
          case 'custom_data':
            // For custom data, we would need category and key
            // This is a simplified example
            if (typeof sourceId === 'string' && sourceId.includes(':')) {
              const [category, key] = sourceId.split(':');
              const customData = await conPortClient.get_custom_data({
                workspace_id: workspaceId,
                category,
                key
              });
              sourceValid = customData && customData.value;
            } else {
              validationIssues.push('Custom data source ID must be in format "category:key"');
            }
            break;
            
          default:
            validationIssues.push(`Unsupported source type: ${sourceType}`);
        }

        if (!sourceValid) {
          validationIssues.push(`Source item ${sourceType}:${sourceId} not found`);
        }
      } catch (error) {
        validationIssues.push(`Error validating source item: ${error.message}`);
      }
    }

    if (targetType && targetId) {
      // Similar implementation for target validation
      try {
        // Implementation would mirror the source validation above
        // This is a placeholder for the actual implementation
        targetValid = true; // Replace with actual validation
      } catch (error) {
        validationIssues.push(`Error validating target item: ${error.message}`);
      }
    }

    // Verify relationship type is valid
    const validRelationTypes = [
      'implements', 'contradicts', 'extends', 'depends_on', 
      'explains', 'related_to', 'similar_to', 'derived_from',
      'precedes', 'follows', 'supports', 'refutes'
    ];

    if (!validRelationTypes.includes(relationType)) {
      validationIssues.push(`Invalid relationship type: ${relationType}`);
    }

    // Check for circular relationships
    if (sourceType === targetType && sourceId === targetId) {
      validationIssues.push('Self-referential relationships are not allowed');
    }

    // Check if this relationship already exists
    try {
      const existingLinks = await conPortClient.get_linked_items({
        workspace_id: workspaceId,
        item_type: sourceType,
        item_id: sourceId,
        relationship_type_filter: relationType,
        linked_item_type_filter: targetType
      });
      
      const hasSameLink = existingLinks.some(link => 
        link.target_item_id === targetId && 
        link.relationship_type === relationType
      );
      
      if (hasSameLink) {
        validationIssues.push('This relationship already exists');
      }
    } catch (error) {
      validationIssues.push(`Error checking for existing relationships: ${error.message}`);
    }

    return {
      valid: validationIssues.length === 0,
      issues: validationIssues,
      sourceValid,
      targetValid
    };
  }

  /**
   * Validates a semantic query before execution
   * @param {Object} query The semantic query parameters
   * @param {string} query.conceptQuery The concept/query text
   * @param {Array<string>} [query.itemTypes] Optional filter for item types
   * @param {number} [query.limit=10] Maximum number of results
   * @returns {Object} Validation result with valid flag and messages
   */
  function validateSemanticQuery(query) {
    const { conceptQuery, itemTypes, limit = 10 } = query;
    const validationIssues = [];

    if (!conceptQuery || conceptQuery.trim().length < 3) {
      validationIssues.push('Query text must be at least 3 characters long');
    }

    if (itemTypes && !Array.isArray(itemTypes)) {
      validationIssues.push('Item types must be an array');
    }

    const validItemTypes = [
      'decision', 'system_pattern', 'progress_entry',
      'custom_data', 'product_context', 'active_context'
    ];

    if (itemTypes && itemTypes.length > 0) {
      for (const type of itemTypes) {
        if (!validItemTypes.includes(type)) {
          validationIssues.push(`Invalid item type: ${type}`);
        }
      }
    }

    if (typeof limit !== 'number' || limit < 1 || limit > 100) {
      validationIssues.push('Limit must be a number between 1 and 100');
    }

    return {
      valid: validationIssues.length === 0,
      issues: validationIssues
    };
  }

  /**
   * Validates a knowledge graph visualization request
   * @param {Object} vizOptions Visualization options
   * @param {string} vizOptions.rootItemType Root item type
   * @param {string|number} vizOptions.rootItemId Root item ID
   * @param {number} [vizOptions.depth=2] Max traversal depth
   * @param {Array<string>} [vizOptions.relationshipTypes] Optional filter for relationship types
   * @returns {Object} Validation result with valid flag and messages
   */
  function validateGraphVisualization(vizOptions) {
    const { 
      rootItemType, 
      rootItemId, 
      depth = 2, 
      relationshipTypes 
    } = vizOptions;
    
    const validationIssues = [];

    if (!rootItemType || !rootItemId) {
      validationIssues.push('Root item type and ID are required');
    }

    if (typeof depth !== 'number' || depth < 1 || depth > 5) {
      validationIssues.push('Depth must be a number between 1 and 5');
    }

    if (relationshipTypes && !Array.isArray(relationshipTypes)) {
      validationIssues.push('Relationship types must be an array');
    }

    return {
      valid: validationIssues.length === 0,
      issues: validationIssues
    };
  }

  return {
    validateSemanticRelationship,
    validateSemanticQuery,
    validateGraphVisualization,
    
    // Register with validation manager
    registerWithManager: () => {
      validationManager.registerCheckpoint(
        'semantic_relationship',
        validateSemanticRelationship
      );
      
      validationManager.registerCheckpoint(
        'semantic_query',
        validateSemanticQuery
      );
      
      validationManager.registerCheckpoint(
        'graph_visualization',
        validateGraphVisualization
      );
      
      return validationManager;
    }
  };
}

module.exports = {
  createSemanticGraphValidation
};