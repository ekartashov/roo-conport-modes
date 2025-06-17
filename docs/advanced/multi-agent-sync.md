# Multi-Agent Knowledge Synchronization

This document describes the Multi-Agent Knowledge Synchronization component, which enables ConPort knowledge sharing and synchronization between multiple agents within a project or across projects.

## Overview

The Multi-Agent Knowledge Synchronization system allows different AI agents (such as multiple Roo instances or other AI assistants) to share and maintain consistent knowledge through ConPort. This system facilitates collaborative work, knowledge transfer, and specialized domain expertise while ensuring that critical project information remains synchronized.

## Architecture

The Multi-Agent Knowledge Synchronization component follows our standard three-layer architecture:

1. **Validation Layer** (`sync-validation.js`): Validates input parameters for all synchronization operations
2. **Knowledge-First Core** (`sync-core.js`): Core synchronization logic independent of ConPort integration
3. **Integration Layer** (`multi-agent-sync.js`): Integrates with ConPort and provides a simplified API

### System Components

![Multi-Agent Synchronization Architecture](../assets/multi-agent-sync-architecture.png)

The Multi-Agent Knowledge Synchronization system consists of several key components:

* **Agent Registry**: Maintains information about registered agents and their capabilities
* **Knowledge Store**: Manages knowledge artifacts for each agent
* **Conflict Detection**: Identifies conflicts when synchronizing knowledge between agents
* **Conflict Resolution**: Provides strategies for resolving conflicts
* **Sync Sessions**: Manages multi-agent synchronization operations
* **Integration Layer**: Connects the system with ConPort's storage and retrieval functions

## Key Features

### Agent Management

* Register new agents with their capabilities and sync preferences
* Update agent information and capabilities
* List and query registered agents

### Knowledge Transfer

* Push knowledge from one agent to another
* Pull knowledge from a source agent to a target agent
* Support for selective synchronization by artifact type

### Conflict Management

* Automatic conflict detection during synchronization
* Multiple conflict resolution strategies (source wins, target wins, merge, custom)
* Manual conflict resolution with detailed conflict information

### Sync Sessions

* Create multi-agent synchronization sessions
* Track synchronization progress and status
* Support for different synchronization modes

### ConPort Integration

* Seamless integration with ConPort's storage and retrieval functions
* Automatic logging of synchronization operations
* Conflict resolution that updates ConPort with resolved artifacts

## API Reference

### Initialization

```javascript
const { createMultiAgentSyncSystem } = require('../../utilities/phase-3/multi-agent-sync/multi-agent-sync');

const syncSystem = createMultiAgentSyncSystem({
  workspaceId: '/path/to/workspace',
  conPortClient: conPortClientInstance,
  enableValidation: true,
  defaultSyncPreferences: {},
  logger: customLogger
});

await syncSystem.initialize();
```

#### Parameters:

* `workspaceId` (string, required): Workspace identifier for ConPort operations
* `conPortClient` (object, required): ConPort client instance
* `enableValidation` (boolean, optional, default: true): Whether to enable input validation
* `defaultSyncPreferences` (object, optional): Default synchronization preferences for agents
* `logger` (object, optional, default: console): Logger instance

### Agent Management

#### Register Agent

```javascript
const agent = await syncSystem.registerAgent({
  agentId: 'roo-primary',
  agentType: 'roo',
  displayName: 'Primary Development Roo',
  capabilities: {
    canPush: true,
    canPull: true,
    canResolveConflicts: true
  },
  syncPreferences: {
    autoSync: true,
    syncFrequency: 'high',
    priorityArtifacts: ['decision', 'system_pattern']
  },
  metadata: {
    region: 'us-west',
    team: 'core-dev'
  }
});
```

#### Get Agents

```javascript
// Get all agents
const allAgents = await syncSystem.getAgents();

// Get agents by type
const rooAgents = await syncSystem.getAgents({ type: 'roo' });

// Get agents with their capabilities
const agentsWithCapabilities = await syncSystem.getAgents({ includeCapabilities: true });

// Get agents with their sync history
const agentsWithHistory = await syncSystem.getAgents({ includeSyncHistory: true });
```

#### Update Agent

```javascript
const updatedAgent = await syncSystem.updateAgent('roo-primary', {
  displayName: 'Updated Development Roo',
  syncPreferences: {
    autoSync: false
  }
});
```

### Knowledge Synchronization

#### Push Knowledge

```javascript
const pushResult = await syncSystem.pushKnowledge({
  sourceAgentId: 'roo-primary',
  targetAgentId: 'roo-backend',
  artifactTypes: ['decision', 'system_pattern'],
  syncMode: 'incremental',
  forceSync: false
});
```

#### Pull Knowledge

```javascript
const pullResult = await syncSystem.pullKnowledge({
  targetAgentId: 'claude-ai',
  sourceAgentId: 'roo-primary',
  artifactTypes: ['decision'],
  syncMode: 'incremental',
  conflictStrategy: 'target-wins'
});
```

#### Compare Knowledge

```javascript
const compareResult = await syncSystem.compareKnowledge({
  sourceAgentId: 'roo-backend',
  targetAgentId: 'claude-ai',
  artifactTypes: ['decision'],
  diffAlgorithm: 'default'
});
```

### Sync Sessions

#### Create Sync Session

```javascript
const session = await syncSystem.createSyncSession({
  sessionId: 'session-123',
  agentIds: ['roo-primary', 'roo-backend', 'claude-ai'],
  syncMode: 'bidirectional',
  artifactTypes: ['decision', 'system_pattern', 'progress'],
  syncRules: {
    conflictStrategy: 'manual-resolution',
    prioritizeNewest: true,
    includeMetadata: true
  }
});
```

#### Get Sync Sessions

```javascript
// Get a specific session
const session = await syncSystem.getSyncSessions({ sessionId: 'session-123' });

// Get sessions by status
const activeSessions = await syncSystem.getSyncSessions({ status: 'active' });

// Get sessions by agent
const agentSessions = await syncSystem.getSyncSessions({ agentId: 'roo-primary' });
```

#### Get Sync Status

```javascript
// Get status for a session
const sessionStatus = await syncSystem.getSyncStatus({ sessionId: 'session-123' });

// Get status for an agent
const agentStatus = await syncSystem.getSyncStatus({ agentId: 'roo-primary' });
```

### Conflict Resolution

```javascript
const resolution = await syncSystem.resolveConflict({
  sessionId: 'session-123',
  conflictId: 'conflict-456',
  resolution: 'merge',
  customResolution: { ... },
  applyImmediately: true
});
```

## Common Usage Patterns

### Team Collaboration

```javascript
// Register team members' Roo instances
await syncSystem.registerAgent({ 
  agentId: 'developer1-roo', 
  agentType: 'roo', 
  displayName: 'Developer 1 Roo' 
});

await syncSystem.registerAgent({ 
  agentId: 'developer2-roo', 
  agentType: 'roo', 
  displayName: 'Developer 2 Roo' 
});

// Create a team sync session
const teamSession = await syncSystem.createSyncSession({
  sessionId: 'team-sync',
  agentIds: ['developer1-roo', 'developer2-roo'],
  syncMode: 'bidirectional'
});
```

### Knowledge Transfer Between Projects

```javascript
// Push selected knowledge from one project to another
await syncSystem.pushKnowledge({
  sourceAgentId: 'project-a-roo',
  targetAgentId: 'project-b-roo',
  artifactTypes: ['system_pattern'],
  filters: {
    tags: ['reusable', 'core-patterns']
  }
});
```

### Specialized Domain Knowledge

```javascript
// Frontend specialist pulls backend knowledge
await syncSystem.pullKnowledge({
  targetAgentId: 'frontend-specialist',
  sourceAgentId: 'backend-specialist',
  artifactTypes: ['decision', 'system_pattern'],
  filters: {
    tags: ['api-integration']
  }
});
```

## Best Practices

### Agent Registration

* Use consistent naming conventions for agent IDs
* Clearly specify agent capabilities to prevent unauthorized operations
* Include relevant metadata to facilitate agent discovery and management

### Conflict Resolution

* Define clear conflict resolution strategies in advance
* Use manual resolution for critical artifacts that require human judgment
* Document resolution decisions in ConPort for future reference

### Sync Sessions

* Use session IDs that include timestamps or meaningful identifiers
* Include only relevant agents in sync sessions to minimize conflicts
* Define appropriate sync rules based on the session's purpose

### Performance Considerations

* Use incremental sync mode for large knowledge bases
* Limit artifact types to those relevant for the specific synchronization
* Consider using filters to reduce the amount of data transferred

## Integration with Other Components

### Temporal Knowledge Management

The Multi-Agent Knowledge Synchronization system can be integrated with Temporal Knowledge Management to synchronize knowledge across time-based snapshots:

```javascript
// Pull knowledge from a specific historical snapshot
await syncSystem.pullKnowledge({
  targetAgentId: 'current-agent',
  sourceAgentId: 'historical-agent',
  filters: {
    timestamp: {
      after: '2024-01-01T00:00:00Z',
      before: '2024-02-01T00:00:00Z'
    }
  }
});
```

### Knowledge Quality Enhancement

Combining Multi-Agent Sync with Knowledge Quality Enhancement ensures that only high-quality knowledge is synchronized:

```javascript
// Push only validated knowledge
await syncSystem.pushKnowledge({
  sourceAgentId: 'quality-agent',
  targetAgentId: 'target-agent',
  filters: {
    qualityScore: { min: 0.8 }
  }
});
```

### Advanced ConPort Analytics

The Multi-Agent Knowledge Synchronization system generates events that can be analyzed using Advanced ConPort Analytics:

```javascript
// Analyze sync patterns
const syncAnalytics = await analyticsSystem.analyzeEvents({
  eventType: 'sync_operations',
  timeframe: 'last_30_days',
  groupBy: 'agent'
});
```

## Conclusion

The Multi-Agent Knowledge Synchronization component enables collaborative knowledge management across multiple agents, ensuring that critical project information remains consistent and accessible. By leveraging this system, teams can benefit from specialized agent expertise while maintaining a shared understanding of key decisions, patterns, and progress.

For practical examples, see [multi-agent-sync-usage.js](../../examples/phase-3/multi-agent-sync-usage.js).