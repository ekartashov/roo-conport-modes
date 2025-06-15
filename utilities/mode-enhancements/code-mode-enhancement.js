/**
 * Code Mode Enhancement
 * 
 * This module integrates specialized validation checkpoints and knowledge-first
 * guidelines for the Code mode, providing a comprehensive knowledge-centric
 * approach to code implementation and documentation.
 */

const { CodeKnowledgeFirstGuidelines } = require('./code-knowledge-first');
const { 
  CodeQualityCheckpoint,
  DocumentationCompletenessCheckpoint, 
  ImplementationPatternCheckpoint 
} = require('./code-validation-checkpoints');

/**
 * Code Mode Enhancement
 * 
 * Provides specialized capabilities for the Code mode, integrating
 * knowledge management, validation, and ConPort integration.
 */
class CodeModeEnhancement {
  /**
   * Initialize the Code Mode Enhancement
   * @param {Object} options - Configuration options
   * @param {Object} conPortClient - ConPort client for knowledge management
   */
  constructor(options = {}, conPortClient) {
    this.options = {
      enableKnowledgeFirstGuidelines: true,
      enableValidationCheckpoints: true,
      enableMetrics: true,
      ...options
    };
    
    this.conPortClient = conPortClient;
    
    // Initialize knowledge-first guidelines if enabled
    if (this.options.enableKnowledgeFirstGuidelines) {
      this.knowledgeFirstGuidelines = new CodeKnowledgeFirstGuidelines(
        options.knowledgeFirstOptions || {},
        conPortClient
      );
    }
    
    // Initialize session-level metrics
    this.sessionMetrics = {
      codeSnippetsProcessed: 0,
      implementationDecisionsProcessed: 0,
      codePatternsProcessed: 0,
      validationsPerformed: 0,
      knowledgeQueriesPerformed: 0,
      startTime: Date.now()
    };
    
    // Store references to validation checkpoints
    this.validationCheckpoints = {
      codeQuality: CodeQualityCheckpoint,
      documentationCompleteness: DocumentationCompletenessCheckpoint,
      implementationPattern: ImplementationPatternCheckpoint
    };
  }
  
  /**
   * Process source code
   * @param {Object} sourceCode - The source code to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed source code with knowledge enhancement and validation
   */
  async processSourceCode(sourceCode, context = {}) {
    let processedCode = { ...sourceCode };
    const processingContext = { ...context, mode: 'code' };
    
    try {
      // 1. Apply knowledge-first guidelines if enabled
      if (this.options.enableKnowledgeFirstGuidelines && this.knowledgeFirstGuidelines) {
        processedCode = await this.knowledgeFirstGuidelines.processSourceCode(
          processedCode,
          processingContext
        );
      }
      
      // 2. Apply validation checkpoints if enabled
      if (this.options.enableValidationCheckpoints) {
        const validationContext = {
          session: this,
          conPortClient: this.conPortClient
        };
        
        // Validate code quality
        const qualityValidation = await this.validationCheckpoints.codeQuality.validate(
          processedCode,
          validationContext
        );
        
        // Validate documentation completeness
        const documentationValidation = await this.validationCheckpoints.documentationCompleteness.validate(
          processedCode,
          validationContext
        );
        
        // Validate implementation patterns
        const patternValidation = await this.validationCheckpoints.implementationPattern.validate(
          processedCode,
          validationContext
        );
        
        processedCode.validationResults = {
          codeQuality: qualityValidation,
          documentationCompleteness: documentationValidation,
          implementationPattern: patternValidation
        };
        
        this.sessionMetrics.validationsPerformed += 3;
      }
      
      // 3. Update session metrics
      this.sessionMetrics.codeSnippetsProcessed++;
      
      return processedCode;
    } catch (error) {
      console.error('Error processing source code:', error);
      return {
        ...sourceCode,
        processingError: error.message
      };
    }
  }
  
  /**
   * Process an implementation decision
   * @param {Object} decision - The implementation decision to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed decision with knowledge enhancement
   */
  async processImplementationDecision(decision, context = {}) {
    let processedDecision = { ...decision };
    const processingContext = { ...context, mode: 'code' };
    
    try {
      // 1. Apply knowledge-first guidelines if enabled
      if (this.options.enableKnowledgeFirstGuidelines && this.knowledgeFirstGuidelines) {
        processedDecision = await this.knowledgeFirstGuidelines.processImplementationDecision(
          processedDecision,
          processingContext
        );
      }
      
      // 2. Update session metrics
      this.sessionMetrics.implementationDecisionsProcessed++;
      
      return processedDecision;
    } catch (error) {
      console.error('Error processing implementation decision:', error);
      return {
        ...decision,
        processingError: error.message
      };
    }
  }
  
  /**
   * Process a code pattern
   * @param {Object} pattern - The code pattern to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed pattern with knowledge enhancement
   */
  async processCodePattern(pattern, context = {}) {
    let processedPattern = { ...pattern };
    const processingContext = { ...context, mode: 'code' };
    
    try {
      // 1. Apply knowledge-first guidelines if enabled
      if (this.options.enableKnowledgeFirstGuidelines && this.knowledgeFirstGuidelines) {
        processedPattern = await this.knowledgeFirstGuidelines.processCodePattern(
          processedPattern,
          processingContext
        );
      }
      
      // 2. Apply validation checkpoints if enabled
      if (this.options.enableValidationCheckpoints) {
        const validationContext = {
          session: this,
          conPortClient: this.conPortClient
        };
        
        // Validate implementation pattern
        const patternValidation = await this.validationCheckpoints.implementationPattern.validate(
          { 
            type: 'pattern_validation',
            pattern: processedPattern 
          },
          validationContext
        );
        
        processedPattern.validationResults = {
          implementationPattern: patternValidation
        };
        
        this.sessionMetrics.validationsPerformed++;
      }
      
      // 3. Update session metrics
      this.sessionMetrics.codePatternsProcessed++;
      
      return processedPattern;
    } catch (error) {
      console.error('Error processing code pattern:', error);
      return {
        ...pattern,
        processingError: error.message
      };
    }
  }
  
  /**
   * Process edge cases
   * @param {Object} edgeCases - The edge cases to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed edge cases with knowledge enhancement
   */
  async processEdgeCases(edgeCases, context = {}) {
    let processedEdgeCases = { ...edgeCases };
    const processingContext = { ...context, mode: 'code' };
    
    try {
      // Apply knowledge-first guidelines if enabled
      if (this.options.enableKnowledgeFirstGuidelines && this.knowledgeFirstGuidelines) {
        processedEdgeCases = await this.knowledgeFirstGuidelines.processEdgeCases(
          processedEdgeCases,
          processingContext
        );
      }
      
      return processedEdgeCases;
    } catch (error) {
      console.error('Error processing edge cases:', error);
      return {
        ...edgeCases,
        processingError: error.message
      };
    }
  }
  
  /**
   * Process performance considerations
   * @param {Object} considerations - The performance considerations to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed considerations with knowledge enhancement
   */
  async processPerformanceConsiderations(considerations, context = {}) {
    let processedConsiderations = { ...considerations };
    const processingContext = { ...context, mode: 'code' };
    
    try {
      // Apply knowledge-first guidelines if enabled
      if (this.options.enableKnowledgeFirstGuidelines && this.knowledgeFirstGuidelines) {
        processedConsiderations = await this.knowledgeFirstGuidelines.processPerformanceConsiderations(
          processedConsiderations,
          processingContext
        );
      }
      
      return processedConsiderations;
    } catch (error) {
      console.error('Error processing performance considerations:', error);
      return {
        ...considerations,
        processingError: error.message
      };
    }
  }
  
  /**
   * Process code examples
   * @param {Object} example - The code example to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed example with knowledge enhancement
   */
  async processCodeExample(example, context = {}) {
    let processedExample = { ...example };
    const processingContext = { ...context, mode: 'code' };
    
    try {
      // Apply knowledge-first guidelines if enabled
      if (this.options.enableKnowledgeFirstGuidelines && this.knowledgeFirstGuidelines) {
        processedExample = await this.knowledgeFirstGuidelines.processCodeExample(
          processedExample,
          processingContext
        );
      }
      
      return processedExample;
    } catch (error) {
      console.error('Error processing code example:', error);
      return {
        ...example,
        processingError: error.message
      };
    }
  }
  
  /**
   * Search for related code knowledge in ConPort
   * @param {Object} query - The search query parameters
   * @returns {Object} Search results
   */
  async searchCodeKnowledge(query) {
    try {
      if (!this.knowledgeFirstGuidelines) {
        return { error: 'Knowledge-first guidelines not initialized' };
      }
      
      const results = await this.knowledgeFirstGuidelines.searchCodeKnowledge(query);
      
      // Update session metrics
      this.sessionMetrics.knowledgeQueriesPerformed++;
      
      return results;
    } catch (error) {
      console.error('Error searching code knowledge:', error);
      return { error: error.message };
    }
  }
  
  /**
   * Get combined metrics for the Code mode
   * @returns {Object} Combined metrics for knowledge management and validation
   */
  getMetrics() {
    const sessionDuration = Date.now() - this.sessionMetrics.startTime;
    
    const metrics = {
      session: {
        ...this.sessionMetrics,
        durationMs: sessionDuration
      }
    };
    
    // Add knowledge-first metrics if available
    if (this.knowledgeFirstGuidelines) {
      metrics.knowledge = this.knowledgeFirstGuidelines.getCodeKnowledgeMetrics();
    }
    
    return metrics;
  }
  
  /**
   * Log session metrics to ConPort
   * @returns {Promise} Promise resolving to the logging result
   */
  async logMetricsToConPort() {
    if (!this.conPortClient) {
      return { error: 'ConPort client not available' };
    }
    
    try {
      const metrics = this.getMetrics();
      
      await this.conPortClient.log_custom_data({
        workspace_id: this.conPortClient.workspace_id,
        category: 'code_mode_metrics',
        key: `session_${Date.now()}`,
        value: metrics
      });
      
      return { success: true, metrics };
    } catch (error) {
      console.error('Error logging metrics to ConPort:', error);
      return { error: error.message };
    }
  }
  
  /**
   * Apply the Knowledge-First approach to a response
   * @param {Object} response - The initial response
   * @returns {Object} Enhanced response with knowledge-first principles applied
   */
  applyKnowledgeFirstToResponse(response) {
    // Start with the original response
    let enhancedResponse = { ...response };
    
    // 1. Add knowledge source information if available
    if (response.knowledgeSourceClassification) {
      enhancedResponse.knowledgeSource = {
        classification: response.knowledgeSourceClassification,
        reliability: this.assessReliability(response.knowledgeSourceClassification)
      };
    }
    
    // 2. Add validation results if available
    if (response.validationResults) {
      enhancedResponse.validation = {
        summary: this.summarizeValidation(response.validationResults),
        details: response.validationResults
      };
    }
    
    // 3. Add extracted knowledge if available
    if (response.extractedKnowledge) {
      enhancedResponse.knowledge = {
        summary: this.summarizeExtractedKnowledge(response.extractedKnowledge),
        details: response.extractedKnowledge
      };
    }
    
    // 4. Add knowledge improvement suggestions
    enhancedResponse.knowledgeImprovements = this.generateKnowledgeImprovements(response);
    
    // 5. Add ConPort integration hints
    enhancedResponse.conPortIntegration = this.generateConPortIntegrationHints(response);
    
    return enhancedResponse;
  }
  
  /**
   * Assess the reliability of knowledge based on its source classification
   * @param {Object} classification - The knowledge source classification
   * @returns {Object} Reliability assessment
   */
  assessReliability(classification) {
    if (!classification) {
      return { score: 0.5, level: 'unknown', confidence: 0 };
    }
    
    // In a real implementation, this would apply heuristics based on the source,
    // confidence, and other factors to assess reliability
    
    const sourceFactor = classification.isRetrieved ? 0.8 : 0.6;
    const confidenceFactor = classification.confidence || 0.5;
    
    const reliabilityScore = sourceFactor * confidenceFactor;
    
    let reliabilityLevel = 'medium';
    if (reliabilityScore > 0.7) reliabilityLevel = 'high';
    if (reliabilityScore < 0.4) reliabilityLevel = 'low';
    
    return {
      score: reliabilityScore,
      level: reliabilityLevel,
      confidence: classification.confidence || 0.5,
      isRetrieved: classification.isRetrieved
    };
  }
  
  /**
   * Summarize validation results
   * @param {Object} validationResults - The validation results
   * @returns {Object} Validation summary
   */
  summarizeValidation(validationResults) {
    if (!validationResults) {
      return { valid: false, message: 'No validation performed' };
    }
    
    // Check if all validations passed
    const allValid = Object.values(validationResults)
      .every(result => result && result.valid);
    
    // Count total issues
    const issueCount = Object.values(validationResults)
      .reduce((count, result) => {
        if (!result) return count;
        
        if (result.issues) count += result.issues.length;
        
        return count;
      }, 0);
    
    return {
      valid: allValid,
      issueCount,
      checkpointsRun: Object.keys(validationResults).length
    };
  }
  
  /**
   * Summarize extracted knowledge
   * @param {Object} extractedKnowledge - The extracted knowledge
   * @returns {Object} Knowledge summary
   */
  summarizeExtractedKnowledge(extractedKnowledge) {
    if (!extractedKnowledge) {
      return { found: false, message: 'No knowledge extracted' };
    }
    
    // Count total extracted knowledge items
    const decisionCount = extractedKnowledge.implementationDecisions?.length || 0;
    const patternCount = extractedKnowledge.codePatterns?.length || 0;
    const edgeCaseCount = extractedKnowledge.edgeCases?.length || 0;
    const performanceCount = extractedKnowledge.performanceConsiderations?.length || 0;
    
    const totalCount = decisionCount + patternCount + edgeCaseCount + performanceCount;
    
    return {
      found: totalCount > 0,
      totalCount,
      breakdown: {
        implementationDecisions: decisionCount,
        codePatterns: patternCount,
        edgeCases: edgeCaseCount,
        performanceConsiderations: performanceCount
      }
    };
  }
  
  /**
   * Generate knowledge improvement suggestions
   * @param {Object} response - The response to generate improvements for
   * @returns {Array} Knowledge improvement suggestions
   */
  generateKnowledgeImprovements(response) {
    const improvements = [];
    
    // Check for missing documentation
    if (response.suggestedImprovements) {
      improvements.push(...response.suggestedImprovements);
    }
    
    // Check for validation issues
    if (response.validationResults) {
      // Add documentation improvements
      if (response.validationResults.documentationCompleteness && 
          !response.validationResults.documentationCompleteness.valid) {
        improvements.push({
          type: 'improve_documentation',
          description: 'Improve code documentation',
          details: response.validationResults.documentationCompleteness.issues
        });
      }
      
      // Add code quality improvements
      if (response.validationResults.codeQuality && 
          !response.validationResults.codeQuality.valid) {
        improvements.push({
          type: 'improve_code_quality',
          description: 'Address code quality issues',
          details: response.validationResults.codeQuality.issues
        });
      }
      
      // Add pattern implementation improvements
      if (response.validationResults.implementationPattern && 
          !response.validationResults.implementationPattern.valid) {
        improvements.push({
          type: 'improve_pattern_implementation',
          description: 'Improve pattern implementation',
          details: response.validationResults.implementationPattern.patternAnalysis?.deviations
        });
      }
    }
    
    // Check for extracted knowledge that should be documented
    if (response.extractedKnowledge) {
      // Suggest documenting implementation decisions
      if (response.extractedKnowledge.implementationDecisions?.length > 0) {
        improvements.push({
          type: 'document_decisions',
          description: 'Document implementation decisions',
          decisions: response.extractedKnowledge.implementationDecisions
        });
      }
      
      // Suggest documenting code patterns
      if (response.extractedKnowledge.codePatterns?.length > 0) {
        improvements.push({
          type: 'document_patterns',
          description: 'Document code patterns',
          patterns: response.extractedKnowledge.codePatterns
        });
      }
      
      // Suggest documenting edge cases
      if (response.extractedKnowledge.edgeCases?.length > 0) {
        improvements.push({
          type: 'document_edge_cases',
          description: 'Document edge cases',
          edgeCases: response.extractedKnowledge.edgeCases
        });
      }
      
      // Suggest documenting performance considerations
      if (response.extractedKnowledge.performanceConsiderations?.length > 0) {
        improvements.push({
          type: 'document_performance',
          description: 'Document performance considerations',
          considerations: response.extractedKnowledge.performanceConsiderations
        });
      }
    }
    
    return improvements;
  }
  
  /**
   * Generate ConPort integration hints
   * @param {Object} response - The response to generate hints for
   * @returns {Object} ConPort integration hints
   */
  generateConPortIntegrationHints(response) {
    const hints = {
      shouldLog: false,
      logType: null,
      suggestedTags: []
    };
    
    // Determine if and how this should be logged to ConPort
    if (response.type === 'implementation_decision') {
      hints.shouldLog = true;
      hints.logType = 'decision';
      hints.suggestedTags = ['code', 'implementation_decision'];
      
      if (response.domain) {
        hints.suggestedTags.push(response.domain);
      }
    } else if (response.type === 'code_pattern') {
      hints.shouldLog = true;
      hints.logType = 'system_pattern';
      hints.suggestedTags = ['code', 'implementation_pattern'];
      
      if (response.patternType) {
        hints.suggestedTags.push(response.patternType);
      }
    } else if (response.type === 'edge_case') {
      hints.shouldLog = true;
      hints.logType = 'custom_data';
      hints.category = 'edge_cases';
      hints.suggestedTags = ['code', 'edge_case'];
    } else if (response.type === 'performance_consideration') {
      hints.shouldLog = true;
      hints.logType = 'custom_data';
      hints.category = 'performance_considerations';
      hints.suggestedTags = ['code', 'performance'];
    } else if (response.type === 'code_example') {
      hints.shouldLog = true;
      hints.logType = 'custom_data';
      hints.category = 'code_examples';
      hints.suggestedTags = ['code', 'example'];
    }
    
    return hints;
  }
}

module.exports = {
  CodeModeEnhancement
};