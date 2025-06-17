# Advanced ConPort Analytics

## Overview

The Advanced ConPort Analytics component is a Phase 3 enhancement to the ConPort system that provides comprehensive analytics capabilities for knowledge artifacts. It enables teams to analyze relationships between artifacts, track activity patterns, measure knowledge impact, and create analytics dashboards for visualizing data.

By analyzing the knowledge base stored in ConPort, this component helps teams understand how knowledge is created, connected, and utilized, leading to better decision-making and knowledge management.

## Architecture

The Advanced ConPort Analytics component follows the established three-layer architecture pattern used throughout the ConPort system:

### 1. Validation Layer (`analytics-validation.js`)

The validation layer ensures data integrity by validating input parameters before processing. It provides:
- Parameter validation for all analytics operations
- Consistent error handling
- Type checking and data format validation
- Default value management

### 2. Knowledge-First Core (`analytics-core.js`)

The core layer implements the analytics logic independent of ConPort integration. It contains:
- Base analytics generation functions
- Relationship graph analysis
- Activity pattern analysis
- Knowledge impact assessment
- Dashboard configuration
- Export capabilities

### 3. Integration Layer (`analytics.js`)

The integration layer connects the core analytics capabilities with ConPort, providing:
- A simplified API for clients
- ConPort data fetching and caching
- Active context updates with analytics insights
- Dashboard management
- Error handling and logging

## Key Capabilities

### Analytics Queries

Run queries to analyze ConPort data across multiple dimensions:
- Artifact counts and distributions
- Tag usage and patterns
- Quality metrics and trends
- Relationship density and structure
- Activity patterns

### Relationship Analysis

Analyze the connections between knowledge artifacts:
- Generate relationship graphs centered on specific artifacts
- Analyze connection density and patterns
- Identify isolated artifacts or knowledge silos
- Visualize knowledge connections

### Activity Pattern Analysis

Track how knowledge artifacts are created and modified:
- Analyze activity trends over time
- Identify peak activity periods
- Compare activity across different artifact types
- Measure team engagement with knowledge artifacts

### Knowledge Impact Analysis

Measure the impact and influence of specific artifacts:
- Calculate impact scores based on references and relationships
- Identify high-impact knowledge artifacts
- Track how impact evolves over time
- Measure direct and indirect influence across the knowledge base

### Analytics Dashboards

Create customizable dashboards to visualize analytics data:
- Configure multiple widgets with different visualizations
- Save and manage dashboard configurations
- Set default dashboards for quick access
- Export dashboard data

### Knowledge Insights

Generate actionable insights from the knowledge base:
- Identify top patterns and trends
- Detect anomalies and potential issues
- Provide quality improvement recommendations
- Update active context with key insights

## Usage

### Initialization

```javascript
const { createAnalytics } = require('./utilities/phase-3/conport-analytics/analytics');

const analytics = createAnalytics({
  workspaceId: '/path/to/workspace',
  conPortClient: conPortClient,
  enableValidation: true,
  cacheResults: true,
  addToActiveContext: false
});
```

### Running Analytics Queries

```javascript
// Run a basic analytics query
const results = await analytics.runAnalyticsQuery({
  timeframe: 'month',
  artifactTypes: ['decision', 'system_pattern', 'progress'],
  dimensions: ['count', 'types', 'tags', 'quality'],
  filters: { minQuality: 70 }
});
```

### Analyzing Relationships

```javascript
// Analyze relationships with a central node
const results = await analytics.analyzeRelationships({
  centralNodeType: 'decision',
  centralNodeId: '1',
  depth: 2,
  relationshipTypes: ['implements', 'related_to']
});
```

### Analyzing Activity

```javascript
// Analyze activity patterns
const results = await analytics.analyzeActivity({
  timeframe: 'month',
  activityTypes: ['create', 'update'],
  artifactTypes: ['decision', 'system_pattern'],
  groupBy: 'day',
  cumulative: false
});
```

### Analyzing Impact

```javascript
// Analyze the impact of a knowledge artifact
const results = await analytics.analyzeImpact({
  artifactType: 'decision',
  artifactId: '1',
  impactMetric: 'references',
  depth: 2,
  includeIndirect: true
});
```

### Creating Dashboards

```javascript
// Create an analytics dashboard
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
    // Additional widgets...
  ],
  layout: {
    type: 'grid',
    columns: 2,
    rows: 2,
    positions: [
      { id: 'widget-1', x: 0, y: 0, width: 2, height: 1 },
      // Additional positions...
    ]
  },
  isDefault: false
});
```

### Getting Insights

```javascript
// Get insights from the knowledge base
const insights = await analytics.getInsights({
  artifactTypes: ['decision', 'system_pattern', 'progress'],
  depth: 2,
  topK: 3
});
```

### Exporting Analytics

```javascript
// Export analytics data
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
```

## Integration with ConPort

The Advanced ConPort Analytics component integrates deeply with ConPort through:

### 1. Data Retrieval

- Fetches decisions, system patterns, progress entries, and custom data
- Retrieves relationship information using `get_linked_items`
- Supports filtering and scoping of data retrieval

### 2. Result Caching

- Stores analytics results in ConPort using `log_custom_data`
- Organizes results by type (analytics, relationships, activity, impact)
- Attaches metadata for future reference and trending

### 3. Active Context Updates

- Updates active context with analytics insights when enabled
- Adds key findings and metrics to the context for awareness
- Maintains a history of recent analytics results

### 4. Dashboard Management

- Stores dashboard configurations in custom data
- Supports creating, updating, listing, and deleting dashboards
- Manages default dashboard designation

## Best Practices

### 1. Analytics Query Design

- Start with broad queries to understand the overall knowledge landscape
- Narrow down to specific artifact types or time periods for detailed analysis
- Use multiple dimensions for comprehensive analysis

### 2. Relationship Analysis

- Begin with high-impact artifacts as central nodes
- Use appropriate depth based on the knowledge graph size
- Look for patterns of isolation or high connectivity

### 3. Dashboard Creation

- Create focused dashboards for specific purposes
- Combine different visualization types for comprehensive views
- Update dashboards regularly to reflect current priorities

### 4. Performance Considerations

- Limit depth and scope for large knowledge bases
- Cache results when performing repetitive analysis
- Use filters to reduce data processing requirements

### 5. Active Context Integration

- Enable `addToActiveContext` for important analyses
- Add insights to active context during regular reviews
- Use insights to guide knowledge management activities

## Practical Examples

Several examples demonstrating the use of the Advanced ConPort Analytics component are available in `examples/phase-3/analytics-usage.js`.

## See Also

- [Temporal Knowledge Management](./temporal-knowledge-management.md)
- [Knowledge Quality Enhancement](./knowledge-quality-enhancement.md)
- [Phase 3 Advanced Knowledge Management Plan](./phase-3-advanced-knowledge-management-plan.md)