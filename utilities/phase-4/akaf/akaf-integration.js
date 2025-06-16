/**
 * Adaptive Knowledge Application Framework (AKAF) - Integration Layer
 * 
 * This module provides integration capabilities for the AKAF system,
 * connecting it with ConPort and other external systems to enable
 * seamless knowledge adaptation and application.
 */

const { AdaptiveKnowledgeController } = require('./akaf-core');

/**
 * AKAF integration with ConPort and other systems
 */
class AKAFIntegration {
  constructor(options = {}) {
    // Initialize the core controller
    this.adaptiveController = new AdaptiveKnowledgeController({
      knowledgeRetriever: options.knowledgeRetriever || new ConPortKnowledgeRetriever(options.conportClient),
      strategySelector: options.strategySelector || new ConPortStrategySelector(options.conportClient),
      applicationEngine: options.applicationEngine || new IntegratedApplicationEngine(options),
      feedbackCollector: options.feedbackCollector || new ConPortFeedbackCollector(options.conportClient)
    });
    
    this.conportClient = options.conportClient;
    this.kdapClient = options.kdapClient;
    this.sivsClient = options.sivsClient;
    this.amoClient = options.amoClient;
    
    // Enable event listeners
    this.setupEventListeners();
  }
  
  /**
   * Set up event listeners for integration events
   */
  setupEventListeners() {
    // Set up listeners for relevant events from ConPort or other systems
    // In a real implementation, this would connect to event buses or hook into callback systems
  }
  
  /**
   * Prepare a context from ConPort data and user inputs
   * @param {Object} rawContextData - Raw context data from ConPort or user input
   * @returns {Object} Prepared context object
   */
  prepareContext(rawContextData) {
    // Transform raw context data into a format expected by AKAF
    const context = {
      id: rawContextData.id || `context-${Date.now()}`,
      domain: rawContextData.domain || this.extractDomainFromContext(rawContextData),
      task: rawContextData.task,
      constraints: rawContextData.constraints || {},
      environment: this.buildEnvironmentContext(rawContextData)
    };
    
    // Add user information if available
    if (rawContextData.user) {
      context.user = rawContextData.user;
    }
    
    return context;
  }
  
  /**
   * Extract domain information from context data
   * @param {Object} rawContextData - Raw context data
   * @returns {string} Extracted domain
   */
  extractDomainFromContext(rawContextData) {
    // Attempt to extract domain from various context elements
    if (rawContextData.projectContext && rawContextData.projectContext.domain) {
      return rawContextData.projectContext.domain;
    }
    
    if (rawContextData.activeContext && rawContextData.activeContext.current_focus) {
      // Try to infer domain from current focus
      const focusKeywords = rawContextData.activeContext.current_focus.toLowerCase();
      
      // Simple keyword matching for domain inference
      if (focusKeywords.includes('security') || focusKeywords.includes('auth')) {
        return 'security';
      }
      if (focusKeywords.includes('ui') || focusKeywords.includes('interface')) {
        return 'ui';
      }
      if (focusKeywords.includes('data') || focusKeywords.includes('database')) {
        return 'data';
      }
      if (focusKeywords.includes('test') || focusKeywords.includes('qa')) {
        return 'testing';
      }
    }
    
    // Default domain if nothing can be inferred
    return 'development';
  }
  
  /**
   * Build environment context from raw data
   * @param {Object} rawContextData - Raw context data
   * @returns {Object} Environment context
   */
  buildEnvironmentContext(rawContextData) {
    const environment = {};
    
    // Extract from project context if available
    if (rawContextData.projectContext) {
      if (rawContextData.projectContext.technologies) {
        environment.technologies = rawContextData.projectContext.technologies;
      }
      
      if (rawContextData.projectContext.constraints) {
        environment.projectConstraints = rawContextData.projectContext.constraints;
      }
    }
    
    // Extract from system context if available
    if (rawContextData.systemContext) {
      environment.platform = rawContextData.systemContext.platform;
      environment.runtime = rawContextData.systemContext.runtime;
    }
    
    return environment;
  }
  
  /**
   * Process a context to adapt and apply knowledge
   * @param {Object} rawContextData - Raw context data
   * @returns {Promise<Object>} Processing results
   */
  async processContext(rawContextData) {
    // Prepare context for AKAF processing
    const context = this.prepareContext(rawContextData);
    
    // Process the context using the adaptive controller
    const results = await this.adaptiveController.processContext(context);
    
    // Transform results for external consumption
    const transformedResults = this.transformResults(results);
    
    // Log the processing activity to ConPort
    await this.logProcessingToConPort(context, transformedResults);
    
    return transformedResults;
  }
  
  /**
   * Transform AKAF results for external consumption
   * @param {Object} results - AKAF processing results
   * @returns {Object} Transformed results
   */
  transformResults(results) {
    return {
      contextId: results.context.id,
      appliedKnowledge: results.applicationResults.appliedItems.map(item => ({
        id: item.item.id,
        type: item.item.type,
        patternUsed: item.pattern.type,
        artifacts: item.result.outputArtifacts,
        success: item.result.success
      })),
      failedApplications: results.applicationResults.failedApplications.length,
      overallSuccess: results.applicationResults.overallSuccess,
      metrics: this.adaptiveController.getMetrics()
    };
  }
  
  /**
   * Log processing activity to ConPort
   * @param {Object} context - Processed context
   * @param {Object} results - Processing results
   * @returns {Promise<void>}
   */
  async logProcessingToConPort(context, results) {
    if (!this.conportClient) {
      console.warn('ConPort client not available for logging');
      return;
    }
    
    try {
      // Log as custom data in ConPort
      await this.conportClient.logCustomData({
        category: 'AKAF_Processing',
        key: `context-${context.id}`,
        value: {
          timestamp: new Date().toISOString(),
          contextDomain: context.domain,
          contextTask: context.task,
          appliedKnowledgeCount: results.appliedKnowledge.length,
          failedApplications: results.failedApplications,
          overallSuccess: results.overallSuccess
        }
      });
      
      // If successful applications, log decisions
      if (results.appliedKnowledge.length > 0) {
        await this.conportClient.logDecision({
          summary: `Applied ${results.appliedKnowledge.length} knowledge items to ${context.task} task in ${context.domain} domain`,
          rationale: `Adaptation and application performed by AKAF with ${results.overallSuccess ? 'successful' : 'partial'} outcome`,
          tags: ['AKAF', `domain:${context.domain}`, `task:${context.task}`]
        });
      }
    } catch (error) {
      console.error('Failed to log processing to ConPort:', error);
    }
  }
  
  /**
   * Retrieve knowledge adaptation strategies from ConPort
   * @param {string} domain - Domain to retrieve strategies for
   * @param {string} knowledgeType - Type of knowledge
   * @returns {Promise<Array>} Retrieved strategies
   */
  async retrieveStrategies(domain, knowledgeType) {
    if (!this.conportClient) {
      return [];
    }
    
    try {
      // Get strategies from ConPort custom data
      const strategiesData = await this.conportClient.getCustomData({
        category: 'AKAF_Strategies',
        key: domain
      });
      
      if (!strategiesData || !strategiesData.value || !Array.isArray(strategiesData.value)) {
        return [];
      }
      
      // Filter by knowledge type if specified
      if (knowledgeType) {
        return strategiesData.value.filter(strategy => 
          !strategy.applicableTypes || strategy.applicableTypes.includes(knowledgeType)
        );
      }
      
      return strategiesData.value;
    } catch (error) {
      console.error('Failed to retrieve strategies from ConPort:', error);
      return [];
    }
  }
  
  /**
   * Retrieve application patterns from ConPort
   * @param {string} domain - Domain to retrieve patterns for
   * @param {string} knowledgeType - Type of knowledge
   * @returns {Promise<Array>} Retrieved application patterns
   */
  async retrievePatterns(domain, knowledgeType) {
    if (!this.conportClient) {
      return [];
    }
    
    try {
      // Get patterns from ConPort custom data
      const patternsData = await this.conportClient.getCustomData({
        category: 'AKAF_Patterns',
        key: domain
      });
      
      if (!patternsData || !patternsData.value || !Array.isArray(patternsData.value)) {
        return [];
      }
      
      // Filter by knowledge type if specified
      if (knowledgeType) {
        return patternsData.value.filter(pattern => 
          !pattern.applicableTypes || pattern.applicableTypes.includes(knowledgeType)
        );
      }
      
      return patternsData.value;
    } catch (error) {
      console.error('Failed to retrieve patterns from ConPort:', error);
      return [];
    }
  }
  
  /**
   * Register a new adaptation strategy in ConPort
   * @param {Object} strategy - Strategy to register
   * @returns {Promise<boolean>} Success indicator
   */
  async registerStrategy(strategy) {
    if (!this.conportClient || !strategy.domain) {
      return false;
    }
    
    try {
      // Get existing strategies
      const existingData = await this.conportClient.getCustomData({
        category: 'AKAF_Strategies',
        key: strategy.domain
      });
      
      let strategies = [];
      if (existingData && existingData.value && Array.isArray(existingData.value)) {
        strategies = existingData.value;
      }
      
      // Add new strategy
      strategies.push(strategy);
      
      // Update in ConPort
      await this.conportClient.logCustomData({
        category: 'AKAF_Strategies',
        key: strategy.domain,
        value: strategies
      });
      
      return true;
    } catch (error) {
      console.error('Failed to register strategy in ConPort:', error);
      return false;
    }
  }
  
  /**
   * Register a new application pattern in ConPort
   * @param {Object} pattern - Pattern to register
   * @returns {Promise<boolean>} Success indicator
   */
  async registerPattern(pattern) {
    if (!this.conportClient || !pattern.domain) {
      return false;
    }
    
    try {
      // Get existing patterns
      const existingData = await this.conportClient.getCustomData({
        category: 'AKAF_Patterns',
        key: pattern.domain
      });
      
      let patterns = [];
      if (existingData && existingData.value && Array.isArray(existingData.value)) {
        patterns = existingData.value;
      }
      
      // Add new pattern
      patterns.push(pattern);
      
      // Update in ConPort
      await this.conportClient.logCustomData({
        category: 'AKAF_Patterns',
        key: pattern.domain,
        value: patterns
      });
      
      return true;
    } catch (error) {
      console.error('Failed to register pattern in ConPort:', error);
      return false;
    }
  }
  
  /**
   * Integrate with KDAP for knowledge planning
   * @param {Object} context - Context for knowledge planning
   * @returns {Promise<Object>} Planning results
   */
  async integrateWithKDAP(context) {
    if (!this.kdapClient) {
      throw new Error('KDAP client not available for integration');
    }
    
    try {
      // Transform context for KDAP
      const kdapContext = this.transformContextForKDAP(context);
      
      // Get knowledge plans from KDAP
      const plans = await this.kdapClient.generateKnowledgePlan(kdapContext);
      
      // Use plans to guide AKAF processing
      return plans;
    } catch (error) {
      console.error('Failed to integrate with KDAP:', error);
      throw error;
    }
  }
  
  /**
   * Transform context for KDAP integration
   * @param {Object} context - AKAF context
   * @returns {Object} KDAP-compatible context
   */
  transformContextForKDAP(context) {
    return {
      domain: context.domain,
      task: context.task,
      constraints: context.constraints,
      knowledgeGoals: {
        adaptationRequired: true,
        applicationRequired: true,
        knowledgeTypes: this.adaptiveController.determineRequiredKnowledgeTypes(context.task)
      }
    };
  }
  
  /**
   * Get metrics and statistics about AKAF usage
   * @returns {Object} AKAF metrics
   */
  getMetrics() {
    const coreMetrics = this.adaptiveController.getMetrics();
    
    // Add integration-specific metrics
    return {
      ...coreMetrics,
      integrationTimestamp: new Date().toISOString(),
      conportSyncStatus: this.conportClient ? 'connected' : 'disconnected',
      kdapIntegrationStatus: this.kdapClient ? 'connected' : 'disconnected'
    };
  }
}

/**
 * ConPort-based knowledge retriever implementation
 */
class ConPortKnowledgeRetriever {
  constructor(conportClient) {
    this.conportClient = conportClient;
  }
  
  /**
   * Retrieve knowledge from ConPort based on needs assessment
   * @param {Object} knowledgeNeeds - Knowledge needs assessment
   * @returns {Promise<Array>} Retrieved knowledge items
   */
  async retrieveKnowledge(knowledgeNeeds) {
    if (!this.conportClient) {
      return [];
    }
    
    try {
      const retrievedItems = [];
      
      // Retrieve decisions
      const decisions = await this.retrieveDecisions(knowledgeNeeds);
      retrievedItems.push(...decisions);
      
      // Retrieve system patterns
      const patterns = await this.retrieveSystemPatterns(knowledgeNeeds);
      retrievedItems.push(...patterns);
      
      // Retrieve custom data
      const customData = await this.retrieveCustomData(knowledgeNeeds);
      retrievedItems.push(...customData);
      
      // Use semantic search for additional items
      const semanticResults = await this.semanticSearch(knowledgeNeeds);
      retrievedItems.push(...semanticResults);
      
      return retrievedItems;
    } catch (error) {
      console.error('Failed to retrieve knowledge from ConPort:', error);
      return [];
    }
  }
  
  /**
   * Retrieve decisions from ConPort
   * @param {Object} knowledgeNeeds - Knowledge needs
   * @returns {Promise<Array>} Retrieved decisions
   */
  async retrieveDecisions(knowledgeNeeds) {
    try {
      // Use domain as tag filter if available
      const tagFilter = knowledgeNeeds.primaryDomain ? 
        [`domain:${knowledgeNeeds.primaryDomain}`] : undefined;
      
      const decisions = await this.conportClient.getDecisions({
        limit: 10,
        tags_filter_include_any: tagFilter
      });
      
      // Transform decisions to AKAF knowledge format
      return decisions.map(decision => ({
        id: `decision-${decision.id}`,
        type: 'decision',
        content: decision.summary + (decision.rationale ? `\n\n${decision.rationale}` : ''),
        domain: knowledgeNeeds.primaryDomain,
        metadata: {
          originalId: decision.id,
          timestamp: decision.timestamp,
          tags: decision.tags || []
        }
      }));
    } catch (error) {
      console.error('Failed to retrieve decisions:', error);
      return [];
    }
  }
  
  /**
   * Retrieve system patterns from ConPort
   * @param {Object} knowledgeNeeds - Knowledge needs
   * @returns {Promise<Array>} Retrieved system patterns
   */
  async retrieveSystemPatterns(knowledgeNeeds) {
    try {
      // Use domain as tag filter if available
      const tagFilter = knowledgeNeeds.primaryDomain ? 
        [`domain:${knowledgeNeeds.primaryDomain}`] : undefined;
      
      const patterns = await this.conportClient.getSystemPatterns({
        tags_filter_include_any: tagFilter
      });
      
      // Transform patterns to AKAF knowledge format
      return patterns.map(pattern => ({
        id: `pattern-${pattern.id}`,
        type: 'system_pattern',
        content: pattern.description || pattern.name,
        domain: knowledgeNeeds.primaryDomain,
        metadata: {
          originalId: pattern.id,
          name: pattern.name,
          tags: pattern.tags || []
        }
      }));
    } catch (error) {
      console.error('Failed to retrieve system patterns:', error);
      return [];
    }
  }
  
  /**
   * Retrieve custom data from ConPort
   * @param {Object} knowledgeNeeds - Knowledge needs
   * @returns {Promise<Array>} Retrieved custom data
   */
  async retrieveCustomData(knowledgeNeeds) {
    try {
      // Try to get domain-specific knowledge
      const knowledgeCategory = `${knowledgeNeeds.primaryDomain}_Knowledge`;
      const customData = await this.conportClient.getCustomData({
        category: knowledgeCategory
      });
      
      if (!customData || !Array.isArray(customData)) {
        return [];
      }
      
      // Transform custom data to AKAF knowledge format
      return customData.map(item => ({
        id: `custom-${item.category}-${item.key}`,
        type: 'custom_data',
        content: typeof item.value === 'string' ? item.value : JSON.stringify(item.value),
        domain: knowledgeNeeds.primaryDomain,
        metadata: {
          category: item.category,
          key: item.key,
          timestamp: item.timestamp
        }
      }));
    } catch (error) {
      console.error('Failed to retrieve custom data:', error);
      return [];
    }
  }
  
  /**
   * Perform semantic search in ConPort
   * @param {Object} knowledgeNeeds - Knowledge needs
   * @returns {Promise<Array>} Semantically retrieved items
   */
  async semanticSearch(knowledgeNeeds) {
    try {
      // Construct search query from needs
      const query = `${knowledgeNeeds.task} in ${knowledgeNeeds.primaryDomain} domain`;
      
      const results = await this.conportClient.semanticSearchConport({
        query_text: query,
        top_k: 5
      });
      
      // Transform search results to AKAF knowledge format
      return results.map(result => ({
        id: `semantic-${result.item_type}-${result.item_id}`,
        type: result.item_type,
        content: result.content,
        domain: knowledgeNeeds.primaryDomain,
        metadata: {
          originalId: result.item_id,
          relevanceScore: result.score
        }
      }));
    } catch (error) {
      console.error('Failed to perform semantic search:', error);
      return [];
    }
  }
}

/**
 * ConPort-based strategy selector
 */
class ConPortStrategySelector {
  constructor(conportClient) {
    this.conportClient = conportClient;
  }
  
  /**
   * Select adaptation strategies from ConPort
   * @param {Object} knowledgeItem - Knowledge item to adapt
   * @param {Object} context - Target context
   * @returns {Promise<Array>} Selected strategies
   */
  async selectStrategies(knowledgeItem, context) {
    if (!this.conportClient) {
      return [this.getDefaultStrategy(knowledgeItem.type)];
    }
    
    try {
      // Get strategies for the domain
      const strategiesData = await this.conportClient.getCustomData({
        category: 'AKAF_Strategies',
        key: context.domain
      });
      
      if (!strategiesData || !strategiesData.value || !Array.isArray(strategiesData.value)) {
        return [this.getDefaultStrategy(knowledgeItem.type)];
      }
      
      // Filter strategies applicable to this knowledge type
      const applicableStrategies = strategiesData.value.filter(strategy => 
        !strategy.applicableTypes || strategy.applicableTypes.includes(knowledgeItem.type)
      );
      
      if (applicableStrategies.length === 0) {
        return [this.getDefaultStrategy(knowledgeItem.type)];
      }
      
      return applicableStrategies;
    } catch (error) {
      console.error('Failed to select strategies from ConPort:', error);
      return [this.getDefaultStrategy(knowledgeItem.type)];
    }
  }
  
  /**
   * Get default strategy for a knowledge type
   * @param {string} knowledgeType - Type of knowledge
   * @returns {Object} Default strategy
   */
  getDefaultStrategy(knowledgeType) {
    const defaultStrategies = {
      'decision': {
        type: 'contextual_extraction',
        operations: [
          {
            type: 'filter',
            criteria: 'relevant_sections'
          },
          {
            type: 'transform',
            transformation: 'simplify'
          }
        ]
      },
      'system_pattern': {
        type: 'pattern_application',
        operations: [
          {
            type: 'transform',
            transformation: 'concretize'
          }
        ]
      },
      'custom_data': {
        type: 'data_extraction',
        operations: [
          {
            type: 'filter',
            criteria: 'relevant_fields'
          }
        ]
      }
    };
    
    return defaultStrategies[knowledgeType] || {
      type: 'generic_adaptation',
      operations: [
        {
          type: 'transform',
          transformation: 'contextualize'
        }
      ]
    };
  }
}

/**
 * Integrated application engine that connects with external systems
 */
class IntegratedApplicationEngine {
  constructor(options = {}) {
    this.conportClient = options.conportClient;
    this.sivsClient = options.sivsClient;
    this.amoClient = options.amoClient;
  }
  
  /**
   * Execute an application pattern
   * @param {Object} pattern - Application pattern
   * @param {Object} knowledgeItem - Adapted knowledge
   * @param {Object} context - Target context
   * @returns {Promise<Object>} Application result
   */
  async executePattern(pattern, knowledgeItem, context) {
    // Select appropriate execution method based on pattern type
    switch (pattern.type) {
      case 'code_integration':
        return this.executeCodeIntegration(pattern, knowledgeItem, context);
      case 'documentation_generation':
        return this.executeDocumentationGeneration(pattern, knowledgeItem, context);
      case 'decision_support':
        return this.executeDecisionSupport(pattern, knowledgeItem, context);
      default:
        return this.executeGenericPattern(pattern, knowledgeItem, context);
    }
  }
  
  /**
   * Execute a code integration pattern
   * @param {Object} pattern - Application pattern
   * @param {Object} knowledgeItem - Adapted knowledge
   * @param {Object} context - Target context
   * @returns {Promise<Object>} Application result
   */
  async executeCodeIntegration(pattern, knowledgeItem, context) {
    // Use SIVS if available for code integration
    if (this.sivsClient) {
      try {
        const validationResult = await this.sivsClient.validateIntegration({
          code: knowledgeItem.content,
          context: context
        });
        
        if (!validationResult.isValid) {
          return {
            success: false,
            error: 'Code integration validation failed',
            validationMessages: validationResult.messages
          };
        }
      } catch (error) {
        console.error('Failed to validate code integration:', error);
        // Continue with integration despite validation failure
      }
    }
    
    // Mock code integration result
    return {
      success: true,
      outputArtifacts: [{
        type: 'code_snippet',
        content: knowledgeItem.content
      }]
    };
  }
  
  /**
   * Execute a documentation generation pattern
   * @param {Object} pattern - Application pattern
   * @param {Object} knowledgeItem - Adapted knowledge
   * @param {Object} context - Target context
   * @returns {Promise<Object>} Application result
   */
  async executeDocumentationGeneration(pattern, knowledgeItem, context) {
    // Log documentation to ConPort if client is available
    if (this.conportClient) {
      try {
        await this.conportClient.logCustomData({
          category: 'Documentation',
          key: `${context.task}-${new Date().toISOString()}`,
          value: {
            content: knowledgeItem.content,
            source: knowledgeItem.id,
            generatedAt: new Date().toISOString(),
            context: {
              domain: context.domain,
              task: context.task
            }
          }
        });
      } catch (error) {
        console.error('Failed to log documentation to ConPort:', error);
      }
    }
    
    // Mock documentation generation result
    return {
      success: true,
      outputArtifacts: [{
        type: 'documentation',
        content: knowledgeItem.content
      }]
    };
  }
  
  /**
   * Execute a decision support pattern
   * @param {Object} pattern - Application pattern
   * @param {Object} knowledgeItem - Adapted knowledge
   * @param {Object} context - Target context
   * @returns {Promise<Object>} Application result
   */
  async executeDecisionSupport(pattern, knowledgeItem, context) {
    // Log decision to ConPort if client is available
    if (this.conportClient) {
      try {
        await this.conportClient.logDecision({
          summary: `Decision support for ${context.task} in ${context.domain} domain`,
          rationale: knowledgeItem.content,
          tags: ['AKAF-generated', `domain:${context.domain}`, `task:${context.task}`]
        });
      } catch (error) {
        console.error('Failed to log decision to ConPort:', error);
      }
    }
    
    // Mock decision support result
    return {
      success: true,
      outputArtifacts: [{
        type: 'decision_guidance',
        content: knowledgeItem.content
      }]
    };
  }
  
  /**
   * Execute a generic application pattern
   * @param {Object} pattern - Application pattern
   * @param {Object} knowledgeItem - Adapted knowledge
   * @param {Object} context - Target context
   * @returns {Promise<Object>} Application result
   */
  async executeGenericPattern(pattern, knowledgeItem, context) {
    // Execute pattern steps in sequence
    const results = [];
    let success = true;
    
    if (pattern.steps && Array.isArray(pattern.steps)) {
      for (const step of pattern.steps) {
        try {
          const stepResult = await this.executePatternStep(step, knowledgeItem, context);
          results.push(stepResult);
          
          if (!stepResult.success) {
            success = false;
          }
        } catch (error) {
          results.push({
            action: step.action,
            success: false,
            error: error.message
          });
          success = false;
        }
      }
    }
    
    return {
      success,
      stepResults: results,
      outputArtifacts: results
        .filter(r => r.success && r.artifact)
        .map(r => r.artifact)
    };
  }
  
  /**
   * Execute a single pattern step
   * @param {Object} step - Pattern step
   * @param {Object} knowledgeItem - Adapted knowledge
   * @param {Object} context - Target context
   * @returns {Promise<Object>} Step execution result
   */
  async executePatternStep(step, knowledgeItem, context) {
    // In a real implementation, this would execute the step based on its action
    // For now, return a mock success result
    return {
      action: step.action,
      success: true,
      artifact: {
        type: 'generic',
        content: `Result of executing ${step.action}`
      }
    };
  }
}

/**
 * ConPort-based feedback collector
 */
class ConPortFeedbackCollector {
  constructor(conportClient) {
    this.conportClient = conportClient;
  }
  
  /**
   * Collect application feedback and store in ConPort
   * @param {Object} applicationResults - Application results
   * @param {Object} context - Target context
   */
  collectApplicationFeedback(applicationResults, context) {
    if (!this.conportClient) {
      return;
    }
    
    try {
      // Log application feedback to ConPort
      this.conportClient.logCustomData({
        category: 'AKAF_Feedback',
        key: `application-${Date.now()}`,
        value: {
          timestamp: new Date().toISOString(),
          context: {
            id: context.id,
            domain: context.domain,
            task: context.task
          },
          results: {
            appliedCount: applicationResults.appliedItems ? applicationResults.appliedItems.length : 0,
            failedCount: applicationResults.failedApplications ? applicationResults.failedApplications.length : 0,
            overallSuccess: applicationResults.overallSuccess
          }
        }
      }).catch(error => {
        console.error('Failed to log application feedback to ConPort:', error);
      });
      
      // For successful applications, update knowledge quality metrics
      if (applicationResults.appliedItems && applicationResults.appliedItems.length > 0) {
        this.updateKnowledgeQualityMetrics(applicationResults.appliedItems)
          .catch(error => {
            console.error('Failed to update knowledge quality metrics:', error);
          });
      }
    } catch (error) {
      console.error('Error in feedback collection:', error);
    }
  }
  
  /**
   * Update knowledge quality metrics based on application results
   * @param {Array} appliedItems - Successfully applied knowledge items
   * @returns {Promise<void>}
   */
  async updateKnowledgeQualityMetrics(appliedItems) {
    if (!this.conportClient) {
      return;
    }
    
    try {
      // Get existing metrics
      const metricsData = await this.conportClient.getCustomData({
        category: 'AKAF_Metrics',
        key: 'knowledge_quality'
      }).catch(() => null);
      
      // Initialize metrics object
      let metrics = {
        appliedCount: 0,
        knowledgeTypes: {},
        domainMetrics: {}
      };
      
      // Update with existing data if available
      if (metricsData && metricsData.value) {
        metrics = metricsData.value;
      }
      
      // Update metrics based on newly applied items
      metrics.appliedCount += appliedItems.length;
      
      for (const applied of appliedItems) {
        const item = applied.item;
        const type = item.type;
        const domain = item.domain;
        
        // Update knowledge type metrics
        metrics.knowledgeTypes[type] = metrics.knowledgeTypes[type] || { count: 0, successRate: 0 };
        metrics.knowledgeTypes[type].count++;
        metrics.knowledgeTypes[type].successRate = 
          (metrics.knowledgeTypes[type].successRate * (metrics.knowledgeTypes[type].count - 1) + 
           (applied.result.success ? 1 : 0)) / 
          metrics.knowledgeTypes[type].count;
        
        // Update domain metrics
        if (domain) {
          metrics.domainMetrics[domain] = metrics.domainMetrics[domain] || { count: 0, successRate: 0 };
          metrics.domainMetrics[domain].count++;
          metrics.domainMetrics[domain].successRate = 
            (metrics.domainMetrics[domain].successRate * (metrics.domainMetrics[domain].count - 1) + 
             (applied.result.success ? 1 : 0)) / 
            metrics.domainMetrics[domain].count;
        }
      }
      
      // Save updated metrics
      await this.conportClient.logCustomData({
        category: 'AKAF_Metrics',
        key: 'knowledge_quality',
        value: metrics
      });
    } catch (error) {
      console.error('Failed to update knowledge quality metrics:', error);
    }
  }
}

module.exports = {
  AKAFIntegration,
  ConPortKnowledgeRetriever,
  ConPortStrategySelector,
  IntegratedApplicationEngine,
  ConPortFeedbackCollector
};