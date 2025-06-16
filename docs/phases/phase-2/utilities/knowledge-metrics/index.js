/**
 * Knowledge Metrics Dashboard - Export Manifest
 * 
 * This file exports all components of the Knowledge Metrics Dashboard for easy import by other modules.
 */

// Import all components
const validation = require('./knowledge-metrics-validation');
const core = require('./knowledge-metrics-core');
const integration = require('./knowledge-metrics-integration');

// Export validation layer
const {
  validateConPortClient,
  validateDashboardOptions,
  validateMetric,
  validateSaveOptions,
  validateTemplateOptions
} = validation;

// Export core layer
const {
  KnowledgeMetricsDashboard,
  KnowledgeMetric,
  MetricCategory
} = core;

// Export integration layer
const {
  KnowledgeMetricsIntegration
} = integration;

// Export Knowledge Metrics Dashboard API
module.exports = {
  // Core classes
  KnowledgeMetricsDashboard,
  KnowledgeMetric,
  MetricCategory,
  
  // Integration classes
  KnowledgeMetricsIntegration,
  
  // Validation functions
  validateConPortClient,
  validateDashboardOptions,
  validateMetric,
  validateSaveOptions,
  validateTemplateOptions,
  
  // Layer exports for more granular imports
  validation,
  core,
  integration
};