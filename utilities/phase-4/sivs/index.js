/**
 * Strategic Insight Validation System (SIVS)
 * 
 * This module exports the complete SIVS system, bringing together
 * the validation, core, and integration layers.
 */

// Import validation layer components
const validationLayer = require('./sivs-validation');

// Import core layer components
const { 
  InsightValidator, 
  ValidationContext,
  StrategicInsightValidator 
} = require('./sivs-core');

// Import integration layer components
const {
  ConPortSIVSIntegration,
  KDAPSIVSIntegration,
  AKAFSIVSIntegration,
  SIVSIntegrationManager
} = require('./sivs-integration');

// Export all components
module.exports = {
  // Validation Layer
  validation: validationLayer,
  
  // Core Layer
  InsightValidator,
  ValidationContext,
  StrategicInsightValidator,
  
  // Integration Layer
  ConPortSIVSIntegration,
  KDAPSIVSIntegration,
  AKAFSIVSIntegration,
  SIVSIntegrationManager,
  
  // Direct access to validation functions
  validateQuality: validationLayer.validateQuality,
  validateRelevance: validationLayer.validateRelevance,
  validateCoherence: validationLayer.validateCoherence,
  validateAlignment: validationLayer.validateAlignment,
  validateRisk: validationLayer.validateRisk
};