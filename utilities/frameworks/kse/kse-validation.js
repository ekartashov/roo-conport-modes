/**
 * Knowledge Synthesis Engine (KSE) - Validation Layer
 * 
 * This layer provides validation functions for artifacts, strategies,
 * rules, and synthesis requests to ensure data integrity and consistency.
 */

/**
 * Validates a synthesis request
 * @param {Object} request Synthesis request to validate
 * @returns {Object} Validation result with { valid, errors }
 * @throws {Error} If validation fails
 */
function validateSynthesisRequest(request) {
  const errors = [];
  
  // Check if request is an object
  if (!request || typeof request !== 'object') {
    throw new Error('Synthesis request must be an object');
  }
  
  // Validate artifacts array
  if (!request.artifacts) {
    errors.push('Artifacts array is required');
  } else if (!Array.isArray(request.artifacts)) {
    errors.push('Artifacts must be an array');
  } else if (request.artifacts.length === 0) {
    errors.push('At least one artifact is required');
  } else {
    // Validate each artifact
    request.artifacts.forEach((artifact, index) => {
      try {
        validateArtifact(artifact);
      } catch (error) {
        errors.push(`Artifact at index ${index} is invalid: ${error.message}`);
      }
    });
  }
  
  // Validate strategy
  if (!request.strategy) {
    errors.push('Synthesis strategy is required');
  } else if (typeof request.strategy !== 'string') {
    errors.push('Strategy must be a string');
  }
  
  // Validate strategy params if provided
  if (request.strategyParams !== undefined && 
      (typeof request.strategyParams !== 'object' || Array.isArray(request.strategyParams))) {
    errors.push('Strategy parameters must be an object');
  }
  
  // Validate context if provided
  if (request.context !== undefined && 
      (typeof request.context !== 'object' || Array.isArray(request.context))) {
    errors.push('Context must be an object');
  }
  
  // Validate preserveContext if provided
  if (request.preserveContext !== undefined && typeof request.preserveContext !== 'boolean') {
    errors.push('preserveContext must be a boolean');
  }
  
  // Validate storeResult if provided
  if (request.storeResult !== undefined && typeof request.storeResult !== 'boolean') {
    errors.push('storeResult must be a boolean');
  }
  
  if (errors.length > 0) {
    throw new Error(`Synthesis request validation failed: ${errors.join(', ')}`);
  }
  
  return { valid: true, errors: [] };
}

/**
 * Validates a knowledge artifact
 * @param {Object} artifact Artifact to validate
 * @returns {Object} Validation result with { valid, errors }
 * @throws {Error} If validation fails
 */
function validateArtifact(artifact) {
  const errors = [];
  
  // Check if artifact is an object
  if (!artifact || typeof artifact !== 'object') {
    throw new Error('Artifact must be an object');
  }
  
  // Check required fields
  if (!artifact.type) {
    errors.push('Artifact must have a type');
  } else if (typeof artifact.type !== 'string') {
    errors.push('Artifact type must be a string');
  }
  
  // Check ID if provided
  const id = artifact.id || artifact._id;
  if (id !== undefined && typeof id !== 'string' && typeof id !== 'number') {
    errors.push('Artifact ID must be a string or number');
  }
  
  // Check provenance if provided
  if (artifact.provenance !== undefined) {
    if (typeof artifact.provenance !== 'object' || Array.isArray(artifact.provenance)) {
      errors.push('Provenance must be an object');
    } else {
      // Validate provenance fields if present
      if (artifact.provenance.sources !== undefined && !Array.isArray(artifact.provenance.sources)) {
        errors.push('Provenance sources must be an array');
      }
      
      if (artifact.provenance.strategy !== undefined && 
          (typeof artifact.provenance.strategy !== 'object' || Array.isArray(artifact.provenance.strategy))) {
        errors.push('Provenance strategy must be an object');
      }
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Artifact validation failed: ${errors.join(', ')}`);
  }
  
  return { valid: true, errors: [] };
}

/**
 * Validates a synthesis strategy definition
 * @param {string} name Strategy name
 * @param {Function} strategyFn Strategy implementation function
 * @param {Object} metadata Strategy metadata
 * @returns {Object} Validation result with { valid, errors }
 * @throws {Error} If validation fails
 */
function validateStrategy(name, strategyFn, metadata = {}) {
  const errors = [];
  
  // Validate name
  if (!name) {
    errors.push('Strategy name is required');
  } else if (typeof name !== 'string') {
    errors.push('Strategy name must be a string');
  }
  
  // Validate strategy function
  if (!strategyFn) {
    errors.push('Strategy function is required');
  } else if (typeof strategyFn !== 'function') {
    errors.push('Strategy must be a function');
  }
  
  // Validate metadata if provided
  if (metadata !== undefined && (typeof metadata !== 'object' || Array.isArray(metadata))) {
    errors.push('Strategy metadata must be an object');
  } else {
    // Validate specific metadata fields
    if (metadata.supportedTypes !== undefined) {
      if (!Array.isArray(metadata.supportedTypes)) {
        errors.push('supportedTypes must be an array');
      } else if (metadata.supportedTypes.length === 0) {
        errors.push('supportedTypes array cannot be empty');
      }
    }
    
    if (metadata.params !== undefined && 
        (typeof metadata.params !== 'object' || Array.isArray(metadata.params))) {
      errors.push('params must be an object');
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Strategy validation failed: ${errors.join(', ')}`);
  }
  
  return { valid: true, errors: [] };
}

/**
 * Validates a synthesis rule
 * @param {Object} rule Rule to validate
 * @returns {Object} Validation result with { valid, errors }
 * @throws {Error} If validation fails
 */
function validateRule(rule) {
  const errors = [];
  
  // Check if rule is an object
  if (!rule || typeof rule !== 'object') {
    throw new Error('Rule must be an object');
  }
  
  // Check required fields
  if (!rule.name) {
    errors.push('Rule name is required');
  } else if (typeof rule.name !== 'string') {
    errors.push('Rule name must be a string');
  }
  
  if (!rule.condition) {
    errors.push('Rule condition is required');
  } else if (typeof rule.condition !== 'function' && typeof rule.condition !== 'string') {
    errors.push('Rule condition must be a function or string expression');
  }
  
  if (!rule.action) {
    errors.push('Rule action is required');
  } else if (typeof rule.action !== 'function') {
    errors.push('Rule action must be a function');
  }
  
  // Validate priority if provided
  if (rule.priority !== undefined && typeof rule.priority !== 'number') {
    errors.push('Rule priority must be a number');
  }
  
  // Validate description if provided
  if (rule.description !== undefined && typeof rule.description !== 'string') {
    errors.push('Rule description must be a string');
  }
  
  if (errors.length > 0) {
    throw new Error(`Rule validation failed: ${errors.join(', ')}`);
  }
  
  return { valid: true, errors: [] };
}

/**
 * Validates transformation parameters
 * @param {Object} params Transformation parameters
 * @returns {Object} Validation result with { valid, errors }
 * @throws {Error} If validation fails
 */
function validateTransformationParams(params) {
  const errors = [];
  
  // Check if params is an object
  if (!params || typeof params !== 'object') {
    throw new Error('Transformation parameters must be an object');
  }
  
  // Validate rules array if present
  if (params.rules !== undefined) {
    if (!Array.isArray(params.rules)) {
      errors.push('Rules must be an array');
    } else {
      // Validate each rule
      params.rules.forEach((rule, index) => {
        if (typeof rule !== 'object' || Array.isArray(rule)) {
          errors.push(`Rule at index ${index} must be an object`);
          return;
        }
        
        if (!rule.sourceField) {
          errors.push(`Rule at index ${index} must have a sourceField`);
        } else if (typeof rule.sourceField !== 'string') {
          errors.push(`sourceField at index ${index} must be a string`);
        }
        
        if (!rule.targetField) {
          errors.push(`Rule at index ${index} must have a targetField`);
        } else if (typeof rule.targetField !== 'string') {
          errors.push(`targetField at index ${index} must be a string`);
        }
        
        if (!rule.operation) {
          errors.push(`Rule at index ${index} must have an operation`);
        } else if (typeof rule.operation !== 'string') {
          errors.push(`operation at index ${index} must be a string`);
        } else if (!['copy', 'move', 'transform'].includes(rule.operation)) {
          errors.push(`operation at index ${index} must be one of: copy, move, transform`);
        }
        
        if (rule.operation === 'transform' && typeof rule.transformFn !== 'function') {
          errors.push(`transformFn at index ${index} must be a function when operation is 'transform'`);
        }
      });
    }
  }
  
  // Validate mergeResults if present
  if (params.mergeResults !== undefined && typeof params.mergeResults !== 'boolean') {
    errors.push('mergeResults must be a boolean');
  }
  
  if (errors.length > 0) {
    throw new Error(`Transformation parameters validation failed: ${errors.join(', ')}`);
  }
  
  return { valid: true, errors: [] };
}

module.exports = {
  validateSynthesisRequest,
  validateArtifact,
  validateStrategy,
  validateRule,
  validateTransformationParams
};