/**
 * Strategic Insight Validation System (SIVS) - Core Layer
 * 
 * This module provides the core functionality of the SIVS system,
 * building on the validation layer to deliver strategic insight validation
 * capabilities across multiple dimensions.
 */

const validationModule = require('./sivs-validation');

/**
 * The InsightValidator class provides comprehensive validation of knowledge insights
 * across multiple dimensions: quality, relevance, coherence, alignment, and risk.
 */
class InsightValidator {
  /**
   * Creates a new InsightValidator
   * @param {Object} config - Configuration options for the validator
   */
  constructor(config = {}) {
    this.config = {
      dimensions: config.dimensions || ['quality', 'relevance', 'coherence', 'alignment', 'risk'],
      thresholds: config.thresholds || {
        quality: 0.6,
        relevance: 0.7,
        coherence: 0.6,
        alignment: 0.7,
        risk: 0.4  // For risk, lower is better
      },
      weights: config.weights || {
        quality: 0.2,
        relevance: 0.3,
        coherence: 0.2,
        alignment: 0.2,
        risk: 0.1
      },
      validationOptions: config.validationOptions || {}
    };
  }

  /**
   * Validates an insight across multiple dimensions
   * @param {Object} insight - The insight to validate
   * @param {Object} context - The context for validation
   * @returns {Object} Comprehensive validation results
   */
  validateInsight(insight, context) {
    const results = {
      dimensions: {},
      isValid: true,
      overallScore: 0,
      compositeScores: {},
      issues: [],
      strengths: [],
      suggestions: []
    };
    
    // Validate each enabled dimension
    for (const dimension of this.config.dimensions) {
      const dimensionResult = this.validateDimension(dimension, insight, context);
      results.dimensions[dimension] = dimensionResult;
      
      // If any dimension fails validation, the insight is not valid
      if (!dimensionResult.isValid) {
        results.isValid = false;
      }
      
      // Collect issues and suggestions
      if (dimensionResult.issues && dimensionResult.issues.length > 0) {
        results.issues.push(...dimensionResult.issues.map(issue => `[${dimension}] ${issue}`));
      }
      
      if (dimensionResult.evidences && dimensionResult.evidences.length > 0) {
        results.strengths.push(...dimensionResult.evidences.map(evidence => `[${dimension}] ${evidence}`));
      }
      
      if (dimensionResult.suggestions && dimensionResult.suggestions.length > 0) {
        results.suggestions.push(...dimensionResult.suggestions.map(suggestion => `[${dimension}] ${suggestion}`));
      }
    }
    
    // Calculate composite scores by category
    results.compositeScores = this.calculateCompositeScores(results.dimensions);
    
    // Calculate overall score as weighted average of dimension scores
    results.overallScore = this.calculateOverallScore(results.dimensions);
    
    return results;
  }

  /**
   * Validates an insight on a specific dimension
   * @param {string} dimension - The dimension to validate
   * @param {Object} insight - The insight to validate
   * @param {Object} context - The context for validation
   * @returns {Object} Dimension-specific validation results
   */
  validateDimension(dimension, insight, context) {
    const options = this.config.validationOptions[dimension] || {};
    
    switch (dimension) {
      case 'quality':
        return validationModule.validateQuality(insight, options);
      
      case 'relevance':
        return validationModule.validateRelevance(insight, context, options);
      
      case 'coherence':
        return validationModule.validateCoherence(insight, options);
      
      case 'alignment':
        return validationModule.validateAlignment(insight, context, options);
      
      case 'risk':
        return validationModule.validateRisk(insight, context, options);
      
      default:
        throw new Error(`Unsupported validation dimension: ${dimension}`);
    }
  }

  /**
   * Calculates composite scores from dimension results
   * @param {Object} dimensionResults - Results for each dimension
   * @returns {Object} Composite scores by category
   */
  calculateCompositeScores(dimensionResults) {
    const composites = {
      trustworthiness: 0,
      applicability: 0,
      sustainability: 0
    };
    
    // Calculate trustworthiness score (quality + coherence)
    let trustFactors = 0;
    let trustTotal = 0;
    
    if (dimensionResults.quality) {
      trustFactors += 1;
      trustTotal += dimensionResults.quality.overallScore;
    }
    
    if (dimensionResults.coherence) {
      trustFactors += 1;
      trustTotal += dimensionResults.coherence.overallScore;
    }
    
    composites.trustworthiness = trustFactors > 0 ? trustTotal / trustFactors : 0;
    
    // Calculate applicability score (relevance + alignment)
    let appFactors = 0;
    let appTotal = 0;
    
    if (dimensionResults.relevance) {
      appFactors += 1;
      appTotal += dimensionResults.relevance.overallScore;
    }
    
    if (dimensionResults.alignment) {
      appFactors += 1;
      appTotal += dimensionResults.alignment.overallScore;
    }
    
    composites.applicability = appFactors > 0 ? appTotal / appFactors : 0;
    
    // Calculate sustainability score (inverse of risk)
    if (dimensionResults.risk) {
      // For risk, lower is better, so we invert the score for sustainability
      composites.sustainability = 1 - dimensionResults.risk.overallScore;
    }
    
    return composites;
  }

  /**
   * Calculates overall score from dimension results
   * @param {Object} dimensionResults - Results for each dimension
   * @returns {number} Overall score between 0 and 1
   */
  calculateOverallScore(dimensionResults) {
    let weightedSum = 0;
    let weightTotal = 0;
    
    for (const [dimension, result] of Object.entries(dimensionResults)) {
      const weight = this.config.weights[dimension] || 0;
      
      // For risk dimension, lower is better, so we invert the score
      const score = dimension === 'risk' ? 
        (1 - result.overallScore) : result.overallScore;
      
      weightedSum += score * weight;
      weightTotal += weight;
    }
    
    return weightTotal > 0 ? weightedSum / weightTotal : 0;
  }
}

/**
 * ValidationContext manages the context used for validation,
 * including domain, task, constraints, and other contextual elements.
 */
class ValidationContext {
  /**
   * Creates a ValidationContext
   * @param {Object} initialContext - Initial context data
   */
  constructor(initialContext = {}) {
    this.context = {
      domain: initialContext.domain || '',
      task: initialContext.task || '',
      constraints: initialContext.constraints || {},
      standards: initialContext.standards || [],
      principles: initialContext.principles || [],
      practices: initialContext.practices || [],
      riskFactors: initialContext.riskFactors || [],
      criticalRiskAreas: initialContext.criticalRiskAreas || [],
      ...initialContext  // Include any other context properties
    };
  }

  /**
   * Updates the context with new values
   * @param {Object} updates - Context updates
   * @returns {ValidationContext} This context instance
   */
  update(updates) {
    this.context = {
      ...this.context,
      ...updates
    };
    return this;
  }

  /**
   * Gets the current context
   * @returns {Object} The current context
   */
  getContext() {
    return this.context;
  }

  /**
   * Creates a validation context from a ConPort product context
   * @param {Object} productContext - ConPort product context
   * @returns {ValidationContext} A new validation context
   */
  static fromProductContext(productContext) {
    const context = new ValidationContext();
    
    if (!productContext) return context;
    
    // Map product context to validation context
    if (productContext.domain) {
      context.update({ domain: productContext.domain });
    }
    
    if (productContext.standards) {
      context.update({ standards: productContext.standards });
    }
    
    if (productContext.principles) {
      context.update({ principles: productContext.principles });
    }
    
    if (productContext.practices) {
      context.update({ practices: productContext.practices });
    }
    
    if (productContext.constraints) {
      context.update({ constraints: productContext.constraints });
    }
    
    return context;
  }

  /**
   * Enhances the context with active context information
   * @param {Object} activeContext - ConPort active context
   * @returns {ValidationContext} This context instance
   */
  enhanceWithActiveContext(activeContext) {
    if (!activeContext) return this;
    
    // Update with task from active context
    if (activeContext.current_focus) {
      this.update({ task: activeContext.current_focus });
    }
    
    // Update with additional constraints from active context
    if (activeContext.constraints) {
      const mergedConstraints = {
        ...this.context.constraints,
        ...activeContext.constraints
      };
      this.update({ constraints: mergedConstraints });
    }
    
    return this;
  }
}

/**
 * StrategicInsightValidator combines multiple validation capabilities
 * to provide comprehensive strategic validation of insights.
 */
class StrategicInsightValidator {
  /**
   * Creates a StrategicInsightValidator
   * @param {Object} config - Configuration options
   */
  constructor(config = {}) {
    this.insightValidator = new InsightValidator(config.validation || {});
    this.validationContext = new ValidationContext(config.context || {});
  }

  /**
   * Sets the validation context
   * @param {Object|ValidationContext} context - Context object or ValidationContext instance
   * @returns {StrategicInsightValidator} This validator instance
   */
  setContext(context) {
    if (context instanceof ValidationContext) {
      this.validationContext = context;
    } else {
      this.validationContext = new ValidationContext(context);
    }
    return this;
  }

  /**
   * Updates the validation context
   * @param {Object} updates - Context updates
   * @returns {StrategicInsightValidator} This validator instance
   */
  updateContext(updates) {
    this.validationContext.update(updates);
    return this;
  }

  /**
   * Validates a strategic insight
   * @param {Object} insight - The insight to validate
   * @returns {Object} Validation results
   */
  validate(insight) {
    return this.insightValidator.validateInsight(insight, this.validationContext.getContext());
  }

  /**
   * Validates multiple insights and ranks them
   * @param {Array} insights - List of insights to validate
   * @returns {Array} Validated and ranked insights
   */
  validateAndRank(insights) {
    const validatedInsights = insights.map(insight => {
      const validationResult = this.validate(insight);
      return {
        insight,
        validation: validationResult,
        score: validationResult.overallScore
      };
    });
    
    // Sort by overall score (descending)
    validatedInsights.sort((a, b) => b.score - a.score);
    
    return validatedInsights;
  }

  /**
   * Filter insights that meet a minimum validation threshold
   * @param {Array} insights - List of insights to filter
   * @param {number} threshold - Minimum overall score threshold
   * @returns {Array} Filtered insights that meet the threshold
   */
  filterValidInsights(insights, threshold = 0.7) {
    const validatedInsights = this.validateAndRank(insights);
    return validatedInsights.filter(item => item.score >= threshold);
  }

  /**
   * Provides improvement suggestions for an insight
   * @param {Object} insight - The insight to improve
   * @returns {Object} Improvement suggestions
   */
  suggestImprovements(insight) {
    const validation = this.validate(insight);
    
    return {
      insight,
      overallScore: validation.overallScore,
      isValid: validation.isValid,
      suggestions: validation.suggestions,
      dimensionScores: Object.fromEntries(
        Object.entries(validation.dimensions).map(([key, value]) => [key, value.overallScore])
      )
    };
  }
}

// Export the classes
module.exports = {
  InsightValidator,
  ValidationContext,
  StrategicInsightValidator
};