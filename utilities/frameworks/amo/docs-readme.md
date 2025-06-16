# Autonomous Mapping Orchestrator (AMO)

The Autonomous Mapping Orchestrator (AMO) is a core component of the Phase 4 ConPort system that dynamically discovers, maps, and organizes knowledge relationships. AMO serves as the connective tissue between knowledge artifacts, enabling more intelligent operations and deeper insights.

## Overview

AMO enables knowledge graph capabilities by:

- Discovering and managing relationships between knowledge artifacts
- Orchestrating knowledge mapping using configurable schemas and rules
- Providing graph query capabilities to explore knowledge connections
- Integrating with other Phase 4 components (ConPort, KDAP, AKAF)

## Architecture

AMO follows the three-layer architecture pattern established for all Phase 4 components:

1. **Validation Layer** (`amo-validation.js`): Provides specialized validators for relationships, mapping schemas, and queries
2. **Core Layer** (`amo-core.js`): Implements the core functionality with three main classes:
   - `RelationshipManager`: Manages the lifecycle of knowledge artifact relationships
   - `MappingOrchestrator`: Orchestrates knowledge mapping based on schemas and rules
   - `KnowledgeGraphQuery`: Enables querying of the knowledge graph
3. **Integration Layer** (`amo-integration.js`): Integrates AMO with other system components:
   - `ConPortAMOIntegration`: Enables storing and retrieving relationships from ConPort
   - `KDAPAMOIntegration`: Enables knowledge-driven relationship discovery
   - `AKAFAMOIntegration`: Enables adaptive knowledge application through relationships

## Installation

AMO is included as part of the Phase 4 ConPort system. No separate installation is required.

## Basic Usage

### Initialize the Relationship Manager

```javascript
const { RelationshipManager } = require('../utilities/frameworks/amo');

// Create a relationship manager
const relationshipManager = new RelationshipManager({
  strictValidation: false,
  autoGenerateMetadata: true,
  deduplicateRelationships: true
});

// Add a relationship
const relationship = relationshipManager.addRelationship({
  sourceType: 'decision',
  sourceId: 'decision-123',
  targetType: 'system_pattern',
  targetId: 'pattern-456',
  type: 'implements',
  confidence: 0.9,
  properties: {
    strength: 'strong',
    description: 'Decision 123 directly implements Pattern 456'
  }
});

console.log(`Created relationship with ID: ${relationship.id}`);
```

### Use the Mapping Orchestrator

```javascript
const { RelationshipManager, MappingOrchestrator } = require('../utilities/frameworks/amo');

// Create a relationship manager
const relationshipManager = new RelationshipManager();

// Create a mapping orchestrator
const mappingOrchestrator = new MappingOrchestrator(relationshipManager, {
  validateSchemas: true,
  enableAutoMapping: true
});

// Register a mapping schema
const schemaId = mappingOrchestrator.registerSchema({
  name: 'Implementation Relationships',
  version: '1.0.0',
  relationshipTypes: ['implements', 'depends_on', 'refines'],
  mappingRules: [
    {
      sourceType: 'decision',
      targetType: 'system_pattern',
      relationshipType: 'implements',
      condition: 'containsText(target.description, source.summary)',
      confidenceCalculation: 'textSimilarity(source.summary, target.description)',
      defaultConfidence: 0.7
    }
  ]
});

// Apply the schema to discover relationships
const context = {
  decision: [
    { id: 'decision-123', summary: 'Implement caching for API responses' }
  ],
  system_pattern: [
    { id: 'pattern-456', description: 'API response caching pattern for improved performance' }
  ]
};

const results = mappingOrchestrator.applySchema(schemaId, context);
console.log(`Discovered ${results.relationshipsDiscovered} relationships`);
```

### Query the Knowledge Graph

```javascript
const { RelationshipManager, KnowledgeGraphQuery } = require('../utilities/frameworks/amo');

// Create a relationship manager and add some relationships
const relationshipManager = new RelationshipManager();

// Add relationships...

// Create a knowledge graph query engine
const graphQuery = new KnowledgeGraphQuery(relationshipManager, {
  validateQueries: true,
  defaultQueryDepth: 2,
  maxDepth: 5
});

// Execute a query
const results = graphQuery.executeQuery({
  startNode: { type: 'decision', id: 'decision-123' },
  depth: 2,
  direction: 'all',
  filters: {
    minConfidence: 0.7
  }
});

console.log(`Query found ${results.nodes.length} nodes and ${results.relationships.length} relationships`);
```

### Integrate with ConPort

```javascript
const { RelationshipManager, ConPortAMOIntegration } = require('../utilities/frameworks/amo');

// Create a relationship manager
const relationshipManager = new RelationshipManager();

// Create ConPort client (configuration will depend on your environment)
const conPortClient = createConPortClient();

// Create ConPort integration
const conPortIntegration = new ConPortAMOIntegration(conPortClient, relationshipManager, {
  autoSync: true,
  syncInterval: 3600000, // 1 hour
  relationshipCategory: 'relationships'
});

// Synchronize relationships from ConPort to AMO
await conPortIntegration.syncFromConPort();

// Synchronize relationships from AMO to ConPort
await conPortIntegration.syncToConPort();
```

## Advanced Features

### Relationship Discovery with KDAP

```javascript
const { 
  RelationshipManager, 
  MappingOrchestrator,
  KDAPAMOIntegration 
} = require('../utilities/frameworks/amo');

// Create a relationship manager and mapping orchestrator
const relationshipManager = new RelationshipManager();
const mappingOrchestrator = new MappingOrchestrator(relationshipManager);

// Create KDAP client (configuration will depend on your environment)
const kdapClient = createKDAPClient();

// Create KDAP integration
const kdapIntegration = new KDAPAMOIntegration(
  kdapClient, 
  relationshipManager,
  mappingOrchestrator,
  {
    autoDiscover: true,
    discoverInterval: 86400000 // 24 hours
  }
);

// Discover relationships
const results = await kdapIntegration.discoverRelationships({
  knowledgeTypes: ['decision', 'system_pattern'],
  confidenceThreshold: 0.7
});

console.log(`Discovered ${results.relationshipsDiscovered} relationships`);
```

### Adaptive Knowledge Application with AKAF

```javascript
const { 
  RelationshipManager, 
  KnowledgeGraphQuery,
  AKAFAMOIntegration 
} = require('../utilities/frameworks/amo');

// Create a relationship manager and graph query engine
const relationshipManager = new RelationshipManager();
const graphQuery = new KnowledgeGraphQuery(relationshipManager);

// Create AKAF client (configuration will depend on your environment)
const akafClient = createAKAFClient();

// Create AKAF integration
const akafIntegration = new AKAFAMOIntegration(
  akafClient, 
  relationshipManager,
  graphQuery
);

// Enhance a knowledge request with relationship data
const enhancedRequest = await akafIntegration.enhanceKnowledgeRequest({
  query: 'How to implement caching for API responses?',
  context: {
    decisions: [{ id: 'decision-123', summary: 'Implement caching for API responses' }]
  }
});

// Adapt knowledge based on relationships
const adaptedResponse = await akafIntegration.adaptKnowledge(
  knowledgeResponse,
  { focus: 'implementation' }
);

console.log(`Generated ${adaptedResponse.adaptiveKnowledge.insights.length} insights`);
```

## API Reference

### Validation Layer

#### `validateRelationship(relationship, options)`
Validates a relationship between knowledge artifacts.

#### `validateMappingSchema(schema, options)`
Validates a mapping schema structure.

#### `validateQuery(query, options)`
Validates a knowledge graph query.

### Core Layer

#### `RelationshipManager`
Manages knowledge artifact relationships.

**Key Methods:**
- `addRelationship(relationship, options)`: Adds a new relationship
- `updateRelationship(relationshipId, updates, options)`: Updates an existing relationship
- `removeRelationship(relationshipId)`: Removes a relationship
- `getRelationship(relationshipId)`: Gets a relationship by ID
- `findRelationshipsBySource(sourceType, sourceId)`: Finds relationships by source
- `findRelationshipsByTarget(targetType, targetId)`: Finds relationships by target
- `findRelationshipsByType(type)`: Finds relationships by type
- `findRelationshipsBetween(sourceType, sourceId, targetType, targetId)`: Finds relationships between specific source and target

#### `MappingOrchestrator`
Orchestrates knowledge mapping based on schemas and rules.

**Key Methods:**
- `registerSchema(schema, options)`: Registers a mapping schema
- `getSchema(schemaId)`: Gets a registered schema
- `applySchema(schemaId, context, options)`: Applies a mapping schema to discover relationships
- `applyAllSchemas(context, options)`: Applies all registered schemas

#### `KnowledgeGraphQuery`
Enables querying of the knowledge graph.

**Key Methods:**
- `executeQuery(query, options)`: Executes a query on the knowledge graph

### Integration Layer

#### `ConPortAMOIntegration`
Enables storing and retrieving relationships from ConPort.

**Key Methods:**
- `syncFromConPort(options)`: Retrieves relationships from ConPort
- `syncToConPort(options)`: Saves relationships to ConPort
- `saveSchemaToConPort(schemaId, mappingOrchestrator)`: Saves a mapping schema to ConPort
- `loadSchemaFromConPort(schemaId, mappingOrchestrator)`: Loads a mapping schema from ConPort

#### `KDAPAMOIntegration`
Enables knowledge-driven relationship discovery.

**Key Methods:**
- `discoverRelationships(options)`: Discovers relationships using KDAP knowledge
- `analyzeArtifactRelationships(artifact, artifactType, options)`: Analyzes a specific knowledge artifact
- `generateDiscoverySchemas()`: Generates relationship discovery schemas

#### `AKAFAMOIntegration`
Enables adaptive knowledge application through relationships.

**Key Methods:**
- `enhanceKnowledgeRequest(request)`: Enhances a knowledge request with relationship data
- `adaptKnowledge(knowledgeResponse, context)`: Applies adaptive knowledge based on relationships
- `analyzeKnowledgeConnectivity(artifacts, options)`: Analyzes knowledge connectivity
- `suggestRelationships(context)`: Suggests new relationships based on usage patterns

## Best Practices

1. **Schema Design**: Create focused, purposeful mapping schemas that target specific types of relationships with clear conditions.

2. **Confidence Thresholds**: Adjust confidence thresholds based on your use case. Use higher thresholds (0.8+) for critical systems and lower thresholds (0.6+) for exploratory analysis.

3. **Integration Syncing**: Configure synchronization intervals based on your system's update frequency. High-change environments may need more frequent syncs.

4. **Relationship Pruning**: Periodically validate and remove low-confidence or unused relationships to maintain graph quality.

5. **Query Optimization**: Limit query depth and use filters to improve performance when working with large knowledge graphs.

## Troubleshooting

- **Relationship Validation Errors**: Check that all required fields are present and correctly formatted.
- **Schema Application Issues**: Verify that the mapping context contains the expected data structure.
- **Query Performance Problems**: Reduce query depth or add more specific filters.
- **Synchronization Failures**: Check that the ConPort client is correctly configured and accessible.

## Contributing

Follow the established Phase 4 contribution guidelines when extending or modifying AMO functionality.

1. Maintain the three-layer architecture
2. Add comprehensive validation for new features
3. Write tests for all new functionality
4. Document API changes in the README