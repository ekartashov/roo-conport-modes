/**
 * Cross-Mode Knowledge Workflows Usage Example
 * 
 * This example demonstrates how to use the Cross-Mode Knowledge Workflows component
 * to manage knowledge context transfer between different modes in a complex task.
 */

// Import required modules
const { createCrossModeWorkflows } = require('../utilities/phase-3/cross-mode-knowledge-workflows/cross-mode-workflows');

// Mock ConPort client for demonstration purposes
const mockConPortClient = {
  log_custom_data: async (args) => ({ 
    saved: true, 
    category: args.category, 
    key: args.key 
  }),
  get_custom_data: async (args) => {
    if (args.key) {
      return { 
        id: args.key, 
        value: { mockData: true } 
      };
    }
    return { 
      'workflow-1': { id: 'workflow-1', name: 'Example Workflow', status: 'in_progress' },
      'workflow-2': { id: 'workflow-2', name: 'Another Workflow', status: 'completed' }
    };
  },
  log_decision: async (args) => ({
    id: `decision-${Date.now()}`,
    summary: args.summary,
    created: true
  }),
  log_system_pattern: async (args) => ({
    id: `pattern-${Date.now()}`,
    name: args.name,
    created: true
  })
};

// Initialize the Cross-Mode Knowledge Workflows system
const workflowManager = createCrossModeWorkflows({
  workspaceId: '/example/workspace',
  conPortClient: mockConPortClient,
  enableValidation: true,
  strictMode: false
});

/**
 * Example 1: Creating and using a feature implementation workflow
 * This workflow demonstrates a common pattern: architect designs → code implements → debug validates
 */
async function featureImplementationWorkflowExample() {
  console.log('\n=== Example 1: Feature Implementation Workflow ===\n');
  
  // Step 1: Define the workflow
  const workflowDefinition = {
    id: 'feature-auth-system',
    name: 'Authentication System Implementation',
    steps: [
      {
        mode: 'architect',
        task: 'Design authentication system architecture'
      },
      {
        mode: 'code',
        task: 'Implement authentication system'
      },
      {
        mode: 'debug',
        task: 'Test and validate authentication implementation'
      },
      {
        mode: 'docs',
        task: 'Document the authentication system'
      }
    ]
  };

  // Initial context with project requirements
  const initialContext = {
    taskDescription: 'Implement a secure authentication system for the web application',
    requirements: [
      'Support email/password login',
      'Implement JWT-based authentication',
      'Add password reset functionality',
      'Include OAuth integration with Google and GitHub'
    ],
    priority: 'high',
    constraints: [
      'Must comply with GDPR requirements',
      'API should handle at least 100 requests per second'
    ]
  };

  // Step 2: Create the workflow
  console.log('Creating workflow...');
  const workflow = await workflowManager.createWorkflow(workflowDefinition, initialContext);
  console.log('Workflow created:', workflow.id);
  console.log('Initial step:', workflow.steps[workflow.currentStepIndex].task);
  console.log('Current mode:', workflow.steps[workflow.currentStepIndex].mode);
  
  // Step 3: Complete the architecture design step
  console.log('\nCompleting architect step...');
  const architectResults = {
    architecturalDecisions: [
      {
        id: 'auth-1',
        decision: 'Use JWT for stateless authentication',
        rationale: 'Enables horizontal scaling without shared session storage'
      },
      {
        id: 'auth-2',
        decision: 'Implement rate limiting middleware',
        rationale: 'Prevents brute force attacks on login endpoints'
      }
    ],
    patterns: [
      {
        name: 'Authentication Middleware Pattern',
        description: 'Express middleware for validating JWT tokens'
      },
      {
        name: 'Token Refresh Pattern',
        description: 'Auto-refresh tokens before expiration'
      }
    ],
    diagrams: {
      authFlow: 'https://example.com/diagrams/auth-flow.png'
    }
  };

  // Step 4: Advance the workflow to the next step (code mode)
  const updatedWorkflow = await workflowManager.advanceWorkflow('feature-auth-system', architectResults);
  console.log('Advanced to code step:', updatedWorkflow.steps[updatedWorkflow.currentStepIndex].task);
  console.log('Current mode:', updatedWorkflow.steps[updatedWorkflow.currentStepIndex].mode);

  // Step 5: Demonstrate knowledge context transfer from architect to code
  console.log('\nTransferring knowledge context from architect to code...');
  const sourceContext = {
    ...initialContext,
    ...architectResults
  };
  
  const transferredContext = await workflowManager.transferKnowledgeContext({
    context: sourceContext,
    sourceMode: 'architect',
    targetMode: 'code',
    workflowId: 'feature-auth-system'
  });
  
  console.log('Transferred context for code mode:');
  console.log('- Context includes implementation guidelines:', !!transferredContext.architecturalContext);
  console.log('- Context includes pattern implementations:', !!transferredContext.patternImplementations);
  
  // Step 6: Complete the code implementation step
  console.log('\nCompleting code implementation step...');
  const codeResults = {
    codeBase: {
      files: [
        'auth/middleware.js',
        'auth/controllers/login.js',
        'auth/services/token.js'
      ],
      coverage: '87%'
    },
    apis: [
      {
        endpoint: '/api/auth/login',
        method: 'POST',
        params: { email: 'string', password: 'string' }
      },
      {
        endpoint: '/api/auth/refresh',
        method: 'POST',
        params: { refreshToken: 'string' }
      }
    ],
    technicalDebt: [
      'OAuth implementation needs refactoring for better provider abstraction'
    ]
  };
  
  // Step 7: Advance the workflow to the debug step
  const updatedWorkflow2 = await workflowManager.advanceWorkflow('feature-auth-system', codeResults);
  console.log('Advanced to debug step:', updatedWorkflow2.steps[updatedWorkflow2.currentStepIndex].task);
  console.log('Current mode:', updatedWorkflow2.steps[updatedWorkflow2.currentStepIndex].mode);
  
  // Step 8: Create cross-mode references between artifacts
  console.log('\nCreating cross-mode references...');
  const reference = await workflowManager.createReference({
    sourceMode: 'architect',
    sourceArtifact: 'auth-1',
    targetMode: 'code',
    targetArtifact: 'auth/services/token.js',
    referenceType: 'implements',
    description: 'JWT token implementation based on architectural decision'
  });
  
  console.log('Created reference:', reference.id);
  
  // Step 9: Export workflow context to ConPort
  console.log('\nExporting workflow to ConPort...');
  const exportResult = await workflowManager.exportWorkflowToConPort(
    'feature-auth-system',
    'completed_workflows',
    'auth_system_implementation'
  );
  
  console.log('Export result:', exportResult);
  
  return { workflowId: workflow.id };
}

/**
 * Example 2: Knowledge continuity in documentation workflows
 * This workflow demonstrates how documentation tasks can preserve knowledge between different tasks
 */
async function documentationWorkflowExample() {
  console.log('\n\n=== Example 2: Documentation Workflow ===\n');
  
  // Step 1: Define a documentation-focused workflow
  const workflowDefinition = {
    id: 'api-docs-workflow',
    name: 'API Documentation Project',
    steps: [
      {
        mode: 'code',
        task: 'Extract API structure from codebase'
      },
      {
        mode: 'docs',
        task: 'Create API documentation'
      },
      {
        mode: 'architect',
        task: 'Review documentation for architectural consistency'
      },
      {
        mode: 'docs',
        task: 'Finalize and publish documentation'
      }
    ]
  };

  // Initial context with project requirements
  const initialContext = {
    taskDescription: 'Create comprehensive API documentation for the backend services',
    requirements: [
      'Document all REST endpoints',
      'Include request/response examples',
      'Add authentication instructions',
      'Create sequence diagrams for complex flows'
    ]
  };

  // Create the workflow
  console.log('Creating documentation workflow...');
  const workflow = await workflowManager.createWorkflow(workflowDefinition, initialContext);
  console.log('Workflow created:', workflow.id);
  console.log('Initial step:', workflow.steps[workflow.currentStepIndex].task);
  
  // Complete the code analysis step
  console.log('\nCompleting code analysis step...');
  const codeAnalysisResults = {
    apiEndpoints: [
      { path: '/users', methods: ['GET', 'POST'], auth: true },
      { path: '/products', methods: ['GET'], auth: false }
    ],
    authSchemes: ['Bearer Token', 'API Key'],
    deprecatedEndpoints: [
      { path: '/legacy/users', replacement: '/users' }
    ]
  };
  
  // Advance to documentation step
  const updatedWorkflow = await workflowManager.advanceWorkflow('api-docs-workflow', codeAnalysisResults);
  console.log('Advanced to documentation step:', updatedWorkflow.steps[updatedWorkflow.currentStepIndex].task);
  
  // Transfer knowledge context
  console.log('\nTransferring knowledge from code to docs mode...');
  const docsContext = await workflowManager.transferKnowledgeContext({
    context: {
      ...initialContext,
      ...codeAnalysisResults
    },
    sourceMode: 'code',
    targetMode: 'docs',
    workflowId: 'api-docs-workflow'
  });
  
  console.log('Transferred context includes:');
  console.log('- API endpoints:', docsContext.sourceContent ? 'Yes' : 'No');
  
  // List all workflows
  console.log('\nListing all active workflows:');
  const allWorkflows = await workflowManager.listWorkflows({ status: 'in_progress' });
  console.log(`Found ${allWorkflows.length} active workflows`);
  
  return { workflowId: workflow.id };
}

/**
 * Example 3: Knowledge serialization and restoration
 * This demonstrates how to serialize workflow context and restore it later
 */
async function contextSerializationExample() {
  console.log('\n\n=== Example 3: Context Serialization ===\n');
  
  const workflowId = 'feature-auth-system';
  
  // Serialize the workflow context
  console.log(`Serializing context for workflow ${workflowId}...`);
  const serialized = await workflowManager.serializeWorkflowContext(workflowId);
  
  console.log('Serialized workflow context:');
  console.log('- Workflow name:', serialized.workflowName);
  console.log('- Serialization time:', serialized.serializationTime);
  console.log('- Context data available:', Object.keys(serialized.contextData).length > 0 ? 'Yes' : 'No');
  
  return serialized;
}

/**
 * Example 4: Cross-mode reference querying
 * This demonstrates how to query for references between modes
 */
async function referenceQueryingExample() {
  console.log('\n\n=== Example 4: Cross-Mode Reference Querying ===\n');
  
  console.log('Querying references from architect mode...');
  const architectReferences = await workflowManager.getReferences({
    mode: 'architect',
    isSource: true
  });
  
  console.log(`Found ${architectReferences.length} references from architect mode`);
  
  console.log('\nQuerying references to code artifacts...');
  const codeReferences = await workflowManager.getReferences({
    mode: 'code',
    isSource: false,
    referenceType: 'implements'
  });
  
  console.log(`Found ${codeReferences.length} implementation references to code artifacts`);
  
  return { architectReferences, codeReferences };
}

// Run the examples
async function runAllExamples() {
  try {
    console.log('=== Cross-Mode Knowledge Workflows Usage Examples ===');
    
    // Run Example 1
    const example1Result = await featureImplementationWorkflowExample();
    
    // Run Example 2
    const example2Result = await documentationWorkflowExample();
    
    // Run Example 3
    const example3Result = await contextSerializationExample();
    
    // Run Example 4
    const example4Result = await referenceQueryingExample();
    
    console.log('\n=== Examples Completed Successfully ===');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Execute all examples
runAllExamples();

/**
 * Additional Example: Using the Cross-Mode Knowledge Workflows component in a Mode extension
 * This shows how this component can be integrated into Mode enhancements
 */

/*
// Example integration with Mode enhancement

const { enhanceArchitectMode } = require('../utilities/mode-enhancements/architect-mode-enhancement');
const { createCrossModeWorkflows } = require('../utilities/phase-3/cross-mode-knowledge-workflows/cross-mode-workflows');

function enhancedModeWithCrossModeWorkflows(options) {
  // Initialize the cross-mode workflows
  const workflows = createCrossModeWorkflows({
    workspaceId: options.workspaceId,
    conPortClient: options.conPortClient
  });
  
  // Get the enhanced architect mode
  const enhancedArchitect = enhanceArchitectMode(options);
  
  // Add cross-mode workflow capabilities
  return {
    ...enhancedArchitect,
    
    // Add method to create a workflow that starts in architect mode
    async createDesignWorkflow(taskDescription, steps) {
      // Start with architect mode as the first step
      const workflowDefinition = {
        id: `design-workflow-${Date.now()}`,
        name: `Design Workflow: ${taskDescription.substr(0, 20)}...`,
        steps: [
          {
            mode: 'architect',
            task: 'Initial architecture design'
          },
          ...steps
        ]
      };
      
      const initialContext = {
        taskDescription,
        timestamp: new Date().toISOString()
      };
      
      return workflows.createWorkflow(workflowDefinition, initialContext);
    },
    
    // Method to transition to another mode with knowledge context
    async transitionToMode(targetMode, context) {
      // Transfer knowledge context to target mode
      const transferredContext = await workflows.transferKnowledgeContext({
        context,
        sourceMode: 'architect',
        targetMode,
        preserveWorkflowContext: true
      });
      
      // Log the transition in ConPort
      await options.conPortClient.log_progress({
        workspace_id: options.workspaceId,
        description: `Transitioned from architect to ${targetMode} mode`,
        status: 'DONE'
      });
      
      return transferredContext;
    }
  };
}
*/