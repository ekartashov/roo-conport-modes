/**
 * Knowledge-Driven Autonomous Planning (KDAP) - Main Module
 * 
 * KDAP enables autonomous identification of knowledge gaps and planning for
 * knowledge acquisition activities. It continuously analyzes the knowledge ecosystem,
 * identifies gaps, generates acquisition plans, and evaluates their impact.
 * 
 * Key capabilities:
 * - Knowledge state analysis across multiple dimensions
 * - Gap identification using configurable strategies
 * - Plan generation for knowledge acquisition
 * - Plan execution orchestration
 * - Impact evaluation of knowledge changes
 * - ConPort integration for seamless knowledge management
 */

// Import all components from the three layers
const validationLayer = require('./kdap-validation');
const coreLayer = require('./kdap-core');
const integrationLayer = require('./kdap-integration');

/**
 * Initialize the KDAP system with configuration options
 * @param {Object} options - Configuration options
 * @param {Object} options.conPortClient - ConPort client instance
 * @param {Object} [options.analyzerOptions] - Options for the KnowledgeStateAnalyzer
 * @param {Object} [options.gapIdentifierOptions] - Options for the GapIdentificationEngine
 * @param {Object} [options.planGeneratorOptions] - Options for the PlanGenerationSystem
 * @param {Object} [options.executorOptions] - Options for the ExecutionOrchestrator
 * @param {Object} [options.evaluatorOptions] - Options for the KnowledgeImpactEvaluator
 * @param {Object} [options.integrationOptions] - Options for integration components
 * @returns {Object} Initialized KDAP instance
 */
function initializeKDAP(options = {}) {
  // Create core components
  const stateAnalyzer = new coreLayer.KnowledgeStateAnalyzer(options.analyzerOptions);
  const gapIdentifier = new coreLayer.GapIdentificationEngine(options.gapIdentifierOptions);
  const planGenerator = new coreLayer.PlanGenerationSystem(options.planGeneratorOptions);
  const executor = new coreLayer.ExecutionOrchestrator(options.executorOptions);
  const evaluator = new coreLayer.KnowledgeImpactEvaluator(options.evaluatorOptions);
  
  // Create integration manager
  const integrationManager = new integrationLayer.KdapIntegrationManager(options.integrationOptions);
  
  // Initialize integration with core components
  integrationManager.initialize({
    stateAnalyzer,
    gapIdentifier,
    planGenerator,
    executor,
    evaluator
  });
  
  return {
    // Main functionality
    analyzeKnowledgeState: stateAnalyzer.analyzeKnowledgeState.bind(stateAnalyzer),
    identifyGaps: gapIdentifier.identifyGaps.bind(gapIdentifier),
    generatePlan: planGenerator.generatePlan.bind(planGenerator),
    executePlan: executor.executePlan.bind(executor),
    evaluateImpact: evaluator.evaluateImpact.bind(evaluator),
    runAutonomousWorkflow: integrationManager.runAutonomousWorkflow.bind(integrationManager),
    
    // Validation utilities
    validateGapAssessment: validationLayer.validateGapAssessment,
    validateKnowledgeAcquisitionPlan: validationLayer.validateKnowledgeAcquisitionPlan,
    validateExecutionProgress: validationLayer.validateExecutionProgress,
    validateAcquiredKnowledge: validationLayer.validateAcquiredKnowledge,
    
    // Access to internal components
    _stateAnalyzer: stateAnalyzer,
    _gapIdentifier: gapIdentifier,
    _planGenerator: planGenerator,
    _executor: executor,
    _evaluator: evaluator,
    _integrationManager: integrationManager
  };
}

// Export all components
module.exports = {
  // Main initialization function
  initializeKDAP,
  
  // Core layer exports
  KnowledgeStateAnalyzer: coreLayer.KnowledgeStateAnalyzer,
  GapIdentificationEngine: coreLayer.GapIdentificationEngine,
  PlanGenerationSystem: coreLayer.PlanGenerationSystem,
  ExecutionOrchestrator: coreLayer.ExecutionOrchestrator,
  KnowledgeImpactEvaluator: coreLayer.KnowledgeImpactEvaluator,
  
  // Integration layer exports
  ConPortKnowledgeInterface: integrationLayer.ConPortKnowledgeInterface,
  Phase4ComponentConnectors: integrationLayer.Phase4ComponentConnectors,
  ExternalApiHandler: integrationLayer.ExternalApiHandler,
  StateManagementSystem: integrationLayer.StateManagementSystem,
  KdapIntegrationManager: integrationLayer.KdapIntegrationManager,
  
  // Validation layer exports
  validateGapAssessment: validationLayer.validateGapAssessment,
  validateKnowledgeAcquisitionPlan: validationLayer.validateKnowledgeAcquisitionPlan,
  validateExecutionProgress: validationLayer.validateExecutionProgress,
  validateAcquiredKnowledge: validationLayer.validateAcquiredKnowledge,
  
  // Direct layer access for advanced usage
  validation: validationLayer,
  core: coreLayer,
  integration: integrationLayer
};