/**
 * Docs Validation Checkpoints
 * 
 * Specialized validation checkpoints for Docs Mode, focusing on documentation
 * completeness, clarity, consistency, and knowledge preservation.
 */

const { ValidationCheckpoint, ValidationResult } = require('../conport-validation-manager');

/**
 * Validates documentation completeness
 */
class DocumentationCompletenessCheckpoint extends ValidationCheckpoint {
  constructor(options = {}) {
    super({
      name: 'documentationCompleteness',
      description: 'Validates that documentation covers all required elements',
      ...options
    });
    
    this.requiredSections = options.requiredSections || [
      'overview',
      'usage',
      'parameters',
      'returns',
      'examples'
    ];
    
    this.recommendedSections = options.recommendedSections || [
      'installation',
      'configuration',
      'advanced_usage',
      'troubleshooting',
      'related_topics'
    ];
    
    this.sectionWeights = options.sectionWeights || {
      'overview': 1.0,
      'usage': 1.0,
      'parameters': 1.0,
      'returns': 1.0,
      'examples': 1.0,
      'installation': 0.7,
      'configuration': 0.7,
      'advanced_usage': 0.5,
      'troubleshooting': 0.6,
      'related_topics': 0.4
    };
    
    this.threshold = options.threshold || 0.8;
  }
  
  /**
   * Validates documentation completeness
   * @param {Object} documentation - The documentation to validate
   * @param {Object} context - Additional context for validation
   * @returns {ValidationResult} - Validation result
   */
  validate(documentation, context = {}) {
    if (!documentation || typeof documentation !== 'object') {
      return new ValidationResult({
        valid: false,
        checkpoint: this.name,
        message: 'Documentation must be a non-null object',
        details: { documentation }
      });
    }
    
    // Check for required sections
    const missingSections = this.requiredSections.filter(section => {
      return !documentation[section] || 
        (typeof documentation[section] === 'string' && documentation[section].trim() === '') ||
        (typeof documentation[section] === 'object' && Object.keys(documentation[section]).length === 0);
    });
    
    // Check for recommended sections
    const missingRecommendedSections = this.recommendedSections.filter(section => {
      return !documentation[section] || 
        (typeof documentation[section] === 'string' && documentation[section].trim() === '') ||
        (typeof documentation[section] === 'object' && Object.keys(documentation[section]).length === 0);
    });
    
    // Calculate completeness score
    let totalScore = 0;
    let totalWeight = 0;
    
    // Score required sections
    this.requiredSections.forEach(section => {
      const weight = this.sectionWeights[section] || 1.0;
      totalWeight += weight;
      
      if (!missingSections.includes(section)) {
        totalScore += weight;
      }
    });
    
    // Score recommended sections
    this.recommendedSections.forEach(section => {
      const weight = this.sectionWeights[section] || 0.5;
      totalWeight += weight;
      
      if (!missingRecommendedSections.includes(section)) {
        totalScore += weight;
      }
    });
    
    const completenessScore = totalWeight > 0 ? totalScore / totalWeight : 0;
    
    // Create validation result
    const valid = missingSections.length === 0 && completenessScore >= this.threshold;
    
    const suggestedImprovements = [];
    
    // Add improvements for missing required sections
    missingSections.forEach(section => {
      suggestedImprovements.push({
        type: 'critical',
        description: `Add required section: ${section}`
      });
    });
    
    // Add improvements for missing recommended sections
    missingRecommendedSections.forEach(section => {
      suggestedImprovements.push({
        type: 'recommended',
        description: `Consider adding recommended section: ${section}`
      });
    });
    
    return new ValidationResult({
      valid,
      checkpoint: this.name,
      message: valid 
        ? 'Documentation includes all required sections' 
        : 'Documentation is missing required sections',
      details: {
        missingSections,
        missingRecommendedSections,
        completenessScore,
        threshold: this.threshold
      },
      suggestedImprovements
    });
  }
}

/**
 * Validates documentation clarity
 */
class DocumentationClarityCheckpoint extends ValidationCheckpoint {
  constructor(options = {}) {
    super({
      name: 'documentationClarity',
      description: 'Validates that documentation is clear, concise, and understandable',
      ...options
    });
    
    this.clarityFactors = options.clarityFactors || [
      'languageSimplicity',
      'conceptualClarity',
      'structuralOrganization',
      'visualAids'
    ];
    
    this.threshold = options.threshold || 0.7;
    this.complexitySensitivity = options.complexitySensitivity || 0.5;
  }
  
  /**
   * Validates documentation clarity
   * @param {Object} documentation - The documentation to validate
   * @param {Object} context - Additional context for validation
   * @returns {ValidationResult} - Validation result
   */
  validate(documentation, context = {}) {
    if (!documentation || typeof documentation !== 'object') {
      return new ValidationResult({
        valid: false,
        checkpoint: this.name,
        message: 'Documentation must be a non-null object',
        details: { documentation }
      });
    }
    
    // Check clarity factors
    const factorScores = {};
    let totalFactorScore = 0;
    
    this.clarityFactors.forEach(factor => {
      if (documentation.clarityAssessment && typeof documentation.clarityAssessment === 'object') {
        factorScores[factor] = documentation.clarityAssessment[factor] || 0;
      } else {
        factorScores[factor] = 0;
      }
      totalFactorScore += factorScores[factor];
    });
    
    const factorScore = totalFactorScore / this.clarityFactors.length;
    
    // Check readability metrics
    let readabilityScore = 0.5; // Default to medium if not provided
    
    if (documentation.readabilityMetrics && typeof documentation.readabilityMetrics === 'object') {
      // If readability metrics are provided, calculate score
      const { fleschReadingEase, avgSentenceLength, complexWordPercentage } = documentation.readabilityMetrics;
      
      if (typeof fleschReadingEase === 'number') {
        // Convert Flesch Reading Ease (0-100) to score (0-1)
        // Higher FRE is better, aim for 60+
        const fresScore = Math.min(1, Math.max(0, fleschReadingEase / 100));
        readabilityScore = fresScore;
      } else if (typeof avgSentenceLength === 'number' && typeof complexWordPercentage === 'number') {
        // Shorter sentences and fewer complex words are better
        const sentenceScore = Math.min(1, Math.max(0, 1 - (avgSentenceLength / 40)));
        const complexityScore = Math.min(1, Math.max(0, 1 - complexWordPercentage));
        readabilityScore = (sentenceScore + complexityScore) / 2;
      }
    }
    
    // Check for code examples and visual aids
    const hasCodeExamples = documentation.examples && 
      (typeof documentation.examples === 'string' || 
       (Array.isArray(documentation.examples) && documentation.examples.length > 0));
    
    const hasVisualAids = documentation.visualAids && 
      (typeof documentation.visualAids === 'string' || 
       (Array.isArray(documentation.visualAids) && documentation.visualAids.length > 0));
    
    // Adjust for topic complexity if provided
    let complexityAdjustment = 0;
    
    if (context.topicComplexity && typeof context.topicComplexity === 'number') {
      // Higher complexity requires better clarity
      complexityAdjustment = (context.topicComplexity - 0.5) * this.complexitySensitivity;
    }
    
    // Calculate overall score
    const overallScore = (
      (factorScore * 0.4) + 
      (readabilityScore * 0.3) + 
      (hasCodeExamples ? 0.15 : 0) + 
      (hasVisualAids ? 0.15 : 0)
    ) - complexityAdjustment;
    
    // Create validation result
    const valid = overallScore >= this.threshold;
    
    const suggestedImprovements = [];
    
    // Add improvements for low-scoring factors
    this.clarityFactors.forEach(factor => {
      if (factorScores[factor] < 0.6) {
        suggestedImprovements.push({
          type: 'clarity',
          description: `Improve ${factor} in documentation`
        });
      }
    });
    
    // Add improvements for readability
    if (readabilityScore < 0.6) {
      suggestedImprovements.push({
        type: 'readability',
        description: 'Improve readability by using shorter sentences and simpler language'
      });
    }
    
    // Add improvements for code examples and visual aids
    if (!hasCodeExamples) {
      suggestedImprovements.push({
        type: 'examples',
        description: 'Add code examples to illustrate key concepts'
      });
    }
    
    if (!hasVisualAids) {
      suggestedImprovements.push({
        type: 'visualAids',
        description: 'Consider adding diagrams or other visual aids to enhance understanding'
      });
    }
    
    return new ValidationResult({
      valid,
      checkpoint: this.name,
      message: valid 
        ? 'Documentation is clear and understandable' 
        : 'Documentation clarity needs improvement',
      details: {
        factorScores,
        factorScore,
        readabilityScore,
        hasCodeExamples,
        hasVisualAids,
        complexityAdjustment,
        overallScore,
        threshold: this.threshold
      },
      suggestedImprovements
    });
  }
}

/**
 * Validates documentation consistency
 */
class DocumentationConsistencyCheckpoint extends ValidationCheckpoint {
  constructor(options = {}) {
    super({
      name: 'documentationConsistency',
      description: 'Validates that documentation follows consistent style, terminology, and formatting',
      ...options
    });
    
    this.consistencyFactors = options.consistencyFactors || [
      'terminologyConsistency',
      'styleConsistency',
      'formattingConsistency',
      'structureConsistency'
    ];
    
    this.styleGuideAdherence = options.styleGuideAdherence !== undefined ? options.styleGuideAdherence : true;
    this.threshold = options.threshold || 0.7;
  }
  
  /**
   * Validates documentation consistency
   * @param {Object} documentation - The documentation to validate
   * @param {Object} context - Additional context for validation
   * @returns {ValidationResult} - Validation result
   */
  validate(documentation, context = {}) {
    if (!documentation || typeof documentation !== 'object') {
      return new ValidationResult({
        valid: false,
        checkpoint: this.name,
        message: 'Documentation must be a non-null object',
        details: { documentation }
      });
    }
    
    // Check consistency factors
    const factorScores = {};
    let totalFactorScore = 0;
    
    this.consistencyFactors.forEach(factor => {
      if (documentation.consistencyAssessment && typeof documentation.consistencyAssessment === 'object') {
        factorScores[factor] = documentation.consistencyAssessment[factor] || 0;
      } else {
        factorScores[factor] = 0;
      }
      totalFactorScore += factorScores[factor];
    });
    
    const factorScore = totalFactorScore / this.consistencyFactors.length;
    
    // Check style guide adherence
    let styleGuideScore = 0.5; // Default to medium if not provided
    
    if (this.styleGuideAdherence && documentation.styleGuideAdherence !== undefined) {
      styleGuideScore = typeof documentation.styleGuideAdherence === 'number' 
        ? documentation.styleGuideAdherence 
        : (documentation.styleGuideAdherence === true ? 1.0 : 0.0);
    }
    
    // Check terminology consistency
    let terminologyScore = 0.5; // Default to medium if not provided
    
    if (documentation.terminologyConsistency !== undefined) {
      terminologyScore = typeof documentation.terminologyConsistency === 'number'
        ? documentation.terminologyConsistency
        : (documentation.terminologyConsistency === true ? 1.0 : 0.0);
    }
    
    // Calculate overall score
    const overallScore = (factorScore * 0.4) + (styleGuideScore * 0.3) + (terminologyScore * 0.3);
    
    // Create validation result
    const valid = overallScore >= this.threshold;
    
    const suggestedImprovements = [];
    
    // Add improvements for low-scoring factors
    this.consistencyFactors.forEach(factor => {
      if (factorScores[factor] < 0.6) {
        suggestedImprovements.push({
          type: 'consistency',
          description: `Improve ${factor} in documentation`
        });
      }
    });
    
    // Add improvements for style guide adherence
    if (styleGuideScore < 0.6) {
      suggestedImprovements.push({
        type: 'styleGuide',
        description: 'Ensure consistent adherence to the project style guide'
      });
    }
    
    // Add improvements for terminology consistency
    if (terminologyScore < 0.6) {
      suggestedImprovements.push({
        type: 'terminology',
        description: 'Use consistent terminology throughout the documentation'
      });
    }
    
    return new ValidationResult({
      valid,
      checkpoint: this.name,
      message: valid 
        ? 'Documentation follows consistent style and formatting' 
        : 'Documentation consistency needs improvement',
      details: {
        factorScores,
        factorScore,
        styleGuideScore,
        terminologyScore,
        overallScore,
        threshold: this.threshold
      },
      suggestedImprovements
    });
  }
}

/**
 * Validates documentation knowledge preservation
 */
class KnowledgePreservationCheckpoint extends ValidationCheckpoint {
  constructor(options = {}) {
    super({
      name: 'knowledgePreservation',
      description: 'Validates that documentation effectively preserves project knowledge',
      ...options
    });
    
    this.preservationFactors = options.preservationFactors || [
      'decisionContext',
      'designRationale',
      'usagePrinciples',
      'limitations',
      'evolutionHistory'
    ];
    
    this.conportIntegration = options.conportIntegration !== undefined ? options.conportIntegration : true;
    this.threshold = options.threshold || 0.6;
  }
  
  /**
   * Validates knowledge preservation
   * @param {Object} documentation - The documentation to validate
   * @param {Object} context - Additional context for validation
   * @returns {ValidationResult} - Validation result
   */
  validate(documentation, context = {}) {
    if (!documentation || typeof documentation !== 'object') {
      return new ValidationResult({
        valid: false,
        checkpoint: this.name,
        message: 'Documentation must be a non-null object',
        details: { documentation }
      });
    }
    
    // Check preservation factors
    const factorScores = {};
    let totalFactorScore = 0;
    
    this.preservationFactors.forEach(factor => {
      if (documentation.preservationAssessment && typeof documentation.preservationAssessment === 'object') {
        factorScores[factor] = documentation.preservationAssessment[factor] || 0;
      } else {
        factorScores[factor] = 0;
      }
      totalFactorScore += factorScores[factor];
    });
    
    const factorScore = totalFactorScore / this.preservationFactors.length;
    
    // Check for decision explanations
    const hasDecisionExplanations = documentation.decisions && 
      (typeof documentation.decisions === 'object' && Object.keys(documentation.decisions).length > 0);
    
    // Check for ConPort references
    const hasConportReferences = documentation.conportReferences && 
      (Array.isArray(documentation.conportReferences) && documentation.conportReferences.length > 0);
    
    // Check for version history
    const hasVersionHistory = documentation.versionHistory && 
      (Array.isArray(documentation.versionHistory) && documentation.versionHistory.length > 0);
    
    // Calculate ConPort integration score
    let conportScore = 0;
    
    if (this.conportIntegration) {
      conportScore = hasConportReferences ? 1.0 : 0.0;
    } else {
      conportScore = 0.5; // Neutral if not required
    }
    
    // Calculate overall score
    const overallScore = (
      (factorScore * 0.4) + 
      (hasDecisionExplanations ? 0.2 : 0) + 
      (conportScore * 0.2) + 
      (hasVersionHistory ? 0.2 : 0)
    );
    
    // Create validation result
    const valid = overallScore >= this.threshold;
    
    const suggestedImprovements = [];
    
    // Add improvements for low-scoring factors
    this.preservationFactors.forEach(factor => {
      if (factorScores[factor] < 0.6) {
        suggestedImprovements.push({
          type: 'preservation',
          description: `Improve ${factor} in documentation`
        });
      }
    });
    
    // Add improvements for missing decision explanations
    if (!hasDecisionExplanations) {
      suggestedImprovements.push({
        type: 'decisions',
        description: 'Add explanations for key design and implementation decisions'
      });
    }
    
    // Add improvements for ConPort integration
    if (this.conportIntegration && !hasConportReferences) {
      suggestedImprovements.push({
        type: 'conport',
        description: 'Add references to relevant ConPort items (decisions, patterns, etc.)'
      });
    }
    
    // Add improvements for version history
    if (!hasVersionHistory) {
      suggestedImprovements.push({
        type: 'versionHistory',
        description: 'Add version history to track document evolution'
      });
    }
    
    return new ValidationResult({
      valid,
      checkpoint: this.name,
      message: valid 
        ? 'Documentation effectively preserves project knowledge' 
        : 'Knowledge preservation needs improvement',
      details: {
        factorScores,
        factorScore,
        hasDecisionExplanations,
        hasConportReferences,
        hasVersionHistory,
        conportScore,
        overallScore,
        threshold: this.threshold
      },
      suggestedImprovements
    });
  }
}

module.exports = {
  DocumentationCompletenessCheckpoint,
  DocumentationClarityCheckpoint,
  DocumentationConsistencyCheckpoint,
  KnowledgePreservationCheckpoint
};