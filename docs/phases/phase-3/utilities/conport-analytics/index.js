/**
 * Advanced ConPort Analytics - Export Manifest
 * 
 * This file exports all components of the ConPort Analytics system for easy import by other modules.
 */

// Import all components
const validation = require('./analytics-validation');
const core = require('./analytics-core');
const integration = require('./analytics-integration');

// Export validation layer
const {
  validateAnalyticsQueryOptions,
  validateRelationAnalysisOptions,
  validateActivityAnalysisOptions,
  validateImpactAnalysisOptions,
  validateDashboardConfigOptions,
  validateAnalyticsExportOptions
} = validation;

// Export core layer
const {
  generateAnalytics,
  analyzeRelationshipGraph,
  analyzeActivityPatterns,
  analyzeKnowledgeImpact,
  configureDashboard,
  prepareAnalyticsExport
} = core;

// Export integration layer
const {
  createAnalytics
} = integration;

// Export Analytics API
module.exports = {
  // Integration functions
  createAnalytics,
  
  // Core functions
  generateAnalytics,
  analyzeRelationshipGraph,
  analyzeActivityPatterns,
  analyzeKnowledgeImpact,
  configureDashboard,
  prepareAnalyticsExport,
  
  // Validation functions
  validateAnalyticsQueryOptions,
  validateRelationAnalysisOptions,
  validateActivityAnalysisOptions,
  validateImpactAnalysisOptions,
  validateDashboardConfigOptions,
  validateAnalyticsExportOptions,
  
  // Layer exports for more granular imports
  validation,
  core,
  integration
};