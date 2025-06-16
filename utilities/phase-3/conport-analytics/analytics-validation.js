/**
 * Validation module for ConPort Analytics
 * 
 * This module provides validation functions for analytics operations,
 * ensuring that inputs meet the required specifications before processing.
 */

/**
 * Validates the options for analytics generation
 * 
 * @param {Object} options - Analytics generation options
 * @param {string} [options.timeframe] - Time period for analysis (day, week, month, quarter, year)
 * @param {string} [options.startDate] - Start date for custom time range (ISO format)
 * @param {string} [options.endDate] - End date for custom time range (ISO format)
 * @param {Object} [options.filters] - Filters to apply to the data
 * @param {Array} [options.metrics] - Specific metrics to include
 * @returns {Object} Validation result with isValid and errors properties
 */
function validateAnalyticsOptions(options) {
  const errors = [];
  
  if (!options || typeof options !== 'object') {
    return {
      isValid: false,
      errors: ['Options must be a valid object']
    };
  }

  // Validate timeframe if provided
  if (options.timeframe && typeof options.timeframe === 'string') {
    const validTimeframes = ['day', 'week', 'month', 'quarter', 'year'];
    if (!validTimeframes.includes(options.timeframe.toLowerCase())) {
      errors.push(`Invalid timeframe. Must be one of: ${validTimeframes.join(', ')}`);
    }
  }
  
  // Validate dates if provided
  if (options.startDate) {
    const startDate = new Date(options.startDate);
    if (isNaN(startDate.getTime())) {
      errors.push('Invalid startDate format. Use ISO date string.');
    }
  }
  
  if (options.endDate) {
    const endDate = new Date(options.endDate);
    if (isNaN(endDate.getTime())) {
      errors.push('Invalid endDate format. Use ISO date string.');
    }
  }
  
  // Validate that endDate is after startDate if both are provided
  if (options.startDate && options.endDate) {
    const startDate = new Date(options.startDate);
    const endDate = new Date(options.endDate);
    
    if (startDate > endDate) {
      errors.push('endDate must be after startDate');
    }
  }
  
  // Validate filters if provided
  if (options.filters && typeof options.filters !== 'object') {
    errors.push('filters must be an object');
  }
  
  // Validate metrics if provided
  if (options.metrics) {
    if (!Array.isArray(options.metrics)) {
      errors.push('metrics must be an array');
    } else {
      const validMetrics = ['quality', 'relationships', 'activity', 'completeness', 'consistency', 'impact'];
      
      for (const metric of options.metrics) {
        if (!validMetrics.includes(metric)) {
          errors.push(`Invalid metric: ${metric}. Must be one of: ${validMetrics.join(', ')}`);
        }
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates relationship graph analysis options
 * 
 * @param {Object} options - Relationship graph analysis options
 * @param {Array} [options.startingPoints] - Starting points for graph traversal
 * @param {number} [options.depth] - Depth of traversal (default: 1)
 * @param {Array} [options.relationshipTypes] - Types of relationships to include
 * @returns {Object} Validation result with isValid and errors properties
 */
function validateRelationshipGraphOptions(options) {
  const errors = [];
  
  if (!options || typeof options !== 'object') {
    return {
      isValid: false,
      errors: ['Options must be a valid object']
    };
  }
  
  // Validate starting points if provided
  if (options.startingPoints) {
    if (!Array.isArray(options.startingPoints)) {
      errors.push('startingPoints must be an array');
    } else if (options.startingPoints.length === 0) {
      errors.push('startingPoints array cannot be empty');
    }
  }
  
  // Validate depth if provided
  if (options.depth !== undefined) {
    if (typeof options.depth !== 'number' || options.depth < 1) {
      errors.push('depth must be a positive number');
    }
  }
  
  // Validate relationship types if provided
  if (options.relationshipTypes) {
    if (!Array.isArray(options.relationshipTypes)) {
      errors.push('relationshipTypes must be an array');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates activity pattern analysis options
 * 
 * @param {Object} options - Activity pattern analysis options
 * @param {string} [options.timeframe] - Time period for analysis
 * @param {string} [options.granularity] - Time granularity (hourly, daily, weekly, monthly)
 * @param {Array} [options.activityTypes] - Types of activities to analyze
 * @returns {Object} Validation result with isValid and errors properties
 */
function validateActivityPatternOptions(options) {
  const errors = [];
  
  if (!options || typeof options !== 'object') {
    return {
      isValid: false,
      errors: ['Options must be a valid object']
    };
  }
  
  // Validate timeframe if provided
  if (options.timeframe && typeof options.timeframe === 'string') {
    const validTimeframes = ['day', 'week', 'month', 'quarter', 'year'];
    if (!validTimeframes.includes(options.timeframe.toLowerCase())) {
      errors.push(`Invalid timeframe. Must be one of: ${validTimeframes.join(', ')}`);
    }
  }
  
  // Validate granularity if provided
  if (options.granularity) {
    const validGranularities = ['hourly', 'daily', 'weekly', 'monthly'];
    if (!validGranularities.includes(options.granularity.toLowerCase())) {
      errors.push(`Invalid granularity. Must be one of: ${validGranularities.join(', ')}`);
    }
  }
  
  // Validate activity types if provided
  if (options.activityTypes) {
    if (!Array.isArray(options.activityTypes)) {
      errors.push('activityTypes must be an array');
    } else {
      const validActivityTypes = ['creation', 'modification', 'deletion', 'viewing', 'linking'];
      
      for (const type of options.activityTypes) {
        if (!validActivityTypes.includes(type)) {
          errors.push(`Invalid activity type: ${type}. Must be one of: ${validActivityTypes.join(', ')}`);
        }
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates dashboard configuration options
 * 
 * @param {Object} options - Dashboard configuration options
 * @param {Array} [options.panels] - Dashboard panels configuration
 * @param {Object} [options.layout] - Dashboard layout configuration
 * @param {Object} [options.settings] - Dashboard settings
 * @returns {Object} Validation result with isValid and errors properties
 */
function validateDashboardOptions(options) {
  const errors = [];
  
  if (!options || typeof options !== 'object') {
    return {
      isValid: false,
      errors: ['Options must be a valid object']
    };
  }
  
  // Validate panels if provided
  if (options.panels) {
    if (!Array.isArray(options.panels)) {
      errors.push('panels must be an array');
    } else {
      // Validate each panel
      for (let i = 0; i < options.panels.length; i++) {
        const panel = options.panels[i];
        
        if (!panel.type) {
          errors.push(`Panel at index ${i} must have a type`);
        }
        
        if (!panel.title) {
          errors.push(`Panel at index ${i} must have a title`);
        }
        
        if (!panel.dataSource) {
          errors.push(`Panel at index ${i} must have a dataSource`);
        }
      }
    }
  }
  
  // Validate layout if provided
  if (options.layout && typeof options.layout !== 'object') {
    errors.push('layout must be an object');
  }
  
  // Validate settings if provided
  if (options.settings && typeof options.settings !== 'object') {
    errors.push('settings must be an object');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates export options
 * 
 * @param {Object} options - Export options
 * @param {string} options.format - Export format (csv, json, html, markdown)
 * @param {Object} [options.data] - Data to export
 * @param {Object} [options.formatOptions] - Format-specific options
 * @returns {Object} Validation result with isValid and errors properties
 */
function validateExportOptions(options) {
  const errors = [];
  
  if (!options || typeof options !== 'object') {
    return {
      isValid: false,
      errors: ['Options must be a valid object']
    };
  }
  
  // Validate format (required)
  if (!options.format) {
    errors.push('format is required');
  } else if (typeof options.format !== 'string') {
    errors.push('format must be a string');
  } else {
    const validFormats = ['csv', 'json', 'html', 'markdown'];
    if (!validFormats.includes(options.format.toLowerCase())) {
      errors.push(`Invalid format. Must be one of: ${validFormats.join(', ')}`);
    }
  }
  
  // Validate data if provided
  if (options.data === undefined) {
    errors.push('data is required');
  } else if (typeof options.data !== 'object') {
    errors.push('data must be an object or array');
  }
  
  // Validate format options if provided
  if (options.formatOptions && typeof options.formatOptions !== 'object') {
    errors.push('formatOptions must be an object');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

module.exports = {
  validateAnalyticsOptions,
  validateRelationshipGraphOptions,
  validateActivityPatternOptions,
  validateDashboardOptions,
  validateExportOptions
};