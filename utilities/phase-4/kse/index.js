/**
 * Knowledge Synthesis Engine (KSE) - Main Index
 * 
 * The KSE component enables the synthesis of knowledge artifacts from multiple
 * sources, applying various strategies and ensuring context preservation.
 * It integrates with ConPort, AMO, KDAP, and AKAF to provide comprehensive
 * knowledge synthesis capabilities.
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

const { KSEIntegration } = require('./kse-integration');
const {
  validateSynthesisRequest,
  validateArtifact,
  validateStrategy,
  validateRule
} = require('./kse-validation');

module.exports = {
  // Core components
  KnowledgeSynthesizer,
  SynthesisStrategyRegistry,
  SynthesisRuleEngine,
  KnowledgeCompositionManager,
  ContextPreservationService,
  SemanticAnalyzer,
  ProvenanceTracker,
  
  // Integration
  KSEIntegration,
  
  // Validation functions
  validateSynthesisRequest,
  validateArtifact,
  validateStrategy,
  validateRule,
  
  /**
   * Creates a fully configured KSE instance
   * @param {Object} options Configuration options
   * @param {Object} options.conportClient ConPort client
   * @param {Object} [options.amoClient] AMO client
   * @param {Object} [options.kdapClient] KDAP client
   * @param {Object} [options.akafClient] AKAF client
   * @param {Object} [options.logger=console] Logger instance
   * @returns {KSEIntegration} Configured KSE integration instance
   */
  createKSE: (options) => {
    return new KSEIntegration(options);
  }
};