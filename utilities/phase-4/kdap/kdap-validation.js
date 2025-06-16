/**
 * Knowledge-Driven Autonomous Planning (KDAP) - Validation Layer
 * 
 * This module provides validation capabilities for the KDAP system,
 * ensuring quality and consistency of gap assessments, plans, and execution.
 */

/**
 * Validates a knowledge gap assessment for completeness and accuracy
 * @param {Object} gapAssessment - The gap assessment to validate
 * @returns {Object} Validation result with any errors or warnings
 */
function validateGapAssessment(gapAssessment) {
  const errors = [];
  const warnings = [];
  
  // Check required fields
  if (!gapAssessment.id) {
    errors.push('Gap assessment must have an ID');
  }
  
  if (!gapAssessment.domain) {
    errors.push('Gap assessment must specify a knowledge domain');
  }
  
  if (!gapAssessment.severity || typeof gapAssessment.severity !== 'number') {
    errors.push('Gap assessment must include a numeric severity rating');
  }
  
  if (!gapAssessment.identificationMethod) {
    warnings.push('Gap assessment should include identification method for traceability');
  }
  
  // Check confidence metrics
  if (gapAssessment.confidence) {
    if (gapAssessment.confidence < 0 || gapAssessment.confidence > 1) {
      errors.push('Confidence rating must be between 0 and 1');
    }
  } else {
    warnings.push('Gap assessment should include confidence rating');
  }
  
  // Check supporting evidence
  if (!gapAssessment.evidence || gapAssessment.evidence.length === 0) {
    warnings.push('Gap assessment should include supporting evidence');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates a knowledge acquisition plan for quality and feasibility
 * @param {Object} plan - The knowledge acquisition plan to validate
 * @returns {Object} Validation result with any errors or warnings
 */
function validateKnowledgeAcquisitionPlan(plan) {
  const errors = [];
  const warnings = [];
  
  // Check plan structure
  if (!plan.targetGaps || !Array.isArray(plan.targetGaps)) {
    errors.push('Plan must specify target gaps as an array');
  }
  
  if (!plan.activities || !Array.isArray(plan.activities)) {
    errors.push('Plan must include activities as an array');
  }
  
  if (!plan.success_criteria || Object.keys(plan.success_criteria).length === 0) {
    errors.push('Plan must define success criteria');
  }
  
  // Check activities
  if (plan.activities) {
    plan.activities.forEach((activity, index) => {
      if (!activity.type) {
        errors.push(`Activity ${index} must specify a type`);
      }
      
      if (!activity.description) {
        warnings.push(`Activity ${index} should include a description`);
      }
      
      if (!activity.expected_outcome) {
        warnings.push(`Activity ${index} should define expected outcome`);
      }
    });
  }
  
  // Check feasibility
  if (plan.resources_required && typeof plan.resources_available !== 'undefined') {
    const resources = Object.keys(plan.resources_required);
    resources.forEach(resource => {
      if (plan.resources_required[resource] > (plan.resources_available[resource] || 0)) {
        errors.push(`Insufficient ${resource} available for plan execution`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates execution progress and identifies potential issues
 * @param {Object} plan - The original acquisition plan
 * @param {Object} executionState - Current execution state
 * @returns {Object} Validation result with any errors or warnings
 */
function validateExecutionProgress(plan, executionState) {
  const errors = [];
  const warnings = [];
  
  // Check progress tracking
  if (!executionState.activities_completed && !executionState.activities_in_progress) {
    errors.push('Execution state must track completed or in-progress activities');
  }
  
  // Check timeline adherence
  if (plan.timeline && executionState.current_time) {
    const plannedActivitiesByTime = plan.activities.filter(activity => 
      activity.scheduled_time && activity.scheduled_time <= executionState.current_time);
    
    const completedActivities = executionState.activities_completed || [];
    
    if (plannedActivitiesByTime.length > completedActivities.length) {
      warnings.push('Execution is behind schedule');
    }
  }
  
  // Check for execution errors
  if (executionState.errors && executionState.errors.length > 0) {
    errors.push('Execution has encountered errors that need resolution');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates the quality of newly acquired knowledge
 * @param {Object} knowledgeItem - The newly acquired knowledge
 * @param {Object} originalGap - The gap this knowledge was meant to address
 * @returns {Object} Validation result with quality assessment
 */
function validateAcquiredKnowledge(knowledgeItem, originalGap) {
  const errors = [];
  const warnings = [];
  
  // Check completeness
  if (!knowledgeItem.content || knowledgeItem.content.trim() === '') {
    errors.push('Acquired knowledge must have content');
  }
  
  // Check relevance to original gap
  if (originalGap && originalGap.domain) {
    if (!knowledgeItem.domain || knowledgeItem.domain !== originalGap.domain) {
      warnings.push('Acquired knowledge domain does not match the original gap');
    }
  }
  
  // Check metadata
  if (!knowledgeItem.source) {
    warnings.push('Acquired knowledge should include source information');
  }
  
  if (!knowledgeItem.confidence || typeof knowledgeItem.confidence !== 'number') {
    warnings.push('Acquired knowledge should include confidence rating');
  }
  
  // Check format suitability for storage
  if (!knowledgeItem.format) {
    warnings.push('Acquired knowledge should specify its format');
  }
  
  return {
    isValid: errors.length === 0,
    quality: errors.length === 0 && warnings.length === 0 ? 'high' : 
             errors.length === 0 ? 'medium' : 'low',
    errors,
    warnings
  };
}

module.exports = {
  validateGapAssessment,
  validateKnowledgeAcquisitionPlan,
  validateExecutionProgress,
  validateAcquiredKnowledge
};