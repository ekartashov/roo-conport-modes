/**
 * Example usage of the ConPort Maintenance Mode Enhancement
 * 
 * This example demonstrates the key capabilities of the ConPort Maintenance Mode Enhancement:
 * - Knowledge quality evaluation
 * - Maintenance operations planning and execution
 * - Template-based maintenance workflows
 * - ConPort integration for knowledge management
 */

// Import required components
const { ConPortMaintenanceModeEnhancement } = require('../utilities/mode-enhancements/conport-maintenance-mode-enhancement');

// Mock ConPort client for the examples
const mockConPortClient = {
  getProductContext: () => ({ /* mock product context data */ }),
  getActiveContext: () => ({ /* mock active context data */ }),
  getDecisions: () => [{ /* mock decision data */ }],
  getSystemPatterns: () => [{ /* mock system pattern data */ }],
  getCustomData: (params) => params ? [{ /* mock custom data for category */ }] : ['category1', 'category2'],
  logDecision: (params) => ({ success: true, id: 'mock-decision-id' }),
  logProgress: (params) => ({ success: true, id: 'mock-progress-id' }),
  logCustomData: (params) => ({ success: true })
};

// Create an instance of the ConPort Maintenance Mode Enhancement
const conportMaintenance = new ConPortMaintenanceModeEnhancement();

console.log('CONPORT MAINTENANCE MODE ENHANCEMENT - USAGE EXAMPLES');
console.log('====================================================');

/**
 * Example 1: Maintenance Templates
 */
console.log('\nEXAMPLE 1: MAINTENANCE TEMPLATES');
console.log('--------------------------------');

// Get available maintenance templates
const templates = conportMaintenance.getAllMaintenanceTemplates();
console.log('Available maintenance templates:');
Object.keys(templates).forEach(templateName => {
  console.log(`  - ${templates[templateName].name}: ${templates[templateName].description}`);
});

// Get specific template details
const auditTemplate = conportMaintenance.getMaintenanceTemplate('knowledge_audit');
console.log('\nKnowledge Audit Template steps:');
auditTemplate.steps.forEach((step, index) => {
  console.log(`  ${index + 1}. ${step.operation} operation on ${step.target}`);
  if (step.criteria) {
    console.log('     Criteria:', Object.entries(step.criteria)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', '));
  }
});

/**
 * Example 2: Quality Dimension Analysis
 */
console.log('\nEXAMPLE 2: QUALITY DIMENSION ANALYSIS');
console.log('------------------------------------');

// Get quality dimensions for decisions
const decisionQualityDimensions = conportMaintenance.getQualityDimensions('decisions');
console.log('Quality dimensions for decisions:');
if (decisionQualityDimensions) {
  Object.entries(decisionQualityDimensions.dimensions).forEach(([dimension, info]) => {
    console.log(`  - ${dimension}: ${info.description}`);
    console.log(`    Best practice: ${info.best_practice}`);
  });
  
  console.log('\nWeighting profiles:');
  Object.entries(decisionQualityDimensions.weightings).forEach(([profile, weights]) => {
    console.log(`  - ${profile}: ${Object.entries(weights)
      .map(([dim, weight]) => `${dim} (${weight})`)
      .join(', ')}`);
  });
}

// Evaluate quality of a decision
const exampleDecision = {
  summary: 'Selected React for the frontend framework',
  rationale: 'React provides excellent component reusability and has wide community support. We considered Vue and Angular but chose React for its flexibility and ecosystem.',
  implementation_details: 'Implemented with create-react-app, using Redux for state management and React Router for navigation.',
  alternatives: 'Vue.js, Angular'
};

console.log('\nEvaluating quality of example decision:');
const qualityEvaluation = conportMaintenance.evaluateItemQuality('decision_quality', exampleDecision);

if (qualityEvaluation.success) {
  console.log(`  Overall quality score: ${qualityEvaluation.averageScore.toFixed(2)}`);
  console.log('  Dimension scores:');
  Object.entries(qualityEvaluation.scores).forEach(([dimension, score]) => {
    console.log(`    - ${dimension}: ${score.toFixed(2)}`);
  });
  console.log('  Evaluation notes:');
  Object.entries(qualityEvaluation.evaluationNotes).forEach(([dimension, note]) => {
    console.log(`    - ${dimension}: ${note}`);
  });
}

/**
 * Example 3: Planning Maintenance Operations
 */
console.log('\nEXAMPLE 3: PLANNING MAINTENANCE OPERATIONS');
console.log('-----------------------------------------');

// Plan an audit operation
const auditOperationPlan = conportMaintenance.planMaintenanceOperation(
  'audit',
  'decisions',
  {
    criteria: {
      completeness: 0.7,
      consistency: 0.8,
      relevance: 0.6
    },
    depth: 'normal',
    output_format: 'detailed'
  }
);

console.log('Audit Operation Plan:');
if (auditOperationPlan.valid) {
  console.log('  Validation: Passed');
  console.log('  Steps:');
  auditOperationPlan.plan.steps.forEach((step, index) => {
    console.log(`    ${index + 1}. ${step.name}: ${step.description}`);
  });
  console.log('  Best practices:');
  auditOperationPlan.plan.bestPractices.forEach(practice => {
    console.log(`    - ${practice}`);
  });
} else {
  console.log('  Validation: Failed');
  console.log('  Errors:', auditOperationPlan.validationResult.errors);
}

// Plan a cleanup operation
const cleanupOperationPlan = conportMaintenance.planMaintenanceOperation(
  'cleanup',
  'progress_entries',
  {
    criteria: {
      status: 'DONE',
      last_modified_before: '-180d'
    },
    relationship_handling: 'preserve',
    backup: true
  }
);

console.log('\nCleanup Operation Plan:');
if (cleanupOperationPlan.valid) {
  console.log('  Validation: Passed');
  console.log('  Steps:');
  cleanupOperationPlan.plan.steps.forEach((step, index) => {
    console.log(`    ${index + 1}. ${step.name}: ${step.description}`);
  });
  console.log('  Estimated Impact:');
  const impact = cleanupOperationPlan.plan.estimatedImpact;
  console.log(`    - Data Impact: ${impact.dataImpact}`);
  console.log(`    - Relationship Impact: ${impact.relationshipImpact}`);
  console.log(`    - Reversibility: ${impact.reversibility}`);
} else {
  console.log('  Validation: Failed');
  console.log('  Errors:', cleanupOperationPlan.validationResult.errors);
}

// Plan an operation with invalid parameters
const invalidOperationPlan = conportMaintenance.planMaintenanceOperation(
  'cleanup',
  'decisions',
  {
    criteria: {
      last_modified_before: '-90d'
    }
    // Missing relationship_handling parameter
  }
);

console.log('\nInvalid Operation Plan:');
console.log('  Validation:', invalidOperationPlan.valid ? 'Passed' : 'Failed');
if (!invalidOperationPlan.valid) {
  console.log('  Errors:', invalidOperationPlan.validationResult.errors);
}

/**
 * Example 4: Executing Maintenance Operations
 */
console.log('\nEXAMPLE 4: EXECUTING MAINTENANCE OPERATIONS');
console.log('------------------------------------------');

// Execute the audit operation
console.log('Executing audit operation:');
const auditResult = conportMaintenance.executeMaintenanceOperation(
  auditOperationPlan,
  mockConPortClient
);

if (auditResult.success) {
  console.log('  Operation successful!');
  console.log(`  Operation ID: ${auditResult.operationId}`);
  console.log('  Audit Report:');
  console.log(`    - Collection: ${auditResult.results.auditReport.collectionName}`);
  console.log(`    - Items analyzed: ${auditResult.results.auditReport.itemsAnalyzed}`);
  console.log(`    - Overall quality: ${auditResult.results.auditReport.overallQuality.toFixed(2)}`);
  
  if (auditResult.results.recommendations && auditResult.results.recommendations.length > 0) {
    console.log('  Recommendations:');
    auditResult.results.recommendations
      .sort((a, b) => a.priority === 'high' ? -1 : a.priority === 'medium' && b.priority !== 'high' ? -1 : 1)
      .slice(0, 3) // Show top 3 recommendations
      .forEach((rec, index) => {
        console.log(`    ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.recommendation}`);
      });
  }
} else {
  console.log('  Operation failed:', auditResult.error);
}

// Get operation history
const operationHistory = conportMaintenance.getOperationHistory();
console.log('\nOperation History:');
console.log(`  Total operations: ${operationHistory.total}`);
console.log('  Recent operations:');
operationHistory.recentOperations.forEach((op, index) => {
  console.log(`    ${index + 1}. ${op.operationType} on ${op.collectionName} - ${op.status}`);
});

// Get details of a specific operation
if (auditResult.success) {
  const operationDetails = conportMaintenance.getOperationDetails(auditResult.operationId);
  console.log('\nDetails of audit operation:');
  console.log(`  Operation type: ${operationDetails.operationType}`);
  console.log(`  Target: ${operationDetails.collectionName}`);
  console.log(`  Status: ${operationDetails.status}`);
  console.log(`  Steps completed: ${operationDetails.steps.length}`);
}

console.log('\nEnd of ConPort Maintenance Mode Enhancement examples.');