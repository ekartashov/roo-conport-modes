/**
 * Docs Knowledge First Guidelines
 * 
 * Guidelines for implementing knowledge-first approaches in Docs Mode,
 * focusing on documentation structure, knowledge extraction, and
 * ConPort integration for knowledge preservation.
 */

const { KnowledgeSourceClassifier } = require('../knowledge-source-classifier');
const { KnowledgeFirstGuidelines } = require('../knowledge-first-guidelines');

/**
 * Specialized knowledge-first guidelines for Docs Mode
 */
class DocsKnowledgeFirstGuidelines extends KnowledgeFirstGuidelines {
  constructor(options = {}) {
    super({
      mode: 'docs',
      description: 'Knowledge-first guidelines for documentation creation, maintenance, and knowledge preservation',
      ...options
    });
    
    this.sourceClassifier = options.sourceClassifier || new KnowledgeSourceClassifier();
    
    // Document classification types
    this.documentTypes = options.documentTypes || {
      api_reference: {
        priority: 'high',
        sections: ['overview', 'parameters', 'returns', 'examples', 'errors', 'notes'],
        knowledgeDensity: 0.7
      },
      user_guide: {
        priority: 'high',
        sections: ['introduction', 'getting_started', 'use_cases', 'tutorials', 'faq'],
        knowledgeDensity: 0.6
      },
      design_doc: {
        priority: 'high',
        sections: ['overview', 'goals', 'architecture', 'trade_offs', 'alternatives_considered', 'decision_log'],
        knowledgeDensity: 0.9
      },
      tutorial: {
        priority: 'medium',
        sections: ['introduction', 'prerequisites', 'steps', 'conclusion', 'next_steps'],
        knowledgeDensity: 0.5
      },
      release_notes: {
        priority: 'medium',
        sections: ['highlights', 'new_features', 'improvements', 'bug_fixes', 'breaking_changes'],
        knowledgeDensity: 0.6
      },
      readme: {
        priority: 'high',
        sections: ['overview', 'installation', 'usage', 'examples', 'contributing', 'license'],
        knowledgeDensity: 0.7
      },
      changelog: {
        priority: 'medium',
        sections: ['unreleased', 'versions', 'breaking_changes'],
        knowledgeDensity: 0.5
      },
      troubleshooting: {
        priority: 'medium',
        sections: ['common_issues', 'solutions', 'debugging_steps', 'contact_support'],
        knowledgeDensity: 0.6
      }
    };
    
    // Documentation templates
    this.documentTemplates = options.documentTemplates || {
      api_reference: {
        template: `# API Reference: {{name}}

## Overview

{{overview}}

## Parameters

{{parameters}}

## Returns

{{returns}}

## Examples

\`\`\`{{language}}
{{examples}}
\`\`\`

## Errors

{{errors}}

## Notes

{{notes}}

## Related

{{related}}
`,
        requiredVariables: ['name', 'overview', 'parameters', 'returns', 'examples']
      },
      user_guide: {
        template: `# User Guide: {{title}}

## Introduction

{{introduction}}

## Getting Started

{{getting_started}}

## Use Cases

{{use_cases}}

## Tutorials

{{tutorials}}

## FAQ

{{faq}}

## Additional Resources

{{additional_resources}}
`,
        requiredVariables: ['title', 'introduction', 'getting_started']
      },
      design_doc: {
        template: `# Design Document: {{title}}

## Overview

{{overview}}

## Goals and Non-Goals

{{goals}}

## Architecture

{{architecture}}

## Trade-offs

{{trade_offs}}

## Alternatives Considered

{{alternatives_considered}}

## Decision Log

{{decision_log}}

## Implementation Plan

{{implementation_plan}}
`,
        requiredVariables: ['title', 'overview', 'goals', 'architecture']
      }
    };
    
    // Knowledge extraction patterns
    this.knowledgeExtractionPatterns = options.knowledgeExtractionPatterns || {
      glossary_terms: {
        pattern: /\*\*([A-Z][a-zA-Z0-9\s]+)\*\*\s*[-–:]\s*([^.]+\.)/g,
        processor: 'extractGlossaryTerm',
        category: 'ProjectGlossary'
      },
      design_decisions: {
        pattern: /### Decision:([^#]+)(?:### Rationale:([^#]+))?(?:### Alternatives:([^#]+))?/g,
        processor: 'extractDesignDecision',
        category: 'Decisions'
      },
      constraints: {
        pattern: /\*\*Constraint\*\*\s*[-–:]\s*([^.]+\.)/g,
        processor: 'extractConstraint',
        category: 'Constraints'
      },
      code_patterns: {
        pattern: /\*\*Pattern\*\*\s*[-–:]\s*([^.]+\.)(?:\s*```(?:.*?)```)?/g,
        processor: 'extractCodePattern',
        category: 'SystemPatterns'
      },
      best_practices: {
        pattern: /\*\*Best Practice\*\*\s*[-–:]\s*([^.]+\.)/g,
        processor: 'extractBestPractice',
        category: 'BestPractices'
      }
    };
    
    // Knowledge linking strategies
    this.knowledgeLinkingStrategies = options.knowledgeLinkingStrategies || {
      internal_references: {
        pattern: /\[([^\]]+)\]\(#([^)]+)\)/g,
        processor: 'processInternalReference',
        linkType: 'internal'
      },
      conport_references: {
        pattern: /\[ConPort:([^\]]+):([^\]]+)\]/g,
        processor: 'processConportReference',
        linkType: 'conport'
      },
      code_references: {
        pattern: /\[([^\]]+)\]\(([^)]+\.[a-zA-Z0-9]+)\)/g,
        processor: 'processCodeReference',
        linkType: 'code'
      },
      see_also_references: {
        pattern: /See also: (.+)$/gm,
        processor: 'processSeeAlsoReference',
        linkType: 'see_also'
      }
    };
    
    // ConPort integration strategies
    this.conportIntegrationStrategies = options.conportIntegrationStrategies || {
      extractionMapping: {
        glossary_terms: {
          conportMethod: 'log_custom_data',
          category: 'ProjectGlossary',
          valueProcessor: 'formatGlossaryValue'
        },
        design_decisions: {
          conportMethod: 'log_decision',
          valueProcessor: 'formatDecisionValue'
        },
        constraints: {
          conportMethod: 'log_custom_data',
          category: 'Constraints',
          valueProcessor: 'formatConstraintValue'
        },
        code_patterns: {
          conportMethod: 'log_system_pattern',
          valueProcessor: 'formatSystemPatternValue'
        },
        best_practices: {
          conportMethod: 'log_custom_data',
          category: 'BestPractices',
          valueProcessor: 'formatBestPracticeValue'
        }
      },
      referenceMapping: {
        internal_references: {
          conportMethod: 'link_conport_items',
          relationship: 'relates_to',
          valueProcessor: 'mapInternalReferenceToConport'
        },
        conport_references: {
          conportMethod: 'link_conport_items',
          relationship: 'references',
          valueProcessor: 'mapConportReferenceToConport'
        },
        code_references: {
          conportMethod: 'log_custom_data',
          category: 'CodeReferences',
          valueProcessor: 'formatCodeReferenceValue'
        }
      },
      documentationTracking: {
        conportMethod: 'log_custom_data',
        category: 'DocumentationCatalog',
        valueProcessor: 'formatDocumentationCatalogEntry'
      }
    };
  }
  
  /**
   * Classify a document based on content and metadata
   * @param {Object} document - The document to classify
   * @param {Object} context - Additional context
   * @returns {string} - The document type
   */
  classifyDocument(document, context = {}) {
    if (!document) {
      return 'unknown';
    }
    
    // If document type is explicitly provided, use it
    if (document.type && this.documentTypes[document.type]) {
      return document.type;
    }
    
    // If filename is provided, try to classify based on filename
    if (document.filename) {
      const filename = document.filename.toLowerCase();
      
      if (filename === 'readme.md') {
        return 'readme';
      }
      
      if (filename === 'changelog.md') {
        return 'changelog';
      }
      
      if (filename.includes('api') && filename.includes('reference')) {
        return 'api_reference';
      }
      
      if (filename.includes('guide') || filename.includes('manual')) {
        return 'user_guide';
      }
      
      if (filename.includes('design') || filename.includes('architecture')) {
        return 'design_doc';
      }
      
      if (filename.includes('tutorial') || filename.includes('how-to')) {
        return 'tutorial';
      }
      
      if (filename.includes('release') && filename.includes('notes')) {
        return 'release_notes';
      }
      
      if (filename.includes('troubleshoot') || filename.includes('faq')) {
        return 'troubleshooting';
      }
    }
    
    // Analyze content to determine type
    if (document.content) {
      const content = typeof document.content === 'string' ? document.content : JSON.stringify(document.content);
      
      // Count occurrences of section headers typical of each document type
      const typeCounts = {};
      
      Object.entries(this.documentTypes).forEach(([type, typeInfo]) => {
        let count = 0;
        
        typeInfo.sections.forEach(section => {
          // Look for section headers in various formats (markdown, html, etc.)
          const sectionRegex = new RegExp(`(## ${section}|<h2.*>${section}</h2>|\\* ${section}:)`, 'i');
          if (sectionRegex.test(content)) {
            count++;
          }
        });
        
        typeCounts[type] = count / typeInfo.sections.length; // Normalize to [0,1]
      });
      
      // Find the type with highest match ratio
      let bestType = 'unknown';
      let bestScore = 0;
      
      Object.entries(typeCounts).forEach(([type, score]) => {
        if (score > bestScore) {
          bestType = type;
          bestScore = score;
        }
      });
      
      if (bestScore > 0.3) { // Threshold for reasonable confidence
        return bestType;
      }
    }
    
    // Default to unknown if we can't classify
    return 'unknown';
  }
  
  /**
   * Get the appropriate template for a document type
   * @param {string} documentType - The document type
   * @returns {Object} - The template object
   */
  getDocumentTemplate(documentType) {
    return this.documentTemplates[documentType] || this.documentTemplates.user_guide;
  }
  
  /**
   * Extract knowledge from a document
   * @param {Object} document - The document to extract knowledge from
   * @param {Object} context - Additional context
   * @returns {Array} - Extracted knowledge items
   */
  extractKnowledge(document, context = {}) {
    if (!document || (!document.content && !document.sections)) {
      return [];
    }
    
    const extractedItems = [];
    const documentType = this.classifyDocument(document, context);
    const content = document.content || this._getSectionsContent(document.sections);
    
    // Apply extraction patterns
    Object.entries(this.knowledgeExtractionPatterns).forEach(([extractionType, extractionInfo]) => {
      const { pattern, processor, category } = extractionInfo;
      let match;
      
      // Reset the lastIndex to ensure we start from the beginning
      pattern.lastIndex = 0;
      
      while ((match = pattern.exec(content)) !== null) {
        if (this[processor]) {
          const extractedItem = this[processor](match, {
            documentType,
            category,
            document,
            context
          });
          
          if (extractedItem) {
            extractedItems.push({
              type: extractionType,
              category,
              data: extractedItem,
              confidence: this._calculateConfidence(extractedItem, extractionType, documentType)
            });
          }
        }
      }
    });
    
    return extractedItems;
  }
  
  /**
   * Extract references and links from a document
   * @param {Object} document - The document to extract references from
   * @param {Object} context - Additional context
   * @returns {Array} - Extracted references
   */
  extractReferences(document, context = {}) {
    if (!document || (!document.content && !document.sections)) {
      return [];
    }
    
    const extractedReferences = [];
    const documentType = this.classifyDocument(document, context);
    const content = document.content || this._getSectionsContent(document.sections);
    
    // Apply reference extraction patterns
    Object.entries(this.knowledgeLinkingStrategies).forEach(([referenceType, referenceInfo]) => {
      const { pattern, processor, linkType } = referenceInfo;
      let match;
      
      // Reset the lastIndex to ensure we start from the beginning
      pattern.lastIndex = 0;
      
      while ((match = pattern.exec(content)) !== null) {
        if (this[processor]) {
          const extractedReference = this[processor](match, {
            documentType,
            linkType,
            document,
            context
          });
          
          if (extractedReference) {
            extractedReferences.push({
              type: referenceType,
              linkType,
              data: extractedReference,
              confidence: this._calculateReferenceConfidence(extractedReference, referenceType, documentType)
            });
          }
        }
      }
    });
    
    return extractedReferences;
  }
  
  /**
   * Prepare ConPort operations for extracted knowledge
   * @param {Array} extractedItems - Extracted knowledge items
   * @param {Object} context - Additional context
   * @returns {Array} - ConPort operations
   */
  prepareKnowledgeOperations(extractedItems, context = {}) {
    if (!Array.isArray(extractedItems) || extractedItems.length === 0) {
      return [];
    }
    
    const operations = [];
    
    extractedItems.forEach(item => {
      const mappingInfo = this.conportIntegrationStrategies.extractionMapping[item.type];
      
      if (!mappingInfo) {
        return;
      }
      
      const { conportMethod, category, valueProcessor } = mappingInfo;
      
      if (this[valueProcessor]) {
        const value = this[valueProcessor](item.data, context);
        
        if (value) {
          switch (conportMethod) {
            case 'log_custom_data':
              operations.push({
                method: conportMethod,
                params: {
                  category: category,
                  key: this._generateKey(item.data, item.type),
                  value: value
                }
              });
              break;
              
            case 'log_decision':
              operations.push({
                method: conportMethod,
                params: value
              });
              break;
              
            case 'log_system_pattern':
              operations.push({
                method: conportMethod,
                params: value
              });
              break;
          }
        }
      }
    });
    
    return operations;
  }
  
  /**
   * Prepare ConPort operations for extracted references
   * @param {Array} extractedReferences - Extracted references
   * @param {Object} document - The source document
   * @param {Object} context - Additional context
   * @returns {Array} - ConPort operations
   */
  prepareReferenceOperations(extractedReferences, document, context = {}) {
    if (!Array.isArray(extractedReferences) || extractedReferences.length === 0) {
      return [];
    }
    
    const operations = [];
    const documentType = this.classifyDocument(document, context);
    
    // First, ensure the document itself is registered in the documentation catalog
    operations.push({
      method: 'log_custom_data',
      params: {
        category: 'DocumentationCatalog',
        key: this._generateDocumentKey(document),
        value: this.formatDocumentationCatalogEntry({
          document,
          documentType,
          context
        })
      }
    });
    
    // Process each reference
    extractedReferences.forEach(reference => {
      const mappingInfo = this.conportIntegrationStrategies.referenceMapping[reference.type];
      
      if (!mappingInfo) {
        return;
      }
      
      const { conportMethod, relationship, valueProcessor } = mappingInfo;
      
      if (this[valueProcessor]) {
        const value = this[valueProcessor](reference.data, {
          document,
          documentType,
          context
        });
        
        if (value) {
          switch (conportMethod) {
            case 'link_conport_items':
              operations.push({
                method: conportMethod,
                params: {
                  source_item_type: 'custom_data',
                  source_item_id: `DocumentationCatalog:${this._generateDocumentKey(document)}`,
                  target_item_type: value.target_item_type,
                  target_item_id: value.target_item_id,
                  relationship_type: relationship || 'references',
                  description: value.description || `Reference from ${document.filename || 'document'}`
                }
              });
              break;
              
            case 'log_custom_data':
              operations.push({
                method: conportMethod,
                params: {
                  category: mappingInfo.category,
                  key: this._generateReferenceKey(reference.data, reference.type),
                  value: value
                }
              });
              break;
          }
        }
      }
    });
    
    return operations;
  }
  
  // Knowledge extraction processor methods
  
  /**
   * Extract a glossary term
   * @param {Array} match - Regex match
   * @param {Object} options - Additional options
   * @returns {Object} - Extracted glossary term
   */
  extractGlossaryTerm(match, options) {
    if (!match || match.length < 3) {
      return null;
    }
    
    return {
      term: match[1].trim(),
      definition: match[2].trim(),
      source: options.document.filename || 'Unknown source',
      documentType: options.documentType
    };
  }
  
  /**
   * Extract a design decision
   * @param {Array} match - Regex match
   * @param {Object} options - Additional options
   * @returns {Object} - Extracted design decision
   */
  extractDesignDecision(match, options) {
    if (!match || match.length < 2) {
      return null;
    }
    
    return {
      summary: match[1].trim(),
      rationale: match.length > 2 ? (match[2] || '').trim() : '',
      alternatives: match.length > 3 ? (match[3] || '').trim() : '',
      source: options.document.filename || 'Unknown source',
      documentType: options.documentType
    };
  }
  
  /**
   * Extract a constraint
   * @param {Array} match - Regex match
   * @param {Object} options - Additional options
   * @returns {Object} - Extracted constraint
   */
  extractConstraint(match, options) {
    if (!match || match.length < 2) {
      return null;
    }
    
    return {
      constraint: match[1].trim(),
      source: options.document.filename || 'Unknown source',
      documentType: options.documentType
    };
  }
  
  /**
   * Extract a code pattern
   * @param {Array} match - Regex match
   * @param {Object} options - Additional options
   * @returns {Object} - Extracted code pattern
   */
  extractCodePattern(match, options) {
    if (!match || match.length < 2) {
      return null;
    }
    
    const pattern = match[1].trim();
    let code = '';
    
    // Extract code block if present
    if (match[0].includes('```')) {
      const codeMatch = match[0].match(/```(?:.*?)\n([\s\S]*?)```/);
      if (codeMatch && codeMatch.length > 1) {
        code = codeMatch[1].trim();
      }
    }
    
    return {
      name: pattern.split(':')[0] || pattern.substring(0, Math.min(pattern.length, 30)),
      description: pattern,
      code: code,
      source: options.document.filename || 'Unknown source',
      documentType: options.documentType
    };
  }
  
  /**
   * Extract a best practice
   * @param {Array} match - Regex match
   * @param {Object} options - Additional options
   * @returns {Object} - Extracted best practice
   */
  extractBestPractice(match, options) {
    if (!match || match.length < 2) {
      return null;
    }
    
    return {
      practice: match[1].trim(),
      source: options.document.filename || 'Unknown source',
      documentType: options.documentType
    };
  }
  
  // Reference processor methods
  
  /**
   * Process an internal reference
   * @param {Array} match - Regex match
   * @param {Object} options - Additional options
   * @returns {Object} - Processed internal reference
   */
  processInternalReference(match, options) {
    if (!match || match.length < 3) {
      return null;
    }
    
    return {
      text: match[1].trim(),
      target: match[2].trim(),
      source: options.document.filename || 'Unknown source',
      documentType: options.documentType
    };
  }
  
  /**
   * Process a ConPort reference
   * @param {Array} match - Regex match
   * @param {Object} options - Additional options
   * @returns {Object} - Processed ConPort reference
   */
  processConportReference(match, options) {
    if (!match || match.length < 3) {
      return null;
    }
    
    return {
      itemType: match[1].trim(),
      itemId: match[2].trim(),
      source: options.document.filename || 'Unknown source',
      documentType: options.documentType
    };
  }
  
  /**
   * Process a code reference
   * @param {Array} match - Regex match
   * @param {Object} options - Additional options
   * @returns {Object} - Processed code reference
   */
  processCodeReference(match, options) {
    if (!match || match.length < 3) {
      return null;
    }
    
    return {
      text: match[1].trim(),
      path: match[2].trim(),
      source: options.document.filename || 'Unknown source',
      documentType: options.documentType
    };
  }
  
  /**
   * Process a "see also" reference
   * @param {Array} match - Regex match
   * @param {Object} options - Additional options
   * @returns {Object} - Processed see also reference
   */
  processSeeAlsoReference(match, options) {
    if (!match || match.length < 2) {
      return null;
    }
    
    return {
      references: match[1].split(',').map(ref => ref.trim()),
      source: options.document.filename || 'Unknown source',
      documentType: options.documentType
    };
  }
  
  // Value processor methods for ConPort operations
  
  /**
   * Format a glossary term value for ConPort
   * @param {Object} data - Extracted data
   * @param {Object} context - Additional context
   * @returns {Object} - Formatted value
   */
  formatGlossaryValue(data, context = {}) {
    return {
      term: data.term,
      definition: data.definition,
      sources: [data.source],
      dateAdded: new Date().toISOString(),
      metadata: {
        documentType: data.documentType
      }
    };
  }
  
  /**
   * Format a decision value for ConPort
   * @param {Object} data - Extracted data
   * @param {Object} context - Additional context
   * @returns {Object} - Formatted value
   */
  formatDecisionValue(data, context = {}) {
    return {
      summary: data.summary,
      rationale: data.rationale,
      implementation_details: data.alternatives ? `Alternatives considered: ${data.alternatives}` : undefined,
      tags: ['documentation', `doc_type_${data.documentType}`]
    };
  }
  
  /**
   * Format a constraint value for ConPort
   * @param {Object} data - Extracted data
   * @param {Object} context - Additional context
   * @returns {Object} - Formatted value
   */
  formatConstraintValue(data, context = {}) {
    return {
      constraint: data.constraint,
      sources: [data.source],
      dateAdded: new Date().toISOString(),
      metadata: {
        documentType: data.documentType
      }
    };
  }
  
  /**
   * Format a system pattern value for ConPort
   * @param {Object} data - Extracted data
   * @param {Object} context - Additional context
   * @returns {Object} - Formatted value
   */
  formatSystemPatternValue(data, context = {}) {
    return {
      name: data.name,
      description: `${data.description}${data.code ? '\n\n```\n' + data.code + '\n```' : ''}`,
      tags: ['documentation', `doc_type_${data.documentType}`]
    };
  }
  
  /**
   * Format a best practice value for ConPort
   * @param {Object} data - Extracted data
   * @param {Object} context - Additional context
   * @returns {Object} - Formatted value
   */
  formatBestPracticeValue(data, context = {}) {
    return {
      practice: data.practice,
      sources: [data.source],
      dateAdded: new Date().toISOString(),
      metadata: {
        documentType: data.documentType
      }
    };
  }
  
  /**
   * Map an internal reference to ConPort
   * @param {Object} data - Reference data
   * @param {Object} options - Additional options
   * @returns {Object} - Mapped reference
   */
  mapInternalReferenceToConport(data, options) {
    // Internal references typically don't map directly to ConPort items
    // unless we have a special mapping table. This is a basic implementation.
    return {
      target_item_type: 'custom_data',
      target_item_id: `DocumentationCatalog:${data.target}`,
      description: `Internal reference to ${data.text} (${data.target})`
    };
  }
  
  /**
   * Map a ConPort reference to ConPort
   * @param {Object} data - Reference data
   * @param {Object} options - Additional options
   * @returns {Object} - Mapped reference
   */
  mapConportReferenceToConport(data, options) {
    // ConPort references map directly to ConPort items
    return {
      target_item_type: data.itemType,
      target_item_id: data.itemId,
      description: `Explicit ConPort reference to ${data.itemType}:${data.itemId}`
    };
  }
  
  /**
   * Format a code reference value for ConPort
   * @param {Object} data - Reference data
   * @param {Object} options - Additional options
   * @returns {Object} - Formatted value
   */
  formatCodeReferenceValue(data, options) {
    return {
      text: data.text,
      path: data.path,
      source: data.source,
      documentType: data.documentType,
      dateAdded: new Date().toISOString()
    };
  }
  
  /**
   * Format a documentation catalog entry for ConPort
   * @param {Object} data - Document data
   * @returns {Object} - Formatted catalog entry
   */
  formatDocumentationCatalogEntry(data) {
    const { document, documentType, context } = data;
    
    return {
      filename: document.filename || 'Unknown document',
      type: documentType,
      title: document.title || this._extractTitle(document) || document.filename || 'Untitled Document',
      sections: document.sections ? Object.keys(document.sections) : [],
      lastUpdated: document.lastUpdated || new Date().toISOString(),
      metadata: {
        ...document.metadata,
        extractedAt: new Date().toISOString()
      }
    };
  }
  
  // Helper methods
  
  /**
   * Generate a key for ConPort custom data
   * @param {Object} data - The data object
   * @param {string} type - The extraction type
   * @returns {string} - Generated key
   * @private
   */
  _generateKey(data, type) {
    switch (type) {
      case 'glossary_terms':
        return `term_${this._normalizeForKey(data.term)}`;
        
      case 'constraints':
        return `constraint_${this._generateHashKey(data.constraint)}`;
        
      case 'best_practices':
        return `practice_${this._generateHashKey(data.practice)}`;
        
      default:
        return `${type}_${this._generateHashKey(JSON.stringify(data))}`;
    }
  }
  
  /**
   * Generate a reference key for ConPort custom data
   * @param {Object} data - The reference data
   * @param {string} type - The reference type
   * @returns {string} - Generated key
   * @private
   */
  _generateReferenceKey(data, type) {
    switch (type) {
      case 'code_references':
        return `code_ref_${this._normalizeForKey(data.path)}`;
        
      default:
        return `${type}_${this._generateHashKey(JSON.stringify(data))}`;
    }
  }
  
  /**
   * Generate a document key for ConPort custom data
   * @param {Object} document - The document
   * @returns {string} - Generated key
   * @private
   */
  _generateDocumentKey(document) {
    if (document.filename) {
      return this._normalizeForKey(document.filename);
    }
    
    if (document.title) {
      return this._normalizeForKey(document.title);
    }
    
    return `doc_${this._generateHashKey(JSON.stringify(document))}`;
  }
  
  /**
   * Normalize a string for use as a key
   * @param {string} input - Input string
   * @returns {string} - Normalized string
   * @private
   */
  _normalizeForKey(input) {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 50);
  }
  
  /**
   * Generate a hash-based key
   * @param {string} input - Input string
   * @returns {string} - Hash key
   * @private
   */
  _generateHashKey(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }
  
  /**
   * Get concatenated content from document sections
   * @param {Object} sections - Document sections
   * @returns {string} - Concatenated content
   * @private
   */
  _getSectionsContent(sections) {
    if (!sections || typeof sections !== 'object') {
      return '';
    }
    
    return Object.entries(sections)
      .map(([sectionName, sectionContent]) => {
        return `## ${sectionName}\n\n${sectionContent}\n\n`;
      })
      .join('');
  }
  
  /**
   * Extract title from document
   * @param {Object} document - The document
   * @returns {string} - Extracted title
   * @private
   */
  _extractTitle(document) {
    if (!document) {
      return '';
    }
    
    if (document.content) {
      // Look for # Title or # Header
      const titleMatch = document.content.match(/^#\s+(.+)$/m);
      if (titleMatch && titleMatch.length > 1) {
        return titleMatch[1].trim();
      }
    }
    
    return '';
  }
  
  /**
   * Calculate confidence for extracted knowledge
   * @param {Object} extractedItem - The extracted item
   * @param {string} extractionType - The extraction type
   * @param {string} documentType - The document type
   * @returns {number} - Confidence score
   * @private
   */
  _calculateConfidence(extractedItem, extractionType, documentType) {
    // Base confidence starts at 0.7
    let confidence = 0.7;
    
    // Adjust based on document type knowledge density
    const docTypeInfo = this.documentTypes[documentType] || { knowledgeDensity: 0.5 };
    confidence += (docTypeInfo.knowledgeDensity - 0.5) * 0.2; // ±0.1 based on knowledge density
    
    // Adjust based on extraction type
    switch (extractionType) {
      case 'glossary_terms':
        // Glossary terms with longer definitions are more reliable
        if (extractedItem.definition && extractedItem.definition.length > 50) {
          confidence += 0.1;
        }
        break;
        
      case 'design_decisions':
        // Decisions with rationale and alternatives are more reliable
        if (extractedItem.rationale && extractedItem.rationale.length > 0) {
          confidence += 0.1;
        }
        if (extractedItem.alternatives && extractedItem.alternatives.length > 0) {
          confidence += 0.05;
        }
        break;
        
      case 'code_patterns':
        // Patterns with code examples are more reliable
        if (extractedItem.code && extractedItem.code.length > 0) {
          confidence += 0.15;
        }
        break;
    }
    
    // Ensure confidence is between 0 and 1
    return Math.max(0, Math.min(1, confidence));
  }
  
  /**
   * Calculate confidence for extracted references
   * @param {Object} reference - The extracted reference
   * @param {string} referenceType - The reference type
   * @param {string} documentType - The document type
   * @returns {number} - Confidence score
   * @private
   */
  _calculateReferenceConfidence(reference, referenceType, documentType) {
    // Base confidence starts at 0.7
    let confidence = 0.7;
    
    // Adjust based on reference type
    switch (referenceType) {
      case 'conport_references':
        // ConPort references are explicit and highly reliable
        confidence += 0.2;
        break;
        
      case 'code_references':
        // Code references are fairly reliable
        confidence += 0.1;
        break;
        
      case 'internal_references':
        // Internal references depend on document organization
        confidence += 0.05;
        break;
        
      case 'see_also_references':
        // See also references are less structured
        confidence -= 0.1;
        break;
    }
    
    // Ensure confidence is between 0 and 1
    return Math.max(0, Math.min(1, confidence));
  }
}

module.exports = { DocsKnowledgeFirstGuidelines };