/**
 * Prompt Enhancer Mode Enhancement
 * 
 * Integrates specialized validation checkpoints and knowledge-first capabilities
 * for Prompt Enhancer Mode, focusing on prompt clarity, completeness, and
 * measurable improvement over original prompts.
 */

const { PromptEnhancerValidationCheckpoints } = require('./prompt-enhancer-validation-checkpoints');
const { PromptEnhancerKnowledgeFirst } = require('./prompt-enhancer-knowledge-first');
const { ConPortClient } = require('../../services/conport-client');

/**
 * Prompt Enhancer Mode Enhancement
 * 
 * Provides integrated prompt enhancement capabilities with validation and
 * knowledge-first approach, following the established Mode-Specific
 * Knowledge-First Enhancement Pattern.
 */
class PromptEnhancerModeEnhancement {
  /**
   * Constructor for PromptEnhancerModeEnhancement
   * @param {Object} options - Configuration options
   * @param {ConPortClient} options.conportClient - ConPort client instance
   * @param {PromptEnhancerValidationCheckpoints} options.validationCheckpoints - Validation checkpoints instance
   * @param {PromptEnhancerKnowledgeFirst} options.knowledgeFirst - Knowledge-first instance
   */
  constructor(options = {}) {
    this.mode = 'prompt-enhancer';
    this.description = 'Prompt Enhancer Mode Enhancement';
    
    // Initialize components
    this.conportClient = options.conportClient || new ConPortClient();
    this.validationCheckpoints = options.validationCheckpoints || new PromptEnhancerValidationCheckpoints();
    this.knowledgeFirst = options.knowledgeFirst || new PromptEnhancerKnowledgeFirst({ conportClient: this.conportClient });
    
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
      
      // Log initialization to ConPort
      await this.conportClient.logDecision({
        summary: 'Initialized Prompt Enhancer Mode Enhancement',
        rationale: 'Activated integrated prompt enhancement capabilities with validation checkpoints and knowledge-first approach',
        tags: ['prompt-enhancer', 'initialization', 'mode-enhancement']
      });
      
      // Update active context
      await this.conportClient.updateActiveContext({
        patch_content: {
          current_focus: 'Prompt Enhancement',
          active_mode: 'prompt-enhancer',
          mode_enhancements: {
            'prompt-enhancer': {
              status: 'active',
              initialized_at: new Date().toISOString()
            }
          }
        }
      });
      
      // Log system pattern application
      await this.conportClient.logCustomData({
        category: 'pattern_applications',
        key: `prompt_enhancer_enhancement_${Date.now()}`,
        value: {
          pattern_id: 'system-pattern-31', // Mode-Specific Knowledge-First Enhancement Pattern
          applied_to: 'prompt-enhancer',
          components: ['validation-checkpoints', 'knowledge-first', 'mode-enhancement'],
          timestamp: new Date().toISOString()
        }
      });
      
      return {
        status: 'success',
        message: 'Prompt Enhancer Mode Enhancement initialized successfully',
        components: {
          validationCheckpoints: true,
          knowledgeFirst: true
        }
      };
    } catch (error) {
      console.error('Failed to initialize Prompt Enhancer Mode Enhancement:', error);
      
      return {
        status: 'error',
        message: 'Failed to initialize Prompt Enhancer Mode Enhancement',
        error: error.message
      };
    }
  }
  
  /**
   * Enhance a prompt with knowledge-first approach and validation
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
      
      // Log enhancement to ConPort
      await this.logEnhancementToConPort(originalPrompt, finalPrompt, {
        domain: enhancementResult.domain,
        templateUsed: enhancementResult.templateUsed,
        techniquesApplied: enhancementResult.techniquesApplied,
        validationPassed,
        validationErrors: validationErrors || []
      });
      
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
        }
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
      
      // Log enhancement to ConPort
      await this.logEnhancementToConPort(originalPrompt, finalPrompt, {
        domain: enhancementResult.domain,
        templateUsed: enhancementResult.templateUsed,
        techniquesApplied: enhancementResult.techniquesApplied,
        validationPassed,
        validationErrors: validationErrors || [],
        clarificationResponses: true
      });
      
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
        }
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
              return `${taskHeader}${randomVerb} ${taskContent.trim()}`;
            }
            return match;
          }
        );
        fixes.push('Added clear action verb to task description');
      } else {
        // If no Task section, add it at the beginning
        fixedPrompt = `**Task:**\n${randomVerb} ${fixedPrompt.trim()}\n\n`;
        fixes.push('Added Task section with clear action verb');
      }
    }
    
    // Fix missing success criteria
    if (validationResult.details && !validationResult.details.hasSuccessCriteria) {
      if (!/\*\*(?:Acceptance Criteria|Success Criteria|Expected Results):\*\*/.test(fixedPrompt)) {
        fixedPrompt += '\n\n**Acceptance Criteria:**\n1. Solution meets all specified requirements\n2. Implementation follows best practices\n3. Code is well-documented and maintainable';
        fixes.push('Added missing success criteria section');
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
          fixedPrompt = fixedPrompt.replace(pattern, replacement);
          fixes.push(`Replaced ambiguous terms matching "${pattern}" with "${replacement}"`);
        }
      });
    }
    
    return {
      enhancedPrompt: fixedPrompt,
      applied: fixes.length > 0,
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
    
    // Add missing essential sections
    if (validationResult.details && validationResult.details.missingEssentialSections) {
      const missingSections = validationResult.details.missingEssentialSections;
      
      for (const section of missingSections) {
        let sectionTemplate = '';
        
        switch (section) {
          case 'Context':
            sectionTemplate = '\n\n**Context:**\nThis task is part of a software development project. Consider compatibility with existing systems and maintainability requirements.';
            break;
          
          case 'Task':
            sectionTemplate = '\n\n**Task:**\nImplement the solution as described in the requirements.';
            break;
          
          case 'Requirements':
            sectionTemplate = '\n\n**Requirements:**\n1. Follow project coding standards\n2. Implement proper error handling\n3. Include appropriate documentation';
            break;
          
          case 'Acceptance Criteria':
            sectionTemplate = '\n\n**Acceptance Criteria:**\n1. Solution meets all specified requirements\n2. Implementation follows best practices\n3. Code is well-documented and maintainable';
            break;
        }
        
        fixedPrompt += sectionTemplate;
        fixes.push(`Added missing ${section} section`);
      }
    }
    
    // Add requirements if missing
    if (validationResult.details && !validationResult.details.hasRequirements) {
      if (!/\*\*Requirements:\*\*/.test(fixedPrompt)) {
        fixedPrompt += '\n\n**Requirements:**\n1. Follow project coding standards\n2. Implement proper error handling\n3. Include appropriate documentation';
        fixes.push('Added missing Requirements section');
      }
    }
    
    // Add relevant context if missing
    if (validationResult.details && !validationResult.details.hasRelevantContext) {
      if (!/\*\*Context:\*\*/.test(fixedPrompt)) {
        fixedPrompt = '**Context:**\nThis task is part of a software development project. Consider compatibility with existing systems and maintainability requirements.\n\n' + fixedPrompt;
        fixes.push('Added missing Context section');
      }
    }
    
    return {
      enhancedPrompt: fixedPrompt,
      applied: fixes.length > 0,
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
    
    // If specificity improvement is low, enhance technical specificity
    if (validationResult.details && validationResult.details.specificityImprovement < 0.4) {
      // Add technical terms if missing
      if (!/\b(?:javascript|typescript|python|java|react|angular|vue|node\.js)\b/i.test(fixedPrompt)) {
        // Check if there's a context section to add to
        if (/\*\*Context:\*\*/.test(fixedPrompt)) {
          fixedPrompt = fixedPrompt.replace(
            /(\*\*Context:\*\*\s*\n)([^*]+)/,
            '$1$2\n\nThis should be implemented using modern development practices and appropriate technology for the task.\n'
          );
        } else {
          // Add a context section with technical specificity
          fixedPrompt = '**Context:**\nThis task should be implemented using modern development practices and appropriate technology for the task.\n\n' + fixedPrompt;
        }
        fixes.push('Enhanced technical specificity in context');
      }
    }
    
    // If structure improvement is low, enhance structure
    if (validationResult.details && validationResult.details.structureImprovement < 0.4) {
      // Check if prompt lacks structure (no section headers)
      if (!/\*\*[^*]+:\*\*/.test(fixedPrompt)) {
        // Structure the prompt with sections
        const structuredPrompt = `**Task:**\n${originalPrompt.trim()}\n\n**Requirements:**\n1. Follow project coding standards\n2. Implement proper error handling\n3. Include appropriate documentation\n\n**Acceptance Criteria:**\n1. Solution meets all specified requirements\n2. Implementation follows best practices\n3. Code is well-documented and maintainable`;
        
        fixedPrompt = structuredPrompt;
        fixes.push('Applied structured formatting with clear sections');
      } else {
        // Ensure bullet points for lists
        const listSections = ['Requirements', 'Acceptance Criteria', 'Implementation Notes'];
        
        for (const section of listSections) {
          // Check if section exists but doesn't have numbered lists
          const sectionRegex = new RegExp(`\\*\\*${section}:\\*\\*\\s*\\n([^\\*\\n][^\\n]*\\n)+`, 'g');
          const sectionMatch = fixedPrompt.match(sectionRegex);
          
          if (sectionMatch && !/\d+\./.test(sectionMatch[0])) {
            // Convert paragraph to numbered list
            fixedPrompt = fixedPrompt.replace(
              sectionRegex,
              match => {
                const lines = match.split('\n').filter(line => line.trim() !== '');
                const header = lines[0];
                const items = lines.slice(1);
                
                const numberedItems = items.map((item, i) => `${i + 1}. ${item.trim()}`).join('\n');
                return `${header}\n${numberedItems}\n\n`;
              }
            );
            
            fixes.push(`Added numbered list formatting to ${section} section`);
          }
        }
      }
    }
    
    // Ensure the enhanced prompt is significantly longer than the original
    if (validationResult.details && validationResult.details.lengthRatio < 1.5) {
      // Add implementation notes if missing
      if (!/\*\*Implementation Notes:\*\*/.test(fixedPrompt)) {
        fixedPrompt += '\n\n**Implementation Notes:**\n- Follow project code style and conventions\n- Include appropriate error handling\n- Add comments for complex logic\n- Consider performance and maintainability\n- Write unit tests for critical functionality';
        fixes.push('Added Implementation Notes section for more comprehensive guidance');
      }
    }
    
    return {
      enhancedPrompt: fixedPrompt,
      applied: fixes.length > 0,
      fixes
    };
  }
  
  /**
   * Record enhancement in history
   * @param {string} originalPrompt - The original prompt
   * @param {string} enhancedPrompt - The enhanced prompt
   * @param {Object} metadata - Enhancement metadata
   */
  recordEnhancementHistory(originalPrompt, enhancedPrompt, metadata = {}) {
    // Add enhancement to history
    this.enhancementHistory.unshift({
      timestamp: new Date().toISOString(),
      originalPrompt,
      enhancedPrompt,
      ...metadata
    });
    
    // Trim history to max items
    if (this.enhancementHistory.length > this.maxHistoryItems) {
      this.enhancementHistory = this.enhancementHistory.slice(0, this.maxHistoryItems);
    }
  }
  
  /**
   * Get enhancement history
   * @returns {Array} - Enhancement history
   */
  getEnhancementHistory() {
    return this.enhancementHistory;
  }
  
  /**
   * Log enhancement to ConPort
   * @param {string} originalPrompt - The original prompt
   * @param {string} enhancedPrompt - The enhanced prompt
   * @param {Object} metadata - Enhancement metadata
   * @returns {Promise<void>}
   */
  async logEnhancementToConPort(originalPrompt, enhancedPrompt, metadata = {}) {
    try {
      // Log enhancement to ConPort
      await this.conportClient.logCustomData({
        category: 'prompt_enhancements',
        key: `enhancement_${Date.now()}`,
        value: {
          originalPrompt,
          enhancedPrompt,
          ...metadata,
          timestamp: new Date().toISOString()
        }
      });
      
      // Log decision
      await this.conportClient.logDecision({
        summary: `Enhanced prompt for ${metadata.domain || 'general'} domain`,
        rationale: `Applied ${(metadata.techniquesApplied || []).join(', ')} techniques with ${metadata.templateUsed || 'basic'} template. Validation ${metadata.validationPassed ? 'passed' : 'failed with fixes applied'}.`,
        tags: ['prompt-enhancer', 'enhancement', metadata.domain || 'general']
      });
      
      // Update active context
      await this.conportClient.updateActiveContext({
        patch_content: {
          recent_activities: {
            prompt_enhancements: {
              latest: {
                timestamp: new Date().toISOString(),
                domain: metadata.domain || 'general',
                template: metadata.templateUsed || 'basic',
                techniques: metadata.techniquesApplied || [],
                validation: metadata.validationPassed
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Failed to log enhancement to ConPort:', error);
    }
  }
  
  /**
   * Get validation metrics
   * @returns {Object} - Validation metrics
   */
  getValidationMetrics() {
    return this.validationCheckpoints.getMetrics();
  }
  
  /**
   * Reset validation metrics
   */
  resetValidationMetrics() {
    this.validationCheckpoints.resetMetrics();
  }
}

module.exports = { PromptEnhancerModeEnhancement };