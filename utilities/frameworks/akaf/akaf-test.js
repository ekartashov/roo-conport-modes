/**
 * Test demonstration for the Adaptive Knowledge Application Framework (AKAF)
 * 
 * This file provides a simple demonstration of AKAF functionality
 * with mock ConPort client for testing purposes.
 */

const akaf = require('./index');

// Mock ConPort client for testing
class MockConPortClient {
  constructor() {
    // Mock storage
    this.decisions = [];
    this.systemPatterns = [];
    this.customData = {};
    this.nextId = 1;
  }
  
  async getDecisions(options = {}) {
    console.log('MockConPort: Retrieving decisions');
    // Filter by tags if specified
    let results = [...this.decisions];
    if (options.tags_filter_include_any && options.tags_filter_include_any.length > 0) {
      results = results.filter(decision => 
        decision.tags && decision.tags.some(tag => options.tags_filter_include_any.includes(tag))
      );
    }
    // Apply limit if specified
    if (options.limit && results.length > options.limit) {
      results = results.slice(0, options.limit);
    }
    return results;
  }
  
  async getSystemPatterns(options = {}) {
    console.log('MockConPort: Retrieving system patterns');
    // Filter by tags if specified
    let results = [...this.systemPatterns];
    if (options.tags_filter_include_any && options.tags_filter_include_any.length > 0) {
      results = results.filter(pattern => 
        pattern.tags && pattern.tags.some(tag => options.tags_filter_include_any.includes(tag))
      );
    }
    return results;
  }
  
  async getCustomData(options = {}) {
    console.log(`MockConPort: Retrieving custom data ${options.category ? 'from category ' + options.category : ''}`);
    if (options.category && options.key) {
      return this.customData[`${options.category}:${options.key}`] || null;
    } else if (options.category) {
      const results = [];
      const prefix = `${options.category}:`;
      for (const key in this.customData) {
        if (key.startsWith(prefix)) {
          results.push(this.customData[key]);
        }
      }
      return results;
    }
    return Object.values(this.customData);
  }
  
  async logDecision(decision) {
    console.log(`MockConPort: Logging decision - ${decision.summary}`);
    const id = this.nextId++;
    this.decisions.push({
      id,
      summary: decision.summary,
      rationale: decision.rationale,
      tags: decision.tags || [],
      timestamp: new Date().toISOString()
    });
    return id;
  }
  
  async logCustomData(data) {
    console.log(`MockConPort: Logging custom data - ${data.category}:${data.key}`);
    const key = `${data.category}:${data.key}`;
    this.customData[key] = {
      category: data.category,
      key: data.key,
      value: data.value,
      timestamp: new Date().toISOString()
    };
    return true;
  }
  
  async semanticSearchConport(options) {
    console.log(`MockConPort: Performing semantic search - ${options.query_text}`);
    // Mock semantic search results
    return [
      {
        item_type: 'decision',
        item_id: '1',
        content: 'This is a mock decision that matches the semantic search query.',
        score: 0.85
      },
      {
        item_type: 'system_pattern',
        item_id: '2',
        content: 'This is a mock system pattern that matches the semantic search query.',
        score: 0.72
      }
    ].slice(0, options.top_k || 10);
  }
}

// Initialize mock data
function initializeMockData(mockClient) {
  // Add mock decisions
  mockClient.decisions = [
    {
      id: 1,
      summary: 'Use React for front-end development',
      rationale: 'React provides a component-based architecture that aligns with our needs.',
      tags: ['domain:ui', 'technology:react'],
      timestamp: '2025-05-15T12:00:00Z'
    },
    {
      id: 2,
      summary: 'Implement JWT authentication',
      rationale: 'JWT provides stateless authentication suitable for our microservice architecture.',
      tags: ['domain:security', 'technology:jwt'],
      timestamp: '2025-05-16T12:00:00Z'
    }
  ];
  
  // Add mock system patterns
  mockClient.systemPatterns = [
    {
      id: 1,
      name: 'Repository Pattern',
      description: 'Abstract data access layer using repositories to separate business logic from data access.',
      tags: ['domain:data', 'pattern:architectural'],
      timestamp: '2025-05-14T12:00:00Z'
    },
    {
      id: 2,
      name: 'Circuit Breaker',
      description: 'Prevent cascading failures by detecting failures and handling them gracefully.',
      tags: ['domain:reliability', 'pattern:resilience'],
      timestamp: '2025-05-15T12:00:00Z'
    }
  ];
  
  // Add mock strategies
  mockClient.logCustomData({
    category: 'AKAF_Strategies',
    key: 'security',
    value: [
      {
        type: 'security_adaptation',
        domain: 'security',
        applicableTypes: ['decision', 'system_pattern'],
        operations: [
          { 
            type: 'filter', 
            criteria: 'security_relevance' 
          },
          { 
            type: 'transform', 
            transformation: 'add_security_context' 
          }
        ]
      }
    ]
  });
  
  // Add mock patterns
  mockClient.logCustomData({
    category: 'AKAF_Patterns',
    key: 'security',
    value: [
      {
        type: 'code_integration',
        domain: 'security',
        applicableTypes: ['decision', 'system_pattern'],
        steps: [
          { 
            action: 'security_analysis', 
            expectedOutcome: 'security_assessment' 
          },
          { 
            action: 'code_generation', 
            expectedOutcome: 'security_implementation' 
          }
        ]
      }
    ]
  });
}

// Main test function
async function runTest() {
  console.log('==== AKAF Test Demo ====\n');
  
  // Create mock ConPort client
  const mockClient = new MockConPortClient();
  initializeMockData(mockClient);
  
  // Initialize AKAF with mock client
  console.log('Initializing AKAF...');
  const akafInstance = akaf.initializeAKAF({
    conportClient: mockClient
  });
  
  // Test context preparation
  console.log('\nPreparing context...');
  const context = akafInstance.prepareContext({
    domain: 'security',
    task: 'development',
    constraints: {
      mustBeCompliant: 'GDPR',
      maxLatency: '100ms'
    },
    user: {
      experienceLevel: 'intermediate'
    }
  });
  console.log('Context prepared:', context);
  
  // Test retrieving strategies
  console.log('\nRetrieving adaptation strategies for security domain...');
  const strategies = await akafInstance.retrieveStrategies('security');
  console.log(`Found ${strategies.length} strategies:`, 
    strategies.map(s => s.type).join(', '));
  
  // Test retrieving patterns
  console.log('\nRetrieving application patterns for security domain...');
  const patterns = await akafInstance.retrievePatterns('security');
  console.log(`Found ${patterns.length} patterns:`, 
    patterns.map(p => p.type).join(', '));
  
  // Test registering a new strategy
  console.log('\nRegistering new adaptation strategy...');
  await akafInstance.registerStrategy({
    domain: 'security',
    type: 'compliance_check',
    applicableTypes: ['decision', 'custom_data'],
    operations: [
      { type: 'filter', criteria: 'compliance_requirements' },
      { type: 'transform', transformation: 'add_compliance_checks' }
    ]
  });
  
  // Verify registration
  const updatedStrategies = await akafInstance.retrieveStrategies('security');
  console.log(`After registration: Found ${updatedStrategies.length} strategies:`, 
    updatedStrategies.map(s => s.type).join(', '));
  
  // Test processing a context
  console.log('\nProcessing context (mock implementation)...');
  try {
    const results = await akafInstance.processContext(context);
    console.log('Processing completed!');
    
    // In a real implementation, results would contain adapted and applied knowledge
    // For our mock implementation, we'll show metrics
    console.log('\nAKAF Metrics:');
    const metrics = akafInstance.getMetrics();
    console.log(JSON.stringify(metrics, null, 2));
  } catch (error) {
    console.error('Error processing context:', error);
  }
  
  console.log('\n==== Test Demo Complete ====');
}

// Run the test
runTest().catch(console.error);