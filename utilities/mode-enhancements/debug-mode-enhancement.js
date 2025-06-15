/**
 * Debug Mode Enhancement
 * 
 * Integrates Debug Validation Checkpoints and Debug Knowledge-First Guidelines
 * to create a comprehensive enhancement for Debug Mode.
 */

const { 
  ErrorPatternCheckpoint,
  DiagnosticApproachCheckpoint,
  RootCauseAnalysisCheckpoint,
  SolutionVerificationCheckpoint
} = require('./debug-validation-checkpoints');

const { DebugKnowledgeFirstGuidelines } = require('./debug-knowledge-first');

/**
 * Debug Mode Enhancement
 * 
 * Enhances Debug Mode with specialized validation checkpoints
 * and knowledge-first guidelines for debugging tasks.
 */
class DebugModeEnhancement {
  /**
   * Create a new Debug Mode Enhancement
   * @param {Object} options - Configuration options
   * @param {Object} conPortClient - ConPort client for knowledge management
   */
  constructor(options = {}, conPortClient = null) {
    this.options = {
      enableKnowledgeFirstGuidelines: true,
      enableValidationCheckpoints: true,
      enableMetrics: true,
      
      // Knowledge-first options
      knowledgeFirstOptions: {
        logToConPort: true,
        enhanceResponses: true,
        autoClassify: true,
        promptForMissingInfo: true
      },
      
      // Validation options
      validationOptions: {
        errorPatternThreshold: 0.75,
        diagnosticApproachThreshold: 0.7,
        rootCauseThreshold: 0.8,
        solutionVerificationThreshold: 0.75,
        enforceAllCheckpoints: false
      },
      
      ...options
    };
    
    this.conPortClient = conPortClient;
    
    // Initialize validation checkpoints if enabled
    if (this.options.enableValidationCheckpoints) {
      this.initializeValidationCheckpoints();
    }
    
    // Initialize knowledge-first guidelines if enabled
    if (this.options.enableKnowledgeFirstGuidelines) {
      this.initializeKnowledgeFirstGuidelines();
    }
    
    // Initialize metrics collection if enabled
    if (this.options.enableMetrics) {
      this.metrics = {
        session: {
          errorPatternsProcessed: 0,
          diagnosticApproachesProcessed: 0,
          rootCauseAnalysesProcessed: 0,
          solutionVerificationsProcessed: 0,
          validationSuccesses: 0,
          validationFailures: 0
        },
        knowledge: {
          errorPatternsLogged: 0,
          diagnosticApproachesLogged: 0,
          rootCauseAnalysesLogged: 0,
          solutionVerificationsLogged: 0,
          debuggingPatternsLogged: 0,
          knowledgeItemsRetrieved: 0
        }
      };
    }
  }
  
  /**
   * Initialize validation checkpoints
   * @private
   */
  initializeValidationCheckpoints() {
    const { validationOptions } = this.options;
    
    this.validationCheckpoints = {
      errorPattern: new ErrorPatternCheckpoint({
        threshold: validationOptions.errorPatternThreshold
      }),
      
      diagnosticApproach: new DiagnosticApproachCheckpoint({
        threshold: validationOptions.diagnosticApproachThreshold
      }),
      
      rootCauseAnalysis: new RootCauseAnalysisCheckpoint({
        threshold: validationOptions.rootCauseThreshold
      }),
      
      solutionVerification: new SolutionVerificationCheckpoint({
        threshold: validationOptions.solutionVerificationThreshold
      })
    };
  }
  
  /**
   * Initialize knowledge-first guidelines
   * @private
   */
  initializeKnowledgeFirstGuidelines() {
    this.knowledgeFirstGuidelines = new DebugKnowledgeFirstGuidelines(
      this.options.knowledgeFirstOptions
    );
  }
  
  /**
   * Process an error pattern
   * @param {Object} errorPattern - Error pattern to process
   * @param {Object} options - Processing options
   * @returns {Promise<Object>} - Processing results
   */
  async processErrorPattern(errorPattern, options = {}) {
    const result = {
      validationResults: {},
      extractedKnowledge: {},
      knowledgeSourceClassification: null,
      suggestedImprovements: []
    };
    
    // Track metrics
    if (this.options.enableMetrics) {
      this.metrics.session.errorPatternsProcessed++;
    }
    
    // Validate the error pattern
    if (this.options.enableValidationCheckpoints) {
      const validationResult = this.validationCheckpoints.errorPattern.validate(
        errorPattern,
        options
      );
      
      result.validationResults.errorPattern = validationResult;
      
      // Track validation metrics
      if (this.options.enableMetrics) {
        if (validationResult.valid) {
          this.metrics.session.validationSuccesses++;
        } else {
          this.metrics.session.validationFailures++;
        }
      }
      
      // Add suggested improvements from validation
      if (validationResult.suggestedImprovements) {
        result.suggestedImprovements.push(
          ...validationResult.suggestedImprovements
        );
      }
    }
    
    // Extract knowledge from the error pattern
    if (this.options.enableKnowledgeFirstGuidelines) {
      result.extractedKnowledge = this.knowledgeFirstGuidelines.extractKnowledge(
        { ...errorPattern, type: 'error_report' },
        options
      );
      
      // Classify knowledge source
      result.knowledgeSourceClassification = this.knowledgeFirstGuidelines.classifyKnowledgeSource(
        errorPattern,
        options
      );
      
      // Enrich knowledge and add recommendations
      if (result.extractedKnowledge.errorPattern && result.extractedKnowledge.errorPattern.length > 0) {
        const enriched = this.knowledgeFirstGuidelines.enrichKnowledge(
          result.extractedKnowledge.errorPattern[0],
          'errorPattern'
        );
        
        if (enriched.recommendations) {
          result.suggestedImprovements.push(
            ...enriched.recommendations.map(rec => ({
              type: 'knowledge',
              description: rec.description
            }))
          );
        }
      }
      
      // Log to ConPort if enabled
      if (this.options.knowledgeFirstOptions.logToConPort && 
          this.conPortClient &&
          result.validationResults.errorPattern?.valid) {
        await this._logErrorPatternToConPort(
          errorPattern,
          result.extractedKnowledge,
          options
        );
      }
    }
    
    return result;
  }
  
  /**
   * Process a diagnostic approach
   * @param {Object} diagnosticApproach - Diagnostic approach to process
   * @param {Object} options - Processing options
   * @returns {Promise<Object>} - Processing results
   */
  async processDiagnosticApproach(diagnosticApproach, options = {}) {
    const result = {
      validationResults: {},
      extractedKnowledge: {},
      knowledgeSourceClassification: null,
      suggestedImprovements: []
    };
    
    // Track metrics
    if (this.options.enableMetrics) {
      this.metrics.session.diagnosticApproachesProcessed++;
    }
    
    // Validate the diagnostic approach
    if (this.options.enableValidationCheckpoints) {
      const validationResult = this.validationCheckpoints.diagnosticApproach.validate(
        diagnosticApproach,
        options
      );
      
      result.validationResults.diagnosticApproach = validationResult;
      
      // Track validation metrics
      if (this.options.enableMetrics) {
        if (validationResult.valid) {
          this.metrics.session.validationSuccesses++;
        } else {
          this.metrics.session.validationFailures++;
        }
      }
      
      // Add suggested improvements from validation
      if (validationResult.suggestedImprovements) {
        result.suggestedImprovements.push(
          ...validationResult.suggestedImprovements
        );
      }
    }
    
    // Extract knowledge from the diagnostic approach
    if (this.options.enableKnowledgeFirstGuidelines) {
      result.extractedKnowledge = this.knowledgeFirstGuidelines.extractKnowledge(
        { ...diagnosticApproach, type: 'diagnostic_session' },
        options
      );
      
      // Classify knowledge source
      result.knowledgeSourceClassification = this.knowledgeFirstGuidelines.classifyKnowledgeSource(
        diagnosticApproach,
        options
      );
      
      // Enrich knowledge and add recommendations
      if (result.extractedKnowledge.diagnosticApproach && result.extractedKnowledge.diagnosticApproach.length > 0) {
        const enriched = this.knowledgeFirstGuidelines.enrichKnowledge(
          result.extractedKnowledge.diagnosticApproach[0],
          'diagnosticApproach'
        );
        
        if (enriched.recommendations) {
          result.suggestedImprovements.push(
            ...enriched.recommendations.map(rec => ({
              type: 'knowledge',
              description: rec.description
            }))
          );
        }
      }
      
      // Log to ConPort if enabled
      if (this.options.knowledgeFirstOptions.logToConPort && 
          this.conPortClient &&
          result.validationResults.diagnosticApproach?.valid) {
        await this._logDiagnosticApproachToConPort(
          diagnosticApproach,
          result.extractedKnowledge,
          options
        );
      }
    }
    
    return result;
  }
  
  /**
   * Process a root cause analysis
   * @param {Object} rootCauseAnalysis - Root cause analysis to process
   * @param {Object} options - Processing options
   * @returns {Promise<Object>} - Processing results
   */
  async processRootCauseAnalysis(rootCauseAnalysis, options = {}) {
    const result = {
      validationResults: {},
      extractedKnowledge: {},
      knowledgeSourceClassification: null,
      suggestedImprovements: []
    };
    
    // Track metrics
    if (this.options.enableMetrics) {
      this.metrics.session.rootCauseAnalysesProcessed++;
    }
    
    // Validate the root cause analysis
    if (this.options.enableValidationCheckpoints) {
      const validationResult = this.validationCheckpoints.rootCauseAnalysis.validate(
        rootCauseAnalysis,
        options
      );
      
      result.validationResults.rootCauseAnalysis = validationResult;
      
      // Track validation metrics
      if (this.options.enableMetrics) {
        if (validationResult.valid) {
          this.metrics.session.validationSuccesses++;
        } else {
          this.metrics.session.validationFailures++;
        }
      }
      
      // Add suggested improvements from validation
      if (validationResult.suggestedImprovements) {
        result.suggestedImprovements.push(
          ...validationResult.suggestedImprovements
        );
      }
    }
    
    // Extract knowledge from the root cause analysis
    if (this.options.enableKnowledgeFirstGuidelines) {
      result.extractedKnowledge = this.knowledgeFirstGuidelines.extractKnowledge(
        { ...rootCauseAnalysis, type: 'diagnostic_session' },
        options
      );
      
      // Classify knowledge source
      result.knowledgeSourceClassification = this.knowledgeFirstGuidelines.classifyKnowledgeSource(
        rootCauseAnalysis,
        options
      );
      
      // Enrich knowledge and add recommendations
      if (result.extractedKnowledge.rootCauseAnalysis && result.extractedKnowledge.rootCauseAnalysis.length > 0) {
        const enriched = this.knowledgeFirstGuidelines.enrichKnowledge(
          result.extractedKnowledge.rootCauseAnalysis[0],
          'rootCauseAnalysis'
        );
        
        if (enriched.recommendations) {
          result.suggestedImprovements.push(
            ...enriched.recommendations.map(rec => ({
              type: 'knowledge',
              description: rec.description
            }))
          );
        }
      }
      
      // Log to ConPort if enabled
      if (this.options.knowledgeFirstOptions.logToConPort && 
          this.conPortClient &&
          result.validationResults.rootCauseAnalysis?.valid) {
        await this._logRootCauseAnalysisToConPort(
          rootCauseAnalysis,
          result.extractedKnowledge,
          options
        );
      }
    }
    
    return result;
  }
  
  /**
   * Process a solution verification
   * @param {Object} solutionVerification - Solution verification to process
   * @param {Object} options - Processing options
   * @returns {Promise<Object>} - Processing results
   */
  async processSolutionVerification(solutionVerification, options = {}) {
    const result = {
      validationResults: {},
      extractedKnowledge: {},
      knowledgeSourceClassification: null,
      suggestedImprovements: []
    };
    
    // Track metrics
    if (this.options.enableMetrics) {
      this.metrics.session.solutionVerificationsProcessed++;
    }
    
    // Validate the solution verification
    if (this.options.enableValidationCheckpoints) {
      const validationResult = this.validationCheckpoints.solutionVerification.validate(
        solutionVerification,
        options
      );
      
      result.validationResults.solutionVerification = validationResult;
      
      // Track validation metrics
      if (this.options.enableMetrics) {
        if (validationResult.valid) {
          this.metrics.session.validationSuccesses++;
        } else {
          this.metrics.session.validationFailures++;
        }
      }
      
      // Add suggested improvements from validation
      if (validationResult.suggestedImprovements) {
        result.suggestedImprovements.push(
          ...validationResult.suggestedImprovements
        );
      }
    }
    
    // Extract knowledge from the solution verification
    if (this.options.enableKnowledgeFirstGuidelines) {
      result.extractedKnowledge = this.knowledgeFirstGuidelines.extractKnowledge(
        { ...solutionVerification, type: 'solution_implementation' },
        options
      );
      
      // Classify knowledge source
      result.knowledgeSourceClassification = this.knowledgeFirstGuidelines.classifyKnowledgeSource(
        solutionVerification,
        options
      );
      
      // Enrich knowledge and add recommendations
      if (result.extractedKnowledge.solutionVerification && result.extractedKnowledge.solutionVerification.length > 0) {
        const enriched = this.knowledgeFirstGuidelines.enrichKnowledge(
          result.extractedKnowledge.solutionVerification[0],
          'solutionVerification'
        );
        
        if (enriched.recommendations) {
          result.suggestedImprovements.push(
            ...enriched.recommendations.map(rec => ({
              type: 'knowledge',
              description: rec.description
            }))
          );
        }
      }
      
      // Log to ConPort if enabled
      if (this.options.knowledgeFirstOptions.logToConPort && 
          this.conPortClient &&
          result.validationResults.solutionVerification?.valid) {
        await this._logSolutionVerificationToConPort(
          solutionVerification,
          result.extractedKnowledge,
          options
        );
      }
    }
    
    return result;
  }
  
  /**
   * Process a debugging session
   * @param {Object} debuggingSession - Debugging session data
   * @param {Object} options - Processing options
   * @returns {Promise<Object>} - Processing results
   */
  async processDebuggingSession(debuggingSession, options = {}) {
    const result = {
      validationResults: {},
      extractedKnowledge: {},
      knowledgeSourceClassification: null,
      suggestedImprovements: []
    };
    
    // Process different aspects of the debugging session
    if (debuggingSession.errorPattern) {
      const errorPatternResult = await this.processErrorPattern(
        debuggingSession.errorPattern,
        { ...options, context: 'debugging_session' }
      );
      
      result.validationResults.errorPattern = errorPatternResult.validationResults.errorPattern;
      
      if (errorPatternResult.extractedKnowledge.errorPattern) {
        if (!result.extractedKnowledge.errorPattern) {
          result.extractedKnowledge.errorPattern = [];
        }
        result.extractedKnowledge.errorPattern.push(...errorPatternResult.extractedKnowledge.errorPattern);
      }
      
      result.suggestedImprovements.push(...errorPatternResult.suggestedImprovements);
    }
    
    if (debuggingSession.diagnosticApproach) {
      const diagnosticResult = await this.processDiagnosticApproach(
        debuggingSession.diagnosticApproach,
        { ...options, context: 'debugging_session' }
      );
      
      result.validationResults.diagnosticApproach = diagnosticResult.validationResults.diagnosticApproach;
      
      if (diagnosticResult.extractedKnowledge.diagnosticApproach) {
        if (!result.extractedKnowledge.diagnosticApproach) {
          result.extractedKnowledge.diagnosticApproach = [];
        }
        result.extractedKnowledge.diagnosticApproach.push(...diagnosticResult.extractedKnowledge.diagnosticApproach);
      }
      
      result.suggestedImprovements.push(...diagnosticResult.suggestedImprovements);
    }
    
    if (debuggingSession.rootCause) {
      const rootCauseResult = await this.processRootCauseAnalysis(
        debuggingSession.rootCause,
        { ...options, context: 'debugging_session' }
      );
      
      result.validationResults.rootCauseAnalysis = rootCauseResult.validationResults.rootCauseAnalysis;
      
      if (rootCauseResult.extractedKnowledge.rootCauseAnalysis) {
        if (!result.extractedKnowledge.rootCauseAnalysis) {
          result.extractedKnowledge.rootCauseAnalysis = [];
        }
        result.extractedKnowledge.rootCauseAnalysis.push(...rootCauseResult.extractedKnowledge.rootCauseAnalysis);
      }
      
      result.suggestedImprovements.push(...rootCauseResult.suggestedImprovements);
    }
    
    if (debuggingSession.solution) {
      const solutionResult = await this.processSolutionVerification(
        debuggingSession.solution,
        { ...options, context: 'debugging_session' }
      );
      
      result.validationResults.solutionVerification = solutionResult.validationResults.solutionVerification;
      
      if (solutionResult.extractedKnowledge.solutionVerification) {
        if (!result.extractedKnowledge.solutionVerification) {
          result.extractedKnowledge.solutionVerification = [];
        }
        result.extractedKnowledge.solutionVerification.push(...solutionResult.extractedKnowledge.solutionVerification);
      }
      
      result.suggestedImprovements.push(...solutionResult.suggestedImprovements);
    }
    
    // Extract debugging patterns if present
    if (this.options.enableKnowledgeFirstGuidelines) {
      const patterns = this.knowledgeFirstGuidelines.extractKnowledge(
        { ...debuggingSession, type: 'diagnostic_session' },
        options
      );
      
      if (patterns.debuggingPattern) {
        if (!result.extractedKnowledge.debuggingPattern) {
          result.extractedKnowledge.debuggingPattern = [];
        }
        result.extractedKnowledge.debuggingPattern.push(...patterns.debuggingPattern);
      }
    }
    
    return result;
  }
  
  /**
   * Apply knowledge-first principles to a response
   * @param {Object} response - Original response
   * @returns {Object} - Enhanced response with knowledge-first principles applied
   */
  applyKnowledgeFirstToResponse(response) {
    if (!this.options.enableKnowledgeFirstGuidelines) {
      return response;
    }
    
    return this.knowledgeFirstGuidelines.applyKnowledgeFirstToResponse(response);
  }
  
  /**
   * Search for debug-related knowledge in ConPort
   * @param {Object} params - Search parameters
   * @returns {Promise<Object>} - Search results
   */
  async searchDebugKnowledge(params) {
    if (!this.options.enableKnowledgeFirstGuidelines || !this.conPortClient) {
      return { items: [], error: 'Knowledge-first guidelines or ConPort client not available' };
    }
    
    try {
      const results = await this.knowledgeFirstGuidelines.searchDebugKnowledge(
        params,
        this.conPortClient
      );
      
      // Track metrics
      if (this.options.enableMetrics && results.items) {
        this.metrics.knowledge.knowledgeItemsRetrieved += results.items.length;
      }
      
      return results;
    } catch (error) {
      console.error('Error searching debug knowledge:', error);
      return { items: [], error: error.message };
    }
  }
  
  /**
   * Get collected metrics
   * @returns {Object} - Collected metrics
   */
  getMetrics() {
    if (!this.options.enableMetrics) {
      return { error: 'Metrics collection is disabled' };
    }
    
    return { ...this.metrics };
  }
  
  /**
   * Log metrics to ConPort
   * @returns {Promise<Object>} - Result of logging operation
   */
  async logMetricsToConPort() {
    if (!this.options.enableMetrics || !this.conPortClient) {
      return { 
        success: false, 
        error: 'Metrics collection is disabled or ConPort client not available' 
      };
    }
    
    try {
      await this.conPortClient.log_custom_data({
        workspace_id: this.conPortClient.workspace_id,
        category: 'debug_mode_metrics',
        key: `metrics_${new Date().toISOString()}`,
        value: this.metrics
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error logging metrics to ConPort:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Log an error pattern to ConPort
   * @param {Object} errorPattern - Error pattern to log
   * @param {Object} extractedKnowledge - Extracted knowledge
   * @param {Object} options - Logging options
   * @returns {Promise<Object>} - Result of logging operation
   * @private
   */
  async _logErrorPatternToConPort(errorPattern, extractedKnowledge, options = {}) {
    if (!this.conPortClient) {
      return { success: false, error: 'ConPort client not available' };
    }
    
    try {
      // Determine if this should be logged as a system pattern
      const pattern = extractedKnowledge.errorPattern?.[0] || errorPattern;
      
      const result = await this.conPortClient.log_system_pattern({
        workspace_id: this.conPortClient.workspace_id,
        name: `Error Pattern: ${pattern.errorType || 'Unknown'}`,
        description: `${pattern.errorMessage || 'Unknown error'}\n\nReproduction Steps: ${pattern.reproduceSteps || 'Not specified'}\n\nContext: ${pattern.context || 'Not specified'}`,
        tags: ['error-pattern', 'debugging', ...(pattern.tags || [])]
      });
      
      // Track metrics
      if (this.options.enableMetrics) {
        this.metrics.knowledge.errorPatternsLogged++;
      }
      
      return { success: true, result };
    } catch (error) {
      console.error('Error logging error pattern to ConPort:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Log a diagnostic approach to ConPort
   * @param {Object} diagnosticApproach - Diagnostic approach to log
   * @param {Object} extractedKnowledge - Extracted knowledge
   * @param {Object} options - Logging options
   * @returns {Promise<Object>} - Result of logging operation
   * @private
   */
  async _logDiagnosticApproachToConPort(diagnosticApproach, extractedKnowledge, options = {}) {
    if (!this.conPortClient) {
      return { success: false, error: 'ConPort client not available' };
    }
    
    try {
      // Get the diagnostic approach from extracted knowledge or original object
      const approach = extractedKnowledge.diagnosticApproach?.[0] || diagnosticApproach;
      
      const result = await this.conPortClient.log_custom_data({
        workspace_id: this.conPortClient.workspace_id,
        category: 'diagnostic_approaches',
        key: approach.name || `diagnostic_approach_${new Date().toISOString()}`,
        value: approach
      });
      
      // Track metrics
      if (this.options.enableMetrics) {
        this.metrics.knowledge.diagnosticApproachesLogged++;
      }
      
      return { success: true, result };
    } catch (error) {
      console.error('Error logging diagnostic approach to ConPort:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Log a root cause analysis to ConPort
   * @param {Object} rootCauseAnalysis - Root cause analysis to log
   * @param {Object} extractedKnowledge - Extracted knowledge
   * @param {Object} options - Logging options
   * @returns {Promise<Object>} - Result of logging operation
   * @private
   */
  async _logRootCauseAnalysisToConPort(rootCauseAnalysis, extractedKnowledge, options = {}) {
    if (!this.conPortClient) {
      return { success: false, error: 'ConPort client not available' };
    }
    
    try {
      // Get the root cause from extracted knowledge or original object
      const rootCause = extractedKnowledge.rootCauseAnalysis?.[0] || rootCauseAnalysis;
      
      const result = await this.conPortClient.log_decision({
        workspace_id: this.conPortClient.workspace_id,
        summary: `Root Cause Analysis: ${rootCause.issue || 'Unknown issue'}`,
        rationale: rootCause.identifiedCause || 'Unknown cause',
        implementation_details: `Evidence: ${Array.isArray(rootCause.evidenceSupporting) ? rootCause.evidenceSupporting.join(', ') : rootCause.evidenceSupporting || 'Not provided'}\n\nImpact Scope: ${rootCause.impactScope || 'Unknown'}\n\nCausal Chain: ${Array.isArray(rootCause.causalChain) ? rootCause.causalChain.join(' → ') : rootCause.causalChain || 'Not provided'}`,
        tags: ['root-cause-analysis', 'debugging', ...(rootCause.tags || [])]
      });
      
      // Track metrics
      if (this.options.enableMetrics) {
        this.metrics.knowledge.rootCauseAnalysesLogged++;
      }
      
      return { success: true, result };
    } catch (error) {
      console.error('Error logging root cause analysis to ConPort:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Log a solution verification to ConPort
   * @param {Object} solutionVerification - Solution verification to log
   * @param {Object} extractedKnowledge - Extracted knowledge
   * @param {Object} options - Logging options
   * @returns {Promise<Object>} - Result of logging operation
   * @private
   */
  async _logSolutionVerificationToConPort(solutionVerification, extractedKnowledge, options = {}) {
    if (!this.conPortClient) {
      return { success: false, error: 'ConPort client not available' };
    }
    
    try {
      // Get the solution verification from extracted knowledge or original object
      const solution = extractedKnowledge.solutionVerification?.[0] || solutionVerification;
      
      const result = await this.conPortClient.log_custom_data({
        workspace_id: this.conPortClient.workspace_id,
        category: 'solution_verifications',
        key: `solution_${solution.issue || new Date().toISOString()}`,
        value: solution
      });
      
      // Track metrics
      if (this.options.enableMetrics) {
        this.metrics.knowledge.solutionVerificationsLogged++;
      }
      
      return { success: true, result };
    } catch (error) {
      console.error('Error logging solution verification to ConPort:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Log a debugging pattern to ConPort
   * @param {Object} debuggingPattern - Debugging pattern to log
   * @param {Object} options - Logging options
   * @returns {Promise<Object>} - Result of logging operation
   */
  async logDebuggingPatternToConPort(debuggingPattern, options = {}) {
    if (!this.conPortClient) {
      return { success: false, error: 'ConPort client not available' };
    }
    
    try {
      const result = await this.conPortClient.log_system_pattern({
        workspace_id: this.conPortClient.workspace_id,
        name: debuggingPattern.name || 'Debugging Pattern',
        description: `Applicable Issues: ${Array.isArray(debuggingPattern.applicableIssues) ? debuggingPattern.applicableIssues.join(', ') : debuggingPattern.applicableIssues || 'Not specified'}\n\nTechnique: ${debuggingPattern.technique || 'Not specified'}\n\nEffective Use Cases: ${Array.isArray(debuggingPattern.effectiveUseCases) ? debuggingPattern.effectiveUseCases.join(', ') : debuggingPattern.effectiveUseCases || 'Not specified'}`,
        tags: ['debugging-pattern', ...(debuggingPattern.tags || [])]
      });
      
      // Track metrics
      if (this.options.enableMetrics) {
        this.metrics.knowledge.debuggingPatternsLogged++;
      }
      
      return { success: true, result };
    } catch (error) {
      console.error('Error logging debugging pattern to ConPort:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = {
  DebugModeEnhancement
};