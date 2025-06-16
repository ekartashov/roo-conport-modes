/**
 * Adaptive Knowledge Application Framework (AKAF) - Demo
 * 
 * This file demonstrates the usage of AKAF for adapting and applying knowledge
 * based on contextual factors. It shows how to initialize AKAF, process context,
 * retrieve and apply knowledge, and collect feedback.
 * 
 * Usage: node demo.js
 */

// Import the AKAF component
const { initializeAKAF } = require('./index');

// Mock ConPort client for demo purposes
const mockConPortClient = {
  getCustomData: async (category, key) => {
    console.log(`Fetching custom data: ${category}/${key}`);
    if (category === 'strategies' && key === 'context_adapters') {
      return {
        strategies: [
          {
            id: 'domain_specific',
            name: 'Domain-Specific Adaptation',
            applicability: ['technical', 'business', 'process']
          },
          {
            id: 'audience_focused',
            name: 'Audience-Focused Adaptation',
            applicability: ['technical', 'non-technical', 'mixed']
          }
        ]
      };
    }
    
    if (category === 'patterns' && key === 'application_patterns') {
      return {
        patterns: [
          {
            id: 'explanation',
            name: 'Explanatory Pattern',
            purpose: 'Provide detailed explanations',
            context: ['teaching', 'documentation']
          },
          {
            id: 'decision_support',
            name: 'Decision Support Pattern',
            purpose: 'Aid in making informed decisions',
            context: ['planning', 'architecture']
          }
        ]
      };
    }
    
    return null;
  },
  searchDecisions: async (query) => {
    console.log(`Searching decisions for: ${query}`);
    return {
      items: [
        {
          id: 1,
          summary: 'Selected React for frontend',
          rationale: 'Better component model and ecosystem',
          tags: ['frontend', 'architecture']
        },
        {
          id: 2,
          summary: 'Using PostgreSQL for persistence',
          rationale: 'ACID compliance and rich feature set',
          tags: ['backend', 'database']
        }
      ]
    };
  },
  logCustomData: async (category, key, value) => {
    console.log(`Logging feedback to ConPort: ${category}/${key}`);
    return { success: true };
  }
};

// Demo configuration
const config = {
  customStrategies: {
    'timeline_based': {
      name: 'Timeline-Based Adaptation',
      process: (knowledge, context) => {
        console.log('Applying timeline-based adaptation...');
        if (context.timeframe === 'historical') {
          return {
            ...knowledge,
            content: `HISTORICAL CONTEXT: ${knowledge.content}`
          };
        } else if (context.timeframe === 'future') {
          return {
            ...knowledge,
            content: `FUTURE PROJECTION: ${knowledge.content}`
          };
        }
        return knowledge;
      }
    }
  },
  customPatterns: {
    'comparative': {
      name: 'Comparative Analysis Pattern',
      apply: (knowledge, context) => {
        console.log('Applying comparative analysis pattern...');
        return {
          type: 'comparison',
          title: 'Comparative Analysis',
          content: `Comparing options: ${knowledge.map(k => k.summary).join(' vs. ')}`,
          recommendation: 'Based on the analysis, option X is recommended.'
        };
      }
    }
  }
};

// Sample contexts to demonstrate AKAF in action
const demoContexts = [
  {
    id: 'context-1',
    domain: 'frontend',
    audience: 'technical',
    purpose: 'documentation',
    complexity: 'high',
    timeframe: 'current'
  },
  {
    id: 'context-2',
    domain: 'database',
    audience: 'non-technical',
    purpose: 'decision-making',
    complexity: 'medium',
    timeframe: 'future'
  }
];

// Run the demo
async function runDemo() {
  console.log('=== AKAF Demo ===\n');
  
  console.log('Initializing AKAF...');
  const akaf = initializeAKAF({
    conportClient: mockConPortClient,
    customStrategies: config.customStrategies,
    customPatterns: config.customPatterns
  });
  
  console.log('\n=== Processing Different Contexts ===');
  
  for (const context of demoContexts) {
    console.log(`\nProcessing context ${context.id}: ${context.domain} / ${context.audience}`);
    
    // 1. Prepare context
    console.log('1. Preparing context...');
    const preparedContext = await akaf.prepareContext(context);
    console.log(`Context prepared with ${Object.keys(preparedContext).length} properties`);
    
    // 2. Process the context to retrieve and adapt knowledge
    console.log('2. Processing context to retrieve and adapt knowledge...');
    const result = await akaf.processContext(preparedContext);
    
    console.log('Process completed with result:');
    console.log(`- Knowledge items: ${result.knowledgeItems.length}`);
    console.log(`- Applied strategies: ${result.appliedStrategies.join(', ')}`);
    console.log(`- Applied patterns: ${result.appliedPatterns.join(', ')}`);
    console.log(`- Adaptation score: ${result.adaptationScore}`);
    
    // 3. Simulate user interaction and feedback
    console.log('3. Collecting user feedback...');
    const feedback = {
      contextId: context.id,
      rating: 4.5, // out of 5
      comments: 'Knowledge was well-adapted to my needs.',
      helpfulness: true
    };
    
    const feedbackResult = await akaf._integration.collectFeedback(preparedContext, result, feedback);
    console.log(`Feedback logged: ${feedbackResult.success ? 'success' : 'failure'}`);
  }
  
  // 4. Get performance metrics
  console.log('\n4. Retrieving performance metrics...');
  const metrics = await akaf.getMetrics();
  console.log('AKAF Performance Metrics:');
  console.log(`- Total contexts processed: ${metrics.contextsProcessed}`);
  console.log(`- Average adaptation score: ${metrics.averageAdaptationScore}`);
  console.log(`- Top strategy: ${metrics.topStrategy}`);
  console.log(`- Top pattern: ${metrics.topPattern}`);
  
  console.log('\nDemo completed successfully!');
}

// Run the demo
runDemo().catch(error => {
  console.error('Demo failed:', error);
});