/**
 * Strategic Insight Validation System (SIVS) - Demonstration Script
 * 
 * This script demonstrates how to use SIVS with ConPort and other Phase 4 components.
 * It shows real-world validation scenarios and how SIVS integrates into knowledge
 * management workflows.
 */

// Import SIVS components
const {
  StrategicInsightValidator, 
  ValidationContext,
  ConPortSIVSIntegration,
  SIVSIntegrationManager
} = require('./index');

// Mock clients for demonstration
const mockConPortClient = require('../mock/conport-client');
const mockKDAPClient = require('../mock/kdap-client');
const mockAKAFClient = require('../mock/akaf-client');

/**
 * Demonstrates standalone validation of insights
 */
async function demonstrateStandaloneValidation() {
  console.log('\n=== DEMONSTRATING STANDALONE VALIDATION ===\n');
  
  // Create validation context
  const context = new ValidationContext({
    domain: 'security',
    task: 'secure_coding',
    constraints: {
      performance: 'high',
      compatibility: 'cross-browser'
    },
    principles: [
      'defense_in_depth',
      'least_privilege',
      'fail_secure'
    ],
    standards: [
      'OWASP Top 10',
      'PCI-DSS'
    ]
  });
  
  // Create strategic validator
  const validator = new StrategicInsightValidator({
    validation: {
      weights: {
        quality: 0.2,
        relevance: 0.3,
        coherence: 0.2,
        alignment: 0.2,
        risk: 0.1
      }
    },
    context: context.getContext()
  });
  
  // Sample insights to validate
  const insights = [
    {
      type: 'security_pattern',
      name: 'Input Validation Pattern',
      content: 'Always validate and sanitize user inputs to prevent XSS and SQL injection attacks. Use parameterized queries for database operations and encode output for display. This pattern follows the principle of defense in depth by validating data at multiple layers.',
      tags: ['security', 'validation', 'xss', 'sql-injection'],
      timestamp: new Date().toISOString()
    },
    {
      type: 'decision',
      name: 'Authentication Strategy',
      content: 'Use JWT tokens for authentication with short expiry and refresh token rotation. Store tokens in HttpOnly cookies to prevent XSS. This decision was made to balance security and performance requirements.',
      tags: ['security', 'authentication', 'jwt'],
      timestamp: new Date().toISOString()
    },
    {
      type: 'code_snippet',
      name: 'Password Validation',
      content: 'function validatePassword(password) { return password.length >= 8; }',
      tags: ['security', 'validation'],
      timestamp: new Date().toISOString()
    }
  ];
  
  // Validate and rank insights
  const rankedInsights = validator.validateAndRank(insights);
  
  // Display validation results
  for (const item of rankedInsights) {
    console.log(`\nINSIGHT: ${item.insight.name || 'Unnamed'} (${item.insight.type})`);
    console.log(`SCORE: ${item.score.toFixed(2)}`);
    console.log(`VALID: ${item.validation.isValid ? 'Yes' : 'No'}`);
    
    console.log('\nDIMENSION SCORES:');
    Object.entries(item.validation.dimensions).forEach(([dim, result]) => {
      console.log(`  - ${dim}: ${result.overallScore.toFixed(2)}`);
    });
    
    if (item.validation.issues.length > 0) {
      console.log('\nISSUES:');
      item.validation.issues.forEach(issue => {
        console.log(`  - ${issue}`);
      });
    }
    
    if (item.validation.suggestions.length > 0) {
      console.log('\nSUGGESTIONS:');
      item.validation.suggestions.forEach(suggestion => {
        console.log(`  - ${suggestion}`);
      });
    }
    
    console.log('\n---');
  }
}

/**
 * Demonstrates ConPort integration
 */
async function demonstrateConPortIntegration() {
  console.log('\n=== DEMONSTRATING CONPORT INTEGRATION ===\n');
  
  // Create SIVS integration with ConPort
  const sivsIntegration = new ConPortSIVSIntegration(mockConPortClient, {
    autoSaveResults: true,
    validationHistoryLimit: 5
  });
  
  // Initialize with workspace context
  console.log('Initializing SIVS with ConPort context...');
  await sivsIntegration.initialize('/demo/workspace');
  
  // Validate a ConPort decision
  console.log('\nValidating ConPort decision...');
  const decisionValidation = await sivsIntegration.validateConPortItem('decision', 42);
  
  console.log(`DECISION VALIDATION SCORE: ${decisionValidation.overallScore.toFixed(2)}`);
  console.log(`VALID: ${decisionValidation.isValid ? 'Yes' : 'No'}`);
  
  if (decisionValidation.suggestions.length > 0) {
    console.log('\nIMPROVEMENT SUGGESTIONS:');
    decisionValidation.suggestions.forEach(suggestion => {
      console.log(`  - ${suggestion}`);
    });
  }
  
  // Validate a ConPort system pattern
  console.log('\nValidating ConPort system pattern...');
  const patternValidation = await sivsIntegration.validateConPortItem('system_pattern', 7);
  
  console.log(`SYSTEM PATTERN VALIDATION SCORE: ${patternValidation.overallScore.toFixed(2)}`);
  console.log(`VALID: ${patternValidation.isValid ? 'Yes' : 'No'}`);
  
  // Get latest validation results from ConPort
  console.log('\nRetrieving latest validation results from ConPort...');
  const latestResults = await sivsIntegration.getLatestValidationResults('decision', 42);
  
  console.log(`LATEST VALIDATION TIMESTAMP: ${latestResults ? latestResults.timestamp : 'None available'}`);
}

/**
 * Demonstrates KDAP and AKAF integration
 */
async function demonstratePhase4Integration() {
  console.log('\n=== DEMONSTRATING PHASE 4 COMPONENT INTEGRATION ===\n');
  
  // Initialize integration manager with all clients
  const manager = new SIVSIntegrationManager({
    conport: {
      autoSaveResults: true
    },
    kdap: {
      onlyUseValidKnowledge: true
    },
    akaf: {
      minValidationScore: 0.6
    }
  });
  
  await manager.initialize(
    {
      conport: mockConPortClient,
      kdap: mockKDAPClient,
      akaf: mockAKAFClient
    },
    '/demo/workspace'
  );
  
  // Validate knowledge for KDAP planning
  console.log('\nValidating knowledge for planning...');
  const kdapRequest = {
    goal: 'Implement secure authentication',
    knowledgeSources: [
      {
        type: 'conport',
        itemType: 'decision',
        itemId: 42,
        relevance: 'high'
      },
      {
        type: 'conport',
        itemType: 'system_pattern',
        itemId: 7,
        relevance: 'medium'
      }
    ]
  };
  
  const enhancedRequest = await manager.validatePlanningKnowledge(kdapRequest);
  
  console.log('VALIDATED KNOWLEDGE SOURCES:');
  enhancedRequest.knowledgeSources.forEach(source => {
    console.log(`  - ${source.itemType} ${source.itemId}: ${source.score ? source.score.toFixed(2) : 'No score'} (Valid: ${source.isValid !== false ? 'Yes' : 'No'})`);
  });
  
  // Create improvement plan for system pattern
  console.log('\nCreating improvement plan for system pattern...');
  const improvementPlan = await manager.createImprovementPlan('system_pattern', 7);
  
  console.log('IMPROVEMENT PLAN:');
  console.log(`  Target: ${improvementPlan.goal.target}`);
  console.log(`  Current Score: ${improvementPlan.goal.currentScore.toFixed(2)}`);
  console.log(`  Target Score: ${improvementPlan.goal.targetScore.toFixed(2)}`);
  
  if (improvementPlan.steps && improvementPlan.steps.length > 0) {
    console.log('  Steps:');
    improvementPlan.steps.forEach((step, index) => {
      console.log(`    ${index + 1}. ${step.description}`);
    });
  }
  
  // Validate patterns for AKAF
  console.log('\nValidating patterns for knowledge application...');
  const patterns = [
    {
      id: 'P1',
      name: 'Authentication Pattern',
      source: { type: 'conport', itemType: 'system_pattern', itemId: 7 }
    },
    {
      id: 'P2',
      name: 'Validation Pattern',
      source: { type: 'conport', itemType: 'system_pattern', itemId: 8 }
    },
    {
      id: 'P3',
      name: 'Error Handling Pattern',
      source: { type: 'conport', itemType: 'system_pattern', itemId: 9 }
    }
  ];
  
  const validatedPatterns = await manager.filterAndValidatePatterns(patterns);
  
  console.log('VALIDATED PATTERNS:');
  validatedPatterns.forEach(pattern => {
    console.log(`  - ${pattern.name}: ${pattern.validationScore ? pattern.validationScore.toFixed(2) : 'No score'} (Valid: ${pattern.isValid !== false ? 'Yes' : 'No'})`);
  });
}

// Run demonstrations
async function runDemonstrations() {
  try {
    console.log('\n=== SIVS DEMONSTRATION ===\n');
    
    console.log('This script demonstrates how SIVS validates knowledge and integrates with other components.');
    
    await demonstrateStandaloneValidation();
    await demonstrateConPortIntegration();
    await demonstratePhase4Integration();
    
    console.log('\n=== DEMONSTRATION COMPLETE ===\n');
  } catch (error) {
    console.error('Demonstration failed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  runDemonstrations();
}

// Export for use in other scripts
module.exports = {
  demonstrateStandaloneValidation,
  demonstrateConPortIntegration,
  demonstratePhase4Integration,
  runDemonstrations
};