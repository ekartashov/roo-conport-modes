/**
 * Knowledge Metrics Dashboard Core
 * 
 * This module provides the core functionality for generating a comprehensive knowledge
 * metrics dashboard that visualizes the quality, coverage, and usage of knowledge
 * stored in ConPort. It contains the metric calculation and dashboard generation logic.
 */

/**
 * Class representing a knowledge metric
 */
class KnowledgeMetric {
  /**
   * Create a knowledge metric
   * @param {string} name - Metric name
   * @param {string} description - Metric description
   * @param {Function} calculator - Function to calculate the metric
   * @param {string} unit - Unit of measurement
   * @param {Array} thresholds - Thresholds for good/warning/critical values [good, warning]
   */
  constructor(name, description, calculator, unit = 'score', thresholds = [0.7, 0.5]) {
    this.name = name;
    this.description = description;
    this.calculator = calculator;
    this.unit = unit;
    this.thresholds = thresholds;
  }
  
  /**
   * Calculate metric value
   * @param {Object} data - Data to calculate metric from
   * @returns {number} - Calculated metric value
   */
  calculate(data) {
    return this.calculator(data);
  }
  
  /**
   * Get status based on value and thresholds
   * @param {number} value - Metric value
   * @returns {string} - Status: 'good', 'warning', or 'critical'
   */
  getStatus(value) {
    const [goodThreshold, warningThreshold] = this.thresholds;
    
    if (value >= goodThreshold) {
      return 'good';
    } else if (value >= warningThreshold) {
      return 'warning';
    } else {
      return 'critical';
    }
  }
}

/**
 * Class representing a metric category
 */
class MetricCategory {
  /**
   * Create a metric category
   * @param {string} name - Category name
   * @param {string} description - Category description
   */
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.metrics = [];
  }
  
  /**
   * Add a metric to the category
   * @param {KnowledgeMetric} metric - Metric to add
   */
  addMetric(metric) {
    this.metrics.push(metric);
  }
  
  /**
   * Calculate all metrics in the category
   * @param {Object} data - Data to calculate metrics from
   * @returns {Array} - Array of metric results
   */
  calculateMetrics(data) {
    return this.metrics.map(metric => {
      const value = metric.calculate(data);
      
      return {
        name: metric.name,
        description: metric.description,
        value,
        unit: metric.unit,
        status: metric.getStatus(value)
      };
    });
  }
}

/**
 * Class representing a knowledge metrics dashboard
 */
class KnowledgeMetricsDashboard {
  /**
   * Create a knowledge metrics dashboard
   */
  constructor() {
    this.categories = this._initializeCategories();
    this.lastRefresh = null;
    this.dashboardData = null;
  }
  
  /**
   * Initialize metric categories
   * @private
   * @returns {Object} - Object with metric categories
   */
  _initializeCategories() {
    // Coverage metrics
    const coverage = new MetricCategory(
      'Knowledge Coverage',
      'Metrics related to knowledge coverage across different aspects of the project'
    );
    
    coverage.addMetric(new KnowledgeMetric(
      'Decision Coverage',
      'Percentage of significant architectural/implementation decisions that are documented',
      (data) => {
        // Count decisions vs. estimated total decisions
        const decisionsCount = data.decisions ? data.decisions.length : 0;
        const estimatedTotal = data.statistics.estimatedTotalDecisions || decisionsCount;
        return estimatedTotal > 0 ? decisionsCount / estimatedTotal : 0;
      },
      'percentage',
      [0.8, 0.5]
    ));
    
    coverage.addMetric(new KnowledgeMetric(
      'Pattern Coverage',
      'Percentage of system patterns that are documented',
      (data) => {
        // Count patterns vs. estimated total patterns
        const patternsCount = data.systemPatterns ? data.systemPatterns.length : 0;
        const estimatedTotal = data.statistics.estimatedTotalPatterns || patternsCount;
        return estimatedTotal > 0 ? patternsCount / estimatedTotal : 0;
      },
      'percentage',
      [0.7, 0.4]
    ));
    
    coverage.addMetric(new KnowledgeMetric(
      'Component Documentation',
      'Percentage of system components with documentation',
      (data) => {
        // This would ideally analyze the product context for component coverage
        // For this example, we'll use a simulated value
        return data.statistics.componentDocumentationCoverage || 0.65;
      },
      'percentage',
      [0.8, 0.6]
    ));
    
    // Quality metrics
    const quality = new MetricCategory(
      'Knowledge Quality',
      'Metrics related to the quality of knowledge in the system'
    );
    
    quality.addMetric(new KnowledgeMetric(
      'Decision Quality',
      'Average quality score of decision documentation',
      (data) => {
        // Calculate average decision quality
        if (!data.decisions || data.decisions.length === 0) {
          return 0;
        }
        
        // In a real implementation, this would analyze decision content
        // For this example, we'll use quality scores if they exist
        const qualityScores = data.decisions.map(d => d.qualityScore || Math.random() * 0.3 + 0.5);
        return qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;
      },
      'score',
      [0.8, 0.6]
    ));
    
    quality.addMetric(new KnowledgeMetric(
      'Pattern Quality',
      'Average quality score of system pattern documentation',
      (data) => {
        // Calculate average pattern quality
        if (!data.systemPatterns || data.systemPatterns.length === 0) {
          return 0;
        }
        
        // In a real implementation, this would analyze pattern content
        // For this example, we'll use quality scores if they exist
        const qualityScores = data.systemPatterns.map(p => p.qualityScore || Math.random() * 0.3 + 0.6);
        return qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;
      },
      'score',
      [0.8, 0.6]
    ));
    
    quality.addMetric(new KnowledgeMetric(
      'Context Quality',
      'Quality score of product and active context',
      (data) => {
        // In a real implementation, this would analyze context content
        // For this example, we'll use a simulated value
        return data.statistics.contextQuality || 0.75;
      },
      'score',
      [0.8, 0.6]
    ));
    
    // Connectivity metrics
    const connectivity = new MetricCategory(
      'Knowledge Connectivity',
      'Metrics related to how well knowledge items are connected'
    );
    
    connectivity.addMetric(new KnowledgeMetric(
      'Relationship Density',
      'Average relationships per knowledge item',
      (data) => {
        // Calculate relationship density
        const totalItems = (
          (data.decisions ? data.decisions.length : 0) +
          (data.systemPatterns ? data.systemPatterns.length : 0) +
          (data.progressEntries ? data.progressEntries.length : 0) +
          (data.customData ? Object.keys(data.customData).length : 0)
        );
        
        const totalRelationships = data.statistics.totalRelationships || 0;
        
        return totalItems > 0 ? totalRelationships / totalItems : 0;
      },
      'ratio',
      [1.5, 0.5]
    ));
    
    connectivity.addMetric(new KnowledgeMetric(
      'Decision-Pattern Connection',
      'Percentage of decisions connected to implementing patterns',
      (data) => {
        // Calculate percentage of decisions linked to patterns
        return data.statistics.decisionsLinkedToPatternsRatio || 0.6;
      },
      'percentage',
      [0.7, 0.4]
    ));
    
    connectivity.addMetric(new KnowledgeMetric(
      'Traceability Score',
      'Score representing the ability to trace from requirements to implementation',
      (data) => {
        // In a real implementation, this would analyze trace paths
        // For this example, we'll use a simulated value
        return data.statistics.traceabilityScore || 0.7;
      },
      'score',
      [0.7, 0.5]
    ));
    
    // Freshness metrics
    const freshness = new MetricCategory(
      'Knowledge Freshness',
      'Metrics related to how up-to-date the knowledge base is'
    );
    
    freshness.addMetric(new KnowledgeMetric(
      'Active Context Freshness',
      'How recently the active context has been updated',
      (data) => {
        if (!data.activeContext || !data.activeContext.lastUpdated) {
          return 0;
        }
        
        // Calculate days since last update
        const lastUpdated = new Date(data.activeContext.lastUpdated);
        const now = new Date();
        const daysSince = (now - lastUpdated) / (1000 * 60 * 60 * 24);
        
        // Convert to a score (1.0 = updated today, decreasing over time)
        return Math.max(0, 1 - daysSince / 30); // 30 days as full period
      },
      'score',
      [0.8, 0.4]
    ));
    
    freshness.addMetric(new KnowledgeMetric(
      'Recent Decision Ratio',
      'Percentage of decisions made/updated in the last 3 months',
      (data) => {
        if (!data.decisions || data.decisions.length === 0) {
          return 0;
        }
        
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
        const recentDecisions = data.decisions.filter(d => {
          const lastUpdated = new Date(d.lastUpdated || d.timestamp || 0);
          return lastUpdated >= threeMonthsAgo;
        });
        
        return recentDecisions.length / data.decisions.length;
      },
      'percentage',
      [0.3, 0.1] // Only need 30% to be recent for good status
    ));
    
    freshness.addMetric(new KnowledgeMetric(
      'Stale Knowledge Items',
      'Percentage of knowledge items not updated in over 6 months',
      (data) => {
        const allItems = [
          ...(data.decisions || []),
          ...(data.systemPatterns || []),
          ...(data.progressEntries || [])
        ];
        
        if (allItems.length === 0) {
          return 0;
        }
        
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const staleItems = allItems.filter(item => {
          const lastUpdated = new Date(item.lastUpdated || item.timestamp || 0);
          return lastUpdated < sixMonthsAgo;
        });
        
        // This is an inverse metric - lower is better
        return staleItems.length / allItems.length;
      },
      'percentage',
      [0.2, 0.5] // Lower is better: 20% or less is good, 50% or more is critical
    ));
    
    // Usage metrics
    const usage = new MetricCategory(
      'Knowledge Usage',
      'Metrics related to how knowledge is being used in the project'
    );
    
    usage.addMetric(new KnowledgeMetric(
      'Decision Reference Rate',
      'Average number of references to decisions in code/docs',
      (data) => {
        // In a real implementation, this would analyze code and docs for decision references
        return data.statistics.decisionReferenceRate || 0.8;
      },
      'ratio',
      [1.0, 0.3]
    ));
    
    usage.addMetric(new KnowledgeMetric(
      'Pattern Implementation Rate',
      'Percentage of documented patterns that are implemented in code',
      (data) => {
        // In a real implementation, this would analyze code for pattern implementations
        return data.statistics.patternImplementationRate || 0.7;
      },
      'percentage',
      [0.7, 0.4]
    ));
    
    usage.addMetric(new KnowledgeMetric(
      'Knowledge Base Query Rate',
      'Frequency of ConPort queries relative to codebase changes',
      (data) => {
        // In a real implementation, this would analyze access logs
        return data.statistics.knowledgeBaseQueryRate || 0.6;
      },
      'ratio',
      [1.0, 0.3]
    ));
    
    return {
      coverage,
      quality,
      connectivity,
      freshness,
      usage
    };
  }
  
  /**
   * Get summary statistics from ConPort data
   * @private
   * @param {Object} conportData - Data from ConPort
   * @returns {Object} - Summary statistics
   */
  _calculateStatistics(conportData) {
    // This would be a comprehensive analysis in a real implementation
    // For this example, we'll return some basic statistics with simulated values
    
    const decisionsCount = conportData.decisions ? conportData.decisions.length : 0;
    const patternsCount = conportData.systemPatterns ? conportData.systemPatterns.length : 0;
    const progressCount = conportData.progressEntries ? conportData.progressEntries.length : 0;
    
    // Simulate some statistics that would be calculated from the data
    return {
      estimatedTotalDecisions: decisionsCount + Math.floor(decisionsCount * Math.random() * 0.5),
      estimatedTotalPatterns: patternsCount + Math.floor(patternsCount * Math.random() * 0.3),
      componentDocumentationCoverage: 0.65 + Math.random() * 0.2,
      totalRelationships: Math.floor((decisionsCount + patternsCount + progressCount) * (1 + Math.random())),
      decisionsLinkedToPatternsRatio: 0.6 + Math.random() * 0.2,
      traceabilityScore: 0.7 + Math.random() * 0.2,
      contextQuality: 0.75 + Math.random() * 0.15,
      decisionReferenceRate: 0.8 + Math.random() * 0.4,
      patternImplementationRate: 0.7 + Math.random() * 0.2,
      knowledgeBaseQueryRate: 0.6 + Math.random() * 0.3
    };
  }
  
  /**
   * Calculate trends based on historical data
   * @private
   * @returns {Object} - Trend data
   */
  _calculateTrends() {
    // In a real implementation, this would compare current metrics with historical data
    // For this example, we'll return simulated trends
    
    return {
      coverage: Math.random() > 0.7 ? 'decreasing' : 'increasing',
      quality: Math.random() > 0.4 ? 'increasing' : 'stable',
      connectivity: Math.random() > 0.5 ? 'increasing' : 'stable',
      freshness: Math.random() > 0.6 ? 'increasing' : 'decreasing',
      usage: Math.random() > 0.5 ? 'increasing' : 'stable'
    };
  }
  
  /**
   * Generate recommendations based on metrics
   * @private
   * @param {Object} metrics - Calculated metrics
   * @returns {Array} - Recommendations
   */
  _generateRecommendations(metrics) {
    const recommendations = [];
    
    // Process all metrics
    Object.values(metrics).forEach(category => {
      category.metrics.forEach(metric => {
        if (metric.status === 'critical') {
          recommendations.push({
            priority: 'high',
            category: category.name,
            metric: metric.name,
            recommendation: `Improve ${metric.name.toLowerCase()} (currently at ${(metric.value * 100).toFixed(1)}%)`
          });
        } else if (metric.status === 'warning') {
          recommendations.push({
            priority: 'medium',
            category: category.name,
            metric: metric.name,
            recommendation: `Consider enhancing ${metric.name.toLowerCase()} (currently at ${(metric.value * 100).toFixed(1)}%)`
          });
        }
      });
    });
    
    // Sort by priority
    recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    return recommendations;
  }
  
  /**
   * Get the last generated dashboard data
   * @returns {Object|null} - Dashboard data or null if not generated yet
   */
  getDashboardData() {
    return this.dashboardData;
  }
  
  /**
   * Export dashboard data to JSON
   * @returns {string} - JSON representation of dashboard data
   */
  exportToJson() {
    if (!this.dashboardData) {
      return '{}';
    }
    
    return JSON.stringify(this.dashboardData, null, 2);
  }
}

module.exports = { 
  KnowledgeMetricsDashboard, 
  KnowledgeMetric, 
  MetricCategory 
};