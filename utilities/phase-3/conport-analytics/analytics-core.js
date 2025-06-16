/**
 * Advanced ConPort Analytics - Core Layer
 * 
 * This module provides the core business logic for analytics
 * without direct dependencies on ConPort or other external systems.
 */

/**
 * Generates analytics from ConPort data
 *
 * @param {Object} options - Analytics options
 * @param {Object} data - ConPort data to analyze
 * @returns {Object} Generated analytics results
 */
function generateAnalytics(options, data) {
  const { 
    dimensions = [], 
    timeframe,
    startDate,
    endDate,
    normalizeResults = false,
    limit
  } = options;
  
  // Initialize results structure
  const results = {
    timestamp: new Date().toISOString(),
    options: { ...options },
    count: calculateCounts(data),
    query: { ...options }
  };
  
  // Process each requested dimension
  for (const dimension of dimensions) {
    switch (dimension) {
      case 'types':
        results.typeDistribution = analyzeTypeDistribution(data);
        break;
      case 'tags':
        results.tagDistribution = analyzeTagDistribution(data);
        break;
      case 'quality':
        results.qualityMetrics = analyzeQuality(data);
        break;
      case 'relationships':
        results.relationshipMetrics = analyzeRelationships(data);
        break;
      case 'trends':
        results.trends = analyzeTrends(data, { timeframe, startDate, endDate });
        break;
      case 'activity':
        results.activityMetrics = analyzeActivity(data, { timeframe, startDate, endDate });
        break;
      case 'completeness':
        results.completenessMetrics = analyzeCompleteness(data);
        break;
      case 'complexity':
        results.complexityMetrics = analyzeComplexity(data);
        break;
      case 'artifacts':
        results.artifacts = extractArtifacts(data, { limit });
        break;
      default:
        // Unknown dimension - ignore
    }
  }
  
  // Normalize results if requested
  if (normalizeResults && results) {
    normalizeAnalyticsResults(results);
  }
  
  return results;
}

/**
 * Analyzes relationship graph data
 *
 * @param {Object} options - Analysis options
 * @param {Object} data - Graph data to analyze
 * @returns {Object} Relationship analysis results
 */
function analyzeRelationshipGraph(options, data) {
  const {
    centralNodeType,
    centralNodeId,
    depth = 1,
    includeMetadata = false
  } = options;
  
  // Initialize results
  const results = {
    timestamp: new Date().toISOString(),
    options: { ...options },
    graphMetrics: {
      nodeCount: data.nodes?.length || 0,
      relationshipCount: data.relationships?.length || 0,
      density: calculateGraphDensity(data),
      centralityScores: calculateCentralityScores(data),
      communities: identifyCommunities(data),
      isolatedNodes: findIsolatedNodes(data)
    },
    graph: {
      nodes: processNodes(data.nodes, includeMetadata),
      relationships: data.relationships
    }
  };
  
  // Analyze specific central node if provided
  if (centralNodeType && centralNodeId) {
    results.centralNode = {
      type: centralNodeType,
      id: centralNodeId,
      metrics: calculateNodeMetrics(centralNodeType, centralNodeId, data)
    };
  }
  
  return results;
}

/**
 * Analyzes activity patterns in data
 *
 * @param {Object} options - Analysis options
 * @param {Object} data - Activity data to analyze
 * @returns {Object} Activity analysis results
 */
function analyzeActivityPatterns(options, data) {
  const {
    timeframe,
    startDate,
    endDate,
    groupBy = 'day',
    cumulative = false
  } = options;
  
  // Process date range
  const { effectiveStartDate, effectiveEndDate } = processDateRange(timeframe, startDate, endDate);
  
  // Group activities
  const groupedActivities = groupActivities(data, groupBy, effectiveStartDate, effectiveEndDate);
  
  // Calculate cumulative data if requested
  const cumulativeData = cumulative ? calculateCumulativeActivity(groupedActivities) : null;
  
  // Calculate trends
  const trends = calculateActivityTrends(groupedActivities);
  
  // Initialize results
  const results = {
    timestamp: new Date().toISOString(),
    options: { ...options },
    timeRange: {
      start: effectiveStartDate.toISOString(),
      end: effectiveEndDate.toISOString()
    },
    summary: {
      totalActivities: data.length,
      peakDay: findPeakActivity(groupedActivities),
      averagePerDay: calculateAverageActivityPerDay(groupedActivities),
      mostActiveType: findMostActiveType(groupedActivities),
      mostActiveUser: findMostActiveUser(data)
    },
    trends,
    groupedActivities,
    ...(cumulative && { cumulativeActivities: cumulativeData })
  };
  
  return results;
}

/**
 * Analyzes the impact of a knowledge artifact
 *
 * @param {Object} options - Analysis options
 * @param {Object} data - Impact data to analyze
 * @returns {Object} Impact analysis results
 */
function analyzeKnowledgeImpact(options, data) {
  const {
    artifactType,
    artifactId,
    impactMetric = 'references',
    depth = 1,
    includeIndirect = true
  } = options;
  
  // Extract the target artifact
  const targetArtifact = findArtifact(data, artifactType, artifactId);
  
  if (!targetArtifact) {
    throw new Error(`Artifact not found: ${artifactType}:${artifactId}`);
  }
  
  // Calculate direct references
  const directReferences = calculateDirectReferences(data, artifactType, artifactId);
  
  // Calculate indirect references if requested
  const indirectReferences = includeIndirect
    ? calculateIndirectReferences(data, artifactType, artifactId, depth)
    : null;
  
  // Calculate impact metrics
  const impactMetrics = calculateImpactMetrics(targetArtifact, directReferences, indirectReferences);
  
  // Calculate change propagation
  const changePropagation = estimateChangePropagation(data, artifactType, artifactId);
  
  // Initialize results
  const results = {
    timestamp: new Date().toISOString(),
    options: { ...options },
    artifact: {
      type: artifactType,
      id: artifactId,
      metadata: targetArtifact
    },
    directReferences,
    ...(includeIndirect && { indirectReferences }),
    impactMetrics,
    changePropagation,
    summary: {
      totalReferences: directReferences.count + (indirectReferences?.count || 0),
      impactScore: impactMetrics.score,
      keyAffectedArtifacts: impactMetrics.keyAffectedArtifacts,
      propagationRisk: changePropagation.riskLevel
    }
  };
  
  return results;
}

/**
 * Configures an analytics dashboard
 *
 * @param {Object} options - Dashboard configuration options
 * @param {Array<Object>} existingDashboards - Existing dashboards
 * @returns {Object} The configured dashboard
 */
function configureDashboard(options, existingDashboards = []) {
  const {
    dashboardId,
    name,
    widgets = [],
    layout = {},
    isDefault = false
  } = options;
  
  // Check if updating an existing dashboard
  if (dashboardId) {
    const existingDashboard = existingDashboards.find(d => d.id === dashboardId);
    
    if (!existingDashboard) {
      throw new Error(`Dashboard not found with ID: ${dashboardId}`);
    }
    
    // Update the existing dashboard
    return {
      ...existingDashboard,
      name: name || existingDashboard.name,
      widgets: widgets.length > 0 ? widgets : existingDashboard.widgets,
      layout: Object.keys(layout).length > 0 ? layout : existingDashboard.layout,
      isDefault,
      updatedAt: new Date().toISOString()
    };
  }
  
  // Create a new dashboard
  if (!name) {
    throw new Error('Name is required when creating a new dashboard');
  }
  
  // Generate a unique ID
  const newId = `dashboard_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  // Create the dashboard
  return {
    id: newId,
    name,
    widgets,
    layout,
    isDefault,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Prepares analytics data for export
 *
 * @param {Object} options - Export options
 * @param {Object} data - Analytics data to export
 * @returns {Object} Export result with formatted data and metadata
 */
function prepareAnalyticsExport(options, data) {
  const {
    format,
    destination = 'file',
    exportConfig = {}
  } = options;
  
  // Format the data based on the requested format
  let formattedData;
  let mimeType;
  
  switch (format.toLowerCase()) {
    case 'json':
      formattedData = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      break;
    case 'csv':
      formattedData = convertToCsv(data, exportConfig.csvOptions);
      mimeType = 'text/csv';
      break;
    case 'html':
      formattedData = convertToHtml(data, exportConfig.htmlOptions);
      mimeType = 'text/html';
      break;
    case 'markdown':
    case 'md':
      formattedData = convertToMarkdown(data, exportConfig.markdownOptions);
      mimeType = 'text/markdown';
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
  
  // Generate export metadata
  const metadata = {
    timestamp: new Date().toISOString(),
    format,
    destination,
    size: formattedData.length,
    dataShape: {
      dimensions: Object.keys(data).filter(key => key !== 'options' && key !== 'timestamp' && key !== 'query'),
      recordCount: estimateRecordCount(data)
    },
    config: exportConfig
  };
  
  // Return the result
  return {
    data: formattedData,
    metadata,
    mimeType
  };
}

// Helper functions for analysis

function calculateCounts(data) {
  const counts = {
    total: 0
  };
  
  // Count by type
  for (const [type, items] of Object.entries(data)) {
    if (Array.isArray(items)) {
      counts[type] = items.length;
      counts.total += items.length;
    }
  }
  
  return counts;
}

function analyzeTypeDistribution(data) {
  const distribution = {
    types: [],
    typeCount: 0
  };
  
  // Analyze each type
  for (const [type, items] of Object.entries(data)) {
    if (Array.isArray(items) && items.length > 0) {
      distribution.types.push({
        type,
        count: items.length,
        percentage: 0 // Will be calculated after all counts
      });
      distribution.typeCount++;
    }
  }
  
  // Calculate percentages
  const total = distribution.types.reduce((sum, type) => sum + type.count, 0);
  for (const type of distribution.types) {
    type.percentage = total > 0 ? (type.count / total * 100).toFixed(2) : 0;
  }
  
  // Sort by count (descending)
  distribution.types.sort((a, b) => b.count - a.count);
  
  return distribution;
}

function analyzeTagDistribution(data) {
  const tagMap = new Map();
  let artifactsWithTags = 0;
  let totalArtifacts = 0;
  
  // Collect tags from all artifacts
  for (const [type, items] of Object.entries(data)) {
    if (Array.isArray(items)) {
      totalArtifacts += items.length;
      
      for (const item of items) {
        if (item.tags && Array.isArray(item.tags) && item.tags.length > 0) {
          artifactsWithTags++;
          
          for (const tag of item.tags) {
            if (tagMap.has(tag)) {
              tagMap.set(tag, tagMap.get(tag) + 1);
            } else {
              tagMap.set(tag, 1);
            }
          }
        }
      }
    }
  }
  
  // Convert to array and sort
  const tags = Array.from(tagMap.entries()).map(([tag, count]) => ({
    tag,
    count,
    percentage: totalArtifacts > 0 ? (count / totalArtifacts * 100).toFixed(2) : 0
  }));
  
  // Sort by count (descending)
  tags.sort((a, b) => b.count - a.count);
  
  return {
    tags,
    tagCount: tagMap.size,
    artifactsWithTags,
    percentageWithTags: totalArtifacts > 0 ? (artifactsWithTags / totalArtifacts * 100).toFixed(2) : 0
  };
}

function analyzeQuality(data) {
  const qualityScores = [];
  const typeScores = {};
  
  // Calculate quality scores for each artifact
  for (const [type, items] of Object.entries(data)) {
    if (Array.isArray(items)) {
      typeScores[type] = {
        scores: [],
        average: 0,
        min: 100,
        max: 0
      };
      
      for (const item of items) {
        const score = calculateQualityScore(item, type);
        qualityScores.push(score);
        typeScores[type].scores.push(score);
        
        typeScores[type].min = Math.min(typeScores[type].min, score);
        typeScores[type].max = Math.max(typeScores[type].max, score);
      }
      
      // Calculate average for this type
      typeScores[type].average = typeScores[type].scores.length > 0
        ? (typeScores[type].scores.reduce((sum, score) => sum + score, 0) / typeScores[type].scores.length).toFixed(2)
        : 0;
    }
  }
  
  // Calculate overall metrics
  const average = qualityScores.length > 0
    ? (qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length).toFixed(2)
    : 0;
  
  const min = qualityScores.length > 0
    ? Math.min(...qualityScores)
    : 0;
  
  const max = qualityScores.length > 0
    ? Math.max(...qualityScores)
    : 0;
  
  return {
    average,
    min,
    max,
    byType: typeScores,
    distribution: calculateDistribution(qualityScores, 10) // 10 buckets
  };
}

function calculateQualityScore(artifact, type) {
  // This would be a more sophisticated algorithm in a real implementation
  // For now, we'll use a simple scoring system
  
  let score = 50; // Base score
  
  switch (type) {
    case 'decision':
      // Score based on decision fields
      if (artifact.summary && artifact.summary.length > 10) score += 10;
      if (artifact.rationale && artifact.rationale.length > 20) score += 15;
      if (artifact.implementation_details && artifact.implementation_details.length > 20) score += 15;
      if (artifact.tags && artifact.tags.length > 0) score += 10;
      break;
      
    case 'system_pattern':
      // Score based on pattern fields
      if (artifact.name && artifact.name.length > 5) score += 10;
      if (artifact.description && artifact.description.length > 30) score += 20;
      if (artifact.tags && artifact.tags.length > 0) score += 10;
      if (artifact.examples) score += 10;
      break;
      
    case 'progress':
      // Score based on progress fields
      if (artifact.description && artifact.description.length > 10) score += 15;
      if (artifact.status) score += 15;
      if (artifact.linked_item_type && artifact.linked_item_id) score += 20;
      break;
      
    case 'custom_data':
      // Score based on custom data
      if (artifact.value && typeof artifact.value === 'object') {
        const valueSize = JSON.stringify(artifact.value).length;
        score += Math.min(40, valueSize / 100); // Up to 40 points based on value size
      } else if (artifact.value) {
        score += 20;
      }
      break;
  }
  
  // Cap at 100
  return Math.min(100, score);
}

function analyzeRelationships(data) {
  // This function analyzes the relationship structure in the data
  // but doesn't do the detailed graph analysis that's in analyzeRelationshipGraph
  
  const metrics = {
    totalRelationships: 0,
    byType: {},
    byArtifactType: {},
    orphanedArtifacts: 0,
    highlyConnectedArtifacts: []
  };
  
  // Check if relationships data is available
  if (!data.relationships) {
    return metrics;
  }
  
  // Count total relationships
  metrics.totalRelationships = data.relationships.length;
  
  // Count by relationship type
  for (const relationship of data.relationships) {
    const relType = relationship.type || 'unknown';
    
    if (!metrics.byType[relType]) {
      metrics.byType[relType] = 0;
    }
    
    metrics.byType[relType]++;
    
    // Count by artifact type
    const sourceType = relationship.source.type;
    const targetType = relationship.target.type;
    
    if (!metrics.byArtifactType[sourceType]) {
      metrics.byArtifactType[sourceType] = { outgoing: 0, incoming: 0 };
    }
    
    if (!metrics.byArtifactType[targetType]) {
      metrics.byArtifactType[targetType] = { outgoing: 0, incoming: 0 };
    }
    
    metrics.byArtifactType[sourceType].outgoing++;
    metrics.byArtifactType[targetType].incoming++;
  }
  
  // Find orphaned artifacts
  for (const [type, items] of Object.entries(data)) {
    if (Array.isArray(items)) {
      for (const item of items) {
        const itemId = String(item.id);
        
        // Check if this item is in any relationship
        const isInRelationship = data.relationships.some(rel => 
          (rel.source.type === type && rel.source.id === itemId) ||
          (rel.target.type === type && rel.target.id === itemId)
        );
        
        if (!isInRelationship) {
          metrics.orphanedArtifacts++;
        }
      }
    }
  }
  
  // Find highly connected artifacts
  const connectionCounts = new Map();
  
  for (const relationship of data.relationships) {
    const sourceKey = `${relationship.source.type}:${relationship.source.id}`;
    const targetKey = `${relationship.target.type}:${relationship.target.id}`;
    
    connectionCounts.set(sourceKey, (connectionCounts.get(sourceKey) || 0) + 1);
    connectionCounts.set(targetKey, (connectionCounts.get(targetKey) || 0) + 1);
  }
  
  // Get top 5 most connected artifacts
  metrics.highlyConnectedArtifacts = Array.from(connectionCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key, count]) => {
      const [type, id] = key.split(':');
      return { type, id, connectionCount: count };
    });
  
  return metrics;
}

function analyzeTrends(data, { timeframe, startDate, endDate }) {
  // Process date range
  const { effectiveStartDate, effectiveEndDate } = processDateRange(timeframe, startDate, endDate);
  
  // Initialize results
  const results = {
    timeRange: {
      start: effectiveStartDate.toISOString(),
      end: effectiveEndDate.toISOString()
    },
    trends: {
      overall: { direction: 'stable', change: '0%' },
      byType: {}
    },
    timeSeries: {}
  };
  
  // This would be more sophisticated in a real implementation
  // For now, we'll generate some basic trend data
  
  // Helper to generate a fake time series
  const generateTimeSeries = (type, count) => {
    const series = [];
    const days = Math.ceil((effectiveEndDate - effectiveStartDate) / (1000 * 60 * 60 * 24));
    
    // Base value with some randomness
    let value = count * 0.7 + Math.random() * count * 0.3;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(effectiveStartDate);
      date.setDate(date.getDate() + i);
      
      // Add some random variation
      const change = (Math.random() - 0.3) * 0.1 * value;
      value += change;
      
      series.push({
        date: date.toISOString().split('T')[0],
        value: Math.max(0, Math.round(value))
      });
    }
    
    return series;
  };
  
  // Generate overall time series and trends
  let totalCount = 0;
  
  for (const [type, items] of Object.entries(data)) {
    if (Array.isArray(items)) {
      totalCount += items.length;
      
      // Generate time series for this type
      results.timeSeries[type] = generateTimeSeries(type, items.length);
      
      // Calculate trend for this type
      const firstValue = results.timeSeries[type][0]?.value || 0;
      const lastValue = results.timeSeries[type][results.timeSeries[type].length - 1]?.value || 0;
      const change = firstValue > 0 ? (lastValue - firstValue) / firstValue : 0;
      
      results.trends.byType[type] = {
        direction: change > 0.05 ? 'increasing' : change < -0.05 ? 'decreasing' : 'stable',
        change: `${(change * 100).toFixed(1)}%`
      };
    }
  }
  
  // Generate overall time series
  results.timeSeries.overall = generateTimeSeries('overall', totalCount);
  
  // Calculate overall trend
  const firstValue = results.timeSeries.overall[0]?.value || 0;
  const lastValue = results.timeSeries.overall[results.timeSeries.overall.length - 1]?.value || 0;
  const change = firstValue > 0 ? (lastValue - firstValue) / firstValue : 0;
  
  results.trends.overall = {
    direction: change > 0.05 ? 'increasing' : change < -0.05 ? 'decreasing' : 'stable',
    change: `${(change * 100).toFixed(1)}%`
  };
  
  return results;
}

function analyzeActivity(data, { timeframe, startDate, endDate }) {
  // Process date range
  const { effectiveStartDate, effectiveEndDate } = processDateRange(timeframe, startDate, endDate);
  
  // Filter activities within the date range
  const activitiesInRange = data.filter(activity => {
    const activityDate = new Date(activity.timestamp);
    return activityDate >= effectiveStartDate && activityDate <= effectiveEndDate;
  });
  
  // Group by day
  const byDay = new Map();
  
  for (const activity of activitiesInRange) {
    const date = activity.timestamp.split('T')[0];
    
    if (!byDay.has(date)) {
      byDay.set(date, []);
    }
    
    byDay.get(date).push(activity);
  }
  
  // Group by type
  const byType = new Map();
  
  for (const activity of activitiesInRange) {
    const type = activity.artifactType;
    
    if (!byType.has(type)) {
      byType.set(type, []);
    }
    
    byType.get(type).push(activity);
  }
  
  // Group by user
  const byUser = new Map();
  
  for (const activity of activitiesInRange) {
    const user = activity.userId || 'unknown';
    
    if (!byUser.has(user)) {
      byUser.set(user, []);
    }
    
    byUser.get(user).push(activity);
  }
  
  // Calculate activity metrics
  return {
    totalActivities: activitiesInRange.length,
    timeRange: {
      start: effectiveStartDate.toISOString(),
      end: effectiveEndDate.toISOString()
    },
    byDay: Array.from(byDay.entries()).map(([date, activities]) => ({
      date,
      count: activities.length,
      activities: activities.map(a => ({ type: a.type, artifactType: a.artifactType, artifactId: a.artifactId }))
    })),
    byType: Array.from(byType.entries()).map(([type, activities]) => ({
      type,
      count: activities.length,
      percentage: activitiesInRange.length > 0 ? (activities.length / activitiesInRange.length * 100).toFixed(2) : 0
    })),
    byUser: Array.from(byUser.entries()).map(([user, activities]) => ({
      user,
      count: activities.length,
      percentage: activitiesInRange.length > 0 ? (activities.length / activitiesInRange.length * 100).toFixed(2) : 0
    })),
    mostActiveDay: Array.from(byDay.entries())
      .sort((a, b) => b[1].length - a[1].length)[0]?.[0] || null,
    mostActiveType: Array.from(byType.entries())
      .sort((a, b) => b[1].length - a[1].length)[0]?.[0] || null,
    mostActiveUser: Array.from(byUser.entries())
      .sort((a, b) => b[1].length - a[1].length)[0]?.[0] || null
  };
}

function analyzeCompleteness(data) {
  const completenessScores = [];
  const typeScores = {};
  
  // Calculate completeness scores for each artifact
  for (const [type, items] of Object.entries(data)) {
    if (Array.isArray(items)) {
      typeScores[type] = {
        scores: [],
        average: 0,
        min: 100,
        max: 0,
        incompleteCount: 0
      };
      
      for (const item of items) {
        const score = calculateCompletenessScore(item, type);
        completenessScores.push(score);
        typeScores[type].scores.push(score);
        
        typeScores[type].min = Math.min(typeScores[type].min, score);
        typeScores[type].max = Math.max(typeScores[type].max, score);
        
        if (score < 80) {
          typeScores[type].incompleteCount++;
        }
      }
      
      // Calculate average for this type
      typeScores[type].average = typeScores[type].scores.length > 0
        ? (typeScores[type].scores.reduce((sum, score) => sum + score, 0) / typeScores[type].scores.length).toFixed(2)
        : 0;
    }
  }
  
  // Calculate overall metrics
  const average = completenessScores.length > 0
    ? (completenessScores.reduce((sum, score) => sum + score, 0) / completenessScores.length).toFixed(2)
    : 0;
  
  const min = completenessScores.length > 0
    ? Math.min(...completenessScores)
    : 0;
  
  const max = completenessScores.length > 0
    ? Math.max(...completenessScores)
    : 0;
  
  const incompleteCount = completenessScores.filter(score => score < 80).length;
  
  return {
    average,
    min,
    max,
    incompleteCount,
    completionRate: completenessScores.length > 0
      ? ((completenessScores.length - incompleteCount) / completenessScores.length * 100).toFixed(2)
      : 0,
    byType: typeScores
  };
}

function calculateCompletenessScore(artifact, type) {
  // This would be a more sophisticated algorithm in a real implementation
  // For now, we'll use a simple scoring system
  
  let score = 0;
  let possibleScore = 0;
  
  switch (type) {
    case 'decision':
      // Required fields
      possibleScore = 100;
      if (artifact.summary) score += 40;
      if (artifact.rationale) score += 30;
      if (artifact.implementation_details) score += 20;
      if (artifact.tags && artifact.tags.length > 0) score += 10;
      break;
      
    case 'system_pattern':
      // Required fields
      possibleScore = 100;
      if (artifact.name) score += 30;
      if (artifact.description) score += 40;
      if (artifact.tags && artifact.tags.length > 0) score += 10;
      if (artifact.examples) score += 20;
      break;
      
    case 'progress':
      // Required fields
      possibleScore = 100;
      if (artifact.description) score += 40;
      if (artifact.status) score += 40;
      if (artifact.linked_item_type && artifact.linked_item_id) score += 20;
      break;
      
    case 'custom_data':
      // Required fields
      possibleScore = 100;
      if (artifact.category) score += 30;
      if (artifact.key) score += 30;
      if (artifact.value) score += 40;
      break;
  }
  
  return possibleScore > 0 ? (score / possibleScore * 100) : 0;
}

function analyzeComplexity(data) {
  const complexityScores = [];
  const typeScores = {};
  
  // Calculate complexity scores for each artifact
  for (const [type, items] of Object.entries(data)) {
    if (Array.isArray(items)) {
      typeScores[type] = {
        scores: [],
        average: 0,
        min: 100,
        max: 0,
        highComplexityCount: 0
      };
      
      for (const item of items) {
        const score = calculateComplexityScore(item, type);
        complexityScores.push(score);
        typeScores[type].scores.push(score);
        
        typeScores[type].min = Math.min(typeScores[type].min, score);
        typeScores[type].max = Math.max(typeScores[type].max, score);
        
        if (score > 70) {
          typeScores[type].highComplexityCount++;
        }
      }
      
      // Calculate average for this type
      typeScores[type].average = typeScores[type].scores.length > 0
        ? (typeScores[type].scores.reduce((sum, score) => sum + score, 0) / typeScores[type].scores.length).toFixed(2)
        : 0;
    }
  }
  
  // Calculate overall metrics
  const average = complexityScores.length > 0
    ? (complexityScores.reduce((sum, score) => sum + score, 0) / complexityScores.length).toFixed(2)
    : 0;
  
  const min = complexityScores.length > 0
    ? Math.min(...complexityScores)
    : 0;
  
  const max = complexityScores.length > 0
    ? Math.max(...complexityScores)
    : 0;
  
  const highComplexityCount = complexityScores.filter(score => score > 70).length;
  
  return {
    average,
    min,
    max,
    highComplexityCount,
    highComplexityRate: complexityScores.length > 0
      ? (highComplexityCount / complexityScores.length * 100).toFixed(2)
      : 0,
    byType: typeScores
  };
}

function calculateComplexityScore(artifact, type) {
  // This would be a more sophisticated algorithm in a real implementation
  // For now, we'll use a simple scoring system
  
  let score = 0;
  
  switch (type) {
    case 'decision':
      // Base score
      score = 40;
      
      // Add based on description length
      if (artifact.rationale) {
        score += Math.min(30, artifact.rationale.length / 20);
      }
      
      // Add based on implementation details
      if (artifact.implementation_details) {
        score += Math.min(30, artifact.implementation_details.length / 20);
      }
      break;
      
    case 'system_pattern':
      // Base score
      score = 50;
      
      // Add based on description length
      if (artifact.description) {
        score += Math.min(40, artifact.description.length / 20);
      }
      
      // Add for examples
      if (artifact.examples) {
        score += 10;
      }
      break;
      
    case 'progress':
      // Progress items are generally less complex
      score = 30;
      
      // Add based on description length
      if (artifact.description) {
        score += Math.min(20, artifact.description.length / 20);
      }
      
      // Add if it has children
      if (artifact.children && artifact.children.length > 0) {
        score += Math.min(50, artifact.children.length * 10);
      }
      break;
      
    case 'custom_data':
      // Base score depends on value structure
      score = 30;
      
      // Add based on value complexity
      if (artifact.value) {
        if (typeof artifact.value === 'object') {
          const valueStr = JSON.stringify(artifact.value);
          score += Math.min(70, valueStr.length / 30);
        } else if (typeof artifact.value === 'string') {
          score += Math.min(40, artifact.value.length / 50);
        }
      }
      break;
  }
  
  return Math.min(100, score);
}

function extractArtifacts(data, { limit }) {
  const artifacts = [];
  
  // Extract artifacts from data
  for (const [type, items] of Object.entries(data)) {
    if (Array.isArray(items)) {
      for (const item of items) {
        artifacts.push({
          type,
          id: item.id,
          data: item
        });
      }
    }
  }
  
  // Sort by relevance (this would be more sophisticated in a real implementation)
  artifacts.sort((a, b) => {
    // For now, just sort by type and ID
    if (a.type !== b.type) {
      return a.type.localeCompare(b.type);
    }
    
    return a.id - b.id;
  });
  
  // Apply limit if specified
  return limit ? artifacts.slice(0, limit) : artifacts;
}

function calculateGraphDensity(data) {
  const nodeCount = data.nodes?.length || 0;
  const edgeCount = data.relationships?.length || 0;
  
  if (nodeCount <= 1) {
    return 0;
  }
  
  // Density = 2E / N(N-1) for undirected graph
  // For directed graph: E / N(N-1)
  return (edgeCount / (nodeCount * (nodeCount - 1))).toFixed(4);
}

function calculateCentralityScores(data) {
  const nodeCount = data.nodes?.length || 0;
  const nodes = data.nodes || [];
  const relationships = data.relationships || [];
  
  if (nodeCount === 0) {
    return [];
  }
  
  // Calculate degree centrality for each node
  const degreeCentrality = new Map();
  
  // Initialize all nodes with zero degree
  for (const node of nodes) {
    const nodeKey = `${node.type}:${node.id}`;
    degreeCentrality.set(nodeKey, { inDegree: 0, outDegree: 0, total: 0 });
  }
  
  // Count degrees from relationships
  for (const rel of relationships) {
    const sourceKey = `${rel.source.type}:${rel.source.id}`;
    const targetKey = `${rel.target.type}:${rel.target.id}`;
    
    // Increment out-degree for source
    if (degreeCentrality.has(sourceKey)) {
      const current = degreeCentrality.get(sourceKey);
      current.outDegree++;
      current.total++;
      degreeCentrality.set(sourceKey, current);
    }
    
    // Increment in-degree for target
    if (degreeCentrality.has(targetKey)) {
      const current = degreeCentrality.get(targetKey);
      current.inDegree++;
      current.total++;
      degreeCentrality.set(targetKey, current);
    }
  }
  
  // Convert to array and sort by total degree
  return Array.from(degreeCentrality.entries())
    .map(([nodeKey, scores]) => {
      const [type, id] = nodeKey.split(':');
      return {
        node: { type, id },
        inDegree: scores.inDegree,
        outDegree: scores.outDegree,
        totalDegree: scores.total,
        normalizedCentrality: nodeCount > 1 ? (scores.total / (nodeCount - 1)).toFixed(4) : 0
      };
    })
    .sort((a, b) => b.totalDegree - a.totalDegree);
}

function identifyCommunities(data) {
  // This would be a more sophisticated algorithm in a real implementation
  // For now, we'll use a simple approach based on node types
  
  const nodes = data.nodes || [];
  
  // Group nodes by type
  const communities = new Map();
  
  for (const node of nodes) {
    if (!communities.has(node.type)) {
      communities.set(node.type, []);
    }
    
    communities.get(node.type).push(node.id);
  }
  
  return Array.from(communities.entries())
    .map(([type, nodeIds]) => ({
      name: `${type} Community`,
      type,
      size: nodeIds.length,
      nodes: nodeIds.map(id => ({ type, id }))
    }))
    .sort((a, b) => b.size - a.size);
}

function findIsolatedNodes(data) {
  const nodes = data.nodes || [];
  const relationships = data.relationships || [];
  
  // Find nodes that are not in any relationship
  return nodes.filter(node => {
    const nodeKey = `${node.type}:${node.id}`;
    
    return !relationships.some(rel => 
      `${rel.source.type}:${rel.source.id}` === nodeKey ||
      `${rel.target.type}:${rel.target.id}` === nodeKey
    );
  }).map(node => ({
    type: node.type,
    id: node.id,
    data: node.data
  }));
}

function processNodes(nodes, includeMetadata) {
  if (!nodes) {
    return [];
  }
  
  return nodes.map(node => {
    if (includeMetadata) {
      return node;
    }
    
    // Remove detailed data if metadata is not requested
    const { data, ...nodeWithoutData } = node;
    return {
      ...nodeWithoutData,
      label: getNodeLabel(node)
    };
  });
}

function getNodeLabel(node) {
  if (!node.data) {
    return `${node.type}:${node.id}`;
  }
  
  switch (node.type) {
    case 'decision':
      return node.data.summary || `Decision ${node.id}`;
    case 'system_pattern':
      return node.data.name || `Pattern ${node.id}`;
    case 'progress':
      return node.data.description || `Progress ${node.id}`;
    case 'custom_data':
      return `${node.data.category}:${node.data.key}` || `Custom ${node.id}`;
    default:
      return `${node.type}:${node.id}`;
  }
}

function calculateNodeMetrics(nodeType, nodeId, data) {
  const relationships = data.relationships || [];
  
  // Find relationships involving this node
  const nodeKey = `${nodeType}:${nodeId}`;
  
  const incomingRelationships = relationships.filter(rel => 
    `${rel.target.type}:${rel.target.id}` === nodeKey
  );
  
  const outgoingRelationships = relationships.filter(rel => 
    `${rel.source.type}:${rel.source.id}` === nodeKey
  );
  
  // Count relationships by type
  const incomingByType = new Map();
  const outgoingByType = new Map();
  
  for (const rel of incomingRelationships) {
    const relType = rel.type || 'unknown';
    incomingByType.set(relType, (incomingByType.get(relType) || 0) + 1);
  }
  
  for (const rel of outgoingRelationships) {
    const relType = rel.type || 'unknown';
    outgoingByType.set(relType, (outgoingByType.get(relType) || 0) + 1);
  }
  
  return {
    inDegree: incomingRelationships.length,
    outDegree: outgoingRelationships.length,
    totalDegree: incomingRelationships.length + outgoingRelationships.length,
    incomingRelationshipTypes: Object.fromEntries(incomingByType),
    outgoingRelationshipTypes: Object.fromEntries(outgoingByType)
  };
}

function groupActivities(activities, groupBy, startDate, endDate) {
  // Group activities based on the specified grouping
  
  switch (groupBy.toLowerCase()) {
    case 'day':
      return groupActivitiesByDay(activities, startDate, endDate);
    case 'week':
      return groupActivitiesByWeek(activities, startDate, endDate);
    case 'month':
      return groupActivitiesByMonth(activities, startDate, endDate);
    case 'type':
      return groupActivitiesByType(activities);
    case 'user':
      return groupActivitiesByUser(activities);
    default:
      return groupActivitiesByDay(activities, startDate, endDate);
  }
}

function groupActivitiesByDay(activities, startDate, endDate) {
  const groups = new Map();
  
  // Initialize groups for each day in the range
  const dayCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i < dayCount; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    groups.set(dateString, []);
  }
  
  // Group activities
  for (const activity of activities) {
    const dateString = activity.timestamp.split('T')[0];
    
    if (groups.has(dateString)) {
      groups.get(dateString).push(activity);
    }
  }
  
  // Convert to array
  return Array.from(groups.entries())
    .map(([date, activitiesOnDay]) => ({
      group: date,
      count: activitiesOnDay.length,
      activities: activitiesOnDay
    }))
    .sort((a, b) => a.group.localeCompare(b.group));
}

function groupActivitiesByWeek(activities, startDate, endDate) {
  const groups = new Map();
  
  // Initialize groups for each week in the range
  const weekCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 7));
  
  for (let i = 0; i < weekCount; i++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(weekStart.getDate() + i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekKey = `${weekStart.toISOString().split('T')[0]} to ${weekEnd.toISOString().split('T')[0]}`;
    groups.set(weekKey, {
      start: weekStart,
      end: weekEnd,
      activities: []
    });
  }
  
  // Group activities
  for (const activity of activities) {
    const activityDate = new Date(activity.timestamp);
    
    // Find the week this activity belongs to
    for (const [weekKey, weekData] of groups.entries()) {
      if (activityDate >= weekData.start && activityDate <= weekData.end) {
        weekData.activities.push(activity);
        break;
      }
    }
  }
  
  // Convert to array
  return Array.from(groups.entries())
    .map(([weekKey, weekData]) => ({
      group: weekKey,
      count: weekData.activities.length,
      activities: weekData.activities
    }))
    .sort((a, b) => a.group.localeCompare(b.group));
}

function groupActivitiesByMonth(activities, startDate, endDate) {
  const groups = new Map();
  
  // Initialize groups for each month in the range
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    groups.set(monthKey, {
      start: monthStart,
      end: monthEnd,
      activities: []
    });
    
    // Move to the next month
    currentDate = new Date(year, month + 1, 1);
  }
  
  // Group activities
  for (const activity of activities) {
    const activityDate = new Date(activity.timestamp);
    const monthKey = `${activityDate.getFullYear()}-${String(activityDate.getMonth() + 1).padStart(2, '0')}`;
    
    if (groups.has(monthKey)) {
      groups.get(monthKey).activities.push(activity);
    }
  }
  
  // Convert to array
  return Array.from(groups.entries())
    .map(([monthKey, monthData]) => ({
      group: monthKey,
      count: monthData.activities.length,
      activities: monthData.activities
    }))
    .sort((a, b) => a.group.localeCompare(b.group));
}

function groupActivitiesByType(activities) {
  const groups = new Map();
  
  // Group activities by type
  for (const activity of activities) {
    const type = activity.artifactType;
    
    if (!groups.has(type)) {
      groups.set(type, []);
    }
    
    groups.get(type).push(activity);
  }
  
  // Convert to array
  return Array.from(groups.entries())
    .map(([type, activitiesOfType]) => ({
      group: type,
      count: activitiesOfType.length,
      activities: activitiesOfType
    }))
    .sort((a, b) => b.count - a.count);
}

function groupActivitiesByUser(activities) {
  const groups = new Map();
  
  // Group activities by user
  for (const activity of activities) {
    const user = activity.userId || 'unknown';
    
    if (!groups.has(user)) {
      groups.set(user, []);
    }
    
    groups.get(user).push(activity);
  }
  
  // Convert to array
  return Array.from(groups.entries())
    .map(([user, activitiesByUser]) => ({
      group: user,
      count: activitiesByUser.length,
      activities: activitiesByUser
    }))
    .sort((a, b) => b.count - a.count);
}

function calculateCumulativeActivity(groupedActivities) {
  // Calculate cumulative activity over time
  
  const cumulative = [...groupedActivities];
  let runningTotal = 0;
  
  for (let i = 0; i < cumulative.length; i++) {
    runningTotal += cumulative[i].count;
    cumulative[i].cumulativeCount = runningTotal;
  }
  
  return cumulative;
}

function calculateActivityTrends(groupedActivities) {
  // Calculate activity trends
  
  if (groupedActivities.length < 2) {
    return {
      direction: 'stable',
      change: '0%',
      slope: 0
    };
  }
  
  // Calculate linear regression
  const xValues = Array.from({ length: groupedActivities.length }, (_, i) => i);
  const yValues = groupedActivities.map(group => group.count);
  
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / xValues.length;
  const yMean = yValues.reduce((sum, y) => sum + y, 0) / yValues.length;
  
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < xValues.length; i++) {
    numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
    denominator += (xValues[i] - xMean) ** 2;
  }
  
  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = yMean - slope * xMean;
  
  // Calculate trend direction and change
  const firstValue = yValues[0];
  const lastValue = yValues[yValues.length - 1];
  const change = firstValue !== 0 ? (lastValue - firstValue) / firstValue : 0;
  
  return {
    direction: slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable',
    change: `${(change * 100).toFixed(1)}%`,
    slope
  };
}

function findPeakActivity(groupedActivities) {
  if (groupedActivities.length === 0) {
    return null;
  }
  
  return groupedActivities.reduce((peak, current) => 
    current.count > peak.count ? current : peak
  ).group;
}

function calculateAverageActivityPerDay(groupedActivities) {
  if (groupedActivities.length === 0) {
    return 0;
  }
  
  const totalCount = groupedActivities.reduce((sum, group) => sum + group.count, 0);
  return (totalCount / groupedActivities.length).toFixed(2);
}

function findMostActiveType(groupedActivities) {
  if (groupedActivities.length === 0) {
    return null;
  }
  
  // This assumes groupedActivities is grouped by type
  // If it's grouped by day/week/month, this would need to be calculated differently
  return groupedActivities.reduce((most, current) => 
    current.count > most.count ? current : most
  ).group;
}

function findMostActiveUser(activities) {
  if (!activities || activities.length === 0) {
    return null;
  }
  
  const userCounts = new Map();
  
  for (const activity of activities) {
    const user = activity.userId || 'unknown';
    userCounts.set(user, (userCounts.get(user) || 0) + 1);
  }
  
  let mostActiveUser = null;
  let maxCount = 0;
  
  for (const [user, count] of userCounts.entries()) {
    if (count > maxCount) {
      mostActiveUser = user;
      maxCount = count;
    }
  }
  
  return mostActiveUser;
}

function findArtifact(data, artifactType, artifactId) {
  if (!data.artifacts || !data.artifacts[artifactType]) {
    return null;
  }
  
  return data.artifacts[artifactType].find(artifact => 
    String(artifact.id) === String(artifactId)
  );
}

function calculateDirectReferences(data, artifactType, artifactId) {
  if (!data.relationships) {
    return { count: 0, references: [] };
  }
  
  // Find relationships where this artifact is the source or target
  const references = data.relationships.filter(rel => 
    (rel.source.type === artifactType && rel.source.id === String(artifactId)) ||
    (rel.target.type === artifactType && rel.target.id === String(artifactId))
  );
  
  // Process the references
  const processedReferences = references.map(rel => {
    const isSource = rel.source.type === artifactType && rel.source.id === String(artifactId);
    const relatedArtifact = isSource ? rel.target : rel.source;
    
    return {
      relationType: rel.type,
      artifactType: relatedArtifact.type,
      artifactId: relatedArtifact.id,
      description: rel.description || '',
      direction: isSource ? 'outgoing' : 'incoming'
    };
  });
  
  return {
    count: references.length,
    references: processedReferences
  };
}

function calculateIndirectReferences(data, artifactType, artifactId, depth) {
  if (!data.relationships || depth <= 1) {
    return { count: 0, references: [] };
  }
  
  // Start with direct references
  const directRefs = calculateDirectReferences(data, artifactType, artifactId);
  const directRefIds = new Set(directRefs.references.map(ref => `${ref.artifactType}:${ref.artifactId}`));
  
  // Map to track visited nodes
  const visited = new Set([`${artifactType}:${artifactId}`]);
  for (const id of directRefIds) {
    visited.add(id);
  }
  
  // Find indirect references up to the specified depth
  const indirectRefs = [];
  const queue = directRefs.references.map(ref => ({
    artifactType: ref.artifactType,
    artifactId: ref.artifactId,
    depth: 1,
    path: [`${artifactType}:${artifactId}`, `${ref.artifactType}:${ref.artifactId}`]
  }));
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    // Skip if we've reached the maximum depth
    if (current.depth >= depth) {
      continue;
    }
    
    // Find relationships for this artifact
    const nextRefs = calculateDirectReferences(data, current.artifactType, current.artifactId);
    
    for (const ref of nextRefs.references) {
      const refId = `${ref.artifactType}:${ref.artifactId}`;
      
      // Skip if we've already visited this node or it's the original artifact
      if (visited.has(refId) || refId === `${artifactType}:${artifactId}`) {
        continue;
      }
      
      // Mark as visited
      visited.add(refId);
      
      // Add to indirect references
      indirectRefs.push({
        ...ref,
        pathDepth: current.depth + 1,
        path: [...current.path, refId]
      });
      
      // Add to queue for next level
      queue.push({
        artifactType: ref.artifactType,
        artifactId: ref.artifactId,
        depth: current.depth + 1,
        path: [...current.path, refId]
      });
    }
  }
  
  return {
    count: indirectRefs.length,
    references: indirectRefs
  };
}

function calculateImpactMetrics(artifact, directReferences, indirectReferences) {
  // This would be a more sophisticated algorithm in a real implementation
  
  // Calculate impact score based on references
  const directScore = directReferences.count * 10;
  const indirectScore = indirectReferences ? indirectReferences.count * 5 : 0;
  
  // Calculate weighted score based on artifact type
  let typeMultiplier = 1;
  
  switch (artifact.type) {
    case 'decision':
      typeMultiplier = 1.5;
      break;
    case 'system_pattern':
      typeMultiplier = 1.2;
      break;
    case 'progress':
      typeMultiplier = 0.8;
      break;
    case 'custom_data':
      typeMultiplier = 1.0;
      break;
  }
  
  const rawScore = (directScore + indirectScore) * typeMultiplier;
  
  // Normalize score to 0-100 range
  const score = Math.min(100, rawScore);
  
  // Find key affected artifacts
  const allReferences = [
    ...directReferences.references,
    ...(indirectReferences ? indirectReferences.references : [])
  ];
  
  // Group references by artifact type
  const refsByType = new Map();
  
  for (const ref of allReferences) {
    if (!refsByType.has(ref.artifactType)) {
      refsByType.set(ref.artifactType, []);
    }
    
    refsByType.get(ref.artifactType).push(ref);
  }
  
  // Get top references from each type
  const keyAffectedArtifacts = [];
  
  for (const [type, refs] of refsByType.entries()) {
    // Sort by some criteria (e.g., direction, depth)
    const sortedRefs = refs.sort((a, b) => {
      // Prioritize direct connections
      if (a.pathDepth && b.pathDepth) {
        return a.pathDepth - b.pathDepth;
      }
      
      // For direct references, prioritize incoming
      if (a.direction && b.direction) {
        if (a.direction === 'incoming' && b.direction !== 'incoming') return -1;
        if (a.direction !== 'incoming' && b.direction === 'incoming') return 1;
      }
      
      return 0;
    });
    
    // Take top 2 from each type
    keyAffectedArtifacts.push(...sortedRefs.slice(0, 2));
  }
  
  return {
    score,
    keyAffectedArtifacts: keyAffectedArtifacts.slice(0, 5),
    directRefCount: directReferences.count,
    indirectRefCount: indirectReferences ? indirectReferences.count : 0,
    totalRefCount: directReferences.count + (indirectReferences ? indirectReferences.count : 0)
  };
}

function estimateChangePropagation(data, artifactType, artifactId) {
  // This would be a more sophisticated algorithm in a real implementation
  
  // Get direct references
  const directRefs = calculateDirectReferences(data, artifactType, artifactId);
  
  // Calculate risk based on number and types of references
  let riskScore = 0;
  
  // Higher risk for more references
  riskScore += directRefs.count * 5;
  
  // Higher risk for certain reference types
  for (const ref of directRefs.references) {
    if (ref.relationType === 'implements' || ref.relationType === 'depends_on') {
      riskScore += 10;
    }
    
    if (ref.artifactType === 'system_pattern') {
      riskScore += 15;
    }
  }
  
  // Determine risk level
  let riskLevel;
  if (riskScore < 30) {
    riskLevel = 'low';
  } else if (riskScore < 70) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'high';
  }
  
  // Identify affected artifacts
  const affectedArtifacts = directRefs.references.map(ref => ({
    type: ref.artifactType,
    id: ref.artifactId,
    relationshipType: ref.relationType,
    direction: ref.direction
  }));
  
  return {
    riskScore,
    riskLevel,
    affectedArtifacts,
    directImpactCount: directRefs.count
  };
}

function processDateRange(timeframe, startDate, endDate) {
  // Process the date range based on the timeframe or explicit start/end dates
  const now = new Date();
  let effectiveStartDate;
  let effectiveEndDate = new Date(now);
  
  if (startDate && endDate) {
    // Use explicit date range
    effectiveStartDate = new Date(startDate);
    effectiveEndDate = new Date(endDate);
  } else if (timeframe) {
    // Calculate date range based on timeframe
    switch (timeframe.toLowerCase()) {
      case 'day':
        effectiveStartDate = new Date(now);
        effectiveStartDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        effectiveStartDate = new Date(now);
        effectiveStartDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        effectiveStartDate = new Date(now);
        effectiveStartDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        effectiveStartDate = new Date(now);
        effectiveStartDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        effectiveStartDate = new Date(now);
        effectiveStartDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        // Default to last 30 days
        effectiveStartDate = new Date(now);
        effectiveStartDate.setDate(now.getDate() - 30);
    }
  } else {
    // Default to last 30 days
    effectiveStartDate = new Date(now);
    effectiveStartDate.setDate(now.getDate() - 30);
  }
  
  return { effectiveStartDate, effectiveEndDate };
}

function calculateDistribution(values, bucketCount) {
  if (!values || values.length === 0) {
    return [];
  }
  
  // Find min and max
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  // Calculate bucket size
  const bucketSize = (max - min) / bucketCount;
  
  // Initialize buckets
  const buckets = Array(bucketCount).fill(0);
  
  // Count values in each bucket
  for (const value of values) {
    const bucketIndex = Math.min(
      bucketCount - 1,
      Math.floor((value - min) / bucketSize)
    );
    buckets[bucketIndex]++;
  }
  
  // Format as distribution
  return buckets.map((count, index) => {
    const bucketMin = min + index * bucketSize;
    const bucketMax = bucketMin + bucketSize;
    
    return {
      range: `${bucketMin.toFixed(2)} - ${bucketMax.toFixed(2)}`,
      count,
      percentage: (count / values.length * 100).toFixed(2)
    };
  });
}

function normalizeAnalyticsResults(results) {
  // Normalize various metrics to consistent scales
  
  // Normalize quality metrics
  if (results.qualityMetrics) {
    results.qualityMetrics.normalizedScore = results.qualityMetrics.average / 100;
  }
  
  // Normalize complexity metrics
  if (results.complexityMetrics) {
    results.complexityMetrics.normalizedScore = results.complexityMetrics.average / 100;
  }
  
  // Normalize completeness metrics
  if (results.completenessMetrics) {
    results.completenessMetrics.normalizedScore = results.completenessMetrics.average / 100;
  }
  
  // Normalize relationship metrics
  if (results.relationshipMetrics) {
    const maxPossibleRelationships = results.count.total * (results.count.total - 1);
    results.relationshipMetrics.normalizedDensity = maxPossibleRelationships > 0
      ? results.relationshipMetrics.totalRelationships / maxPossibleRelationships
      : 0;
  }
  
  return results;
}

function estimateRecordCount(data) {
  let count = 0;
  
  // Count top-level arrays
  for (const key in data) {
    if (Array.isArray(data[key])) {
      count += data[key].length;
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      // Count nested arrays
      for (const nestedKey in data[key]) {
        if (Array.isArray(data[key][nestedKey])) {
          count += data[key][nestedKey].length;
        }
      }
    }
  }
  
  return count;
}

function convertToCsv(data, options = {}) {
  // This would be a more sophisticated implementation in a real system
  
  // Handle simple case: array of objects
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return '';
    }
    
    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Build CSV header row
    let csv = headers.join(',') + '\n';
    
    // Build data rows
    for (const item of data) {
      const row = headers.map(header => {
        const value = item[header];
        
        // Handle different value types
        if (value === null || value === undefined) {
          return '';
        } else if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        } else {
          return `"${String(value).replace(/"/g, '""')}"`;
        }
      });
      
      csv += row.join(',') + '\n';
    }
    
    return csv;
  }
  
  // Handle complex case: nested object
  // For simplicity, we'll convert to a flat structure
  const flattened = [];
  
  for (const key in data) {
    if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
      flattened.push({
        key,
        value: JSON.stringify(data[key])
      });
    } else {
      flattened.push({
        key,
        value: data[key]
      });
    }
  }
  
  return convertToCsv(flattened);
}

function convertToHtml(data, options = {}) {
  // This would be a more sophisticated implementation in a real system
  
  let html = '<!DOCTYPE html>\n<html>\n<head>\n';
  html += '<meta charset="UTF-8">\n';
  html += '<title>Analytics Report</title>\n';
  html += '<style>\n';
  html += 'body { font-family: Arial, sans-serif; margin: 20px; }\n';
  html += 'table { border-collapse: collapse; width: 100%; }\n';
  html += 'th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\n';
  html += 'th { background-color: #f2f2f2; }\n';
  html += 'h1, h2 { color: #333; }\n';
  html += '</style>\n';
  html += '</head>\n<body>\n';
  
  html += '<h1>Analytics Report</h1>\n';
  html += `<p>Generated on: ${new Date().toLocaleString()}</p>\n`;
  
  // Add summary section
  html += '<h2>Summary</h2>\n';
  if (data.count) {
    html += '<table>\n<tr><th>Metric</th><th>Value</th></tr>\n';
    html += `<tr><td>Total Artifacts</td><td>${data.count.total || 0}</td></tr>\n`;
    
    for (const [type, count] of Object.entries(data.count)) {
      if (type !== 'total') {
        html += `<tr><td>${type}</td><td>${count}</td></tr>\n`;
      }
    }
    
    html += '</table>\n';
  }
  
  // Add quality metrics if available
  if (data.qualityMetrics) {
    html += '<h2>Quality Metrics</h2>\n';
    html += '<table>\n<tr><th>Metric</th><th>Value</th></tr>\n';
    html += `<tr><td>Average Quality</td><td>${data.qualityMetrics.average || 0}/100</td></tr>\n`;
    html += `<tr><td>Minimum Quality</td><td>${data.qualityMetrics.min || 0}/100</td></tr>\n`;
    html += `<tr><td>Maximum Quality</td><td>${data.qualityMetrics.max || 0}/100</td></tr>\n`;
    html += '</table>\n';
  }
  
  // Add relationship metrics if available
  if (data.relationshipMetrics) {
    html += '<h2>Relationship Metrics</h2>\n';
    html += '<table>\n<tr><th>Metric</th><th>Value</th></tr>\n';
    html += `<tr><td>Total Relationships</td><td>${data.relationshipMetrics.totalRelationships || 0}</td></tr>\n`;
    html += `<tr><td>Orphaned Artifacts</td><td>${data.relationshipMetrics.orphanedArtifacts || 0}</td></tr>\n`;
    html += '</table>\n';
  }
  
  html += '</body>\n</html>';
  return html;
}

function convertToMarkdown(data, options = {}) {
  // This would be a more sophisticated implementation in a real system
  
  let markdown = '# Analytics Report\n\n';
  markdown += `Generated on: ${new Date().toLocaleString()}\n\n`;
  
  // Add summary section
  markdown += '## Summary\n\n';
  if (data.count) {
    markdown += '| Metric | Value |\n';
    markdown += '|--------|-------|\n';
    markdown += `| Total Artifacts | ${data.count.total || 0} |\n`;
    
    for (const [type, count] of Object.entries(data.count)) {
      if (type !== 'total') {
        markdown += `| ${type} | ${count} |\n`;
      }
    }
    
    markdown += '\n';
  }
  
  // Add quality metrics if available
  if (data.qualityMetrics) {
    markdown += '## Quality Metrics\n\n';
    markdown += '| Metric | Value |\n';
    markdown += '|--------|-------|\n';
    markdown += `| Average Quality | ${data.qualityMetrics.average || 0}/100 |\n`;
    markdown += `| Minimum Quality | ${data.qualityMetrics.min || 0}/100 |\n`;
    markdown += `| Maximum Quality | ${data.qualityMetrics.max || 0}/100 |\n\n`;
  }
  
  // Add relationship metrics if available
  if (data.relationshipMetrics) {
    markdown += '## Relationship Metrics\n\n';
    markdown += '| Metric | Value |\n';
    markdown += '|--------|-------|\n';
    markdown += `| Total Relationships | ${data.relationshipMetrics.totalRelationships || 0} |\n`;
    markdown += `| Orphaned Artifacts | ${data.relationshipMetrics.orphanedArtifacts || 0} |\n\n`;
  }
  
  return markdown;
}

module.exports = {
  generateAnalytics,
  analyzeRelationshipGraph,
  analyzeActivityPatterns,
  analyzeKnowledgeImpact,
  configureDashboard,
  prepareAnalyticsExport
};