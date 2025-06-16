/**
 * Knowledge Synthesis Engine (KSE) - Tests
 */

// Import modules
const {
  KnowledgeSynthesizer,
  SynthesisStrategyRegistry,
  SynthesisRuleEngine,
  KnowledgeCompositionManager,
  ContextPreservationService,
  SemanticAnalyzer,
  ProvenanceTracker,
  KSEIntegration,
  validateSynthesisRequest,
  validateArtifact,
  validateStrategy,
  validateRule,
  createKSE
} = require('../index');

// Mock dependencies
const mockConportClient = {
  storeKnowledgeArtifact: jest.fn().mockImplementation(({ artifact }) => Promise.resolve(artifact)),
  getKnowledgeArtifacts: jest.fn().mockImplementation(() => Promise.resolve([
    { id: 'artifact1', type: 'decision', content: 'Decision 1' },
    { id: 'artifact2', type: 'decision', content: 'Decision 2' }
  ]))
};

const mockAmoClient = {
  getRelevantMappings: jest.fn().mockImplementation(() => Promise.resolve([])),
  registerSynthesisStrategy: jest.fn().mockImplementation(() => Promise.resolve())
};

const mockKdapClient = {
  discoverArtifacts: jest.fn().mockImplementation(() => Promise.resolve([
    { id: 'artifact3', type: 'pattern', content: 'Pattern 1' },
    { id: 'artifact4', type: 'pattern', content: 'Pattern 2' }
  ]))
};

const mockAkafClient = {
  acquireKnowledge: jest.fn().mockImplementation(() => Promise.resolve([
    { id: 'artifact5', type: 'insight', content: 'Insight 1' },
    { id: 'artifact6', type: 'insight', content: 'Insight 2' }
  ]))
};

const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

// Test fixtures
const sampleArtifacts = [
  {
    id: 'a1',
    type: 'decision',
    title: 'Use React',
    description: 'We will use React for the frontend'
  },
  {
    id: 'a2',
    type: 'decision',
    title: 'Use Node.js',
    description: 'We will use Node.js for the backend'
  }
];

describe('KSE Core - SynthesisStrategyRegistry', () => {
  let registry;
  
  beforeEach(() => {
    registry = new SynthesisStrategyRegistry();
  });
  
  test('should register and retrieve a strategy', () => {
    const strategyFn = (artifacts) => artifacts[0];
    const metadata = { description: 'Test strategy' };
    
    registry.register('test', strategyFn, metadata);
    
    const retrieved = registry.get('test');
    expect(retrieved).toBe(strategyFn);
    
    const retrievedMetadata = registry.getMetadata('test');
    expect(retrievedMetadata).toEqual(metadata);
  });
  
  test('should check if a strategy exists', () => {
    const strategyFn = (artifacts) => artifacts[0];
    registry.register('exists', strategyFn);
    
    expect(registry.has('exists')).toBe(true);
    expect(registry.has('doesNotExist')).toBe(false);
  });
  
  test('should list all registered strategies', () => {
    registry.register('strategy1', () => {}, { description: 'Strategy 1' });
    registry.register('strategy2', () => {}, { description: 'Strategy 2' });
    
    const strategies = registry.list();
    expect(strategies).toHaveLength(2);
    expect(strategies).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'strategy1', metadata: { description: 'Strategy 1' } }),
      expect.objectContaining({ name: 'strategy2', metadata: { description: 'Strategy 2' } })
    ]));
  });
  
  test('should throw when getting a non-existent strategy', () => {
    expect(() => registry.get('nonExistent')).toThrow('Strategy not found: nonExistent');
  });
});

describe('KSE Core - ProvenanceTracker', () => {
  let tracker;
  
  beforeEach(() => {
    tracker = new ProvenanceTracker();
  });
  
  test('should add provenance to a result', () => {
    const result = { id: 'result', content: 'Test content' };
    const sourceArtifacts = [
      { id: 'source1', type: 'decision' },
      { id: 'source2', type: 'pattern' }
    ];
    const strategy = 'merge';
    
    const enhanced = tracker.addProvenance({
      result,
      sourceArtifacts,
      strategy
    });
    
    expect(enhanced).toHaveProperty('provenance');
    expect(enhanced.provenance).toHaveProperty('generatedById', 'kse');
    expect(enhanced.provenance).toHaveProperty('sources');
    expect(enhanced.provenance.sources).toHaveLength(2);
    expect(enhanced.provenance).toHaveProperty('timestamp');
    expect(enhanced.provenance).toHaveProperty('strategy');
    expect(enhanced.provenance.strategy).toHaveProperty('name', 'merge');
  });
  
  test('should validate provenance', () => {
    const valid = {
      provenance: {
        generatedById: 'kse',
        sources: [{ id: 'source', type: 'decision' }]
      }
    };
    
    const invalid = {
      provenance: {
        generatedById: 'kse'
        // Missing sources
      }
    };
    
    const noProvenance = {
      content: 'No provenance'
    };
    
    expect(tracker.validateProvenance(valid)).toEqual({ valid: true, errors: [] });
    expect(tracker.validateProvenance(invalid)).toEqual(
      expect.objectContaining({ valid: false })
    );
    expect(tracker.validateProvenance(noProvenance)).toEqual(
      expect.objectContaining({ valid: false })
    );
  });
});

describe('KSE Core - KnowledgeSynthesizer', () => {
  let synthesizer;
  let strategyRegistry;
  let provenanceTracker;
  let ruleEngine;
  let compositionManager;
  
  beforeEach(() => {
    strategyRegistry = new SynthesisStrategyRegistry();
    provenanceTracker = new ProvenanceTracker();
    ruleEngine = new SynthesisRuleEngine();
    compositionManager = new KnowledgeCompositionManager();
    contextPreservationService = new ContextPreservationService();
    semanticAnalyzer = new SemanticAnalyzer();
    
    synthesizer = new KnowledgeSynthesizer({
      strategyRegistry,
      ruleEngine,
      compositionManager,
      contextPreservationService,
      semanticAnalyzer,
      provenanceTracker
    });
    
    // Register a test strategy
    strategyRegistry.register('test', (artifacts) => {
      return {
        type: 'synthesized',
        content: artifacts.map(a => a.id).join(', ')
      };
    });
  });
  
  test('should synthesize artifacts using a strategy', async () => {
    const result = await synthesizer.synthesize({
      artifacts: sampleArtifacts,
      strategy: 'test'
    });
    
    expect(result).toHaveProperty('type', 'synthesized');
    expect(result).toHaveProperty('content', 'a1, a2');
    expect(result).toHaveProperty('provenance');
  });
  
  test('should throw when using a non-existent strategy', async () => {
    await expect(synthesizer.synthesize({
      artifacts: sampleArtifacts,
      strategy: 'nonExistent'
    })).rejects.toThrow('Strategy not found: nonExistent');
  });
  
  test('should preserve context when requested', async () => {
    const contextPreservationSpy = jest.spyOn(contextPreservationService, 'preserveContext');
    
    await synthesizer.synthesize({
      artifacts: sampleArtifacts,
      strategy: 'test',
      preserveContext: true,
      context: { key: 'value' }
    });
    
    expect(contextPreservationSpy).toHaveBeenCalled();
  });
});

describe('KSE Validation', () => {
  test('should validate a synthesis request', () => {
    const validRequest = {
      artifacts: [{ type: 'decision', id: '1' }],
      strategy: 'merge'
    };
    
    expect(() => validateSynthesisRequest(validRequest)).not.toThrow();
    
    const invalidRequest1 = {};
    expect(() => validateSynthesisRequest(invalidRequest1)).toThrow();
    
    const invalidRequest2 = {
      artifacts: [{}], // Missing type
      strategy: 'merge'
    };
    expect(() => validateSynthesisRequest(invalidRequest2)).toThrow();
  });
  
  test('should validate an artifact', () => {
    const validArtifact = {
      type: 'decision',
      id: '1',
      content: 'Valid artifact'
    };
    
    expect(() => validateArtifact(validArtifact)).not.toThrow();
    
    const invalidArtifact = {
      content: 'Missing type'
    };
    expect(() => validateArtifact(invalidArtifact)).toThrow();
  });
  
  test('should validate a strategy', () => {
    const validStrategy = (artifacts) => artifacts[0];
    const validMetadata = { description: 'Test strategy' };
    
    expect(() => validateStrategy('test', validStrategy, validMetadata)).not.toThrow();
    
    expect(() => validateStrategy(null, validStrategy)).toThrow();
    expect(() => validateStrategy('test', null)).toThrow();
    expect(() => validateStrategy('test', validStrategy, 'notAnObject')).toThrow();
  });
});

describe('KSE Integration', () => {
  let kseIntegration;
  
  beforeEach(() => {
    kseIntegration = new KSEIntegration({
      conportClient: mockConportClient,
      amoClient: mockAmoClient,
      kdapClient: mockKdapClient,
      akafClient: mockAkafClient,
      logger: mockLogger
    });
    
    // Reset mocks
    mockConportClient.storeKnowledgeArtifact.mockClear();
    mockAmoClient.getRelevantMappings.mockClear();
    mockKdapClient.discoverArtifacts.mockClear();
    mockAkafClient.acquireKnowledge.mockClear();
  });
  
  test('should synthesize artifacts', async () => {
    const result = await kseIntegration.synthesize({
      artifacts: sampleArtifacts,
      strategy: 'merge',
      storeResult: true
    });
    
    // Should store the result in ConPort
    expect(mockConportClient.storeKnowledgeArtifact).toHaveBeenCalledTimes(1);
  });
  
  test('should retrieve and synthesize artifacts', async () => {
    const result = await kseIntegration.retrieveAndSynthesize({
      artifactTypes: ['decision'],
      query: { status: 'active' },
      strategy: 'merge'
    });
    
    // Should use KDAP to retrieve artifacts
    expect(mockKdapClient.discoverArtifacts).toHaveBeenCalledTimes(1);
    
    // Should store the result in ConPort
    expect(mockConportClient.storeKnowledgeArtifact).toHaveBeenCalledTimes(1);
  });
  
  test('should acquire and synthesize knowledge', async () => {
    const result = await kseIntegration.acquireAndSynthesize({
      knowledgeTypes: ['insight'],
      strategy: 'merge'
    });
    
    // Should use AKAF to acquire knowledge
    expect(mockAkafClient.acquireKnowledge).toHaveBeenCalledTimes(1);
    
    // Should store the result in ConPort
    expect(mockConportClient.storeKnowledgeArtifact).toHaveBeenCalledTimes(1);
  });
  
  test('should register a custom strategy', () => {
    const strategyFn = (artifacts) => ({ type: 'custom', artifacts });
    const metadata = { description: 'Custom strategy' };
    
    kseIntegration.registerStrategy('custom', strategyFn, metadata);
    
    // Should register strategy with AMO
    expect(mockAmoClient.registerSynthesisStrategy).toHaveBeenCalledTimes(1);
    
    // Should be able to use the strategy
    expect(kseIntegration.strategyRegistry.has('custom')).toBe(true);
  });
});

describe('KSE Factory', () => {
  test('should create a KSE instance with the createKSE factory', () => {
    const kse = createKSE({
      conportClient: mockConportClient,
      amoClient: mockAmoClient
    });
    
    expect(kse).toBeInstanceOf(KSEIntegration);
    expect(kse.conportClient).toBe(mockConportClient);
    expect(kse.amoClient).toBe(mockAmoClient);
  });
  
  test('should throw when creating a KSE instance without required dependencies', () => {
    expect(() => createKSE({})).toThrow('ConPort client is required');
  });
});