/**
 * ConPort Validation Manager
 * 
 * A high-level utility that manages validation checkpoints and provides
 * an easy-to-use interface for incorporating validation into mode templates.
 */

const { 
  preResponseValidation, 
  designDecisionValidation,
  implementationPlanValidation,
  codeGenerationValidation,
  completionValidation,
  ValidationRegistry
} = require('./validation-checkpoints');

/**
 * ConPortValidationManager handles the coordination of validation checkpoints
 * and maintains the validation state throughout a session.
 */
class ConPortValidationManager {
  /**
   * Create a new ConPort Validation Manager
   * @param {Object} options - Configuration options
   * @param {string} options.workspaceId - ConPort workspace ID
   * @param {string} options.modeType - Type of mode (code, architect, ask, debug)
   * @param {Object} options.conPortClient - ConPort client for making API calls
   */
  constructor(options = {}) {
    this.workspaceId = options.workspaceId;
    this.modeType = options.modeType || 'default';
    this.conPortClient = options.conPortClient;
    this.registry = new ValidationRegistry();
    this.validationEnabled = true;
    this.strictMode = options.strictMode || false;
    this.autoLog = options.autoLog !== false; // Defaults to true
    this.modeSpecificCheckpoints = {};
    
    // Configure mode-specific checkpoints
    this._configureModeSpecificCheckpoints();
  }
  
  /**
   * Configure mode-specific validation checkpoints based on the mode type
   * @private
   */
  _configureModeSpecificCheckpoints() {
    switch (this.modeType.toLowerCase()) {
      case 'architect':
        this.modeSpecificCheckpoints = {
          architectureConsistency: this._architectureConsistencyCheckpoint.bind(this),
          requirementTraceability: this._requirementTraceabilityCheckpoint.bind(this)
        };
        break;
        
      case 'code':
        this.modeSpecificCheckpoints = {
          patternApplication: this._patternApplicationCheckpoint.bind(this),
          testCoverage: this._testCoverageCheckpoint.bind(this)
        };
        break;
        
      case 'debug':
        this.modeSpecificCheckpoints = {
          knownIssues: this._knownIssuesCheckpoint.bind(this),
          rootCauseAnalysis: this._rootCauseAnalysisCheckpoint.bind(this)
        };
        break;
        
      case 'ask':
        this.modeSpecificCheckpoints = {
          informationAccuracy: this._informationAccuracyCheckpoint.bind(this),
          terminologyConsistency: this._terminologyConsistencyCheckpoint.bind(this)
        };
        break;
        
      // Add other mode types as needed
      
      default:
        this.modeSpecificCheckpoints = {};
    }
  }
  
  /**
   * Enable or disable validation
   * @param {boolean} enabled - Whether validation should be enabled
   */
  setValidationEnabled(enabled) {
    this.validationEnabled = !!enabled;
    return this;
  }
  
  /**
   * Enable or disable strict validation
   * In strict mode, validation failures will throw errors
   * @param {boolean} strict - Whether strict mode should be enabled
   */
  setStrictMode(strict) {
    this.strictMode = !!strict;
    return this;
  }
  
  /**
   * Enable or disable automatic logging of validation results to ConPort
   * @param {boolean} autoLog - Whether auto-logging should be enabled
   */
  setAutoLog(autoLog) {
    this.autoLog = !!autoLog;
    return this;
  }
  
  /**
   * Get the validation registry
   * @return {ValidationRegistry} - The validation registry
   */
  getRegistry() {
    return this.registry;
  }
  
  /**
   * Apply a validation checkpoint and handle the result
   * @param {string} checkpointName - Name of the checkpoint
   * @param {Function} checkpointFn - Validation function to execute
   * @param {Object} context - Context for the validation
   * @return {Promise<Object>} - Validation result
   */
  async _applyCheckpoint(checkpointName, checkpointFn, context) {
    if (!this.validationEnabled) {
      return { valid: true, skipped: true, message: "Validation is disabled" };
    }
    
    try {
      // Execute the validation checkpoint
      const result = await checkpointFn(context);
      
      // Record the validation in the registry
      this.registry.recordValidation(checkpointName, result);
      
      // Auto-log to ConPort if enabled
      if (this.autoLog && this.conPortClient) {
        await this._logValidationToConPort(checkpointName, result);
      }
      
      // If in strict mode and validation failed, throw an error
      if (this.strictMode && !result.valid) {
        throw new Error(`Validation '${checkpointName}' failed: ${result.message}`);
      }
      
      return result;
    } catch (error) {
      // Handle errors during validation
      const errorResult = {
        valid: false,
        error: error.message,
        message: `Validation '${checkpointName}' encountered an error: ${error.message}`
      };
      
      this.registry.recordValidation(checkpointName, errorResult);
      
      // If in strict mode, re-throw the error
      if (this.strictMode) {
        throw error;
      }
      
      return errorResult;
    }
  }
  
  /**
   * Log validation results to ConPort
   * @param {string} checkpointName - Name of the checkpoint
   * @param {Object} result - Validation result
   * @return {Promise<void>}
   * @private
   */
  async _logValidationToConPort(checkpointName, result) {
    if (!this.conPortClient || !this.workspaceId) {
      return;
    }
    
    try {
      await this.conPortClient.logCustomData({
        workspace_id: this.workspaceId,
        category: "ValidationResults",
        key: `${checkpointName}_${Date.now()}`,
        value: result
      });
    } catch (error) {
      console.error("Failed to log validation to ConPort:", error);
    }
  }
  
  /**
   * Update active context in ConPort with validation status
   * @param {string} checkpointName - Name of the checkpoint
   * @param {Object} result - Validation result
   * @return {Promise<void>}
   */
  async updateActiveContextWithValidation(checkpointName, result) {
    if (!this.conPortClient || !this.workspaceId) {
      return;
    }
    
    try {
      // Get current active context
      const activeContext = await this.conPortClient.getActiveContext({
        workspace_id: this.workspaceId
      });
      
      // Add validation result to the validation_status field
      const currentValidationStatus = activeContext.validation_status || {};
      currentValidationStatus[checkpointName] = {
        timestamp: new Date().toISOString(),
        valid: result.valid,
        message: result.message
      };
      
      // Update active context
      await this.conPortClient.updateActiveContext({
        workspace_id: this.workspaceId,
        patch_content: {
          validation_status: currentValidationStatus
        }
      });
    } catch (error) {
      console.error("Failed to update active context with validation status:", error);
    }
  }
  
  /**
   * Pre-Response Validation Checkpoint
   * @param {string} responseContent - Response content to validate
   * @return {Promise<Object>} - Validation result with possibly modified content
   */
  async validateResponse(responseContent) {
    return this._applyCheckpoint(
      "preResponseValidation",
      preResponseValidation,
      responseContent
    );
  }
  
  /**
   * Design Decision Validation Checkpoint
   * @param {Object} decision - Decision to validate
   * @return {Promise<Object>} - Validation result
   */
  async validateDecision(decision) {
    return this._applyCheckpoint(
      "designDecisionValidation",
      designDecisionValidation,
      decision
    );
  }
  
  /**
   * Implementation Plan Validation Checkpoint
   * @param {Object} plan - Implementation plan to validate
   * @return {Promise<Object>} - Validation result
   */
  async validateImplementationPlan(plan) {
    return this._applyCheckpoint(
      "implementationPlanValidation",
      implementationPlanValidation,
      plan
    );
  }
  
  /**
   * Code Generation Validation Checkpoint
   * @param {Object} codeContext - Context for code generation
   * @return {Promise<Object>} - Validation result
   */
  async validateCodeGeneration(codeContext) {
    return this._applyCheckpoint(
      "codeGenerationValidation",
      codeGenerationValidation,
      codeContext
    );
  }
  
  /**
   * Completion Validation Checkpoint
   * @param {Object} sessionContext - Context from the current session
   * @return {Promise<Object>} - Validation result
   */
  async validateCompletion(sessionContext) {
    return this._applyCheckpoint(
      "completionValidation",
      completionValidation,
      sessionContext
    );
  }
  
  /**
   * Run mode-specific validation checkpoint
   * @param {string} checkpointName - Name of the mode-specific checkpoint
   * @param {Object} context - Context for the validation
   * @return {Promise<Object>} - Validation result
   */
  async validateModeSpecific(checkpointName, context) {
    const checkpoint = this.modeSpecificCheckpoints[checkpointName];
    
    if (!checkpoint) {
      return {
        valid: false,
        error: "Unknown checkpoint",
        message: `Checkpoint '${checkpointName}' is not available for mode '${this.modeType}'`
      };
    }
    
    return this._applyCheckpoint(
      `${this.modeType}_${checkpointName}`,
      checkpoint,
      context
    );
  }
  
  /**
   * Run all applicable validations for a given stage
   * @param {string} stage - Stage of operation (preResponse, decision, plan, code, completion)
   * @param {Object} context - Context for the validation
   * @return {Promise<Object>} - Combined validation result
   */
  async validateStage(stage, context) {
    const results = {};
    let allValid = true;
    
    switch (stage) {
      case 'preResponse':
        results.response = await this.validateResponse(context);
        allValid = results.response.valid;
        break;
        
      case 'decision':
        results.decision = await this.validateDecision(context);
        allValid = results.decision.valid;
        
        // Run applicable mode-specific checkpoints
        if (this.modeType === 'architect') {
          results.architectureConsistency = await this.validateModeSpecific('architectureConsistency', context);
          results.requirementTraceability = await this.validateModeSpecific('requirementTraceability', context);
          allValid = allValid && results.architectureConsistency.valid && results.requirementTraceability.valid;
        }
        break;
        
      case 'plan':
        results.plan = await this.validateImplementationPlan(context);
        allValid = results.plan.valid;
        break;
        
      case 'code':
        results.code = await this.validateCodeGeneration(context);
        allValid = results.code.valid;
        
        // Run applicable mode-specific checkpoints
        if (this.modeType === 'code') {
          results.patternApplication = await this.validateModeSpecific('patternApplication', context);
          results.testCoverage = await this.validateModeSpecific('testCoverage', context);
          allValid = allValid && results.patternApplication.valid && results.testCoverage.valid;
        }
        break;
        
      case 'completion':
        results.completion = await this.validateCompletion(context);
        allValid = results.completion.valid;
        break;
        
      default:
        return {
          valid: false,
          error: "Unknown stage",
          message: `Validation stage '${stage}' is not recognized`
        };
    }
    
    return {
      valid: allValid,
      stage,
      results
    };
  }
  
  // Mode-specific checkpoint implementations
  // These are placeholders that would be replaced with actual implementations
  
  async _architectureConsistencyCheckpoint(context) {
    // Placeholder implementation
    return { valid: true, message: "Architecture consistency check passed" };
  }
  
  async _requirementTraceabilityCheckpoint(context) {
    // Placeholder implementation
    return { valid: true, message: "Requirement traceability check passed" };
  }
  
  async _patternApplicationCheckpoint(context) {
    // Placeholder implementation
    return { valid: true, message: "Pattern application check passed" };
  }
  
  async _testCoverageCheckpoint(context) {
    // Placeholder implementation
    return { valid: true, message: "Test coverage check passed" };
  }
  
  async _knownIssuesCheckpoint(context) {
    // Placeholder implementation
    return { valid: true, message: "Known issues check passed" };
  }
  
  async _rootCauseAnalysisCheckpoint(context) {
    // Placeholder implementation
    return { valid: true, message: "Root cause analysis check passed" };
  }
  
  async _informationAccuracyCheckpoint(context) {
    // Placeholder implementation
    return { valid: true, message: "Information accuracy check passed" };
  }
  
  async _terminologyConsistencyCheckpoint(context) {
    // Placeholder implementation
    return { valid: true, message: "Terminology consistency check passed" };
  }
}

// Factory function for creating validation managers
function createValidationManager(options) {
  return new ConPortValidationManager(options);
}

module.exports = {
  ConPortValidationManager,
  createValidationManager
};