/**
 * Architect Mode Enhancement
 * 
 * This module integrates specialized validation checkpoints and knowledge-first
 * guidelines for the Architect mode, providing a comprehensive knowledge-centric
 * approach to architectural design and documentation.
 */

const { ArchitectKnowledgeFirstGuidelines } = require('./architect-knowledge-first');
const { 
  ArchitectureConsistencyCheckpoint,
  TradeoffDocumentationCheckpoint, 
  PatternApplicationCheckpoint 
} = require('./architect-validation-checkpoints');

/**
 * Architect Mode Enhancement
 * 
 * Provides specialized capabilities for the Architect mode, integrating
 * knowledge management, validation, and ConPort integration.
 */
class ArchitectModeEnhancement {
  /**
   * Initialize the Architect Mode Enhancement
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
      this.knowledgeFirstGuidelines = new ArchitectKnowledgeFirstGuidelines(
        options.knowledgeFirstOptions || {},
        conPortClient
      );
    }
    
    // Initialize session-level metrics
    this.sessionMetrics = {
      decisionsProcessed: 0,
      patternsProcessed: 0,
      designsProcessed: 0,
      validationsPerformed: 0,
      knowledgeQueriesPerformed: 0,
      startTime: Date.now()
    };
    
    // Store references to validation checkpoints
    this.validationCheckpoints = {
      architectureConsistency: ArchitectureConsistencyCheckpoint,
      tradeoffDocumentation: TradeoffDocumentationCheckpoint,
      patternApplication: PatternApplicationCheckpoint
    };
  }
  
  /**
   * Process an architectural decision
   * @param {Object} decision - The architectural decision to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed decision with knowledge enhancement and validation
   */
  async processArchitecturalDecision(decision, context = {}) {
    let processedDecision = { ...decision };
    const processingContext = { ...context, mode: 'architect' };
    
    try {
      // 1. Apply knowledge-first guidelines if enabled
      if (this.options.enableKnowledgeFirstGuidelines && this.knowledgeFirstGuidelines) {
        processedDecision = await this.knowledgeFirstGuidelines.processArchitecturalDecision(
          processedDecision,
          processingContext
        );
      }
      
      // 2. Apply validation checkpoints if enabled
      if (this.options.enableValidationCheckpoints) {
        const validationContext = {
          session: this,
          conPortClient: this.conPortClient
        };
        
        // Validate trade-off documentation
        const tradeoffValidation = await this.validationCheckpoints.tradeoffDocumentation.validate(
          processedDecision,
          validationContext
        );
        
        processedDecision.validationResults = {
          ...processedDecision.validationResults,
          tradeoffDocumentation: tradeoffValidation
        };
        
        // Check if the decision is part of a larger architectural design
        if (processedDecision.designContext) {
          // Validate architecture consistency
          const consistencyValidation = await this.validationCheckpoints.architectureConsistency.validate(
            processedDecision,
            validationContext
          );
          
          processedDecision.validationResults = {
            ...processedDecision.validationResults,
            architectureConsistency: consistencyValidation
          };
        }
        
        this.sessionMetrics.validationsPerformed += 2;
      }
      
      // 3. Update session metrics
      this.sessionMetrics.decisionsProcessed++;
      
      return processedDecision;
    } catch (error) {
      console.error('Error processing architectural decision:', error);
      return {
        ...decision,
        processingError: error.message
      };
    }
  }
  
  /**
   * Process a system pattern
   * @param {Object} pattern - The system pattern to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed pattern with knowledge enhancement and validation
   */
  async processSystemPattern(pattern, context = {}) {
    let processedPattern = { ...pattern };
    const processingContext = { ...context, mode: 'architect' };
    
    try {
      // 1. Apply knowledge-first guidelines if enabled
      if (this.options.enableKnowledgeFirstGuidelines && this.knowledgeFirstGuidelines) {
        processedPattern = await this.knowledgeFirstGuidelines.processSystemPattern(
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
        
        // Validate pattern application
        const patternValidation = await this.validationCheckpoints.patternApplication.validate(
          processedPattern,
          validationContext
        );
        
        processedPattern.validationResults = {
          ...processedPattern.validationResults,
          patternApplication: patternValidation
        };
        
        this.sessionMetrics.validationsPerformed++;
      }
      
      // 3. Update session metrics
      this.sessionMetrics.patternsProcessed++;
      
      return processedPattern;
    } catch (error) {
      console.error('Error processing system pattern:', error);
      return {
        ...pattern,
        processingError: error.message
      };
    }
  }
  
  /**
   * Process an architectural design
   * @param {Object} design - The architectural design to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed design with knowledge enhancement and validation
   */
  async processArchitecturalDesign(design, context = {}) {
    let processedDesign = { ...design };
    const processingContext = { ...context, mode: 'architect' };
    
    try {
      // 1. Apply knowledge-first guidelines if enabled
      if (this.options.enableKnowledgeFirstGuidelines && this.knowledgeFirstGuidelines) {
        processedDesign = await this.knowledgeFirstGuidelines.processArchitecturalDesign(
          processedDesign,
          processingContext
        );
      }
      
      // 2. Apply validation checkpoints if enabled
      if (this.options.enableValidationCheckpoints) {
        const validationContext = {
          session: this,
          conPortClient: this.conPortClient
        };
        
        // Validate architecture consistency
        const consistencyValidation = await this.validationCheckpoints.architectureConsistency.validate(
          processedDesign,
          validationContext
        );
        
        // Validate pattern application in the design
        const patternValidation = await this.validationCheckpoints.patternApplication.validate(
          processedDesign,
          validationContext
        );
        
        processedDesign.validationResults = {
          architectureConsistency: consistencyValidation,
          patternApplication: patternValidation
        };
        
        this.sessionMetrics.validationsPerformed += 2;
      }
      
      // 3. Update session metrics
      this.sessionMetrics.designsProcessed++;
      
      return processedDesign;
    } catch (error) {
      console.error('Error processing architectural design:', error);
      return {
        ...design,
        processingError: error.message
      };
    }
  }
  
  /**
   * Process quality attributes
   * @param {Object} qualityAttributes - The quality attributes to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed quality attributes with knowledge enhancement
   */
  async processQualityAttributes(qualityAttributes, context = {}) {
    let processedAttributes = { ...qualityAttributes };
    const processingContext = { ...context, mode: 'architect' };
    
    try {
      // Apply knowledge-first guidelines if enabled
      if (this.options.enableKnowledgeFirstGuidelines && this.knowledgeFirstGuidelines) {
        processedAttributes = await this.knowledgeFirstGuidelines.processQualityAttributes(
          processedAttributes,
          processingContext
        );
      }
      
      return processedAttributes;
    } catch (error) {
      console.error('Error processing quality attributes:', error);
      return {
        ...qualityAttributes,
        processingError: error.message
      };
    }
  }
  
  /**
   * Search for related architectural knowledge
   * @param {Object} query - The search query parameters
   * @returns {Object} Search results
   */
  async searchArchitecturalKnowledge(query) {
    try {
      if (!this.knowledgeFirstGuidelines) {
        return { error: 'Knowledge-first guidelines not initialized' };
      }
      
      const results = await this.knowledgeFirstGuidelines.searchArchitecturalKnowledge(query);
      
      // Update session metrics
      this.sessionMetrics.knowledgeQueriesPerformed++;
      
      return results;
    } catch (error) {
      console.error('Error searching architectural knowledge:', error);
      return { error: error.message };
    }
  }
  
  /**
   * Get combined metrics for the Architect mode
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
      metrics.knowledge = this.knowledgeFirstGuidelines.getArchitectureKnowledgeMetrics();
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
        category: 'architect_mode_metrics',
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
    
    // 3. Add knowledge improvement suggestions
    enhancedResponse.knowledgeImprovements = this.generateKnowledgeImprovements(response);
    
    // 4. Add ConPort integration hints
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
        
        if (result.conflicts) count += result.conflicts.length;
        if (result.issues) count += result.issues.length;
        if (result.improvementSuggestions) count += result.improvementSuggestions.length;
        
        return count;
      }, 0);
    
    return {
      valid: allValid,
      issueCount,
      checkpointsRun: Object.keys(validationResults).length
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
    
    // Check for potential decisions to document
    if (response.suggestedDecisions) {
      improvements.push({
        type: 'document_decisions',
        description: 'Document architectural decisions identified in the design',
        decisions: response.suggestedDecisions
      });
    }
    
    // Check for potential patterns to document
    if (response.suggestedPatterns) {
      improvements.push({
        type: 'document_patterns',
        description: 'Document system patterns identified in the design',
        patterns: response.suggestedPatterns
      });
    }
    
    // Add validation-based improvements
    if (response.validationResults) {
      Object.entries(response.validationResults).forEach(([checkpoint, result]) => {
        if (!result || result.valid) return;
        
        if (result.improvementSuggestions) {
          improvements.push({
            type: `${checkpoint}_improvements`,
            description: `Improvements suggested by ${checkpoint} validation`,
            suggestions: result.improvementSuggestions
          });
        }
      });
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
    if (response.type === 'architectural_decision') {
      hints.shouldLog = true;
      hints.logType = 'decision';
      hints.suggestedTags = ['architecture', 'design_decision'];
      
      if (response.domain) {
        hints.suggestedTags.push(response.domain);
      }
    } else if (response.type === 'system_pattern') {
      hints.shouldLog = true;
      hints.logType = 'system_pattern';
      hints.suggestedTags = ['architecture', 'pattern'];
      
      if (response.patternType) {
        hints.suggestedTags.push(response.patternType);
      }
    } else if (response.type === 'architectural_design') {
      hints.shouldLog = true;
      hints.logType = 'custom_data';
      hints.category = 'architectural_designs';
      hints.suggestedTags = ['architecture', 'design'];
    }
    
    return hints;
  }
}

module.exports = {
  ArchitectModeEnhancement
};