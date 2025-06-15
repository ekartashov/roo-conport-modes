/**
 * Architect Mode Enhancement Usage Example
 * 
 * This example demonstrates how to use the Architect Mode enhancements
 * to implement a knowledge-first approach to architectural design and documentation.
 */

// Import the Architect Mode Enhancement
const { ArchitectModeEnhancement } = require('../utilities/mode-enhancements/architect-mode-enhancement');

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
 * Example: Initialize and use Architect Mode enhancement
 */
async function runArchitectModeExample() {
  console.log('===== ARCHITECT MODE ENHANCEMENT EXAMPLE =====');
  
  // 1. Initialize the Architect Mode Enhancement
  const architectMode = new ArchitectModeEnhancement(
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
  
  console.log('\n----- Example 1: Process Architectural Decision -----');
  
  // 2. Example architectural decision
  const architecturalDecision = {
    type: 'architectural_decision',
    summary: 'Adopt microservices architecture for e-commerce platform',
    rationale: 'Need for independent scaling and deployment of different components',
    // Note: Missing tradeoffs and alternatives - will trigger improvement suggestions
    implementationDetails: 'Will use Docker containers and Kubernetes for orchestration',
    tags: ['microservices', 'e-commerce']
  };
  
  // 3. Process the architectural decision
  const processedDecision = await architectMode.processArchitecturalDecision(
    architecturalDecision,
    { context: 'e-commerce platform redesign' }
  );
  
  // 4. Log the processed decision results
  console.log('Decision processing results:');
  console.log('- Valid:', processedDecision.validationResults?.tradeoffDocumentation?.valid);
  console.log('- Suggested improvements:', 
    processedDecision.suggestedImprovements?.map(i => i.description).join(', '));
  
  console.log('\n----- Example 2: Process System Pattern -----');
  
  // 5. Example system pattern
  const systemPattern = {
    type: 'system_pattern',
    name: 'API Gateway Pattern',
    description: 'Centralized entry point for all client requests to backend services',
    // Note: Missing applicability, benefits, consequences, examples
    tags: ['api', 'gateway', 'integration']
  };
  
  // 6. Process the system pattern
  const processedPattern = await architectMode.processSystemPattern(
    systemPattern,
    { context: 'microservices integration' }
  );
  
  // 7. Log the processed pattern results
  console.log('Pattern processing results:');
  console.log('- Valid:', processedPattern.validationResults?.patternApplication?.valid);
  console.log('- Missing components:', 
    processedPattern.suggestedImprovements?.map(i => i.description).join(', '));
  
  console.log('\n----- Example 3: Process Architectural Design -----');
  
  // 8. Example architectural design
  const architecturalDesign = {
    type: 'architectural_design',
    name: 'E-commerce Platform Architecture',
    components: [
      { name: 'Product Service', type: 'microservice', responsibility: 'Product catalog management' },
      { name: 'Order Service', type: 'microservice', responsibility: 'Order processing' },
      { name: 'API Gateway', type: 'gateway', responsibility: 'Request routing and aggregation' }
    ],
    dataFlow: [
      { from: 'Client', to: 'API Gateway', protocol: 'HTTPS' },
      { from: 'API Gateway', to: 'Product Service', protocol: 'gRPC' },
      { from: 'API Gateway', to: 'Order Service', protocol: 'gRPC' }
    ]
  };
  
  // 9. Process the architectural design
  const processedDesign = await architectMode.processArchitecturalDesign(
    architecturalDesign,
    { context: 'system overview' }
  );
  
  // 10. Log the processed design results
  console.log('Design processing results:');
  console.log('- Architecture consistency valid:', 
    processedDesign.validationResults?.architectureConsistency?.valid);
  console.log('- Pattern application valid:', 
    processedDesign.validationResults?.patternApplication?.valid);
  console.log('- Potential decisions:', 
    processedDesign.suggestedDecisions?.map(d => d.summary).join(', '));
  console.log('- Potential patterns:', 
    processedDesign.suggestedPatterns?.map(p => p.name).join(', '));
  
  console.log('\n----- Example 4: Process Quality Attributes -----');
  
  // 11. Example quality attributes
  const qualityAttributes = {
    type: 'quality_attributes',
    name: 'E-commerce Platform QA',
    performance: {
      requirements: 'Response time under 300ms for 95% of requests',
      metrics: ['response_time', 'throughput']
    },
    // Note: Missing other important quality attributes
    security: {
      requirements: 'PCI DSS compliance for payment processing',
      metrics: ['vulnerability_count', 'security_incidents']
    }
  };
  
  // 12. Process the quality attributes
  const processedQA = await architectMode.processQualityAttributes(
    qualityAttributes,
    { context: 'non-functional requirements' }
  );
  
  // 13. Log the processed quality attributes results
  console.log('Quality attributes processing results:');
  console.log('- Suggested improvements:', 
    processedQA.suggestedImprovements?.map(i => i.description).join(', '));
  
  console.log('\n----- Example 5: Apply Knowledge-First to Response -----');
  
  // 14. Example response to be enhanced
  const response = {
    type: 'architectural_decision',
    summary: 'Use event sourcing for order processing',
    rationale: 'Better audit trail and replay capabilities',
    validationResults: processedDecision.validationResults,
    knowledgeSourceClassification: {
      isRetrieved: false,
      isGenerated: true,
      confidence: 0.85,
      sources: []
    }
  };
  
  // 15. Apply knowledge-first principles to the response
  const enhancedResponse = architectMode.applyKnowledgeFirstToResponse(response);
  
  // 16. Log the enhanced response
  console.log('Enhanced response:');
  console.log('- Knowledge source reliability:', enhancedResponse.knowledgeSource.reliability.level);
  console.log('- Validation summary:', enhancedResponse.validation.summary);
  console.log('- Knowledge improvements:', 
    enhancedResponse.knowledgeImprovements.length ? 'Provided' : 'None');
  console.log('- ConPort integration hints:', 
    enhancedResponse.conPortIntegration.shouldLog ? 'Provided' : 'None');
  
  console.log('\n----- Example 6: Search Architectural Knowledge -----');
  
  // 17. Search for related architectural knowledge
  const searchResults = await architectMode.searchArchitecturalKnowledge({
    text: 'microservices communication patterns',
    limit: 5
  });
  
  // 18. Log the search results
  console.log('Search results:', searchResults);
  
  console.log('\n----- Example 7: Get and Log Metrics -----');
  
  // 19. Get the metrics
  const metrics = architectMode.getMetrics();
  
  // 20. Log the metrics
  console.log('Metrics:');
  console.log('- Session metrics:', metrics.session);
  console.log('- Knowledge metrics:', metrics.knowledge);
  
  // 21. Log metrics to ConPort
  const logResult = await architectMode.logMetricsToConPort();
  console.log('Metrics logging result:', logResult.success ? 'Success' : 'Failed');
  
  console.log('\n===== EXAMPLE COMPLETED =====');
}

// Run the example
runArchitectModeExample().catch(error => {
  console.error('Error running Architect Mode example:', error);
});