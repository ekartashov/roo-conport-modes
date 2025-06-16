/**
 * Ask Knowledge First Guidelines
 * 
 * Guidelines for implementing knowledge-first approaches in Ask Mode,
 * focusing on information source classification, retrieval strategies,
 * answer formulation, and knowledge persistence.
 */

const { KnowledgeSourceClassifier } = require('../knowledge-source-classifier');
const { KnowledgeFirstGuidelines } = require('../knowledge-first-guidelines');

/**
 * Specialized knowledge-first guidelines for Ask Mode
 */
class AskKnowledgeFirstGuidelines extends KnowledgeFirstGuidelines {
  constructor(options = {}) {
    super({
      mode: 'ask',
      description: 'Knowledge-first guidelines for information retrieval, evaluation, and synthesis in Ask Mode',
      ...options
    });
    
    this.sourceClassifier = options.sourceClassifier || new KnowledgeSourceClassifier();
    
    // Configure source reliability assessments
    this.reliabilityAssessments = options.reliabilityAssessments || {
      official_documentation: {
        reliability: 'high',
        trustFactor: 0.95,
        staleness: {
          lowThreshold: 365 * 2, // 2 years
          mediumThreshold: 365 * 5 // 5 years
        }
      },
      peer_reviewed: {
        reliability: 'high',
        trustFactor: 0.9,
        staleness: {
          lowThreshold: 365 * 3, // 3 years
          mediumThreshold: 365 * 7 // 7 years
        }
      },
      technical_blog: {
        reliability: 'medium',
        trustFactor: 0.7,
        staleness: {
          lowThreshold: 365, // 1 year
          mediumThreshold: 365 * 2 // 2 years
        }
      },
      forum_discussion: {
        reliability: 'low',
        trustFactor: 0.4,
        staleness: {
          lowThreshold: 90, // 3 months
          mediumThreshold: 365 // 1 year
        }
      },
      personal_blog: {
        reliability: 'low',
        trustFactor: 0.5,
        staleness: {
          lowThreshold: 180, // 6 months
          mediumThreshold: 365 // 1 year
        }
      },
      unknown: {
        reliability: 'unknown',
        trustFactor: 0.2,
        staleness: {
          lowThreshold: 30, // 1 month
          mediumThreshold: 90 // 3 months
        }
      }
    };
    
    // Define knowledge retrieval strategies
    this.retrievalStrategies = options.retrievalStrategies || [
      {
        name: 'hierarchical',
        description: 'Retrieve information starting with most authoritative sources, then broaden search',
        phases: [
          { sourceTypes: ['official_documentation', 'peer_reviewed'], minCount: 2 },
          { sourceTypes: ['technical_blog', 'industry_standard'], minCount: 1 },
          { sourceTypes: ['forum_discussion', 'personal_blog'], minCount: 0 }
        ]
      },
      {
        name: 'comparative',
        description: 'Retrieve multiple sources with different perspectives for comparison',
        phases: [
          { sourceTypes: ['official_documentation'], minCount: 1 },
          { sourceTypes: ['technical_blog', 'personal_blog'], minCount: 2 },
          { sourceTypes: ['forum_discussion'], minCount: 1 }
        ]
      },
      {
        name: 'historical',
        description: 'Retrieve information with focus on evolution over time',
        phases: [
          { sourceTypes: ['official_documentation'], dateRanges: [{ years: [5, null] }, { years: [2, 5] }, { years: [0, 2] }], minCount: 1 },
          { sourceTypes: ['technical_blog'], dateRanges: [{ years: [3, null] }, { years: [1, 3] }, { years: [0, 1] }], minCount: 1 }
        ]
      },
      {
        name: 'community_consensus',
        description: 'Retrieve information focusing on community consensus and practices',
        phases: [
          { sourceTypes: ['forum_discussion'], minCount: 3 },
          { sourceTypes: ['technical_blog', 'personal_blog'], minCount: 2 },
          { sourceTypes: ['official_documentation'], minCount: 1 }
        ]
      }
    ];
    
    // Define answer formulation templates
    this.answerTemplates = options.answerTemplates || {
      technical_detailed: {
        components: [
          'directAnswer',
          'technicalDefinition',
          'detailedExplanation',
          'codeExamples',
          'edgeCases',
          'alternatives',
          'furtherReading'
        ],
        targetAudience: 'expert',
        confidenceThreshold: 0.8
      },
      practical_guide: {
        components: [
          'directAnswer',
          'contextualRelevance',
          'stepByStepInstructions',
          'practicalExamples',
          'commonPitfalls',
          'troubleshooting'
        ],
        targetAudience: 'practitioner',
        confidenceThreshold: 0.7
      },
      conceptual_overview: {
        components: [
          'directAnswer',
          'conceptIntroduction',
          'keyPrinciples',
          'visualExplanation',
          'realWorldAnalogies',
          'commonMisconceptions'
        ],
        targetAudience: 'beginner',
        confidenceThreshold: 0.6
      },
      comparative_analysis: {
        components: [
          'directAnswer',
          'comparisonMatrix',
          'strengthsWeaknesses',
          'useCaseAnalysis',
          'industryTrends',
          'decisionGuidelines'
        ],
        targetAudience: 'decision_maker',
        confidenceThreshold: 0.75
      }
    };
    
    // Define knowledge extraction and persistence patterns
    this.knowledgeExtractionPatterns = options.knowledgeExtractionPatterns || [
      {
        pattern: 'definition',
        description: 'Extract formal definitions of terms, concepts, or technologies',
        conportCategory: 'ProjectGlossary',
        extractors: [
          {
            regex: /(?:is|are)\s+defined\s+as\s+(.+?)(?:\.|\n|$)/i,
            processor: 'extractDefinition'
          },
          {
            regex: /([A-Z][a-zA-Z\s]+(?:framework|pattern|concept|principle|technology))\s+refers\s+to\s+(.+?)(?:\.|\n|$)/i,
            processor: 'extractNamedDefinition'
          }
        ]
      },
      {
        pattern: 'bestPractice',
        description: 'Extract recommended best practices',
        conportCategory: 'BestPractices',
        extractors: [
          {
            regex: /best\s+practice\s+(?:is|for)\s+(.+?)(?:\.|\n|$)/i,
            processor: 'extractBestPractice'
          },
          {
            regex: /recommended\s+(?:approach|way|method)\s+(?:is|to)\s+(.+?)(?:\.|\n|$)/i,
            processor: 'extractRecommendation'
          }
        ]
      },
      {
        pattern: 'constraint',
        description: 'Extract technical constraints or limitations',
        conportCategory: 'Constraints',
        extractors: [
          {
            regex: /limitation\s+of\s+(.+?)(?:\.|\n|$)/i,
            processor: 'extractLimitation'
          },
          {
            regex: /constraint\s+(?:is|for)\s+(.+?)(?:\.|\n|$)/i,
            processor: 'extractConstraint'
          }
        ]
      },
      {
        pattern: 'comparisonInsight',
        description: 'Extract comparative insights between technologies or approaches',
        conportCategory: 'ComparativeInsights',
        extractors: [
          {
            regex: /compared\s+to\s+(.+?),\s+(.+?)(?:\.|\n|$)/i,
            processor: 'extractComparison'
          },
          {
            regex: /advantage\s+of\s+(.+?)\s+over\s+(.+?)\s+is\s+(.+?)(?:\.|\n|$)/i,
            processor: 'extractAdvantage'
          }
        ]
      }
    ];
    
    // Define ConPort integration strategies
    this.conportIntegrationStrategies = options.conportIntegrationStrategies || {
      informationLogging: [
        {
          type: 'factualKnowledge',
          method: 'log_custom_data',
          categoryMap: {
            definition: 'ProjectGlossary',
            bestPractice: 'BestPractices',
            constraint: 'Constraints',
            comparisonInsight: 'ComparativeInsights'
          },
          conditions: {
            minimumConfidence: 0.8,
            requiresSource: true
          }
        },
        {
          type: 'decisionInsight',
          method: 'log_decision',
          valueExtractors: {
            summary: 'extractInsightSummary',
            rationale: 'extractInsightRationale',
            tags: 'generateInsightTags'
          },
          conditions: {
            minimumConfidence: 0.85,
            requiresComparison: true
          }
        }
      ],
      informationRetrieval: [
        {
          type: 'semanticSearch',
          method: 'semantic_search_conport',
          parameters: {
            top_k: 5,
            filter_item_types: ['custom_data', 'decision']
          },
          conditions: {
            complexQuery: true
          }
        },
        {
          type: 'keywordSearch',
          method: 'search_custom_data_value_fts',
          parameters: {
            limit: 10
          },
          conditions: {
            simpleQuery: true,
            hasKeywords: true
          }
        },
        {
          type: 'glossarySearch',
          method: 'search_project_glossary_fts',
          parameters: {
            limit: 5
          },
          conditions: {
            definitionQuery: true
          }
        }
      ],
      informationEnrichment: [
        {
          type: 'relatedItems',
          method: 'get_linked_items',
          valueProcessor: 'processRelatedItems'
        },
        {
          type: 'contextUpdate',
          method: 'update_active_context',
          valueProcessor: 'enrichActiveContext'
        }
      ]
    };
  }
  
  /**
   * Select appropriate retrieval strategy based on question type
   * @param {Object} question - The question object
   * @param {Object} context - Additional context
   * @returns {Object} - The selected retrieval strategy
   */
  selectRetrievalStrategy(question, context = {}) {
    if (!question || typeof question !== 'object') {
      return this.retrievalStrategies[0]; // Default to hierarchical
    }
    
    const questionType = question.type || this._inferQuestionType(question);
    
    switch (questionType.toLowerCase()) {
      case 'factual':
      case 'technical':
        return this.retrievalStrategies.find(s => s.name === 'hierarchical') || this.retrievalStrategies[0];
        
      case 'comparison':
      case 'decision':
        return this.retrievalStrategies.find(s => s.name === 'comparative') || this.retrievalStrategies[0];
        
      case 'evolution':
      case 'trend':
        return this.retrievalStrategies.find(s => s.name === 'historical') || this.retrievalStrategies[0];
        
      case 'practice':
      case 'recommendation':
        return this.retrievalStrategies.find(s => s.name === 'community_consensus') || this.retrievalStrategies[0];
        
      default:
        return this.retrievalStrategies[0]; // Default to hierarchical
    }
  }
  
  /**
   * Infer question type from content
   * @param {Object} question - The question object
   * @returns {string} - The inferred question type
   * @private
   */
  _inferQuestionType(question) {
    const text = question.text || '';
    
    // Look for comparison keywords
    if (/compare|versus|vs\.|better|difference between|advantages of/i.test(text)) {
      return 'comparison';
    }
    
    // Look for evolution/trend keywords
    if (/evolve|trend|history|development|progress|future|roadmap/i.test(text)) {
      return 'evolution';
    }
    
    // Look for practice/recommendation keywords
    if (/how to|best way|recommend|practice|approach|should I|guide/i.test(text)) {
      return 'practice';
    }
    
    // Default to factual
    return 'factual';
  }
  
  /**
   * Select appropriate answer template based on question and audience
   * @param {Object} question - The question object
   * @param {Object} context - Additional context including user information
   * @returns {Object} - The selected answer template
   */
  selectAnswerTemplate(question, context = {}) {
    if (!question || typeof question !== 'object') {
      return this.answerTemplates.conceptual_overview; // Default to conceptual overview
    }
    
    // Determine audience from context if available
    let audience = 'practitioner'; // Default
    
    if (context.user && context.user.technicalLevel) {
      switch (context.user.technicalLevel.toLowerCase()) {
        case 'beginner':
        case 'novice':
          audience = 'beginner';
          break;
        case 'intermediate':
        case 'practitioner':
          audience = 'practitioner';
          break;
        case 'expert':
        case 'advanced':
          audience = 'expert';
          break;
        case 'manager':
        case 'decision maker':
          audience = 'decision_maker';
          break;
      }
    }
    
    // Select template based on question type and audience
    const questionType = question.type || this._inferQuestionType(question);
    
    switch (questionType.toLowerCase()) {
      case 'comparison':
      case 'decision':
        return this.answerTemplates.comparative_analysis;
        
      case 'factual':
      case 'technical':
        return audience === 'expert' 
          ? this.answerTemplates.technical_detailed 
          : this.answerTemplates.conceptual_overview;
        
      case 'practice':
      case 'recommendation':
        return this.answerTemplates.practical_guide;
        
      case 'evolution':
      case 'trend':
        return audience === 'decision_maker'
          ? this.answerTemplates.comparative_analysis
          : this.answerTemplates.conceptual_overview;
        
      default:
        // Map audience to default templates
        switch (audience) {
          case 'beginner':
            return this.answerTemplates.conceptual_overview;
          case 'expert':
            return this.answerTemplates.technical_detailed;
          case 'decision_maker':
            return this.answerTemplates.comparative_analysis;
          case 'practitioner':
          default:
            return this.answerTemplates.practical_guide;
        }
    }
  }
  
  /**
   * Extract knowledge from an answer for ConPort persistence
   * @param {Object} answer - The answer object
   * @param {Object} question - The question object
   * @param {Object} context - Additional context
   * @returns {Array} - Array of extracted knowledge items
   */
  extractKnowledge(answer, question, context = {}) {
    if (!answer || typeof answer !== 'object') {
      return [];
    }
    
    const extractedItems = [];
    
    // Convert answer to searchable text if necessary
    let searchText = '';
    
    Object.entries(answer).forEach(([key, value]) => {
      if (typeof value === 'string') {
        searchText += value + '\n';
      } else if (typeof value === 'object' && value !== null) {
        searchText += JSON.stringify(value) + '\n';
      }
    });
    
    // Apply extraction patterns
    this.knowledgeExtractionPatterns.forEach(pattern => {
      pattern.extractors.forEach(extractor => {
        const matches = searchText.match(new RegExp(extractor.regex, 'g')) || [];
        
        matches.forEach(match => {
          const extractResult = this[extractor.processor](match, pattern, question);
          
          if (extractResult) {
            extractedItems.push({
              type: pattern.pattern,
              category: pattern.conportCategory,
              data: extractResult,
              confidence: this._calculateExtractionConfidence(extractResult, pattern, context)
            });
          }
        });
      });
    });
    
    return extractedItems;
  }
  
  /**
   * Process extracted knowledge for ConPort persistence
   * @param {Array} extractedItems - Array of extracted knowledge items
   * @param {Object} context - Additional context
   * @returns {Array} - Array of ConPort operations
   */
  prepareConportOperations(extractedItems, context = {}) {
    if (!Array.isArray(extractedItems) || extractedItems.length === 0) {
      return [];
    }
    
    const operations = [];
    
    extractedItems.forEach(item => {
      // Filter by confidence threshold
      const integrationStrategy = this.conportIntegrationStrategies.informationLogging.find(
        strategy => strategy.type === 'factualKnowledge'
      );
      
      if (item.confidence < (integrationStrategy?.conditions?.minimumConfidence || 0.8)) {
        return; // Skip low-confidence items
      }
      
      // Map to ConPort operations
      switch (item.type) {
        case 'definition':
          operations.push({
            method: 'log_custom_data',
            params: {
              category: 'ProjectGlossary',
              key: item.data.term,
              value: {
                definition: item.data.definition,
                sources: item.data.sources || [],
                dateAdded: new Date().toISOString(),
                confidence: item.confidence
              }
            }
          });
          break;
          
        case 'bestPractice':
          operations.push({
            method: 'log_custom_data',
            params: {
              category: 'BestPractices',
              key: `best_practice_${this._generateKey(item.data.context)}`,
              value: {
                context: item.data.context,
                practice: item.data.practice,
                sources: item.data.sources || [],
                dateAdded: new Date().toISOString(),
                confidence: item.confidence
              }
            }
          });
          break;
          
        case 'constraint':
          operations.push({
            method: 'log_custom_data',
            params: {
              category: 'Constraints',
              key: `constraint_${this._generateKey(item.data.subject)}`,
              value: {
                subject: item.data.subject,
                constraint: item.data.constraint,
                sources: item.data.sources || [],
                dateAdded: new Date().toISOString(),
                confidence: item.confidence
              }
            }
          });
          break;
          
        case 'comparisonInsight':
          operations.push({
            method: 'log_custom_data',
            params: {
              category: 'ComparativeInsights',
              key: `comparison_${this._generateKey(item.data.itemA)}_${this._generateKey(item.data.itemB)}`,
              value: {
                itemA: item.data.itemA,
                itemB: item.data.itemB,
                insight: item.data.insight,
                sources: item.data.sources || [],
                dateAdded: new Date().toISOString(),
                confidence: item.confidence
              }
            }
          });
          
          // For significant insights, also log as a decision
          if (item.confidence > 0.9) {
            operations.push({
              method: 'log_decision',
              params: {
                summary: `Comparative insight: ${item.data.itemA} vs ${item.data.itemB}`,
                rationale: item.data.insight,
                tags: ['comparative_insight', item.data.itemA, item.data.itemB].map(tag => 
                  tag.toLowerCase().replace(/\s+/g, '_')
                )
              }
            });
          }
          break;
      }
    });
    
    return operations;
  }
  
  /**
   * Calculate extraction confidence
   * @param {Object} extractResult - The extracted data
   * @param {Object} pattern - The extraction pattern
   * @param {Object} context - Additional context
   * @returns {number} - Confidence score
   * @private
   */
  _calculateExtractionConfidence(extractResult, pattern, context = {}) {
    // Base confidence
    let confidence = 0.7;
    
    // Adjust based on source reliability
    if (extractResult.sources && Array.isArray(extractResult.sources)) {
      let reliabilitySum = 0;
      
      extractResult.sources.forEach(source => {
        const sourceType = source.type || 'unknown';
        const reliabilityInfo = this.reliabilityAssessments[sourceType] || this.reliabilityAssessments.unknown;
        reliabilitySum += reliabilityInfo.trustFactor;
      });
      
      const avgReliability = extractResult.sources.length > 0 
        ? reliabilitySum / extractResult.sources.length 
        : 0;
        
      confidence += avgReliability * 0.2; // Max +0.2 for reliable sources
    } else {
      confidence -= 0.1; // Penalty for no sources
    }
    
    // Adjust based on extraction pattern type
    switch (pattern.pattern) {
      case 'definition':
        confidence += 0.1; // Definitions tend to be more reliable
        break;
      case 'comparisonInsight':
        confidence -= 0.05; // Comparisons can be subjective
        break;
    }
    
    // Adjust based on context
    if (context.questionConfidence) {
      confidence += (context.questionConfidence - 0.5) * 0.1; // +/- 0.05 based on question confidence
    }
    
    // Ensure confidence is in range [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }
  
  /**
   * Generate a key from text for ConPort storage
   * @param {string} text - Input text
   * @returns {string} - Generated key
   * @private
   */
  _generateKey(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
  }
  
  // Knowledge extraction processor methods
  
  /**
   * Extract definition from match
   * @param {string} match - Regex match
   * @param {Object} pattern - Extraction pattern
   * @param {Object} question - Question object
   * @returns {Object|null} - Extracted definition or null
   */
  extractDefinition(match, pattern, question) {
    const regex = /(?:is|are)\s+defined\s+as\s+(.+?)(?:\.|\n|$)/i;
    const matches = match.match(regex);
    
    if (!matches || matches.length < 2) {
      return null;
    }
    
    // Try to determine the term being defined
    let term = '';
    const beforeMatch = match.substring(0, match.indexOf(matches[0])).trim();
    const words = beforeMatch.split(/\s+/);
    
    if (words.length > 0) {
      // Take the last few words as the term
      term = words.slice(Math.max(0, words.length - 3)).join(' ');
    }
    
    if (!term && question && question.text) {
      // Try to extract term from question
      const questionTerms = question.text.match(/what\s+is\s+(?:a|an|the)?\s+([^?]+)(?:\?|$)/i);
      if (questionTerms && questionTerms.length > 1) {
        term = questionTerms[1].trim();
      }
    }
    
    return {
      term: term || 'Unknown Term',
      definition: matches[1].trim(),
      sources: []
    };
  }
  
  /**
   * Extract named definition from match
   * @param {string} match - Regex match
   * @param {Object} pattern - Extraction pattern
   * @param {Object} question - Question object
   * @returns {Object|null} - Extracted definition or null
   */
  extractNamedDefinition(match, pattern, question) {
    const regex = /([A-Z][a-zA-Z\s]+(?:framework|pattern|concept|principle|technology))\s+refers\s+to\s+(.+?)(?:\.|\n|$)/i;
    const matches = match.match(regex);
    
    if (!matches || matches.length < 3) {
      return null;
    }
    
    return {
      term: matches[1].trim(),
      definition: matches[2].trim(),
      sources: []
    };
  }
  
  /**
   * Extract best practice from match
   * @param {string} match - Regex match
   * @param {Object} pattern - Extraction pattern
   * @param {Object} question - Question object
   * @returns {Object|null} - Extracted best practice or null
   */
  extractBestPractice(match, pattern, question) {
    const regex = /best\s+practice\s+(?:is|for)\s+(.+?)(?:\.|\n|$)/i;
    const matches = match.match(regex);
    
    if (!matches || matches.length < 2) {
      return null;
    }
    
    // Try to determine the context
    let context = '';
    const beforeMatch = match.substring(0, match.indexOf(matches[0])).trim();
    const contextMatches = beforeMatch.match(/(?:when|for|in)\s+([^,\.]+)(?:,|\.|\s+the)/i);
    
    if (contextMatches && contextMatches.length > 1) {
      context = contextMatches[1].trim();
    } else if (question && question.text) {
      // Try to extract context from question
      const questionContext = question.text.match(/(?:for|when|in)\s+([^?]+)(?:\?|$)/i);
      if (questionContext && questionContext.length > 1) {
        context = questionContext[1].trim();
      }
    }
    
    return {
      context: context || 'General Context',
      practice: matches[1].trim(),
      sources: []
    };
  }
  
  /**
   * Extract recommendation from match
   * @param {string} match - Regex match
   * @param {Object} pattern - Extraction pattern
   * @param {Object} question - Question object
   * @returns {Object|null} - Extracted recommendation or null
   */
  extractRecommendation(match, pattern, question) {
    const regex = /recommended\s+(?:approach|way|method)\s+(?:is|to)\s+(.+?)(?:\.|\n|$)/i;
    const matches = match.match(regex);
    
    if (!matches || matches.length < 2) {
      return null;
    }
    
    // Similar to extractBestPractice
    let context = '';
    const beforeMatch = match.substring(0, match.indexOf(matches[0])).trim();
    const contextMatches = beforeMatch.match(/(?:when|for|in)\s+([^,\.]+)(?:,|\.|\s+the)/i);
    
    if (contextMatches && contextMatches.length > 1) {
      context = contextMatches[1].trim();
    } else if (question && question.text) {
      const questionContext = question.text.match(/(?:for|when|in)\s+([^?]+)(?:\?|$)/i);
      if (questionContext && questionContext.length > 1) {
        context = questionContext[1].trim();
      }
    }
    
    return {
      context: context || 'General Context',
      practice: matches[1].trim(),
      sources: []
    };
  }
  
  /**
   * Extract limitation from match
   * @param {string} match - Regex match
   * @param {Object} pattern - Extraction pattern
   * @param {Object} question - Question object
   * @returns {Object|null} - Extracted limitation or null
   */
  extractLimitation(match, pattern, question) {
    const regex = /limitation\s+of\s+(.+?)(?:\.|\n|$)/i;
    const matches = match.match(regex);
    
    if (!matches || matches.length < 2) {
      return null;
    }
    
    // Try to determine the subject
    const parts = matches[1].split(/\s+is\s+|\s+are\s+/);
    let subject = '';
    let constraint = '';
    
    if (parts.length >= 2) {
      subject = parts[0].trim();
      constraint = parts.slice(1).join(' ').trim();
    } else {
      subject = matches[1].trim();
      
      // Try to find constraint in surrounding text
      const afterMatch = match.substring(match.indexOf(matches[0]) + matches[0].length).trim();
      const constraintMatch = afterMatch.match(/^\s*(?:is|are)\s+(.+?)(?:\.|\n|$)/i);
      
      if (constraintMatch && constraintMatch.length > 1) {
        constraint = constraintMatch[1].trim();
      }
    }
    
    return {
      subject: subject || 'Unknown Subject',
      constraint: constraint || 'Unspecified Limitation',
      sources: []
    };
  }
  
  /**
   * Extract constraint from match
   * @param {string} match - Regex match
   * @param {Object} pattern - Extraction pattern
   * @param {Object} question - Question object
   * @returns {Object|null} - Extracted constraint or null
   */
  extractConstraint(match, pattern, question) {
    const regex = /constraint\s+(?:is|for)\s+(.+?)(?:\.|\n|$)/i;
    const matches = match.match(regex);
    
    if (!matches || matches.length < 2) {
      return null;
    }
    
    // Similar to extractLimitation
    const parts = matches[1].split(/\s+is\s+|\s+are\s+/);
    let subject = '';
    let constraint = '';
    
    if (parts.length >= 2) {
      subject = parts[0].trim();
      constraint = parts.slice(1).join(' ').trim();
    } else {
      // Try to determine subject from question
      if (question && question.text) {
        const subjectMatch = question.text.match(/(?:constraint|limitation)\s+(?:of|for)\s+([^?]+)(?:\?|$)/i);
        if (subjectMatch && subjectMatch.length > 1) {
          subject = subjectMatch[1].trim();
        }
      }
      
      constraint = matches[1].trim();
    }
    
    return {
      subject: subject || 'General Context',
      constraint: constraint,
      sources: []
    };
  }
  
  /**
   * Extract comparison from match
   * @param {string} match - Regex match
   * @param {Object} pattern - Extraction pattern
   * @param {Object} question - Question object
   * @returns {Object|null} - Extracted comparison or null
   */
  extractComparison(match, pattern, question) {
    const regex = /compared\s+to\s+(.+?),\s+(.+?)(?:\.|\n|$)/i;
    const matches = match.match(regex);
    
    if (!matches || matches.length < 3) {
      return null;
    }
    
    return {
      itemA: matches[1].trim(),
      itemB: 'Reference Item', // This is implied as the subject being compared
      insight: matches[2].trim(),
      sources: []
    };
  }
  
  /**
   * Extract advantage from match
   * @param {string} match - Regex match
   * @param {Object} pattern - Extraction pattern
   * @param {Object} question - Question object
   * @returns {Object|null} - Extracted advantage or null
   */
  extractAdvantage(match, pattern, question) {
    const regex = /advantage\s+of\s+(.+?)\s+over\s+(.+?)\s+is\s+(.+?)(?:\.|\n|$)/i;
    const matches = match.match(regex);
    
    if (!matches || matches.length < 4) {
      return null;
    }
    
    return {
      itemA: matches[1].trim(),
      itemB: matches[2].trim(),
      insight: matches[3].trim(),
      sources: []
    };
  }
}

module.exports = { AskKnowledgeFirstGuidelines };