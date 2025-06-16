# Cross-Mode Knowledge Workflows

## Overview
The Cross-Mode Knowledge Workflows component enables seamless knowledge transfer between different Roo modes, allowing continuous knowledge context preservation throughout multi-step workflows. This component manages the serialization, transformation, and adaptation of context data as it moves between specialized modes such as Code, Architect, Debug, and more.

## Architecture
This component follows the standard three-layer architecture pattern:

1. **Validation Layer** - Validates inputs for workflow operations and context transfers
2. **Core Layer** - Implements core business logic for workflow state management and context transformations
3. **Integration Layer** - Connects with ConPort client and provides a simplified API

## Features

### Knowledge Context Transfer
- Intelligent context mapping between different modes
- Preservation of relevant information across mode transitions
- Mode-specific transformations to adapt context to each mode's requirements

### Workflow Management
- Define multi-step workflows with specific mode sequences
- Track workflow state and progress
- Capture decisions and context at each transition point

### Cross-Mode References
- Create and manage references between artifacts in different modes
- Query related artifacts across mode boundaries
- Build a connected knowledge graph spanning multiple modes

### ConPort Integration
- Persistent storage of workflows in ConPort
- Automatic logging of workflow operations
- Decision logging for mode transitions

## Usage

```javascript
const { createCrossModeWorkflows } = require('./index');

// Initialize with ConPort client
const crossModeWorkflows = createCrossModeWorkflows({
  workspaceId: '/path/to/workspace',
  conPortClient: conPortClient,
  enableValidation: true
});

// Define a multi-step workflow
const workflow = await crossModeWorkflows.createWorkflow({
  id: 'feature-implementation-workflow',
  name: 'Feature Implementation Workflow',
  steps: [
    { mode: 'architect', task: 'Design the feature architecture' },
    { mode: 'code', task: 'Implement the feature' },
    { mode: 'debug', task: 'Test and debug the implementation' },
    { mode: 'docs', task: 'Document the feature' }
  ]
}, {
  taskDescription: 'Implement user authentication system',
  priority: 'high',
  constraints: ['Must use JWT', 'Must support refresh tokens']
});

// Advance the workflow to the next step with results from the current step
const updatedWorkflow = await crossModeWorkflows.advanceWorkflow(
  'feature-implementation-workflow',
  {
    architecturalDecisions: [
      { decision: 'Use JWT for authentication', rationale: 'Industry standard' },
      { decision: 'Implement refresh token rotation', rationale: 'Enhanced security' }
    ],
    patterns: ['Token-based Authentication', 'Session Management']
  }
);

// Transfer context between modes manually
const transferredContext = await crossModeWorkflows.transferKnowledgeContext({
  context: currentContext,
  sourceMode: 'code',
  targetMode: 'debug',
  workflowId: 'feature-implementation-workflow'
});
```

## API Reference

### Workflow Management

#### `createWorkflow(workflowDefinition, initialContext)`
Creates a new cross-mode workflow.

#### `advanceWorkflow(workflowId, currentStepResults)`
Advances a workflow to the next step, incorporating results from the current step.

#### `getWorkflow(workflowId)`
Gets the current state of a workflow.

#### `listWorkflows(options)`
Lists all active workflows, optionally filtered by status.

### Knowledge Transfer

#### `transferKnowledgeContext(options)`
Transfers knowledge context between modes, with intelligent field mapping.

### Cross-Mode References

#### `createReference(reference)`
Creates a cross-mode knowledge reference.

#### `getReferences(options)`
Gets cross-mode references filtered by various criteria.

### Export and Serialization

#### `exportWorkflowToConPort(workflowId, category, key)`
Exports a workflow context to ConPort custom data.

#### `serializeWorkflowContext(workflowId)`
Creates a serialized JSON representation of a workflow's knowledge context.

## Dependencies
- ConPort client library