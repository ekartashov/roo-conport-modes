/**
 * Code Mode Enhancement Usage Example
 * 
 * This example demonstrates how to use the Code Mode enhancements
 * to implement a knowledge-first approach to code implementation and documentation.
 */

// Import the Code Mode Enhancement
const { CodeModeEnhancement } = require('../utilities/mode-enhancements/code-mode-enhancement');

// Mock ConPort client for demonstration purposes
const mockConPortClient = {
  workspace_id: '/path/to/workspace',
  log_decision: async (params) => console.log('Logging decision:', params),
  log_system_pattern: async (params) => console.log('Logging system pattern:', params),
  log_custom_data: async (params) => console.log('Logging custom data:', params),
  log_progress: async (params) => console.log('Logging progress:', params),
  semantic_search_conport: async (params) => {
    console.log('Semantic search:', params);
    return { items: [] };
  }
};

/**
 * Example: Initialize and use Code Mode enhancement
 */
async function runCodeModeExample() {
  console.log('===== CODE MODE ENHANCEMENT EXAMPLE =====');
  
  // 1. Initialize the Code Mode Enhancement
  const codeMode = new CodeModeEnhancement(
    {
      enableKnowledgeFirstGuidelines: true,
      enableValidationCheckpoints: true,
      enableMetrics: true,
      knowledgeFirstOptions: {
        logToConPort: true,
        enhanceResponses: true
      }
    },
    mockConPortClient
  );
  
  console.log('\n----- Example 1: Process Source Code -----');
  
  // 2. Example source code
  const sourceCode = {
    type: 'source_code',
    language: 'javascript',
    filename: 'user-service.js',
    code: `/**
 * User service for managing user data
 */
class UserService {
  constructor(repository) {
    this.repository = repository;
  }
  
  /**
   * Get user by ID
   */
  async getUserById(id) {
    return this.repository.findById(id);
  }
  
  async getAllUsers() {
    return this.repository.findAll();
  }
  
  async createUser(userData) {
    // TODO: Add validation
    return this.repository.create(userData);
  }
}

module.exports = { UserService };`
  };
  
  // 3. Process the source code
  const processedCode = await codeMode.processSourceCode(
    sourceCode,
    { context: 'user management module' }
  );
  
  // 4. Log the processed code results
  console.log('Source code processing results:');
  console.log('- Documentation completeness valid:', 
    processedCode.validationResults?.documentationCompleteness?.valid);
  console.log('- Documentation coverage:', 
    processedCode.validationResults?.documentationCompleteness?.coverage?.percentage + '%');
  console.log('- Code quality valid:', 
    processedCode.validationResults?.codeQuality?.valid);
  console.log('- Implementation pattern valid:', 
    processedCode.validationResults?.implementationPattern?.valid);
  console.log('- Extracted knowledge items:', 
    Object.values(processedCode.extractedKnowledge || {})
      .reduce((count, arr) => count + (arr?.length || 0), 0));
  
  console.log('\n----- Example 2: Process Implementation Decision -----');
  
  // 5. Example implementation decision
  const implementationDecision = {
    type: 'implementation_decision',
    summary: 'Use repository pattern for data access in user service',
    rationale: 'Provides abstraction over the data source and simplifies testing',
    // Note: Missing alternatives - will trigger improvement suggestions
    implementationDetails: 'Inject repository dependency through constructor',
    tags: ['repository', 'dependency-injection']
  };
  
  // 6. Process the implementation decision
  const processedDecision = await codeMode.processImplementationDecision(
    implementationDecision,
    { context: 'user service implementation' }
  );
  
  // 7. Log the processed decision results
  console.log('Implementation decision processing results:');
  console.log('- Suggested improvements:', 
    processedDecision.suggestedImprovements?.map(i => i.description).join(', '));
  console.log('- Knowledge source classification:', 
    processedDecision.knowledgeSourceClassification?.isRetrieved ? 'Retrieved' : 'Generated');
  
  console.log('\n----- Example 3: Process Code Pattern -----');
  
  // 8. Example code pattern
  const codePattern = {
    type: 'code_pattern',
    name: 'Repository Pattern',
    description: 'Abstraction layer for data access',
    // Note: Missing usage, example, benefits, considerations
    tags: ['data-access', 'abstraction']
  };
  
  // 9. Process the code pattern
  const processedPattern = await codeMode.processCodePattern(
    codePattern,
    { context: 'data access patterns' }
  );
  
  // 10. Log the processed pattern results
  console.log('Code pattern processing results:');
  console.log('- Missing components:', 
    processedPattern.suggestedImprovements?.map(i => i.description).join(', '));
  console.log('- Knowledge source classification:', 
    processedPattern.knowledgeSourceClassification?.isRetrieved ? 'Retrieved' : 'Generated');
  
  console.log('\n----- Example 4: Process Edge Cases -----');
  
  // 11. Example edge cases
  const edgeCases = {
    type: 'edge_case',
    name: 'User Service Edge Cases',
    scenarios: [
      'User ID does not exist',
      'Database connection fails'
    ],
    handling: 'Throw specific errors with clear messages',
    // Note: Missing test cases
  };
  
  // 12. Process the edge cases
  const processedEdgeCases = await codeMode.processEdgeCases(
    edgeCases,
    { context: 'error handling' }
  );
  
  // 13. Log the processed edge cases results
  console.log('Edge cases processing results:');
  console.log('- Suggested improvements:', 
    processedEdgeCases.suggestedImprovements?.map(i => i.description).join(', '));
  
  console.log('\n----- Example 5: Process Performance Considerations -----');
  
  // 14. Example performance considerations
  const performanceConsiderations = {
    type: 'performance_consideration',
    name: 'User Service Performance',
    impact: 'User retrieval performance affects application responsiveness',
    optimizations: [
      'Index user ID field in database',
      'Cache frequently accessed users'
    ],
    // Note: Missing metrics and trade-offs
  };
  
  // 15. Process the performance considerations
  const processedPerformance = await codeMode.processPerformanceConsiderations(
    performanceConsiderations,
    { context: 'service optimization' }
  );
  
  // 16. Log the processed performance considerations results
  console.log('Performance considerations processing results:');
  console.log('- Suggested improvements:', 
    processedPerformance.suggestedImprovements?.map(i => i.description).join(', '));
  
  console.log('\n----- Example 6: Apply Knowledge-First to Response -----');
  
  // 17. Example response to be enhanced
  const response = {
    type: 'implementation_decision',
    summary: 'Use caching for frequent user queries',
    rationale: 'Reduce database load and improve response times',
    validationResults: processedDecision.validationResults,
    extractedKnowledge: processedCode.extractedKnowledge,
    knowledgeSourceClassification: {
      isRetrieved: false,
      isGenerated: true,
      confidence: 0.85,
      sources: []
    }
  };
  
  // 18. Apply knowledge-first principles to the response
  const enhancedResponse = codeMode.applyKnowledgeFirstToResponse(response);
  
  // 19. Log the enhanced response
  console.log('Enhanced response:');
  console.log('- Knowledge source reliability:', enhancedResponse.knowledgeSource.reliability.level);
  console.log('- Knowledge improvements:', 
    enhancedResponse.knowledgeImprovements.length ? 'Provided' : 'None');
  console.log('- ConPort integration hints:', 
    enhancedResponse.conPortIntegration.shouldLog ? 'Provided' : 'None');
  
  console.log('\n----- Example 7: Search Code Knowledge -----');
  
  // 20. Search for related code knowledge
  const searchResults = await codeMode.searchCodeKnowledge({
    text: 'repository pattern implementation',
    limit: 5
  });
  
  // 21. Log the search results
  console.log('Search results:', searchResults);
  
  console.log('\n----- Example 8: Get and Log Metrics -----');
  
  // 22. Get the metrics
  const metrics = codeMode.getMetrics();
  
  // 23. Log the metrics
  console.log('Metrics:');
  console.log('- Session metrics:', metrics.session);
  console.log('- Knowledge metrics:', metrics.knowledge);
  
  // 24. Log metrics to ConPort
  const logResult = await codeMode.logMetricsToConPort();
  console.log('Metrics logging result:', logResult.success ? 'Success' : 'Failed');
  
  console.log('\n===== EXAMPLE COMPLETED =====');
}

// Run the example
runCodeModeExample().catch(error => {
  console.error('Error running Code Mode example:', error);
});