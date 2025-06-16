/**
 * Test file for Cross-Mode Knowledge Workflows component
 * 
 * This file contains tests for all three layers of the component:
 * - Validation Layer
 * - Core Layer
 * - Integration Layer
 */

// Import component modules
const { createCrossModeWorkflowsValidation } = require('./cross-mode-knowledge-workflows-validation');
const { createCrossModeWorkflowsCore } = require('./cross-mode-knowledge-workflows-core');
const { createCrossModeWorkflows } = require('./cross-mode-knowledge-workflows-integration');

// Mock ConPort client
const mockConPortClient = {
  log_custom_data: jest.fn().mockResolvedValue({ success: true }),
  get_custom_data: jest.fn().mockImplementation((params) => {
    if (params.key === 'test-workflow-1') {
      return Promise.resolve({
        id: 'test-workflow-1',
        name: 'Test Workflow',
        steps: [
          { mode: 'architect', task: 'Design feature' },
          { mode: 'code', task: 'Implement feature' }
        ],
        currentStepIndex: 0,
        status: 'in_progress',
        context: { taskDescription: 'Test task' }
      });
    }
    return Promise.resolve(null);
  }),
  log_decision: jest.fn().mockResolvedValue({ id: 'test-decision-1' }),
  log_system_pattern: jest.fn().mockResolvedValue({ id: 'test-pattern-1' })
};

// Mock validation manager
jest.mock('../../conport-validation-manager', () => ({
  ConPortValidationManager: jest.fn().mockImplementation(() => ({
    registerCheckpoint: jest.fn(),
    validate: jest.fn().mockResolvedValue({ valid: true })
  }))
}));

describe('Cross-Mode Knowledge Workflows', () => {
  // Test data
  const workspaceId = '/test/workspace';
  const sampleWorkflowDefinition = {
    id: 'test-workflow-1',
    name: 'Test Workflow',
    steps: [
      { mode: 'architect', task: 'Design feature' },
      { mode: 'code', task: 'Implement feature' }
    ]
  };
  const sampleContext = {
    taskDescription: 'Implement authentication system',
    priority: 'high',
    constraints: ['Must use JWT'],
    codeBase: { files: ['auth.js'] }
  };
  
  describe('Validation Layer', () => {
    let validation;
    
    beforeEach(() => {
      validation = createCrossModeWorkflowsValidation({
        workspaceId,
        conPortClient: mockConPortClient
      });
    });
    
    test('validateWorkflowDefinition should validate valid workflow', () => {
      const result = validation.validateWorkflowDefinition(sampleWorkflowDefinition);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
    
    test('validateWorkflowDefinition should reject invalid workflow', () => {
      const invalidWorkflow = {
        // Missing id and name
        steps: []
      };
      
      const result = validation.validateWorkflowDefinition(invalidWorkflow);
      expect(result.valid).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });
    
    test('validateContextTransfer should validate valid context transfer', async () => {
      const validTransfer = {
        sourceMode: 'code',
        targetMode: 'debug',
        knowledgeContext: {
          taskDescription: 'Debug authentication system',
          priority: 'high'
        }
      };
      
      const result = await validation.validateContextTransfer(validTransfer);
      expect(result.valid).toBe(true);
    });
    
    test('validateContextTransfer should reject invalid context transfer', async () => {
      const invalidTransfer = {
        // Missing sourceMode
        targetMode: 'debug',
        knowledgeContext: {}
      };
      
      const result = await validation.validateContextTransfer(invalidTransfer);
      expect(result.valid).toBe(false);
    });
    
    test('validateCrossModeReference should validate valid reference', () => {
      const validReference = {
        sourceMode: 'code',
        sourceArtifact: 'auth-module',
        targetMode: 'architect',
        targetArtifact: 'auth-design',
        referenceType: 'implements'
      };
      
      const result = validation.validateCrossModeReference(validReference);
      expect(result.valid).toBe(true);
    });
    
    test('validateCrossModeReference should reject invalid reference', () => {
      const invalidReference = {
        sourceMode: 'code',
        // Missing sourceArtifact
        targetMode: 'architect',
        targetArtifact: 'auth-design',
        referenceType: 'invalid-type' // Invalid reference type
      };
      
      const result = validation.validateCrossModeReference(invalidReference);
      expect(result.valid).toBe(false);
    });
  });
  
  describe('Core Layer', () => {
    let core;
    
    beforeEach(() => {
      core = createCrossModeWorkflowsCore({
        workspaceId,
        conPortClient: mockConPortClient
      });
    });
    
    test('serializeKnowledgeContext should serialize context', () => {
      const serialized = core.serializeKnowledgeContext(
        sampleContext,
        'code',
        'debug'
      );
      
      expect(serialized).toBeDefined();
      expect(serialized.__meta).toBeDefined();
      expect(serialized.__meta.sourceMode).toBe('code');
      expect(serialized.__meta.targetMode).toBe('debug');
      expect(serialized.taskDescription).toBe(sampleContext.taskDescription);
      expect(serialized.priority).toBe(sampleContext.priority);
      
      // Check mode-specific transformations
      expect(serialized.codeToDebug).toBeDefined();
    });
    
    test('deserializeKnowledgeContext should deserialize context', () => {
      const serialized = {
        __meta: {
          sourceMode: 'architect',
          targetMode: 'code',
          timestamp: new Date().toISOString()
        },
        taskDescription: 'Implement feature',
        priority: 'medium',
        implementationGuidelines: [
          { decision: 'Use JWT', rationale: 'Security' }
        ]
      };
      
      const deserialized = core.deserializeKnowledgeContext(serialized, 'code');
      
      expect(deserialized).toBeDefined();
      expect(deserialized.__meta).toBeUndefined(); // Metadata should be removed
      expect(deserialized.taskDescription).toBe('Implement feature');
      expect(deserialized.receivedAt).toBeDefined();
      
      // Check mode-specific transformations
      expect(deserialized.architecturalContext).toBeDefined();
      expect(deserialized.implementationGuidelines).toBeUndefined(); // Should be transformed
    });
    
    test('createWorkflow should create a workflow', async () => {
      const workflow = await core.createWorkflow(
        sampleWorkflowDefinition,
        { taskDescription: 'Initial task' }
      );
      
      expect(workflow).toBeDefined();
      expect(workflow.id).toBe(sampleWorkflowDefinition.id);
      expect(workflow.steps).toEqual(sampleWorkflowDefinition.steps);
      expect(workflow.currentStepIndex).toBe(0);
      expect(workflow.status).toBe('initialized');
      expect(workflow.context).toEqual({ taskDescription: 'Initial task' });
      expect(workflow.history).toEqual([]);
      
      // Should have saved to ConPort
      expect(mockConPortClient.log_custom_data).toHaveBeenCalled();
    });
    
    test('advanceWorkflow should advance workflow to next step', async () => {
      // First create a workflow
      await core.createWorkflow(
        sampleWorkflowDefinition,
        { taskDescription: 'Initial task' }
      );
      
      // Then advance it
      const updatedWorkflow = await core.advanceWorkflow(
        'test-workflow-1',
        { architectDesign: 'Auth system design' }
      );
      
      expect(updatedWorkflow).toBeDefined();
      expect(updatedWorkflow.currentStepIndex).toBe(1);
      expect(updatedWorkflow.status).toBe('in_progress');
      expect(updatedWorkflow.context.architectDesign).toBe('Auth system design');
      expect(updatedWorkflow.history).toHaveLength(1);
      
      // Should have updated ConPort
      expect(mockConPortClient.log_custom_data).toHaveBeenCalledTimes(2);
    });
    
    test('transferKnowledgeContext should transfer context between modes', () => {
      const result = core.transferKnowledgeContext({
        context: sampleContext,
        sourceMode: 'code',
        targetMode: 'debug'
      });
      
      expect(result).toBeDefined();
      expect(result.taskDescription).toBe(sampleContext.taskDescription);
      expect(result.priority).toBe(sampleContext.priority);
      
      // Check transformations
      expect(result.targetCode).toBeDefined(); // Transformed from codeBase
    });
  });
  
  describe('Integration Layer', () => {
    let workflows;
    
    beforeEach(() => {
      workflows = createCrossModeWorkflows({
        workspaceId,
        conPortClient: mockConPortClient
      });
    });
    
    test('createWorkflow should create workflow with validation', async () => {
      const result = await workflows.createWorkflow(
        sampleWorkflowDefinition,
        { taskDescription: 'Initial task' }
      );
      
      expect(result).toBeDefined();
      expect(result.id).toBe(sampleWorkflowDefinition.id);
      
      // Should log workflow creation
      expect(mockConPortClient.log_custom_data).toHaveBeenCalled();
      
      // Should log decision
      expect(mockConPortClient.log_decision).toHaveBeenCalled();
    });
    
    test('advanceWorkflow should advance workflow with validation', async () => {
      const result = await workflows.advanceWorkflow(
        'test-workflow-1',
        { designResults: 'Architecture design' }
      );
      
      expect(result).toBeDefined();
      expect(result.currentStepIndex).toBe(1);
      
      // Should log workflow advancement
      expect(mockConPortClient.log_custom_data).toHaveBeenCalled();
      
      // Should log decision for transition
      expect(mockConPortClient.log_decision).toHaveBeenCalled();
    });
    
    test('getWorkflow should get workflow with validation', async () => {
      const result = await workflows.getWorkflow('test-workflow-1');
      
      expect(result).toBeDefined();
      expect(result.id).toBe('test-workflow-1');
    });
    
    test('listWorkflows should list workflows', async () => {
      // Mock implementation for get_custom_data with category filter
      mockConPortClient.get_custom_data.mockImplementationOnce(() => 
        Promise.resolve({
          'test-workflow-1': {
            id: 'test-workflow-1',
            name: 'Test Workflow',
            status: 'in_progress'
          },
          'test-workflow-2': {
            id: 'test-workflow-2',
            name: 'Another Workflow',
            status: 'completed'
          }
        })
      );
      
      const allWorkflows = await workflows.listWorkflows();
      expect(allWorkflows).toHaveLength(2);
      
      const filteredWorkflows = await workflows.listWorkflows({ status: 'completed' });
      expect(filteredWorkflows).toHaveLength(1);
      expect(filteredWorkflows[0].id).toBe('test-workflow-2');
    });
    
    test('transferKnowledgeContext should transfer context with validation', async () => {
      const result = await workflows.transferKnowledgeContext({
        context: sampleContext,
        sourceMode: 'code',
        targetMode: 'debug',
        workflowId: 'test-workflow-1'
      });
      
      expect(result).toBeDefined();
      expect(result.taskDescription).toBe(sampleContext.taskDescription);
      
      // Should log transfer operation
      expect(mockConPortClient.log_custom_data).toHaveBeenCalled();
      
      // Should log system pattern for significant transfers
      expect(mockConPortClient.log_system_pattern).toHaveBeenCalled();
    });
    
    test('createReference should create reference with validation', async () => {
      const reference = {
        sourceMode: 'code',
        sourceArtifact: 'auth-implementation',
        targetMode: 'architect',
        targetArtifact: 'auth-design',
        referenceType: 'implements'
      };
      
      const result = await workflows.createReference(reference);
      
      expect(result).toBeDefined();
      expect(mockConPortClient.log_custom_data).toHaveBeenCalled();
    });
    
    test('exportWorkflowToConPort should export workflow', async () => {
      const result = await workflows.exportWorkflowToConPort(
        'test-workflow-1',
        'workflow_exports',
        'test-export'
      );
      
      expect(result).toBeDefined();
      expect(result.exported).toBe(true);
      expect(result.workflowId).toBe('test-workflow-1');
      expect(mockConPortClient.log_custom_data).toHaveBeenCalled();
    });
    
    test('serializeWorkflowContext should serialize workflow context', async () => {
      const result = await workflows.serializeWorkflowContext('test-workflow-1');
      
      expect(result).toBeDefined();
      expect(result.workflowId).toBe('test-workflow-1');
      expect(result.contextData).toBeDefined();
      expect(result.serializationTime).toBeDefined();
    });
  });
});