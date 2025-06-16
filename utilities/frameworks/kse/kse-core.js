/**
 * Knowledge Synthesis Engine (KSE) - Core Layer
 * 
 * This module provides the core functionality for knowledge synthesis,
 * managing synthesis strategies, applying rules, tracking provenance,
 * and preserving context during knowledge transformation.
 */

// Utility for generating unique identifiers
const generateId = () => `kse-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

/**
 * Main orchestrator for knowledge synthesis operations
 */
class KnowledgeSynthesizer {
  /**
   * Creates a new knowledge synthesizer
   * @param {Object} options Configuration options
   * @param {SynthesisStrategyRegistry} options.strategyRegistry Strategy registry (required)
   * @param {SynthesisRuleEngine} options.ruleEngine Rule engine (required)
   * @param {ProvenanceTracker} options.provenanceTracker Provenance tracker (required)
   * @param {ContextPreservationService} options.contextService Context preservation service (required)
   * @param {SemanticAnalyzer} options.semanticAnalyzer Semantic analyzer (optional)
   * @param {boolean} [options.validateInputs=true] Whether to validate inputs automatically
   * @param {boolean} [options.validateResults=true] Whether to validate results automatically
   */
  constructor(options = {}) {
    if (!options.strategyRegistry) {
      throw new Error('KnowledgeSynthesizer requires a strategyRegistry');
    }
    if (!options.ruleEngine) {
      throw new Error('KnowledgeSynthesizer requires a ruleEngine');
    }
    if (!options.provenanceTracker) {
      throw new Error('KnowledgeSynthesizer requires a provenanceTracker');
    }
    if (!options.contextService) {
      throw new Error('KnowledgeSynthesizer requires a contextService');
    }
    
    this.strategyRegistry = options.strategyRegistry;
    this.ruleEngine = options.ruleEngine;
    this.provenanceTracker = options.provenanceTracker;
    this.contextService = options.contextService;
    this.semanticAnalyzer = options.semanticAnalyzer;
    
    this.options = {
      validateInputs: true,
      validateResults: true,
      ...options
    };
    
    // Load default strategies
    this._loadDefaultStrategies();
  }
  
  /**
   * Synthesizes knowledge from artifacts using the specified strategy
   * @param {Object} params Synthesis parameters
   * @param {Array<Object>} params.artifacts Knowledge artifacts to synthesize
   * @param {string} params.strategyName Name of the synthesis strategy to use
   * @param {Object} [params.strategyParams={}] Strategy-specific parameters
   * @param {Object} [params.context={}] Additional context for synthesis
   * @param {boolean} [params.preserveContext=true] Whether to preserve context from artifacts
   * @returns {Promise<Object>} Synthesis result with provenance information
   */
  async synthesize(params) {
    const {
      artifacts,
      strategyName,
      strategyParams = {},
      context = {},
      preserveContext = true
    } = params;
    
    if (!artifacts || !Array.isArray(artifacts) || artifacts.length === 0) {
      throw new Error('Synthesis requires non-empty artifacts array');
    }
    
    if (!strategyName) {
      throw new Error('Synthesis requires a strategyName');
    }
    
    // Get strategy from registry
    const strategy = this.strategyRegistry.getStrategy(strategyName);
    if (!strategy) {
      throw new Error(`Strategy not found: ${strategyName}`);
    }
    
    // Validate strategy supports these artifact types
    const capabilities = strategy.getCapabilities();
    if (!this._validateStrategySupport(artifacts, capabilities)) {
      throw new Error(`Strategy ${strategyName} does not support all provided artifact types`);
    }
    
    // Validate inputs if option enabled
    if (this.options.validateInputs) {
      const { valid, errors } = this._validateInputs(artifacts);
      if (!valid) {
        throw new Error(`Invalid synthesis input: ${errors.join(', ')}`);
      }
    }
    
    // Prepare context-enhanced artifacts if preserveContext is true
    let enhancedArtifacts = artifacts;
    if (preserveContext) {
      enhancedArtifacts = await this.contextService.enhanceWithContext(artifacts, context);
    }
    
    // Perform semantic analysis if available
    if (this.semanticAnalyzer) {
      const analysisResults = await this.semanticAnalyzer.analyzeArtifacts(enhancedArtifacts);
      enhancedArtifacts = enhancedArtifacts.map((artifact, index) => ({
        ...artifact,
        semanticAnalysis: analysisResults[index]
      }));
    }
    
    // Apply the synthesis strategy
    const synthesisResult = await strategy.synthesize(enhancedArtifacts, strategyParams, context);
    
    // Track provenance
    const enhancedResult = this.provenanceTracker.addProvenance({
      result: synthesisResult,
      sourceArtifacts: artifacts,
      strategy: strategyName,
      strategyParams,
      context
    });
    
    // Validate result if option enabled
    if (this.options.validateResults) {
      const { valid, errors } = this._validateResult(enhancedResult, artifacts);
      if (!valid) {
        console.warn(`Synthesis result validation warnings: ${errors.join(', ')}`);
      }
    }
    
    return enhancedResult;
  }
  
  /**
   * Recommends the best synthesis strategy for given artifacts
   * @param {Array<Object>} artifacts Knowledge artifacts to synthesize
   * @param {Object} [context={}] Additional context to consider
   * @returns {Object} Recommended strategy information with confidence score
   */
  recommendStrategy(artifacts, context = {}) {
    if (!artifacts || !Array.isArray(artifacts) || artifacts.length === 0) {
      throw new Error('Strategy recommendation requires non-empty artifacts array');
    }
    
    // Get artifact types
    const artifactTypes = new Set(artifacts.map(a => a.type));
    
    // Get all available strategies
    const strategies = this.strategyRegistry.getAllStrategies();
    
    // Score each strategy
    const scores = Object.entries(strategies).map(([name, strategy]) => {
      const capabilities = strategy.getCapabilities();
      
      // Base score on type support
      let score = 0;
      let supportedTypes = 0;
      
      // Check if strategy supports all required artifact types
      for (const type of artifactTypes) {
        if (capabilities.supportedArtifactTypes.includes(type)) {
          supportedTypes++;
        }
      }
      
      // Calculate basic type coverage score
      score = supportedTypes / artifactTypes.size;
      
      // If strategy doesn't support all types, it's not usable
      if (score < 1) {
        return { name, score: 0 };
      }
      
      // Additional scoring based on strategy metadata
      if (capabilities.preferredArtifactCount) {
        // Score based on preferred artifact count
        const countDiff = Math.abs(capabilities.preferredArtifactCount - artifacts.length);
        const countScore = Math.max(0, 1 - (countDiff / 10)); // Decreases as difference increases
        score *= 0.7 + (countScore * 0.3); // Weight count as 30% of score
      }
      
      // Score based on specialization tags if available
      if (capabilities.specializedFor && artifacts.some(a => a.tags)) {
        const allTags = new Set();
        artifacts.forEach(a => {
          if (Array.isArray(a.tags)) {
            a.tags.forEach(tag => allTags.add(tag));
          }
        });
        
        // Check for overlap between artifact tags and strategy specialization
        const specializedTags = new Set(capabilities.specializedFor);
        const overlappingTags = [...allTags].filter(tag => specializedTags.has(tag));
        
        if (overlappingTags.length > 0) {
          // Boost score based on tag overlap
          const tagBoost = Math.min(0.3, overlappingTags.length / specializedTags.size * 0.3);
          score += tagBoost;
        }
      }
      
      return { name, score: Math.min(1, score) };
    });
    
    // Sort by score
    scores.sort((a, b) => b.score - a.score);
    
    // Get top recommendation
    const topRecommendation = scores[0];
    
    if (topRecommendation.score === 0) {
      return {
        strategyName: null,
        confidence: 0,
        message: 'No compatible strategies found for these artifact types'
      };
    }
    
    return {
      strategyName: topRecommendation.name,
      confidence: topRecommendation.score,
      message: `Recommended strategy: ${topRecommendation.name} (confidence: ${(topRecommendation.score * 100).toFixed(0)}%)`
    };
  }
  
  /**
   * Creates a continuous synthesis pipeline
   * @param {Object} params Pipeline parameters
   * @param {Function} params.artifactSource Function that returns artifacts to synthesize
   * @param {string|Function} params.strategySelector Strategy name or function to select strategy
   * @param {Function} params.resultHandler Function to handle synthesis results
   * @param {Object} [params.options={}] Pipeline options
   * @returns {Object} Pipeline control object with start/stop methods
   */
  createContinuousPipeline(params) {
    const {
      artifactSource,
      strategySelector,
      resultHandler,
      options = {}
    } = params;
    
    if (!artifactSource || typeof artifactSource !== 'function') {
      throw new Error('Pipeline requires an artifactSource function');
    }
    
    if (!strategySelector || (typeof strategySelector !== 'string' && typeof strategySelector !== 'function')) {
      throw new Error('Pipeline requires a strategySelector (string or function)');
    }
    
    if (!resultHandler || typeof resultHandler !== 'function') {
      throw new Error('Pipeline requires a resultHandler function');
    }
    
    // Default pipeline options
    const pipelineOptions = {
      interval: 60000, // 1 minute
      maxBatchSize: 50,
      autoStart: false,
      errorHandler: (err) => console.error('Pipeline error:', err),
      ...options
    };
    
    let intervalId = null;
    let isRunning = false;
    
    // Pipeline execution function
    const executePipeline = async () => {
      if (!isRunning) return;
      
      try {
        // Get artifacts from source
        const artifacts = await Promise.resolve(artifactSource());
        
        if (!artifacts || artifacts.length === 0) {
          return; // No artifacts to process
        }
        
        // Apply batch size limit
        const batchedArtifacts = artifacts.slice(0, pipelineOptions.maxBatchSize);
        
        // Determine strategy
        let strategyName;
        let strategyParams = {};
        
        if (typeof strategySelector === 'string') {
          strategyName = strategySelector;
        } else {
          const strategyResult = await Promise.resolve(strategySelector(batchedArtifacts));
          if (typeof strategyResult === 'string') {
            strategyName = strategyResult;
          } else {
            strategyName = strategyResult.strategyName;
            strategyParams = strategyResult.strategyParams || {};
          }
        }
        
        // Perform synthesis
        const result = await this.synthesize({
          artifacts: batchedArtifacts,
          strategyName,
          strategyParams,
          context: pipelineOptions.context || {}
        });
        
        // Handle result
        await Promise.resolve(resultHandler(result, batchedArtifacts));
      } catch (error) {
        pipelineOptions.errorHandler(error);
      }
    };
    
    // Pipeline control object
    const pipelineControl = {
      start: () => {
        if (!isRunning) {
          isRunning = true;
          executePipeline(); // Run immediately
          intervalId = setInterval(executePipeline, pipelineOptions.interval);
        }
        return pipelineControl;
      },
      stop: () => {
        if (isRunning) {
          isRunning = false;
          clearInterval(intervalId);
          intervalId = null;
        }
        return pipelineControl;
      },
      isRunning: () => isRunning,
      setInterval: (newInterval) => {
        pipelineOptions.interval = newInterval;
        if (isRunning) {
          clearInterval(intervalId);
          intervalId = setInterval(executePipeline, newInterval);
        }
        return pipelineControl;
      },
      execute: async () => {
        try {
          await executePipeline();
          return true;
        } catch (error) {
          pipelineOptions.errorHandler(error);
          return false;
        }
      }
    };
    
    // Auto-start if configured
    if (pipelineOptions.autoStart) {
      pipelineControl.start();
    }
    
    return pipelineControl;
  }
  
  /**
   * Validates that a strategy supports all provided artifact types
   * @private
   * @param {Array<Object>} artifacts Knowledge artifacts
   * @param {Object} capabilities Strategy capabilities
   * @returns {boolean} Whether the strategy supports all artifact types
   */
  _validateStrategySupport(artifacts, capabilities) {
    const artifactTypes = new Set(artifacts.map(a => a.type));
    
    for (const type of artifactTypes) {
      if (!capabilities.supportedArtifactTypes.includes(type)) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Validates synthesis inputs
   * @private
   * @param {Array<Object>} artifacts Knowledge artifacts
   * @returns {Object} Validation result with { valid, errors }
   */
  _validateInputs(artifacts) {
    const errors = [];
    
    // Basic validation
    if (!artifacts.every(a => a && typeof a === 'object')) {
      errors.push('All artifacts must be non-null objects');
    }
    
    // Check for required fields
    artifacts.forEach((artifact, index) => {
      if (!artifact.id && !artifact._id) {
        errors.push(`Artifact at index ${index} is missing an ID field`);
      }
      
      if (!artifact.type) {
        errors.push(`Artifact at index ${index} is missing a type field`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Validates synthesis results
   * @private
   * @param {Object} result Synthesis result
   * @param {Array<Object>} sourceArtifacts Source artifacts
   * @returns {Object} Validation result with { valid, errors }
   */
  _validateResult(result, sourceArtifacts) {
    const errors = [];
    
    // Basic validation
    if (!result || typeof result !== 'object') {
      errors.push('Result must be a non-null object');
      return { valid: false, errors };
    }
    
    // Check for required fields
    if (!result.id) {
      errors.push('Result is missing an ID field');
    }
    
    if (!result.type) {
      errors.push('Result is missing a type field');
    }
    
    if (!result.content && !result.value) {
      errors.push('Result must have either a content or value field');
    }
    
    // Check for provenance
    if (!result.provenance) {
      errors.push('Result is missing provenance information');
    } else {
      if (!Array.isArray(result.provenance.sources)) {
        errors.push('Result provenance must have a sources array');
      } else if (result.provenance.sources.length === 0) {
        errors.push('Result provenance has empty sources array');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Loads default synthesis strategies
   * @private
   */
  _loadDefaultStrategies() {
    // This would typically load built-in strategies
    // Implementation will depend on available strategies
  }
}

/**
 * Registry for synthesis strategies
 */
class SynthesisStrategyRegistry {
  /**
   * Creates a new synthesis strategy registry
   * @param {Object} options Configuration options
   * @param {boolean} [options.validateStrategies=true] Whether to validate strategies on registration
   */
  constructor(options = {}) {
    this.strategies = new Map();
    
    this.options = {
      validateStrategies: true,
      ...options
    };
    
    this.validator = options.validator;
  }
  
  /**
   * Registers a synthesis strategy
   * @param {string} name Strategy name
   * @param {Object} strategy Strategy implementation
   * @returns {boolean} Whether registration succeeded
   */
  registerStrategy(name, strategy) {
    if (!name || typeof name !== 'string') {
      throw new Error('Strategy name must be a non-empty string');
    }
    
    if (!strategy || typeof strategy !== 'object') {
      throw new Error('Strategy must be a non-null object');
    }
    
    // Validate strategy interface
    if (this.options.validateStrategies) {
      if (this.validator) {
        const validation = this.validator.validateStrategy(strategy, name);
        if (!validation.valid) {
          throw new Error(`Invalid strategy ${name}: ${validation.errors.join(', ')}`);
        }
      } else {
        // Basic validation if no validator provided
        this._validateStrategyInterface(name, strategy);
      }
    }
    
    this.strategies.set(name, strategy);
    return true;
  }
  
  /**
   * Gets a registered strategy by name
   * @param {string} name Strategy name
   * @returns {Object|null} Strategy implementation, or null if not found
   */
  getStrategy(name) {
    return this.strategies.get(name) || null;
  }
  
  /**
   * Checks if a strategy is registered
   * @param {string} name Strategy name
   * @returns {boolean} Whether the strategy is registered
   */
  hasStrategy(name) {
    return this.strategies.has(name);
  }
  
  /**
   * Unregisters a strategy
   * @param {string} name Strategy name
   * @returns {boolean} Whether unregistration succeeded
   */
  unregisterStrategy(name) {
    return this.strategies.delete(name);
  }
  
  /**
   * Gets all registered strategies
   * @returns {Object} Map of all registered strategies
   */
  getAllStrategies() {
    const result = {};
    for (const [name, strategy] of this.strategies) {
      result[name] = strategy;
    }
    return result;
  }
  
  /**
   * Gets strategies matching specific criteria
   * @param {Object} criteria Search criteria
   * @param {Array<string>} [criteria.artifactTypes] Artifact types to support
   * @param {Array<string>} [criteria.tags] Tags to match
   * @returns {Array<Object>} Matching strategies with their names
   */
  findStrategies(criteria = {}) {
    const matches = [];
    
    for (const [name, strategy] of this.strategies) {
      // Skip if strategy doesn't have getCapabilities method
      if (typeof strategy.getCapabilities !== 'function') {
        continue;
      }
      
      let isMatch = true;
      const capabilities = strategy.getCapabilities();
      
      // Match by artifact types if specified
      if (criteria.artifactTypes && Array.isArray(criteria.artifactTypes)) {
        if (!capabilities.supportedArtifactTypes) {
          isMatch = false;
        } else {
          // Check if strategy supports all required artifact types
          for (const type of criteria.artifactTypes) {
            if (!capabilities.supportedArtifactTypes.includes(type)) {
              isMatch = false;
              break;
            }
          }
        }
      }
      
      // Match by tags if specified and still matching
      if (isMatch && criteria.tags && Array.isArray(criteria.tags)) {
        if (!capabilities.tags || !Array.isArray(capabilities.tags)) {
          isMatch = false;
        } else {
          // Check if strategy has at least one of the required tags
          isMatch = criteria.tags.some(tag => capabilities.tags.includes(tag));
        }
      }
      
      if (isMatch) {
        matches.push({
          name,
          strategy,
          capabilities
        });
      }
    }
    
    return matches;
  }
  
  /**
   * Validates that a strategy implements the required interface
   * @private
   * @param {string} name Strategy name for error reporting
   * @param {Object} strategy Strategy to validate
   */
  _validateStrategyInterface(name, strategy) {
    // Check required methods
    const requiredMethods = ['synthesize', 'validateInputs', 'getCapabilities'];
    
    for (const method of requiredMethods) {
      if (typeof strategy[method] !== 'function') {
        throw new Error(`Strategy ${name} is missing required method: ${method}`);
      }
    }
    
    // Validate capabilities if available
    if (typeof strategy.getCapabilities === 'function') {
      try {
        const capabilities = strategy.getCapabilities();
        if (!capabilities || typeof capabilities !== 'object') {
          throw new Error(`Strategy ${name} getCapabilities() does not return an object`);
        }
        
        if (!Array.isArray(capabilities.supportedArtifactTypes)) {
          throw new Error(`Strategy ${name} must have supportedArtifactTypes in capabilities`);
        }
      } catch (error) {
        throw new Error(`Error validating strategy ${name} capabilities: ${error.message}`);
      }
    }
  }
}

/**
 * Rule-based engine for knowledge synthesis
 */
class SynthesisRuleEngine {
  /**
   * Creates a new synthesis rule engine
   * @param {Object} options Configuration options
   * @param {Object} [options.validator] Rule template validator
   * @param {boolean} [options.validateRules=true] Whether to validate rules
   * @param {boolean} [options.strictExecution=false] Whether to use strict rule execution
   */
  constructor(options = {}) {
    this.ruleTemplates = new Map();
    this.activeRules = new Map();
    
    this.options = {
      validateRules: true,
      strictExecution: false,
      ...options
    };
    
    this.validator = options.validator;
  }
  
  /**
   * Registers a rule template
   * @param {Object} template Rule template
   * @returns {string} Template ID
   */
  registerTemplate(template) {
    if (!template || typeof template !== 'object') {
      throw new Error('Rule template must be a non-null object');
    }
    
    // Validate template
    if (this.options.validateRules && this.validator) {
      const validation = this.validator.validateTemplate(template);
      if (!validation.valid) {
        throw new Error(`Invalid rule template: ${validation.errors.join(', ')}`);
      }
    }
    
    // Generate ID if not provided
    const id = template.id || `template-${generateId()}`;
    
    this.ruleTemplates.set(id, {
      ...template,
      id
    });
    
    return id;
  }
  
  /**
   * Gets a rule template by ID
   * @param {string} id Template ID
   * @returns {Object|null} Rule template, or null if not found
   */
  getTemplate(id) {
    return this.ruleTemplates.get(id) || null;
  }
  
  /**
   * Lists all registered rule templates
   * @returns {Array<Object>} All registered rule templates
   */
  listTemplates() {
    return Array.from(this.ruleTemplates.values());
  }
  
  /**
   * Activates rules from a template
   * @param {string} templateId Template ID
   * @param {Object} context Context for rule activation
   * @returns {Array<string>} IDs of activated rules
   */
  activateRules(templateId, context = {}) {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }
    
    const activatedRuleIds = [];
    
    // Process each rule in the template
    template.rules.forEach(rule => {
      const ruleId = `${templateId}-rule-${rule.id || generateId()}`;
      
      // Create active rule
      const activeRule = {
        ...rule,
        id: ruleId,
        templateId,
        context,
        createdAt: new Date().toISOString(),
        enabled: true
      };
      
      // Compile rule conditions and actions if needed
      this._compileRule(activeRule);
      
      // Store the active rule
      this.activeRules.set(ruleId, activeRule);
      activatedRuleIds.push(ruleId);
    });
    
    return activatedRuleIds;
  }
  
  /**
   * Deactivates rules
   * @param {Array<string>} ruleIds Rule IDs to deactivate
   * @returns {number} Number of rules deactivated
   */
  deactivateRules(ruleIds) {
    let count = 0;
    
    ruleIds.forEach(id => {
      if (this.activeRules.delete(id)) {
        count++;
      }
    });
    
    return count;
  }
  
  /**
   * Applies rules to artifacts
   * @param {Array<Object>} artifacts Knowledge artifacts to process
   * @param {Object} context Execution context
   * @returns {Object} Processing results
   */
  applyRules(artifacts, context = {}) {
    if (!artifacts || !Array.isArray(artifacts)) {
      throw new Error('Artifacts must be an array');
    }
    
    const results = {
      processedArtifacts: [],
      rulesMatched: 0,
      rulesExecuted: 0,
      transformations: [],
      errors: []
    };
    
    // Create mutable copies of artifacts to work with
    const workingArtifacts = artifacts.map(a => ({ ...a }));
    
    // Get all active rules
    const rules = Array.from(this.activeRules.values())
      .filter(rule => rule.enabled)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0)); // Higher priority rules first
    
    // Apply each rule
    rules.forEach(rule => {
      try {
        // Check if rule condition matches
        const conditionMatches = this._evaluateCondition(rule, workingArtifacts, context);
        
        if (conditionMatches) {
          results.rulesMatched++;
          
          // Execute rule action
          const actionResult = this._executeAction(rule, workingArtifacts, context);
          
          // Track transformation
          results.transformations.push({
            ruleId: rule.id,
            description: rule.description || 'Rule applied',
            result: actionResult
          });
          
          results.rulesExecuted++;
        }
      } catch (error) {
        results.errors.push({
          ruleId: rule.id,
          error: error.message
        });
        
        if (this.options.strictExecution) {
          throw new Error(`Error executing rule ${rule.id}: ${error.message}`);
        }
      }
    });
    
    // Update processed artifacts
    results.processedArtifacts = workingArtifacts;
    
    return results;
  }
  
  /**
   * Evaluates a rule's condition
   * @private
   * @param {Object} rule Rule to evaluate
   * @param {Array<Object>} artifacts Knowledge artifacts
   * @param {Object} context Execution context
   * @returns {boolean} Whether the condition matches
   */
  _evaluateCondition(rule, artifacts, context) {
    const condition = rule.condition;
    
    // No condition means always match
    if (!condition) {
      return true;
    }
    
    // Handle compiled function conditions
    if (rule._compiledCondition) {
      try {
        return rule._compiledCondition(artifacts, context);
      } catch (error) {
        throw new Error(`Error evaluating condition for rule ${rule.id}: ${error.message}`);
      }
    }
    
    // Handle object conditions
    if (typeof condition === 'object') {
      switch (condition.type) {
        case 'exists':
          return artifacts.some(artifact => {
            const field = condition.field.split('.');
            return this._getNestedProperty(artifact, field) !== undefined;
          });
          
        case 'equals':
          return artifacts.some(artifact => {
            const field = condition.field.split('.');
            const value = this._getNestedProperty(artifact, field);
            return value === condition.value;
          });
          
        case 'custom':
          if (condition.code) {
            try {
              // Create function from code
              const conditionFn = new Function('artifacts', 'context', `return ${condition.code}`);
              return conditionFn(artifacts, context);
            } catch (error) {
              throw new Error(`Error evaluating custom condition: ${error.message}`);
            }
          }
          break;
          
        default:
          throw new Error(`Unknown condition type: ${condition.type}`);
      }
    }
    
    // Handle string conditions (assumed to be code)
    if (typeof condition === 'string') {
      try {
        // Create function from code
        const conditionFn = new Function('artifacts', 'context', `return ${condition}`);
        return conditionFn(artifacts, context);
      } catch (error) {
        throw new Error(`Error evaluating condition code: ${error.message}`);
      }
    }
    
    return false;
  }
  
  /**
   * Executes a rule's action
   * @private
   * @param {Object} rule Rule to execute
   * @param {Array<Object>} artifacts Knowledge artifacts
   * @param {Object} context Execution context
   * @returns {Object} Action result
   */
  _executeAction(rule, artifacts, context) {
    const action = rule.action;
    
    // Handle compiled function actions
    if (rule._compiledAction) {
      try {
        return rule._compiledAction(artifacts, context);
      } catch (error) {
        throw new Error(`Error executing action for rule ${rule.id}: ${error.message}`);
      }
    }
    
    // Handle object actions
    if (typeof action === 'object') {
      switch (action.type) {
        case 'merge':
          // Merge artifacts into a single object
          return {
            type: 'merged',
            artifact: artifacts.reduce((result, artifact) => ({ ...result, ...artifact }), {})
          };
          
        case 'filter':
          // Filter artifacts based on predicate
          if (action.code) {
            try {
              const filterFn = new Function('artifact', 'index', 'artifacts', 'context', `return ${action.code}`);
              const filtered = artifacts.filter((artifact, index) => filterFn(artifact, index, artifacts, context));
              return {
                type: 'filtered',
                artifacts: filtered
              };
            } catch (error) {
              throw new Error(`Error executing filter action: ${error.message}`);
            }
          }
          break;
          
        case 'transform':
          // Transform each artifact
          if (action.code) {
            try {
              const transformFn = new Function('artifact', 'index', 'artifacts', 'context', `return ${action.code}`);
              const transformed = artifacts.map((artifact, index) => transformFn(artifact, index, artifacts, context));
              return {
                type: 'transformed',
                artifacts: transformed
              };
            } catch (error) {
              throw new Error(`Error executing transform action: ${error.message}`);
            }
          }
          break;
          
        case 'custom':
          if (action.code) {
            try {
              const actionFn = new Function('artifacts', 'context', action.code);
              return actionFn(artifacts, context);
            } catch (error) {
              throw new Error(`Error executing custom action: ${error.message}`);
            }
          }
          break;
          
        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }
    }
    
    // Handle string actions (assumed to be code)
    if (typeof action === 'string') {
      try {
        const actionFn = new Function('artifacts', 'context', action);
        return actionFn(artifacts, context);
      } catch (error) {
        throw new Error(`Error executing action code: ${error.message}`);
      }
    }
    
    return { type: 'noop' };
  }
  
  /**
   * Compiles a rule's conditions and actions for better performance
   * @private
   * @param {Object} rule Rule to compile
   */
  _compileRule(rule) {
    // Compile condition if it's a string
    if (typeof rule.condition === 'string') {
      try {
        rule._compiledCondition = new Function('artifacts', 'context', `return ${rule.condition}`);
      } catch (error) {
        throw new Error(`Error compiling condition for rule ${rule.id}: ${error.message}`);
      }
    } else if (rule.condition && rule.condition.type === 'custom' && rule.condition.code) {
      try {
        rule._compiledCondition = new Function('artifacts', 'context', `return ${rule.condition.code}`);
      } catch (error) {
        throw new Error(`Error compiling custom condition for rule ${rule.id}: ${error.message}`);
      }
    }
    
    // Compile action if it's a string
    if (typeof rule.action === 'string') {
      try {
        rule._compiledAction = new Function('artifacts', 'context', rule.action);
      } catch (error) {
        throw new Error(`Error compiling action for rule ${rule.id}: ${error.message}`);
      }
    } else if (rule.action && rule.action.type === 'custom' && rule.action.code) {
      try {
        rule._compiledAction = new Function('artifacts', 'context', rule.action.code);
      } catch (error) {
        throw new Error(`Error compiling custom action for rule ${rule.id}: ${error.message}`);
      }
    }
  }
  
  /**
   * Gets a nested property from an object
   * @private
   * @param {Object} obj Object to get property from
   * @param {Array<string>} path Property path
   * @returns {*} Property value, or undefined if not found
   */
  _getNestedProperty(obj, path) {
    let current = obj;
    
    for (const key of path) {
      if (current === undefined || current === null) {
        return undefined;
      }
      
      current = current[key];
    }
    
    return current;
  }
}

/**
 * Handles composition of knowledge artifacts into unified representations
 */
class KnowledgeCompositionManager {
  /**
   * Creates a new knowledge composition manager
   * @param {Object} options Configuration options
   * @param {SynthesisRuleEngine} [options.ruleEngine] Rule engine to use
   * @param {ContextPreservationService} [options.contextService] Context service to use
   */
  constructor(options = {}) {
    this.ruleEngine = options.ruleEngine;
    this.contextService = options.contextService;
    
    this.options = {
      ...options
    };
    
    // Composition methods registry
    this.methods = new Map();
    
    // Register default methods
    this._registerDefaultMethods();
  }
  
  /**
   * Composes artifacts into a unified representation
   * @param {Array<Object>} artifacts Artifacts to compose
   * @param {string} method Composition method
   * @param {Object} [options={}] Composition options
   * @returns {Object} Composed artifact with source references
   */
  composeArtifacts(artifacts, method, options = {}) {
    if (!artifacts || !Array.isArray(artifacts) || artifacts.length === 0) {
      throw new Error('Composition requires non-empty artifacts array');
    }
    
    if (!method) {
      throw new Error('Composition requires a method name');
    }
    
    const compositionMethod = this.methods.get(method);
    if (!compositionMethod) {
      throw new Error(`Unknown composition method: ${method}`);
    }
    
    return compositionMethod.compose(artifacts, options);
  }
  
  /**
   * Registers a composition method
   * @param {string} name Method name
   * @param {Object} method Method implementation
   * @returns {boolean} Whether registration succeeded
   */
  registerMethod(name, method) {
    if (!name || typeof name !== 'string') {
      throw new Error('Method name must be a non-empty string');
    }
    
    if (!method || typeof method !== 'object' || typeof method.compose !== 'function') {
      throw new Error('Method must be an object with a compose function');
    }
    
    this.methods.set(name, method);
    return true;
  }
  
  /**
   * Gets a registered composition method
   * @param {string} name Method name
   * @returns {Object|null} Method implementation, or null if not found
   */
  getMethod(name) {
    return this.methods.get(name) || null;
  }
  
  /**
   * Lists all registered composition methods
   * @returns {Array<Object>} All registered composition methods with their names
   */
  listMethods() {
    return Array.from(this.methods.entries()).map(([name, method]) => ({
      name,
      description: method.description || '',
      capabilities: method.getCapabilities ? method.getCapabilities() : {}
    }));
  }
  
  /**
   * Decomposes a previously composed artifact
   * @param {Object} composedArtifact The composed artifact to decompose
   * @returns {Array<Object>} Original constituent artifacts
   */
  decomposeArtifact(composedArtifact) {
    if (!composedArtifact || typeof composedArtifact !== 'object') {
      throw new Error('Decomposition requires a non-null object');
    }
    
    // Check if this is a composed artifact
    if (!composedArtifact.composition || !composedArtifact.composition.method) {
      throw new Error('Artifact does not appear to be a composition');
    }
    
    // Get the composition method used
    const methodName = composedArtifact.composition.method;
    const method = this.getMethod(methodName);
    
    if (!method || typeof method.decompose !== 'function') {
      throw new Error(`Cannot decompose: Method '${methodName}' not found or doesn't support decomposition`);
    }
    
    return method.decompose(composedArtifact);
  }
  
  /**
   * Registers default composition methods
   * @private
   */
  _registerDefaultMethods() {
    // Aggregation method - combines similar artifacts
    this.registerMethod('aggregate', {
      description: 'Combines multiple artifacts with similar structure into a single view',
      getCapabilities: () => ({
        supportedArtifactTypes: ['*'],
        preservesStructure: true,
        isReversible: true
      }),
      compose: (artifacts, options = {}) => {
        const fields = new Map();
        const result = {
          id: `composite-${generateId()}`,
          type: 'composite',
          composition: {
            method: 'aggregate',
            timestamp: new Date().toISOString(),
            sources: artifacts.map(a => ({ id: a.id || a._id, type: a.type })),
            options
          }
        };
        
        // Identify common fields
        artifacts.forEach(artifact => {
          Object.keys(artifact).forEach(key => {
            if (key === 'id' || key === '_id' || key === 'type') return;
            
            if (!fields.has(key)) {
              fields.set(key, []);
            }
            
            fields.get(key).push(artifact[key]);
          });
        });
        
        // Process fields according to type
        for (const [key, values] of fields) {
          const firstValue = values[0];
          const allSame = values.every(v => JSON.stringify(v) === JSON.stringify(firstValue));
          
          if (allSame) {
            // If all values are the same, use that value
            result[key] = firstValue;
          } else if (Array.isArray(firstValue)) {
            // For arrays, concatenate all values
            result[key] = [].concat(...values);
          } else if (typeof firstValue === 'string') {
            // For strings, join with separator
            result[key] = values.join(options.stringSeparator || '\n\n');
          } else if (typeof firstValue === 'number') {
            // For numbers, use average, sum, min, or max based on options
            const numberOp = options.numberOperation || 'average';
            switch (numberOp) {
              case 'sum':
                result[key] = values.reduce((sum, v) => sum + v, 0);
                break;
              case 'min':
                result[key] = Math.min(...values);
                break;
              case 'max':
                result[key] = Math.max(...values);
                break;
              case 'average':
              default:
                result[key] = values.reduce((sum, v) => sum + v, 0) / values.length;
                break;
            }
          } else if (typeof firstValue === 'object' && firstValue !== null) {
            // For objects, merge recursively
            result[key] = values.reduce((merged, obj) => this._deepMerge(merged, obj), {});
          } else {
            // For other types, store as array
            result[key] = values;
          }
        }
        
        return result;
      },
      decompose: (composedArtifact) => {
        // Decomposition not fully supported for aggregate method
        // We can only provide basic structure, but not fully restore original artifacts
        if (!composedArtifact.composition || !composedArtifact.composition.sources) {
          throw new Error('Cannot decompose: Missing composition sources');
        }
        
        // Create skeletal artifacts based on sources
        return composedArtifact.composition.sources.map(source => ({
          id: source.id,
          type: source.type,
          _reconstructed: true
        }));
      }
    });
    
    // Hierarchical composition method
    this.registerMethod('hierarchical', {
      description: 'Creates a hierarchical structure from related artifacts',
      getCapabilities: () => ({
        supportedArtifactTypes: ['*'],
        preservesStructure: false,
        isReversible: false,
        requiresRelationships: true
      }),
      compose: (artifacts, options = {}) => {
        const parentField = options.parentField || 'parent_id';
        const childrenField = options.childrenField || 'children';
        const rootPredicate = options.rootPredicate || (a => !a[parentField]);
        
        // Identify the root artifacts
        const rootArtifacts = artifacts.filter(rootPredicate);
        
        // Create a map for looking up artifacts by ID
        const artifactMap = new Map();
        artifacts.forEach(a => {
          artifactMap.set(a.id || a._id, a);
        });
        
        // Function to build tree recursively
        const buildTree = (rootItem) => {
          const result = { ...rootItem };
          result[childrenField] = [];
          
          // Find children by parent ID
          artifacts.forEach(a => {
            if (a[parentField] === (rootItem.id || rootItem._id)) {
              result[childrenField].push(buildTree(a));
            }
          });
          
          return result;
        };
        
        // Build trees from all root artifacts
        const trees = rootArtifacts.map(buildTree);
        
        // Return the composed result
        return {
          id: `composite-${generateId()}`,
          type: 'hierarchical',
          composition: {
            method: 'hierarchical',
            timestamp: new Date().toISOString(),
            sources: artifacts.map(a => ({ id: a.id || a._id, type: a.type })),
            options
          },
          hierarchies: trees
        };
      }
    });
    
    // Temporal sequence method
    this.registerMethod('temporal', {
      description: 'Organizes artifacts into a temporal sequence or narrative',
      getCapabilities: () => ({
        supportedArtifactTypes: ['*'],
        preservesStructure: true,
        isReversible: true
      }),
      compose: (artifacts, options = {}) => {
        const timestampField = options.timestampField || 'timestamp';
        const sortField = options.sortField || timestampField;
        const direction = options.direction || 'ascending';
        
        // Sort artifacts by timestamp
        const sorted = [...artifacts].sort((a, b) => {
          const aValue = a[sortField];
          const bValue = b[sortField];
          
          if (!aValue) return direction === 'ascending' ? -1 : 1;
          if (!bValue) return direction === 'ascending' ? 1 : -1;
          
          const comparison = aValue < bValue ? -1 : (aValue > bValue ? 1 : 0);
          return direction === 'ascending' ? comparison : -comparison;
        });
        
        // Return the composed result
        return {
          id: `composite-${generateId()}`,
          type: 'temporal',
          composition: {
            method: 'temporal',
            timestamp: new Date().toISOString(),
            sources: artifacts.map(a => ({ id: a.id || a._id, type: a.type })),
            options
          },
          sequence: sorted.map(a => ({
            id: a.id || a._id,
            type: a.type,
            timestamp: a[timestampField],
            content: a
          }))
        };
      },
      decompose: (composedArtifact) => {
        // Simple decomposition by extracting sequence content
        if (!composedArtifact.sequence || !Array.isArray(composedArtifact.sequence)) {
          throw new Error('Cannot decompose: Missing or invalid sequence');
        }
        
        return composedArtifact.sequence.map(item => item.content);
      }
    });
  }
  
  /**
   * Deep merges two objects
   * @private
   * @param {Object} target Target object
   * @param {Object} source Source object
   * @returns {Object} Merged object
   */
  _deepMerge(target, source) {
    const result = { ...target };
    
    Object.keys(source).forEach(key => {
      if (source[key] === undefined) return;
      
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key]) &&
          typeof target[key] === 'object' && target[key] !== null && !Array.isArray(target[key])) {
        // If both are objects, merge recursively
        result[key] = this._deepMerge(target[key], source[key]);
      } else {
        // For arrays or scalar values, use source value
        result[key] = source[key];
      }
    });
    
    return result;
  }
}

/**
 * Ensures context is maintained during transformation and synthesis
 */
class ContextPreservationService {
  /**
   * Creates a new context preservation service
   * @param {Object} options Configuration options
   */
  constructor(options = {}) {
    this.options = {
      preserveContextProperties: true,
      preserveMetadata: true,
      preserveRelationships: true,
      ...options
    };
    
    // Context registry for different types
    this.contextRegistry = new Map();
    
    // Default context extractors
    this._registerDefaultContextExtractors();
  }
  
  /**
   * Enhances artifacts with context
   * @param {Array<Object>} artifacts Artifacts to enhance
   * @param {Object} additionalContext Additional context to include
   * @returns {Array<Object>} Context-enhanced artifacts
   */
  async enhanceWithContext(artifacts, additionalContext = {}) {
    if (!artifacts || !Array.isArray(artifacts)) {
      throw new Error('enhanceWithContext requires an array of artifacts');
    }
    
    const enhancedArtifacts = [];
    
    for (const artifact of artifacts) {
      // Skip null or non-object artifacts
      if (!artifact || typeof artifact !== 'object') {
        enhancedArtifacts.push(artifact);
        continue;
      }
      
      // Start with a copy of the artifact
      const enhanced = { ...artifact };
      
      // Add preserved context
      enhanced._preservedContext = {};
      
      // Extract context based on artifact type
      const artifactType = artifact.type || 'unknown';
      const contextExtractor = this.contextRegistry.get(artifactType) || this.contextRegistry.get('default');
      
      if (contextExtractor) {
        const extractedContext = await contextExtractor(artifact, additionalContext);
        enhanced._preservedContext = {
          ...extractedContext,
          ...additionalContext
        };
      } else {
        enhanced._preservedContext = { ...additionalContext };
      }
      
      // Preserve metadata if option enabled
      if (this.options.preserveMetadata && artifact.metadata) {
        enhanced._preservedContext.metadata = artifact.metadata;
      }
      
      // Preserve relationships if option enabled and available
      if (this.options.preserveRelationships && artifact.relationships) {
        enhanced._preservedContext.relationships = artifact.relationships;
      }
      
      enhancedArtifacts.push(enhanced);
    }
    
    return enhancedArtifacts;
  }
  
  /**
   * Extracts context from an enhanced artifact
   * @param {Object} artifact The enhanced artifact
   * @returns {Object} Extracted context
   */
  extractContext(artifact) {
    if (!artifact || typeof artifact !== 'object') {
      return {};
    }
    
    return artifact._preservedContext || {};
  }
  
  /**
   * Restores context to a synthesis result
   * @param {Object} result Synthesis result
   * @param {Array<Object>} sourceArtifacts Source artifacts with preserved context
   * @returns {Object} Result with restored context
   */
  restoreContext(result, sourceArtifacts) {
    if (!result || typeof result !== 'object') {
      return result;
    }
    
    if (!sourceArtifacts || !Array.isArray(sourceArtifacts) || sourceArtifacts.length === 0) {
      return result;
    }
    
    // Create a copy of the result to avoid modifying the original
    const enhanced = { ...result };
    
    // Initialize preserved context
    if (!enhanced._preservedContext) {
      enhanced._preservedContext = {};
    }
    
    // Collect all context properties from source artifacts
    const allContexts = sourceArtifacts
      .map(a => a._preservedContext || {})
      .filter(context => context && typeof context === 'object');
    
    if (allContexts.length === 0) {
      return enhanced;
    }
    
    // Merge contexts
    const mergedContext = allContexts.reduce((merged, context) => {
      // Merge each property
      Object.entries(context).forEach(([key, value]) => {
        if (value === undefined) return;
        
        if (!merged[key]) {
          // If property doesn't exist in merged context, add it
          merged[key] = value;
        } else if (Array.isArray(value)) {
          // If property is an array, concatenate
          if (Array.isArray(merged[key])) {
            merged[key] = merged[key].concat(value);
          } else {
            merged[key] = [merged[key]].concat(value);
          }
        } else if (typeof value === 'object' && value !== null && 
                   typeof merged[key] === 'object' && merged[key] !== null) {
          // If both are objects, merge recursively
          merged[key] = this._deepMerge(merged[key], value);
        }
        // For scalar values, keep the existing merged value
      });
      
      return merged;
    }, {});
    
    // Update result's preserved context
    enhanced._preservedContext = {
      ...enhanced._preservedContext,
      ...mergedContext
    };
    
    // Apply context properties to result if enabled
    if (this.options.preserveContextProperties) {
      // Apply relevant context properties directly to result
      this._applyContextToResult(enhanced, mergedContext);
    }
    
    return enhanced;
  }
  
  /**
   * Registers a context extractor for an artifact type
   * @param {string} artifactType Artifact type
   * @param {Function} extractor Context extractor function
   */
  registerContextExtractor(artifactType, extractor) {
    if (!artifactType || typeof artifactType !== 'string') {
      throw new Error('Artifact type must be a non-empty string');
    }
    
    if (!extractor || typeof extractor !== 'function') {
      throw new Error('Context extractor must be a function');
    }
    
    this.contextRegistry.set(artifactType, extractor);
  }
  
  /**
   * Registers default context extractors
   * @private
   */
  _registerDefaultContextExtractors() {
    // Default extractor for any artifact type
    this.registerContextExtractor('default', (artifact) => {
      const context = {};
      
      // Extract tags
      if (artifact.tags && Array.isArray(artifact.tags)) {
        context.tags = [...artifact.tags];
      }
      
      return context;
    });
    
    // Decision-specific context extractor
    this.registerContextExtractor('decision', (artifact) => {
      const context = {};
      
      // Extract tags
      if (artifact.tags && Array.isArray(artifact.tags)) {
        context.tags = [...artifact.tags];
      }
      
      // Extract decision-specific context
      if (artifact.rationale) {
        context.rationale = artifact.rationale;
      }
      
      return context;
    });
    
    // System pattern-specific context extractor
    this.registerContextExtractor('system_pattern', (artifact) => {
      const context = {};
      
      // Extract tags
      if (artifact.tags && Array.isArray(artifact.tags)) {
        context.tags = [...artifact.tags];
      }
      
      // Extract pattern-specific context
      if (artifact.description) {
        context.patternDescription = artifact.description;
      }
      
      return context;
    });
  }
  
  /**
   * Deep merges two objects
   * @private
   * @param {Object} target Target object
   * @param {Object} source Source object
   * @returns {Object} Merged object
   */
  _deepMerge(target, source) {
    const result = { ...target };
    
    Object.keys(source).forEach(key => {
      if (source[key] === undefined) return;
      
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key]) &&
          typeof target[key] === 'object' && target[key] !== null && !Array.isArray(target[key])) {
        // If both are objects, merge recursively
        result[key] = this._deepMerge(target[key], source[key]);
      } else {
        // For arrays or scalar values, use source value
        result[key] = source[key];
      }
    });
    
    return result;
  }
  
  /**
   * Applies context to result
   * @private
   * @param {Object} result Result to enhance
   * @param {Object} context Context to apply
   */
  _applyContextToResult(result, context) {
    // Apply metadata if not already present
    if (context.metadata && (!result.metadata || Object.keys(result.metadata).length === 0)) {
      result.metadata = { ...context.metadata };
    }
    
    // Apply relationships if not already present
    if (context.relationships && (!result.relationships || result.relationships.length === 0)) {
      result.relationships = [...context.relationships];
    }
    
    // Apply tags if not already present
    if (context.tags && (!result.tags || result.tags.length === 0)) {
      result.tags = [...new Set(context.tags)];
    }
  }
}

/**
 * Analyzes semantic relationships and meanings within knowledge artifacts
 */
class SemanticAnalyzer {
  /**
   * Creates a new semantic analyzer
   * @param {Object} options Configuration options
   */
  constructor(options = {}) {
    this.options = {
      enabledAnalyses: ['keyTerms', 'sentiment', 'domains', 'entityRecognition'],
      confidenceThreshold: 0.6,
      ...options
    };
  }
  
  /**
   * Analyzes artifacts to extract semantic information
   * @param {Array<Object>} artifacts Artifacts to analyze
   * @returns {Promise<Array<Object>>} Analysis results for each artifact
   */
  async analyzeArtifacts(artifacts) {
    if (!artifacts || !Array.isArray(artifacts)) {
      throw new Error('Artifacts must be an array');
    }
    
    // Process each artifact
    const results = await Promise.all(artifacts.map(artifact => this.analyzeArtifact(artifact)));
    
    return results;
  }
  
  /**
   * Analyzes a single artifact to extract semantic information
   * @param {Object} artifact Artifact to analyze
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeArtifact(artifact) {
    if (!artifact || typeof artifact !== 'object') {
      throw new Error('Artifact must be a non-null object');
    }
    
    const analysis = {
      artifactId: artifact.id || artifact._id,
      artifactType: artifact.type
    };
    
    // Extract text content from artifact
    const textContent = this._extractTextContent(artifact);
    
    if (!textContent) {
      return {
        ...analysis,
        error: 'No text content found in artifact'
      };
    }
    
    // Perform enabled analyses
    if (this.options.enabledAnalyses.includes('keyTerms')) {
      analysis.keyTerms = this._extractKeyTerms(textContent);
    }
    
    if (this.options.enabledAnalyses.includes('sentiment')) {
      analysis.sentiment = this._analyzeSentiment(textContent);
    }
    
    if (this.options.enabledAnalyses.includes('domains')) {
      analysis.domains = this._analyzeDomains(textContent, artifact.type);
    }
    
    if (this.options.enabledAnalyses.includes('entityRecognition')) {
      analysis.entities = this._recognizeEntities(textContent);
    }
    
    // Compare with other artifacts if provided in context
    if (artifact._preservedContext && artifact._preservedContext.relatedArtifacts) {
      analysis.semanticRelationships = this._analyzeSemanticRelationships(
        textContent, 
        artifact._preservedContext.relatedArtifacts
      );
    }
    
    return analysis;
  }
  
  /**
   * Compares two artifacts for semantic similarity
   * @param {Object} artifact1 First artifact
   * @param {Object} artifact2 Second artifact
   * @returns {Object} Similarity analysis
   */
  compareArtifacts(artifact1, artifact2) {
    if (!artifact1 || typeof artifact1 !== 'object' || !artifact2 || typeof artifact2 !== 'object') {
      throw new Error('Both artifacts must be non-null objects');
    }
    
    // Extract text content from artifacts
    const text1 = this._extractTextContent(artifact1);
    const text2 = this._extractTextContent(artifact2);
    
    if (!text1 || !text2) {
      return {
        error: 'No text content found in one or both artifacts'
      };
    }
    
    // Calculate semantic similarity
    const similarity = this._calculateSimilarity(text1, text2);
    
    // Extract common terms
    const terms1 = this._extractKeyTerms(text1);
    const terms2 = this._extractKeyTerms(text2);
    
    const commonTerms = terms1.filter(term => 
      terms2.some(t2 => t2.term === term.term)
    );
    
    return {
      similarity,
      commonTerms
    };
  }
  
  /**
   * Extracts key terms from text content
   * @private
   * @param {string} text Text to analyze
   * @returns {Array<Object>} Extracted key terms with scores
   */
  _extractKeyTerms(text) {
    // Simple implementation - would be replaced with more sophisticated NLP in production
    const terms = {};
    
    // Split text into words and count occurrences
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/) // Split on whitespace
      .filter(word => word.length > 3); // Filter out short words
    
    // Count word occurrences
    words.forEach(word => {
      if (!terms[word]) {
        terms[word] = { count: 0 };
      }
      
      terms[word].count++;
    });
    
    // Calculate scores based on frequency
    const totalWords = words.length;
    
    Object.keys(terms).forEach(word => {
      terms[word].score = terms[word].count / totalWords;
    });
    
    // Filter by confidence threshold and format results
    return Object.entries(terms)
      .filter(([_, data]) => data.score >= this.options.confidenceThreshold / 3)
      .map(([term, data]) => ({
        term,
        score: data.score,
        count: data.count
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Return only top 10 terms
  }
  
  /**
   * Analyzes sentiment of text content
   * @private
   * @param {string} text Text to analyze
   * @returns {Object} Sentiment analysis
   */
  _analyzeSentiment(text) {
    // Simple implementation - would be replaced with more sophisticated NLP in production
    const positiveTerms = ['good', 'great', 'excellent', 'positive', 'beneficial', 'advantage', 'improve'];
    const negativeTerms = ['bad', 'poor', 'negative', 'issue', 'problem', 'challenge', 'difficult', 'risk'];
    
    // Count positive and negative terms
    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'g');
      const matches = lowerText.match(regex);
      if (matches) {
        positiveCount += matches.length;
      }
    });
    
    negativeTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'g');
      const matches = lowerText.match(regex);
      if (matches) {
        negativeCount += matches.length;
      }
    });
    
    // Calculate sentiment score (-1 to 1)
    const totalTerms = positiveCount + negativeCount;
    let sentimentScore = 0;
    
    if (totalTerms > 0) {
      sentimentScore = (positiveCount - negativeCount) / totalTerms;
    }
    
    // Determine sentiment category
    let sentiment = 'neutral';
    if (sentimentScore > 0.25) {
      sentiment = 'positive';
    } else if (sentimentScore < -0.25) {
      sentiment = 'negative';
    }
    
    return {
      score: sentimentScore,
      sentiment,
      positiveCount,
      negativeCount
    };
  }
  
  /**
   * Analyzes domain relevance of text content
   * @private
   * @param {string} text Text to analyze
   * @param {string} artifactType Type of the artifact
   * @returns {Array<Object>} Domain relevance analysis
   */
  _analyzeDomains(text, artifactType) {
    // Simplified implementation - would use more sophisticated techniques in production
    const domainKeywords = {
      'technical': ['implementation', 'code', 'architecture', 'pattern', 'algorithm', 'system', 'framework'],
      'business': ['user', 'customer', 'value', 'market', 'cost', 'revenue', 'strategy', 'stakeholder'],
      'process': ['workflow', 'process', 'method', 'procedure', 'step', 'phase', 'lifecycle'],
      'security': ['secure', 'vulnerability', 'risk', 'threat', 'authentication', 'authorization', 'encryption']
    };
    
    const lowerText = text.toLowerCase();
    const domainScores = {};
    
    Object.entries(domainKeywords).forEach(([domain, keywords]) => {
      let matchCount = 0;
      
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        const matches = lowerText.match(regex);
        if (matches) {
          matchCount += matches.length;
        }
      });
      
      const score = matchCount / keywords.length;
      domainScores[domain] = score;
    });
    
    // Format results
    return Object.entries(domainScores)
      .filter(([_, score]) => score >= this.options.confidenceThreshold / 2)
      .map(([domain, score]) => ({ domain, score }))
      .sort((a, b) => b.score - a.score);
  }
  
  /**
   * Recognizes entities in text content
   * @private
   * @param {string} text Text to analyze
   * @returns {Array<Object>} Recognized entities
   */
  _recognizeEntities(text) {
    // Simple entity recognition - would use NLP libraries in production
    const entities = [];
    
    // Look for potential person names (sequences of capitalized words)
    const nameRegex = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)\b/g;
    let nameMatch;
    
    while ((nameMatch = nameRegex.exec(text)) !== null) {
      entities.push({
        type: 'person',
        text: nameMatch[1],
        confidence: 0.7
      });
    }
    
    // Look for potential technical terms
    const techTerms = ['API', 'REST', 'GraphQL', 'database', 'microservice', 'framework'];
    techTerms.forEach(term => {
      const termRegex = new RegExp(`\\b${term}\\b`, 'i');
      if (termRegex.test(text)) {
        entities.push({
          type: 'technical_term',
          text: term,
          confidence: 0.8
        });
      }
    });
    
    return entities;
  }
  
  /**
   * Analyzes semantic relationships between artifacts
   * @private
   * @param {string} textContent Text content of the current artifact
   * @param {Array<Object>} relatedArtifacts Related artifacts to compare with
   * @returns {Array<Object>} Semantic relationships
   */
  _analyzeSemanticRelationships(textContent, relatedArtifacts) {
    const relationships = [];
    
    relatedArtifacts.forEach(artifact => {
      const relatedText = this._extractTextContent(artifact);
      if (!relatedText) return;
      
      const similarity = this._calculateSimilarity(textContent, relatedText);
      
      if (similarity > this.options.confidenceThreshold) {
        relationships.push({
          artifactId: artifact.id || artifact._id,
          artifactType: artifact.type,
          relationship: 'semantically_related',
          confidence: similarity
        });
      }
    });
    
    return relationships;
  }
  
  /**
   * Calculates semantic similarity between two texts
   * @private
   * @param {string} text1 First text
   * @param {string} text2 Second text
   * @returns {number} Similarity score (0-1)
   */
  _calculateSimilarity(text1, text2) {
    // Simple cosine similarity - would use word embeddings in production
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    // Find intersection
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    
    // Calculate Jaccard similarity
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }
  
  /**
   * Extracts text content from an artifact
   * @private
   * @param {Object} artifact Artifact to extract text from
   * @returns {string} Extracted text content
   */
  _extractTextContent(artifact) {
    let text = '';
    
    // Try common content fields
    if (artifact.content && typeof artifact.content === 'string') {
      text = artifact.content;
    } else if (artifact.description && typeof artifact.description === 'string') {
      text = artifact.description;
    } else if (artifact.summary && typeof artifact.summary === 'string') {
      text = artifact.summary;
    } else if (artifact.text && typeof artifact.text === 'string') {
      text = artifact.text;
    } else if (artifact.value && typeof artifact.value === 'string') {
      text = artifact.value;
    } else if (artifact.name && typeof artifact.name === 'string') {
      text += ' ' + artifact.name;
    }
    
    // Check for nested fields
    if (artifact.metadata && artifact.metadata.description) {
      text += ' ' + artifact.metadata.description;
    }
    
    return text.trim();
  }
}
/**
 * Tracks provenance of synthesized knowledge artifacts
 */
class ProvenanceTracker {
  /**
   * Creates a new provenance tracker
   * @param {Object} options Configuration options
   * @param {boolean} [options.includeTimestamps=true] Whether to include timestamps
   * @param {boolean} [options.includeStrategies=true] Whether to include strategy details
   * @param {boolean} [options.includeSourceDetails=true] Whether to include detailed source information
   */
  constructor(options = {}) {
    this.options = {
      includeTimestamps: true,
      includeStrategies: true,
      includeSourceDetails: true,
      ...options
    };
  }
  
  /**
   * Adds provenance information to a synthesis result
   * @param {Object} params Provenance parameters
   * @param {Object} params.result Synthesis result
   * @param {Array<Object>} params.sourceArtifacts Source artifacts
   * @param {string} params.strategy Strategy used
   * @param {Object} [params.strategyParams={}] Strategy parameters
   * @param {Object} [params.context={}] Additional context
   * @returns {Object} Result with added provenance
   */
  addProvenance(params) {
    const {
      result,
      sourceArtifacts,
      strategy,
      strategyParams = {},
      context = {}
    } = params;
    
    if (!result || typeof result !== 'object') {
      throw new Error('Result must be a non-null object');
    }
    
    if (!sourceArtifacts || !Array.isArray(sourceArtifacts)) {
      throw new Error('Source artifacts must be an array');
    }
    
    // Create a copy of the result to avoid modifying the original
    const enhancedResult = { ...result };
    
    // Initialize provenance object if not present
    if (!enhancedResult.provenance) {
      enhancedResult.provenance = {};
    }
    
    // Add basic provenance information
    enhancedResult.provenance = {
      ...enhancedResult.provenance,
      generatedById: 'kse',
      sources: sourceArtifacts.map(artifact => this._createSourceReference(artifact))
    };
    
    // Add timestamp if enabled
    if (this.options.includeTimestamps) {
      enhancedResult.provenance.timestamp = new Date().toISOString();
    }
    
    // Add strategy information if enabled
    if (this.options.includeStrategies) {
      enhancedResult.provenance.strategy = {
        name: strategy,
        params: { ...strategyParams }
      };
    }
    
    // Add execution context if present
    if (Object.keys(context).length > 0) {
      enhancedResult.provenance.context = { ...context };
    }
    
    return enhancedResult;
  }
  
  /**
   * Creates a detailed source reference for an artifact
   * @private
   * @param {Object} artifact Source artifact
   * @returns {Object} Source reference
   */
  _createSourceReference(artifact) {
    const reference = {
      id: artifact.id || artifact._id,
      type: artifact.type
    };
    
    // Add detailed information if enabled
    if (this.options.includeSourceDetails) {
      // Add name or title if available
      if (artifact.name) {
        reference.name = artifact.name;
      } else if (artifact.title) {
        reference.name = artifact.title;
      }
      
      // Add version if available
      if (artifact.version) {
        reference.version = artifact.version;
      }
      
      // Add timestamp if available
      if (artifact.timestamp || artifact.createdAt) {
        reference.timestamp = artifact.timestamp || artifact.createdAt;
      }
    }
    
    return reference;
  }
  
  /**
   * Retrieves the provenance chain for an artifact
   * @param {Object} artifact Artifact to get provenance for
   * @returns {Array<Object>} Provenance chain (most recent first)
   */
  getProvenanceChain(artifact) {
    if (!artifact || typeof artifact !== 'object') {
      throw new Error('Artifact must be a non-null object');
    }
    
    if (!artifact.provenance) {
      return [];
    }
    
    const chain = [
      {
        generatedById: artifact.provenance.generatedById,
        timestamp: artifact.provenance.timestamp,
        strategy: artifact.provenance.strategy
      }
    ];
    
    // TODO: In a real implementation, this would recursively
    // retrieve provenance from source artifacts, potentially
    // involving database calls or other lookups
    
    return chain;
  }
  
  /**
   * Validates provenance information
   * @param {Object} artifact Artifact to validate
   * @returns {Object} Validation result with { valid, errors }
   */
  validateProvenance(artifact) {
    const errors = [];
    
    if (!artifact || typeof artifact !== 'object') {
      errors.push('Artifact must be a non-null object');
      return { valid: false, errors };
    }
    
    if (!artifact.provenance) {
      errors.push('Artifact has no provenance information');
      return { valid: false, errors };
    }
    
    // Check for required fields
    if (!artifact.provenance.generatedById) {
      errors.push('Provenance missing generatedById field');
    }
    
    if (!artifact.provenance.sources || !Array.isArray(artifact.provenance.sources)) {
      errors.push('Provenance missing sources array');
    } else if (artifact.provenance.sources.length === 0) {
      errors.push('Provenance has empty sources array');
    } else {
      // Check each source for required fields
      artifact.provenance.sources.forEach((source, index) => {
        if (!source.id) {
          errors.push(`Source at index ${index} missing id field`);
        }
        if (!source.type) {
          errors.push(`Source at index ${index} missing type field`);
        }
      });
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export all classes
module.exports = {
  KnowledgeSynthesizer,
  SynthesisStrategyRegistry,
  SynthesisRuleEngine,
  KnowledgeCompositionManager,
  ContextPreservationService,
  SemanticAnalyzer,
  ProvenanceTracker
};