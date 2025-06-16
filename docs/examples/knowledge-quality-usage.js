/**
 * Example usage of the Knowledge Quality Enhancement system
 * 
 * This example demonstrates how to use the Knowledge Quality Enhancement
 * system to assess, improve, and maintain high-quality knowledge in ConPort.
 */

// Import the knowledge quality enhancement system
const { createKnowledgeQualityEnhancer } = require('../../utilities/phase-3/knowledge-quality-enhancement/knowledge-quality');

// Mock ConPort client for the example
const mockConPortClient = {
  async get_active_context({ workspace_id }) {
    console.log(`[ConPort] Getting active context for workspace ${workspace_id}`);
    return { current_focus: 'API Quality Improvement' };
  },
  
  async update_active_context({ workspace_id, patch_content }) {
    console.log(`[ConPort] Updating active context for workspace ${workspace_id}`);
    console.log(`[ConPort] Patch content: ${JSON.stringify(patch_content, null, 2)}`);
    return { success: true };
  },
  
  async log_decision({ workspace_id, summary, rationale, tags }) {
    console.log(`[ConPort] Logging decision for workspace ${workspace_id}`);
    console.log(`[ConPort] Decision: ${summary}`);
    return { id: Math.floor(Math.random() * 1000), summary, rationale, tags };
  },
  
  async get_decisions({ workspace_id }) {
    console.log(`[ConPort] Getting decisions for workspace ${workspace_id}`);
    return [
      { id: 123, summary: 'Use GraphQL for API', rationale: 'Better query flexibility', tags: ['API', 'architecture'] },
      { id: 124, summary: 'Implement JWT Authentication', rationale: 'Stateless auth for scalability', tags: ['security', 'API'] }
    ];
  },
  
  async log_system_pattern({ workspace_id, name, description, tags }) {
    console.log(`[ConPort] Logging system pattern for workspace ${workspace_id}`);
    console.log(`[ConPort] Pattern: ${name}`);
    return { id: Math.floor(Math.random() * 1000), name, description, tags };
  },
  
  async get_system_patterns({ workspace_id }) {
    console.log(`[ConPort] Getting system patterns for workspace ${workspace_id}`);
    return [
      { id: 234, name: 'Repository Pattern', description: 'Abstract data access', tags: ['architecture', 'data-access'] }
    ];
  },
  
  async log_custom_data({ workspace_id, category, key, value }) {
    console.log(`[ConPort] Logging custom data for workspace ${workspace_id}`);
    console.log(`[ConPort] Category: ${category}, Key: ${key}`);
    return { success: true };
  },
  
  async get_custom_data({ workspace_id, category, key }) {
    console.log(`[ConPort] Getting custom data for workspace ${workspace_id}`);
    return { value: { example: 'data' } };
  }
};

// Define custom quality policies for the example
const customQualityPolicies = {
  decision: {
    completeness: {
      required: ['summary', 'rationale', 'tags'],
      recommended: ['implementation_details'],
      minLength: { summary: 10, rationale: 20 }
    },
    clarity: {
      maxJargonDensity: 0.1,
      maxSentenceLength: 25,
      preferredReadabilityLevel: 'technical'
    },
    consistency: {
      enforceTags: ['type', 'domain'],
      enforceTitleFormat: 'action-oriented'
    }
  },
  system_pattern: {
    completeness: {
      required: ['name', 'description', 'tags'],
      recommended: ['code_examples', 'usage_scenarios'],
      minLength: { description: 50 }
    }
  }
};

// Run the example
async function runExample() {
  console.log('=== Knowledge Quality Enhancement Example ===\n');
  
  try {
    // Initialize the quality enhancement system
    console.log('1. Initializing the Knowledge Quality Enhancement System');
    const qualityEnhancer = createKnowledgeQualityEnhancer({
      workspaceId: '/projects/api-development',
      conPortClient: mockConPortClient,
      enableValidation: true,
      qualityPolicies: customQualityPolicies,
      logger: {
        info: (msg) => console.log(`[Info] ${msg}`),
        warn: (msg) => console.log(`[Warning] ${msg}`),
        error: (msg) => console.log(`[Error] ${msg}`)
      }
    });
    
    await qualityEnhancer.initialize();
    console.log('✓ Quality enhancement system initialized\n');
    
    // Assess the quality of a decision
    console.log('2. Assessing Quality of a Decision');
    const qualityAssessment = await qualityEnhancer.assessQuality({
      artifactType: 'decision',
      artifactId: 123,
      criteria: ['completeness', 'clarity', 'consistency', 'correctness'],
      detailed: true
    });
    
    console.log(`✓ Overall quality score: ${qualityAssessment.overallScore.toFixed(2)}`);
    console.log('✓ Dimension scores:');
    Object.entries(qualityAssessment.dimensionScores).forEach(([dimension, score]) => {
      console.log(`  ${dimension}: ${score.toFixed(2)}`);
    });
    console.log('✓ Quality assessment complete\n');
    
    // Get enhancement recommendations
    console.log('3. Getting Enhancement Recommendations');
    const recommendations = await qualityEnhancer.getEnhancementRecommendations({
      artifactType: 'decision',
      artifactId: 123,
      targetQualityLevel: 'high'
    });
    
    console.log('✓ Enhancement recommendations:');
    recommendations.recommendations.forEach(rec => {
      console.log(`  ${rec.priority}. ${rec.description}`);
      if (rec.details) {
        console.log(`     Details: ${rec.details}`);
      }
    });
    console.log('✓ Recommendations retrieval complete\n');
    
    // Enhance a decision
    console.log('4. Enhancing a Decision Automatically');
    const enhancementResult = await qualityEnhancer.enhanceArtifact({
      artifactType: 'decision',
      artifactId: 123,
      enhancements: ['completeness', 'clarity'],
      applyImmediately: true
    });
    
    console.log('✓ Enhancement results:');
    console.log(`  Success: ${enhancementResult.success}`);
    console.log(`  Applied enhancements: ${enhancementResult.appliedEnhancements.join(', ')}`);
    console.log(`  New quality score: ${enhancementResult.newQualityScore.toFixed(2)}`);
    console.log('✓ Enhancement complete\n');
    
    // Assess multiple artifacts
    console.log('5. Assessing Quality of All Decisions');
    const bulkAssessment = await qualityEnhancer.assessBulkQuality({
      artifactType: 'decision',
      criteria: ['completeness', 'consistency'],
      filters: {
        tags: ['API']
      }
    });
    
    console.log('✓ Bulk assessment results:');
    console.log(`  Artifacts assessed: ${bulkAssessment.assessedCount}`);
    console.log(`  Average quality score: ${bulkAssessment.averageScore.toFixed(2)}`);
    console.log(`  High quality artifacts: ${bulkAssessment.highQualityCount}`);
    console.log(`  Low quality artifacts: ${bulkAssessment.lowQualityCount}`);
    console.log('✓ Bulk assessment complete\n');
    
    // Define a quality policy
    console.log('6. Defining a Custom Quality Policy');
    await qualityEnhancer.defineQualityPolicy({
      name: 'critical-security-decisions',
      scope: {
        artifactTypes: ['decision'],
        filter: {
          tags: ['security', 'critical']
        }
      },
      thresholds: {
        completeness: 0.9,
        consistency: 0.85,
        clarity: 0.8
      },
      actions: {
        onViolation: 'notify',
        preventUpdateIfBelowThreshold: true
      }
    });
    console.log('✓ Quality policy defined\n');
    
    // Apply a quality gate
    console.log('7. Applying a Quality Gate');
    const gateResult = await qualityEnhancer.applyQualityGate({
      gateName: 'release-readiness',
      artifactTypes: ['decision', 'system_pattern'],
      filters: {
        tags: ['API']
      }
    });
    
    console.log('✓ Quality gate results:');
    console.log(`  Passed: ${gateResult.passed}`);
    console.log(`  Artifacts checked: ${gateResult.artifactsChecked}`);
    console.log(`  Artifacts passed: ${gateResult.artifactsPassed}`);
    console.log(`  Artifacts failed: ${gateResult.artifactsFailed}`);
    console.log('✓ Quality gate check complete\n');
    
    // Generate quality metrics
    console.log('8. Generating Quality Metrics');
    const metrics = await qualityEnhancer.getQualityMetrics({
      artifactType: 'decision',
      artifactId: 123,
      includeHistorical: true,
      historyDepth: 5
    });
    
    console.log('✓ Quality metrics:');
    console.log(`  Current score: ${metrics.currentScore.toFixed(2)}`);
    console.log(`  Trend: ${metrics.trend}`);
    console.log(`  Areas needing improvement: ${metrics.improvementAreas.join(', ')}`);
    console.log('✓ Metrics generation complete\n');
    
    // Run an enhancement campaign
    console.log('9. Running an Enhancement Campaign');
    const campaignResult = await qualityEnhancer.runEnhancementCampaign({
      targetArtifacts: {
        artifactTypes: ['decision', 'system_pattern'],
        qualityScore: { max: 0.7 }
      },
      enhancements: ['completeness', 'clarity'],
      enhancementStrategy: 'auto-where-possible',
      prioritizeByImpact: true
    });
    
    console.log('✓ Campaign results:');
    console.log(`  Artifacts processed: ${campaignResult.artifactsProcessed}`);
    console.log(`  Artifacts enhanced: ${campaignResult.artifactsEnhanced}`);
    console.log(`  Average quality improvement: ${campaignResult.averageImprovement.toFixed(2)}`);
    console.log('✓ Enhancement campaign complete\n');
    
    // Certify high-quality artifacts
    console.log('10. Certifying High-Quality Artifacts');
    const certificationResult = await qualityEnhancer.certifyArtifacts({
      artifactTypes: ['decision', 'system_pattern'],
      minimumQualityScore: 0.9,
      certificationLevel: 'gold',
      validityPeriod: '180d'
    });
    
    console.log('✓ Certification results:');
    console.log(`  Artifacts certified: ${certificationResult.artifactsCertified}`);
    console.log(`  Certification level: ${certificationResult.certificationLevel}`);
    console.log(`  Valid until: ${certificationResult.validUntil}`);
    console.log('✓ Certification complete\n');
    
    console.log('=== Example Complete ===');
    
  } catch (error) {
    console.error('Example failed:', error.message);
  }
}

// Run the example
runExample().catch(err => console.error('Unexpected error:', err));

/**
 * Real-world Use Case Scenarios:
 * 
 * 1. Quality Assurance
 *    Ensure that all knowledge artifacts meet minimum quality standards
 *    before they are used for critical decision-making or implementation.
 * 
 * 2. Knowledge Improvement
 *    Identify and enhance low-quality knowledge artifacts to improve
 *    overall knowledge base quality over time.
 * 
 * 3. Quality Gates
 *    Establish quality checkpoints for critical project phases,
 *    ensuring knowledge meets standards before proceeding.
 * 
 * 4. Quality Metrics
 *    Track knowledge quality metrics over time to identify trends
 *    and focus improvement efforts on areas with the greatest need.
 * 
 * 5. Certification
 *    Certify high-quality knowledge artifacts to indicate their reliability
 *    and trustworthiness for critical use cases.
 */