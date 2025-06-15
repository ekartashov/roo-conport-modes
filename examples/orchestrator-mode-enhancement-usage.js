/**
 * Example usage of the Orchestrator Mode Enhancement
 * 
 * This example demonstrates the key capabilities of the Orchestrator Mode Enhancement:
 * - Mode selection for tasks
 * - Task decomposition
 * - Workflow management
 * - Handoff preparation between modes
 */

// Import required components
const { OrchestratorModeEnhancement } = require('../utilities/mode-enhancements/orchestrator-mode-enhancement');

// Create an instance of the Orchestrator Mode Enhancement
const orchestrator = new OrchestratorModeEnhancement();

console.log('ORCHESTRATOR MODE ENHANCEMENT - USAGE EXAMPLES');
console.log('==============================================');

/**
 * Example 1: Mode Selection for Different Tasks
 */
console.log('\nEXAMPLE 1: MODE SELECTION');
console.log('-------------------------');

const tasks = [
  'Write a function to calculate Fibonacci numbers',
  'Design a microservice architecture for an e-commerce system',
  'Fix the bug in the authentication module',
  'Explain how GraphQL differs from REST',
  'Document the API endpoints for the user service',
  'Optimize this prompt for better AI responses',
  'Create a universal prompt that works across different AI systems',
  'Clean up and organize the ConPort knowledge base'
];

tasks.forEach(task => {
  console.log(`\nTask: "${task}"`);
  const result = orchestrator.selectModeForTask(task);
  console.log(`Selected mode: ${result.selectedMode} (confidence: ${Math.round(result.confidence * 100)}%)`);
  console.log('Top mode scores:');
  
  // Sort modes by score and show top 3
  const sortedModes = Object.entries(result.allModeScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  sortedModes.forEach(([mode, score]) => {
    console.log(`  - ${mode}: ${score}`);
  });
  
  console.log(`Validation passed: ${result.isValid}`);
});

/**
 * Example 2: Task Decomposition
 */
console.log('\nEXAMPLE 2: TASK DECOMPOSITION');
console.log('-----------------------------');

const complexTasks = [
  {
    description: 'Implement a user authentication system with JWT',
    options: { patternName: 'feature_development' }
  },
  {
    description: 'Fix the database connection timeout issue',
    options: { patternName: 'bug_fixing' }
  },
  {
    description: 'Create comprehensive API documentation for the payment service',
    options: { patternName: 'documentation_creation' }
  }
];

complexTasks.forEach(({ description, options }) => {
  console.log(`\nComplex task: "${description}"`);
  const result = orchestrator.decomposeTask(description, options);
  
  console.log(`Decomposed into ${result.subtasks.length} subtasks:`);
  result.subtasks.forEach((subtask, index) => {
    console.log(`  ${index + 1}. ${subtask}`);
  });
  
  console.log(`Validation passed: ${result.isValid}`);
  
  if (!result.isValid && result.validationResult.errors) {
    console.log('Validation errors:', result.validationResult.errors);
  }
});

/**
 * Example 3: Workflow Creation from Template
 */
console.log('\nEXAMPLE 3: WORKFLOW CREATION');
console.log('---------------------------');

// Get available workflow templates
const templates = orchestrator.getAvailableWorkflowTemplates();
console.log('Available workflow templates:');
Object.keys(templates).forEach(templateName => {
  console.log(`  - ${templateName} (${templates[templateName].name})`);
});

// Create a workflow from the development template
const workflowParams = {
  taskParameters: {
    feature: 'user profile management',
    system: 'customer portal'
  }
};

console.log('\nCreating a workflow from "development_workflow" template...');
const workflowResult = orchestrator.createWorkflowFromTemplate('development_workflow', workflowParams);

if (workflowResult.success) {
  console.log(`Workflow created with ID: ${workflowResult.workflowId}`);
  console.log('Workflow steps:');
  
  workflowResult.workflow.steps.forEach((step, index) => {
    console.log(`  ${index + 1}. [${step.mode}] ${step.task}`);
  });
  
  console.log('\nWorkflow transition logic:');
  workflowResult.workflow.transitionRules.forEach(rule => {
    console.log(`  ${rule.from} → ${rule.to} (handoff data: ${rule.handoffData.join(', ')})`);
  });
} else {
  console.log(`Failed to create workflow: ${workflowResult.error}`);
}

/**
 * Example 4: Handoff Preparation
 */
console.log('\nEXAMPLE 4: HANDOFF PREPARATION');
console.log('-----------------------------');

const handoffScenarios = [
  {
    fromMode: 'architect',
    toMode: 'code',
    context: {
      architecture_diagram: 'Microservices architecture with API Gateway',
      component_specifications: 'User service, Product service, Order service',
      interfaces: 'REST APIs with JSON payloads',
      dependencies: 'PostgreSQL, Redis, RabbitMQ'
    }
  },
  {
    fromMode: 'code',
    toMode: 'debug',
    context: {
      implemented_functionality: 'User authentication and authorization',
      known_limitations: 'Rate limiting not implemented',
      test_cases: 'Unit tests for login and registration',
      // Missing expected_behavior
    }
  }
];

handoffScenarios.forEach(scenario => {
  console.log(`\nHandoff from ${scenario.fromMode} to ${scenario.toMode}:`);
  console.log('Context provided:');
  Object.entries(scenario.context).forEach(([key, value]) => {
    console.log(`  - ${key}: ${value}`);
  });
  
  const result = orchestrator.prepareHandoff(scenario.fromMode, scenario.toMode, scenario.context);
  
  console.log(`Handoff validation passed: ${result.isValid}`);
  
  if (!result.isValid && result.validationResult.errors) {
    console.log('Validation errors:', result.validationResult.errors);
  }
  
  if (result.completenessEvaluation.missingElements.length > 0) {
    console.log('Missing context elements:', result.completenessEvaluation.missingElements);
    console.log('Enhanced context with placeholders:');
    
    result.completenessEvaluation.missingElements.forEach(element => {
      console.log(`  - ${element}: ${result.enhancedContext[element]}`);
    });
  }
  
  console.log('Handoff checklist:');
  result.handoffChecklistStatus.forEach(item => {
    const status = item.fulfilled ? '✓' : '✗';
    console.log(`  ${status} ${item.item}`);
  });
});

/**
 * Example 5: Specialized Orchestration Agent
 */
console.log('\nEXAMPLE 5: SPECIALIZED ORCHESTRATION AGENT');
console.log('----------------------------------------');

const agentResult = orchestrator.createSpecializedOrchestrationAgent('prompt_optimization_workflow', {
  domain: 'e-commerce',
  complexity: 'high',
  audience: 'technical'
});

if (agentResult.success) {
  console.log(`Created specialized agent for: ${agentResult.agent.workflowType}`);
  
  // Get step guidance
  const stepGuidance = agentResult.agent.getStepGuidance(2);
  console.log(`\nGuidance for step 2 (${stepGuidance.mode} mode):`);
  console.log('Task indicators:');
  stepGuidance.taskIndicators.forEach(indicator => {
    console.log(`  - ${indicator}`);
  });
  
  // Plan transitions
  const transitionPlan = agentResult.agent.planTransitions();
  console.log('\nTransition plan:');
  transitionPlan.transitions.forEach(transition => {
    console.log(`  ${transition.from} → ${transition.to}`);
  });
  
  // Instantiate a workflow
  const workflowInstance = agentResult.agent.instantiateWorkflow({
    originalPrompt: 'Generate a product description for a luxury watch'
  });
  
  console.log('\nInstantiated workflow:');
  if (workflowInstance.success) {
    console.log(`  ID: ${workflowInstance.workflowId}`);
    console.log(`  Name: ${workflowInstance.workflow.name}`);
  }
} else {
  console.log(`Failed to create specialized agent: ${agentResult.error}`);
}

console.log('\nEnd of Orchestrator Mode Enhancement examples.');