/**
 * Knowledge Metrics Dashboard - Knowledge-First Component
 * 
 * This module provides knowledge-first capabilities for the Knowledge Metrics Dashboard,
 * ensuring that knowledge management best practices are followed and insights from the
 * metrics are systematically captured in ConPort.
 */

const { KnowledgeMetricsDashboard } = require('../knowledge-metrics-dashboard');

/**
 * Class providing knowledge-first capabilities for the Knowledge Metrics Dashboard
 */
class KnowledgeMetricsKnowledgeFirst {
  /**
   * Create a new KnowledgeMetricsKnowledgeFirst instance
   * @param {Object} conportClient - ConPort client for knowledge operations
   * @param {KnowledgeMetricsDashboard} dashboard - Knowledge metrics dashboard instance
   */
  constructor(conportClient, dashboard) {
    this.conportClient = conportClient;
    this.dashboard = dashboard;
    this.lastDashboardData = null;
    this.insights = [];
  }
  
  /**
   * Process dashboard data for knowledge insights
   * @param {Object} dashboardData - Dashboard data to process
   * @returns {Array} - Extracted knowledge insights
   */
  extractInsightsFromDashboard(dashboardData) {
    if (!dashboardData) {
      return [];
    }
    
    this.lastDashboardData = dashboardData;
    this.insights = [];
    
    // Extract insights from overall health
    this._processOverallHealth(dashboardData.overallHealth);
    
    // Extract insights from categories and metrics
    Object.values(dashboardData.categories).forEach(category => {
      this._processCategoryMetrics(category);
    });
    
    // Process recommendations
    this._processRecommendations(dashboardData.recommendations);
    
    // Process trends
    this._processTrends(dashboardData.trends);
    
    return this.insights;
  }
  
  /**
   * Process overall health for insights
   * @private
   * @param {Object} overallHealth - Overall health data
   */
  _processOverallHealth(overallHealth) {
    if (!overallHealth) return;
    
    const insight = {
      type: 'overall_health',
      importance: 'high',
      title: `Overall knowledge health: ${(overallHealth.score * 100).toFixed(1)}%`,
      description: `The knowledge base is in ${overallHealth.status} condition`,
      metricValue: overallHealth.score,
      status: overallHealth.status,
      timestamp: new Date().toISOString()
    };
    
    this.insights.push(insight);
  }
  
  /**
   * Process category metrics for insights
   * @private
   * @param {Object} category - Category data
   */
  _processCategoryMetrics(category) {
    if (!category || !category.metrics || !category.metrics.length) return;
    
    // Find most critical metric in the category
    const criticalMetrics = category.metrics
      .filter(m => m.status === 'critical')
      .sort((a, b) => a.value - b.value); // Sort ascending by value (worst first)
    
    if (criticalMetrics.length > 0) {
      const worstMetric = criticalMetrics[0];
      
      const insight = {
        type: 'critical_metric',
        importance: 'high',
        title: `${category.name}: Critical ${worstMetric.name}`,
        description: `${worstMetric.name} is at a critical level (${(worstMetric.value * 100).toFixed(1)}%)`,
        metricValue: worstMetric.value,
        category: category.name,
        metric: worstMetric.name,
        status: 'critical',
        timestamp: new Date().toISOString()
      };
      
      this.insights.push(insight);
    }
    
    // Find best performing metric in category
    const goodMetrics = category.metrics
      .filter(m => m.status === 'good')
      .sort((a, b) => b.value - a.value); // Sort descending by value (best first)
    
    if (goodMetrics.length > 0) {
      const bestMetric = goodMetrics[0];
      
      const insight = {
        type: 'exemplary_metric',
        importance: 'medium',
        title: `${category.name}: Strong ${bestMetric.name}`,
        description: `${bestMetric.name} is performing well at ${(bestMetric.value * 100).toFixed(1)}%`,
        metricValue: bestMetric.value,
        category: category.name,
        metric: bestMetric.name,
        status: 'good',
        timestamp: new Date().toISOString()
      };
      
      this.insights.push(insight);
    }
    
    // Calculate category average
    const avgValue = category.metrics.reduce((sum, m) => sum + m.value, 0) / category.metrics.length;
    const categoryStatus = avgValue >= 0.7 ? 'good' : (avgValue >= 0.5 ? 'warning' : 'critical');
    
    if (categoryStatus === 'critical' || categoryStatus === 'warning') {
      const insight = {
        type: 'category_health',
        importance: categoryStatus === 'critical' ? 'high' : 'medium',
        title: `${category.name} needs attention`,
        description: `${category.name} metrics average ${(avgValue * 100).toFixed(1)}%, indicating ${categoryStatus} status`,
        metricValue: avgValue,
        category: category.name,
        status: categoryStatus,
        timestamp: new Date().toISOString()
      };
      
      this.insights.push(insight);
    }
  }
  
  /**
   * Process recommendations for insights
   * @private
   * @param {Array} recommendations - Recommendations from dashboard
   */
  _processRecommendations(recommendations) {
    if (!recommendations || !recommendations.length) return;
    
    // Group recommendations by category
    const categorizedRecommendations = {};
    
    recommendations.forEach(rec => {
      if (!categorizedRecommendations[rec.category]) {
        categorizedRecommendations[rec.category] = [];
      }
      
      categorizedRecommendations[rec.category].push(rec);
    });
    
    // Create insights for each category's recommendations
    Object.entries(categorizedRecommendations).forEach(([category, recs]) => {
      const highPriorityCount = recs.filter(r => r.priority === 'high').length;
      const importance = highPriorityCount > 0 ? 'high' : 'medium';
      
      const recommendationsList = recs.map(r => r.recommendation).join('; ');
      
      const insight = {
        type: 'category_recommendations',
        importance,
        title: `${category} improvement opportunities`,
        description: `${recs.length} recommendations for ${category}: ${recommendationsList}`,
        category,
        recommendationsCount: recs.length,
        highPriorityCount,
        recommendations: recs,
        timestamp: new Date().toISOString()
      };
      
      this.insights.push(insight);
    });
  }
  
  /**
   * Process trends for insights
   * @private
   * @param {Object} trends - Trend data
   */
  _processTrends(trends) {
    if (!trends) return;
    
    // Find concerning trends (decreasing)
    const concerningTrends = Object.entries(trends)
      .filter(([category, trend]) => trend === 'decreasing')
      .map(([category]) => category);
    
    if (concerningTrends.length > 0) {
      const insight = {
        type: 'concerning_trends',
        importance: 'medium',
        title: 'Declining knowledge health metrics',
        description: `The following areas show decreasing trends: ${concerningTrends.join(', ')}`,
        categories: concerningTrends,
        timestamp: new Date().toISOString()
      };
      
      this.insights.push(insight);
    }
    
    // Find positive trends (increasing)
    const positiveTrends = Object.entries(trends)
      .filter(([category, trend]) => trend === 'increasing')
      .map(([category]) => category);
    
    if (positiveTrends.length > 0) {
      const insight = {
        type: 'positive_trends',
        importance: 'low',
        title: 'Improving knowledge health metrics',
        description: `The following areas show increasing trends: ${positiveTrends.join(', ')}`,
        categories: positiveTrends,
        timestamp: new Date().toISOString()
      };
      
      this.insights.push(insight);
    }
  }
  
  /**
   * Document insights in ConPort
   * @param {Array} insights - Knowledge insights to document
   * @returns {Object} - Result of documentation operations
   */
  documentInsightsInConPort(insights) {
    const insightsToDocument = insights || this.insights;
    
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
    
    const results = {
      decisions: [],
      progress: [],
      systemPatterns: [],
      customData: [],
      activeContextUpdate: null
    };
    
    // Process high importance insights for decisions
    const highImportanceInsights = insightsToDocument.filter(insight => 
      insight.importance === 'high'
    );
    
    // Log decisions for critical metrics
    highImportanceInsights.forEach(insight => {
      if (insight.type === 'critical_metric' || insight.type === 'category_health') {
        const decision = this._createKnowledgeQualityDecision(insight);
        if (decision) {
          try {
            const decisionId = this.conportClient.logDecision(decision);
            results.decisions.push({
              insight: insight.title,
              decisionId,
              success: true
            });
          } catch (error) {
            results.decisions.push({
              insight: insight.title,
              error: error.message,
              success: false
            });
          }
        }
      }
    });
    
    // Log progress entries for all recommendations
    const recommendationInsights = insightsToDocument.filter(insight => 
      insight.type === 'category_recommendations'
    );
    
    recommendationInsights.forEach(insight => {
      const progressEntry = this._createImprovementTaskProgress(insight);
      if (progressEntry) {
        try {
          const progressId = this.conportClient.logProgress(progressEntry);
          results.progress.push({
            insight: insight.title,
            progressId,
            success: true
          });
        } catch (error) {
          results.progress.push({
            insight: insight.title,
            error: error.message,
            success: false
          });
        }
      }
    });
    
    // Log custom data for metrics
    const metricsSnapshot = this._createMetricsSnapshot();
    try {
      this.conportClient.logCustomData({
        category: 'KnowledgeMetrics',
        key: `snapshot_${new Date().toISOString().split('T')[0]}`,
        value: metricsSnapshot
      });
      
      results.customData.push({
        category: 'KnowledgeMetrics',
        key: `snapshot_${new Date().toISOString().split('T')[0]}`,
        success: true
      });
    } catch (error) {
      results.customData.push({
        category: 'KnowledgeMetrics',
        error: error.message,
        success: false
      });
    }
    
    // Update active context with current knowledge health
    try {
      const activeContext = this.conportClient.getActiveContext() || {};
      const updatedContext = {
        ...activeContext,
        knowledgeHealth: {
          score: this.lastDashboardData?.overallHealth?.score || 0,
          status: this.lastDashboardData?.overallHealth?.status || 'unknown',
          lastUpdated: new Date().toISOString(),
          criticalCategories: this._getWeakestCategories(),
          strongCategories: this._getStrongestCategories()
        }
      };
      
      this.conportClient.updateActiveContext({ content: updatedContext });
      results.activeContextUpdate = { success: true };
    } catch (error) {
      results.activeContextUpdate = { 
        error: error.message,
        success: false
      };
    }
    
    return {
      success: true,
      message: `Documented ${results.decisions.length} decisions, ${results.progress.length} progress entries, and updated metrics snapshots`,
      results
    };
  }
  
  /**
   * Create a knowledge quality decision from an insight
   * @private
   * @param {Object} insight - Knowledge insight
   * @returns {Object} - Decision object
   */
  _createKnowledgeQualityDecision(insight) {
    if (!insight) return null;
    
    const summary = insight.title;
    
    let rationale = insight.description + '\n\n';
    
    if (insight.type === 'critical_metric') {
      rationale += `Based on the Knowledge Metrics Dashboard, the ${insight.metric} metric in the ${insight.category} category is at a critical level (${(insight.metricValue * 100).toFixed(1)}%). This indicates a significant gap in our knowledge management practices that needs to be addressed.`;
    } else if (insight.type === 'category_health') {
      rationale += `The overall health of the ${insight.category} category is at ${(insight.metricValue * 100).toFixed(1)}%, which is below acceptable thresholds. This suggests systematic issues with our knowledge management practices in this area.`;
    }
    
    const implementationDetails = 'The Knowledge Metrics Dashboard has identified specific improvement opportunities that should be addressed. These will be tracked as progress items in the knowledge management system.';
    
    const tags = ['knowledge-quality', insight.category.toLowerCase().replace(/\s+/g, '-')];
    if (insight.metric) {
      tags.push(insight.metric.toLowerCase().replace(/\s+/g, '-'));
    }
    tags.push('dashboard-generated');
    
    return {
      summary,
      rationale,
      implementationDetails,
      tags
    };
  }
  
  /**
   * Create a progress entry for improvement tasks
   * @private
   * @param {Object} insight - Knowledge insight
   * @returns {Object} - Progress entry object
   */
  _createImprovementTaskProgress(insight) {
    if (!insight || insight.type !== 'category_recommendations' || !insight.recommendations) {
      return null;
    }
    
    const description = `Improve ${insight.category} metrics: ${insight.description}`;
    const status = 'TODO';
    
    return {
      description,
      status
    };
  }
  
  /**
   * Create a snapshot of current metrics for historical tracking
   * @private
   * @returns {Object} - Metrics snapshot
   */
  _createMetricsSnapshot() {
    if (!this.lastDashboardData) {
      return {
        timestamp: new Date().toISOString(),
        message: 'No dashboard data available'
      };
    }
    
    const snapshot = {
      timestamp: new Date().toISOString(),
      overallHealth: this.lastDashboardData.overallHealth,
      categoryScores: {}
    };
    
    // Extract category average scores
    Object.entries(this.lastDashboardData.categories).forEach(([key, category]) => {
      if (category.metrics && category.metrics.length > 0) {
        const avgValue = category.metrics.reduce((sum, m) => sum + m.value, 0) / category.metrics.length;
        snapshot.categoryScores[key] = {
          name: category.name,
          score: avgValue,
          status: avgValue >= 0.7 ? 'good' : (avgValue >= 0.5 ? 'warning' : 'critical')
        };
      }
    });
    
    // Add trends
    if (this.lastDashboardData.trends) {
      snapshot.trends = this.lastDashboardData.trends;
    }
    
    return snapshot;
  }
  
  /**
   * Get the weakest categories from the dashboard
   * @private
   * @returns {Array} - Array of weak category names
   */
  _getWeakestCategories() {
    if (!this.lastDashboardData || !this.lastDashboardData.categories) {
      return [];
    }
    
    const categoryScores = [];
    
    Object.entries(this.lastDashboardData.categories).forEach(([key, category]) => {
      if (category.metrics && category.metrics.length > 0) {
        const avgValue = category.metrics.reduce((sum, m) => sum + m.value, 0) / category.metrics.length;
        categoryScores.push({
          name: category.name,
          score: avgValue
        });
      }
    });
    
    // Sort ascending and get bottom categories
    return categoryScores
      .sort((a, b) => a.score - b.score)
      .slice(0, 2)
      .map(c => c.name);
  }
  
  /**
   * Get the strongest categories from the dashboard
   * @private
   * @returns {Array} - Array of strong category names
   */
  _getStrongestCategories() {
    if (!this.lastDashboardData || !this.lastDashboardData.categories) {
      return [];
    }
    
    const categoryScores = [];
    
    Object.entries(this.lastDashboardData.categories).forEach(([key, category]) => {
      if (category.metrics && category.metrics.length > 0) {
        const avgValue = category.metrics.reduce((sum, m) => sum + m.value, 0) / category.metrics.length;
        categoryScores.push({
          name: category.name,
          score: avgValue
        });
      }
    });
    
    // Sort descending and get top categories
    return categoryScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map(c => c.name);
  }
  
  /**
   * Generate improvement strategies based on dashboard insights
   * @returns {Array} - Array of improvement strategies
   */
  generateImprovementStrategies() {
    if (!this.lastDashboardData) {
      return [];
    }
    
    const strategies = [];
    
    // Process recommendations
    if (this.lastDashboardData.recommendations) {
      const highPriorityRecs = this.lastDashboardData.recommendations.filter(r => r.priority === 'high');
      
      if (highPriorityRecs.length > 0) {
        strategies.push({
          name: 'Critical Metrics Improvement',
          description: 'Focus on addressing high-priority metrics immediately',
          steps: highPriorityRecs.map(r => r.recommendation),
          priority: 'high',
          estimatedEffort: 'medium',
          expectedImpact: 'high'
        });
      }
    }
    
    // Check for weak categories
    const weakCategories = this._getWeakestCategories();
    if (weakCategories.length > 0) {
      strategies.push({
        name: `${weakCategories[0]} Enhancement Initiative`,
        description: `Comprehensive improvement plan for ${weakCategories[0]}`,
        steps: [
          `Conduct knowledge audit for ${weakCategories[0]}`,
          'Identify specific gaps and root causes',
          'Develop structured improvement plan',
          'Implement targeted enhancements',
          'Monitor metrics for improvement'
        ],
        priority: 'high',
        estimatedEffort: 'high',
        expectedImpact: 'high'
      });
    }
    
    // Check freshness metrics
    const freshnessCritical = this._isCategoryCritical('freshness');
    if (freshnessCritical) {
      strategies.push({
        name: 'Knowledge Freshness Campaign',
        description: 'Initiative to update stale knowledge items',
        steps: [
          'Identify all knowledge items not updated in 6+ months',
          'Prioritize items by importance and usage',
          'Schedule systematic review sessions',
          'Update or archive outdated items',
          'Implement regular review schedule'
        ],
        priority: 'medium',
        estimatedEffort: 'medium',
        expectedImpact: 'medium'
      });
    }
    
    // Check connectivity metrics
    const connectivityCritical = this._isCategoryCritical('connectivity');
    if (connectivityCritical) {
      strategies.push({
        name: 'Knowledge Graph Enhancement',
        description: 'Strengthen relationships between knowledge items',
        steps: [
          'Map existing knowledge relationships',
          'Identify missing connections between related items',
          'Create links between decisions and implementing patterns',
          'Improve traceability from requirements to implementation',
          'Document relationship types and semantics'
        ],
        priority: 'medium',
        estimatedEffort: 'high',
        expectedImpact: 'high'
      });
    }
    
    // Add general strategy if needed
    if (strategies.length === 0) {
      strategies.push({
        name: 'General Knowledge Health Maintenance',
        description: 'Routine maintenance to keep knowledge base healthy',
        steps: [
          'Regular review of knowledge metrics',
          'Address any metrics approaching warning thresholds',
          'Update documentation for recent code changes',
          'Archive obsolete knowledge items',
          'Validate knowledge accuracy periodically'
        ],
        priority: 'low',
        estimatedEffort: 'low',
        expectedImpact: 'medium'
      });
    }
    
    return strategies;
  }
  
  /**
   * Check if a category has critical status
   * @private
   * @param {string} categoryName - Name of the category
   * @returns {boolean} - True if critical
   */
  _isCategoryCritical(categoryName) {
    if (!this.lastDashboardData || !this.lastDashboardData.categories) {
      return false;
    }
    
    const category = Object.values(this.lastDashboardData.categories)
      .find(c => c.name.toLowerCase().includes(categoryName.toLowerCase()));
    
    if (!category || !category.metrics || category.metrics.length === 0) {
      return false;
    }
    
    const criticalMetrics = category.metrics.filter(m => m.status === 'critical');
    return criticalMetrics.length > 0;
  }
}

module.exports = KnowledgeMetricsKnowledgeFirst;