/**
 * Knowledge-First Guidelines Validation Layer
 * 
 * This module provides validation functions for the Knowledge-First Guidelines framework,
 * ensuring all inputs and operations maintain data integrity and meet requirements.
 */

/**
 * Validates session initialization options
 * @param {Object} options - Options for session initialization
 * @returns {Object} Validation result with isValid and errors
 */
function validateInitializationOptions(options) {
  const errors = [];
  
  // Required fields
  if (!options) {
    return { isValid: false, errors: ['Options object is required'] };
  }
  
  // Workspace ID validation
  if (!options.workspace) {
    errors.push('Workspace ID is required');
  } else if (typeof options.workspace !== 'string') {
    errors.push('Workspace ID must be a string');
  }
  
  // Mode validation
  if (options.mode && typeof options.mode !== 'string') {
    errors.push('Mode must be a string if provided');
  }
  
  // TaskContext validation
  if (options.taskContext && typeof options.taskContext !== 'object') {
    errors.push('Task context must be an object if provided');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates response creation options
 * @param {Object} options - Options for response creation
 * @returns {Object} Validation result with isValid and errors
 */
function validateResponseOptions(options) {
  const errors = [];
  
  // Required fields
  if (!options) {
    return { isValid: false, errors: ['Options object is required'] };
  }
  
  // Query validation
  if (!options.query) {
    errors.push('Query is required');
  } else if (typeof options.query !== 'string' && typeof options.query !== 'object') {
    errors.push('Query must be a string or an object');
  }
  
  // Session validation
  if (!options.session) {
    errors.push('Session is required');
  } else if (typeof options.session !== 'object') {
    errors.push('Session must be an object');
  } else if (!options.session.initialized) {
    errors.push('Session must be initialized');
  }
  
  // Optional parameters validation
  if (options.requireValidation !== undefined && typeof options.requireValidation !== 'boolean') {
    errors.push('requireValidation must be a boolean if provided');
  }
  
  if (options.classifySources !== undefined && typeof options.classifySources !== 'boolean') {
    errors.push('classifySources must be a boolean if provided');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates decision making options
 * @param {Object} options - Options for making a decision
 * @returns {Object} Validation result with isValid and errors
 */
function validateDecisionOptions(options) {
  const errors = [];
  
  // Required fields
  if (!options) {
    return { isValid: false, errors: ['Options object is required'] };
  }
  
  // Decision point validation
  if (!options.decisionPoint) {
    errors.push('Decision point is required');
  } else if (typeof options.decisionPoint !== 'string') {
    errors.push('Decision point must be a string');
  }
  
  // Options validation
  if (!options.options || !Array.isArray(options.options) || options.options.length === 0) {
    errors.push('Decision options array is required and must not be empty');
  }
  
  // Context validation
  if (!options.context) {
    errors.push('Context is required');
  } else if (typeof options.context !== 'object') {
    errors.push('Context must be an object');
  }
  
  // Session validation
  if (!options.session) {
    errors.push('Session is required');
  } else if (typeof options.session !== 'object') {
    errors.push('Session must be an object');
  } else if (!options.session.initialized) {
    errors.push('Session must be initialized');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates completion options
 * @param {Object} options - Options for completing a session
 * @returns {Object} Validation result with isValid and errors
 */
function validateCompletionOptions(options) {
  const errors = [];
  
  // Required fields
  if (!options) {
    return { isValid: false, errors: ['Options object is required'] };
  }
  
  // Session validation
  if (!options.session) {
    errors.push('Session is required');
  } else if (typeof options.session !== 'object') {
    errors.push('Session must be an object');
  } else if (!options.session.initialized) {
    errors.push('Session must be initialized');
  }
  
  // Optional parameters validation
  if (options.newKnowledge && !Array.isArray(options.newKnowledge)) {
    errors.push('New knowledge must be an array if provided');
  }
  
  if (!options.taskOutcome) {
    errors.push('Task outcome is required');
  } else if (typeof options.taskOutcome !== 'object') {
    errors.push('Task outcome must be an object');
  }
  
  if (options.preservationRecommendations && !Array.isArray(options.preservationRecommendations)) {
    errors.push('Preservation recommendations must be an array if provided');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates analysis options
 * @param {Object} options - Options for analyzing a session
 * @returns {Object} Validation result with isValid and errors
 */
function validateAnalysisOptions(options) {
  const errors = [];
  
  // Required fields
  if (!options) {
    return { isValid: false, errors: ['Options object is required'] };
  }
  
  // Session validation
  if (!options.session) {
    errors.push('Session is required');
  } else if (typeof options.session !== 'object') {
    errors.push('Session must be an object');
  } else if (!options.session.initialized) {
    errors.push('Session must be initialized');
  }
  
  // Optional parameters validation
  if (options.knowledgeUtilization && typeof options.knowledgeUtilization !== 'object') {
    errors.push('Knowledge utilization must be an object if provided');
  }
  
  if (options.identifiedGaps && !Array.isArray(options.identifiedGaps)) {
    errors.push('Identified gaps must be an array if provided');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

module.exports = {
  validateInitializationOptions,
  validateResponseOptions,
  validateDecisionOptions,
  validateCompletionOptions,
  validateAnalysisOptions
};