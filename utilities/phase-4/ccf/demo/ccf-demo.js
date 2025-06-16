/**
 * Cognitive Continuity Framework (CCF) - Demonstration Script
 * 
 * This script demonstrates the key features of the CCF component:
 * - Context state management
 * - Session tracking
 * - Context transfer between agents
 * - Context merging
 * - Integration with ConPort
 * - Knowledge transition history
 * 
 * To run this demo, ensure you have the ConPort client available
 * and use the command: node ccf-demo.js
 */

// Import CCF components
const { CCFIntegration } = require('../index');

// Mock ConPort client for demo purposes
class MockConPortClient {
  constructor() {
    this.storage = {
      custom_data: {}
    };
    console.log('🔌 Mock ConPort client initialized');
  }

  async log_custom_data({ workspace_id, category, key, value }) {
    if (!this.storage.custom_data[category]) {
      this.storage.custom_data[category] = {};
    }
    this.storage.custom_data[category][key] = value;
    return { success: true };
  }

  async get_custom_data({ workspace_id, category, key }) {
    if (!this.storage.custom_data[category]) {
      return { custom_data: [] };
    }
    
    if (key) {
      if (!this.storage.custom_data[category][key]) {
        return { custom_data: [] };
      }
      
      return {
        custom_data: [
          {
            category,
            key,
            value: this.storage.custom_data[category][key]
          }
        ]
      };
    }
    
    return {
      custom_data: Object.entries(this.storage.custom_data[category]).map(([k, v]) => ({
        category,
        key: k,
        value: v
      }))
    };
  }

  async delete_custom_data({ workspace_id, category, key }) {
    if (this.storage.custom_data[category] && this.storage.custom_data[category][key]) {
      delete this.storage.custom_data[category][key];
      return { success: true };
    }
    return { success: false };
  }
}

// Demo Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  red: '\x1b[31m'
};

// Helper for formatting output
function formatOutput(title, content) {
  console.log(`\n${colors.bright}${colors.blue}=== ${title} ===${colors.reset}`);
  console.log(JSON.stringify(content, null, 2));
}

// Helper for section headers
function section(title) {
  console.log(`\n${colors.bright}${colors.green}▶ ${title} ${colors.reset}`);
  console.log(`${colors.dim}${'─'.repeat(50)}${colors.reset}`);
}

// Helper for subsection headers
function subsection(title) {
  console.log(`\n${colors.bright}${colors.yellow}• ${title} ${colors.reset}`);
}

// Helper for success messages
function success(message) {
  console.log(`${colors.green}✓ ${message}${colors.reset}`);
}

// Helper for info messages
function info(message) {
  console.log(`${colors.cyan}ℹ ${message}${colors.reset}`);
}

/**
 * Main demo function
 */
async function runDemo() {
  console.log(`${colors.bright}${colors.magenta}
╔═════════════════════════════════════════════╗
║                                             ║
║   Cognitive Continuity Framework (CCF)      ║
║   Demonstration                             ║
║                                             ║
╚═════════════════════════════════════════════╝${colors.reset}
  `);

  // Initialize mock ConPort client
  const conportClient = new MockConPortClient();
  
  // Initialize CCF Integration
  info('Initializing CCF Integration...');
  const ccf = new CCFIntegration({
    conportClient: conportClient,
    workspaceId: '/demo/workspace'
  });
  success('CCF Integration initialized successfully');

  // DEMO 1: Session Management
  section('1. Session Management');
  
  subsection('Starting a new session for Agent 1');
  const agent1Session = await ccf.startSession({
    agentId: 'agent-1',
    metadata: {
      source: 'web-interface',
      purpose: 'code-completion'
    }
  });
  formatOutput('Agent 1 Session', agent1Session);
  success('Session started successfully');
  
  subsection('Starting another session for Agent 2');
  const agent2Session = await ccf.startSession({
    agentId: 'agent-2',
    metadata: {
      source: 'mobile-app',
      purpose: 'question-answering'
    }
  });
  formatOutput('Agent 2 Session', agent2Session);
  success('Session started successfully');
  
  subsection('Finding active sessions');
  const activeSessions = await ccf.findSessions({ status: 'active' });
  formatOutput('Active Sessions', activeSessions);
  success(`Found ${activeSessions.length} active sessions`);

  // DEMO 2: Basic Context State Management
  section('2. Basic Context State Management');
  
  subsection('Creating a context state for Agent 1');
  const agent1ContextResult = await ccf.saveContext({
    contextState: {
      agentId: 'agent-1',
      content: {
        topics: ['javascript', 'react', 'state-management'],
        entities: {
          'react': { type: 'framework', attributes: { ecosystem: 'frontend' } },
          'redux': { type: 'library', attributes: { purpose: 'state-management' } }
        },
        facts: [
          { subject: 'react', predicate: 'works_with', object: 'redux' },
          { subject: 'redux', predicate: 'manages', object: 'application_state' }
        ],
        code_snippets: [
          {
            language: 'javascript',
            code: 'const store = createStore(reducer);'
          }
        ]
      }
    },
    sessionId: agent1Session.id
  });
  formatOutput('Agent 1 Context State', agent1ContextResult);
  success('Context state saved successfully');
  
  subsection('Creating a context state for Agent 2');
  const agent2ContextResult = await ccf.saveContext({
    contextState: {
      agentId: 'agent-2',
      content: {
        topics: ['javascript', 'state-management', 'mobx'],
        entities: {
          'react': { type: 'framework', attributes: { ecosystem: 'frontend' } },
          'mobx': { type: 'library', attributes: { purpose: 'state-management' } }
        },
        facts: [
          { subject: 'react', predicate: 'works_with', object: 'mobx' },
          { subject: 'mobx', predicate: 'uses', object: 'observable_pattern' }
        ]
      }
    },
    sessionId: agent2Session.id
  });
  formatOutput('Agent 2 Context State', agent2ContextResult);
  success('Context state saved successfully');
  
  subsection('Loading a context state by ID');
  const loadedContext = await ccf.loadContext({
    contextId: agent1ContextResult.contextState.id
  });
  formatOutput('Loaded Context', loadedContext);
  success('Context state loaded successfully');
  
  subsection('Finding context states by criteria');
  const foundContexts = await ccf.findContextStates({ 
    agentId: 'agent-1'
  });
  formatOutput('Found Contexts', foundContexts);
  success(`Found ${foundContexts.length} context states`);

  // DEMO 3: Context Transfer
  section('3. Context Transfer Between Agents');
  
  subsection('Transferring context from Agent 1 to Agent 3');
  const transferResult = await ccf.transferContext({
    sourceAgentId: 'agent-1',
    targetAgentId: 'agent-3',
    contextId: agent1ContextResult.contextState.id
  });
  formatOutput('Transfer Result', transferResult);
  success('Context transferred successfully');
  
  subsection('Verifying the transferred context');
  const agent3Contexts = await ccf.findContextStates({
    agentId: 'agent-3'
  });
  formatOutput('Agent 3 Contexts', agent3Contexts);
  success(`Found ${agent3Contexts.length} context states for Agent 3`);

  // DEMO 4: Context Merging
  section('4. Context Merging');
  
  subsection('Merging Agent 1 and Agent 2 contexts');
  const mergeResult = await ccf.mergeContexts({
    contextIds: [
      agent1ContextResult.contextState.id,
      agent2ContextResult.contextState.id
    ],
    strategy: 'union'
  });
  formatOutput('Merged Context', mergeResult);
  success('Contexts merged successfully');
  
  // DEMO 5: Context History Tracking
  section('5. Context History Tracking');
  
  subsection('Tracking context state history');
  const contextHistory = await ccf.getContextHistory(
    agent1ContextResult.contextState.id
  );
  formatOutput('Context History', contextHistory);
  success(`Found ${contextHistory.length} transitions for this context`);
  
  subsection('Tracking agent history');
  const agentHistory = await ccf.getAgentHistory('agent-1');
  formatOutput('Agent History', agentHistory);
  success(`Found ${agentHistory.length} transitions for Agent 1`);

  // DEMO 6: Working with Snapshots
  section('6. Creating and Restoring Snapshots');
  
  subsection('Creating a snapshot of Agent 1 context');
  const snapshotResult = await ccf.createSnapshot({
    agentId: 'agent-1',
    label: 'react-state-management-discussion'
  });
  formatOutput('Snapshot Result', snapshotResult);
  success('Snapshot created successfully');
  
  // Create a new context state for Agent 1
  await ccf.saveContext({
    contextState: {
      agentId: 'agent-1',
      content: {
        topics: ['typescript', 'type-safety'],
        entities: {
          'typescript': { type: 'language', attributes: { extends: 'javascript' } }
        },
        facts: [
          { subject: 'typescript', predicate: 'provides', object: 'static_typing' }
        ]
      }
    },
    sessionId: agent1Session.id
  });
  info('Added new context state to Agent 1');
  
  subsection('Restoring the snapshot');
  const restoreResult = await ccf.restoreSnapshot({
    snapshotId: snapshotResult.snapshot.id
  });
  formatOutput('Restore Result', restoreResult);
  success('Snapshot restored successfully');

  // DEMO 7: Session Completion
  section('7. Ending Sessions');
  
  subsection('Ending Agent 1 session');
  const endedSession = await ccf.endSession(agent1Session.id);
  formatOutput('Ended Session', endedSession);
  success('Session ended successfully');
  
  // Check remaining active sessions
  const remainingActiveSessions = await ccf.findSessions({ status: 'active' });
  info(`${remainingActiveSessions.length} sessions still active`);

  console.log(`\n${colors.bright}${colors.magenta}
╔═════════════════════════════════════════════╗
║                                             ║
║   CCF Demonstration Completed Successfully  ║
║                                             ║
╚═════════════════════════════════════════════╝${colors.reset}
  `);
}

// Run the demo
runDemo().catch(error => {
  console.error(`${colors.red}ERROR: ${error.message}${colors.reset}`);
  console.error(error.stack);
});