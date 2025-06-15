/**
 * Example usage of the Advanced ConPort Analytics component
 * 
 * This file demonstrates how to use the analytics component to generate insights,
 * analyze relationships, track activity patterns, measure knowledge impact,
 * and create analytics dashboards.
 */

// Import the analytics module
const { createAnalytics } = require('../utilities/phase-3/conport-analytics/analytics');

/**
 * Mock ConPort client for demonstration purposes
 * In a real implementation, this would be the actual ConPort client
 */
const mockConPortClient = {
  get_decisions: async ({ workspace_id }) => [
    {
      id: 1,
      summary: 'Use three-layer architecture for analytics',
      rationale: 'Separates validation, core logic, and integration concerns',
      tags: ['architecture', 'design-pattern'],
      timestamp: '2025-05-01T10:30:00.000Z'
    },
    {
      id: 2,
      summary: 'Store analytics results in ConPort custom data',
      rationale: 'Provides persistence and enables historical trend analysis',
      tags: ['persistence', 'analytics'],
      timestamp: '2025-05-10T14:45:00.000Z'
    }
  ],
  get_system_patterns: async ({ workspace_id }) => [
    {
      id: 1,
      name: 'Knowledge-first analytics pattern',
      description: 'Pattern for analyzing knowledge artifacts while preserving context',
      tags: ['analytics', 'knowledge-first'],
      timestamp: '2025-04-28T09:15:00.000Z'
    }
  ],
  get_progress: async ({ workspace_id }) => [
    {
      id: 1,
      description: 'Implement analytics validation layer',
      status: 'DONE',
      timestamp: '2025-05-05T11:20:00.000Z'
    },
    {
      id: 2,
      description: 'Implement analytics core functionality',
      status: 'DONE',
      timestamp: '2025-05-12T16:30:00.000Z'
    },
    {
      id: 3,
      description: 'Implement analytics integration layer',
      status: 'IN_PROGRESS',
      timestamp: '2025-05-15T13:10:00.000Z'
    }
  ],
  get_custom_data: async ({ workspace_id, category, key }) => {
    if (category === 'analytics_dashboards') {
      return {
        value: [
          {
            id: 'dashboard-1',
            name: 'Knowledge Quality Dashboard',
            widgets: [
              { id: 'widget-1', type: 'chart', title: 'Quality Trends' },
              { id: 'widget-2', type: 'table', title: 'Recent Activity' }
            ],
            isDefault: true
          }
        ]
      };
    } else if (category === 'analytics_results') {
      return {
        value: {
          options: { timeframe: 'month' },
          results: { count: { total: 150 } },
          timestamp: '2025-05-15T09:00:00.000Z'
        }
      };
    }
    return { value: [] };
  },
  get_linked_items: async ({ workspace_id, item_type, item_id }) => {
    // Sample linked items for demonstration
    if (item_type === 'decision' && item_id === '1') {
      return [
        {
          item_type: 'system_pattern',
          item_id: '1',
          relationship_type: 'implements',
          description: 'This pattern implements the architecture decision'
        }
      ];
    }
    return [];
  },
  log_custom_data: async ({ workspace_id, category, key, value }) => {
    console.log(`Logged custom data to ${category}:${key}`);
    return { success: true, id: `${category}:${key}` };
  },
  update_active_context: async ({ workspace_id, patch_content }) => {
    console.log('Updated active context with analytics insights');
    return { success: true };
  }
};

// Example 1: Initialize the analytics component
async function initializeAnalytics() {
  console.log('\n--- Example 1: Initialize Analytics Component ---');
  
  try {
    const analytics = createAnalytics({
      workspaceId: '/path/to/workspace',
      conPortClient: mockConPortClient,
      enableValidation: true,
      cacheResults: true,
      addToActiveContext: true
    });
    
    console.log('Analytics component initialized successfully');
    return analytics;
  } catch (error) {
    console.error('Failed to initialize analytics:', error.message);
    throw error;
  }
}

// Example 2: Run a basic analytics query
async function runBasicAnalyticsQuery(analytics) {
  console.log('\n--- Example 2: Run Basic Analytics Query ---');
  
  try {
    const results = await analytics.runAnalyticsQuery({
      timeframe: 'month',
      artifactTypes: ['decision', 'system_pattern', 'progress'],
      dimensions: ['count', 'types', 'tags', 'quality'],
      filters: { minQuality: 70 }
    });
    
    console.log('Analytics query results:');
    console.log(JSON.stringify(results, null, 2));
    
    return results;
  } catch (error) {
    console.error('Analytics query failed:', error.message);
  }
}

// Example 3: Analyze relationships in the knowledge graph
async function analyzeRelationships(analytics) {
  console.log('\n--- Example 3: Analyze Relationships ---');
  
  try {
    // Analyze relationships with a central node
    const results = await analytics.analyzeRelationships({
      centralNodeType: 'decision',
      centralNodeId: '1', // ID of the central decision
      depth: 2,
      relationshipTypes: ['implements', 'related_to']
    });
    
    console.log('Relationship analysis results:');
    console.log(`Found ${results.nodes.length} nodes and ${results.edges.length} relationships`);
    console.log('Central node:', results.centralNode);
    console.log('Top related nodes:', results.topRelatedNodes.slice(0, 2));
    
    return results;
  } catch (error) {
    console.error('Relationship analysis failed:', error.message);
  }
}

// Example 4: Analyze activity patterns
async function analyzeActivity(analytics) {
  console.log('\n--- Example 4: Analyze Activity Patterns ---');
  
  try {
    const results = await analytics.analyzeActivity({
      timeframe: 'month',
      activityTypes: ['create', 'update'],
      artifactTypes: ['decision', 'system_pattern'],
      groupBy: 'day',
      cumulative: false
    });
    
    console.log('Activity analysis results:');
    console.log(`Analyzed ${results.activityCount} activities over ${results.timeframe}`);
    console.log('Activity trend:', results.trend);
    console.log('Most active day:', results.mostActiveDay);
    console.log('Activity by type:', results.byType);
    
    return results;
  } catch (error) {
    console.error('Activity analysis failed:', error.message);
  }
}

// Example 5: Analyze knowledge impact
async function analyzeImpact(analytics) {
  console.log('\n--- Example 5: Analyze Knowledge Impact ---');
  
  try {
    const results = await analytics.analyzeImpact({
      artifactType: 'decision',
      artifactId: '1',
      impactMetric: 'references',
      depth: 2,
      includeIndirect: true
    });
    
    console.log('Impact analysis results:');
    console.log(`Analyzed impact for ${results.artifactType}:${results.artifactId}`);
    console.log('Impact score:', results.impactScore);
    console.log('Direct references:', results.directReferences.length);
    console.log('Indirect references:', results.indirectReferences.length);
    console.log('Impact trend:', results.trend);
    
    return results;
  } catch (error) {
    console.error('Impact analysis failed:', error.message);
  }
}

// Example 6: Create an analytics dashboard
async function createDashboard(analytics) {
  console.log('\n--- Example 6: Create Analytics Dashboard ---');
  
  try {
    const dashboard = await analytics.createOrUpdateDashboard({
      name: 'Knowledge Management Dashboard',
      widgets: [
        {
          id: 'widget-1',
          type: 'chart',
          title: 'Activity Over Time',
          dataSource: {
            type: 'activity',
            options: {
              timeframe: 'month',
              groupBy: 'day'
            }
          },
          visualization: {
            type: 'line',
            options: {
              xAxis: 'date',
              yAxis: 'count'
            }
          }
        },
        {
          id: 'widget-2',
          type: 'metric',
          title: 'Total Knowledge Artifacts',
          dataSource: {
            type: 'analytics',
            options: {
              dimensions: ['count']
            }
          },
          visualization: {
            type: 'number',
            options: {
              format: 'integer',
              comparison: 'previous_period'
            }
          }
        },
        {
          id: 'widget-3',
          type: 'table',
          title: 'Quality Issues',
          dataSource: {
            type: 'quality',
            options: {
              filters: {
                score: 'lt:70'
              },
              limit: 5
            }
          },
          visualization: {
            type: 'table',
            options: {
              columns: ['artifactType', 'artifactId', 'summary', 'quality']
            }
          }
        }
      ],
      layout: {
        type: 'grid',
        columns: 2,
        rows: 2,
        positions: [
          { id: 'widget-1', x: 0, y: 0, width: 2, height: 1 },
          { id: 'widget-2', x: 0, y: 1, width: 1, height: 1 },
          { id: 'widget-3', x: 1, y: 1, width: 1, height: 1 }
        ]
      },
      isDefault: false
    });
    
    console.log('Dashboard created:');
    console.log(`ID: ${dashboard.id}`);
    console.log(`Name: ${dashboard.name}`);
    console.log(`Widgets: ${dashboard.widgets.length}`);
    
    return dashboard;
  } catch (error) {
    console.error('Dashboard creation failed:', error.message);
  }
}

// Example 7: Get insights from the knowledge base
async function getInsights(analytics) {
  console.log('\n--- Example 7: Get Knowledge Insights ---');
  
  try {
    const insights = await analytics.getInsights({
      artifactTypes: ['decision', 'system_pattern', 'progress'],
      depth: 2,
      topK: 3
    });
    
    console.log('Knowledge insights:');
    console.log('Top patterns:', insights.topPatterns);
    console.log('Anomalies:', insights.anomalies);
    console.log('Quality issues:', insights.qualityIssues);
    console.log('Trends:', insights.trends);
    console.log('Recommendations:', insights.recommendations);
    
    return insights;
  } catch (error) {
    console.error('Failed to get insights:', error.message);
  }
}

// Example 8: Export analytics data
async function exportAnalytics(analytics) {
  console.log('\n--- Example 8: Export Analytics Data ---');
  
  try {
    const exportResult = await analytics.exportAnalytics({
      query: {
        timeframe: 'month',
        artifactTypes: ['decision', 'system_pattern'],
        dimensions: ['count', 'types', 'quality']
      },
      format: 'json',
      destination: 'file',
      exportConfig: {
        filename: 'analytics-export.json',
        includeMetadata: true
      }
    });
    
    console.log('Analytics export results:');
    console.log(`Export format: ${exportResult.format}`);
    console.log(`Export timestamp: ${exportResult.metadata.timestamp}`);
    console.log(`Export location: ${exportResult.metadata.location}`);
    
    return exportResult;
  } catch (error) {
    console.error('Analytics export failed:', error.message);
  }
}

// Run all examples sequentially
async function runAllExamples() {
  try {
    const analytics = await initializeAnalytics();
    await runBasicAnalyticsQuery(analytics);
    await analyzeRelationships(analytics);
    await analyzeActivity(analytics);
    await analyzeImpact(analytics);
    await createDashboard(analytics);
    await getInsights(analytics);
    await exportAnalytics(analytics);
    
    console.log('\n--- All examples completed successfully ---');
  } catch (error) {
    console.error('Failed to run examples:', error.message);
  }
}

// Run the examples
runAllExamples();

/**
 * Additional use cases (not executed):
 * 
 * 1. List all dashboards:
 *    const dashboards = await analytics.listDashboards();
 * 
 * 2. Get a specific dashboard:
 *    const dashboard = await analytics.getDashboard({ dashboardId: 'dashboard-1' });
 * 
 * 3. Get the default dashboard:
 *    const defaultDashboard = await analytics.getDashboard({ getDefault: true });
 * 
 * 4. Delete a dashboard:
 *    const result = await analytics.deleteDashboard('dashboard-1');
 */