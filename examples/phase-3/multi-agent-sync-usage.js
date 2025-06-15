/**
 * Example usage of the Multi-Agent Knowledge Synchronization system
 * 
 * This example demonstrates how to use the Multi-Agent Knowledge Synchronization
 * system to share knowledge between multiple Roo agents and maintain consistency.
 */

// Import the multi-agent sync system
const { createMultiAgentSyncSystem } = require('../../utilities/phase-3/multi-agent-sync/multi-agent-sync');

// Mock ConPort client for the example
const mockConPortClient = {
  async get_active_context({ workspace_id }) {
    console.log(`[ConPort] Getting active context for workspace ${workspace_id}`);
    return { current_focus: 'Building image processing API' };
  },
  
  async update_active_context({ workspace_id, patch_content }) {
    console.log(`[ConPort] Updating active context for workspace ${workspace_id}`);
    console.log(`[ConPort] Patch content: ${JSON.stringify(patch_content, null, 2)}`);
    return { success: true };
  },
  
  async log_decision({ workspace_id, summary, rationale, tags }) {
    console.log(`[ConPort] Logging decision for workspace ${workspace_id}`);
    console.log(`[ConPort] Decision: ${summary}`);
    return { id: Math.floor(Math.random() * 1000), summary, rationale, tags };
  },
  
  async get_decisions({ workspace_id }) {
    console.log(`[ConPort] Getting decisions for workspace ${workspace_id}`);
    return [
      { id: 123, summary: 'Use TensorFlow for image processing', rationale: 'Better performance for our use case', tags: ['AI', 'image-processing'] },
      { id: 124, summary: 'Implement REST API with Express', rationale: 'Familiar to team and well-documented', tags: ['API', 'backend'] }
    ];
  },
  
  async log_system_pattern({ workspace_id, name, description, tags }) {
    console.log(`[ConPort] Logging system pattern for workspace ${workspace_id}`);
    console.log(`[ConPort] Pattern: ${name}`);
    return { id: Math.floor(Math.random() * 1000), name, description, tags };
  },
  
  async get_system_patterns({ workspace_id }) {
    console.log(`[ConPort] Getting system patterns for workspace ${workspace_id}`);
    return [
      { id: 234, name: 'Repository Pattern for Data Access', description: 'Abstract data source behind repository interfaces', tags: ['architecture', 'data-access'] }
    ];
  },
  
  async log_progress({ workspace_id, description, status }) {
    console.log(`[ConPort] Logging progress for workspace ${workspace_id}`);
    console.log(`[ConPort] Progress: ${description} (${status})`);
    return { id: Math.floor(Math.random() * 1000), description, status };
  },
  
  async get_progress({ workspace_id }) {
    console.log(`[ConPort] Getting progress for workspace ${workspace_id}`);
    return [
      { id: 345, description: 'Setup project structure', status: 'DONE' },
      { id: 346, description: 'Implement user authentication', status: 'IN_PROGRESS' }
    ];
  },
  
  async log_custom_data({ workspace_id, category, key, value }) {
    console.log(`[ConPort] Logging custom data for workspace ${workspace_id}`);
    console.log(`[ConPort] Category: ${category}, Key: ${key}`);
    return { success: true };
  },
  
  async get_custom_data({ workspace_id, category, key }) {
    console.log(`[ConPort] Getting custom data for workspace ${workspace_id}`);
    if (category === 'multi_agent_sync_registry') {
      return { value: [] }; // Empty registry for example purposes
    }
    return { value: { example: 'data' } };
  }
};

// Run the example
async function runExample() {
  console.log('=== Multi-Agent Knowledge Synchronization Example ===\n');
  
  try {
    // Initialize the sync system
    console.log('1. Initializing the Multi-Agent Knowledge Synchronization System');
    const syncSystem = createMultiAgentSyncSystem({
      workspaceId: '/projects/image-processing-api',
      conPortClient: mockConPortClient,
      logger: {
        info: (msg) => console.log(`[Info] ${msg}`),
        warn: (msg) => console.log(`[Warning] ${msg}`),
        error: (msg) => console.log(`[Error] ${msg}`)
      }
    });
    
    await syncSystem.initialize();
    console.log('✓ Sync system initialized\n');
    
    // Register multiple agents
    console.log('2. Registering Agents');
    
    const primaryAgent = await syncSystem.registerAgent({
      agentId: 'roo-primary',
      agentType: 'roo',
      displayName: 'Primary Development Roo',
      capabilities: {
        canPush: true,
        canPull: true,
        canResolveConflicts: true
      },
      syncPreferences: {
        autoSync: true,
        syncFrequency: 'high',
        priorityArtifacts: ['decision', 'system_pattern']
      }
    });
    console.log(`✓ Registered primary agent: ${primaryAgent.displayName}`);
    
    const backendAgent = await syncSystem.registerAgent({
      agentId: 'roo-backend',
      agentType: 'roo',
      displayName: 'Backend Specialist Roo',
      capabilities: {
        canPush: true,
        canPull: true
      },
      syncPreferences: {
        autoSync: false,
        syncFrequency: 'medium',
        priorityArtifacts: ['decision', 'system_pattern', 'custom_data']
      }
    });
    console.log(`✓ Registered backend agent: ${backendAgent.displayName}`);
    
    const aiAgent = await syncSystem.registerAgent({
      agentId: 'claude-ai',
      agentType: 'claude',
      displayName: 'Claude AI Assistant',
      capabilities: {
        canPush: true,
        canPull: true
      },
      syncPreferences: {
        autoSync: true,
        syncFrequency: 'low',
        priorityArtifacts: ['decision']
      }
    });
    console.log(`✓ Registered AI assistant: ${aiAgent.displayName}`);
    
    // List registered agents
    const agents = await syncSystem.getAgents();
    console.log(`\n✓ Registered ${agents.length} agents`);
    console.log('✓ Agent registration complete\n');
    
    // Push knowledge from primary agent
    console.log('3. Pushing Knowledge from Primary Agent to Backend Agent');
    const pushResult = await syncSystem.pushKnowledge({
      sourceAgentId: 'roo-primary',
      targetAgentId: 'roo-backend',
      artifactTypes: ['decision', 'system_pattern']
    });
    
    console.log(`✓ Push result: ${pushResult.success ? 'Success' : 'Failed'}`);
    console.log(`✓ Artifacts pushed: ${pushResult.artifactCount}`);
    console.log('✓ Knowledge push complete\n');
    
    // Pull knowledge to AI agent
    console.log('4. Pulling Knowledge to AI Assistant from Primary Agent');
    const pullResult = await syncSystem.pullKnowledge({
      targetAgentId: 'claude-ai',
      sourceAgentId: 'roo-primary',
      artifactTypes: ['decision']
    });
    
    console.log(`✓ Pull result: ${pullResult.success ? 'Success' : 'Failed'}`);
    console.log(`✓ Artifacts pulled: ${pullResult.artifactCount}`);
    console.log('✓ Knowledge pull complete\n');
    
    // Compare knowledge between agents
    console.log('5. Comparing Knowledge between Backend Agent and AI Assistant');
    const compareResult = await syncSystem.compareKnowledge({
      sourceAgentId: 'roo-backend',
      targetAgentId: 'claude-ai',
      artifactTypes: ['decision']
    });
    
    console.log(`✓ Comparison result: ${compareResult.identical ? 'Identical' : 'Different'}`);
    console.log(`✓ Differences found: ${compareResult.differences.length}`);
    console.log('✓ Knowledge comparison complete\n');
    
    // Create a sync session for more complex synchronization
    console.log('6. Creating a Multi-Agent Sync Session');
    const session = await syncSystem.createSyncSession({
      sessionId: `session-${Date.now()}`,
      agentIds: ['roo-primary', 'roo-backend', 'claude-ai'],
      syncMode: 'bidirectional',
      artifactTypes: ['decision', 'system_pattern', 'progress'],
      syncRules: {
        conflictStrategy: 'manual-resolution',
        prioritizeNewest: true,
        includeMetadata: true
      }
    });
    
    console.log(`✓ Sync session created: ${session.sessionId}`);
    console.log(`✓ Participating agents: ${session.agentIds.join(', ')}`);
    console.log('✓ Sync session creation complete\n');
    
    // Get sync status
    console.log('7. Getting Sync Status');
    const syncStatus = await syncSystem.getSyncStatus({
      sessionId: session.sessionId,
      includeDetails: true
    });
    
    console.log(`✓ Session status: ${syncStatus.status}`);
    console.log('✓ Status check complete\n');
    
    // Simulate and resolve a conflict
    console.log('8. Resolving a Sync Conflict');
    // Assume a conflict was detected during the sync session
    const mockConflictId = 'conflict-123';
    const resolution = await syncSystem.resolveConflict({
      sessionId: session.sessionId,
      conflictId: mockConflictId,
      resolution: 'merge',
      applyImmediately: true
    });
    
    console.log(`✓ Conflict resolution: ${resolution.success ? 'Success' : 'Failed'}`);
    console.log('✓ Conflict resolution complete\n');
    
    // Advanced scenario: update agent capabilities
    console.log('9. Updating Agent Capabilities');
    const updatedAgent = await syncSystem.updateAgent('claude-ai', {
      capabilities: {
        canPush: true,
        canPull: true,
        canResolveConflicts: true
      },
      syncPreferences: {
        autoSync: true,
        syncFrequency: 'high',
        priorityArtifacts: ['decision', 'system_pattern', 'custom_data']
      }
    });
    
    console.log(`✓ Updated agent: ${updatedAgent.displayName}`);
    console.log(`✓ New sync frequency: ${updatedAgent.syncPreferences.syncFrequency}`);
    console.log('✓ Agent update complete\n');
    
    console.log('=== Example Complete ===');
    
  } catch (error) {
    console.error('Example failed:', error.message);
  }
}

// Run the example
runExample().catch(err => console.error('Unexpected error:', err));

/**
 * Real-world Use Case Scenarios:
 * 
 * 1. Team Collaboration
 *    Multiple developers using different Roo instances can share architectural decisions,
 *    system patterns, and progress updates across a shared project. Each Roo instance
 *    maintains its specialized knowledge while benefiting from the collective knowledge.
 * 
 * 2. Cross-Project Knowledge Transfer
 *    Knowledge gained in one project (like reusable patterns, best practices, or technical decisions)
 *    can be selectively transferred to another project, maintaining a consistent approach
 *    across the organization.
 * 
 * 3. AI Assistant Integration
 *    AI assistants like Claude can pull knowledge from Roo instances to better understand
 *    project context, decisions, and patterns before providing recommendations or generating code.
 * 
 * 4. Specialized Domain Knowledge
 *    Different agents can specialize in different domains (frontend, backend, DevOps)
 *    while still maintaining a shared understanding of core architectural decisions and patterns.
 */