/**
 * Strategic Insight Validation System (SIVS) - Validation Layer
 * 
 * This module provides validation capabilities for the SIVS system,
 * implementing specialized validators for different dimensions of knowledge quality.
 */

/**
 * Validates the intrinsic quality of knowledge
 * @param {Object} knowledge - The knowledge to validate
 * @param {Object} options - Quality validation options
 * @returns {Object} Validation results
 */
function validateQuality(knowledge, options = {}) {
  const { 
    minCompleteness = 0.6,
    minPrecision = 0.7,
    minCredibility = 0.5,
    minTimeliness = 0.6,
    requiredProperties = []
  } = options;
  
  const results = {
    dimension: 'quality',
    scores: {},
    issues: [],
    evidences: [],
    isValid: true
  };
  
  // Check for required properties
  if (requiredProperties.length > 0) {
    const missingProperties = requiredProperties.filter(prop => !knowledge[prop]);
    if (missingProperties.length > 0) {
      results.issues.push(`Missing required properties: ${missingProperties.join(', ')}`);
      results.isValid = false;
    } else {
      results.evidences.push(`All required properties present`);
    }
  }
  
  // Assess completeness
  const completeness = assessCompleteness(knowledge);
  results.scores.completeness = completeness;
  
  if (completeness < minCompleteness) {
    results.issues.push(`Completeness score (${completeness.toFixed(2)}) below threshold (${minCompleteness})`);
    results.isValid = false;
  } else {
    results.evidences.push(`Completeness score satisfactory: ${completeness.toFixed(2)}`);
  }
  
  // Assess precision
  const precision = assessPrecision(knowledge);
  results.scores.precision = precision;
  
  if (precision < minPrecision) {
    results.issues.push(`Precision score (${precision.toFixed(2)}) below threshold (${minPrecision})`);
    results.isValid = false;
  } else {
    results.evidences.push(`Precision score satisfactory: ${precision.toFixed(2)}`);
  }
  
  // Assess credibility
  const credibility = assessCredibility(knowledge);
  results.scores.credibility = credibility;
  
  if (credibility < minCredibility) {
    results.issues.push(`Credibility score (${credibility.toFixed(2)}) below threshold (${minCredibility})`);
    results.isValid = false;
  } else {
    results.evidences.push(`Credibility score satisfactory: ${credibility.toFixed(2)}`);
  }
  
  // Assess timeliness
  const timeliness = assessTimeliness(knowledge);
  results.scores.timeliness = timeliness;
  
  if (timeliness < minTimeliness) {
    results.issues.push(`Timeliness score (${timeliness.toFixed(2)}) below threshold (${minTimeliness})`);
    results.isValid = false;
  } else {
    results.evidences.push(`Timeliness score satisfactory: ${timeliness.toFixed(2)}`);
  }
  
  // Calculate overall quality score as weighted average of individual scores
  results.overallScore = (
    completeness * 0.3 +
    precision * 0.3 +
    credibility * 0.2 +
    timeliness * 0.2
  );
  
  // Add any improvement suggestions
  results.suggestions = generateQualityImprovementSuggestions(results);
  
  return results;
}

/**
 * Validates the relevance of knowledge to a specific context
 * @param {Object} knowledge - The knowledge to validate
 * @param {Object} context - The context to validate against
 * @param {Object} options - Relevance validation options
 * @returns {Object} Validation results
 */
function validateRelevance(knowledge, context, options = {}) {
  const {
    minDomainRelevance = 0.6,
    minTaskRelevance = 0.7,
    minConstraintCompatibility = 0.8,
    minOverallRelevance = 0.7
  } = options;
  
  const results = {
    dimension: 'relevance',
    scores: {},
    issues: [],
    evidences: [],
    isValid: true
  };
  
  // Assess domain relevance
  const domainRelevance = assessDomainRelevance(knowledge, context);
  results.scores.domainRelevance = domainRelevance;
  
  if (domainRelevance < minDomainRelevance) {
    results.issues.push(`Domain relevance score (${domainRelevance.toFixed(2)}) below threshold (${minDomainRelevance})`);
    results.isValid = false;
  } else {
    results.evidences.push(`Domain relevance score satisfactory: ${domainRelevance.toFixed(2)}`);
  }
  
  // Assess task relevance
  const taskRelevance = assessTaskRelevance(knowledge, context);
  results.scores.taskRelevance = taskRelevance;
  
  if (taskRelevance < minTaskRelevance) {
    results.issues.push(`Task relevance score (${taskRelevance.toFixed(2)}) below threshold (${minTaskRelevance})`);
    results.isValid = false;
  } else {
    results.evidences.push(`Task relevance score satisfactory: ${taskRelevance.toFixed(2)}`);
  }
  
  // Assess constraint compatibility
  const constraintCompatibility = assessConstraintCompatibility(knowledge, context);
  results.scores.constraintCompatibility = constraintCompatibility;
  
  if (constraintCompatibility < minConstraintCompatibility) {
    results.issues.push(`Constraint compatibility score (${constraintCompatibility.toFixed(2)}) below threshold (${minConstraintCompatibility})`);
    results.isValid = false;
  } else {
    results.evidences.push(`Constraint compatibility score satisfactory: ${constraintCompatibility.toFixed(2)}`);
  }
  
  // Calculate overall relevance score
  results.overallScore = (
    domainRelevance * 0.3 +
    taskRelevance * 0.4 +
    constraintCompatibility * 0.3
  );
  
  if (results.overallScore < minOverallRelevance) {
    results.issues.push(`Overall relevance score (${results.overallScore.toFixed(2)}) below threshold (${minOverallRelevance})`);
    results.isValid = false;
  }
  
  // Add any improvement suggestions
  results.suggestions = generateRelevanceImprovementSuggestions(results, context);
  
  return results;
}

/**
 * Validates the logical coherence and consistency of knowledge
 * @param {Object} knowledge - The knowledge to validate
 * @param {Object} options - Coherence validation options
 * @returns {Object} Validation results
 */
function validateCoherence(knowledge, options = {}) {
  const {
    minInternalConsistency = 0.7,
    minStructuralIntegrity = 0.6,
    minLogicalFlow = 0.7,
    minOverallCoherence = 0.7
  } = options;
  
  const results = {
    dimension: 'coherence',
    scores: {},
    issues: [],
    evidences: [],
    isValid: true
  };
  
  // Assess internal consistency (no contradictions)
  const internalConsistency = assessInternalConsistency(knowledge);
  results.scores.internalConsistency = internalConsistency;
  
  if (internalConsistency < minInternalConsistency) {
    results.issues.push(`Internal consistency score (${internalConsistency.toFixed(2)}) below threshold (${minInternalConsistency})`);
    results.isValid = false;
  } else {
    results.evidences.push(`Internal consistency score satisfactory: ${internalConsistency.toFixed(2)}`);
  }
  
  // Assess structural integrity
  const structuralIntegrity = assessStructuralIntegrity(knowledge);
  results.scores.structuralIntegrity = structuralIntegrity;
  
  if (structuralIntegrity < minStructuralIntegrity) {
    results.issues.push(`Structural integrity score (${structuralIntegrity.toFixed(2)}) below threshold (${minStructuralIntegrity})`);
    results.isValid = false;
  } else {
    results.evidences.push(`Structural integrity score satisfactory: ${structuralIntegrity.toFixed(2)}`);
  }
  
  // Assess logical flow
  const logicalFlow = assessLogicalFlow(knowledge);
  results.scores.logicalFlow = logicalFlow;
  
  if (logicalFlow < minLogicalFlow) {
    results.issues.push(`Logical flow score (${logicalFlow.toFixed(2)}) below threshold (${minLogicalFlow})`);
    results.isValid = false;
  } else {
    results.evidences.push(`Logical flow score satisfactory: ${logicalFlow.toFixed(2)}`);
  }
  
  // Calculate overall coherence score
  results.overallScore = (
    internalConsistency * 0.4 +
    structuralIntegrity * 0.3 +
    logicalFlow * 0.3
  );
  
  if (results.overallScore < minOverallCoherence) {
    results.issues.push(`Overall coherence score (${results.overallScore.toFixed(2)}) below threshold (${minOverallCoherence})`);
    results.isValid = false;
  }
  
  // Add any improvement suggestions
  results.suggestions = generateCoherenceImprovementSuggestions(results);
  
  return results;
}

/**
 * Validates the alignment of knowledge with organizational principles and standards
 * @param {Object} knowledge - The knowledge to validate
 * @param {Object} context - The context to validate against
 * @param {Object} options - Alignment validation options
 * @returns {Object} Validation results
 */
function validateAlignment(knowledge, context, options = {}) {
  const {
    minPrinciplesAlignment = 0.8,
    minStandardsAlignment = 0.8,
    minPracticesAlignment = 0.7,
    standards = [],
    principles = [],
    practices = []
  } = options;
  
  const results = {
    dimension: 'alignment',
    scores: {},
    issues: [],
    evidences: [],
    isValid: true
  };
  
  // Use context-provided standards if not explicitly provided in options
  const effectiveStandards = standards.length > 0 ? standards : 
    (context.standards || []);
  
  // Use context-provided principles if not explicitly provided in options
  const effectivePrinciples = principles.length > 0 ? principles : 
    (context.principles || []);
  
  // Use context-provided practices if not explicitly provided in options
  const effectivePractices = practices.length > 0 ? practices : 
    (context.practices || []);
  
  // Assess alignment with organizational principles
  if (effectivePrinciples.length > 0) {
    const principlesAlignment = assessPrinciplesAlignment(knowledge, effectivePrinciples);
    results.scores.principlesAlignment = principlesAlignment;
    
    if (principlesAlignment < minPrinciplesAlignment) {
      results.issues.push(`Principles alignment score (${principlesAlignment.toFixed(2)}) below threshold (${minPrinciplesAlignment})`);
      results.isValid = false;
    } else {
      results.evidences.push(`Principles alignment score satisfactory: ${principlesAlignment.toFixed(2)}`);
    }
  }
  
  // Assess alignment with applicable standards
  if (effectiveStandards.length > 0) {
    const standardsAlignment = assessStandardsAlignment(knowledge, effectiveStandards);
    results.scores.standardsAlignment = standardsAlignment;
    
    if (standardsAlignment < minStandardsAlignment) {
      results.issues.push(`Standards alignment score (${standardsAlignment.toFixed(2)}) below threshold (${minStandardsAlignment})`);
      results.isValid = false;
    } else {
      results.evidences.push(`Standards alignment score satisfactory: ${standardsAlignment.toFixed(2)}`);
    }
  }
  
  // Assess alignment with best practices
  if (effectivePractices.length > 0) {
    const practicesAlignment = assessPracticesAlignment(knowledge, effectivePractices);
    results.scores.practicesAlignment = practicesAlignment;
    
    if (practicesAlignment < minPracticesAlignment) {
      results.issues.push(`Practices alignment score (${practicesAlignment.toFixed(2)}) below threshold (${minPracticesAlignment})`);
      results.isValid = false;
    } else {
      results.evidences.push(`Practices alignment score satisfactory: ${practicesAlignment.toFixed(2)}`);
    }
  }
  
  // Calculate overall alignment score (if applicable scorers exist)
  if (Object.keys(results.scores).length > 0) {
    let totalScore = 0;
    let totalWeight = 0;
    
    if (results.scores.principlesAlignment !== undefined) {
      totalScore += results.scores.principlesAlignment * 0.4;
      totalWeight += 0.4;
    }
    
    if (results.scores.standardsAlignment !== undefined) {
      totalScore += results.scores.standardsAlignment * 0.4;
      totalWeight += 0.4;
    }
    
    if (results.scores.practicesAlignment !== undefined) {
      totalScore += results.scores.practicesAlignment * 0.2;
      totalWeight += 0.2;
    }
    
    if (totalWeight > 0) {
      results.overallScore = totalScore / totalWeight;
    } else {
      // If no alignment checks were performed, default to neutral score
      results.overallScore = 0.5;
      results.evidences.push('No alignment checks performed due to missing standards/principles');
    }
  } else {
    // If no alignment checks were performed, default to neutral score
    results.overallScore = 0.5;
    results.evidences.push('No alignment checks performed due to missing standards/principles');
  }
  
  // Add any improvement suggestions
  results.suggestions = generateAlignmentImprovementSuggestions(results, {
    standards: effectiveStandards,
    principles: effectivePrinciples,
    practices: effectivePractices
  });
  
  return results;
}

/**
 * Validates potential risks associated with knowledge application
 * @param {Object} knowledge - The knowledge to validate
 * @param {Object} context - The context to validate against
 * @param {Object} options - Risk validation options
 * @returns {Object} Validation results
 */
function validateRisk(knowledge, context, options = {}) {
  const {
    maxAcceptableRisk = 0.3,
    riskFactors = [],
    criticalRiskAreas = []
  } = options;
  
  const results = {
    dimension: 'risk',
    scores: {},
    issues: [],
    evidences: [],
    isValid: true,
    identifiedRisks: []
  };
  
  // Use context-provided risk factors if not explicitly provided in options
  const effectiveRiskFactors = riskFactors.length > 0 ? riskFactors : 
    (context.riskFactors || getDefaultRiskFactors(context));
  
  // Use context-provided critical risk areas if not explicitly provided in options
  const effectiveCriticalRiskAreas = criticalRiskAreas.length > 0 ? criticalRiskAreas : 
    (context.criticalRiskAreas || getDefaultCriticalRiskAreas(context));
  
  // Assess each risk factor
  const riskAssessments = {};
  
  for (const factor of effectiveRiskFactors) {
    const riskLevel = assessRiskFactor(knowledge, context, factor);
    riskAssessments[factor.id] = riskLevel;
    
    if (riskLevel > factor.threshold) {
      results.issues.push(`Risk factor "${factor.name}" above threshold (${riskLevel.toFixed(2)} > ${factor.threshold})`);
      results.identifiedRisks.push({
        factor: factor.name,
        level: riskLevel,
        description: factor.description,
        mitigation: factor.mitigation
      });
      
      // Check if this is a critical risk area
      if (effectiveCriticalRiskAreas.includes(factor.id)) {
        results.isValid = false;
      }
    } else {
      results.evidences.push(`Risk factor "${factor.name}" within acceptable limits (${riskLevel.toFixed(2)} <= ${factor.threshold})`);
    }
    
    results.scores[factor.id] = riskLevel;
  }
  
  // Calculate overall risk score as weighted average
  let totalRiskScore = 0;
  let totalWeight = 0;
  
  for (const factor of effectiveRiskFactors) {
    totalRiskScore += riskAssessments[factor.id] * factor.weight;
    totalWeight += factor.weight;
  }
  
  results.overallScore = totalWeight > 0 ? totalRiskScore / totalWeight : 0;
  
  // For risk validation, lower score is better (opposite of other dimensions)
  if (results.overallScore > maxAcceptableRisk) {
    results.issues.push(`Overall risk score (${results.overallScore.toFixed(2)}) exceeds maximum acceptable risk (${maxAcceptableRisk})`);
    results.isValid = false;
  } else {
    results.evidences.push(`Overall risk score (${results.overallScore.toFixed(2)}) within acceptable limits (max ${maxAcceptableRisk})`);
  }
  
  // Add any improvement suggestions
  results.suggestions = generateRiskMitigationSuggestions(results, effectiveRiskFactors);
  
  return results;
}

// Helper functions for quality validation

/**
 * Assesses the completeness of knowledge
 * @param {Object} knowledge - The knowledge to assess
 * @returns {number} Completeness score between 0 and 1
 */
function assessCompleteness(knowledge) {
  // In a real implementation, this would analyze the knowledge for completeness
  // based on its type, expected structure, etc.
  
  // For this implementation, we'll provide a basic assessment based on content length
  // and existence of key fields depending on knowledge type
  if (!knowledge.content) {
    return 0.2; // Very incomplete
  }
  
  let score = 0.5; // Start with neutral score
  
  // Assess based on content length (simple heuristic)
  const contentLength = knowledge.content.length;
  if (contentLength < 50) {
    score -= 0.2;
  } else if (contentLength > 500) {
    score += 0.2;
  }
  
  // Check for expected fields based on type
  const type = knowledge.type || '';
  
  if (type === 'decision') {
    if (knowledge.rationale) score += 0.2;
    if (knowledge.alternatives) score += 0.1;
    if (knowledge.implications) score += 0.1;
  } else if (type === 'system_pattern') {
    if (knowledge.context) score += 0.1;
    if (knowledge.problem) score += 0.1;
    if (knowledge.solution) score += 0.1;
    if (knowledge.consequences) score += 0.1;
  } else if (type === 'code') {
    if (knowledge.language) score += 0.1;
    if (knowledge.usage) score += 0.1;
    if (knowledge.dependencies) score += 0.1;
  }
  
  // Cap score between 0 and 1
  return Math.max(0, Math.min(1, score));
}

/**
 * Assesses the precision of knowledge
 * @param {Object} knowledge - The knowledge to assess
 * @returns {number} Precision score between 0 and 1
 */
function assessPrecision(knowledge) {
  // In a real implementation, this would analyze the knowledge for precision
  // based on specificity, clarity, and absence of ambiguity
  
  // For this implementation, we'll provide a basic assessment
  if (!knowledge.content) {
    return 0.3; // Poor precision
  }
  
  let score = 0.5; // Start with neutral score
  
  // Basic linguistic markers of precision (simple heuristic)
  const content = knowledge.content.toLowerCase();
  
  // Positive markers (specific terms, numbers, etc.)
  const precisionMarkers = [
    'specifically', 'exactly', 'precisely', 'definite',
    'clearly', 'explicit', 'particular', 'concrete'
  ];
  
  // Negative markers (ambiguity, vagueness)
  const ambiguityMarkers = [
    'maybe', 'perhaps', 'possibly', 'might', 'could be', 'somewhat',
    'kind of', 'sort of', 'approximately'
  ];
  
  for (const marker of precisionMarkers) {
    if (content.includes(marker)) score += 0.05;
  }
  
  for (const marker of ambiguityMarkers) {
    if (content.includes(marker)) score -= 0.05;
  }
  
  // Check for presence of specific numbers, dates, or quantities
  if (/\d+(\.\d+)?%/.test(content)) score += 0.1; // Percentages
  if (/\d+(\.\d+)?px/.test(content)) score += 0.1; // Specific measurements
  if (/\d+(\.\d+)?(ms|s|m|h)/.test(content)) score += 0.1; // Time specifications
  
  // Check code snippets if applicable
  if (knowledge.type === 'code' && content.match(/[a-z0-9_]+\([^)]*\)/g)) {
    score += 0.2; // Contains specific function calls
  }
  
  // Cap score between 0 and 1
  return Math.max(0, Math.min(1, score));
}

/**
 * Assesses the credibility of knowledge
 * @param {Object} knowledge - The knowledge to assess
 * @returns {number} Credibility score between 0 and 1
 */
function assessCredibility(knowledge) {
  // In a real implementation, this would analyze the knowledge for credibility
  // based on sources, verification status, authors, etc.
  
  // For this implementation, we'll provide a basic assessment
  let score = 0.5; // Start with neutral score
  
  // Check for elements that enhance credibility
  if (knowledge.source) score += 0.2;
  if (knowledge.author) score += 0.1;
  if (knowledge.verificationStatus === 'verified') score += 0.2;
  if (knowledge.citations && Array.isArray(knowledge.citations)) {
    score += Math.min(0.2, knowledge.citations.length * 0.05);
  }
  
  // Check for elements that decrease credibility
  if (knowledge.verificationStatus === 'rejected') score -= 0.3;
  if (knowledge.verificationStatus === 'disputed') score -= 0.1;
  if (knowledge.knownIssues && Array.isArray(knowledge.knownIssues) && knowledge.knownIssues.length > 0) {
    score -= Math.min(0.2, knowledge.knownIssues.length * 0.05);
  }
  
  // Cap score between 0 and 1
  return Math.max(0, Math.min(1, score));
}

/**
 * Assesses the timeliness of knowledge
 * @param {Object} knowledge - The knowledge to assess
 * @returns {number} Timeliness score between 0 and 1
 */
function assessTimeliness(knowledge) {
  // In a real implementation, this would analyze the knowledge for timeliness
  // based on creation date, last update, expected lifespan, etc.
  
  // For this implementation, we'll provide a basic assessment
  if (!knowledge.timestamp && !knowledge.createdAt && !knowledge.updatedAt) {
    return 0.5; // Neutral score if no date information
  }
  
  let score = 0.5; // Start with neutral score
  
  // Get the most recent date from the knowledge
  const now = new Date();
  let knowledgeDate;
  
  if (knowledge.updatedAt) {
    knowledgeDate = new Date(knowledge.updatedAt);
  } else if (knowledge.timestamp) {
    knowledgeDate = new Date(knowledge.timestamp);
  } else if (knowledge.createdAt) {
    knowledgeDate = new Date(knowledge.createdAt);
  }
  
  if (knowledgeDate) {
    // Calculate age in days
    const ageInDays = (now - knowledgeDate) / (1000 * 60 * 60 * 24);
    
    // Different knowledge types have different "shelf lives"
    const type = knowledge.type || '';
    
    if (type === 'code' || type === 'technical') {
      // Technical knowledge becomes outdated more quickly
      if (ageInDays < 30) score = 0.9;
      else if (ageInDays < 90) score = 0.7;
      else if (ageInDays < 365) score = 0.5;
      else if (ageInDays < 730) score = 0.3;
      else score = 0.1;
    } else {
      // Other knowledge types may have longer relevance
      if (ageInDays < 90) score = 0.9;
      else if (ageInDays < 365) score = 0.7;
      else if (ageInDays < 730) score = 0.5;
      else if (ageInDays < 1095) score = 0.3;
      else score = 0.2;
    }
  }
  
  // Check if knowledge is explicitly marked as outdated
  if (knowledge.status === 'outdated' || knowledge.isOutdated === true) {
    score = Math.max(0, score - 0.4);
  }
  
  // Check if knowledge is explicitly marked as current
  if (knowledge.status === 'current' || knowledge.isCurrent === true) {
    score = Math.min(1, score + 0.2);
  }
  
  return score;
}

/**
 * Generate improvement suggestions for quality issues
 * @param {Object} results - Validation results
 * @returns {Array} List of improvement suggestions
 */
function generateQualityImprovementSuggestions(results) {
  const suggestions = [];
  
  if (results.scores.completeness < 0.7) {
    suggestions.push('Enhance completeness by adding missing details and expanding on key points');
  }
  
  if (results.scores.precision < 0.7) {
    suggestions.push('Improve precision by using more specific terminology and concrete examples');
  }
  
  if (results.scores.credibility < 0.6) {
    suggestions.push('Strengthen credibility by adding references, citations, or verification information');
  }
  
  if (results.scores.timeliness < 0.6) {
    suggestions.push('Update the content to ensure it reflects current knowledge and practices');
  }
  
  return suggestions;
}

// Helper functions for relevance validation

/**
 * Assesses the domain relevance of knowledge
 * @param {Object} knowledge - The knowledge to assess
 * @param {Object} context - The context to validate against
 * @returns {number} Domain relevance score between 0 and 1
 */
function assessDomainRelevance(knowledge, context) {
  // In a real implementation, this would use domain models and semantic analysis
  // For this implementation, we'll provide a basic assessment
  
  if (!context.domain) {
    return 0.5; // Neutral score if no domain specified
  }
  
  const domain = context.domain.toLowerCase();
  const knowledgeDomain = (knowledge.domain || '').toLowerCase();
  
  // Direct domain match
  if (knowledgeDomain && knowledgeDomain === domain) {
    return 0.9;
  }
  
  // Check if knowledge domain is a subdomain of context domain
  if (knowledgeDomain && knowledgeDomain.includes(domain)) {
    return 0.8;
  }
  
  // Check if context domain is a subdomain of knowledge domain
  if (knowledgeDomain && domain.includes(knowledgeDomain)) {
    return 0.7;
  }
  
  // Check if domains are related (based on domain relatedness map)
  if (knowledgeDomain && areDomainsRelated(knowledgeDomain, domain)) {
    return 0.6;
  }
  
  // Check content for domain-specific keywords
  if (knowledge.content) {
    const domainKeywords = getDomainKeywords(domain);
    let keywordCount = 0;
    
    for (const keyword of domainKeywords) {
      if (knowledge.content.toLowerCase().includes(keyword)) {
        keywordCount++;
      }
    }
    
    const keywordRelevance = Math.min(1, keywordCount / (domainKeywords.length * 0.3));
    return Math.max(0.3, keywordRelevance);
  }
  
  return 0.3; // Low relevance by default
}

/**
 * Assesses the task relevance of knowledge
 * @param {Object} knowledge - The knowledge to assess
 * @param {Object} context - The context to validate against
 * @returns {number} Task relevance score between 0 and 1
 */
function assessTaskRelevance(knowledge, context) {
  // In a real implementation, this would use task models and semantic analysis
  // For this implementation, we'll provide a basic assessment
  
  if (!context.task) {
    return 0.5; // Neutral score if no task specified
  }
  
  const task = context.task.toLowerCase();
  const applicableTasks = Array.isArray(knowledge.applicableTasks) ? 
    knowledge.applicableTasks.map(t => t.toLowerCase()) : [];
  
  // Direct task match
  if (applicableTasks.includes(task)) {
    return 0.9;
  }
  
  // Check for task overlap or similarity
  for (const appTask of applicableTasks) {
    if (appTask.includes(task) || task.includes(appTask)) {
      return 0.7;
    }
  }
  
  // Check content for task-specific keywords
  if (knowledge.content) {
    const taskKeywords = getTaskKeywords(task);
    let keywordCount = 0;
    
    for (const keyword of taskKeywords) {
      if (knowledge.content.toLowerCase().includes(keyword)) {
        keywordCount++;
      }
    }
    
    const keywordRelevance = Math.min(0.8, keywordCount / (taskKeywords.length * 0.3));
    return Math.max(0.3, keywordRelevance);
  }
  
  return 0.3; // Low relevance by default
}

/**
 * Assesses the compatibility of knowledge with context constraints
 * @param {Object} knowledge - The knowledge to assess
 * @param {Object} context - The context to validate against
 * @returns {number} Constraint compatibility score between 0 and 1
 */
function assessConstraintCompatibility(knowledge, context) {
  // In a real implementation, this would evaluate knowledge against specific constraints
  // For this implementation, we'll provide a basic assessment
  
  if (!context.constraints || Object.keys(context.constraints).length === 0) {
    return 0.8; // High compatibility if no constraints specified
  }
  
  const constraints = context.constraints;
  const knowledgeConstraints = knowledge.constraints || {};
  
  let compatibleConstraints = 0;
  let incompatibleConstraints = 0;
  
  // Compare each context constraint with knowledge
  for (const [key, value] of Object.entries(constraints)) {
    // If knowledge specifies the same constraint with same value, it's compatible
    if (knowledgeConstraints[key] === value) {
      compatibleConstraints++;
      continue;
    }
    
    // If knowledge specifies the same constraint with different value, it might be incompatible
    if (knowledgeConstraints[key] !== undefined && knowledgeConstraints[key] !== value) {
      incompatibleConstraints++;
      continue;
    }
    
    // Check content for constraint-related terms
    if (knowledge.content) {
      const constraintPattern = new RegExp(`\\b${key}\\b`, 'i');
      if (constraintPattern.test(knowledge.content)) {
        // Knowledge mentions the constraint, consider it partially compatible
        compatibleConstraints += 0.5;
      }
    }
  }
  
  const totalConstraints = Object.keys(constraints).length;
  
  if (totalConstraints === 0) {
    return 0.8; // High compatibility if no constraints
  }
  
  // Calculate compatibility score
  return Math.max(0, Math.min(1, (compatibleConstraints - incompatibleConstraints) / totalConstraints));
}

/**
 * Generate improvement suggestions for relevance issues
 * @param {Object} results - Validation results
 * @param {Object} context - The context to validate against
 * @returns {Array} List of improvement suggestions
 */
function generateRelevanceImprovementSuggestions(results, context) {
  const suggestions = [];
  
  if (results.scores.domainRelevance < 0.7) {
    suggestions.push(`Tailor content to better align with the ${context.domain} domain by incorporating domain-specific concepts and terminology`);
  }
  
  if (results.scores.taskRelevance < 0.7) {
    suggestions.push(`Adapt content to directly address the ${context.task} task by focusing on specific task requirements and outcomes`);
  }
  
  if (results.scores.constraintCompatibility < 0.8 && context.constraints) {
    const constraintList = Object.entries(context.constraints)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    suggestions.push(`Ensure content aligns with key constraints (${constraintList})`);
  }
  
  return suggestions;
}

// Helper functions for coherence validation

/**
 * Assesses the internal consistency of knowledge
 * @param {Object} knowledge - The knowledge to assess
 * @returns {number} Internal consistency score between 0 and 1
 */
function assessInternalConsistency(knowledge) {
  // In a real implementation, this would check for contradictions and inconsistencies
  // For this implementation, we'll provide a basic assessment
  
  if (!knowledge.content) {
    return 0.5;
  }
  
  let score = 0.7; // Start with fairly good consistency assumption
  
  // Simple heuristics for detecting potential inconsistencies
  const content = knowledge.content.toLowerCase();
  
  // Check for contradiction markers
  const contradictionMarkers = [
    'however', 'but', 'although', 'despite', 'on the contrary',
    'on the other hand', 'nevertheless', 'conversely', 'in contrast',
    'instead', 'yet', 'while', 'whereas'
  ];
  
  let markerCount = 0;
  for (const marker of contradictionMarkers) {
    const matches = content.match(new RegExp(`\\b${marker}\\b`, 'g'));
    if (matches) {
      markerCount += matches.length;
    }
  }
  
  // Excessive contradiction markers might indicate inconsistency
  if (markerCount > 3) {
    score -= Math.min(0.3, (markerCount - 3) * 0.05);
  }
  
  // Check for negation patterns that might indicate contradictions
  const negationPatterns = [
    'not true', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t',
    'don\'t', 'doesn\'t', 'didn\'t', 'cannot', 'can\'t',
    'should not', 'shouldn\'t', 'would not', 'wouldn\'t'
  ];
  
  let negationCount = 0;
  for (const pattern of negationPatterns) {
    const matches = content.match(new RegExp(`\\b${pattern}\\b`, 'g'));
    if (matches) {
      negationCount += matches.length;
    }
  }
  
  // Excessive negations might indicate inconsistency
  if (negationCount > 5) {
    score -= Math.min(0.2, (negationCount - 5) * 0.03);
  }
  
  return Math.max(0, Math.min(1, score));
}

/**
 * Assesses the structural integrity of knowledge
 * @param {Object} knowledge - The knowledge to assess
 * @returns {number} Structural integrity score between 0 and 1
 */
function assessStructuralIntegrity(knowledge) {
  // In a real implementation, this would check for proper structure based on knowledge type
  // For this implementation, we'll provide a basic assessment
  
  if (!knowledge.content) {
    return 0.3; // Poor structure without content
  }
  
  let score = 0.5; // Start with neutral score
  
  // Check for structural elements based on knowledge type
  const type = knowledge.type || '';
  
  if (type === 'decision') {
    if (knowledge.summary) score += 0.1;
    if (knowledge.rationale) score += 0.2;
    if (knowledge.alternatives) score += 0.1;
    if (knowledge.implications) score += 0.1;
  } else if (type === 'system_pattern') {
    if (knowledge.name) score += 0.1;
    if (knowledge.context) score += 0.1;
    if (knowledge.problem) score += 0.1;
    if (knowledge.solution) score += 0.2;
    if (knowledge.consequences) score += 0.1;
  } else if (type === 'code') {
    const hasStructure = /function|class|module|import|export|def|struct/i.test(knowledge.content);
    if (hasStructure) score += 0.2;
    
    const hasDocumentation = /\/\/|\/\*|\*\/|#|"""|\*\*|@param|@return/i.test(knowledge.content);
    if (hasDocumentation) score += 0.2;
  } else {
    // For other knowledge types, check for common structure elements
    const contentLines = knowledge.content.split('\n');
    
    // Check for headings/sections
    const hasHeadings = contentLines.some(line => /^#+\s+\w+/.test(line));
    if (hasHeadings) score += 0.2;
    
    // Check for lists
    const hasLists = contentLines.some(line => /^[-*]\s+\w+/.test(line));
    if (hasLists) score += 0.1;
    
    // Check for paragraphs (groups of lines separated by blank lines)
    const hasParagraphs = contentLines.some((line, index, array) => 
      line.trim() === '' && index > 0 && index < array.length - 1 && 
      array[index - 1].trim() !== '' && array[index + 1].trim() !== '');
    if (hasParagraphs) score += 0.1;
  }
  
  return Math.max(0, Math.min(1, score));
}

/**
 * Assesses the logical flow of knowledge
 * @param {Object} knowledge - The knowledge to assess
 * @returns {number} Logical flow score between 0 and 1
 */
function assessLogicalFlow(knowledge) {
  // In a real implementation, this would check for logical progression and flow
  // For this implementation, we'll provide a basic assessment
  
  if (!knowledge.content) {
    return 0.3;
  }
  
  let score = 0.5; // Start with neutral score
  
  // Check for logical connectors that indicate good flow
  const content = knowledge.content.toLowerCase();
  const logicalConnectors = [
    'therefore', 'thus', 'consequently', 'as a result',
    'because', 'since', 'due to', 'hence',
    'first', 'second', 'third', 'finally',
    'furthermore', 'moreover', 'additionally',
    'in conclusion', 'to summarize'
  ];
  
  let connectorCount = 0;
  for (const connector of logicalConnectors) {
    if (content.includes(connector)) {
      connectorCount++;
    }
  }
  
  // More logical connectors suggest better flow
  score += Math.min(0.3, connectorCount * 0.05);
  
  // Check for sequential structure
  const sequentialPatterns = [
    'step 1', 'step 2', 'step 3',
    'first', 'then', 'next', 'finally',
    'initially', 'subsequently', 'ultimately'
  ];
  
  let sequentialCount = 0;
  for (const pattern of sequentialPatterns) {
    if (content.includes(pattern)) {
      sequentialCount++;
    }
  }
  
  // Sequential patterns suggest better flow
  score += Math.min(0.2, sequentialCount * 0.04);
  
  return Math.max(0, Math.min(1, score));
}

/**
 * Generate improvement suggestions for coherence issues
 * @param {Object} results - Validation results
 * @returns {Array} List of improvement suggestions
 */
function generateCoherenceImprovementSuggestions(results) {
  const suggestions = [];
  
  if (results.scores.internalConsistency < 0.7) {
    suggestions.push('Review content for contradictions or inconsistent statements');
  }
  
  if (results.scores.structuralIntegrity < 0.7) {
    suggestions.push('Improve structure by organizing content into clear sections with appropriate headings');
  }
  
  if (results.scores.logicalFlow < 0.7) {
    suggestions.push('Enhance logical flow by adding transitional phrases and ensuring ideas build upon each other');
  }
  
  return suggestions;
}

// Helper functions for alignment validation

/**
 * Assesses alignment with organizational principles
 * @param {Object} knowledge - The knowledge to assess
 * @param {Array} principles - The principles to check against
 * @returns {number} Principles alignment score between 0 and 1
 */
function assessPrinciplesAlignment(knowledge, principles) {
  // In a real implementation, this would check alignment with specific principles
  // For this implementation, we'll provide a basic assessment
  
  if (!knowledge.content || principles.length === 0) {
    return 0.5;
  }
  
  const content = knowledge.content.toLowerCase();
  let alignedPrinciples = 0;
  let misalignedPrinciples = 0;
  
  for (const principle of principles) {
    const principleData = typeof principle === 'string' ? 
      { name: principle, keywords: [principle.toLowerCase()] } : principle;
    
    let principleAligned = false;
    let principleConflict = false;
    
    // Check for principle keywords
    for (const keyword of principleData.keywords || [principleData.name.toLowerCase()]) {
      if (content.includes(keyword.toLowerCase())) {
        principleAligned = true;
        break;
      }
    }
    
    // Check for conflicts with principle
    if (principleData.conflicts) {
      for (const conflict of principleData.conflicts) {
        if (content.includes(conflict.toLowerCase())) {
          principleConflict = true;
          break;
        }
      }
    }
    
    if (principleAligned && !principleConflict) {
      alignedPrinciples++;
    } else if (principleConflict) {
      misalignedPrinciples++;
    }
  }
  
  const totalPrinciples = principles.length;
  
  // Calculate alignment score
  return Math.max(0, Math.min(1, (alignedPrinciples - misalignedPrinciples * 2) / totalPrinciples));
}

/**
 * Assesses alignment with standards
 * @param {Object} knowledge - The knowledge to assess
 * @param {Array} standards - The standards to check against
 * @returns {number} Standards alignment score between 0 and 1
 */
function assessStandardsAlignment(knowledge, standards) {
  // In a real implementation, this would check alignment with specific standards
  // For this implementation, we'll provide a basic assessment
  
  if (!knowledge.content || standards.length === 0) {
    return 0.5;
  }
  
  const content = knowledge.content.toLowerCase();
  const appliedStandards = knowledge.standards || [];
  let alignedStandards = 0;
  
  for (const standard of standards) {
    const standardName = typeof standard === 'string' ? standard : standard.name;
    
    // Check if standard is explicitly applied
    if (appliedStandards.includes(standardName)) {
      alignedStandards++;
      continue;
    }
    
    // Check for standard-specific terms
    const standardData = typeof standard === 'string' ? 
      { name: standard, keywords: [standard.toLowerCase()] } : standard;
    
    let standardReferenced = false;
    
    // Check for standard keywords
    for (const keyword of standardData.keywords || [standardData.name.toLowerCase()]) {
      if (content.includes(keyword.toLowerCase())) {
        standardReferenced = true;
        alignedStandards += 0.5; // Partial alignment for reference
        break;
      }
    }
  }
  
  const totalStandards = standards.length;
  
  // Calculate alignment score
  return Math.max(0, Math.min(1, alignedStandards / totalStandards));
}

/**
 * Assesses alignment with best practices
 * @param {Object} knowledge - The knowledge to assess
 * @param {Array} practices - The practices to check against
 * @returns {number} Practices alignment score between 0 and 1
 */
function assessPracticesAlignment(knowledge, practices) {
  // In a real implementation, this would check alignment with specific practices
  // For this implementation, we'll provide a basic assessment
  
  if (!knowledge.content || practices.length === 0) {
    return 0.5;
  }
  
  const content = knowledge.content.toLowerCase();
  let alignedPractices = 0;
  let misalignedPractices = 0;
  
  for (const practice of practices) {
    const practiceData = typeof practice === 'string' ? 
      { name: practice, keywords: [practice.toLowerCase()] } : practice;
    
    let practiceAligned = false;
    let practiceViolation = false;
    
    // Check for practice keywords
    for (const keyword of practiceData.keywords || [practiceData.name.toLowerCase()]) {
      if (content.includes(keyword.toLowerCase())) {
        practiceAligned = true;
        break;
      }
    }
    
    // Check for violations of practice
    if (practiceData.antipatterns) {
      for (const antipattern of practiceData.antipatterns) {
        if (content.includes(antipattern.toLowerCase())) {
          practiceViolation = true;
          break;
        }
      }
    }
    
    if (practiceAligned && !practiceViolation) {
      alignedPractices++;
    } else if (practiceViolation) {
      misalignedPractices++;
    }
  }
  
  const totalPractices = practices.length;
  
  // Calculate alignment score
  return Math.max(0, Math.min(1, (alignedPractices - misalignedPractices) / totalPractices));
}

/**
 * Generate improvement suggestions for alignment issues
 * @param {Object} results - Validation results
 * @param {Object} alignmentOptions - Options with standards, principles, and practices
 * @returns {Array} List of improvement suggestions
 */
function generateAlignmentImprovementSuggestions(results, alignmentOptions) {
  const suggestions = [];
  
  if (results.scores.principlesAlignment < 0.7 && alignmentOptions.principles.length > 0) {
    const principlesList = alignmentOptions.principles
      .map(p => typeof p === 'string' ? p : p.name)
      .join(', ');
    suggestions.push(`Better align content with key principles: ${principlesList}`);
  }
  
  if (results.scores.standardsAlignment < 0.7 && alignmentOptions.standards.length > 0) {
    const standardsList = alignmentOptions.standards
      .map(s => typeof s === 'string' ? s : s.name)
      .join(', ');
    suggestions.push(`Ensure compliance with applicable standards: ${standardsList}`);
  }
  
  if (results.scores.practicesAlignment < 0.7 && alignmentOptions.practices.length > 0) {
    const practicesList = alignmentOptions.practices
      .map(p => typeof p === 'string' ? p : p.name)
      .join(', ');
    suggestions.push(`Adhere to established best practices: ${practicesList}`);
  }
  
  return suggestions;
}

// Helper functions for risk validation

/**
 * Get default risk factors based on context
 * @param {Object} context - The validation context
 * @returns {Array} List of default risk factors
 */
function getDefaultRiskFactors(context) {
  const commonRiskFactors = [
    {
      id: 'security',
      name: 'Security Risk',
      description: 'Risk of introducing security vulnerabilities',
      weight: 0.4,
      threshold: 0.3,
      mitigation: 'Ensure secure coding practices and perform security review'
    },
    {
      id: 'compatibility',
      name: 'Compatibility Risk',
      description: 'Risk of incompatibility with existing systems',
      weight: 0.2,
      threshold: 0.4,
      mitigation: 'Test compatibility with all target systems'
    },
    {
      id: 'performance',
      name: 'Performance Risk',
      description: 'Risk of performance degradation',
      weight: 0.2,
      threshold: 0.4,
      mitigation: 'Conduct performance testing and optimization'
    },
    {
      id: 'complexity',
      name: 'Complexity Risk',
      description: 'Risk of introducing excessive complexity',
      weight: 0.1,
      threshold: 0.5,
      mitigation: 'Refactor to simplify and improve maintainability'
    },
    {
      id: 'maintenance',
      name: 'Maintenance Risk',
      description: 'Risk of creating difficult-to-maintain code',
      weight: 0.1,
      threshold: 0.5,
      mitigation: 'Follow maintainability best practices and add documentation'
    }
  ];
  
  // Add domain-specific risk factors
  if (context.domain) {
    const domain = context.domain.toLowerCase();
    
    if (domain === 'security') {
      commonRiskFactors.push({
        id: 'compliance',
        name: 'Compliance Risk',
        description: 'Risk of non-compliance with security regulations',
        weight: 0.4,
        threshold: 0.2,
        mitigation: 'Verify compliance with all applicable security regulations'
      });
    } else if (domain === 'performance') {
      commonRiskFactors.push({
        id: 'scalability',
        name: 'Scalability Risk',
        description: 'Risk of poor scalability under load',
        weight: 0.4,
        threshold: 0.3,
        mitigation: 'Conduct load testing and design for horizontal scaling'
      });
    }
  }
  
  return commonRiskFactors;
}

/**
 * Get default critical risk areas based on context
 * @param {Object} context - The validation context
 * @returns {Array} List of critical risk area IDs
 */
function getDefaultCriticalRiskAreas(context) {
  const criticalAreas = ['security']; // Security is always critical
  
  // Add domain-specific critical areas
  if (context.domain) {
    const domain = context.domain.toLowerCase();
    
    if (domain === 'security') {
      criticalAreas.push('compliance');
    } else if (domain === 'performance') {
      criticalAreas.push('scalability');
    }
  }
  
  return criticalAreas;
}

/**
 * Assess a specific risk factor
 * @param {Object} knowledge - The knowledge to assess
 * @param {Object} context - The validation context
 * @param {Object} factor - The risk factor to assess
 * @returns {number} Risk level between 0 and 1 (higher is riskier)
 */
function assessRiskFactor(knowledge, context, factor) {
  // In a real implementation, this would perform factor-specific risk assessment
  // For this implementation, we'll provide a basic assessment
  
  if (!knowledge.content) {
    return 0.5; // Neutral risk if no content to assess
  }
  
  const content = knowledge.content.toLowerCase();
  const factorId = factor.id.toLowerCase();
  
  // Specific risk assessment based on factor ID
  switch (factorId) {
    case 'security':
      return assessSecurityRisk(content, context);
    
    case 'compatibility':
      return assessCompatibilityRisk(content, context);
    
    case 'performance':
      return assessPerformanceRisk(content, context);
    
    case 'complexity':
      return assessComplexityRisk(content, context);
    
    case 'maintenance':
      return assessMaintenanceRisk(content, context);
    
    case 'compliance':
      return assessComplianceRisk(content, context);
    
    case 'scalability':
      return assessScalabilityRisk(content, context);
    
    default:
      return assessGenericRisk(content, factor);
  }
}

/**
 * Assess security risk
 * @param {string} content - Knowledge content
 * @param {Object} context - Validation context
 * @returns {number} Risk level between 0 and 1
 */
function assessSecurityRisk(content, context) {
  let riskLevel = 0.3; // Start with moderate-low risk
  
  // Check for security risk indicators
  const securityRiskIndicators = [
    'password', 'credential', 'token', 'secret', 'auth',
    'sql', 'query', 'exec', 'eval', 'deserialize',
    'permission', 'privilege', 'admin', 'root', 'sudo',
    'raw', 'unsafe', 'bypass', 'override', 'backdoor'
  ];
  
  // Check for security protection indicators
  const securityProtections = [
    'sanitize', 'escape', 'validate', 'whitelist',
    'prepared statement', 'parameterized', 'authentication',
    'authorization', 'encryption', 'hash', 'hmac',
    'security review', 'security control'
  ];
  
  // Count risk indicators
  let riskCount = 0;
  for (const indicator of securityRiskIndicators) {
    if (content.includes(indicator)) {
      riskCount++;
    }
  }
  
  // Count protection indicators
  let protectionCount = 0;
  for (const protection of securityProtections) {
    if (content.includes(protection)) {
      protectionCount++;
    }
  }
  
  // Adjust risk based on counts
  riskLevel += Math.min(0.4, riskCount * 0.05);  // Increase for risk indicators
  riskLevel -= Math.min(0.4, protectionCount * 0.08);  // Decrease for protections
  
  return Math.max(0, Math.min(1, riskLevel));
}

/**
 * Assess compatibility risk
 * @param {string} content - Knowledge content
 * @param {Object} context - Validation context
 * @returns {number} Risk level between 0 and 1
 */
function assessCompatibilityRisk(content, context) {
  let riskLevel = 0.3; // Start with moderate-low risk
  
  // Check for compatibility risk indicators
  const compatibilityRiskIndicators = [
    'specific version', 'only works', 'not compatible', 'requires',
    'dependency', 'platform-specific', 'browser-specific',
    'breaking change', 'deprecated', 'experimental'
  ];
  
  // Check for compatibility protection indicators
  const compatibilityProtections = [
    'cross-platform', 'backward compatible', 'forwards compatible',
    'compatibility layer', 'polyfill', 'shim',
    'feature detection', 'graceful degradation', 'progressive enhancement'
  ];
  
  // Count risk indicators
  let riskCount = 0;
  for (const indicator of compatibilityRiskIndicators) {
    if (content.includes(indicator)) {
      riskCount++;
    }
  }
  
  // Count protection indicators
  let protectionCount = 0;
  for (const protection of compatibilityProtections) {
    if (content.includes(protection)) {
      protectionCount++;
    }
  }
  
  // Adjust risk based on counts
  riskLevel += Math.min(0.5, riskCount * 0.07);
  riskLevel -= Math.min(0.4, protectionCount * 0.08);
  
  return Math.max(0, Math.min(1, riskLevel));
}

/**
 * Assess performance risk
 * @param {string} content - Knowledge content
 * @param {Object} context - Validation context
 * @returns {number} Risk level between 0 and 1
 */
function assessPerformanceRisk(content, context) {
  let riskLevel = 0.3; // Start with moderate-low risk
  
  // Check for performance risk indicators
  const performanceRiskIndicators = [
    'loop within loop', 'nested loop', 'quadratic', 'exponential',
    'expensive', 'heavy', 'slow', 'blocking',
    'recursion', 'deep', 'large', 'intensive'
  ];
  
  // Check for performance protection indicators
  const performanceProtections = [
    'optimize', 'efficient', 'cached', 'memoize',
    'performance test', 'benchmark', 'profiled',
    'lazy load', 'on-demand', 'throttle', 'debounce'
  ];
  
  // Count risk indicators
  let riskCount = 0;
  for (const indicator of performanceRiskIndicators) {
    if (content.includes(indicator)) {
      riskCount++;
    }
  }
  
  // Count protection indicators
  let protectionCount = 0;
  for (const protection of performanceProtections) {
    if (content.includes(protection)) {
      protectionCount++;
    }
  }
  
  // Adjust risk based on counts
  riskLevel += Math.min(0.5, riskCount * 0.06);
  riskLevel -= Math.min(0.4, protectionCount * 0.07);
  
  return Math.max(0, Math.min(1, riskLevel));
}

/**
 * Assess complexity risk
 * @param {string} content - Knowledge content
 * @param {Object} context - Validation context
 * @returns {number} Risk level between 0 and 1
 */
function assessComplexityRisk(content, context) {
  let riskLevel = 0.3; // Start with moderate-low risk
  
  // Check for complexity risk indicators
  const complexityRiskIndicators = [
    'complex', 'complicated', 'intricate', 'sophisticated',
    'multiple', 'nested', 'layered', 'interdependent',
    'special case', 'exception', 'edge case', 'if else',
    'switch case', 'conditional'
  ];
  
  // Check for complexity protection indicators
  const complexityProtections = [
    'simple', 'straightforward', 'clean', 'elegant',
    'refactor', 'decompose', 'modular', 'component',
    'abstract', 'encapsulate', 'separate', 'single responsibility'
  ];
  
  // Count risk indicators
  let riskCount = 0;
  for (const indicator of complexityRiskIndicators) {
    if (content.includes(indicator)) {
      riskCount++;
    }
  }
  
  // Count protection indicators
  let protectionCount = 0;
  for (const protection of complexityProtections) {
    if (content.includes(protection)) {
      protectionCount++;
    }
  }
  
  // Adjust risk based on counts
  riskLevel += Math.min(0.5, riskCount * 0.05);
  riskLevel -= Math.min(0.4, protectionCount * 0.06);
  
  return Math.max(0, Math.min(1, riskLevel));
}

/**
 * Assess maintenance risk
 * @param {string} content - Knowledge content
 * @param {Object} context - Validation context
 * @returns {number} Risk level between 0 and 1
 */
function assessMaintenanceRisk(content, context) {
  let riskLevel = 0.3; // Start with moderate-low risk
  
  // Check for maintenance risk indicators
  const maintenanceRiskIndicators = [
    'temporary', 'hack', 'workaround', 'fixme', 'todo',
    'magic number', 'hardcoded', 'duplicate', 'copy paste',
    'tangled', 'coupled', 'tight'
  ];
  
  // Check for maintenance protection indicators
  const maintenanceProtections = [
    'documented', 'comment', 'explain', 'clarify',
    'test', 'unit test', 'integration test', 'coverage',
    'maintainable', 'extensible', 'flexible', 'reusable'
  ];
  
  // Count risk indicators
  let riskCount = 0;
  for (const indicator of maintenanceRiskIndicators) {
    if (content.includes(indicator)) {
      riskCount++;
    }
  }
  
  // Count protection indicators
  let protectionCount = 0;
  for (const protection of maintenanceProtections) {
    if (content.includes(protection)) {
      protectionCount++;
    }
  }
  
  // Adjust risk based on counts
  riskLevel += Math.min(0.5, riskCount * 0.05);
  riskLevel -= Math.min(0.4, protectionCount * 0.06);
  
  return Math.max(0, Math.min(1, riskLevel));
}

/**
 * Assess compliance risk
 * @param {string} content - Knowledge content
 * @param {Object} context - Validation context
 * @returns {number} Risk level between 0 and 1
 */
function assessComplianceRisk(content, context) {
  let riskLevel = 0.4; // Start with moderate risk
  
  // Check for compliance risk indicators
  const complianceRiskIndicators = [
    'requirement', 'compliance', 'regulation', 'standard',
    'law', 'legal', 'policy', 'governance',
    'audit', 'certification', 'mandatory', 'obligatory'
  ];
  
  // Check for compliance protection indicators
  const complianceProtections = [
    'compliant', 'audited', 'certified', 'reviewed',
    'approved', 'validated', 'verified', 'assessed',
    'meets requirement', 'follows regulation', 'adheres to policy'
  ];
  
  // Count risk indicators
  let riskCount = 0;
  for (const indicator of complianceRiskIndicators) {
    if (content.includes(indicator)) {
      riskCount++;
    }
  }
  
  // Count protection indicators
  let protectionCount = 0;
  for (const protection of complianceProtections) {
    if (content.includes(protection)) {
      protectionCount++;
    }
  }
  
  // Adjust risk based on counts
  riskLevel += Math.min(0.4, riskCount * 0.05);
  riskLevel -= Math.min(0.5, protectionCount * 0.08);
  
  return Math.max(0, Math.min(1, riskLevel));
}

/**
 * Assess scalability risk
 * @param {string} content - Knowledge content
 * @param {Object} context - Validation context
 * @returns {number} Risk level between 0 and 1
 */
function assessScalabilityRisk(content, context) {
  let riskLevel = 0.3; // Start with moderate-low risk
  
  // Check for scalability risk indicators
  const scalabilityRiskIndicators = [
    'singleton', 'global', 'bottleneck', 'limited',
    'fixed size', 'hard limit', 'capacity constraint',
    'blocking', 'synchronous', 'single threaded',
    'monolithic', 'central', 'shared state'
  ];
  
  // Check for scalability protection indicators
  const scalabilityProtections = [
    'scale out', 'scale up', 'horizontal scaling', 'vertical scaling',
    'distributed', 'decentralized', 'stateless', 'parallelizable',
    'asynchronous', 'concurrent', 'load balanced', 'sharded'
  ];
  
  // Count risk indicators
  let riskCount = 0;
  for (const indicator of scalabilityRiskIndicators) {
    if (content.includes(indicator)) {
      riskCount++;
    }
  }
  
  // Count protection indicators
  let protectionCount = 0;
  for (const protection of scalabilityProtections) {
    if (content.includes(protection)) {
      protectionCount++;
    }
  }
  
  // Adjust risk based on counts
  riskLevel += Math.min(0.5, riskCount * 0.06);
  riskLevel -= Math.min(0.4, protectionCount * 0.07);
  
  return Math.max(0, Math.min(1, riskLevel));
}

/**
 * Assess generic risk not covered by specific functions
 * @param {string} content - Knowledge content
 * @param {Object} factor - Risk factor specification
 * @returns {number} Risk level between 0 and 1
 */
function assessGenericRisk(content, factor) {
  let riskLevel = 0.4; // Start with moderate risk
  
  // Check for risk indicators (from factor if provided)
  const riskIndicators = factor.indicators || [factor.name.toLowerCase()];
  
  // Check for protection indicators (from factor if provided)
  const protectionIndicators = factor.protections || [`mitigate ${factor.name.toLowerCase()}`];
  
  // Count risk indicators
  let riskCount = 0;
  for (const indicator of riskIndicators) {
    if (content.includes(indicator.toLowerCase())) {
      riskCount++;
    }
  }
  
  // Count protection indicators
  let protectionCount = 0;
  for (const protection of protectionIndicators) {
    if (content.includes(protection.toLowerCase())) {
      protectionCount++;
    }
  }
  
  // Adjust risk based on counts
  riskLevel += Math.min(0.4, riskCount * 0.1);
  riskLevel -= Math.min(0.4, protectionCount * 0.1);
  
  return Math.max(0, Math.min(1, riskLevel));
}

/**
 * Generate risk mitigation suggestions
 * @param {Object} results - Validation results
 * @param {Array} riskFactors - Risk factors assessed
 * @returns {Array} List of risk mitigation suggestions
 */
function generateRiskMitigationSuggestions(results, riskFactors) {
  const suggestions = [];
  
  // Generate suggestions based on identified risks
  for (const risk of results.identifiedRisks) {
    if (risk.mitigation) {
      suggestions.push(risk.mitigation);
    } else {
      suggestions.push(`Address ${risk.factor} risk with appropriate controls`);
    }
  }
  
  // If no specific risks were identified but overall score is concerning
  if (suggestions.length === 0 && results.overallScore > 0.4) {
    suggestions.push('Conduct a thorough risk assessment to identify and address potential issues');
  }
  
  return suggestions;
}

// Domain and task-specific utility functions

/**
 * Get keywords associated with a domain
 * @param {string} domain - Domain name
 * @returns {Array} List of domain-specific keywords
 */
function getDomainKeywords(domain) {
  domain = domain.toLowerCase();
  
  // Simple keyword maps for common domains
  const domainKeywords = {
    'security': ['security', 'protection', 'vulnerability', 'threat', 'risk',
                 'attack', 'exploit', 'malicious', 'safeguard'],
    'performance': ['performance', 'speed', 'efficiency', 'fast', 'slow',
                    'optimization', 'latency', 'throughput', 'bottleneck'],
    'usability': ['usability', 'user experience', 'ux', 'interface', 'accessibility',
                  'ease of use', 'intuitive', 'user-friendly'],
    'reliability': ['reliability', 'stable', 'robust', 'resilient', 'fault-tolerant',
                    'availability', 'uptime', 'recovery', 'redundancy'],
    'scalability': ['scalability', 'scale', 'growth', 'capacity', 'volume',
                   'load', 'horizontal', 'vertical', 'elastic'],
    'maintainability': ['maintainability', 'maintenance', 'clean', 'refactor',
                       'technical debt', 'documentation', 'readability'],
    'frontend': ['frontend', 'ui', 'user interface', 'browser', 'client-side',
                'responsive', 'css', 'html', 'javascript', 'dom'],
    'backend': ['backend', 'server', 'api', 'database', 'service',
               'middleware', 'endpoint', 'request', 'response'],
    'database': ['database', 'db', 'sql', 'nosql', 'query', 'schema',
                'table', 'collection', 'index', 'transaction'],
    'devops': ['devops', 'deployment', 'pipeline', 'ci/cd', 'infrastructure',
              'container', 'docker', 'kubernetes', 'automation']
  };
  
  // Return domain-specific keywords or generic technology keywords
  return domainKeywords[domain] ||
    ['technology', 'software', 'code', 'solution', 'implementation', 'system'];
}

/**
 * Get keywords associated with a task
 * @param {string} task - Task name
 * @returns {Array} List of task-specific keywords
 */
function getTaskKeywords(task) {
  task = task.toLowerCase();
  
  // Simple keyword maps for common tasks
  const taskKeywords = {
    'development': ['develop', 'create', 'implement', 'build', 'code',
                   'construct', 'program', 'design', 'architect'],
    'testing': ['test', 'verify', 'validate', 'check', 'assert',
               'quality assurance', 'qa', 'bug', 'defect'],
    'debugging': ['debug', 'fix', 'issue', 'problem', 'error', 'exception',
                 'failure', 'crash', 'resolve', 'troubleshoot'],
    'optimization': ['optimize', 'improve', 'enhance', 'efficiency', 'performance',
                    'speed up', 'accelerate', 'boost', 'tune'],
    'refactoring': ['refactor', 'restructure', 'reorganize', 'redesign', 'clean',
                   'simplify', 'improve', 'modernize', 'technical debt'],
    'deployment': ['deploy', 'release', 'publish', 'ship', 'deliver',
                  'roll out', 'launch', 'install', 'provision'],
    'monitoring': ['monitor', 'observe', 'track', 'log', 'alert',
                  'dashboard', 'metrics', 'telemetry', 'status'],
    'security review': ['security', 'vulnerability', 'penetration testing', 'pen test',
                       'threat model', 'secure code review', 'audit', 'scan'],
    'documentation': ['document', 'describe', 'explain', 'guide', 'manual',
                     'readme', 'wiki', 'specification', 'reference']
  };
  
  // Return task-specific keywords or generic action keywords
  return taskKeywords[task] ||
    ['perform', 'execute', 'complete', 'accomplish', 'achieve', 'do', 'handle'];
}

/**
 * Check if two domains are related
 * @param {string} domainA - First domain
 * @param {string} domainB - Second domain
 * @returns {boolean} Whether domains are related
 */
function areDomainsRelated(domainA, domainB) {
  domainA = domainA.toLowerCase();
  domainB = domainB.toLowerCase();
  
  // Direct match
  if (domainA === domainB) {
    return true;
  }
  
  // Simple domain relationships map
  const domainRelationships = {
    'security': ['privacy', 'compliance', 'risk', 'protection'],
    'performance': ['optimization', 'efficiency', 'scalability', 'reliability'],
    'usability': ['accessibility', 'user experience', 'ux', 'frontend'],
    'frontend': ['ui', 'usability', 'web', 'client'],
    'backend': ['server', 'api', 'database', 'services'],
    'database': ['data', 'storage', 'backend', 'persistence'],
    'devops': ['deployment', 'ci/cd', 'infrastructure', 'operations']
  };
  
  // Check if domains are in each other's relationship lists
  if (domainRelationships[domainA] && domainRelationships[domainA].includes(domainB)) {
    return true;
  }
  
  if (domainRelationships[domainB] && domainRelationships[domainB].includes(domainA)) {
    return true;
  }
  
  return false;
}

// Export all validation functions
module.exports = {
  validateQuality,
  validateRelevance,
  validateCoherence,
  validateAlignment,
  validateRisk
};