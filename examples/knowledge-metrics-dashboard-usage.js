/**
 * Knowledge Metrics Dashboard Usage Example
 * 
 * This example demonstrates how to use the Knowledge Metrics Dashboard
 * to assess knowledge quality, generate insights, and document findings
 * in ConPort. It shows integration with both the Orchestrator and
 * ConPort Maintenance modes.
 */

// Import required modules
const { KnowledgeMetricsDashboard } = require('../utilities/knowledge-metrics-dashboard');
const { createKnowledgeMetricsEnhancement } = require('../utilities/mode-enhancements/knowledge-metrics-mode-enhancement');

// Import mode modules (in a real implementation, these would be your actual mode instances)
const OrchestratorMode = require('./sample-orchestrator-mode');
const ConPortMaintenanceMode = require('./sample-conport-maintenance-mode');

// Mock ConPort client for demonstration
const mockConPortClient = {
  getProductContext: () => ({
    name: 'Sample Project',
    description: 'A sample project for demonstrating the Knowledge Metrics Dashboard',
    goals: ['Improve code quality', 'Enhance documentation', 'Streamline knowledge management']
  }),
  
  getActiveContext: () => ({
    current_focus: 'Knowledge metrics assessment',
    open_issues: ['Need more comprehensive documentation', 'Knowledge gaps in architecture decisions']
  }),
  
  getDecisions: ({ limit } = {}) => [
    {
      id: 1,
      summary: 'Adopt microservices architecture',
      rationale: 'Better scalability and team autonomy',
      timestamp: '2025-01-15T12:00:00Z',
      tags: ['architecture', 'scalability']
    },
    {
      id: 2,
      summary: 'Use PostgreSQL for main database',
      rationale: 'Strong consistency guarantees and rich feature set',
      timestamp: '2025-02-01T14:30:00Z',
      tags: ['database', 'storage']
    }
    // More decisions would be here
  ],
  
  getSystemPatterns: () => [
    {
      id: 1,
      name: 'Service Gateway Pattern',
      description: 'Unified entry point for all microservices',
      tags: ['microservices', 'api']
    },
    {
      id: 2,
      name: 'Event Sourcing Pattern',
      description: 'Store state changes as a sequence of events',
      tags: ['data', 'state-management']
    }
    // More patterns would be here
  ],
  
  getProgress: ({ limit } = {}) => [
    {
      id: 1,
      description: 'Implement user authentication service',
      status: 'DONE',
      timestamp: '2025-03-10T09:15:00Z'
    },
    {
      id: 2,
      description: 'Design database schema',
      status: 'IN_PROGRESS',
      timestamp: '2025-03-15T11:45:00Z'
    }
    // More progress entries would be here
  ],
  
  getCustomData: ({ category } = {}) => {
    if (category === 'ProjectGlossary') {
      return {
        'api-gateway': 'A server that acts as an API front-end, receives API requests, and routes them to the appropriate backend service',
        'event-sourcing': 'A way of persisting an application\'s state by storing the history of events that caused the state changes'
      };
    }
    
    return ['ProjectGlossary', 'TechnicalSpecs', 'MeetingNotes'];
  },
  
  // Mock methods for writing to ConPort
  logDecision: (decision) => Math.floor(Math.random() * 1000) + 100, // Return mock ID
  logProgress: (progress) => Math.floor(Math.random() * 1000) + 100, // Return mock ID
  logCustomData: ({ category, key, value }) => true,
  updateActiveContext: ({ content }) => true
};

/**
 * Example 1: Using the Knowledge Metrics Dashboard standalone
 */
function standaloneExample() {
  console.log('\n--- Example 1: Using the Knowledge Metrics Dashboard standalone ---');
  
  // Create a new dashboard instance
  const dashboard = new KnowledgeMetricsDashboard();
  
  // Generate dashboard with mock ConPort client
  console.log('Generating dashboard...');
  const dashboardData = dashboard.generateDashboard(mockConPortClient);
  
  // Display overall health
  console.log(`Overall Knowledge Health: ${(dashboardData.overallHealth.score * 100).toFixed(1)}% (${dashboardData.overallHealth.status})`);
  
  // Display recommendations
  console.log('\nTop Recommendations:');
  dashboardData.recommendations.slice(0, 3).forEach((rec, index) => {
    console.log(`${index + 1}. [${rec.priority.toUpperCase()}] ${rec.recommendation}`);
  });
  
  // Generate HTML dashboard
  console.log('\nGenerating HTML dashboard...');
  const html = dashboard.generateHtmlDashboard();
  console.log(`HTML dashboard generated (${Math.floor(html.length / 1024)} KB)`);
  
  // Export JSON data
  console.log('\nExporting dashboard data to JSON...');
  const json = dashboard.exportToJson();
  console.log(`JSON data exported (${Math.floor(json.length / 1024)} KB)`);
}

/**
 * Example 2: Enhancing Orchestrator Mode with Knowledge Metrics Dashboard
 */
function orchestratorModeExample() {
  console.log('\n--- Example 2: Enhancing Orchestrator Mode with Knowledge Metrics Dashboard ---');
  
  // Create an instance of the Orchestrator Mode (mock for this example)
  const orchestratorMode = new OrchestratorMode();
  console.log('Orchestrator Mode created');
  
  // Create the Knowledge Metrics enhancement
  const enhancement = createKnowledgeMetricsEnhancement({
    conportClient: mockConPortClient,
    dashboardOptions: {
      limit: 100 // Limit the number of items to retrieve
    }
  });
  
  // Apply the enhancement to the mode
  enhancement.enhance(orchestratorMode);
  console.log('Knowledge Metrics enhancement applied to Orchestrator Mode');
  
  // Use the enhanced capabilities
  console.log('\nGenerating Knowledge Metrics Dashboard...');
  const dashboardData = orchestratorMode.generateKnowledgeMetricsDashboard();
  
  // Validate the dashboard
  console.log('\nValidating dashboard...');
  const validationResults = orchestratorMode.validateDashboard();
  console.log(`Validation result: ${validationResults.valid ? 'VALID' : 'INVALID'}`);
  if (validationResults.warnings && validationResults.warnings.length > 0) {
    console.log('Warnings:', validationResults.warnings);
  }
  
  // Extract knowledge insights
  console.log('\nExtracting knowledge insights...');
  const insights = orchestratorMode.extractKnowledgeInsights();
  console.log(`Extracted ${insights.length} insights`);
  
  // Sample insights
  if (insights.length > 0) {
    console.log('\nSample insights:');
    insights.slice(0, 2).forEach((insight, index) => {
      console.log(`${index + 1}. [${insight.importance}] ${insight.title}: ${insight.description}`);
    });
  }
  
  // Document insights in ConPort
  console.log('\nDocumenting insights in ConPort...');
  const documentationResult = orchestratorMode.documentDashboardInsights();
  console.log(`Documentation result: ${documentationResult.success ? 'SUCCESS' : 'FAILED'}`);
  console.log(documentationResult.message);
  
  // Generate improvement strategies
  console.log('\nGenerating improvement strategies...');
  const strategies = orchestratorMode.generateImprovementStrategies();
  console.log(`Generated ${strategies.length} improvement strategies`);
  
  // Sample strategies
  if (strategies.length > 0) {
    console.log('\nSample strategies:');
    strategies.slice(0, 2).forEach((strategy, index) => {
      console.log(`${index + 1}. [${strategy.priority}] ${strategy.name}: ${strategy.description}`);
      console.log(`   Expected Impact: ${strategy.expectedImpact}, Effort: ${strategy.estimatedEffort}`);
    });
  }
}

/**
 * Example 3: Enhancing ConPort Maintenance Mode with Knowledge Metrics Dashboard
 */
function conportMaintenanceModeExample() {
  console.log('\n--- Example 3: Enhancing ConPort Maintenance Mode with Knowledge Metrics Dashboard ---');
  
  // Create an instance of the ConPort Maintenance Mode (mock for this example)
  const maintenanceMode = new ConPortMaintenanceMode();
  console.log('ConPort Maintenance Mode created');
  
  // Create the Knowledge Metrics enhancement
  const enhancement = createKnowledgeMetricsEnhancement({
    conportClient: mockConPortClient
  });
  
  // Apply the enhancement to the mode
  enhancement.enhance(maintenanceMode);
  console.log('Knowledge Metrics enhancement applied to ConPort Maintenance Mode');
  
  // Use the enhanced capabilities
  console.log('\nGenerating Knowledge Metrics Dashboard...');
  const dashboardData = maintenanceMode.generateKnowledgeMetricsDashboard();
  
  // Render HTML dashboard
  console.log('\nRendering HTML dashboard...');
  const html = maintenanceMode.renderHtmlDashboard();
  console.log(`HTML dashboard rendered (${Math.floor(html.length / 1024)} KB)`);
  
  // Extract insights and document in ConPort
  console.log('\nExtracting and documenting insights...');
  const insights = maintenanceMode.extractKnowledgeInsights();
  console.log(`Extracted ${insights.length} insights`);
  
  const documentationResult = maintenanceMode.documentDashboardInsights(insights);
  console.log(`Documentation result: ${documentationResult.success ? 'SUCCESS' : 'FAILED'}`);
  
  // Display summary of activities
  console.log('\nKnowledge Metrics Dashboard Integration Summary:');
  console.log(`- Dashboard generated with overall health: ${(dashboardData.overallHealth.score * 100).toFixed(1)}%`);
  console.log(`- ${insights.length} knowledge insights extracted`);
  
  if (documentationResult.success && documentationResult.results) {
    const results = documentationResult.results;
    console.log(`- ${results.decisions.length} decisions logged`);
    console.log(`- ${results.progress.length} progress entries created`);
    console.log(`- ${results.customData.length} custom data entries stored`);
    console.log(`- Active context ${results.activeContextUpdate?.success ? 'updated' : 'not updated'}`);
  }
}

/**
 * Example 4: Process for conducting a knowledge health assessment
 */
function knowledgeHealthAssessmentExample() {
  console.log('\n--- Example 4: Conducting a Knowledge Health Assessment ---');
  
  console.log('Step 1: Initialize modes and enhancements');
  const maintenanceMode = new ConPortMaintenanceMode();
  const enhancement = createKnowledgeMetricsEnhancement({
    conportClient: mockConPortClient
  });
  enhancement.enhance(maintenanceMode);
  
  console.log('\nStep 2: Generate and validate dashboard');
  const dashboardData = maintenanceMode.generateKnowledgeMetricsDashboard();
  const validationResults = maintenanceMode.validateDashboard();
  
  if (!validationResults.valid) {
    console.log('Dashboard validation failed:', validationResults.message);
    return;
  }
  
  console.log('\nStep 3: Analyze metrics and identify critical areas');
  const criticalCategories = [];
  
  Object.entries(dashboardData.categories).forEach(([key, category]) => {
    const criticalMetrics = category.metrics.filter(m => m.status === 'critical');
    if (criticalMetrics.length > 0) {
      criticalCategories.push({
        name: category.name,
        criticalCount: criticalMetrics.length,
        metrics: criticalMetrics.map(m => `${m.name} (${(m.value * 100).toFixed(1)}%)`)
      });
    }
  });
  
  console.log('Critical categories identified:');
  criticalCategories.forEach((category, index) => {
    console.log(`${index + 1}. ${category.name} (${category.criticalCount} critical metrics)`);
    console.log(`   - ${category.metrics.join('\n   - ')}`);
  });
  
  console.log('\nStep 4: Generate improvement strategies');
  const strategies = maintenanceMode.generateImprovementStrategies();
  
  console.log('\nStep 5: Document insights and create action plan');
  const insights = maintenanceMode.extractKnowledgeInsights();
  const documentationResult = maintenanceMode.documentDashboardInsights(insights);
  
  console.log('\nStep 6: Present findings and recommendations');
  console.log('Knowledge Health Assessment Summary:');
  console.log(`- Overall Health: ${(dashboardData.overallHealth.score * 100).toFixed(1)}% (${dashboardData.overallHealth.status})`);
  console.log(`- ${criticalCategories.length} categories need immediate attention`);
  console.log(`- ${strategies.length} improvement strategies identified`);
  console.log(`- ${insights.length} insights documented in ConPort`);
  
  console.log('\nNext steps:');
  console.log('1. Review the HTML dashboard for a complete analysis');
  console.log('2. Implement the high-priority improvement strategies');
  console.log('3. Monitor progress through regular reassessment');
  console.log('4. Update the knowledge base with new information');
}

/**
 * Run all examples
 */
function runAll() {
  console.log('=== Knowledge Metrics Dashboard Usage Examples ===');
  
  standaloneExample();
  orchestratorModeExample();
  conportMaintenanceModeExample();
  knowledgeHealthAssessmentExample();
  
  console.log('\n=== Examples Complete ===');
}

// Mock mode classes for example purposes
class SampleMode {
  constructor() {
    this.name = 'Sample Mode';
  }
}

class SampleOrchestratorMode extends SampleMode {
  constructor() {
    super();
    this.name = 'Orchestrator Mode';
  }
}

class SampleConPortMaintenanceMode extends SampleMode {
  constructor() {
    super();
    this.name = 'ConPort Maintenance Mode';
  }
}

// Export mock modes for example
module.exports = {
  OrchestratorMode: SampleOrchestratorMode,
  ConPortMaintenanceMode: SampleConPortMaintenanceMode,
  standaloneExample,
  orchestratorModeExample,
  conportMaintenanceModeExample,
  knowledgeHealthAssessmentExample,
  runAll
};

// If this script is run directly, execute the examples
if (require.main === module) {
  runAll();
}