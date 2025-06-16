/**
 * Cognitive Continuity Framework (CCF) - Validation Layer
 * 
 * This layer provides validation functions for various aspects of the Cognitive Continuity Framework,
 * ensuring data integrity and consistency for continuity operations.
 */

/**
 * Validates a context state object
 * @param {Object} contextState Context state to validate
 * @returns {Object} Validation result with { valid, errors }
 * @throws {Error} If validation fails
 */
function validateContextState(contextState) {
  const errors = [];
  
  // Check if contextState is an object
  if (!contextState || typeof contextState !== 'object') {
    throw new Error('Context state must be an object');
  }
  
  // Check for required fields
  if (!contextState.id) {
    errors.push('Context state must have an ID');
  } else if (typeof contextState.id !== 'string') {
    errors.push('Context state ID must be a string');
  }
  
  // Check timestamp if provided
  if (contextState.timestamp !== undefined) {
    if (!(contextState.timestamp instanceof Date) && typeof contextState.timestamp !== 'string') {
      errors.push('Timestamp must be a Date object or ISO date string');
    }
    
    if (typeof contextState.timestamp === 'string') {
      // Check if it's a valid ISO date string
      const date = new Date(contextState.timestamp);
      if (isNaN(date.getTime())) {
        errors.push('Timestamp string must be a valid ISO date');
      }
    }
  }
  
  // Check session info if provided
  if (contextState.sessionInfo !== undefined) {
    if (typeof contextState.sessionInfo !== 'object') {
      errors.push('Session info must be an object');
    }
  }
  
  // Check agent info if provided
  if (contextState.agentInfo !== undefined) {
    if (typeof contextState.agentInfo !== 'object') {
      errors.push('Agent info must be an object');
    }
  }
  
  // Check content
  if (!contextState.content) {
    errors.push('Context state must have content');
  } else if (typeof contextState.content !== 'object') {
    errors.push('Context state content must be an object');
  }
  
  // Check metadata if provided
  if (contextState.metadata !== undefined) {
    if (typeof contextState.metadata !== 'object') {
      errors.push('Metadata must be an object');
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Context state validation failed: ${errors.join(', ')}`);
  }
  
  return { valid: true, errors: [] };
}

/**
 * Validates a continuity operation request
 * @param {Object} request Continuity operation request to validate
 * @returns {Object} Validation result with { valid, errors }
 * @throws {Error} If validation fails
 */
function validateContinuityOperation(request) {
  const errors = [];
  
  // Check if request is an object
  if (!request || typeof request !== 'object') {
    throw new Error('Continuity operation request must be an object');
  }
  
  // Check operation type
  if (!request.operation) {
    errors.push('Operation type is required');
  } else if (typeof request.operation !== 'string') {
    errors.push('Operation type must be a string');
  } else if (!['save', 'load', 'transfer', 'merge', 'snapshot', 'restore', 'diff'].includes(request.operation)) {
    errors.push('Invalid operation type. Must be one of: save, load, transfer, merge, snapshot, restore, diff');
  }
  
  // Validate based on operation type
  switch (request.operation) {
    case 'save':
      if (!request.contextState) {
        errors.push('Context state is required for save operation');
      } else {
        try {
          validateContextState(request.contextState);
        } catch (error) {
          errors.push(`Invalid context state: ${error.message}`);
        }
      }
      break;
      
    case 'load':
      if (!request.contextId && !request.criteria) {
        errors.push('Either context ID or search criteria is required for load operation');
      }
      if (request.contextId && typeof request.contextId !== 'string') {
        errors.push('Context ID must be a string');
      }
      if (request.criteria && typeof request.criteria !== 'object') {
        errors.push('Search criteria must be an object');
      }
      break;
      
    case 'transfer':
      if (!request.sourceAgentId) {
        errors.push('Source agent ID is required for transfer operation');
      } else if (typeof request.sourceAgentId !== 'string') {
        errors.push('Source agent ID must be a string');
      }
      
      if (!request.targetAgentId) {
        errors.push('Target agent ID is required for transfer operation');
      } else if (typeof request.targetAgentId !== 'string') {
        errors.push('Target agent ID must be a string');
      }
      
      if (!request.contextFilter && !request.contextId) {
        errors.push('Either context filter or context ID is required for transfer operation');
      }
      break;
      
    case 'merge':
      if (!request.contextIds || !Array.isArray(request.contextIds)) {
        errors.push('Array of context IDs is required for merge operation');
      } else if (request.contextIds.length < 2) {
        errors.push('Merge operation requires at least two context IDs');
      }
      
      if (request.strategy && typeof request.strategy !== 'string') {
        errors.push('Merge strategy must be a string if provided');
      }
      break;
      
    case 'snapshot':
      if (!request.agentId) {
        errors.push('Agent ID is required for snapshot operation');
      } else if (typeof request.agentId !== 'string') {
        errors.push('Agent ID must be a string');
      }
      
      if (request.label && typeof request.label !== 'string') {
        errors.push('Snapshot label must be a string if provided');
      }
      break;
      
    case 'restore':
      if (!request.snapshotId) {
        errors.push('Snapshot ID is required for restore operation');
      } else if (typeof request.snapshotId !== 'string') {
        errors.push('Snapshot ID must be a string');
      }
      
      if (request.targetAgentId && typeof request.targetAgentId !== 'string') {
        errors.push('Target agent ID must be a string if provided');
      }
      break;
      
    case 'diff':
      if (!request.baseContextId) {
        errors.push('Base context ID is required for diff operation');
      } else if (typeof request.baseContextId !== 'string') {
        errors.push('Base context ID must be a string');
      }
      
      if (!request.compareContextId) {
        errors.push('Compare context ID is required for diff operation');
      } else if (typeof request.compareContextId !== 'string') {
        errors.push('Compare context ID must be a string');
      }
      break;
  }
  
  // Check options if provided
  if (request.options !== undefined) {
    if (typeof request.options !== 'object') {
      errors.push('Options must be an object');
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Continuity operation validation failed: ${errors.join(', ')}`);
  }
  
  return { valid: true, errors: [] };
}

/**
 * Validates a session object
 * @param {Object} session Session to validate
 * @returns {Object} Validation result with { valid, errors }
 * @throws {Error} If validation fails
 */
function validateSession(session) {
  const errors = [];
  
  // Check if session is an object
  if (!session || typeof session !== 'object') {
    throw new Error('Session must be an object');
  }
  
  // Check required fields
  if (!session.id) {
    errors.push('Session must have an ID');
  } else if (typeof session.id !== 'string') {
    errors.push('Session ID must be a string');
  }
  
  if (!session.startTime) {
    errors.push('Session must have a start time');
  } else if (!(session.startTime instanceof Date) && typeof session.startTime !== 'string') {
    errors.push('Session start time must be a Date object or ISO date string');
  }
  
  // Check agent ID if provided
  if (session.agentId !== undefined && typeof session.agentId !== 'string') {
    errors.push('Agent ID must be a string');
  }
  
  // Check metadata if provided
  if (session.metadata !== undefined && typeof session.metadata !== 'object') {
    errors.push('Session metadata must be an object');
  }
  
  if (errors.length > 0) {
    throw new Error(`Session validation failed: ${errors.join(', ')}`);
  }
  
  return { valid: true, errors: [] };
}

/**
 * Validates a knowledge transition record
 * @param {Object} transition Knowledge transition to validate
 * @returns {Object} Validation result with { valid, errors }
 * @throws {Error} If validation fails
 */
function validateKnowledgeTransition(transition) {
  const errors = [];
  
  // Check if transition is an object
  if (!transition || typeof transition !== 'object') {
    throw new Error('Knowledge transition must be an object');
  }
  
  // Check required fields
  if (!transition.id) {
    errors.push('Transition must have an ID');
  } else if (typeof transition.id !== 'string') {
    errors.push('Transition ID must be a string');
  }
  
  if (!transition.type) {
    errors.push('Transition must have a type');
  } else if (typeof transition.type !== 'string') {
    errors.push('Transition type must be a string');
  } else if (!['session_handoff', 'agent_transfer', 'temporal_bridge', 'state_change', 'context_merge'].includes(transition.type)) {
    errors.push('Invalid transition type');
  }
  
  if (!transition.timestamp) {
    errors.push('Transition must have a timestamp');
  } else if (!(transition.timestamp instanceof Date) && typeof transition.timestamp !== 'string') {
    errors.push('Transition timestamp must be a Date object or ISO date string');
  }
  
  if (!transition.source) {
    errors.push('Transition must have a source');
  } else if (typeof transition.source !== 'object') {
    errors.push('Transition source must be an object');
  }
  
  if (!transition.target) {
    errors.push('Transition must have a target');
  } else if (typeof transition.target !== 'object') {
    errors.push('Transition target must be an object');
  }
  
  // Check details if provided
  if (transition.details !== undefined && typeof transition.details !== 'object') {
    errors.push('Transition details must be an object');
  }
  
  if (errors.length > 0) {
    throw new Error(`Knowledge transition validation failed: ${errors.join(', ')}`);
  }
  
  return { valid: true, errors: [] };
}

/**
 * Validates a query for fetching continuity records
 * @param {Object} query Query to validate
 * @returns {Object} Validation result with { valid, errors }
 * @throws {Error} If validation fails
 */
function validateContinuityQuery(query) {
  const errors = [];
  
  // Check if query is an object
  if (!query || typeof query !== 'object') {
    throw new Error('Continuity query must be an object');
  }
  
  // Check specific fields based on their types
  if (query.agentId !== undefined && typeof query.agentId !== 'string') {
    errors.push('Agent ID must be a string');
  }
  
  if (query.sessionId !== undefined && typeof query.sessionId !== 'string') {
    errors.push('Session ID must be a string');
  }
  
  if (query.contextId !== undefined && typeof query.contextId !== 'string') {
    errors.push('Context ID must be a string');
  }
  
  if (query.transitionType !== undefined && typeof query.transitionType !== 'string') {
    errors.push('Transition type must be a string');
  }
  
  if (query.fromTimestamp !== undefined) {
    if (!(query.fromTimestamp instanceof Date) && typeof query.fromTimestamp !== 'string') {
      errors.push('From timestamp must be a Date object or ISO date string');
    }
  }
  
  if (query.toTimestamp !== undefined) {
    if (!(query.toTimestamp instanceof Date) && typeof query.toTimestamp !== 'string') {
      errors.push('To timestamp must be a Date object or ISO date string');
    }
  }
  
  if (query.limit !== undefined) {
    if (typeof query.limit !== 'number' || query.limit <= 0) {
      errors.push('Limit must be a positive number');
    }
  }
  
  if (query.offset !== undefined) {
    if (typeof query.offset !== 'number' || query.offset < 0) {
      errors.push('Offset must be a non-negative number');
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Continuity query validation failed: ${errors.join(', ')}`);
  }
  
  return { valid: true, errors: [] };
}

module.exports = {
  validateContextState,
  validateContinuityOperation,
  validateSession,
  validateKnowledgeTransition,
  validateContinuityQuery
};