/**
 * Knowledge-Driven Autonomous Planning (KDAP) - Tests
 * 
 * This file contains tests for the KDAP component functionality.
 */

const { 
  initializeKDAP, 
  KnowledgeStateAnalyzer, 
  GapIdentificationEngine,
  PlanGenerationSystem,
  ExecutionOrchestrator,
  KnowledgeImpactEvaluator,
  validateGapAssessment,
  validateKnowledgeAcquisitionPlan
} = require('./index');

// Mock ConPort context for testing
const mockConPortContext = {
  productContext: { 
    project: 'Test Project', 
    domains: ['domain1', 'domain2'] 
  },
  activeContext: {
    current_focus: 'Testing KDAP'
  },
  decisions: [
    {
      id: 1,
      summary: 'Test Decision',
      rationale: 'For testing purposes',
      tags: ['test', 'decision'],
      timestamp: new Date().toISOString()
    }
  ],
  systemPatterns: [
    {
      id: 1,
      name: 'Test Pattern',
      description: 'A pattern for testing',
      tags: ['test', 'pattern']
    }
  ],
  customData: [],
  progress: [],
  links: [
    {
      source_item_type: 'decision',
      source_item_id: '1',
      target_item_type: 'system_pattern',
      target_item_id: '1',
      relationship_type: 'implements',
      timestamp: new Date().toISOString()
    }
  ]
};

describe('Knowledge-Driven Autonomous Planning (KDAP)', () => {
  describe('Core Components', () => {
    test('KnowledgeStateAnalyzer should analyze knowledge state', () => {
      const analyzer = new KnowledgeStateAnalyzer();
      const state = analyzer.analyzeKnowledgeState(mockConPortContext);
      
      expect(state).toBeDefined();
      expect(state.knowledgeInventory).toBeDefined();
      expect(state.relationshipMap).toBeDefined();
      expect(state.analysisTimestamp).toBeDefined();
    });
    
    test('GapIdentificationEngine should identify gaps', () => {
      const analyzer = new KnowledgeStateAnalyzer();
      const state = analyzer.analyzeKnowledgeState(mockConPortContext);
      
      const gapEngine = new GapIdentificationEngine();
      const gaps = gapEngine.identifyGaps(state);
      
      expect(Array.isArray(gaps)).toBe(true);
    });
    
    test('PlanGenerationSystem should generate plan', () => {
      const mockGaps = [
        {
          id: 'gap-1',
          domain: 'domain1',
          type: 'coverage',
          severity: 0.8,
          description: 'Test gap',
          validation: { isValid: true }
        }
      ];
      
      const planSystem = new PlanGenerationSystem();
      const plan = planSystem.generatePlan(mockGaps, { resources: { time: 10 } });
      
      expect(plan).toBeDefined();
      expect(plan.targetGaps).toBeDefined();
      expect(plan.activities).toBeDefined();
      expect(plan.success_criteria).toBeDefined();
    });
  });
  
  describe('Validation Functions', () => {
    test('validateGapAssessment should validate gaps', () => {
      const validGap = {
        id: 'gap-1',
        domain: 'test-domain',
        severity: 0.7,
        identificationMethod: 'test-method',
        confidence: 0.8,
        evidence: ['test evidence']
      };
      
      const validation = validateGapAssessment(validGap);
      expect(validation.isValid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });
    
    test('validateGapAssessment should reject invalid gaps', () => {
      const invalidGap = {
        // Missing required fields
        domain: 'test-domain'
      };
      
      const validation = validateGapAssessment(invalidGap);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
    
    test('validateKnowledgeAcquisitionPlan should validate plans', () => {
      const validPlan = {
        targetGaps: [{ id: 'gap-1' }],
        activities: [
          { 
            id: 'act-1', 
            type: 'research',
            description: 'Research activity', 
            expected_outcome: 'New knowledge'
          }
        ],
        success_criteria: {
          'gap-1': {
            metric: 'knowledge_items',
            target: 'increase'
          }
        },
        resources_required: { time: 5 },
        resources_available: { time: 10 }
      };
      
      const validation = validateKnowledgeAcquisitionPlan(validPlan);
      expect(validation.isValid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });
  });
  
  describe('Integration', () => {
    test('initializeKDAP should return a valid KDAP instance', () => {
      const kdap = initializeKDAP();
      
      expect(kdap).toBeDefined();
      expect(typeof kdap.analyzeKnowledgeState).toBe('function');
      expect(typeof kdap.identifyGaps).toBe('function');
      expect(typeof kdap.generatePlan).toBe('function');
      expect(typeof kdap.executePlan).toBe('function');
      expect(typeof kdap.evaluateImpact).toBe('function');
    });
  });
});