# ConPort Validation Checkpoints

## Overview

This document defines a standardized system of validation checkpoints that ensure AI modes systematically validate information against ConPort at critical points in their operation. These checkpoints serve as quality control gates that prevent hallucinations, maintain knowledge consistency, and enforce the ConPort-First Knowledge Operation Pattern.

## Core Principles

1. **Mandatory Validation**: Certain operations must trigger ConPort validation
2. **Strategic Placement**: Validation checkpoints occur at critical decision or information generation points
3. **Consistent Implementation**: All modes implement the same core validation checkpoints
4. **Graceful Fallbacks**: When validation fails, clear fallback procedures are defined
5. **User Transparency**: Validation results are communicated clearly to users

## Standard Validation Checkpoints

### 1. Pre-Response Validation Checkpoint

**When**: Before providing any substantive response to the user

**Purpose**: Ensure all significant information in a response is validated against ConPort

**Implementation**:
```javascript
async function preResponseValidation(responseContent) {
  // Parse response to identify key factual claims
  const factualClaims = extractFactualClaims(responseContent);
  
  // Check each claim against ConPort
  const validationResults = await Promise.all(
    factualClaims.map(claim => validateAgainstConPort(claim))
  );
  
  // Identify unvalidated claims
  const unvalidatedClaims = validationResults
    .filter(result => result.status === "unvalidated")
    .map(result => result.claim);
  
  if (unvalidatedClaims.length > 0) {
    // Modify response to acknowledge limitations
    return addUnvalidatedDisclaimers(responseContent, unvalidatedClaims);
  }
  
  return responseContent;
}
```

### 2. Design Decision Validation Checkpoint

**When**: Before committing to a significant design or architectural decision

**Purpose**: Ensure decisions align with established patterns and don't contradict existing decisions

**Implementation**:
```javascript
async function designDecisionValidation(proposedDecision) {
  // Check for conflicting decisions
  const conflicts = await findConflictingDecisions(proposedDecision);
  
  // Check for applicable patterns
  const relevantPatterns = await findRelevantPatterns(proposedDecision);
  
  // Check for related decisions
  const relatedDecisions = await findRelatedDecisions(proposedDecision);
  
  if (conflicts.length > 0) {
    return {
      valid: false,
      conflicts,
      message: "Decision conflicts with existing decisions in ConPort"
    };
  }
  
  return {
    valid: true,
    suggestedPatterns: relevantPatterns,
    relatedDecisions,
    message: "Decision validated successfully"
  };
}
```

### 3. Implementation Plan Validation Checkpoint

**When**: Before outlining an implementation strategy

**Purpose**: Ensure implementation plans follow established patterns and leverage existing solutions

**Implementation**:
```javascript
async function implementationPlanValidation(plan) {
  // Extract key technologies and approaches from the plan
  const technologies = extractTechnologies(plan);
  const approaches = extractImplementationApproaches(plan);
  
  // Validate each technology against ConPort
  const techValidations = await validateTechnologiesAgainstConPort(technologies);
  
  // Validate approaches against established patterns
  const approachValidations = await validateApproachesAgainstPatterns(approaches);
  
  // Compile validation results
  return {
    valid: techValidations.every(v => v.valid) && 
           approachValidations.every(v => v.valid),
    technologies: techValidations,
    approaches: approachValidations,
    suggestedImprovements: generateImprovementSuggestions(
      techValidations, approachValidations
    )
  };
}
```

### 4. Code Generation Validation Checkpoint

**When**: Before generating significant code

**Purpose**: Ensure code follows established patterns and conventions documented in ConPort

**Implementation**:
```javascript
async function codeGenerationValidation(codeContext) {
  // Identify programming language and framework
  const language = detectLanguage(codeContext);
  const framework = detectFramework(codeContext);
  
  // Fetch relevant code patterns from ConPort
  const codePatterns = await getCodePatternsFromConPort(language, framework);
  
  // Check for applicable patterns based on the task
  const applicablePatterns = identifyApplicablePatterns(
    codeContext.task, codePatterns
  );
  
  return {
    valid: applicablePatterns.length > 0,
    applicablePatterns,
    message: applicablePatterns.length > 0 ? 
      "Found applicable patterns in ConPort" : 
      "No established patterns found for this code context"
  };
}
```

### 5. Completion Validation Checkpoint

**When**: Before calling `attempt_completion` to finalize a task

**Purpose**: Ensure all discoveries, decisions, and insights have been captured in ConPort

**Implementation**:
```javascript
async function completionValidation(sessionContext) {
  // Extract decisions made during the session
  const decisionsToLog = extractDecisionsFromSession(sessionContext);
  
  // Extract patterns discovered during the session
  const patternsToLog = extractPatternsFromSession(sessionContext);
  
  // Extract progress items to update
  const progressUpdates = extractProgressUpdates(sessionContext);
  
  // Check what still needs to be logged to ConPort
  const pendingDecisions = await checkPendingDecisions(decisionsToLog);
  const pendingPatterns = await checkPendingPatterns(patternsToLog);
  const pendingProgressUpdates = await checkPendingProgress(progressUpdates);
  
  const allCaptured = (
    pendingDecisions.length === 0 && 
    pendingPatterns.length === 0 && 
    pendingProgressUpdates.length === 0
  );
  
  return {
    valid: allCaptured,
    pendingDecisions,
    pendingPatterns,
    pendingProgressUpdates,
    message: allCaptured ? 
      "All insights captured in ConPort" : 
      "Important insights still need to be captured in ConPort"
  };
}
```

## Mode-Specific Validation Checkpoints

In addition to the standard checkpoints, each mode should implement specialized validation checkpoints appropriate to its function:

### Architect Mode

1. **Architecture Consistency Checkpoint**
   - Validates that architectural proposals align with existing architecture decisions
   - Checks for compatibility with established constraints
   - Ensures cross-cutting concerns are addressed

2. **Requirement Traceability Checkpoint**
   - Validates that architectural decisions can be traced to documented requirements
   - Ensures all requirements are addressed by the architecture
   - Identifies gaps between requirements and proposed solutions

### Code Mode

1. **Pattern Application Checkpoint**
   - Validates that generated code applies appropriate patterns from ConPort
   - Checks for consistent implementation of patterns across the codebase
   - Suggests pattern optimizations based on context

2. **Test Coverage Checkpoint**
   - Validates that test plans cover known edge cases from ConPort
   - Ensures test strategy aligns with project testing patterns
   - Checks for adequate coverage of error handling scenarios

### Debug Mode

1. **Known Issues Checkpoint**
   - Validates issues against previously documented bugs in ConPort
   - Checks for known workarounds or solutions
   - Correlates current issues with historical patterns

2. **Root Cause Analysis Checkpoint**
   - Validates proposed root causes against system architecture in ConPort
   - Ensures analysis considers all relevant components
   - Checks if similar causes have been identified in past issues

### Ask Mode

1. **Information Accuracy Checkpoint**
   - Validates provided information against ConPort knowledge
   - Distinguishes between project-specific facts and general knowledge
   - Ensures technical explanations align with project conventions

2. **Terminology Consistency Checkpoint**
   - Validates that terminology used in answers matches project glossary
   - Ensures consistent use of project-specific terms
   - Checks for alignment with established definitions

## Implementation in Mode Templates

The following section should be added to all mode templates:

```yaml
# Mandatory Validation Checkpoints
- Implement all standard validation checkpoints (pre-response, design decision, implementation plan, code generation, completion)
- Implement mode-specific validation checkpoints
- Clearly communicate validation status to users
- Document validation failures in Active Context
- Never bypass validation checks for efficiency
```

## Validation Status Communication

When validation results need to be communicated to users, follow these guidelines:

### Successful Validation

```
[VALIDATION PASSED] This response has been validated against ConPort. All key information aligns with the project's documented knowledge.
```

### Partial Validation

```
[PARTIALLY VALIDATED] This response contains both validated and unvalidated information. Elements marked with [?] could not be verified against ConPort.
```

### Failed Validation

```
[VALIDATION FAILED] This response contains information that conflicts with ConPort. Please consider the following conflicts:
- Proposed approach conflicts with Decision #42
- Suggested technology is not listed in the project's approved stack
```

## Validation Registry

To maintain traceability of validation checkpoints, implement a validation registry:

```javascript
class ValidationRegistry {
  constructor() {
    this.validations = [];
  }
  
  recordValidation(checkpoint, results) {
    this.validations.push({
      timestamp: new Date(),
      checkpoint,
      results,
      passed: results.valid
    });
  }
  
  getValidationSummary() {
    const total = this.validations.length;
    const passed = this.validations.filter(v => v.passed).length;
    
    return {
      total,
      passed,
      failed: total - passed,
      passRate: total > 0 ? passed / total : 1.0
    };
  }
  
  getFailedValidations() {
    return this.validations.filter(v => !v.passed);
  }
}
```

## Integration with ConPort-First Knowledge Operation Pattern

These validation checkpoints implement the "Locality-Aware Knowledge Operations" principle of the ConPort-First Knowledge Operation Pattern, providing concrete mechanisms to ensure that ConPort is always queried before assuming or generating information.

## Expected Benefits

Implementing these validation checkpoints will:

1. **Reduce Inconsistencies**: By validating information before presenting it
2. **Enforce Knowledge Continuity**: By systematically checking against existing knowledge
3. **Prevent Knowledge Gaps**: By identifying missing information before it's needed
4. **Improve User Trust**: Through transparent validation status communication
5. **Build Better ConPort Data**: By identifying patterns that need documentation

## Roadmap for Implementation

1. **Phase 1**: Document validation checkpoint design (current document)
2. **Phase 2**: Implement validation utilities with standard checkpoints
3. **Phase 3**: Update mode templates with validation checkpoint requirements
4. **Phase 4**: Create mode-specific checkpoint implementations
5. **Phase 5**: Implement validation registry and reporting