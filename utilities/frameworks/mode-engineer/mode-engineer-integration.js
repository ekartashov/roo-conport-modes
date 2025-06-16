/**
 * Mode Engineer Integration - Integration layer for ConPort and Phase 4 frameworks
 * 
 * This module provides the integration layer that connects the Mode Engineer
 * with ConPort knowledge management and all Phase 4 autonomous frameworks.
 */

const { ModeEngineeringEngine } = require('./mode-engineer-core');
const validation = require('./mode-engineer-validation');

// Framework imports
const kdapFramework = require('../kdap');
const akafFramework = require('../akaf');
const kseFramework = require('../kse');
const sivsFramework = require('../sivs');
const amoFramework = require('../amo');
const ccfFramework = require('../ccf');

/**
 * Main Mode Engineer Integration Manager
 * Orchestrates all components and provides a unified interface
 */
class ModeEngineerIntegration {
  constructor(options = {}) {
    this.workspaceId = options.workspaceId || process.cwd();
    this.conportClient = options.conportClient;
    this.logger = options.logger || console;
    this.config = {
      enableFrameworkCaching: options.enableFrameworkCaching !== false,
      validationStrict: options.validationStrict !== false,
      autoSaveContext: options.autoSaveContext !== false,
      ...options.config
    };

    this.frameworks = {};
    this.engineeringEngine = null;
    this.initialized = false;
  }

  /**
   * Initialize the Mode Engineer with all frameworks and ConPort integration
   */
  async initialize() {
    try {
      this.logger.info('Initializing Mode Engineer Integration...');

      // Validate ConPort client
      if (!this.conportClient) {
        throw new Error('ConPort client is required for Mode Engineer initialization');
      }

      // Initialize Phase 4 frameworks
      await this.initializeFrameworks();

      // Initialize the core engineering engine
      this.engineeringEngine = new ModeEngineeringEngine({
        workspaceId: this.workspaceId,
        logger: this.logger,
        config: this.config
      });

      await this.engineeringEngine.initializeFrameworks(this.frameworks);

      // Load existing context if available
      if (this.config.autoSaveContext) {
        await this.loadEngineeringContext();
      }

      this.initialized = true;
      this.logger.info('Mode Engineer Integration initialized successfully');

      // Log initialization to ConPort
      await this.logToConPort('decision', {
        summary: 'Mode Engineer Integration Initialized',
        rationale: 'Successfully initialized all Phase 4 frameworks and ConPort integration',
        implementation_details: JSON.stringify({
          frameworks: Object.keys(this.frameworks),
          workspaceId: this.workspaceId,
          config: this.config
        }),
        tags: ['mode-engineering', 'initialization', 'phase-4']
      });

      return true;
    } catch (error) {
      this.logger.error('Failed to initialize Mode Engineer Integration:', error);
      throw error;
    }
  }

  /**
   * Initialize all Phase 4 frameworks with ConPort integration
   */
  async initializeFrameworks() {
    try {
      // Initialize KDAP (Knowledge-Driven Autonomous Planning)
      this.frameworks.kdap = kdapFramework.initializeKDAP({
        conPortClient: this.conportClient,
        analyzerOptions: { workspaceId: this.workspaceId },
        integrationOptions: { enableCaching: this.config.enableFrameworkCaching }
      });

      // Initialize AKAF (Adaptive Knowledge Application Framework)
      this.frameworks.akaf = akafFramework.initializeAKAF({
        conportClient: this.conportClient,
        customStrategies: await this.loadModeEngineeringStrategies(),
        customPatterns: await this.loadModeEngineeringPatterns()
      });

      // Initialize KSE (Knowledge Synthesis Engine)
      this.frameworks.kse = kseFramework.createKSE({
        conportClient: this.conportClient,
        logger: this.logger
      });

      // Initialize SIVS (Strategic Insight Validation System)
      this.frameworks.sivs = new sivsFramework.SIVSIntegrationManager({
        conportClient: this.conportClient,
        validationStandards: await this.loadValidationStandards()
      });

      // Initialize AMO (Autonomous Mapping Orchestrator)
      this.frameworks.amo = new amoFramework.ConPortAMOIntegration({
        conportClient: this.conportClient,
        workspaceId: this.workspaceId
      });

      // Initialize CCF (Cognitive Continuity Framework)
      this.frameworks.ccf = new ccfFramework.CCFIntegration({
        storageProvider: new ccfFramework.ConPortStorageProvider(this.conportClient),
        workspaceId: this.workspaceId
      });

      this.logger.info('All Phase 4 frameworks initialized successfully');
    } catch (error) {
      this.logger.error('Framework initialization failed:', error);
      throw error;
    }
  }

  /**
   * Process a mode engineering request
   */
  async processRequest(request) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Validate the request
      const requestValidation = validation.validateModeEngineeringRequest(request);
      if (!requestValidation.isValid) {
        throw new Error(`Invalid request: ${requestValidation.errors.join(', ')}`);
      }

      // Log the request to ConPort
      await this.logToConPort('progress', {
        description: `Processing mode engineering request: ${request.type}`,
        status: 'IN_PROGRESS',
        linked_item_type: 'custom_data',
        linked_item_id: 'mode-engineering-session'
      });

      let result;

      // Route to appropriate handler based on request type
      switch (request.type) {
        case 'create-mode':
          result = await this.createMode(request);
          break;
        case 'enhance-mode':
          result = await this.enhanceMode(request);
          break;
        case 'analyze-ecosystem':
          result = await this.analyzeEcosystem(request);
          break;
        case 'validate-mode':
          result = await this.validateMode(request);
          break;
        default:
          throw new Error(`Unknown request type: ${request.type}`);
      }

      // Save context if enabled
      if (this.config.autoSaveContext) {
        await this.saveEngineeringContext(result);
      }

      // Log completion to ConPort
      await this.logToConPort('progress', {
        description: `Completed mode engineering request: ${request.type}`,
        status: 'DONE',
        linked_item_type: 'custom_data',
        linked_item_id: 'mode-engineering-session'
      });

      return result;
    } catch (error) {
      this.logger.error('Request processing failed:', error);
      
      // Log error to ConPort
      await this.logToConPort('custom_data', {
        category: 'ErrorLogs',
        key: `mode-engineering-error-${Date.now()}`,
        value: {
          error: error.message,
          request: request,
          timestamp: new Date().toISOString(),
          stack: error.stack
        }
      });

      throw error;
    }
  }

  /**
   * Create a new mode
   */
  async createMode(request) {
    try {
      // Analyze requirements using the engineering engine
      const analysisResults = await this.engineeringEngine.analyzeRequirements(request);

      // Log requirements analysis decision
      await this.logToConPort('decision', {
        summary: `Mode Creation Requirements Analysis: ${request.description}`,
        rationale: `Analyzed user requirements for new mode creation`,
        implementation_details: JSON.stringify(analysisResults.requirements),
        tags: ['mode-creation', 'requirements-analysis']
      });

      // Create the mode using the engineering engine
      const creationResult = await this.engineeringEngine.createMode(analysisResults);

      // Validate the created mode
      const modeValidation = validation.validateMode(creationResult.mode, {
        existingModes: analysisResults.existingModes,
        availableFrameworks: Object.keys(this.frameworks)
      });

      if (!modeValidation.overall.isValid) {
        throw new Error(`Created mode validation failed: ${modeValidation.overall.errors.join(', ')}`);
      }

      // Log the successful mode creation
      await this.logToConPort('system_pattern', {
        name: `Mode Creation Pattern: ${creationResult.mode.slug}`,
        description: `Successful mode creation using Phase 4 frameworks`,
        tags: ['mode-creation', 'pattern', 'phase-4']
      });

      // Save the mode specification to ConPort
      await this.logToConPort('custom_data', {
        category: 'ModeSpecifications',
        key: creationResult.mode.slug,
        value: {
          mode: creationResult.mode,
          metadata: creationResult.metadata,
          validation: modeValidation,
          created: new Date().toISOString()
        }
      });

      return {
        mode: creationResult.mode,
        validation: modeValidation,
        metadata: creationResult.metadata,
        analysisResults
      };
    } catch (error) {
      this.logger.error('Mode creation failed:', error);
      throw error;
    }
  }

  /**
   * Enhance an existing mode
   */
  async enhanceMode(request) {
    try {
      const enhancementResult = await this.engineeringEngine.enhanceMode(
        request.modeId, 
        request.enhancementGoals
      );

      // Validate the enhanced mode
      const modeValidation = validation.validateMode(enhancementResult.enhancedMode);

      if (!modeValidation.overall.isValid) {
        throw new Error(`Enhanced mode validation failed: ${modeValidation.overall.errors.join(', ')}`);
      }

      // Log the enhancement decision
      await this.logToConPort('decision', {
        summary: `Mode Enhancement: ${request.modeId}`,
        rationale: `Applied enhancements to improve mode capabilities`,
        implementation_details: JSON.stringify({
          enhancementGoals: request.enhancementGoals,
          changes: enhancementResult.changes
        }),
        tags: ['mode-enhancement', request.modeId]
      });

      return {
        enhancedMode: enhancementResult.enhancedMode,
        validation: modeValidation,
        changes: enhancementResult.changes,
        enhancementPlan: enhancementResult.enhancementPlan
      };
    } catch (error) {
      this.logger.error('Mode enhancement failed:', error);
      throw error;
    }
  }

  /**
   * Analyze the mode ecosystem
   */
  async analyzeEcosystem(request) {
    try {
      const ecosystemAnalysis = await this.engineeringEngine.analyzeEcosystem();

      // Log the ecosystem analysis
      await this.logToConPort('custom_data', {
        category: 'EcosystemAnalysis',
        key: `analysis-${Date.now()}`,
        value: {
          analysis: ecosystemAnalysis,
          request: request,
          timestamp: new Date().toISOString()
        }
      });

      return ecosystemAnalysis;
    } catch (error) {
      this.logger.error('Ecosystem analysis failed:', error);
      throw error;
    }
  }

  /**
   * Validate a mode
   */
  async validateMode(request) {
    try {
      const validationResult = validation.validateMode(request.mode, request.context);

      // Log validation results
      await this.logToConPort('custom_data', {
        category: 'ValidationResults',
        key: `validation-${request.mode.slug || 'unknown'}-${Date.now()}`,
        value: {
          validation: validationResult,
          mode: request.mode,
          timestamp: new Date().toISOString()
        }
      });

      return validationResult;
    } catch (error) {
      this.logger.error('Mode validation failed:', error);
      throw error;
    }
  }

  /**
   * Save engineering context to ConPort via CCF
   */
  async saveEngineeringContext(result) {
    try {
      await this.frameworks.ccf.saveContext({
        contextState: {
          agentId: 'mode-engineer',
          content: {
            lastOperation: result,
            timestamp: new Date().toISOString(),
            frameworks: Object.keys(this.frameworks),
            workspaceId: this.workspaceId
          },
          sessionId: `mode-engineering-${Date.now()}`
        }
      });
    } catch (error) {
      this.logger.error('Failed to save engineering context:', error);
      // Don't throw - context saving is not critical
    }
  }

  /**
   * Load engineering context from ConPort via CCF
   */
  async loadEngineeringContext() {
    try {
      const context = await this.frameworks.ccf.loadContext({
        criteria: { agentId: 'mode-engineer' }
      });

      if (context) {
        this.logger.info('Loaded previous engineering context');
        return context;
      }
    } catch (error) {
      this.logger.error('Failed to load engineering context:', error);
      // Don't throw - context loading failure is not critical
    }
    return null;
  }

  /**
   * Helper method to log data to ConPort
   */
  async logToConPort(type, data) {
    try {
      switch (type) {
        case 'decision':
          await this.conportClient.log_decision({
            workspace_id: this.workspaceId,
            ...data
          });
          break;
        case 'progress':
          await this.conportClient.log_progress({
            workspace_id: this.workspaceId,
            ...data
          });
          break;
        case 'system_pattern':
          await this.conportClient.log_system_pattern({
            workspace_id: this.workspaceId,
            ...data
          });
          break;
        case 'custom_data':
          await this.conportClient.log_custom_data({
            workspace_id: this.workspaceId,
            ...data
          });
          break;
        default:
          this.logger.warn(`Unknown ConPort log type: ${type}`);
      }
    } catch (error) {
      this.logger.error(`Failed to log to ConPort (${type}):`, error);
      // Don't throw - logging failures shouldn't break the main flow
    }
  }

  /**
   * Load mode engineering strategies for AKAF
   */
  async loadModeEngineeringStrategies() {
    try {
      const strategiesResult = await this.conportClient.get_custom_data({
        workspace_id: this.workspaceId,
        category: 'ModeEngineeringStrategies'
      });

      return strategiesResult?.value || {
        'mode-composition': {
          description: 'Compose new modes from existing patterns',
          applicability: ['create-mode'],
          priority: 'high'
        },
        'capability-enhancement': {
          description: 'Enhance existing modes with new capabilities',
          applicability: ['enhance-mode'],
          priority: 'high'
        }
      };
    } catch (error) {
      this.logger.warn('Could not load mode engineering strategies, using defaults');
      return {};
    }
  }

  /**
   * Load mode engineering patterns for AKAF
   */
  async loadModeEngineeringPatterns() {
    try {
      const patternsResult = await this.conportClient.get_system_patterns({
        workspace_id: this.workspaceId,
        tags_filter_include_any: ['mode-engineering', 'pattern']
      });

      return patternsResult?.map(pattern => ({
        name: pattern.name,
        description: pattern.description,
        tags: pattern.tags
      })) || [];
    } catch (error) {
      this.logger.warn('Could not load mode engineering patterns, using defaults');
      return [];
    }
  }

  /**
   * Load validation standards for SIVS
   */
  async loadValidationStandards() {
    try {
      const standardsResult = await this.conportClient.get_custom_data({
        workspace_id: this.workspaceId,
        category: 'ValidationStandards'
      });

      return standardsResult?.value || {
        'roo-ecosystem': {
          description: 'Roo ecosystem compatibility standards',
          requirements: ['yaml-structure', 'permission-model', 'framework-integration']
        },
        'yaml-structure': {
          description: 'YAML structure validation standards',
          requirements: ['required-fields', 'field-types', 'naming-conventions']
        }
      };
    } catch (error) {
      this.logger.warn('Could not load validation standards, using defaults');
      return {};
    }
  }

  /**
   * Get framework status and health
   */
  getFrameworkStatus() {
    return {
      initialized: this.initialized,
      frameworks: Object.keys(this.frameworks),
      workspaceId: this.workspaceId,
      config: this.config
    };
  }
}

/**
 * Factory function to create and initialize Mode Engineer
 */
async function createModeEngineer(options = {}) {
  const integration = new ModeEngineerIntegration(options);
  await integration.initialize();
  return integration;
}

module.exports = {
  ModeEngineerIntegration,
  createModeEngineer,
  validation
};