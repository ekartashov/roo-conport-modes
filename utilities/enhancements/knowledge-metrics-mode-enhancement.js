/**
 * Knowledge Metrics Dashboard - Mode Enhancement Integration
 * 
 * This module integrates the Knowledge Metrics Dashboard with the validation
 * checkpoints and knowledge-first components into a cohesive enhancement that
 * can be applied to ConPort-integrated modes.
 * 
 * The enhancement provides comprehensive metrics visualization, quality assessment,
 * and systematic knowledge preservation capabilities to support knowledge management.
 */

const { KnowledgeMetricsDashboard } = require('../knowledge-metrics-dashboard');
const KnowledgeMetricsKnowledgeFirst = require('./knowledge-metrics-knowledge-first');
const {
  validateKnowledgeMetricsDashboard,
  validateConPortAccess,
  validateDataCompleteness,
  validateMetricDefinitions,
  validateDashboardOutput,
  validateHtmlOutput
} = require('./knowledge-metrics-validation-checkpoints');

/**
 * Class for integrating the Knowledge Metrics Dashboard as a mode enhancement
 */
class KnowledgeMetricsModeEnhancement {
  /**
   * Create a knowledge metrics mode enhancement
   * @param {Object} options - Enhancement options
   * @param {Object} options.conportClient - ConPort client
   * @param {Object} options.dashboardOptions - Options for dashboard generation
   */
  constructor(options = {}) {
    this.conportClient = options.conportClient;
    this.dashboardOptions = options.dashboardOptions || {};
    this.dashboard = new KnowledgeMetricsDashboard();
    this.knowledgeFirst = new KnowledgeMetricsKnowledgeFirst(
      this.conportClient,
      this.dashboard
    );
    
    this.enhancementMethods = {
      generateKnowledgeMetricsDashboard: this.generateKnowledgeMetricsDashboard.bind(this),
      validateDashboard: this.validateDashboard.bind(this),
      extractKnowledgeInsights: this.extractKnowledgeInsights.bind(this),
      documentDashboardInsights: this.documentDashboardInsights.bind(this),
      generateImprovementStrategies: this.generateImprovementStrategies.bind(this),
      getLastDashboardData: this.getLastDashboardData.bind(this),
      renderHtmlDashboard: this.renderHtmlDashboard.bind(this),
      exportDashboardData: this.exportDashboardData.bind(this)
    };
    
    this.lastDashboardData = null;
    this.validationResults = null;
    this.knowledgeInsights = [];
    this.documentationResults = null;
  }
  
  /**
   * Apply the enhancement to a mode
   * @param {Object} mode - Mode to enhance
   * @returns {Object} - Enhanced mode
   */
  enhance(mode) {
    if (!mode) {
      throw new Error('Mode object is required');
    }
    
    // Merge enhancement methods into the mode
    Object.assign(mode, this.enhancementMethods);
    
    // Add dashboard property to the mode
    mode.knowledgeMetricsDashboard = this.dashboard;
    
    // Add knowledgeFirst component to the mode
    mode.knowledgeMetricsKnowledgeFirst = this.knowledgeFirst;
    
    // Add validation functions to the mode
    mode.validateKnowledgeMetricsDashboard = validateKnowledgeMetricsDashboard;
    
    return mode;
  }
  
  /**
   * Generate knowledge metrics dashboard
   * @param {Object} options - Options to override defaults
   * @returns {Object} - Dashboard data
   */
  generateKnowledgeMetricsDashboard(options = {}) {
    const mergedOptions = { ...this.dashboardOptions, ...options };
    
    if (!this.conportClient) {
      throw new Error('ConPort client required to generate dashboard');
    }
    
    try {
      // Validate ConPort access before generating
      const accessValidation = validateConPortAccess(this.conportClient);
      if (!accessValidation.valid) {
        throw new Error(`ConPort access validation failed: ${accessValidation.message}`);
      }
      
      // Generate dashboard
      this.lastDashboardData = this.dashboard.generateDashboard(
        this.conportClient,
        mergedOptions
      );
      
      // Validate the output
      this.validationResults = this.validateDashboard();
      
      // Extract insights
      this.knowledgeInsights = this.extractKnowledgeInsights();
      
      return this.lastDashboardData;
    } catch (error) {
      console.error('Error generating knowledge metrics dashboard:', error);
      throw error;
    }
  }
  
  /**
   * Validate the dashboard
   * @param {Object} dashboardData - Optional dashboard data to validate
   * @returns {Object} - Validation results
   */
  validateDashboard(dashboardData) {
    const dataToValidate = dashboardData || this.lastDashboardData;
    
    if (!dataToValidate) {
      return {
        valid: false,
        message: 'No dashboard data to validate'
      };
    }
    
    const htmlOutput = this.dashboard.generateHtmlDashboard();
    
    const validationParams = {
      client: this.conportClient,
      dashboard: this.dashboard,
      dashboardData: dataToValidate,
      html: htmlOutput
    };
    
    this.validationResults = validateKnowledgeMetricsDashboard(validationParams);
    return this.validationResults;
  }
  
  /**
   * Extract knowledge insights from dashboard data
   * @param {Object} dashboardData - Optional dashboard data to extract insights from
   * @returns {Array} - Extracted knowledge insights
   */
  extractKnowledgeInsights(dashboardData) {
    const dataToProcess = dashboardData || this.lastDashboardData;
    
    if (!dataToProcess) {
      return [];
    }
    
    this.knowledgeInsights = this.knowledgeFirst.extractInsightsFromDashboard(dataToProcess);
    return this.knowledgeInsights;
  }
  
  /**
   * Document dashboard insights in ConPort
   * @param {Array} insights - Optional specific insights to document
   * @returns {Object} - Documentation results
   */
  documentDashboardInsights(insights) {
    const insightsToDocument = insights || this.knowledgeInsights;
    
    if (!insightsToDocument || insightsToDocument.length === 0) {
      return {
        success: false,
        message: 'No insights available to document'
      };
    }
    
    if (!this.conportClient) {
      return {
        success: false,
        message: 'No ConPort client available'
      };
    }
    
    this.documentationResults = this.knowledgeFirst.documentInsightsInConPort(insightsToDocument);
    return this.documentationResults;
  }
  
  /**
   * Generate improvement strategies based on dashboard insights
   * @returns {Array} - Improvement strategies
   */
  generateImprovementStrategies() {
    return this.knowledgeFirst.generateImprovementStrategies();
  }
  
  /**
   * Get the last generated dashboard data
   * @returns {Object|null} - Dashboard data or null if not generated
   */
  getLastDashboardData() {
    return this.lastDashboardData;
  }
  
  /**
   * Render HTML dashboard
   * @returns {string} - HTML representation of the dashboard
   */
  renderHtmlDashboard() {
    return this.dashboard.generateHtmlDashboard();
  }
  
  /**
   * Export dashboard data to JSON
   * @returns {string} - JSON representation of dashboard data
   */
  exportDashboardData() {
    return this.dashboard.exportToJson();
  }
}

/**
 * Create a Knowledge Metrics Dashboard enhancement
 * @param {Object} options - Enhancement options
 * @returns {KnowledgeMetricsModeEnhancement} - Enhancement instance
 */
function createKnowledgeMetricsEnhancement(options = {}) {
  return new KnowledgeMetricsModeEnhancement(options);
}

module.exports = {
  KnowledgeMetricsModeEnhancement,
  createKnowledgeMetricsEnhancement
};