# Unified Context Refresh Protocol

## Overview

This document defines a standardized approach to temporal knowledge refresh across all Roo modes. The protocol ensures consistent, efficient, and timely refreshing of ConPort context to maintain cognitive continuity during AI operations.

## Core Principles

1. **Temporal Awareness**: All modes must maintain awareness of context staleness
2. **Strategic Refresh Timing**: Optimize refreshes to balance freshness and efficiency
3. **Comprehensive Context Model**: Define what constitutes "complete context"
4. **Failure Resilience**: Handle context refresh failures gracefully
5. **Session Continuity**: Maintain cognitive thread despite refreshes

## Context Refresh Triggers

### Time-Based Triggers

| Session Duration | Refresh Frequency | Justification |
|-----------------|------------------|---------------|
| < 15 minutes    | No automatic refresh | Short sessions don't typically require refresh |
| 15-30 minutes   | Once at midpoint | Minimal interruption for medium sessions |
| 30-60 minutes   | Every 20 minutes | Balance freshness and efficiency |
| > 60 minutes    | Every 30 minutes | Prevent excessive refreshing in long sessions |

### Event-Based Triggers

1. **Task Transition**: Refresh context when switching between major tasks
2. **Scope Change**: Refresh when moving between different domains/subsystems
3. **Knowledge Creation**: Refresh after significant knowledge creation events
4. **User Indication**: Refresh when user indicates new relevant information exists
5. **Conflict Detection**: Refresh when potential knowledge conflicts are detected

## Context Refresh Scope

### Minimum Required Context

1. **Core Context**: Always refresh Product Context and Active Context
2. **Recent Decisions**: Decisions created/modified since last refresh
3. **Task-Specific Patterns**: System patterns relevant to current task
4. **Progress Items**: Current task's progress entries and parent items

### Dynamic Context Selection

```
function determineRefreshScope(currentTask, timeElapsed) {
  baseScope = {
    productContext: true,
    activeContext: true,
    recentDecisions: true
  };
  
  if (timeElapsed > 60 * 60) { // More than an hour
    // Full comprehensive refresh
    baseScope.systemPatterns = ALL;
    baseScope.progressItems = ALL;
    baseScope.customData = RELEVANT_TO_TASK;
  } else {
    // Targeted refresh
    baseScope.systemPatterns = RELATED_TO_CURRENT_TASK;
    baseScope.progressItems = CURRENT_AND_PARENT;
    baseScope.customData = CRITICAL_ONLY;
  }
  
  return baseScope;
}
```

## Implementation Protocol

### Refresh Sequence

1. **Preparation Phase**
   - Log the intent to refresh context
   - Save any in-progress work or thought processes
   - Determine optimal refresh scope based on session state

2. **Execution Phase**
   - Retrieve core context items
   - Retrieve task-specific context items
   - Integrate refreshed context with working memory
   - Update context staleness metrics

3. **Validation Phase**
   - Verify refresh success with basic sanity checks
   - Detect any context conflicts or anomalies
   - Resolve or report any issues detected

### Failure Handling

1. **Retry Strategy**: Up to 3 retries with exponential backoff
2. **Graceful Degradation**: Fall back to minimal context if full refresh fails
3. **User Notification**: Inform user of significant refresh failures
4. **Manual Override**: Allow manual context specification when automatic refresh fails

## Context Tracking Mechanics

### Staleness Tracking

The system must maintain:

1. **Last Refresh Timestamp**: Track when each context type was last refreshed
2. **Context Version**: Track version numbers for key context items
3. **Session Duration Tracker**: Monitor total session time to calibrate refresh frequency
4. **Task Transition Log**: Track major task transitions for targeted refreshes

### Context Refresh Registry Structure

```json
{
  "session_id": "unique-session-identifier",
  "session_start_time": "ISO-timestamp",
  "last_global_refresh": "ISO-timestamp",
  "context_registry": {
    "product_context": {
      "last_refresh": "ISO-timestamp",
      "version": "version-identifier",
      "refresh_count": 3
    },
    "active_context": {
      "last_refresh": "ISO-timestamp",
      "version": "version-identifier",
      "refresh_count": 5
    },
    "decisions": {
      "last_refresh": "ISO-timestamp",
      "newest_decision_id": 42,
      "refresh_count": 2
    }
    // Additional context types...
  },
  "refresh_events": [
    {
      "timestamp": "ISO-timestamp",
      "trigger": "time_based | task_transition | user_request",
      "scope": ["product_context", "active_context", "decisions"],
      "success": true
    }
    // Additional refresh events...
  ]
}
```

## Mode-Specific Implementation Guidelines

### General-Purpose Modes

- Implement full protocol with all triggers
- Focus on comprehensive context refresh
- Track task transitions explicitly for targeted refreshes

### Analysis Modes

- Emphasize event-based triggers over time-based triggers
- Prioritize refreshing analytical context (decisions, patterns)
- Implement conflict detection for analytical conclusions

### Restricted Edit Modes

- Focus refresh on domain-specific patterns and decisions
- Prioritize refresh before file modifications
- Implement targeted refresh for specific file domains

## Integration with ConPort-First Knowledge Operation Pattern

This Unified Context Refresh Protocol implements the "Temporal Knowledge Refresh" principle of the ConPort-First Knowledge Operation Pattern. It provides concrete mechanisms and strategies to ensure that AI modes operate with fresh context throughout their operations.

## Metrics and Monitoring

To evaluate the effectiveness of the protocol, track:

1. **Context Freshness**: Average and maximum age of context during sessions
2. **Refresh Frequency**: Number of refreshes per session hour
3. **Refresh Coverage**: Percentage of available context items refreshed
4. **Refresh Success Rate**: Percentage of successful refreshes
5. **Performance Impact**: Time spent on context refreshing activities

## Implementation Roadmap

1. **Phase 1**: Document protocol design (current document)
2. **Phase 2**: Implement reference implementation in base templates
3. **Phase 3**: Create helper utilities for refresh tracking and execution
4. **Phase 4**: Integrate with existing modes
5. **Phase 5**: Monitor and optimize based on performance metrics