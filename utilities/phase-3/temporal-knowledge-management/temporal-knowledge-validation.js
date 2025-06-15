/**
 * Temporal Knowledge Management Validation
 * 
 * This module provides validation functions for the temporal knowledge management system,
 * ensuring data integrity and proper formatting for temporal operations.
 */

/**
 * Creates validation functions for temporal knowledge management
 * @returns {Object} Validation functions
 */
function validateTemporalKnowledge() {
  /**
   * Validates a knowledge artifact version creation request
   * @param {Object} versionData Version data to validate
   * @returns {Object} Validation result with valid flag and errors array
   */
  function validateVersionCreation(versionData) {
    const errors = [];
    
    // Check if versionData is an object
    if (!versionData || typeof versionData !== 'object') {
      errors.push('Version data must be an object');
      return { valid: false, errors };
    }
    
    // Check required fields
    if (!versionData.artifactType) {
      errors.push('Artifact type is required');
    } else if (typeof versionData.artifactType !== 'string') {
      errors.push('Artifact type must be a string');
    }
    
    if (!versionData.artifactId) {
      errors.push('Artifact ID is required');
    } else if (typeof versionData.artifactId !== 'string' && typeof versionData.artifactId !== 'number') {
      errors.push('Artifact ID must be a string or number');
    }
    
    if (!versionData.content) {
      errors.push('Content is required');
    }
    
    // Validate optional fields if provided
    if (versionData.metadata !== undefined && typeof versionData.metadata !== 'object') {
      errors.push('Metadata must be an object if provided');
    }
    
    if (versionData.parentVersionId !== undefined && 
        typeof versionData.parentVersionId !== 'string' && 
        typeof versionData.parentVersionId !== 'number') {
      errors.push('Parent version ID must be a string or number if provided');
    }
    
    if (versionData.tags !== undefined) {
      if (!Array.isArray(versionData.tags)) {
        errors.push('Tags must be an array if provided');
      } else {
        for (const tag of versionData.tags) {
          if (typeof tag !== 'string') {
            errors.push('Each tag must be a string');
            break;
          }
        }
      }
    }
    
    return { valid: errors.length === 0, errors };
  }
  
  /**
   * Validates parameters for retrieving a specific version
   * @param {Object} params Parameters to validate
   * @returns {Object} Validation result with valid flag and errors array
   */
  function validateVersionRetrieval(params) {
    const errors = [];
    
    // Check if params is an object
    if (!params || typeof params !== 'object') {
      errors.push('Parameters must be an object');
      return { valid: false, errors };
    }
    
    // Check required fields
    if (!params.artifactType) {
      errors.push('Artifact type is required');
    } else if (typeof params.artifactType !== 'string') {
      errors.push('Artifact type must be a string');
    }
    
    if (!params.artifactId) {
      errors.push('Artifact ID is required');
    } else if (typeof params.artifactId !== 'string' && typeof params.artifactId !== 'number') {
      errors.push('Artifact ID must be a string or number');
    }
    
    // Either versionId or timestamp is required
    if (params.versionId === undefined && params.timestamp === undefined) {
      errors.push('Either versionId or timestamp must be provided');
    }
    
    if (params.versionId !== undefined && 
        typeof params.versionId !== 'string' && 
        typeof params.versionId !== 'number') {
      errors.push('Version ID must be a string or number if provided');
    }
    
    if (params.timestamp !== undefined) {
      if (typeof params.timestamp !== 'string' && !(params.timestamp instanceof Date)) {
        errors.push('Timestamp must be a string or Date object if provided');
      } else if (typeof params.timestamp === 'string') {
        // Check if string is a valid ISO date
        const date = new Date(params.timestamp);
        if (isNaN(date.getTime())) {
          errors.push('Timestamp string must be a valid ISO date format');
        }
      }
    }
    
    return { valid: errors.length === 0, errors };
  }
  
  /**
   * Validates parameters for listing versions
   * @param {Object} params Parameters to validate
   * @returns {Object} Validation result with valid flag and errors array
   */
  function validateVersionListing(params) {
    const errors = [];
    
    // Check if params is an object
    if (!params || typeof params !== 'object') {
      errors.push('Parameters must be an object');
      return { valid: false, errors };
    }
    
    // Check required fields
    if (!params.artifactType) {
      errors.push('Artifact type is required');
    } else if (typeof params.artifactType !== 'string') {
      errors.push('Artifact type must be a string');
    }
    
    if (!params.artifactId) {
      errors.push('Artifact ID is required');
    } else if (typeof params.artifactId !== 'string' && typeof params.artifactId !== 'number') {
      errors.push('Artifact ID must be a string or number');
    }
    
    // Validate optional fields if provided
    if (params.limit !== undefined) {
      if (typeof params.limit !== 'number' || params.limit <= 0) {
        errors.push('Limit must be a positive number if provided');
      }
    }
    
    if (params.startTimestamp !== undefined) {
      if (typeof params.startTimestamp !== 'string' && !(params.startTimestamp instanceof Date)) {
        errors.push('Start timestamp must be a string or Date object if provided');
      } else if (typeof params.startTimestamp === 'string') {
        // Check if string is a valid ISO date
        const date = new Date(params.startTimestamp);
        if (isNaN(date.getTime())) {
          errors.push('Start timestamp string must be a valid ISO date format');
        }
      }
    }
    
    if (params.endTimestamp !== undefined) {
      if (typeof params.endTimestamp !== 'string' && !(params.endTimestamp instanceof Date)) {
        errors.push('End timestamp must be a string or Date object if provided');
      } else if (typeof params.endTimestamp === 'string') {
        // Check if string is a valid ISO date
        const date = new Date(params.endTimestamp);
        if (isNaN(date.getTime())) {
          errors.push('End timestamp string must be a valid ISO date format');
        }
      }
    }
    
    if (params.tags !== undefined) {
      if (!Array.isArray(params.tags)) {
        errors.push('Tags filter must be an array if provided');
      } else {
        for (const tag of params.tags) {
          if (typeof tag !== 'string') {
            errors.push('Each tag in filter must be a string');
            break;
          }
        }
      }
    }
    
    return { valid: errors.length === 0, errors };
  }
  
  /**
   * Validates parameters for comparing versions
   * @param {Object} params Parameters to validate
   * @returns {Object} Validation result with valid flag and errors array
   */
  function validateVersionComparison(params) {
    const errors = [];
    
    // Check if params is an object
    if (!params || typeof params !== 'object') {
      errors.push('Parameters must be an object');
      return { valid: false, errors };
    }
    
    // Check required fields
    if (!params.artifactType) {
      errors.push('Artifact type is required');
    } else if (typeof params.artifactType !== 'string') {
      errors.push('Artifact type must be a string');
    }
    
    if (!params.artifactId) {
      errors.push('Artifact ID is required');
    } else if (typeof params.artifactId !== 'string' && typeof params.artifactId !== 'number') {
      errors.push('Artifact ID must be a string or number');
    }
    
    // Either baseVersionId or baseTimestamp is required
    if (params.baseVersionId === undefined && params.baseTimestamp === undefined) {
      errors.push('Either baseVersionId or baseTimestamp must be provided');
    }
    
    // Either targetVersionId or targetTimestamp is required
    if (params.targetVersionId === undefined && params.targetTimestamp === undefined) {
      errors.push('Either targetVersionId or targetTimestamp must be provided');
    }
    
    // Validate version IDs if provided
    if (params.baseVersionId !== undefined && 
        typeof params.baseVersionId !== 'string' && 
        typeof params.baseVersionId !== 'number') {
      errors.push('Base version ID must be a string or number if provided');
    }
    
    if (params.targetVersionId !== undefined && 
        typeof params.targetVersionId !== 'string' && 
        typeof params.targetVersionId !== 'number') {
      errors.push('Target version ID must be a string or number if provided');
    }
    
    // Validate timestamps if provided
    if (params.baseTimestamp !== undefined) {
      if (typeof params.baseTimestamp !== 'string' && !(params.baseTimestamp instanceof Date)) {
        errors.push('Base timestamp must be a string or Date object if provided');
      } else if (typeof params.baseTimestamp === 'string') {
        // Check if string is a valid ISO date
        const date = new Date(params.baseTimestamp);
        if (isNaN(date.getTime())) {
          errors.push('Base timestamp string must be a valid ISO date format');
        }
      }
    }
    
    if (params.targetTimestamp !== undefined) {
      if (typeof params.targetTimestamp !== 'string' && !(params.targetTimestamp instanceof Date)) {
        errors.push('Target timestamp must be a string or Date object if provided');
      } else if (typeof params.targetTimestamp === 'string') {
        // Check if string is a valid ISO date
        const date = new Date(params.targetTimestamp);
        if (isNaN(date.getTime())) {
          errors.push('Target timestamp string must be a valid ISO date format');
        }
      }
    }
    
    return { valid: errors.length === 0, errors };
  }
  
  /**
   * Validates dependency registration parameters
   * @param {Object} params Dependency parameters to validate
   * @returns {Object} Validation result with valid flag and errors array
   */
  function validateDependencyRegistration(params) {
    const errors = [];
    
    // Check if params is an object
    if (!params || typeof params !== 'object') {
      errors.push('Parameters must be an object');
      return { valid: false, errors };
    }
    
    // Check required fields for source artifact
    if (!params.sourceType) {
      errors.push('Source artifact type is required');
    } else if (typeof params.sourceType !== 'string') {
      errors.push('Source artifact type must be a string');
    }
    
    if (!params.sourceId) {
      errors.push('Source artifact ID is required');
    } else if (typeof params.sourceId !== 'string' && typeof params.sourceId !== 'number') {
      errors.push('Source artifact ID must be a string or number');
    }
    
    // Check required fields for target artifact
    if (!params.targetType) {
      errors.push('Target artifact type is required');
    } else if (typeof params.targetType !== 'string') {
      errors.push('Target artifact type must be a string');
    }
    
    if (!params.targetId) {
      errors.push('Target artifact ID is required');
    } else if (typeof params.targetId !== 'string' && typeof params.targetId !== 'number') {
      errors.push('Target artifact ID must be a string or number');
    }
    
    // Validate optional fields if provided
    if (params.dependencyType !== undefined && typeof params.dependencyType !== 'string') {
      errors.push('Dependency type must be a string if provided');
    }
    
    if (params.strength !== undefined) {
      if (typeof params.strength !== 'string' && typeof params.strength !== 'number') {
        errors.push('Dependency strength must be a string or number if provided');
      }
    }
    
    if (params.metadata !== undefined && typeof params.metadata !== 'object') {
      errors.push('Metadata must be an object if provided');
    }
    
    return { valid: errors.length === 0, errors };
  }
  
  /**
   * Validates lifecycle state update parameters
   * @param {Object} params State update parameters to validate
   * @returns {Object} Validation result with valid flag and errors array
   */
  function validateLifecycleStateUpdate(params) {
    const errors = [];
    
    // Check if params is an object
    if (!params || typeof params !== 'object') {
      errors.push('Parameters must be an object');
      return { valid: false, errors };
    }
    
    // Check required fields
    if (!params.artifactType) {
      errors.push('Artifact type is required');
    } else if (typeof params.artifactType !== 'string') {
      errors.push('Artifact type must be a string');
    }
    
    if (!params.artifactId) {
      errors.push('Artifact ID is required');
    } else if (typeof params.artifactId !== 'string' && typeof params.artifactId !== 'number') {
      errors.push('Artifact ID must be a string or number');
    }
    
    if (!params.state) {
      errors.push('Lifecycle state is required');
    } else if (typeof params.state !== 'string') {
      errors.push('Lifecycle state must be a string');
    }
    
    // Validate optional fields if provided
    if (params.reason !== undefined && typeof params.reason !== 'string') {
      errors.push('Reason must be a string if provided');
    }
    
    if (params.versionId !== undefined && 
        typeof params.versionId !== 'string' && 
        typeof params.versionId !== 'number') {
      errors.push('Version ID must be a string or number if provided');
    }
    
    if (params.metadata !== undefined && typeof params.metadata !== 'object') {
      errors.push('Metadata must be an object if provided');
    }
    
    return { valid: errors.length === 0, errors };
  }
  
  /**
   * Validates impact analysis request parameters
   * @param {Object} params Impact analysis parameters
   * @returns {Object} Validation result with valid flag and errors array
   */
  function validateImpactAnalysis(params) {
    const errors = [];
    
    // Check if params is an object
    if (!params || typeof params !== 'object') {
      errors.push('Parameters must be an object');
      return { valid: false, errors };
    }
    
    // Check required fields
    if (!params.artifactType) {
      errors.push('Artifact type is required');
    } else if (typeof params.artifactType !== 'string') {
      errors.push('Artifact type must be a string');
    }
    
    if (!params.artifactId) {
      errors.push('Artifact ID is required');
    } else if (typeof params.artifactId !== 'string' && typeof params.artifactId !== 'number') {
      errors.push('Artifact ID must be a string or number');
    }
    
    // Validate optional fields if provided
    if (params.versionId !== undefined && 
        typeof params.versionId !== 'string' && 
        typeof params.versionId !== 'number') {
      errors.push('Version ID must be a string or number if provided');
    }
    
    if (params.depth !== undefined) {
      if (typeof params.depth !== 'number' || params.depth <= 0) {
        errors.push('Depth must be a positive number if provided');
      }
    }
    
    if (params.direction !== undefined) {
      if (typeof params.direction !== 'string' || 
          !['upstream', 'downstream', 'both'].includes(params.direction)) {
        errors.push('Direction must be one of: "upstream", "downstream", "both"');
      }
    }
    
    return { valid: errors.length === 0, errors };
  }

  return {
    validateVersionCreation,
    validateVersionRetrieval,
    validateVersionListing,
    validateVersionComparison,
    validateDependencyRegistration,
    validateLifecycleStateUpdate,
    validateImpactAnalysis
  };
}

module.exports = {
  validateTemporalKnowledge
};