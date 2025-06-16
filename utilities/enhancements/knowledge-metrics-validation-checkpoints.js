/**
 * Knowledge Metrics Dashboard Validation Checkpoints
 * 
 * This module provides validation checkpoints specific to the Knowledge Metrics Dashboard.
 * These checkpoints ensure the dashboard has proper data sources, appropriate metric definitions,
 * and provides accurate knowledge health assessment.
 */

const { KnowledgeMetricsDashboard } = require('../knowledge-metrics-dashboard');

/**
 * Validate ConPort client connectivity
 * @param {Object} client - ConPort client
 * @returns {Object} - Validation result
 */
function validateConPortAccess(client) {
  if (!client) {
    return {
      valid: false,
      message: 'ConPort client is required for dashboard generation'
    };
  }
  
  // Check required methods
  const requiredMethods = [
    'getProductContext',
    'getActiveContext',
    'getDecisions',
    'getSystemPatterns',
    'getProgress',
    'getCustomData'
  ];
  
  const missingMethods = requiredMethods.filter(method => typeof client[method] !== 'function');
  
  if (missingMethods.length > 0) {
    return {
      valid: false,
      message: `ConPort client is missing required methods: ${missingMethods.join(', ')}`
    };
  }
  
  return {
    valid: true,
    message: 'ConPort access validated successfully'
  };
}

/**
 * Validate data completeness for dashboard generation
 * @param {Object} data - ConPort data
 * @returns {Object} - Validation result
 */
function validateDataCompleteness(data) {
  if (!data) {
    return {
      valid: false,
      message: 'No ConPort data provided'
    };
  }
  
  const requiredStructures = ['productContext', 'activeContext', 'statistics'];
  const missingStructures = requiredStructures.filter(structure => !data[structure]);
  
  // Some data is required for minimal dashboard
  if (missingStructures.length > 0) {
    return {
      valid: false,
      message: `Missing required data structures: ${missingStructures.join(', ')}`
    };
  }
  
  // Warning for limited data
  const warnings = [];
  
  if (!data.decisions || data.decisions.length === 0) {
    warnings.push('No decisions found - some metrics will be unavailable');
  }
  
  if (!data.systemPatterns || data.systemPatterns.length === 0) {
    warnings.push('No system patterns found - some metrics will be unavailable');
  }
  
  if (!data.progressEntries || data.progressEntries.length === 0) {
    warnings.push('No progress entries found - some metrics will be unavailable');
  }
  
  return {
    valid: true,
    message: 'Data completeness validated',
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Validate metric definitions for consistency and completeness
 * @param {KnowledgeMetricsDashboard} dashboard - Dashboard instance
 * @returns {Object} - Validation result
 */
function validateMetricDefinitions(dashboard) {
  if (!dashboard || !(dashboard instanceof KnowledgeMetricsDashboard)) {
    return {
      valid: false,
      message: 'Invalid dashboard instance'
    };
  }
  
  const categories = dashboard.categories;
  if (!categories || Object.keys(categories).length === 0) {
    return {
      valid: false,
      message: 'No metric categories defined'
    };
  }
  
  const warnings = [];
  
  // Check each category for metrics
  Object.entries(categories).forEach(([key, category]) => {
    if (!category.metrics || category.metrics.length === 0) {
      warnings.push(`Category '${category.name}' has no metrics defined`);
    }
    
    // Check each metric for calculator function
    category.metrics.forEach(metric => {
      if (!metric.calculator || typeof metric.calculator !== 'function') {
        warnings.push(`Metric '${metric.name}' has no calculator function`);
      }
      
      if (!metric.thresholds || !Array.isArray(metric.thresholds) || metric.thresholds.length !== 2) {
        warnings.push(`Metric '${metric.name}' has invalid thresholds`);
      }
    });
  });
  
  return {
    valid: true,
    message: 'Metric definitions validated',
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Validate dashboard outputs for accuracy and consistency
 * @param {Object} dashboardData - Generated dashboard data
 * @returns {Object} - Validation result
 */
function validateDashboardOutput(dashboardData) {
  if (!dashboardData) {
    return {
      valid: false,
      message: 'No dashboard data provided'
    };
  }
  
  const requiredComponents = [
    'generatedAt',
    'overallHealth',
    'categories',
    'recommendations'
  ];
  
  const missingComponents = requiredComponents.filter(component => !dashboardData[component]);
  
  if (missingComponents.length > 0) {
    return {
      valid: false,
      message: `Dashboard data missing required components: ${missingComponents.join(', ')}`
    };
  }
  
  // Validate overall health calculation
  if (typeof dashboardData.overallHealth.score !== 'number' || 
      dashboardData.overallHealth.score < 0 || 
      dashboardData.overallHealth.score > 1) {
    return {
      valid: false,
      message: 'Overall health score is invalid (must be a number between 0 and 1)'
    };
  }
  
  // Validate categories
  const categoryKeys = Object.keys(dashboardData.categories);
  if (categoryKeys.length === 0) {
    return {
      valid: false,
      message: 'Dashboard has no metric categories'
    };
  }
  
  const warnings = [];
  
  // Check category metrics
  categoryKeys.forEach(key => {
    const category = dashboardData.categories[key];
    
    if (!category.metrics || category.metrics.length === 0) {
      warnings.push(`Category '${category.name}' has no metrics in output`);
    } else {
      // Check for invalid metric values
      const invalidMetrics = category.metrics.filter(metric => 
        typeof metric.value !== 'number' || 
        metric.value < 0 || 
        metric.value > 1
      );
      
      if (invalidMetrics.length > 0) {
        warnings.push(`Category '${category.name}' has metrics with invalid values`);
      }
    }
  });
  
  return {
    valid: true,
    message: 'Dashboard output validated',
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Validate dashboard HTML output for structure and completeness
 * @param {string} html - HTML dashboard output
 * @returns {Object} - Validation result
 */
function validateHtmlOutput(html) {
  if (!html || typeof html !== 'string') {
    return {
      valid: false,
      message: 'No HTML output provided'
    };
  }
  
  const requiredElements = [
    'dashboard',
    'overall-health',
    'categories',
    'metric',
    'recommendations',
    'trends'
  ];
  
  const missingElements = requiredElements.filter(element => !html.includes(`class="${element}"`));
  
  if (missingElements.length > 0) {
    return {
      valid: false,
      message: `HTML output missing required elements: ${missingElements.join(', ')}`
    };
  }
  
  return {
    valid: true,
    message: 'HTML output validated successfully'
  };
}

/**
 * Run all validation checkpoints for the Knowledge Metrics Dashboard
 * @param {Object} params - Parameters for validation
 * @param {Object} params.client - ConPort client
 * @param {Object} params.data - ConPort data (if already retrieved)
 * @param {KnowledgeMetricsDashboard} params.dashboard - Dashboard instance
 * @param {Object} params.dashboardData - Generated dashboard data
 * @param {string} params.html - HTML dashboard output
 * @returns {Object} - Validation results
 */
function validateKnowledgeMetricsDashboard(params = {}) {
  const results = {};
  
  if (params.client) {
    results.conPortAccess = validateConPortAccess(params.client);
  }
  
  if (params.data) {
    results.dataCompleteness = validateDataCompleteness(params.data);
  }
  
  if (params.dashboard) {
    results.metricDefinitions = validateMetricDefinitions(params.dashboard);
  }
  
  if (params.dashboardData) {
    results.dashboardOutput = validateDashboardOutput(params.dashboardData);
  }
  
  if (params.html) {
    results.htmlOutput = validateHtmlOutput(params.html);
  }
  
  // Overall validation result
  const validations = Object.values(results);
  const isValid = validations.every(result => result.valid);
  const allWarnings = validations
    .filter(result => result.warnings && result.warnings.length > 0)
    .flatMap(result => result.warnings);
  
  return {
    valid: isValid,
    validations: results,
    warnings: allWarnings.length > 0 ? allWarnings : undefined,
    message: isValid 
      ? 'Knowledge Metrics Dashboard validated successfully' 
      : 'Knowledge Metrics Dashboard validation failed'
  };
}

module.exports = {
  validateConPortAccess,
  validateDataCompleteness,
  validateMetricDefinitions,
  validateDashboardOutput,
  validateHtmlOutput,
  validateKnowledgeMetricsDashboard
};