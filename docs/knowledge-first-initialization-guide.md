# Knowledge-First Initialization Guide

## Overview

This document provides a standardized implementation guide for Knowledge-First Initialization across all Roo modes. Knowledge-First Initialization ensures that all modes begin operation by immediately loading relevant ConPort context, establishing a cognitive baseline before any significant processing occurs.

## Core Principles

1. **Immediate Context Loading**: ConPort context must be loaded at the very beginning of a session
2. **Comprehensive Context Model**: A complete cognitive baseline must be established
3. **Graceful Degradation**: Operations must continue even if ConPort is unavailable
4. **Initialization Verification**: The system must confirm successful initialization

## Standard Initialization Sequence

All modes must implement the following initialization sequence upon activation:

```
function knowledgeFirstInitialization() {
  // Step 1: Check ConPort availability
  const conportStatus = checkConportAvailability();
  
  // Step 2: Set internal status based on availability
  if (conportStatus.available) {
    setInternalStatus("CONPORT_ACTIVE");
  } else {
    setInternalStatus("CONPORT_INACTIVE");
    notifyUser("ConPort unavailable. Operating with limited knowledge persistence.");
    return operateInDegradedMode();
  }
  
  // Step 3: Load core context
  const productContext = loadProductContext();
  const activeContext = loadActiveContext();
  
  // Step 4: Load task-specific context
  const recentDecisions = loadRecentDecisions(5);
  const relevantPatterns = loadRelevantPatterns();
  const progressItems = loadRecentProgressItems(5);
  
  // Step 5: Establish cognitive baseline
  integrateContextIntoWorkingMemory({
    productContext,
    activeContext,
    recentDecisions,
    relevantPatterns,
    progressItems
  });
  
  // Step 6: Verify initialization success
  const initStatus = verifyInitialization();
  if (initStatus.success) {
    notifyUser("ConPort initialized successfully. Knowledge baseline established.");
    return operateInFullMode();
  } else {
    notifyUser("ConPort initialization incomplete. Some context may be missing.");
    return operateInPartialMode(initStatus.availableContext);
  }
}
```

## Implementation in Mode Templates

### Required Additions to All Modes

The following section must be included in all mode templates:

```yaml
# Knowledge-First Initialization
- At session start, IMMEDIATELY execute the ConPort initialization sequence
- REQUIRED: Load Product Context, Active Context, and recent decisions before beginning work
- Establish cognitive baseline from persisted knowledge
- If ConPort is not available, explicitly inform the user and operate in degraded mode
```

### Mode-Specific Context Requirements

Different modes require different context elements to be initialized. At minimum, all modes must load:

1. **Product Context**
2. **Active Context**
3. **Recent Decisions** (at least 5)

Additionally, modes should load the following based on their function:

| Mode Type | Additional Required Context |
|-----------|----------------------------|
| Code | System patterns, recent code-related decisions, implementation-specific custom data |
| Architect | System patterns (all), architectural decisions, project glossary |
| Debug | Error patterns, recent debug-related progress items, system constraints |
| Ask | Project glossary, domain-specific custom data |
| Docs | Documentation standards, project glossary, recent documentation decisions |
| Prompt Enhancer | Prompt patterns, project glossary |
| Orchestrator | All active progress items, recent decisions across all domains |
| ConPort Maintenance | Database health metrics, knowledge graph statistics |

## ConPort Initialization Status Indicators

All modes must explicitly indicate their ConPort initialization status at the beginning of each response:

1. **[CONPORT_ACTIVE]**: Successfully initialized with complete context
2. **[CONPORT_PARTIAL]**: Initialized with incomplete context (some elements failed)
3. **[CONPORT_INACTIVE]**: Failed to initialize or ConPort unavailable

## Initialization Verification

The initialization process must include verification steps to ensure context was properly loaded:

```javascript
function verifyInitialization() {
  const checks = [
    // Check Product Context
    {
      name: "productContext",
      success: productContext != null && Object.keys(productContext).length > 0,
      critical: true
    },
    // Check Active Context
    {
      name: "activeContext",
      success: activeContext != null && Object.keys(activeContext).length > 0,
      critical: true
    },
    // Check Recent Decisions
    {
      name: "recentDecisions",
      success: recentDecisions != null && recentDecisions.length > 0,
      critical: false
    },
    // Check System Patterns
    {
      name: "systemPatterns",
      success: systemPatterns != null && systemPatterns.length > 0,
      critical: false
    }
  ];
  
  const failedCriticalChecks = checks.filter(check => check.critical && !check.success);
  const passedChecks = checks.filter(check => check.success);
  
  if (failedCriticalChecks.length > 0) {
    return {
      success: false,
      status: "CRITICAL_FAILURE",
      failedComponents: failedCriticalChecks.map(check => check.name),
      availableContext: passedChecks.map(check => check.name)
    };
  } else if (passedChecks.length < checks.length) {
    return {
      success: true,
      status: "PARTIAL_SUCCESS",
      failedComponents: checks.filter(check => !check.success).map(check => check.name),
      availableContext: passedChecks.map(check => check.name)
    };
  } else {
    return {
      success: true,
      status: "COMPLETE_SUCCESS",
      availableContext: passedChecks.map(check => check.name)
    };
  }
}
```

## Degraded Operation Mode

If ConPort initialization fails, modes must be able to operate in a degraded capacity:

1. **Clear User Communication**: Inform the user that ConPort is unavailable and explain limitations
2. **Local Memory Only**: Operate using only information explicitly provided by the user
3. **Passive Knowledge Collection**: Continue collecting knowledge that could later be added to ConPort
4. **Periodic Retry**: Attempt to reconnect to ConPort periodically during the session

## Initial User Interaction

The first interaction with the user after initialization should:

1. Acknowledge the ConPort initialization status
2. Summarize the loaded context (if successful)
3. Indicate any missing context elements (if partial)
4. Request additional information if critical context is missing

Example:

```
[CONPORT_ACTIVE] 
ConPort initialization complete. I've loaded the Product Context (Project Roo Modes Enhancement) and Active Context (Current focus: ConPort Integration Foundation). I've also loaded 7 recent decisions and 5 system patterns related to ConPort integration.

How would you like to proceed with the implementation of the Knowledge-First Initialization pattern?
```

## Implementation Checklist

When implementing Knowledge-First Initialization in a mode:

1. [ ] Add the standardized initialization sequence
2. [ ] Implement mode-specific context loading
3. [ ] Add status indicators to all responses
4. [ ] Implement verification logic
5. [ ] Add degraded operation capabilities
6. [ ] Test initialization with ConPort available
7. [ ] Test initialization with ConPort unavailable
8. [ ] Document any mode-specific initialization requirements

## Integration with Existing Modes

For existing modes, the Knowledge-First Initialization pattern should be added:

1. At the top of the customInstructions section
2. With clear separation from other instructions
3. With priority over any conflicting instructions

## Metrics and Monitoring

To evaluate the effectiveness of Knowledge-First Initialization, track:

1. **Initialization Success Rate**: Percentage of successful initializations
2. **Initialization Time**: Time taken to complete initialization
3. **Context Completeness**: Percentage of required context elements successfully loaded
4. **User Satisfaction**: User feedback on the quality of initialized context