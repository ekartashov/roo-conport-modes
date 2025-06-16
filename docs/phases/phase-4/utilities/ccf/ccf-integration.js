/**
 * Cognitive Continuity Framework (CCF) - Integration Layer
 * 
 * This layer integrates the CCF core functionality with other system components
 * including ConPort, AMO (Autonomous Mapping Orchestrator), KSE (Knowledge Synthesis Engine),
 * KDAP (Knowledge-Driven Autonomous Planning), and AKAF (Adaptive Knowledge Application Framework).
 */

const {
  ContinuityCoordinator,
  ContextStateManager,
  InMemoryStorage
} = require('./ccf-core');

const {
  validateContextState,
  validateContinuityOperation
} = require('./ccf-validation');

/**
 * ConPort Storage Provider for CCF
 * Implements the storage interface required by CCF components
 */
class ConPortStorageProvider {
  /**
   * Creates a new ConPort storage provider
   * @param {Object} options Configuration options
   * @param {Object} options.conportClient ConPort client
   * @param {string} options.workspaceId Workspace ID for ConPort
   * @param {Object} [options.logger=console] Logger instance
   */
  constructor(options) {
    if (!options.conportClient) {
      throw new Error('ConPort client is required');
    }
    
    this.conport = options.conportClient;
    this.workspaceId = options.workspaceId;
    this.logger = options.logger || console;
    
    // Define category names used for storing various CCF data
    this.categories = {
      contextState: 'CCF_ContextState',
      session: 'CCF_Session',
      transition: 'CCF_Transition',
      snapshot: 'CCF_Snapshot'
    };
  }
  
  /**
   * Saves a context state
   * @param {Object} contextState Context state to save
   * @returns {Promise<Object>} Saved context state
   */
  async saveContextState(contextState) {
    try {
      await this.conport.log_custom_data({
        workspace_id: this.workspaceId,
        category: this.categories.contextState,
        key: contextState.id,
        value: contextState
      });
      
      return contextState;
    } catch (error) {
      this.logger.error(`Error saving context state to ConPort: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Gets a context state by ID
   * @param {string} contextId Context state ID
   * @returns {Promise<Object>} Context state or null if not found
   */
  async getContextState(contextId) {
    try {
      const result = await this.conport.get_custom_data({
        workspace_id: this.workspaceId,
        category: this.categories.contextState,
        key: contextId
      });
      
      if (!result || !result.custom_data || result.custom_data.length === 0) {
        return null;
      }
      
      return result.custom_data[0].value;
    } catch (error) {
      this.logger.error(`Error getting context state from ConPort: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Finds context states matching criteria
   * @param {Object} criteria Search criteria
   * @returns {Promise<Array<Object>>} Matching context states
   */
  async findContextStates(criteria) {
    try {
      const result = await this.conport.get_custom_data({
        workspace_id: this.workspaceId,
        category: this.categories.contextState
      });
      
      if (!result || !result.custom_data) {
        return [];
      }
      
      // Extract context states
      const states = result.custom_data.map(item => item.value);
      
      // Filter by criteria if provided
      if (criteria && Object.keys(criteria).length > 0) {
        return this._filterByCriteria(states, criteria);
      }
      
      return states;
    } catch (error) {
      this.logger.error(`Error finding context states in ConPort: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Updates a context state
   * @param {string} contextId Context state ID
   * @param {Object} updatedState Updated context state
   * @returns {Promise<Object>} Updated context state
   */
  async updateContextState(contextId, updatedState) {
    return this.saveContextState(updatedState);
  }
  
  /**
   * Deletes a context state
   * @param {string} contextId Context state ID
   * @returns {Promise<boolean>} Whether deletion was successful
   */
  async deleteContextState(contextId) {
    try {
      await this.conport.delete_custom_data({
        workspace_id: this.workspaceId,
        category: this.categories.contextState,
        key: contextId
      });
      
      return true;
    } catch (error) {
      this.logger.error(`Error deleting context state from ConPort: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Saves a session
   * @param {Object} session Session to save
   * @returns {Promise<Object>} Saved session
   */
  async saveSession(session) {
    try {
      await this.conport.log_custom_data({
        workspace_id: this.workspaceId,
        category: this.categories.session,
        key: session.id,
        value: session
      });
      
      return session;
    } catch (error) {
      this.logger.error(`Error saving session to ConPort: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Gets a session by ID
   * @param {string} sessionId Session ID
   * @returns {Promise<Object>} Session or null if not found
   */
  async getSession(sessionId) {
    try {
      const result = await this.conport.get_custom_data({
        workspace_id: this.workspaceId,
        category: this.categories.session,
        key: sessionId
      });
      
      if (!result || !result.custom_data || result.custom_data.length === 0) {
        return null;
      }
      
      return result.custom_data[0].value;
    } catch (error) {
      this.logger.error(`Error getting session from ConPort: ${error.message}`);
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
      const result = await this.conport.get_custom_data({
        workspace_id: this.workspaceId,
        category: this.categories.session
      });
      
      if (!result || !result.custom_data) {
        return [];
      }
      
      // Extract sessions
      const sessions = result.custom_data.map(item => item.value);
      
      // Filter by criteria if provided
      if (criteria && Object.keys(criteria).length > 0) {
        return this._filterByCriteria(sessions, criteria);
      }
      
      return sessions;
    } catch (error) {
      this.logger.error(`Error finding sessions in ConPort: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Updates a session
   * @param {string} sessionId Session ID
   * @param {Object} updatedSession Updated session
   * @returns {Promise<Object>} Updated session
   */
  async updateSession(sessionId, updatedSession) {
    return this.saveSession(updatedSession);
  }
  
  /**
   * Saves a knowledge transition
   * @param {Object} transition Knowledge transition to save
   * @returns {Promise<Object>} Saved transition
   */
  async saveTransition(transition) {
    try {
      await this.conport.log_custom_data({
        workspace_id: this.workspaceId,
        category: this.categories.transition,
        key: transition.id,
        value: transition
      });
      
      return transition;
    } catch (error) {
      this.logger.error(`Error saving transition to ConPort: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Gets a knowledge transition by ID
   * @param {string} transitionId Transition ID
   * @returns {Promise<Object>} Knowledge transition or null if not found
   */
  async getTransition(transitionId) {
    try {
      const result = await this.conport.get_custom_data({
        workspace_id: this.workspaceId,
        category: this.categories.transition,
        key: transitionId
      });
      
      if (!result || !result.custom_data || result.custom_data.length === 0) {
        return null;
      }
      
      return result.custom_data[0].value;
    } catch (error) {
      this.logger.error(`Error getting transition from ConPort: ${error.message}`);
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
      const result = await this.conport.get_custom_data({
        workspace_id: this.workspaceId,
        category: this.categories.transition
      });
      
      if (!result || !result.custom_data) {
        return [];
      }
      
      // Extract transitions
      const transitions = result.custom_data.map(item => item.value);
      
      // Filter by criteria if provided
      if (criteria && Object.keys(criteria).length > 0) {
        return this._filterByCriteria(transitions, criteria);
      }
      
      return transitions;
    } catch (error) {
      this.logger.error(`Error finding transitions in ConPort: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Saves a snapshot
   * @param {Object} snapshot Snapshot to save
   * @returns {Promise<Object>} Saved snapshot
   */
  async saveSnapshot(snapshot) {
    try {
      await this.conport.log_custom_data({
        workspace_id: this.workspaceId,
        category: this.categories.snapshot,
        key: snapshot.id,
        value: snapshot
      });
      
      return snapshot;
    } catch (error) {
      this.logger.error(`Error saving snapshot to ConPort: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Gets a snapshot by ID
   * @param {string} snapshotId Snapshot ID
   * @returns {Promise<Object>} Snapshot or null if not found
   */
  async getSnapshot(snapshotId) {
    try {
      const result = await this.conport.get_custom_data({
        workspace_id: this.workspaceId,
        category: this.categories.snapshot,
        key: snapshotId
      });
      
      if (!result || !result.custom_data || result.custom_data.length === 0) {
        return null;
      }
      
      return result.custom_data[0].value;
    } catch (error) {
      this.logger.error(`Error getting snapshot from ConPort: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Finds snapshots matching criteria
   * @param {Object} criteria Search criteria
   * @returns {Promise<Array<Object>>} Matching snapshots
   */
  async findSnapshots(criteria) {
    try {
      const result = await this.conport.get_custom_data({
        workspace_id: this.workspaceId,
        category: this.categories.snapshot
      });
      
      if (!result || !result.custom_data) {
        return [];
      }
      
      // Extract snapshots
      const snapshots = result.custom_data.map(item => item.value);
      
      // Filter by criteria if provided
      if (criteria && Object.keys(criteria).length > 0) {
        return this._filterByCriteria(snapshots, criteria);
      }
      
      return snapshots;
    } catch (error) {
      this.logger.error(`Error finding snapshots in ConPort: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Helper method to filter objects by criteria
   * @private
   * @param {Array<Object>} objects Objects to filter
   * @param {Object} criteria Filter criteria
   * @returns {Array<Object>} Filtered objects
   */
  _filterByCriteria(objects, criteria) {
    return objects.filter(object => {
      // For each criteria key-value pair, check if the object matches
      for (const [key, value] of Object.entries(criteria)) {
        // Handle special operator $or
        if (key === '$or' && Array.isArray(value)) {
          const orMatches = value.some(subCriteria => {
            return this._filterByCriteria([object], subCriteria).length > 0;
          });
          
          if (!orMatches) {
            return false;
          }
          
          continue;
        }
        
        // Handle nested paths (e.g., 'agentInfo.id')
        const nestedValue = this._getNestedValue(object, key);
        
        if (nestedValue !== value) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  /**
   * Helper method to get a nested value from an object using a path
   * @private
   * @param {Object} object Source object
   * @param {string} path Nested path (e.g., 'a.b.c')
   * @returns {*} Value at the path or undefined
   */
  _getNestedValue(object, path) {
    return path.split('.').reduce((obj, key) => {
      return obj && obj[key] !== undefined ? obj[key] : undefined;
    }, object);
  }
}

/**
 * Main integration class for CCF
 */
class CCFIntegration {
  /**
   * Creates a new CCF integration instance
   * @param {Object} options Configuration options
   * @param {Object} options.conportClient ConPort client instance
   * @param {string} options.workspaceId Workspace ID for ConPort
   * @param {Object} [options.amoClient] AMO client (optional)
   * @param {Object} [options.kseClient] KSE client (optional)
   * @param {Object} [options.kdapClient] KDAP client (optional)
   * @param {Object} [options.akafClient] AKAF client (optional)
   * @param {Object} [options.logger=console] Logger instance
   */
  constructor(options) {
    if (!options.conportClient) {
      throw new Error('ConPort client is required');
    }
    
    if (!options.workspaceId) {
      throw new Error('Workspace ID is required');
    }
    
    this.conportClient = options.conportClient;
    this.workspaceId = options.workspaceId;
    this.amoClient = options.amoClient;
    this.kseClient = options.kseClient;
    this.kdapClient = options.kdapClient;
    this.akafClient = options.akafClient;
    this.logger = options.logger || console;
    
    // Create storage provider
    this.storage = new ConPortStorageProvider({
      conportClient: this.conportClient,
      workspaceId: this.workspaceId,
      logger: this.logger
    });
    
    // Create core coordinator
    this.coordinator = new ContinuityCoordinator({
      storage: this.storage,
      logger: this.logger
    });
  }
  
  /**
   * Saves a context state
   * @param {Object} params Save parameters
   * @param {Object} params.contextState Context state to save
   * @param {string} [params.sessionId] Session ID to associate with the context
   * @returns {Promise<Object>} Save result
   */
  async saveContext(params) {
    try {
      validateContextState(params.contextState);
      
      const request = {
        operation: 'save',
        contextState: params.contextState,
        sessionId: params.sessionId
      };
      
      return await this.coordinator.execute(request);
    } catch (error) {
      this.logger.error(`Error saving context state: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Loads a context state
   * @param {Object} params Load parameters
   * @param {string} [params.contextId] Context ID to load
   * @param {Object} [params.criteria] Search criteria for finding context
   * @param {string} [params.sessionId] Session ID to associate with the loaded context
   * @returns {Promise<Object>} Load result with context state
   */
  async loadContext(params) {
    try {
      const request = {
        operation: 'load',
        contextId: params.contextId,
        criteria: params.criteria,
        sessionId: params.sessionId
      };
      
      return await this.coordinator.execute(request);
    } catch (error) {
      this.logger.error(`Error loading context state: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Transfers context between agents
   * @param {Object} params Transfer parameters
   * @param {string} params.sourceAgentId Source agent ID
   * @param {string} params.targetAgentId Target agent ID
   * @param {string} [params.contextId] Specific context ID to transfer
   * @param {Object} [params.contextFilter] Filter for finding context to transfer
   * @returns {Promise<Object>} Transfer result
   */
  async transferContext(params) {
    try {
      const request = {
        operation: 'transfer',
        sourceAgentId: params.sourceAgentId,
        targetAgentId: params.targetAgentId,
        contextId: params.contextId,
        contextFilter: params.contextFilter
      };
      
      return await this.coordinator.execute(request);
    } catch (error) {
      this.logger.error(`Error transferring context: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Merges multiple context states
   * @param {Object} params Merge parameters
   * @param {Array<string>} params.contextIds Context IDs to merge
   * @param {string} [params.strategy='latest-wins'] Merge strategy
   * @param {Object} [params.options={}] Strategy-specific options
   * @returns {Promise<Object>} Merge result
   */
  async mergeContexts(params) {
    try {
      const request = {
        operation: 'merge',
        contextIds: params.contextIds,
        strategy: params.strategy,
        options: params.options
      };
      
      return await this.coordinator.execute(request);
    } catch (error) {
      this.logger.error(`Error merging contexts: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Creates a snapshot of an agent's context states
   * @param {Object} params Snapshot parameters
   * @param {string} params.agentId Agent ID
   * @param {string} [params.label] Snapshot label
   * @returns {Promise<Object>} Snapshot result
   */
  async createSnapshot(params) {
    try {
      const request = {
        operation: 'snapshot',
        agentId: params.agentId,
        label: params.label
      };
      
      return await this.coordinator.execute(request);
    } catch (error) {
      this.logger.error(`Error creating snapshot: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Restores a snapshot
   * @param {Object} params Restore parameters
   * @param {string} params.snapshotId Snapshot ID
   * @param {string} [params.targetAgentId] Target agent ID (defaults to original agent)
   * @returns {Promise<Object>} Restore result
   */
  async restoreSnapshot(params) {
    try {
      const request = {
        operation: 'restore',
        snapshotId: params.snapshotId,
        targetAgentId: params.targetAgentId
      };
      
      return await this.coordinator.execute(request);
    } catch (error) {
      this.logger.error(`Error restoring snapshot: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Compares two context states
   * @param {Object} params Diff parameters
   * @param {string} params.baseContextId Base context ID
   * @param {string} params.compareContextId Compare context ID
   * @returns {Promise<Object>} Diff result
   */
  async diffContexts(params) {
    try {
      const request = {
        operation: 'diff',
        baseContextId: params.baseContextId,
        compareContextId: params.compareContextId
      };
      
      return await this.coordinator.execute(request);
    } catch (error) {
      this.logger.error(`Error comparing contexts: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Starts a new session
   * @param {Object} params Session parameters
   * @param {string} [params.agentId] Agent ID
   * @param {Object} [params.metadata={}] Session metadata
   * @returns {Promise<Object>} Created session
   */
  async startSession(params = {}) {
    try {
      return await this.coordinator.startSession({
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        agentId: params.agentId,
        metadata: params.metadata || {}
      });
    } catch (error) {
      this.logger.error(`Error starting session: ${error.message}`);
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
      return await this.coordinator.endSession(sessionId);
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
      return await this.coordinator.sessionTracker.getSession(sessionId);
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
      return await this.coordinator.sessionTracker.findSessions(criteria);
    } catch (error) {
      this.logger.error(`Error finding sessions: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Gets a context state by ID
   * @param {string} contextId Context ID
   * @returns {Promise<Object>} Context state
   */
  async getContextState(contextId) {
    try {
      return await this.coordinator.getContextState(contextId);
    } catch (error) {
      this.logger.error(`Error getting context state: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Finds context states matching criteria
   * @param {Object} criteria Search criteria
   * @returns {Promise<Array<Object>>} Matching context states
   */
  async findContextStates(criteria) {
    try {
      return await this.coordinator.findContextStates(criteria);
    } catch (error) {
      this.logger.error(`Error finding context states: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Gets context transition history
   * @param {string} contextId Context ID
   * @returns {Promise<Array<Object>>} Transition history
   */
  async getContextHistory(contextId) {
    try {
      return await this.coordinator.getContextHistory(contextId);
    } catch (error) {
      this.logger.error(`Error getting context history: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Gets agent transition history
   * @param {string} agentId Agent ID
   * @returns {Promise<Array<Object>>} Transition history
   */
  async getAgentHistory(agentId) {
    try {
      return await this.coordinator.getAgentHistory(agentId);
    } catch (error) {
      this.logger.error(`Error getting agent history: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Synthesizes knowledge from context history using KSE
   * @param {Object} params Synthesis parameters
   * @param {string} params.contextId Context ID
   * @param {string} [params.strategy='merge'] Synthesis strategy
   * @param {Object} [params.strategyParams={}] Strategy-specific parameters
   * @returns {Promise<Object>} Synthesized result
   */
  async synthesizeContextHistory(params) {
    if (!this.kseClient) {
      throw new Error('KSE client is required for synthesis operations');
    }
    
    try {
      // Get context history
      const transitions = await this.coordinator.getContextHistory(params.contextId);
      
      // Extract source contexts
      const contextIds = new Set();
      transitions.forEach(transition => {
        if (transition.source.contextId) {
          contextIds.add(transition.source.contextId);
        }
        if (transition.target.contextId) {
          contextIds.add(transition.target.contextId);
        }
      });
      
      // Load all context states
      const contextStates = await Promise.all(
        [...contextIds].map(id => this.coordinator.getContextState(id))
      );
      
      // Use KSE to synthesize
      const synthesized = await this.kseClient.synthesize({
        artifacts: contextStates,
        strategy: params.strategy || 'merge',
        strategyParams: params.strategyParams || {},
        context: {
          operation: 'contextHistorySynthesis',
          sourceContextId: params.contextId
        }
      });
      
      return {
        success: true,
        operation: 'synthesize',
        sourceContextId: params.contextId,
        transitionCount: transitions.length,
        result: synthesized
      };
    } catch (error) {
      this.logger.error(`Error synthesizing context history: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Maps context to a different knowledge representation using AMO
   * @param {Object} params Mapping parameters
   * @param {string} params.contextId Context ID
   * @param {string} params.targetType Target knowledge type
   * @param {Object} [params.mappingOptions={}] Mapping options
   * @returns {Promise<Object>} Mapped knowledge
   */
  async mapContextToKnowledge(params) {
    if (!this.amoClient) {
      throw new Error('AMO client is required for mapping operations');
    }
    
    try {
      // Load the context state
      const contextState = await this.coordinator.getContextState(params.contextId);
      
      // Use AMO to map the context to the target type
      const mapped = await this.amoClient.mapKnowledge({
        sourceArtifact: contextState,
        sourceType: 'context',
        targetType: params.targetType,
        options: params.mappingOptions || {}
      });
      
      return {
        success: true,
        operation: 'map',
        sourceContextId: params.contextId,
        targetType: params.targetType,
        result: mapped
      };
    } catch (error) {
      this.logger.error(`Error mapping context to knowledge: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Acquires knowledge from a context using AKAF
   * @param {Object} params Acquisition parameters
   * @param {string} params.contextId Context ID
   * @param {Array<string>} params.knowledgeTypes Knowledge types to acquire
   * @param {Object} [params.acquisitionParams={}] Acquisition parameters
   * @returns {Promise<Object>} Acquired knowledge
   */
  async acquireKnowledgeFromContext(params) {
    if (!this.akafClient) {
      throw new Error('AKAF client is required for knowledge acquisition');
    }
    
    try {
      // Load the context state
      const contextState = await this.coordinator.getContextState(params.contextId);
      
      // Use AKAF to acquire knowledge
      const acquired = await this.akafClient.acquireKnowledge({
        types: params.knowledgeTypes,
        params: {
          ...params.acquisitionParams,
          sourceContext: contextState
        },
        context: {
          operation: 'contextKnowledgeAcquisition',
          sourceContextId: params.contextId
        }
      });
      
      return {
        success: true,
        operation: 'acquire',
        sourceContextId: params.contextId,
        knowledgeTypes: params.knowledgeTypes,
        result: acquired
      };
    } catch (error) {
      this.logger.error(`Error acquiring knowledge from context: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Plans based on context transitions using KDAP
   * @param {Object} params Planning parameters
   * @param {string} params.agentId Agent ID
   * @param {string} [params.goal] Planning goal
   * @param {Object} [params.planningParams={}] Planning parameters
   * @returns {Promise<Object>} Knowledge acquisition plan
   */
  async planKnowledgeAcquisition(params) {
    if (!this.kdapClient) {
      throw new Error('KDAP client is required for planning operations');
    }
    
    try {
      // Get agent history
      const transitions = await this.coordinator.getAgentHistory(params.agentId);
      
      // Use KDAP to create a plan
      const plan = await this.kdapClient.createAcquisitionPlan({
        agentId: params.agentId,
        transitionHistory: transitions,
        goal: params.goal,
        params: params.planningParams || {}
      });
      
      return {
        success: true,
        operation: 'plan',
        agentId: params.agentId,
        transitionCount: transitions.length,
        plan
      };
    } catch (error) {
      this.logger.error(`Error planning knowledge acquisition: ${error.message}`);
      throw error;
    }
  }
}

module.exports = {
  CCFIntegration,
  ConPortStorageProvider
};