/**
 * Knowledge-First Guidelines - Export Manifest
 * 
 * This file exports all components of the Knowledge-First Guidelines framework
 * for easy import by other modules.
 */

// Import all components
const validation = require('./knowledge-first-validation');
const core = require('./knowledge-first-core');
const integrationModule = require('./knowledge-first-integration');

// Export validation layer
const {
  validateInitializationOptions,
  validateResponseOptions,
  validateDecisionOptions,
  validateCompletionOptions,
  validateAnalysisOptions
} = validation;

// Export core layer
const {
  KnowledgeSession,
  KnowledgeFirstInitializer,
  KnowledgeFirstResponder,
  KnowledgeFirstDecisionMaker,
  KnowledgeFirstCompleter,
  KnowledgeFirstAnalyzer,
  KnowledgeFirstGuidelines
} = core;

// Export Knowledge-First Guidelines API
module.exports = {
  // Main API
  KnowledgeFirstGuidelines,
  
  // Core classes
  KnowledgeSession,
  KnowledgeFirstInitializer,
  KnowledgeFirstResponder,
  KnowledgeFirstDecisionMaker,
  KnowledgeFirstCompleter,
  KnowledgeFirstAnalyzer,
  
  // Integration
  Initializer: integrationModule,
  
  // Validation functions
  validateInitializationOptions,
  validateResponseOptions,
  validateDecisionOptions,
  validateCompletionOptions,
  validateAnalysisOptions,
  
  // Layer exports for more granular imports
  validation,
  core,
  integration: integrationModule
};