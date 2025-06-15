/**
 * Semantic Knowledge Graph Usage Examples
 * 
 * This file demonstrates how to use the Semantic Knowledge Graph component
 * to discover relationships, perform semantic searches, and visualize the
 * knowledge graph.
 */

// Import the Semantic Knowledge Graph manager
const { createSemanticKnowledgeGraphManager } = require('../utilities/phase-3/semantic-knowledge-graph/semantic-knowledge-graph');

/**
 * Initialize a ConPort client
 * In a real application, this would connect to your ConPort instance
 */
function getConPortClient() {
  // This is a mock client for example purposes
  return {
    get_decisions: async ({ workspace_id, decision_id }) => {
      console.log(`Getting decision ${decision_id} from ${workspace_id}`);
      // Return mock data or actual data from ConPort
      return {
        id: decision_id,
        summary: 'Example decision',
        rationale: 'This is the rationale for the decision',
        implementation_details: 'Implementation details go here',
        tags: ['example', 'semantic-graph']
      };
    },
    get_system_patterns: async ({ workspace_id, pattern_id }) => {
      console.log(`Getting system pattern ${pattern_id} from ${workspace_id}`);
      return {
        id: pattern_id,
        name: 'Example Pattern',
        description: 'This is an example system pattern',
        tags: ['example']
      };
    },
    link_conport_items: async (params) => {
      console.log('Creating relationship:', JSON.stringify(params, null, 2));
      return { success: true };
    },
    get_linked_items: async ({ workspace_id, item_type, item_id }) => {
      console.log(`Getting linked items for ${item_type}:${item_id} from ${workspace_id}`);
      return []; // Return mock linked items
    },
    get_custom_data: async ({ workspace_id, category, key }) => {
      console.log(`Getting custom data ${category}:${key} from ${workspace_id}`);
      return {
        category,
        key,
        value: 'Example custom data value'
      };
    },
    get_progress: async ({ workspace_id, progress_id }) => {
      console.log(`Getting progress ${progress_id} from ${workspace_id}`);
      return {
        id: progress_id,
        description: 'Example progress entry',
        status: 'IN_PROGRESS'
      };
    },
    get_product_context: async ({ workspace_id }) => {
      console.log(`Getting product context from ${workspace_id}`);
      return { example: 'product context' };
    },
    get_active_context: async ({ workspace_id }) => {
      console.log(`Getting active context from ${workspace_id}`);
      return { current_focus: 'Example focus' };
    }
  };
}

/**
 * Example: Discovering Semantic Relationships
 */
async function exampleDiscoverRelationships() {
  console.log('\n--- Example: Discovering Semantic Relationships ---\n');
  
  const workspaceId = '/path/to/workspace';
  const conPortClient = getConPortClient();
  
  // Create semantic knowledge graph manager
  const semanticGraph = createSemanticKnowledgeGraphManager({
    workspaceId,
    conPortClient
  });
  
  // Discover relationships for a decision
  console.log('Discovering relationships for decision 42:');
  const discoveryResult = await semanticGraph.discoverRelationships({
    sourceType: 'decision',
    sourceId: 42,
    targetTypes: ['system_pattern', 'custom_data'],
    similarityThreshold: 0.3,
    limit: 5
  });
  
  console.log('Discovery result:');
  console.log(`- Valid: ${discoveryResult.valid}`);
  console.log(`- Total relationships found: ${discoveryResult.stats?.total || 0}`);
  console.log(`- Valid relationships: ${discoveryResult.stats?.valid || 0}`);
  
  // Display discovered relationships
  if (discoveryResult.relationships && discoveryResult.relationships.length > 0) {
    console.log('\nTop relationship:');
    const topRelationship = discoveryResult.relationships[0];
    console.log(`- ${topRelationship.sourceType}:${topRelationship.sourceId} --[${topRelationship.relationshipType}]--> ${topRelationship.targetType}:${topRelationship.targetId}`);
    console.log(`- Similarity: ${topRelationship.similarity?.toFixed(2)}`);
    console.log(`- Confidence: ${topRelationship.confidence?.toFixed(2)}%`);
  }
}

/**
 * Example: Creating a Semantic Relationship
 */
async function exampleCreateRelationship() {
  console.log('\n--- Example: Creating a Semantic Relationship ---\n');
  
  const workspaceId = '/path/to/workspace';
  const conPortClient = getConPortClient();
  
  // Create semantic knowledge graph manager
  const semanticGraph = createSemanticKnowledgeGraphManager({
    workspaceId,
    conPortClient
  });
  
  // Create a relationship between a decision and a system pattern
  console.log('Creating relationship:');
  const result = await semanticGraph.createRelationship({
    sourceType: 'decision',
    sourceId: 42,
    targetType: 'system_pattern',
    targetId: 27,
    relationType: 'implements',
    description: 'This decision implements the system pattern'
  });
  
  console.log('Relationship creation result:');
  console.log(`- Valid: ${result.valid}`);
  console.log(`- Created: ${result.created}`);
  
  if (!result.valid && result.issues) {
    console.log('- Issues:', result.issues);
  }
}

/**
 * Example: Performing a Semantic Search
 */
async function exampleSemanticSearch() {
  console.log('\n--- Example: Performing a Semantic Search ---\n');
  
  const workspaceId = '/path/to/workspace';
  const conPortClient = getConPortClient();
  
  // Create semantic knowledge graph manager
  const semanticGraph = createSemanticKnowledgeGraphManager({
    workspaceId,
    conPortClient
  });
  
  // Search for "knowledge management patterns"
  console.log('Searching for "knowledge management patterns":');
  const searchResult = await semanticGraph.semanticSearch({
    conceptQuery: 'knowledge management patterns',
    itemTypes: ['decision', 'system_pattern'],
    limit: 5
  });
  
  console.log('Search result:');
  console.log(`- Valid: ${searchResult.valid}`);
  console.log(`- Results found: ${searchResult.stats?.count || 0}`);
  console.log(`- Average relevance: ${searchResult.stats?.averageRelevance?.toFixed(2) || 0}`);
  
  // Display search results
  if (searchResult.results && searchResult.results.length > 0) {
    console.log('\nTop result:');
    const topResult = searchResult.results[0];
    console.log(`- ${topResult.type}:${topResult.item.id}`);
    console.log(`- Relevance: ${topResult.matchScore?.toFixed(2)}%`);
  }
}

/**
 * Example: Visualizing a Knowledge Graph
 */
async function exampleVisualizeGraph() {
  console.log('\n--- Example: Visualizing a Knowledge Graph ---\n');
  
  const workspaceId = '/path/to/workspace';
  const conPortClient = getConPortClient();
  
  // Create semantic knowledge graph manager
  const semanticGraph = createSemanticKnowledgeGraphManager({
    workspaceId,
    conPortClient
  });
  
  // Visualize graph starting from a decision
  console.log('Visualizing knowledge graph for decision 42:');
  const graphResult = await semanticGraph.visualizeKnowledgeGraph({
    rootItemType: 'decision',
    rootItemId: 42,
    depth: 2,
    relationshipTypes: ['implements', 'depends_on']
  });
  
  console.log('Graph visualization result:');
  console.log(`- Valid: ${graphResult.valid}`);
  
  if (graphResult.stats) {
    console.log(`- Nodes: ${graphResult.stats.nodeCount}`);
    console.log(`- Edges: ${graphResult.stats.edgeCount}`);
    console.log(`- Node types: ${JSON.stringify(graphResult.stats.nodeTypes)}`);
    console.log(`- Edge types: ${JSON.stringify(graphResult.stats.edgeTypes)}`);
    console.log(`- Discovered edges: ${graphResult.stats.discoveredEdges}`);
  }
  
  // Display visualization
  if (graphResult.visualization && graphResult.visualization.mermaid) {
    console.log('\nMermaid diagram:');
    console.log(graphResult.visualization.mermaid);
  }
}

/**
 * Run all examples
 */
async function runAllExamples() {
  try {
    await exampleDiscoverRelationships();
    await exampleCreateRelationship();
    await exampleSemanticSearch();
    await exampleVisualizeGraph();
    
    console.log('\nAll examples completed successfully!');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// When this script is run directly
if (require.main === module) {
  runAllExamples();
}

module.exports = {
  exampleDiscoverRelationships,
  exampleCreateRelationship,
  exampleSemanticSearch,
  exampleVisualizeGraph,
  runAllExamples
};