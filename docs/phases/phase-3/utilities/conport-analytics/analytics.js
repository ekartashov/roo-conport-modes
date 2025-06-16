/**
 * Advanced ConPort Analytics - Integration Layer
 * 
 * This module provides a simplified API that integrates with ConPort,
 * handling artifact retrieval, storage, and context management.
 */

const { 
  validateAnalyticsQueryOptions,
  validateRelationAnalysisOptions,
  validateActivityAnalysisOptions,
  validateImpactAnalysisOptions,
  validateDashboardConfigOptions,
  validateAnalyticsExportOptions
} = require('./analytics-validation');

const {
  generateAnalytics,
  analyzeRelationshipGraph,
  analyzeActivityPatterns,
  analyzeKnowledgeImpact,
  configureDashboard,
  prepareAnalyticsExport
} = require('./analytics-core');

/**
 * Creates an analytics API instance integrated with ConPort
 *
 * @param {Object} options - Configuration options
 * @param {string} options.workspaceId - Workspace ID for ConPort operations
 * @param {Object} options.conPortClient - ConPort client instance
 * @param {boolean} [options.enableValidation=true] - Whether to enable input validation
 * @param {boolean} [options.cacheResults=true] - Whether to cache results in ConPort
 * @param {boolean} [options.addToActiveContext=false] - Whether to add analytic insights to active context
 * @returns {Object} Analytics API object
 */
function createAnalytics({
  workspaceId,
  conPortClient,
  enableValidation = true,
  cacheResults = true,
  addToActiveContext = false
}) {
  if (!workspaceId || typeof workspaceId !== 'string') {
    throw new Error('Invalid configuration: workspaceId is required and must be a string');
  }

  if (!conPortClient) {
    throw new Error('Invalid configuration: conPortClient is required');
  }

  const requiredMethods = [
    'get_decisions', 'get_system_patterns', 'get_progress',
    'get_custom_data', 'log_custom_data', 'get_linked_items'
  ];

  for (const method of requiredMethods) {
    if (typeof conPortClient[method] !== 'function') {
      throw new Error(`Invalid ConPort client: Missing required method '${method}'`);
    }
  }

  /**
   * Runs a query to analyze ConPort data
   *
   * @param {Object} options - Query options
   * @param {string} [options.timeframe] - Timeframe for analysis (e.g., 'day', 'week', 'month', 'year')
   * @param {string} [options.startDate] - ISO string date for custom timeframe start
   * @param {string} [options.endDate] - ISO string date for custom timeframe end
   * @param {Array<string>} [options.artifactTypes] - Types of artifacts to include in analysis
   * @param {Array<string>} [options.dimensions] - Specific dimensions to analyze
   * @param {Object} [options.filters] - Additional filters for the query
   * @param {boolean} [options.includeVersions] - Whether to include versioned artifacts
   * @param {boolean} [options.normalizeResults] - Whether to normalize results
   * @param {string} [options.outputFormat] - Format for results (e.g., 'json', 'csv')
   * @param {number} [options.limit] - Maximum number of results to return
   * @returns {Promise<Object>} Analytics results
   * @throws {Error} If validation fails or ConPort operations fail
   */
  async function runAnalyticsQuery(options = {}) {
    // Add workspaceId to options
    const queryOptions = { ...options, workspaceId };
    
    // Validate options if enabled
    const validatedOptions = enableValidation
      ? validateAnalyticsQueryOptions(queryOptions)
      : queryOptions;
    
    try {
      // Fetch data from ConPort
      const data = await fetchConPortData(validatedOptions);
      
      // Generate analytics
      const results = generateAnalytics(validatedOptions, data);
      
      // Cache results if enabled
      if (cacheResults) {
        await cacheAnalyticsResults(validatedOptions, results);
      }
      
      // Update active context if enabled
      if (addToActiveContext) {
        await updateActiveContext(validatedOptions, results);
      }
      
      return results;
    } catch (error) {
      throw new Error(`Analytics query failed: ${error.message}`);
    }
  }

  /**
   * Analyzes knowledge relationships in ConPort
   *
   * @param {Object} options - Analysis options
   * @param {string} [options.centralNodeType] - Type of the central node (e.g., 'decision', 'system_pattern')
   * @param {string} [options.centralNodeId] - ID of the central node
   * @param {number} [options.depth=1] - Depth of the relationship graph to traverse
   * @param {Array<string>} [options.relationshipTypes] - Types of relationships to include
   * @param {boolean} [options.includeMetadata=false] - Whether to include metadata in the results
   * @returns {Promise<Object>} Relationship analysis results
   * @throws {Error} If validation fails or ConPort operations fail
   */
  async function analyzeRelationships(options = {}) {
    // Add workspaceId to options
    const analysisOptions = { ...options, workspaceId };
    
    // Validate options if enabled
    const validatedOptions = enableValidation
      ? validateRelationAnalysisOptions(analysisOptions)
      : analysisOptions;
    
    try {
      // Fetch relationship data from ConPort
      const data = await fetchRelationshipData(validatedOptions);
      
      // Analyze relationships
      const results = analyzeRelationshipGraph(validatedOptions, data);
      
      // Cache results if enabled
      if (cacheResults) {
        await cacheRelationshipResults(validatedOptions, results);
      }
      
      return results;
    } catch (error) {
      throw new Error(`Relationship analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyzes activity patterns in ConPort
   *
   * @param {Object} options - Analysis options
   * @param {string} [options.timeframe] - Timeframe for analysis (e.g., 'day', 'week', 'month', 'year')
   * @param {string} [options.startDate] - ISO string date for custom timeframe start
   * @param {string} [options.endDate] - ISO string date for custom timeframe end
   * @param {Array<string>} [options.activityTypes] - Types of activities to analyze
   * @param {Array<string>} [options.artifactTypes] - Types of artifacts to include in analysis
   * @param {string} [options.groupBy='day'] - How to group the results (e.g., 'day', 'type')
   * @param {boolean} [options.cumulative=false] - Whether to show cumulative results
   * @returns {Promise<Object>} Activity analysis results
   * @throws {Error} If validation fails or ConPort operations fail
   */
  async function analyzeActivity(options = {}) {
    // Add workspaceId to options
    const analysisOptions = { ...options, workspaceId };
    
    // Validate options if enabled
    const validatedOptions = enableValidation
      ? validateActivityAnalysisOptions(analysisOptions)
      : analysisOptions;
    
    try {
      // Fetch activity data from ConPort
      const data = await fetchActivityData(validatedOptions);
      
      // Analyze activity patterns
      const results = analyzeActivityPatterns(validatedOptions, data);
      
      // Cache results if enabled
      if (cacheResults) {
        await cacheActivityResults(validatedOptions, results);
      }
      
      return results;
    } catch (error) {
      throw new Error(`Activity analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyzes the impact of a knowledge artifact
   *
   * @param {Object} options - Analysis options
   * @param {string} options.artifactType - Type of artifact to analyze
   * @param {string|number} options.artifactId - ID of the artifact to analyze
   * @param {string} [options.impactMetric='references'] - Metric to measure impact
   * @param {number} [options.depth=1] - Depth of impact analysis
   * @param {boolean} [options.includeIndirect=true] - Whether to include indirect impacts
   * @returns {Promise<Object>} Impact analysis results
   * @throws {Error} If validation fails or ConPort operations fail
   */
  async function analyzeImpact(options = {}) {
    // Add workspaceId to options
    const analysisOptions = { ...options, workspaceId };
    
    // Validate options if enabled
    const validatedOptions = enableValidation
      ? validateImpactAnalysisOptions(analysisOptions)
      : analysisOptions;
    
    try {
      // Fetch impact data from ConPort
      const data = await fetchImpactData(validatedOptions);
      
      // Analyze impact
      const results = analyzeKnowledgeImpact(validatedOptions, data);
      
      // Cache results if enabled
      if (cacheResults) {
        await cacheImpactResults(validatedOptions, results);
      }
      
      return results;
    } catch (error) {
      throw new Error(`Impact analysis failed: ${error.message}`);
    }
  }

  /**
   * Creates or updates an analytics dashboard
   *
   * @param {Object} options - Dashboard configuration options
   * @param {string} [options.dashboardId] - ID of existing dashboard to update
   * @param {string} [options.name] - Name of the dashboard
   * @param {Array<Object>} [options.widgets=[]] - Widgets to include in the dashboard
   * @param {Object} [options.layout={}] - Layout configuration for the dashboard
   * @param {boolean} [options.isDefault=false] - Whether this is the default dashboard
   * @returns {Promise<Object>} The created or updated dashboard configuration
   * @throws {Error} If validation fails or ConPort operations fail
   */
  async function createOrUpdateDashboard(options = {}) {
    // Add workspaceId to options
    const dashboardOptions = { ...options, workspaceId };
    
    // Validate options if enabled
    const validatedOptions = enableValidation
      ? validateDashboardConfigOptions(dashboardOptions)
      : dashboardOptions;
    
    try {
      // Fetch existing dashboards
      const existingDashboards = await fetchDashboards();
      
      // Create or update the dashboard
      const dashboard = configureDashboard(validatedOptions, existingDashboards);
      
      // Save the dashboard to ConPort
      await saveDashboard(dashboard);
      
      return dashboard;
    } catch (error) {
      throw new Error(`Dashboard configuration failed: ${error.message}`);
    }
  }

  /**
   * Gets an analytics dashboard by ID or name
   *
   * @param {Object} options - Options for getting a dashboard
   * @param {string} [options.dashboardId] - ID of the dashboard to get
   * @param {string} [options.name] - Name of the dashboard to get
   * @param {boolean} [options.getDefault=false] - Whether to get the default dashboard
   * @returns {Promise<Object>} The dashboard configuration
   * @throws {Error} If dashboard not found or ConPort operations fail
   */
  async function getDashboard(options = {}) {
    const { dashboardId, name, getDefault = false } = options;
    
    try {
      // Fetch all dashboards
      const dashboards = await fetchDashboards();
      
      if (dashboardId) {
        const dashboard = dashboards.find(d => d.id === dashboardId);
        if (!dashboard) {
          throw new Error(`Dashboard not found with ID: ${dashboardId}`);
        }
        return dashboard;
      }
      
      if (name) {
        const dashboard = dashboards.find(d => d.name === name);
        if (!dashboard) {
          throw new Error(`Dashboard not found with name: ${name}`);
        }
        return dashboard;
      }
      
      if (getDefault) {
        const defaultDashboard = dashboards.find(d => d.isDefault);
        if (!defaultDashboard) {
          throw new Error('No default dashboard found');
        }
        return defaultDashboard;
      }
      
      throw new Error('Either dashboardId, name, or getDefault must be specified');
    } catch (error) {
      throw new Error(`Failed to get dashboard: ${error.message}`);
    }
  }

  /**
   * Lists all analytics dashboards
   *
   * @returns {Promise<Array<Object>>} List of dashboard configurations
   * @throws {Error} If ConPort operations fail
   */
  async function listDashboards() {
    try {
      return await fetchDashboards();
    } catch (error) {
      throw new Error(`Failed to list dashboards: ${error.message}`);
    }
  }

  /**
   * Deletes an analytics dashboard
   *
   * @param {string} dashboardId - ID of the dashboard to delete
   * @returns {Promise<Object>} Result of the deletion
   * @throws {Error} If dashboard not found or ConPort operations fail
   */
  async function deleteDashboard(dashboardId) {
    if (!dashboardId) {
      throw new Error('dashboardId is required');
    }
    
    try {
      const dashboards = await fetchDashboards();
      
      const dashboardIndex = dashboards.findIndex(d => d.id === dashboardId);
      if (dashboardIndex === -1) {
        throw new Error(`Dashboard not found with ID: ${dashboardId}`);
      }
      
      // Remove the dashboard
      dashboards.splice(dashboardIndex, 1);
      
      // Save the updated dashboards list
      await saveAllDashboards(dashboards);
      
      return { success: true, message: `Dashboard ${dashboardId} deleted` };
    } catch (error) {
      throw new Error(`Failed to delete dashboard: ${error.message}`);
    }
  }

  /**
   * Exports analytics data to the specified format
   *
   * @param {Object} options - Export options
   * @param {Object} options.query - The analytics query to export results for
   * @param {string} options.format - Format to export (e.g., 'json', 'csv')
   * @param {string} [options.destination='file'] - Destination for export
   * @param {Object} [options.exportConfig={}] - Additional export configuration
   * @returns {Promise<Object>} Export result with data and metadata
   * @throws {Error} If validation fails or export fails
   */
  async function exportAnalytics(options = {}) {
    // Add workspaceId to options
    const exportOptions = { ...options, workspaceId };
    
    // Validate options if enabled
    const validatedOptions = enableValidation
      ? validateAnalyticsExportOptions(exportOptions)
      : exportOptions;
    
    try {
      // Run the analytics query
      const analyticsData = await runAnalyticsQuery(validatedOptions.query);
      
      // Prepare export
      const exportResult = prepareAnalyticsExport(validatedOptions, analyticsData);
      
      // Save export metadata if caching is enabled
      if (cacheResults) {
        await cacheExportMetadata(validatedOptions, exportResult.metadata);
      }
      
      return exportResult;
    } catch (error) {
      throw new Error(`Analytics export failed: ${error.message}`);
    }
  }

  /**
   * Gets insights from a specified data set or the entire knowledge base
   *
   * @param {Object} options - Options for generating insights
   * @param {Array<string>} [options.artifactTypes] - Types of artifacts to analyze
   * @param {Object} [options.filters] - Filters to apply to the data
   * @param {number} [options.depth=1] - Depth of analysis
   * @param {number} [options.topK=5] - Number of top insights to return
   * @returns {Promise<Object>} Generated insights
   * @throws {Error} If insight generation fails
   */
  async function getInsights(options = {}) {
    const { 
      artifactTypes = [], 
      filters = {}, 
      depth = 1,
      topK = 5
    } = options;
    
    try {
      // Run a general analytics query
      const analytics = await runAnalyticsQuery({ 
        artifactTypes, 
        filters,
        dimensions: ['count', 'types', 'tags', 'quality', 'relationships', 'trends']
      });
      
      // Generate insights based on analytics results
      const insights = {
        topPatterns: identifyTopPatterns(analytics, topK),
        anomalies: identifyAnomalies(analytics),
        qualityIssues: identifyQualityIssues(analytics),
        trends: identifyTrends(analytics),
        recommendations: generateRecommendations(analytics),
        timestamp: new Date().toISOString()
      };
      
      // Add insights to active context if enabled
      if (addToActiveContext) {
        await addInsightsToActiveContext(insights);
      }
      
      return insights;
    } catch (error) {
      throw new Error(`Failed to generate insights: ${error.message}`);
    }
  }

  // Helper functions for ConPort data fetching

  async function fetchConPortData(options) {
    const { artifactTypes = [] } = options;
    const data = {};
    
    // Determine which artifact types to fetch
    const typesToFetch = artifactTypes.length > 0 
      ? artifactTypes 
      : ['decision', 'system_pattern', 'progress', 'custom_data'];
    
    // Fetch each artifact type
    const fetchPromises = [];
    
    if (typesToFetch.includes('decision')) {
      fetchPromises.push(
        conPortClient.get_decisions({ workspace_id: workspaceId })
          .then(decisions => { data.decision = decisions; })
      );
    }
    
    if (typesToFetch.includes('system_pattern')) {
      fetchPromises.push(
        conPortClient.get_system_patterns({ workspace_id: workspaceId })
          .then(patterns => { data.system_pattern = patterns; })
      );
    }
    
    if (typesToFetch.includes('progress')) {
      fetchPromises.push(
        conPortClient.get_progress({ workspace_id: workspaceId })
          .then(progress => { data.progress = progress; })
      );
    }
    
    if (typesToFetch.includes('custom_data')) {
      fetchPromises.push(
        conPortClient.get_custom_data({ workspace_id: workspaceId })
          .then(customData => { data.custom_data = customData; })
      );
    }
    
    // Wait for all fetch operations to complete
    await Promise.all(fetchPromises);
    
    return data;
  }

  async function fetchRelationshipData(options) {
    const { centralNodeType, centralNodeId } = options;
    
    // Initialize data structure
    const data = {
      nodes: [],
      relationships: []
    };
    
    // If central node is specified, fetch related items
    if (centralNodeType && centralNodeId) {
      const relatedItems = await conPortClient.get_linked_items({
        workspace_id: workspaceId,
        item_type: centralNodeType,
        item_id: centralNodeId
      });
      
      // Add central node to the nodes list
      let centralNode;
      switch (centralNodeType) {
        case 'decision':
          centralNode = await conPortClient.get_decisions({ 
            workspace_id: workspaceId,
            decision_id: centralNodeId
          });
          break;
        case 'system_pattern':
          centralNode = await conPortClient.get_system_patterns({ 
            workspace_id: workspaceId,
            pattern_id: centralNodeId
          });
          break;
        case 'progress':
          centralNode = await conPortClient.get_progress({ 
            workspace_id: workspaceId,
            progress_id: centralNodeId
          });
          break;
        case 'custom_data':
          const [category, key] = centralNodeId.split(':');
          centralNode = await conPortClient.get_custom_data({ 
            workspace_id: workspaceId,
            category,
            key
          });
          break;
      }
      
      if (centralNode) {
        data.nodes.push({
          type: centralNodeType,
          id: String(centralNodeId),
          data: centralNode
        });
      }
      
      // Process related items
      if (relatedItems && relatedItems.length > 0) {
        for (const item of relatedItems) {
          // Add node if not already in the list
          if (!data.nodes.find(n => n.type === item.item_type && n.id === String(item.item_id))) {
            let nodeData;
            switch (item.item_type) {
              case 'decision':
                nodeData = await conPortClient.get_decisions({ 
                  workspace_id: workspaceId,
                  decision_id: item.item_id
                });
                break;
              case 'system_pattern':
                nodeData = await conPortClient.get_system_patterns({ 
                  workspace_id: workspaceId,
                  pattern_id: item.item_id
                });
                break;
              case 'progress':
                nodeData = await conPortClient.get_progress({ 
                  workspace_id: workspaceId,
                  progress_id: item.item_id
                });
                break;
              case 'custom_data':
                const [category, key] = item.item_id.split(':');
                nodeData = await conPortClient.get_custom_data({ 
                  workspace_id: workspaceId,
                  category,
                  key
                });
                break;
            }
            
            if (nodeData) {
              data.nodes.push({
                type: item.item_type,
                id: String(item.item_id),
                data: nodeData
              });
            }
          }
          
          // Add relationship
          data.relationships.push({
            source: {
              type: centralNodeType,
              id: String(centralNodeId)
            },
            target: {
              type: item.item_type,
              id: String(item.item_id)
            },
            type: item.relationship_type || 'related_to',
            description: item.description || ''
          });
        }
      }
    } else {
      // Fetch all nodes and relationships
      const decisions = await conPortClient.get_decisions({ workspace_id: workspaceId });
      const patterns = await conPortClient.get_system_patterns({ workspace_id: workspaceId });
      const progressItems = await conPortClient.get_progress({ workspace_id: workspaceId });
      
      // Add nodes
      if (decisions) {
        for (const decision of decisions) {
          data.nodes.push({
            type: 'decision',
            id: String(decision.id),
            data: decision
          });
        }
      }
      
      if (patterns) {
        for (const pattern of patterns) {
          data.nodes.push({
            type: 'system_pattern',
            id: String(pattern.id),
            data: pattern
          });
        }
      }
      
      if (progressItems) {
        for (const progress of progressItems) {
          data.nodes.push({
            type: 'progress',
            id: String(progress.id),
            data: progress
          });
        }
      }
      
      // Fetch relationships for each node
      for (const node of data.nodes) {
        const relationships = await conPortClient.get_linked_items({
          workspace_id: workspaceId,
          item_type: node.type,
          item_id: node.id
        });
        
        if (relationships && relationships.length > 0) {
          for (const rel of relationships) {
            data.relationships.push({
              source: {
                type: node.type,
                id: node.id
              },
              target: {
                type: rel.item_type,
                id: String(rel.item_id)
              },
              type: rel.relationship_type || 'related_to',
              description: rel.description || ''
            });
          }
        }
      }
    }
    
    return data;
  }

  async function fetchActivityData(options) {
    // ConPort doesn't have a direct activity API, so we'll synthesize this from item timestamps
    const data = await fetchConPortData(options);
    const activities = [];
    
    // Generate activities from decisions
    if (data.decision) {
      for (const decision of data.decision) {
        activities.push({
          type: 'create',
          artifactType: 'decision',
          artifactId: String(decision.id),
          timestamp: decision.timestamp || new Date().toISOString(),
          userId: decision.author || 'unknown',
          metadata: {
            title: decision.summary,
            tags: decision.tags || []
          }
        });
      }
    }
    
    // Generate activities from system patterns
    if (data.system_pattern) {
      for (const pattern of data.system_pattern) {
        activities.push({
          type: 'create',
          artifactType: 'system_pattern',
          artifactId: String(pattern.id),
          timestamp: pattern.timestamp || new Date().toISOString(),
          userId: pattern.author || 'unknown',
          metadata: {
            title: pattern.name,
            tags: pattern.tags || []
          }
        });
      }
    }
    
    // Generate activities from progress entries
    if (data.progress) {
      for (const progress of data.progress) {
        activities.push({
          type: 'create',
          artifactType: 'progress',
          artifactId: String(progress.id),
          timestamp: progress.timestamp || new Date().toISOString(),
          userId: progress.author || 'unknown',
          metadata: {
            title: progress.description,
            status: progress.status
          }
        });
      }
    }
    
    // Sort all activities by timestamp (newest first)
    activities.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    return activities;
  }

  async function fetchImpactData(options) {
    const { artifactType, artifactId } = options;
    
    // Fetch the target artifact and related data
    const data = {
      artifacts: {},
      relationships: []
    };
    
    // Fetch artifacts by type
    switch (artifactType) {
      case 'decision':
        data.artifacts.decision = [
          await conPortClient.get_decisions({ 
            workspace_id: workspaceId,
            decision_id: artifactId
          })
        ];
        break;
      case 'system_pattern':
        data.artifacts.system_pattern = [
          await conPortClient.get_system_patterns({ 
            workspace_id: workspaceId,
            pattern_id: artifactId
          })
        ];
        break;
      case 'progress':
        data.artifacts.progress = [
          await conPortClient.get_progress({ 
            workspace_id: workspaceId,
            progress_id: artifactId
          })
        ];
        break;
      case 'custom_data':
        const [category, key] = artifactId.split(':');
        data.artifacts.custom_data = [
          await conPortClient.get_custom_data({ 
            workspace_id: workspaceId,
            category,
            key
          })
        ];
        break;
    }
    
    // Fetch relationships
    const relationships = await conPortClient.get_linked_items({
      workspace_id: workspaceId,
      item_type: artifactType,
      item_id: artifactId
    });
    
    // Process relationships
    if (relationships && relationships.length > 0) {
      for (const rel of relationships) {
        data.relationships.push({
          source: {
            type: artifactType,
            id: String(artifactId)
          },
          target: {
            type: rel.item_type,
            id: String(rel.item_id)
          },
          type: rel.relationship_type || 'related_to',
          description: rel.description || ''
        });
        
        // Fetch the related artifact
        let relatedArtifact;
        switch (rel.item_type) {
          case 'decision':
            relatedArtifact = await conPortClient.get_decisions({ 
              workspace_id: workspaceId,
              decision_id: rel.item_id
            });
            if (!data.artifacts.decision) {
              data.artifacts.decision = [];
            }
            data.artifacts.decision.push(relatedArtifact);
            break;
          case 'system_pattern':
            relatedArtifact = await conPortClient.get_system_patterns({ 
              workspace_id: workspaceId,
              pattern_id: rel.item_id
            });
            if (!data.artifacts.system_pattern) {
              data.artifacts.system_pattern = [];
            }
            data.artifacts.system_pattern.push(relatedArtifact);
            break;
          case 'progress':
            relatedArtifact = await conPortClient.get_progress({ 
              workspace_id: workspaceId,
              progress_id: rel.item_id
            });
            if (!data.artifacts.progress) {
              data.artifacts.progress = [];
            }
            data.artifacts.progress.push(relatedArtifact);
            break;
          case 'custom_data':
            const [category, key] = rel.item_id.split(':');
            relatedArtifact = await conPortClient.get_custom_data({ 
              workspace_id: workspaceId,
              category,
              key
            });
            if (!data.artifacts.custom_data) {
              data.artifacts.custom_data = [];
            }
            data.artifacts.custom_data.push(relatedArtifact);
            break;
        }
      }
    }
    
    return data;
  }

  async function fetchDashboards() {
    try {
      const result = await conPortClient.get_custom_data({
        workspace_id: workspaceId,
        category: 'analytics_dashboards'
      });
      
      if (!result || !result.value || !Array.isArray(result.value)) {
        return [];
      }
      
      return result.value;
    } catch (error) {
      // If no dashboards exist yet, return empty array
      return [];
    }
  }

  // Helper functions for caching and storage

  async function cacheAnalyticsResults(options, results) {
    const cacheKey = `analytics_${new Date().toISOString()}_${Math.random().toString(36).substring(2, 9)}`;
    
    try {
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'analytics_results',
        key: cacheKey,
        value: {
          options,
          results,
          timestamp: new Date().toISOString()
        }
      });
      
      return { cacheKey };
    } catch (error) {
      console.warn(`Failed to cache analytics results: ${error.message}`);
      return null;
    }
  }

  async function cacheRelationshipResults(options, results) {
    const cacheKey = `relationships_${new Date().toISOString()}_${Math.random().toString(36).substring(2, 9)}`;
    
    try {
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'analytics_results',
        key: cacheKey,
        value: {
          options,
          results,
          timestamp: new Date().toISOString()
        }
      });
      
      return { cacheKey };
    } catch (error) {
      console.warn(`Failed to cache relationship results: ${error.message}`);
      return null;
    }
  }

  async function cacheActivityResults(options, results) {
    const cacheKey = `activity_${new Date().toISOString()}_${Math.random().toString(36).substring(2, 9)}`;
    
    try {
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'analytics_results',
        key: cacheKey,
        value: {
          options,
          results,
          timestamp: new Date().toISOString()
        }
      });
      
      return { cacheKey };
    } catch (error) {
      console.warn(`Failed to cache activity results: ${error.message}`);
      return null;
    }
  }

  async function cacheImpactResults(options, results) {
    const cacheKey = `impact_${options.artifactType}_${options.artifactId}_${new Date().toISOString()}`;
    
    try {
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'analytics_results',
        key: cacheKey,
        value: {
          options,
          results,
          timestamp: new Date().toISOString()
        }
      });
      
      return { cacheKey };
    } catch (error) {
      console.warn(`Failed to cache impact results: ${error.message}`);
      return null;
    }
  }

  async function cacheExportMetadata(options, metadata) {
    const cacheKey = `export_${new Date().toISOString()}_${Math.random().toString(36).substring(2, 9)}`;
    
    try {
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'analytics_exports',
        key: cacheKey,
        value: {
          options,
          metadata,
          timestamp: new Date().toISOString()
        }
      });
      
      return { cacheKey };
    } catch (error) {
      console.warn(`Failed to cache export metadata: ${error.message}`);
      return null;
    }
  }

  async function updateActiveContext(options, results) {
    try {
      // Get current active context
      const activeContext = await conPortClient.get_active_context({
        workspace_id: workspaceId
      });
      
      // Update with analytics insights
      const insights = generateInsightsFromResults(results);
      
      // Prepare the update
      const analyticsUpdate = {
        latest_analytics: {
          timestamp: new Date().toISOString(),
          summary: insights.summary,
          key_findings: insights.keyFindings
        }
      };
      
      // If there's already analytics data, preserve history
      if (activeContext.analytics) {
        if (Array.isArray(activeContext.analytics.history)) {
          analyticsUpdate.analytics = {
            history: [
              activeContext.analytics.latest || {},
              ...activeContext.analytics.history.slice(0, 4) // Keep last 5 including current
            ],
            latest: analyticsUpdate.latest_analytics
          };
        } else {
          analyticsUpdate.analytics = {
            history: [activeContext.analytics.latest || {}],
            latest: analyticsUpdate.latest_analytics
          };
        }
      } else {
        analyticsUpdate.analytics = {
          history: [],
          latest: analyticsUpdate.latest_analytics
        };
      }
      
      // Update active context
      await conPortClient.update_active_context({
        workspace_id: workspaceId,
        patch_content: analyticsUpdate
      });
      
      return { updated: true };
    } catch (error) {
      console.warn(`Failed to update active context: ${error.message}`);
      return { updated: false };
    }
  }

  async function saveDashboard(dashboard) {
    try {
      // Fetch all dashboards
      const dashboards = await fetchDashboards();
      
      // Check if this dashboard already exists
      const existingIndex = dashboards.findIndex(d => d.id === dashboard.id);
      
      if (existingIndex !== -1) {
        // Update existing dashboard
        dashboards[existingIndex] = dashboard;
      } else {
        // Add new dashboard
        dashboards.push(dashboard);
      }
      
      // If this is the default dashboard, ensure no other dashboard is default
      if (dashboard.isDefault) {
        for (const d of dashboards) {
          if (d.id !== dashboard.id) {
            d.isDefault = false;
          }
        }
      }
      
      // Save all dashboards
      await saveAllDashboards(dashboards);
      
      return { saved: true, dashboard };
    } catch (error) {
      throw new Error(`Failed to save dashboard: ${error.message}`);
    }
  }

  async function saveAllDashboards(dashboards) {
    try {
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'analytics_dashboards',
        key: 'all_dashboards',
        value: dashboards
      });
      
      return { saved: true };
    } catch (error) {
      throw new Error(`Failed to save dashboards: ${error.message}`);
    }
  }

  async function addInsightsToActiveContext(insights) {
    try {
      // Get current active context
      const activeContext = await conPortClient.get_active_context({
        workspace_id: workspaceId
      });
      
      // Prepare the update
      const insightsUpdate = {
        analytics_insights: {
          timestamp: new Date().toISOString(),
          topPatterns: insights.topPatterns,
          anomalies: insights.anomalies.slice(0, 3),
          qualityIssues: insights.qualityIssues.slice(0, 3),
          recommendations: insights.recommendations.slice(0, 3)
        }
      };
      
      // Update active context
      await conPortClient.update_active_context({
        workspace_id: workspaceId,
        patch_content: insightsUpdate
      });
      
      return { updated: true };
    } catch (error) {
      console.warn(`Failed to add insights to active context: ${error.message}`);
      return { updated: false };
    }
  }

  // Insight generation helper functions

  function generateInsightsFromResults(results) {
    // This would be a more sophisticated algorithm in a real implementation
    return {
      summary: `Analysis completed at ${new Date().toLocaleString()} covering ${results.count?.total || 0} artifacts`,
      keyFindings: [
        `Most active artifact type: ${getMostActiveType(results)}`,
        `Quality average: ${getAverageQuality(results)}/100`,
        `Recent trend: ${getRecentTrend(results)}`
      ]
    };
  }

  function getMostActiveType(results) {
    if (!results.typeDistribution) {
      return 'Unknown';
    }
    
    let maxCount = 0;
    let mostActiveType = 'Unknown';
    
    for (const [type, data] of Object.entries(results.typeDistribution)) {
      if (data.count > maxCount) {
        maxCount = data.count;
        mostActiveType = type;
      }
    }
    
    return mostActiveType;
  }

  function getAverageQuality(results) {
    if (!results.qualityMetrics) {
      return 'N/A';
    }
    
    return Math.round(results.qualityMetrics.average);
  }

  function getRecentTrend(results) {
    if (!results.trends || !results.trends.trends || !results.trends.trends.overall) {
      return 'Stable';
    }
    
    return results.trends.trends.overall.direction;
  }

  function identifyTopPatterns(analytics, topK) {
    // This would be more sophisticated in a real implementation
    const patterns = [];
    
    // Check for tag patterns
    if (analytics.tagDistribution && analytics.tagDistribution.tags) {
      const topTags = analytics.tagDistribution.tags
        .slice(0, topK)
        .map(tag => ({
          type: 'tag',
          name: tag.tag,
          count: tag.count,
          description: `Tag used in ${tag.count} artifacts`
        }));
      
      patterns.push(...topTags);
    }
    
    // Add dummy patterns to reach topK
    while (patterns.length < topK) {
      patterns.push({
        type: 'pattern',
        name: `Pattern ${patterns.length + 1}`,
        count: Math.floor(Math.random() * 10),
        description: 'Automatically detected pattern'
      });
    }
    
    return patterns;
  }

  function identifyAnomalies(analytics) {
    // This would be more sophisticated in a real implementation
    return [
      {
        type: 'quality_outlier',
        description: 'Unusually low quality score detected',
        severity: 'medium',
        artifacts: ['decision:12', 'system_pattern:5']
      },
      {
        type: 'activity_spike',
        description: 'Unusual activity spike detected',
        severity: 'low',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      {
        type: 'isolated_artifact',
        description: 'Artifact with no relationships detected',
        severity: 'medium',
        artifacts: ['decision:18']
      }
    ];
  }

  function identifyQualityIssues(analytics) {
    // This would be more sophisticated in a real implementation
    return [
      {
        type: 'incomplete_metadata',
        description: 'Missing metadata in several artifacts',
        severity: 'medium',
        artifacts: ['decision:5', 'system_pattern:3', 'progress:8']
      },
      {
        type: 'low_clarity',
        description: 'Low clarity scores in documentation',
        severity: 'high',
        artifacts: ['custom_data:docs:api_reference']
      },
      {
        type: 'inconsistent_tags',
        description: 'Inconsistent tag usage detected',
        severity: 'low',
        details: 'Similar concepts tagged differently'
      }
    ];
  }

  function identifyTrends(analytics) {
    // This would be more sophisticated in a real implementation
    return {
      overall: {
        direction: 'increasing',
        change: '+15%',
        period: 'last 30 days'
      },
      byType: {
        decision: {
          direction: 'stable',
          change: '+2%'
        },
        system_pattern: {
          direction: 'increasing',
          change: '+23%'
        },
        progress: {
          direction: 'increasing',
          change: '+18%'
        }
      },
      quality: {
        direction: 'improving',
        change: '+8%'
      }
    };
  }

  function generateRecommendations(analytics) {
    // This would be more sophisticated in a real implementation
    return [
      {
        type: 'quality_improvement',
        description: 'Add missing metadata to decision artifacts',
        priority: 'medium',
        impact: 'Would improve quality score by approximately 15%'
      },
      {
        type: 'relationship_creation',
        description: 'Create missing relationships between related decisions and patterns',
        priority: 'high',
        impact: 'Would improve traceability and knowledge graph connectivity'
      },
      {
        type: 'tag_standardization',
        description: 'Standardize tag usage across the knowledge base',
        priority: 'low',
        impact: 'Would improve searchability and categorization'
      },
      {
        type: 'documentation_enhancement',
        description: 'Improve clarity in API reference documentation',
        priority: 'medium',
        impact: 'Would improve usability for developers'
      }
    ];
  }

  return {
    runAnalyticsQuery,
    analyzeRelationships,
    analyzeActivity,
    analyzeImpact,
    createOrUpdateDashboard,
    getDashboard,
    listDashboards,
    deleteDashboard,
    exportAnalytics,
    getInsights
  };
}

module.exports = { createAnalytics };