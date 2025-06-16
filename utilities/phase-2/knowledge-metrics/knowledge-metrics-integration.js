/**
 * Knowledge Metrics Dashboard Integration
 * 
 * This module provides integration functionality for the knowledge metrics dashboard,
 * handling interactions with ConPort and generating visual representations of metrics
 * for display to users.
 */

/**
 * Integration methods for the Knowledge Metrics Dashboard
 */
class KnowledgeMetricsIntegration {
  /**
   * Create a KnowledgeMetricsIntegration instance
   * @param {Object} dashboard - KnowledgeMetricsDashboard instance
   */
  constructor(dashboard) {
    this.dashboard = dashboard;
  }

  /**
   * Generate dashboard from ConPort data
   * @param {Object} conportClient - ConPort client instance
   * @param {Object} options - Dashboard generation options
   * @returns {Object} - Dashboard data
   */
  generateDashboard(conportClient, options = {}) {
    if (!conportClient) {
      throw new Error('ConPort client required to generate dashboard');
    }
    
    // Get data from ConPort
    const conportData = {
      productContext: conportClient.getProductContext(),
      activeContext: conportClient.getActiveContext(),
      decisions: conportClient.getDecisions({ limit: options.limit || 1000 }),
      systemPatterns: conportClient.getSystemPatterns(),
      progressEntries: conportClient.getProgress({ limit: options.limit || 1000 })
    };
    
    // Add custom data by categories
    conportData.customData = {};
    const categories = conportClient.getCustomData() || [];
    categories.forEach(category => {
      conportData.customData[category] = conportClient.getCustomData({ category });
    });
    
    // Calculate statistics
    conportData.statistics = this.dashboard._calculateStatistics(conportData);
    
    // Calculate metrics for each category
    const metrics = {};
    
    Object.entries(this.dashboard.categories).forEach(([categoryKey, category]) => {
      metrics[categoryKey] = {
        name: category.name,
        description: category.description,
        metrics: category.calculateMetrics(conportData)
      };
    });
    
    // Calculate overall health score
    const allMetrics = Object.values(metrics)
      .reduce((all, category) => [...all, ...category.metrics], []);
    
    const overallHealth = allMetrics.reduce((sum, metric) => sum + metric.value, 0) / allMetrics.length;
    
    const healthStatus = overallHealth >= 0.7 ? 'good' : 
                        overallHealth >= 0.5 ? 'warning' : 
                        'critical';
    
    // Build dashboard data
    this.dashboard.dashboardData = {
      generatedAt: new Date().toISOString(),
      overallHealth: {
        score: overallHealth,
        status: healthStatus
      },
      categories: metrics,
      recommendations: this.dashboard._generateRecommendations(metrics),
      statistics: conportData.statistics,
      trends: this.dashboard._calculateTrends()
    };
    
    this.dashboard.lastRefresh = new Date();
    
    return this.dashboard.dashboardData;
  }

  /**
   * Generate HTML representation of the dashboard
   * @returns {string} - HTML dashboard
   */
  generateHtmlDashboard() {
    if (!this.dashboard.dashboardData) {
      return '<div>No dashboard data available. Generate dashboard first.</div>';
    }
    
    const data = this.dashboard.dashboardData;
    
    // Simple styles
    const styles = `
      <style>
        .dashboard {
          font-family: Arial, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #ccc;
        }
        .overall-health {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          padding: 15px;
          border-radius: 5px;
        }
        .health-good { background-color: #e6ffe6; border: 1px solid #99cc99; }
        .health-warning { background-color: #fff9e6; border: 1px solid #ffcc66; }
        .health-critical { background-color: #ffe6e6; border: 1px solid #cc9999; }
        .health-score {
          font-size: 32px;
          font-weight: bold;
          margin-right: 20px;
        }
        .categories {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .category {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 15px;
        }
        .category h3 {
          margin-top: 0;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .metric {
          margin-bottom: 15px;
        }
        .metric-name {
          font-weight: bold;
          display: flex;
          justify-content: space-between;
        }
        .metric-value {
          padding: 3px 6px;
          border-radius: 3px;
          font-size: 14px;
        }
        .status-good { background-color: #e6ffe6; }
        .status-warning { background-color: #fff9e6; }
        .status-critical { background-color: #ffe6e6; }
        .metric-description {
          font-size: 14px;
          color: #666;
          margin-top: 5px;
        }
        .recommendations {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 30px;
        }
        .recommendations h3 {
          margin-top: 0;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .recommendation {
          padding: 8px;
          margin-bottom: 5px;
          border-radius: 3px;
        }
        .priority-high { background-color: #ffe6e6; }
        .priority-medium { background-color: #fff9e6; }
        .priority-low { background-color: #f5f5f5; }
        .trends {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 15px;
        }
        .trends h3 {
          margin-top: 0;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .trend {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .trend-increasing { color: green; }
        .trend-stable { color: blue; }
        .trend-decreasing { color: red; }
      </style>
    `;
    
    // Overall health
    const healthClass = `health-${data.overallHealth.status}`;
    const overallHealth = `
      <div class="overall-health ${healthClass}">
        <div class="health-score">${(data.overallHealth.score * 100).toFixed(1)}%</div>
        <div>
          <h3>Overall Knowledge Health</h3>
          <p>Generated at: ${new Date(data.generatedAt).toLocaleString()}</p>
        </div>
      </div>
    `;
    
    // Categories and metrics
    const categories = Object.entries(data.categories).map(([key, category]) => {
      const metrics = category.metrics.map(metric => {
        const statusClass = `status-${metric.status}`;
        return `
          <div class="metric">
            <div class="metric-name">
              ${metric.name}
              <span class="metric-value ${statusClass}">${(metric.value * 100).toFixed(1)}%</span>
            </div>
            <div class="metric-description">${metric.description}</div>
          </div>
        `;
      }).join('');
      
      return `
        <div class="category">
          <h3>${category.name}</h3>
          ${metrics}
        </div>
      `;
    }).join('');
    
    // Recommendations
    const recommendations = data.recommendations.length > 0 
      ? data.recommendations.map(rec => {
          return `
            <div class="recommendation priority-${rec.priority}">
              <strong>${rec.category}:</strong> ${rec.recommendation}
            </div>
          `;
        }).join('')
      : '<p>No recommendations at this time. Knowledge base looks healthy!</p>';
    
    // Trends
    const trends = Object.entries(data.trends).map(([category, trend]) => {
      const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
      return `
        <div class="trend">
          <div>${formattedCategory}</div>
          <div class="trend-${trend}">${trend}</div>
        </div>
      `;
    }).join('');
    
    // Construct full HTML
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ConPort Knowledge Metrics Dashboard</title>
        ${styles}
      </head>
      <body>
        <div class="dashboard">
          <div class="header">
            <h1>ConPort Knowledge Metrics Dashboard</h1>
            <p>A comprehensive view of knowledge health and quality across your project.</p>
          </div>
          
          ${overallHealth}
          
          <div class="categories">
            ${categories}
          </div>
          
          <div class="recommendations">
            <h3>Recommendations</h3>
            ${recommendations}
          </div>
          
          <div class="trends">
            <h3>Trends</h3>
            ${trends}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Save dashboard to file
   * @param {string} path - File path to save to
   * @param {Object} options - Options for saving
   * @returns {boolean} - Success status
   */
  saveDashboardToFile(path, options = {}) {
    const format = options.format || 'html';
    
    try {
      const fs = require('fs');
      let content;
      
      if (format === 'html') {
        content = this.generateHtmlDashboard();
      } else if (format === 'json') {
        content = this.dashboard.exportToJson();
      } else {
        throw new Error(`Unsupported format: ${format}`);
      }
      
      fs.writeFileSync(path, content);
      return true;
    } catch (error) {
      console.error('Failed to save dashboard:', error);
      return false;
    }
  }
}

module.exports = { KnowledgeMetricsIntegration };