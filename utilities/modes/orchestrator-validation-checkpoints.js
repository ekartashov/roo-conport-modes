/**
 * Orchestrator Validation Checkpoints
 * 
 * Provides specialized validation logic for orchestration tasks, including
 * mode selection, task decomposition, and handoff completeness validation.
 */

/**
 * Validation checkpoint for mode selection
 */
class ModeSelectionCheckpoint {
  constructor() {
    this.name = 'ModeSelection';
    this.description = 'Validates that the appropriate mode is selected for a task';
  }
  
  /**
   * Validate mode selection
   * @param {Object} orchestrationData - Orchestration data for validation
   * @returns {Object} - Validation result
   */
  validate(orchestrationData) {
    const { task, selectedMode, availableModes } = orchestrationData;
    
    // Check if task description contains mode-specific indicators
    const modeIndicators = {
      'code': ['write', 'implement', 'code', 'program', 'develop', 'function', 'class'],
      'debug': ['debug', 'fix', 'error', 'issue', 'bug', 'problem', 'exception', 'fail'],
      'architect': ['design', 'architect', 'structure', 'system', 'pattern', 'overview', 'organization'],
      'ask': ['explain', 'describe', 'what is', 'how does', 'tell me about', 'information'],
      'docs': ['document', 'documentation', 'readme', 'guide', 'tutorial', 'explain'],
      'prompt-enhancer': ['improve prompt', 'enhance prompt', 'better prompt', 'refine prompt'],
      'prompt-enhancer-isolated': ['improve prompt', 'enhance prompt', 'isolated context', 'universal'],
      'conport-maintenance': ['conport', 'knowledge base', 'maintenance', 'database', 'cleanup', 'audit']
    };
    
    // Count indicators for each mode
    const indicatorCounts = {};
    let bestMatch = null;
    let highestCount = 0;
    
    for (const [mode, indicators] of Object.entries(modeIndicators)) {
      const count = indicators.filter(indicator => 
        task.toLowerCase().includes(indicator.toLowerCase())
      ).length;
      
      indicatorCounts[mode] = count;
      
      if (count > highestCount) {
        highestCount = count;
        bestMatch = mode;
      }
    }
    
    // Check if selected mode matches best match
    const modeMatchesBestMatch = selectedMode === bestMatch;
    
    // Check if selected mode is available
    const modeIsAvailable = availableModes.includes(selectedMode);
    
    // Determine if validation passed (either matches best indicator or has justification)
    const valid = modeIsAvailable && (modeMatchesBestMatch || orchestrationData.modeSelectionJustification);
    
    // Collect errors
    const errors = [];
    
    if (!modeIsAvailable) {
      errors.push(`Selected mode "${selectedMode}" is not available in the system`);
    }
    
    if (!modeMatchesBestMatch && !orchestrationData.modeSelectionJustification) {
      errors.push(`Selected mode "${selectedMode}" does not match the best indicator match "${bestMatch}" and no justification provided`);
    }
    
    return {
      valid,
      errors: valid ? null : errors,
      details: {
        bestMatch,
        indicatorCounts,
        modeMatchesBestMatch,
        modeIsAvailable
      }
    };
  }
}

/**
 * Validation checkpoint for task decomposition
 */
class TaskDecompositionCheckpoint {
  constructor() {
    this.name = 'TaskDecomposition';
    this.description = 'Validates that complex tasks are properly broken down';
  }
  
  /**
   * Validate task decomposition
   * @param {Object} orchestrationData - Orchestration data for validation
   * @returns {Object} - Validation result
   */
  validate(orchestrationData) {
    const { task, subtasks } = orchestrationData;
    
    // Check if task is complex enough to need decomposition
    const taskComplexityIndicators = [
      'and', ',', ';', 'also', 'additionally', 'moreover', 'furthermore',
      'steps', 'first', 'second', 'third', 'finally', 'then', 'after',
      'multiple', 'several', 'various', 'different'
    ];
    
    const complexityScore = taskComplexityIndicators.filter(indicator => 
      task.toLowerCase().includes(indicator.toLowerCase())
    ).length;
    
    const isComplex = complexityScore >= 2 || task.split(' ').length > 30;
    
    // If task is complex, check if subtasks are properly defined
    const hasSubtasks = subtasks && subtasks.length > 0;
    
    // Check subtask quality if they exist
    let subtasksQualityScore = 0;
    
    if (hasSubtasks) {
      // Check if subtasks have clear action verbs
      const actionVerbRegex = /^(Create|Implement|Develop|Design|Write|Add|Update|Configure|Test|Validate|Check|Ensure|Set up|Build)/i;
      const subtasksWithActionVerbs = subtasks.filter(subtask => actionVerbRegex.test(subtask.trim())).length;
      
      // Calculate quality score (0.0 to 1.0)
      subtasksQualityScore = subtasksWithActionVerbs / subtasks.length;
    }
    
    // Determine if validation passed
    const valid = !isComplex || (hasSubtasks && subtasksQualityScore > 0.7);
    
    // Collect errors
    const errors = [];
    
    if (isComplex && !hasSubtasks) {
      errors.push('Complex task needs to be broken down into subtasks');
    }
    
    if (hasSubtasks && subtasksQualityScore <= 0.7) {
      errors.push('Subtasks should begin with clear action verbs to define specific actions');
    }
    
    return {
      valid,
      errors: valid ? null : errors,
      details: {
        isComplex,
        complexityScore,
        hasSubtasks,
        subtasksQualityScore
      }
    };
  }
}

/**
 * Validation checkpoint for handoff completeness
 */
class HandoffCompletenessCheckpoint {
  constructor() {
    this.name = 'HandoffCompleteness';
    this.description = 'Validates that mode transitions include complete context';
  }
  
  /**
   * Validate handoff completeness
   * @param {Object} orchestrationData - Orchestration data for validation
   * @returns {Object} - Validation result
   */
  validate(orchestrationData) {
    const { handoffContext, selectedMode, task } = orchestrationData;
    
    // Check if handoff context exists
    const hasHandoffContext = handoffContext && Object.keys(handoffContext).length > 0;
    
    // Define required context elements for different modes
    const requiredContextElements = {
      'code': ['task', 'requirements', 'constraints'],
      'debug': ['issue', 'symptoms', 'context'],
      'architect': ['requirements', 'constraints', 'goals'],
      'ask': ['question', 'background'],
      'docs': ['topic', 'audience', 'format'],
      'prompt-enhancer': ['original_prompt', 'enhancement_goals'],
      'prompt-enhancer-isolated': ['original_prompt', 'enhancement_goals'],
      'conport-maintenance': ['target', 'operation', 'criteria']
    };
    
    // Check for required context elements
    const requiredElements = requiredContextElements[selectedMode] || ['task', 'requirements'];
    const providedElements = handoffContext ? Object.keys(handoffContext) : [];
    
    const missingElements = requiredElements.filter(element => !providedElements.includes(element));
    const hasRequiredElements = missingElements.length === 0;
    
    // Check context completeness (subjective measure - check if context contains substantial info)
    let contextCompleteness = 0;
    
    if (hasHandoffContext) {
      // Count non-empty string values that have reasonable length
      let substantialValues = 0;
      for (const value of Object.values(handoffContext)) {
        if (typeof value === 'string' && value.trim().length >= 15) {
          substantialValues++;
        }
      }
      
      contextCompleteness = substantialValues / Object.values(handoffContext).length;
    }
    
    // Determine if validation passed
    const valid = hasHandoffContext && hasRequiredElements && contextCompleteness >= 0.7;
    
    // Collect errors
    const errors = [];
    
    if (!hasHandoffContext) {
      errors.push('Handoff context is missing for mode transition');
    }
    
    if (!hasRequiredElements) {
      errors.push(`Missing required context elements for ${selectedMode} mode: ${missingElements.join(', ')}`);
    }
    
    if (contextCompleteness < 0.7) {
      errors.push('Handoff context lacks sufficient detail for effective mode transition');
    }
    
    return {
      valid,
      errors: valid ? null : errors,
      details: {
        hasHandoffContext,
        hasRequiredElements,
        missingElements,
        contextCompleteness,
        providedElements
      }
    };
  }
}

/**
 * Orchestrator Validation Checkpoints
 */
class OrchestratorValidationCheckpoints {
  constructor() {
    this.mode = 'orchestrator';
    
    // Initialize checkpoints
    this.checkpoints = [
      new ModeSelectionCheckpoint(),
      new TaskDecompositionCheckpoint(),
      new HandoffCompletenessCheckpoint()
    ];
  }
  
  /**
   * Get all validation checkpoints
   * @returns {Array} - Array of validation checkpoints
   */
  getCheckpoints() {
    return this.checkpoints;
  }
  
  /**
   * Get a specific checkpoint by name
   * @param {string} name - Checkpoint name
   * @returns {Object|null} - Checkpoint object or null if not found
   */
  getCheckpoint(name) {
    return this.checkpoints.find(checkpoint => checkpoint.name === name) || null;
  }
  
  /**
   * Add a custom checkpoint
   * @param {Object} checkpoint - Custom checkpoint to add
   */
  addCheckpoint(checkpoint) {
    this.checkpoints.push(checkpoint);
  }
  
  /**
   * Remove a checkpoint by name
   * @param {string} name - Checkpoint name to remove
   * @returns {boolean} - True if checkpoint was removed, false otherwise
   */
  removeCheckpoint(name) {
    const index = this.checkpoints.findIndex(checkpoint => checkpoint.name === name);
    
    if (index !== -1) {
      this.checkpoints.splice(index, 1);
      return true;
    }
    
    return false;
  }
}

module.exports = { OrchestratorValidationCheckpoints };