/**
 * Autonomous Mapping Orchestrator (AMO) - Export Manifest
 * 
 * This file exports all components of the AMO system for easy import by other modules.
 */

// Import all components
const validation = require('./amo-validation');
const core = require('./amo-core');
const integration = require('./amo-integration');

// Export validation layer
const {
  validateRelationship,
  validateMappingSchema,
  validateQuery,
  validateRelationshipMetadata,
  validateRelationshipProperties,
  validateMappingRule,
  validateTaxonomy
} = validation;

// Export core layer
const {
  RelationshipManager,
  MappingOrchestrator,
  KnowledgeGraphQuery
} = core;

// Export integration layer
const {
  ConPortAMOIntegration,
  KDAPAMOIntegration,
  AKAFAMOIntegration
} = integration;

// Export AMO API
module.exports = {
  // Core classes
  RelationshipManager,
  MappingOrchestrator,
  KnowledgeGraphQuery,
  
  // Integration classes
  ConPortAMOIntegration,
  KDAPAMOIntegration,
  AKAFAMOIntegration,
  
  // Validation functions
  validateRelationship,
  validateMappingSchema,
  validateQuery,
  validateRelationshipMetadata,
  validateRelationshipProperties,
  validateMappingRule,
  validateTaxonomy,
  
  // Layer exports for more granular imports
  validation,
  core,
  integration
};