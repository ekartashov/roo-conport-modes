/**
 * Debug Validation Checkpoints
 * 
 * Specialized validation checkpoints for Debug Mode, focusing on error pattern recognition,
 * diagnostic approach completeness, root cause analysis quality, and solution verification.
 */

const { ValidationCheckpoint, ValidationResult } = require('../conport-validation-manager');

/**
 * Validates the completeness of error pattern documentation
 */
class ErrorPatternCheckpoint extends ValidationCheckpoint {
  constructor(options = {}) {
    super({
      name: 'errorPattern',
      description: 'Validates that error patterns are completely documented',
      ...options
    });
    
    this.requiredFields = options.requiredFields || [
      'errorType',
      'errorMessage',
      'reproduceSteps',
      'context'
    ];
    
    this.recommendedFields = options.recommendedFields || [
      'frequency',
      'severity',
      'relatedErrors',
      'originalExpectation'
    ];
    
    this.threshold = options.threshold || 0.75;
  }
  
  /**
   * Validates an error pattern documentation
   * @param {Object} errorPattern - The error pattern to validate
   * @param {Object} context - Additional context for validation
   * @returns {ValidationResult} - Validation result
   */
  validate(errorPattern, context = {}) {
    if (!errorPattern || typeof errorPattern !== 'object') {
      return new ValidationResult({
        valid: false,
        checkpoint: this.name,
        message: 'Error pattern must be a non-null object',
        details: { errorPattern }
      });
    }
    
    // Check required fields
    const missingRequired = this.requiredFields.filter(field => 
      !errorPattern[field] || 
      (typeof errorPattern[field] === 'string' && errorPattern[field].trim() === '')
    );
    
    // Check recommended fields
    const missingRecommended = this.recommendedFields.filter(field => 
      !errorPattern[field] || 
      (typeof errorPattern[field] === 'string' && errorPattern[field].trim() === '')
    );
    
    // Calculate completeness score
    const totalFields = this.requiredFields.length + this.recommendedFields.length;
    const presentFields = totalFields - (missingRequired.length + missingRecommended.length);
    const completenessScore = presentFields / totalFields;
    
    // Create validation result
    const valid = missingRequired.length === 0 && completenessScore >= this.threshold;
    
    return new ValidationResult({
      valid,
      checkpoint: this.name,
      message: valid 
        ? 'Error pattern documentation is complete' 
        : 'Error pattern documentation is incomplete',
      details: {
        missingRequired,
        missingRecommended,
        completenessScore,
        threshold: this.threshold
      },
      suggestedImprovements: [
        ...missingRequired.map(field => ({
          type: 'critical',
          description: `Add required field: ${field}`
        })),
        ...missingRecommended.map(field => ({
          type: 'recommended',
          description: `Consider adding recommended field: ${field}`
        }))
      ]
    });
  }
}

/**
 * Validates the completeness and quality of diagnostic approach
 */
class DiagnosticApproachCheckpoint extends ValidationCheckpoint {
  constructor(options = {}) {
    super({
      name: 'diagnosticApproach',
      description: 'Validates the completeness and quality of the diagnostic approach',
      ...options
    });
    
    this.requiredSteps = options.requiredSteps || [
      'initialObservation',
      'hypothesisFormation',
      'testingApproach',
      'dataCollectionMethod'
    ];
    
    this.recommendedElements = options.recommendedElements || [
      'alternativeApproaches',
      'toolsUsed',
      'environmentFactors',
      'timelineEstimate'
    ];
    
    this.qualityFactors = options.qualityFactors || [
      'systematic',
      'reproducible',
      'efficient',
      'comprehensive'
    ];
    
    this.threshold = options.threshold || 0.7;
  }
  
  /**
   * Validates a diagnostic approach
   * @param {Object} diagnosticApproach - The diagnostic approach to validate
   * @param {Object} context - Additional context for validation
   * @returns {ValidationResult} - Validation result
   */
  validate(diagnosticApproach, context = {}) {
    if (!diagnosticApproach || typeof diagnosticApproach !== 'object') {
      return new ValidationResult({
        valid: false,
        checkpoint: this.name,
        message: 'Diagnostic approach must be a non-null object',
        details: { diagnosticApproach }
      });
    }
    
    // Check required steps
    const missingSteps = this.requiredSteps.filter(step => 
      !diagnosticApproach[step] || 
      (typeof diagnosticApproach[step] === 'string' && diagnosticApproach[step].trim() === '')
    );
    
    // Check recommended elements
    const missingElements = this.recommendedElements.filter(element => 
      !diagnosticApproach[element] || 
      (typeof diagnosticApproach[element] === 'string' && diagnosticApproach[element].trim() === '')
    );
    
    // Check quality factors
    const qualityFactorsPresent = {};
    let qualityScore = 0;
    
    if (diagnosticApproach.qualityAssessment && typeof diagnosticApproach.qualityAssessment === 'object') {
      this.qualityFactors.forEach(factor => {
        qualityFactorsPresent[factor] = !!diagnosticApproach.qualityAssessment[factor];
        if (qualityFactorsPresent[factor]) {
          qualityScore += 1;
        }
      });
    }
    
    qualityScore = qualityScore / this.qualityFactors.length;
    
    // Calculate overall score
    const stepScore = (this.requiredSteps.length - missingSteps.length) / this.requiredSteps.length;
    const elementScore = (this.recommendedElements.length - missingElements.length) / this.recommendedElements.length;
    const overallScore = (stepScore * 0.5) + (elementScore * 0.2) + (qualityScore * 0.3);
    
    // Create validation result
    const valid = missingSteps.length === 0 && overallScore >= this.threshold;
    
    return new ValidationResult({
      valid,
      checkpoint: this.name,
      message: valid 
        ? 'Diagnostic approach is complete and of good quality' 
        : 'Diagnostic approach needs improvement',
      details: {
        missingSteps,
        missingElements,
        qualityFactorsPresent,
        stepScore,
        elementScore,
        qualityScore,
        overallScore,
        threshold: this.threshold
      },
      suggestedImprovements: [
        ...missingSteps.map(step => ({
          type: 'critical',
          description: `Add required diagnostic step: ${step}`
        })),
        ...missingElements.map(element => ({
          type: 'recommended',
          description: `Consider adding diagnostic element: ${element}`
        })),
        ...this.qualityFactors
          .filter(factor => !qualityFactorsPresent[factor])
          .map(factor => ({
            type: 'quality',
            description: `Improve ${factor} aspect of the diagnostic approach`
          }))
      ]
    });
  }
}

/**
 * Validates the completeness and quality of root cause analysis
 */
class RootCauseAnalysisCheckpoint extends ValidationCheckpoint {
  constructor(options = {}) {
    super({
      name: 'rootCauseAnalysis',
      description: 'Validates the completeness and quality of root cause analysis',
      ...options
    });
    
    this.requiredElements = options.requiredElements || [
      'identifiedCause',
      'evidenceSupporting',
      'impactScope',
      'originAnalysis'
    ];
    
    this.recommendedElements = options.recommendedElements || [
      'alternativeCauses',
      'evidenceAgainstAlternatives',
      'underlyingFactors',
      'technicalContext'
    ];
    
    this.causalChainDepth = options.causalChainDepth || 2;
    this.threshold = options.threshold || 0.8;
  }
  
  /**
   * Validates a root cause analysis
   * @param {Object} rootCauseAnalysis - The root cause analysis to validate
   * @param {Object} context - Additional context for validation
   * @returns {ValidationResult} - Validation result
   */
  validate(rootCauseAnalysis, context = {}) {
    if (!rootCauseAnalysis || typeof rootCauseAnalysis !== 'object') {
      return new ValidationResult({
        valid: false,
        checkpoint: this.name,
        message: 'Root cause analysis must be a non-null object',
        details: { rootCauseAnalysis }
      });
    }
    
    // Check required elements
    const missingElements = this.requiredElements.filter(element => 
      !rootCauseAnalysis[element] || 
      (typeof rootCauseAnalysis[element] === 'string' && rootCauseAnalysis[element].trim() === '')
    );
    
    // Check recommended elements
    const missingRecommended = this.recommendedElements.filter(element => 
      !rootCauseAnalysis[element] || 
      (typeof rootCauseAnalysis[element] === 'string' && rootCauseAnalysis[element].trim() === '')
    );
    
    // Check causal chain depth
    let causalChainDepth = 0;
    if (rootCauseAnalysis.causalChain && Array.isArray(rootCauseAnalysis.causalChain)) {
      causalChainDepth = rootCauseAnalysis.causalChain.length;
    }
    
    const sufficientDepth = causalChainDepth >= this.causalChainDepth;
    
    // Check evidence quality
    let evidenceQuality = 0;
    if (rootCauseAnalysis.evidenceSupporting) {
      if (Array.isArray(rootCauseAnalysis.evidenceSupporting)) {
        evidenceQuality = Math.min(1, rootCauseAnalysis.evidenceSupporting.length / 3);
      } else {
        evidenceQuality = 0.3; // Minimal evidence quality if not an array of evidence items
      }
    }
    
    // Calculate overall score
    const elementsScore = (this.requiredElements.length - missingElements.length) / this.requiredElements.length;
    const recommendedScore = (this.recommendedElements.length - missingRecommended.length) / this.recommendedElements.length;
    
    const overallScore = (elementsScore * 0.5) + 
                        (recommendedScore * 0.2) + 
                        (sufficientDepth ? 0.15 : 0) + 
                        (evidenceQuality * 0.15);
    
    // Create validation result
    const valid = missingElements.length === 0 && overallScore >= this.threshold;
    
    return new ValidationResult({
      valid,
      checkpoint: this.name,
      message: valid 
        ? 'Root cause analysis is complete and well-supported' 
        : 'Root cause analysis needs improvement',
      details: {
        missingElements,
        missingRecommended,
        causalChainDepth,
        sufficientDepth,
        evidenceQuality,
        elementsScore,
        recommendedScore,
        overallScore,
        threshold: this.threshold
      },
      suggestedImprovements: [
        ...missingElements.map(element => ({
          type: 'critical',
          description: `Add required analysis element: ${element}`
        })),
        ...missingRecommended.map(element => ({
          type: 'recommended',
          description: `Consider adding analysis element: ${element}`
        })),
        ...(sufficientDepth ? [] : [{
          type: 'quality',
          description: `Deepen causal chain analysis to at least ${this.causalChainDepth} levels`
        }]),
        ...(evidenceQuality < 0.7 ? [{
          type: 'quality',
          description: 'Provide more evidence supporting the identified root cause'
        }] : [])
      ]
    });
  }
}

/**
 * Validates solution effectiveness and verification
 */
class SolutionVerificationCheckpoint extends ValidationCheckpoint {
  constructor(options = {}) {
    super({
      name: 'solutionVerification',
      description: 'Validates that the solution is properly verified and effective',
      ...options
    });
    
    this.requiredElements = options.requiredElements || [
      'proposedSolution',
      'implementationSteps',
      'verificationMethod',
      'expectedOutcome'
    ];
    
    this.recommendedElements = options.recommendedElements || [
      'alternativeSolutions',
      'sideEffects',
      'performanceImpact',
      'longTermConsiderations'
    ];
    
    this.verificationMethods = options.verificationMethods || [
      'testing',
      'codeReview',
      'monitoring',
      'userFeedback'
    ];
    
    this.threshold = options.threshold || 0.75;
  }
  
  /**
   * Validates a solution verification
   * @param {Object} solutionVerification - The solution verification to validate
   * @param {Object} context - Additional context for validation
   * @returns {ValidationResult} - Validation result
   */
  validate(solutionVerification, context = {}) {
    if (!solutionVerification || typeof solutionVerification !== 'object') {
      return new ValidationResult({
        valid: false,
        checkpoint: this.name,
        message: 'Solution verification must be a non-null object',
        details: { solutionVerification }
      });
    }
    
    // Check required elements
    const missingElements = this.requiredElements.filter(element => 
      !solutionVerification[element] || 
      (typeof solutionVerification[element] === 'string' && solutionVerification[element].trim() === '')
    );
    
    // Check recommended elements
    const missingRecommended = this.recommendedElements.filter(element => 
      !solutionVerification[element] || 
      (typeof solutionVerification[element] === 'string' && solutionVerification[element].trim() === '')
    );
    
    // Check verification methods
    const verificationMethodsUsed = [];
    if (solutionVerification.verificationMethod) {
      if (typeof solutionVerification.verificationMethod === 'string') {
        const methods = solutionVerification.verificationMethod
          .toLowerCase()
          .split(/[,;]/)
          .map(m => m.trim());
        
        this.verificationMethods.forEach(method => {
          if (methods.some(m => m.includes(method.toLowerCase()))) {
            verificationMethodsUsed.push(method);
          }
        });
      } else if (Array.isArray(solutionVerification.verificationMethod)) {
        this.verificationMethods.forEach(method => {
          if (solutionVerification.verificationMethod.some(m => 
              typeof m === 'string' && m.toLowerCase().includes(method.toLowerCase())
          )) {
            verificationMethodsUsed.push(method);
          }
        });
      }
    }
    
    const verificationScore = verificationMethodsUsed.length / Math.min(2, this.verificationMethods.length);
    
    // Check implementation steps quality
    let implementationStepsQuality = 0;
    if (solutionVerification.implementationSteps) {
      if (Array.isArray(solutionVerification.implementationSteps)) {
        implementationStepsQuality = Math.min(1, solutionVerification.implementationSteps.length / 3);
      } else if (typeof solutionVerification.implementationSteps === 'string') {
        const steps = solutionVerification.implementationSteps.split(/[\n;.]/).filter(s => s.trim().length > 0);
        implementationStepsQuality = Math.min(1, steps.length / 3);
      }
    }
    
    // Calculate overall score
    const elementsScore = (this.requiredElements.length - missingElements.length) / this.requiredElements.length;
    const recommendedScore = (this.recommendedElements.length - missingRecommended.length) / this.recommendedElements.length;
    
    const overallScore = (elementsScore * 0.5) + 
                        (recommendedScore * 0.2) + 
                        (verificationScore * 0.2) + 
                        (implementationStepsQuality * 0.1);
    
    // Create validation result
    const valid = missingElements.length === 0 && overallScore >= this.threshold;
    
    return new ValidationResult({
      valid,
      checkpoint: this.name,
      message: valid 
        ? 'Solution verification is complete and effective' 
        : 'Solution verification needs improvement',
      details: {
        missingElements,
        missingRecommended,
        verificationMethodsUsed,
        verificationScore,
        implementationStepsQuality,
        elementsScore,
        recommendedScore,
        overallScore,
        threshold: this.threshold
      },
      suggestedImprovements: [
        ...missingElements.map(element => ({
          type: 'critical',
          description: `Add required verification element: ${element}`
        })),
        ...missingRecommended.map(element => ({
          type: 'recommended',
          description: `Consider adding verification element: ${element}`
        })),
        ...(verificationMethodsUsed.length < 2 ? [{
          type: 'quality',
          description: `Use at least 2 verification methods (consider: ${
            this.verificationMethods
              .filter(m => !verificationMethodsUsed.includes(m))
              .join(', ')
          })`
        }] : []),
        ...(implementationStepsQuality < 0.7 ? [{
          type: 'quality',
          description: 'Provide more detailed implementation steps (at least 3 specific steps)'
        }] : [])
      ]
    });
  }
}

module.exports = {
  ErrorPatternCheckpoint,
  DiagnosticApproachCheckpoint,
  RootCauseAnalysisCheckpoint,
  SolutionVerificationCheckpoint
};