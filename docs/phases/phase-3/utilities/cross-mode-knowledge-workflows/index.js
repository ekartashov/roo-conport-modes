/**
 * Cross-Mode Knowledge Workflows Component
 * 
 * This module exports the public API for the Cross-Mode Knowledge Workflows component,
 * which enables knowledge context transfer between different Roo modes.
 * 
 * The component follows the three-layer architecture pattern:
 * - Validation Layer: Input validation and parameter checking
 * - Core Layer: Business logic for workflow management and context transformation
 * - Integration Layer: Integration with ConPort client and simplified API
 */

// Export core functionality
const { createCrossModeWorkflowsCore } = require('./cross-mode-knowledge-workflows-core');

// Export validation functionality
const { createCrossModeWorkflowsValidation } = require('./cross-mode-knowledge-workflows-validation');

// Export integration functionality
const { createCrossModeWorkflows } = require('./cross-mode-knowledge-workflows-integration');

// Export public API
module.exports = {
  // Main API (Integration Layer)
  createCrossModeWorkflows,
  
  // Core Layer
  createCrossModeWorkflowsCore,
  
  // Validation Layer
  createCrossModeWorkflowsValidation
};