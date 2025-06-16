# Cognitive Continuity Framework (CCF)

## Overview

The Cognitive Continuity Framework (CCF) ensures knowledge persistence and continuity across different AI agents, sessions, and time periods. CCF is a critical component of the Phase 4 cognitive architecture, enabling seamless knowledge transfer between different system components and maintaining cognitive coherence over time.

CCF manages context states, tracks knowledge transitions, coordinates sessions, and provides mechanisms for continuity operations such as saving, loading, transferring, merging, and diffing cognitive contexts.

## Architecture

CCF follows a three-layer architecture pattern:

```
┌─────────────────────────────────────────────┐
│                                             │
│               Integration Layer             │
│  (Connects with ConPort, KSE, AMO, etc.)    │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│                  Core Layer                 │
│  (Core functionality for context management)│
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│               Validation Layer              │
│       (Ensures data integrity)              │
│                                             │
└─────────────────────────────────────────────┘
```

### Core Components

- **ContinuityCoordinator**: Main entry point that orchestrates all CCF operations
- **ContextStateManager**: Manages the creation, retrieval, and manipulation of context states
- **ContinuityOperationHandler**: Processes continuity operations like save, load, transfer, etc.
- **SessionTracker**: Manages and tracks agent sessions
- **KnowledgeTransitionTracker**: Records and retrieves knowledge state transitions
- **InMemoryStorage**: Default in-memory implementation of storage interface
- **ConPortStorageProvider**: Persistent storage implementation using ConPort

## Key Features

1. **Context State Management**
   - Create, retrieve, update, and delete context states
   - Search for context states by various criteria
   - Advanced filtering capabilities

2. **Continuity Operations**
   - Save: Create or update context states
   - Load: Retrieve context states by ID or criteria
   - Transfer: Move context from one agent to another
   - Merge: Combine multiple context states using different strategies
   - Diff: Compare context states to identify differences
   - Snapshot: Create point-in-time context snapshots
   - Restore: Return to a previous context state

3. **Knowledge Transition Tracking**
   - Record transitions between knowledge states
   - Track how knowledge evolves over time
   - Create comprehensive history for agents and contexts

4. **Session Management**
   - Track active and historical agent sessions
   - Associate context changes with specific sessions
   - Manage session metadata and state

5. **Integration with Other Components**
   - ConPort for persistent storage
   - KSE (Knowledge Synthesis Engine) for context synthesis
   - AMO (Autonomous Mapping Orchestrator) for knowledge mapping
   - KDAP (Knowledge-Driven Autonomous Planning) for context-aware planning
   - AKAF (Adaptive Knowledge Application Framework) for knowledge acquisition

## Usage Examples

### Basic Usage

```javascript
const { CCFIntegration } = require('./utilities/phase-4/ccf');

// Create an integration instance
const ccf = new CCFIntegration({
  conportClient: conportClient,
  workspaceId: '/path/to/workspace',
  kseClient: kseClient // Optional
});

// Start a session
const session = await ccf.startSession({ 
  agentId: 'agent-123',
  metadata: { source: 'chat', taskId: 'task-456' } 
});

// Save a context state
const result = await ccf.saveContext({
  contextState: {
    agentId: 'agent-123',
    content: {
      topics: ['javascript', 'frameworks'],
      entities: {
        'react': { type: 'framework', attributes: { ecosystem: 'frontend' } }
      },
      facts: [
        { subject: 'react', predicate: 'created_by', object: 'facebook' }
      ]
    },
    sessionId: session.id
  }
});

// Load a context state
const loadResult = await ccf.loadContext({
  contextId: result.contextState.id
});

// End the session
await ccf.endSession(session.id);
```

### Context Transfer Between Agents

```javascript
// Transfer context from agent1 to agent2
const transferResult = await ccf.transferContext({
  sourceAgentId: 'agent1',
  targetAgentId: 'agent2',
  contextId: 'context-123'
});
```

### Merging Contexts

```javascript
// Merge multiple contexts
const mergeResult = await ccf.mergeContexts({
  contextIds: ['context-1', 'context-2', 'context-3'],
  strategy: 'latest-wins',
  options: { 
    priorityFields: ['facts', 'entities']
  }
});
```

### Creating and Restoring Snapshots

```javascript
// Create a snapshot of agent's context
const snapshotResult = await ccf.createSnapshot({
  agentId: 'agent-123',
  label: 'Pre-deployment checkpoint'
});

// Later, restore the snapshot
const restoreResult = await ccf.restoreSnapshot({
  snapshotId: snapshotResult.snapshot.id,
  targetAgentId: 'agent-123' // can also restore to a different agent
});
```

### Knowledge Synthesis with KSE

```javascript
// Synthesize context history using KSE
const synthesisResult = await ccf.synthesizeContextHistory({
  contextId: 'context-123',
  strategy: 'conceptual-merge',
  strategyParams: {
    focusAreas: ['decisions', 'insights']
  }
});
```

## Integration Points

CCF integrates with other Phase 4 components as follows:

1. **ConPort**
   - Primary storage backend for CCF data
   - Stores context states, sessions, transitions, and snapshots
   - Enables persistence across system restarts

2. **Knowledge Synthesis Engine (KSE)**
   - Synthesizes context history into coherent knowledge
   - Combines multiple context states using advanced strategies
   - Extracts patterns and relationships from context transitions

3. **Autonomous Mapping Orchestrator (AMO)**
   - Maps context states to different knowledge representations
   - Enables compatibility between different agent knowledge formats
   - Facilitates context sharing across heterogeneous systems

4. **Knowledge-Driven Autonomous Planning (KDAP)**
   - Uses context history to plan future knowledge acquisition
   - Creates strategies based on identified knowledge gaps
   - Optimizes learning trajectories from context transitions

5. **Adaptive Knowledge Application Framework (AKAF)**
   - Acquires knowledge from context states
   - Applies context-aware strategies to knowledge acquisition
   - Dynamically adapts to evolving context

## API Reference

### CCFIntegration

Main integration class that provides the primary interface to CCF.

#### Constructor

```javascript
new CCFIntegration({
  conportClient,     // Required: ConPort client instance
  workspaceId,       // Required: Workspace ID for ConPort
  kseClient,         // Optional: KSE client
  amoClient,         // Optional: AMO client
  kdapClient,        // Optional: KDAP client
  akafClient,        // Optional: AKAF client
  logger             // Optional: Logger instance (defaults to console)
})
```

#### Methods

- **saveContext({ contextState, sessionId })**
  - Saves a context state
  - Returns: Operation result with saved context state

- **loadContext({ contextId, criteria, sessionId })**
  - Loads a context state by ID or criteria
  - Returns: Operation result with loaded context state

- **transferContext({ sourceAgentId, targetAgentId, contextId, contextFilter })**
  - Transfers context between agents
  - Returns: Operation result with transferred context state

- **mergeContexts({ contextIds, strategy, options })**
  - Merges multiple context states
  - Returns: Operation result with merged context state

- **createSnapshot({ agentId, label })**
  - Creates a snapshot of agent's context states
  - Returns: Operation result with created snapshot

- **restoreSnapshot({ snapshotId, targetAgentId })**
  - Restores a snapshot
  - Returns: Operation result with restored context states

- **diffContexts({ baseContextId, compareContextId })**
  - Compares two context states
  - Returns: Operation result with differences

- **startSession({ agentId, metadata })**
  - Starts a new session
  - Returns: Created session

- **endSession(sessionId)**
  - Ends a session
  - Returns: Ended session

- **getSession(sessionId)**
  - Gets a session by ID
  - Returns: Session or null

- **findSessions(criteria)**
  - Finds sessions matching criteria
  - Returns: Array of matching sessions

- **getContextState(contextId)**
  - Gets a context state by ID
  - Returns: Context state or null

- **findContextStates(criteria)**
  - Finds context states matching criteria
  - Returns: Array of matching context states

- **getContextHistory(contextId)**
  - Gets context transition history
  - Returns: Array of transitions

- **getAgentHistory(agentId)**
  - Gets agent transition history
  - Returns: Array of transitions

- **synthesizeContextHistory({ contextId, strategy, strategyParams })**
  - Synthesizes knowledge from context history using KSE
  - Returns: Synthesized result

- **mapContextToKnowledge({ contextId, targetType, mappingOptions })**
  - Maps context to a different knowledge representation using AMO
  - Returns: Mapped knowledge

- **acquireKnowledgeFromContext({ contextId, knowledgeTypes, acquisitionParams })**
  - Acquires knowledge from a context using AKAF
  - Returns: Acquired knowledge

- **planKnowledgeAcquisition({ agentId, goal, planningParams })**
  - Plans based on context transitions using KDAP
  - Returns: Knowledge acquisition plan

### Merge Strategies

CCF provides several strategies for merging context states:

- **latest-wins**: Uses the most recent values for overlapping fields
- **oldest-wins**: Preserves the earliest values for overlapping fields
- **union**: Combines arrays and sets, preserves unique values
- **intersection**: Keeps only values present in all context states
- **append**: Appends values from all context states (may create duplicates)
- **custom**: User-defined merge strategy

## Development

To run tests:

```bash
cd utilities/phase-4/ccf
node tests/ccf.test.js
```

## License

Internal use only.