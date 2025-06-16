/**
 * Example usage of the Temporal Knowledge Management system
 * 
 * This example demonstrates how to use the Temporal Knowledge Management
 * system to track, retrieve, and analyze knowledge artifacts across time.
 */

// Import the temporal knowledge management system
const { createTemporalKnowledgeManager } = require('../../utilities/phase-3/temporal-knowledge-management/temporal-knowledge');

// Mock ConPort client for the example
const mockConPortClient = {
  async get_active_context({ workspace_id }) {
    console.log(`[ConPort] Getting active context for workspace ${workspace_id}`);
    return { current_focus: 'API Development' };
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
      { id: 123, summary: 'Use GraphQL for API', rationale: 'Better query flexibility', tags: ['API', 'architecture'], timestamp: '2025-01-15T10:30:00Z' },
      { id: 124, summary: 'Implement JWT Authentication', rationale: 'Stateless authentication for scalability', tags: ['security', 'API'], timestamp: '2025-01-16T14:45:00Z' }
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
      { id: 234, name: 'Repository Pattern', description: 'Abstract data access', tags: ['architecture', 'data-access'], timestamp: '2025-01-20T09:15:00Z' }
    ];
  },
  
  async log_custom_data({ workspace_id, category, key, value }) {
    console.log(`[ConPort] Logging custom data for workspace ${workspace_id}`);
    console.log(`[ConPort] Category: ${category}, Key: ${key}`);
    return { success: true };
  },
  
  async get_custom_data({ workspace_id, category, key }) {
    console.log(`[ConPort] Getting custom data for workspace ${workspace_id}`);
    if (category === 'temporal_versions') {
      return { value: [] }; // Empty versions for example purposes
    }
    return { value: { example: 'data' } };
  },
  
  async get_item_history({ workspace_id, item_type }) {
    console.log(`[ConPort] Getting item history for ${item_type} in workspace ${workspace_id}`);
    if (item_type === 'product_context') {
      return [
        { version: 1, timestamp: '2025-01-01T09:00:00Z', content: { project_name: 'API Project', stage: 'planning' } },
        { version: 2, timestamp: '2025-01-10T14:30:00Z', content: { project_name: 'API Project', stage: 'development', key_features: ['Authentication', 'Data Access'] } },
        { version: 3, timestamp: '2025-01-20T11:15:00Z', content: { project_name: 'API Project', stage: 'testing', key_features: ['Authentication', 'Data Access', 'Rate Limiting'] } }
      ];
    }
    return [];
  }
};

// Run the example
async function runExample() {
  console.log('=== Temporal Knowledge Management Example ===\n');
  
  try {
    // Initialize the temporal knowledge manager
    console.log('1. Initializing the Temporal Knowledge Management System');
    const temporalManager = createTemporalKnowledgeManager({
      workspaceId: '/projects/api-development',
      conPortClient: mockConPortClient,
      timeResolution: 'seconds', // Track changes with second-level precision
      retentionPolicy: {
        maxVersions: 50,  // Keep up to 50 versions per artifact
        maxAge: '365d'    // Keep versions for up to one year
      },
      logger: {
        info: (msg) => console.log(`[Info] ${msg}`),
        warn: (msg) => console.log(`[Warning] ${msg}`),
        error: (msg) => console.log(`[Error] ${msg}`)
      }
    });
    
    await temporalManager.initialize();
    console.log('✓ Temporal knowledge manager initialized\n');
    
    // Create a new version of a decision
    console.log('2. Creating a New Version of a Decision');
    const version = await temporalManager.createVersion({
      artifactType: 'decision',
      artifactId: 123,
      content: {
        summary: 'Use GraphQL and REST for API',
        rationale: 'GraphQL for complex queries, REST for simple operations',
        tags: ['API', 'architecture', 'hybrid-approach']
      },
      metadata: {
        author: 'developer1',
        description: 'Updated decision to use hybrid API approach'
      }
    });
    
    console.log(`✓ Created version: ${version.versionId}`);
    console.log(`✓ Timestamp: ${version.timestamp}`);
    console.log('✓ Version creation complete\n');
    
    // Get version history for an artifact
    console.log('3. Getting Version History for a Decision');
    const versionHistory = await temporalManager.getVersions({
      artifactType: 'decision',
      artifactId: 123
    });
    
    console.log(`✓ Retrieved ${versionHistory.versions.length} versions`);
    versionHistory.versions.forEach((ver, index) => {
      console.log(`  Version ${index + 1}: ${ver.versionId} (${ver.timestamp})`);
    });
    console.log('✓ Version history retrieval complete\n');
    
    // Get artifact at a specific point in time
    console.log('4. Retrieving Decision as it Existed at a Specific Time');
    const pastDecision = await temporalManager.getAtTime({
      artifactType: 'decision',
      artifactId: 123,
      timestamp: '2025-01-15T12:00:00Z'
    });
    
    console.log('✓ Retrieved decision as it existed on January 15, 2025:');
    console.log(`  Summary: ${pastDecision.content.summary}`);
    console.log(`  Rationale: ${pastDecision.content.rationale}`);
    console.log('✓ Point-in-time retrieval complete\n');
    
    // Compare versions
    console.log('5. Comparing Different Versions of a Decision');
    const comparison = await temporalManager.compareVersions({
      artifactType: 'decision',
      artifactId: 123,
      versionIdFrom: 'v1',
      versionIdTo: 'v2'
    });
    
    console.log('✓ Version comparison results:');
    console.log(`  Changed fields: ${comparison.changedFields.join(', ')}`);
    console.log(`  Summary changed: ${comparison.differences.summary ? 'Yes' : 'No'}`);
    console.log(`  Rationale changed: ${comparison.differences.rationale ? 'Yes' : 'No'}`);
    console.log('✓ Version comparison complete\n');
    
    // Analyze changes over time
    console.log('6. Analyzing Changes to Knowledge Over Time');
    const changeAnalysis = await temporalManager.analyzeChanges({
      artifactType: 'decision',
      artifactId: 123,
      timeRange: {
        from: '2025-01-01T00:00:00Z',
        to: '2025-02-01T00:00:00Z'
      },
      granularity: 'days'
    });
    
    console.log('✓ Change analysis results:');
    console.log(`  Total changes: ${changeAnalysis.totalChanges}`);
    console.log(`  Most active period: ${changeAnalysis.mostActivePeriod}`);
    console.log(`  Most frequently changed field: ${changeAnalysis.mostChangedField}`);
    console.log('✓ Change analysis complete\n');
    
    // Create a snapshot of knowledge at a point in time
    console.log('7. Creating a Snapshot of All Knowledge at a Point in Time');
    const snapshot = await temporalManager.createSnapshot({
      timestamp: '2025-01-20T00:00:00Z',
      artifactTypes: ['decision', 'system_pattern'],
      description: 'Pre-release knowledge snapshot'
    });
    
    console.log(`✓ Created snapshot: ${snapshot.snapshotId}`);
    console.log(`✓ Snapshot timestamp: ${snapshot.timestamp}`);
    console.log(`✓ Artifacts included: ${snapshot.artifactsCount}`);
    console.log('✓ Snapshot creation complete\n');
    
    // Roll back to a previous version
    console.log('8. Rolling Back a Decision to a Previous Version');
    const rollback = await temporalManager.rollbackToVersion({
      artifactType: 'decision',
      artifactId: 123,
      versionId: 'v1',
      createNewVersion: true,
      metadata: {
        author: 'developer2',
        description: 'Rolled back to original API decision'
      }
    });
    
    console.log('✓ Rollback complete:');
    console.log(`  New version created: ${rollback.newVersionId}`);
    console.log(`  Rolled back to: Version ${rollback.targetVersion}`);
    console.log('✓ Rollback operation complete\n');
    
    // Get product context evolution
    console.log('9. Analyzing Product Context Evolution');
    const contextEvolution = await temporalManager.getContextEvolution({
      contextType: 'product_context',
      timeRange: {
        from: '2025-01-01T00:00:00Z',
        to: '2025-02-01T00:00:00Z'
      }
    });
    
    console.log('✓ Product context evolution:');
    console.log(`  Versions analyzed: ${contextEvolution.versionsCount}`);
    console.log(`  Key milestones: ${contextEvolution.milestones.length}`);
    contextEvolution.milestones.forEach(milestone => {
      console.log(`    - ${milestone.date}: ${milestone.description}`);
    });
    console.log('✓ Context evolution analysis complete\n');
    
    // Generate temporal report
    console.log('10. Generating a Temporal Knowledge Report');
    const report = await temporalManager.generateTemporalReport({
      title: 'January 2025 Knowledge Evolution',
      timeRange: {
        from: '2025-01-01T00:00:00Z',
        to: '2025-02-01T00:00:00Z'
      },
      artifactTypes: ['decision', 'system_pattern'],
      includeChangeSummary: true,
      includeActivityGraph: true
    });
    
    console.log('✓ Generated temporal report:');
    console.log(`  Report ID: ${report.reportId}`);
    console.log(`  Period covered: ${report.period}`);
    console.log(`  Total changes: ${report.totalChanges}`);
    console.log(`  Key insights: ${report.keyInsights.length}`);
    console.log('✓ Report generation complete\n');
    
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
 * 1. Knowledge Auditing
 *    Track how critical decisions have evolved over time, when changes were made,
 *    and who made them. This provides an audit trail for compliance and governance.
 * 
 * 2. Trend Analysis
 *    Analyze how knowledge evolves over time to identify patterns, trends, and
 *    areas of frequent change or instability.
 * 
 * 3. Project Retrospectives
 *    Create snapshots at key project milestones and compare knowledge across different
 *    phases to understand how understanding evolved throughout the project lifecycle.
 * 
 * 4. Knowledge Recovery
 *    Roll back to previous versions of knowledge artifacts when necessary, or
 *    retrieve how knowledge existed at a specific point in time for reference.
 * 
 * 5. Change Impact Analysis
 *    Analyze how changes to one knowledge artifact over time have affected related
 *    artifacts, identifying cascading effects and interdependencies.
 */