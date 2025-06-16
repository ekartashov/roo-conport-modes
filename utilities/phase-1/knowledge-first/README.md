# Knowledge-First Guidelines Framework

## Overview

The Knowledge-First Guidelines framework establishes a systematic approach for AI agents to prioritize existing knowledge in ConPort over generating new content, reducing hallucinations and ensuring consistency across interactions.

## Architecture

This component follows the standardized three-layer architecture:

1. **Validation Layer** (`knowledge-first-validation.js`): Ensures data integrity and validates inputs
2. **Core Layer** (`knowledge-first-core.js`): Provides core domain models and business logic
3. **Integration Layer** (`knowledge-first-integration.js`): Handles external system communication and ConPort integration

## Key Components

- **KnowledgeSession**: Tracks knowledge state and utilization metrics
- **KnowledgeFirstInitializer**: Handles initialization of knowledge sessions
- **KnowledgeFirstResponder**: Creates responses prioritizing existing knowledge
- **KnowledgeFirstDecisionMaker**: Makes decisions based on existing knowledge patterns
- **KnowledgeFirstCompleter**: Handles completion protocol for knowledge sessions
- **KnowledgeFirstAnalyzer**: Analyzes and provides feedback on knowledge utilization

## Usage

```javascript
const { 
  KnowledgeFirstGuidelines,
  KnowledgeSession
} = require('./utilities/phase-1/knowledge-first');

// Initialize a session
const session = await KnowledgeFirstGuidelines.initialize({
  workspace: "/path/to/workspace",
  mode: "architect"
});

// Create a response using knowledge-first principles
const response = await KnowledgeFirstGuidelines.createResponse({
  query: "How should we implement feature X?",
  session: session
});

// Make a decision using knowledge-first principles
const decision = await KnowledgeFirstGuidelines.makeDecision({
  decisionPoint: "architecture_pattern_selection",
  options: ["microservices", "monolith", "serverless"],
  context: { projectSize: "medium", teamExpertise: "varied" },
  session: session
});

// Complete the session and get a report
const completionReport = await KnowledgeFirstGuidelines.complete({
  session: session,
  taskOutcome: { status: "completed", artifacts: ["design_doc"] }
});
```

## Integration with ConPort

This framework integrates deeply with ConPort to:

1. Retrieve existing knowledge from ConPort during initialization
2. Validate generated content against ConPort
3. Track knowledge utilization metrics
4. Identify knowledge gaps for future preservation
5. Recommend significant decisions for preservation

See examples directory for detailed usage examples.