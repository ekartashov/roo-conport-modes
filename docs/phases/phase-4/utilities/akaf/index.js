/**
 * Adaptive Knowledge Application Framework (AKAF)
 * 
 * AKAF is a framework for intelligently adapting and applying knowledge based on context.
 * It provides capabilities for contextual knowledge retrieval, strategic adaptation,
 * and effective application, all integrated with ConPort and other systems.
 * 
 * This index file exports all components of the framework for easy access.
 */

// Import all components from the three layers
const validationLayer = require('./akaf-validation');
const coreLayer = require('./akaf-core');
const integrationLayer = require('./akaf-integration');

/**
 * Initialize the AKAF framework with configuration options
 * @param {Object} options - Configuration options
 * @param {Object} options.conportClient - ConPort client instance
 * @param {Object} options.kdapClient - KDAP client instance (optional)
 * @param {Object} options.sivsClient - SIVS client instance (optional)
 * @param {Object} options.amoClient - AMO client instance (optional)
 * @param {Object} options.customStrategies - Custom adaptation strategies (optional)
 * @param {Object} options.customPatterns - Custom application patterns (optional)
 * @returns {Object} Initialized AKAF instance
 */
function initializeAKAF(options = {}) {
  // Create the integration layer instance, which will in turn set up the core layer
  const akafInstance = new integrationLayer.AKAFIntegration(options);
  
  return {
    // Main functionality
    processContext: akafInstance.processContext.bind(akafInstance),
    prepareContext: akafInstance.prepareContext.bind(akafInstance),
    getMetrics: akafInstance.getMetrics.bind(akafInstance),
    
    // Strategy and pattern management
    retrieveStrategies: akafInstance.retrieveStrategies.bind(akafInstance),
    retrievePatterns: akafInstance.retrievePatterns.bind(akafInstance),
    registerStrategy: akafInstance.registerStrategy.bind(akafInstance),
    registerPattern: akafInstance.registerPattern.bind(akafInstance),
    
    // Validation utilities (exposed for advanced usage)
    validateContext: validationLayer.validateContext,
    validateKnowledgeRelevance: validationLayer.validateKnowledgeRelevance,
    validateAdaptationStrategy: validationLayer.validateAdaptationStrategy,
    validateAdaptedKnowledge: validationLayer.validateAdaptedKnowledge,
    validateApplicationPattern: validationLayer.validateApplicationPattern,
    
    // Advanced: direct access to internal components
    _integration: akafInstance,
    _core: akafInstance.adaptiveController
  };
}

// Export all components
module.exports = {
  // Main initialization function
  initializeAKAF,
  
  // Export classes for advanced usage or extension
  
  // Validation layer
  ValidationUtilities: validationLayer,
  
  // Core layer
  AdaptiveKnowledgeController: coreLayer.AdaptiveKnowledgeController,
  DefaultKnowledgeRetriever: coreLayer.DefaultKnowledgeRetriever,
  AdaptationStrategySelector: coreLayer.AdaptationStrategySelector,
  KnowledgeAdapter: coreLayer.KnowledgeAdapter,
  ApplicationPatternSelector: coreLayer.ApplicationPatternSelector,
  KnowledgeApplicationEngine: coreLayer.KnowledgeApplicationEngine,
  FeedbackCollector: coreLayer.FeedbackCollector,
  
  // Integration layer
  AKAFIntegration: integrationLayer.AKAFIntegration,
  ConPortKnowledgeRetriever: integrationLayer.ConPortKnowledgeRetriever,
  ConPortStrategySelector: integrationLayer.ConPortStrategySelector,
  IntegratedApplicationEngine: integrationLayer.IntegratedApplicationEngine,
  ConPortFeedbackCollector: integrationLayer.ConPortFeedbackCollector
};