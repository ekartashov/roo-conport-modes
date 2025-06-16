/**
 * Example usage of the Cross-Mode Knowledge Workflows system
 * 
 * This example demonstrates how to use the Cross-Mode Knowledge Workflows
 * system to enable seamless knowledge sharing and coordination between different
 * Roo modes.
 */

// Import the cross-mode workflows system
const { createCrossModeWorkflows } = require('../../utilities/phase-3/cross-mode-knowledge-workflows/cross-mode-workflows');

// Mock ConPort client for the example
const mockConPortClient = {
  async get_active_context({ workspace_id }) {
    console.log(`[ConPort] Getting active context for workspace ${workspace_id}`);
    return { current_focus: 'E-commerce Platform Development' };
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
      { id: 123, summary: 'Use microservices architecture', rationale: 'Better scalability and team autonomy', tags: ['architecture', 'backend'] },
      { id: 124, summary: 'Implement React for frontend', rationale: 'Component reusability and performance', tags: ['frontend', 'UI'] }
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
      { id: 234, name: 'API Gateway Pattern', description: 'Single entry point for all clients', tags: ['architecture', 'API'] }
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
      { id: 345, description: 'Design system architecture', status: 'DONE' },
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
    if (category === 'cross_mode_workflows') {
      return { value: [] };
    }
    return { value: { example: 'data' } };
  }
};

// Mock mode switching function for the example
function simulateModeSwitch(fromMode, toMode) {
  console.log(`[System] Switching from ${fromMode} mode to ${toMode} mode`);
  console.log(`[System] Mode successfully switched to ${toMode}`);
  return { success: true };
}

// Define predefined workflow templates for the example
const predefinedWorkflows = {
  'requirements-to-implementation': {
    name: 'Requirements to Implementation',
    description: 'Transform requirements into working code',
    stages: [
      { modeSlug: 'ask', name: 'Requirements Analysis', outputs: ['clarified_requirements'] },
      { modeSlug: 'architect', name: 'Architecture Design', outputs: ['system_design', 'architectural_decisions'] },
      { modeSlug: 'code', name: 'Implementation', outputs: ['code_artifacts'] },
      { modeSlug: 'debug', name: 'Testing & Debugging' }
    ]
  },
  'feature-enhancement': {
    name: 'Feature Enhancement',
    description: 'Enhance an existing feature with new capabilities',
    stages: [
      { modeSlug: 'ask', name: 'Feature Analysis' },
      { modeSlug: 'code', name: 'Implementation' },
      { modeSlug: 'debug', name: 'Testing' }
    ]
  }
};

// Run the example
async function runExample() {
  console.log('=== Cross-Mode Knowledge Workflows Example ===\n');
  
  try {
    // Initialize the workflow manager
    console.log('1. Initializing the Cross-Mode Knowledge Workflows System');
    const workflowManager = createCrossModeWorkflows({
      workspaceId: '/projects/ecommerce-platform',
      conPortClient: mockConPortClient,
      enableValidation: true,
      defaultWorkflows: predefinedWorkflows,
      logger: {
        info: (msg) => console.log(`[Info] ${msg}`),
        warn: (msg) => console.log(`[Warning] ${msg}`),
        error: (msg) => console.log(`[Error] ${msg}`)
      }
    });
    
    await workflowManager.initialize();
    console.log('✓ Workflow manager initialized\n');
    
    // Define a custom workflow
    console.log('2. Defining a Custom Workflow');
    const workflow = await workflowManager.defineWorkflow({
      workflowId: 'payment-system-development',
      name: 'Payment System Development',
      description: 'Develop secure payment processing system',
      stages: [
        {
          modeSlug: 'ask',
          name: 'Requirements Gathering',
          outputs: ['payment_requirements', 'security_requirements']
        },
        {
          modeSlug: 'architect',
          name: 'Payment System Design',
          inputs: ['payment_requirements', 'security_requirements'],
          outputs: ['payment_architecture', 'security_patterns']
        },
        {
          modeSlug: 'code',
          name: 'Payment System Implementation',
          inputs: ['payment_architecture', 'security_patterns'],
          outputs: ['payment_code', 'integration_tests']
        },
        {
          modeSlug: 'debug',
          name: 'Security Testing',
          inputs: ['payment_code', 'security_requirements'],
          outputs: ['security_test_results']
        }
      ],
      transitionHandlers: {
        'ask-to-architect': async (context) => {
          console.log('[Workflow] Transitioning requirements to architecture stage');
          return { ...context, transition_metadata: { timestamp: new Date().toISOString() } };
        },
        'architect-to-code': async (context) => {
          console.log('[Workflow] Transitioning architecture to implementation stage');
          return { ...context, transition_metadata: { timestamp: new Date().toISOString() } };
        }
      }
    });
    
    console.log(`✓ Defined workflow: ${workflow.name}`);
    console.log(`✓ Stages: ${workflow.stages.map(s => s.name).join(' → ')}`);
    console.log('✓ Workflow definition complete\n');
    
    // Start a workflow instance
    console.log('3. Starting a Workflow Instance');
    const workflowInstance = await workflowManager.startWorkflow({
      workflowId: 'payment-system-development',
      context: {
        project: 'ecommerce-platform',
        version: '2.0',
        initialData: {
          payment_requirements: 'Support credit cards and digital wallets with 3D Secure',
          security_requirements: 'PCI DSS compliance required'
        }
      }
    });
    
    console.log(`✓ Started workflow instance: ${workflowInstance.instanceId}`);
    console.log(`✓ Current stage: ${workflowInstance.currentStage.name}`);
    console.log('✓ Workflow instance started\n');
    
    // Transfer context between modes
    console.log('4. Transferring Context from Ask to Architect Mode');
    const transferResult = await workflowManager.transferContext({
      fromModeSlug: 'ask',
      toModeSlug: 'architect',
      context: {
        requirements: {
          payment_requirements: 'Support credit cards and digital wallets with 3D Secure',
          security_requirements: 'PCI DSS compliance required, data encryption at rest and in transit'
        },
        constraints: ['Must integrate with existing user accounts', 'Go-live deadline in 6 weeks']
      },
      transferOptions: {
        includeDecisions: true,
        includeSystemPatterns: true,
        filterByTags: ['payment', 'security']
      }
    });
    
    console.log('✓ Context transfer results:');
    console.log(`  Transfer successful: ${transferResult.success}`);
    console.log(`  Artifacts transferred: ${transferResult.artifactsTransferred}`);
    
    // Simulate mode switch (would be handled by the platform)
    simulateModeSwitch('ask', 'architect');
    console.log('✓ Context transfer complete\n');
    
    // Transition to the next workflow stage
    console.log('5. Transitioning to Next Workflow Stage');
    const transitionResult = await workflowManager.transitionToStage({
      workflowInstanceId: workflowInstance.instanceId,
      fromStage: 'Requirements Gathering',
      toStage: 'Payment System Design',
      context: {
        payment_requirements: 'Support credit cards, PayPal, and Apple Pay with 3D Secure',
        security_requirements: 'PCI DSS compliance required, data encryption, audit logging'
      }
    });
    
    console.log('✓ Stage transition results:');
    console.log(`  Transition successful: ${transitionResult.success}`);
    console.log(`  New stage: ${transitionResult.newStage.name}`);
    console.log('✓ Stage transition complete\n');
    
    // Augment context with additional knowledge
    console.log('6. Augmenting Context with Related Knowledge');
    const augmentedContext = await workflowManager.augmentContext({
      modeSlug: 'architect',
      baseContext: {
        payment_architecture: 'Microservice-based payment processing system'
      },
      augmentationOptions: {
        includeRecentDecisions: true,
        includeRelatedPatterns: true,
        includeRelevantProgress: true,
        depth: 2
      }
    });
    
    console.log('✓ Context augmentation results:');
    console.log(`  Related decisions added: ${augmentedContext.relatedDecisions.length}`);
    console.log(`  Related patterns added: ${augmentedContext.relatedPatterns.length}`);
    console.log('✓ Context augmentation complete\n');
    
    // Create a coordination session
    console.log('7. Creating a Multi-Mode Coordination Session');
    const coordinationSession = await workflowManager.createCoordinationSession({
      sessionId: 'payment-security-coordination',
      participatingModes: ['architect', 'code', 'debug'],
      task: 'Implement secure payment processing',
      knowledgeSpace: 'payment-system'
    });
    
    console.log(`✓ Created coordination session: ${coordinationSession.sessionId}`);
    console.log(`✓ Participating modes: ${coordinationSession.participatingModes.join(', ')}`);
    console.log('✓ Coordination session created\n');
    
    // Add mode-specific contribution
    console.log('8. Adding Mode-Specific Contribution');
    const contributionResult = await workflowManager.contributeToSession({
      sessionId: 'payment-security-coordination',
      contributingMode: 'architect',
      contribution: {
        type: 'security_pattern',
        content: {
          name: 'Tokenization Pattern',
          description: 'Replace sensitive payment data with non-sensitive tokens'
        }
      }
    });
    
    console.log('✓ Contribution results:');
    console.log(`  Contribution added: ${contributionResult.success}`);
    console.log(`  Shared with modes: ${contributionResult.sharedWithModes.join(', ')}`);
    console.log('✓ Contribution added to session\n');
    
    // Route knowledge to appropriate mode
    console.log('9. Routing Knowledge to Appropriate Mode');
    const routingResult = await workflowManager.routeKnowledge({
      knowledge: {
        type: 'security_vulnerability',
        content: {
          description: 'Potential SQL injection in payment processing',
          severity: 'high',
          code_references: ['payment-processor.js:123']
        }
      },
      routingOptions: {
        preferredModes: ['debug', 'code'],
        routingStrategy: 'content-based'
      }
    });
    
    console.log('✓ Knowledge routing results:');
    console.log(`  Target mode: ${routingResult.targetMode}`);
    console.log(`  Routing confidence: ${routingResult.confidence.toFixed(2)}`);
    console.log(`  Context adapted for target mode: ${routingResult.contextAdapted}`);
    console.log('✓ Knowledge routing complete\n');
    
    // Set up handoff between modes
    console.log('10. Setting Up Handoff Between Modes');
    const handoffResult = await workflowManager.prepareHandoff({
      fromMode: 'architect',
      toMode: 'code',
      task: 'Implement payment gateway integration',
      context: {
        architecture: 'Payment gateway microservice with API endpoints',
        decisions: [
          { id: 'D1', summary: 'Use Stripe as payment processor' },
          { id: 'D2', summary: 'Implement separate fraud detection service' }
        ],
        patterns: [
          { id: 'P1', name: 'Circuit Breaker Pattern' },
          { id: 'P2', name: 'Retry with Exponential Backoff' }
        ]
      },
      handoffInstructions: 'Focus on implementing the API endpoints securely'
    });
    
    console.log('✓ Handoff preparation results:');
    console.log(`  Handoff ready: ${handoffResult.ready}`);
    console.log(`  Handoff ID: ${handoffResult.handoffId}`);
    console.log('✓ Handoff preparation complete\n');
    
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
 * 1. Multi-Phase Projects
 *    Guide projects through their entire lifecycle, from requirements gathering
 *    to architecture, implementation, testing, and deployment, while maintaining
 *    consistent knowledge across all phases.
 * 
 * 2. Collaborative Problem Solving
 *    Enable multiple specialized modes to work together on complex problems,
 *    with each mode contributing its expertise while maintaining shared context.
 * 
 * 3. Knowledge Transfer
 *    Facilitate smooth handoffs between teams with different specialties,
 *    ensuring critical context and decisions aren't lost during transitions.
 * 
 * 4. Mode Orchestration
 *    Coordinate the activities of multiple modes to accomplish complex tasks
 *    that require diverse expertise and capabilities.
 * 
 * 5. Context Preservation
 *    Maintain critical context as users switch between modes, eliminating
 *    the need to repeatedly explain the same information to different modes.
 */