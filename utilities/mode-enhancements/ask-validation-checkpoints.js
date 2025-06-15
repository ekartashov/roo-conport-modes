/**
 * Ask Validation Checkpoints
 * 
 * Specialized validation checkpoints for Ask Mode, focusing on information accuracy,
 * source reliability, answer completeness, and contextual relevance.
 */

const { ValidationCheckpoint, ValidationResult } = require('../conport-validation-manager');

/**
 * Validates the accuracy of information in answers
 */
class InformationAccuracyCheckpoint extends ValidationCheckpoint {
  constructor(options = {}) {
    super({
      name: 'informationAccuracy',
      description: 'Validates the accuracy of information provided in answers',
      ...options
    });
    
    this.accuracyFactors = options.accuracyFactors || [
      'factualConsistency',
      'technicalPrecision',
      'currentRelevance',
      'contextualCorrectness'
    ];
    
    this.requiredCitations = options.requiredCitations || false;
    this.citationThreshold = options.citationThreshold || 0.5; // Percentage of claims that should have citations
    this.threshold = options.threshold || 0.8;
  }
  
  /**
   * Validates information accuracy
   * @param {Object} answer - The answer to validate
   * @param {Object} context - Additional context for validation
   * @returns {ValidationResult} - Validation result
   */
  validate(answer, context = {}) {
    if (!answer || typeof answer !== 'object') {
      return new ValidationResult({
        valid: false,
        checkpoint: this.name,
        message: 'Answer must be a non-null object',
        details: { answer }
      });
    }
    
    // Check accuracy factors
    const factorScores = {};
    let totalFactorScore = 0;
    
    this.accuracyFactors.forEach(factor => {
      if (answer.accuracyAssessment && typeof answer.accuracyAssessment === 'object') {
        factorScores[factor] = answer.accuracyAssessment[factor] || 0;
      } else {
        factorScores[factor] = 0;
      }
      totalFactorScore += factorScores[factor];
    });
    
    const factorScore = totalFactorScore / this.accuracyFactors.length;
    
    // Check citations if required
    let citationScore = 1; // Default to perfect score if citations aren't required
    
    if (this.requiredCitations) {
      if (answer.claims && Array.isArray(answer.claims) && answer.claims.length > 0) {
        const claimsWithCitations = answer.claims.filter(claim => 
          claim.citation && (typeof claim.citation === 'string' || typeof claim.citation === 'object')
        );
        
        citationScore = claimsWithCitations.length / answer.claims.length;
      } else {
        // No claims defined, but citations required
        citationScore = 0;
      }
    }
    
    // Check for known inaccuracies
    const hasKnownInaccuracies = answer.knownInaccuracies && 
                               Array.isArray(answer.knownInaccuracies) && 
                               answer.knownInaccuracies.length > 0;
    
    // Calculate overall score
    const overallScore = (factorScore * 0.7) + (citationScore * 0.3);
    
    // Create validation result
    const valid = overallScore >= this.threshold && !hasKnownInaccuracies;
    
    const suggestedImprovements = [];
    
    // Add improvements for low-scoring factors
    this.accuracyFactors.forEach(factor => {
      if (factorScores[factor] < 0.7) {
        suggestedImprovements.push({
          type: 'accuracy',
          description: `Improve ${factor} by verifying information with authoritative sources`
        });
      }
    });
    
    // Add citation improvements if needed
    if (this.requiredCitations && citationScore < this.citationThreshold) {
      suggestedImprovements.push({
        type: 'citations',
        description: `Add citations for at least ${Math.round(this.citationThreshold * 100)}% of claims`
      });
    }
    
    // Add improvement for known inaccuracies
    if (hasKnownInaccuracies) {
      suggestedImprovements.push({
        type: 'critical',
        description: 'Correct known inaccuracies before providing the answer'
      });
    }
    
    return new ValidationResult({
      valid,
      checkpoint: this.name,
      message: valid 
        ? 'Information is accurate and well-supported' 
        : 'Information accuracy needs improvement',
      details: {
        factorScores,
        factorScore,
        citationScore,
        hasKnownInaccuracies,
        overallScore,
        threshold: this.threshold
      },
      suggestedImprovements
    });
  }
}

/**
 * Validates the reliability of information sources
 */
class SourceReliabilityCheckpoint extends ValidationCheckpoint {
  constructor(options = {}) {
    super({
      name: 'sourceReliability',
      description: 'Validates the reliability of information sources',
      ...options
    });
    
    this.reliabilityLevels = options.reliabilityLevels || {
      high: 1.0,
      medium: 0.7,
      low: 0.3,
      unknown: 0
    };
    
    this.minimumSourceCount = options.minimumSourceCount || 0;
    this.preferredSourceTypes = options.preferredSourceTypes || [
      'official_documentation',
      'peer_reviewed',
      'academic_publication',
      'industry_standard',
      'technical_specification'
    ];
    
    this.threshold = options.threshold || 0.7;
  }
  
  /**
   * Validates source reliability
   * @param {Object} answer - The answer to validate
   * @param {Object} context - Additional context for validation
   * @returns {ValidationResult} - Validation result
   */
  validate(answer, context = {}) {
    if (!answer || typeof answer !== 'object') {
      return new ValidationResult({
        valid: false,
        checkpoint: this.name,
        message: 'Answer must be a non-null object',
        details: { answer }
      });
    }
    
    // Check if sources are provided
    const sources = answer.sources || [];
    const sourceCount = Array.isArray(sources) ? sources.length : 0;
    const hasSufficientSources = sourceCount >= this.minimumSourceCount;
    
    // Calculate source reliability score
    let totalReliabilityScore = 0;
    const sourceScores = {};
    
    if (Array.isArray(sources) && sources.length > 0) {
      sources.forEach((source, index) => {
        let reliabilityLevel = 'unknown';
        
        if (source.reliability) {
          reliabilityLevel = source.reliability.toLowerCase();
        } else if (source.type && this.preferredSourceTypes.includes(source.type.toLowerCase())) {
          reliabilityLevel = 'high';
        }
        
        const score = this.reliabilityLevels[reliabilityLevel] || this.reliabilityLevels.unknown;
        sourceScores[`source_${index}`] = score;
        totalReliabilityScore += score;
      });
    }
    
    const averageReliabilityScore = sourceCount > 0 ? totalReliabilityScore / sourceCount : 0;
    
    // Check for preferred source types
    let preferredSourceCount = 0;
    if (Array.isArray(sources)) {
      preferredSourceCount = sources.filter(source => 
        source.type && this.preferredSourceTypes.includes(source.type.toLowerCase())
      ).length;
    }
    
    const preferredSourcePercentage = sourceCount > 0 ? preferredSourceCount / sourceCount : 0;
    
    // Calculate overall score
    const overallScore = hasSufficientSources 
      ? (averageReliabilityScore * 0.7) + (preferredSourcePercentage * 0.3)
      : 0;
    
    // Create validation result
    const valid = overallScore >= this.threshold;
    
    const suggestedImprovements = [];
    
    // Add improvements for insufficient sources
    if (!hasSufficientSources) {
      suggestedImprovements.push({
        type: 'critical',
        description: `Provide at least ${this.minimumSourceCount} reliable sources`
      });
    }
    
    // Add improvements for low reliability
    if (averageReliabilityScore < 0.7) {
      suggestedImprovements.push({
        type: 'reliability',
        description: 'Include more high-reliability sources (official documentation, technical specifications, etc.)'
      });
    }
    
    // Add improvements for preferred source types
    if (preferredSourcePercentage < 0.5 && sourceCount > 0) {
      suggestedImprovements.push({
        type: 'sources',
        description: `Include more preferred source types: ${this.preferredSourceTypes.join(', ')}`
      });
    }
    
    return new ValidationResult({
      valid,
      checkpoint: this.name,
      message: valid 
        ? 'Sources are reliable and sufficient' 
        : 'Source reliability needs improvement',
      details: {
        sourceCount,
        hasSufficientSources,
        sourceScores,
        averageReliabilityScore,
        preferredSourcePercentage,
        overallScore,
        threshold: this.threshold
      },
      suggestedImprovements
    });
  }
}

/**
 * Validates the completeness of answers
 */
class AnswerCompletenessCheckpoint extends ValidationCheckpoint {
  constructor(options = {}) {
    super({
      name: 'answerCompleteness',
      description: 'Validates that answers completely address the question',
      ...options
    });
    
    this.requiredComponents = options.requiredComponents || [
      'directAnswer',
      'explanation',
      'context'
    ];
    
    this.recommendedComponents = options.recommendedComponents || [
      'examples',
      'limitations',
      'alternatives',
      'furtherReading'
    ];
    
    this.threshold = options.threshold || 0.75;
  }
  
  /**
   * Validates answer completeness
   * @param {Object} answer - The answer to validate
   * @param {Object} context - Additional context for validation including the question
   * @returns {ValidationResult} - Validation result
   */
  validate(answer, context = {}) {
    if (!answer || typeof answer !== 'object') {
      return new ValidationResult({
        valid: false,
        checkpoint: this.name,
        message: 'Answer must be a non-null object',
        details: { answer }
      });
    }
    
    // Check required components
    const missingRequired = this.requiredComponents.filter(component => 
      !answer[component] || 
      (typeof answer[component] === 'string' && answer[component].trim() === '')
    );
    
    // Check recommended components
    const missingRecommended = this.recommendedComponents.filter(component => 
      !answer[component] || 
      (typeof answer[component] === 'string' && answer[component].trim() === '')
    );
    
    // Check if main aspects of the question are addressed
    let aspectsCovered = 1.0; // Default to perfect score if no question aspects are provided
    
    if (context.question && context.question.aspects && Array.isArray(context.question.aspects)) {
      const coveredAspects = context.question.aspects.filter(aspect => {
        // Look for this aspect in various parts of the answer
        const aspectLower = aspect.toLowerCase();
        return Object.values(answer).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(aspectLower);
          }
          return false;
        });
      });
      
      aspectsCovered = coveredAspects.length / context.question.aspects.length;
    }
    
    // Calculate overall score
    const requiredScore = (this.requiredComponents.length - missingRequired.length) / this.requiredComponents.length;
    const recommendedScore = (this.recommendedComponents.length - missingRecommended.length) / this.recommendedComponents.length;
    
    const overallScore = (requiredScore * 0.5) + (recommendedScore * 0.2) + (aspectsCovered * 0.3);
    
    // Create validation result
    const valid = missingRequired.length === 0 && overallScore >= this.threshold;
    
    const suggestedImprovements = [];
    
    // Add improvements for missing required components
    missingRequired.forEach(component => {
      suggestedImprovements.push({
        type: 'critical',
        description: `Add required component: ${component}`
      });
    });
    
    // Add improvements for missing recommended components
    missingRecommended.forEach(component => {
      suggestedImprovements.push({
        type: 'recommended',
        description: `Consider adding recommended component: ${component}`
      });
    });
    
    // Add improvements for uncovered aspects
    if (aspectsCovered < 1.0 && context.question && context.question.aspects) {
      const uncoveredAspects = context.question.aspects.filter(aspect => {
        const aspectLower = aspect.toLowerCase();
        return !Object.values(answer).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(aspectLower);
          }
          return false;
        });
      });
      
      if (uncoveredAspects.length > 0) {
        suggestedImprovements.push({
          type: 'coverage',
          description: `Address uncovered aspects of the question: ${uncoveredAspects.join(', ')}`
        });
      }
    }
    
    return new ValidationResult({
      valid,
      checkpoint: this.name,
      message: valid 
        ? 'Answer completely addresses the question' 
        : 'Answer completeness needs improvement',
      details: {
        missingRequired,
        missingRecommended,
        requiredScore,
        recommendedScore,
        aspectsCovered,
        overallScore,
        threshold: this.threshold
      },
      suggestedImprovements
    });
  }
}

/**
 * Validates the contextual relevance of answers
 */
class ContextualRelevanceCheckpoint extends ValidationCheckpoint {
  constructor(options = {}) {
    super({
      name: 'contextualRelevance',
      description: 'Validates that answers are relevant to the context and user needs',
      ...options
    });
    
    this.relevanceFactors = options.relevanceFactors || [
      'questionAlignment',
      'userContextRelevance',
      'technicalLevelMatch',
      'applicationFocus'
    ];
    
    this.threshold = options.threshold || 0.7;
  }
  
  /**
   * Validates contextual relevance
   * @param {Object} answer - The answer to validate
   * @param {Object} context - Additional context for validation
   * @returns {ValidationResult} - Validation result
   */
  validate(answer, context = {}) {
    if (!answer || typeof answer !== 'object') {
      return new ValidationResult({
        valid: false,
        checkpoint: this.name,
        message: 'Answer must be a non-null object',
        details: { answer }
      });
    }
    
    // Check relevance factors
    const factorScores = {};
    let totalFactorScore = 0;
    
    this.relevanceFactors.forEach(factor => {
      if (answer.relevanceAssessment && typeof answer.relevanceAssessment === 'object') {
        factorScores[factor] = answer.relevanceAssessment[factor] || 0;
      } else {
        factorScores[factor] = 0;
      }
      totalFactorScore += factorScores[factor];
    });
    
    const factorScore = totalFactorScore / this.relevanceFactors.length;
    
    // Check if the answer specifically addresses the question
    let questionAlignmentScore = 0.5; // Default to medium score if no question is provided
    
    if (context.question && context.question.text) {
      const keyTerms = this._extractKeyTerms(context.question.text);
      let termMatches = 0;
      
      keyTerms.forEach(term => {
        const termLower = term.toLowerCase();
        Object.values(answer).some(value => {
          if (typeof value === 'string' && value.toLowerCase().includes(termLower)) {
            termMatches++;
            return true;
          }
          return false;
        });
      });
      
      questionAlignmentScore = keyTerms.length > 0 ? termMatches / keyTerms.length : 0.5;
    }
    
    // Check for user context consideration
    let userContextScore = 0.5; // Default to medium score
    
    if (context.user && typeof context.user === 'object') {
      // If user context is provided and the answer mentions aspects of it, increase score
      const userContextKeys = Object.keys(context.user);
      let userContextMatches = 0;
      
      userContextKeys.forEach(key => {
        const userValue = context.user[key];
        if (typeof userValue === 'string' && 
            Object.values(answer).some(value => typeof value === 'string' && value.includes(userValue))) {
          userContextMatches++;
        }
      });
      
      userContextScore = userContextKeys.length > 0 ? userContextMatches / userContextKeys.length : 0.5;
    }
    
    // Calculate overall score
    const overallScore = (factorScore * 0.5) + (questionAlignmentScore * 0.3) + (userContextScore * 0.2);
    
    // Create validation result
    const valid = overallScore >= this.threshold;
    
    const suggestedImprovements = [];
    
    // Add improvements for low-scoring factors
    this.relevanceFactors.forEach(factor => {
      if (factorScores[factor] < 0.7) {
        suggestedImprovements.push({
          type: 'relevance',
          description: `Improve ${factor} by better aligning with user needs`
        });
      }
    });
    
    // Add improvement for question alignment
    if (questionAlignmentScore < 0.7) {
      suggestedImprovements.push({
        type: 'alignment',
        description: 'Better align the answer with the specific question asked'
      });
    }
    
    // Add improvement for user context
    if (userContextScore < 0.7) {
      suggestedImprovements.push({
        type: 'context',
        description: 'Consider user context more explicitly in the answer'
      });
    }
    
    return new ValidationResult({
      valid,
      checkpoint: this.name,
      message: valid 
        ? 'Answer is contextually relevant' 
        : 'Contextual relevance needs improvement',
      details: {
        factorScores,
        factorScore,
        questionAlignmentScore,
        userContextScore,
        overallScore,
        threshold: this.threshold
      },
      suggestedImprovements
    });
  }
  
  /**
   * Extract key terms from a question text
   * @param {string} questionText - The question text
   * @returns {string[]} - Array of key terms
   * @private
   */
  _extractKeyTerms(questionText) {
    if (!questionText || typeof questionText !== 'string') {
      return [];
    }
    
    // Simple extraction of non-stop words with length > 3
    const stopWords = [
      'the', 'and', 'but', 'for', 'nor', 'yet', 'with', 'that', 'this', 'from', 'what',
      'how', 'why', 'when', 'where', 'who', 'which', 'whom', 'whose', 'your', 'their',
      'about', 'above', 'across', 'after', 'against', 'along', 'among', 'around',
      'have', 'does', 'could', 'would', 'should', 'will', 'shall', 'may', 'might'
    ];
    
    return questionText
      .split(/\W+/)
      .filter(word => 
        word.length > 3 && 
        !stopWords.includes(word.toLowerCase()) &&
        !/^\d+$/.test(word) // Exclude pure numbers
      );
  }
}

module.exports = {
  InformationAccuracyCheckpoint,
  SourceReliabilityCheckpoint,
  AnswerCompletenessCheckpoint,
  ContextualRelevanceCheckpoint
};