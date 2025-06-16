/**
 * Knowledge Synthesis Engine (KSE) Demo
 * 
 * This script demonstrates the core functionality of the KSE component
 * through practical examples of knowledge synthesis operations.
 */

// Import the KSE components
const {
  createKSE,
  KnowledgeSynthesizer,
  SynthesisStrategyRegistry,
  ProvenanceTracker
} = require('./index');

// Mock dependencies for standalone demo
class MockConPortClient {
  async storeKnowledgeArtifact({ artifact, metadata }) {
    console.log('🗄️  Storing artifact in ConPort with metadata:', JSON.stringify(metadata, null, 2));
    return { ...artifact, id: `conport-${Date.now()}` };
  }
  
  async getKnowledgeArtifacts({ types, query }) {
    console.log(`🔍 Getting artifacts of types [${types.join(', ')}] with query:`, query);
    return MOCK_ARTIFACTS.filter(a => types.includes(a.type));
  }
}

class MockAmoClient {
  async getRelevantMappings({ artifactTypes, synthesisStrategy }) {
    console.log(`🗺️  Getting mappings for types [${artifactTypes.join(', ')}] and strategy: ${synthesisStrategy}`);
    return [
      { sourceType: artifactTypes[0], targetType: 'synthesized', confidence: 0.85 }
    ];
  }
  
  async registerSynthesisStrategy({ name, provider, metadata }) {
    console.log(`📝 Registering strategy '${name}' from provider '${provider}'`);
    return true;
  }
}

class MockKdapClient {
  async discoverArtifacts({ types, query, context }) {
    console.log(`🔍 Discovering artifacts of types [${types.join(', ')}] with context:`, context);
    return MOCK_ARTIFACTS.filter(a => types.includes(a.type));
  }
}

class MockAkafClient {
  async acquireKnowledge({ types, params, context }) {
    console.log(`🧠 Acquiring knowledge of types [${types.join(', ')}] with params:`, params);
    return [
      {
        id: 'acquired-1',
        type: types[0],
        title: `Acquired ${types[0]} artifact`,
        content: 'This knowledge was dynamically acquired',
        metadata: { source: params.source || 'unknown', timestamp: new Date().toISOString() }
      },
      {
        id: 'acquired-2',
        type: types[0],
        title: `Acquired ${types[0]} artifact 2`,
        content: 'This is additional acquired knowledge',
        metadata: { source: params.source || 'unknown', timestamp: new Date().toISOString() }
      }
    ];
  }
}

// Sample artifacts for demonstration
const MOCK_ARTIFACTS = [
  {
    id: 'decision-1',
    type: 'decision',
    title: 'Use React for Frontend',
    description: 'We will use React as our primary frontend framework',
    rationale: 'React provides better component reusability and performance',
    alternatives: ['Vue', 'Angular', 'Svelte'],
    timestamp: '2025-04-15T10:30:00Z',
    tags: ['frontend', 'technology-choice']
  },
  {
    id: 'decision-2',
    type: 'decision',
    title: 'Use Node.js for Backend',
    description: 'Our backend will be built with Node.js',
    rationale: 'Allows sharing code between frontend and backend',
    alternatives: ['Python/Django', 'Ruby/Rails', 'Java/Spring'],
    timestamp: '2025-04-15T11:15:00Z',
    tags: ['backend', 'technology-choice']
  },
  {
    id: 'pattern-1',
    type: 'pattern',
    name: 'Repository Pattern',
    description: 'Abstract data access through repository interfaces',
    implementation: 'Create a base Repository class with CRUD operations',
    codeExample: 'class Repository { async findById(id) { ... } }',
    benefits: ['Decouples business logic from data access', 'Makes testing easier'],
    timestamp: '2025-04-18T09:45:00Z',
    tags: ['design-pattern', 'architecture']
  },
  {
    id: 'requirement-1',
    type: 'requirement',
    title: 'User Authentication',
    description: 'Users must be able to register and login',
    priority: 'high',
    acceptanceCriteria: [
      'Users can create an account with email and password',
      'Users can login with valid credentials',
      'Users can reset their password'
    ],
    status: 'approved',
    timestamp: '2025-04-10T14:00:00Z',
    tags: ['security', 'user-management']
  },
  {
    id: 'insight-1',
    type: 'insight',
    title: 'Performance Bottleneck',
    description: 'Database queries are causing slow response times',
    source: 'performance analysis',
    recommendations: [
      'Add indexes to frequently queried columns',
      'Implement query caching',
      'Consider database denormalization for read-heavy operations'
    ],
    impact: 'high',
    timestamp: '2025-05-01T16:20:00Z',
    tags: ['performance', 'database']
  }
];

// Custom colored logger for the demo
const logger = {
  log: (msg) => console.log(`\x1b[0m${msg}\x1b[0m`),
  info: (msg) => console.log(`\x1b[36m${msg}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m${msg}\x1b[0m`),
  warn: (msg) => console.log(`\x1b[33m${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m${msg}\x1b[0m`),
  divider: () => console.log('\x1b[90m----------------------------------------\x1b[0m'),
  header: (msg) => {
    console.log('\n\x1b[1m\x1b[34m' + msg + '\x1b[0m');
    console.log('\x1b[90m========================================\x1b[0m');
  }
};

/**
 * Prints a knowledge artifact in a formatted way
 */
function printArtifact(artifact, label = 'Artifact') {
  logger.log(`📄 ${label}:`);
  
  // Extract key properties for cleaner display
  const {
    id, type, title, name, description, provenance,
    ...rest
  } = artifact;
  
  console.log(JSON.stringify({
    id,
    type,
    title: title || name,
    description,
    provenance,
    ...rest
  }, null, 2));
}

/**
 * Main demo function
 */
async function runDemo() {
  logger.header('🧩 Knowledge Synthesis Engine (KSE) Demo');
  logger.info('Initializing KSE with mock clients...');
  
  // Create the KSE instance with mock clients
  const kse = createKSE({
    conportClient: new MockConPortClient(),
    amoClient: new MockAmoClient(),
    kdapClient: new MockKdapClient(),
    akafClient: new MockAkafClient(),
    logger
  });
  
  try {
    // Demo 1: Basic Synthesis with Merge Strategy
    logger.header('Demo 1: Basic Synthesis with Merge Strategy');
    logger.info('Synthesizing technical decisions with merge strategy...');
    
    const mergeResult = await kse.synthesize({
      artifacts: [MOCK_ARTIFACTS[0], MOCK_ARTIFACTS[1]],
      strategy: 'merge',
      strategyParams: { removeDuplicates: true }
    });
    
    printArtifact(mergeResult, 'Merged Decisions');
    logger.success('Successfully merged decisions with full provenance tracking!');
    
    // Demo 2: Summary Strategy
    logger.divider();
    logger.header('Demo 2: Summary Strategy');
    logger.info('Creating a summary of all artifacts...');
    
    const summaryResult = await kse.synthesize({
      artifacts: MOCK_ARTIFACTS,
      strategy: 'summarize',
      strategyParams: { 
        title: 'Project Knowledge Summary',
        maxInsights: 3
      }
    });
    
    printArtifact(summaryResult, 'Knowledge Summary');
    logger.success('Successfully created knowledge summary!');
    
    // Demo 3: Transform Strategy
    logger.divider();
    logger.header('Demo 3: Transform Strategy');
    logger.info('Transforming requirements into a different format...');
    
    const transformResult = await kse.synthesize({
      artifacts: [MOCK_ARTIFACTS[3]],  // requirement-1
      strategy: 'transform',
      strategyParams: {
        rules: [
          { sourceField: 'title', targetField: 'name', operation: 'copy' },
          { sourceField: 'description', targetField: 'summary', operation: 'move' },
          { sourceField: 'acceptanceCriteria', targetField: 'verificationSteps', operation: 'move' }
        ]
      }
    });
    
    printArtifact(transformResult[0], 'Transformed Requirement');
    logger.success('Successfully transformed requirement format!');
    
    // Demo 4: Custom Strategy Registration
    logger.divider();
    logger.header('Demo 4: Custom Strategy Registration');
    logger.info('Registering a custom "prioritize" strategy...');
    
    // Register a custom strategy
    kse.registerStrategy('prioritize', (artifacts, params = {}, context = {}) => {
      // Sort artifacts by priority field or fallback
      const prioritized = [...artifacts].sort((a, b) => {
        const aPriority = a.priority || a.impact || 'medium';
        const bPriority = b.priority || b.impact || 'medium';
        
        const priorityMap = { high: 3, medium: 2, low: 1 };
        return (priorityMap[bPriority] || 2) - (priorityMap[aPriority] || 2);
      });
      
      return {
        type: 'prioritized',
        title: params.title || 'Prioritized Artifacts',
        description: 'Artifacts sorted by priority',
        items: prioritized.map(a => ({
          id: a.id,
          title: a.title || a.name,
          priority: a.priority || a.impact || 'medium',
          type: a.type
        }))
      };
    }, {
      description: 'Prioritizes artifacts based on priority fields',
      supportedTypes: ['*'],
      params: {
        title: {
          type: 'string',
          description: 'Title for the prioritized list'
        }
      }
    });
    
    logger.success('Custom strategy registered successfully!');
    logger.info('Using the custom prioritize strategy...');
    
    const prioritizeResult = await kse.synthesize({
      artifacts: [MOCK_ARTIFACTS[3], MOCK_ARTIFACTS[4]], // requirement-1, insight-1
      strategy: 'prioritize',
      strategyParams: { 
        title: 'Critical Items'
      }
    });
    
    printArtifact(prioritizeResult, 'Prioritized Items');
    logger.success('Successfully applied custom prioritize strategy!');
    
    // Demo 5: Retrieve and Synthesize
    logger.divider();
    logger.header('Demo 5: Retrieve and Synthesize');
    logger.info('Retrieving and synthesizing patterns...');
    
    const retrieveResult = await kse.retrieveAndSynthesize({
      artifactTypes: ['pattern'],
      query: { tags: 'architecture' },
      strategy: 'summarize'
    });
    
    printArtifact(retrieveResult, 'Retrieved and Synthesized');
    logger.success('Successfully retrieved and synthesized artifacts!');
    
    // Demo 6: Acquire and Synthesize
    logger.divider();
    logger.header('Demo 6: Acquire and Synthesize');
    logger.info('Acquiring and synthesizing new knowledge...');
    
    const acquireResult = await kse.acquireAndSynthesize({
      knowledgeTypes: ['learning'],
      acquisitionParams: { 
        source: 'codebase',
        depth: 3
      },
      strategy: 'merge'
    });
    
    printArtifact(acquireResult, 'Acquired and Synthesized');
    logger.success('Successfully acquired and synthesized new knowledge!');
    
    // Demo 7: Provenance Tracking
    logger.divider();
    logger.header('Demo 7: Provenance Tracking');
    logger.info('Examining provenance of synthesized artifacts...');
    
    const provenanceTracker = new ProvenanceTracker();
    const provenanceResult = provenanceTracker.getProvenanceChain(mergeResult);
    
    console.log('📋 Provenance Chain:');
    console.log(JSON.stringify(provenanceResult, null, 2));
    
    const validationResult = provenanceTracker.validateProvenance(mergeResult);
    logger.log(`✅ Provenance validation result: ${validationResult.valid ? 'Valid' : 'Invalid'}`);
    
    if (!validationResult.valid) {
      logger.warn(`Validation errors: ${validationResult.errors.join(', ')}`);
    }
    
    logger.success('Provenance tracking demonstration complete!');
    
    // Demo conclusion
    logger.divider();
    logger.header('KSE Demo Complete');
    logger.info('The Knowledge Synthesis Engine successfully demonstrated:');
    logger.log('1. Multiple synthesis strategies (merge, summarize, transform)');
    logger.log('2. Custom strategy registration and execution');
    logger.log('3. Integration with ConPort, AMO, KDAP, and AKAF');
    logger.log('4. Comprehensive provenance tracking');
    logger.log('5. Knowledge retrieval and acquisition workflows');
    
  } catch (error) {
    logger.error(`Demo failed: ${error.message}`);
    console.error(error);
  }
}

// Run the demo
runDemo().catch(console.error);