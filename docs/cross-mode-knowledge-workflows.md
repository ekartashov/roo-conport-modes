# Cross-Mode Knowledge Workflows

## Overview

The Cross-Mode Knowledge Workflows component enables the seamless transfer of knowledge context between different ConPort modes. This facilitates continuous knowledge preservation and utilization across different stages of the software development lifecycle, ensuring that insights, decisions, and context are properly maintained as work transitions between modes such as `architect`, `code`, `debug`, and `docs`.

This component is part of Phase 3: Advanced Knowledge Management, building on the foundations established in Phases 1 and 2.

## Key Features

- **Knowledge Context Serialization**: Automatically adapts knowledge context for transfer between different modes
- **Workflow State Management**: Tracks multi-step workflows across mode transitions
- **Cross-Mode References**: Creates and maintains references between artifacts in different modes
- **ConPort Integration**: Records decisions, patterns, and progress for all cross-mode operations
- **Validation**: Ensures data integrity and proper format for all operations

## Architecture

The Cross-Mode Knowledge Workflows component follows a layered architecture pattern:

### 1. Validation Layer (`cross-mode-workflows-validation.js`)

The validation layer ensures that all inputs to the system are properly formatted and valid. It provides:
- Schema validation for workflow definitions
- Validation for workflow operations
- Input format checking for knowledge context transfers

### 2. Knowledge-First Core (`cross-mode-workflows-core.js`)

The core layer implements the fundamental operations and knowledge management capabilities:
- Context serialization and deserialization between modes
- Workflow state management
- Cross-mode reference tracking
- Knowledge persistence within ConPort

### 3. Integration Layer (`cross-mode-workflows.js`)

The integration layer combines validation and core functionality, providing a simplified API for:
- Creating and managing workflows
- Transferring knowledge between modes
- Creating and querying cross-mode references
- Logging operations in ConPort
- Preserving decisions and system patterns

## API Reference

### Main Module: `createCrossModeWorkflows(options)`

Creates a cross-mode knowledge workflows manager with integrated validation.

#### Parameters

- `options` (Object): Configuration options
  - `workspaceId` (string, required): ConPort workspace ID
  - `conPortClient` (Object, required): ConPort client instance
  - `enableValidation` (boolean, optional): Enable input validation (default: true)
  - `strictMode` (boolean, optional): Throw errors on validation failures (default: false)

#### Returns

Object with the following methods:

#### `async createWorkflow(workflowDefinition, initialContext)`

Creates a new cross-mode workflow.

- `workflowDefinition` (Object): Workflow definition with steps
  - `id` (string): Unique workflow identifier
  - `name` (string): Human-readable name
  - `steps` (Array): Ordered array of workflow steps
    - `mode` (string): Target mode for this step (e.g., 'architect', 'code')
    - `task` (string): Description of the task to be performed
- `initialContext` (Object, optional): Initial workflow context
- **Returns**: Created workflow object

#### `async advanceWorkflow(workflowId, currentStepResults)`

Advances a workflow to the next step.

- `workflowId` (string): ID of the workflow to advance
- `currentStepResults` (Object, optional): Results from the current step
- **Returns**: Updated workflow object

#### `async getWorkflow(workflowId)`

Gets the current state of a workflow.

- `workflowId` (string): ID of the workflow
- **Returns**: Current workflow state

#### `async listWorkflows(options)`

Lists all active workflows.

- `options` (Object, optional): Filter options
  - `status` (string, optional): Filter by workflow status
- **Returns**: List of workflows

#### `async transferKnowledgeContext(options)`

Transfers knowledge context between modes.

- `options` (Object): Transfer options
  - `context` (Object): Knowledge context to transfer
  - `sourceMode` (string): Source mode
  - `targetMode` (string): Target mode
  - `workflowId` (string, optional): Associated workflow ID
  - `preserveWorkflowContext` (boolean, optional): Whether to preserve workflow context (default: true)
- **Returns**: Transferred knowledge context

#### `async createReference(reference)`

Creates a cross-mode knowledge reference.

- `reference` (Object): The cross-mode reference
  - `sourceMode` (string): Source mode
  - `sourceArtifact` (string): Source artifact identifier
  - `targetMode` (string): Target mode
  - `targetArtifact` (string): Target artifact identifier
  - `referenceType` (string): Type of reference
  - `description` (string, optional): Description of the reference
- **Returns**: Created reference object

#### `async getReferences(options)`

Gets cross-mode references filtered by various criteria.

- `options` (Object): Query options
  - `mode` (string, optional): Mode to filter by
  - `artifact` (string, optional): Artifact to filter by
  - `referenceType` (string, optional): Reference type to filter by
  - `isSource` (boolean, optional): Whether to search as source (true) or target (false) (default: true)
- **Returns**: Array of matching references

#### `async exportWorkflowToConPort(workflowId, category, key)`

Exports a workflow context to ConPort custom data.

- `workflowId` (string): Workflow ID
- `category` (string): ConPort custom data category
- `key` (string): ConPort custom data key
- **Returns**: Export result object

#### `async serializeWorkflowContext(workflowId)`

Creates a serialized JSON representation of a workflow's knowledge context.

- `workflowId` (string): Workflow ID
- **Returns**: Serialized workflow context object

## Usage Examples

### Basic Workflow Creation

```javascript
const { createCrossModeWorkflows } = require('../utilities/phase-3/cross-mode-knowledge-workflows/cross-mode-workflows');

// Initialize with ConPort client
const workflowManager = createCrossModeWorkflows({
  workspaceId: '/path/to/workspace',
  conPortClient: conPortClient
});

// Define a workflow
const workflowDefinition = {
  id: 'feature-xyz',
  name: 'Implement XYZ Feature',
  steps: [
    {
      mode: 'architect',
      task: 'Design XYZ feature architecture'
    },
    {
      mode: 'code',
      task: 'Implement XYZ feature'
    },
    {
      mode: 'debug',
      task: 'Test and debug XYZ feature'
    }
  ]
};

// Initial context
const initialContext = {
  taskDescription: 'Implement XYZ feature for the application',
  requirements: ['Req1', 'Req2'],
  priority: 'high'
};

// Create workflow
const workflow = await workflowManager.createWorkflow(workflowDefinition, initialContext);
```

### Transferring Context Between Modes

```javascript
// Architect mode produces design artifacts
const architectResults = {
  architecturalDecisions: [
    { id: 'decision-1', description: 'Use pattern X' }
  ],
  patterns: [
    { name: 'Pattern X', description: 'Description' }
  ]
};

// Advance workflow to code mode
await workflowManager.advanceWorkflow('feature-xyz', architectResults);

// Transfer context from architect to code mode
const codeContext = await workflowManager.transferKnowledgeContext({
  context: {...initialContext, ...architectResults},
  sourceMode: 'architect',
  targetMode: 'code',
  workflowId: 'feature-xyz'
});
```

### Creating Cross-Mode References

```javascript
// Create a reference between an architectural decision and its code implementation
await workflowManager.createReference({
  sourceMode: 'architect',
  sourceArtifact: 'decision-1',
  targetMode: 'code',
  targetArtifact: 'component/file.js',
  referenceType: 'implements',
  description: 'Implementation of architectural decision'
});

// Query references to find all implementations of architectural decisions
const references = await workflowManager.getReferences({
  mode: 'architect',
  isSource: true,
  referenceType: 'implements'
});
```

For more detailed examples, see the `examples/cross-mode-workflows-usage.js` file.

## Integration with Mode Enhancements

The Cross-Mode Knowledge Workflows component can be integrated with mode enhancements from Phase 2:

```javascript
const { enhanceArchitectMode } = require('../utilities/mode-enhancements/architect-mode-enhancement');
const { createCrossModeWorkflows } = require('../utilities/phase-3/cross-mode-knowledge-workflows/cross-mode-workflows');

function enhancedArchitectWithWorkflows(options) {
  // Initialize cross-mode workflows
  const workflows = createCrossModeWorkflows({
    workspaceId: options.workspaceId,
    conPortClient: options.conPortClient
  });
  
  // Get enhanced architect mode
  const enhancedArchitect = enhanceArchitectMode(options);
  
  // Add workflow capabilities
  return {
    ...enhancedArchitect,
    
    // Add method to transition to code mode
    async transitionToCodeMode(context) {
      return workflows.transferKnowledgeContext({
        context,
        sourceMode: 'architect',
        targetMode: 'code'
      });
    }
  };
}
```

## Best Practices

### Workflow Design

1. **Task Granularity**: Design workflow steps with appropriate granularity - not too broad, not too specific
2. **Context Preservation**: Include all relevant context when advancing workflows
3. **Knowledge Capture**: Document decisions and patterns at each workflow step
4. **Reference Creation**: Create explicit references between related artifacts across modes

### Knowledge Transfer

1. **Filter Irrelevant Context**: Only transfer context that's relevant to the target mode
2. **Transform Data**: Format data appropriately for the target mode
3. **Preserve Workflow Metadata**: Always include workflow ID and state in transfers
4. **ConPort Documentation**: Log decisions about significant transformations

### Error Handling

1. **Validation First**: Enable validation to catch issues early
2. **Graceful Degradation**: Use non-strict mode in production to prevent failures
3. **Error Logging**: Log all errors to ConPort for future reference
4. **Recovery Strategies**: Implement recovery strategies for failed workflows

## ConPort Knowledge Integration

The Cross-Mode Knowledge Workflows component integrates with ConPort in several ways:

1. **Workflow State**: Stores workflow state in ConPort's custom data storage
2. **Decision Logging**: Records decisions for workflow transitions
3. **Pattern Recognition**: Identifies and logs knowledge transfer patterns
4. **Progress Tracking**: Tracks workflow progress through ConPort
5. **References**: Maintains a knowledge graph of cross-mode artifact references

## Future Enhancements

Potential future enhancements for this component include:

1. **Visual Workflow Editor**: A UI for creating and managing workflows
2. **Workflow Templates**: Predefined workflow templates for common scenarios
3. **Advanced Context Transformation**: More sophisticated context transformation rules
4. **Metrics and Analytics**: Track workflow efficiency and knowledge utilization
5. **AI-Driven Knowledge Transfer**: Use AI to optimize context transfer between modes

## Related System Patterns

- **Pattern #20**: Documentation Knowledge Graph
- **Pattern #27**: ConPort-First Knowledge Operation Pattern
- **Pattern #28**: Unified Context Refresh Protocol
- **Pattern #35**: Knowledge Metrics Multi-Dimension Assessment Pattern
- **Pattern #36**: Semantic Knowledge Graph Pattern

## Conclusion

The Cross-Mode Knowledge Workflows component provides a robust framework for maintaining knowledge continuity across different modes in the software development lifecycle. By ensuring that context, decisions, and insights are preserved and properly transferred between modes, it enables more efficient collaboration and knowledge preservation throughout the development process.