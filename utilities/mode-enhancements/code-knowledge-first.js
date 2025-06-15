/**
 * Code Mode Knowledge-First Guidelines
 * 
 * This module implements specialized Knowledge-First Guidelines for the Code mode,
 * focusing on code patterns, implementation decisions, and technical knowledge
 * captured during coding activities.
 */

const { KnowledgeFirstGuidelines } = require('../knowledge-first-guidelines');
const { KnowledgeSourceClassifier } = require('../knowledge-source-classifier');

/**
 * Code Knowledge-First Guidelines
 * 
 * Extends the base Knowledge-First Guidelines with code-specific
 * knowledge capturing capabilities and metrics.
 */
class CodeKnowledgeFirstGuidelines extends KnowledgeFirstGuidelines {
  /**
   * Initialize the Code Knowledge-First Guidelines
   * @param {Object} options - Configuration options
   * @param {Object} conPortClient - ConPort client for knowledge management
   */
  constructor(options = {}, conPortClient) {
    super(options, conPortClient);
    
    // Code-specific knowledge metrics
    this.codeMetrics = {
      implementationDecisionsDocumented: 0,
      codePatternsIdentified: 0,
      knowledgeReferences: 0,
      edgeCasesDocumented: 0,
      performanceConsiderationsDocumented: 0
    };
    
    // Initialize knowledge source classifier with code-specific categories
    this.knowledgeSourceClassifier = new KnowledgeSourceClassifier({
      domainSpecificCategories: [
        'implementation_decision',
        'code_pattern',
        'edge_case',
        'performance_consideration',
        'technical_constraint',
        'algorithm',
        'code_example'
      ]
    });
  }
  
  /**
   * Process an implementation decision for knowledge capture
   * @param {Object} decision - The implementation decision to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed decision with knowledge enhancement
   */
  async processImplementationDecision(decision, context = {}) {
    // 1. Classify knowledge source
    const sourceClassification = await this.knowledgeSourceClassifier.classify(
      decision,
      { type: 'implementation_decision', ...context }
    );
    
    // 2. Enhance decision with knowledge source classification
    const enhancedDecision = {
      ...decision,
      knowledgeSourceClassification: sourceClassification
    };
    
    // 3. Check for missing rationale and suggest additions
    if (!decision.rationale || decision.rationale.trim().length === 0) {
      enhancedDecision.suggestedImprovements = [
        ...(enhancedDecision.suggestedImprovements || []),
        {
          type: 'missing_rationale',
          description: 'Document the rationale behind this implementation decision',
          importance: 'high'
        }
      ];
    }
    
    // 4. Check for missing alternatives and suggest additions
    if (!decision.alternatives || decision.alternatives.length === 0) {
      enhancedDecision.suggestedImprovements = [
        ...(enhancedDecision.suggestedImprovements || []),
        {
          type: 'missing_alternatives',
          description: 'Document the alternative implementations that were considered',
          importance: 'medium'
        }
      ];
    }
    
    // 5. Log implementation decision to ConPort if client is available
    if (this.conPortClient) {
      try {
        await this.logImplementationDecisionToConPort(enhancedDecision);
        this.codeMetrics.implementationDecisionsDocumented++;
      } catch (error) {
        console.error('Error logging implementation decision to ConPort:', error);
      }
    }
    
    return enhancedDecision;
  }
  
  /**
   * Process a code pattern for knowledge capture
   * @param {Object} pattern - The code pattern to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed pattern with knowledge enhancement
   */
  async processCodePattern(pattern, context = {}) {
    // 1. Classify knowledge source
    const sourceClassification = await this.knowledgeSourceClassifier.classify(
      pattern,
      { type: 'code_pattern', ...context }
    );
    
    // 2. Enhance pattern with knowledge source classification
    const enhancedPattern = {
      ...pattern,
      knowledgeSourceClassification: sourceClassification
    };
    
    // 3. Check for missing pattern components and suggest additions
    const missingComponents = this.checkPatternCompleteness(pattern);
    if (missingComponents.length > 0) {
      enhancedPattern.suggestedImprovements = [
        ...(enhancedPattern.suggestedImprovements || []),
        ...missingComponents.map(component => ({
          type: `missing_${component.name}`,
          description: component.description,
          importance: component.importance
        }))
      ];
    }
    
    // 4. Log code pattern to ConPort if client is available
    if (this.conPortClient) {
      try {
        await this.logCodePatternToConPort(enhancedPattern);
        this.codeMetrics.codePatternsIdentified++;
      } catch (error) {
        console.error('Error logging code pattern to ConPort:', error);
      }
    }
    
    return enhancedPattern;
  }
  
  /**
   * Check for completeness of a code pattern
   * @param {Object} pattern - The code pattern to check
   * @returns {Array} List of missing components
   */
  checkPatternCompleteness(pattern) {
    const missingComponents = [];
    
    if (!pattern.description || pattern.description.trim().length === 0) {
      missingComponents.push({
        name: 'description',
        description: 'Add a detailed description of the pattern',
        importance: 'high'
      });
    }
    
    if (!pattern.usage || pattern.usage.trim().length === 0) {
      missingComponents.push({
        name: 'usage',
        description: 'Document how to use this pattern',
        importance: 'high'
      });
    }
    
    if (!pattern.example || pattern.example.trim().length === 0) {
      missingComponents.push({
        name: 'example',
        description: 'Include a code example of this pattern',
        importance: 'medium'
      });
    }
    
    if (!pattern.benefits || !Array.isArray(pattern.benefits) || pattern.benefits.length === 0) {
      missingComponents.push({
        name: 'benefits',
        description: 'List the benefits of using this pattern',
        importance: 'medium'
      });
    }
    
    if (!pattern.considerations || !Array.isArray(pattern.considerations) || pattern.considerations.length === 0) {
      missingComponents.push({
        name: 'considerations',
        description: 'Document considerations when using this pattern',
        importance: 'medium'
      });
    }
    
    return missingComponents;
  }
  
  /**
   * Process edge cases for knowledge capture
   * @param {Object} edgeCases - The edge cases to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed edge cases with knowledge enhancement
   */
  async processEdgeCases(edgeCases, context = {}) {
    // 1. Classify knowledge source
    const sourceClassification = await this.knowledgeSourceClassifier.classify(
      edgeCases,
      { type: 'edge_case', ...context }
    );
    
    // 2. Enhance edge cases with knowledge source classification
    const enhancedEdgeCases = {
      ...edgeCases,
      knowledgeSourceClassification: sourceClassification
    };
    
    // 3. Check for missing edge case details
    const missingDetails = this.checkEdgeCaseCompleteness(edgeCases);
    if (missingDetails.length > 0) {
      enhancedEdgeCases.suggestedImprovements = [
        ...(enhancedEdgeCases.suggestedImprovements || []),
        ...missingDetails.map(detail => ({
          type: `missing_${detail.name}`,
          description: detail.description,
          importance: detail.importance
        }))
      ];
    }
    
    // 4. Log edge cases to ConPort if client is available
    if (this.conPortClient) {
      try {
        await this.logEdgeCasesToConPort(enhancedEdgeCases);
        this.codeMetrics.edgeCasesDocumented++;
      } catch (error) {
        console.error('Error logging edge cases to ConPort:', error);
      }
    }
    
    return enhancedEdgeCases;
  }
  
  /**
   * Check for completeness of edge case documentation
   * @param {Object} edgeCases - The edge cases to check
   * @returns {Array} List of missing details
   */
  checkEdgeCaseCompleteness(edgeCases) {
    const missingDetails = [];
    
    if (!edgeCases.scenarios || !Array.isArray(edgeCases.scenarios) || edgeCases.scenarios.length === 0) {
      missingDetails.push({
        name: 'scenarios',
        description: 'List the specific edge case scenarios',
        importance: 'high'
      });
    }
    
    if (!edgeCases.handling || edgeCases.handling.trim().length === 0) {
      missingDetails.push({
        name: 'handling',
        description: 'Document how these edge cases are handled',
        importance: 'high'
      });
    }
    
    if (!edgeCases.testCases || !Array.isArray(edgeCases.testCases) || edgeCases.testCases.length === 0) {
      missingDetails.push({
        name: 'testCases',
        description: 'Include test cases for these edge cases',
        importance: 'medium'
      });
    }
    
    return missingDetails;
  }
  
  /**
   * Process performance considerations for knowledge capture
   * @param {Object} considerations - The performance considerations to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed considerations with knowledge enhancement
   */
  async processPerformanceConsiderations(considerations, context = {}) {
    // 1. Classify knowledge source
    const sourceClassification = await this.knowledgeSourceClassifier.classify(
      considerations,
      { type: 'performance_consideration', ...context }
    );
    
    // 2. Enhance considerations with knowledge source classification
    const enhancedConsiderations = {
      ...considerations,
      knowledgeSourceClassification: sourceClassification
    };
    
    // 3. Check for missing performance details
    const missingDetails = this.checkPerformanceConsiderationCompleteness(considerations);
    if (missingDetails.length > 0) {
      enhancedConsiderations.suggestedImprovements = [
        ...(enhancedConsiderations.suggestedImprovements || []),
        ...missingDetails.map(detail => ({
          type: `missing_${detail.name}`,
          description: detail.description,
          importance: detail.importance
        }))
      ];
    }
    
    // 4. Log performance considerations to ConPort if client is available
    if (this.conPortClient) {
      try {
        await this.logPerformanceConsiderationsToConPort(enhancedConsiderations);
        this.codeMetrics.performanceConsiderationsDocumented++;
      } catch (error) {
        console.error('Error logging performance considerations to ConPort:', error);
      }
    }
    
    return enhancedConsiderations;
  }
  
  /**
   * Check for completeness of performance consideration documentation
   * @param {Object} considerations - The performance considerations to check
   * @returns {Array} List of missing details
   */
  checkPerformanceConsiderationCompleteness(considerations) {
    const missingDetails = [];
    
    if (!considerations.impact || considerations.impact.trim().length === 0) {
      missingDetails.push({
        name: 'impact',
        description: 'Document the performance impact',
        importance: 'high'
      });
    }
    
    if (!considerations.optimizations || !Array.isArray(considerations.optimizations) || considerations.optimizations.length === 0) {
      missingDetails.push({
        name: 'optimizations',
        description: 'List the optimizations applied or considered',
        importance: 'high'
      });
    }
    
    if (!considerations.metrics || !Array.isArray(considerations.metrics) || considerations.metrics.length === 0) {
      missingDetails.push({
        name: 'metrics',
        description: 'Include metrics or benchmarks',
        importance: 'medium'
      });
    }
    
    if (!considerations.tradeoffs || !Array.isArray(considerations.tradeoffs) || considerations.tradeoffs.length === 0) {
      missingDetails.push({
        name: 'tradeoffs',
        description: 'Document trade-offs between performance and other factors',
        importance: 'medium'
      });
    }
    
    return missingDetails;
  }
  
  /**
   * Process code examples for knowledge capture
   * @param {Object} example - The code example to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed example with knowledge enhancement
   */
  async processCodeExample(example, context = {}) {
    // 1. Classify knowledge source
    const sourceClassification = await this.knowledgeSourceClassifier.classify(
      example,
      { type: 'code_example', ...context }
    );
    
    // 2. Enhance example with knowledge source classification
    const enhancedExample = {
      ...example,
      knowledgeSourceClassification: sourceClassification
    };
    
    // 3. Check for missing example components
    const missingComponents = this.checkCodeExampleCompleteness(example);
    if (missingComponents.length > 0) {
      enhancedExample.suggestedImprovements = [
        ...(enhancedExample.suggestedImprovements || []),
        ...missingComponents.map(component => ({
          type: `missing_${component.name}`,
          description: component.description,
          importance: component.importance
        }))
      ];
    }
    
    // 4. Log code example to ConPort if client is available
    if (this.conPortClient) {
      try {
        await this.logCodeExampleToConPort(enhancedExample);
      } catch (error) {
        console.error('Error logging code example to ConPort:', error);
      }
    }
    
    return enhancedExample;
  }
  
  /**
   * Check for completeness of a code example
   * @param {Object} example - The code example to check
   * @returns {Array} List of missing components
   */
  checkCodeExampleCompleteness(example) {
    const missingComponents = [];
    
    if (!example.purpose || example.purpose.trim().length === 0) {
      missingComponents.push({
        name: 'purpose',
        description: 'Add a description of what this example demonstrates',
        importance: 'high'
      });
    }
    
    if (!example.code || example.code.trim().length === 0) {
      missingComponents.push({
        name: 'code',
        description: 'Include the actual code example',
        importance: 'high'
      });
    }
    
    if (!example.usage || example.usage.trim().length === 0) {
      missingComponents.push({
        name: 'usage',
        description: 'Document how to use this code example',
        importance: 'medium'
      });
    }
    
    return missingComponents;
  }
  
  /**
   * Process source code for knowledge extraction
   * @param {Object} sourceCode - The source code to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed source code with extracted knowledge
   */
  async processSourceCode(sourceCode, context = {}) {
    // 1. Extract potential implementation decisions
    const potentialDecisions = await this.extractPotentialDecisions(sourceCode);
    
    // 2. Extract potential code patterns
    const potentialPatterns = await this.extractPotentialPatterns(sourceCode);
    
    // 3. Extract potential edge cases
    const potentialEdgeCases = await this.extractPotentialEdgeCases(sourceCode);
    
    // 4. Extract potential performance considerations
    const potentialPerformanceConsiderations = await this.extractPotentialPerformanceConsiderations(sourceCode);
    
    // 5. Create enhanced source code with extracted knowledge
    const enhancedSourceCode = {
      ...sourceCode,
      extractedKnowledge: {
        implementationDecisions: potentialDecisions,
        codePatterns: potentialPatterns,
        edgeCases: potentialEdgeCases,
        performanceConsiderations: potentialPerformanceConsiderations
      }
    };
    
    return enhancedSourceCode;
  }
  
  /**
   * Extract potential implementation decisions from source code
   * @param {Object} sourceCode - The source code to analyze
   * @returns {Array} List of potential implementation decisions
   */
  async extractPotentialDecisions(sourceCode) {
    // In a real implementation, this would:
    // 1. Analyze the source code to identify key implementation decisions
    // 2. Extract decision points with context
    // 3. Format them as potential decisions to be documented
    
    // Mock implementation for now
    return [
      {
        summary: 'Potential decision: Lazy loading for image resources',
        rationale: 'Code implements delayed loading to improve initial page load time',
        confidence: 0.85,
        location: 'ImageLoader class'
      }
    ];
  }
  
  /**
   * Extract potential code patterns from source code
   * @param {Object} sourceCode - The source code to analyze
   * @returns {Array} List of potential code patterns
   */
  async extractPotentialPatterns(sourceCode) {
    // In a real implementation, this would:
    // 1. Analyze the source code to identify potential reusable patterns
    // 2. Match against known pattern signatures
    // 3. Format them as potential patterns to be documented
    
    // Mock implementation for now
    return [
      {
        name: 'Event Delegation Pattern',
        confidence: 0.9,
        location: 'EventHandler class',
        description: 'Using event bubbling to handle events at a higher level in the DOM'
      }
    ];
  }
  
  /**
   * Extract potential edge cases from source code
   * @param {Object} sourceCode - The source code to analyze
   * @returns {Array} List of potential edge cases
   */
  async extractPotentialEdgeCases(sourceCode) {
    // In a real implementation, this would:
    // 1. Analyze the source code to identify edge case handling
    // 2. Extract edge cases with context
    // 3. Format them as potential edge cases to be documented
    
    // Mock implementation for now
    return [
      {
        summary: 'Potential edge case: Empty response handling',
        handling: 'Code checks for empty API responses and provides fallback data',
        confidence: 0.8,
        location: 'ApiClient class, fetchData method'
      }
    ];
  }
  
  /**
   * Extract potential performance considerations from source code
   * @param {Object} sourceCode - The source code to analyze
   * @returns {Array} List of potential performance considerations
   */
  async extractPotentialPerformanceConsiderations(sourceCode) {
    // In a real implementation, this would:
    // 1. Analyze the source code to identify performance optimizations
    // 2. Extract performance considerations with context
    // 3. Format them as potential considerations to be documented
    
    // Mock implementation for now
    return [
      {
        summary: 'Potential performance consideration: Memoization for expensive calculations',
        impact: 'Reduces redundant calculations for frequently accessed values',
        confidence: 0.85,
        location: 'Calculator class, computeValue method'
      }
    ];
  }
  
  /**
   * Log implementation decision to ConPort
   * @param {Object} decision - The implementation decision to log
   */
  async logImplementationDecisionToConPort(decision) {
    if (!this.conPortClient) {
      return;
    }
    
    // Log as a decision with code-specific tags
    await this.conPortClient.log_decision({
      workspace_id: this.conPortClient.workspace_id,
      summary: decision.summary,
      rationale: decision.rationale,
      implementation_details: decision.implementationDetails || '',
      tags: [...(decision.tags || []), 'code', 'implementation_decision']
    });
    
    // If the decision has alternatives, store them as custom data
    if (decision.alternatives && decision.alternatives.length > 0) {
      await this.conPortClient.log_custom_data({
        workspace_id: this.conPortClient.workspace_id,
        category: 'implementation_alternatives',
        key: `decision_${Date.now()}`,
        value: {
          decisionSummary: decision.summary,
          alternatives: decision.alternatives
        }
      });
    }
  }
  
  /**
   * Log code pattern to ConPort
   * @param {Object} pattern - The code pattern to log
   */
  async logCodePatternToConPort(pattern) {
    if (!this.conPortClient) {
      return;
    }
    
    // Log as a system pattern
    await this.conPortClient.log_system_pattern({
      workspace_id: this.conPortClient.workspace_id,
      name: pattern.name,
      description: pattern.description,
      tags: [...(pattern.tags || []), 'code', 'implementation_pattern']
    });
    
    // Store additional pattern details as custom data
    const patternDetails = {
      name: pattern.name,
      usage: pattern.usage,
      example: pattern.example,
      benefits: pattern.benefits,
      considerations: pattern.considerations
    };
    
    await this.conPortClient.log_custom_data({
      workspace_id: this.conPortClient.workspace_id,
      category: 'code_pattern_details',
      key: `pattern_${pattern.name.replace(/\s+/g, '_').toLowerCase()}`,
      value: patternDetails
    });
  }
  
  /**
   * Log edge cases to ConPort
   * @param {Object} edgeCases - The edge cases to log
   */
  async logEdgeCasesToConPort(edgeCases) {
    if (!this.conPortClient) {
      return;
    }
    
    // Store edge cases as custom data
    await this.conPortClient.log_custom_data({
      workspace_id: this.conPortClient.workspace_id,
      category: 'edge_cases',
      key: `edge_cases_${edgeCases.name || Date.now()}`,
      value: edgeCases
    });
    
    // Log a progress entry for the edge cases
    await this.conPortClient.log_progress({
      workspace_id: this.conPortClient.workspace_id,
      description: `Documented edge cases: ${edgeCases.name || 'Unnamed edge cases'}`,
      status: 'DONE'
    });
  }
  
  /**
   * Log performance considerations to ConPort
   * @param {Object} considerations - The performance considerations to log
   */
  async logPerformanceConsiderationsToConPort(considerations) {
    if (!this.conPortClient) {
      return;
    }
    
    // Store performance considerations as custom data
    await this.conPortClient.log_custom_data({
      workspace_id: this.conPortClient.workspace_id,
      category: 'performance_considerations',
      key: `perf_${considerations.name || Date.now()}`,
      value: considerations
    });
    
    // Log a progress entry for the performance considerations
    await this.conPortClient.log_progress({
      workspace_id: this.conPortClient.workspace_id,
      description: `Documented performance considerations: ${considerations.name || 'Unnamed considerations'}`,
      status: 'DONE'
    });
  }
  
  /**
   * Log code example to ConPort
   * @param {Object} example - The code example to log
   */
  async logCodeExampleToConPort(example) {
    if (!this.conPortClient) {
      return;
    }
    
    // Store code example as custom data
    await this.conPortClient.log_custom_data({
      workspace_id: this.conPortClient.workspace_id,
      category: 'code_examples',
      key: `example_${example.name || Date.now()}`,
      value: example
    });
  }
  
  /**
   * Get code-specific knowledge metrics
   * @returns {Object} Knowledge metrics for code
   */
  getCodeKnowledgeMetrics() {
    return {
      ...this.codeMetrics,
      generalMetrics: this.getKnowledgeMetrics()
    };
  }
  
  /**
   * Search for related code knowledge in ConPort
   * @param {Object} query - The search query parameters
   * @returns {Object} Search results
   */
  async searchCodeKnowledge(query) {
    if (!this.conPortClient) {
      return { error: 'ConPort client not available' };
    }
    
    try {
      // Use semantic search if available
      if (this.conPortClient.semantic_search_conport) {
        const semanticResults = await this.conPortClient.semantic_search_conport({
          workspace_id: this.conPortClient.workspace_id,
          query_text: query.text,
          top_k: query.limit || 5,
          filter_item_types: ['decision', 'system_pattern', 'custom_data'],
          filter_tags_include_any: ['code', 'implementation', 'pattern']
        });
        
        this.codeMetrics.knowledgeReferences++;
        return semanticResults;
      }
      
      // Fall back to custom data search for code examples, edge cases, etc.
      const customDataResults = await this.conPortClient.search_custom_data_value_fts({
        workspace_id: this.conPortClient.workspace_id,
        query_term: query.text,
        category_filter: query.category,
        limit: query.limit || 5
      });
      
      this.codeMetrics.knowledgeReferences++;
      return customDataResults;
    } catch (error) {
      console.error('Error searching code knowledge:', error);
      return { error: error.message };
    }
  }
}

module.exports = {
  CodeKnowledgeFirstGuidelines
};