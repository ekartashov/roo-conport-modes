/**
 * Debug Mode Enhancement Usage Example
 * 
 * This example demonstrates how to use the Debug Mode enhancements
 * to implement a knowledge-first approach to debugging, error analysis,
 * and solution verification.
 */

// Import the Debug Mode Enhancement
const { DebugModeEnhancement } = require('../utilities/mode-enhancements/debug-mode-enhancement');

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
 * Example: Initialize and use Debug Mode enhancement
 */
async function runDebugModeExample() {
  console.log('===== DEBUG MODE ENHANCEMENT EXAMPLE =====');
  
  // 1. Initialize the Debug Mode Enhancement
  const debugMode = new DebugModeEnhancement(
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
  
  console.log('\n----- Example 1: Process Error Pattern -----');
  
  // 2. Example error pattern
  const errorPattern = {
    errorType: 'ReferenceError',
    errorMessage: 'Cannot read property \'length\' of undefined',
    reproduceSteps: 'Call processArray() with null input',
    context: 'Data processing pipeline',
    frequency: 'Intermittent',
    severity: 'High',
    // Note: Missing relatedErrors and originalExpectation
  };
  
  // 3. Process the error pattern
  const processedError = await debugMode.processErrorPattern(
    errorPattern,
    { context: 'user reported bug' }
  );
  
  // 4. Log the processed error results
  console.log('Error pattern processing results:');
  console.log('- Validation valid:', 
    processedError.validationResults?.errorPattern?.valid);
  console.log('- Completeness score:', 
    processedError.validationResults?.errorPattern?.details?.completenessScore);
  console.log('- Suggested improvements:', 
    processedError.suggestedImprovements?.map(i => i.description).join(', '));
  console.log('- Extracted knowledge items:', 
    Object.values(processedError.extractedKnowledge || {})
      .reduce((count, arr) => count + (arr?.length || 0), 0));
  
  console.log('\n----- Example 2: Process Diagnostic Approach -----');
  
  // 5. Example diagnostic approach
  const diagnosticApproach = {
    initialObservation: 'Application crashes when processing large datasets',
    hypothesisFormation: 'Memory leak in data processing loop',
    testingApproach: 'Run with memory profiler and monitor heap usage',
    dataCollectionMethod: 'Use Chrome DevTools Memory tab to capture snapshots',
    qualityAssessment: {
      systematic: true,
      reproducible: true,
      // Note: Missing efficient and comprehensive
    },
    // Note: Missing alternativeApproaches, toolsUsed, environmentFactors, timelineEstimate
  };
  
  // 6. Process the diagnostic approach
  const processedDiagnostic = await debugMode.processDiagnosticApproach(
    diagnosticApproach,
    { context: 'memory leak investigation' }
  );
  
  // 7. Log the processed diagnostic approach results
  console.log('Diagnostic approach processing results:');
  console.log('- Validation valid:', 
    processedDiagnostic.validationResults?.diagnosticApproach?.valid);
  console.log('- Step score:', 
    processedDiagnostic.validationResults?.diagnosticApproach?.details?.stepScore);
  console.log('- Quality score:', 
    processedDiagnostic.validationResults?.diagnosticApproach?.details?.qualityScore);
  console.log('- Overall score:', 
    processedDiagnostic.validationResults?.diagnosticApproach?.details?.overallScore);
  console.log('- Suggested improvements:', 
    processedDiagnostic.suggestedImprovements?.map(i => i.description).join(', '));
  
  console.log('\n----- Example 3: Process Root Cause Analysis -----');
  
  // 8. Example root cause analysis
  const rootCauseAnalysis = {
    identifiedCause: 'Event listener not properly removed causing memory leak',
    evidenceSupporting: [
      'Memory profile shows increasing EventListener count',
      'Heap snapshots reveal references to removed DOM elements'
    ],
    impactScope: 'Affects all pages with dynamic content loading',
    originAnalysis: 'Introduced in commit abc123 when implementing infinite scroll',
    // Note: Missing alternativeCauses, evidenceAgainstAlternatives, underlyingFactors, technicalContext
    // Note: Missing causalChain
  };
  
  // 9. Process the root cause analysis
  const processedRootCause = await debugMode.processRootCauseAnalysis(
    rootCauseAnalysis,
    { context: 'memory leak investigation' }
  );
  
  // 10. Log the processed root cause analysis results
  console.log('Root cause analysis processing results:');
  console.log('- Validation valid:', 
    processedRootCause.validationResults?.rootCauseAnalysis?.valid);
  console.log('- Elements score:', 
    processedRootCause.validationResults?.rootCauseAnalysis?.details?.elementsScore);
  console.log('- Causal chain depth:', 
    processedRootCause.validationResults?.rootCauseAnalysis?.details?.causalChainDepth);
  console.log('- Evidence quality:', 
    processedRootCause.validationResults?.rootCauseAnalysis?.details?.evidenceQuality);
  console.log('- Suggested improvements:', 
    processedRootCause.suggestedImprovements?.map(i => i.description).join(', '));
  
  console.log('\n----- Example 4: Process Solution Verification -----');
  
  // 11. Example solution verification
  const solutionVerification = {
    proposedSolution: 'Add explicit event listener cleanup in component unmount',
    implementationSteps: [
      'Add removeEventListener calls in componentWillUnmount',
      'Implement tracking of attached listeners',
      'Add cleanup safety check in parent component'
    ],
    verificationMethod: 'Memory profiling, Automated testing',
    expectedOutcome: 'Constant memory usage over time with repeated operations',
    // Note: Missing alternativeSolutions, sideEffects, performanceImpact, longTermConsiderations
  };
  
  // 12. Process the solution verification
  const processedSolution = await debugMode.processSolutionVerification(
    solutionVerification,
    { context: 'memory leak fix verification' }
  );
  
  // 13. Log the processed solution verification results
  console.log('Solution verification processing results:');
  console.log('- Validation valid:', 
    processedSolution.validationResults?.solutionVerification?.valid);
  console.log('- Elements score:', 
    processedSolution.validationResults?.solutionVerification?.details?.elementsScore);
  console.log('- Verification methods:', 
    processedSolution.validationResults?.solutionVerification?.details?.verificationMethodsUsed);
  console.log('- Implementation steps quality:', 
    processedSolution.validationResults?.solutionVerification?.details?.implementationStepsQuality);
  console.log('- Suggested improvements:', 
    processedSolution.suggestedImprovements?.map(i => i.description).join(', '));
  
  console.log('\n----- Example 5: Process Complete Debugging Session -----');
  
  // 14. Example debugging session (combining all previous examples)
  const debuggingSession = {
    errorPattern: {
      errorType: 'MemoryError',
      errorMessage: 'Out of memory',
      reproduceSteps: 'Navigate between pages with infinite scroll for 5+ minutes',
      context: 'Browser environment with limited memory',
      frequency: 'Consistent after extended use',
      severity: 'Critical'
    },
    diagnosticApproach: {
      initialObservation: 'Application crashes after extended use',
      hypothesisFormation: 'Memory leak in component lifecycle',
      testingApproach: 'Memory profiling during normal usage',
      dataCollectionMethod: 'Chrome DevTools Memory Profiler',
      qualityAssessment: {
        systematic: true,
        reproducible: true,
        efficient: true,
        comprehensive: true
      },
      toolsUsed: ['Chrome DevTools', 'React Profiler']
    },
    rootCause: {
      identifiedCause: 'Event listeners not properly cleaned up',
      evidenceSupporting: [
        'Memory profile shows increasing EventListener count',
        'Heap snapshots reveal references to removed DOM elements',
        'Reproduces only with components using addEventListener directly'
      ],
      impactScope: 'All dynamic content pages',
      originAnalysis: 'Custom event handler implementation',
      causalChain: [
        'Direct DOM event listener attachment',
        'Missing cleanup on component unmount',
        'Reference retention in closure',
        'Memory leak'
      ],
      alternativeCauses: [
        'Large data caching - ruled out by heap analysis',
        'Image memory - ruled out by content type testing'
      ]
    },
    solution: {
      proposedSolution: 'Implement EventListener registry with automatic cleanup',
      implementationSteps: [
        'Create centralized EventListener registry',
        'Modify component lifecycle to register/unregister listeners',
        'Add automated cleanup on component unmount',
        'Add safety check in parent components'
      ],
      verificationMethod: 'Memory profiling, Extended usage testing, Automated memory tests',
      expectedOutcome: 'Stable memory usage over extended periods',
      alternativeSolutions: [
        'Use React synthetic events exclusively - rejected due to need for window events',
        'Implement decorator pattern for listeners - more complex but considered for future'
      ],
      sideEffects: 'Slight increase in initial load time (negligible)',
      performanceImpact: 'Positive - prevents eventual performance degradation',
      longTermConsiderations: 'Need to document pattern for team adoption'
    },
    pattern: {
      name: 'Event Listener Lifecycle Management',
      applicableIssues: ['Memory leaks', 'Component cleanup', 'Event handling'],
      technique: 'Centralized registration with component lifecycle integration',
      effectiveUseCases: ['Single page applications', 'Long-running sessions', 'Component-heavy UIs']
    }
  };
  
  // 15. Process the debugging session
  const processedSession = await debugMode.processDebuggingSession(
    debuggingSession,
    { context: 'comprehensive debugging example' }
  );
  
  // 16. Log the processed debugging session results
  console.log('Debugging session processing results:');
  console.log('- Error pattern valid:', 
    processedSession.validationResults?.errorPattern?.valid);
  console.log('- Diagnostic approach valid:', 
    processedSession.validationResults?.diagnosticApproach?.valid);
  console.log('- Root cause analysis valid:', 
    processedSession.validationResults?.rootCauseAnalysis?.valid);
  console.log('- Solution verification valid:', 
    processedSession.validationResults?.solutionVerification?.valid);
  console.log('- Extracted knowledge types:', 
    Object.keys(processedSession.extractedKnowledge || {}).join(', '));
  console.log('- Total knowledge items extracted:', 
    Object.values(processedSession.extractedKnowledge || {})
      .reduce((count, arr) => count + (arr?.length || 0), 0));
  
  console.log('\n----- Example 6: Apply Knowledge-First to Response -----');
  
  // 17. Example response to be enhanced
  const response = {
    type: 'error_diagnosis',
    summary: 'Memory leak caused by event listener cleanup failure',
    diagnosticApproach: 'Memory profiling and component lifecycle analysis',
    rootCause: 'Event listeners remain attached after component unmount',
    solution: 'Implement centralized event listener management'
  };
  
  // 18. Apply knowledge-first principles to the response
  const enhancedResponse = debugMode.applyKnowledgeFirstToResponse(response);
  
  // 19. Log the enhanced response
  console.log('Enhanced response:');
  console.log('- Knowledge source reliability:', enhancedResponse.knowledgeSource?.reliability?.level);
  console.log('- Knowledge improvements:', 
    enhancedResponse.knowledgeImprovements?.length ? 'Provided' : 'None');
  console.log('- Diagnostic approach guidelines:', 
    Object.keys(enhancedResponse.diagnosticApproachGuidelines || {}).join(', '));
  console.log('- ConPort integration hints:', 
    enhancedResponse.conPortIntegration?.recommendations.map(r => r.type).join(', '));
  
  console.log('\n----- Example 7: Search Debug Knowledge -----');
  
  // 20. Search for related debug knowledge
  const searchResults = await debugMode.searchDebugKnowledge({
    text: 'event listener memory leak',
    types: ['errorPattern', 'rootCauseAnalysis', 'solutionVerification'],
    limit: 5
  });
  
  // 21. Log the search results
  console.log('Search results:');
  console.log('- Total items found:', searchResults.totalItems);
  console.log('- Categories found:', Object.keys(searchResults.categorized || {}).join(', '));
  
  console.log('\n----- Example 8: Get and Log Metrics -----');
  
  // 22. Get the metrics
  const metrics = debugMode.getMetrics();
  
  // 23. Log the metrics
  console.log('Metrics:');
  console.log('- Session metrics:', Object.keys(metrics.session).join(', '));
  console.log('- Knowledge metrics:', Object.keys(metrics.knowledge).join(', '));
  
  // 24. Log metrics to ConPort
  const logResult = await debugMode.logMetricsToConPort();
  console.log('Metrics logging result:', logResult.success ? 'Success' : 'Failed');
  
  console.log('\n----- Example 9: Log Debugging Pattern -----');
  
  // 25. Example debugging pattern
  const debuggingPattern = {
    name: 'Memory Leak Isolation Pattern',
    applicableIssues: ['Memory leaks', 'Performance degradation', 'Browser crashes'],
    technique: 'Iterative component isolation with memory profiling',
    effectiveUseCases: ['SPA applications', 'Long-running sessions', 'Complex component hierarchies'],
    tools: ['Chrome DevTools', 'Memory Profiler', 'Heap Snapshot Analyzer'],
    examples: ['Event listener cleanup issue', 'Closure variable retention'],
    tags: ['memory', 'performance', 'browser']
  };
  
  // 26. Log the debugging pattern to ConPort
  const patternResult = await debugMode.logDebuggingPatternToConPort(debuggingPattern);
  console.log('Pattern logging result:', patternResult.success ? 'Success' : 'Failed');
  
  console.log('\n===== EXAMPLE COMPLETED =====');
}

// Run the example
runDebugModeExample().catch(error => {
  console.error('Error running Debug Mode example:', error);
});