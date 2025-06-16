# Semantic Knowledge Graph

## Overview

The Semantic Knowledge Graph is a core component of Phase 3 (Advanced Knowledge Management) that enhances ConPort with semantic understanding capabilities. It automatically discovers meaningful relationships between knowledge items, provides semantic search across heterogeneous knowledge sources, enables knowledge graph visualization, and implements contextual relevance ranking.

This component transforms ConPort from a repository of isolated knowledge artifacts into an interconnected knowledge ecosystem where relationships are automatically discovered, leveraged, and visualized.

## Architecture

The Semantic Knowledge Graph follows our established three-component architecture pattern:

1. **Validation Layer** (`semantic-knowledge-graph-validation.js`):
   - Validates semantic relationships between knowledge items
   - Ensures data integrity and prevents invalid relationship creation
   - Checks for circular references and duplicate relationships
   - Validates semantic queries and visualization requests

2. **Knowledge-First Core** (`semantic-knowledge-graph-core.js`):
   - Implements semantic analysis algorithms
   - Discovers potential relationships between knowledge items
   - Builds and traverses the knowledge graph
   - Performs semantic search across ConPort items

3. **Integration Layer** (`semantic-knowledge-graph.js`):
   - Provides a unified API for semantic operations
   - Integrates validation and core functionality
   - Handles error conditions and edge cases
   - Formats results for easy consumption

## Key Features

### 1. Semantic Relationship Discovery

The system can automatically discover potential relationships between knowledge items by analyzing their content for semantic similarity and patterns indicative of specific relationship types.

**Capabilities:**
- Calculate semantic similarity between knowledge items
- Infer appropriate relationship types (implements, extends, depends_on, etc.)
- Assign confidence scores to discovered relationships
- Filter by similarity threshold and target types

### 2. Semantic Search

Search across ConPort knowledge items based on conceptual understanding rather than simple keyword matching, delivering more contextually relevant results.

**Capabilities:**
- Search by concepts rather than exact keywords
- Calculate relevance scores for search results
- Filter by item types
- Return ranked results with match scores

### 3. Knowledge Graph Visualization

Construct and visualize the knowledge graph starting from any knowledge item, revealing the interconnected nature of project knowledge.

**Capabilities:**
- Build a graph starting from a root item
- Traverse relationships to specified depth
- Filter by relationship types
- Generate visualization-ready output
- Provide graph statistics and insights

### 4. Contextual Relevance Ranking

Rank knowledge items by their contextual relevance to the current task or query, helping surface the most pertinent information.

**Capabilities:**
- Calculate contextual similarity scores
- Rank items by relevance
- Filter and sort based on multiple criteria
- Provide confidence metrics for relevance scores

## Integration with ConPort

The Semantic Knowledge Graph integrates deeply with ConPort, operating on these knowledge item types:
- Decisions
- System Patterns
- Progress Entries
- Custom Data
- Product Context
- Active Context

It leverages these ConPort tools:
- `get_decisions`
- `get_system_patterns`
- `get_progress`
- `get_custom_data`
- `get_product_context`
- `get_active_context`
- `link_conport_items`
- `get_linked_items`

## Usage Examples

### Discovering Semantic Relationships

```javascript
const semanticGraph = createSemanticKnowledgeGraphManager({
  workspaceId,
  conPortClient
});

// Discover relationships for a decision
const discoveryResult = await semanticGraph.discoverRelationships({
  sourceType: 'decision',
  sourceId: 42,
  targetTypes: ['system_pattern', 'custom_data'],
  similarityThreshold: 0.3,
  limit: 5
});

// Process discovered relationships
if (discoveryResult.valid) {
  for (const rel of discoveryResult.relationships) {
    console.log(`${rel.sourceType}:${rel.sourceId} --[${rel.relationshipType}]--> ${rel.targetType}:${rel.targetId}`);
    console.log(`Confidence: ${rel.confidence}%`);
  }
}
```

### Creating a Semantic Relationship

```javascript
// Create a relationship between a decision and a system pattern
const result = await semanticGraph.createRelationship({
  sourceType: 'decision',
  sourceId: 42,
  targetType: 'system_pattern',
  targetId: 27,
  relationType: 'implements',
  description: 'This decision implements the system pattern'
});

if (result.valid && result.created) {
  console.log('Relationship created successfully');
}
```

### Performing a Semantic Search

```javascript
// Search for "knowledge management patterns"
const searchResult = await semanticGraph.semanticSearch({
  conceptQuery: 'knowledge management patterns',
  itemTypes: ['decision', 'system_pattern'],
  limit: 5
});

// Process search results
if (searchResult.valid) {
  for (const result of searchResult.results) {
    console.log(`${result.type}:${result.item.id} - Match: ${result.matchScore}%`);
  }
}
```

### Visualizing a Knowledge Graph

```javascript
// Visualize graph starting from a decision
const graphResult = await semanticGraph.visualizeKnowledgeGraph({
  rootItemType: 'decision',
  rootItemId: 42,
  depth: 2,
  relationshipTypes: ['implements', 'depends_on']
});

// Generate visualization
if (graphResult.valid) {
  console.log(graphResult.visualization.mermaid);
}
```

For complete examples, see [semantic-knowledge-graph-usage.js](../../examples/phase-3/semantic-knowledge-graph-usage.js).

## API Reference

### `createSemanticKnowledgeGraphManager(options)`

Creates a semantic knowledge graph manager with validation.

**Parameters:**
- `options` (Object): Configuration options
  - `workspaceId` (string): ConPort workspace ID
  - `conPortClient` (Object): ConPort client instance

**Returns:**
- Object: Semantic knowledge graph API

### `discoverRelationships(options)`

Discovers potential semantic relationships between knowledge items.

**Parameters:**
- `options` (Object): Discovery options
  - `sourceType` (string): Source item type
  - `sourceId` (string|number): Source item ID
  - `targetTypes` (Array<string>, optional): Types of items to check
  - `similarityThreshold` (number, optional): Minimum similarity threshold (0-1). Default: 0.3
  - `limit` (number, optional): Maximum number of relationships to discover. Default: 10

**Returns:**
- Promise<Object>: Discovery results with validation status

### `createRelationship(relationship)`

Creates a new semantic relationship between two knowledge items.

**Parameters:**
- `relationship` (Object): The relationship to create
  - `sourceType` (string): Source item type
  - `sourceId` (string|number): Source item ID
  - `targetType` (string): Target item type
  - `targetId` (string|number): Target item ID
  - `relationType` (string): Type of relationship
  - `description` (string, optional): Relationship description

**Returns:**
- Promise<Object>: Result of relationship creation

### `semanticSearch(query)`

Performs semantic search across ConPort knowledge items.

**Parameters:**
- `query` (Object): The semantic query parameters
  - `conceptQuery` (string): The concept/query text
  - `itemTypes` (Array<string>, optional): Filter for item types
  - `limit` (number, optional): Maximum number of results. Default: 10

**Returns:**
- Promise<Object>: Search results with validation status

### `visualizeKnowledgeGraph(options)`

Builds a knowledge graph visualization starting from a root item.

**Parameters:**
- `options` (Object): Graph visualization options
  - `rootItemType` (string): Type of the root item
  - `rootItemId` (string|number): ID of the root item
  - `depth` (number, optional): Maximum traversal depth. Default: 2
  - `relationshipTypes` (Array<string>, optional): Filter for relationship types

**Returns:**
- Promise<Object>: Graph visualization data with validation status

## Implementation Considerations

### Semantic Analysis Limitations

The current implementation uses simplified semantic analysis based on text similarity and pattern matching. This provides a foundation for semantic understanding but has limitations:

1. **Content Dependence**: Effectiveness depends on the quality and completeness of item content
2. **Language Understanding**: Limited natural language understanding capabilities
3. **Domain Knowledge**: No domain-specific knowledge incorporated

Future enhancements could address these limitations by integrating with more sophisticated NLP and vector embedding models.

### Performance Considerations

For large knowledge bases, semantic operations can be resource-intensive. Consider these optimization strategies:

1. **Selective Processing**: Process only the most relevant items when possible
2. **Caching**: Cache semantic analysis results for frequently accessed items
3. **Batch Processing**: Process relationships in batches for large operations
4. **Progressive Loading**: Load graph data incrementally for visualization

### Security and Privacy

Since semantic analysis involves processing the content of knowledge items, ensure appropriate access controls are in place:

1. **Access Control**: Only analyze items the user has permission to access
2. **Confidentiality**: Consider marking certain items as exempt from semantic analysis
3. **Audit Trail**: Maintain logs of semantic operations for accountability

## Future Extensions

1. **Advanced NLP Integration**: Integrate with advanced NLP models for better semantic understanding
2. **Automated Knowledge Classification**: Automatically classify knowledge items based on content
3. **Time-Aware Semantic Analysis**: Incorporate temporal aspects in semantic relationships
4. **Interactive Visualizations**: Develop interactive knowledge graph visualizations
5. **Predictive Relationship Suggestions**: Suggest relationships proactively during knowledge creation

## Conclusion

The Semantic Knowledge Graph transforms ConPort from a repository of isolated knowledge artifacts into an interconnected knowledge ecosystem. By automatically discovering relationships, enabling semantic search, and visualizing knowledge connections, it enhances the value and accessibility of organizational knowledge.

This component forms the foundation of Phase 3's Advanced Knowledge Management capabilities and will be extended and integrated with other Phase 3 components to create a comprehensive knowledge management solution.