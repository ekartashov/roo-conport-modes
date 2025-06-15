/**
 * Multi-Agent Knowledge Synchronization - Integration Layer
 * 
 * This module integrates the multi-agent sync capabilities with ConPort,
 * providing a simplified API for synchronizing knowledge between agents.
 */

const {
  validateAgentRegistrationOptions,
  validateKnowledgePushOptions,
  validateKnowledgePullOptions,
  validateConflictResolutionOptions,
  validateSyncSessionOptions,
  validateKnowledgeDiffOptions,
  validateSyncStatusOptions
} = require('./sync-validation');

const {
  createMultiAgentSync
} = require('./sync-core');

/**
 * Creates a Multi-Agent Knowledge Synchronization system integrated with ConPort
 *
 * @param {Object} options - Configuration options
 * @param {string} options.workspaceId - Workspace ID for ConPort operations
 * @param {Object} options.conPortClient - ConPort client instance
 * @param {boolean} [options.enableValidation=true] - Whether to enable input validation
 * @param {Object} [options.defaultSyncPreferences={}] - Default sync preferences for agents
 * @param {Object} [options.logger] - Logger instance
 * @returns {Object} Multi-agent sync API
 */
function createMultiAgentSyncSystem({
  workspaceId,
  conPortClient,
  enableValidation = true,
  defaultSyncPreferences = {},
  logger = console
}) {
  if (!workspaceId || typeof workspaceId !== 'string') {
    throw new Error('Invalid configuration: workspaceId is required and must be a string');
  }

  if (!conPortClient) {
    throw new Error('Invalid configuration: conPortClient is required');
  }

  // Create core multi-agent sync system
  const syncSystem = createMultiAgentSync();
  
  // Dictionary to track registered ConPort agents
  const registeredAgents = {};
  
  // Cache for ConPort artifacts
  const artifactCache = {
    decision: new Map(),
    system_pattern: new Map(),
    progress: new Map(),
    custom_data: new Map()
  };

  /**
   * Initializes the sync system by loading agent information from ConPort
   *
   * @returns {Promise<Object>} Initialization result
   */
  async function initialize() {
    try {
      logger.info('Initializing Multi-Agent Knowledge Synchronization system');
      
      // Load agent registry from ConPort
      const agentData = await loadAgentRegistry();
      
      // Register existing agents
      for (const agent of agentData) {
        try {
          syncSystem.registerAgent(agent);
          registeredAgents[agent.agentId] = true;
        } catch (error) {
          logger.warn(`Failed to register agent ${agent.agentId}: ${error.message}`);
        }
      }
      
      logger.info(`Initialized with ${Object.keys(registeredAgents).length} agents`);
      
      return {
        success: true,
        agentCount: Object.keys(registeredAgents).length
      };
    } catch (error) {
      logger.error(`Initialization failed: ${error.message}`);
      throw new Error(`Failed to initialize multi-agent sync: ${error.message}`);
    }
  }
  
  /**
   * Loads agent registry from ConPort
   *
   * @returns {Promise<Array<Object>>} List of agents
   */
  async function loadAgentRegistry() {
    try {
      const result = await conPortClient.get_custom_data({
        workspace_id: workspaceId,
        category: 'multi_agent_sync_registry',
        key: 'agents'
      });
      
      if (result && result.value && Array.isArray(result.value)) {
        return result.value;
      }
      
      return [];
    } catch (error) {
      // If the data doesn't exist yet, return an empty array
      return [];
    }
  }
  
  /**
   * Saves agent registry to ConPort
   *
   * @param {Array<Object>} agents - List of agents
   * @returns {Promise<boolean>} Success indicator
   */
  async function saveAgentRegistry(agents) {
    try {
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'multi_agent_sync_registry',
        key: 'agents',
        value: agents
      });
      
      return true;
    } catch (error) {
      logger.error(`Failed to save agent registry: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Registers a new agent in the sync system
   *
   * @param {Object} options - Registration options
   * @param {string} options.agentId - Unique identifier for the agent
   * @param {string} options.agentType - Type of agent (e.g., 'roo', 'claude', 'custom')
   * @param {string} options.displayName - Human-readable name for the agent
   * @param {Object} [options.capabilities] - Agent capabilities
   * @param {Object} [options.syncPreferences] - Synchronization preferences
   * @param {Object} [options.metadata] - Additional metadata about the agent
   * @returns {Promise<Object>} Registered agent information
   * @throws {Error} If validation fails or registration fails
   */
  async function registerAgent(options) {
    // Validate options if enabled
    const validatedOptions = enableValidation
      ? validateAgentRegistrationOptions(options)
      : options;
    
    // Apply default sync preferences if not specified
    if (!validatedOptions.syncPreferences) {
      validatedOptions.syncPreferences = { ...defaultSyncPreferences };
    }
    
    try {
      // Register with core system
      const agent = syncSystem.registerAgent(validatedOptions);
      
      // Save to ConPort
      const allAgents = syncSystem.listAgents({ includeCapabilities: true });
      await saveAgentRegistry(allAgents);
      
      // Save to local registry
      registeredAgents[agent.agentId] = true;
      
      // Log event to ConPort active context
      await updateActiveContext({
        event: 'agent_registered',
        agent: {
          agentId: agent.agentId,
          agentType: agent.agentType,
          displayName: agent.displayName
        }
      });
      
      return agent;
    } catch (error) {
      logger.error(`Agent registration failed: ${error.message}`);
      throw new Error(`Failed to register agent: ${error.message}`);
    }
  }
  
  /**
   * Gets all registered agents
   *
   * @param {Object} [options={}] - Listing options
   * @param {string} [options.type] - Filter by agent type
   * @param {boolean} [options.includeCapabilities=false] - Include capabilities
   * @param {boolean} [options.includeSyncHistory=false] - Include sync history
   * @returns {Promise<Array<Object>>} List of agents
   */
  async function getAgents(options = {}) {
    try {
      return syncSystem.listAgents(options);
    } catch (error) {
      logger.error(`Failed to get agents: ${error.message}`);
      throw new Error(`Failed to get agents: ${error.message}`);
    }
  }
  
  /**
   * Updates an existing agent in the sync system
   *
   * @param {string} agentId - ID of the agent to update
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated agent information
   * @throws {Error} If agent doesn't exist or update fails
   */
  async function updateAgent(agentId, updates) {
    try {
      // Update in core system
      const agent = syncSystem.updateAgent(agentId, updates);
      
      // Save to ConPort
      const allAgents = syncSystem.listAgents({ includeCapabilities: true });
      await saveAgentRegistry(allAgents);
      
      return agent;
    } catch (error) {
      logger.error(`Agent update failed: ${error.message}`);
      throw new Error(`Failed to update agent: ${error.message}`);
    }
  }
  
  /**
   * Converts ConPort artifacts to sync system artifacts
   *
   * @param {Array<Object>} artifacts - ConPort artifacts
   * @param {string} artifactType - Type of artifacts
   * @returns {Array<Object>} Converted artifacts
   */
  function convertConPortToSyncArtifacts(artifacts, artifactType) {
    if (!artifacts || artifacts.length === 0) {
      return [];
    }
    
    return artifacts.map(artifact => {
      // Build a base artifact structure
      const syncArtifact = {
        id: String(artifact.id),
        type: artifactType,
        timestamp: artifact.timestamp || new Date().toISOString(),
        content: { ...artifact }
      };
      
      // Add specific fields based on artifact type
      switch (artifactType) {
        case 'decision':
          syncArtifact.content.summary = artifact.summary;
          syncArtifact.content.rationale = artifact.rationale;
          syncArtifact.content.tags = artifact.tags || [];
          break;
          
        case 'system_pattern':
          syncArtifact.content.name = artifact.name;
          syncArtifact.content.description = artifact.description;
          syncArtifact.content.tags = artifact.tags || [];
          break;
          
        case 'progress':
          syncArtifact.content.description = artifact.description;
          syncArtifact.content.status = artifact.status;
          break;
          
        case 'custom_data':
          syncArtifact.id = `${artifact.category}:${artifact.key}`;
          syncArtifact.content.category = artifact.category;
          syncArtifact.content.key = artifact.key;
          syncArtifact.content.value = artifact.value;
          break;
      }
      
      return syncArtifact;
    });
  }
  
  /**
   * Converts sync system artifacts to ConPort artifacts
   *
   * @param {Array<Object>} artifacts - Sync system artifacts
   * @returns {Object} Converted artifacts by type
   */
  function convertSyncToConPortArtifacts(artifacts) {
    const result = {
      decision: [],
      system_pattern: [],
      progress: [],
      custom_data: []
    };
    
    if (!artifacts || artifacts.length === 0) {
      return result;
    }
    
    for (const artifact of artifacts) {
      switch (artifact.type) {
        case 'decision':
          result.decision.push({
            id: artifact.id,
            summary: artifact.content.summary,
            rationale: artifact.content.rationale,
            tags: artifact.content.tags || [],
            timestamp: artifact.timestamp
          });
          break;
          
        case 'system_pattern':
          result.system_pattern.push({
            id: artifact.id,
            name: artifact.content.name,
            description: artifact.content.description,
            tags: artifact.content.tags || [],
            timestamp: artifact.timestamp
          });
          break;
          
        case 'progress':
          result.progress.push({
            id: artifact.id,
            description: artifact.content.description,
            status: artifact.content.status,
            timestamp: artifact.timestamp
          });
          break;
          
        case 'custom_data':
          // Split ID to get category and key
          let category, key;
          if (artifact.id.includes(':')) {
            [category, key] = artifact.id.split(':');
          } else {
            category = 'unknown';
            key = artifact.id;
          }
          
          result.custom_data.push({
            category: artifact.content.category || category,
            key: artifact.content.key || key,
            value: artifact.content.value,
            timestamp: artifact.timestamp
          });
          break;
      }
    }
    
    return result;
  }
  
  /**
   * Fetches knowledge artifacts from ConPort for a specific agent
   *
   * @param {string} agentId - ID of the agent
   * @param {Object} [options={}] - Fetch options
   * @param {Array<string>} [options.artifactTypes] - Types of artifacts to fetch
   * @returns {Promise<Array<Object>>} Fetched artifacts
   */
  async function fetchAgentKnowledge(agentId, options = {}) {
    const { artifactTypes = ['decision', 'system_pattern', 'progress', 'custom_data'] } = options;
    
    const artifacts = [];
    
    try {
      // Fetch each artifact type from ConPort
      for (const type of artifactTypes) {
        let typeArtifacts = [];
        
        switch (type) {
          case 'decision':
            typeArtifacts = await conPortClient.get_decisions({
              workspace_id: workspaceId
            });
            break;
            
          case 'system_pattern':
            typeArtifacts = await conPortClient.get_system_patterns({
              workspace_id: workspaceId
            });
            break;
            
          case 'progress':
            typeArtifacts = await conPortClient.get_progress({
              workspace_id: workspaceId
            });
            break;
            
          case 'custom_data':
            const customData = await conPortClient.get_custom_data({
              workspace_id: workspaceId
            });
            
            if (customData && Array.isArray(customData)) {
              typeArtifacts = customData;
            }
            break;
        }
        
        // Convert to sync artifacts
        const syncArtifacts = convertConPortToSyncArtifacts(typeArtifacts, type);
        
        // Store in cache
        for (const artifact of syncArtifacts) {
          artifactCache[type].set(artifact.id, artifact);
          
          // Store in sync system
          syncSystem.storeArtifact(agentId, artifact);
        }
        
        artifacts.push(...syncArtifacts);
      }
      
      return artifacts;
    } catch (error) {
      logger.error(`Failed to fetch knowledge for agent ${agentId}: ${error.message}`);
      throw new Error(`Failed to fetch knowledge: ${error.message}`);
    }
  }
  
  /**
   * Pushes knowledge artifacts from a source agent to a target agent
   *
   * @param {Object} options - Push options
   * @param {string} options.sourceAgentId - ID of the agent pushing knowledge
   * @param {string} [options.targetAgentId] - ID of the target agent
   * @param {Array<Object>} [options.knowledgeArtifacts] - Artifacts to push (if not provided, fetches from ConPort)
   * @param {Array<string>} [options.artifactTypes] - Types of artifacts to push if not providing artifacts
   * @param {string} [options.syncMode='incremental'] - Sync mode
   * @param {boolean} [options.forceSync=false] - Whether to force sync
   * @returns {Promise<Object>} Push results
   * @throws {Error} If validation fails or push fails
   */
  async function pushKnowledge(options) {
    // Validate options if enabled
    const validatedOptions = enableValidation
      ? validateKnowledgePushOptions({ ...options, knowledgeArtifacts: options.knowledgeArtifacts || [] })
      : options;
    
    const { 
      sourceAgentId, 
      targetAgentId, 
      knowledgeArtifacts,
      artifactTypes,
      syncMode = 'incremental',
      forceSync = false
    } = validatedOptions;
    
    try {
      // If no artifacts provided, fetch from ConPort
      let artifacts = knowledgeArtifacts;
      if (!artifacts || artifacts.length === 0) {
        artifacts = await fetchAgentKnowledge(sourceAgentId, { artifactTypes });
      }
      
      // Push knowledge using core system
      const pushResult = await syncSystem.pushKnowledge({
        sourceAgentId,
        targetAgentId,
        knowledgeArtifacts: artifacts,
        syncMode,
        forceSync
      });
      
      // Record in ConPort
      await logSyncOperation({
        operation: 'push',
        sourceAgentId,
        targetAgentId,
        artifactsCount: artifacts.length,
        artifactTypes: Array.from(new Set(artifacts.map(a => a.type))),
        result: pushResult
      });
      
      return pushResult;
    } catch (error) {
      logger.error(`Push knowledge failed: ${error.message}`);
      throw new Error(`Failed to push knowledge: ${error.message}`);
    }
  }
  
  /**
   * Pulls knowledge artifacts from a source agent to a target agent
   *
   * @param {Object} options - Pull options
   * @param {string} options.targetAgentId - ID of the agent pulling knowledge
   * @param {string} [options.sourceAgentId] - ID of the source agent
   * @param {Array<string>} [options.artifactTypes] - Types of artifacts to pull
   * @param {string} [options.syncMode='incremental'] - Sync mode
   * @param {string} [options.conflictStrategy] - Strategy for handling conflicts
   * @param {Object} [options.filters] - Additional filters
   * @returns {Promise<Object>} Pull results
   * @throws {Error} If validation fails or pull fails
   */
  async function pullKnowledge(options) {
    // Validate options if enabled
    const validatedOptions = enableValidation
      ? validateKnowledgePullOptions(options)
      : options;
    
    const { 
      targetAgentId, 
      sourceAgentId, 
      artifactTypes,
      syncMode = 'incremental',
      conflictStrategy,
      filters
    } = validatedOptions;
    
    try {
      // Ensure source agent has the knowledge to pull
      if (sourceAgentId) {
        await fetchAgentKnowledge(sourceAgentId, { artifactTypes });
      }
      
      // Pull knowledge using core system
      const pullResult = await syncSystem.pullKnowledge({
        targetAgentId,
        sourceAgentId,
        artifactTypes,
        syncMode,
        conflictStrategy,
        filters
      });
      
      // Record in ConPort
      await logSyncOperation({
        operation: 'pull',
        targetAgentId,
        sourceAgentId,
        artifactTypes,
        result: pullResult
      });
      
      return pullResult;
    } catch (error) {
      logger.error(`Pull knowledge failed: ${error.message}`);
      throw new Error(`Failed to pull knowledge: ${error.message}`);
    }
  }
  
  /**
   * Compares knowledge between two agents
   *
   * @param {Object} options - Comparison options
   * @param {string} options.sourceAgentId - ID of the source agent
   * @param {string} options.targetAgentId - ID of the target agent
   * @param {Array<string>} [options.artifactTypes] - Types of artifacts to compare
   * @param {string} [options.diffAlgorithm='default'] - Algorithm for comparison
   * @param {Object} [options.filters] - Additional filters
   * @returns {Promise<Object>} Comparison results
   * @throws {Error} If validation fails or comparison fails
   */
  async function compareKnowledge(options) {
    // Validate options if enabled
    const validatedOptions = enableValidation
      ? validateKnowledgeDiffOptions(options)
      : options;
    
    const { 
      sourceAgentId, 
      targetAgentId, 
      artifactTypes,
      diffAlgorithm = 'default',
      filters
    } = validatedOptions;
    
    try {
      // Ensure both agents have knowledge to compare
      await fetchAgentKnowledge(sourceAgentId, { artifactTypes });
      await fetchAgentKnowledge(targetAgentId, { artifactTypes });
      
      // Compare knowledge using core system
      const compareResult = syncSystem.compareKnowledge({
        sourceAgentId,
        targetAgentId,
        artifactTypes,
        diffAlgorithm,
        filters
      });
      
      // Save comparison result to ConPort
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'multi_agent_sync',
        key: `comparison_${sourceAgentId}_${targetAgentId}_${Date.now()}`,
        value: compareResult
      });
      
      return compareResult;
    } catch (error) {
      logger.error(`Compare knowledge failed: ${error.message}`);
      throw new Error(`Failed to compare knowledge: ${error.message}`);
    }
  }
  
  /**
   * Creates a new sync session
   *
   * @param {Object} options - Session options
   * @param {string} options.sessionId - Unique identifier for the session
   * @param {Array<string>} options.agentIds - IDs of agents participating in the session
   * @param {string} [options.syncMode='bidirectional'] - Mode of sync
   * @param {Array<string>} [options.artifactTypes] - Types of artifacts to sync
   * @param {Object} [options.syncRules] - Rules governing the synchronization
   * @returns {Promise<Object>} Session information
   * @throws {Error} If validation fails or session creation fails
   */
  async function createSyncSession(options) {
    // Validate options if enabled
    const validatedOptions = enableValidation
      ? validateSyncSessionOptions(options)
      : options;
    
    try {
      // Create session using core system
      const session = syncSystem.createSession(validatedOptions);
      
      // Store session in ConPort
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'multi_agent_sync_sessions',
        key: session.sessionId,
        value: session
      });
      
      // Log to active context
      await updateActiveContext({
        event: 'sync_session_created',
        session: {
          id: session.sessionId,
          agents: session.agentIds,
          mode: session.syncMode
        }
      });
      
      return session;
    } catch (error) {
      logger.error(`Create sync session failed: ${error.message}`);
      throw new Error(`Failed to create sync session: ${error.message}`);
    }
  }
  
  /**
   * Gets information about sync sessions
   *
   * @param {Object} [options={}] - Options for getting sessions
   * @param {string} [options.sessionId] - ID of a specific session to get
   * @param {string} [options.status] - Filter by status
   * @param {string} [options.agentId] - Filter by participating agent
   * @param {boolean} [options.includeDetails=false] - Include full session details
   * @returns {Promise<Object|Array<Object>>} Session information
   */
  async function getSyncSessions(options = {}) {
    const { sessionId, status, agentId, includeDetails = false } = options;
    
    try {
      // If sessionId provided, get a specific session
      if (sessionId) {
        return syncSystem.getSession(sessionId);
      }
      
      // Otherwise, list sessions with filters
      return syncSystem.listSessions({ status, agentId, includeDetails });
    } catch (error) {
      logger.error(`Get sync sessions failed: ${error.message}`);
      throw new Error(`Failed to get sync sessions: ${error.message}`);
    }
  }
  
  /**
   * Gets the sync status of an agent
   *
   * @param {Object} options - Status options
   * @param {string} [options.agentId] - ID of agent to get status for
   * @param {string} [options.sessionId] - ID of sync session to get status for
   * @param {boolean} [options.includeDetails=false] - Whether to include detailed status information
   * @param {number} [options.limit] - Maximum number of status entries to return
   * @returns {Promise<Object>} Sync status information
   * @throws {Error} If validation fails or status retrieval fails
   */
  async function getSyncStatus(options) {
    // Validate options if enabled
    const validatedOptions = enableValidation
      ? validateSyncStatusOptions(options)
      : options;
    
    const { 
      agentId, 
      sessionId,
      includeDetails = false,
      limit
    } = validatedOptions;
    
    try {
      const result = {
        timestamp: new Date().toISOString(),
        status: 'unknown'
      };
      
      // If agentId provided, get agent status
      if (agentId) {
        const agent = syncSystem.getAgent(agentId);
        result.agent = {
          agentId: agent.agentId,
          displayName: agent.displayName,
          lastSync: agent.lastSync
        };
        
        if (includeDetails) {
          result.agent.syncHistory = agent.syncHistory;
        }
        
        result.status = agent.lastSync ? 'active' : 'registered';
      }
      
      // If sessionId provided, get session status
      if (sessionId) {
        const session = syncSystem.getSession(sessionId);
        result.session = {
          sessionId: session.sessionId,
          status: session.status,
          agentIds: session.agentIds,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt
        };
        
        if (includeDetails) {
          result.session.conflicts = session.conflicts;
          result.session.progress = session.progress;
          result.session.results = session.results;
        }
        
        result.status = session.status;
      }
      
      return result;
    } catch (error) {
      logger.error(`Get sync status failed: ${error.message}`);
      throw new Error(`Failed to get sync status: ${error.message}`);
    }
  }
  
  /**
   * Resolves a conflict in a sync session
   *
   * @param {Object} options - Conflict resolution options
   * @param {string} options.sessionId - ID of the sync session
   * @param {string} options.conflictId - ID of the conflict to resolve
   * @param {string} options.resolution - Resolution decision ('source', 'target', 'merge', 'custom')
   * @param {Object} [options.customResolution] - Custom resolution data
   * @param {boolean} [options.applyImmediately=true] - Whether to apply the resolution immediately
   * @returns {Promise<Object>} Resolution result
   * @throws {Error} If validation fails or resolution fails
   */
  async function resolveConflict(options) {
    // Validate options if enabled
    const validatedOptions = enableValidation
      ? validateConflictResolutionOptions({
          ...options,
          conflictId: options.conflictId || '' // Ensure conflictId is present for validation
        })
      : options;
    
    const { 
      sessionId, 
      conflictId,
      resolution,
      customResolution,
      applyImmediately = true
    } = validatedOptions;
    
    try {
      // Resolve conflict using core system
      const result = syncSystem.resolveSessionConflict(
        sessionId,
        conflictId,
        resolution,
        customResolution
      );
      
      // If applying immediately, store the resolved artifact to the target
      if (applyImmediately && result.resolvedConflict.resolvedArtifact) {
        const conflict = result.resolvedConflict;
        const artifact = conflict.resolvedArtifact;
        
        // Store in sync system for target agent
        syncSystem.storeArtifact(conflict.targetAgentId, artifact);
        
        // Apply to ConPort if appropriate
        await applyResolvedArtifactToConPort(conflict.targetAgentId, artifact);
      }
      
      // Update session in ConPort
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'multi_agent_sync_sessions',
        key: sessionId,
        value: result.session
      });
      
      // Log conflict resolution to active context
      await updateActiveContext({
        event: 'conflict_resolved',
        conflict: {
          id: conflictId,
          sessionId,
          resolution,
          artifactType: result.resolvedConflict.sourceArtifact.type,
          artifactId: result.resolvedConflict.sourceArtifact.id
        }
      });
      
      return result;
    } catch (error) {
      logger.error(`Resolve conflict failed: ${error.message}`);
      throw new Error(`Failed to resolve conflict: ${error.message}`);
    }
  }
  
  /**
   * Applies a resolved artifact to ConPort
   *
   * @param {string} agentId - ID of the agent
   * @param {Object} artifact - Resolved artifact
   * @returns {Promise<boolean>} Success indicator
   */
  async function applyResolvedArtifactToConPort(agentId, artifact) {
    try {
      const conPortArtifacts = convertSyncToConPortArtifacts([artifact]);
      
      // Apply each artifact type
      for (const type in conPortArtifacts) {
        for (const item of conPortArtifacts[type]) {
          switch (type) {
            case 'decision':
              await conPortClient.log_decision({
                workspace_id: workspaceId,
                summary: item.summary,
                rationale: item.rationale,
                tags: item.tags,
                implementation_details: `Updated via conflict resolution, from agent ${agentId}`
              });
              break;
              
            case 'system_pattern':
              await conPortClient.log_system_pattern({
                workspace_id: workspaceId,
                name: item.name,
                description: item.description,
                tags: item.tags
              });
              break;
              
            case 'progress':
              await conPortClient.log_progress({
                workspace_id: workspaceId,
                description: item.description,
                status: item.status
              });
              break;
              
            case 'custom_data':
              await conPortClient.log_custom_data({
                workspace_id: workspaceId,
                category: item.category,
                key: item.key,
                value: item.value
              });
              break;
          }
        }
      }
      
      return true;
    } catch (error) {
      logger.error(`Failed to apply resolved artifact to ConPort: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Logs a sync operation to ConPort
   *
   * @param {Object} operationInfo - Operation information
   * @returns {Promise<boolean>} Success indicator
   */
  async function logSyncOperation(operationInfo) {
    try {
      await conPortClient.log_custom_data({
        workspace_id: workspaceId,
        category: 'multi_agent_sync_logs',
        key: `${operationInfo.operation}_${Date.now()}`,
        value: {
          ...operationInfo,
          timestamp: new Date().toISOString()
        }
      });
      
      // Also log to active context
      await updateActiveContext({
        event: `sync_${operationInfo.operation}`,
        sync: {
          sourceAgentId: operationInfo.sourceAgentId,
          targetAgentId: operationInfo.targetAgentId,
          artifactsCount: operationInfo.artifactsCount || 0,
          artifactTypes: operationInfo.artifactTypes || [],
          success: operationInfo.result.success
        }
      });
      
      return true;
    } catch (error) {
      logger.warn(`Failed to log sync operation: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Updates ConPort active context with sync events
   *
   * @param {Object} eventInfo - Event information
   * @returns {Promise<boolean>} Success indicator
   */
  async function updateActiveContext(eventInfo) {
    try {
      // Get current active context
      const activeContext = await conPortClient.get_active_context({
        workspace_id: workspaceId
      });
      
      // Prepare sync events array
      let syncEvents = [];
      if (activeContext.sync_events && Array.isArray(activeContext.sync_events)) {
        syncEvents = activeContext.sync_events;
      }
      
      // Add new event
      syncEvents.unshift({
        ...eventInfo,
        timestamp: new Date().toISOString()
      });
      
      // Keep only recent events (max 10)
      const recentEvents = syncEvents.slice(0, 10);
      
      // Update active context
      await conPortClient.update_active_context({
        workspace_id: workspaceId,
        patch_content: {
          sync_events: recentEvents,
          sync_status: {
            lastEvent: eventInfo.event,
            timestamp: new Date().toISOString(),
            activeAgents: Object.keys(registeredAgents).length
          }
        }
      });
      
      return true;
    } catch (error) {
      logger.warn(`Failed to update active context: ${error.message}`);
      return false;
    }
  }
  
  return {
    initialize,
    registerAgent,
    getAgents,
    updateAgent,
    pushKnowledge,
    pullKnowledge,
    compareKnowledge,
    createSyncSession,
    getSyncSessions,
    getSyncStatus,
    resolveConflict
  };
}

module.exports = { createMultiAgentSyncSystem };