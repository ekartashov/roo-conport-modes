/**
 * Cross-Mode Knowledge Workflows Validation
 * 
 * This module provides validation checkpoints for cross-mode knowledge workflows,
 * ensuring data integrity, workflow validity, and context preservation across mode transitions.
 */

const { ConPortValidationManager } = require('../../conport-validation-manager');

/**
 * Creates validation checkpoints for cross-mode knowledge workflows
 * @param {Object} options Configuration options
 * @param {string} options.workspaceId ConPort workspace ID
 * @param {Object} options.conPortClient ConPort client instance
 * @returns {Object} Validation checkpoint methods
 */
function createCrossModeWorkflowsValidation(options = {}) {
  const { workspaceId, conPortClient } = options;
  const validationManager = new ConPortValidationManager({
    workspaceId,
    componentName: 'cross-mode-knowledge-workflows',
    conPortClient
  });

  /**
   * Validates a knowledge context transfer between modes
   * @param {Object} contextTransfer The context transfer to validate
   * @param {string} contextTransfer.sourceMode Source mode slug
   * @param {string} contextTransfer.targetMode Target mode slug
   * @param {Object} contextTransfer.knowledgeContext Knowledge context being transferred
   * @returns {Promise<Object>} Validation result with valid flag and messages
   */
  async function validateContextTransfer(contextTransfer) {
    const {
      sourceMode,
      targetMode,
      knowledgeContext
    } = contextTransfer;

    // Basic validation checks
    const validationIssues = [];

    if (!sourceMode || !targetMode) {
      validationIssues.push('Source and target modes are required');
    }

    if (!knowledgeContext || typeof knowledgeContext !== 'object') {
      validationIssues.push('Knowledge context must be a valid object');
    }

    // Verify source and target modes are valid
    const validModes = [
      'code', 'architect', 'ask', 'debug', 'docs', 
      'orchestrator', 'prompt-enhancer', 'prompt-enhancer-isolated', 
      'conport-maintenance'
    ];

    if (!validModes.includes(sourceMode)) {
      validationIssues.push(`Invalid source mode: ${sourceMode}`);
    }

    if (!validModes.includes(targetMode)) {
      validationIssues.push(`Invalid target mode: ${targetMode}`);
    }

    // Check if context is empty
    if (knowledgeContext && Object.keys(knowledgeContext).length === 0) {
      validationIssues.push('Knowledge context is empty');
    }

    // Ensure required context fields are present
    if (knowledgeContext) {
      const requiredFields = ['taskDescription', 'priority'];
      for (const field of requiredFields) {
        if (!knowledgeContext[field]) {
          validationIssues.push(`Required knowledge context field missing: ${field}`);
        }
      }
    }

    return {
      valid: validationIssues.length === 0,
      issues: validationIssues
    };
  }

  /**
   * Validates a workflow state persistence request
   * @param {Object} stateData The workflow state data to validate
   * @param {string} stateData.workflowId Unique workflow identifier
   * @param {string} stateData.currentMode Current mode
   * @param {Object} stateData.state State data to persist
   * @returns {Object} Validation result with valid flag and messages
   */
  function validateWorkflowStatePersistence(stateData) {
    const { workflowId, currentMode, state } = stateData;
    const validationIssues = [];

    if (!workflowId || typeof workflowId !== 'string') {
      validationIssues.push('Valid workflow ID is required');
    }

    if (!currentMode) {
      validationIssues.push('Current mode is required');
    }

    if (!state || typeof state !== 'object') {
      validationIssues.push('State data must be a valid object');
    }

    // Check workflow ID format (should be UUID-like)
    if (workflowId && !workflowId.match(/^[a-zA-Z0-9_-]+$/)) {
      validationIssues.push('Workflow ID contains invalid characters');
    }

    // Check state size
    const stateSize = JSON.stringify(state).length;
    if (stateSize > 100000) { // 100KB limit
      validationIssues.push(`State size (${stateSize} bytes) exceeds maximum allowed (100000 bytes)`);
    }

    return {
      valid: validationIssues.length === 0,
      issues: validationIssues
    };
  }

  /**
   * Validates a workflow definition
   * @param {Object} workflow The workflow definition to validate
   * @param {string} workflow.id Unique workflow identifier
   * @param {string} workflow.name Workflow name
   * @param {Array<Object>} workflow.steps Workflow steps
   * @returns {Object} Validation result with valid flag and messages
   */
  function validateWorkflowDefinition(workflow) {
    const { id, name, steps } = workflow;
    const validationIssues = [];

    if (!id) {
      validationIssues.push('Workflow ID is required');
    }

    if (!name) {
      validationIssues.push('Workflow name is required');
    }

    if (!Array.isArray(steps) || steps.length === 0) {
      validationIssues.push('Workflow must have at least one step');
    }

    // Validate each step
    if (Array.isArray(steps)) {
      steps.forEach((step, index) => {
        if (!step.mode) {
          validationIssues.push(`Step ${index + 1} is missing mode`);
        }

        if (!step.task) {
          validationIssues.push(`Step ${index + 1} is missing task description`);
        }

        if (step.knowledgeTransfer && typeof step.knowledgeTransfer !== 'object') {
          validationIssues.push(`Step ${index + 1} has invalid knowledge transfer specification`);
        }
      });
    }

    return {
      valid: validationIssues.length === 0,
      issues: validationIssues
    };
  }
  
  /**
   * Validates cross-mode knowledge references
   * @param {Object} reference The cross-mode reference to validate
   * @param {string} reference.sourceMode Source mode
   * @param {string} reference.sourceArtifact Source artifact identifier
   * @param {string} reference.targetMode Target mode
   * @param {string} reference.targetArtifact Target artifact identifier
   * @param {string} reference.referenceType Type of reference
   * @returns {Object} Validation result with valid flag and messages
   */
  function validateCrossModeReference(reference) {
    const {
      sourceMode,
      sourceArtifact,
      targetMode,
      targetArtifact,
      referenceType
    } = reference;
    
    const validationIssues = [];
    
    if (!sourceMode || !sourceArtifact || !targetMode || !targetArtifact) {
      validationIssues.push('Source mode, source artifact, target mode, and target artifact are all required');
    }
    
    if (!referenceType) {
      validationIssues.push('Reference type is required');
    }
    
    // Validate reference type
    const validReferenceTypes = [
      'uses', 'implements', 'extends', 'depends_on', 
      'references', 'derives_from', 'contextualizes'
    ];
    
    if (referenceType && !validReferenceTypes.includes(referenceType)) {
      validationIssues.push(`Invalid reference type: ${referenceType}`);
    }
    
    return {
      valid: validationIssues.length === 0,
      issues: validationIssues
    };
  }

  return {
    validateContextTransfer,
    validateWorkflowStatePersistence,
    validateWorkflowDefinition,
    validateCrossModeReference,
    
    // Register with validation manager
    registerWithManager: () => {
      validationManager.registerCheckpoint(
        'context_transfer',
        validateContextTransfer
      );
      
      validationManager.registerCheckpoint(
        'workflow_state_persistence',
        validateWorkflowStatePersistence
      );
      
      validationManager.registerCheckpoint(
        'workflow_definition',
        validateWorkflowDefinition
      );
      
      validationManager.registerCheckpoint(
        'cross_mode_reference',
        validateCrossModeReference
      );
      
      return validationManager;
    }
  };
}

module.exports = {
  createCrossModeWorkflowsValidation
};