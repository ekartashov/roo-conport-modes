/**
 * Strategic Insight Validation System (SIVS) - Test Suite
 * 
 * This file contains tests for all three layers of the SIVS system:
 * 1. Validation Layer - Individual validators
 * 2. Core Layer - Validation orchestration
 * 3. Integration Layer - ConPort, KDAP, and AKAF integration
 */

// Import SIVS components
const { 
  validation,
  InsightValidator,
  ValidationContext,
  StrategicInsightValidator,
  ConPortSIVSIntegration
} = require('./index');

// Mock ConPort client for testing
const mockConPortClient = {
  getProductContext: async () => ({
    domain: 'security',
    principles: ['security_first', 'defense_in_depth'],
    standards: ['owasp_top_10', 'pci_dss'],
    practices: ['code_review', 'input_validation']
  }),
  
  getActiveContext: async () => ({
    current_focus: 'secure_coding',
    constraints: {
      performance: 'high'
    }
  }),
  
  getDecisions: async () => ([{
    id: 42,
    summary: 'Use input validation for all user inputs',
    rationale: 'Prevents XSS and injection attacks',
    tags: ['security', 'validation']
  }]),
  
  getSystemPatterns: async () => ([{
    id: 7,
    name: 'Input Sanitization Pattern',
    description: 'Always sanitize user inputs before processing or storing'
  }]),
  
  getCustomData: async ({ category, key }) => ({
    value: 'Test custom data value'
  }),
  
  logCustomData: async () => ({}),
  
  linkConPortItems: async () => ({}),
  
  getLinkedItems: async () => ([])
};

// Sample test insights
const securityInsight = {
  type: 'security_pattern',
  content: 'Always validate and sanitize user inputs to prevent XSS attacks.',
  tags: ['security', 'validation', 'xss'],
  timestamp: '2025-01-01T00:00:00Z'
};

const performanceInsight = {
  type: 'optimization_technique',
  content: 'Use memoization to cache expensive function results.',
  tags: ['performance', 'optimization'],
  timestamp: '2025-01-02T00:00:00Z'
};

const incompleteInsight = {
  type: 'decision',
  content: 'Use React',
  timestamp: '2025-01-03T00:00:00Z'
};

// Test context
const testContext = {
  domain: 'security',
  task: 'code_review',
  constraints: {
    performance: 'high',
    compatibility: 'cross-browser'
  },
  standards: ['OWASP Top 10', 'PCI-DSS'],
  principles: ['security_first', 'defense_in_depth'],
  practices: ['code_review', 'input_validation']
};

/**
 * Test suite for the Validation Layer
 */
describe('SIVS Validation Layer', () => {
  
  test('Quality validation works correctly', () => {
    const qualityResult = validation.validateQuality(securityInsight);
    expect(qualityResult.dimension).toBe('quality');
    expect(qualityResult.isValid).toBeTruthy();
    expect(qualityResult.overallScore).toBeGreaterThan(0.5);
    expect(qualityResult.scores).toHaveProperty('completeness');
    expect(qualityResult.scores).toHaveProperty('precision');
    expect(qualityResult.scores).toHaveProperty('credibility');
    expect(qualityResult.scores).toHaveProperty('timeliness');
    expect(qualityResult.evidences.length).toBeGreaterThan(0);
    
    // Test with incomplete insight
    const incompleteResult = validation.validateQuality(incompleteInsight);
    expect(incompleteResult.overallScore).toBeLessThan(qualityResult.overallScore);
  });
  
  test('Relevance validation works correctly', () => {
    const relevanceResult = validation.validateRelevance(securityInsight, testContext);
    expect(relevanceResult.dimension).toBe('relevance');
    expect(relevanceResult.scores).toHaveProperty('domainRelevance');
    expect(relevanceResult.scores).toHaveProperty('taskRelevance');
    expect(relevanceResult.scores).toHaveProperty('constraintCompatibility');
    
    // Performance insight should have lower relevance to security context
    const otherResult = validation.validateRelevance(performanceInsight, testContext);
    expect(otherResult.scores.domainRelevance).toBeLessThan(relevanceResult.scores.domainRelevance);
  });
  
  test('Coherence validation works correctly', () => {
    const coherenceResult = validation.validateCoherence(securityInsight);
    expect(coherenceResult.dimension).toBe('coherence');
    expect(coherenceResult.scores).toHaveProperty('internalConsistency');
    expect(coherenceResult.scores).toHaveProperty('structuralIntegrity');
    expect(coherenceResult.scores).toHaveProperty('logicalFlow');
  });
  
  test('Alignment validation works correctly', () => {
    const alignmentResult = validation.validateAlignment(securityInsight, testContext);
    expect(alignmentResult.dimension).toBe('alignment');
    
    // Should have scores for principles, standards, and practices
    if (testContext.principles.length > 0) {
      expect(alignmentResult.scores).toHaveProperty('principlesAlignment');
    }
    
    if (testContext.standards.length > 0) {
      expect(alignmentResult.scores).toHaveProperty('standardsAlignment');
    }
    
    if (testContext.practices.length > 0) {
      expect(alignmentResult.scores).toHaveProperty('practicesAlignment');
    }
  });
  
  test('Risk validation works correctly', () => {
    const riskResult = validation.validateRisk(securityInsight, testContext);
    expect(riskResult.dimension).toBe('risk');
    expect(riskResult).toHaveProperty('identifiedRisks');
    
    // For risk, lower score is better
    const lowRiskInsight = {
      ...securityInsight,
      content: securityInsight.content + ' Implement extensive input validation and sanitization.'
    };
    
    const lowRiskResult = validation.validateRisk(lowRiskInsight, testContext);
    expect(lowRiskResult.overallScore).toBeLessThanOrEqual(riskResult.overallScore);
  });
  
});

/**
 * Test suite for the Core Layer
 */
describe('SIVS Core Layer', () => {
  
  test('InsightValidator orchestrates multi-dimensional validation', () => {
    const validator = new InsightValidator();
    const results = validator.validateInsight(securityInsight, testContext);
    
    expect(results).toHaveProperty('dimensions');
    expect(results.dimensions).toHaveProperty('quality');
    expect(results.dimensions).toHaveProperty('relevance');
    expect(results.dimensions).toHaveProperty('coherence');
    expect(results.dimensions).toHaveProperty('alignment');
    expect(results.dimensions).toHaveProperty('risk');
    
    expect(results).toHaveProperty('overallScore');
    expect(results.overallScore).toBeGreaterThan(0);
    expect(results.overallScore).toBeLessThanOrEqual(1);
    
    expect(results).toHaveProperty('isValid');
    expect(results).toHaveProperty('issues');
    expect(results).toHaveProperty('strengths');
    expect(results).toHaveProperty('suggestions');
  });
  
  test('ValidationContext manages validation context correctly', () => {
    const context = new ValidationContext(testContext);
    expect(context.getContext()).toEqual(testContext);
    
    // Test context update
    const updatedContext = context.update({ task: 'security_audit' });
    expect(updatedContext).toBe(context); // Should return this for chaining
    expect(context.getContext().task).toBe('security_audit');
    
    // Test fromProductContext static method
    const productContext = {
      domain: 'performance',
      standards: ['iso_performance'],
      principles: ['fast_first'],
      practices: ['benchmarking'],
      constraints: { memory: 'low' }
    };
    
    const fromProduct = ValidationContext.fromProductContext(productContext);
    expect(fromProduct.getContext().domain).toBe('performance');
    expect(fromProduct.getContext().standards).toEqual(['iso_performance']);
    expect(fromProduct.getContext().principles).toEqual(['fast_first']);
    expect(fromProduct.getContext().practices).toEqual(['benchmarking']);
    expect(fromProduct.getContext().constraints).toEqual({ memory: 'low' });
    
    // Test enhanceWithActiveContext
    const activeContext = {
      current_focus: 'optimization',
      constraints: { cpu: 'low' }
    };
    
    fromProduct.enhanceWithActiveContext(activeContext);
    expect(fromProduct.getContext().task).toBe('optimization');
    expect(fromProduct.getContext().constraints).toEqual({ memory: 'low', cpu: 'low' });
  });
  
  test('StrategicInsightValidator provides high-level validation', () => {
    const validator = new StrategicInsightValidator({
      validation: {
        thresholds: {
          quality: 0.6,
          relevance: 0.7,
          coherence: 0.6,
          alignment: 0.7,
          risk: 0.4
        },
        weights: {
          quality: 0.2,
          relevance: 0.3,
          coherence: 0.2,
          alignment: 0.2,
          risk: 0.1
        }
      }
    });
    
    validator.setContext(testContext);
    const results = validator.validate(securityInsight);
    
    expect(results).toHaveProperty('overallScore');
    expect(results).toHaveProperty('isValid');
    expect(results).toHaveProperty('compositeScores');
    expect(results.compositeScores).toHaveProperty('trustworthiness');
    expect(results.compositeScores).toHaveProperty('applicability');
    expect(results.compositeScores).toHaveProperty('sustainability');
    
    // Test validateAndRank
    const insights = [securityInsight, performanceInsight, incompleteInsight];
    const rankedInsights = validator.validateAndRank(insights);
    
    expect(rankedInsights.length).toBe(3);
    // Should be sorted by score in descending order
    expect(rankedInsights[0].score).toBeGreaterThanOrEqual(rankedInsights[1].score);
    expect(rankedInsights[1].score).toBeGreaterThanOrEqual(rankedInsights[2].score);
    
    // Test filterValidInsights
    const threshold = 0.7;
    const validInsights = validator.filterValidInsights(insights, threshold);
    validInsights.forEach(item => {
      expect(item.score).toBeGreaterThanOrEqual(threshold);
    });
    
    // Test suggestImprovements
    const improvements = validator.suggestImprovements(incompleteInsight);
    expect(improvements).toHaveProperty('suggestions');
    expect(improvements).toHaveProperty('dimensionScores');
    expect(improvements.suggestions.length).toBeGreaterThan(0);
  });
  
});

/**
 * Test suite for the Integration Layer
 */
describe('SIVS Integration Layer', () => {
  
  test('ConPortSIVSIntegration initializes with ConPort context', async () => {
    const integration = new ConPortSIVSIntegration(mockConPortClient);
    await integration.initialize('/mock/workspace');
    
    // The validator should have been configured with ConPort contexts
    const validatorContext = integration.validator.validationContext.getContext();
    expect(validatorContext.domain).toBe('security');
    expect(validatorContext.task).toBe('secure_coding');
    expect(validatorContext.principles).toContain('security_first');
    expect(validatorContext.standards).toContain('owasp_top_10');
    expect(validatorContext.constraints).toHaveProperty('performance');
  });
  
  test('ConPortSIVSIntegration validates ConPort items', async () => {
    const integration = new ConPortSIVSIntegration(mockConPortClient);
    await integration.initialize('/mock/workspace');
    
    // Test validation of a decision
    const decisionResults = await integration.validateConPortItem('decision', 42);
    expect(decisionResults).toHaveProperty('overallScore');
    expect(decisionResults).toHaveProperty('isValid');
    expect(decisionResults).toHaveProperty('dimensions');
    
    // Test validation of a system pattern
    const patternResults = await integration.validateConPortItem('system_pattern', 7);
    expect(patternResults).toHaveProperty('overallScore');
    expect(patternResults).toHaveProperty('isValid');
    
    // Test validation of custom data
    const customDataResults = await integration.validateConPortItem('custom_data', 'test_category:test_key');
    expect(customDataResults).toHaveProperty('overallScore');
    expect(customDataResults).toHaveProperty('isValid');
  });
  
  test('ConPortSIVSIntegration transforms ConPort items correctly', () => {
    const integration = new ConPortSIVSIntegration(mockConPortClient);
    
    // Test transforming a decision
    const decision = {
      id: 42,
      summary: 'Use input validation',
      rationale: 'Prevents attacks',
      tags: ['security']
    };
    
    const decisionInsight = integration.transformConPortItemToInsight(decision, 'decision');
    expect(decisionInsight.type).toBe('decision');
    expect(decisionInsight.content).toContain('Use input validation');
    expect(decisionInsight.content).toContain('Prevents attacks');
    expect(decisionInsight.tags).toEqual(['security']);
    
    // Test transforming a system pattern
    const pattern = {
      id: 7,
      name: 'Pattern name',
      description: 'Pattern description',
      tags: ['pattern']
    };
    
    const patternInsight = integration.transformConPortItemToInsight(pattern, 'system_pattern');
    expect(patternInsight.type).toBe('system_pattern');
    expect(patternInsight.content).toBe('Pattern description');
    expect(patternInsight.name).toBe('Pattern name');
    expect(patternInsight.tags).toEqual(['pattern']);
  });
  
});

// Run tests
if (require.main === module) {
  console.log('Running SIVS tests...');
  // Simple test runner implementation
  const describe = (name, fn) => {
    console.log(`\n${name}`);
    fn();
  };
  
  const test = (name, fn) => {
    try {
      console.log(`  - ${name}`);
      fn();
      console.log('    ✓ Passed');
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
    }
  };
  
  const expect = (actual) => ({
    toBe: (expected) => {
      if (actual !== expected) throw new Error(`Expected ${expected}, got ${actual}`);
    },
    toEqual: (expected) => {
      const stringify = (val) => JSON.stringify(val, null, 2);
      if (stringify(actual) !== stringify(expected)) {
        throw new Error(`Expected ${stringify(expected)}, got ${stringify(actual)}`);
      }
    },
    toBeGreaterThan: (expected) => {
      if (!(actual > expected)) throw new Error(`Expected ${actual} to be greater than ${expected}`);
    },
    toBeLessThan: (expected) => {
      if (!(actual < expected)) throw new Error(`Expected ${actual} to be less than ${expected}`);
    },
    toBeGreaterThanOrEqual: (expected) => {
      if (!(actual >= expected)) throw new Error(`Expected ${actual} to be greater than or equal to ${expected}`);
    },
    toBeLessThanOrEqual: (expected) => {
      if (!(actual <= expected)) throw new Error(`Expected ${actual} to be less than or equal to ${expected}`);
    },
    toBeTruthy: () => {
      if (!actual) throw new Error(`Expected truthy value, got ${actual}`);
    },
    toBeFalsy: () => {
      if (actual) throw new Error(`Expected falsy value, got ${actual}`);
    },
    toHaveProperty: (prop) => {
      if (!(prop in actual)) throw new Error(`Expected object to have property ${prop}`);
    },
    toContain: (item) => {
      if (!actual.includes(item)) throw new Error(`Expected ${actual} to contain ${item}`);
    }
  });
}