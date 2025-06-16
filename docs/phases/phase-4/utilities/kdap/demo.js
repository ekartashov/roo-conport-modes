/**
 * Knowledge-Driven Autonomous Planning (KDAP) - Demo
 * 
 * This file demonstrates the usage of KDAP for autonomous knowledge management.
 * It shows how to initialize KDAP, perform knowledge state analysis, identify gaps,
 * generate and execute acquisition plans, and evaluate their impact.
 * 
 * Usage: node demo.js
 */

// Import KDAP component
const { initializeKDAP } = require('./index');

// Mock ConPort client for demo purposes
const mockConPortClient = {
  fetchKnowledgeContext: async (workspaceId) => {
    console.log(`Fetching knowledge context for workspace: ${workspaceId}`);
    return {
      productContext: {
        name: 'Demo Project',
        description: 'A project demonstrating KDAP capabilities',
        domains: ['domain1', 'domain2', 'domain3']
      },
      activeContext: {
        current_focus: 'Implementation of feature X',
        open_issues: ['Issue with component Y']
      },
      decisions: [
        {
          id: 1,
          summary: 'Selected React for frontend',
          rationale: 'Better component model and ecosystem',
          tags: ['frontend', 'architecture'],
          timestamp: '2025-01-15T10:00:00Z'
        },
        {
          id: 2,
          summary: 'Using PostgreSQL for persistence',
          rationale: 'ACID compliance and rich feature set',
          tags: ['backend', 'database'],
          timestamp: '2025-01-20T14:30:00Z'
        }
      ],
      systemPatterns: [
        {
          id: 1,
          name: 'Repository Pattern',
          description: 'Abstract data access through repositories',
          tags: ['backend', 'architecture']
        }
      ],
      customData: [
        {
          category: 'api-specs',
          key: 'user-service',
          value: {
            endpoints: ['/users', '/users/{id}', '/users/auth']
          }
        }
      ],
      links: [
        {
          source_item_type: 'decision',
          source_item_id: '2',
          target_item_type: 'system_pattern',
          target_item_id: '1',
          relationship_type: 'implements',
          timestamp: '2025-01-22T09:15:00Z'
        }
      ]
    };
  },
  storeKnowledge: async (workspaceId, items) => {
    console.log(`Storing ${items.length} knowledge items in workspace: ${workspaceId}`);
    return { stored: items.map((item, i) => ({ id: `new-${i}` })), errors: [] };
  }
};

// Demo configuration
const config = {
  workspaceId: 'demo-workspace-123',
  analyzerOptions: {
    relationshipThreshold: 0.6
  },
  gapIdentifierOptions: {
    strategies: ['coverage', 'quality', 'freshness'],
    threshold: 0.7
  },
  planGeneratorOptions: {
    prioritizationStrategy: 'impact'
  }
};

// Run the demo
async function runDemo() {
  console.log('=== KDAP Demo ===\n');
  
  console.log('Initializing KDAP...');
  const kdap = initializeKDAP({
    conPortClient: mockConPortClient,
    analyzerOptions: config.analyzerOptions,
    gapIdentifierOptions: config.gapIdentifierOptions,
    planGeneratorOptions: config.planGeneratorOptions
  });
  
  console.log('\n=== Approach 1: Full Autonomous Workflow ===');
  console.log('Running autonomous knowledge improvement workflow...');
  
  const workflowResult = await kdap._integrationManager.runAutonomousWorkflow(
    config.workspaceId, 
    { resources: { time: 10, computational: 5, user_interaction: 2 } }
  );
  
  console.log('Workflow completed with result:');
  console.log(JSON.stringify(workflowResult, null, 2));
  
  console.log('\n=== Approach 2: Step-by-Step Process ===');
  
  // 1. Fetch knowledge context
  console.log('1. Fetching knowledge context...');
  const context = await mockConPortClient.fetchKnowledgeContext(config.workspaceId);
  
  // 2. Analyze knowledge state
  console.log('2. Analyzing knowledge state...');
  const knowledgeState = kdap.analyzeKnowledgeState(context);
  console.log(`Analysis complete. Found ${knowledgeState.knowledgeInventory.summary.totalItems} knowledge items.`);
  
  // 3. Identify knowledge gaps
  console.log('3. Identifying knowledge gaps...');
  const gaps = kdap.identifyGaps(knowledgeState);
  console.log(`Identified ${gaps.length} knowledge gaps.`);
  
  if (gaps.length > 0) {
    // 4. Generate knowledge acquisition plan
    console.log('4. Generating knowledge acquisition plan...');
    const plan = kdap.generatePlan(gaps, { 
      resources: { time: 10, computational: 5, user_interaction: 2 } 
    });
    console.log(`Plan generated with ${plan.activities.length} activities.`);
    
    // 5. Execute the plan (simplified simulation for demo)
    console.log('5. Executing knowledge acquisition plan...');
    const executionResult = { 
      success: true, 
      activities_completed: plan.activities,
      results: {}
    };
    plan.activities.forEach(activity => {
      executionResult.results[activity.id] = {
        status: 'completed',
        outcome: `Simulated outcome for ${activity.type}`
      };
    });
    
    // 6. Evaluate impact
    console.log('6. Evaluating knowledge impact...');
    const afterState = {
      ...knowledgeState,
      knowledgeInventory: {
        ...knowledgeState.knowledgeInventory,
        summary: {
          ...knowledgeState.knowledgeInventory.summary,
          totalItems: knowledgeState.knowledgeInventory.summary.totalItems + 2
        }
      }
    };
    
    const impact = kdap.evaluateImpact(executionResult, plan, knowledgeState, afterState);
    console.log('Impact evaluation complete:');
    console.log(`Overall impact: ${impact.overallImpact}`);
  }
  
  console.log('\nDemo completed successfully!');
}

// Run the demo
runDemo().catch(error => {
  console.error('Demo failed:', error);
});