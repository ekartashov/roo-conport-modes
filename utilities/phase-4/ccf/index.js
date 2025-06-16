/**
 * Cognitive Continuity Framework (CCF) - Main Module
 * 
 * The Cognitive Continuity Framework ensures knowledge persistence and continuity
 * across different AI agents, sessions, and time periods.
 * 
 * It manages context states, tracks knowledge transitions, coordinates sessions,
 * and provides mechanisms for continuity operations such as saving, loading,
 * transferring, merging, and diffing cognitive contexts.
 * 
 * Key components:
 * - Core layer: Provides fundamental functionality for context management
 * - Validation layer: Ensures data integrity and validation
 * - Integration layer: Connects CCF with other system components
 */

// Core components
const {
  ContinuityCoordinator,
  ContextStateManager,
  ContinuityOperationHandler,
  SessionTracker,
  KnowledgeTransitionTracker,
  InMemoryStorage,
  MergeStrategies
} = require('./ccf-core');

// Validation functions
const {
  validateContextState,
  validateContinuityOperation,
  validateSession,
  validateKnowledgeTransition,
  validateOperationResult
} = require('./ccf-validation');

// Integration components
const {
  CCFIntegration,
  ConPortStorageProvider
} = require('./ccf-integration');

// Export all components
module.exports = {
  // Core exports
  ContinuityCoordinator,
  ContextStateManager,
  ContinuityOperationHandler,
  SessionTracker,
  KnowledgeTransitionTracker,
  InMemoryStorage,
  MergeStrategies,
  
  // Validation exports
  validateContextState,
  validateContinuityOperation,
  validateSession,
  validateKnowledgeTransition,
  validateOperationResult,
  
  // Integration exports
  CCFIntegration,
  ConPortStorageProvider
};