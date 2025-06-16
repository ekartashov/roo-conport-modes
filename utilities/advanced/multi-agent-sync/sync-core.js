/**
 * Multi-Agent Knowledge Synchronization - Core Layer
 * 
 * This module provides the core functionality for synchronizing knowledge between
 * multiple agents, handling conflicts, and managing agent registrations.
 * The implementation is independent of ConPort integration.
 */

/**
 * Creates a new agent registry
 * 
 * @returns {Object} Agent registry functions
 */
function createAgentRegistry() {
  // Private storage for registered agents
  const agents = new Map();
  
  /**
   * Registers a new agent in the registry
   * 
   * @param {Object} agentInfo - Agent information
   * @param {string} agentInfo.agentId - Unique identifier for the agent
   * @param {string} agentInfo.agentType - Type of agent (e.g., 'roo', 'claude', 'custom')
   * @param {string} agentInfo.displayName - Human-readable name for the agent
   * @param {Object} [agentInfo.capabilities={}] - Agent capabilities
   * @param {Object} [agentInfo.syncPreferences={}] - Synchronization preferences
   * @param {Object} [agentInfo.metadata={}] - Additional metadata about the agent
   * @returns {Object} The registered agent information
   * @throws {Error} If agent already exists or registration fails
   */
  function registerAgent(agentInfo) {
    const { agentId } = agentInfo;
    
    // Check if agent already exists
    if (agents.has(agentId)) {
      throw new Error(`Agent with ID '${agentId}' is already registered`);
    }
    
    // Add registration timestamp
    const registeredAgent = {
      ...agentInfo,
      registeredAt: new Date().toISOString(),
      lastSync: null,
      syncHistory: []
    };
    
    // Store agent in registry
    agents.set(agentId, registeredAgent);
    
    return { ...registeredAgent };
  }
  
  /**
   * Updates an existing agent in the registry
   * 
   * @param {string} agentId - ID of the agent to update
   * @param {Object} updates - Fields to update
   * @returns {Object} The updated agent information
   * @throws {Error} If agent doesn't exist or update fails
   */
  function updateAgent(agentId, updates) {
    if (!agents.has(agentId)) {
      throw new Error(`Agent with ID '${agentId}' is not registered`);
    }
    
    // Get existing agent data
    const existingAgent = agents.get(agentId);
    
    // These fields cannot be updated
    const protectedFields = ['agentId', 'registeredAt'];
    for (const field of protectedFields) {
      if (updates[field] !== undefined) {
        throw new Error(`Cannot update protected field: ${field}`);
      }
    }
    
    // Apply updates
    const updatedAgent = {
      ...existingAgent,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Store updated agent
    agents.set(agentId, updatedAgent);
    
    return { ...updatedAgent };
  }
  
  /**
   * Gets an agent by ID
   * 
   * @param {string} agentId - ID of the agent to retrieve
   * @returns {Object} Agent information
   * @throws {Error} If agent doesn't exist
   */
  function getAgent(agentId) {
    if (!agents.has(agentId)) {
      throw new Error(`Agent with ID '${agentId}' is not registered`);
    }
    
    return { ...agents.get(agentId) };
  }
  
  /**
   * Checks if an agent exists
   * 
   * @param {string} agentId - ID of the agent to check
   * @returns {boolean} True if agent exists
   */
  function hasAgent(agentId) {
    return agents.has(agentId);
  }
  
  /**
   * Lists all registered agents
   * 
   * @param {Object} [options={}] - Listing options
   * @param {string} [options.type] - Filter by agent type
   * @param {boolean} [options.includeCapabilities=false] - Include capabilities
   * @param {boolean} [options.includeSyncHistory=false] - Include sync history
   * @returns {Array<Object>} List of agents
   */
  function listAgents(options = {}) {
    const { 
      type, 
      includeCapabilities = false, 
      includeSyncHistory = false 
    } = options;
    
    const result = [];
    
    for (const agent of agents.values()) {
      // Apply type filter if specified
      if (type && agent.agentType !== type) {
        continue;
      }
      
      // Create a copy with selected fields
      const agentCopy = {
        agentId: agent.agentId,
        agentType: agent.agentType,
        displayName: agent.displayName,
        registeredAt: agent.registeredAt,
        lastSync: agent.lastSync,
        metadata: { ...agent.metadata }
      };
      
      // Include optional fields
      if (includeCapabilities) {
        agentCopy.capabilities = { ...agent.capabilities };
      }
      
      if (includeSyncHistory) {
        agentCopy.syncHistory = [...agent.syncHistory];
      }
      
      result.push(agentCopy);
    }
    
    return result;
  }
  
  /**
   * Updates agent's sync history
   * 
   * @param {string} agentId - ID of the agent
   * @param {Object} syncEvent - Sync event information
   * @param {string} syncEvent.type - Type of sync event
   * @param {string} syncEvent.timestamp - ISO timestamp of the event
   * @param {Object} syncEvent.details - Event details
   * @returns {Object} Updated agent information
   * @throws {Error} If agent doesn't exist
   */
  function recordSyncEvent(agentId, syncEvent) {
    if (!agents.has(agentId)) {
      throw new Error(`Agent with ID '${agentId}' is not registered`);
    }
    
    const agent = agents.get(agentId);
    
    // Add event to history
    const updatedHistory = [
      {
        ...syncEvent,
        timestamp: syncEvent.timestamp || new Date().toISOString()
      },
      ...agent.syncHistory
    ];
    
    // Keep only the most recent 50 events
    const trimmedHistory = updatedHistory.slice(0, 50);
    
    // Update agent
    const updatedAgent = {
      ...agent,
      lastSync: syncEvent.timestamp || new Date().toISOString(),
      syncHistory: trimmedHistory
    };
    
    agents.set(agentId, updatedAgent);
    
    return { ...updatedAgent };
  }
  
  /**
   * Removes an agent from the registry
   * 
   * @param {string} agentId - ID of the agent to remove
   * @returns {boolean} True if agent was removed
   */
  function removeAgent(agentId) {
    return agents.delete(agentId);
  }
  
  return {
    registerAgent,
    updateAgent,
    getAgent,
    hasAgent,
    listAgents,
    recordSyncEvent,
    removeAgent
  };
}

/**
 * Creates a new knowledge store
 * 
 * @returns {Object} Knowledge store functions
 */
function createKnowledgeStore() {
  // Private storage for knowledge artifacts
  const artifacts = new Map();
  
  /**
   * Stores a knowledge artifact
   * 
   * @param {string} agentId - ID of the agent
   * @param {Object} artifact - Knowledge artifact
   * @param {string} artifact.id - Unique identifier for the artifact
   * @param {string} artifact.type - Type of artifact
   * @param {Object} artifact.content - Artifact content
   * @param {string} artifact.timestamp - ISO timestamp
   * @returns {Object} The stored artifact
   */
  function storeArtifact(agentId, artifact) {
    const key = `${agentId}:${artifact.type}:${artifact.id}`;
    
    // Add storage metadata
    const storedArtifact = {
      ...artifact,
      agentId,
      storedAt: new Date().toISOString()
    };
    
    artifacts.set(key, storedArtifact);
    
    return { ...storedArtifact };
  }
  
  /**
   * Retrieves an artifact by ID
   * 
   * @param {string} agentId - ID of the agent
   * @param {string} artifactType - Type of artifact
   * @param {string} artifactId - ID of the artifact
   * @returns {Object|null} The artifact or null if not found
   */
  function getArtifact(agentId, artifactType, artifactId) {
    const key = `${agentId}:${artifactType}:${artifactId}`;
    
    if (!artifacts.has(key)) {
      return null;
    }
    
    return { ...artifacts.get(key) };
  }
  
  /**
   * Lists artifacts for an agent
   * 
   * @param {string} agentId - ID of the agent
   * @param {Object} [options={}] - Listing options
   * @param {Array<string>} [options.types] - Filter by artifact types
   * @param {Date} [options.since] - Filter by timestamp
   * @param {Object} [options.filters] - Additional filters
   * @returns {Array<Object>} List of artifacts
   */
  function listArtifacts(agentId, options = {}) {
    const { types, since, filters } = options;
    
    const result = [];
    
    for (const [key, artifact] of artifacts.entries()) {
      // Only include artifacts from the specified agent
      if (!key.startsWith(`${agentId}:`)) {
        continue;
      }
      
      // Apply type filter if specified
      if (types && !types.includes(artifact.type)) {
        continue;
      }
      
      // Apply timestamp filter if specified
      if (since && new Date(artifact.timestamp) <= since) {
        continue;
      }
      
      // Apply additional filters if specified
      if (filters && !matchesFilters(artifact, filters)) {
        continue;
      }
      
      result.push({ ...artifact });
    }
    
    return result;
  }
  
  /**
   * Removes an artifact
   * 
   * @param {string} agentId - ID of the agent
   * @param {string} artifactType - Type of artifact
   * @param {string} artifactId - ID of the artifact
   * @returns {boolean} True if artifact was removed
   */
  function removeArtifact(agentId, artifactType, artifactId) {
    const key = `${agentId}:${artifactType}:${artifactId}`;
    return artifacts.delete(key);
  }
  
  /**
   * Checks if an artifact exists
   * 
   * @param {string} agentId - ID of the agent
   * @param {string} artifactType - Type of artifact
   * @param {string} artifactId - ID of the artifact
   * @returns {boolean} True if artifact exists
   */
  function hasArtifact(agentId, artifactType, artifactId) {
    const key = `${agentId}:${artifactType}:${artifactId}`;
    return artifacts.has(key);
  }
  
  // Helper function for filter matching
  function matchesFilters(artifact, filters) {
    for (const [key, value] of Object.entries(filters)) {
      // Handle nested paths with dot notation
      const parts = key.split('.');
      let current = artifact;
      
      // Navigate to the nested property
      for (let i = 0; i < parts.length; i++) {
        if (current === null || current === undefined) {
          return false;
        }
        current = current[parts[i]];
      }
      
      // Check if the value matches
      if (current !== value) {
        return false;
      }
    }
    
    return true;
  }
  
  return {
    storeArtifact,
    getArtifact,
    listArtifacts,
    removeArtifact,
    hasArtifact
  };
}

/**
 * Creates a conflict detector
 * 
 * @returns {Object} Conflict detector functions
 */
function createConflictDetector() {
  /**
   * Detects conflicts between source and target artifacts
   * 
   * @param {Array<Object>} sourceArtifacts - Artifacts from source agent
   * @param {Array<Object>} targetArtifacts - Artifacts from target agent
   * @param {Object} [options={}] - Detection options
   * @param {string} [options.algorithm='default'] - Conflict detection algorithm
   * @returns {Array<Object>} Detected conflicts
   */
  function detectConflicts(sourceArtifacts, targetArtifacts, options = {}) {
    const { algorithm = 'default' } = options;
    
    const conflicts = [];
    
    // Create a map of target artifacts for quick lookup
    const targetMap = new Map();
    for (const artifact of targetArtifacts) {
      const key = `${artifact.type}:${artifact.id}`;
      targetMap.set(key, artifact);
    }
    
    // Check each source artifact for conflicts
    for (const sourceArtifact of sourceArtifacts) {
      const key = `${sourceArtifact.type}:${sourceArtifact.id}`;
      
      // If the artifact exists in the target, check for conflicts
      if (targetMap.has(key)) {
        const targetArtifact = targetMap.get(key);
        
        // Check for conflict based on algorithm
        const conflict = detectArtifactConflict(
          sourceArtifact, 
          targetArtifact, 
          algorithm
        );
        
        if (conflict) {
          conflicts.push(conflict);
        }
      }
    }
    
    return conflicts;
  }
  
  /**
   * Detects conflict between two artifacts
   * 
   * @param {Object} sourceArtifact - Artifact from source agent
   * @param {Object} targetArtifact - Artifact from target agent
   * @param {string} algorithm - Conflict detection algorithm
   * @returns {Object|null} Conflict information or null if no conflict
   */
  function detectArtifactConflict(sourceArtifact, targetArtifact, algorithm) {
    // If timestamps are equal, no conflict
    if (sourceArtifact.timestamp === targetArtifact.timestamp) {
      return null;
    }
    
    let conflictType = 'timestamp_mismatch';
    let conflictDetails = {};
    
    switch (algorithm) {
      case 'checksum':
        // Compare checksums if available
        if (sourceArtifact.checksum && targetArtifact.checksum) {
          if (sourceArtifact.checksum === targetArtifact.checksum) {
            return null;  // No conflict if checksums match
          }
          conflictType = 'checksum_mismatch';
        }
        break;
        
      case 'semantic':
        // Use semantic comparison if available
        conflictType = 'semantic_difference';
        conflictDetails = calculateSemanticDifference(sourceArtifact, targetArtifact);
        break;
        
      case 'structural':
        // Compare structure and fields
        conflictType = 'structural_difference';
        conflictDetails = calculateStructuralDifference(sourceArtifact, targetArtifact);
        break;
        
      case 'default':
      default:
        // Simple timestamp and content comparison
        const sourceTime = new Date(sourceArtifact.timestamp).getTime();
        const targetTime = new Date(targetArtifact.timestamp).getTime();
        
        // Check if content is different
        const contentDiffers = JSON.stringify(sourceArtifact.content) !== 
                             JSON.stringify(targetArtifact.content);
        
        if (!contentDiffers) {
          return null;  // No conflict if content is the same
        }
        
        conflictDetails = {
          timeDifference: Math.abs(sourceTime - targetTime),
          sourceIsNewer: sourceTime > targetTime
        };
    }
    
    return {
      conflictId: `conflict_${sourceArtifact.id}_${Date.now()}`,
      sourceArtifact,
      targetArtifact,
      type: conflictType,
      details: conflictDetails,
      detectedAt: new Date().toISOString()
    };
  }
  
  /**
   * Calculates semantic difference between artifacts
   * 
   * @param {Object} sourceArtifact - Artifact from source agent
   * @param {Object} targetArtifact - Artifact from target agent
   * @returns {Object} Semantic difference details
   */
  function calculateSemanticDifference(sourceArtifact, targetArtifact) {
    // Simplified implementation
    // In a real implementation, this would use semantic similarity algorithms
    return {
      similarityScore: 0.5,  // Placeholder
      changedConcepts: []    // Placeholder
    };
  }
  
  /**
   * Calculates structural difference between artifacts
   * 
   * @param {Object} sourceArtifact - Artifact from source agent
   * @param {Object} targetArtifact - Artifact from target agent
   * @returns {Object} Structural difference details
   */
  function calculateStructuralDifference(sourceArtifact, targetArtifact) {
    const differences = {
      addedFields: [],
      removedFields: [],
      changedFields: []
    };
    
    // Compare fields in source that don't exist or are different in target
    for (const [key, value] of Object.entries(sourceArtifact.content)) {
      if (!(key in targetArtifact.content)) {
        differences.addedFields.push(key);
      } else if (JSON.stringify(value) !== JSON.stringify(targetArtifact.content[key])) {
        differences.changedFields.push(key);
      }
    }
    
    // Check for fields in target that don't exist in source
    for (const key of Object.keys(targetArtifact.content)) {
      if (!(key in sourceArtifact.content)) {
        differences.removedFields.push(key);
      }
    }
    
    return differences;
  }
  
  return {
    detectConflicts
  };
}

/**
 * Creates a conflict resolver
 * 
 * @returns {Object} Conflict resolver functions
 */
function createConflictResolver() {
  /**
   * Resolves a conflict
   * 
   * @param {Object} conflict - Conflict information
   * @param {string} resolution - Resolution decision ('source', 'target', 'merge', 'custom')
   * @param {Object} [customResolution] - Custom resolution data
   * @returns {Object} Resolved artifact
   * @throws {Error} If resolution is invalid
   */
  function resolveConflict(conflict, resolution, customResolution) {
    const { sourceArtifact, targetArtifact } = conflict;
    
    switch (resolution) {
      case 'source':
        return resolveWithSource(conflict);
        
      case 'target':
        return resolveWithTarget(conflict);
        
      case 'merge':
        return mergeArtifacts(conflict);
        
      case 'custom':
        if (!customResolution) {
          throw new Error('Custom resolution data is required when using "custom" resolution');
        }
        return applyCustomResolution(conflict, customResolution);
        
      default:
        throw new Error(`Unknown resolution type: ${resolution}`);
    }
  }
  
  /**
   * Resolves conflict by selecting source artifact
   * 
   * @param {Object} conflict - Conflict information
   * @returns {Object} Resolved artifact
   */
  function resolveWithSource(conflict) {
    const { sourceArtifact } = conflict;
    
    return {
      ...sourceArtifact,
      conflict: {
        resolved: true,
        resolution: 'source',
        originalConflict: conflict.conflictId,
        resolvedAt: new Date().toISOString()
      }
    };
  }
  
  /**
   * Resolves conflict by selecting target artifact
   * 
   * @param {Object} conflict - Conflict information
   * @returns {Object} Resolved artifact
   */
  function resolveWithTarget(conflict) {
    const { targetArtifact } = conflict;
    
    return {
      ...targetArtifact,
      conflict: {
        resolved: true,
        resolution: 'target',
        originalConflict: conflict.conflictId,
        resolvedAt: new Date().toISOString()
      }
    };
  }
  
  /**
   * Merges two artifacts to resolve conflict
   * 
   * @param {Object} conflict - Conflict information
   * @returns {Object} Merged artifact
   */
  function mergeArtifacts(conflict) {
    const { sourceArtifact, targetArtifact, type } = conflict;
    
    // Create a new artifact with merged content
    const merged = {
      id: sourceArtifact.id,
      type: sourceArtifact.type,
      timestamp: new Date().toISOString(),
      content: {}
    };
    
    // Merge strategy depends on conflict type
    if (type === 'structural_difference') {
      merged.content = mergeStructuralDifferences(
        sourceArtifact.content, 
        targetArtifact.content, 
        conflict.details
      );
    } else {
      // Default merge strategy for other conflict types
      merged.content = {
        ...targetArtifact.content,
        ...sourceArtifact.content
      };
    }
    
    // Add conflict resolution metadata
    merged.conflict = {
      resolved: true,
      resolution: 'merge',
      originalConflict: conflict.conflictId,
      resolvedAt: new Date().toISOString(),
      mergeStrategy: type === 'structural_difference' ? 'structural' : 'default'
    };
    
    return merged;
  }
  
  /**
   * Merges content based on structural differences
   * 
   * @param {Object} sourceContent - Content from source artifact
   * @param {Object} targetContent - Content from target artifact
   * @param {Object} differences - Structural differences
   * @returns {Object} Merged content
   */
  function mergeStructuralDifferences(sourceContent, targetContent, differences) {
    const merged = { ...targetContent };
    
    // Add fields that exist in source but not in target
    for (const field of differences.addedFields) {
      merged[field] = sourceContent[field];
    }
    
    // For changed fields, use the source version
    for (const field of differences.changedFields) {
      merged[field] = sourceContent[field];
    }
    
    return merged;
  }
  
  /**
   * Applies custom resolution logic
   * 
   * @param {Object} conflict - Conflict information
   * @param {Object} customResolution - Custom resolution data
   * @returns {Object} Resolved artifact
   */
  function applyCustomResolution(conflict, customResolution) {
    const { sourceArtifact } = conflict;
    
    // Create a new artifact with custom content
    const resolved = {
      id: sourceArtifact.id,
      type: sourceArtifact.type,
      timestamp: new Date().toISOString(),
      content: customResolution.content || {}
    };
    
    // Add conflict resolution metadata
    resolved.conflict = {
      resolved: true,
      resolution: 'custom',
      originalConflict: conflict.conflictId,
      resolvedAt: new Date().toISOString(),
      customResolutionId: customResolution.id || `custom_${Date.now()}`
    };
    
    return resolved;
  }
  
  return {
    resolveConflict
  };
}

/**
 * Creates a sync session manager
 * 
 * @param {Object} agentRegistry - Agent registry
 * @param {Object} knowledgeStore - Knowledge store
 * @param {Object} conflictDetector - Conflict detector
 * @param {Object} conflictResolver - Conflict resolver
 * @returns {Object} Sync session manager functions
 */
function createSyncSessionManager(
  agentRegistry,
  knowledgeStore,
  conflictDetector,
  conflictResolver
) {
  // Private storage for active sync sessions
  const sessions = new Map();
  
  /**
   * Creates a new sync session
   * 
   * @param {Object} options - Session options
   * @param {string} options.sessionId - Unique identifier for the session
   * @param {Array<string>} options.agentIds - IDs of agents participating in the session
   * @param {string} [options.syncMode='bidirectional'] - Mode of sync
   * @param {Array<string>} [options.artifactTypes] - Types of artifacts to sync
   * @param {Object} [options.syncRules] - Rules governing the synchronization
   * @returns {Object} Session information
   * @throws {Error} If session creation fails
   */
  function createSession(options) {
    const { sessionId, agentIds, syncMode, artifactTypes, syncRules } = options;
    
    // Check if session already exists
    if (sessions.has(sessionId)) {
      throw new Error(`Session with ID '${sessionId}' already exists`);
    }
    
    // Check if all agents exist
    for (const agentId of agentIds) {
      if (!agentRegistry.hasAgent(agentId)) {
        throw new Error(`Agent with ID '${agentId}' is not registered`);
      }
    }
    
    // Create session
    const session = {
      sessionId,
      agentIds: [...agentIds],
      syncMode: syncMode || 'bidirectional',
      artifactTypes: artifactTypes ? [...artifactTypes] : undefined,
      syncRules: syncRules ? { ...syncRules } : {},
      status: 'created',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conflicts: [],
      progress: {},
      results: {}
    };
    
    // Store session
    sessions.set(sessionId, session);
    
    // Record sync event for each agent
    for (const agentId of agentIds) {
      agentRegistry.recordSyncEvent(agentId, {
        type: 'session_created',
        timestamp: session.createdAt,
        details: {
          sessionId,
          syncMode: session.syncMode
        }
      });
    }
    
    return { ...session };
  }
  
  /**
   * Starts a sync session
   * 
   * @param {string} sessionId - ID of the session to start
   * @returns {Object} Updated session information
   * @throws {Error} If session doesn't exist or cannot be started
   */
  function startSession(sessionId) {
    if (!sessions.has(sessionId)) {
      throw new Error(`Session with ID '${sessionId}' does not exist`);
    }
    
    const session = sessions.get(sessionId);
    
    // Check if session can be started
    if (session.status !== 'created') {
      throw new Error(`Session with ID '${sessionId}' cannot be started (status: ${session.status})`);
    }
    
    // Update session status
    const updatedSession = {
      ...session,
      status: 'running',
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    sessions.set(sessionId, updatedSession);
    
    // Record sync event for each agent
    for (const agentId of session.agentIds) {
      agentRegistry.recordSyncEvent(agentId, {
        type: 'session_started',
        timestamp: updatedSession.startedAt,
        details: {
          sessionId
        }
      });
    }
    
    return { ...updatedSession };
  }
  
  /**
   * Gets sync session information
   * 
   * @param {string} sessionId - ID of the session
   * @returns {Object} Session information
   * @throws {Error} If session doesn't exist
   */
  function getSession(sessionId) {
    if (!sessions.has(sessionId)) {
      throw new Error(`Session with ID '${sessionId}' does not exist`);
    }
    
    return { ...sessions.get(sessionId) };
  }
  
  /**
   * Lists all sync sessions
   * 
   * @param {Object} [options={}] - Listing options
   * @param {string} [options.status] - Filter by status
   * @param {string} [options.agentId] - Filter by participating agent
   * @param {boolean} [options.includeDetails=false] - Include full session details
   * @returns {Array<Object>} List of sessions
   */
  function listSessions(options = {}) {
    const { status, agentId, includeDetails = false } = options;
    
    const result = [];
    
    for (const session of sessions.values()) {
      // Apply status filter if specified
      if (status && session.status !== status) {
        continue;
      }
      
      // Apply agent filter if specified
      if (agentId && !session.agentIds.includes(agentId)) {
        continue;
      }
      
      if (includeDetails) {
        result.push({ ...session });
      } else {
        // Include only basic information
        result.push({
          sessionId: session.sessionId,
          status: session.status,
          syncMode: session.syncMode,
          agentIds: [...session.agentIds],
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
          conflictCount: session.conflicts.length
        });
      }
    }
    
    return result;
  }
  
  /**
   * Updates a sync session
   * 
   * @param {string} sessionId - ID of the session to update
   * @param {Object} updates - Fields to update
   * @returns {Object} Updated session information
   * @throws {Error} If session doesn't exist or update fails
   */
  function updateSession(sessionId, updates) {
    if (!sessions.has(sessionId)) {
      throw new Error(`Session with ID '${sessionId}' does not exist`);
    }
    
    const session = sessions.get(sessionId);
    
    // Protected fields that cannot be updated
    const protectedFields = ['sessionId', 'createdAt', 'startedAt', 'completedAt'];
    for (const field of protectedFields) {
      if (updates[field] !== undefined) {
        throw new Error(`Cannot update protected field: ${field}`);
      }
    }
    
    // Apply updates
    const updatedSession = {
      ...session,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    sessions.set(sessionId, updatedSession);
    
    return { ...updatedSession };
  }
  
  /**
   * Completes a sync session
   * 
   * @param {string} sessionId - ID of the session to complete
   * @param {Object} [results={}] - Final sync results
   * @returns {Object} Completed session information
   * @throws {Error} If session doesn't exist or cannot be completed
   */
  function completeSession(sessionId, results = {}) {
    if (!sessions.has(sessionId)) {
      throw new Error(`Session with ID '${sessionId}' does not exist`);
    }
    
    const session = sessions.get(sessionId);
    
    // Check if session can be completed
    if (session.status !== 'running') {
      throw new Error(`Session with ID '${sessionId}' cannot be completed (status: ${session.status})`);
    }
    
    // Update session
    const updatedSession = {
      ...session,
      status: 'completed',
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      results: { ...results }
    };
    
    sessions.set(sessionId, updatedSession);
    
    // Record sync event for each agent
    for (const agentId of session.agentIds) {
      agentRegistry.recordSyncEvent(agentId, {
        type: 'session_completed',
        timestamp: updatedSession.completedAt,
        details: {
          sessionId,
          syncResults: {
            artifactsAdded: results.artifactsAdded || 0,
            artifactsUpdated: results.artifactsUpdated || 0,
            conflictsResolved: results.conflictsResolved || 0,
            conflictsPending: results.conflictsPending || 0
          }
        }
      });
    }
    
    return { ...updatedSession };
  }
  
  /**
   * Cancels a sync session
   * 
   * @param {string} sessionId - ID of the session to cancel
   * @param {string} [reason=''] - Reason for cancellation
   * @returns {Object} Cancelled session information
   * @throws {Error} If session doesn't exist or cannot be cancelled
   */
  function cancelSession(sessionId, reason = '') {
    if (!sessions.has(sessionId)) {
      throw new Error(`Session with ID '${sessionId}' does not exist`);
    }
    
    const session = sessions.get(sessionId);
    
    // Check if session can be cancelled
    if (session.status === 'completed' || session.status === 'cancelled') {
      throw new Error(`Session with ID '${sessionId}' cannot be cancelled (status: ${session.status})`);
    }
    
    // Update session
    const updatedSession = {
      ...session,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cancellationReason: reason
    };
    
    sessions.set(sessionId, updatedSession);
    
    // Record sync event for each agent
    for (const agentId of session.agentIds) {
      agentRegistry.recordSyncEvent(agentId, {
        type: 'session_cancelled',
        timestamp: updatedSession.cancelledAt,
        details: {
          sessionId,
          reason
        }
      });
    }
    
    return { ...updatedSession };
  }
  
  /**
   * Detects conflicts in a sync session
   * 
   * @param {string} sessionId - ID of the session
   * @param {string} sourceAgentId - ID of the source agent
   * @param {string} targetAgentId - ID of the target agent
   * @param {Object} [options={}] - Conflict detection options
   * @returns {Object} Updated session with detected conflicts
   * @throws {Error} If session doesn't exist or agents are invalid
   */
  function detectSessionConflicts(sessionId, sourceAgentId, targetAgentId, options = {}) {
    if (!sessions.has(sessionId)) {
      throw new Error(`Session with ID '${sessionId}' does not exist`);
    }
    
    const session = sessions.get(sessionId);
    
    // Check if agents are part of the session
    if (!session.agentIds.includes(sourceAgentId)) {
      throw new Error(`Agent with ID '${sourceAgentId}' is not part of session '${sessionId}'`);
    }
    
    if (!session.agentIds.includes(targetAgentId)) {
      throw new Error(`Agent with ID '${targetAgentId}' is not part of session '${sessionId}'`);
    }
    
    // Get artifacts for both agents
    const artifactTypes = session.artifactTypes;
    
    const sourceArtifacts = knowledgeStore.listArtifacts(sourceAgentId, {
      types: artifactTypes
    });
    
    const targetArtifacts = knowledgeStore.listArtifacts(targetAgentId, {
      types: artifactTypes
    });
    
    // Detect conflicts
    const conflicts = conflictDetector.detectConflicts(
      sourceArtifacts,
      targetArtifacts,
      options
    );
    
    // Update session with detected conflicts
    const sessionConflicts = conflicts.map(conflict => ({
      ...conflict,
      sessionId,
      sourceAgentId,
      targetAgentId,
      status: 'detected'
    }));
    
    const updatedSession = {
      ...session,
      conflicts: [...session.conflicts, ...sessionConflicts],
      updatedAt: new Date().toISOString()
    };
    
    sessions.set(sessionId, updatedSession);
    
    // Record sync event for the involved agents
    const conflictEvent = {
      type: 'conflicts_detected',
      timestamp: updatedSession.updatedAt,
      details: {
        sessionId,
        count: sessionConflicts.length
      }
    };
    
    agentRegistry.recordSyncEvent(sourceAgentId, conflictEvent);
    agentRegistry.recordSyncEvent(targetAgentId, conflictEvent);
    
    return { 
      session: { ...updatedSession },
      conflicts: sessionConflicts
    };
  }
  
  /**
   * Resolves a conflict in a sync session
   * 
   * @param {string} sessionId - ID of the session
   * @param {string} conflictId - ID of the conflict to resolve
   * @param {string} resolution - Resolution decision
   * @param {Object} [customResolution] - Custom resolution data
   * @returns {Object} Updated session with resolved conflict
   * @throws {Error} If session or conflict doesn't exist
   */
  function resolveSessionConflict(sessionId, conflictId, resolution, customResolution) {
    if (!sessions.has(sessionId)) {
      throw new Error(`Session with ID '${sessionId}' does not exist`);
    }
    
    const session = sessions.get(sessionId);
    
    // Find the conflict
    const conflictIndex = session.conflicts.findIndex(c => c.conflictId === conflictId);
    if (conflictIndex === -1) {
      throw new Error(`Conflict with ID '${conflictId}' does not exist in session '${sessionId}'`);
    }
    
    const conflict = session.conflicts[conflictIndex];
    
    // Check if conflict can be resolved
    if (conflict.status === 'resolved') {
      throw new Error(`Conflict with ID '${conflictId}' is already resolved`);
    }
    
    // Resolve the conflict
    const resolvedArtifact = conflictResolver.resolveConflict(
      conflict,
      resolution,
      customResolution
    );
    
    // Update the conflict status
    const updatedConflict = {
      ...conflict,
      status: 'resolved',
      resolution,
      resolvedAt: new Date().toISOString(),
      resolvedArtifact
    };
    
    // Update session
    const updatedConflicts = [...session.conflicts];
    updatedConflicts[conflictIndex] = updatedConflict;
    
    const updatedSession = {
      ...session,
      conflicts: updatedConflicts,
      updatedAt: new Date().toISOString()
    };
    
    sessions.set(sessionId, updatedSession);
    
    // Record sync event for the involved agents
    const resolveEvent = {
      type: 'conflict_resolved',
      timestamp: updatedSession.updatedAt,
      details: {
        sessionId,
        conflictId,
        resolution
      }
    };
    
    agentRegistry.recordSyncEvent(conflict.sourceAgentId, resolveEvent);
    agentRegistry.recordSyncEvent(conflict.targetAgentId, resolveEvent);
    
    return { 
      session: { ...updatedSession },
      resolvedConflict: { ...updatedConflict }
    };
  }
  
  return {
    createSession,
    startSession,
    getSession,
    listSessions,
    updateSession,
    completeSession,
    cancelSession,
    detectSessionConflicts,
    resolveSessionConflict
  };
}

/**
 * Creates a knowledge synchronizer
 *
 * @param {Object} agentRegistry - Agent registry
 * @param {Object} knowledgeStore - Knowledge store
 * @param {Object} conflictDetector - Conflict detector
 * @param {Object} syncSessionManager - Sync session manager
 * @returns {Object} Knowledge synchronizer functions
 */
function createKnowledgeSynchronizer(
  agentRegistry,
  knowledgeStore,
  conflictDetector,
  syncSessionManager
) {
  /**
   * Pushes knowledge artifacts from a source agent to a target agent
   * 
   * @param {Object} options - Push options
   * @param {string} options.sourceAgentId - ID of the agent pushing knowledge
   * @param {string} [options.targetAgentId] - ID of the target agent
   * @param {Array<Object>} options.knowledgeArtifacts - Artifacts to push
   * @param {string} [options.syncMode='incremental'] - Sync mode
   * @param {boolean} [options.forceSync=false] - Whether to force sync
   * @returns {Object} Push results
   * @throws {Error} If push fails
   */
  async function pushKnowledge(options) {
    const { 
      sourceAgentId, 
      targetAgentId, 
      knowledgeArtifacts, 
      syncMode = 'incremental',
      forceSync = false
    } = options;
    
    // Check if source agent exists
    if (!agentRegistry.hasAgent(sourceAgentId)) {
      throw new Error(`Source agent with ID '${sourceAgentId}' is not registered`);
    }
    
    // If targetAgentId is specified, check if it exists
    if (targetAgentId && !agentRegistry.hasAgent(targetAgentId)) {
      throw new Error(`Target agent with ID '${targetAgentId}' is not registered`);
    }
    
    // Determine target agents
    const targetAgents = targetAgentId ? 
      [agentRegistry.getAgent(targetAgentId)] :
      agentRegistry.listAgents().filter(a => a.agentId !== sourceAgentId);
    
    if (targetAgents.length === 0) {
      return {
        success: true,
        message: 'No target agents available',
        results: []
      };
    }
    
    // Push to each target agent
    const results = [];
    
    for (const targetAgent of targetAgents) {
      try {
        const result = await pushToAgent(
          sourceAgentId,
          targetAgent.agentId,
          knowledgeArtifacts,
          { syncMode, forceSync }
        );
        
        results.push({
          targetAgentId: targetAgent.agentId,
          success: true,
          ...result
        });
      } catch (error) {
        results.push({
          targetAgentId: targetAgent.agentId,
          success: false,
          error: error.message
        });
      }
    }
    
    return {
      success: results.some(r => r.success),
      results
    };
  }
  
  /**
   * Pushes knowledge to a specific agent
   * 
   * @param {string} sourceAgentId - ID of the source agent
   * @param {string} targetAgentId - ID of the target agent
   * @param {Array<Object>} artifacts - Artifacts to push
   * @param {Object} options - Push options
   * @returns {Object} Push result
   * @throws {Error} If push fails
   */
  async function pushToAgent(sourceAgentId, targetAgentId, artifacts, options) {
    const { syncMode, forceSync } = options;
    
    // Store artifacts in the knowledge store for the source agent
    // This ensures they're properly tracked
    for (const artifact of artifacts) {
      knowledgeStore.storeArtifact(sourceAgentId, artifact);
    }
    
    // Create a sync session for this operation
    const sessionId = `push_${sourceAgentId}_to_${targetAgentId}_${Date.now()}`;
    
    const session = syncSessionManager.createSession({
      sessionId,
      agentIds: [sourceAgentId, targetAgentId],
      syncMode: 'push',
      artifactTypes: Array.from(new Set(artifacts.map(a => a.type)))
    });
    
    // Start the session
    syncSessionManager.startSession(sessionId);
    
    // Check for conflicts if not forcing sync
    let conflicts = [];
    
    if (!forceSync) {
      const conflictResult = syncSessionManager.detectSessionConflicts(
        sessionId,
        sourceAgentId,
        targetAgentId
      );
      
      conflicts = conflictResult.conflicts;
      
      // If conflicts exist and we're not forcing sync, return them
      if (conflicts.length > 0) {
        syncSessionManager.updateSession(sessionId, {
          status: 'conflict_detected'
        });
        
        return {
          sessionId,
          conflicts,
          artifactsTransferred: 0
        };
      }
    }
    
    // No conflicts or forcing sync, transfer the artifacts
    const transferredCount = await transferArtifacts(
      sessionId,
      sourceAgentId,
      targetAgentId,
      artifacts,
      syncMode
    );
    
    // Complete the session
    const completedSession = syncSessionManager.completeSession(sessionId, {
      artifactsAdded: transferredCount,
      artifactsUpdated: 0,
      conflictsDetected: conflicts.length,
      conflictsResolved: forceSync ? conflicts.length : 0,
      conflictsPending: forceSync ? 0 : conflicts.length
    });
    
    return {
      sessionId,
      artifactsTransferred: transferredCount,
      status: completedSession.status
    };
  }
  
  /**
   * Transfers artifacts from source to target agent
   * 
   * @param {string} sessionId - ID of the sync session
   * @param {string} sourceAgentId - ID of the source agent
   * @param {string} targetAgentId - ID of the target agent
   * @param {Array<Object>} artifacts - Artifacts to transfer
   * @param {string} syncMode - Sync mode
   * @returns {number} Number of artifacts transferred
   */
  async function transferArtifacts(sessionId, sourceAgentId, targetAgentId, artifacts, syncMode) {
    let transferredCount = 0;
    
    for (const artifact of artifacts) {
      // Check if artifact already exists for the target
      const existingArtifact = knowledgeStore.getArtifact(
        targetAgentId,
        artifact.type,
        artifact.id
      );
      
      // For incremental sync, skip if target has a newer version
      if (syncMode === 'incremental' && existingArtifact) {
        const sourceTime = new Date(artifact.timestamp).getTime();
        const targetTime = new Date(existingArtifact.timestamp).getTime();
        
        if (targetTime >= sourceTime) {
          continue;  // Skip this artifact
        }
      }
      
      // Store the artifact for the target agent
      knowledgeStore.storeArtifact(targetAgentId, {
        ...artifact,
        syncInfo: {
          syncedFrom: sourceAgentId,
          syncedAt: new Date().toISOString(),
          sessionId
        }
      });
      
      transferredCount++;
    }
    
    return transferredCount;
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
   * @returns {Object} Pull results
   * @throws {Error} If pull fails
   */
  async function pullKnowledge(options) {
    const { 
      targetAgentId, 
      sourceAgentId, 
      artifactTypes, 
      syncMode = 'incremental',
      conflictStrategy,
      filters
    } = options;
    
    // Check if target agent exists
    if (!agentRegistry.hasAgent(targetAgentId)) {
      throw new Error(`Target agent with ID '${targetAgentId}' is not registered`);
    }
    
    // If sourceAgentId is specified, check if it exists
    if (sourceAgentId && !agentRegistry.hasAgent(sourceAgentId)) {
      throw new Error(`Source agent with ID '${sourceAgentId}' is not registered`);
    }
    
    // Determine source agents
    const sourceAgents = sourceAgentId ?
      [agentRegistry.getAgent(sourceAgentId)] :
      agentRegistry.listAgents().filter(a => a.agentId !== targetAgentId);
    
    if (sourceAgents.length === 0) {
      return {
        success: true,
        message: 'No source agents available',
        results: []
      };
    }
    
    // Pull from each source agent
    const results = [];
    
    for (const sourceAgent of sourceAgents) {
      try {
        const result = await pullFromAgent(
          targetAgentId,
          sourceAgent.agentId,
          { 
            artifactTypes, 
            syncMode, 
            conflictStrategy,
            filters
          }
        );
        
        results.push({
          sourceAgentId: sourceAgent.agentId,
          success: true,
          ...result
        });
      } catch (error) {
        results.push({
          sourceAgentId: sourceAgent.agentId,
          success: false,
          error: error.message
        });
      }
    }
    
    return {
      success: results.some(r => r.success),
      results
    };
  }
  
  /**
   * Pulls knowledge from a specific agent
   * 
   * @param {string} targetAgentId - ID of the target agent
   * @param {string} sourceAgentId - ID of the source agent
   * @param {Object} options - Pull options
   * @returns {Object} Pull result
   * @throws {Error} If pull fails
   */
  async function pullFromAgent(targetAgentId, sourceAgentId, options) {
    const { artifactTypes, syncMode, conflictStrategy, filters } = options;
    
    // Create a sync session for this operation
    const sessionId = `pull_${targetAgentId}_from_${sourceAgentId}_${Date.now()}`;
    
    const session = syncSessionManager.createSession({
      sessionId,
      agentIds: [targetAgentId, sourceAgentId],
      syncMode: 'pull',
      artifactTypes
    });
    
    // Start the session
    syncSessionManager.startSession(sessionId);
    
    // Get artifacts from source agent
    const sourceArtifacts = knowledgeStore.listArtifacts(sourceAgentId, {
      types: artifactTypes,
      filters
    });
    
    if (sourceArtifacts.length === 0) {
      // Complete the session with no results
      syncSessionManager.completeSession(sessionId, {
        artifactsAdded: 0,
        artifactsUpdated: 0,
        conflictsDetected: 0,
        conflictsResolved: 0,
        conflictsPending: 0
      });
      
      return {
        sessionId,
        artifactsTransferred: 0,
        status: 'completed'
      };
    }
    
    // Check for conflicts
    const conflictResult = syncSessionManager.detectSessionConflicts(
      sessionId,
      sourceAgentId,
      targetAgentId
    );
    
    const conflicts = conflictResult.conflicts;
    
    // Handle conflicts based on strategy
    if (conflicts.length > 0 && conflictStrategy) {
      // Auto-resolve conflicts based on strategy
      for (const conflict of conflicts) {
        let resolution;
        
        switch (conflictStrategy) {
          case 'latest_wins':
            const sourceTime = new Date(conflict.sourceArtifact.timestamp).getTime();
            const targetTime = new Date(conflict.targetArtifact.timestamp).getTime();
            resolution = sourceTime > targetTime ? 'source' : 'target';
            break;
            
          case 'source_wins':
            resolution = 'source';
            break;
            
          case 'target_wins':
            resolution = 'target';
            break;
            
          case 'merge':
            resolution = 'merge';
            break;
            
          case 'preserve_both':
            // Modify source artifact ID to preserve both
            const sourceArtifact = { ...conflict.sourceArtifact };
            sourceArtifact.id = `${sourceArtifact.id}_${sourceAgentId}_${Date.now()}`;
            // Skip normal resolution as we're handling it specially
            knowledgeStore.storeArtifact(targetAgentId, sourceArtifact);
            continue;
            
          default:
            // Don't resolve automatically
            continue;
        }
        
        // Resolve the conflict
        syncSessionManager.resolveSessionConflict(
          sessionId,
          conflict.conflictId,
          resolution
        );
      }
    }
    
    // Transfer non-conflicting artifacts
    const artifactsToTransfer = sourceArtifacts.filter(artifact => {
      // Skip artifacts involved in unresolved conflicts
      return !conflicts.some(
        c => c.status !== 'resolved' && 
             c.sourceArtifact.id === artifact.id && 
             c.sourceArtifact.type === artifact.type
      );
    });
    
    const transferredCount = await transferArtifacts(
      sessionId,
      sourceAgentId,
      targetAgentId,
      artifactsToTransfer,
      syncMode
    );
    
    // Count resolved conflicts
    const resolvedCount = conflicts.filter(c => c.status === 'resolved').length;
    
    // Complete the session
    const completedSession = syncSessionManager.completeSession(sessionId, {
      artifactsAdded: transferredCount,
      artifactsUpdated: 0,
      conflictsDetected: conflicts.length,
      conflictsResolved: resolvedCount,
      conflictsPending: conflicts.length - resolvedCount
    });
    
    return {
      sessionId,
      artifactsTransferred: transferredCount,
      conflictsDetected: conflicts.length,
      conflictsResolved: resolvedCount,
      status: completedSession.status
    };
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
   * @returns {Object} Comparison results
   * @throws {Error} If comparison fails
   */
  function compareKnowledge(options) {
    const { sourceAgentId, targetAgentId, artifactTypes, diffAlgorithm, filters } = options;
    
    // Check if agents exist
    if (!agentRegistry.hasAgent(sourceAgentId)) {
      throw new Error(`Source agent with ID '${sourceAgentId}' is not registered`);
    }
    
    if (!agentRegistry.hasAgent(targetAgentId)) {
      throw new Error(`Target agent with ID '${targetAgentId}' is not registered`);
    }
    
    // Get artifacts for both agents
    const sourceArtifacts = knowledgeStore.listArtifacts(sourceAgentId, {
      types: artifactTypes,
      filters
    });
    
    const targetArtifacts = knowledgeStore.listArtifacts(targetAgentId, {
      types: artifactTypes,
      filters
    });
    
    // Build maps of artifacts by ID and type for quick lookup
    const sourceMap = new Map();
    for (const artifact of sourceArtifacts) {
      sourceMap.set(`${artifact.type}:${artifact.id}`, artifact);
    }
    
    const targetMap = new Map();
    for (const artifact of targetArtifacts) {
      targetMap.set(`${artifact.type}:${artifact.id}`, artifact);
    }
    
    // Find common, unique to source, and unique to target
    const common = [];
    const uniqueToSource = [];
    const uniqueToTarget = [];
    
    // Check source artifacts
    for (const artifact of sourceArtifacts) {
      const key = `${artifact.type}:${artifact.id}`;
      
      if (targetMap.has(key)) {
        common.push({
          sourceArtifact: artifact,
          targetArtifact: targetMap.get(key)
        });
      } else {
        uniqueToSource.push(artifact);
      }
    }
    
    // Check target artifacts
    for (const artifact of targetArtifacts) {
      const key = `${artifact.type}:${artifact.id}`;
      
      if (!sourceMap.has(key)) {
        uniqueToTarget.push(artifact);
      }
    }
    
    // Detect conflicts in common artifacts
    const conflicts = conflictDetector.detectConflicts(
      sourceArtifacts,
      targetArtifacts,
      { algorithm: diffAlgorithm || 'default' }
    );
    
    // Compute statistics
    const stats = {
      sourceArtifactCount: sourceArtifacts.length,
      targetArtifactCount: targetArtifacts.length,
      commonArtifactCount: common.length,
      uniqueToSourceCount: uniqueToSource.length,
      uniqueToTargetCount: uniqueToTarget.length,
      conflictCount: conflicts.length,
      identicalCount: common.length - conflicts.length,
      byType: {}
    };
    
    // Compute stats by artifact type
    const artifactTypeSet = new Set([
      ...sourceArtifacts.map(a => a.type),
      ...targetArtifacts.map(a => a.type)
    ]);
    
    for (const type of artifactTypeSet) {
      const sourceCount = sourceArtifacts.filter(a => a.type === type).length;
      const targetCount = targetArtifacts.filter(a => a.type === type).length;
      const typeConflicts = conflicts.filter(c => c.sourceArtifact.type === type).length;
      
      stats.byType[type] = {
        sourceCount,
        targetCount,
        conflictCount: typeConflicts
      };
    }
    
    // Record sync event for both agents
    const compareEvent = {
      type: 'knowledge_compared',
      timestamp: new Date().toISOString(),
      details: {
        sourceAgentId,
        targetAgentId,
        stats: {
          commonCount: common.length,
          conflictCount: conflicts.length
        }
      }
    };
    
    agentRegistry.recordSyncEvent(sourceAgentId, compareEvent);
    agentRegistry.recordSyncEvent(targetAgentId, compareEvent);
    
    return {
      sourceAgentId,
      targetAgentId,
      conflicts,
      uniqueToSource,
      uniqueToTarget,
      stats,
      timestamp: new Date().toISOString()
    };
  }
  
  return {
    pushKnowledge,
    pullKnowledge,
    compareKnowledge
  };
}

/**
 * Creates a multi-agent knowledge synchronization system
 * 
 * @returns {Object} Synchronization system functions
 */
function createMultiAgentSync() {
  const agentRegistry = createAgentRegistry();
  const knowledgeStore = createKnowledgeStore();
  const conflictDetector = createConflictDetector();
  const conflictResolver = createConflictResolver();
  
  const syncSessionManager = createSyncSessionManager(
    agentRegistry,
    knowledgeStore,
    conflictDetector,
    conflictResolver
  );
  
  const knowledgeSynchronizer = createKnowledgeSynchronizer(
    agentRegistry,
    knowledgeStore,
    conflictDetector,
    syncSessionManager
  );
  
  return {
    // Agent management
    registerAgent: agentRegistry.registerAgent,
    updateAgent: agentRegistry.updateAgent,
    getAgent: agentRegistry.getAgent,
    listAgents: agentRegistry.listAgents,
    removeAgent: agentRegistry.removeAgent,
    
    // Knowledge store operations
    storeArtifact: knowledgeStore.storeArtifact,
    getArtifact: knowledgeStore.getArtifact,
    listArtifacts: knowledgeStore.listArtifacts,
    
    // Synchronization operations
    pushKnowledge: knowledgeSynchronizer.pushKnowledge,
    pullKnowledge: knowledgeSynchronizer.pullKnowledge,
    compareKnowledge: knowledgeSynchronizer.compareKnowledge,
    
    // Session management
    createSession: syncSessionManager.createSession,
    startSession: syncSessionManager.startSession,
    getSession: syncSessionManager.getSession,
    listSessions: syncSessionManager.listSessions,
    completeSession: syncSessionManager.completeSession,
    cancelSession: syncSessionManager.cancelSession,
    
    // Conflict operations
    detectSessionConflicts: syncSessionManager.detectSessionConflicts,
    resolveSessionConflict: syncSessionManager.resolveSessionConflict
  };
}

module.exports = {
  createMultiAgentSync,
  createAgentRegistry,
  createKnowledgeStore,
  createConflictDetector,
  createConflictResolver,
  createSyncSessionManager,
  createKnowledgeSynchronizer
};