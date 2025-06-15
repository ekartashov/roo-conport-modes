/**
 * Prompt Enhancer Isolated Mode Enhancement
 * 
 * Integrates specialized validation checkpoints and knowledge-first capabilities
 * for Prompt Enhancer Isolated Mode, focusing on prompt enhancement using only
 * universal best practices without project-specific influence.
 */

const { PromptEnhancerIsolatedValidationCheckpoints } = require('./prompt-enhancer-isolated-validation-checkpoints');
const { PromptEnhancerIsolatedKnowledgeFirst } = require('./prompt-enhancer-isolated-knowledge-first');

/**
 * Prompt Enhancer Isolated Mode Enhancement
 * 
 * Provides integrated prompt enhancement capabilities with validation and
 * knowledge-first approach in isolation from project-specific context,
 * following the established Mode-Specific Knowledge-First Enhancement Pattern
 * but specifically designed to operate without project influence.
 */
class PromptEnhancerIsolatedModeEnhancement {
  /**
   * Constructor for PromptEnhancerIsolatedModeEnhancement
   * @param {Object} options - Configuration options
   * @param {PromptEnhancerIsolatedValidationCheckpoints} options.validationCheckpoints - Validation checkpoints instance
   * @param {PromptEnhancerIsolatedKnowledgeFirst} options.knowledgeFirst - Knowledge-first instance
   */
  constructor(options = {}) {
    this.mode = 'prompt-enhancer-isolated';
    this.description = 'Prompt Enhancer Isolated Mode Enhancement';
    
    // Initialize components
    this.validationCheckpoints = options.validationCheckpoints || new PromptEnhancerIsolatedValidationCheckpoints();
    this.knowledgeFirst = options.knowledgeFirst || new PromptEnhancerIsolatedKnowledgeFirst();
    
    // Enhancement history
    this.enhancementHistory = [];
    this.enableHistoryTracking = options.enableHistoryTracking !== false;
    
    // Max history items to keep
    this.maxHistoryItems = options.maxHistoryItems || 10;
  }
  
  /**
   * Initialize the mode enhancement
   * @returns {Promise<Object>} - Initialization result
   */
  async initialize() {
    try {
      // Initialize components
      await this.knowledgeFirst.initialize();
      
      console.log('Initialized Prompt Enhancer Isolated Mode Enhancement');
      
      return {
        status: 'success',
        message: 'Prompt Enhancer Isolated Mode Enhancement initialized successfully',
        components: {
          validationCheckpoints: true,
          knowledgeFirst: true
        }
      };
    } catch (error) {
      console.error('Failed to initialize Prompt Enhancer Isolated Mode Enhancement:', error);
      
      return {
        status: 'error',
        message: 'Failed to initialize Prompt Enhancer Isolated Mode Enhancement',
        error: error.message
      };
    }
  }
  
  /**
   * Enhance a prompt with knowledge-first approach and validation
   * in isolation from project-specific context
   * @param {string} originalPrompt - The original prompt to enhance
   * @param {Object} options - Enhancement options
   * @returns {Promise<Object>} - Enhancement result
   */
  async enhancePrompt(originalPrompt, options = {}) {
    try {
      // Disambiguate the prompt to separate content from meta-instructions
      const disambiguationResult = await this.knowledgeFirst.disambiguatePrompt(originalPrompt);
      
      // Check if disambiguation resulted in clarification requests
      if (disambiguationResult.clarificationRequests && disambiguationResult.clarificationRequests.length > 0) {
        return {
          status: 'clarification_needed',
          originalPrompt,
          clarificationRequests: disambiguationResult.clarificationRequests,
          disambiguationResult
        };
      }
      
      // Enhance the prompt using knowledge-first approach
      const enhancementResult = await this.knowledgeFirst.enhancePrompt(
        originalPrompt,
        disambiguationResult,
        options
      );
      
      // Validate the enhanced prompt
      const validationResult = await this.validateEnhancement(
        originalPrompt,
        enhancementResult.enhancedPrompt,
        disambiguationResult
      );
      
      // If validation failed, apply fixes
      let finalPrompt = enhancementResult.enhancedPrompt;
      let validationPassed = validationResult.valid;
      let validationErrors = validationResult.errors;
      
      if (!validationPassed && options.autoFix !== false) {
        const fixResult = await this.applyValidationFixes(
          originalPrompt,
          enhancementResult.enhancedPrompt,
          disambiguationResult,
          validationResult
        );
        
        finalPrompt = fixResult.enhancedPrompt;
        validationPassed = fixResult.validationPassed;
        validationErrors = fixResult.validationErrors;
      }
      
      // Record the enhancement in history
      if (this.enableHistoryTracking) {
        this.recordEnhancementHistory(originalPrompt, finalPrompt, {
          domain: enhancementResult.domain,
          templateUsed: enhancementResult.templateUsed,
          techniquesApplied: enhancementResult.techniquesApplied,
          validationPassed,
          validationErrors: validationErrors || []
        });
      }
      
      return {
        status: 'success',
        originalPrompt,
        enhancedPrompt: finalPrompt,
        domain: enhancementResult.domain,
        templateUsed: enhancementResult.templateUsed,
        techniquesApplied: enhancementResult.techniquesApplied,
        validationResult: {
          passed: validationPassed,
          errors: validationErrors || []
        },
        disambiguationResult: {
          contentSegmentsCount: disambiguationResult.contentSegments?.length || 0,
          metaInstructionSegmentsCount: disambiguationResult.metaInstructionSegments?.length || 0,
          overallConfidence: disambiguationResult.overallConfidence
        },
        isolationNote: "This enhancement was created in isolation mode, using only universal best practices without project-specific context."
      };
    } catch (error) {
      console.error('Failed to enhance prompt:', error);
      
      return {
        status: 'error',
        originalPrompt,
        error: error.message
      };
    }
  }
  
  /**
   * Process clarification responses and continue enhancement
   * @param {string} originalPrompt - The original prompt
   * @param {Object} disambiguationResult - Initial disambiguation result
   * @param {Array} clarificationResponses - User responses to clarification requests
   * @param {Object} options - Enhancement options
   * @returns {Promise<Object>} - Enhancement result
   */
  async processClarificationResponses(originalPrompt, disambiguationResult, clarificationResponses, options = {}) {
    try {
      // Update disambiguation result with clarification responses
      const updatedDisambiguation = this._incorporateClarificationResponses(
        disambiguationResult,
        clarificationResponses
      );
      
      // Enhance the prompt using updated disambiguation
      const enhancementResult = await this.knowledgeFirst.enhancePrompt(
        originalPrompt,
        updatedDisambiguation,
        options
      );
      
      // Validate the enhanced prompt
      const validationResult = await this.validateEnhancement(
        originalPrompt,
        enhancementResult.enhancedPrompt,
        updatedDisambiguation
      );
      
      // If validation failed, apply fixes
      let finalPrompt = enhancementResult.enhancedPrompt;
      let validationPassed = validationResult.valid;
      let validationErrors = validationResult.errors;
      
      if (!validationPassed && options.autoFix !== false) {
        const fixResult = await this.applyValidationFixes(
          originalPrompt,
          enhancementResult.enhancedPrompt,
          updatedDisambiguation,
          validationResult
        );
        
        finalPrompt = fixResult.enhancedPrompt;
        validationPassed = fixResult.validationPassed;
        validationErrors = fixResult.validationErrors;
      }
      
      // Record the enhancement in history
      if (this.enableHistoryTracking) {
        this.recordEnhancementHistory(originalPrompt, finalPrompt, {
          domain: enhancementResult.domain,
          templateUsed: enhancementResult.templateUsed,
          techniquesApplied: enhancementResult.techniquesApplied,
          validationPassed,
          validationErrors: validationErrors || [],
          clarificationResponses: true
        });
      }
      
      return {
        status: 'success',
        originalPrompt,
        enhancedPrompt: finalPrompt,
        domain: enhancementResult.domain,
        templateUsed: enhancementResult.templateUsed,
        techniquesApplied: enhancementResult.techniquesApplied,
        validationResult: {
          passed: validationPassed,
          errors: validationErrors || []
        },
        disambiguationResult: {
          contentSegmentsCount: updatedDisambiguation.contentSegments?.length || 0,
          metaInstructionSegmentsCount: updatedDisambiguation.metaInstructionSegments?.length || 0,
          overallConfidence: updatedDisambiguation.overallConfidence
        },
        isolationNote: "This enhancement was created in isolation mode, using only universal best practices without project-specific context."
      };
    } catch (error) {
      console.error('Failed to process clarification responses:', error);
      
      return {
        status: 'error',
        originalPrompt,
        error: error.message
      };
    }
  }
  
  /**
   * Incorporate clarification responses into disambiguation result
   * @param {Object} disambiguationResult - Original disambiguation result
   * @param {Array} clarificationResponses - User responses to clarification requests
   * @returns {Object} - Updated disambiguation result
   * @private
   */
  _incorporateClarificationResponses(disambiguationResult, clarificationResponses) {
    // Clone the disambiguation result to avoid modifying the original
    const updatedResult = JSON.parse(JSON.stringify(disambiguationResult));
    
    // Remove clarification requests since they've been answered
    delete updatedResult.clarificationRequests;
    
    // Initialize content and meta-instruction segments if not present
    updatedResult.contentSegments = updatedResult.contentSegments || [];
    updatedResult.metaInstructionSegments = updatedResult.metaInstructionSegments || [];
    
    // Process each clarification response
    for (let i = 0; i < clarificationResponses.length; i++) {
      const response = clarificationResponses[i];
      const originalRequest = disambiguationResult.clarificationRequests?.[i];
      
      if (!originalRequest) continue;
      
      // Update segment based on clarification response
      const segment = {
        text: originalRequest.segment,
        type: response.isContent ? 'content' : 'meta-instruction',
        confidence: 0.95 // High confidence since explicitly clarified
      };
      
      // Add segment to appropriate array
      if (response.isContent) {
        updatedResult.contentSegments.push(segment);
      } else {
        updatedResult.metaInstructionSegments.push(segment);
      }
      
      // Remove segment from low confidence segments
      updatedResult.lowConfidenceSegments = (updatedResult.lowConfidenceSegments || [])
        .filter(s => s.text !== originalRequest.segment);
      
      // Remove segment from ambiguous segments
      updatedResult.ambiguousSegments = (updatedResult.ambiguousSegments || [])
        .filter(s => s.text !== originalRequest.segment);
    }
    
    // Recalculate overall confidence
    const allSegments = [
      ...updatedResult.contentSegments,
      ...updatedResult.metaInstructionSegments
    ];
    
    updatedResult.overallConfidence = allSegments.length > 0
      ? allSegments.reduce((sum, s) => sum + s.confidence, 0) / allSegments.length
      : 0;
    
    return updatedResult;
  }
  
  /**
   * Validate an enhanced prompt
   * @param {string} originalPrompt - The original prompt
   * @param {string} enhancedPrompt - The enhanced prompt
   * @param {Object} disambiguationResult - Disambiguation result
   * @returns {Promise<Object>} - Validation result
   */
  async validateEnhancement(originalPrompt, enhancedPrompt, disambiguationResult) {
    try {
      // Prepare prompt data for validation
      const promptData = {
        originalPrompt,
        enhancedPrompt,
        disambiguationResult
      };
      
      // Get validation checkpoints
      const checkpoints = this.validationCheckpoints.getCheckpoints();
      
      // Validate against each checkpoint
      const results = {};
      let allValid = true;
      const allErrors = [];
      
      for (const checkpoint of checkpoints) {
        const checkpointResult = checkpoint.validate(promptData);
        results[checkpoint.name] = checkpointResult;
        
        if (!checkpointResult.valid) {
          allValid = false;
          allErrors.push(...checkpointResult.errors.map(error => 
            `[${checkpoint.name}] ${error}`
          ));
        }
      }
      
      return {
        valid: allValid,
        errors: allValid ? null : allErrors,
        checkpointResults: results
      };
    } catch (error) {
      console.error('Failed to validate enhancement:', error);
      
      return {
        valid: false,
        errors: [`Validation error: ${error.message}`],
        checkpointResults: {}
      };
    }
  }
  
  /**
   * Apply fixes based on validation errors
   * @param {string} originalPrompt - The original prompt
   * @param {string} enhancedPrompt - The enhanced prompt
   * @param {Object} disambiguationResult - Disambiguation result
   * @param {Object} validationResult - Validation result
   * @returns {Promise<Object>} - Fix result
   */
  async applyValidationFixes(originalPrompt, enhancedPrompt, disambiguationResult, validationResult) {
    try {
      // Initialize fix process
      let fixedPrompt = enhancedPrompt;
      const checkpointResults = validationResult.checkpointResults || {};
      const fixApplications = [];
      
      // Apply fixes for clarity
      if (checkpointResults.PromptClarity && !checkpointResults.PromptClarity.valid) {
        const clarityFix = this._applyClarityFix(fixedPrompt, checkpointResults.PromptClarity);
        fixedPrompt = clarityFix.enhancedPrompt;
        fixApplications.push({
          checkpoint: 'PromptClarity',
          applied: clarityFix.applied,
          fixes: clarityFix.fixes
        });
      }
      
      // Apply fixes for completeness
      if (checkpointResults.PromptCompleteness && !checkpointResults.PromptCompleteness.valid) {
        const completenessFix = this._applyCompletenessFix(fixedPrompt, checkpointResults.PromptCompleteness);
        fixedPrompt = completenessFix.enhancedPrompt;
        fixApplications.push({
          checkpoint: 'PromptCompleteness',
          applied: completenessFix.applied,
          fixes: completenessFix.fixes
        });
      }
      
      // Apply fixes for improvement
      if (checkpointResults.PromptImprovement && !checkpointResults.PromptImprovement.valid) {
        const improvementFix = this._applyImprovementFix(
          originalPrompt,
          fixedPrompt,
          checkpointResults.PromptImprovement
        );
        fixedPrompt = improvementFix.enhancedPrompt;
        fixApplications.push({
          checkpoint: 'PromptImprovement',
          applied: improvementFix.applied,
          fixes: improvementFix.fixes
        });
      }
      
      // Re-validate the fixed prompt
      const revalidationResult = await this.validateEnhancement(
        originalPrompt,
        fixedPrompt,
        disambiguationResult
      );
      
      return {
        enhancedPrompt: fixedPrompt,
        validationPassed: revalidationResult.valid,
        validationErrors: revalidationResult.valid ? null : revalidationResult.errors,
        fixApplications,
        revalidationResult
      };
    } catch (error) {
      console.error('Failed to apply validation fixes:', error);
      
      return {
        enhancedPrompt: enhancedPrompt,
        validationPassed: false,
        validationErrors: [`Fix application error: ${error.message}`],
        fixApplications: [],
        error: error.message
      };
    }
  }
  
  /**
   * Apply fixes for clarity validation errors
   * @param {string} enhancedPrompt - The enhanced prompt
   * @param {Object} validationResult - Clarity validation result
   * @returns {Object} - Fix result
   * @private
   */
  _applyClarityFix(enhancedPrompt, validationResult) {
    const fixes = [];
    let fixedPrompt = enhancedPrompt;
    let applied = false;
    
    // Fix missing action verbs
    if (validationResult.details && !validationResult.details.hasActionVerbs) {
      const actionVerbs = ['Create', 'Implement', 'Develop', 'Build'];
      const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
      
      // Check if prompt starts with "Task:" section
      if (/\*\*Task:\*\*/.test(fixedPrompt)) {
        fixedPrompt = fixedPrompt.replace(
          /(\*\*Task:\*\*\s*\n)([^*\n]+)/,
          (match, taskHeader, taskContent) => {
            // Only add action verb if it doesn't already start with one
            if (!/^(Create|Implement|Develop|Build|Design|Write|Code)/i.test(taskContent.trim())) {
              applied = true;
              return `${taskHeader}${randomVerb} ${taskContent.trim()}`;
            }
            return match;
          }
        );
        if (applied) {
          fixes.push('Added clear action verb to task description');
        }
      } else {
        // If no Task section, add it at the beginning
        fixedPrompt = `**Task:**\n${randomVerb} ${fixedPrompt.trim()}\n\n`;
        fixes.push('Added Task section with clear action verb');
        applied = true;
      }
    }
    
    // Fix missing success criteria
    if (validationResult.details && !validationResult.details.hasSuccessCriteria) {
      if (!/\*\*(?:Acceptance Criteria|Success Criteria|Expected Results):\*\*/.test(fixedPrompt)) {
        fixedPrompt += '\n\n**Acceptance Criteria:**\n1. Solution meets all specified requirements\n2. Implementation follows best practices\n3. Code is well-documented and maintainable';
        fixes.push('Added missing success criteria section');
        applied = true;
      }
    }
    
    // Fix high ambiguity score
    if (validationResult.details && validationResult.details.ambiguityScore > 0.3) {
      // Replace ambiguous terms with more specific ones
      const ambiguityReplacements = [
        { pattern: /\b(?:good|nice|better)\b/g, replacement: 'high-quality' },
        { pattern: /\b(?:maybe|perhaps|possibly)\b/g, replacement: 'must' },
        { pattern: /\b(?:some|several|various|multiple)\b/g, replacement: 'specific' },
        { pattern: /\b(?:etc\.?|and so on)\b/g, replacement: '' }
      ];
      
      ambiguityReplacements.forEach(({ pattern, replacement }) => {
        if (pattern.test(fixedPrompt)) {
          const before = fixedPrompt;
          fixedPrompt = fixedPrompt.replace(pattern, replacement);
          if (before !== fixedPrompt) {
            fixes.push(`Replaced ambiguous terms matching "${pattern}" with "${replacement}"`);
            applied = true;
          }
        }
      });
    }
    
    return {
      enhancedPrompt: fixedPrompt,
      applied,
      fixes
    };
  }
  
  /**
   * Apply fixes for completeness validation errors
   * @param {string} enhancedPrompt - The enhanced prompt
   * @param {Object} validationResult - Completeness validation result
   * @returns {Object} - Fix result
   * @private
   */
  _applyCompletenessFix(enhancedPrompt, validationResult) {
    const fixes = [];
    let fixedPrompt = enhancedPrompt;
    let applied = false;
    
    // Fix missing requirements
    if (validationResult.details && !validationResult.details.hasRequirements) {
      if (!/\*\*(?:Requirements|Technical Requirements|Specifications):\*\*/.test(fixedPrompt)) {
        // Add requirements section before acceptance criteria if it exists
        if (/\*\*(?:Acceptance Criteria|Success Criteria|Expected Results):\*\*/.test(fixedPrompt)) {
          fixedPrompt = fixedPrompt.replace(
            /(\*\*(?:Acceptance Criteria|Success Criteria|Expected Results):\*\*)/,
            '**Requirements:**\n1. The solution must be efficient and scalable\n2. Code must follow industry best practices\n3. Implementation must include proper error handling\n\n$1'
          );
        } else {
          // Add at the end if no acceptance criteria
          fixedPrompt += '\n\n**Requirements:**\n1. The solution must be efficient and scalable\n2. Code must follow industry best practices\n3. Implementation must include proper error handling';
        }
        fixes.push('Added missing requirements section');
        applied = true;
      }
    }
    
    // Fix missing context
    if (validationResult.details && !validationResult.details.hasContext) {
      if (!/\*\*(?:Context|Environment|Background):\*\*/.test(fixedPrompt)) {
        // Add context at the beginning
        fixedPrompt = `**Context:**\nThis task is part of a standard software development workflow using common industry tools and practices.\n\n${fixedPrompt}`;
        fixes.push('Added missing context section');
        applied = true;
      }
    }
    
    return {
      enhancedPrompt: fixedPrompt,
      applied,
      fixes
    };
  }
  
  /**
   * Apply fixes for improvement validation errors
   * @param {string} originalPrompt - The original prompt
   * @param {string} enhancedPrompt - The enhanced prompt
   * @param {Object} validationResult - Improvement validation result
   * @returns {Object} - Fix result
   * @private
   */
  _applyImprovementFix(originalPrompt, enhancedPrompt, validationResult) {
    const fixes = [];
    let fixedPrompt = enhancedPrompt;
    let applied = false;
    
    // Add missing structure if needed
    if (validationResult.details && !validationResult.details.hasImprovedStructure) {
      // Check if the prompt lacks structure (fewer than 2 sections)
      const sectionCount = (enhancedPrompt.match(/\*\*[^*]+:\*\*/g) || []).length;
      
      if (sectionCount < 2) {
        // Apply basic structure
        fixedPrompt = `**Task:**\n${originalPrompt.trim()}\n\n**Requirements:**\n1. Implementation must follow best practices\n2. Solution must be efficient and maintainable\n\n**Acceptance Criteria:**\n1. Code meets all specified requirements\n2. Implementation is well-documented\n3. Solution passes relevant tests`;
        
        fixes.push('Added complete structure to prompt');
        applied = true;
      }
    }
    
    // Add examples or references if needed
    if (validationResult.details && !validationResult.details.hasExamplesOrReferences) {
      if (!/\*\*(?:Examples|References|Example Implementation|Sample Code):\*\*/.test(fixedPrompt)) {
        fixedPrompt += '\n\n**Examples:**\nConsider industry-standard approaches and patterns appropriate for this task.';
        fixes.push('Added generic examples section');
        applied = true;
      }
    }
    
    // Add technical details if needed
    if (validationResult.details && !validationResult.details.hasTechnicalDetails) {
      if (!/\*\*(?:Technical Details|Implementation Notes|Technical Specifications):\*\*/.test(fixedPrompt)) {
        fixedPrompt += '\n\n**Technical Details:**\n- Use appropriate error handling\n- Follow consistent naming conventions\n- Include necessary documentation';
        fixes.push('Added technical details section');
        applied = true;
      }
    }
    
    return {
      enhancedPrompt: fixedPrompt,
      applied,
      fixes
    };
  }
  
  /**
   * Record enhancement history
   * @param {string} originalPrompt - The original prompt
   * @param {string} enhancedPrompt - The enhanced prompt
   * @param {Object} metadata - Enhancement metadata
   * @private
   */
  recordEnhancementHistory(originalPrompt, enhancedPrompt, metadata) {
    // Add to history
    this.enhancementHistory.unshift({
      timestamp: new Date().toISOString(),
      originalPrompt,
      enhancedPrompt,
      metadata
    });
    
    // Trim history if needed
    if (this.enhancementHistory.length > this.maxHistoryItems) {
      this.enhancementHistory = this.enhancementHistory.slice(0, this.maxHistoryItems);
    }
  }
  
  /**
   * Get enhancement history
   * @param {number} limit - Maximum number of history items to return
   * @returns {Array} - Enhancement history
   */
  getEnhancementHistory(limit = 10) {
    return this.enhancementHistory.slice(0, Math.min(limit, this.enhancementHistory.length));
  }
  
  /**
   * Clear enhancement history
   */
  clearEnhancementHistory() {
    this.enhancementHistory = [];
  }
}

module.exports = { PromptEnhancerIsolatedModeEnhancement };