/**
 * Knowledge Metrics Dashboard Validation
 * 
 * This module provides validation functionality for the knowledge metrics dashboard,
 * ensuring that inputs and configurations are valid before processing.
 */

/**
 * Validates ConPort client for dashboard generation
 * @param {Object} conportClient - ConPort client to validate
 * @returns {Object} - Validation result with isValid flag and error message if invalid
 */
function validateConPortClient(conportClient) {
  // Check if conportClient exists
  if (!conportClient) {
    return {
      isValid: false,
      error: 'ConPort client is required'
    };
  }
  
  // Check if conportClient has required methods
  const requiredMethods = [
    'getProductContext',
    'getActiveContext',
    'getDecisions',
    'getSystemPatterns',
    'getProgress',
    'getCustomData'
  ];
  
  const missingMethods = requiredMethods.filter(method => 
    typeof conportClient[method] !== 'function'
  );
  
  if (missingMethods.length > 0) {
    return {
      isValid: false,
      error: `ConPort client is missing required methods: ${missingMethods.join(', ')}`
    };
  }
  
  return { isValid: true };
}

/**
 * Validates dashboard generation options
 * @param {Object} options - Options to validate
 * @returns {Object} - Validation result with isValid flag and error message if invalid
 */
function validateDashboardOptions(options) {
  if (!options) {
    // Default options are fine
    return { isValid: true };
  }
  
  const results = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // Validate limit if provided
  if (options.limit !== undefined) {
    if (typeof options.limit !== 'number' || options.limit <= 0) {
      results.errors.push('Limit must be a positive number');
      results.isValid = false;
    } else if (options.limit > 5000) {
      results.warnings.push('Large limit values may impact performance');
    }
  }
  
  // Validate customCategories if provided
  if (options.customCategories !== undefined) {
    if (!Array.isArray(options.customCategories)) {
      results.errors.push('customCategories must be an array');
      results.isValid = false;
    }
  }
  
  // Validate includeStatistics if provided
  if (options.includeStatistics !== undefined && typeof options.includeStatistics !== 'boolean') {
    results.errors.push('includeStatistics must be a boolean');
    results.isValid = false;
  }
  
  // Validate cacheResults if provided
  if (options.cacheResults !== undefined && typeof options.cacheResults !== 'boolean') {
    results.errors.push('cacheResults must be a boolean');
    results.isValid = false;
  }
  
  return results;
}

/**
 * Validates a metric configuration
 * @param {Object} metric - Metric configuration to validate
 * @returns {Object} - Validation result with isValid flag and error message if invalid
 */
function validateMetric(metric) {
  const results = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // Check for required fields
  const requiredFields = ['name', 'description', 'calculator'];
  for (const field of requiredFields) {
    if (metric[field] === undefined) {
      results.errors.push(`Missing required field: ${field}`);
      results.isValid = false;
    }
  }
  
  // Validate calculator is a function
  if (metric.calculator && typeof metric.calculator !== 'function') {
    results.errors.push('calculator must be a function');
    results.isValid = false;
  }
  
  // Validate thresholds if provided
  if (metric.thresholds !== undefined) {
    if (!Array.isArray(metric.thresholds) || metric.thresholds.length !== 2) {
      results.errors.push('thresholds must be an array with two elements [good, warning]');
      results.isValid = false;
    } else {
      const [goodThreshold, warningThreshold] = metric.thresholds;
      
      if (typeof goodThreshold !== 'number' || typeof warningThreshold !== 'number') {
        results.errors.push('threshold values must be numbers');
        results.isValid = false;
      } else if (goodThreshold < warningThreshold) {
        results.errors.push('good threshold must be greater than or equal to warning threshold');
        results.isValid = false;
      }
    }
  }
  
  // Validate unit if provided
  if (metric.unit !== undefined && typeof metric.unit !== 'string') {
    results.errors.push('unit must be a string');
    results.isValid = false;
  }
  
  return results;
}

/**
 * Validates file saving options
 * @param {string} path - File path to save to
 * @param {Object} options - Options for saving
 * @returns {Object} - Validation result with isValid flag and error message if invalid
 */
function validateSaveOptions(path, options = {}) {
  const results = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // Check path
  if (!path) {
    results.errors.push('File path is required');
    results.isValid = false;
    return results;
  }
  
  // Check format if provided
  if (options.format) {
    const supportedFormats = ['html', 'json'];
    if (!supportedFormats.includes(options.format)) {
      results.errors.push(`Unsupported format: ${options.format}. Supported formats: ${supportedFormats.join(', ')}`);
      results.isValid = false;
    }
  }
  
  // Check if path has the correct extension for the format
  if (options.format === 'html' && !path.toLowerCase().endsWith('.html')) {
    results.warnings.push('File path does not have .html extension for HTML format');
  } else if (options.format === 'json' && !path.toLowerCase().endsWith('.json')) {
    results.warnings.push('File path does not have .json extension for JSON format');
  }
  
  // Validate overwrite option if present
  if (options.overwrite !== undefined && typeof options.overwrite !== 'boolean') {
    results.errors.push('overwrite option must be a boolean');
    results.isValid = false;
  }
  
  return results;
}

/**
 * Validates HTML template options
 * @param {Object} templateOptions - HTML template options to validate
 * @returns {Object} - Validation result with isValid flag and error message if invalid
 */
function validateTemplateOptions(templateOptions = {}) {
  const results = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // Validate title if provided
  if (templateOptions.title !== undefined && typeof templateOptions.title !== 'string') {
    results.errors.push('title must be a string');
    results.isValid = false;
  }
  
  // Validate custom CSS if provided
  if (templateOptions.customCss !== undefined && typeof templateOptions.customCss !== 'string') {
    results.errors.push('customCss must be a string');
    results.isValid = false;
  }
  
  // Validate includeCharts if provided
  if (templateOptions.includeCharts !== undefined && typeof templateOptions.includeCharts !== 'boolean') {
    results.errors.push('includeCharts must be a boolean');
    results.isValid = false;
  }
  
  // Validate showRecommendations if provided
  if (templateOptions.showRecommendations !== undefined && typeof templateOptions.showRecommendations !== 'boolean') {
    results.errors.push('showRecommendations must be a boolean');
    results.isValid = false;
  }
  
  return results;
}

module.exports = {
  validateConPortClient,
  validateDashboardOptions,
  validateMetric,
  validateSaveOptions,
  validateTemplateOptions
};