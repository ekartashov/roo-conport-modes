/**
 * Multi-Agent Knowledge Synchronization - Validation Layer
 * 
 * This module provides validation functions for the Multi-Agent Knowledge Synchronization
 * component, ensuring data integrity and proper parameter formatting.
 */

/**
 * Validates options for agent registration
 *
 * @param {Object} options - Registration options
 * @param {string} options.agentId - Unique identifier for the agent
 * @param {string} options.agentType - Type of agent (e.g., 'roo', 'claude', 'custom')
 * @param {string} options.displayName - Human-readable name for the agent
 * @param {Object} [options.capabilities] - Agent capabilities
 * @param {Object} [options.syncPreferences] - Synchronization preferences
 * @param {Object} [options.metadata] - Additional metadata about the agent
 * @returns {Object} Validated options
 * @throws {Error} If validation fails
 */
function validateAgentRegistrationOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Agent registration options must be an object');
  }

  const { agentId, agentType, displayName, capabilities, syncPreferences, metadata } = options;

  // Required fields
  if (!agentId || typeof agentId !== 'string' || agentId.trim() === '') {
    throw new Error('agentId is required and must be a non-empty string');
  }

  if (!agentType || typeof agentType !== 'string' || agentType.trim() === '') {
    throw new Error('agentType is required and must be a non-empty string');
  }

  if (!displayName || typeof displayName !== 'string' || displayName.trim() === '') {
    throw new Error('displayName is required and must be a non-empty string');
  }

  // Optional fields
  const validatedOptions = {
    agentId: agentId.trim(),
    agentType: agentType.trim(),
    displayName: displayName.trim()
  };

  // Validate capabilities if provided
  if (capabilities !== undefined) {
    if (typeof capabilities !== 'object' || capabilities === null) {
      throw new Error('capabilities must be an object');
    }
    validatedOptions.capabilities = capabilities;
  } else {
    validatedOptions.capabilities = {};
  }

  // Validate syncPreferences if provided
  if (syncPreferences !== undefined) {
    if (typeof syncPreferences !== 'object' || syncPreferences === null) {
      throw new Error('syncPreferences must be an object');
    }

    // Validate specific sync preferences
    if (syncPreferences.syncFrequency !== undefined) {
      if (typeof syncPreferences.syncFrequency !== 'string' && 
          !Number.isInteger(syncPreferences.syncFrequency)) {
        throw new Error('syncFrequency must be a string or integer');
      }
    }

    if (syncPreferences.conflictResolution !== undefined) {
      if (typeof syncPreferences.conflictResolution !== 'string') {
        throw new Error('conflictResolution must be a string');
      }
      
      const validResolutionStrategies = [
        'latest_wins', 'manual_resolution', 'merge', 'primary_agent_wins'
      ];
      
      if (!validResolutionStrategies.includes(syncPreferences.conflictResolution)) {
        throw new Error(
          `conflictResolution must be one of: ${validResolutionStrategies.join(', ')}`
        );
      }
    }

    validatedOptions.syncPreferences = syncPreferences;
  } else {
    validatedOptions.syncPreferences = {
      syncFrequency: 'on_demand',
      conflictResolution: 'latest_wins'
    };
  }

  // Validate metadata if provided
  if (metadata !== undefined) {
    if (typeof metadata !== 'object' || metadata === null) {
      throw new Error('metadata must be an object');
    }
    validatedOptions.metadata = metadata;
  } else {
    validatedOptions.metadata = {};
  }

  return validatedOptions;
}

/**
 * Validates options for knowledge push operation
 *
 * @param {Object} options - Push options
 * @param {string} options.sourceAgentId - ID of the agent pushing knowledge
 * @param {string} [options.targetAgentId] - ID of the target agent (if undefined, push to all agents)
 * @param {Array<Object>} options.knowledgeArtifacts - Array of knowledge artifacts to push
 * @param {string} [options.syncMode='incremental'] - Sync mode ('incremental' or 'full')
 * @param {boolean} [options.forceSync=false] - Whether to force sync even if conflicts detected
 * @returns {Object} Validated options
 * @throws {Error} If validation fails
 */
function validateKnowledgePushOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Knowledge push options must be an object');
  }

  const { 
    sourceAgentId, 
    targetAgentId, 
    knowledgeArtifacts, 
    syncMode = 'incremental', 
    forceSync = false 
  } = options;

  // Required fields
  if (!sourceAgentId || typeof sourceAgentId !== 'string' || sourceAgentId.trim() === '') {
    throw new Error('sourceAgentId is required and must be a non-empty string');
  }

  if (!knowledgeArtifacts || !Array.isArray(knowledgeArtifacts) || knowledgeArtifacts.length === 0) {
    throw new Error('knowledgeArtifacts is required and must be a non-empty array');
  }

  // Validate each knowledge artifact
  for (let i = 0; i < knowledgeArtifacts.length; i++) {
    const artifact = knowledgeArtifacts[i];
    if (!artifact || typeof artifact !== 'object') {
      throw new Error(`knowledgeArtifact at index ${i} must be an object`);
    }
    
    if (!artifact.id || typeof artifact.id !== 'string') {
      throw new Error(`knowledgeArtifact at index ${i} must have an id string`);
    }
    
    if (!artifact.type || typeof artifact.type !== 'string') {
      throw new Error(`knowledgeArtifact at index ${i} must have a type string`);
    }
    
    if (!artifact.content) {
      throw new Error(`knowledgeArtifact at index ${i} must have content`);
    }
    
    if (!artifact.timestamp || typeof artifact.timestamp !== 'string') {
      throw new Error(`knowledgeArtifact at index ${i} must have a timestamp string`);
    }
    
    try {
      new Date(artifact.timestamp);
    } catch (e) {
      throw new Error(`knowledgeArtifact at index ${i} has an invalid timestamp`);
    }
  }

  // Optional fields
  const validatedOptions = {
    sourceAgentId: sourceAgentId.trim(),
    knowledgeArtifacts,
    syncMode,
    forceSync
  };

  // Validate targetAgentId if provided
  if (targetAgentId !== undefined) {
    if (typeof targetAgentId !== 'string' || targetAgentId.trim() === '') {
      throw new Error('targetAgentId must be a non-empty string');
    }
    validatedOptions.targetAgentId = targetAgentId.trim();
  }

  // Validate syncMode
  if (!['incremental', 'full'].includes(syncMode)) {
    throw new Error('syncMode must be either "incremental" or "full"');
  }

  // Validate forceSync
  if (typeof forceSync !== 'boolean') {
    throw new Error('forceSync must be a boolean');
  }

  return validatedOptions;
}

/**
 * Validates options for knowledge pull operation
 *
 * @param {Object} options - Pull options
 * @param {string} options.targetAgentId - ID of the agent pulling knowledge
 * @param {string} [options.sourceAgentId] - ID of the source agent (if undefined, pull from all agents)
 * @param {Array<string>} [options.artifactTypes] - Types of artifacts to pull
 * @param {string} [options.syncMode='incremental'] - Sync mode ('incremental' or 'full')
 * @param {string} [options.conflictStrategy] - Strategy for handling conflicts
 * @param {Object} [options.filters] - Additional filters for knowledge pull
 * @returns {Object} Validated options
 * @throws {Error} If validation fails
 */
function validateKnowledgePullOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Knowledge pull options must be an object');
  }

  const { 
    targetAgentId, 
    sourceAgentId, 
    artifactTypes, 
    syncMode = 'incremental', 
    conflictStrategy,
    filters 
  } = options;

  // Required fields
  if (!targetAgentId || typeof targetAgentId !== 'string' || targetAgentId.trim() === '') {
    throw new Error('targetAgentId is required and must be a non-empty string');
  }

  // Optional fields
  const validatedOptions = {
    targetAgentId: targetAgentId.trim(),
    syncMode
  };

  // Validate sourceAgentId if provided
  if (sourceAgentId !== undefined) {
    if (typeof sourceAgentId !== 'string' || sourceAgentId.trim() === '') {
      throw new Error('sourceAgentId must be a non-empty string');
    }
    validatedOptions.sourceAgentId = sourceAgentId.trim();
  }

  // Validate artifactTypes if provided
  if (artifactTypes !== undefined) {
    if (!Array.isArray(artifactTypes)) {
      throw new Error('artifactTypes must be an array');
    }
    for (let i = 0; i < artifactTypes.length; i++) {
      if (typeof artifactTypes[i] !== 'string') {
        throw new Error(`artifactTypes[${i}] must be a string`);
      }
    }
    validatedOptions.artifactTypes = artifactTypes;
  }

  // Validate syncMode
  if (!['incremental', 'full'].includes(syncMode)) {
    throw new Error('syncMode must be either "incremental" or "full"');
  }

  // Validate conflictStrategy if provided
  if (conflictStrategy !== undefined) {
    if (typeof conflictStrategy !== 'string') {
      throw new Error('conflictStrategy must be a string');
    }

    const validStrategies = [
      'latest_wins', 'manual_resolution', 'merge', 
      'target_wins', 'source_wins', 'preserve_both'
    ];
    
    if (!validStrategies.includes(conflictStrategy)) {
      throw new Error(
        `conflictStrategy must be one of: ${validStrategies.join(', ')}`
      );
    }
    
    validatedOptions.conflictStrategy = conflictStrategy;
  }

  // Validate filters if provided
  if (filters !== undefined) {
    if (typeof filters !== 'object' || filters === null) {
      throw new Error('filters must be an object');
    }
    validatedOptions.filters = filters;
  }

  return validatedOptions;
}

/**
 * Validates options for conflict resolution
 *
 * @param {Object} options - Conflict resolution options
 * @param {string} options.conflictId - Unique identifier for the conflict
 * @param {string} options.resolution - Resolution decision ('source', 'target', 'merge', 'custom')
 * @param {Object} [options.customResolution] - Custom resolution data (required if resolution='custom')
 * @param {boolean} [options.applyImmediately=true] - Whether to apply the resolution immediately
 * @returns {Object} Validated options
 * @throws {Error} If validation fails
 */
function validateConflictResolutionOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Conflict resolution options must be an object');
  }

  const { conflictId, resolution, customResolution, applyImmediately = true } = options;

  // Required fields
  if (!conflictId || typeof conflictId !== 'string' || conflictId.trim() === '') {
    throw new Error('conflictId is required and must be a non-empty string');
  }

  if (!resolution || typeof resolution !== 'string') {
    throw new Error('resolution is required and must be a string');
  }

  const validResolutions = ['source', 'target', 'merge', 'custom'];
  if (!validResolutions.includes(resolution)) {
    throw new Error(`resolution must be one of: ${validResolutions.join(', ')}`);
  }

  // If resolution is 'custom', customResolution is required
  if (resolution === 'custom') {
    if (!customResolution || typeof customResolution !== 'object') {
      throw new Error('customResolution is required and must be an object when resolution is "custom"');
    }
  }

  // Validate applyImmediately
  if (typeof applyImmediately !== 'boolean') {
    throw new Error('applyImmediately must be a boolean');
  }

  return {
    conflictId: conflictId.trim(),
    resolution,
    customResolution: resolution === 'custom' ? customResolution : undefined,
    applyImmediately
  };
}

/**
 * Validates options for sync session
 *
 * @param {Object} options - Sync session options
 * @param {string} options.sessionId - Unique identifier for the sync session
 * @param {Array<string>} options.agentIds - IDs of agents participating in the sync session
 * @param {string} [options.syncMode='bidirectional'] - Mode of sync ('bidirectional', 'push', or 'pull')
 * @param {Array<string>} [options.artifactTypes] - Types of artifacts to sync
 * @param {Object} [options.syncRules] - Rules governing the synchronization
 * @returns {Object} Validated options
 * @throws {Error} If validation fails
 */
function validateSyncSessionOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Sync session options must be an object');
  }

  const { 
    sessionId, 
    agentIds, 
    syncMode = 'bidirectional', 
    artifactTypes,
    syncRules 
  } = options;

  // Required fields
  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
    throw new Error('sessionId is required and must be a non-empty string');
  }

  if (!agentIds || !Array.isArray(agentIds) || agentIds.length < 2) {
    throw new Error('agentIds is required and must be an array with at least 2 agents');
  }

  for (let i = 0; i < agentIds.length; i++) {
    if (typeof agentIds[i] !== 'string' || agentIds[i].trim() === '') {
      throw new Error(`agentIds[${i}] must be a non-empty string`);
    }
  }

  // Validate syncMode
  const validSyncModes = ['bidirectional', 'push', 'pull'];
  if (!validSyncModes.includes(syncMode)) {
    throw new Error(`syncMode must be one of: ${validSyncModes.join(', ')}`);
  }

  const validatedOptions = {
    sessionId: sessionId.trim(),
    agentIds: agentIds.map(id => id.trim()),
    syncMode
  };

  // Validate artifactTypes if provided
  if (artifactTypes !== undefined) {
    if (!Array.isArray(artifactTypes)) {
      throw new Error('artifactTypes must be an array');
    }
    
    for (let i = 0; i < artifactTypes.length; i++) {
      if (typeof artifactTypes[i] !== 'string') {
        throw new Error(`artifactTypes[${i}] must be a string`);
      }
    }
    
    validatedOptions.artifactTypes = artifactTypes;
  }

  // Validate syncRules if provided
  if (syncRules !== undefined) {
    if (typeof syncRules !== 'object' || syncRules === null) {
      throw new Error('syncRules must be an object');
    }
    
    validatedOptions.syncRules = syncRules;
  }

  return validatedOptions;
}

/**
 * Validates options for knowledge difference detection
 *
 * @param {Object} options - Diff options
 * @param {string} options.sourceAgentId - ID of the source agent
 * @param {string} options.targetAgentId - ID of the target agent
 * @param {Array<string>} [options.artifactTypes] - Types of artifacts to compare
 * @param {string} [options.diffAlgorithm='default'] - Algorithm to use for diffing
 * @param {Object} [options.filters] - Additional filters for knowledge comparison
 * @returns {Object} Validated options
 * @throws {Error} If validation fails
 */
function validateKnowledgeDiffOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Knowledge diff options must be an object');
  }

  const { 
    sourceAgentId, 
    targetAgentId, 
    artifactTypes, 
    diffAlgorithm = 'default',
    filters 
  } = options;

  // Required fields
  if (!sourceAgentId || typeof sourceAgentId !== 'string' || sourceAgentId.trim() === '') {
    throw new Error('sourceAgentId is required and must be a non-empty string');
  }

  if (!targetAgentId || typeof targetAgentId !== 'string' || targetAgentId.trim() === '') {
    throw new Error('targetAgentId is required and must be a non-empty string');
  }

  // Optional fields
  const validatedOptions = {
    sourceAgentId: sourceAgentId.trim(),
    targetAgentId: targetAgentId.trim(),
    diffAlgorithm
  };

  // Validate artifactTypes if provided
  if (artifactTypes !== undefined) {
    if (!Array.isArray(artifactTypes)) {
      throw new Error('artifactTypes must be an array');
    }
    
    for (let i = 0; i < artifactTypes.length; i++) {
      if (typeof artifactTypes[i] !== 'string') {
        throw new Error(`artifactTypes[${i}] must be a string`);
      }
    }
    
    validatedOptions.artifactTypes = artifactTypes;
  }

  // Validate diffAlgorithm
  const validAlgorithms = ['default', 'semantic', 'structural', 'checksum'];
  if (!validAlgorithms.includes(diffAlgorithm)) {
    throw new Error(`diffAlgorithm must be one of: ${validAlgorithms.join(', ')}`);
  }

  // Validate filters if provided
  if (filters !== undefined) {
    if (typeof filters !== 'object' || filters === null) {
      throw new Error('filters must be an object');
    }
    validatedOptions.filters = filters;
  }

  return validatedOptions;
}

/**
 * Validates options for sync status query
 * 
 * @param {Object} options - Status query options
 * @param {string} [options.agentId] - ID of agent to get status for
 * @param {string} [options.sessionId] - ID of sync session to get status for
 * @param {boolean} [options.includeDetails=false] - Whether to include detailed status information
 * @param {number} [options.limit] - Maximum number of status entries to return
 * @returns {Object} Validated options
 * @throws {Error} If validation fails
 */
function validateSyncStatusOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Sync status options must be an object');
  }

  const { agentId, sessionId, includeDetails = false, limit } = options;

  // At least one of agentId or sessionId should be provided
  if (!agentId && !sessionId) {
    throw new Error('Either agentId or sessionId must be provided');
  }

  const validatedOptions = {
    includeDetails
  };

  // Validate agentId if provided
  if (agentId !== undefined) {
    if (typeof agentId !== 'string' || agentId.trim() === '') {
      throw new Error('agentId must be a non-empty string');
    }
    validatedOptions.agentId = agentId.trim();
  }

  // Validate sessionId if provided
  if (sessionId !== undefined) {
    if (typeof sessionId !== 'string' || sessionId.trim() === '') {
      throw new Error('sessionId must be a non-empty string');
    }
    validatedOptions.sessionId = sessionId.trim();
  }

  // Validate includeDetails
  if (typeof includeDetails !== 'boolean') {
    throw new Error('includeDetails must be a boolean');
  }

  // Validate limit if provided
  if (limit !== undefined) {
    if (!Number.isInteger(limit) || limit <= 0) {
      throw new Error('limit must be a positive integer');
    }
    validatedOptions.limit = limit;
  }

  return validatedOptions;
}

module.exports = {
  validateAgentRegistrationOptions,
  validateKnowledgePushOptions,
  validateKnowledgePullOptions,
  validateConflictResolutionOptions,
  validateSyncSessionOptions,
  validateKnowledgeDiffOptions,
  validateSyncStatusOptions
};