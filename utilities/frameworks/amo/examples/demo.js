/**
 * Autonomous Mapping Orchestrator (AMO) - Demo Script
 * 
 * This script demonstrates the core functionality of the AMO system,
 * showing how to create, discover, and query knowledge relationships.
 */

// Import AMO components
const {
  RelationshipManager,
  MappingOrchestrator,
  KnowledgeGraphQuery,
  ConPortAMOIntegration,
  KDAPAMOIntegration,
  AKAFAMOIntegration
} = require('./index');

// Mock clients for demo purposes
const mockConPortClient = {
  logCustomData: async (data) => console.log(`ConPort: Logged custom data ${data.key}`),
  getCustomData: async ({ category, key }) => {
    console.log(`ConPort: Retrieved custom data from category ${category}${key ? ' with key ' + key : ''}`);
    return { value: {} };
  },
  batchLogCustomData: async ({ items }) => console.log(`ConPort: Logged ${items.length} items in batch`)
};

const mockKdapClient = {
  getDecisions: async () => {
    console.log('KDAP: Retrieved decisions');
    return SAMPLE_DECISIONS;
  },
  getSystemPatterns: async () => {
    console.log('KDAP: Retrieved system patterns');
    return SAMPLE_PATTERNS;
  },
  getProgress: async () => {
    console.log('KDAP: Retrieved progress entries');
    return [];
  }
};

const mockAkafClient = {};

// Sample knowledge artifacts for demo
const SAMPLE_DECISIONS = [
  {
    id: 'decision-1', 
    summary: 'Adopt microservices architecture',
    rationale: 'To improve scalability and team independence',
    tags: ['architecture', 'scalability']
  },
  {
    id: 'decision-2', 
    summary: 'Use GraphQL for API',
    rationale: 'To optimize data fetching and reduce over-fetching',
    tags: ['api', 'data']
  },
  {
    id: 'decision-3', 
    summary: 'Implement caching layer',
    rationale: 'To improve performance and response times',
    tags: ['performance']
  }
];

const SAMPLE_PATTERNS = [
  {
    id: 'pattern-1',
    name: 'Microservices Pattern',
    description: 'Breaking an application into small, independently deployable services',
    tags: ['architecture', 'scalability']
  },
  {
    id: 'pattern-2',
    name: 'API Gateway Pattern',
    description: 'Single entry point for all API calls with routing and composition',
    tags: ['api', 'architecture']
  },
  {
    id: 'pattern-3',
    name: 'Cache-Aside Pattern',
    description: 'Loading data from a data store on cache miss',
    tags: ['performance', 'data']
  }
];

/**
 * Main demo function
 */
async function runDemo() {
  console.log('=== AMO Demo ===');
  console.log('Demonstrating the Autonomous Mapping Orchestrator (AMO) functionality');
  console.log('');
  
  // Part 1: Basic relationship management
  console.log('=== Part 1: Basic Relationship Management ===');
  await demoRelationshipManagement();
  console.log('');
  
  // Part 2: Schema-based relationship discovery
  console.log('=== Part 2: Schema-Based Relationship Discovery ===');
  await demoMappingOrchestrator();
  console.log('');
  
  // Part 3: Knowledge graph queries
  console.log('=== Part 3: Knowledge Graph Queries ===');
  await demoGraphQueries();
  console.log('');
  
  // Part 4: Integration with ConPort, KDAP, and AKAF
  console.log('=== Part 4: Integration with ConPort, KDAP, and AKAF ===');
  await demoIntegrations();
  console.log('');
  
  console.log('=== Demo Complete ===');
}

/**
 * Demonstrates relationship management
 */
async function demoRelationshipManagement() {
  // Create a relationship manager
  console.log('Creating RelationshipManager...');
  const relationshipManager = new RelationshipManager({
    autoGenerateMetadata: true,
    deduplicateRelationships: true,
    trackHistory: true
  });
  
  // Add relationships
  console.log('Adding relationships...');
  
  const rel1 = relationshipManager.addRelationship({
    sourceId: 'decision-1',
    sourceType: 'decision',
    targetId: 'pattern-1',
    targetType: 'system_pattern',
    type: 'implements',
    confidence: 0.95,
    properties: {
      strength: 'strong',
      description: 'The microservices architecture decision directly implements this pattern'
    }
  });
  
  console.log(`Created relationship: ${rel1.sourceType}:${rel1.sourceId} → ${rel1.type} → ${rel1.targetType}:${rel1.targetId}`);
  console.log(`Relationship ID: ${rel1.id}`);
  
  const rel2 = relationshipManager.addRelationship({
    sourceId: 'decision-2',
    sourceType: 'decision',
    targetId: 'pattern-2',
    targetType: 'system_pattern',
    type: 'implements',
    confidence: 0.85,
    properties: {
      strength: 'moderate',
      description: 'GraphQL API decision aligns with the API Gateway pattern'
    }
  });
  
  console.log(`Created relationship: ${rel2.sourceType}:${rel2.sourceId} → ${rel2.type} → ${rel2.targetType}:${rel2.targetId}`);
  
  const rel3 = relationshipManager.addRelationship({
    sourceId: 'decision-3',
    sourceType: 'decision',
    targetId: 'pattern-3',
    targetType: 'system_pattern',
    type: 'implements',
    confidence: 0.9,
    properties: {
      strength: 'strong',
      description: 'The caching layer decision directly implements the Cache-Aside pattern'
    }
  });
  
  console.log(`Created relationship: ${rel3.sourceType}:${rel3.sourceId} → ${rel3.type} → ${rel3.targetType}:${rel3.targetId}`);
  
  // Create a depends_on relationship
  const rel4 = relationshipManager.addRelationship({
    sourceId: 'decision-3',
    sourceType: 'decision',
    targetId: 'decision-2',
    targetType: 'decision',
    type: 'depends_on',
    confidence: 0.8,
    properties: {
      description: 'Caching layer depends on API design decisions'
    }
  });
  
  console.log(`Created relationship: ${rel4.sourceType}:${rel4.sourceId} → ${rel4.type} → ${rel4.targetType}:${rel4.targetId}`);
  
  // Update a relationship
  console.log('\nUpdating relationship...');
  const updated = relationshipManager.updateRelationship(rel3.id, {
    confidence: 0.95,
    properties: {
      ...rel3.properties,
      strength: 'definitive'
    }
  });
  
  console.log(`Updated relationship ${updated.id}: confidence = ${updated.confidence}, strength = ${updated.properties.strength}`);
  
  // Find relationships by source
  console.log('\nFinding relationships by source...');
  const decisionRelationships = relationshipManager.findRelationshipsBySource('decision', 'decision-3');
  console.log(`Found ${decisionRelationships.length} relationships from decision-3`);
  
  // Find all relationships for a specific decision
  console.log('\nFinding all relationships for an item...');
  const allDecisionRelationships = relationshipManager.findRelationshipsForItem('decision', 'decision-3');
  console.log(`Found ${allDecisionRelationships.length} total relationships for decision-3`);
  
  // Validate all relationships
  console.log('\nValidating all relationships...');
  const validationResults = relationshipManager.validateAllRelationships({
    updateLastValidated: true
  });
  
  console.log(`Validation results: ${validationResults.valid} valid, ${validationResults.invalid} invalid`);
  
  return relationshipManager;
}

/**
 * Demonstrates mapping orchestrator
 */
async function demoMappingOrchestrator() {
  // Create a relationship manager
  const relationshipManager = new RelationshipManager();
  
  // Create a mapping orchestrator
  console.log('Creating MappingOrchestrator...');
  const mappingOrchestrator = new MappingOrchestrator(relationshipManager, {
    validateSchemas: true,
    enableAutoMapping: true
  });
  
  // Register a mapping schema
  console.log('Registering mapping schema...');
  const schema = {
    name: 'Decision-Pattern Mapping',
    version: '1.0.0',
    relationshipTypes: ['implements', 'depends_on', 'related_to'],
    mappingRules: [
      {
        sourceType: 'decision',
        targetType: 'system_pattern',
        relationshipType: 'implements',
        condition: 'source.tags && target.tags && source.tags.some(tag => target.tags.includes(tag))',
        confidenceCalculation: 'source.tags && target.tags ? source.tags.filter(tag => target.tags.includes(tag)).length / Math.max(source.tags.length, target.tags.length) : 0.5',
        defaultConfidence: 0.7,
        propertyMappings: {
          description: 'source.summary + " implements " + target.name'
        }
      },
      {
        sourceType: 'decision',
        targetType: 'decision',
        relationshipType: 'depends_on',
        condition: 'source.id !== target.id', // Prevent self-references
        defaultConfidence: 0.6
      }
    ]
  };
  
  const schemaId = mappingOrchestrator.registerSchema(schema);
  console.log(`Registered schema with ID: ${schemaId}`);
  
  // Create a context with knowledge artifacts
  const context = {
    decision: SAMPLE_DECISIONS,
    system_pattern: SAMPLE_PATTERNS
  };
  
  // Apply the schema to discover relationships
  console.log('\nApplying schema to discover relationships...');
  const results = mappingOrchestrator.applySchema(schemaId, context);
  
  console.log(`Discovered ${results.relationshipsDiscovered} relationships`);
  console.log(`Created ${results.relationshipsCreated} new relationships`);
  console.log(`Skipped ${results.relationshipsSkipped} relationships`);
  
  // Show the discovered relationships
  console.log('\nDiscovered relationships:');
  for (const relationship of results.relationships) {
    console.log(`- ${relationship.sourceType}:${relationship.sourceId} → ${relationship.type} → ${relationship.targetType}:${relationship.targetId} (confidence: ${relationship.confidence.toFixed(2)})`);
  }
  
  return { relationshipManager, mappingOrchestrator };
}

/**
 * Demonstrates knowledge graph queries
 */
async function demoGraphQueries() {
  // Create and populate a relationship manager
  const relationshipManager = new RelationshipManager();
  
  // Add some relationships
  relationshipManager.addRelationship({
    sourceId: 'decision-1',
    sourceType: 'decision',
    targetId: 'pattern-1',
    targetType: 'system_pattern',
    type: 'implements'
  });
  
  relationshipManager.addRelationship({
    sourceId: 'pattern-1',
    sourceType: 'system_pattern',
    targetId: 'progress-1',
    targetType: 'progress',
    type: 'tracked_by'
  });
  
  relationshipManager.addRelationship({
    sourceId: 'decision-1',
    sourceType: 'decision',
    targetId: 'decision-2',
    targetType: 'decision',
    type: 'depends_on'
  });
  
  relationshipManager.addRelationship({
    sourceId: 'decision-2',
    sourceType: 'decision',
    targetId: 'pattern-2',
    targetType: 'system_pattern',
    type: 'implements'
  });
  
  // Create a knowledge graph query engine
  console.log('Creating KnowledgeGraphQuery engine...');
  const graphQuery = new KnowledgeGraphQuery(relationshipManager, {
    validateQueries: true,
    defaultQueryDepth: 2,
    maxDepth: 5,
    maxResults: 50
  });
  
  // Execute a node query
  console.log('\nExecuting a node query with depth 1...');
  const nodeQueryResults = graphQuery.executeQuery({
    startNode: { type: 'decision', id: 'decision-1' },
    depth: 1,
    direction: 'outbound'
  });
  
  console.log(`Query found ${nodeQueryResults.nodes.length} nodes and ${nodeQueryResults.relationships.length} relationships`);
  
  // Show the query results
  console.log('\nRelationships found:');
  for (const relationship of nodeQueryResults.relationships) {
    console.log(`- ${relationship.sourceType}:${relationship.sourceId} → ${relationship.type} → ${relationship.targetType}:${relationship.targetId}`);
  }
  
  // Execute a multi-node query
  console.log('\nExecuting a multi-node query...');
  const multiNodeQueryResults = graphQuery.executeQuery({
    startNodes: [
      { type: 'decision', id: 'decision-1' },
      { type: 'decision', id: 'decision-2' }
    ],
    depth: 2,
    direction: 'all'
  });
  
  console.log(`Query found ${multiNodeQueryResults.nodes.length} nodes and ${multiNodeQueryResults.relationships.length} relationships`);
  
  // Execute a query with filters
  console.log('\nExecuting a query with filters...');
  const filteredQueryResults = graphQuery.executeQuery({
    startNode: { type: 'decision', id: 'decision-1' },
    depth: 3,
    direction: 'all',
    relationshipTypes: ['implements'], // Only include 'implements' relationships
    filters: {
      minConfidence: 0.5
    },
    sortBy: 'confidence'
  });
  
  console.log(`Filtered query found ${filteredQueryResults.nodes.length} nodes and ${filteredQueryResults.relationships.length} relationships`);
  
  return graphQuery;
}

/**
 * Demonstrates integration with other components
 */
async function demoIntegrations() {
  // Create core components
  const relationshipManager = new RelationshipManager();
  const mappingOrchestrator = new MappingOrchestrator(relationshipManager);
  const graphQuery = new KnowledgeGraphQuery(relationshipManager);
  
  // 1. ConPort Integration
  console.log('Demonstrating ConPort integration...');
  const conPortIntegration = new ConPortAMOIntegration(
    mockConPortClient,
    relationshipManager,
    {
      autoSync: false,
      syncInterval: 3600000, // 1 hour
      relationshipCategory: 'relationships',
      schemaCategory: 'mapping_schemas'
    }
  );
  
  // Add a relationship to the manager
  const rel = relationshipManager.addRelationship({
    sourceId: 'decision-1',
    sourceType: 'decision',
    targetId: 'pattern-1',
    targetType: 'system_pattern',
    type: 'implements',
    confidence: 0.9
  });
  
  // Sync to ConPort
  console.log('\nSyncing relationships to ConPort...');
  const syncResults = await conPortIntegration.syncToConPort();
  console.log(`Sync results: ${syncResults.relationshipsSaved} relationships saved`);
  
  // Register and save a schema
  const schemaId = mappingOrchestrator.registerSchema({
    name: 'Test Schema',
    version: '1.0.0',
    relationshipTypes: ['implements']
  });
  
  console.log('\nSaving schema to ConPort...');
  const schemaResult = await conPortIntegration.saveSchemaToConPort(schemaId, mappingOrchestrator);
  console.log(`Schema save result: ${schemaResult.success ? 'success' : 'failed'}`);
  
  // 2. KDAP Integration
  console.log('\nDemonstrating KDAP integration...');
  const kdapIntegration = new KDAPAMOIntegration(
    mockKdapClient,
    relationshipManager,
    mappingOrchestrator,
    {
      autoDiscover: false,
      minConfidence: 0.7
    }
  );
  
  // Discover relationships
  console.log('\nDiscovering relationships using KDAP knowledge...');
  const discoveryResults = await kdapIntegration.discoverRelationships({
    knowledgeTypes: ['decision', 'system_pattern'],
    confidenceThreshold: 0.7,
    dryRun: true // Just simulate for the demo
  });
  
  console.log(`Discovery results: ${discoveryResults.relationshipsDiscovered} relationships discovered`);
  
  // 3. AKAF Integration
  console.log('\nDemonstrating AKAF integration...');
  const akafIntegration = new AKAFAMOIntegration(
    mockAkafClient,
    relationshipManager,
    graphQuery
  );
  
  // Enhance a knowledge request
  const request = {
    query: 'How to implement microservices architecture?',
    context: {
      decisions: [{ id: 'decision-1', summary: 'Adopt microservices architecture' }]
    }
  };
  
  console.log('\nEnhancing a knowledge request with relationship data...');
  const enhancedRequest = await akafIntegration.enhanceKnowledgeRequest(request);
  
  if (enhancedRequest.context.relationships) {
    console.log(`Enhanced request with ${enhancedRequest.context.relationships.length} relationships`);
  }
  
  // Analyze connectivity
  const artifacts = [
    { id: 'decision-1', type: 'decision' },
    { id: 'pattern-1', type: 'system_pattern' }
  ];
  
  console.log('\nAnalyzing knowledge connectivity...');
  const connectivityResults = await akafIntegration.analyzeKnowledgeConnectivity(artifacts);
  
  console.log(`Connectivity analysis: ${connectivityResults.artifacts} artifacts, ${connectivityResults.relationships} relationships`);
  
  return {
    conPortIntegration,
    kdapIntegration,
    akafIntegration
  };
}

// Run the demo
runDemo().catch(error => {
  console.error('Error running demo:', error);
});