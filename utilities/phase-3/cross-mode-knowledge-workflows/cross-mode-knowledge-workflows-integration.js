/**
 * Cross-Mode Knowledge Workflows Integration
 * 
 * This module integrates the validation and core components for Cross-Mode Knowledge Workflows,
 * providing a simplified API for knowledge transfer between different modes.
 */

const { validateCrossModeWorkflows } = require('./cross-mode-knowledge-workflows-validation');
const { createCrossModeWorkflowsCore } = require('./cross-mode-knowledge-workflows-core');

/**
 * Creates a cross-mode knowledge workflows manager with integrated validation
 * @param {Object} options Configuration options
 * @param {string} options.workspaceId ConPort workspace ID
 * @param {Object} options.conPortClient ConPort client instance
 * @param {boolean} [options.enableValidation=true] Enable input validation
 * @param {boolean} [options.strictMode=false] Throw errors on validation failures
 * @returns {Object} Integrated cross-mode workflows API
 */
function createCrossModeWorkflows(options = {}) {
  const {
    workspaceId,
    conPortClient,
    enableValidation = true,
    strictMode = false
  } = options;

  if (!workspaceId || !conPortClient) {
    throw new Error('Required options missing: workspaceId and conPortClient must be provided');
  }

  // Initialize validation functions
  const validation = validateCrossModeWorkflows();

  // Initialize core functions
  const core = createCrossModeWorkflowsCore({
    workspaceId,
    conPortClient
  });

  /**
   * Helper to run validation before a core function
   * @param {Function} validationFn Validation function to run
   * @param {any} input Input to validate
   * @param {Function} coreFn Core function to run if validation passes
   * @param {Array} args Arguments to pass to core function
   * @returns {any} Result of core function
   */
  function validateAndExecute(validationFn, input, coreFn, args = []) {
    if (enableValidation) {
      const validationResult = validationFn(input);
      
      if (!validationResult.valid) {
        const errorMessage = `Validation failed: ${validationResult.errors.join(', ')}`;
        
        if (strictMode) {
          throw new Error(errorMessage);
        } else {
          console.warn(errorMessage);
        }
      }
    }
    
    return coreFn(...args);
  }

  /**
   * Logs a cross-mode workflow operation to ConPort
   * @param {string} operation The operation type
   * @param {Object} details Operation details
   * @returns {Promise<void>} 
   */
  async function logWorkflowOperation(operation, details) {
    try {
      const logEntry = {
        operation,
        timestamp: new Date().toISOString(),
        details
      };

      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'crossmode_workflow_operations',
        key: `${operation}_${Date.now()}`,
        value: logEntry
      });
    } catch (error) {
      console.error('Failed to log workflow operation:', error);
      // Non-critical error, continue execution
    }
  }

  /**
   * Creates or retrieves a ConPort decision for a workflow transition
   * @param {Object} workflowTransition Workflow transition data
   * @returns {Promise<Object>} Decision object with ID
   */
  async function recordWorkflowTransitionDecision(workflowTransition) {
    const {
      workflowId,
      workflowName,
      sourceMode,
      targetMode,
      reason
    } = workflowTransition;

    try {
      const decisionSummary = `Workflow transition: ${sourceMode} → ${targetMode}`;
      const decisionRationale = reason || 
        `Transition of knowledge context from ${sourceMode} mode to ${targetMode} mode in workflow "${workflowName}" (ID: ${workflowId})`;

      const decision = await conPortClient.log_decision({
        workspace_id: workspaceId,
        summary: decisionSummary,
        rationale: decisionRationale,
        tags: ['workflow_transition', sourceMode, targetMode, 'cross_mode']
      });

      return decision;
    } catch (error) {
      console.error('Failed to record workflow transition decision:', error);
      // Return a placeholder object with error info
      return { 
        error: 'Failed to record decision', 
        errorDetails: error.message 
      };
    }
  }

  return {
    /**
     * Creates a new cross-mode workflow
     * @param {Object} workflowDefinition Workflow definition
     * @param {Object} initialContext Initial workflow context
     * @returns {Promise<Object>} Created workflow
     */
    async createWorkflow(workflowDefinition, initialContext = {}) {
      return validateAndExecute(
        validation.validateWorkflowDefinition,
        workflowDefinition,
        async () => {
          try {
            const workflow = await core.createWorkflow(workflowDefinition, initialContext);
            
            // Log workflow creation
            await logWorkflowOperation('workflow_created', {
              workflowId: workflow.id,
              workflowName: workflow.name,
              stepsCount: workflow.steps.length
            });
            
            // Record decision
            const decision = await recordWorkflowTransitionDecision({
              workflowId: workflow.id,
              workflowName: workflow.name,
              sourceMode: 'system',
              targetMode: workflow.steps[0].mode,
              reason: 'Workflow initialization'
            });
            
            // Store decision ID in workflow context
            if (decision && !decision.error) {
              workflow.context.decisions = workflow.context.decisions || [];
              workflow.context.decisions.push({
                id: decision.id,
                type: 'workflow_creation',
                timestamp: new Date().toISOString()
              });
            }
            
            return workflow;
          } catch (error) {
            console.error('Error creating workflow:', error);
            throw error;
          }
        },
        [workflowDefinition, initialContext]
      );
    },

    /**
     * Advances a workflow to the next step
     * @param {string} workflowId ID of the workflow to advance
     * @param {Object} currentStepResults Results from the current step
     * @returns {Promise<Object>} Updated workflow
     */
    async advanceWorkflow(workflowId, currentStepResults = {}) {
      return validateAndExecute(
        validation.validateWorkflowId,
        workflowId,
        async () => {
          try {
            // Get current workflow state before advancing
            const currentWorkflow = await core.getWorkflowState(workflowId);
            if (!currentWorkflow) {
              throw new Error(`Workflow not found: ${workflowId}`);
            }

            // Get source mode (current step) and target mode (next step)
            const currentStepIndex = currentWorkflow.currentStepIndex;
            const sourceMode = currentWorkflow.steps[currentStepIndex].mode;
            
            // Advance the workflow
            const updatedWorkflow = await core.advanceWorkflow(workflowId, currentStepResults);
            
            // Log the operation
            await logWorkflowOperation('workflow_advanced', {
              workflowId,
              fromStepIndex: currentStepIndex,
              toStepIndex: updatedWorkflow.currentStepIndex,
              status: updatedWorkflow.status
            });
            
            // If workflow isn't complete, record the transition decision
            if (updatedWorkflow.status !== 'completed' && updatedWorkflow.currentStepIndex < updatedWorkflow.steps.length) {
              const targetMode = updatedWorkflow.steps[updatedWorkflow.currentStepIndex].mode;
              
              const decision = await recordWorkflowTransitionDecision({
                workflowId: updatedWorkflow.id,
                workflowName: updatedWorkflow.name,
                sourceMode,
                targetMode,
                reason: `Workflow advancement from step ${currentStepIndex} to step ${updatedWorkflow.currentStepIndex}`
              });
              
              // Store decision ID in workflow context
              if (decision && !decision.error) {
                updatedWorkflow.context.decisions = updatedWorkflow.context.decisions || [];
                updatedWorkflow.context.decisions.push({
                  id: decision.id,
                  type: 'workflow_transition',
                  fromStep: currentStepIndex,
                  toStep: updatedWorkflow.currentStepIndex,
                  timestamp: new Date().toISOString()
                });
              }
            }
            
            return updatedWorkflow;
          } catch (error) {
            console.error(`Error advancing workflow ${workflowId}:`, error);
            throw error;
          }
        },
        [workflowId, currentStepResults]
      );
    },

    /**
     * Gets the current state of a workflow
     * @param {string} workflowId ID of the workflow
     * @returns {Promise<Object>} Current workflow state
     */
    async getWorkflow(workflowId) {
      return validateAndExecute(
        validation.validateWorkflowId,
        workflowId,
        () => core.getWorkflowState(workflowId),
        [workflowId]
      );
    },

    /**
     * Lists all active workflows
     * @param {Object} options Filter options
     * @param {string} [options.status] Filter by workflow status
     * @returns {Promise<Array<Object>>} List of workflows
     */
    async listWorkflows(options = {}) {
      try {
        // Get all workflows from ConPort
        const allWorkflows = await conPortClient.get_custom_data({
          workspace_id: workspaceId,
          category: 'crossmode_workflows'
        });
        
        if (!allWorkflows) {
          return [];
        }
        
        // Convert to array
        let workflows = Object.values(allWorkflows);
        
        // Apply status filter if provided
        if (options.status) {
          workflows = workflows.filter(workflow => workflow.status === options.status);
        }
        
        return workflows;
      } catch (error) {
        console.error('Error listing workflows:', error);
        return [];
      }
    },

    /**
     * Transfers knowledge context between modes
     * @param {Object} options Transfer options
     * @param {Object} options.context Knowledge context to transfer
     * @param {string} options.sourceMode Source mode
     * @param {string} options.targetMode Target mode
     * @param {string} [options.workflowId] Associated workflow ID
     * @param {boolean} [options.preserveWorkflowContext=true] Whether to preserve workflow context
     * @returns {Promise<Object>} Transferred knowledge context
     */
    async transferKnowledgeContext(options) {
      return validateAndExecute(
        validation.validateTransferOptions,
        options,
        async () => {
          try {
            const {
              context,
              sourceMode,
              targetMode,
              workflowId,
              preserveWorkflowContext = true
            } = options;
            
            // Execute the transfer
            const transferredContext = core.transferKnowledgeContext({
              context,
              sourceMode,
              targetMode,
              preserveWorkflowContext
            });
            
            // Record the transfer operation
            await logWorkflowOperation('context_transfer', {
              sourceMode,
              targetMode,
              workflowId: workflowId || 'standalone_transfer',
              contextSize: JSON.stringify(context).length,
              transferredContextSize: JSON.stringify(transferredContext).length
            });
            
            // Create a system pattern entry for significant transfers
            const isSignificant = JSON.stringify(transferredContext).length > 1000;
            
            if (isSignificant) {
              try {
                const patternName = `Knowledge transfer pattern: ${sourceMode} → ${targetMode}`;
                
                await conPortClient.log_system_pattern({
                  workspace_id: workspaceId,
                  name: patternName,
                  description: `Pattern identified for knowledge transfer between ${sourceMode} mode and ${targetMode} mode.`,
                  tags: ['knowledge_transfer', 'cross_mode', sourceMode, targetMode]
                });
              } catch (error) {
                console.error('Failed to log system pattern for knowledge transfer:', error);
                // Non-critical error, continue execution
              }
            }
            
            return transferredContext;
          } catch (error) {
            console.error('Error transferring knowledge context:', error);
            throw error;
          }
        },
        [options]
      );
    },

    /**
     * Creates a cross-mode knowledge reference
     * @param {Object} reference The cross-mode reference
     * @returns {Promise<Object>} Created reference
     */
    async createReference(reference) {
      return validateAndExecute(
        validation.validateReference,
        reference,
        () => core.createCrossModeReference(reference),
        [reference]
      );
    },

    /**
     * Gets cross-mode references filtered by various criteria
     * @param {Object} options Query options
     * @returns {Promise<Array<Object>>} Matching references
     */
    async getReferences(options = {}) {
      try {
        return await core.getCrossModeReferences(options);
      } catch (error) {
        console.error('Error retrieving cross-mode references:', error);
        return [];
      }
    },
    
    /**
     * Exports a workflow context to ConPort custom data
     * @param {string} workflowId Workflow ID
     * @param {string} category ConPort custom data category
     * @param {string} key ConPort custom data key
     * @returns {Promise<Object>} Export result
     */
    async exportWorkflowToConPort(workflowId, category, key) {
      try {
        validateAndExecute(
          validation.validateWorkflowId,
          workflowId,
          () => {}
        );
        
        // Get workflow state
        const workflow = await core.getWorkflowState(workflowId);
        if (!workflow) {
          throw new Error(`Workflow not found: ${workflowId}`);
        }
        
        // Create export package
        const exportPackage = {
          workflow,
          exportedAt: new Date().toISOString(),
          exportFormat: 'conport_custom_data_v1'
        };
        
        // Store in ConPort
        await conPortClient.log_custom_data({
          workspace_id: workspaceId,
          category: category || 'workflow_exports',
          key: key || `workflow_${workflowId}_${Date.now()}`,
          value: exportPackage
        });
        
        return {
          exported: true,
          workflowId,
          category,
          key
        };
      } catch (error) {
        console.error(`Error exporting workflow ${workflowId}:`, error);
        throw error;
      }
    },

    /**
     * Creates a serialized JSON representation of a workflow's knowledge context
     * @param {string} workflowId Workflow ID
     * @returns {Promise<Object>} Serialized workflow context
     */
    async serializeWorkflowContext(workflowId) {
      try {
        validateAndExecute(
          validation.validateWorkflowId,
          workflowId,
          () => {}
        );
        
        // Get workflow state
        const workflow = await core.getWorkflowState(workflowId);
        if (!workflow) {
          throw new Error(`Workflow not found: ${workflowId}`);
        }
        
        // Extract the context
        const { context } = workflow;
        
        // Create a serialization suitable for transfer or storage
        const serialized = {
          workflowId,
          workflowName: workflow.name,
          contextData: context,
          serializationTime: new Date().toISOString(),
          format: 'json'
        };
        
        return serialized;
      } catch (error) {
        console.error(`Error serializing workflow context ${workflowId}:`, error);
        throw error;
      }
    }
  };
}

module.exports = {
  createCrossModeWorkflows
};