/**
 * Cognitive Continuity Framework (CCF) - Core Layer
 * 
 * This layer provides the core functionality of the Cognitive Continuity Framework,
 * ensuring knowledge continuity across sessions, agents, and time periods.
 */

/**
 * Manages context states across sessions and agents
 */
class ContextStateManager {
  /**
   * Creates a new context state manager
   * @param {Object} options Configuration options
   * @param {Object} options.storage Storage provider (default uses in-memory storage)
   * @param {Object} [options.logger=console] Logger instance
   */
  constructor(options = {}) {
    this.storage = options.storage || new InMemoryStorage();
    this.logger = options.logger || console;
  }
  
  /**
   * Saves a context state
   * @param {Object} contextState Context state to save
   * @returns {Promise<Object>} Saved context state with ID
   */
  async saveContextState(contextState) {
    try {
      // Ensure the context state has an ID and timestamp
      const stateToSave = {
        ...contextState,
        id: contextState.id || `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: contextState.timestamp || new Date().toISOString()
      };
      
      const savedState = await this.storage.saveContextState(stateToSave);
      this.logger.info(`Saved context state with ID: ${savedState.id}`);
      
      return savedState;
    } catch (error) {
      this.logger.error(`Error saving context state: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Loads a context state by ID
   * @param {string} contextId ID of the context to load
   * @returns {Promise<Object>} Context state
   */
  async loadContextState(contextId) {
    try {
      const contextState = await this.storage.getContextState(contextId);
      
      if (!contextState) {
        throw new Error(`Context state not found with ID: ${contextId}`);
      }
      
      this.logger.info(`Loaded context state with ID: ${contextId}`);
      return contextState;
    } catch (error) {
      this.logger.error(`Error loading context state: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Finds context states matching the given criteria
   * @param {Object} criteria Search criteria
   * @returns {Promise<Array<Object>>} Matching context states
   */
  async findContextStates(criteria) {
    try {
      const states = await this.storage.findContextStates(criteria);
      this.logger.info(`Found ${states.length} context states matching criteria`);
      return states;
    } catch (error) {
      this.logger.error(`Error finding context states: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Updates an existing context state
   * @param {string} contextId ID of the context to update
   * @param {Object} updates Updates to apply
   * @returns {Promise<Object>} Updated context state
   */
  async updateContextState(contextId, updates) {
    try {
      // Get the current state
      const currentState = await this.loadContextState(contextId);
      
      // Apply updates
      const updatedState = {
        ...currentState,
        ...updates,
        timestamp: new Date().toISOString()
      };
      
      // Save the updated state
      const savedState = await this.storage.updateContextState(contextId, updatedState);
      this.logger.info(`Updated context state with ID: ${contextId}`);
      
      return savedState;
    } catch (error) {
      this.logger.error(`Error updating context state: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Deletes a context state
   * @param {string} contextId ID of the context to delete
   * @returns {Promise<boolean>} Whether deletion was successful
   */
  async deleteContextState(contextId) {
    try {
      const success = await this.storage.deleteContextState(contextId);
      
      if (success) {
        this.logger.info(`Deleted context state with ID: ${contextId}`);
      } else {
        this.logger.warn(`Failed to delete context state with ID: ${contextId}`);
      }
      
      return success;
    } catch (error) {
      this.logger.error(`Error deleting context state: ${error.message}`);
      throw error;
    }
  }
}

/**
 * Handles knowledge continuity operations
 */
class ContinuityOperationHandler {
  /**
   * Creates a new continuity operation handler
   * @param {Object} options Configuration options
   * @param {ContextStateManager} options.contextStateManager Context state manager
   * @param {SessionTracker} options.sessionTracker Session tracker
   * @param {KnowledgeTransitionTracker} options.transitionTracker Knowledge transition tracker
   * @param {Object} [options.logger=console] Logger instance
   */
  constructor(options) {
    this.contextStateManager = options.contextStateManager;
    this.sessionTracker = options.sessionTracker;
    this.transitionTracker = options.transitionTracker;
    this.logger = options.logger || console;
    
    // Initialize merge strategies
    this.mergeStrategies = {
      'latest-wins': this._latestWinsMergeStrategy.bind(this),
      'field-preference': this._fieldPreferenceMergeStrategy.bind(this),
      'recursive': this._recursiveMergeStrategy.bind(this),
      'concatenate-arrays': this._concatenateArraysMergeStrategy.bind(this)
    };
  }
  
  /**
   * Executes a continuity operation
   * @param {Object} request Operation request
   * @returns {Promise<Object>} Operation result
   */
  async executeOperation(request) {
    try {
      switch (request.operation) {
        case 'save':
          return await this._handleSave(request);
        case 'load':
          return await this._handleLoad(request);
        case 'transfer':
          return await this._handleTransfer(request);
        case 'merge':
          return await this._handleMerge(request);
        case 'snapshot':
          return await this._handleSnapshot(request);
        case 'restore':
          return await this._handleRestore(request);
        case 'diff':
          return await this._handleDiff(request);
        default:
          throw new Error(`Unsupported operation: ${request.operation}`);
      }
    } catch (error) {
      this.logger.error(`Error executing operation ${request.operation}: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Handles save operation
   * @private
   * @param {Object} request Save operation request
   * @returns {Promise<Object>} Save operation result
   */
  async _handleSave(request) {
    const { contextState, sessionId } = request;
    
    // Save the context state
    const savedState = await this.contextStateManager.saveContextState(contextState);
    
    // Log the session information if provided
    if (sessionId) {
      await this.sessionTracker.updateSessionContext(sessionId, savedState.id);
    }
    
    return {
      success: true,
      operation: 'save',
      contextId: savedState.id,
      timestamp: savedState.timestamp
    };
  }
  
  /**
   * Handles load operation
   * @private
   * @param {Object} request Load operation request
   * @returns {Promise<Object>} Load operation result
   */
  async _handleLoad(request) {
    const { contextId, criteria, sessionId } = request;
    
    let contextState;
    
    if (contextId) {
      // Load by ID
      contextState = await this.contextStateManager.loadContextState(contextId);
    } else if (criteria) {
      // Find by criteria
      const states = await this.contextStateManager.findContextStates(criteria);
      
      if (states.length === 0) {
        throw new Error('No context states found matching criteria');
      }
      
      // Use the most recent one by default
      contextState = states.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      })[0];
    } else {
      throw new Error('Either contextId or criteria must be provided');
    }
    
    // Log the session information if provided
    if (sessionId) {
      await this.sessionTracker.updateSessionContext(sessionId, contextState.id);
    }
    
    return {
      success: true,
      operation: 'load',
      contextState,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Handles transfer operation
   * @private
   * @param {Object} request Transfer operation request
   * @returns {Promise<Object>} Transfer operation result
   */
  async _handleTransfer(request) {
    const { sourceAgentId, targetAgentId, contextId, contextFilter } = request;
    
    // Get the context state to transfer
    let contextState;
    
    if (contextId) {
      contextState = await this.contextStateManager.loadContextState(contextId);
    } else if (contextFilter) {
      // Find context states matching the filter and belonging to the source agent
      const states = await this.contextStateManager.findContextStates({
        ...contextFilter,
        'agentInfo.id': sourceAgentId
      });
      
      if (states.length === 0) {
        throw new Error('No matching context states found for source agent');
      }
      
      // Use the most recent one by default
      contextState = states.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      })[0];
    } else {
      throw new Error('Either contextId or contextFilter must be provided');
    }
    
    // Create a new context state for the target agent
    const transferredState = {
      ...contextState,
      id: `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      agentInfo: {
        ...contextState.agentInfo,
        id: targetAgentId
      },
      metadata: {
        ...contextState.metadata,
        transferredFrom: sourceAgentId,
        originalContextId: contextState.id
      }
    };
    
    // Save the transferred context state
    const savedState = await this.contextStateManager.saveContextState(transferredState);
    
    // Record the knowledge transition
    const transition = {
      id: `transition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'agent_transfer',
      timestamp: new Date().toISOString(),
      source: {
        agentId: sourceAgentId,
        contextId: contextState.id
      },
      target: {
        agentId: targetAgentId,
        contextId: savedState.id
      },
      details: {
        transferMethod: 'explicit',
        transferredAt: new Date().toISOString()
      }
    };
    
    await this.transitionTracker.recordTransition(transition);
    
    return {
      success: true,
      operation: 'transfer',
      sourceContextId: contextState.id,
      targetContextId: savedState.id,
      sourceAgentId,
      targetAgentId,
      timestamp: savedState.timestamp,
      transitionId: transition.id
    };
  }
  
  /**
   * Handles merge operation
   * @private
   * @param {Object} request Merge operation request
   * @returns {Promise<Object>} Merge operation result
   */
  async _handleMerge(request) {
    const { contextIds, strategy = 'latest-wins', options = {} } = request;
    
    // Load all context states
    const contextStates = await Promise.all(
      contextIds.map(id => this.contextStateManager.loadContextState(id))
    );
    
    // Get the merge strategy
    const mergeStrategyFn = this.mergeStrategies[strategy] || this.mergeStrategies['latest-wins'];
    
    // Merge the context states
    const mergedContent = mergeStrategyFn(contextStates, options);
    
    // Create a new merged context state
    const mergedState = {
      id: `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      content: mergedContent,
      metadata: {
        mergedFrom: contextIds,
        mergeStrategy: strategy,
        mergeOptions: options
      }
    };
    
    // If all context states have the same agentInfo and sessionInfo, preserve them
    if (contextStates.every(s => s.agentInfo?.id === contextStates[0].agentInfo?.id)) {
      mergedState.agentInfo = contextStates[0].agentInfo;
    }
    
    if (contextStates.every(s => s.sessionInfo?.id === contextStates[0].sessionInfo?.id)) {
      mergedState.sessionInfo = contextStates[0].sessionInfo;
    }
    
    // Save the merged context state
    const savedState = await this.contextStateManager.saveContextState(mergedState);
    
    // Record knowledge transitions for the merge
    const transitions = await Promise.all(contextStates.map(sourceState => 
      this.transitionTracker.recordTransition({
        id: `transition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'context_merge',
        timestamp: new Date().toISOString(),
        source: {
          contextId: sourceState.id
        },
        target: {
          contextId: savedState.id
        },
        details: {
          mergeStrategy: strategy,
          mergeOptions: options
        }
      })
    ));
    
    return {
      success: true,
      operation: 'merge',
      sourceContextIds: contextIds,
      resultContextId: savedState.id,
      timestamp: savedState.timestamp,
      transitionIds: transitions.map(t => t.id)
    };
  }
  
  /**
   * Handles snapshot operation
   * @private
   * @param {Object} request Snapshot operation request
   * @returns {Promise<Object>} Snapshot operation result
   */
  async _handleSnapshot(request) {
    const { agentId, label = `Snapshot ${new Date().toLocaleString()}` } = request;
    
    // Find all active context states for the agent
    const contextStates = await this.contextStateManager.findContextStates({
      'agentInfo.id': agentId
    });
    
    if (contextStates.length === 0) {
      throw new Error(`No context states found for agent: ${agentId}`);
    }
    
    // Create a snapshot object
    const snapshot = {
      id: `snap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      agentId,
      label,
      contextIds: contextStates.map(state => state.id),
      metadata: {
        contextCount: contextStates.length,
        createdAt: new Date().toISOString()
      }
    };
    
    // Save the snapshot
    await this.storage.saveSnapshot(snapshot);
    
    return {
      success: true,
      operation: 'snapshot',
      snapshotId: snapshot.id,
      agentId,
      label,
      timestamp: snapshot.timestamp,
      contextCount: contextStates.length
    };
  }
  
  /**
   * Handles restore operation
   * @private
   * @param {Object} request Restore operation request
   * @returns {Promise<Object>} Restore operation result
   */
  async _handleRestore(request) {
    const { snapshotId, targetAgentId } = request;
    
    // Load the snapshot
    const snapshot = await this.storage.getSnapshot(snapshotId);
    
    if (!snapshot) {
      throw new Error(`Snapshot not found with ID: ${snapshotId}`);
    }
    
    // Determine the target agent ID
    const agentId = targetAgentId || snapshot.agentId;
    
    // Load all context states in the snapshot
    const contextStates = await Promise.all(
      snapshot.contextIds.map(id => this.contextStateManager.loadContextState(id))
    );
    
    // Create new context states for the target agent
    const restoredStates = await Promise.all(contextStates.map(async state => {
      const restoredState = {
        ...state,
        id: `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        agentInfo: {
          ...state.agentInfo,
          id: agentId
        },
        metadata: {
          ...state.metadata,
          restoredFrom: state.id,
          snapshotId: snapshot.id
        }
      };
      
      return this.contextStateManager.saveContextState(restoredState);
    }));
    
    // Record knowledge transitions for the restoration
    const transitions = await Promise.all(contextStates.map((sourceState, index) => 
      this.transitionTracker.recordTransition({
        id: `transition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'state_change',
        timestamp: new Date().toISOString(),
        source: {
          contextId: sourceState.id
        },
        target: {
          contextId: restoredStates[index].id
        },
        details: {
          operation: 'restore',
          snapshotId: snapshot.id
        }
      })
    ));
    
    return {
      success: true,
      operation: 'restore',
      snapshotId,
      agentId,
      timestamp: new Date().toISOString(),
      restoredContextIds: restoredStates.map(state => state.id),
      transitionIds: transitions.map(t => t.id)
    };
  }
  
  /**
   * Handles diff operation
   * @private
   * @param {Object} request Diff operation request
   * @returns {Promise<Object>} Diff operation result
   */
  async _handleDiff(request) {
    const { baseContextId, compareContextId } = request;
    
    // Load both context states
    const baseState = await this.contextStateManager.loadContextState(baseContextId);
    const compareState = await this.contextStateManager.loadContextState(compareContextId);
    
    // Generate a diff of the content
    const contentDiff = this._generateDiff(baseState.content, compareState.content);
    
    return {
      success: true,
      operation: 'diff',
      baseContextId,
      compareContextId,
      timestamp: new Date().toISOString(),
      diff: contentDiff
    };
  }
  
  /**
   * Latest-wins merge strategy
   * @private
   * @param {Array<Object>} contextStates Context states to merge
   * @returns {Object} Merged content
   */
  _latestWinsMergeStrategy(contextStates) {
    // Sort by timestamp (newest first)
    const sortedStates = [...contextStates].sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    // Use content from the newest context state
    return { ...sortedStates[0].content };
  }
  
  /**
   * Field preference merge strategy
   * @private
   * @param {Array<Object>} contextStates Context states to merge
   * @param {Object} options Merge options
   * @returns {Object} Merged content
   */
  _fieldPreferenceMergeStrategy(contextStates, options = {}) {
    const { fieldPreferences = {} } = options;
    const mergedContent = {};
    
    // Sort by timestamp (newest first)
    const sortedStates = [...contextStates].sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    // For each field, use the value from the preferred context state
    const allFields = new Set();
    sortedStates.forEach(state => {
      Object.keys(state.content).forEach(key => allFields.add(key));
    });
    
    allFields.forEach(field => {
      if (fieldPreferences[field]) {
        // Find the context state with the preferred value
        const preferredState = sortedStates.find(state => {
          return state.id === fieldPreferences[field];
        });
        
        if (preferredState && preferredState.content[field] !== undefined) {
          mergedContent[field] = preferredState.content[field];
          return;
        }
      }
      
      // If no preference is found, use the newest value
      for (const state of sortedStates) {
        if (state.content[field] !== undefined) {
          mergedContent[field] = state.content[field];
          break;
        }
      }
    });
    
    return mergedContent;
  }
  
  /**
   * Recursive merge strategy
   * @private
   * @param {Array<Object>} contextStates Context states to merge
   * @returns {Object} Merged content
   */
  _recursiveMergeStrategy(contextStates) {
    // Sort by timestamp (newest first)
    const sortedStates = [...contextStates].sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    // Start with the oldest context state
    const mergedContent = { ...sortedStates[sortedStates.length - 1].content };
    
    // Recursively merge in newer states
    for (let i = sortedStates.length - 2; i >= 0; i--) {
      this._recursiveMergeObjects(mergedContent, sortedStates[i].content);
    }
    
    return mergedContent;
  }
  
  /**
   * Helper method for recursive merge
   * @private
   * @param {Object} target Target object
   * @param {Object} source Source object
   */
  _recursiveMergeObjects(target, source) {
    for (const key in source) {
      if (source[key] === null) {
        target[key] = null;
      } else if (Array.isArray(source[key])) {
        target[key] = source[key];
      } else if (
        typeof source[key] === 'object' && 
        source[key] !== null && 
        target[key] && 
        typeof target[key] === 'object'
      ) {
        this._recursiveMergeObjects(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  
  /**
   * Concatenate arrays merge strategy
   * @private
   * @param {Array<Object>} contextStates Context states to merge
   * @param {Object} options Merge options
   * @returns {Object} Merged content
   */
  _concatenateArraysMergeStrategy(contextStates, options = {}) {
    const { removeDuplicates = true } = options;
    const mergedContent = {};
    
    // Get all field names
    const allFields = new Set();
    contextStates.forEach(state => {
      Object.keys(state.content).forEach(key => allFields.add(key));
    });
    
    // Process each field
    allFields.forEach(field => {
      const values = [];
      let isArray = false;
      
      // Collect values for this field from all context states
      contextStates.forEach(state => {
        if (state.content[field] !== undefined) {
          if (Array.isArray(state.content[field])) {
            values.push(...state.content[field]);
            isArray = true;
          } else {
            values.push(state.content[field]);
          }
        }
      });
      
      // If the field was an array in any context state, treat it as an array
      if (isArray) {
        mergedContent[field] = removeDuplicates ? [...new Set(values)] : values;
      } else {
        // For non-array fields, use the newest value
        mergedContent[field] = values[values.length - 1];
      }
    });
    
    return mergedContent;
  }
  
  /**
   * Generates a diff between two objects
   * @private
   * @param {Object} base Base object
   * @param {Object} compare Compare object
   * @returns {Object} Diff result
   */
  _generateDiff(base, compare) {
    const diff = {
      added: {},
      removed: {},
      changed: {}
    };
    
    // Find added and changed fields
    Object.keys(compare).forEach(key => {
      if (base[key] === undefined) {
        diff.added[key] = compare[key];
      } else if (JSON.stringify(base[key]) !== JSON.stringify(compare[key])) {
        diff.changed[key] = {
          from: base[key],
          to: compare[key]
        };
      }
    });
    
    // Find removed fields
    Object.keys(base).forEach(key => {
      if (compare[key] === undefined) {
        diff.removed[key] = base[key];
      }
    });
    
    return diff;
  }
}

/**
 * Tracks sessions for continuity management
 */
class SessionTracker {
  /**
   * Creates a new session tracker
   * @param {Object} options Configuration options
   * @param {Object} options.storage Storage provider
   * @param {Object} [options.logger=console] Logger instance
   */
  constructor(options = {}) {
    this.storage = options.storage || new InMemoryStorage();
    this.logger = options.logger || console;
  }
  
  /**
   * Starts a new session
   * @param {Object} sessionInfo Session information
   * @returns {Promise<Object>} Created session
   */
  async startSession(sessionInfo) {
    try {
      const session = {
        id: sessionInfo.id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        startTime: new Date().toISOString(),
        agentId: sessionInfo.agentId,
        metadata: sessionInfo.metadata || {}
      };
      
      const savedSession = await this.storage.saveSession(session);
      this.logger.info(`Started new session with ID: ${savedSession.id}`);
      
      return savedSession;
    } catch (error) {
      this.logger.error(`Error starting session: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Updates a session with context information
   * @param {string} sessionId Session ID
   * @param {string} contextId Context ID
   * @returns {Promise<Object>} Updated session
   */
  async updateSessionContext(sessionId, contextId) {
    try {
      // Get the current session
      const session = await this.storage.getSession(sessionId);
      
      if (!session) {
        throw new Error(`Session not found with ID: ${sessionId}`);
      }
      
      // Update the context ID
      session.contextIds = session.contextIds || [];
      session.contextIds.push(contextId);
      session.lastUpdated = new Date().toISOString();
      
      // Save the updated session
      const updatedSession = await this.storage.updateSession(sessionId, session);
      this.logger.info(`Updated session ${sessionId} with context ${contextId}`);
      
      return updatedSession;
    } catch (error) {
      this.logger.error(`Error updating session context: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Ends a session
   * @param {string} sessionId Session ID
   * @returns {Promise<Object>} Ended session
   */
  async endSession(sessionId) {
    try {
      // Get the current session
      const session = await this.storage.getSession(sessionId);
      
      if (!session) {
        throw new Error(`Session not found with ID: ${sessionId}`);
      }
      
      // Update the end time
      session.endTime = new Date().toISOString();
      session.duration = new Date(session.endTime) - new Date(session.startTime);
      session.status = 'completed';
      
      // Save the updated session
      const updatedSession = await this.storage.updateSession(sessionId, session);
      this.logger.info(`Ended session with ID: ${sessionId}`);
      
      return updatedSession;
    } catch (error) {
      this.logger.error(`Error ending session: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Gets a session by ID
   * @param {string} sessionId Session ID
   * @returns {Promise<Object>} Session
   */
  async getSession(sessionId) {
    try {
      const session = await this.storage.getSession(sessionId);
      
      if (!session) {
        throw new Error(`Session not found with ID: ${sessionId}`);
      }
      
      return session;
    } catch (error) {
      this.logger.error(`Error getting session: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Finds sessions matching criteria
   * @param {Object} criteria Search criteria
   * @returns {Promise<Array<Object>>} Matching sessions
   */
  async findSessions(criteria) {
    try {
      const sessions = await this.storage.findSessions(criteria);
      this.logger.info(`Found ${sessions.length} sessions matching criteria`);
      return sessions;
    } catch (error) {
      this.logger.error(`Error finding sessions: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Gets the latest context ID for a session
   * @param {string} sessionId Session ID
   * @returns {Promise<string>} Latest context ID or null if none found
   */
  async getLatestContextId(sessionId) {
    try {
      const session = await this.getSession(sessionId);
      
      if (!session.contextIds || session.contextIds.length === 0) {
        return null;
      }
      
      return session.contextIds[session.contextIds.length - 1];
    } catch (error) {
      this.logger.error(`Error getting latest context ID: ${error.message}`);
      throw error;
    }
  }
}

/**
 * Tracks knowledge transitions
 */
class KnowledgeTransitionTracker {
  /**
   * Creates a new knowledge transition tracker
   * @param {Object} options Configuration options
   * @param {Object} options.storage Storage provider
   * @param {Object} [options.logger=console] Logger instance
   */
  constructor(options = {}) {
    this.storage = options.storage || new InMemoryStorage();
    this.logger = options.logger || console;
  }
  
  /**
   * Records a knowledge transition
   * @param {Object} transition Knowledge transition to record
   * @returns {Promise<Object>} Recorded transition
   */
  async recordTransition(transition) {
    try {
      // Generate an ID if not provided
      const transitionToSave = {
        ...transition,
        id: transition.id || `transition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: transition.timestamp || new Date().toISOString()
      };
      
      const savedTransition = await this.storage.saveTransition(transitionToSave);
      this.logger.info(`Recorded ${transition.type} transition with ID: ${savedTransition.id}`);
      
      return savedTransition;
    } catch (error) {
      this.logger.error(`Error recording transition: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Gets a knowledge transition by ID
   * @param {string} transitionId Transition ID
   * @returns {Promise<Object>} Knowledge transition
   */
  async getTransition(transitionId) {
    try {
      const transition = await this.storage.getTransition(transitionId);
      
      if (!transition) {
        throw new Error(`Transition not found with ID: ${transitionId}`);
      }
      
      return transition;
    } catch (error) {
      this.logger.error(`Error getting transition: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Finds knowledge transitions matching criteria
   * @param {Object} criteria Search criteria
   * @returns {Promise<Array<Object>>} Matching transitions
   */
  async findTransitions(criteria) {
    try {
      const transitions = await this.storage.findTransitions(criteria);
      this.logger.info(`Found ${transitions.length} transitions matching criteria`);
      return transitions;
    } catch (error) {
      this.logger.error(`Error finding transitions: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Gets the transition history for a context
   * @param {string} contextId Context ID
   * @returns {Promise<Array<Object>>} Transition history
   */
  async getContextHistory(contextId) {
    try {
      // Find transitions where this context is the source or target
      const transitions = await this.storage.findTransitions({
        $or: [
          { 'source.contextId': contextId },
          { 'target.contextId': contextId }
        ]
      });
      
      // Sort by timestamp
      transitions.sort((a, b) => {
        return new Date(a.timestamp) - new Date(b.timestamp);
      });
      
      return transitions;
    } catch (error) {
      this.logger.error(`Error getting context history: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Gets the transition history for an agent
   * @param {string} agentId Agent ID
   * @returns {Promise<Array<Object>>} Transition history
   */
  async getAgentHistory(agentId) {
    try {
      // Find transitions where this agent is the source or target
      const transitions = await this.storage.findTransitions({
        $or: [
          { 'source.agentId': agentId },
          { 'target.agentId': agentId }
        ]
      });
      
      // Sort by timestamp
      transitions.sort((a, b) => {
        return new Date(a.timestamp) - new Date(b.timestamp);
      });
      
      return transitions;
    } catch (error) {
      this.logger.error(`Error getting agent history: ${error.message}`);
      throw error;
    }
  }
}

/**
 * In-memory storage for CCF
 * In a production environment, this would be replaced with a persistent storage solution
 */
class InMemoryStorage {
  constructor() {
    this.contextStates = new Map();
    this.sessions = new Map();
    this.transitions = new Map();
    this.snapshots = new Map();
  }
  
  async saveContextState(contextState) {
    this.contextStates.set(contextState.id, { ...contextState });
    return { ...contextState };
  }
  
  async getContextState(contextId) {
    const state = this.contextStates.get(contextId);
    return state ? { ...state } : null;
  }
  
  async findContextStates(criteria) {
    return [...this.contextStates.values()]
      .filter(state => this._matchesCriteria(state, criteria))
      .map(state => ({ ...state }));
  }
  
  async updateContextState(contextId, updatedState) {
    this.contextStates.set(contextId, { ...updatedState });
    return { ...updatedState };
  }
  
  async deleteContextState(contextId) {
    return this.contextStates.delete(contextId);
  }
  
  async saveSession(session) {
    this.sessions.set(session.id, { ...session });
    return { ...session };
  }
  
  async getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    return session ? { ...session } : null;
  }
  
  async findSessions(criteria) {
    return [...this.sessions.values()]
      .filter(session => this._matchesCriteria(session, criteria))
      .map(session => ({ ...session }));
  }
  
  async updateSession(sessionId, updatedSession) {
    this.sessions.set(sessionId, { ...updatedSession });
    return { ...updatedSession };
  }
  
  async saveTransition(transition) {
    this.transitions.set(transition.id, { ...transition });
    return { ...transition };
  }
  
  async getTransition(transitionId) {
    const transition = this.transitions.get(transitionId);
    return transition ? { ...transition } : null;
  }
  
  async findTransitions(criteria) {
    return [...this.transitions.values()]
      .filter(transition => this._matchesCriteria(transition, criteria))
      .map(transition => ({ ...transition }));
  }
  
  async saveSnapshot(snapshot) {
    this.snapshots.set(snapshot.id, { ...snapshot });
    return { ...snapshot };
  }
  
  async getSnapshot(snapshotId) {
    const snapshot = this.snapshots.get(snapshotId);
    return snapshot ? { ...snapshot } : null;
  }
  
  async findSnapshots(criteria) {
    return [...this.snapshots.values()]
      .filter(snapshot => this._matchesCriteria(snapshot, criteria))
      .map(snapshot => ({ ...snapshot }));
  }
  
  _matchesCriteria(obj, criteria) {
    if (!criteria || Object.keys(criteria).length === 0) {
      return true;
    }
    
    // Simple criteria matching
    for (const key in criteria) {
      if (key === '$or' && Array.isArray(criteria[key])) {
        // Handle $or operator
        const orCriteria = criteria[key];
        if (!orCriteria.some(subCriteria => this._matchesCriteria(obj, subCriteria))) {
          return false;
        }
      } else {
        // Handle nested properties using dot notation (e.g. 'agentInfo.id')
        const value = this._getNestedProperty(obj, key);
        if (value !== criteria[key]) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  _getNestedProperty(obj, path) {
    const parts = path.split('.');
    let value = obj;
    
    for (const part of parts) {
      if (value === null || value === undefined || typeof value !== 'object') {
        return undefined;
      }
      value = value[part];
    }
    
    return value;
  }
}

/**
 * Main coordinator for the Cognitive Continuity Framework
 */
class ContinuityCoordinator {
  /**
   * Creates a new continuity coordinator
   * @param {Object} options Configuration options
   * @param {Object} [options.storage] Storage provider (default uses in-memory storage)
   * @param {Object} [options.logger=console] Logger instance
   */
  constructor(options = {}) {
    const storage = options.storage || new InMemoryStorage();
    this.logger = options.logger || console;
    
    // Initialize sub-components
    this.contextStateManager = new ContextStateManager({ 
      storage, 
      logger: this.logger 
    });
    
    this.sessionTracker = new SessionTracker({ 
      storage, 
      logger: this.logger 
    });
    
    this.transitionTracker = new KnowledgeTransitionTracker({ 
      storage, 
      logger: this.logger 
    });
    
    this.operationHandler = new ContinuityOperationHandler({
      contextStateManager: this.contextStateManager,
      sessionTracker: this.sessionTracker,
      transitionTracker: this.transitionTracker,
      logger: this.logger
    });
  }
  
  /**
   * Executes a continuity operation
   * @param {Object} request Operation request
   * @returns {Promise<Object>} Operation result
   */
  async execute(request) {
    return this.operationHandler.executeOperation(request);
  }
  
  /**
   * Starts a new session
   * @param {Object} sessionInfo Session information
   * @returns {Promise<Object>} Created session
   */
  async startSession(sessionInfo) {
    return this.sessionTracker.startSession(sessionInfo);
  }
  
  /**
   * Ends a session
   * @param {string} sessionId Session ID
   * @returns {Promise<Object>} Ended session
   */
  async endSession(sessionId) {
    return this.sessionTracker.endSession(sessionId);
  }
  
  /**
   * Gets the context transition history for a context
   * @param {string} contextId Context ID
   * @returns {Promise<Array<Object>>} Transition history
   */
  async getContextHistory(contextId) {
    return this.transitionTracker.getContextHistory(contextId);
  }
  
  /**
   * Gets the context transition history for an agent
   * @param {string} agentId Agent ID
   * @returns {Promise<Array<Object>>} Transition history
   */
  async getAgentHistory(agentId) {
    return this.transitionTracker.getAgentHistory(agentId);
  }
  
  /**
   * Gets a specific context state
   * @param {string} contextId Context ID
   * @returns {Promise<Object>} Context state
   */
  async getContextState(contextId) {
    return this.contextStateManager.loadContextState(contextId);
  }
  
  /**
   * Finds context states matching criteria
   * @param {Object} criteria Search criteria
   * @returns {Promise<Array<Object>>} Matching context states
   */
  async findContextStates(criteria) {
    return this.contextStateManager.findContextStates(criteria);
  }
}

module.exports = {
  ContextStateManager,
  ContinuityOperationHandler,
  SessionTracker,
  KnowledgeTransitionTracker,
  ContinuityCoordinator,
  InMemoryStorage
};