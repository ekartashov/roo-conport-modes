# Knowledge Source Classification Framework

## Overview

This document defines the Knowledge Source Classification Framework, a critical component of the ConPort-First Knowledge Operation Pattern that creates explicit distinctions between different types of knowledge used in AI responses. By clearly marking the source and reliability of information, this framework improves transparency, reduces hallucinations, and increases user trust.

## Core Concepts

The framework categorizes knowledge into five distinct types:

1. **Retrieved Knowledge**: Information directly obtained from ConPort
2. **Validated Knowledge**: Information verified against ConPort but not directly retrieved
3. **Inferred Knowledge**: Information logically derived from context but not explicitly in ConPort
4. **Generated Knowledge**: New information created during the current session
5. **Uncertain Knowledge**: Information that cannot be confidently classified

## Visual Markers

To make knowledge sources immediately recognizable, the framework applies consistent visual markers:

| Type | Marker | Description |
|------|--------|-------------|
| Retrieved | [R] | Directly retrieved from ConPort without modification |
| Validated | [V] | Verified against ConPort with high confidence |
| Inferred | [I] | Logically derived from known facts with clear reasoning |
| Generated | [G] | Newly created in this session |
| Uncertain | [?] | Cannot be confidently classified |

## Implementation

The Knowledge Source Classification Framework is implemented through the `knowledge-source-classifier.js` utility, which provides:

1. **Classification API**: Functions to classify knowledge items
2. **Marking System**: Tools to visibly mark knowledge sources in responses
3. **Confidence Metrics**: Quantification of classification reliability
4. **Integration with Validation**: Connection to the validation checkpoints system

## Integration with Validation Checkpoints

The Knowledge Source Classification Framework complements the Validation Checkpoints system:

- **Pre-Response Validation**: Uses classification to identify which parts of a response need validation
- **Design Decision Validation**: Classifies sources of information used in decisions
- **Implementation Plan Validation**: Marks which parts of a plan are based on established patterns
- **Code Generation Validation**: Identifies code patterns derived from ConPort vs. generated
- **Completion Validation**: Ensures all new knowledge is properly classified before completion

## Usage Guidelines

### When to Apply Classification

Knowledge source classification should be applied:

1. Before presenting substantive responses to users
2. When mixing different types of knowledge in a single response
3. When making significant claims or recommendations
4. During architectural decision-making processes
5. When responding to direct questions about factual information

### Classification Process

For effective classification:

1. **Query First**: Always check ConPort before classification
2. **Apply Context**: Consider the current context for inference classification
3. **Maintain Honesty**: When uncertain, use the [?] marker rather than guessing
4. **Show Confidence**: Include confidence levels for critical information
5. **Provide Legend**: Include the classification legend in substantial responses

## Mode-Specific Implementation

### Architect Mode

- Focus on classifying design decisions and architectural patterns
- Clearly mark which architectural recommendations come from existing patterns
- Apply inferred classification to logical extensions of established architecture

### Code Mode

- Classify code patterns based on their source
- Mark implementation approaches derived from ConPort patterns
- Distinguish between validated best practices and generated suggestions

### Debug Mode

- Classify diagnostic information sources
- Mark known issues vs. newly discovered issues
- Distinguish between proven fixes and experimental solutions

### Ask Mode

- Rigorously classify factual statements
- Clearly separate retrieved knowledge from explanations
- Mark uncertain aspects of conceptual explanations

## Example Classification

Original Response:
```
React is a JavaScript library for building user interfaces. It uses a virtual DOM for efficient updates. For your project, I recommend implementing component-based architecture with Redux for state management.
```

Classified Response:
```
[R] React is a JavaScript library for building user interfaces. [V] It uses a virtual DOM for efficient updates. [I] For your project, I recommend implementing component-based architecture [G] with Redux for state management.

---
Knowledge Source Legend:
[R] - Retrieved directly from ConPort
[I] - Inferred from context but not explicitly in ConPort
[G] - Generated during this session
[V] - Validated against ConPort but not directly retrieved
[?] - Source uncertain or cannot be confidently classified
---
```

## Integration with ConPort

The Knowledge Source Classification Framework supports ConPort by:

1. **Improving Knowledge Quality**: Identifying knowledge gaps that need documentation
2. **Enhancing Relationships**: Showing relationships between information pieces
3. **Supporting Validation**: Providing classification data for validation processes
4. **Building User Trust**: Creating transparency about information sources

## Benefits

1. **Increased Transparency**: Users understand where information comes from
2. **Reduced Hallucinations**: Clear distinction between facts and generation
3. **Better Knowledge Gaps Identification**: Easily identify what needs documentation
4. **Improved Knowledge Quality**: Classification drives better ConPort documentation
5. **Enhanced Decision Making**: Clearer basis for architectural and implementation decisions

## Implementation Roadmap

1. **Phase 1**: Basic classification with visual markers (current implementation)
2. **Phase 2**: Integration with embeddings for better classification accuracy
3. **Phase 3**: Automated classification feedback loop to improve ConPort coverage
4. **Phase 4**: User-configurable classification display options
5. **Phase 5**: Classification-aware knowledge gap resolution

The Knowledge Source Classification Framework is a critical component that works alongside Validation Checkpoints to ensure the distinction between retrieved, inferred, and generated knowledge is always clear and transparent.