/**
 * Docs Mode Enhancement
 * 
 * Integration module for Docs Mode enhancements, combining validation
 * checkpoints with knowledge-first guidelines and ConPort integration.
 * This module enhances documentation-focused modes with systematic
 * knowledge preservation capabilities.
 */

const { ConportValidationManager } = require('../conport-validation-manager');
const { DocsValidationCheckpoints } = require('./docs-validation-checkpoints');
const { DocsKnowledgeFirstGuidelines } = require('./docs-knowledge-first');

/**
 * Docs Mode Enhancement class
 * 
 * Integrates specialized validation checkpoints and knowledge-first guidelines
 * for documentation creation, maintenance, and systematic knowledge management.
 */
class DocsModeEnhancement {
  /**
   * Constructor for DocsModeEnhancement
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.mode = options.mode || 'docs';
    this.description = options.description || 'Enhancement for documentation creation, maintenance, and knowledge preservation';
    this.validationManager = options.validationManager || new ConportValidationManager({
      mode: this.mode,
      checkpoints: options.checkpoints || new DocsValidationCheckpoints().getCheckpoints()
    });
    this.knowledgeGuidelines = options.knowledgeGuidelines || new DocsKnowledgeFirstGuidelines();
    this.onValidationComplete = options.onValidationComplete || this.defaultValidationCompleteHandler;
    this.onKnowledgeExtracted = options.onKnowledgeExtracted || this.defaultKnowledgeExtractedHandler;
    
    // Documentation knowledge types that can be extracted and preserved
    this.knowledgeTypes = {
      glossary_terms: {
        priority: 'high',
        description: 'Domain-specific terminology and definitions',
        conportCategory: 'ProjectGlossary'
      },
      design_decisions: {
        priority: 'high',
        description: 'Architectural and implementation decisions documented in design docs',
        conportCategory: 'Decisions'
      },
      constraints: {
        priority: 'medium',
        description: 'System constraints and limitations documented in technical specs',
        conportCategory: 'Constraints'
      },
      code_patterns: {
        priority: 'high',
        description: 'Reusable implementation patterns extracted from documentation',
        conportCategory: 'SystemPatterns'
      },
      best_practices: {
        priority: 'medium',
        description: 'Recommended approaches and practices documented in guides',
        conportCategory: 'BestPractices'
      },
      tutorial_steps: {
        priority: 'medium',
        description: 'Step-by-step procedures extracted from tutorials',
        conportCategory: 'TutorialSteps'
      },
      api_parameters: {
        priority: 'high',
        description: 'API parameters, return values, and examples from API docs',
        conportCategory: 'ApiReferences'
      },
      troubleshooting_guides: {
        priority: 'medium',
        description: 'Common issues and solutions from troubleshooting docs',
        conportCategory: 'TroubleshootingGuides'
      }
    };
    
    // Documentation types handled by this enhancement
    this.documentationTypes = {
      api_reference: {
        priority: 'high',
        validator: 'validateApiReference',
        knowledgeExtractor: 'extractApiReferenceKnowledge'
      },
      user_guide: {
        priority: 'high',
        validator: 'validateUserGuide',
        knowledgeExtractor: 'extractUserGuideKnowledge'
      },
      design_doc: {
        priority: 'high',
        validator: 'validateDesignDoc',
        knowledgeExtractor: 'extractDesignDocKnowledge'
      },
      tutorial: {
        priority: 'medium',
        validator: 'validateTutorial',
        knowledgeExtractor: 'extractTutorialKnowledge'
      },
      release_notes: {
        priority: 'medium',
        validator: 'validateReleaseNotes',
        knowledgeExtractor: 'extractReleaseNotesKnowledge'
      },
      readme: {
        priority: 'high',
        validator: 'validateReadme',
        knowledgeExtractor: 'extractReadmeKnowledge'
      },
      changelog: {
        priority: 'medium',
        validator: 'validateChangelog',
        knowledgeExtractor: 'extractChangelogKnowledge'
      },
      troubleshooting: {
        priority: 'medium',
        validator: 'validateTroubleshooting',
        knowledgeExtractor: 'extractTroubleshootingKnowledge'
      }
    };
    
    // Initialize the enhancement
    this.initialize(options);
  }
  
  /**
   * Initialize the Docs Mode Enhancement
   * @param {Object} options - Initialization options
   */
  initialize(options = {}) {
    // Register validators for different documentation types
    Object.entries(this.documentationTypes).forEach(([docType, docTypeInfo]) => {
      if (this[docTypeInfo.validator]) {
        this.validationManager.registerCustomValidator(
          `${docType}_validator`,
          this[docTypeInfo.validator].bind(this)
        );
      }
    });
    
    // Set up ConPort integration
    this.setupConportIntegration(options.conportOptions);
    
    // Log initialization to ConPort if enabled
    if (options.logInitialization !== false) {
      this.logEnhancementInitialization();
    }
  }
  
  /**
   * Set up ConPort integration
   * @param {Object} options - ConPort integration options
   */
  setupConportIntegration(options = {}) {
    this.conportEnabled = options?.enabled !== false;
    this.conportOptions = {
      autoExtract: options?.autoExtract !== false,
      autoLog: options?.autoLog !== false,
      workspace: options?.workspace || process.env.WORKSPACE_PATH || process.cwd(),
      ...options
    };
    
    // Setup knowledge extraction patterns
    this.knowledgeExtractionPatterns = this.knowledgeGuidelines.knowledgeExtractionPatterns;
  }
  
  /**
   * Log enhancement initialization to ConPort
   */
  logEnhancementInitialization() {
    if (!this.conportEnabled) {
      return;
    }
    
    // Example ConPort operation to log the enhancement initialization
    const initializationLog = {
      method: 'log_custom_data',
      params: {
        category: 'ModeEnhancements',
        key: `docs_mode_enhancement_initialization_${Date.now()}`,
        value: {
          mode: this.mode,
          description: this.description,
          timestamp: new Date().toISOString(),
          knowledgeTypes: Object.keys(this.knowledgeTypes),
          documentationTypes: Object.keys(this.documentationTypes)
        }
      }
    };
    
    // This would be executed by an actual ConPort client
    this.executeConportOperation(initializationLog);
    
    // Log a decision about using this enhancement
    const enhancementDecision = {
      method: 'log_decision',
      params: {
        summary: `Activated Docs Mode Enhancement with ConPort Integration`,
        rationale: `The Docs Mode Enhancement provides specialized validation checkpoints and knowledge extraction capabilities for documentation creation and maintenance. This enhancement follows the "Mode-Specific Knowledge-First Enhancement Pattern" established for mode enhancements.`,
        tags: ['mode_enhancement', 'docs_mode', 'knowledge_first']
      }
    };
    
    // This would be executed by an actual ConPort client
    this.executeConportOperation(enhancementDecision);
  }
  
  /**
   * Validate a document
   * @param {Object} document - The document to validate
   * @param {Object} context - Additional context
   * @returns {Object} - Validation results
   */
  validate(document, context = {}) {
    if (!document) {
      return {
        valid: false,
        errors: ['No document provided for validation']
      };
    }
    
    // Determine document type if not provided
    const documentType = document.type || this.knowledgeGuidelines.classifyDocument(document, context);
    
    // Get validation function for this document type
    const docTypeInfo = this.documentationTypes[documentType];
    let validationFunction = null;
    
    if (docTypeInfo && docTypeInfo.validator && this[docTypeInfo.validator]) {
      validationFunction = this[docTypeInfo.validator].bind(this);
    } else {
      // Use general validation if no specific validator found
      validationFunction = this.validateGenericDocument.bind(this);
    }
    
    // Run validation
    const validationResults = validationFunction(document, {
      ...context,
      documentType
    });
    
    // Auto-extract knowledge if enabled
    if (this.conportEnabled && this.conportOptions.autoExtract) {
      this.extractDocumentKnowledge(document, {
        ...context,
        documentType,
        validationResults
      });
    }
    
    // Call completion handler
    this.onValidationComplete(validationResults, document, {
      ...context,
      documentType
    });
    
    return validationResults;
  }
  
  /**
   * Extract knowledge from a document
   * @param {Object} document - The document to extract knowledge from
   * @param {Object} context - Additional context
   * @returns {Array} - Extracted knowledge items
   */
  extractDocumentKnowledge(document, context = {}) {
    if (!document) {
      return [];
    }
    
    // Determine document type if not provided
    const documentType = context.documentType || document.type || 
                          this.knowledgeGuidelines.classifyDocument(document, context);
    
    // Get extraction function for this document type
    const docTypeInfo = this.documentationTypes[documentType];
    let extractionFunction = null;
    
    if (docTypeInfo && docTypeInfo.knowledgeExtractor && this[docTypeInfo.knowledgeExtractor]) {
      extractionFunction = this[docTypeInfo.knowledgeExtractor].bind(this);
    } else {
      // Use general extraction if no specific extractor found
      extractionFunction = this.extractGenericDocumentKnowledge.bind(this);
    }
    
    // Run extraction
    const extractedKnowledge = extractionFunction(document, {
      ...context,
      documentType
    });
    
    // Extract references
    const extractedReferences = this.knowledgeGuidelines.extractReferences(document, context);
    
    // Prepare ConPort operations
    let conportOperations = [];
    
    if (extractedKnowledge.length > 0) {
      conportOperations = conportOperations.concat(
        this.knowledgeGuidelines.prepareKnowledgeOperations(extractedKnowledge, context)
      );
    }
    
    if (extractedReferences.length > 0) {
      conportOperations = conportOperations.concat(
        this.knowledgeGuidelines.prepareReferenceOperations(extractedReferences, document, context)
      );
    }
    
    // Auto-log to ConPort if enabled
    if (this.conportEnabled && this.conportOptions.autoLog && conportOperations.length > 0) {
      conportOperations.forEach(operation => {
        this.executeConportOperation(operation);
      });
    }
    
    // Call knowledge extracted handler
    this.onKnowledgeExtracted({
      extractedKnowledge,
      extractedReferences,
      conportOperations
    }, document, {
      ...context,
      documentType
    });
    
    return {
      extractedKnowledge,
      extractedReferences,
      conportOperations
    };
  }
  
  /**
   * Get the knowledge guidelines
   * @returns {Object} - Knowledge guidelines
   */
  getKnowledgeGuidelines() {
    return this.knowledgeGuidelines;
  }
  
  /**
   * Get the validation manager
   * @returns {Object} - Validation manager
   */
  getValidationManager() {
    return this.validationManager;
  }
  
  /**
   * Get knowledge types
   * @returns {Object} - Knowledge types
   */
  getKnowledgeTypes() {
    return this.knowledgeTypes;
  }
  
  /**
   * Get documentation types
   * @returns {Object} - Documentation types
   */
  getDocumentationTypes() {
    return this.documentationTypes;
  }
  
  /**
   * Execute a ConPort operation
   * @param {Object} operation - The operation to execute
   * @returns {Object} - Operation result
   */
  executeConportOperation(operation) {
    // This is a placeholder for actual ConPort client implementation
    console.log(`[DocsModeEnhancement] ConPort operation: ${operation.method}`, operation.params);
    
    // In a real implementation, this would call the ConPort client
    return {
      success: true,
      operation
    };
  }
  
  // Validation handlers for different documentation types
  
  /**
   * Validate a generic document
   * @param {Object} document - The document to validate
   * @param {Object} context - Additional context
   * @returns {Object} - Validation results
   */
  validateGenericDocument(document, context = {}) {
    // Run general validation through validation manager
    return this.validationManager.validate(document, context);
  }
  
  /**
   * Validate an API reference document
   * @param {Object} document - The document to validate
   * @param {Object} context - Additional context
   * @returns {Object} - Validation results
   */
  validateApiReference(document, context = {}) {
    // Perform API reference-specific validation
    const customValidations = [
      // Ensure each API method has parameters, returns, and at least one example
      {
        name: 'api_method_completeness',
        validate: (doc) => {
          const errors = [];
          const content = doc.content || '';
          
          // Find API method definitions
          const methodSections = content.match(/##\s+[a-zA-Z0-9_]+\(.+?\)/g) || [];
          
          methodSections.forEach(methodHeader => {
            const methodName = methodHeader.match(/##\s+([a-zA-Z0-9_]+)/)[1];
            
            // Check if method has parameters section
            if (!content.includes(`### Parameters`) && !content.includes(`#### Parameters`)) {
              errors.push(`Method ${methodName} is missing Parameters section`);
            }
            
            // Check if method has returns section
            if (!content.includes(`### Returns`) && !content.includes(`#### Returns`)) {
              errors.push(`Method ${methodName} is missing Returns section`);
            }
            
            // Check if method has examples
            if (!content.includes(`### Examples`) && !content.includes(`#### Examples`)) {
              errors.push(`Method ${methodName} is missing Examples section`);
            }
          });
          
          return {
            valid: errors.length === 0,
            errors
          };
        }
      }
    ];
    
    // Run custom validations
    const customResults = customValidations.map(validation => {
      return {
        name: validation.name,
        ...validation.validate(document, context)
      };
    });
    
    // Run standard validations
    const standardResults = this.validationManager.validate(document, context);
    
    // Combine results
    const allErrors = [
      ...standardResults.errors,
      ...customResults.filter(r => !r.valid).flatMap(r => r.errors)
    ];
    
    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      details: {
        standard: standardResults,
        custom: customResults
      }
    };
  }
  
  /**
   * Validate a user guide document
   * @param {Object} document - The document to validate
   * @param {Object} context - Additional context
   * @returns {Object} - Validation results
   */
  validateUserGuide(document, context = {}) {
    // Perform user guide-specific validation
    const customValidations = [
      // Ensure user guide has introduction and getting started sections
      {
        name: 'user_guide_essential_sections',
        validate: (doc) => {
          const errors = [];
          const content = doc.content || '';
          
          if (!content.includes('## Introduction') && !content.includes('# Introduction')) {
            errors.push('User guide is missing Introduction section');
          }
          
          if (!content.includes('## Getting Started') && !content.includes('# Getting Started')) {
            errors.push('User guide is missing Getting Started section');
          }
          
          return {
            valid: errors.length === 0,
            errors
          };
        }
      }
    ];
    
    // Run custom validations
    const customResults = customValidations.map(validation => {
      return {
        name: validation.name,
        ...validation.validate(document, context)
      };
    });
    
    // Run standard validations
    const standardResults = this.validationManager.validate(document, context);
    
    // Combine results
    const allErrors = [
      ...standardResults.errors,
      ...customResults.filter(r => !r.valid).flatMap(r => r.errors)
    ];
    
    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      details: {
        standard: standardResults,
        custom: customResults
      }
    };
  }
  
  /**
   * Validate a design document
   * @param {Object} document - The document to validate
   * @param {Object} context - Additional context
   * @returns {Object} - Validation results
   */
  validateDesignDoc(document, context = {}) {
    // Perform design doc-specific validation
    const customValidations = [
      // Ensure design doc has goals, architecture, and trade-offs sections
      {
        name: 'design_doc_essential_sections',
        validate: (doc) => {
          const errors = [];
          const content = doc.content || '';
          
          if (!content.includes('## Goals') && !content.includes('# Goals') && 
              !content.includes('## Goals and Non-Goals') && !content.includes('# Goals and Non-Goals')) {
            errors.push('Design document is missing Goals section');
          }
          
          if (!content.includes('## Architecture') && !content.includes('# Architecture')) {
            errors.push('Design document is missing Architecture section');
          }
          
          if (!content.includes('## Trade-offs') && !content.includes('# Trade-offs') &&
              !content.includes('## Trade offs') && !content.includes('# Trade offs')) {
            errors.push('Design document is missing Trade-offs section');
          }
          
          return {
            valid: errors.length === 0,
            errors
          };
        }
      }
    ];
    
    // Run custom validations
    const customResults = customValidations.map(validation => {
      return {
        name: validation.name,
        ...validation.validate(document, context)
      };
    });
    
    // Run standard validations
    const standardResults = this.validationManager.validate(document, context);
    
    // Combine results
    const allErrors = [
      ...standardResults.errors,
      ...customResults.filter(r => !r.valid).flatMap(r => r.errors)
    ];
    
    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      details: {
        standard: standardResults,
        custom: customResults
      }
    };
  }
  
  // Knowledge extraction handlers for different documentation types
  
  /**
   * Extract knowledge from a generic document
   * @param {Object} document - The document to extract knowledge from
   * @param {Object} context - Additional context
   * @returns {Array} - Extracted knowledge items
   */
  extractGenericDocumentKnowledge(document, context = {}) {
    // Use knowledge guidelines to extract knowledge
    return this.knowledgeGuidelines.extractKnowledge(document, context);
  }
  
  /**
   * Extract knowledge from an API reference document
   * @param {Object} document - The document to extract knowledge from
   * @param {Object} context - Additional context
   * @returns {Array} - Extracted knowledge items
   */
  extractApiReferenceKnowledge(document, context = {}) {
    // Extract generic knowledge
    const genericKnowledge = this.knowledgeGuidelines.extractKnowledge(document, context);
    
    // Extract API-specific knowledge
    const apiSpecificKnowledge = this.extractApiSpecificKnowledge(document, context);
    
    return [...genericKnowledge, ...apiSpecificKnowledge];
  }
  
  /**
   * Extract API-specific knowledge
   * @param {Object} document - The document to extract knowledge from
   * @param {Object} context - Additional context
   * @returns {Array} - Extracted API-specific knowledge items
   */
  extractApiSpecificKnowledge(document, context = {}) {
    if (!document || !document.content) {
      return [];
    }
    
    const extractedItems = [];
    const content = document.content;
    
    // Extract API methods
    const methodSections = content.split(/##\s+[a-zA-Z0-9_]+\(.+?\)/g).slice(1);
    const methodHeaders = content.match(/##\s+[a-zA-Z0-9_]+\(.+?\)/g) || [];
    
    methodHeaders.forEach((header, index) => {
      if (index < methodSections.length) {
        const methodName = header.match(/##\s+([a-zA-Z0-9_]+)/)[1];
        const methodSignature = header.match(/##\s+([a-zA-Z0-9_]+\(.+?\))/)[1];
        const methodContent = methodSections[index];
        
        // Extract parameters
        let parameters = [];
        const paramsMatch = methodContent.match(/(?:###|####)\s+Parameters([\s\S]*?)(?=###|####|$)/);
        if (paramsMatch) {
          const paramsContent = paramsMatch[1];
          const paramEntries = paramsContent.match(/[-*]\s+`([^`]+)`\s*[-–:]\s*([^.\n]+)/g) || [];
          
          paramEntries.forEach(entry => {
            const [, paramName, description] = entry.match(/[-*]\s+`([^`]+)`\s*[-–:]\s*([^.\n]+)/) || [];
            if (paramName) {
              parameters.push({
                name: paramName,
                description: description.trim()
              });
            }
          });
        }
        
        // Extract return value
        let returnValue = '';
        const returnMatch = methodContent.match(/(?:###|####)\s+Returns([\s\S]*?)(?=###|####|$)/);
        if (returnMatch) {
          returnValue = returnMatch[1].trim();
        }
        
        // Extract examples
        let examples = [];
        const examplesMatch = methodContent.match(/(?:###|####)\s+Examples([\s\S]*?)(?=###|####|$)/);
        if (examplesMatch) {
          const examplesContent = examplesMatch[1];
          const codeBlocks = examplesContent.match(/```(?:[a-z]*)\n([\s\S]*?)```/g) || [];
          
          codeBlocks.forEach(block => {
            const codeMatch = block.match(/```(?:[a-z]*)\n([\s\S]*?)```/);
            if (codeMatch) {
              examples.push(codeMatch[1].trim());
            }
          });
        }
        
        extractedItems.push({
          type: 'api_parameters',
          category: 'ApiReferences',
          data: {
            method: methodName,
            signature: methodSignature,
            parameters,
            returnValue,
            examples,
            source: document.filename || 'Unknown source'
          },
          confidence: 0.9
        });
      }
    });
    
    return extractedItems;
  }
  
  /**
   * Extract knowledge from a design document
   * @param {Object} document - The document to extract knowledge from
   * @param {Object} context - Additional context
   * @returns {Array} - Extracted knowledge items
   */
  extractDesignDocKnowledge(document, context = {}) {
    // Extract generic knowledge
    const genericKnowledge = this.knowledgeGuidelines.extractKnowledge(document, context);
    
    // Extract design-specific knowledge
    const designSpecificKnowledge = this.extractDesignSpecificKnowledge(document, context);
    
    return [...genericKnowledge, ...designSpecificKnowledge];
  }
  
  /**
   * Extract design-specific knowledge
   * @param {Object} document - The document to extract knowledge from
   * @param {Object} context - Additional context
   * @returns {Array} - Extracted design-specific knowledge items
   */
  extractDesignSpecificKnowledge(document, context = {}) {
    if (!document || !document.content) {
      return [];
    }
    
    const extractedItems = [];
    const content = document.content;
    
    // Extract architectural decisions from decision log section
    const decisionLogMatch = content.match(/(?:##|#)\s+Decision Log([\s\S]*?)(?=##|#|$)/);
    if (decisionLogMatch) {
      const decisionLogContent = decisionLogMatch[1];
      const decisions = decisionLogContent.split(/(?:###|####)\s+/).slice(1);
      
      decisions.forEach(decision => {
        const lines = decision.split('\n');
        const title = lines[0].trim();
        let summary = '';
        let rationale = '';
        let alternatives = '';
        
        let currentSection = 'summary';
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          
          if (line.startsWith('Rationale:') || line === 'Rationale') {
            currentSection = 'rationale';
            continue;
          } else if (line.startsWith('Alternatives:') || line === 'Alternatives') {
            currentSection = 'alternatives';
            continue;
          }
          
          if (line) {
            switch (currentSection) {
              case 'summary':
                summary += line + ' ';
                break;
              case 'rationale':
                rationale += line + ' ';
                break;
              case 'alternatives':
                alternatives += line + ' ';
                break;
            }
          }
        }
        
        extractedItems.push({
          type: 'design_decisions',
          category: 'Decisions',
          data: {
            summary: title + (summary ? ': ' + summary.trim() : ''),
            rationale: rationale.trim(),
            alternatives: alternatives.trim(),
            source: document.filename || 'Unknown source'
          },
          confidence: 0.85
        });
      });
    }
    
    return extractedItems;
  }
  
  /**
   * Extract knowledge from a troubleshooting document
   * @param {Object} document - The document to extract knowledge from
   * @param {Object} context - Additional context
   * @returns {Array} - Extracted knowledge items
   */
  extractTroubleshootingKnowledge(document, context = {}) {
    // Extract generic knowledge
    const genericKnowledge = this.knowledgeGuidelines.extractKnowledge(document, context);
    
    // Extract troubleshooting-specific knowledge
    const troubleshootingSpecificKnowledge = this.extractTroubleshootingSpecificKnowledge(document, context);
    
    return [...genericKnowledge, ...troubleshootingSpecificKnowledge];
  }
  
  /**
   * Extract troubleshooting-specific knowledge
   * @param {Object} document - The document to extract knowledge from
   * @param {Object} context - Additional context
   * @returns {Array} - Extracted troubleshooting-specific knowledge items
   */
  extractTroubleshootingSpecificKnowledge(document, context = {}) {
    if (!document || !document.content) {
      return [];
    }
    
    const extractedItems = [];
    const content = document.content;
    
    // Extract issues and solutions
    const issueHeaders = content.match(/(?:##|###)\s+(?:Issue|Problem)[:]\s*(.*)/g) || [];
    
    issueHeaders.forEach(header => {
      const issueTitle = header.match(/(?:##|###)\s+(?:Issue|Problem)[:]\s*(.*)/)[1];
      const issueStart = content.indexOf(header);
      const nextIssueStart = content.indexOf('## Issue', issueStart + header.length);
      const nextSectionStart = content.indexOf('##', issueStart + header.length);
      
      let issueEnd;
      if (nextIssueStart > -1) {
        issueEnd = nextIssueStart;
      } else if (nextSectionStart > -1) {
        issueEnd = nextSectionStart;
      } else {
        issueEnd = content.length;
      }
      
      const issueContent = content.substring(issueStart + header.length, issueEnd).trim();
      
      // Extract solution if present
      let solution = '';
      const solutionMatch = issueContent.match(/(?:###|####)\s+Solution([\s\S]*?)(?=###|####|$)/);
      if (solutionMatch) {
        solution = solutionMatch[1].trim();
      }
      
      // Extract steps if present
      let steps = [];
      const stepsMatch = issueContent.match(/(?:###|####)\s+Steps([\s\S]*?)(?=###|####|$)/);
      if (stepsMatch) {
        const stepsContent = stepsMatch[1];
        const stepItems = stepsContent.match(/\d+\.\s+([^\n]+)/g) || [];
        
        stepItems.forEach(step => {
          const stepText = step.match(/\d+\.\s+([^\n]+)/)[1];
          steps.push(stepText.trim());
        });
      }
      
      extractedItems.push({
        type: 'troubleshooting_guides',
        category: 'TroubleshootingGuides',
        data: {
          issue: issueTitle,
          solution,
          steps,
          source: document.filename || 'Unknown source'
        },
        confidence: 0.85
      });
    });
    
    return extractedItems;
  }
  
  // Default handlers for validation and knowledge extraction
  
  /**
   * Default handler for validation completion
   * @param {Object} results - Validation results
   * @param {Object} document - The validated document
   * @param {Object} context - Additional context
   */
  defaultValidationCompleteHandler(results, document, context) {
    // Log validation completion
    console.log(`[DocsModeEnhancement] Validation complete for ${document.filename || 'document'}`);
    console.log(`[DocsModeEnhancement] Valid: ${results.valid}`);
    
    if (!results.valid && results.errors.length > 0) {
      console.log(`[DocsModeEnhancement] Errors: ${results.errors.length}`);
      results.errors.forEach(error => console.log(`- ${error}`));
    }
  }
  
  /**
   * Default handler for knowledge extraction
   * @param {Object} results - Extraction results
   * @param {Object} document - The document
   * @param {Object} context - Additional context
   */
  defaultKnowledgeExtractedHandler(results, document, context) {
    // Log knowledge extraction completion
    console.log(`[DocsModeEnhancement] Knowledge extraction complete for ${document.filename || 'document'}`);
    console.log(`[DocsModeEnhancement] Extracted items: ${results.extractedKnowledge.length}`);
    console.log(`[DocsModeEnhancement] Extracted references: ${results.extractedReferences.length}`);
    console.log(`[DocsModeEnhancement] ConPort operations: ${results.conportOperations.length}`);
  }
}

module.exports = { DocsModeEnhancement };