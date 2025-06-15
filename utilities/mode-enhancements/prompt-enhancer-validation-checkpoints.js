/**
 * Prompt Enhancer Validation Checkpoints
 * 
 * Specialized validation checkpoints for Prompt Enhancer Mode,
 * focusing on prompt clarity, completeness, improvement, and
 * knowledge preservation.
 */

/**
 * Prompt Enhancer Validation Checkpoints
 * 
 * Provides validation checkpoints specifically designed for
 * prompt enhancement tasks, ensuring clarity, completeness,
 * and measurable improvement over original prompts.
 */
class PromptEnhancerValidationCheckpoints {
  /**
   * Constructor for PromptEnhancerValidationCheckpoints
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.mode = 'prompt-enhancer';
    this.description = 'Validation checkpoints for prompt enhancement tasks';
    
    // Threshold configuration
    this.promptClarityThreshold = options.promptClarityThreshold || 0.8;
    this.promptCompletenessThreshold = options.promptCompletenessThreshold || 0.85;
    this.promptImprovementThreshold = options.promptImprovementThreshold || 0.7;
    this.disambiguationAccuracyThreshold = options.disambiguationAccuracyThreshold || 0.9;
    
    // Initialize validation metrics
    this.metrics = {
      totalValidations: 0,
      passedValidations: 0,
      failedValidations: 0,
      checkpointStats: {
        promptClarity: { total: 0, passed: 0 },
        promptCompleteness: { total: 0, passed: 0 },
        promptImprovement: { total: 0, passed: 0 },
        disambiguationAccuracy: { total: 0, passed: 0 }
      }
    };
  }
  
  /**
   * Get all validation checkpoints
   * @returns {Array} - Array of validation checkpoint functions
   */
  getCheckpoints() {
    return [
      {
        name: 'PromptClarity',
        description: 'Validates that enhanced prompts are clear, specific, and unambiguous',
        validate: this.validatePromptClarity.bind(this)
      },
      {
        name: 'PromptCompleteness',
        description: 'Verifies that enhanced prompts include all necessary context and requirements',
        validate: this.validatePromptCompleteness.bind(this)
      },
      {
        name: 'PromptImprovement',
        description: 'Ensures the enhanced prompt provides measurable improvement over the original',
        validate: this.validatePromptImprovement.bind(this)
      },
      {
        name: 'DisambiguationAccuracy',
        description: 'Verifies that content vs. meta-instruction disambiguation is accurate',
        validate: this.validateDisambiguationAccuracy.bind(this)
      }
    ];
  }
  
  /**
   * Validate prompt clarity
   * @param {Object} promptData - Data about the original and enhanced prompts
   * @param {Object} context - Additional context
   * @returns {Object} - Validation result
   */
  validatePromptClarity(promptData, context = {}) {
    if (!promptData || !promptData.enhancedPrompt) {
      return {
        valid: false,
        errors: ['No enhanced prompt data provided for validation']
      };
    }
    
    const enhancedPrompt = promptData.enhancedPrompt;
    const errors = [];
    
    // Update metrics
    this.metrics.checkpointStats.promptClarity.total++;
    
    // Check for specific action verbs
    if (!this._containsActionVerbs(enhancedPrompt)) {
      errors.push('Enhanced prompt lacks clear action verbs specifying what to do');
    }
    
    // Check for ambiguous language
    const ambiguityScore = this._calculateAmbiguityScore(enhancedPrompt);
    if (ambiguityScore > (1 - this.promptClarityThreshold)) {
      errors.push(`Enhanced prompt contains ambiguous language (ambiguity score: ${ambiguityScore.toFixed(2)})`);
    }
    
    // Check for specific technical details
    if (!this._containsTechnicalSpecificity(enhancedPrompt, context)) {
      errors.push('Enhanced prompt lacks technical specificity required for implementation');
    }
    
    // Check for clear success criteria
    if (!this._containsSuccessCriteria(enhancedPrompt)) {
      errors.push('Enhanced prompt lacks clear success criteria or acceptance criteria');
    }
    
    const valid = errors.length === 0;
    
    // Update metrics
    if (valid) {
      this.metrics.checkpointStats.promptClarity.passed++;
    }
    
    return {
      valid,
      errors,
      details: {
        ambiguityScore,
        hasActionVerbs: this._containsActionVerbs(enhancedPrompt),
        hasTechnicalSpecificity: this._containsTechnicalSpecificity(enhancedPrompt, context),
        hasSuccessCriteria: this._containsSuccessCriteria(enhancedPrompt)
      }
    };
  }
  
  /**
   * Validate prompt completeness
   * @param {Object} promptData - Data about the original and enhanced prompts
   * @param {Object} context - Additional context
   * @returns {Object} - Validation result
   */
  validatePromptCompleteness(promptData, context = {}) {
    if (!promptData || !promptData.enhancedPrompt) {
      return {
        valid: false,
        errors: ['No enhanced prompt data provided for validation']
      };
    }
    
    const enhancedPrompt = promptData.enhancedPrompt;
    const errors = [];
    
    // Update metrics
    this.metrics.checkpointStats.promptCompleteness.total++;
    
    // Check for essential prompt sections
    const missingEssentialSections = this._checkForEssentialSections(enhancedPrompt);
    if (missingEssentialSections.length > 0) {
      errors.push(`Enhanced prompt is missing essential sections: ${missingEssentialSections.join(', ')}`);
    }
    
    // Check for relevant context inclusion
    if (!this._containsRelevantContext(enhancedPrompt, context)) {
      errors.push('Enhanced prompt lacks relevant project or implementation context');
    }
    
    // Check for requirements specification
    if (!this._containsRequirements(enhancedPrompt)) {
      errors.push('Enhanced prompt lacks specific requirements or constraints');
    }
    
    // Check for completeness score
    const completenessScore = this._calculateCompletenessScore(enhancedPrompt, context);
    if (completenessScore < this.promptCompletenessThreshold) {
      errors.push(`Enhanced prompt completeness score (${completenessScore.toFixed(2)}) is below threshold (${this.promptCompletenessThreshold})`);
    }
    
    const valid = errors.length === 0;
    
    // Update metrics
    if (valid) {
      this.metrics.checkpointStats.promptCompleteness.passed++;
    }
    
    return {
      valid,
      errors,
      details: {
        completenessScore,
        missingEssentialSections,
        hasRelevantContext: this._containsRelevantContext(enhancedPrompt, context),
        hasRequirements: this._containsRequirements(enhancedPrompt)
      }
    };
  }
  
  /**
   * Validate prompt improvement
   * @param {Object} promptData - Data about the original and enhanced prompts
   * @param {Object} context - Additional context
   * @returns {Object} - Validation result
   */
  validatePromptImprovement(promptData, context = {}) {
    if (!promptData || !promptData.originalPrompt || !promptData.enhancedPrompt) {
      return {
        valid: false,
        errors: ['Both original and enhanced prompts must be provided for improvement validation']
      };
    }
    
    const originalPrompt = promptData.originalPrompt;
    const enhancedPrompt = promptData.enhancedPrompt;
    const errors = [];
    
    // Update metrics
    this.metrics.checkpointStats.promptImprovement.total++;
    
    // Calculate improvement metrics
    const specificityImprovement = this._calculateSpecificityImprovement(originalPrompt, enhancedPrompt);
    const structureImprovement = this._calculateStructureImprovement(originalPrompt, enhancedPrompt);
    const contextImprovement = this._calculateContextImprovement(originalPrompt, enhancedPrompt, context);
    const clarityImprovement = this._calculateClarityImprovement(originalPrompt, enhancedPrompt);
    
    // Overall improvement score (weighted average)
    const improvementScore = (
      specificityImprovement * 0.3 + 
      structureImprovement * 0.25 + 
      contextImprovement * 0.25 + 
      clarityImprovement * 0.2
    );
    
    if (improvementScore < this.promptImprovementThreshold) {
      errors.push(`Enhanced prompt improvement score (${improvementScore.toFixed(2)}) is below threshold (${this.promptImprovementThreshold})`);
    }
    
    // Specific improvement validations
    if (specificityImprovement < 0.4) {
      errors.push('Enhanced prompt does not significantly improve specificity');
    }
    
    if (structureImprovement < 0.4) {
      errors.push('Enhanced prompt does not significantly improve structure');
    }
    
    if (contextImprovement < 0.3) {
      errors.push('Enhanced prompt does not significantly improve context');
    }
    
    // Size validation - enhanced should be more comprehensive
    if (enhancedPrompt.length <= originalPrompt.length * 1.2 && specificityImprovement < 0.7) {
      errors.push('Enhanced prompt is not sufficiently more comprehensive than original');
    }
    
    const valid = errors.length === 0;
    
    // Update metrics
    if (valid) {
      this.metrics.checkpointStats.promptImprovement.passed++;
    }
    
    return {
      valid,
      errors,
      details: {
        improvementScore,
        specificityImprovement,
        structureImprovement,
        contextImprovement,
        clarityImprovement,
        originalLength: originalPrompt.length,
        enhancedLength: enhancedPrompt.length,
        lengthRatio: enhancedPrompt.length / originalPrompt.length
      }
    };
  }
  
  /**
   * Validate disambiguation accuracy
   * @param {Object} promptData - Data about the original and enhanced prompts
   * @param {Object} context - Additional context
   * @returns {Object} - Validation result
   */
  validateDisambiguationAccuracy(promptData, context = {}) {
    if (!promptData || !promptData.originalPrompt || !promptData.enhancedPrompt || !promptData.disambiguationResult) {
      return {
        valid: false,
        errors: ['Original prompt, enhanced prompt, and disambiguation result must be provided for disambiguation validation']
      };
    }
    
    const originalPrompt = promptData.originalPrompt;
    const enhancedPrompt = promptData.enhancedPrompt;
    const disambiguationResult = promptData.disambiguationResult;
    const errors = [];
    
    // Update metrics
    this.metrics.checkpointStats.disambiguationAccuracy.total++;
    
    // Check if disambiguation result includes clear content vs. meta-instruction separation
    if (!disambiguationResult.contentSegments || !disambiguationResult.metaInstructionSegments) {
      errors.push('Disambiguation result lacks clear separation of content vs. meta-instructions');
    }
    
    // Check if all original content is accounted for in disambiguation
    const contentCoverage = this._calculateContentCoverage(originalPrompt, disambiguationResult);
    if (contentCoverage < this.disambiguationAccuracyThreshold) {
      errors.push(`Disambiguation does not account for all original content (coverage: ${contentCoverage.toFixed(2)})`);
    }
    
    // Check if enhanced prompt correctly applies meta-instructions
    const metaInstructionApplication = this._validateMetaInstructionApplication(
      disambiguationResult.metaInstructionSegments,
      enhancedPrompt,
      context
    );
    
    if (!metaInstructionApplication.valid) {
      errors.push(...metaInstructionApplication.errors);
    }
    
    // Check for confidence-based handling
    if (!this._validateConfidenceBasedHandling(disambiguationResult)) {
      errors.push('Disambiguation lacks proper confidence-based segment handling');
    }
    
    const valid = errors.length === 0;
    
    // Update metrics
    if (valid) {
      this.metrics.checkpointStats.disambiguationAccuracy.passed++;
    }
    
    return {
      valid,
      errors,
      details: {
        contentCoverage,
        metaInstructionApplication: metaInstructionApplication.valid,
        confidenceBasedHandling: this._validateConfidenceBasedHandling(disambiguationResult),
        contentSegmentsCount: disambiguationResult.contentSegments?.length || 0,
        metaInstructionSegmentsCount: disambiguationResult.metaInstructionSegments?.length || 0
      }
    };
  }
  
  /**
   * Get validation metrics
   * @returns {Object} - Validation metrics
   */
  getMetrics() {
    // Calculate success rates for each checkpoint
    const checkpointSuccessRates = {};
    
    Object.entries(this.metrics.checkpointStats).forEach(([checkpoint, stats]) => {
      checkpointSuccessRates[checkpoint] = stats.total > 0 
        ? (stats.passed / stats.total) 
        : 0;
    });
    
    // Calculate overall success rate
    const overallSuccessRate = this.metrics.totalValidations > 0
      ? (this.metrics.passedValidations / this.metrics.totalValidations)
      : 0;
    
    return {
      ...this.metrics,
      checkpointSuccessRates,
      overallSuccessRate
    };
  }
  
  /**
   * Reset validation metrics
   */
  resetMetrics() {
    this.metrics = {
      totalValidations: 0,
      passedValidations: 0,
      failedValidations: 0,
      checkpointStats: {
        promptClarity: { total: 0, passed: 0 },
        promptCompleteness: { total: 0, passed: 0 },
        promptImprovement: { total: 0, passed: 0 },
        disambiguationAccuracy: { total: 0, passed: 0 }
      }
    };
  }
  
  // Helper methods for prompt clarity validation
  
  /**
   * Check if prompt contains clear action verbs
   * @param {string} prompt - The prompt to check
   * @returns {boolean} - Whether the prompt contains action verbs
   * @private
   */
  _containsActionVerbs(prompt) {
    const actionVerbs = [
      'create', 'build', 'implement', 'develop', 'design', 'write', 'code',
      'generate', 'construct', 'establish', 'define', 'configure', 'set up',
      'optimize', 'refactor', 'improve', 'fix', 'debug', 'test', 'deploy'
    ];
    
    // Check for presence of action verbs (case-insensitive)
    const lowerPrompt = prompt.toLowerCase();
    return actionVerbs.some(verb => {
      const regex = new RegExp(`\\b${verb}\\b`, 'i');
      return regex.test(lowerPrompt);
    });
  }
  
  /**
   * Calculate ambiguity score for a prompt
   * @param {string} prompt - The prompt to analyze
   * @returns {number} - Ambiguity score (0-1, lower is better)
   * @private
   */
  _calculateAmbiguityScore(prompt) {
    const ambiguousTerms = [
      'maybe', 'perhaps', 'possibly', 'might', 'could', 'may', 'some',
      'somehow', 'something', 'somewhat', 'several', 'various', 'a few',
      'not sure', 'not certain', 'unclear', 'ambiguous', 'vague',
      'etc', 'and so on', 'and more', 'or something'
    ];
    
    const ambiguousQualifiers = [
      'good', 'nice', 'better', 'best', 'great', 'awesome', 'cool',
      'decent', 'appropriate', 'suitable', 'proper', 'correct', 'right'
    ];
    
    // Count occurrences of ambiguous terms
    const lowerPrompt = prompt.toLowerCase();
    const ambiguousTermCount = ambiguousTerms.reduce((count, term) => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = lowerPrompt.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
    
    // Count occurrences of ambiguous qualifiers
    const ambiguousQualifierCount = ambiguousQualifiers.reduce((count, term) => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = lowerPrompt.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
    
    // Count lack of specific numbers or measurements
    const hasSpecificNumbers = /\b\d+(?:\.\d+)?(?:\s*(?:px|em|rem|%|ms|s|bytes|kb|mb|gb))?\b/i.test(prompt);
    const numberSpecificityPenalty = hasSpecificNumbers ? 0 : 0.1;
    
    // Calculate normalized ambiguity score
    const wordCount = prompt.split(/\s+/).length;
    const ambiguityScore = Math.min(
      1,
      ((ambiguousTermCount * 0.15) + (ambiguousQualifierCount * 0.05) + numberSpecificityPenalty) / 
      Math.max(1, wordCount / 50)  // Normalize by approximate paragraph length
    );
    
    return ambiguityScore;
  }
  
  /**
   * Check if prompt contains technical specificity
   * @param {string} prompt - The prompt to check
   * @param {Object} context - Additional context
   * @returns {boolean} - Whether the prompt contains technical specificity
   * @private
   */
  _containsTechnicalSpecificity(prompt, context = {}) {
    // Look for technical terms, frameworks, languages, or technologies
    const technicalPatterns = [
      // Programming languages
      /\b(?:javascript|typescript|python|java|c\+\+|c#|ruby|go|rust|php|swift|kotlin|scala)\b/i,
      
      // Frameworks and libraries
      /\b(?:react|angular|vue|node\.js|express|django|flask|spring|laravel|tensorflow|pytorch|pandas)\b/i,
      
      // Database technologies
      /\b(?:sql|mysql|postgresql|mongodb|cassandra|redis|sqlite|oracle|dynamodb|firestore)\b/i,
      
      // Web technologies
      /\b(?:html|css|dom|http|rest|api|graphql|json|xml|ajax|fetch|websocket)\b/i,
      
      // Software architecture terms
      /\b(?:mvc|mvvm|rest|soap|microservice|serverless|lambda|container|docker|kubernetes)\b/i,
      
      // Technical specifications
      /\b(?:\d+(?:\.\d+)?(?:\s*(?:px|em|rem|%|ms|s|bytes|kb|mb|gb))?)\b/i
    ];
    
    // Check if the prompt matches any technical patterns
    return technicalPatterns.some(pattern => pattern.test(prompt));
  }
  
  /**
   * Check if prompt contains success criteria
   * @param {string} prompt - The prompt to check
   * @returns {boolean} - Whether the prompt contains success criteria
   * @private
   */
  _containsSuccessCriteria(prompt) {
    // Look for success criteria sections or descriptions
    const successCriteriaPatterns = [
      /\b(?:success criteria|acceptance criteria|done when|completion criteria)\b/i,
      /\b(?:should (?:return|produce|generate|create|display|show))\b/i,
      /\b(?:expected (?:output|result|behavior|outcome))\b/i,
      /\b(?:test cases?|assertions?|validations?)\b/i,
      /\b(?:must|should|needs to) (?:be|have|include|support|handle)\b/i
    ];
    
    // Check if the prompt matches any success criteria patterns
    return successCriteriaPatterns.some(pattern => pattern.test(prompt));
  }
  
  // Helper methods for prompt completeness validation
  
  /**
   * Check for essential sections in the prompt
   * @param {string} prompt - The prompt to check
   * @returns {Array} - Missing essential sections
   * @private
   */
  _checkForEssentialSections(prompt) {
    const essentialSections = [
      { name: 'Context', patterns: [/\b(?:context|background|overview|setting|environment)\b/i] },
      { name: 'Task', patterns: [/\b(?:task|goal|objective|purpose|aim)\b/i] },
      { name: 'Requirements', patterns: [/\b(?:requirements?|specs?|specifications?|constraints?|limitations?)\b/i] },
      { name: 'Acceptance Criteria', patterns: [/\b(?:acceptance criteria|success criteria|expected results?|outcomes?)\b/i] }
    ];
    
    // Find missing sections
    const missingSections = essentialSections.filter(section => {
      return !section.patterns.some(pattern => pattern.test(prompt));
    }).map(section => section.name);
    
    return missingSections;
  }
  
  /**
   * Check if prompt contains relevant context
   * @param {string} prompt - The prompt to check
   * @param {Object} context - Additional context
   * @returns {boolean} - Whether the prompt contains relevant context
   * @private
   */
  _containsRelevantContext(prompt, context = {}) {
    // Look for project or implementation context
    const contextPatterns = [
      /\b(?:project|repository|codebase|application|system|platform)\b/i,
      /\b(?:current|existing|available|provided)\b/i,
      /\b(?:environment|setup|configuration|architecture)\b/i
    ];
    
    // Check if the prompt matches any context patterns
    return contextPatterns.some(pattern => pattern.test(prompt));
  }
  
  /**
   * Check if prompt contains requirements
   * @param {string} prompt - The prompt to check
   * @returns {boolean} - Whether the prompt contains requirements
   * @private
   */
  _containsRequirements(prompt) {
    // Look for requirements sections or descriptions
    const requirementsPatterns = [
      /\b(?:requirements?|specs?|specifications?|constraints?|limitations?)\b/i,
      /\b(?:must|should|needs to|has to) (?:be|have|include|support|handle)\b/i,
      /\b(?:necessary|required|essential|important|critical)\b/i
    ];
    
    // Check if the prompt matches any requirements patterns or contains numbered/bulleted lists
    return requirementsPatterns.some(pattern => pattern.test(prompt)) || 
           /(?:\d+\.\s|\*\s|-\s)/.test(prompt);
  }
  
  /**
   * Calculate completeness score
   * @param {string} prompt - The prompt to analyze
   * @param {Object} context - Additional context
   * @returns {number} - Completeness score (0-1)
   * @private
   */
  _calculateCompletenessScore(prompt, context = {}) {
    // Base score starts at 0.5
    let score = 0.5;
    
    // Add points for essential sections
    const missingSections = this._checkForEssentialSections(prompt);
    score += (1 - (missingSections.length / 4)) * 0.2;
    
    // Add points for context inclusion
    if (this._containsRelevantContext(prompt, context)) {
      score += 0.1;
    }
    
    // Add points for requirements
    if (this._containsRequirements(prompt)) {
      score += 0.1;
    }
    
    // Add points for specificity and clarity
    if (this._containsTechnicalSpecificity(prompt, context)) {
      score += 0.05;
    }
    
    if (this._containsSuccessCriteria(prompt)) {
      score += 0.05;
    }
    
    // Adjust for prompt length (longer prompts tend to be more complete)
    const normalizedLength = Math.min(1, prompt.length / 500);
    score += normalizedLength * 0.1;
    
    // Ensure score is between 0 and 1
    return Math.max(0, Math.min(1, score));
  }
  
  // Helper methods for prompt improvement validation
  
  /**
   * Calculate specificity improvement
   * @param {string} originalPrompt - The original prompt
   * @param {string} enhancedPrompt - The enhanced prompt
   * @returns {number} - Specificity improvement score (0-1)
   * @private
   */
  _calculateSpecificityImprovement(originalPrompt, enhancedPrompt) {
    // Specificity indicators: technical terms, numbers, specific requirements
    const specificityPatterns = [
      /\b(?:javascript|typescript|python|java|c\+\+|c#|ruby|go|rust|php|swift|kotlin|scala)\b/i,
      /\b(?:react|angular|vue|node\.js|express|django|flask|spring|laravel|tensorflow|pytorch)\b/i,
      /\b(?:\d+(?:\.\d+)?(?:\s*(?:px|em|rem|%|ms|s|bytes|kb|mb|gb))?)\b/i,
      /\b(?:must|should|needs to|has to) (?:be|have|include|support|handle)\b/i
    ];
    
    // Count specificity indicators in original and enhanced prompts
    const originalSpecificityCount = specificityPatterns.reduce((count, pattern) => {
      const matches = originalPrompt.match(pattern) || [];
      return count + matches.length;
    }, 0);
    
    const enhancedSpecificityCount = specificityPatterns.reduce((count, pattern) => {
      const matches = enhancedPrompt.match(pattern) || [];
      return count + matches.length;
    }, 0);
    
    // Calculate improvement score
    if (originalSpecificityCount === 0) {
      return enhancedSpecificityCount > 0 ? 1 : 0;
    }
    
    const specificityRatio = enhancedSpecificityCount / originalSpecificityCount;
    return Math.min(1, Math.max(0, (specificityRatio - 1) / 2));
  }
  
  /**
   * Calculate structure improvement
   * @param {string} originalPrompt - The original prompt
   * @param {string} enhancedPrompt - The enhanced prompt
   * @returns {number} - Structure improvement score (0-1)
   * @private
   */
  _calculateStructureImprovement(originalPrompt, enhancedPrompt) {
    // Structure indicators: sections, headings, lists, paragraphs
    const originalStructureScore = this._calculateStructureScore(originalPrompt);
    const enhancedStructureScore = this._calculateStructureScore(enhancedPrompt);
    
    // Calculate improvement
    if (originalStructureScore === 0) {
      return enhancedStructureScore;
    }
    
    const structureImprovement = (enhancedStructureScore - originalStructureScore) / 
                                Math.max(0.1, originalStructureScore);
    
    return Math.min(1, Math.max(0, structureImprovement));
  }
  
  /**
   * Calculate structure score for a prompt
   * @param {string} prompt - The prompt to analyze
   * @returns {number} - Structure score (0-1)
   * @private
   */
  _calculateStructureScore(prompt) {
    let score = 0;
    
    // Check for headings (lines with # or all caps followed by colon)
    const headings = (prompt.match(/(?:^|\n)(?:#+ [^#\n]+|\b[A-Z][A-Z\s]+:)/g) || []).length;
    score += Math.min(0.4, headings * 0.1);
    
    // Check for lists (numbered or bulleted)
    const listItems = (prompt.match(/(?:^|\n)(?:\d+\.|[\*\-•]) .+/g) || []).length;
    score += Math.min(0.3, listItems * 0.05);
    
    // Check for paragraphs (separated by blank lines)
    const paragraphs = prompt.split(/\n\s*\n/).length;
    score += Math.min(0.2, (paragraphs - 1) * 0.05);
    
    // Check for code blocks or examples
    const codeBlocks = (prompt.match(/```[\s\S]*?```/g) || []).length;
    score += Math.min(0.1, codeBlocks * 0.1);
    
    return Math.min(1, score);
  }
  
  /**
   * Calculate context improvement
   * @param {string} originalPrompt - The original prompt
   * @param {string} enhancedPrompt - The enhanced prompt
   * @param {Object} context - Additional context
   * @returns {number} - Context improvement score (0-1)
   * @private
   */
  _calculateContextImprovement(originalPrompt, enhancedPrompt, context = {}) {
    // Context indicators: project details, environment, background information
    const contextPatterns = [
      /\b(?:project|repository|codebase|application|system|platform)\b/i,
      /\b(?:environment|setup|configuration|architecture)\b/i,
      /\b(?:background|overview|context|situation|scenario)\b/i
    ];
    
    // Count context indicators in original and enhanced prompts
    const originalContextCount = contextPatterns.reduce((count, pattern) => {
      const matches = originalPrompt.match(pattern) || [];
      return count + matches.length;
    }, 0);
    
    const enhancedContextCount = contextPatterns.reduce((count, pattern) => {
      const matches = enhancedPrompt.match(pattern) || [];
      return count + matches.length;
    }, 0);
    
    // Check for dedicated context section
    const hasContextSection = /(?:^|\n)(?:#+\s*context|CONTEXT:|Background:)/i.test(enhancedPrompt);
    const contextSectionBonus = hasContextSection ? 0.3 : 0;
    
    // Calculate improvement score
    if (originalContextCount === 0) {
      return Math.min(1, enhancedContextCount * 0.1 + contextSectionBonus);
    }
    
    const contextImprovement = (enhancedContextCount - originalContextCount) / 
                              Math.max(1, originalContextCount);
    
    return Math.min(1, Math.max(0, contextImprovement * 0.7 + contextSectionBonus));
  }
  
  /**
   * Calculate clarity improvement
   * @param {string} originalPrompt - The original prompt
   * @param {string} enhancedPrompt - The enhanced prompt
   * @returns {number} - Clarity improvement score (0-1)
   * @private
   */
  _calculateClarityImprovement(originalPrompt, enhancedPrompt) {
    // Calculate ambiguity scores (lower is better)
    const originalAmbiguityScore = this._calculateAmbiguityScore(originalPrompt);
    const enhancedAmbiguityScore = this._calculateAmbiguityScore(enhancedPrompt);
    
    // Improvement is reduction in ambiguity
    const ambiguityReduction = Math.max(0, originalAmbiguityScore - enhancedAmbiguityScore);
    
    // Success criteria improvement
    const originalHasSuccessCriteria = this._containsSuccessCriteria(originalPrompt);
    const enhancedHasSuccessCriteria = this._containsSuccessCriteria(enhancedPrompt);
    const successCriteriaImprovement = !originalHasSuccessCriteria && enhancedHasSuccessCriteria ? 0.3 : 0;
    
    // Technical specificity improvement
    const originalHasTechnicalSpecificity = this._containsTechnicalSpecificity(originalPrompt, {});
    const enhancedHasTechnicalSpecificity = this._containsTechnicalSpecificity(enhancedPrompt, {});
    const technicalSpecificityImprovement = !originalHasTechnicalSpecificity && enhancedHasTechnicalSpecificity ? 0.3 : 0;
    
    // Calculate overall clarity improvement
    return Math.min(1, ambiguityReduction + successCriteriaImprovement + technicalSpecificityImprovement);
  }
  
  // Helper methods for disambiguation accuracy validation
  
  /**
   * Calculate content coverage in disambiguation
   * @param {string} originalPrompt - The original prompt
   * @param {Object} disambiguationResult - The disambiguation result
   * @returns {number} - Content coverage score (0-1)
   * @private
   */
  _calculateContentCoverage(originalPrompt, disambiguationResult) {
    if (!disambiguationResult.contentSegments && !disambiguationResult.metaInstructionSegments) {
      return 0;
    }
    
    // Combine all segments to see how much of the original prompt is covered
    const allSegments = [
      ...(disambiguationResult.contentSegments || []),
      ...(disambiguationResult.metaInstructionSegments || [])
    ];
    
    // Simple approximation of coverage by comparing total segment length to original prompt length
    const totalSegmentLength = allSegments.reduce((total, segment) => {
      return total + (segment.text ? segment.text.length : 0);
    }, 0);
    
    return Math.min(1, totalSegmentLength / Math.max(1, originalPrompt.length));
  }
  
  /**
   * Validate meta-instruction application
   * @param {Array} metaInstructionSegments - The meta-instruction segments
   * @param {string} enhancedPrompt - The enhanced prompt
   * @param {Object} context - Additional context
   * @returns {Object} - Validation result
   * @private
   */
  _validateMetaInstructionApplication(metaInstructionSegments, enhancedPrompt, context = {}) {
    if (!metaInstructionSegments || metaInstructionSegments.length === 0) {
      // No meta-instructions to apply, so automatically valid
      return { valid: true };
    }
    
    const errors = [];
    
    // Check each meta-instruction for application in the enhanced prompt
    metaInstructionSegments.forEach(segment => {
      if (!segment.text) return;
      
      // Extract key terms from the meta-instruction
      const keyTerms = this._extractKeyTerms(segment.text);
      
      // Check if key terms are reflected in the enhanced prompt
      const missingTerms = keyTerms.filter(term => {
        // Skip very common terms
        if (term.length <= 3) return false;
        
        // Check for presence of term in enhanced prompt
        return !enhancedPrompt.toLowerCase().includes(term.toLowerCase());
      });
      
      if (missingTerms.length > 0 && missingTerms.length > keyTerms.length * 0.3) {
        errors.push(`Meta-instruction not fully applied: key terms missing: ${missingTerms.join(', ')}`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Extract key terms from text
   * @param {string} text - The text to analyze
   * @returns {Array} - Extracted key terms
   * @private
   */
  _extractKeyTerms(text) {
    // Simplified key term extraction
    // Remove common words and extract significant terms
    
    const commonWords = [
      'the', 'a', 'an', 'and', 'or', 'but', 'for', 'in', 'on', 'at', 'to', 'with',
      'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between',
      'out', 'from', 'up', 'down', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should',
      'can', 'could', 'may', 'might', 'must', 'of', 'that', 'this', 'these', 'those',
      'it', 'its', 'his', 'her', 'they', 'them', 'their', 'our', 'your', 'my', 'use'
    ];
    
    // Split text into words, remove punctuation, filter out common words
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word));
    
    // Return unique words
    return [...new Set(words)];
  }
  
  /**
   * Validate confidence-based handling
   * @param {Object} disambiguationResult - The disambiguation result
   * @returns {boolean} - Whether confidence-based handling is valid
   * @private
   */
  _validateConfidenceBasedHandling(disambiguationResult) {
    // Check if disambiguation result includes confidence scores
    if (!disambiguationResult.contentSegments && !disambiguationResult.metaInstructionSegments) {
      return false;
    }
    
    // Check content segments
    const contentSegmentsHaveConfidence = disambiguationResult.contentSegments?.every(
      segment => typeof segment.confidence === 'number'
    ) || false;
    
    // Check meta-instruction segments
    const metaSegmentsHaveConfidence = disambiguationResult.metaInstructionSegments?.every(
      segment => typeof segment.confidence === 'number'
    ) || false;
    
    // Check if clarification was requested for low confidence segments
    const hasClarificationRequests = Boolean(disambiguationResult.clarificationRequests);
    
    // If there are segments with confidence < 0.8, there should be clarification requests
    const hasLowConfidenceSegments = [
      ...(disambiguationResult.contentSegments || []),
      ...(disambiguationResult.metaInstructionSegments || [])
    ].some(segment => segment.confidence < 0.8);
    
    // If there are low confidence segments, there should be clarification requests
    const clarificationConsistency = !hasLowConfidenceSegments || hasClarificationRequests;
    
    return (contentSegmentsHaveConfidence || !disambiguationResult.contentSegments) && 
           (metaSegmentsHaveConfidence || !disambiguationResult.metaInstructionSegments) &&
           clarificationConsistency;
  }
}

module.exports = { PromptEnhancerValidationCheckpoints };