/**
 * ConPort Analytics Demo
 * 
 * This file demonstrates the usage of the ConPort Analytics component
 * with practical examples for all major functionalities.
 */

// Import ConPort Analytics component
const {
  generateAnalytics,
  analyzeRelationshipGraph,
  analyzeActivityPatterns,
  analyzeKnowledgeImpact,
  configureDashboard,
  prepareAnalyticsExport
} = require('./index');

/**
 * Demo: Generate Basic Analytics
 * 
 * This example demonstrates how to generate basic analytics for a ConPort repository
 * with default settings for the last 30 days.
 */
function demoBasicAnalytics() {
  console.log('--- Basic Analytics Demo ---');
  
  const analytics = generateAnalytics({
    timeframe: 'month'
  });
  
  console.log('Generated Analytics:');
  console.log(`Timestamp: ${analytics.timestamp}`);
  console.log(`Total Items: ${analytics.count.total}`);
  console.log('Item Types:');
  for (const [type, count] of Object.entries(analytics.count)) {
    if (type !== 'total') {
      console.log(`  - ${type}: ${count}`);
    }
  }
  
  if (analytics.qualityMetrics) {
    console.log('Quality Metrics:');
    console.log(`  - Average: ${analytics.qualityMetrics.average}/100`);
    console.log(`  - Min: ${analytics.qualityMetrics.min}/100`);
    console.log(`  - Max: ${analytics.qualityMetrics.max}/100`);
  }
  
  console.log('\n');
}

/**
 * Demo: Relationship Graph Analysis
 * 
 * This example demonstrates how to analyze the relationship graph
 * starting from specific items and traversing to a specified depth.
 */
function demoRelationshipAnalysis() {
  console.log('--- Relationship Graph Analysis Demo ---');
  
  // Analyze relationship graph starting from two items
  const graphAnalysis = analyzeRelationshipGraph({
    startingPoints: ['decision-123', 'pattern-456'],
    depth: 2,
    relationshipTypes: ['implements', 'related_to', 'depends_on']
  });
  
  console.log('Graph Analysis Results:');
  console.log(`Nodes: ${graphAnalysis.nodes.length}`);
  console.log(`Edges: ${graphAnalysis.edges.length}`);
  
  console.log('Top Connected Nodes:');
  const topNodes = graphAnalysis.metrics.topConnectedNodes.slice(0, 3);
  topNodes.forEach((node, index) => {
    console.log(`  ${index + 1}. ${node.id} - ${node.connections} connections`);
  });
  
  console.log(`Orphaned Nodes: ${graphAnalysis.metrics.orphanedNodes}`);
  console.log(`Graph Density: ${graphAnalysis.metrics.density.toFixed(2)}`);
  
  console.log('\n');
}

/**
 * Demo: Activity Pattern Analysis
 * 
 * This example demonstrates how to analyze activity patterns
 * over time, identifying trends and patterns in knowledge creation.
 */
function demoActivityPatternAnalysis() {
  console.log('--- Activity Pattern Analysis Demo ---');
  
  const activityAnalysis = analyzeActivityPatterns({
    timeframe: 'quarter',
    granularity: 'weekly',
    activityTypes: ['creation', 'modification', 'linking']
  });
  
  console.log('Activity Analysis Results:');
  console.log(`Time Period: ${activityAnalysis.timeframe}`);
  console.log(`Total Activities: ${activityAnalysis.totalActivities}`);
  
  console.log('Activity by Type:');
  for (const [type, count] of Object.entries(activityAnalysis.byType)) {
    console.log(`  - ${type}: ${count}`);
  }
  
  console.log('Peak Activity:');
  console.log(`  - Day: ${activityAnalysis.peakActivity.day}`);
  console.log(`  - Count: ${activityAnalysis.peakActivity.count}`);
  
  console.log('Activity Trend:');
  console.log(`  - Direction: ${activityAnalysis.trend.direction}`);
  console.log(`  - Change Rate: ${activityAnalysis.trend.changeRate.toFixed(2)}%`);
  
  console.log('\n');
}

/**
 * Demo: Knowledge Impact Assessment
 * 
 * This example demonstrates how to assess the impact of knowledge artifacts
 * within the repository, identifying high-value items and knowledge gaps.
 */
function demoKnowledgeImpactAssessment() {
  console.log('--- Knowledge Impact Assessment Demo ---');
  
  const impactAnalysis = analyzeKnowledgeImpact({
    itemTypes: ['decision', 'system_pattern'],
    metrics: ['usage', 'relationships', 'completeness']
  });
  
  console.log('Impact Analysis Results:');
  console.log(`Total Items Analyzed: ${impactAnalysis.totalItems}`);
  
  console.log('Top Impact Items:');
  impactAnalysis.topItems.slice(0, 3).forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.id} - Impact Score: ${item.impactScore.toFixed(2)}`);
  });
  
  console.log('Knowledge Gaps:');
  impactAnalysis.gaps.slice(0, 3).forEach((gap, index) => {
    console.log(`  ${index + 1}. ${gap.area} - Severity: ${gap.severity}`);
  });
  
  console.log('\n');
}

/**
 * Demo: Analytics Dashboard Configuration
 * 
 * This example demonstrates how to configure an analytics dashboard
 * with multiple panels and visualization settings.
 */
function demoDashboardConfiguration() {
  console.log('--- Dashboard Configuration Demo ---');
  
  const dashboardConfig = configureDashboard({
    panels: [
      {
        type: 'metric',
        title: 'Total Knowledge Items',
        dataSource: 'count.total',
        display: 'number'
      },
      {
        type: 'chart',
        title: 'Items by Type',
        dataSource: 'count',
        chart: 'pie',
        excludeKeys: ['total']
      },
      {
        type: 'chart',
        title: 'Activity Over Time',
        dataSource: 'activityData.timeline',
        chart: 'line'
      },
      {
        type: 'table',
        title: 'Top Impact Items',
        dataSource: 'impactAnalysis.topItems',
        columns: ['id', 'type', 'impactScore', 'lastModified']
      }
    ],
    layout: {
      rows: 2,
      columns: 2
    },
    settings: {
      theme: 'light',
      refreshInterval: 3600
    }
  });
  
  console.log('Dashboard Configuration:');
  console.log(`Panels: ${dashboardConfig.panels.length}`);
  console.log(`Layout: ${dashboardConfig.layout.rows}x${dashboardConfig.layout.columns}`);
  console.log(`Theme: ${dashboardConfig.settings.theme}`);
  
  console.log('\n');
}

/**
 * Demo: Analytics Export
 * 
 * This example demonstrates how to export analytics data
 * in various formats (CSV, HTML, Markdown).
 */
function demoAnalyticsExport() {
  console.log('--- Analytics Export Demo ---');
  
  // Generate sample analytics data
  const analyticsData = generateAnalytics({
    timeframe: 'month'
  });
  
  // Export to CSV
  const csvExport = prepareAnalyticsExport({
    format: 'csv',
    data: analyticsData
  });
  console.log('CSV Export (first 150 chars):');
  console.log(csvExport.substring(0, 150) + '...');
  
  // Export to HTML
  const htmlExport = prepareAnalyticsExport({
    format: 'html',
    data: analyticsData
  });
  console.log('HTML Export (first 150 chars):');
  console.log(htmlExport.substring(0, 150) + '...');
  
  // Export to Markdown
  const markdownExport = prepareAnalyticsExport({
    format: 'markdown',
    data: analyticsData
  });
  console.log('Markdown Export (first 150 chars):');
  console.log(markdownExport.substring(0, 150) + '...');
  
  console.log('\n');
}

/**
 * Run all demos
 */
function runAllDemos() {
  console.log('===== ConPort Analytics Demos =====\n');
  
  demoBasicAnalytics();
  demoRelationshipAnalysis();
  demoActivityPatternAnalysis();
  demoKnowledgeImpactAssessment();
  demoDashboardConfiguration();
  demoAnalyticsExport();
  
  console.log('===== All Demos Completed =====');
}

// Run the demos if this file is executed directly
if (require.main === module) {
  runAllDemos();
}

// Export demo functions for individual use
module.exports = {
  demoBasicAnalytics,
  demoRelationshipAnalysis,
  demoActivityPatternAnalysis,
  demoKnowledgeImpactAssessment,
  demoDashboardConfiguration,
  demoAnalyticsExport,
  runAllDemos
};