/**
 * Ask Mode Enhancement
 * 
 * Integrates validation checkpoints and knowledge-first guidelines for Ask Mode,
 * providing a unified interface for information retrieval, answer validation,
 * and knowledge persistence.
 */

const {
  InformationAccuracyCheckpoint,
  SourceReliabilityCheckpoint,
  AnswerCompletenessCheckpoint,
  ContextualRelevanceCheckpoint
} = require('./ask-validation-checkpoints');

const { AskKnowledgeFirstGuidelines } = require('./ask-knowledge-first');

/**
 * Ask Mode Enhancement class integrating validation and knowledge-first guidelines
 */
class AskModeEnhancement {
  constructor(options = {}) {
    // Initialize validation checkpoints
    this.validationCheckpoints = {
      informationAccuracy: new InformationAccuracyCheckpoint(options.informationAccuracyOptions),
      sourceReliability: new SourceReliabilityCheckpoint(options.sourceReliabilityOptions),
      answerCompleteness: new AnswerCompletenessCheckpoint(options.answerCompletenessOptions),
      contextualRelevance: new ContextualRelevanceCheckpoint(options.contextualRelevanceOptions)
    };
    
    // Initialize knowledge-first guidelines
    this.knowledgeFirstGuidelines = new AskKnowledgeFirstGuidelines(options.knowledgeFirstOptions);
    
    // ConPort client for knowledge persistence
    this.conportClient = options.conportClient;
    
    // Configuration
    this.config = {
      autoValidate: options.autoValidate !== undefined ? options.autoValidate : true,
      validateBeforePersistence: options.validateBeforePersistence !== undefined ? options.validateBeforePersistence : true,
      minConfidenceForPersistence: options.minConfidenceForPersistence || 0.8,
      enabledCheckpoints: options.enabledCheckpoints || Object.keys(this.validationCheckpoints),
      ...options.config
    };
  }
  
  /**
   * Validate an answer against all enabled checkpoints
   * @param {Object} answer - The answer to validate
   * @param {Object} context - Additional context including question info
   * @returns {Object} - Validation results for all checkpoints
   */
  validateAnswer(answer, context = {}) {
    const results = {};
    let isValid = true;
    
    this.config.enabledCheckpoints.forEach(checkpointName => {
      if (this.validationCheckpoints[checkpointName]) {
        const result = this.validationCheckpoints[checkpointName].validate(answer, context);
        results[checkpointName] = result;
        
        if (!result.valid) {
          isValid = false;
        }
      }
    });
    
    return {
      isValid,
      results,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Improve an answer based on validation results
   * @param {Object} answer - The original answer
   * @param {Object} validationResults - Results from validateAnswer
   * @param {Object} context - Additional context
   * @returns {Object} - Improved answer
   */
  improveAnswer(answer, validationResults, context = {}) {
    if (!answer || !validationResults || !validationResults.results) {
      return answer;
    }
    
    const improvedAnswer = { ...answer };
    
    // Apply improvements based on validation results
    Object.entries(validationResults.results).forEach(([checkpointName, result]) => {
      if (!result.valid && Array.isArray(result.suggestedImprovements)) {
        result.suggestedImprovements.forEach(improvement => {
          switch (checkpointName) {
            case 'informationAccuracy':
              this._improveInformationAccuracy(improvedAnswer, improvement, context);
              break;
              
            case 'sourceReliability':
              this._improveSourceReliability(improvedAnswer, improvement, context);
              break;
              
            case 'answerCompleteness':
              this._improveAnswerCompleteness(improvedAnswer, improvement, context);
              break;
              
            case 'contextualRelevance':
              this._improveContextualRelevance(improvedAnswer, improvement, context);
              break;
          }
        });
      }
    });
    
    return improvedAnswer;
  }
  
  /**
   * Select appropriate retrieval strategy for a question
   * @param {Object} question - The question object
   * @param {Object} context - Additional context
   * @returns {Object} - Selected retrieval strategy
   */
  selectRetrievalStrategy(question, context = {}) {
    return this.knowledgeFirstGuidelines.selectRetrievalStrategy(question, context);
  }
  
  /**
   * Select appropriate answer template for a question
   * @param {Object} question - The question object
   * @param {Object} context - Additional context
   * @returns {Object} - Selected answer template
   */
  selectAnswerTemplate(question, context = {}) {
    return this.knowledgeFirstGuidelines.selectAnswerTemplate(question, context);
  }
  
  /**
   * Extract knowledge from an answer for persistence
   * @param {Object} answer - The answer object
   * @param {Object} question - The question object
   * @param {Object} context - Additional context
   * @returns {Array} - Extracted knowledge items
   */
  extractKnowledge(answer, question, context = {}) {
    // Validate answer before extraction if configured
    if (this.config.validateBeforePersistence) {
      const validationResults = this.validateAnswer(answer, { ...context, question });
      if (!validationResults.isValid) {
        // Only extract from validated answers
        return [];
      }
    }
    
    return this.knowledgeFirstGuidelines.extractKnowledge(answer, question, context);
  }
  
  /**
   * Persist extracted knowledge to ConPort
   * @param {Array} extractedItems - Items extracted by extractKnowledge
   * @param {Object} context - Additional context
   * @returns {Promise<Object>} - Result of persistence operations
   */
  async persistKnowledge(extractedItems, context = {}) {
    if (!this.conportClient) {
      return { success: false, error: 'ConPort client not available' };
    }
    
    const operations = this.knowledgeFirstGuidelines.prepareConportOperations(extractedItems, context);
    const results = { operations: [], success: true };
    
    // Execute operations
    for (const operation of operations) {
      try {
        // Filter by confidence threshold
        const relevantItems = extractedItems.filter(item => 
          item.confidence >= this.config.minConfidenceForPersistence
        );
        
        if (relevantItems.length === 0) {
          continue;
        }
        
        const result = await this.conportClient[operation.method](operation.params);
        results.operations.push({
          method: operation.method,
          success: true,
          result
        });
      } catch (error) {
        results.operations.push({
          method: operation.method,
          success: false,
          error: error.message || String(error)
        });
        results.success = false;
      }
    }
    
    return results;
  }
  
  /**
   * Retrieve relevant knowledge from ConPort for a question
   * @param {Object} question - The question object
   * @param {Object} context - Additional context
   * @returns {Promise<Object>} - Retrieved knowledge
   */
  async retrieveKnowledge(question, context = {}) {
    if (!this.conportClient) {
      return { success: false, error: 'ConPort client not available' };
    }
    
    const results = { sources: [], success: true };
    
    try {
      // Determine retrieval approach based on question
      const questionType = this._inferQuestionType(question);
      
      // Apply appropriate retrieval strategy
      if (this._isDefinitionQuestion(question)) {
        // Search project glossary for definitions
        const glossaryResults = await this.conportClient.search_project_glossary_fts({
          query_term: this._extractSearchTerms(question),
          limit: 5
        });
        
        results.sources.push({
          type: 'glossary',
          items: glossaryResults.items || []
        });
      }
      
      if (this._isComparisonQuestion(question)) {
        // Search comparative insights
        const comparativeResults = await this.conportClient.search_custom_data_value_fts({
          query_term: this._extractSearchTerms(question),
          category_filter: 'ComparativeInsights',
          limit: 5
        });
        
        results.sources.push({
          type: 'comparisons',
          items: comparativeResults.items || []
        });
      }
      
      // Always perform semantic search for more contextual understanding
      const semanticResults = await this.conportClient.semantic_search_conport({
        query_text: typeof question === 'string' ? question : (question.text || ''),
        top_k: 5,
        filter_item_types: ['custom_data', 'decision']
      });
      
      results.sources.push({
        type: 'semantic',
        items: semanticResults.items || []
      });
      
      // Search for best practices if applicable
      if (this._isBestPracticeQuestion(question)) {
        const practiceResults = await this.conportClient.search_custom_data_value_fts({
          query_term: this._extractSearchTerms(question),
          category_filter: 'BestPractices',
          limit: 5
        });
        
        results.sources.push({
          type: 'practices',
          items: practiceResults.items || []
        });
      }
      
      // Search for constraints if applicable
      if (this._isConstraintQuestion(question)) {
        const constraintResults = await this.conportClient.search_custom_data_value_fts({
          query_term: this._extractSearchTerms(question),
          category_filter: 'Constraints',
          limit: 5
        });
        
        results.sources.push({
          type: 'constraints',
          items: constraintResults.items || []
        });
      }
    } catch (error) {
      results.success = false;
      results.error = error.message || String(error);
    }
    
    return results;
  }
  
  /**
   * Update ConPort active context with question information
   * @param {Object} question - The question object
   * @param {Object} answer - The answer object
   * @param {Object} context - Additional context
   * @returns {Promise<Object>} - Result of update operation
   */
  async updateActiveContext(question, answer, context = {}) {
    if (!this.conportClient) {
      return { success: false, error: 'ConPort client not available' };
    }
    
    try {
      // Get current active context
      const currentContext = await this.conportClient.get_active_context();
      
      // Prepare the update
      const questionText = typeof question === 'string' ? question : (question.text || '');
      const questionType = this._inferQuestionType(question);
      
      const recentQueries = Array.isArray(currentContext.recent_queries) 
        ? currentContext.recent_queries 
        : [];
      
      // Add new query to recent queries, keeping max 10
      recentQueries.unshift({
        question: questionText,
        type: questionType,
        timestamp: new Date().toISOString(),
        has_answer: !!answer
      });
      
      if (recentQueries.length > 10) {
        recentQueries.pop();
      }
      
      // Update current focus if provided
      const patchContent = {
        recent_queries: recentQueries
      };
      
      if (context.updateCurrentFocus) {
        patchContent.current_focus = `Answering: ${questionText.substring(0, 100)}${questionText.length > 100 ? '...' : ''}`;
      }
      
      // Update the context
      const result = await this.conportClient.update_active_context({
        patch_content: patchContent
      });
      
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message || String(error) };
    }
  }
  
  /**
   * Process a complete question-answer cycle with validation and persistence
   * @param {Object} question - The question object
   * @param {Object} answer - The answer object
   * @param {Object} context - Additional context
   * @returns {Promise<Object>} - Result of processing
   */
  async processQuestionAnswer(question, answer, context = {}) {
    const results = {
      validation: null,
      knowledgeExtraction: [],
      persistence: null,
      contextUpdate: null
    };
    
    // 1. Validate the answer
    if (this.config.autoValidate) {
      results.validation = this.validateAnswer(answer, { ...context, question });
      
      // 2. Improve the answer if needed
      if (!results.validation.isValid) {
        answer = this.improveAnswer(answer, results.validation, { ...context, question });
        
        // Re-validate after improvement
        results.validation = this.validateAnswer(answer, { ...context, question });
      }
    }
    
    // 3. Extract knowledge
    results.knowledgeExtraction = this.extractKnowledge(answer, question, context);
    
    // 4. Persist knowledge if valid
    if ((this.config.validateBeforePersistence && results.validation?.isValid) || 
        !this.config.validateBeforePersistence) {
      results.persistence = await this.persistKnowledge(results.knowledgeExtraction, context);
    }
    
    // 5. Update active context
    results.contextUpdate = await this.updateActiveContext(question, answer, context);
    
    return results;
  }
  
  // Private helper methods
  
  /**
   * Improve information accuracy based on suggested improvement
   * @param {Object} answer - The answer to improve
   * @param {Object} improvement - The suggested improvement
   * @param {Object} context - Additional context
   * @private
   */
  _improveInformationAccuracy(answer, improvement, context = {}) {
    // Implementation depends on the type of improvement needed
    switch (improvement.type) {
      case 'accuracy':
        // Flag the answer for accuracy review
        answer.needsAccuracyReview = true;
        answer.accuracyImprovementNeeded = improvement.description;
        break;
        
      case 'citations':
        // Flag the answer for citation improvement
        answer.needsCitations = true;
        answer.citationImprovementNeeded = improvement.description;
        break;
        
      case 'critical':
        // Flag the answer for critical accuracy issues
        answer.hasCriticalAccuracyIssues = true;
        answer.criticalAccuracyIssue = improvement.description;
        break;
    }
  }
  
  /**
   * Improve source reliability based on suggested improvement
   * @param {Object} answer - The answer to improve
   * @param {Object} improvement - The suggested improvement
   * @param {Object} context - Additional context
   * @private
   */
  _improveSourceReliability(answer, improvement, context = {}) {
    // Implementation depends on the type of improvement needed
    switch (improvement.type) {
      case 'critical':
        // Flag the answer for source improvement
        answer.needsReliableSources = true;
        answer.sourceImprovementNeeded = improvement.description;
        break;
        
      case 'reliability':
        // Flag the answer for reliability improvement
        answer.needsReliabilityImprovement = true;
        answer.reliabilityImprovementNeeded = improvement.description;
        break;
        
      case 'sources':
        // Flag the answer for preferred source types
        answer.needsPreferredSources = true;
        answer.preferredSourcesNeeded = improvement.description;
        break;
    }
  }
  
  /**
   * Improve answer completeness based on suggested improvement
   * @param {Object} answer - The answer to improve
   * @param {Object} improvement - The suggested improvement
   * @param {Object} context - Additional context
   * @private
   */
  _improveAnswerCompleteness(answer, improvement, context = {}) {
    // Implementation depends on the type of improvement needed
    switch (improvement.type) {
      case 'critical':
        // Add missing required component
        const componentName = improvement.description.match(/Add required component: (.+)/);
        if (componentName && componentName[1]) {
          answer.missingRequiredComponents = answer.missingRequiredComponents || [];
          answer.missingRequiredComponents.push(componentName[1]);
        }
        break;
        
      case 'recommended':
        // Add missing recommended component
        const recComponentName = improvement.description.match(/Consider adding recommended component: (.+)/);
        if (recComponentName && recComponentName[1]) {
          answer.missingRecommendedComponents = answer.missingRecommendedComponents || [];
          answer.missingRecommendedComponents.push(recComponentName[1]);
        }
        break;
        
      case 'coverage':
        // Flag uncovered aspects
        answer.hasUncoveredAspects = true;
        answer.uncoveredAspectsDescription = improvement.description;
        break;
    }
  }
  
  /**
   * Improve contextual relevance based on suggested improvement
   * @param {Object} answer - The answer to improve
   * @param {Object} improvement - The suggested improvement
   * @param {Object} context - Additional context
   * @private
   */
  _improveContextualRelevance(answer, improvement, context = {}) {
    // Implementation depends on the type of improvement needed
    switch (improvement.type) {
      case 'relevance':
        // Flag relevance factor for improvement
        const factorName = improvement.description.match(/Improve (.+) by/);
        if (factorName && factorName[1]) {
          answer.relevanceFactorsToImprove = answer.relevanceFactorsToImprove || [];
          answer.relevanceFactorsToImprove.push(factorName[1]);
        }
        break;
        
      case 'alignment':
        // Flag for question alignment improvement
        answer.needsQuestionAlignment = true;
        answer.alignmentImprovementNeeded = improvement.description;
        break;
        
      case 'context':
        // Flag for user context consideration
        answer.needsUserContextConsideration = true;
        answer.userContextImprovementNeeded = improvement.description;
        break;
    }
  }
  
  /**
   * Infer question type from content
   * @param {Object|string} question - The question object or string
   * @returns {string} - The inferred question type
   * @private
   */
  _inferQuestionType(question) {
    const text = typeof question === 'string' ? question : (question.text || '');
    
    // Define patterns for different question types
    if (/what\s+is|define|meaning\s+of|definition\s+of/i.test(text)) {
      return 'definition';
    }
    
    if (/compare|versus|vs\.|better|difference between|advantages of/i.test(text)) {
      return 'comparison';
    }
    
    if (/best\s+practice|recommend|should\s+I|how\s+to\s+best|proper\s+way/i.test(text)) {
      return 'bestPractice';
    }
    
    if (/limitation|constraint|restrict|cannot|impossible|problem\s+with/i.test(text)) {
      return 'constraint';
    }
    
    if (/history|timeline|evolution|develop|progress|change\s+over\s+time/i.test(text)) {
      return 'evolution';
    }
    
    if (/how\s+to|steps\s+to|process\s+for|approach\s+to/i.test(text)) {
      return 'howTo';
    }
    
    if (/why\s+is|reason\s+for|explain\s+why|cause\s+of/i.test(text)) {
      return 'explanation';
    }
    
    return 'general';
  }
  
  /**
   * Check if a question is asking for a definition
   * @param {Object|string} question - The question object or string
   * @returns {boolean} - True if it's a definition question
   * @private
   */
  _isDefinitionQuestion(question) {
    return this._inferQuestionType(question) === 'definition';
  }
  
  /**
   * Check if a question is asking for a comparison
   * @param {Object|string} question - The question object or string
   * @returns {boolean} - True if it's a comparison question
   * @private
   */
  _isComparisonQuestion(question) {
    return this._inferQuestionType(question) === 'comparison';
  }
  
  /**
   * Check if a question is asking for best practices
   * @param {Object|string} question - The question object or string
   * @returns {boolean} - True if it's a best practice question
   * @private
   */
  _isBestPracticeQuestion(question) {
    return this._inferQuestionType(question) === 'bestPractice';
  }
  
  /**
   * Check if a question is asking about constraints
   * @param {Object|string} question - The question object or string
   * @returns {boolean} - True if it's a constraint question
   * @private
   */
  _isConstraintQuestion(question) {
    return this._inferQuestionType(question) === 'constraint';
  }
  
  /**
   * Extract search terms from a question
   * @param {Object|string} question - The question object or string
   * @returns {string} - Extracted search terms
   * @private
   */
  _extractSearchTerms(question) {
    const text = typeof question === 'string' ? question : (question.text || '');
    
    // Remove question words and common stop words
    return text
      .replace(/^(what|why|how|when|where|who|which)\s+(is|are|was|were|do|does|did|has|have|had)\s+/i, '')
      .replace(/\?(.*)/g, '') // Remove everything after a question mark
      .replace(/\b(the|a|an|and|or|but|in|on|at|to|for|with|by|of|from)\b/gi, ' ') // Remove common stop words
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .trim();
  }
}

module.exports = { AskModeEnhancement };