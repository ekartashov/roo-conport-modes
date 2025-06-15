/**
 * Cross-Mode Knowledge Workflows Core
 * 
 * This module implements core functionality for cross-mode knowledge workflows,
 * including context serialization, workflow state management, and knowledge transfers.
 */

/**
 * Creates a cross-mode knowledge workflows manager
 * @param {Object} options Configuration options
 * @param {string} options.workspaceId ConPort workspace ID
 * @param {Object} options.conPortClient ConPort client instance
 * @returns {Object} Cross-mode knowledge workflows methods
 */
function createCrossModeWorkflowsCore(options = {}) {
  const { workspaceId, conPortClient } = options;

  // Internal storage for active workflows
  const activeWorkflows = new Map();

  /**
   * Serializes knowledge context for transfer between modes
   * @param {Object} context Knowledge context to serialize
   * @param {string} sourceMode Source mode
   * @param {string} targetMode Target mode
   * @returns {Object} Serialized context
   */
  function serializeKnowledgeContext(context, sourceMode, targetMode) {
    if (!context || typeof context !== 'object') {
      return { 
        __error: 'Invalid context',
        sourceMode,
        targetMode
      };
    }

    // Create a base serialized context with metadata
    const serialized = {
      __meta: {
        sourceMode,
        targetMode,
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };

    // Map common context fields
    const commonFields = [
      'taskDescription',
      'priority',
      'constraints',
      'requirements',
      'references'
    ];

    commonFields.forEach(field => {
      if (context[field] !== undefined) {
        serialized[field] = context[field];
      }
    });

    // Handle mode-specific context fields
    // These transformations adapt context fields from source mode to target mode format
    const modeSpecificHandlers = {
      // Handle code to architect transitions
      'code->architect': (ctx) => {
        if (ctx.codeBase) {
          serialized.existingImplementation = ctx.codeBase;
        }
        if (ctx.technicalDebt) {
          serialized.constraints = serialized.constraints || [];
          serialized.constraints.push(...ctx.technicalDebt.map(item => ({
            type: 'technical_debt',
            description: item
          })));
        }
        return serialized;
      },

      // Handle architect to code transitions
      'architect->code': (ctx) => {
        if (ctx.architecturalDecisions) {
          serialized.implementationGuidelines = ctx.architecturalDecisions;
        }
        if (ctx.patterns) {
          serialized.patternImplementations = ctx.patterns;
        }
        return serialized;
      },

      // Handle code to debug transitions
      'code->debug': (ctx) => {
        if (ctx.codeBase) {
          serialized.codeToDebug = ctx.codeBase;
        }
        if (ctx.testResults) {
          serialized.failingTests = ctx.testResults.filter(test => !test.passing);
        }
        return serialized;
      },

      // Handle debug to code transitions
      'debug->code': (ctx) => {
        if (ctx.rootCauses) {
          serialized.fixRequirements = ctx.rootCauses;
        }
        if (ctx.fixAttempts) {
          serialized.previousAttempts = ctx.fixAttempts;
        }
        return serialized;
      },
      
      // Handle code to docs transitions
      'code->docs': (ctx) => {
        if (ctx.codeBase) {
          serialized.contentToDocument = ctx.codeBase;
        }
        if (ctx.apis) {
          serialized.apiDefinitions = ctx.apis;
        }
        return serialized;
      },
      
      // Handle docs to code transitions
      'docs->code': (ctx) => {
        if (ctx.documentationGaps) {
          serialized.requiredDocumentation = ctx.documentationGaps;
        }
        return serialized;
      },

      // Handle orchestrator to any mode transitions
      'orchestrator->*': (ctx) => {
        if (ctx.taskBreakdown) {
          serialized.subtasks = ctx.taskBreakdown;
        }
        if (ctx.contextualKnowledge) {
          serialized.backgroundContext = ctx.contextualKnowledge;
        }
        return serialized;
      }
    };
    
    // Apply mode-specific transformations
    const handlerKey = `${sourceMode}->${targetMode}`;
    const genericHandlerKey = `${sourceMode}->*`;
    
    if (modeSpecificHandlers[handlerKey]) {
      modeSpecificHandlers[handlerKey](context);
    } else if (modeSpecificHandlers[genericHandlerKey]) {
      modeSpecificHandlers[genericHandlerKey](context);
    }

    // Include mode-specific sections of context directly if they exist
    if (context[targetMode] && typeof context[targetMode] === 'object') {
      Object.assign(serialized, context[targetMode]);
    }
    
    // Include ConPort references if they exist
    if (context.conPortReferences) {
      serialized.conPortReferences = context.conPortReferences;
    }
    
    // Include workflow context if it exists
    if (context.workflowContext) {
      serialized.workflowContext = context.workflowContext;
    }

    return serialized;
  }

  /**
   * Deserializes knowledge context after transfer between modes
   * @param {Object} serializedContext Serialized knowledge context
   * @param {string} targetMode Target mode
   * @returns {Object} Deserialized context
   */
  function deserializeKnowledgeContext(serializedContext, targetMode) {
    if (!serializedContext || typeof serializedContext !== 'object') {
      return { __error: 'Invalid serialized context' };
    }

    // If there's an error in the serialized context, return it
    if (serializedContext.__error) {
      return serializedContext;
    }

    const context = { ...serializedContext };
    
    // Remove metadata from the context
    delete context.__meta;
    
    // Add receipt timestamp
    context.receivedAt = new Date().toISOString();
    
    // Transform generic fields to mode-specific formats if needed
    switch (targetMode) {
      case 'architect':
        if (context.existingImplementation) {
          context.codebaseAnalysis = {
            implementation: context.existingImplementation,
            analyzedAt: new Date().toISOString()
          };
          delete context.existingImplementation;
        }
        break;
        
      case 'code':
        if (context.implementationGuidelines) {
          context.architecturalContext = {
            decisions: context.implementationGuidelines,
            appliedAt: new Date().toISOString()
          };
          delete context.implementationGuidelines;
        }
        break;
        
      case 'debug':
        // Transform context for debug mode
        if (context.codeToDebug) {
          context.targetCode = context.codeToDebug;
          delete context.codeToDebug;
        }
        break;
        
      case 'docs':
        // Transform context for docs mode
        if (context.contentToDocument) {
          context.sourceContent = context.contentToDocument;
          delete context.contentToDocument;
        }
        break;
        
      // Add more mode-specific transformations as needed
    }

    return context;
  }

  /**
   * Creates and initializes a new workflow
   * @param {Object} workflowDefinition The workflow definition
   * @param {Object} initialContext Initial knowledge context
   * @returns {Promise<Object>} Created workflow with ID
   */
  async function createWorkflow(workflowDefinition, initialContext = {}) {
    const { id, name, steps } = workflowDefinition;
    
    if (!id || !name || !Array.isArray(steps) || steps.length === 0) {
      throw new Error('Invalid workflow definition');
    }
    
    // Create workflow object
    const workflow = {
      id,
      name,
      steps,
      currentStepIndex: 0,
      status: 'initialized',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      context: initialContext,
      history: []
    };
    
    // Store workflow in active workflows map
    activeWorkflows.set(id, workflow);
    
    // Save workflow to ConPort for persistence
    try {
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'crossmode_workflows',
        key: id,
        value: workflow
      });
    } catch (error) {
      console.error('Error saving workflow to ConPort:', error);
      // Continue despite error - workflow is still in memory
    }
    
    return workflow;
  }
  
  /**
   * Advances a workflow to the next step
   * @param {string} workflowId ID of the workflow to advance
   * @param {Object} currentStepResults Results from the current step
   * @returns {Promise<Object>} Updated workflow with next step information
   */
  async function advanceWorkflow(workflowId, currentStepResults = {}) {
    const workflow = activeWorkflows.get(workflowId);
    
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }
    
    // Record current step outcome
    const currentStep = workflow.steps[workflow.currentStepIndex];
    workflow.history.push({
      stepIndex: workflow.currentStepIndex,
      mode: currentStep.mode,
      task: currentStep.task,
      completedAt: new Date().toISOString(),
      results: currentStepResults
    });
    
    // Update context with results
    workflow.context = {
      ...workflow.context,
      ...currentStepResults
    };
    
    // Move to next step
    workflow.currentStepIndex += 1;
    
    // Check if workflow is complete
    if (workflow.currentStepIndex >= workflow.steps.length) {
      workflow.status = 'completed';
      workflow.completedAt = new Date().toISOString();
    } else {
      workflow.status = 'in_progress';
      workflow.currentStep = workflow.steps[workflow.currentStepIndex];
    }
    
    workflow.lastUpdated = new Date().toISOString();
    
    // Update workflow in ConPort
    try {
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'crossmode_workflows',
        key: workflowId,
        value: workflow
      });
    } catch (error) {
      console.error('Error updating workflow in ConPort:', error);
      // Continue despite error - workflow is still updated in memory
    }
    
    return workflow;
  }
  
  /**
   * Retrieves workflow state
   * @param {string} workflowId ID of the workflow
   * @returns {Promise<Object>} Current workflow state
   */
  async function getWorkflowState(workflowId) {
    // Try to get from memory first
    if (activeWorkflows.has(workflowId)) {
      return activeWorkflows.get(workflowId);
    }
    
    // Not in memory, try to retrieve from ConPort
    try {
      const savedWorkflow = await conPortClient.get_custom_data({
        workspace_id: workspaceId,
        category: 'crossmode_workflows',
        key: workflowId
      });
      
      if (savedWorkflow) {
        // Restore to active workflows map
        activeWorkflows.set(workflowId, savedWorkflow);
        return savedWorkflow;
      }
    } catch (error) {
      console.error(`Error retrieving workflow ${workflowId} from ConPort:`, error);
    }
    
    return null;
  }
  
  /**
   * Transfers knowledge context between modes
   * @param {Object} options Transfer options
   * @param {Object} options.context Knowledge context to transfer
   * @param {string} options.sourceMode Source mode
   * @param {string} options.targetMode Target mode
   * @param {boolean} [options.preserveWorkflowContext=true] Whether to preserve workflow context
   * @returns {Object} Transferred knowledge context
   */
  function transferKnowledgeContext(options) {
    const { 
      context, 
      sourceMode, 
      targetMode,
      preserveWorkflowContext = true
    } = options;
    
    if (!context || !sourceMode || !targetMode) {
      throw new Error('Context, source mode, and target mode are required');
    }
    
    // Serialize context for transfer
    const serializedContext = serializeKnowledgeContext(context, sourceMode, targetMode);
    
    // If preserving workflow context, ensure it's included in the serialized context
    if (preserveWorkflowContext && context.workflowContext) {
      serializedContext.workflowContext = context.workflowContext;
    }
    
    // Deserialize context for target mode
    const deserializedContext = deserializeKnowledgeContext(serializedContext, targetMode);
    
    return deserializedContext;
  }
  
  /**
   * Creates a cross-mode knowledge reference
   * @param {Object} reference The cross-mode reference to create
   * @param {string} reference.sourceMode Source mode
   * @param {string} reference.sourceArtifact Source artifact identifier
   * @param {string} reference.targetMode Target mode
   * @param {string} reference.targetArtifact Target artifact identifier
   * @param {string} reference.referenceType Type of reference
   * @returns {Promise<Object>} Created reference
   */
  async function createCrossModeReference(reference) {
    const {
      sourceMode,
      sourceArtifact,
      targetMode,
      targetArtifact,
      referenceType,
      description = ''
    } = reference;
    
    // Create a unique ID for the reference
    const referenceId = `${sourceMode}_${sourceArtifact}_${referenceType}_${targetMode}_${targetArtifact}`;
    
    // Store the reference in ConPort
    try {
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'crossmode_references',
        key: referenceId,
        value: {
          sourceMode,
          sourceArtifact,
          targetMode,
          targetArtifact,
          referenceType,
          description,
          createdAt: new Date().toISOString()
        }
      });
      
      return {
        id: referenceId,
        created: true,
        reference
      };
    } catch (error) {
      console.error('Error creating cross-mode reference:', error);
      throw new Error('Failed to create cross-mode reference');
    }
  }
  
  /**
   * Gets cross-mode references by source or target
   * @param {Object} options Query options
   * @param {string} [options.mode] Mode to filter by
   * @param {string} [options.artifact] Artifact to filter by
   * @param {string} [options.referenceType] Reference type to filter by
   * @param {boolean} [options.isSource=true] Whether to search as source (true) or target (false)
   * @returns {Promise<Array<Object>>} Matching references
   */
  async function getCrossModeReferences(options) {
    const {
      mode,
      artifact,
      referenceType,
      isSource = true
    } = options;
    
    try {
      // Get all cross-mode references
      const allReferences = await conPortClient.get_custom_data({
        workspace_id: workspaceId,
        category: 'crossmode_references'
      });
      
      if (!allReferences) {
        return [];
      }
      
      // Convert to array
      const referencesArray = Object.values(allReferences);
      
      // Apply filters
      return referencesArray.filter(ref => {
        // Check mode
        if (mode) {
          if (isSource && ref.sourceMode !== mode) return false;
          if (!isSource && ref.targetMode !== mode) return false;
        }
        
        // Check artifact
        if (artifact) {
          if (isSource && ref.sourceArtifact !== artifact) return false;
          if (!isSource && ref.targetArtifact !== artifact) return false;
        }
        
        // Check reference type
        if (referenceType && ref.referenceType !== referenceType) {
          return false;
        }
        
        return true;
      });
    } catch (error) {
      console.error('Error retrieving cross-mode references:', error);
      return [];
    }
  }

  return {
    // Public API
    serializeKnowledgeContext,
    deserializeKnowledgeContext,
    createWorkflow,
    advanceWorkflow,
    getWorkflowState,
    transferKnowledgeContext,
    createCrossModeReference,
    getCrossModeReferences
  };
}

module.exports = {
  createCrossModeWorkflowsCore
};