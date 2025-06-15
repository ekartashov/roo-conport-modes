/**
 * Temporal Knowledge Management Usage Example
 * 
 * This example demonstrates how to use the Temporal Knowledge Management component
 * to track knowledge artifact versions, dependencies, and lifecycle states over time.
 */

// Import required modules
const { createTemporalKnowledge } = require('../utilities/phase-3/temporal-knowledge-management/temporal-knowledge');

// Mock ConPort client for demonstration purposes
const mockConPortClient = {
  log_custom_data: async (args) => ({ 
    saved: true, 
    category: args.category, 
    key: args.key 
  }),
  get_custom_data: async (args) => {
    if (args.category === 'temporal_knowledge_indexes' && args.key === 'decision_123_incoming') {
      return {
        artifactType: 'decision',
        artifactId: '123',
        direction: 'incoming',
        dependencies: [
          { dependencyId: 'pattern_456_references_decision_123', addedAt: '2025-01-01T00:00:00.000Z' }
        ]
      };
    } else if (args.category === 'temporal_knowledge_dependencies' && 
               args.key === 'pattern_456_references_decision_123') {
      return {
        dependencyId: 'pattern_456_references_decision_123',
        sourceType: 'pattern',
        sourceId: '456',
        targetType: 'decision',
        targetId: '123',
        dependencyType: 'references',
        strength: 'high',
        metadata: { createdAt: '2025-01-01T00:00:00.000Z' }
      };
    } else if (args.category === 'temporal_knowledge_versions' && args.key) {
      // Return mock version data based on key
      const [type, id, timestamp] = args.key.split('_');
      return {
        versionId: args.key,
        artifactType: type,
        artifactId: id,
        content: { mockData: `Version from ${new Date(parseInt(timestamp)).toISOString()}` },
        metadata: {
          createdAt: new Date(parseInt(timestamp)).toISOString()
        },
        tags: ['example'],
        lifecycleState: 'active'
      };
    } else if (args.category === 'temporal_knowledge_indexes' && args.key === 'document_abc') {
      return {
        artifactType: 'document',
        artifactId: 'abc',
        versions: [
          { versionId: 'document_abc_1715000000000', timestamp: '2025-05-06T12:00:00.000Z' },
          { versionId: 'document_abc_1714000000000', timestamp: '2025-04-24T12:00:00.000Z' },
          { versionId: 'document_abc_1713000000000', timestamp: '2025-04-12T12:00:00.000Z' }
        ],
        latestVersionId: 'document_abc_1715000000000',
        lifecycleState: 'active',
        updatedAt: '2025-05-06T12:00:00.000Z',
        stateHistory: [
          {
            from: 'draft',
            to: 'review',
            timestamp: '2025-04-18T12:00:00.000Z',
            reason: 'Ready for review'
          },
          {
            from: 'review',
            to: 'active',
            timestamp: '2025-04-26T12:00:00.000Z',
            reason: 'Approved by review team'
          }
        ]
      };
    }
    return null;
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

// Initialize the Temporal Knowledge Management system
const temporalKnowledge = createTemporalKnowledge({
  workspaceId: '/example/workspace',
  conPortClient: mockConPortClient,
  enableValidation: true,
  strictMode: false
});

/**
 * Example 1: Document Versioning
 * This example demonstrates creating and managing versions of a document
 */
async function documentVersioningExample() {
  console.log('\n=== Example 1: Document Versioning ===\n');
  
  // Step 1: Create the initial version of a document
  console.log('Creating initial document version...');
  const initialVersion = await temporalKnowledge.createVersion({
    artifactType: 'document',
    artifactId: 'architecture-overview',
    content: {
      title: 'System Architecture Overview',
      sections: [
        { title: 'Introduction', content: 'This document provides an overview of the system architecture.' },
        { title: 'Components', content: 'The system consists of the following components...' },
        { title: 'Interfaces', content: 'Components communicate through the following interfaces...' }
      ],
      status: 'draft',
      version: '0.1'
    },
    metadata: {
      author: 'Jane Smith',
      createdAt: new Date().toISOString(),
      reason: 'Initial draft'
    },
    tags: ['architecture', 'draft', 'documentation']
  });
  
  console.log('Initial version created:', initialVersion.versionId);
  console.log('Lifecycle state:', initialVersion.lifecycleState);
  
  // Step 2: Update the document with a new version
  console.log('\nCreating updated document version...');
  const updatedVersion = await temporalKnowledge.createVersion({
    artifactType: 'document',
    artifactId: 'architecture-overview',
    content: {
      title: 'System Architecture Overview',
      sections: [
        { title: 'Introduction', content: 'This document provides an overview of the system architecture.' },
        { title: 'Components', content: 'The system consists of the following components...' },
        { title: 'Interfaces', content: 'Components communicate through the following interfaces...' },
        { title: 'Deployment', content: 'The system is deployed using the following infrastructure...' }
      ],
      status: 'review',
      version: '0.2'
    },
    metadata: {
      author: 'Jane Smith',
      createdAt: new Date().toISOString(),
      reason: 'Added deployment section',
      significant: true
    },
    parentVersionId: initialVersion.versionId,
    tags: ['architecture', 'review', 'documentation']
  });
  
  console.log('Updated version created:', updatedVersion.versionId);
  
  // Step 3: Update the document's lifecycle state
  console.log('\nUpdating document lifecycle state...');
  const stateChange = await temporalKnowledge.updateLifecycleState({
    artifactType: 'document',
    artifactId: 'architecture-overview',
    state: 'approved',
    reason: 'Approved by architecture review board',
    versionId: updatedVersion.versionId
  });
  
  console.log('Lifecycle state updated:', stateChange.to);
  console.log('Reason:', stateChange.reason);
  
  // Step 4: List all versions of the document
  console.log('\nListing document versions...');
  const versions = await temporalKnowledge.listVersions({
    artifactType: 'document',
    artifactId: 'architecture-overview'
  });
  
  console.log(`Found ${versions.length} versions:`);
  versions.forEach((version, index) => {
    console.log(`${index + 1}. ${version.versionId} - Created: ${version.metadata.createdAt}`);
  });
  
  // Step 5: Compare document versions
  console.log('\nComparing document versions...');
  const comparison = await temporalKnowledge.compareVersions({
    artifactType: 'document',
    artifactId: 'architecture-overview',
    baseVersionId: initialVersion.versionId,
    targetVersionId: updatedVersion.versionId
  });
  
  console.log('Comparison results:');
  console.log('- Content changes:', comparison.contentChanges);
  console.log('- Metadata changes:', comparison.metadataChanges);
  console.log('- Tags changes:', comparison.tagsChanges);
  
  return { documentId: 'architecture-overview', versions };
}

/**
 * Example 2: Knowledge Artifact Dependencies
 * This example demonstrates tracking dependencies between knowledge artifacts
 */
async function dependencyTrackingExample() {
  console.log('\n\n=== Example 2: Knowledge Artifact Dependencies ===\n');
  
  // Step 1: Create a decision artifact
  console.log('Creating decision artifact...');
  const decision = await temporalKnowledge.createVersion({
    artifactType: 'decision',
    artifactId: 'auth-jwt',
    content: {
      title: 'Use JWT for Authentication',
      description: 'We will use JWT tokens for authentication',
      rationale: 'JWT provides stateless authentication and is widely supported',
      alternatives: ['Session-based auth', 'OAuth2'],
      status: 'approved'
    },
    metadata: {
      author: 'Security Team',
      createdAt: new Date().toISOString()
    },
    tags: ['security', 'authentication', 'architecture']
  });
  
  console.log('Decision created:', decision.versionId);
  
  // Step 2: Create a code implementation artifact
  console.log('\nCreating code implementation artifact...');
  const implementation = await temporalKnowledge.createVersion({
    artifactType: 'implementation',
    artifactId: 'auth-service',
    content: {
      repository: 'github.com/example/auth-service',
      files: ['src/auth/jwt.js', 'src/auth/middleware.js'],
      pullRequest: 'PR-123',
      status: 'merged'
    },
    metadata: {
      author: 'Dev Team',
      createdAt: new Date().toISOString()
    },
    tags: ['security', 'authentication', 'implementation']
  });
  
  console.log('Implementation created:', implementation.versionId);
  
  // Step 3: Register dependency between decision and implementation
  console.log('\nRegistering dependency between decision and implementation...');
  const dependency = await temporalKnowledge.registerDependency({
    sourceType: 'decision',
    sourceId: 'auth-jwt',
    targetType: 'implementation',
    targetId: 'auth-service',
    dependencyType: 'implements',
    strength: 'high',
    metadata: {
      description: 'Auth service implements JWT authentication decision',
      significant: true
    }
  });
  
  console.log('Dependency registered:', dependency.dependencyId);
  
  // Step 4: Create a documentation artifact
  console.log('\nCreating documentation artifact...');
  const documentation = await temporalKnowledge.createVersion({
    artifactType: 'documentation',
    artifactId: 'auth-guide',
    content: {
      title: 'Authentication Developer Guide',
      sections: [
        { title: 'Overview', content: 'This guide explains how to use the authentication service' },
        { title: 'JWT Integration', content: 'To integrate with JWT authentication...' }
      ],
      status: 'published'
    },
    metadata: {
      author: 'Documentation Team',
      createdAt: new Date().toISOString()
    },
    tags: ['guide', 'authentication', 'jwt']
  });
  
  console.log('Documentation created:', documentation.versionId);
  
  // Step 5: Register dependency between implementation and documentation
  console.log('\nRegistering dependency between implementation and documentation...');
  const docDependency = await temporalKnowledge.registerDependency({
    sourceType: 'implementation',
    sourceId: 'auth-service',
    targetType: 'documentation',
    targetId: 'auth-guide',
    dependencyType: 'documents',
    strength: 'medium',
    metadata: {
      description: 'Auth guide documents the auth service implementation'
    }
  });
  
  console.log('Documentation dependency registered:', docDependency.dependencyId);
  
  // Step 6: Perform impact analysis
  console.log('\nPerforming impact analysis for the decision...');
  const impact = await temporalKnowledge.analyzeImpact({
    artifactType: 'decision',
    artifactId: 'auth-jwt',
    depth: 2,
    direction: 'both'
  });
  
  console.log('Impact analysis results:');
  console.log(`- Directly affects: ${impact.affects.length} artifacts`);
  console.log(`- Indirectly affects (downstream): ${impact.downstream.length} dependency chains`);
  console.log(`- Affected by (upstream): ${impact.upstream.length} dependency chains`);
  
  return { decisionId: 'auth-jwt', implementationId: 'auth-service', documentationId: 'auth-guide' };
}

/**
 * Example 3: Temporal Recovery and Historical Context
 * This example demonstrates retrieving historical versions of knowledge artifacts
 */
async function temporalRecoveryExample() {
  console.log('\n\n=== Example 3: Temporal Recovery and Historical Context ===\n');
  
  // Step 1: Retrieve a document version by timestamp
  console.log('Retrieving document version by timestamp...');
  const pastVersion = await temporalKnowledge.getVersion({
    artifactType: 'document',
    artifactId: 'abc',
    timestamp: '2025-04-20T12:00:00.000Z'
  });
  
  console.log('Retrieved version from timestamp:', pastVersion.versionId);
  console.log('Version content:', pastVersion.content);
  
  // Step 2: Get full artifact history
  console.log('\nRetrieving full artifact history...');
  const history = await temporalKnowledge.getArtifactHistory({
    artifactType: 'document',
    artifactId: 'abc',
    limit: 10
  });
  
  console.log(`Retrieved ${history.history.length} history items:`);
  history.history.forEach((item, index) => {
    if (item.type === 'version') {
      console.log(`${index + 1}. Version: ${item.versionId} at ${item.timestamp}`);
    } else if (item.type === 'state_change') {
      console.log(`${index + 1}. State change: ${item.from} → ${item.to} at ${item.timestamp}`);
    }
  });
  
  // Step 3: Create a branch from an existing version
  console.log('\nCreating a branch from an existing version...');
  const branch = await temporalKnowledge.createBranch({
    artifactType: 'document',
    artifactId: 'abc',
    baseVersionId: 'document_abc_1714000000000',
    branchName: 'alternative-approach',
    metadata: {
      reason: 'Exploring alternative architecture',
      author: 'John Doe'
    }
  });
  
  console.log('Branch created:', branch.branch.branchId);
  console.log('Initial branch version:', branch.initialVersion.versionId);
  
  // Step 4: List branches for an artifact
  console.log('\nListing branches for the document...');
  const branches = await temporalKnowledge.listBranches({
    artifactType: 'document',
    artifactId: 'abc'
  });
  
  console.log(`Found ${branches.length} branches:`);
  branches.forEach((branch, index) => {
    console.log(`${index + 1}. ${branch.branchName} - Created: ${branch.createdAt}`);
  });
  
  // Step 5: Export temporal knowledge to ConPort
  console.log('\nExporting document history to ConPort...');
  const exportResult = await temporalKnowledge.exportToConPort({
    artifactType: 'document',
    artifactId: 'abc',
    category: 'document_exports',
    key: 'document_abc_export'
  });
  
  console.log('Export result:', exportResult);
  
  return { documentId: 'abc', historyItems: history.history.length };
}

/**
 * Example 4: Lifecycle State Management
 * This example demonstrates managing lifecycle states of knowledge artifacts
 */
async function lifecycleManagementExample() {
  console.log('\n\n=== Example 4: Lifecycle State Management ===\n');
  
  // Step 1: Create a new pattern artifact
  console.log('Creating pattern artifact...');
  const pattern = await temporalKnowledge.createVersion({
    artifactType: 'pattern',
    artifactId: 'circuit-breaker',
    content: {
      name: 'Circuit Breaker Pattern',
      description: 'Prevents cascading failures in distributed systems',
      implementation: 'Use a state machine with closed, open, and half-open states...',
      examples: ['example1.js', 'example2.js']
    },
    metadata: {
      author: 'Architecture Team',
      createdAt: new Date().toISOString()
    },
    tags: ['resilience', 'distributed-systems', 'fault-tolerance']
  });
  
  console.log('Pattern created:', pattern.versionId);
  console.log('Initial state:', pattern.lifecycleState);
  
  // Step 2: Update lifecycle state to 'review'
  console.log('\nUpdating pattern lifecycle state to review...');
  const reviewState = await temporalKnowledge.updateLifecycleState({
    artifactType: 'pattern',
    artifactId: 'circuit-breaker',
    state: 'review',
    reason: 'Ready for architecture review'
  });
  
  console.log('State updated to review:', reviewState.to);
  
  // Step 3: Update lifecycle state to 'approved'
  console.log('\nUpdating pattern lifecycle state to approved...');
  const approvedState = await temporalKnowledge.updateLifecycleState({
    artifactType: 'pattern',
    artifactId: 'circuit-breaker',
    state: 'approved',
    reason: 'Approved by architecture review board',
    metadata: {
      approvedBy: 'Architecture Review Board',
      meetingDate: '2025-06-10'
    }
  });
  
  console.log('State updated to approved:', approvedState.to);
  
  // Step 4: Create an updated version
  console.log('\nCreating updated pattern version...');
  const updatedPattern = await temporalKnowledge.createVersion({
    artifactType: 'pattern',
    artifactId: 'circuit-breaker',
    content: {
      name: 'Circuit Breaker Pattern',
      description: 'Prevents cascading failures in distributed systems',
      implementation: 'Use a state machine with closed, open, and half-open states...',
      examples: ['example1.js', 'example2.js', 'example3.js'],
      considerations: 'Care must be taken when implementing timeout values...'
    },
    metadata: {
      author: 'Architecture Team',
      createdAt: new Date().toISOString(),
      reason: 'Added implementation considerations'
    },
    parentVersionId: pattern.versionId,
    tags: ['resilience', 'distributed-systems', 'fault-tolerance', 'approved']
  });
  
  console.log('Updated pattern created:', updatedPattern.versionId);
  
  // Step 5: Update lifecycle state to 'deprecated'
  console.log('\nUpdating pattern lifecycle state to deprecated...');
  const deprecatedState = await temporalKnowledge.updateLifecycleState({
    artifactType: 'pattern',
    artifactId: 'circuit-breaker',
    state: 'deprecated',
    reason: 'Replaced by more comprehensive Resilience Pattern',
    metadata: {
      deprecatedBy: 'Architecture Team',
      replacementArtifact: 'pattern:resilience-patterns'
    }
  });
  
  console.log('State updated to deprecated:', deprecatedState.to);
  console.log('Reason:', deprecatedState.reason);
  
  return { patternId: 'circuit-breaker', stateChanges: 3 };
}

// Run the examples
async function runAllExamples() {
  try {
    console.log('=== Temporal Knowledge Management Usage Examples ===');
    
    // Run Example 1
    const example1Result = await documentVersioningExample();
    
    // Run Example 2
    const example2Result = await dependencyTrackingExample();
    
    // Run Example 3
    const example3Result = await temporalRecoveryExample();
    
    // Run Example 4
    const example4Result = await lifecycleManagementExample();
    
    console.log('\n=== Examples Completed Successfully ===');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Execute all examples
runAllExamples();

/**
 * Additional Example: Using the Temporal Knowledge Management component with ConPort Integration
 * 
 * This example shows how to integrate with ConPort to maintain knowledge history
 */

/*
// Example integration with ConPort

const { createTemporalKnowledge } = require('../utilities/phase-3/temporal-knowledge-management/temporal-knowledge');
const { getConPortClient } = require('../utilities/conport-client');

async function trackDecisionHistory() {
  // Initialize ConPort client
  const conPortClient = getConPortClient('/path/to/workspace');
  
  // Initialize Temporal Knowledge Management
  const temporalKnowledge = createTemporalKnowledge({
    workspaceId: '/path/to/workspace',
    conPortClient
  });
  
  // Get a decision from ConPort
  const decision = await conPortClient.get_decision({
    workspace_id: '/path/to/workspace',
    decision_id: 123
  });
  
  // Create a version of the decision in temporal knowledge
  const decisionVersion = await temporalKnowledge.createVersion({
    artifactType: 'decision',
    artifactId: decision.id.toString(),
    content: decision,
    metadata: {
      createdAt: decision.timestamp,
      source: 'conport_decision'
    },
    tags: decision.tags || []
  });
  
  console.log(`Decision ${decision.id} versioned as ${decisionVersion.versionId}`);
  
  // Now if the decision is updated, create a new version
  const updatedDecision = await conPortClient.get_decision({
    workspace_id: '/path/to/workspace',
    decision_id: 123
  });
  
  if (updatedDecision.timestamp !== decision.timestamp) {
    const newVersion = await temporalKnowledge.createVersion({
      artifactType: 'decision',
      artifactId: updatedDecision.id.toString(),
      content: updatedDecision,
      metadata: {
        createdAt: updatedDecision.timestamp,
        source: 'conport_decision'
      },
      parentVersionId: decisionVersion.versionId,
      tags: updatedDecision.tags || []
    });
    
    console.log(`Updated decision ${updatedDecision.id} versioned as ${newVersion.versionId}`);
    
    // Analyze what changed
    const comparison = await temporalKnowledge.compareVersions({
      artifactType: 'decision',
      artifactId: updatedDecision.id.toString(),
      baseVersionId: decisionVersion.versionId,
      targetVersionId: newVersion.versionId
    });
    
    console.log('Changes detected:', comparison);
  }
}
*/