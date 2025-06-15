/**
 * Advanced ConPort Analytics - Validation Layer
 * 
 * This module provides validation functions for analytics operations to ensure
 * data integrity and prevent corruption of analytics results.
 */

/**
 * Validates options for analytics queries
 *
 * @param {Object} options - The query options to validate
 * @param {string} options.workspaceId - The workspace ID for ConPort operations
 * @param {string} [options.timeframe] - Timeframe for analysis (e.g., 'day', 'week', 'month', 'year')
 * @param {string} [options.startDate] - ISO string date for custom timeframe start
 * @param {string} [options.endDate] - ISO string date for custom timeframe end
 * @param {Array<string>} [options.artifactTypes] - Types of artifacts to include in analysis
 * @param {Array<string>} [options.dimensions] - Specific dimensions to analyze
 * @param {Object} [options.filters] - Additional filters for the query
 * @param {boolean} [options.includeVersions] - Whether to include versioned artifacts
 * @param {boolean} [options.normalizeResults] - Whether to normalize results
 * @param {string} [options.outputFormat] - Format for results (e.g., 'json', 'csv')
 * @param {number} [options.limit] - Maximum number of results to return
 * @returns {Object} Validated and normalized options object
 * @throws {Error} If validation fails
 */
function validateAnalyticsQueryOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Invalid analytics options: options must be an object');
  }

  if (!options.workspaceId || typeof options.workspaceId !== 'string') {
    throw new Error('Invalid analytics options: workspaceId is required and must be a string');
  }

  const validatedOptions = { workspaceId: options.workspaceId };

  // Validate timeframe
  if (options.timeframe !== undefined) {
    if (typeof options.timeframe !== 'string') {
      throw new Error('Invalid analytics options: timeframe must be a string');
    }
    
    const validTimeframes = ['day', 'week', 'month', 'quarter', 'year', 'all', 'custom'];
    if (!validTimeframes.includes(options.timeframe)) {
      throw new Error(`Invalid analytics options: timeframe must be one of ${validTimeframes.join(', ')}`);
    }
    
    validatedOptions.timeframe = options.timeframe;
  }

  // Validate date range for custom timeframe
  if (options.timeframe === 'custom') {
    if (!options.startDate || !options.endDate) {
      throw new Error('Invalid analytics options: startDate and endDate are required for custom timeframe');
    }
    
    if (!isValidISODate(options.startDate)) {
      throw new Error('Invalid analytics options: startDate must be a valid ISO date string');
    }
    
    if (!isValidISODate(options.endDate)) {
      throw new Error('Invalid analytics options: endDate must be a valid ISO date string');
    }
    
    const startDate = new Date(options.startDate);
    const endDate = new Date(options.endDate);
    
    if (startDate > endDate) {
      throw new Error('Invalid analytics options: startDate must be before endDate');
    }
    
    validatedOptions.startDate = options.startDate;
    validatedOptions.endDate = options.endDate;
  } else {
    // For non-custom timeframes, startDate and endDate are optional
    if (options.startDate !== undefined) {
      if (!isValidISODate(options.startDate)) {
        throw new Error('Invalid analytics options: startDate must be a valid ISO date string');
      }
      validatedOptions.startDate = options.startDate;
    }
    
    if (options.endDate !== undefined) {
      if (!isValidISODate(options.endDate)) {
        throw new Error('Invalid analytics options: endDate must be a valid ISO date string');
      }
      validatedOptions.endDate = options.endDate;
    }
  }

  // Validate artifactTypes
  if (options.artifactTypes !== undefined) {
    if (!Array.isArray(options.artifactTypes)) {
      throw new Error('Invalid analytics options: artifactTypes must be an array of strings');
    }
    
    const validArtifactTypes = [
      'decision', 'system_pattern', 'progress', 'custom_data',
      'product_context', 'active_context'
    ];
    
    for (const type of options.artifactTypes) {
      if (typeof type !== 'string' || !validArtifactTypes.includes(type)) {
        throw new Error(`Invalid analytics options: artifactTypes must contain valid types (${validArtifactTypes.join(', ')})`);
      }
    }
    
    validatedOptions.artifactTypes = [...options.artifactTypes];
  }

  // Validate dimensions
  if (options.dimensions !== undefined) {
    if (!Array.isArray(options.dimensions)) {
      throw new Error('Invalid analytics options: dimensions must be an array of strings');
    }
    
    for (const dimension of options.dimensions) {
      if (typeof dimension !== 'string') {
        throw new Error('Invalid analytics options: dimensions must contain only strings');
      }
    }
    
    validatedOptions.dimensions = [...options.dimensions];
  }

  // Validate filters
  if (options.filters !== undefined) {
    if (typeof options.filters !== 'object' || options.filters === null) {
      throw new Error('Invalid analytics options: filters must be an object');
    }
    
    validatedOptions.filters = { ...options.filters };
  }

  // Validate boolean options
  if (options.includeVersions !== undefined) {
    validatedOptions.includeVersions = Boolean(options.includeVersions);
  }
  
  if (options.normalizeResults !== undefined) {
    validatedOptions.normalizeResults = Boolean(options.normalizeResults);
  }

  // Validate outputFormat
  if (options.outputFormat !== undefined) {
    if (typeof options.outputFormat !== 'string') {
      throw new Error('Invalid analytics options: outputFormat must be a string');
    }
    
    const validFormats = ['json', 'csv', 'table', 'chart'];
    if (!validFormats.includes(options.outputFormat)) {
      throw new Error(`Invalid analytics options: outputFormat must be one of ${validFormats.join(', ')}`);
    }
    
    validatedOptions.outputFormat = options.outputFormat;
  }

  // Validate limit
  if (options.limit !== undefined) {
    if (typeof options.limit !== 'number' || options.limit <= 0 || !Number.isInteger(options.limit)) {
      throw new Error('Invalid analytics options: limit must be a positive integer');
    }
    
    validatedOptions.limit = options.limit;
  }

  return validatedOptions;
}

/**
 * Validates options for knowledge relation analysis
 *
 * @param {Object} options - The analysis options to validate
 * @param {string} options.workspaceId - The workspace ID for ConPort operations
 * @param {string} [options.centralNodeType] - Type of the central node (e.g., 'decision', 'system_pattern')
 * @param {string} [options.centralNodeId] - ID of the central node
 * @param {number} [options.depth] - Depth of the relationship graph to traverse (default: 1)
 * @param {Array<string>} [options.relationshipTypes] - Types of relationships to include 
 * @param {boolean} [options.includeMetadata] - Whether to include metadata in the results
 * @returns {Object} Validated and normalized options object
 * @throws {Error} If validation fails
 */
function validateRelationAnalysisOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Invalid relation analysis options: options must be an object');
  }

  if (!options.workspaceId || typeof options.workspaceId !== 'string') {
    throw new Error('Invalid relation analysis options: workspaceId is required and must be a string');
  }

  const validatedOptions = { workspaceId: options.workspaceId };

  // Validate centralNodeType and centralNodeId
  if (options.centralNodeType !== undefined) {
    if (typeof options.centralNodeType !== 'string') {
      throw new Error('Invalid relation analysis options: centralNodeType must be a string');
    }
    
    const validNodeTypes = ['decision', 'system_pattern', 'progress', 'custom_data'];
    if (!validNodeTypes.includes(options.centralNodeType)) {
      throw new Error(`Invalid relation analysis options: centralNodeType must be one of ${validNodeTypes.join(', ')}`);
    }
    
    validatedOptions.centralNodeType = options.centralNodeType;
    
    // If centralNodeType is specified, centralNodeId is required
    if (options.centralNodeId === undefined) {
      throw new Error('Invalid relation analysis options: centralNodeId is required when centralNodeType is specified');
    }
    
    if (typeof options.centralNodeId !== 'string' && typeof options.centralNodeId !== 'number') {
      throw new Error('Invalid relation analysis options: centralNodeId must be a string or number');
    }
    
    validatedOptions.centralNodeId = String(options.centralNodeId);
  }

  // Validate depth
  if (options.depth !== undefined) {
    if (typeof options.depth !== 'number' || options.depth < 1 || !Number.isInteger(options.depth)) {
      throw new Error('Invalid relation analysis options: depth must be a positive integer');
    }
    
    validatedOptions.depth = options.depth;
  } else {
    // Default depth is 1
    validatedOptions.depth = 1;
  }

  // Validate relationshipTypes
  if (options.relationshipTypes !== undefined) {
    if (!Array.isArray(options.relationshipTypes)) {
      throw new Error('Invalid relation analysis options: relationshipTypes must be an array of strings');
    }
    
    for (const type of options.relationshipTypes) {
      if (typeof type !== 'string') {
        throw new Error('Invalid relation analysis options: relationshipTypes must contain only strings');
      }
    }
    
    validatedOptions.relationshipTypes = [...options.relationshipTypes];
  }

  // Validate includeMetadata
  if (options.includeMetadata !== undefined) {
    validatedOptions.includeMetadata = Boolean(options.includeMetadata);
  }

  return validatedOptions;
}

/**
 * Validates options for knowledge activity analysis
 *
 * @param {Object} options - The analysis options to validate
 * @param {string} options.workspaceId - The workspace ID for ConPort operations
 * @param {string} [options.timeframe] - Timeframe for analysis (e.g., 'day', 'week', 'month', 'year')
 * @param {string} [options.startDate] - ISO string date for custom timeframe start
 * @param {string} [options.endDate] - ISO string date for custom timeframe end
 * @param {Array<string>} [options.activityTypes] - Types of activities to analyze
 * @param {Array<string>} [options.artifactTypes] - Types of artifacts to include in analysis
 * @param {boolean} [options.groupBy] - How to group the results (e.g., 'day', 'type')
 * @param {boolean} [options.cumulative] - Whether to show cumulative results
 * @returns {Object} Validated and normalized options object
 * @throws {Error} If validation fails
 */
function validateActivityAnalysisOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Invalid activity analysis options: options must be an object');
  }

  if (!options.workspaceId || typeof options.workspaceId !== 'string') {
    throw new Error('Invalid activity analysis options: workspaceId is required and must be a string');
  }

  const validatedOptions = { workspaceId: options.workspaceId };

  // Validate timeframe
  if (options.timeframe !== undefined) {
    if (typeof options.timeframe !== 'string') {
      throw new Error('Invalid activity analysis options: timeframe must be a string');
    }
    
    const validTimeframes = ['day', 'week', 'month', 'quarter', 'year', 'all', 'custom'];
    if (!validTimeframes.includes(options.timeframe)) {
      throw new Error(`Invalid activity analysis options: timeframe must be one of ${validTimeframes.join(', ')}`);
    }
    
    validatedOptions.timeframe = options.timeframe;
  }

  // Validate date range for custom timeframe
  if (options.timeframe === 'custom') {
    if (!options.startDate || !options.endDate) {
      throw new Error('Invalid activity analysis options: startDate and endDate are required for custom timeframe');
    }
    
    if (!isValidISODate(options.startDate)) {
      throw new Error('Invalid activity analysis options: startDate must be a valid ISO date string');
    }
    
    if (!isValidISODate(options.endDate)) {
      throw new Error('Invalid activity analysis options: endDate must be a valid ISO date string');
    }
    
    const startDate = new Date(options.startDate);
    const endDate = new Date(options.endDate);
    
    if (startDate > endDate) {
      throw new Error('Invalid activity analysis options: startDate must be before endDate');
    }
    
    validatedOptions.startDate = options.startDate;
    validatedOptions.endDate = options.endDate;
  } else {
    // For non-custom timeframes, startDate and endDate are optional
    if (options.startDate !== undefined) {
      if (!isValidISODate(options.startDate)) {
        throw new Error('Invalid activity analysis options: startDate must be a valid ISO date string');
      }
      validatedOptions.startDate = options.startDate;
    }
    
    if (options.endDate !== undefined) {
      if (!isValidISODate(options.endDate)) {
        throw new Error('Invalid activity analysis options: endDate must be a valid ISO date string');
      }
      validatedOptions.endDate = options.endDate;
    }
  }

  // Validate activityTypes
  if (options.activityTypes !== undefined) {
    if (!Array.isArray(options.activityTypes)) {
      throw new Error('Invalid activity analysis options: activityTypes must be an array of strings');
    }
    
    const validActivityTypes = ['create', 'update', 'delete', 'view', 'link', 'enhance'];
    
    for (const type of options.activityTypes) {
      if (typeof type !== 'string' || !validActivityTypes.includes(type)) {
        throw new Error(`Invalid activity analysis options: activityTypes must contain valid types (${validActivityTypes.join(', ')})`);
      }
    }
    
    validatedOptions.activityTypes = [...options.activityTypes];
  }

  // Validate artifactTypes
  if (options.artifactTypes !== undefined) {
    if (!Array.isArray(options.artifactTypes)) {
      throw new Error('Invalid activity analysis options: artifactTypes must be an array of strings');
    }
    
    const validArtifactTypes = [
      'decision', 'system_pattern', 'progress', 'custom_data',
      'product_context', 'active_context'
    ];
    
    for (const type of options.artifactTypes) {
      if (typeof type !== 'string' || !validArtifactTypes.includes(type)) {
        throw new Error(`Invalid activity analysis options: artifactTypes must contain valid types (${validArtifactTypes.join(', ')})`);
      }
    }
    
    validatedOptions.artifactTypes = [...options.artifactTypes];
  }

  // Validate groupBy
  if (options.groupBy !== undefined) {
    if (typeof options.groupBy !== 'string') {
      throw new Error('Invalid activity analysis options: groupBy must be a string');
    }
    
    const validGroupings = ['day', 'week', 'month', 'type', 'artifact', 'user'];
    if (!validGroupings.includes(options.groupBy)) {
      throw new Error(`Invalid activity analysis options: groupBy must be one of ${validGroupings.join(', ')}`);
    }
    
    validatedOptions.groupBy = options.groupBy;
  }

  // Validate cumulative
  if (options.cumulative !== undefined) {
    validatedOptions.cumulative = Boolean(options.cumulative);
  }

  return validatedOptions;
}

/**
 * Validates options for knowledge impact analysis
 *
 * @param {Object} options - The analysis options to validate
 * @param {string} options.workspaceId - The workspace ID for ConPort operations
 * @param {string} options.artifactType - Type of artifact to analyze
 * @param {string|number} options.artifactId - ID of the artifact to analyze
 * @param {string} [options.impactMetric] - Metric to measure impact (e.g., 'references', 'dependencies')
 * @param {number} [options.depth] - Depth of impact analysis
 * @param {boolean} [options.includeIndirect] - Whether to include indirect impacts
 * @returns {Object} Validated and normalized options object
 * @throws {Error} If validation fails
 */
function validateImpactAnalysisOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Invalid impact analysis options: options must be an object');
  }

  if (!options.workspaceId || typeof options.workspaceId !== 'string') {
    throw new Error('Invalid impact analysis options: workspaceId is required and must be a string');
  }

  const validatedOptions = { workspaceId: options.workspaceId };

  // Validate artifactType and artifactId (both required)
  if (!options.artifactType || typeof options.artifactType !== 'string') {
    throw new Error('Invalid impact analysis options: artifactType is required and must be a string');
  }
  
  const validArtifactTypes = ['decision', 'system_pattern', 'progress', 'custom_data'];
  if (!validArtifactTypes.includes(options.artifactType)) {
    throw new Error(`Invalid impact analysis options: artifactType must be one of ${validArtifactTypes.join(', ')}`);
  }
  
  validatedOptions.artifactType = options.artifactType;
  
  if (options.artifactId === undefined || options.artifactId === null) {
    throw new Error('Invalid impact analysis options: artifactId is required');
  }
  
  if (typeof options.artifactId !== 'string' && typeof options.artifactId !== 'number') {
    throw new Error('Invalid impact analysis options: artifactId must be a string or number');
  }
  
  validatedOptions.artifactId = String(options.artifactId);

  // Validate impactMetric
  if (options.impactMetric !== undefined) {
    if (typeof options.impactMetric !== 'string') {
      throw new Error('Invalid impact analysis options: impactMetric must be a string');
    }
    
    const validMetrics = ['references', 'dependencies', 'changes', 'quality', 'usage'];
    if (!validMetrics.includes(options.impactMetric)) {
      throw new Error(`Invalid impact analysis options: impactMetric must be one of ${validMetrics.join(', ')}`);
    }
    
    validatedOptions.impactMetric = options.impactMetric;
  }

  // Validate depth
  if (options.depth !== undefined) {
    if (typeof options.depth !== 'number' || options.depth < 1 || !Number.isInteger(options.depth)) {
      throw new Error('Invalid impact analysis options: depth must be a positive integer');
    }
    
    validatedOptions.depth = options.depth;
  }

  // Validate includeIndirect
  if (options.includeIndirect !== undefined) {
    validatedOptions.includeIndirect = Boolean(options.includeIndirect);
  }

  return validatedOptions;
}

/**
 * Validates options for dashboard configuration
 *
 * @param {Object} options - The dashboard options to validate
 * @param {string} options.workspaceId - The workspace ID for ConPort operations
 * @param {string} [options.dashboardId] - ID of existing dashboard to update
 * @param {string} [options.name] - Name of the dashboard
 * @param {Array<Object>} [options.widgets] - Widgets to include in the dashboard
 * @param {Object} [options.layout] - Layout configuration for the dashboard
 * @param {boolean} [options.isDefault] - Whether this is the default dashboard
 * @returns {Object} Validated and normalized options object
 * @throws {Error} If validation fails
 */
function validateDashboardConfigOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Invalid dashboard config options: options must be an object');
  }

  if (!options.workspaceId || typeof options.workspaceId !== 'string') {
    throw new Error('Invalid dashboard config options: workspaceId is required and must be a string');
  }

  const validatedOptions = { workspaceId: options.workspaceId };

  // Validate dashboardId
  if (options.dashboardId !== undefined) {
    if (typeof options.dashboardId !== 'string') {
      throw new Error('Invalid dashboard config options: dashboardId must be a string');
    }
    validatedOptions.dashboardId = options.dashboardId;
  }

  // Validate name
  if (options.name !== undefined) {
    if (typeof options.name !== 'string' || options.name.trim() === '') {
      throw new Error('Invalid dashboard config options: name must be a non-empty string');
    }
    validatedOptions.name = options.name;
  } else if (!options.dashboardId) {
    // Name is required when creating a new dashboard
    throw new Error('Invalid dashboard config options: name is required when creating a new dashboard');
  }

  // Validate widgets
  if (options.widgets !== undefined) {
    if (!Array.isArray(options.widgets)) {
      throw new Error('Invalid dashboard config options: widgets must be an array');
    }
    
    validatedOptions.widgets = [];
    
    for (const widget of options.widgets) {
      if (typeof widget !== 'object' || widget === null) {
        throw new Error('Invalid dashboard config options: each widget must be an object');
      }
      
      if (!widget.type || typeof widget.type !== 'string') {
        throw new Error('Invalid dashboard config options: each widget must have a type');
      }
      
      const validWidgetTypes = [
        'activity', 'metrics', 'graph', 'table', 'chart', 
        'timeline', 'heatmap', 'counter', 'text'
      ];
      
      if (!validWidgetTypes.includes(widget.type)) {
        throw new Error(`Invalid dashboard config options: widget type must be one of ${validWidgetTypes.join(', ')}`);
      }
      
      if (!widget.title || typeof widget.title !== 'string') {
        throw new Error('Invalid dashboard config options: each widget must have a title');
      }
      
      if (!widget.config || typeof widget.config !== 'object') {
        throw new Error('Invalid dashboard config options: each widget must have a config object');
      }
      
      validatedOptions.widgets.push({
        type: widget.type,
        title: widget.title,
        config: { ...widget.config },
        id: widget.id || generateWidgetId(),
        position: widget.position || null
      });
    }
  }

  // Validate layout
  if (options.layout !== undefined) {
    if (typeof options.layout !== 'object' || options.layout === null) {
      throw new Error('Invalid dashboard config options: layout must be an object');
    }
    
    validatedOptions.layout = { ...options.layout };
  }

  // Validate isDefault
  if (options.isDefault !== undefined) {
    validatedOptions.isDefault = Boolean(options.isDefault);
  }

  return validatedOptions;
}

/**
 * Validates options for exporting analytics data
 *
 * @param {Object} options - The export options to validate
 * @param {string} options.workspaceId - The workspace ID for ConPort operations
 * @param {Object} options.query - The analytics query to export results for
 * @param {string} options.format - Format to export (e.g., 'json', 'csv')
 * @param {string} [options.destination] - Destination for export (e.g., 'file', 'url')
 * @param {Object} [options.exportConfig] - Additional export configuration
 * @returns {Object} Validated and normalized options object
 * @throws {Error} If validation fails
 */
function validateAnalyticsExportOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Invalid analytics export options: options must be an object');
  }

  if (!options.workspaceId || typeof options.workspaceId !== 'string') {
    throw new Error('Invalid analytics export options: workspaceId is required and must be a string');
  }

  const validatedOptions = { workspaceId: options.workspaceId };

  // Validate query
  if (!options.query || typeof options.query !== 'object') {
    throw new Error('Invalid analytics export options: query is required and must be an object');
  }
  
  // We don't validate the query contents here as they'll be validated by the analytics function
  validatedOptions.query = { ...options.query };

  // Validate format
  if (!options.format || typeof options.format !== 'string') {
    throw new Error('Invalid analytics export options: format is required and must be a string');
  }
  
  const validFormats = ['json', 'csv', 'excel', 'pdf', 'html', 'markdown'];
  if (!validFormats.includes(options.format)) {
    throw new Error(`Invalid analytics export options: format must be one of ${validFormats.join(', ')}`);
  }
  
  validatedOptions.format = options.format;

  // Validate destination
  if (options.destination !== undefined) {
    if (typeof options.destination !== 'string') {
      throw new Error('Invalid analytics export options: destination must be a string');
    }
    
    const validDestinations = ['file', 'url', 'clipboard', 'download', 'email'];
    if (!validDestinations.includes(options.destination)) {
      throw new Error(`Invalid analytics export options: destination must be one of ${validDestinations.join(', ')}`);
    }
    
    validatedOptions.destination = options.destination;
  } else {
    // Default destination is 'file'
    validatedOptions.destination = 'file';
  }

  // Validate exportConfig
  if (options.exportConfig !== undefined) {
    if (typeof options.exportConfig !== 'object' || options.exportConfig === null) {
      throw new Error('Invalid analytics export options: exportConfig must be an object');
    }
    
    validatedOptions.exportConfig = { ...options.exportConfig };
  }

  return validatedOptions;
}

// Helper function to generate a widget ID
function generateWidgetId() {
  return 'widget_' + Math.random().toString(36).substring(2, 15);
}

// Helper function to validate ISO date string
function isValidISODate(dateString) {
  if (typeof dateString !== 'string') {
    return false;
  }
  
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString.includes('T');
  } catch (e) {
    return false;
  }
}

module.exports = {
  validateAnalyticsQueryOptions,
  validateRelationAnalysisOptions,
  validateActivityAnalysisOptions,
  validateImpactAnalysisOptions,
  validateDashboardConfigOptions,
  validateAnalyticsExportOptions
};