# Knowledge-First Guidelines

## Overview

Knowledge-First Guidelines establish a systematic approach for AI agents to prioritize existing knowledge in ConPort over generating new content, reducing hallucinations and ensuring consistency across interactions. These guidelines enforce a "retrieve before generate" approach to AI operations, creating a cohesive framework that integrates with our validation checkpoints and knowledge source classification systems.

## Core Principles

1. **Knowledge Primacy**: ConPort knowledge should be retrieved, consulted, and prioritized before generating new content.
2. **Knowledge Transparency**: All information presented to users must be clearly classified by source using the Knowledge Source Classification system.
3. **Knowledge Validation**: Generated content must be validated against ConPort knowledge using the Validation Checkpoints system.
4. **Knowledge Preservation**: New knowledge created during sessions must be systematically preserved in ConPort.
5. **Knowledge Integration**: Each mode should seamlessly integrate ConPort operations into its core workflow.

## Implementation Framework

The Knowledge-First Guidelines implementation consists of five key components:

### 1. Knowledge-First Initialization

Before beginning any task, an AI agent must:

- Initialize connection to ConPort
- Load relevant context information
- Establish knowledge baselines for the current task
- Set up knowledge tracking for the session

```javascript
// Example implementation
const session = await KnowledgeFirstInitializer.initialize({
  workspace: workspaceId,
  taskContext: userQuery,
  mode: currentMode
});

// Initialization loads:
// - Product context
// - Active context
// - Relevant decisions
// - System patterns
// - Custom data for the domain
```

### 2. Knowledge-First Response Protocol

When formulating responses, an AI agent must:

- Query ConPort before generating content
- Prioritize retrieved information in responses
- Clearly classify knowledge sources
- Validate generated content against ConPort
- Identify knowledge gaps for future preservation

```javascript
// Example implementation
const response = await KnowledgeFirstResponder.createResponse({
  query: userQuery,
  retrievedKnowledge: session.retrievedKnowledge,
  requireValidation: true,
  classifySources: true
});
```

### 3. Knowledge-First Decision Making

When making decisions, an AI agent must:

- Retrieve relevant past decisions
- Consider established system patterns
- Apply consistent reasoning based on ConPort knowledge
- Document new decisions with clear rationales
- Validate decision consistency with existing knowledge

```javascript
// Example implementation
const decision = await KnowledgeFirstDecisionMaker.makeDecision({
  decisionPoint: "architecture_approach",
  options: ["microservices", "monolith", "serverless"],
  context: currentTaskContext,
  existingDecisions: relevantDecisions
});

// Decision is documented with:
// - Clear rationale based on existing knowledge
// - Relationship to previous decisions
// - Classification of knowledge sources used
```

### 4. Knowledge-First Completion Protocol

Before completing a task, an AI agent must:

- Document significant knowledge created during the session
- Classify any undocumented knowledge
- Validate critical outputs against ConPort
- Update active context with task outcomes
- Identify knowledge that should be preserved

```javascript
// Example implementation
await KnowledgeFirstCompleter.complete({
  session: currentSession,
  newKnowledge: identifiedNewKnowledge,
  taskOutcome: completionResult,
  preservationRecommendations: knowledgeToPreserve
});
```

### 5. Knowledge-First Feedback Loop

After task completion, the system should:

- Analyze knowledge utilization during the session
- Identify knowledge gaps in ConPort
- Recommend improvements to knowledge organization
- Track knowledge utilization metrics
- Refine knowledge retrieval strategies

```javascript
// Example implementation
const feedbackReport = await KnowledgeFirstAnalyzer.analyzeSession({
  session: completedSession,
  knowledgeUtilization: utilizationMetrics,
  identifiedGaps: knowledgeGaps
});
```

## Mode-Specific Guidelines

### Architect Mode

- Prioritize existing architectural decisions and patterns
- Ensure architectural consistency with established principles
- Document all significant architectural decisions
- Validate new architectures against existing patterns
- Preserve architectural knowledge with comprehensive rationales

### Code Mode

- Retrieve and apply established coding patterns
- Ensure consistency with existing implementation approaches
- Document code design decisions and rationales
- Validate code against established best practices
- Preserve reusable code patterns and solutions

### Debug Mode

- Retrieve known issues and solutions before diagnosing
- Apply established debugging methodologies
- Document new bugs and their resolutions
- Validate fixes against known solution patterns
- Preserve debugging insights and resolution approaches

### Ask Mode

- Prioritize retrieved factual information over generated explanations
- Ensure educational consistency with previously provided explanations
- Document significant explanations and concept breakdowns
- Validate educational content against established knowledge
- Preserve valuable educational patterns and explanations

## Integration with Validation Checkpoints

Knowledge-First Guidelines extend and complement the Validation Checkpoints system:

1. **Pre-Response Validation**: Knowledge-First ensures ConPort is consulted before response generation
2. **Design Decision Validation**: Knowledge-First ensures decisions align with existing knowledge
3. **Implementation Plan Validation**: Knowledge-First ensures plans follow established patterns
4. **Code Generation Validation**: Knowledge-First ensures code follows documented practices
5. **Completion Validation**: Knowledge-First ensures knowledge preservation before completion

## Integration with Knowledge Source Classification

Knowledge-First Guidelines work alongside Knowledge Source Classification:

1. **Retrieval Priority**: Encourages maximizing [R] (Retrieved) and [V] (Validated) knowledge
2. **Source Transparency**: Ensures consistent application of classification markers
3. **Generation Control**: Minimizes [G] (Generated) content when [R] or [V] alternatives exist
4. **Uncertainty Management**: Explicitly marks [?] (Uncertain) content for validation
5. **Inference Documentation**: Provides clear reasoning for [I] (Inferred) knowledge

## Implementation Metrics

To measure Knowledge-First Guidelines effectiveness:

1. **Knowledge Utilization Rate**: Percentage of response content derived from ConPort
2. **Knowledge Source Distribution**: Ratio of [R]/[V]/[I]/[G]/[?] classifications in responses
3. **Knowledge Preservation Rate**: Percentage of new knowledge documented in ConPort
4. **Validation Success Rate**: Percentage of generated content validated successfully
5. **Knowledge Gap Resolution**: Rate at which identified knowledge gaps are filled

## Example: Knowledge-First Workflow

1. **User Query**: "What's the best way to implement authentication in our system?"

2. **Knowledge-First Initialization**:
   - Load product context to understand the system
   - Retrieve relevant architectural decisions
   - Check for authentication-related system patterns
   - Initialize knowledge tracking for the session

3. **Knowledge Retrieval**:
   - Find Decision #12: "OAuth 2.0 for external authentication"
   - Retrieve System Pattern #7: "Centralized Authentication Service"
   - Load custom data on authentication implementation details

4. **Response Formulation**:
   - Apply Knowledge Source Classification
   - Prioritize retrieved content in the response
   - Generate only what can't be retrieved
   - Validate generated content against ConPort

5. **Response to User**:
```
[R] Based on our architectural Decision #12, we've standardized on OAuth 2.0 for external authentication. 

[V] This is implemented through our Centralized Authentication Service pattern, which provides a single point of authentication for all system components.

[I] For your specific implementation, you should extend the existing AuthService class in the auth module, following the established pattern.

[G] I recommend adding a specific claims validator for your new resource type, as this is not covered by existing patterns but aligns with our approach.

---
Knowledge Sources:
[R] Retrieved directly from ConPort
[V] Validated against ConPort
[I] Inferred from context
[G] Generated during this session
---
```

6. **Knowledge Preservation**:
   - Document the recommended claims validator approach
   - Update active context with authentication focus
   - Link new implementation recommendation to existing decisions

7. **Knowledge-First Completion**:
   - Validate all significant guidance provided
   - Ensure all new knowledge is properly preserved
   - Update task progress in ConPort

## Benefits

1. **Reduced Hallucinations**: By prioritizing retrieved knowledge, AI agents generate less unverified content
2. **Consistency**: Responses align with established knowledge and previous interactions
3. **Transparency**: Users understand the source and reliability of information
4. **Knowledge Growth**: Systematic preservation of new knowledge enhances ConPort over time
5. **Improved Trust**: Clear knowledge sourcing and validation builds user confidence

## Implementation Roadmap

1. **Phase 1**: Basic implementation of Knowledge-First Guidelines (current phase)
2. **Phase 2**: Integration with advanced semantic search capabilities
3. **Phase 3**: Automated knowledge gap identification and resolution
4. **Phase 4**: Knowledge utilization analytics and optimization
5. **Phase 5**: Adaptive knowledge retrieval based on usage patterns

Knowledge-First Guidelines represent a fundamental shift from "generate then validate" to "retrieve before generate," positioning ConPort knowledge as the primary source of truth for all AI operations.