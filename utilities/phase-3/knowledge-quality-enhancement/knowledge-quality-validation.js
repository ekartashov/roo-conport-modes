/**
 * Knowledge Quality Enhancement System - Validation Layer
 * 
 * This module provides validation functions for the Knowledge Quality Enhancement System.
 * It ensures that all inputs to the system are properly validated before processing.
 */

/**
 * Validates the options for knowledge quality assessment
 * @param {Object} options - The options to validate
 * @param {string} options.artifactType - The type of knowledge artifact (decision, pattern, document, etc.)
 * @param {string} options.artifactId - The unique identifier of the artifact
 * @param {string} [options.versionId] - Optional specific version to assess
 * @param {Array<string>} [options.qualityDimensions] - Optional specific quality dimensions to assess
 * @param {boolean} [options.includeContent] - Whether to include artifact content in result
 * @returns {Object} The validated options
 * @throws {Error} If validation fails
 */
function validateQualityAssessmentOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Options must be a valid object');
  }

  if (!options.artifactType || typeof options.artifactType !== 'string') {
    throw new Error('artifactType is required and must be a string');
  }

  if (!options.artifactId || typeof options.artifactId !== 'string') {
    throw new Error('artifactId is required and must be a string');
  }

  if (options.versionId !== undefined && typeof options.versionId !== 'string') {
    throw new Error('versionId must be a string when provided');
  }

  if (options.qualityDimensions !== undefined) {
    if (!Array.isArray(options.qualityDimensions)) {
      throw new Error('qualityDimensions must be an array when provided');
    }
    
    options.qualityDimensions.forEach(dimension => {
      if (typeof dimension !== 'string') {
        throw new Error('Each quality dimension must be a string');
      }
    });
  }

  if (options.includeContent !== undefined && typeof options.includeContent !== 'boolean') {
    throw new Error('includeContent must be a boolean when provided');
  }

  return {
    artifactType: options.artifactType,
    artifactId: options.artifactId,
    versionId: options.versionId,
    qualityDimensions: options.qualityDimensions || [],
    includeContent: options.includeContent !== undefined ? options.includeContent : false
  };
}

/**
 * Validates options for defining quality criteria
 * @param {Object} options - The options to validate
 * @param {string} options.dimension - The quality dimension (e.g., 'completeness', 'accuracy')
 * @param {string} options.description - Description of the quality dimension
 * @param {Object} options.criteria - The specific criteria for evaluation
 * @param {number} [options.weight] - Optional weight for scoring (0-100)
 * @param {Array<string>} [options.applicableTypes] - Optional artifact types this applies to
 * @returns {Object} The validated options
 * @throws {Error} If validation fails
 */
function validateQualityCriteriaOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Options must be a valid object');
  }

  if (!options.dimension || typeof options.dimension !== 'string') {
    throw new Error('dimension is required and must be a string');
  }

  if (!options.description || typeof options.description !== 'string') {
    throw new Error('description is required and must be a string');
  }

  if (!options.criteria || typeof options.criteria !== 'object') {
    throw new Error('criteria is required and must be an object');
  }

  if (options.weight !== undefined) {
    if (typeof options.weight !== 'number') {
      throw new Error('weight must be a number when provided');
    }
    
    if (options.weight < 0 || options.weight > 100) {
      throw new Error('weight must be between 0 and 100');
    }
  }

  if (options.applicableTypes !== undefined) {
    if (!Array.isArray(options.applicableTypes)) {
      throw new Error('applicableTypes must be an array when provided');
    }
    
    options.applicableTypes.forEach(type => {
      if (typeof type !== 'string') {
        throw new Error('Each applicable type must be a string');
      }
    });
  }

  return {
    dimension: options.dimension,
    description: options.description,
    criteria: options.criteria,
    weight: options.weight !== undefined ? options.weight : 50,
    applicableTypes: options.applicableTypes || []
  };
}

/**
 * Validates options for enhancing knowledge quality
 * @param {Object} options - The options to validate
 * @param {string} options.artifactType - The type of knowledge artifact
 * @param {string} options.artifactId - The unique identifier of the artifact
 * @param {string} [options.versionId] - Optional specific version to enhance
 * @param {Array<string>} options.enhancementTypes - Types of enhancements to apply
 * @param {Object} [options.enhancementOptions] - Optional enhancement-specific options
 * @param {boolean} [options.createNewVersion] - Whether to create a new version after enhancement
 * @returns {Object} The validated options
 * @throws {Error} If validation fails
 */
function validateQualityEnhancementOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Options must be a valid object');
  }

  if (!options.artifactType || typeof options.artifactType !== 'string') {
    throw new Error('artifactType is required and must be a string');
  }

  if (!options.artifactId || typeof options.artifactId !== 'string') {
    throw new Error('artifactId is required and must be a string');
  }

  if (options.versionId !== undefined && typeof options.versionId !== 'string') {
    throw new Error('versionId must be a string when provided');
  }

  if (!options.enhancementTypes || !Array.isArray(options.enhancementTypes)) {
    throw new Error('enhancementTypes is required and must be an array');
  }
  
  if (options.enhancementTypes.length === 0) {
    throw new Error('At least one enhancement type must be specified');
  }
  
  options.enhancementTypes.forEach(type => {
    if (typeof type !== 'string') {
      throw new Error('Each enhancement type must be a string');
    }
  });

  if (options.enhancementOptions !== undefined && typeof options.enhancementOptions !== 'object') {
    throw new Error('enhancementOptions must be an object when provided');
  }

  if (options.createNewVersion !== undefined && typeof options.createNewVersion !== 'boolean') {
    throw new Error('createNewVersion must be a boolean when provided');
  }

  return {
    artifactType: options.artifactType,
    artifactId: options.artifactId,
    versionId: options.versionId,
    enhancementTypes: options.enhancementTypes,
    enhancementOptions: options.enhancementOptions || {},
    createNewVersion: options.createNewVersion !== undefined ? options.createNewVersion : true
  };
}

/**
 * Validates options for batch quality assessment
 * @param {Object} options - The options to validate
 * @param {Array<Object>} options.artifacts - Array of artifacts to assess
 * @param {Array<string>} [options.qualityDimensions] - Optional specific quality dimensions to assess
 * @param {boolean} [options.includeContent] - Whether to include artifact content in result
 * @param {number} [options.concurrency] - Optional concurrency limit for batch processing
 * @returns {Object} The validated options
 * @throws {Error} If validation fails
 */
function validateBatchQualityAssessmentOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Options must be a valid object');
  }

  if (!options.artifacts || !Array.isArray(options.artifacts)) {
    throw new Error('artifacts is required and must be an array');
  }
  
  if (options.artifacts.length === 0) {
    throw new Error('At least one artifact must be specified');
  }
  
  options.artifacts.forEach(artifact => {
    if (!artifact || typeof artifact !== 'object') {
      throw new Error('Each artifact must be an object');
    }
    
    if (!artifact.artifactType || typeof artifact.artifactType !== 'string') {
      throw new Error('Each artifact must have an artifactType string');
    }
    
    if (!artifact.artifactId || typeof artifact.artifactId !== 'string') {
      throw new Error('Each artifact must have an artifactId string');
    }
  });

  if (options.qualityDimensions !== undefined) {
    if (!Array.isArray(options.qualityDimensions)) {
      throw new Error('qualityDimensions must be an array when provided');
    }
    
    options.qualityDimensions.forEach(dimension => {
      if (typeof dimension !== 'string') {
        throw new Error('Each quality dimension must be a string');
      }
    });
  }

  if (options.includeContent !== undefined && typeof options.includeContent !== 'boolean') {
    throw new Error('includeContent must be a boolean when provided');
  }

  if (options.concurrency !== undefined) {
    if (typeof options.concurrency !== 'number') {
      throw new Error('concurrency must be a number when provided');
    }
    
    if (options.concurrency < 1) {
      throw new Error('concurrency must be at least 1');
    }
  }

  return {
    artifacts: options.artifacts,
    qualityDimensions: options.qualityDimensions || [],
    includeContent: options.includeContent !== undefined ? options.includeContent : false,
    concurrency: options.concurrency || 5
  };
}

/**
 * Validates options for quality trend analysis
 * @param {Object} options - The options to validate
 * @param {string} options.artifactType - The type of knowledge artifact
 * @param {string} options.artifactId - The unique identifier of the artifact
 * @param {string} [options.startDate] - Optional start date for trend analysis
 * @param {string} [options.endDate] - Optional end date for trend analysis
 * @param {Array<string>} [options.qualityDimensions] - Optional specific quality dimensions to analyze
 * @param {number} [options.intervals] - Optional number of time intervals for analysis
 * @returns {Object} The validated options
 * @throws {Error} If validation fails
 */
function validateQualityTrendOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Options must be a valid object');
  }

  if (!options.artifactType || typeof options.artifactType !== 'string') {
    throw new Error('artifactType is required and must be a string');
  }

  if (!options.artifactId || typeof options.artifactId !== 'string') {
    throw new Error('artifactId is required and must be a string');
  }

  if (options.startDate !== undefined) {
    if (typeof options.startDate !== 'string') {
      throw new Error('startDate must be a string when provided');
    }
    
    const startDate = new Date(options.startDate);
    if (isNaN(startDate.getTime())) {
      throw new Error('startDate must be a valid date string');
    }
  }

  if (options.endDate !== undefined) {
    if (typeof options.endDate !== 'string') {
      throw new Error('endDate must be a string when provided');
    }
    
    const endDate = new Date(options.endDate);
    if (isNaN(endDate.getTime())) {
      throw new Error('endDate must be a valid date string');
    }
  }

  if (options.startDate && options.endDate) {
    const startDate = new Date(options.startDate);
    const endDate = new Date(options.endDate);
    
    if (startDate > endDate) {
      throw new Error('startDate must be before endDate');
    }
  }

  if (options.qualityDimensions !== undefined) {
    if (!Array.isArray(options.qualityDimensions)) {
      throw new Error('qualityDimensions must be an array when provided');
    }
    
    options.qualityDimensions.forEach(dimension => {
      if (typeof dimension !== 'string') {
        throw new Error('Each quality dimension must be a string');
      }
    });
  }

  if (options.intervals !== undefined) {
    if (typeof options.intervals !== 'number') {
      throw new Error('intervals must be a number when provided');
    }
    
    if (options.intervals < 1) {
      throw new Error('intervals must be at least 1');
    }
  }

  return {
    artifactType: options.artifactType,
    artifactId: options.artifactId,
    startDate: options.startDate,
    endDate: options.endDate || new Date().toISOString(),
    qualityDimensions: options.qualityDimensions || [],
    intervals: options.intervals || 10
  };
}

/**
 * Validates options for quality threshold configuration
 * @param {Object} options - The options to validate
 * @param {string} options.dimension - The quality dimension to set threshold for
 * @param {number} options.threshold - The threshold value (0-100)
 * @param {Array<string>} [options.applicableTypes] - Optional artifact types this threshold applies to
 * @param {string} [options.alertLevel] - Optional alert level ('info', 'warning', 'error')
 * @param {Object} [options.alertActions] - Optional actions to take when threshold is crossed
 * @returns {Object} The validated options
 * @throws {Error} If validation fails
 */
function validateQualityThresholdOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Options must be a valid object');
  }

  if (!options.dimension || typeof options.dimension !== 'string') {
    throw new Error('dimension is required and must be a string');
  }

  if (options.threshold === undefined || typeof options.threshold !== 'number') {
    throw new Error('threshold is required and must be a number');
  }
  
  if (options.threshold < 0 || options.threshold > 100) {
    throw new Error('threshold must be between 0 and 100');
  }

  if (options.applicableTypes !== undefined) {
    if (!Array.isArray(options.applicableTypes)) {
      throw new Error('applicableTypes must be an array when provided');
    }
    
    options.applicableTypes.forEach(type => {
      if (typeof type !== 'string') {
        throw new Error('Each applicable type must be a string');
      }
    });
  }

  if (options.alertLevel !== undefined) {
    if (typeof options.alertLevel !== 'string') {
      throw new Error('alertLevel must be a string when provided');
    }
    
    const validAlertLevels = ['info', 'warning', 'error'];
    if (!validAlertLevels.includes(options.alertLevel)) {
      throw new Error(`alertLevel must be one of: ${validAlertLevels.join(', ')}`);
    }
  }

  if (options.alertActions !== undefined && typeof options.alertActions !== 'object') {
    throw new Error('alertActions must be an object when provided');
  }

  return {
    dimension: options.dimension,
    threshold: options.threshold,
    applicableTypes: options.applicableTypes || [],
    alertLevel: options.alertLevel || 'warning',
    alertActions: options.alertActions || {}
  };
}

// Export validation functions
module.exports = {
  validateQualityAssessmentOptions,
  validateQualityCriteriaOptions,
  validateQualityEnhancementOptions,
  validateBatchQualityAssessmentOptions,
  validateQualityTrendOptions,
  validateQualityThresholdOptions
};