/**
 * Architect Mode Knowledge-First Guidelines
 * 
 * This module implements specialized Knowledge-First Guidelines for the Architect mode,
 * focusing on architectural decision documentation, pattern identification, and 
 * knowledge metrics specific to architecture work.
 */

const { KnowledgeFirstGuidelines } = require('../knowledge-first-guidelines');
const { KnowledgeSourceClassifier } = require('../knowledge-source-classifier');

/**
 * Architect Knowledge-First Guidelines
 * 
 * Extends the base Knowledge-First Guidelines with architect-specific
 * knowledge capturing capabilities and metrics.
 */
class ArchitectKnowledgeFirstGuidelines extends KnowledgeFirstGuidelines {
  /**
   * Initialize the Architect Knowledge-First Guidelines
   * @param {Object} options - Configuration options
   * @param {Object} conPortClient - ConPort client for knowledge management
   */
  constructor(options = {}, conPortClient) {
    super(options, conPortClient);
    
    // Architect-specific knowledge metrics
    this.architectureMetrics = {
      decisionsDocumented: 0,
      patternsIdentified: 0,
      tradeoffsDocumented: 0,
      consistencyChecks: 0,
      knowledgeReuse: 0
    };
    
    // Initialize knowledge source classifier with architecture-specific categories
    this.knowledgeSourceClassifier = new KnowledgeSourceClassifier({
      domainSpecificCategories: [
        'architectural_decision',
        'system_pattern',
        'design_principle',
        'technical_constraint',
        'quality_attribute'
      ]
    });
  }
  
  /**
   * Process an architectural decision for knowledge capture
   * @param {Object} decision - The architectural decision to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed decision with knowledge enhancement
   */
  async processArchitecturalDecision(decision, context = {}) {
    // 1. Classify knowledge source
    const sourceClassification = await this.knowledgeSourceClassifier.classify(
      decision,
      { type: 'architectural_decision', ...context }
    );
    
    // 2. Enhance decision with knowledge source classification
    const enhancedDecision = {
      ...decision,
      knowledgeSourceClassification: sourceClassification
    };
    
    // 3. Check for missing trade-offs and suggest additions
    if (!decision.tradeoffs || Object.keys(decision.tradeoffs).length === 0) {
      enhancedDecision.suggestedImprovements = [
        ...(enhancedDecision.suggestedImprovements || []),
        {
          type: 'missing_tradeoffs',
          description: 'Document the trade-offs involved in this decision',
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
          description: 'Document the alternatives that were considered',
          importance: 'high'
        }
      ];
    }
    
    // 5. Log architectural decision to ConPort if client is available
    if (this.conPortClient) {
      try {
        await this.logArchitecturalDecisionToConPort(enhancedDecision);
        this.architectureMetrics.decisionsDocumented++;
      } catch (error) {
        console.error('Error logging architectural decision to ConPort:', error);
      }
    }
    
    return enhancedDecision;
  }
  
  /**
   * Process a system pattern for knowledge capture
   * @param {Object} pattern - The system pattern to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed pattern with knowledge enhancement
   */
  async processSystemPattern(pattern, context = {}) {
    // 1. Classify knowledge source
    const sourceClassification = await this.knowledgeSourceClassifier.classify(
      pattern,
      { type: 'system_pattern', ...context }
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
    
    // 4. Log system pattern to ConPort if client is available
    if (this.conPortClient) {
      try {
        await this.logSystemPatternToConPort(enhancedPattern);
        this.architectureMetrics.patternsIdentified++;
      } catch (error) {
        console.error('Error logging system pattern to ConPort:', error);
      }
    }
    
    return enhancedPattern;
  }
  
  /**
   * Check for completeness of a system pattern
   * @param {Object} pattern - The system pattern to check
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
    
    if (!pattern.applicability || pattern.applicability.trim().length === 0) {
      missingComponents.push({
        name: 'applicability',
        description: 'Document when this pattern should be applied',
        importance: 'high'
      });
    }
    
    if (!pattern.benefits || !Array.isArray(pattern.benefits) || pattern.benefits.length === 0) {
      missingComponents.push({
        name: 'benefits',
        description: 'List the benefits of using this pattern',
        importance: 'medium'
      });
    }
    
    if (!pattern.consequences || !Array.isArray(pattern.consequences) || pattern.consequences.length === 0) {
      missingComponents.push({
        name: 'consequences',
        description: 'Document the consequences of using this pattern',
        importance: 'medium'
      });
    }
    
    if (!pattern.examples || pattern.examples.length === 0) {
      missingComponents.push({
        name: 'examples',
        description: 'Provide examples of this pattern in use',
        importance: 'medium'
      });
    }
    
    return missingComponents;
  }
  
  /**
   * Process architectural design documentation for knowledge capture
   * @param {Object} design - The architectural design to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed design with knowledge enhancement
   */
  async processArchitecturalDesign(design, context = {}) {
    // 1. Classify knowledge source
    const sourceClassification = await this.knowledgeSourceClassifier.classify(
      design,
      { type: 'architectural_design', ...context }
    );
    
    // 2. Enhance design with knowledge source classification
    const enhancedDesign = {
      ...design,
      knowledgeSourceClassification: sourceClassification
    };
    
    // 3. Extract potential architectural decisions from the design
    const potentialDecisions = await this.extractPotentialDecisions(design);
    if (potentialDecisions.length > 0) {
      enhancedDesign.suggestedDecisions = potentialDecisions;
    }
    
    // 4. Identify potential system patterns in the design
    const potentialPatterns = await this.identifyPotentialPatterns(design);
    if (potentialPatterns.length > 0) {
      enhancedDesign.suggestedPatterns = potentialPatterns;
    }
    
    // 5. Log architectural design elements to ConPort if client is available
    if (this.conPortClient) {
      try {
        await this.logArchitecturalDesignToConPort(enhancedDesign);
      } catch (error) {
        console.error('Error logging architectural design to ConPort:', error);
      }
    }
    
    return enhancedDesign;
  }
  
  /**
   * Extract potential architectural decisions from a design
   * @param {Object} design - The architectural design
   * @returns {Array} List of potential architectural decisions
   */
  async extractPotentialDecisions(design) {
    // In a real implementation, this would:
    // 1. Analyze the design to identify key architectural decisions
    // 2. Extract decision points with context
    // 3. Format them as potential decisions to be documented
    
    // Mock implementation for now
    return [
      {
        summary: 'Potential decision: Microservices architecture',
        rationale: 'Design shows service boundaries and API contracts',
        confidence: 0.85,
        location: 'System overview diagram'
      }
    ];
  }
  
  /**
   * Identify potential system patterns in a design
   * @param {Object} design - The architectural design
   * @returns {Array} List of potential system patterns
   */
  async identifyPotentialPatterns(design) {
    // In a real implementation, this would:
    // 1. Analyze the design to identify potential patterns
    // 2. Match against known pattern signatures
    // 3. Format them as potential patterns to be documented
    
    // Mock implementation for now
    return [
      {
        name: 'API Gateway Pattern',
        confidence: 0.9,
        location: 'API layer',
        rationale: 'Centralized API routing and transformation logic'
      }
    ];
  }
  
  /**
   * Process architectural quality attributes for knowledge capture
   * @param {Object} qualityAttributes - The quality attributes to process
   * @param {Object} context - Processing context
   * @returns {Object} Processed quality attributes with knowledge enhancement
   */
  async processQualityAttributes(qualityAttributes, context = {}) {
    // 1. Classify knowledge source
    const sourceClassification = await this.knowledgeSourceClassifier.classify(
      qualityAttributes,
      { type: 'quality_attributes', ...context }
    );
    
    // 2. Enhance quality attributes with knowledge source classification
    const enhancedAttributes = {
      ...qualityAttributes,
      knowledgeSourceClassification: sourceClassification
    };
    
    // 3. Check for missing quality attribute specifications
    const missingSpecifications = this.checkQualityAttributeCompleteness(qualityAttributes);
    if (missingSpecifications.length > 0) {
      enhancedAttributes.suggestedImprovements = [
        ...(enhancedAttributes.suggestedImprovements || []),
        ...missingSpecifications.map(spec => ({
          type: `missing_${spec.name}`,
          description: spec.description,
          importance: spec.importance
        }))
      ];
    }
    
    // 4. Log quality attributes to ConPort if client is available
    if (this.conPortClient) {
      try {
        await this.logQualityAttributesToConPort(enhancedAttributes);
      } catch (error) {
        console.error('Error logging quality attributes to ConPort:', error);
      }
    }
    
    return enhancedAttributes;
  }
  
  /**
   * Check for completeness of quality attributes
   * @param {Object} qualityAttributes - The quality attributes to check
   * @returns {Array} List of missing specifications
   */
  checkQualityAttributeCompleteness(qualityAttributes) {
    const missingSpecifications = [];
    
    // Check for commonly required quality attributes
    const requiredAttributes = [
      'performance', 
      'scalability', 
      'security', 
      'reliability',
      'maintainability'
    ];
    
    for (const attr of requiredAttributes) {
      if (!qualityAttributes[attr]) {
        missingSpecifications.push({
          name: attr,
          description: `Add specifications for ${attr}`,
          importance: 'high'
        });
      } else if (!qualityAttributes[attr].requirements || 
                 !qualityAttributes[attr].metrics) {
        missingSpecifications.push({
          name: `${attr}_details`,
          description: `Add detailed requirements and metrics for ${attr}`,
          importance: 'medium'
        });
      }
    }
    
    return missingSpecifications;
  }
  
  /**
   * Log architectural decision to ConPort
   * @param {Object} decision - The architectural decision to log
   */
  async logArchitecturalDecisionToConPort(decision) {
    if (!this.conPortClient) {
      return;
    }
    
    // Log as a decision with architecture-specific tags
    await this.conPortClient.log_decision({
      workspace_id: this.conPortClient.workspace_id,
      summary: decision.summary,
      rationale: decision.rationale,
      implementation_details: decision.implementationDetails || '',
      tags: [...(decision.tags || []), 'architecture', 'design_decision']
    });
    
    // If the decision has trade-offs, store them as custom data
    if (decision.tradeoffs && Object.keys(decision.tradeoffs).length > 0) {
      await this.conPortClient.log_custom_data({
        workspace_id: this.conPortClient.workspace_id,
        category: 'architecture_tradeoffs',
        key: `decision_${Date.now()}`,
        value: {
          decisionSummary: decision.summary,
          tradeoffs: decision.tradeoffs
        }
      });
      
      this.architectureMetrics.tradeoffsDocumented++;
    }
    
    // If the decision has alternatives, store them as custom data
    if (decision.alternatives && decision.alternatives.length > 0) {
      await this.conPortClient.log_custom_data({
        workspace_id: this.conPortClient.workspace_id,
        category: 'architecture_alternatives',
        key: `decision_${Date.now()}`,
        value: {
          decisionSummary: decision.summary,
          alternatives: decision.alternatives
        }
      });
    }
  }
  
  /**
   * Log system pattern to ConPort
   * @param {Object} pattern - The system pattern to log
   */
  async logSystemPatternToConPort(pattern) {
    if (!this.conPortClient) {
      return;
    }
    
    // Log as a system pattern
    await this.conPortClient.log_system_pattern({
      workspace_id: this.conPortClient.workspace_id,
      name: pattern.name,
      description: pattern.description,
      tags: [...(pattern.tags || []), 'architecture']
    });
    
    // Store additional pattern details as custom data
    const patternDetails = {
      name: pattern.name,
      applicability: pattern.applicability,
      benefits: pattern.benefits,
      consequences: pattern.consequences,
      examples: pattern.examples
    };
    
    await this.conPortClient.log_custom_data({
      workspace_id: this.conPortClient.workspace_id,
      category: 'pattern_details',
      key: `pattern_${pattern.name.replace(/\s+/g, '_').toLowerCase()}`,
      value: patternDetails
    });
  }
  
  /**
   * Log architectural design to ConPort
   * @param {Object} design - The architectural design to log
   */
  async logArchitecturalDesignToConPort(design) {
    if (!this.conPortClient) {
      return;
    }
    
    // Store the design as custom data
    await this.conPortClient.log_custom_data({
      workspace_id: this.conPortClient.workspace_id,
      category: 'architectural_designs',
      key: `design_${design.name || Date.now()}`,
      value: design
    });
    
    // Log a progress entry for the design
    await this.conPortClient.log_progress({
      workspace_id: this.conPortClient.workspace_id,
      description: `Architectural design: ${design.name || 'Unnamed design'}`,
      status: 'DONE'
    });
  }
  
  /**
   * Log quality attributes to ConPort
   * @param {Object} qualityAttributes - The quality attributes to log
   */
  async logQualityAttributesToConPort(qualityAttributes) {
    if (!this.conPortClient) {
      return;
    }
    
    // Store the quality attributes as custom data
    await this.conPortClient.log_custom_data({
      workspace_id: this.conPortClient.workspace_id,
      category: 'quality_attributes',
      key: `qa_${qualityAttributes.name || Date.now()}`,
      value: qualityAttributes
    });
  }
  
  /**
   * Get architecture-specific knowledge metrics
   * @returns {Object} Knowledge metrics for architecture
   */
  getArchitectureKnowledgeMetrics() {
    return {
      ...this.architectureMetrics,
      generalMetrics: this.getKnowledgeMetrics()
    };
  }
  
  /**
   * Search for related architectural knowledge in ConPort
   * @param {Object} query - The search query parameters
   * @returns {Object} Search results
   */
  async searchArchitecturalKnowledge(query) {
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
          filter_tags_include_any: ['architecture', 'design', 'pattern']
        });
        
        this.architectureMetrics.knowledgeReuse++;
        return semanticResults;
      }
      
      // Fall back to decisions search
      const decisionResults = await this.conPortClient.search_decisions_fts({
        workspace_id: this.conPortClient.workspace_id,
        query_term: query.text,
        limit: query.limit || 5
      });
      
      this.architectureMetrics.knowledgeReuse++;
      return decisionResults;
    } catch (error) {
      console.error('Error searching architectural knowledge:', error);
      return { error: error.message };
    }
  }
}

module.exports = {
  ArchitectKnowledgeFirstGuidelines
};