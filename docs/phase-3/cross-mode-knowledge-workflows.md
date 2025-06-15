# Cross-Mode Knowledge Workflows

This document describes the Cross-Mode Knowledge Workflows component, which enables seamless knowledge sharing and coordination between different Roo modes.

## Overview

The Cross-Mode Knowledge Workflows system provides mechanisms for knowledge transfer, coordinated operations, and context preservation as users switch between different Roo modes. This ensures consistent knowledge representation and utilization across various specialized modes, enhancing the cohesive agent experience.

## Architecture

The Cross-Mode Knowledge Workflows component follows our standard three-layer architecture:

1. **Validation Layer** (`cross-mode-workflows-validation.js`): Validates input parameters for all workflow operations
2. **Knowledge-First Core** (`cross-mode-workflows-core.js`): Core workflow logic independent of ConPort integration
3. **Integration Layer** (`cross-mode-workflows.js`): Integrates with ConPort and provides a simplified API

### System Components

![Cross-Mode Knowledge Workflows Architecture](../assets/cross-mode-workflows-architecture.png)

The Cross-Mode Knowledge Workflows system consists of several key components:

* **Workflow Definitions**: Templates for common cross-mode knowledge flows
* **Context Transfer**: Mechanisms for preserving context during mode transitions
* **Knowledge Routing**: Intelligent routing of knowledge to appropriate modes
* **Mode Coordination**: Facilitation of cooperative work between modes
* **Knowledge Reconciliation**: Resolution of conflicts between mode-specific knowledge

## Key Features

### Workflow Management

* Definition and execution of cross-mode workflows
* Support for both predefined and dynamic workflows
* Monitoring and status tracking for active workflows

### Context Preservation

* Seamless transfer of relevant context during mode switches
* Selective context filtering based on mode requirements
* Automatic context enrichment during transitions

### Knowledge Routing

* Intelligent distribution of knowledge to appropriate modes
* Recognition of mode-specific knowledge requirements
* Prioritization of knowledge based on mode relevance

### Mode Coordination

* Coordination of multi-step tasks across modes
* Handoff protocols for transferring responsibility between modes
* Shared knowledge spaces for collaborative mode operations

## API Reference

### Initialization

```javascript
const { createCrossModeWorkflows } = require('../../utilities/phase-3/cross-mode-knowledge-workflows/cross-mode-workflows');

const workflowManager = createCrossModeWorkflows({
  workspaceId: '/path/to/workspace',
  conPortClient: conPortClientInstance,
  enableValidation: true,
  defaultWorkflows: predefinedWorkflows,
  logger: customLogger
});

await workflowManager.initialize();
```

### Workflow Management

#### Define Workflow

```javascript
const workflow = await workflowManager.defineWorkflow({
  workflowId: 'architect-to-code',
  name: 'Architecture to Implementation',
  description: 'Transfer architectural decisions to coding tasks',
  stages: [
    {
      modeSlug: 'architect',
      name: 'Design',
      outputs: ['systemDesign', 'architecturalDecisions']
    },
    {
      modeSlug: 'code',
      name: 'Implementation',
      inputs: ['architecturalDecisions'],
      outputs: ['implementationArtifacts']
    }
  ],
  transitionHandlers: {
    'architect-to-code': handleArchitectToCodeTransition
  }
});
```

#### Start Workflow

```javascript
const workflowInstance = await workflowManager.startWorkflow({
  workflowId: 'architect-to-code',
  context: {
    project: 'image-processing-api',
    initialData: {
      requirements: 'Build an API for image processing with ML capabilities'
    }
  }
});
```

#### Transition Between Stages

```javascript
const transitionResult = await workflowManager.transitionToStage({
  workflowInstanceId: 'instance-123',
  fromStage: 'Design',
  toStage: 'Implementation',
  context: {
    architecturalDecisions: [
      { id: 123, summary: 'Use TensorFlow for ML components' }
    ]
  }
});
```

### Context Management

#### Transfer Context

```javascript
const transferResult = await workflowManager.transferContext({
  fromModeSlug: 'architect',
  toModeSlug: 'code',
  context: currentContext,
  transferOptions: {
    includeDecisions: true,
    includeSystemPatterns: true,
    filterByTags: ['implementation-ready']
  }
});
```

#### Augment Context

```javascript
const augmentedContext = await workflowManager.augmentContext({
  modeSlug: 'code',
  baseContext: currentContext,
  augmentationOptions: {
    includeRecentProgress: true,
    includeRelatedPatterns: true,
    depth: 2
  }
});
```

### Knowledge Routing

```javascript
// Route knowledge to appropriate mode
const routingResult = await workflowManager.routeKnowledge({
  knowledge: {
    type: 'architectural-decision',
    content: {
      summary: 'Implement authentication using JWT',
      rationale: 'Better scalability and stateless operation'
    }
  },
  routingOptions: {
    preferredModes: ['architect', 'code'],
    routingStrategy: 'content-based'
  }
});

// Get optimal mode for knowledge
const optimalMode = await workflowManager.getOptimalModeForKnowledge({
  knowledgeType: 'implementation-pattern',
  content: patternDescription,
  currentMode: 'architect'
});
```

### Mode Coordination

```javascript
// Create a coordination session
const coordinationSession = await workflowManager.createCoordinationSession({
  participatingModes: ['architect', 'code', 'debug'],
  task: 'Implement secure user authentication',
  knowledgeSpace: 'auth-system-design'
});

// Update session with mode-specific contribution
await workflowManager.contributeToSession({
  sessionId: 'session-123',
  contributingMode: 'architect',
  contribution: {
    type: 'decision',
    content: authStrategyDecision
  }
});
```

## Common Usage Patterns

### Sequential Mode Transitions

```javascript
// Complete task with sequential mode transitions
const workflowInstance = await workflowManager.startWorkflow({
  workflowId: 'requirements-to-implementation',
  context: {
    project: 'payment-gateway',
    initialData: {
      requirements: 'Implement a secure payment processing system'
    }
  }
});

// Progress through workflow stages
await workflowManager.transitionToStage({
  workflowInstanceId: workflowInstance.id,
  toStage: 'Architecture'
});

await workflowManager.transitionToStage({
  workflowInstanceId: workflowInstance.id,
  toStage: 'Implementation'
});

await workflowManager.transitionToStage({
  workflowInstanceId: workflowInstance.id,
  toStage: 'Testing'
});
```

### Collaborative Mode Operation

```javascript
// Set up collaborative session between modes
const collaborationSession = await workflowManager.createCollaboration({
  taskName: 'Review Authentication Implementation',
  participants: [
    { modeSlug: 'code', role: 'implementer' },
    { modeSlug: 'debug', role: 'validator' },
    { modeSlug: 'docs', role: 'documenter' }
  ],
  sharedContext: {
    codeArtifacts: ['auth-service.js', 'auth-middleware.js'],
    testCases: ['auth-testing.spec.js']
  }
});

// Make mode-specific contributions
await workflowManager.contributeToCollaboration({
  sessionId: collaborationSession.id,
  contributor: 'debug',
  contributionType: 'security-analysis',
  contribution: securityAnalysisResults
});
```

### Knowledge Routing and Distribution

```javascript
// Distribute knowledge to multiple modes
await workflowManager.distributeKnowledge({
  knowledge: securityPolicyUpdate,
  targetModes: ['architect', 'code', 'debug'],
  adaptationOptions: {
    adaptToMode: true,
    emphasizeRelevantParts: true
  }
});

// Set up knowledge routing rules
await workflowManager.defineRoutingRules({
  rules: [
    {
      knowledgeType: 'security-requirement',
      primaryMode: 'architect',
      secondaryModes: ['code', 'debug'],
      conditions: {
        tags: ['critical', 'compliance']
      }
    },
    {
      knowledgeType: 'implementation-detail',
      primaryMode: 'code',
      secondaryModes: ['debug', 'docs'],
      conditions: {
        tags: ['api', 'frontend']
      }
    }
  ]
});
```

## Best Practices

### Workflow Design

* Design workflows that match your development process
* Include clear input/output specifications for each workflow stage
* Define appropriate context transfer handlers for critical transitions

### Context Transfer

* Be selective about what context is transferred between modes
* Filter context based on the target mode's needs
* Preserve decision rationales during transitions

### Knowledge Routing

* Configure routing rules based on knowledge characteristics
* Test routing rules with diverse knowledge samples
* Regularly review and refine routing effectiveness

### Mode Coordination

* Establish clear responsibilities for each mode in collaborative tasks
* Provide sufficient shared context for effective collaboration
* Use structured handoff protocols for critical task transitions

## Integration with Other Components

### Temporal Knowledge Management

The Cross-Mode Knowledge Workflows system can be integrated with Temporal Knowledge Management to track workflow history:

```javascript
// Create a workflow history report
const workflowHistory = await workflowManager.getWorkflowHistory({
  workflowInstanceId: 'instance-123',
  includeTransitions: true,
  includeKnowledgeChanges: true,
  temporalSystem: temporalManager
});
```

### Knowledge Quality Enhancement

Combining Cross-Mode Workflows with Knowledge Quality Enhancement ensures high-quality knowledge transfer:

```javascript
// Apply quality requirements during transitions
await workflowManager.setTransitionQualityRequirements({
  workflowId: 'architect-to-code',
  transition: 'Design-to-Implementation',
  qualityThresholds: {
    architecturalDecisions: {
      completeness: 0.9,
      consistency: 0.85,
      clarity: 0.8
    }
  },
  qualitySystem: qualityEnhancer
});
```

### Multi-Agent Knowledge Synchronization

The Cross-Mode Knowledge Workflows system can coordinate with Multi-Agent Knowledge Synchronization:

```javascript
// Sync knowledge across modes and agents
await workflowManager.syncAcrossModesAndAgents({
  workflowInstanceId: 'instance-123',
  syncTargets: {
    modes: ['architect', 'code', 'debug'],
    agents: ['primary-agent', 'specialist-agent']
  },
  syncOptions: {
    bidirectional: true,
    resolveConflicts: true
  },
  syncSystem: syncSystem
});
```

## Conclusion

The Cross-Mode Knowledge Workflows component enables seamless knowledge transfer and coordination between different Roo modes, ensuring consistent knowledge representation and effective collaboration across specialized contexts. By leveraging this system, users can maintain context continuity through complex multi-stage tasks and ensure that all modes have access to the knowledge they need.

For practical examples, see [cross-mode-workflows-usage.js](../../examples/phase-3/cross-mode-workflows-usage.js).