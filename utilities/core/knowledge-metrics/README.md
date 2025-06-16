# Knowledge Metrics Dashboard

The Knowledge Metrics Dashboard is a comprehensive tool for visualizing and analyzing the quality, coverage, and usage of knowledge stored in ConPort. It provides actionable insights into the health of your knowledge base and helps identify areas for improvement.

## Architecture

The Knowledge Metrics Dashboard follows a three-layer architecture:

1. **Core Layer** (`knowledge-metrics-core.js`): Contains the fundamental classes and business logic.
   - `KnowledgeMetric`: Represents a single metric with calculation and status logic
   - `MetricCategory`: Groups related metrics
   - `KnowledgeMetricsDashboard`: Main dashboard class that manages metrics and their calculations

2. **Integration Layer** (`knowledge-metrics-integration.js`): Handles interaction with ConPort and output generation.
   - `KnowledgeMetricsIntegration`: Connects the dashboard to ConPort and generates HTML/JSON output

3. **Validation Layer** (`knowledge-metrics-validation.js`): Ensures inputs and configurations are valid.
   - Provides validation functions for ConPort clients, dashboard options, metrics, and more

## Key Components

### KnowledgeMetric

The `KnowledgeMetric` class represents a single measurable aspect of your knowledge base. Each metric has:
- A name and description
- A calculator function that determines its value
- Thresholds for good/warning/critical status
- A unit of measurement

### MetricCategory

The `MetricCategory` class groups related metrics together. The dashboard includes several categories:
- Knowledge Coverage
- Knowledge Quality
- Knowledge Connectivity
- Knowledge Freshness
- Knowledge Usage

### KnowledgeMetricsDashboard

The main dashboard class that:
- Initializes all metric categories
- Calculates statistics from ConPort data
- Generates recommendations based on metric values
- Exports dashboard data to JSON

### KnowledgeMetricsIntegration

The integration class that:
- Retrieves data from ConPort
- Generates the full dashboard
- Creates HTML representations
- Provides file saving capabilities

## Usage

```javascript
// Import the dashboard components
const { 
  KnowledgeMetricsDashboard, 
  KnowledgeMetricsIntegration,
  validateConPortClient
} = require('./utilities/core/knowledge-metrics');

// Create a new dashboard
const dashboard = new KnowledgeMetricsDashboard();

// Create integration
const integration = new KnowledgeMetricsIntegration(dashboard);

// Validate ConPort client
const validation = validateConPortClient(conportClient);
if (validation.isValid) {
  // Generate dashboard with ConPort data
  const dashboardData = integration.generateDashboard(conportClient, {
    limit: 500  // Limit the number of items to retrieve
  });
  
  // Generate HTML representation
  const html = integration.generateHtmlDashboard();
  
  // Save to file
  integration.saveDashboardToFile('dashboard.html', { format: 'html' });
}
```

## Integration with ConPort

The Knowledge Metrics Dashboard integrates with ConPort to analyze:

- Product Context: Overall project goals, features, and architecture
- Active Context: Current work focus and open issues
- Decisions: Architectural and implementation decisions
- System Patterns: Reusable patterns and solutions
- Progress Entries: Task status and completion
- Custom Data: Other project-specific information

By analyzing these knowledge artifacts, the dashboard provides a comprehensive view of knowledge health across your project.

## Metrics Overview

### Knowledge Coverage
- Decision Coverage: Percentage of significant decisions that are documented
- Pattern Coverage: Percentage of system patterns that are documented
- Component Documentation: Percentage of system components with documentation

### Knowledge Quality
- Decision Quality: Average quality score of decision documentation
- Pattern Quality: Average quality score of system pattern documentation
- Context Quality: Quality score of product and active context

### Knowledge Connectivity
- Relationship Density: Average relationships per knowledge item
- Decision-Pattern Connection: Percentage of decisions connected to implementing patterns
- Traceability Score: Ability to trace from requirements to implementation

### Knowledge Freshness
- Active Context Freshness: How recently the active context has been updated
- Recent Decision Ratio: Percentage of decisions made/updated in the last 3 months
- Stale Knowledge Items: Percentage of knowledge items not updated in over 6 months

### Knowledge Usage
- Decision Reference Rate: Average number of references to decisions in code/docs
- Pattern Implementation Rate: Percentage of documented patterns that are implemented in code
- Knowledge Base Query Rate: Frequency of ConPort queries relative to codebase changes