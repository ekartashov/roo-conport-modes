# Temporal Knowledge Management

The Temporal Knowledge Management component is a sophisticated system for tracking, versioning, and managing knowledge artifacts throughout their lifecycle. It enables precise historical tracking, dependency management, and impact analysis to ensure knowledge coherence across time.

## Overview

In knowledge-intensive environments, understanding how information evolves over time is critical. The Temporal Knowledge Management component addresses this need by implementing a comprehensive versioning and temporal analysis system for all knowledge artifacts within ConPort.

This component enables:

1. **Artifact Versioning** - Track changes to knowledge artifacts over time
2. **Dependency Tracking** - Maintain relationships between interdependent knowledge items
3. **Lifecycle State Management** - Manage the evolution of knowledge through defined states
4. **Impact Analysis** - Understand how changes to one artifact affect others
5. **Temporal Recovery** - Access historical states of knowledge for context or recovery

## Key Concepts

### Knowledge Artifact

A discrete unit of knowledge in the system (decision, pattern, documentation, code, etc.) that evolves over time. Each artifact:
- Has a unique identifier (type + ID)
- Can exist in multiple versions
- Has a lifecycle state
- May have dependencies on other artifacts

### Version

A specific immutable snapshot of an artifact at a point in time. Each version:
- Contains the full content of the artifact at that moment
- Has associated metadata (author, timestamps, reason for change)
- May be tagged for easier retrieval
- Can be linked to a parent version (forming a version history)

### Dependency

A relationship between two artifacts that indicates how they influence each other. Dependencies:
- Have a direction (source → target)
- Have a type (implements, references, documents, etc.)
- Have a strength indicator (high, medium, low)
- Include metadata about the relationship

### Lifecycle State

The current status of an artifact in its evolution. States might include:
- draft
- review
- approved
- active
- deprecated
- archived

## Architecture

The Temporal Knowledge Management system follows a three-layer architecture:

1. **Validation Layer** (`temporal-knowledge-validation.js`)
   - Validates inputs for all operations
   - Ensures data integrity and consistency
   - Provides detailed error messages

2. **Knowledge-First Core** (`temporal-knowledge-core.js`)
   - Implements core temporal functionality
   - Manages version creation and retrieval
   - Handles dependency tracking and analysis
   - Processes lifecycle state transitions

3. **Integration Layer** (`temporal-knowledge.js`)
   - Provides a simplified API for the component
   - Integrates with ConPort for persistence
   - Manages cross-cutting concerns

## Core Features

### Artifact Version Management

The component provides comprehensive version management:

- **Create Versions** - Capture snapshots of artifacts at specific points in time
- **Retrieve Versions** - Access specific versions by ID or timestamp
- **List Versions** - Get a chronological history of an artifact's evolution
- **Compare Versions** - Analyze differences between versions

### Dependency Tracking

Dependencies between artifacts are tracked to maintain knowledge coherence:

- **Register Dependencies** - Create relationships between artifacts
- **List Dependencies** - Discover relationships for a specific artifact
- **Validate Dependencies** - Ensure dependency integrity
- **Remove Dependencies** - Update when relationships no longer apply

### Impact Analysis

Understanding the consequences of changes is essential for knowledge management:

- **Analyze Direct Impact** - Identify artifacts directly affected by a change
- **Trace Dependency Chains** - Discover indirect impacts through dependency networks
- **Assess Change Propagation** - Understand how changes ripple through the system
- **Generate Impact Reports** - Create comprehensive impact assessments

### Lifecycle State Management

Artifacts progress through defined states over time:

- **Update States** - Transition artifacts between states with proper tracking
- **State History** - Maintain a full history of state transitions
- **State Validation** - Ensure valid state transitions based on rules
- **State Metadata** - Capture contextual information about state changes

### Temporal Recovery

Access historical knowledge states:

- **Point-in-Time Recovery** - View the entire state of knowledge at a specific time
- **Version Restoration** - Restore previous versions when needed
- **Branch Management** - Create alternative evolution paths from historical versions
- **Export Historical Data** - Generate exports of historical knowledge

## API Reference

### Initialization

```javascript
const { createTemporalKnowledge } = require('../utilities/phase-3/temporal-knowledge-management/temporal-knowledge');

const temporalKnowledge = createTemporalKnowledge({
  workspaceId: '/path/to/workspace',
  conPortClient: conPortClientInstance,
  enableValidation: true,
  strictMode: false
});
```

### Version Management

#### createVersion(options)

Creates a new version of a knowledge artifact.

```javascript
const version = await temporalKnowledge.createVersion({
  artifactType: 'decision',      // Type of artifact
  artifactId: '123',             // Unique ID within type
  content: { ... },              // Full content snapshot
  metadata: { ... },             // Version metadata
  parentVersionId: 'decision_123_1622547600000', // Optional parent version
  tags: ['important', 'security'], // Optional tags
  lifecycleState: 'approved'     // Optional initial lifecycle state
});
```

#### getVersion(options)

Retrieves a specific version of an artifact.

```javascript
const version = await temporalKnowledge.getVersion({
  artifactType: 'decision',
  artifactId: '123',
  versionId: 'decision_123_1622547600000' // Optional - if omitted, returns latest version
  // OR
  timestamp: '2025-01-15T12:30:45.000Z'   // Optional - returns version closest to timestamp
});
```

#### listVersions(options)

Lists all versions of an artifact.

```javascript
const versions = await temporalKnowledge.listVersions({
  artifactType: 'decision',
  artifactId: '123',
  limit: 10,              // Optional max number of versions to return
  includeContent: false   // Optional - whether to include full content
});
```

#### compareVersions(options)

Compares two versions of an artifact.

```javascript
const comparison = await temporalKnowledge.compareVersions({
  artifactType: 'decision',
  artifactId: '123',
  baseVersionId: 'decision_123_1622547600000',
  targetVersionId: 'decision_123_1625139600000'
});
```

### Dependency Management

#### registerDependency(options)

Creates a dependency between two artifacts.

```javascript
const dependency = await temporalKnowledge.registerDependency({
  sourceType: 'decision',
  sourceId: '123',
  targetType: 'pattern',
  targetId: '456',
  dependencyType: 'implements',
  strength: 'high',
  metadata: { 
    description: 'Decision implemented by pattern',
    createdAt: new Date().toISOString()
  }
});
```

#### getDependencies(options)

Lists dependencies for an artifact.

```javascript
const dependencies = await temporalKnowledge.getDependencies({
  artifactType: 'decision',
  artifactId: '123',
  direction: 'outgoing', // 'incoming', 'outgoing', or 'both'
  types: ['implements', 'references'], // Optional filter by dependency types
  limit: 20
});
```

#### removeDependency(options)

Removes a dependency.

```javascript
const result = await temporalKnowledge.removeDependency({
  dependencyId: 'decision_123_implements_pattern_456'
});
```

### Impact Analysis

#### analyzeImpact(options)

Analyzes the impact of changes to an artifact.

```javascript
const impact = await temporalKnowledge.analyzeImpact({
  artifactType: 'decision',
  artifactId: '123',
  versionId: 'decision_123_1622547600000', // Optional specific version
  direction: 'both', // 'upstream', 'downstream', or 'both'
  depth: 2, // How many levels of dependencies to analyze
  includeWeakDependencies: false // Whether to include low-strength dependencies
});
```

### Lifecycle State Management

#### updateLifecycleState(options)

Updates the lifecycle state of an artifact.

```javascript
const stateChange = await temporalKnowledge.updateLifecycleState({
  artifactType: 'decision',
  artifactId: '123',
  state: 'approved',
  reason: 'Approved by architecture review board',
  metadata: {
    approvedBy: 'John Smith',
    meetingDate: '2025-01-15'
  }
});
```

#### getLifecycleStateHistory(options)

Retrieves the history of state changes for an artifact.

```javascript
const history = await temporalKnowledge.getLifecycleStateHistory({
  artifactType: 'decision',
  artifactId: '123',
  limit: 10
});
```

### Branch Management

#### createBranch(options)

Creates a new branch from an existing version.

```javascript
const branch = await temporalKnowledge.createBranch({
  artifactType: 'document',
  artifactId: 'architecture',
  baseVersionId: 'document_architecture_1622547600000',
  branchName: 'alternative-approach',
  metadata: {
    reason: 'Exploring alternative architecture',
    author: 'Jane Doe'
  }
});
```

#### listBranches(options)

Lists branches for an artifact.

```javascript
const branches = await temporalKnowledge.listBranches({
  artifactType: 'document',
  artifactId: 'architecture'
});
```

### Temporal Recovery

#### getArtifactHistory(options)

Gets the complete history of an artifact including versions and state changes.

```javascript
const history = await temporalKnowledge.getArtifactHistory({
  artifactType: 'decision',
  artifactId: '123',
  includeContent: false,
  limit: 20
});
```

#### exportToConPort(options)

Exports the temporal history of an artifact to ConPort.

```javascript
const exportResult = await temporalKnowledge.exportToConPort({
  artifactType: 'decision',
  artifactId: '123',
  category: 'temporal_exports',
  key: 'decision_123_history'
});
```

## Integration with ConPort

The Temporal Knowledge Management component integrates seamlessly with ConPort:

1. **Storage** - All temporal data is stored in ConPort's custom_data collections with specialized categories:
   - `temporal_knowledge_versions` - Stores all artifact versions
   - `temporal_knowledge_indexes` - Maintains artifact version indexes and metadata
   - `temporal_knowledge_dependencies` - Tracks dependencies between artifacts
   - `temporal_knowledge_branches` - Manages branch information

2. **ConPort Client** - The component requires a ConPort client for persistence operations:
   ```javascript
   const temporalKnowledge = createTemporalKnowledge({
     workspaceId: '/path/to/workspace',
     conPortClient: conPortClientInstance
   });
   ```

3. **Decision and Pattern Integration** - Automatically integrates with ConPort decisions and patterns:
   ```javascript
   // After logging a decision in ConPort
   const decision = await conPortClient.log_decision({
     workspace_id: '/path/to/workspace',
     summary: 'Use JWT for Authentication',
     rationale: 'JWT provides stateless authentication'
   });
   
   // Create a temporal version of it
   await temporalKnowledge.createVersion({
     artifactType: 'decision',
     artifactId: decision.id.toString(),
     content: decision
   });
   ```

## Usage Examples

See [examples/temporal-knowledge-usage.js](../examples/temporal-knowledge-usage.js) for comprehensive usage examples including:

1. Document versioning
2. Knowledge artifact dependencies
3. Temporal recovery and historical context
4. Lifecycle state management

## Best Practices

### When to Create New Versions

Create new versions when:
- Significant content changes occur
- The meaning or implication of an artifact changes
- A formal review or approval happens
- The artifact enters a new lifecycle state

### Dependency Management

- Register dependencies when artifacts are created or updated
- Use appropriate dependency types to clarify relationships
- Set meaningful strength values to aid impact analysis
- Include descriptive metadata for future reference

### Lifecycle States

Define consistent lifecycle states across artifact types:
- **Draft** - Initial creation, subject to change
- **Review** - Under formal review
- **Approved** - Formally accepted
- **Active** - In current use
- **Deprecated** - Still valid but being phased out
- **Archived** - No longer active or relevant

### Impact Analysis

- Perform impact analysis before making significant changes
- Consider both upstream and downstream dependencies
- Pay special attention to high-strength dependencies
- Document potential impacts before proceeding with changes

### Branch Management

- Use branches for exploring alternative approaches
- Create branches when significant divergence is needed
- Maintain clear naming conventions for branches
- Document the purpose of each branch in its metadata

## Implementation Details

### Versioning Strategy

Versions are identified by a composite key:
```
{artifactType}_{artifactId}_{timestamp}
```

For example:
```
decision_123_1622547600000
```

This scheme enables:
- Unique identification of each version
- Easy retrieval by type and ID
- Chronological ordering of versions
- Point-in-time recovery

### Dependency Identification

Dependencies are identified by a composite key:
```
{sourceType}_{sourceId}_{dependencyType}_{targetType}_{targetId}
```

For example:
```
decision_123_implements_pattern_456
```

This scheme enables:
- Unique identification of each dependency
- Bidirectional lookup (source to target, target to source)
- Filtering by dependency type

### Optimistic Concurrency

The system uses timestamps for optimistic concurrency control:
- Each operation includes a timestamp
- Operations are rejected if more recent changes exist
- This prevents data loss in concurrent editing scenarios

### Performance Considerations

The component includes optimizations for:
- Caching frequently accessed artifacts
- Minimizing ConPort API calls
- Efficient storage of version differences
- Lazy loading of version content for large artifacts

## Conclusion

The Temporal Knowledge Management component provides a robust foundation for tracking knowledge evolution over time. By capturing versions, dependencies, and lifecycle states, it ensures that the knowledge base maintains coherence and accuracy throughout its lifecycle.