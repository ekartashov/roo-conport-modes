/**
 * Semantic Knowledge Graph
 * 
 * This module provides a unified interface for semantic knowledge graph operations,
 * integrating validation and core functionality into a cohesive API.
 * 
 * The semantic knowledge graph enables:
 * - Automatic discovery of semantic relationships between knowledge items
 * - Semantic search across heterogeneous knowledge sources
 * - Knowledge graph visualization and traversal
 * - Contextual relevance ranking of knowledge items
 */

const { createSemanticGraphValidation } = require('./semantic-knowledge-graph-validation');
const { createSemanticKnowledgeGraph } = require('./semantic-knowledge-graph-core');

/**
 * Creates a semantic knowledge graph manager with validation
 * @param {Object} options Configuration options
 * @param {string} options.workspaceId ConPort workspace ID
 * @param {Object} options.conPortClient ConPort client instance
 * @returns {Object} Semantic knowledge graph API
 */
function createSemanticKnowledgeGraphManager(options = {}) {
  const { workspaceId, conPortClient } = options;
  
  if (!workspaceId) {
    throw new Error('workspaceId is required');
  }
  
  if (!conPortClient) {
    throw new Error('conPortClient is required');
  }
  
  // Initialize validation and core components
  const validation = createSemanticGraphValidation({
    workspaceId,
    conPortClient
  });
  
  const core = createSemanticKnowledgeGraph({
    workspaceId,
    conPortClient
  });
  
  // Register validation checkpoints
  const validationManager = validation.registerWithManager();
  
  /**
   * Discovers potential semantic relationships between knowledge items
   * @param {Object} options Discovery options
   * @param {string} options.sourceType Source item type (e.g., 'decision', 'system_pattern')
   * @param {string|number} options.sourceId Source item ID 
   * @param {Array<string>} [options.targetTypes] Types of items to check for relationships
   * @param {number} [options.similarityThreshold=0.3] Minimum similarity threshold (0-1)
   * @param {number} [options.limit=10] Maximum number of relationships to discover
   * @returns {Promise<Object>} Discovery results with validation status
   */
  async function discoverRelationships(options) {
    try {
      // Basic validation of required fields
      if (!options.sourceType || !options.sourceId) {
        return {
          valid: false,
          error: 'Source type and ID are required',
          relationships: []
        };
      }
      
      // Since there's no specific validation for the discovery operation,
      // we'll validate individual relationships after discovery
      
      // Perform relationship discovery
      const relationships = await core.discoverRelationships(options);
      
      // Validate each discovered relationship
      const validatedRelationships = await Promise.all(relationships.map(async (rel) => {
        const validationResult = await validation.validateSemanticRelationship(rel);
        return {
          ...rel,
          valid: validationResult.valid,
          validationIssues: validationResult.issues
        };
      }));
      
      return {
        valid: true,
        relationships: validatedRelationships,
        stats: {
          total: relationships.length,
          valid: validatedRelationships.filter(rel => rel.valid).length
        }
      };
    } catch (error) {
      console.error('Error in discoverRelationships:', error);
      return {
        valid: false,
        error: error.message,
        relationships: []
      };
    }
  }
  
  /**
   * Creates a new semantic relationship between two knowledge items
   * @param {Object} relationship The relationship to create
   * @param {string} relationship.sourceType Source item type
   * @param {string|number} relationship.sourceId Source item ID
   * @param {string} relationship.targetType Target item type
   * @param {string|number} relationship.targetId Target item ID
   * @param {string} relationship.relationType Type of relationship
   * @param {string} [relationship.description] Optional relationship description
   * @returns {Promise<Object>} Result of relationship creation
   */
  async function createRelationship(relationship) {
    try {
      // Validate the relationship
      const validationResult = await validation.validateSemanticRelationship(relationship);
      
      if (!validationResult.valid) {
        return {
          valid: false,
          created: false,
          issues: validationResult.issues
        };
      }
      
      // Extract relationship parameters
      const {
        sourceType,
        sourceId,
        targetType,
        targetId,
        relationType,
        description = ''
      } = relationship;
      
      // Create the relationship using ConPort's link_conport_items
      await conPortClient.link_conport_items({
        workspace_id: workspaceId,
        source_item_type: sourceType,
        source_item_id: String(sourceId),
        target_item_type: targetType,
        target_item_id: String(targetId),
        relationship_type: relationType,
        description
      });
      
      return {
        valid: true,
        created: true,
        relationship
      };
    } catch (error) {
      console.error('Error in createRelationship:', error);
      return {
        valid: false,
        created: false,
        error: error.message
      };
    }
  }
  
  /**
   * Performs semantic search across ConPort knowledge items
   * @param {Object} query The semantic query parameters
   * @param {string} query.conceptQuery The concept/query text
   * @param {Array<string>} [query.itemTypes] Optional filter for item types
   * @param {number} [query.limit=10] Maximum number of results
   * @returns {Promise<Object>} Search results with validation status
   */
  async function semanticSearch(query) {
    try {
      // Validate the query
      const validationResult = validation.validateSemanticQuery(query);
      
      if (!validationResult.valid) {
        return {
          valid: false,
          issues: validationResult.issues,
          results: []
        };
      }
      
      // Perform the semantic search
      const results = await core.semanticSearch(query);
      
      return {
        valid: true,
        query: query.conceptQuery,
        itemTypes: query.itemTypes || ['decision', 'system_pattern', 'custom_data', 'progress_entry'],
        results,
        stats: {
          count: results.length,
          averageRelevance: results.length > 0 
            ? results.reduce((sum, item) => sum + item.relevance, 0) / results.length
            : 0
        }
      };
    } catch (error) {
      console.error('Error in semanticSearch:', error);
      return {
        valid: false,
        error: error.message,
        results: []
      };
    }
  }
  
  /**
   * Builds a knowledge graph visualization starting from a root item
   * @param {Object} options Graph visualization options
   * @param {string} options.rootItemType Type of the root item
   * @param {string|number} options.rootItemId ID of the root item
   * @param {number} [options.depth=2] Maximum traversal depth
   * @param {Array<string>} [options.relationshipTypes] Optional filter for relationship types
   * @returns {Promise<Object>} Graph visualization data with validation status
   */
  async function visualizeKnowledgeGraph(options) {
    try {
      // Validate the visualization request
      const validationResult = validation.validateGraphVisualization(options);
      
      if (!validationResult.valid) {
        return {
          valid: false,
          issues: validationResult.issues,
          graph: { nodes: [], edges: [] }
        };
      }
      
      // Build the knowledge graph
      const graph = await core.buildKnowledgeGraph(options);
      
      // Generate graph statistics
      const stats = {
        nodeCount: graph.nodes.length,
        edgeCount: graph.edges.length,
        nodeTypes: countByProperty(graph.nodes, 'type'),
        edgeTypes: countByProperty(graph.edges, 'type'),
        discoveredEdges: graph.edges.filter(edge => edge.discovered).length
      };
      
      return {
        valid: true,
        options,
        graph,
        stats,
        visualization: generateVisualizationFormat(graph)
      };
    } catch (error) {
      console.error('Error in visualizeKnowledgeGraph:', error);
      return {
        valid: false,
        error: error.message,
        graph: { nodes: [], edges: [] }
      };
    }
  }
  
  /**
   * Counts occurrences of a property value in an array of objects
   * @param {Array<Object>} array The array to analyze
   * @param {string} property The property to count by
   * @returns {Object} Counts by property value
   */
  function countByProperty(array, property) {
    return array.reduce((counts, item) => {
      const value = item[property];
      counts[value] = (counts[value] || 0) + 1;
      return counts;
    }, {});
  }
  
  /**
   * Generates a visualization-friendly format of the graph
   * @param {Object} graph The graph data with nodes and edges
   * @returns {Object} Formatted visualization data
   */
  function generateVisualizationFormat(graph) {
    // This function would prepare the graph data for visualization
    // For now, we'll return a mermaid diagram format as an example
    
    const mermaidLines = ['graph TD;'];
    
    // Add nodes
    graph.nodes.forEach(node => {
      const nodeId = node.id.replace(/[^a-zA-Z0-9]/g, '_');
      const displayName = `${node.type}:${node.itemId}`;
      mermaidLines.push(`  ${nodeId}["${displayName}"];`);
    });
    
    // Add edges
    graph.edges.forEach(edge => {
      const sourceId = edge.source.replace(/[^a-zA-Z0-9]/g, '_');
      const targetId = edge.target.replace(/[^a-zA-Z0-9]/g, '_');
      const relationLabel = edge.type;
      
      mermaidLines.push(`  ${sourceId} -- "${relationLabel}" --> ${targetId};`);
    });
    
    return {
      mermaid: mermaidLines.join('\n')
    };
  }
  
  return {
    // Public API
    discoverRelationships,
    createRelationship,
    semanticSearch,
    visualizeKnowledgeGraph,
    
    // Expose validation manager for external use
    validationManager
  };
}

module.exports = {
  createSemanticKnowledgeGraphManager
};