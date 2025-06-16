/**
 * Knowledge Synthesis Engine (KSE) - Integration Layer
 * 
 * This layer provides integration between the KSE core functionality and other
 * system components including ConPort, AMO (Autonomous Mapping Orchestrator),
 * KDAP (Knowledge Discovery and Access Patterns), and AKAF (Autonomous Knowledge
 * Acquisition Framework).
 */

const {
  KnowledgeSynthesizer,
  SynthesisStrategyRegistry,
  SynthesisRuleEngine,
  KnowledgeCompositionManager,
  ContextPreservationService,
  SemanticAnalyzer,
  ProvenanceTracker
} = require('./kse-core');
const { validateSynthesisRequest } = require('./kse-validation');

/**
 * Handles integration of KSE with other system components
 */
class KSEIntegration {
  /**
   * Creates a new KSE integration instance
   * @param {Object} options Configuration options
   * @param {Object} options.conportClient ConPort client instance
   * @param {Object} options.amoClient AMO client instance
   * @param {Object} options.kdapClient KDAP client instance
   * @param {Object} options.akafClient AKAF client instance
   * @param {Object} [options.logger=console] Logger instance
   */
  constructor(options) {
    if (!options.conportClient) {
      throw new Error('ConPort client is required');
    }
    
    this.conportClient = options.conportClient;
    this.amoClient = options.amoClient;
    this.kdapClient = options.kdapClient;
    this.akafClient = options.akafClient;
    this.logger = options.logger || console;
    
    // Initialize core components
    this.provenanceTracker = new ProvenanceTracker();
    this.semanticAnalyzer = new SemanticAnalyzer();
    this.contextPreservationService = new ContextPreservationService();
    this.synthesisRuleEngine = new SynthesisRuleEngine();
    this.compositionManager = new KnowledgeCompositionManager({
      contextPreservationService: this.contextPreservationService
    });
    this.strategyRegistry = new SynthesisStrategyRegistry();
    
    // Register default strategies
    this._registerDefaultStrategies();
    
    // Create main synthesizer
    this.synthesizer = new KnowledgeSynthesizer({
      strategyRegistry: this.strategyRegistry,
      ruleEngine: this.synthesisRuleEngine,
      compositionManager: this.compositionManager,
      contextPreservationService: this.contextPreservationService,
      semanticAnalyzer: this.semanticAnalyzer,
      provenanceTracker: this.provenanceTracker
    });
  }
  
  /**
   * Synthesizes knowledge from multiple artifacts
   * @param {Object} params Synthesis parameters
   * @param {Array<Object>} params.artifacts Knowledge artifacts to synthesize
   * @param {string} params.strategy Strategy to use
   * @param {Object} [params.strategyParams={}] Strategy-specific parameters
   * @param {Object} [params.context={}] Additional context for synthesis
   * @param {boolean} [params.preserveContext=true] Whether to preserve context
   * @param {boolean} [params.storeResult=true] Whether to store result in ConPort
   * @returns {Promise<Object>} Synthesized knowledge artifact
   */
  async synthesize(params) {
    try {
      // Validate the request
      validateSynthesisRequest(params);
      
      const {
        artifacts,
        strategy,
        strategyParams = {},
        context = {},
        preserveContext = true,
        storeResult = true
      } = params;
      
      // Enhance context with AMO mapping information if available
      let enhancedContext = { ...context };
      if (this.amoClient) {
        try {
          const mappingInfo = await this.amoClient.getRelevantMappings({
            artifactTypes: artifacts.map(a => a.type),
            synthesisStrategy: strategy
          });
          
          enhancedContext.mappings = mappingInfo;
        } catch (error) {
          this.logger.warn(`Could not retrieve AMO mappings: ${error.message}`);
        }
      }
      
      // Apply synthesis
      const result = await this.synthesizer.synthesize({
        artifacts,
        strategy,
        strategyParams,
        context: enhancedContext,
        preserveContext
      });
      
      // Store result in ConPort if requested
      if (storeResult) {
        try {
          const storedResult = await this.conportClient.storeKnowledgeArtifact({
            artifact: result,
            metadata: {
              generatedBy: 'kse',
              synthesisStrategy: strategy,
              sourceArtifactIds: artifacts.map(a => a.id || a._id)
            }
          });
          
          return storedResult;
        } catch (error) {
          this.logger.error(`Failed to store synthesis result: ${error.message}`);
          return result;
        }
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Synthesis failed: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Retrieves and synthesizes knowledge from ConPort
   * @param {Object} params Query parameters
   * @param {Array<string>} params.artifactTypes Types of artifacts to retrieve
   * @param {Object} [params.query={}] Query criteria
   * @param {string} params.strategy Strategy to use
   * @param {Object} [params.strategyParams={}] Strategy-specific parameters
   * @param {Object} [params.context={}] Additional context
   * @returns {Promise<Object>} Synthesized knowledge
   */
  async retrieveAndSynthesize(params) {
    const {
      artifactTypes,
      query = {},
      strategy,
      strategyParams = {},
      context = {}
    } = params;
    
    // Use KDAP to retrieve knowledge artifacts
    let artifacts = [];
    try {
      if (this.kdapClient) {
        artifacts = await this.kdapClient.discoverArtifacts({
          types: artifactTypes,
          query,
          context
        });
      } else {
        // Fall back to direct ConPort retrieval if KDAP is not available
        artifacts = await this.conportClient.getKnowledgeArtifacts({
          types: artifactTypes,
          query
        });
      }
      
      if (!artifacts || artifacts.length === 0) {
        throw new Error('No artifacts found matching the criteria');
      }
      
      // Synthesize the retrieved artifacts
      return this.synthesize({
        artifacts,
        strategy,
        strategyParams,
        context,
        storeResult: true
      });
    } catch (error) {
      this.logger.error(`Retrieve and synthesize failed: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Acquires and synthesizes new knowledge using AKAF
   * @param {Object} params Parameters for acquisition and synthesis
   * @param {Array<string>} params.knowledgeTypes Types of knowledge to acquire
   * @param {Object} [params.acquisitionParams={}] AKAF acquisition parameters
   * @param {string} params.strategy Synthesis strategy to use
   * @param {Object} [params.strategyParams={}] Strategy-specific parameters
   * @param {Object} [params.context={}] Additional context
   * @returns {Promise<Object>} Synthesized knowledge
   */
  async acquireAndSynthesize(params) {
    if (!this.akafClient) {
      throw new Error('AKAF client is required for knowledge acquisition');
    }
    
    const {
      knowledgeTypes,
      acquisitionParams = {},
      strategy,
      strategyParams = {},
      context = {}
    } = params;
    
    try {
      // Use AKAF to acquire knowledge
      const acquiredKnowledge = await this.akafClient.acquireKnowledge({
        types: knowledgeTypes,
        params: acquisitionParams,
        context
      });
      
      if (!acquiredKnowledge || acquiredKnowledge.length === 0) {
        throw new Error('No knowledge artifacts were acquired');
      }
      
      // Synthesize the acquired knowledge
      return this.synthesize({
        artifacts: acquiredKnowledge,
        strategy,
        strategyParams,
        context,
        storeResult: true
      });
    } catch (error) {
      this.logger.error(`Acquire and synthesize failed: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Registers a custom synthesis strategy
   * @param {string} name Strategy name
   * @param {Function} strategyFn Strategy implementation
   * @param {Object} [metadata={}] Strategy metadata
   */
  registerStrategy(name, strategyFn, metadata = {}) {
    this.strategyRegistry.register(name, strategyFn, metadata);
    
    // If AMO client is available, register the strategy mapping
    if (this.amoClient) {
      this.amoClient.registerSynthesisStrategy({
        name,
        provider: 'kse',
        metadata
      }).catch(error => {
        this.logger.warn(`Failed to register strategy with AMO: ${error.message}`);
      });
    }
  }
  
  /**
   * Registers default synthesis strategies
   * @private
   */
  _registerDefaultStrategies() {
    // Merge strategy - combines multiple artifacts of similar types
    this.registerStrategy('merge', (artifacts, params = {}, context = {}) => {
      const merged = {};
      const keys = new Set();
      
      // Collect all keys from all artifacts
      artifacts.forEach(artifact => {
        Object.keys(artifact).forEach(key => {
          if (key !== 'id' && key !== '_id' && key !== 'type' && key !== 'provenance') {
            keys.add(key);
          }
        });
      });
      
      // Merge values for each key
      keys.forEach(key => {
        const values = artifacts
          .filter(a => a[key] !== undefined)
          .map(a => a[key]);
        
        if (values.length === 0) {
          return;
        }
        
        // Handle different value types
        if (typeof values[0] === 'object' && !Array.isArray(values[0])) {
          // Recursively merge objects
          merged[key] = values.reduce((acc, val) => ({ ...acc, ...val }), {});
        } else if (Array.isArray(values[0])) {
          // Concatenate arrays and remove duplicates if requested
          const concatenated = values.flat();
          merged[key] = params.removeDuplicates 
            ? [...new Set(concatenated)]
            : concatenated;
        } else {
          // Use the most recent value for primitive types
          merged[key] = values[values.length - 1];
        }
      });
      
      // Preserve type from the first artifact if available
      if (artifacts[0].type) {
        merged.type = artifacts[0].type;
      }
      
      return merged;
    }, {
      description: 'Merges multiple artifacts into a single artifact',
      supportedTypes: ['*'],
      params: {
        removeDuplicates: {
          type: 'boolean',
          default: true,
          description: 'Remove duplicate values when merging arrays'
        }
      }
    });
    
    // Summary strategy - creates a summary from multiple artifacts
    this.registerStrategy('summarize', (artifacts, params = {}, context = {}) => {
      // In a real implementation, this could use NLP or LLM techniques
      // For now, we'll implement a simple property-based summary
      
      const summary = {
        type: 'summary',
        title: params.title || 'Knowledge Synthesis Summary',
        sourceCount: artifacts.length,
        sourceTypes: [...new Set(artifacts.map(a => a.type))],
        keyInsights: [],
        createdAt: new Date().toISOString()
      };
      
      // Extract key properties based on artifact types
      artifacts.forEach(artifact => {
        if (artifact.title || artifact.name) {
          summary.keyInsights.push({
            source: artifact.id || artifact._id,
            insight: artifact.title || artifact.name
          });
        }
        
        if (artifact.description) {
          summary.keyInsights.push({
            source: artifact.id || artifact._id,
            insight: artifact.description.substring(0, 100) + 
              (artifact.description.length > 100 ? '...' : '')
          });
        }
      });
      
      return summary;
    }, {
      description: 'Creates a summary from multiple artifacts',
      supportedTypes: ['*'],
      params: {
        title: {
          type: 'string',
          description: 'Title for the summary'
        },
        maxInsights: {
          type: 'number',
          default: 10,
          description: 'Maximum number of key insights to include'
        }
      }
    });
    
    // Transform strategy - applies transformations to artifacts
    this.registerStrategy('transform', (artifacts, params = {}, context = {}) => {
      // Apply the specified transformation to each artifact
      const transformed = artifacts.map(artifact => {
        const result = { ...artifact };
        
        // Apply transformation rules
        if (params.rules && Array.isArray(params.rules)) {
          params.rules.forEach(rule => {
            if (rule.sourceField && rule.targetField && rule.operation) {
              const sourceValue = artifact[rule.sourceField];
              
              if (sourceValue !== undefined) {
                switch (rule.operation) {
                  case 'copy':
                    result[rule.targetField] = sourceValue;
                    break;
                  case 'move':
                    result[rule.targetField] = sourceValue;
                    delete result[rule.sourceField];
                    break;
                  case 'transform':
                    if (rule.transformFn && typeof rule.transformFn === 'function') {
                      result[rule.targetField] = rule.transformFn(sourceValue);
                    }
                    break;
                  default:
                    // Unknown operation - ignore
                    break;
                }
              }
            }
          });
        }
        
        return result;
      });
      
      // Return either the array or a merged result depending on params
      return params.mergeResults ? this.strategyRegistry.get('merge')(transformed) : transformed;
    }, {
      description: 'Transforms artifacts using specified rules',
      supportedTypes: ['*'],
      params: {
        rules: {
          type: 'array',
          description: 'Transformation rules to apply'
        },
        mergeResults: {
          type: 'boolean',
          default: false,
          description: 'Whether to merge transformed artifacts'
        }
      }
    });
  }
}

module.exports = {
  KSEIntegration
};