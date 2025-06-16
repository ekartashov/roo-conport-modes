/**
 * Cognitive Continuity Framework (CCF) - Tests
 * 
 * Tests the functionality of the CCF component for Phase 4.
 */

const assert = require('assert');

// Import CCF components
const {
  ContinuityCoordinator,
  ContextStateManager,
  ContinuityOperationHandler,
  SessionTracker,
  KnowledgeTransitionTracker,
  InMemoryStorage,
  MergeStrategies,
  validateContextState,
  validateContinuityOperation,
  validateSession,
  validateKnowledgeTransition,
  CCFIntegration,
  ConPortStorageProvider
} = require('../index');

// Mock ConPort client
class MockConPortClient {
  constructor() {
    this.storage = {
      custom_data: {}
    };
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

// Helper functions
function createMockContextState(id = 'ctx1') {
  return {
    id,
    agentId: 'agent1',
    timestamp: Date.now(),
    content: {
      topics: ['topic1', 'topic2'],
      entities: {
        'entity1': { type: 'person', attributes: { name: 'John Doe' } }
      },
      facts: [
        { subject: 'entity1', predicate: 'works_at', object: 'company1' }
      ],
      metadata: {
        source: 'test'
      }
    }
  };
}

function createMockSession(id = 'session1') {
  return {
    id,
    agentId: 'agent1',
    startTime: Date.now(),
    status: 'active',
    metadata: {
      source: 'test'
    }
  };
}

// Test Suite
describe('Cognitive Continuity Framework (CCF)', () => {
  describe('Validation Layer', () => {
    describe('validateContextState', () => {
      it('should validate a valid context state', () => {
        const validState = createMockContextState();
        assert.doesNotThrow(() => validateContextState(validState));
      });

      it('should throw for an invalid context state (missing ID)', () => {
        const invalidState = createMockContextState();
        delete invalidState.id;
        assert.throws(() => validateContextState(invalidState), /Context state must have an ID/);
      });

      it('should throw for an invalid context state (missing content)', () => {
        const invalidState = createMockContextState();
        delete invalidState.content;
        assert.throws(() => validateContextState(invalidState), /Context state must have content/);
      });
    });

    describe('validateContinuityOperation', () => {
      it('should validate a valid save operation', () => {
        const validOp = {
          operation: 'save',
          contextState: createMockContextState()
        };
        assert.doesNotThrow(() => validateContinuityOperation(validOp));
      });

      it('should throw for an unknown operation', () => {
        const invalidOp = {
          operation: 'unknown',
          contextState: createMockContextState()
        };
        assert.throws(() => validateContinuityOperation(invalidOp), /Unknown continuity operation/);
      });

      it('should throw for a save operation without contextState', () => {
        const invalidOp = {
          operation: 'save'
        };
        assert.throws(() => validateContinuityOperation(invalidOp), /Save operation requires a contextState/);
      });
    });

    describe('validateSession', () => {
      it('should validate a valid session', () => {
        const validSession = createMockSession();
        assert.doesNotThrow(() => validateSession(validSession));
      });

      it('should throw for an invalid session (missing ID)', () => {
        const invalidSession = createMockSession();
        delete invalidSession.id;
        assert.throws(() => validateSession(invalidSession), /Session must have an ID/);
      });
    });
  });

  describe('Core Layer', () => {
    describe('InMemoryStorage', () => {
      let storage;

      beforeEach(() => {
        storage = new InMemoryStorage();
      });

      it('should save and retrieve a context state', async () => {
        const contextState = createMockContextState();
        await storage.saveContextState(contextState);
        const retrieved = await storage.getContextState(contextState.id);
        assert.deepStrictEqual(retrieved, contextState);
      });

      it('should find context states by criteria', async () => {
        const contextState1 = createMockContextState('ctx1');
        const contextState2 = createMockContextState('ctx2');
        contextState2.agentId = 'agent2';

        await storage.saveContextState(contextState1);
        await storage.saveContextState(contextState2);

        const results = await storage.findContextStates({ agentId: 'agent1' });
        assert.strictEqual(results.length, 1);
        assert.strictEqual(results[0].id, 'ctx1');
      });

      it('should update a context state', async () => {
        const contextState = createMockContextState();
        await storage.saveContextState(contextState);
        
        const updated = { ...contextState, content: { ...contextState.content, topics: ['topic3'] } };
        await storage.updateContextState(contextState.id, updated);
        
        const retrieved = await storage.getContextState(contextState.id);
        assert.deepStrictEqual(retrieved, updated);
      });

      it('should delete a context state', async () => {
        const contextState = createMockContextState();
        await storage.saveContextState(contextState);
        
        const success = await storage.deleteContextState(contextState.id);
        assert.strictEqual(success, true);
        
        const retrieved = await storage.getContextState(contextState.id);
        assert.strictEqual(retrieved, null);
      });
    });

    describe('ContextStateManager', () => {
      let storage;
      let manager;

      beforeEach(() => {
        storage = new InMemoryStorage();
        manager = new ContextStateManager({ storage });
      });

      it('should create a context state', async () => {
        const contextData = {
          agentId: 'agent1',
          content: {
            topics: ['test']
          }
        };

        const created = await manager.createContextState(contextData);
        assert.ok(created.id);
        assert.strictEqual(created.agentId, 'agent1');
        assert.deepStrictEqual(created.content.topics, ['test']);
      });

      it('should get a context state by ID', async () => {
        const contextState = createMockContextState();
        await storage.saveContextState(contextState);

        const retrieved = await manager.getContextState(contextState.id);
        assert.deepStrictEqual(retrieved, contextState);
      });

      it('should find context states by criteria', async () => {
        const contextState1 = createMockContextState('ctx1');
        const contextState2 = createMockContextState('ctx2');
        contextState2.agentId = 'agent2';

        await storage.saveContextState(contextState1);
        await storage.saveContextState(contextState2);

        const results = await manager.findContextStates({ agentId: 'agent2' });
        assert.strictEqual(results.length, 1);
        assert.strictEqual(results[0].id, 'ctx2');
      });

      it('should merge context states', async () => {
        const contextState1 = createMockContextState('ctx1');
        const contextState2 = createMockContextState('ctx2');
        
        contextState1.content.topics = ['topic1', 'topic2'];
        contextState2.content.topics = ['topic2', 'topic3'];
        
        await storage.saveContextState(contextState1);
        await storage.saveContextState(contextState2);

        const merged = await manager.mergeContextStates(['ctx1', 'ctx2'], 'union');
        assert.ok(merged.id);
        assert.deepStrictEqual(merged.content.topics.sort(), ['topic1', 'topic2', 'topic3'].sort());
      });
    });

    describe('SessionTracker', () => {
      let storage;
      let tracker;

      beforeEach(() => {
        storage = new InMemoryStorage();
        tracker = new SessionTracker({ storage });
      });

      it('should start a session', async () => {
        const session = {
          id: 'session1',
          agentId: 'agent1'
        };

        const started = await tracker.startSession(session);
        assert.strictEqual(started.id, 'session1');
        assert.strictEqual(started.status, 'active');
        assert.ok(started.startTime);
      });

      it('should end a session', async () => {
        const session = {
          id: 'session1',
          agentId: 'agent1'
        };

        await tracker.startSession(session);
        const ended = await tracker.endSession('session1');
        
        assert.strictEqual(ended.id, 'session1');
        assert.strictEqual(ended.status, 'ended');
        assert.ok(ended.endTime);
      });

      it('should find active sessions for an agent', async () => {
        const session1 = { id: 'session1', agentId: 'agent1' };
        const session2 = { id: 'session2', agentId: 'agent1' };
        const session3 = { id: 'session3', agentId: 'agent2' };
        
        await tracker.startSession(session1);
        await tracker.startSession(session2);
        await tracker.startSession(session3);
        
        const sessions = await tracker.findSessions({ agentId: 'agent1', status: 'active' });
        assert.strictEqual(sessions.length, 2);
      });
    });

    describe('KnowledgeTransitionTracker', () => {
      let storage;
      let tracker;

      beforeEach(() => {
        storage = new InMemoryStorage();
        tracker = new KnowledgeTransitionTracker({ storage });
      });

      it('should record a transition', async () => {
        const transition = {
          operation: 'save',
          source: { contextId: null },
          target: { contextId: 'ctx1' },
          agentId: 'agent1',
          sessionId: 'session1'
        };

        const recorded = await tracker.recordTransition(transition);
        assert.ok(recorded.id);
        assert.strictEqual(recorded.operation, 'save');
        assert.strictEqual(recorded.target.contextId, 'ctx1');
      });

      it('should get transitions for a context', async () => {
        const transition1 = {
          operation: 'save',
          source: { contextId: null },
          target: { contextId: 'ctx1' },
          agentId: 'agent1',
          sessionId: 'session1'
        };
        
        const transition2 = {
          operation: 'update',
          source: { contextId: 'ctx1' },
          target: { contextId: 'ctx1' },
          agentId: 'agent1',
          sessionId: 'session1'
        };
        
        await tracker.recordTransition(transition1);
        await tracker.recordTransition(transition2);
        
        const transitions = await tracker.getContextTransitions('ctx1');
        assert.strictEqual(transitions.length, 2);
      });

      it('should get transitions for an agent', async () => {
        const transition1 = {
          operation: 'save',
          source: { contextId: null },
          target: { contextId: 'ctx1' },
          agentId: 'agent1',
          sessionId: 'session1'
        };
        
        const transition2 = {
          operation: 'save',
          source: { contextId: null },
          target: { contextId: 'ctx2' },
          agentId: 'agent2',
          sessionId: 'session2'
        };
        
        await tracker.recordTransition(transition1);
        await tracker.recordTransition(transition2);
        
        const transitions = await tracker.getAgentTransitions('agent1');
        assert.strictEqual(transitions.length, 1);
        assert.strictEqual(transitions[0].agentId, 'agent1');
      });
    });

    describe('ContinuityOperationHandler', () => {
      let storage;
      let contextManager;
      let transitionTracker;
      let handler;

      beforeEach(() => {
        storage = new InMemoryStorage();
        contextManager = new ContextStateManager({ storage });
        transitionTracker = new KnowledgeTransitionTracker({ storage });
        handler = new ContinuityOperationHandler({ 
          contextManager, 
          transitionTracker 
        });
      });

      it('should handle a save operation', async () => {
        const contextState = createMockContextState();
        
        const request = {
          operation: 'save',
          contextState,
          sessionId: 'session1'
        };
        
        const result = await handler.executeOperation(request);
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.operation, 'save');
        assert.ok(result.contextState);
        assert.ok(result.transition);
      });

      it('should handle a load operation', async () => {
        const contextState = createMockContextState();
        await storage.saveContextState(contextState);
        
        const request = {
          operation: 'load',
          contextId: contextState.id,
          sessionId: 'session1'
        };
        
        const result = await handler.executeOperation(request);
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.operation, 'load');
        assert.deepStrictEqual(result.contextState, contextState);
      });

      it('should handle a transfer operation', async () => {
        const contextState = createMockContextState();
        contextState.agentId = 'agent1';
        await storage.saveContextState(contextState);
        
        const request = {
          operation: 'transfer',
          sourceAgentId: 'agent1',
          targetAgentId: 'agent2',
          contextId: contextState.id
        };
        
        const result = await handler.executeOperation(request);
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.operation, 'transfer');
        assert.strictEqual(result.contextState.agentId, 'agent2');
      });

      it('should handle a merge operation', async () => {
        const contextState1 = createMockContextState('ctx1');
        const contextState2 = createMockContextState('ctx2');
        
        contextState1.content.topics = ['topic1', 'topic2'];
        contextState2.content.topics = ['topic2', 'topic3'];
        
        await storage.saveContextState(contextState1);
        await storage.saveContextState(contextState2);
        
        const request = {
          operation: 'merge',
          contextIds: ['ctx1', 'ctx2'],
          strategy: 'union'
        };
        
        const result = await handler.executeOperation(request);
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.operation, 'merge');
        assert.deepStrictEqual(result.contextState.content.topics.sort(), ['topic1', 'topic2', 'topic3'].sort());
      });
    });

    describe('ContinuityCoordinator', () => {
      let storage;
      let coordinator;

      beforeEach(() => {
        storage = new InMemoryStorage();
        coordinator = new ContinuityCoordinator({ storage });
      });

      it('should execute a save operation', async () => {
        const contextState = createMockContextState();
        
        const request = {
          operation: 'save',
          contextState,
          sessionId: 'session1'
        };
        
        const result = await coordinator.execute(request);
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.operation, 'save');
        assert.ok(result.contextState);
      });

      it('should execute a load operation', async () => {
        const contextState = createMockContextState();
        await storage.saveContextState(contextState);
        
        const request = {
          operation: 'load',
          contextId: contextState.id
        };
        
        const result = await coordinator.execute(request);
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.operation, 'load');
        assert.deepStrictEqual(result.contextState, contextState);
      });

      it('should start and end a session', async () => {
        const session = {
          id: 'session1',
          agentId: 'agent1'
        };
        
        const started = await coordinator.startSession(session);
        assert.strictEqual(started.status, 'active');
        
        const ended = await coordinator.endSession('session1');
        assert.strictEqual(ended.status, 'ended');
      });

      it('should get context history', async () => {
        const contextState = createMockContextState();
        
        // Save the context state, which should record a transition
        await coordinator.execute({
          operation: 'save',
          contextState
        });
        
        const history = await coordinator.getContextHistory(contextState.id);
        assert.strictEqual(history.length, 1);
        assert.strictEqual(history[0].operation, 'save');
      });

      it('should get agent history', async () => {
        const contextState = createMockContextState();
        contextState.agentId = 'agent1';
        
        // Save the context state, which should record a transition
        await coordinator.execute({
          operation: 'save',
          contextState
        });
        
        const history = await coordinator.getAgentHistory('agent1');
        assert.strictEqual(history.length, 1);
        assert.strictEqual(history[0].agentId, 'agent1');
      });
    });
  });

  describe('Integration Layer', () => {
    describe('ConPortStorageProvider', () => {
      let conportClient;
      let provider;

      beforeEach(() => {
        conportClient = new MockConPortClient();
        provider = new ConPortStorageProvider({
          conportClient,
          workspaceId: 'test-workspace'
        });
      });

      it('should save and retrieve a context state', async () => {
        const contextState = createMockContextState();
        await provider.saveContextState(contextState);
        
        const retrieved = await provider.getContextState(contextState.id);
        assert.deepStrictEqual(retrieved, contextState);
      });

      it('should find context states matching criteria', async () => {
        const contextState1 = createMockContextState('ctx1');
        const contextState2 = createMockContextState('ctx2');
        contextState2.agentId = 'agent2';
        
        await provider.saveContextState(contextState1);
        await provider.saveContextState(contextState2);
        
        const results = await provider.findContextStates({ agentId: 'agent2' });
        assert.strictEqual(results.length, 1);
        assert.strictEqual(results[0].id, 'ctx2');
      });

      it('should delete a context state', async () => {
        const contextState = createMockContextState();
        await provider.saveContextState(contextState);
        
        const success = await provider.deleteContextState(contextState.id);
        assert.strictEqual(success, true);
        
        const retrieved = await provider.getContextState(contextState.id);
        assert.strictEqual(retrieved, null);
      });
    });

    describe('CCFIntegration', () => {
      let conportClient;
      let integration;

      beforeEach(() => {
        conportClient = new MockConPortClient();
        integration = new CCFIntegration({
          conportClient,
          workspaceId: 'test-workspace'
        });
      });

      it('should save a context state', async () => {
        const contextState = createMockContextState();
        const result = await integration.saveContext({ contextState });
        
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.operation, 'save');
        assert.ok(result.contextState);
      });

      it('should load a context state', async () => {
        const contextState = createMockContextState();
        await integration.saveContext({ contextState });
        
        const result = await integration.loadContext({ contextId: contextState.id });
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.operation, 'load');
        assert.deepStrictEqual(result.contextState.id, contextState.id);
      });

      it('should find context states', async () => {
        const contextState1 = createMockContextState('ctx1');
        const contextState2 = createMockContextState('ctx2');
        contextState2.agentId = 'agent2';
        
        await integration.saveContext({ contextState: contextState1 });
        await integration.saveContext({ contextState: contextState2 });
        
        const results = await integration.findContextStates({ agentId: 'agent2' });
        assert.strictEqual(results.length, 1);
        assert.strictEqual(results[0].id, 'ctx2');
      });

      it('should start and end a session', async () => {
        const session = await integration.startSession({ agentId: 'agent1' });
        assert.strictEqual(session.status, 'active');
        
        const ended = await integration.endSession(session.id);
        assert.strictEqual(ended.status, 'ended');
      });

      it('should merge context states', async () => {
        const contextState1 = createMockContextState('ctx1');
        const contextState2 = createMockContextState('ctx2');
        
        contextState1.content.topics = ['topic1', 'topic2'];
        contextState2.content.topics = ['topic2', 'topic3'];
        
        await integration.saveContext({ contextState: contextState1 });
        await integration.saveContext({ contextState: contextState2 });
        
        const result = await integration.mergeContexts({ 
          contextIds: ['ctx1', 'ctx2'],
          strategy: 'union'
        });
        
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.operation, 'merge');
        assert.deepStrictEqual(result.contextState.content.topics.sort(), ['topic1', 'topic2', 'topic3'].sort());
      });
    });
  });
});