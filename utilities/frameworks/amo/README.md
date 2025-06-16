# Autonomous Mapping Orchestrator (AMO)

> **Conceptual Framework**: This directory contains AI-readable specifications written in JavaScript syntax. These are design documents, not executable code.

## Overview

The Autonomous Mapping Orchestrator (AMO) is a Phase 4 component that dynamically discovers, maps, and organizes knowledge relationships across the ConPort ecosystem. AMO transforms implicit connections between knowledge artifacts into explicit, navigable knowledge graphs.

## Quick Start

```javascript
// Example: Basic relationship management
const { RelationshipManager } = require('./index');

const manager = new RelationshipManager({
  strictValidation: false,
  autoGenerateMetadata: true
});

// Add a relationship between knowledge artifacts
const relationship = manager.addRelationship({
  sourceType: 'decision',
  sourceId: 'decision-123',
  targetType: 'system_pattern', 
  targetId: 'pattern-456',
  type: 'implements',
  confidence: 0.9
});
```

## Architecture

AMO follows the three-layer Phase 4 architecture pattern:

### Core Layer ([`amo-core.js`](amo-core.js))
- **RelationshipManager**: Manages knowledge artifact relationships
- **MappingOrchestrator**: Orchestrates knowledge mapping using schemas
- **KnowledgeGraphQuery**: Enables querying of the knowledge graph

### Integration Layer ([`amo-integration.js`](amo-integration.js))
- **ConPortAMOIntegration**: Stores/retrieves relationships from ConPort
- **KDAPAMOIntegration**: Knowledge-driven relationship discovery
- **AKAFAMOIntegration**: Adaptive knowledge application through relationships

### Validation Layer ([`amo-validation.js`](amo-validation.js))
- **RelationshipValidator**: Validates relationship structures
- **MappingSchemaValidator**: Validates mapping schemas
- **QueryValidator**: Validates knowledge graph queries

## Key Capabilities

- **Dynamic Relationship Discovery**: Automatically identifies semantic connections
- **Confidence Scoring**: All relationships include reliability scores
- **Bidirectional Mapping**: Maintains context in both directions
- **Schema-Based Mapping**: Configurable rules for relationship discovery
- **Graph Traversal**: Query capabilities for exploring knowledge networks

## Examples

See the [`examples/`](examples/) directory for detailed usage patterns:
- [Basic Usage](examples/basic-usage.js) - Core relationship operations
- [Schema Mapping](examples/schema-mapping.js) - Automated relationship discovery
- [Graph Queries](examples/graph-queries.js) - Knowledge graph exploration
- [ConPort Integration](examples/conport-integration.js) - Persistence operations

## Documentation

- [Architecture Details](docs/architecture.md) - Detailed technical architecture
- [API Reference](docs/api-reference.md) - Complete API documentation
- [Integration Guide](docs/integration-guide.md) - Integration with other components

## Central Documentation

For project-wide context, see:
- [Main Utilities Documentation](../../README.md)
- [Frameworks Overview](../README.md)

## Design Philosophy

AMO specifications use JavaScript syntax for maximum AI comprehension while serving as precise design documents. The code patterns demonstrate intended APIs, data structures, and integration patterns that would be implemented in a real system.

## Related Components

- **KDAP**: Knowledge-Driven Autonomous Planning
- **AKAF**: Adaptive Knowledge Application Framework  
- **SIVS**: Systematic Intelligence Validation System
- **KSE**: Knowledge Synthesis Engine