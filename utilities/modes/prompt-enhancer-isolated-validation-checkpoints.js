/**
 * Prompt Enhancer Isolated Validation Checkpoints
 * 
 * Provides specialized validation logic for prompt enhancement in isolation
 * from project-specific context, focusing on universal best practices and
 * general prompt quality attributes.
 */

/**
 * Validation checkpoint for prompt clarity
 */
class PromptClarityCheckpoint {
  constructor() {
    this.name = 'PromptClarity';
    this.description = 'Validates that the enhanced prompt is clear and unambiguous';
  }
  
  /**
   * Validate prompt clarity
   * @param {Object} promptData - Prompt data for validation
   * @returns {Object} - Validation result
   */
  validate(promptData) {
    const { originalPrompt, enhancedPrompt } = promptData;
    
    // Check for action verbs that indicate clear task definition
    const actionVerbsRegex = /\b(create|implement|build|develop|write|design|code|optimize|refactor|fix)\b/i;
    const hasActionVerbs = actionVerbsRegex.test(enhancedPrompt);
    
    // Check for success criteria or acceptance criteria
    const successCriteriaRegex = /\*\*(?:acceptance criteria|success criteria|expected results):\*\*/i;
    const hasSuccessCriteria = successCriteriaRegex.test(enhancedPrompt);
    
    // Check for ambiguous language
    const ambiguousTerms = [
      'some', 'several', 'various', 'maybe', 'perhaps', 'possibly', 'etc',
      'and so on', 'good', 'nice', 'better', 'appropriately'
    ];
    
    let ambiguityScore = 0;
    let ambiguousTermsFound = [];
    
    for (const term of ambiguousTerms) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = enhancedPrompt.match(regex);
      
      if (matches) {
        ambiguousTermsFound.push(`${term} (${matches.length})`);
        ambiguityScore += matches.length * 0.05;
      }
    }
    
    // Calculate final score (lower is better)
    ambiguityScore = Math.min(1.0, ambiguityScore);
    
    // Check length ratio (enhanced should be substantively longer than original)
    const lengthRatio = enhancedPrompt.length / originalPrompt.length;
    const hasSubstantiveExpansion = lengthRatio > 1.3;
    
    // Check if the prompt has clear structure (headings)
    const headingsRegex = /\*\*([^*]+):\*\*/g;
    const headingsMatches = [...enhancedPrompt.matchAll(headingsRegex)];
    const hasStructure = headingsMatches.length >= 2;
    
    // Check if the prompt has bullet points or numbered lists
    const listItemsRegex = /(?:^|\n)(?:\d+\.|\*|-)\s+.+/g;
    const listItemsMatches = enhancedPrompt.match(listItemsRegex);
    const hasListItems = listItemsMatches && listItemsMatches.length >= 3;
    
    // Determine if validation passed
    const valid = 
      hasActionVerbs &&
      hasSuccessCriteria &&
      ambiguityScore < 0.3 &&
      hasStructure;
    
    // Collect errors
    const errors = [];
    
    if (!hasActionVerbs) {
      errors.push('Enhanced prompt lacks clear action verbs to define the task');
    }
    
    if (!hasSuccessCriteria) {
      errors.push('Enhanced prompt lacks explicit success or acceptance criteria');
    }
    
    if (ambiguityScore >= 0.3) {
      errors.push(`Enhanced prompt contains too many ambiguous terms: ${ambiguousTermsFound.join(', ')}`);
    }
    
    if (!hasStructure) {
      errors.push('Enhanced prompt lacks clear section headings for structure');
    }
    
    return {
      valid,
      errors: valid ? null : errors,
      details: {
        hasActionVerbs,
        hasSuccessCriteria,
        ambiguityScore,
        hasSubstantiveExpansion,
        hasStructure,
        hasListItems,
        lengthRatio
      }
    };
  }
}

/**
 * Validation checkpoint for prompt completeness
 */
class PromptCompletenessCheckpoint {
  constructor() {
    this.name = 'PromptCompleteness';
    this.description = 'Validates that the enhanced prompt contains all necessary components';
  }
  
  /**
   * Validate prompt completeness
   * @param {Object} promptData - Prompt data for validation
   * @returns {Object} - Validation result
   */
  validate(promptData) {
    const { originalPrompt, enhancedPrompt } = promptData;
    
    // Check for context (environment, background, etc.)
    const contextRegex = /\*\*(?:context|environment|background):\*\*/i;
    const hasContext = contextRegex.test(enhancedPrompt);
    
    // Check for requirements
    const requirementsRegex = /\*\*(?:requirements|technical requirements|specifications):\*\*/i;
    const hasRequirements = requirementsRegex.test(enhancedPrompt);
    
    // Check for acceptance criteria
    const criteriaRegex = /\*\*(?:acceptance criteria|success criteria|expected results):\*\*/i;
    const hasCriteria = criteriaRegex.test(enhancedPrompt);
    
    // Check for task definition
    const taskRegex = /\*\*(?:task|goal|objective):\*\*/i;
    const hasTask = taskRegex.test(enhancedPrompt);
    
    // Check for implementation details or notes
    const implementationRegex = /\*\*(?:implementation notes|technical details|implementation):\*\*/i;
    const hasImplementationNotes = implementationRegex.test(enhancedPrompt);
    
    // Check for content in each section
    const sections = [
      { name: 'Context', regex: /\*\*(?:context|environment|background):\*\*\s*\n([^\n]+)/i },
      { name: 'Task', regex: /\*\*(?:task|goal|objective):\*\*\s*\n([^\n]+)/i },
      { name: 'Requirements', regex: /\*\*(?:requirements|technical requirements|specifications):\*\*\s*\n((?:.+\n)+)/i },
      { name: 'Criteria', regex: /\*\*(?:acceptance criteria|success criteria|expected results):\*\*\s*\n((?:.+\n)+)/i }
    ];
    
    const sectionsWithContent = sections.filter(section => {
      const match = enhancedPrompt.match(section.regex);
      return match && match[1] && match[1].trim().length > 5;
    });
    
    const sectionsWithContentCount = sectionsWithContent.length;
    
    // Determine if validation passed
    // At minimum should have task, requirements and acceptance criteria
    const minRequiredSections = 3;
    const valid = 
      ((hasTask && hasRequirements && hasCriteria) || sectionsWithContentCount >= minRequiredSections);
    
    // Collect errors
    const errors = [];
    
    if (!hasContext) {
      errors.push('Enhanced prompt lacks context or background information');
    }
    
    if (!hasTask) {
      errors.push('Enhanced prompt lacks explicit task definition');
    }
    
    if (!hasRequirements) {
      errors.push('Enhanced prompt lacks specific requirements');
    }
    
    if (!hasCriteria) {
      errors.push('Enhanced prompt lacks acceptance or success criteria');
    }
    
    if (sectionsWithContentCount < minRequiredSections) {
      errors.push(`Enhanced prompt has only ${sectionsWithContentCount} of ${minRequiredSections} minimum required sections with content`);
    }
    
    return {
      valid,
      errors: valid ? null : errors,
      details: {
        hasContext,
        hasTask,
        hasRequirements,
        hasCriteria,
        hasImplementationNotes,
        sectionsWithContentCount
      }
    };
  }
}

/**
 * Validation checkpoint for prompt improvement
 */
class PromptImprovementCheckpoint {
  constructor() {
    this.name = 'PromptImprovement';
    this.description = 'Validates that the enhanced prompt is a substantial improvement over the original';
  }
  
  /**
   * Validate prompt improvement
   * @param {Object} promptData - Prompt data for validation
   * @returns {Object} - Validation result
   */
  validate(promptData) {
    const { originalPrompt, enhancedPrompt } = promptData;
    
    // Check length improvement
    const lengthRatio = enhancedPrompt.length / originalPrompt.length;
    const hasLengthImprovement = lengthRatio >= 2.0; // At least double the length
    
    // Check for improved structure (headings)
    const originalHeadings = (originalPrompt.match(/\*\*([^*]+):\*\*/g) || []).length;
    const enhancedHeadings = (enhancedPrompt.match(/\*\*([^*]+):\*\*/g) || []).length;
    const hasImprovedStructure = enhancedHeadings > originalHeadings;
    
    // Check for improved formatting (lists, code blocks, etc.)
    const originalLists = (originalPrompt.match(/(?:^|\n)(?:\d+\.|\*|-)\s+.+/g) || []).length;
    const enhancedLists = (enhancedPrompt.match(/(?:^|\n)(?:\d+\.|\*|-)\s+.+/g) || []).length;
    const hasImprovedFormatting = enhancedLists > originalLists;
    
    // Check for code blocks (for technical tasks)
    const codeBlockRegex = /```[\s\S]+?```/g;
    const originalCodeBlocks = (originalPrompt.match(codeBlockRegex) || []).length;
    const enhancedCodeBlocks = (enhancedPrompt.match(codeBlockRegex) || []).length;
    const hasCodeBlockImprovement = enhancedCodeBlocks >= originalCodeBlocks;
    
    // Check for examples or references
    const examplesRegex = /\*\*(?:examples|references|example implementation|sample code):\*\*/i;
    const hasExamplesOrReferences = examplesRegex.test(enhancedPrompt) && !examplesRegex.test(originalPrompt);
    
    // Check for technical details
    const technicalRegex = /\*\*(?:technical details|implementation notes|technical specifications):\*\*/i;
    const hasTechnicalDetails = technicalRegex.test(enhancedPrompt) && !technicalRegex.test(originalPrompt);
    
    // Determine if validation passed
    // Need majority of improvement factors (at least 3 out of 5)
    const improvementFactors = [
      hasLengthImprovement,
      hasImprovedStructure,
      hasImprovedFormatting,
      hasExamplesOrReferences,
      hasTechnicalDetails
    ];
    
    const improvementCount = improvementFactors.filter(factor => factor).length;
    const valid = improvementCount >= 3;
    
    // Collect errors
    const errors = [];
    
    if (!hasLengthImprovement) {
      errors.push('Enhanced prompt is not significantly longer than the original prompt');
    }
    
    if (!hasImprovedStructure) {
      errors.push('Enhanced prompt does not have improved structure compared to the original');
    }
    
    if (!hasImprovedFormatting) {
      errors.push('Enhanced prompt does not have improved formatting compared to the original');
    }
    
    if (!hasExamplesOrReferences) {
      errors.push('Enhanced prompt does not add examples or references');
    }
    
    if (!hasTechnicalDetails) {
      errors.push('Enhanced prompt does not add technical details or implementation notes');
    }
    
    return {
      valid,
      errors: valid ? null : errors,
      details: {
        lengthRatio,
        hasLengthImprovement,
        originalHeadings,
        enhancedHeadings,
        hasImprovedStructure,
        originalLists,
        enhancedLists,
        hasImprovedFormatting,
        hasExamplesOrReferences,
        hasTechnicalDetails,
        improvementCount
      }
    };
  }
}

/**
 * Validation checkpoint for isolation compliance
 */
class IsolationComplianceCheckpoint {
  constructor() {
    this.name = 'IsolationCompliance';
    this.description = 'Validates that the enhanced prompt does not contain project-specific references';
  }
  
  /**
   * Validate isolation compliance
   * @param {Object} promptData - Prompt data for validation
   * @returns {Object} - Validation result
   */
  validate(promptData) {
    const { enhancedPrompt } = promptData;
    
    // List of potential project-specific reference patterns to avoid
    const projectSpecificPatterns = [
      /\bour project\b/i,
      /\bthis project\b/i,
      /\bcurrent project\b/i,
      /\bthe project\b/i,
      /\bproject-specific\b/i,
      /\byour codebase\b/i,
      /\byour application\b/i,
      /\bcompany\b/i,
      /\borgani[zs]ation\b/i,
      /\bteam\b/i,
      /\b(?:we|you) (?:previously|already|currently|recently)\b/i,
      /\bspecific to (?:your|the|this)\b/i,
      /\bas (?:we|you) discussed\b/i,
      /\bas mentioned (?:before|previously|earlier)\b/i
    ];
    
    // Check for project-specific references
    const projectReferences = [];
    
    for (const pattern of projectSpecificPatterns) {
      const matches = enhancedPrompt.match(pattern);
      
      if (matches) {
        projectReferences.push(`"${matches[0]}"`);
      }
    }
    
    const hasProjectSpecificReferences = projectReferences.length > 0;
    
    // Determine if validation passed
    const valid = !hasProjectSpecificReferences;
    
    // Collect errors
    const errors = [];
    
    if (hasProjectSpecificReferences) {
      errors.push(`Enhanced prompt contains project-specific references: ${projectReferences.join(', ')}`);
    }
    
    return {
      valid,
      errors: valid ? null : errors,
      details: {
        hasProjectSpecificReferences,
        projectReferences
      }
    };
  }
}

/**
 * Validation checkpoint for universal applicability
 */
class UniversalApplicabilityCheckpoint {
  constructor() {
    this.name = 'UniversalApplicability';
    this.description = 'Validates that the enhanced prompt uses universal best practices and patterns';
  }
  
  /**
   * Validate universal applicability
   * @param {Object} promptData - Prompt data for validation
   * @returns {Object} - Validation result
   */
  validate(promptData) {
    const { enhancedPrompt } = promptData;
    
    // Check for generalized language and patterns
    const generalPatterns = [
      /\bindustry (?:standard|best practice|common pattern)\b/i,
      /\bstandard (?:convention|approach|pattern|practice)\b/i,
      /\bcommon (?:convention|approach|pattern|practice)\b/i,
      /\bwidely (?:used|adopted|accepted)\b/i,
      /\bgeneral (?:principle|guideline)\b/i,
      /\buniversal\b/i
    ];
    
    const generalPatternMatches = [];
    let hasGeneralPatterns = false;
    
    for (const pattern of generalPatterns) {
      const matches = enhancedPrompt.match(pattern);
      
      if (matches) {
        generalPatternMatches.push(`"${matches[0]}"`);
        hasGeneralPatterns = true;
      }
    }
    
    // Check if prompt refers to specific projects or implementations
    const specificReferencePatterns = [
      /\b(?:your|our|the|this) (?:specific|particular|custom) (?:implementation|project|codebase)\b/i,
      /\b(?:your|our) (?:existing|current) (?:solution|implementation|approach)\b/i,
      /\bin(?:-| )house\b/i,
      /\bpropriet(?:ary|arial)\b/i
    ];
    
    const specificReferenceMatches = [];
    let hasSpecificReferences = false;
    
    for (const pattern of specificReferencePatterns) {
      const matches = enhancedPrompt.match(pattern);
      
      if (matches) {
        specificReferenceMatches.push(`"${matches[0]}"`);
        hasSpecificReferences = true;
      }
    }
    
    // Check for technology-agnostic language
    const technologySpecificPatterns = [
      /\bonly works with\b/i,
      /\bspecific to\b/i,
      /\bmust use\b/i,
      /\brequires (?:version|release)\b/i
    ];
    
    const technologySpecificMatches = [];
    let hasTechnologySpecificLanguage = false;
    
    for (const pattern of technologySpecificPatterns) {
      const matches = enhancedPrompt.match(pattern);
      
      if (matches) {
        technologySpecificMatches.push(`"${matches[0]}"`);
        hasTechnologySpecificLanguage = true;
      }
    }
    
    // Determine if validation passed
    // Should either have general patterns or avoid specific references
    const valid = (hasGeneralPatterns || !hasSpecificReferences) && !hasTechnologySpecificLanguage;
    
    // Collect errors
    const errors = [];
    
    if (!hasGeneralPatterns) {
      errors.push('Enhanced prompt lacks references to universal best practices or standards');
    }
    
    if (hasSpecificReferences) {
      errors.push(`Enhanced prompt contains references to specific implementations: ${specificReferenceMatches.join(', ')}`);
    }
    
    if (hasTechnologySpecificLanguage) {
      errors.push(`Enhanced prompt contains overly specific technology constraints: ${technologySpecificMatches.join(', ')}`);
    }
    
    return {
      valid,
      errors: valid ? null : errors,
      details: {
        hasGeneralPatterns,
        generalPatternMatches,
        hasSpecificReferences,
        specificReferenceMatches,
        hasTechnologySpecificLanguage,
        technologySpecificMatches
      }
    };
  }
}

/**
 * Prompt Enhancer Isolated Validation Checkpoints
 */
class PromptEnhancerIsolatedValidationCheckpoints {
  constructor() {
    this.mode = 'prompt-enhancer-isolated';
    
    // Initialize checkpoints
    this.checkpoints = [
      new PromptClarityCheckpoint(),
      new PromptCompletenessCheckpoint(),
      new PromptImprovementCheckpoint(),
      new IsolationComplianceCheckpoint(),
      new UniversalApplicabilityCheckpoint()
    ];
  }
  
  /**
   * Get all validation checkpoints
   * @returns {Array} - Array of validation checkpoints
   */
  getCheckpoints() {
    return this.checkpoints;
  }
  
  /**
   * Get a specific checkpoint by name
   * @param {string} name - Checkpoint name
   * @returns {Object|null} - Checkpoint object or null if not found
   */
  getCheckpoint(name) {
    return this.checkpoints.find(checkpoint => checkpoint.name === name) || null;
  }
  
  /**
   * Add a custom checkpoint
   * @param {Object} checkpoint - Custom checkpoint to add
   */
  addCheckpoint(checkpoint) {
    this.checkpoints.push(checkpoint);
  }
  
  /**
   * Remove a checkpoint by name
   * @param {string} name - Checkpoint name to remove
   * @returns {boolean} - True if checkpoint was removed, false otherwise
   */
  removeCheckpoint(name) {
    const index = this.checkpoints.findIndex(checkpoint => checkpoint.name === name);
    
    if (index !== -1) {
      this.checkpoints.splice(index, 1);
      return true;
    }
    
    return false;
  }
}

module.exports = { PromptEnhancerIsolatedValidationCheckpoints };