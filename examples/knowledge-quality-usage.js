/**
 * Knowledge Quality Enhancement System Usage Example
 * 
 * This example demonstrates how to use the Knowledge Quality Enhancement System
 * to assess, enhance, and monitor knowledge quality.
 */

// Import the Knowledge Quality Enhancement System
const { createKnowledgeQuality } = require('../utilities/phase-3/knowledge-quality-enhancement/knowledge-quality');

// Mock ConPort client for demonstration purposes
const mockConPortClient = {
  // Basic ConPort API methods
  log_custom_data: async (args) => ({
    category: args.category,
    key: args.key,
    saved: true
  }),
  get_custom_data: async (args) => {
    // Mock implementation based on category and key
    if (args.category === 'temporal_knowledge_versions') {
      return {
        versionId: args.key,
        artifactType: args.key.split('_')[0],
        artifactId: args.key.split('_')[1],
        content: { title: 'Mock content for ' + args.key },
        metadata: { createdAt: new Date().toISOString() },
        tags: ['example']
      };
    }
    
    if (args.category === 'quality_criteria') {
      return null; // Force using default criteria
    }
    
    return null;
  },
  get_decisions: async (args) => {
    if (args.decision_id) {
      return {
        id: args.decision_id,
        summary: 'Example decision',
        rationale: 'This is the rationale for the example decision',
        implementation_details: 'Implementation details go here',
        timestamp: new Date().toISOString(),
        tags: ['example', 'decision']
      };
    }
    
    return [
      { id: 1, summary: 'Decision 1', timestamp: new Date().toISOString() },
      { id: 2, summary: 'Decision 2', timestamp: new Date().toISOString() }
    ];
  },
  get_system_patterns: async (args) => {
    if (args.pattern_id) {
      return {
        id: args.pattern_id,
        name: 'Example pattern',
        description: 'This is an example system pattern',
        timestamp: new Date().toISOString(),
        tags: ['example', 'pattern']
      };
    }
    
    return [
      { id: 1, name: 'Pattern 1', timestamp: new Date().toISOString() },
      { id: 2, name: 'Pattern 2', timestamp: new Date().toISOString() }
    ];
  },
  get_progress: async (args) => {
    if (args.progress_id) {
      return {
        id: args.progress_id,
        description: 'Example progress entry',
        status: 'IN_PROGRESS',
        timestamp: new Date().toISOString()
      };
    }
    
    return [
      { id: 1, description: 'Progress 1', status: 'TODO', timestamp: new Date().toISOString() },
      { id: 2, description: 'Progress 2', status: 'DONE', timestamp: new Date().toISOString() }
    ];
  },
  log_decision: async (args) => ({
    id: Date.now(),
    summary: args.summary,
    timestamp: new Date().toISOString(),
    saved: true
  }),
  update_decision: async (args) => ({ updated: true, id: args.decision_id }),
  update_system_pattern: async (args) => ({ updated: true, id: args.pattern_id }),
  update_progress: async (args) => ({ updated: true, id: args.progress_id }),
  get_active_context: async (args) => ({ current_focus: 'Example focus', open_issues: [] }),
  update_active_context: async (args) => ({ updated: true }),
  get_product_context: async (args) => ({ name: 'Example product' }),
  update_product_context: async (args) => ({ updated: true })
};

// Initialize the Knowledge Quality Enhancement System
const knowledgeQuality = createKnowledgeQuality({
  workspaceId: '/example/workspace',
  conPortClient: mockConPortClient,
  enableValidation: true,
  strictMode: false
});

/**
 * Example 1: Assessing Knowledge Quality
 * This example demonstrates how to assess the quality of a knowledge artifact.
 */
async function assessQualityExample() {
  console.log('\n=== Example 1: Assessing Knowledge Quality ===\n');
  
  // Assess quality of a decision
  console.log('Assessing quality of a decision artifact...');
  const decisionQuality = await knowledgeQuality.assessQuality({
    artifactType: 'decision',
    artifactId: '123',
    qualityDimensions: ['completeness', 'accuracy', 'clarity'],
    includeContent: true
  });
  
  console.log(`Decision quality score: ${decisionQuality.overallScore}/100`);
  console.log('Dimension scores:');
  decisionQuality.dimensionScores.forEach(dimension => {
    console.log(`- ${dimension.dimension}: ${dimension.score}/100`);
  });
  
  if (decisionQuality.improvementOpportunities.length > 0) {
    console.log('\nImprovement opportunities:');
    decisionQuality.improvementOpportunities.forEach(opportunity => {
      console.log(`- ${opportunity.description} (current score: ${opportunity.currentScore})`);
    });
  }
  
  // Assess quality of a system pattern
  console.log('\nAssessing quality of a system pattern artifact...');
  const patternQuality = await knowledgeQuality.assessQuality({
    artifactType: 'system_pattern',
    artifactId: '456'
  });
  
  console.log(`System pattern quality score: ${patternQuality.overallScore}/100`);
  
  return { decisionQuality, patternQuality };
}

/**
 * Example 2: Enhancing Knowledge Quality
 * This example demonstrates how to enhance the quality of a knowledge artifact.
 */
async function enhanceQualityExample() {
  console.log('\n=== Example 2: Enhancing Knowledge Quality ===\n');
  
  // Enhance a decision with completeness and clarity enhancements
  console.log('Enhancing a decision artifact...');
  const enhancementResult = await knowledgeQuality.enhanceQuality({
    artifactType: 'decision',
    artifactId: '123',
    enhancementTypes: ['completeness', 'clarity', 'metadata'],
    enhancementOptions: {
      completeness: {
        requiredFields: ['summary', 'rationale', 'alternatives', 'impact'],
        requiredSections: ['Context', 'Decision', 'Consequences'],
        defaultValues: {
          alternatives: 'No alternatives were considered.',
          impact: 'Impact analysis pending.'
        },
        defaultSectionContent: 'This section needs to be completed.'
      },
      clarity: {
        simplifyText: true,
        reduceJargon: true,
        jargonReplacements: {
          'utilize': 'use',
          'functionality': 'feature',
          'leverage': 'use',
          'paradigm': 'approach'
        },
        addGlossary: true,
        glossaryTerms: {
          'JWT': 'JSON Web Token, a compact, URL-safe means of representing claims.',
          'REST': 'Representational State Transfer, an architectural style for distributed systems.'
        }
      },
      metadata: {
        requiredMetadata: ['author', 'reviewedBy', 'createdAt', 'updatedAt'],
        updateTimestamps: true,
        addTags: ['enhanced', 'reviewed']
      }
    },
    createNewVersion: true
  });
  
  console.log(`Enhancement completed: ${enhancementResult.appliedEnhancements.length} enhancements applied`);
  console.log('Applied enhancements:');
  enhancementResult.appliedEnhancements.forEach(enhancement => {
    console.log(`- ${enhancement.type}: ${enhancement.description}`);
    if (enhancement.changes && enhancement.changes.length > 0) {
      enhancement.changes.forEach(change => {
        console.log(`  * ${change}`);
      });
    }
  });
  
  console.log(`\nNew version created: ${enhancementResult.enhancedVersionId}`);
  
  // Assess the quality of the enhanced version
  console.log('\nAssessing quality of the enhanced decision...');
  const enhancedQuality = await knowledgeQuality.assessQuality({
    artifactType: 'decision',
    artifactId: '123',
    versionId: enhancementResult.enhancedVersionId
  });
  
  console.log(`Enhanced decision quality score: ${enhancedQuality.overallScore}/100`);
  
  return { enhancementResult, enhancedQuality };
}

/**
 * Example 3: Defining Quality Criteria and Thresholds
 * This example demonstrates how to define custom quality criteria and set thresholds.
 */
async function defineCriteriaAndThresholdsExample() {
  console.log('\n=== Example 3: Defining Quality Criteria and Thresholds ===\n');
  
  // Define a custom quality criterion for traceability
  console.log('Defining a custom quality criterion for traceability...');
  const traceabilityCriterion = await knowledgeQuality.defineQualityCriteria({
    dimension: 'traceability',
    description: 'Measures how well the artifact is linked to related artifacts',
    criteria: {
      sourceTracking: 2,
      dependencyTracking: 3,
      versionTracking: 2
    },
    weight: 75,
    applicableTypes: ['decision', 'system_pattern', 'document']
  });
  
  console.log(`Custom criterion defined: ${traceabilityCriterion.dimension}`);
  console.log(`Description: ${traceabilityCriterion.description}`);
  console.log(`Weight: ${traceabilityCriterion.weight}`);
  
  // Set a quality threshold for the traceability dimension
  console.log('\nSetting a quality threshold for traceability...');
  const thresholdConfig = await knowledgeQuality.setQualityThreshold({
    dimension: 'traceability',
    threshold: 70,
    applicableTypes: ['decision', 'system_pattern'],
    alertLevel: 'warning',
    alertActions: {
      notifyInActiveContext: true,
      suggestEnhancements: ['add_dependencies', 'add_references']
    }
  });
  
  console.log(`Threshold set: ${thresholdConfig.dimension} = ${thresholdConfig.threshold}`);
  console.log(`Alert level: ${thresholdConfig.alertLevel}`);
  console.log(`Applicable to: ${thresholdConfig.applicableTypes.join(', ') || 'all types'}`);
  
  // Get all defined thresholds
  console.log('\nGetting all defined quality thresholds...');
  const allThresholds = await knowledgeQuality.getThresholds();
  
  console.log(`Found ${allThresholds.length} threshold(s)`);
  
  return { traceabilityCriterion, thresholdConfig };
}

/**
 * Example 4: Batch Quality Assessment
 * This example demonstrates how to assess quality for multiple artifacts in batch.
 */
async function batchAssessmentExample() {
  console.log('\n=== Example 4: Batch Quality Assessment ===\n');
  
  // Define a set of artifacts to assess
  const artifacts = [
    { artifactType: 'decision', artifactId: '123' },
    { artifactType: 'decision', artifactId: '124' },
    { artifactType: 'system_pattern', artifactId: '456' },
    { artifactType: 'document', artifactId: 'architecture-overview' },
    { artifactType: 'progress', artifactId: '789' }
  ];
  
  console.log(`Assessing quality of ${artifacts.length} artifacts in batch...`);
  const batchResult = await knowledgeQuality.batchAssessQuality({
    artifacts,
    qualityDimensions: ['completeness', 'accuracy', 'clarity', 'structure'],
    includeContent: false,
    concurrency: 3
  });
  
  console.log(`Batch assessment completed: ${batchResult.totalAssessed} artifacts assessed`);
  console.log(`Average quality score: ${batchResult.averageOverallScore}/100`);
  console.log(`High quality artifacts: ${batchResult.highQualityArtifacts.length}`);
  console.log(`Low quality artifacts: ${batchResult.lowQualityArtifacts.length}`);
  
  if (batchResult.lowQualityArtifacts.length > 0) {
    console.log('\nLow quality artifacts that need attention:');
    batchResult.lowQualityArtifacts.forEach(artifact => {
      console.log(`- ${artifact.artifactType}:${artifact.artifactId} (score: ${artifact.score})`);
    });
  }
  
  return batchResult;
}

/**
 * Example 5: Quality Trend Analysis
 * This example demonstrates how to analyze quality trends over time.
 */
async function qualityTrendAnalysisExample() {
  console.log('\n=== Example 5: Quality Trend Analysis ===\n');
  
  // Analyze quality trends for a decision
  console.log('Analyzing quality trends for a decision artifact...');
  const trendAnalysis = await knowledgeQuality.analyzeQualityTrend({
    artifactType: 'decision',
    artifactId: '123',
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    endDate: new Date().toISOString(),
    qualityDimensions: ['completeness', 'accuracy', 'clarity'],
    intervals: 6
  });
  
  console.log(`Trend analysis completed for ${trendAnalysis.artifactType}:${trendAnalysis.artifactId}`);
  console.log(`Analysis period: ${new Date(trendAnalysis.startDate).toLocaleDateString()} to ${new Date(trendAnalysis.endDate).toLocaleDateString()}`);
  
  if (trendAnalysis.trends.overall) {
    console.log(`\nOverall trend: ${trendAnalysis.trends.overall.direction}`);
    console.log(`Change: ${trendAnalysis.trends.overall.change > 0 ? '+' : ''}${trendAnalysis.trends.overall.change} points (${trendAnalysis.trends.overall.percentChange}%)`);
  }
  
  if (trendAnalysis.trends.dimensions) {
    console.log('\nDimension trends:');
    for (const [dimension, trend] of Object.entries(trendAnalysis.trends.dimensions)) {
      console.log(`- ${dimension}: ${trend.direction} (${trend.change > 0 ? '+' : ''}${trend.change} points, ${trend.percentChange}%)`);
    }
  }
  
  return trendAnalysis;
}

/**
 * Example 6: Quality Issue Identification and Reporting
 * This example demonstrates how to identify quality issues and generate comprehensive reports.
 */
async function qualityReportingExample() {
  console.log('\n=== Example 6: Quality Issue Identification and Reporting ===\n');
  
  // Identify quality issues
  console.log('Identifying quality issues...');
  const qualityIssues = await knowledgeQuality.identifyQualityIssues({
    artifactTypes: ['decision', 'system_pattern', 'document'],
    minimumSeverity: 'warning',
    limit: 10
  });
  
  console.log(`Identified ${qualityIssues.totalIssues} quality issues`);
  
  for (const [artifactType, issues] of Object.entries(qualityIssues.issuesByType)) {
    console.log(`\n${artifactType}: ${issues.length} issues`);
    issues.slice(0, 3).forEach(issue => {
      console.log(`- ${artifactType}:${issue.artifactId} has ${issue.violations.length} violations`);
    });
  }
  
  // Generate a comprehensive quality report
  console.log('\nGenerating comprehensive quality report...');
  const qualityReport = await knowledgeQuality.generateQualityReport({
    artifactTypes: ['decision', 'system_pattern', 'document'],
    includeDetails: true,
    includeTrends: true,
    sampleSize: 20
  });
  
  console.log(`Quality report generated with timestamp: ${qualityReport.timestamp}`);
  console.log('\nQuality Summary:');
  console.log(`- Total artifacts: ${qualityReport.summary.totalArtifacts}`);
  console.log(`- Average quality: ${qualityReport.summary.averageQuality}/100 (${qualityReport.summary.qualityRating})`);
  console.log(`- High quality artifacts: ${qualityReport.summary.highQualityCount}`);
  console.log(`- Low quality artifacts: ${qualityReport.summary.lowQualityCount}`);
  
  console.log('\nQuality by artifact type:');
  for (const [artifactType, data] of Object.entries(qualityReport.artifactTypes)) {
    console.log(`- ${artifactType}: ${data.averageScore}/100 (${data.qualityRating})`);
    
    if (data.dimensionScores) {
      console.log('  Dimension scores:');
      for (const [dimension, score] of Object.entries(data.dimensionScores)) {
        let statusText = '';
        if (score.status) {
          statusText = ` [${score.status.toUpperCase()}]`;
        }
        console.log(`  - ${dimension}: ${score.averageScore}/100${statusText}`);
      }
    }
  }
  
  if (qualityReport.trends && qualityReport.trends.direction) {
    console.log(`\nOverall trend: ${qualityReport.trends.direction} (${qualityReport.trends.change > 0 ? '+' : ''}${qualityReport.trends.change} points)`);
  }
  
  return { qualityIssues, qualityReport };
}

/**
 * Run all examples
 */
async function runAllExamples() {
  try {
    console.log('=== Knowledge Quality Enhancement System Examples ===\n');
    
    // Run examples sequentially
    await assessQualityExample();
    await enhanceQualityExample();
    await defineCriteriaAndThresholdsExample();
    await batchAssessmentExample();
    await qualityTrendAnalysisExample();
    await qualityReportingExample();
    
    console.log('\n=== All examples completed successfully ===');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run all examples
runAllExamples();

/**
 * Real-world Integration Example (commented out)
 * This shows how to integrate with a real ConPort client in a production environment
 */

/*
const { getConPortClient } = require('../utilities/conport-client');

async function realWorldExample() {
  // Initialize ConPort client
  const conPortClient = getConPortClient('/path/to/workspace');
  
  // Initialize Knowledge Quality Enhancement System
  const knowledgeQuality = createKnowledgeQuality({
    workspaceId: '/path/to/workspace',
    conPortClient,
    enableValidation: true
  });
  
  // Define a quality improvement workflow
  
  // 1. Assess current quality state
  const qualityReport = await knowledgeQuality.generateQualityReport({
    artifactTypes: ['decision', 'system_pattern', 'document'],
    includeDetails: true
  });
  
  console.log(`Overall quality: ${qualityReport.summary.averageQuality}/100 (${qualityReport.summary.qualityRating})`);
  
  // 2. Focus on low-quality artifacts
  for (const artifact of qualityReport.details.lowQualityArtifacts.slice(0, 5)) {
    console.log(`Enhancing ${artifact.artifactType}:${artifact.artifactId}...`);
    
    // Get detailed assessment
    const assessment = await knowledgeQuality.assessQuality({
      artifactType: artifact.artifactType,
      artifactId: artifact.artifactId
    });
    
    // Determine enhancement types based on low dimension scores
    const enhancementTypes = assessment.dimensionScores
      .filter(dimension => dimension.score < 60)
      .map(dimension => dimension.dimension);
    
    if (enhancementTypes.length > 0) {
      // Apply appropriate enhancements
      const enhancementResult = await knowledgeQuality.enhanceQuality({
        artifactType: artifact.artifactType,
        artifactId: artifact.artifactId,
        enhancementTypes,
        createNewVersion: true
      });
      
      console.log(`Applied ${enhancementResult.appliedEnhancements.length} enhancements`);
      
      // Reassess quality after enhancement
      const enhancedQuality = await knowledgeQuality.assessQuality({
        artifactType: artifact.artifactType,
        artifactId: artifact.artifactId,
        versionId: enhancementResult.enhancedVersionId
      });
      
      console.log(`Quality improved from ${artifact.score} to ${enhancedQuality.overallScore}`);
    }
  }
  
  // 3. Set quality thresholds
  await knowledgeQuality.setQualityThreshold({
    dimension: 'completeness',
    threshold: 75,
    alertLevel: 'warning'
  });
  
  await knowledgeQuality.setQualityThreshold({
    dimension: 'accuracy',
    threshold: 80,
    alertLevel: 'error'
  });
  
  // 4. Generate updated report
  const updatedReport = await knowledgeQuality.generateQualityReport({
    artifactTypes: ['decision', 'system_pattern', 'document']
  });
  
  console.log(`Updated quality: ${updatedReport.summary.averageQuality}/100 (${updatedReport.summary.qualityRating})`);
  
  // 5. Log progress
  await conPortClient.log_progress({
    workspace_id: '/path/to/workspace',
    description: 'Knowledge quality improvement',
    status: 'DONE'
  });
  
  // 6. Log decision
  await conPortClient.log_decision({
    workspace_id: '/path/to/workspace',
    summary: 'Implemented knowledge quality standards',
    rationale: `Set quality thresholds for completeness (${threshold1.threshold}) and accuracy (${threshold2.threshold})`
  });
}
*/