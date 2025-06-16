/**
 * Debug Knowledge-First Guidelines
 * 
 * Specialized knowledge-first guidelines for Debug Mode, focusing on error pattern identification,
 * diagnostic approaches, root cause analysis, and solution verification.
 */

const { KnowledgeFirstGuidelines, KnowledgeSourceClassification } = require('../knowledge-first-guidelines');

/**
 * Debug-specific knowledge-first guidelines
 */
class DebugKnowledgeFirstGuidelines extends KnowledgeFirstGuidelines {
  constructor(options = {}) {
    super({
      mode: 'debug',
      ...options
    });
    
    this.knowledgeTypes = {
      // Default knowledge types from base class
      ...this.knowledgeTypes,
      
      // Debug-specific knowledge types
      errorPattern: {
        description: 'Documentation of recurring error patterns and their characteristics',
        requiredFields: ['errorType', 'errorMessage', 'reproduceSteps', 'context'],
        optionalFields: ['frequency', 'severity', 'relatedErrors', 'originalExpectation'],
        conPortCategory: 'system_pattern',
        extractionPriority: 'high'
      },
      
      diagnosticApproach: {
        description: 'Systematic approaches to diagnosing specific types of issues',
        requiredFields: ['name', 'targetIssueType', 'steps', 'expectedOutcomes'],
        optionalFields: ['tools', 'prerequisites', 'limitations', 'alternativeApproaches'],
        conPortCategory: 'custom_data',
        customDataCategory: 'diagnostic_approaches',
        extractionPriority: 'high'
      },
      
      rootCauseAnalysis: {
        description: 'Analysis of the fundamental causes of issues',
        requiredFields: ['issue', 'identifiedCause', 'evidenceSupporting', 'impactScope'],
        optionalFields: ['alternativeCauses', 'causalChain', 'underlyingFactors', 'preventionStrategy'],
        conPortCategory: 'decision',
        extractionPriority: 'high'
      },
      
      solutionVerification: {
        description: 'Methods to verify that a solution resolves the identified issue',
        requiredFields: ['issue', 'solution', 'verificationMethod', 'outcome'],
        optionalFields: ['alternativeSolutions', 'sideEffects', 'performanceImpact', 'longTermReliability'],
        conPortCategory: 'custom_data',
        customDataCategory: 'solution_verifications',
        extractionPriority: 'medium'
      },
      
      debuggingPattern: {
        description: 'Reusable patterns for debugging specific types of issues',
        requiredFields: ['name', 'applicableIssues', 'technique', 'effectiveUseCases'],
        optionalFields: ['limitations', 'tools', 'examples', 'combinationPatterns'],
        conPortCategory: 'system_pattern',
        extractionPriority: 'high'
      },
      
      issueMetadata: {
        description: 'Contextual information about issues that aids in diagnosis',
        requiredFields: ['issueType', 'environment', 'dependencies', 'frequency'],
        optionalFields: ['userImpact', 'businessImpact', 'technicalDomain', 'historicalContext'],
        conPortCategory: 'custom_data',
        customDataCategory: 'issue_metadata',
        extractionPriority: 'medium'
      },
      
      debuggingTool: {
        description: 'Information about tools useful for debugging',
        requiredFields: ['name', 'purpose', 'effectiveFor', 'usage'],
        optionalFields: ['limitations', 'alternatives', 'integrations', 'outputInterpretation'],
        conPortCategory: 'custom_data',
        customDataCategory: 'debugging_tools',
        extractionPriority: 'low'
      }
    };
    
    // Define knowledge extraction patterns for debug content
    this.extractionPatterns = {
      errorPattern: {
        indicators: [
          /error occurs when/i,
          /exception.*thrown/i,
          /bug.*reproducible/i,
          /fails consistently/i,
          /error message.*:/i
        ],
        contextSize: 5
      },
      
      diagnosticApproach: {
        indicators: [
          /to diagnose this/i,
          /debugging steps/i,
          /troubleshooting approach/i,
          /investigation method/i,
          /diagnostic procedure/i
        ],
        contextSize: 8
      },
      
      rootCauseAnalysis: {
        indicators: [
          /root cause/i,
          /underlying issue/i,
          /caused by/i,
          /fundamental problem/i,
          /source of the error/i
        ],
        contextSize: 6
      },
      
      solutionVerification: {
        indicators: [
          /verify.*solution/i,
          /confirm.*fix/i,
          /test.*resolution/i,
          /validate.*repair/i,
          /solution effectiveness/i
        ],
        contextSize: 5
      },
      
      debuggingPattern: {
        indicators: [
          /debugging pattern/i,
          /common debugging technique/i,
          /standard troubleshooting/i,
          /effective debug strategy/i,
          /systematic debugging/i
        ],
        contextSize: 7
      }
    };
    
    // Define knowledge relationships specific to debug mode
    this.knowledgeRelationships = {
      'errorPattern': {
        'rootCauseAnalysis': 'is_analyzed_by',
        'diagnosticApproach': 'is_diagnosed_by',
        'solutionVerification': 'is_resolved_by',
        'debuggingPattern': 'can_apply'
      },
      'rootCauseAnalysis': {
        'solutionVerification': 'leads_to',
        'decision': 'influences'
      },
      'diagnosticApproach': {
        'debuggingTool': 'utilizes',
        'system_pattern': 'investigates'
      },
      'debuggingPattern': {
        'system_pattern': 'specialized_version_of',
        'code_pattern': 'applies_to'
      }
    };
  }
  
  /**
   * Extract knowledge from debug-related content
   * @param {Object} content - Debug-related content to analyze
   * @param {Object} options - Extraction options
   * @returns {Object} - Extracted knowledge items by type
   */
  extractKnowledge(content, options = {}) {
    const extractedKnowledge = super.extractKnowledge(content, options);
    
    // Add specialized extraction for debug content
    if (content.type === 'error_report' || content.type === 'bug_report') {
      this._extractFromErrorReport(content, extractedKnowledge);
    } else if (content.type === 'diagnostic_session') {
      this._extractFromDiagnosticSession(content, extractedKnowledge);
    } else if (content.type === 'solution_implementation') {
      this._extractFromSolutionImplementation(content, extractedKnowledge);
    }
    
    return extractedKnowledge;
  }
  
  /**
   * Extract knowledge from error reports
   * @param {Object} errorReport - Error report content
   * @param {Object} extractedKnowledge - Object to store extracted knowledge
   * @private
   */
  _extractFromErrorReport(errorReport, extractedKnowledge) {
    // Extract error pattern
    if (errorReport.error && errorReport.context) {
      const errorPattern = {
        errorType: errorReport.error.type || 'Unknown',
        errorMessage: errorReport.error.message || 'Unknown error message',
        reproduceSteps: errorReport.reproduceSteps || 'Not specified',
        context: errorReport.context,
        frequency: errorReport.frequency || 'Unknown',
        severity: errorReport.severity || 'Unknown'
      };
      
      if (!extractedKnowledge.errorPattern) {
        extractedKnowledge.errorPattern = [];
      }
      
      extractedKnowledge.errorPattern.push(errorPattern);
    }
    
    // Extract issue metadata
    if (errorReport.metadata) {
      const issueMetadata = {
        issueType: errorReport.error?.type || 'Unknown',
        environment: errorReport.metadata.environment || 'Unknown',
        dependencies: errorReport.metadata.dependencies || [],
        frequency: errorReport.frequency || 'Unknown',
        userImpact: errorReport.metadata.userImpact,
        businessImpact: errorReport.metadata.businessImpact
      };
      
      if (!extractedKnowledge.issueMetadata) {
        extractedKnowledge.issueMetadata = [];
      }
      
      extractedKnowledge.issueMetadata.push(issueMetadata);
    }
  }
  
  /**
   * Extract knowledge from diagnostic sessions
   * @param {Object} diagnosticSession - Diagnostic session content
   * @param {Object} extractedKnowledge - Object to store extracted knowledge
   * @private
   */
  _extractFromDiagnosticSession(diagnosticSession, extractedKnowledge) {
    // Extract diagnostic approach
    if (diagnosticSession.approach) {
      const diagnosticApproach = {
        name: diagnosticSession.name || 'Diagnostic approach',
        targetIssueType: diagnosticSession.issueType || 'Unknown issue type',
        steps: diagnosticSession.approach.steps || [],
        expectedOutcomes: diagnosticSession.approach.expectedOutcomes || [],
        tools: diagnosticSession.tools
      };
      
      if (!extractedKnowledge.diagnosticApproach) {
        extractedKnowledge.diagnosticApproach = [];
      }
      
      extractedKnowledge.diagnosticApproach.push(diagnosticApproach);
    }
    
    // Extract root cause analysis
    if (diagnosticSession.rootCause) {
      const rootCauseAnalysis = {
        issue: diagnosticSession.issue || 'Unknown issue',
        identifiedCause: diagnosticSession.rootCause.cause,
        evidenceSupporting: diagnosticSession.rootCause.evidence || [],
        impactScope: diagnosticSession.rootCause.impact || 'Unknown impact',
        causalChain: diagnosticSession.rootCause.causalChain
      };
      
      if (!extractedKnowledge.rootCauseAnalysis) {
        extractedKnowledge.rootCauseAnalysis = [];
      }
      
      extractedKnowledge.rootCauseAnalysis.push(rootCauseAnalysis);
    }
    
    // Extract debugging tools
    if (diagnosticSession.tools && Array.isArray(diagnosticSession.tools)) {
      const debuggingTools = diagnosticSession.tools.map(tool => ({
        name: tool.name,
        purpose: tool.purpose || 'Unknown purpose',
        effectiveFor: tool.effectiveFor || 'General debugging',
        usage: tool.usage || 'Not specified',
        limitations: tool.limitations
      }));
      
      if (!extractedKnowledge.debuggingTool) {
        extractedKnowledge.debuggingTool = [];
      }
      
      extractedKnowledge.debuggingTool.push(...debuggingTools);
    }
  }
  
  /**
   * Extract knowledge from solution implementations
   * @param {Object} solutionImplementation - Solution implementation content
   * @param {Object} extractedKnowledge - Object to store extracted knowledge
   * @private
   */
  _extractFromSolutionImplementation(solutionImplementation, extractedKnowledge) {
    // Extract solution verification
    if (solutionImplementation.solution && solutionImplementation.verification) {
      const solutionVerification = {
        issue: solutionImplementation.issue || 'Unknown issue',
        solution: solutionImplementation.solution,
        verificationMethod: solutionImplementation.verification.method || 'Not specified',
        outcome: solutionImplementation.verification.outcome || 'Unknown outcome',
        sideEffects: solutionImplementation.verification.sideEffects,
        performanceImpact: solutionImplementation.verification.performanceImpact
      };
      
      if (!extractedKnowledge.solutionVerification) {
        extractedKnowledge.solutionVerification = [];
      }
      
      extractedKnowledge.solutionVerification.push(solutionVerification);
    }
    
    // Extract debugging pattern if a general pattern was used
    if (solutionImplementation.pattern) {
      const debuggingPattern = {
        name: solutionImplementation.pattern.name || 'Debugging pattern',
        applicableIssues: solutionImplementation.pattern.applicableIssues || [],
        technique: solutionImplementation.pattern.technique || 'Not specified',
        effectiveUseCases: solutionImplementation.pattern.effectiveUseCases || [],
        examples: [solutionImplementation.issue]
      };
      
      if (!extractedKnowledge.debuggingPattern) {
        extractedKnowledge.debuggingPattern = [];
      }
      
      extractedKnowledge.debuggingPattern.push(debuggingPattern);
    }
  }
  
  /**
   * Classify knowledge sources for debug content
   * @param {Object} content - Debug-related content
   * @param {Object} options - Classification options
   * @returns {KnowledgeSourceClassification} - Classification result
   */
  classifyKnowledgeSource(content, options = {}) {
    const classification = super.classifyKnowledgeSource(content, options);
    
    // Refine classification for debug-specific content
    if (content.type === 'error_report') {
      // Primary sources are more reliable for direct error observations
      classification.reliability.level = 'high';
      classification.reliability.factors.push('direct_observation');
    } else if (content.type === 'diagnostic_approach') {
      // Check if this is a proven approach with successful applications
      if (content.successfulApplications && content.successfulApplications.length > 0) {
        classification.reliability.level = 'high';
        classification.reliability.factors.push('proven_approach');
      }
    } else if (content.type === 'root_cause_analysis') {
      // Adjust reliability based on evidence quality
      if (content.evidenceSupporting && Array.isArray(content.evidenceSupporting) && 
          content.evidenceSupporting.length >= 3) {
        classification.reliability.level = 'high';
        classification.reliability.factors.push('strong_evidence');
      }
    }
    
    return classification;
  }
  
  /**
   * Enrich debug knowledge with recommendations for improvements
   * @param {Object} knowledge - Debug knowledge item
   * @param {string} type - Knowledge type
   * @returns {Object} - Enriched knowledge with recommendations
   */
  enrichKnowledge(knowledge, type) {
    const enriched = super.enrichKnowledge(knowledge, type);
    const knowledgeTypeInfo = this.knowledgeTypes[type];
    
    if (!knowledgeTypeInfo) {
      return enriched;
    }
    
    // Add specialized recommendations for debug knowledge
    if (type === 'errorPattern') {
      // Recommend additional error context if missing
      if (!knowledge.context || knowledge.context === 'Unknown') {
        enriched.recommendations.push({
          type: 'addition',
          field: 'context',
          description: 'Add information about the environment and conditions where the error occurs'
        });
      }
      
      // Recommend related errors if missing
      if (!knowledge.relatedErrors || !Array.isArray(knowledge.relatedErrors) || knowledge.relatedErrors.length === 0) {
        enriched.recommendations.push({
          type: 'addition',
          field: 'relatedErrors',
          description: 'Identify any related or similar errors that may have the same root cause'
        });
      }
    } else if (type === 'rootCauseAnalysis') {
      // Recommend causal chain if missing
      if (!knowledge.causalChain || !Array.isArray(knowledge.causalChain) || knowledge.causalChain.length < 2) {
        enriched.recommendations.push({
          type: 'addition',
          field: 'causalChain',
          description: 'Document the chain of causes leading to the issue (at least 2 levels deep)'
        });
      }
      
      // Recommend prevention strategy if missing
      if (!knowledge.preventionStrategy) {
        enriched.recommendations.push({
          type: 'addition',
          field: 'preventionStrategy',
          description: 'Add a strategy to prevent similar issues in the future'
        });
      }
    } else if (type === 'diagnosticApproach') {
      // Recommend alternatives if missing
      if (!knowledge.alternativeApproaches || !Array.isArray(knowledge.alternativeApproaches) || knowledge.alternativeApproaches.length === 0) {
        enriched.recommendations.push({
          type: 'addition',
          field: 'alternativeApproaches',
          description: 'Document alternative diagnostic approaches that could be used'
        });
      }
      
      // Recommend limitations if missing
      if (!knowledge.limitations) {
        enriched.recommendations.push({
          type: 'addition',
          field: 'limitations',
          description: 'Document the limitations or constraints of this diagnostic approach'
        });
      }
    }
    
    return enriched;
  }
  
  /**
   * Search for debug-related knowledge in ConPort
   * @param {Object} params - Search parameters
   * @param {Object} conPortClient - ConPort client instance
   * @returns {Promise<Object>} - Search results
   */
  async searchDebugKnowledge(params, conPortClient) {
    if (!conPortClient) {
      throw new Error('ConPort client is required for searching debug knowledge');
    }
    
    // Define search parameters
    const searchParams = {
      workspace_id: conPortClient.workspace_id,
      query_text: params.text || '',
      top_k: params.limit || 5,
      filter_item_types: []
    };
    
    // Add filter for specific debug knowledge types
    if (params.types && Array.isArray(params.types)) {
      // Map knowledge types to ConPort item types
      const itemTypeMap = {
        'errorPattern': 'system_pattern',
        'debuggingPattern': 'system_pattern',
        'rootCauseAnalysis': 'decision',
        'diagnosticApproach': 'custom_data',
        'solutionVerification': 'custom_data',
        'issueMetadata': 'custom_data',
        'debuggingTool': 'custom_data'
      };
      
      // Add unique ConPort item types based on requested knowledge types
      params.types.forEach(type => {
        const itemType = itemTypeMap[type];
        if (itemType && !searchParams.filter_item_types.includes(itemType)) {
          searchParams.filter_item_types.push(itemType);
        }
      });
    } else {
      // Default to searching all relevant item types
      searchParams.filter_item_types = ['system_pattern', 'decision', 'custom_data'];
    }
    
    // Add filter for custom data categories if needed
    if (searchParams.filter_item_types.includes('custom_data')) {
      if (!searchParams.filter_custom_data_categories) {
        searchParams.filter_custom_data_categories = [];
      }
      
      // Add debug-specific custom data categories
      const debugCategories = [
        'diagnostic_approaches',
        'solution_verifications',
        'issue_metadata',
        'debugging_tools'
      ];
      
      // Filter categories based on requested knowledge types
      if (params.types && Array.isArray(params.types)) {
        const categoryMap = {
          'diagnosticApproach': 'diagnostic_approaches',
          'solutionVerification': 'solution_verifications',
          'issueMetadata': 'issue_metadata',
          'debuggingTool': 'debugging_tools'
        };
        
        params.types.forEach(type => {
          const category = categoryMap[type];
          if (category && !searchParams.filter_custom_data_categories.includes(category)) {
            searchParams.filter_custom_data_categories.push(category);
          }
        });
      } else {
        // Include all debug categories if no specific types are requested
        searchParams.filter_custom_data_categories.push(...debugCategories);
      }
    }
    
    // Add tags filter if specified
    if (params.tags && Array.isArray(params.tags) && params.tags.length > 0) {
      searchParams.filter_tags_include_any = params.tags;
    }
    
    // Perform the search
    try {
      const results = await conPortClient.semantic_search_conport(searchParams);
      return this._processDebugSearchResults(results, params);
    } catch (error) {
      console.error('Error searching debug knowledge:', error);
      return { items: [], error: error.message };
    }
  }
  
  /**
   * Process debug knowledge search results
   * @param {Object} results - Raw search results
   * @param {Object} params - Original search parameters
   * @returns {Object} - Processed search results
   * @private
   */
  _processDebugSearchResults(results, params) {
    if (!results || !results.items || !Array.isArray(results.items)) {
      return { items: [] };
    }
    
    // Process and categorize results
    const categorizedResults = {
      errorPatterns: [],
      diagnosticApproaches: [],
      rootCauseAnalyses: [],
      solutionVerifications: [],
      debuggingPatterns: [],
      other: []
    };
    
    results.items.forEach(item => {
      // Categorize based on item type and content
      if (item.item_type === 'system_pattern') {
        if (item.content && item.content.tags && 
            (item.content.tags.includes('error-pattern') || 
             item.content.tags.includes('error_pattern'))) {
          categorizedResults.errorPatterns.push(item);
        } else if (item.content && item.content.tags && 
                  (item.content.tags.includes('debugging-pattern') || 
                   item.content.tags.includes('debugging_pattern'))) {
          categorizedResults.debuggingPatterns.push(item);
        } else {
          categorizedResults.other.push(item);
        }
      } else if (item.item_type === 'decision' && 
                item.content && item.content.summary && 
                (item.content.summary.toLowerCase().includes('root cause') || 
                 item.content.summary.toLowerCase().includes('issue analysis'))) {
        categorizedResults.rootCauseAnalyses.push(item);
      } else if (item.item_type === 'custom_data') {
        if (item.category === 'diagnostic_approaches') {
          categorizedResults.diagnosticApproaches.push(item);
        } else if (item.category === 'solution_verifications') {
          categorizedResults.solutionVerifications.push(item);
        } else {
          categorizedResults.other.push(item);
        }
      } else {
        categorizedResults.other.push(item);
      }
    });
    
    // Construct final result based on original search parameters
    const processedResults = {
      items: results.items,
      categorized: categorizedResults,
      query: params.text,
      totalItems: results.items.length
    };
    
    return processedResults;
  }
  
  /**
   * Apply knowledge-first principles to debug responses
   * @param {Object} response - Original response
   * @returns {Object} - Enhanced response with knowledge-first principles applied
   */
  applyKnowledgeFirstToResponse(response) {
    const enhanced = super.applyKnowledgeFirstToResponse(response);
    
    // Add debug-specific enhancements
    if (response.type === 'error_diagnosis') {
      // Add diagnostic approach guidelines
      enhanced.diagnosticApproachGuidelines = {
        systematic: 'Ensure the diagnostic approach is systematic and reproducible',
        evidence: 'Collect and document evidence supporting your conclusions',
        alternatives: 'Consider and document alternative explanations',
        verification: 'Include verification steps for the proposed solution'
      };
    } else if (response.type === 'solution_proposal') {
      // Add solution verification guidelines
      enhanced.solutionVerificationGuidelines = {
        testCases: 'Include specific test cases to verify the solution',
        sideEffects: 'Consider potential side effects or unintended consequences',
        longTerm: 'Evaluate long-term implications and sustainability',
        alternatives: 'Document alternative solutions considered'
      };
    }
    
    // Add ConPort integration specific to debug knowledge
    if (enhanced.conPortIntegration && enhanced.conPortIntegration.shouldLog) {
      if (response.type === 'error_diagnosis') {
        enhanced.conPortIntegration.recommendations.push({
          type: 'errorPattern',
          description: 'Log this error pattern in ConPort for future reference',
          priority: 'high'
        });
        
        enhanced.conPortIntegration.recommendations.push({
          type: 'diagnosticApproach',
          description: 'Document the diagnostic approach for similar issues',
          priority: 'medium'
        });
      } else if (response.type === 'solution_proposal') {
        enhanced.conPortIntegration.recommendations.push({
          type: 'solutionVerification',
          description: 'Log the solution verification steps in ConPort',
          priority: 'high'
        });
        
        enhanced.conPortIntegration.recommendations.push({
          type: 'decision',
          description: 'Document the fix decision with alternatives considered',
          priority: 'medium'
        });
      }
    }
    
    return enhanced;
  }
}

module.exports = {
  DebugKnowledgeFirstGuidelines
};