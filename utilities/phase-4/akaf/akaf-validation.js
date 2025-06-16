/**
 * Adaptive Knowledge Application Framework (AKAF) - Validation Layer
 * 
 * This module provides validation capabilities for the AKAF system,
 * ensuring quality and consistency of contexts, retrieved knowledge,
 * adaptation strategies, and knowledge application.
 */

/**
 * Validates a context description for completeness and consistency
 * @param {Object} context - The context description to validate
 * @returns {Object} Validation result with any errors or warnings
 */
function validateContext(context) {
  const errors = [];
  const warnings = [];
  
  // Check required fields
  if (!context.id) {
    errors.push('Context must have an ID');
  }
  
  if (!context.domain) {
    errors.push('Context must specify a domain');
  }
  
  if (!context.task) {
    errors.push('Context must specify a task');
  }
  
  // Check constraints
  if (!context.constraints) {
    warnings.push('Context should include constraints for more precise adaptation');
  }
  
  // Check environment
  if (!context.environment) {
    warnings.push('Context should include environment characteristics');
  }
  
  // Check for internal consistency
  if (context.constraints && context.task) {
    const taskRequirements = getTaskRequirements(context.task);
    const constraintConflicts = findConstraintConflicts(taskRequirements, context.constraints);
    if (constraintConflicts.length > 0) {
      errors.push(`Constraint conflicts detected: ${constraintConflicts.join(', ')}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates retrieved knowledge for relevance to the given context
 * @param {Object} retrievedKnowledge - The retrieved knowledge item
 * @param {Object} context - The context for which knowledge is being retrieved
 * @returns {Object} Validation result with relevance assessment
 */
function validateKnowledgeRelevance(retrievedKnowledge, context) {
  const errors = [];
  const warnings = [];
  
  // Check that knowledge has content
  if (!retrievedKnowledge.content || retrievedKnowledge.content.trim() === '') {
    errors.push('Retrieved knowledge must have content');
  }
  
  // Check domain relevance
  if (retrievedKnowledge.domain && context.domain) {
    if (retrievedKnowledge.domain !== context.domain && !isRelatedDomain(retrievedKnowledge.domain, context.domain)) {
      warnings.push(`Knowledge domain (${retrievedKnowledge.domain}) may not be relevant to context domain (${context.domain})`);
    }
  }
  
  // Check task relevance
  if (retrievedKnowledge.applicableTasks && context.task) {
    if (Array.isArray(retrievedKnowledge.applicableTasks) && !retrievedKnowledge.applicableTasks.includes(context.task)) {
      warnings.push(`Knowledge may not be applicable to task: ${context.task}`);
    }
  }
  
  // Check constraint compatibility
  if (retrievedKnowledge.constraints && context.constraints) {
    const incompatibleConstraints = findIncompatibleConstraints(retrievedKnowledge.constraints, context.constraints);
    if (incompatibleConstraints.length > 0) {
      warnings.push(`Knowledge has potentially incompatible constraints: ${incompatibleConstraints.join(', ')}`);
    }
  }
  
  // Calculate relevance score
  const relevanceScore = calculateRelevanceScore(retrievedKnowledge, context);
  
  return {
    isValid: errors.length === 0,
    relevance: relevanceScore,
    errors,
    warnings
  };
}

/**
 * Validates an adaptation strategy for compatibility with the target context
 * @param {Object} adaptationStrategy - The adaptation strategy to validate
 * @param {Object} knowledge - The knowledge to be adapted
 * @param {Object} context - The target context
 * @returns {Object} Validation result with compatibility assessment
 */
function validateAdaptationStrategy(adaptationStrategy, knowledge, context) {
  const errors = [];
  const warnings = [];
  
  // Check required fields
  if (!adaptationStrategy.type) {
    errors.push('Adaptation strategy must specify a type');
  }
  
  if (!adaptationStrategy.operations || !Array.isArray(adaptationStrategy.operations) || adaptationStrategy.operations.length === 0) {
    errors.push('Adaptation strategy must include at least one operation');
  }
  
  // Check that strategy is applicable to knowledge type
  if (knowledge.type && adaptationStrategy.applicableTypes) {
    if (!adaptationStrategy.applicableTypes.includes(knowledge.type)) {
      errors.push(`Adaptation strategy is not applicable to knowledge type: ${knowledge.type}`);
    }
  }
  
  // Check operations validity
  if (adaptationStrategy.operations) {
    adaptationStrategy.operations.forEach((operation, index) => {
      if (!operation.type) {
        errors.push(`Operation ${index} must specify a type`);
      }
      
      if (operation.type === 'transform' && !operation.transformation) {
        errors.push(`Transform operation ${index} must include transformation details`);
      }
      
      if (operation.type === 'filter' && !operation.criteria) {
        errors.push(`Filter operation ${index} must include filtering criteria`);
      }
      
      if (operation.type === 'enrich' && !operation.enrichmentSource) {
        errors.push(`Enrich operation ${index} must include enrichment source`);
      }
    });
  }
  
  // Check contextual compatibility
  if (context.constraints) {
    const incompatibilities = checkStrategyContextCompatibility(adaptationStrategy, context);
    if (incompatibilities.length > 0) {
      warnings.push(`Strategy may not be fully compatible with context: ${incompatibilities.join(', ')}`);
    }
  }
  
  // Calculate compatibility score
  const compatibilityScore = calculateCompatibilityScore(adaptationStrategy, knowledge, context);
  
  return {
    isValid: errors.length === 0,
    compatibility: compatibilityScore,
    errors,
    warnings
  };
}

/**
 * Validates adapted knowledge before application
 * @param {Object} adaptedKnowledge - The adapted knowledge
 * @param {Object} originalKnowledge - The original knowledge before adaptation
 * @param {Object} context - The target context
 * @returns {Object} Validation result with application readiness assessment
 */
function validateAdaptedKnowledge(adaptedKnowledge, originalKnowledge, context) {
  const errors = [];
  const warnings = [];
  
  // Check that adapted knowledge has content
  if (!adaptedKnowledge.content || adaptedKnowledge.content.trim() === '') {
    errors.push('Adapted knowledge must have content');
  }
  
  // Check for adaptation metadata
  if (!adaptedKnowledge.adaptationInfo) {
    warnings.push('Adapted knowledge should include adaptation metadata for traceability');
  }
  
  // Check essential insight preservation
  if (originalKnowledge.essentialInsights) {
    const preservedInsights = checkInsightPreservation(adaptedKnowledge, originalKnowledge.essentialInsights);
    if (preservedInsights < 1.0) {
      warnings.push(`Some essential insights may not be preserved (preservation score: ${preservedInsights.toFixed(2)})`);
    }
  }
  
  // Check contextual fit
  const contextualFitScore = assessContextualFit(adaptedKnowledge, context);
  if (contextualFitScore < 0.7) {
    warnings.push(`Adapted knowledge may not fit well with the target context (fit score: ${contextualFitScore.toFixed(2)})`);
  }
  
  // Calculate confidence in adaptation
  const confidenceScore = calculateAdaptationConfidence(adaptedKnowledge, originalKnowledge, context);
  
  return {
    isValid: errors.length === 0,
    confidence: confidenceScore,
    contextualFit: contextualFitScore,
    errors,
    warnings
  };
}

/**
 * Validates a knowledge application pattern
 * @param {Object} applicationPattern - The application pattern to validate
 * @param {Object} adaptedKnowledge - The adapted knowledge to apply
 * @param {Object} context - The target context
 * @returns {Object} Validation result with application pattern assessment
 */
function validateApplicationPattern(applicationPattern, adaptedKnowledge, context) {
  const errors = [];
  const warnings = [];
  
  // Check required fields
  if (!applicationPattern.type) {
    errors.push('Application pattern must specify a type');
  }
  
  if (!applicationPattern.steps || !Array.isArray(applicationPattern.steps) || applicationPattern.steps.length === 0) {
    errors.push('Application pattern must include at least one step');
  }
  
  // Check that pattern is applicable to knowledge type
  if (adaptedKnowledge.type && applicationPattern.applicableTypes) {
    if (!applicationPattern.applicableTypes.includes(adaptedKnowledge.type)) {
      errors.push(`Application pattern is not applicable to knowledge type: ${adaptedKnowledge.type}`);
    }
  }
  
  // Check steps validity
  if (applicationPattern.steps) {
    applicationPattern.steps.forEach((step, index) => {
      if (!step.action) {
        errors.push(`Step ${index} must specify an action`);
      }
      
      if (!step.expectedOutcome) {
        warnings.push(`Step ${index} should define expected outcome`);
      }
    });
  }
  
  // Check context requirements
  if (applicationPattern.contextRequirements) {
    const missingRequirements = checkMissingContextRequirements(applicationPattern.contextRequirements, context);
    if (missingRequirements.length > 0) {
      errors.push(`Context missing required elements for this pattern: ${missingRequirements.join(', ')}`);
    }
  }
  
  // Calculate suitability score
  const suitabilityScore = calculatePatternSuitability(applicationPattern, adaptedKnowledge, context);
  
  return {
    isValid: errors.length === 0,
    suitability: suitabilityScore,
    errors,
    warnings
  };
}

// Helper functions

/**
 * Get requirements for a specific task
 * @param {string} task - The task to get requirements for
 * @returns {Object} Task requirements
 */
function getTaskRequirements(task) {
  // In a real implementation, this would look up task requirements
  // from a more comprehensive model
  return {
    // Mock task requirements
  };
}

/**
 * Find conflicts between task requirements and constraints
 * @param {Object} requirements - Task requirements
 * @param {Object} constraints - Context constraints
 * @returns {Array} List of constraint conflicts
 */
function findConstraintConflicts(requirements, constraints) {
  // In a real implementation, this would analyze requirements and constraints
  // to find logical conflicts
  return [];
}

/**
 * Check if two domains are related
 * @param {string} domain1 - First domain
 * @param {string} domain2 - Second domain
 * @returns {boolean} Whether domains are related
 */
function isRelatedDomain(domain1, domain2) {
  // In a real implementation, this would use a domain relationship model
  // to determine if domains are related
  return domain1 === domain2 || 
         (domain1.includes(domain2) || domain2.includes(domain1));
}

/**
 * Find incompatible constraints between knowledge and context
 * @param {Object} knowledgeConstraints - Knowledge constraints
 * @param {Object} contextConstraints - Context constraints
 * @returns {Array} List of incompatible constraints
 */
function findIncompatibleConstraints(knowledgeConstraints, contextConstraints) {
  // In a real implementation, this would analyze constraints
  // to find incompatibilities
  return [];
}

/**
 * Calculate relevance score for knowledge in a context
 * @param {Object} knowledge - Knowledge item
 * @param {Object} context - Target context
 * @returns {number} Relevance score between 0 and 1
 */
function calculateRelevanceScore(knowledge, context) {
  // In a real implementation, this would use multiple factors to
  // calculate a relevance score
  let score = 0.5; // Default medium relevance
  
  // Domain relevance
  if (knowledge.domain === context.domain) {
    score += 0.3;
  } else if (isRelatedDomain(knowledge.domain, context.domain)) {
    score += 0.1;
  }
  
  // Task relevance
  if (knowledge.applicableTasks && knowledge.applicableTasks.includes(context.task)) {
    score += 0.2;
  }
  
  // Cap score at 1.0
  return Math.min(score, 1.0);
}

/**
 * Check compatibility between adaptation strategy and context
 * @param {Object} strategy - Adaptation strategy
 * @param {Object} context - Target context
 * @returns {Array} List of incompatibilities
 */
function checkStrategyContextCompatibility(strategy, context) {
  // In a real implementation, this would analyze the strategy
  // against the context to find incompatibilities
  return [];
}

/**
 * Calculate compatibility score between adaptation strategy, knowledge, and context
 * @param {Object} strategy - Adaptation strategy
 * @param {Object} knowledge - Knowledge to adapt
 * @param {Object} context - Target context
 * @returns {number} Compatibility score between 0 and 1
 */
function calculateCompatibilityScore(strategy, knowledge, context) {
  // In a real implementation, this would calculate a compatibility score
  // based on multiple factors
  return 0.8; // Default high compatibility
}

/**
 * Check preservation of essential insights after adaptation
 * @param {Object} adaptedKnowledge - Knowledge after adaptation
 * @param {Array} essentialInsights - Essential insights that should be preserved
 * @returns {number} Preservation score between 0 and 1
 */
function checkInsightPreservation(adaptedKnowledge, essentialInsights) {
  // In a real implementation, this would analyze how well essential
  // insights are preserved in the adapted knowledge
  return 0.9; // Default high preservation
}

/**
 * Assess how well adapted knowledge fits the target context
 * @param {Object} adaptedKnowledge - Adapted knowledge
 * @param {Object} context - Target context
 * @returns {number} Contextual fit score between 0 and 1
 */
function assessContextualFit(adaptedKnowledge, context) {
  // In a real implementation, this would analyze how well
  // the adapted knowledge fits the target context
  return 0.8; // Default good fit
}

/**
 * Calculate confidence score for adapted knowledge
 * @param {Object} adaptedKnowledge - Adapted knowledge
 * @param {Object} originalKnowledge - Original knowledge
 * @param {Object} context - Target context
 * @returns {number} Confidence score between 0 and 1
 */
function calculateAdaptationConfidence(adaptedKnowledge, originalKnowledge, context) {
  // In a real implementation, this would calculate confidence
  // based on multiple factors
  
  // Start with medium confidence
  let confidence = 0.5;
  
  // Add confidence based on original knowledge quality
  if (originalKnowledge.quality) {
    confidence += originalKnowledge.quality * 0.3;
  }
  
  // Adjust based on contextual fit
  const fitScore = assessContextualFit(adaptedKnowledge, context);
  confidence += fitScore * 0.2;
  
  // Cap at 1.0
  return Math.min(confidence, 1.0);
}

/**
 * Check for missing context requirements
 * @param {Object} requirements - Context requirements
 * @param {Object} context - Actual context
 * @returns {Array} Missing requirements
 */
function checkMissingContextRequirements(requirements, context) {
  // In a real implementation, this would compare requirements
  // against the actual context to find missing elements
  return [];
}

/**
 * Calculate suitability score for application pattern
 * @param {Object} pattern - Application pattern
 * @param {Object} knowledge - Adapted knowledge
 * @param {Object} context - Target context
 * @returns {number} Suitability score between 0 and 1
 */
function calculatePatternSuitability(pattern, knowledge, context) {
  // In a real implementation, this would calculate a suitability
  // score based on multiple factors
  return 0.8; // Default high suitability
}

module.exports = {
  validateContext,
  validateKnowledgeRelevance,
  validateAdaptationStrategy,
  validateAdaptedKnowledge,
  validateApplicationPattern
};