/**
 * Orchestrator Mode Enhancement
 * 
 * Integrates validation checkpoints and knowledge-first components to provide
 * enhanced capabilities for the Orchestrator Mode, particularly focused on
 * task decomposition, mode selection, and multi-step workflow management.
 * 
 * This enhancement follows:
 * - System Pattern #31: Mode-Specific Knowledge-First Enhancement Pattern
 */

const { OrchestratorValidationCheckpoints } = require('./orchestrator-validation-checkpoints');
const { OrchestratorKnowledgeFirst } = require('./orchestrator-knowledge-first');

/**
 * Class representing orchestration history for tracking multi-step workflows
 */
class OrchestrationHistory {
  constructor() {
    this.workflows = [];
    this.currentWorkflowId = null;
  }
  
  /**
   * Start a new workflow
   * @param {string} name - Workflow name
   * @param {string} description - Workflow description
   * @returns {string} - Workflow ID
   */
  startWorkflow(name, description) {
    const workflowId = `workflow-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const workflow = {
      id: workflowId,
      name,
      description,
      steps: [],
      startTime: new Date().toISOString(),
      status: 'in_progress'
    };
    
    this.workflows.push(workflow);
    this.currentWorkflowId = workflowId;
    
    return workflowId;
  }
  
  /**
   * Add a step to the current workflow
   * @param {Object} stepData - Step data
   * @returns {boolean} - Success status
   */
  addStep(stepData) {
    if (!this.currentWorkflowId) {
      return false;
    }
    
    const workflow = this.getWorkflowById(this.currentWorkflowId);
    
    if (!workflow) {
      return false;
    }
    
    const stepNumber = workflow.steps.length + 1;
    
    const step = {
      stepNumber,
      timestamp: new Date().toISOString(),
      ...stepData
    };
    
    workflow.steps.push(step);
    
    return true;
  }
  
  /**
   * Complete the current workflow
   * @param {string} outcome - Workflow outcome
   * @returns {boolean} - Success status
   */
  completeWorkflow(outcome) {
    if (!this.currentWorkflowId) {
      return false;
    }
    
    const workflow = this.getWorkflowById(this.currentWorkflowId);
    
    if (!workflow) {
      return false;
    }
    
    workflow.status = 'completed';
    workflow.endTime = new Date().toISOString();
    workflow.outcome = outcome;
    
    return true;
  }
  
  /**
   * Get workflow by ID
   * @param {string} workflowId - Workflow ID
   * @returns {Object|null} - Workflow object or null if not found
   */
  getWorkflowById(workflowId) {
    return this.workflows.find(workflow => workflow.id === workflowId) || null;
  }
  
  /**
   * Get the current workflow
   * @returns {Object|null} - Current workflow or null if none
   */
  getCurrentWorkflow() {
    if (!this.currentWorkflowId) {
      return null;
    }
    
    return this.getWorkflowById(this.currentWorkflowId);
  }
  
  /**
   * Get all workflows
   * @returns {Array} - Array of all workflows
   */
  getAllWorkflows() {
    return this.workflows;
  }
}

/**
 * Class representing a pre-defined workflow template
 */
class WorkflowTemplate {
  /**
   * Create a workflow template
   * @param {string} name - Template name
   * @param {Array} steps - Workflow steps
   * @param {Object} transitionRules - Rules for transitions between steps
   */
  constructor(name, steps, transitionRules) {
    this.name = name;
    this.steps = steps;
    this.transitionRules = transitionRules;
  }
  
  /**
   * Generate a workflow instance from this template
   * @param {Object} parameters - Parameters for customizing the workflow
   * @returns {Object} - Workflow instance
   */
  instantiate(parameters = {}) {
    // Create a copy of the steps with parameter substitution
    const instantiatedSteps = this.steps.map(step => {
      // Clone the step object
      const newStep = { ...step };
      
      // Apply parameter substitution to task description if applicable
      if (parameters.taskParameters && typeof newStep.task === 'string') {
        Object.entries(parameters.taskParameters).forEach(([key, value]) => {
          const placeholder = `{${key}}`;
          newStep.task = newStep.task.replace(placeholder, value);
        });
      }
      
      return newStep;
    });
    
    return {
      name: `${this.name} Instance`,
      steps: instantiatedSteps,
      transitionRules: this.transitionRules,
      parameters,
      instantiationTime: new Date().toISOString()
    };
  }
}

/**
 * Orchestrator Mode Enhancement class
 */
class OrchestratorModeEnhancement {
  /**
   * Create an orchestrator mode enhancement instance
   */
  constructor() {
    this.mode = 'orchestrator';
    
    // Initialize components
    this.validationCheckpoints = new OrchestratorValidationCheckpoints();
    this.knowledgeFirst = new OrchestratorKnowledgeFirst();
    
    // Initialize history tracking
    this.history = new OrchestrationHistory();
    
    // Cache for frequently used data
    this.cache = {
      workflowTemplates: {},
      modeCapabilities: {}
    };
  }
  
  /**
   * Select the appropriate mode for a task
   * @param {string} taskDescription - Task description
   * @param {Object} context - Additional context
   * @returns {Object} - Mode selection result with validation
   */
  selectModeForTask(taskDescription, context = {}) {
    // Get mode recommendation from knowledge component
    const modeResult = this.knowledgeFirst.getModeForTask(taskDescription, context);
    
    // Prepare data for validation
    const validationData = {
      task: taskDescription,
      selectedMode: modeResult.mode,
      availableModes: [
        'code', 'debug', 'architect', 'ask', 'docs', 
        'prompt-enhancer', 'prompt-enhancer-isolated', 
        'conport-maintenance', 'orchestrator'
      ],
      modeSelectionJustification: context.justification || null
    };
    
    // Validate mode selection
    const modeSelectionCheckpoint = this.validationCheckpoints.getCheckpoint('ModeSelection');
    const validationResult = modeSelectionCheckpoint.validate(validationData);
    
    // Return combined result
    return {
      selectedMode: modeResult.mode,
      confidence: modeResult.confidence,
      allModeScores: modeResult.allScores,
      validationResult,
      isValid: validationResult.valid
    };
  }
  
  /**
   * Decompose a task into subtasks
   * @param {string} taskDescription - Task description
   * @param {Object} options - Decomposition options
   * @returns {Object} - Decomposition result with validation
   */
  decomposeTask(taskDescription, options = {}) {
    // Get subtasks from knowledge component
    const subtasks = this.knowledgeFirst.decomposeTask(taskDescription, options.patternName);
    
    // Prepare data for validation
    const validationData = {
      task: taskDescription,
      subtasks
    };
    
    // Validate task decomposition
    const decompositionCheckpoint = this.validationCheckpoints.getCheckpoint('TaskDecomposition');
    const validationResult = decompositionCheckpoint.validate(validationData);
    
    // Return combined result
    return {
      subtasks,
      originalTask: taskDescription,
      pattern: options.patternName,
      validationResult,
      isValid: validationResult.valid
    };
  }
  
  /**
   * Prepare context for handoff to another mode
   * @param {string} fromMode - Source mode
   * @param {string} toMode - Target mode
   * @param {Object} context - Context data
   * @returns {Object} - Handoff preparation result with validation
   */
  prepareHandoff(fromMode, toMode, context) {
    // Get transition protocol
    const protocol = this.knowledgeFirst.getTransitionProtocol(fromMode, toMode);
    
    // Evaluate handoff completeness
    const completenessEvaluation = this.knowledgeFirst.evaluateHandoffCompleteness(
      context, fromMode, toMode
    );
    
    // Prepare data for validation
    const validationData = {
      handoffContext: context,
      selectedMode: toMode,
      task: context.task || ''
    };
    
    // Validate handoff completeness
    const handoffCheckpoint = this.validationCheckpoints.getCheckpoint('HandoffCompleteness');
    const validationResult = handoffCheckpoint.validate(validationData);
    
    // Add missing but required context fields with empty placeholders
    const enhancedContext = { ...context };
    
    completenessEvaluation.missingElements.forEach(element => {
      enhancedContext[element] = `[REQUIRED: ${element}]`;
    });
    
    // Return combined result
    return {
      protocol,
      enhancedContext,
      completenessEvaluation,
      validationResult,
      isValid: validationResult.valid,
      handoffChecklistStatus: protocol.handoffChecklist.map(item => ({
        item,
        fulfilled: validationResult.valid
      }))
    };
  }
  
  /**
   * Create a workflow from a template
   * @param {string} templateName - Name of workflow template
   * @param {Object} parameters - Parameters for the workflow
   * @returns {Object} - Workflow instance
   */
  createWorkflowFromTemplate(templateName, parameters = {}) {
    const template = this.knowledgeFirst.getWorkflowTemplate(templateName);
    
    if (!template) {
      return {
        success: false,
        error: `Template ${templateName} not found`
      };
    }
    
    // Create workflow template instance
    const workflowTemplate = new WorkflowTemplate(
      template.name,
      template.steps,
      template.transitionLogic
    );
    
    // Instantiate the workflow
    const workflowInstance = workflowTemplate.instantiate(parameters);
    
    // Start tracking this workflow
    const workflowId = this.history.startWorkflow(
      workflowInstance.name,
      template.description
    );
    
    // Record workflow creation
    this.history.addStep({
      action: 'workflow_creation',
      template: templateName,
      parameters
    });
    
    return {
      success: true,
      workflowId,
      workflow: workflowInstance
    };
  }
  
  /**
   * Execute the current step in a workflow
   * @param {string} workflowId - Workflow ID
   * @returns {Object} - Step execution result
   */
  executeCurrentWorkflowStep(workflowId) {
    const workflow = this.history.getWorkflowById(workflowId);
    
    if (!workflow) {
      return {
        success: false,
        error: `Workflow ${workflowId} not found`
      };
    }
    
    // Determine current step
    const completedSteps = workflow.steps.filter(step => step.status === 'completed');
    const currentStepNumber = completedSteps.length + 1;
    
    // Find step definition in the workflow
    const currentWorkflow = workflow.workflowInstance;
    
    if (!currentWorkflow || !currentWorkflow.steps || currentStepNumber > currentWorkflow.steps.length) {
      return {
        success: false,
        error: 'No more steps in workflow'
      };
    }
    
    const stepDefinition = currentWorkflow.steps[currentStepNumber - 1];
    
    // Record step execution
    this.history.addStep({
      action: 'step_execution',
      stepNumber: currentStepNumber,
      stepDefinition,
      status: 'in_progress'
    });
    
    return {
      success: true,
      stepNumber: currentStepNumber,
      stepDefinition,
      mode: stepDefinition.mode,
      task: stepDefinition.task
    };
  }
  
  /**
   * Complete a workflow step and prepare for transition
   * @param {string} workflowId - Workflow ID
   * @param {number} stepNumber - Step number
   * @param {Object} results - Step results
   * @returns {Object} - Transition preparation
   */
  completeWorkflowStep(workflowId, stepNumber, results) {
    const workflow = this.history.getWorkflowById(workflowId);
    
    if (!workflow) {
      return {
        success: false,
        error: `Workflow ${workflowId} not found`
      };
    }
    
    // Find the last step in the history that matches this step number
    const stepHistoryEntries = workflow.steps.filter(
      step => step.stepNumber === stepNumber
    );
    
    if (stepHistoryEntries.length === 0) {
      return {
        success: false,
        error: `Step ${stepNumber} not found in workflow history`
      };
    }
    
    const stepHistoryEntry = stepHistoryEntries[stepHistoryEntries.length - 1];
    
    // Update step history
    stepHistoryEntry.status = 'completed';
    stepHistoryEntry.results = results;
    stepHistoryEntry.completionTime = new Date().toISOString();
    
    // Check if this is the last step
    const currentWorkflow = workflow.workflowInstance;
    const isLastStep = stepNumber === currentWorkflow.steps.length;
    
    if (isLastStep) {
      // Complete the workflow
      this.history.completeWorkflow('completed');
      
      return {
        success: true,
        workflowComplete: true,
        message: 'Workflow completed successfully'
      };
    }
    
    // Prepare for next step
    const nextStepNumber = stepNumber + 1;
    const currentStepDefinition = currentWorkflow.steps[stepNumber - 1];
    const nextStepDefinition = currentWorkflow.steps[nextStepNumber - 1];
    
    // Find transition logic between these steps
    const transition = currentWorkflow.transitionRules.find(
      rule => rule.from === currentStepDefinition.mode && rule.to === nextStepDefinition.mode
    );
    
    // Prepare handoff data
    const handoffData = {};
    
    if (transition && transition.handoffData) {
      transition.handoffData.forEach(dataKey => {
        if (results && results[dataKey]) {
          handoffData[dataKey] = results[dataKey];
        } else {
          handoffData[dataKey] = `[MISSING: ${dataKey}]`;
        }
      });
    }
    
    // Validate the handoff
    const handoffResult = this.prepareHandoff(
      currentStepDefinition.mode,
      nextStepDefinition.mode,
      handoffData
    );
    
    return {
      success: true,
      workflowComplete: false,
      nextStep: {
        stepNumber: nextStepNumber,
        mode: nextStepDefinition.mode,
        task: nextStepDefinition.task
      },
      handoff: handoffResult,
      transition
    };
  }
  
  /**
   * Get all available workflow templates
   * @returns {Object} - Available workflow templates
   */
  getAvailableWorkflowTemplates() {
    return this.knowledgeFirst.getAllWorkflowTemplates();
  }
  
  /**
   * Log orchestration activity to ConPort
   * @param {Object} activity - Activity details
   * @param {Object} conportClient - ConPort client instance
   * @returns {Object} - Logging result
   */
  logOrchestrationActivity(activity, conportClient) {
    if (!conportClient) {
      return {
        success: false,
        error: 'ConPort client not provided'
      };
    }
    
    // Determine log type based on activity type
    let logResult = null;
    
    if (activity.type === 'mode_selection') {
      // Log as a decision
      logResult = conportClient.logDecision({
        summary: `Selected ${activity.selectedMode} mode for task`,
        rationale: activity.rationale || `Confidence: ${activity.confidence}, Task: ${activity.task}`,
        tags: ['orchestrator', 'mode_selection', activity.selectedMode]
      });
    } else if (activity.type === 'task_decomposition') {
      // Log as a system pattern
      logResult = conportClient.logSystemPattern({
        name: `Task Decomposition: ${activity.taskSummary}`,
        description: `Decomposed into: ${activity.subtasks.join(', ')}`,
        tags: ['orchestrator', 'task_decomposition']
      });
    } else if (activity.type === 'workflow_execution') {
      // Log as progress
      logResult = conportClient.logProgress({
        status: activity.status,
        description: `Workflow: ${activity.workflowName}, Step ${activity.currentStep}/${activity.totalSteps}`,
        parent_id: activity.parentProgressId
      });
    } else if (activity.type === 'mode_handoff') {
      // Log as a decision
      logResult = conportClient.logDecision({
        summary: `Handoff from ${activity.fromMode} to ${activity.toMode}`,
        rationale: `Transition point in workflow: ${activity.workflowName}`,
        tags: ['orchestrator', 'mode_handoff', activity.fromMode, activity.toMode]
      });
    }
    
    return {
      success: logResult && logResult.success,
      logResult
    };
  }
  
  /**
   * Create a specialized orchestration agent for a specific workflow
   * @param {string} workflowType - Type of workflow
   * @param {Object} parameters - Configuration parameters
   * @returns {Object} - Specialized orchestration agent
   */
  createSpecializedOrchestrationAgent(workflowType, parameters = {}) {
    // Get the workflow template
    const workflowTemplate = this.knowledgeFirst.getWorkflowTemplate(workflowType);
    
    if (!workflowTemplate) {
      return {
        success: false,
        error: `Unknown workflow type: ${workflowType}`
      };
    }
    
    // Create a specialized agent with focused capabilities
    const specializedAgent = {
      workflowType,
      template: workflowTemplate,
      parameters,
      
      // Create a workflow instance from this template
      instantiateWorkflow: (customParameters = {}) => {
        const mergedParameters = { ...parameters, ...customParameters };
        return this.createWorkflowFromTemplate(workflowType, mergedParameters);
      },
      
      // Get step-specific guidance
      getStepGuidance: (stepNumber) => {
        if (!workflowTemplate.steps[stepNumber - 1]) {
          return {
            success: false,
            error: `Invalid step number: ${stepNumber}`
          };
        }
        
        const step = workflowTemplate.steps[stepNumber - 1];
        const mode = step.mode;
        
        // Get mode-specific guidance
        const modeHeuristics = this.knowledgeFirst.modeHeuristics[mode] || {};
        
        return {
          success: true,
          step,
          mode,
          taskIndicators: modeHeuristics.taskIndicators || [],
          contextualFactors: modeHeuristics.contextualFactors || {}
        };
      },
      
      // Plan required transitions
      planTransitions: () => {
        return {
          success: true,
          transitions: workflowTemplate.transitionLogic
        };
      }
    };
    
    return {
      success: true,
      agent: specializedAgent
    };
  }
}

module.exports = { OrchestratorModeEnhancement, OrchestrationHistory, WorkflowTemplate };