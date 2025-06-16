/**
 * Mode Engineer Validation - Validation logic specific to mode engineering operations
 * 
 * This module provides comprehensive validation for mode engineering processes,
 * ensuring quality, consistency, and compliance with ecosystem standards.
 */

/**
 * Validates mode engineering requests before processing
 */
function validateModeEngineeringRequest(request) {
  const errors = [];
  const warnings = [];

  // Basic request structure validation
  if (!request || typeof request !== 'object') {
    errors.push('Request must be a valid object');
    return { isValid: false, errors, warnings };
  }

  // Request type validation
  const validTypes = ['create-mode', 'enhance-mode', 'analyze-ecosystem', 'validate-mode'];
  if (!request.type || !validTypes.includes(request.type)) {
    errors.push(`Request type must be one of: ${validTypes.join(', ')}`);
  }

  // Type-specific validation
  switch (request.type) {
    case 'create-mode':
      validateModeCreationRequest(request, errors, warnings);
      break;
    case 'enhance-mode':
      validateModeEnhancementRequest(request, errors, warnings);
      break;
    case 'analyze-ecosystem':
      validateEcosystemAnalysisRequest(request, errors, warnings);
      break;
    case 'validate-mode':
      validateModeValidationRequest(request, errors, warnings);
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    severity: errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'success'
  };
}

/**
 * Validates mode creation requests
 */
function validateModeCreationRequest(request, errors, warnings) {
  // Description validation
  if (!request.description || typeof request.description !== 'string') {
    errors.push('Mode creation request must include a description');
  } else if (request.description.length < 10) {
    warnings.push('Mode description should be more detailed (at least 10 characters)');
  }

  // Domain validation
  if (request.domain && typeof request.domain !== 'string') {
    errors.push('Domain must be a string');
  }

  // Capabilities validation
  if (request.capabilities) {
    if (!Array.isArray(request.capabilities)) {
      errors.push('Capabilities must be an array');
    } else {
      request.capabilities.forEach((cap, index) => {
        if (typeof cap !== 'string') {
          errors.push(`Capability at index ${index} must be a string`);
        }
      });
    }
  }

  // Constraints validation
  if (request.constraints) {
    if (typeof request.constraints !== 'object') {
      errors.push('Constraints must be an object');
    } else {
      validateConstraints(request.constraints, errors, warnings);
    }
  }

  // Complexity validation
  if (request.complexity) {
    const validComplexities = ['low', 'medium', 'high'];
    if (!validComplexities.includes(request.complexity)) {
      errors.push(`Complexity must be one of: ${validComplexities.join(', ')}`);
    }
  }
}

/**
 * Validates mode enhancement requests
 */
function validateModeEnhancementRequest(request, errors, warnings) {
  // Mode ID validation
  if (!request.modeId || typeof request.modeId !== 'string') {
    errors.push('Mode enhancement request must include a valid modeId');
  }

  // Enhancement goals validation
  if (!request.enhancementGoals || !Array.isArray(request.enhancementGoals)) {
    errors.push('Enhancement goals must be provided as an array');
  } else if (request.enhancementGoals.length === 0) {
    warnings.push('No enhancement goals specified');
  }

  // Preserve existing validation
  if (request.preserveExisting !== undefined && typeof request.preserveExisting !== 'boolean') {
    errors.push('preserveExisting must be a boolean');
  }
}

/**
 * Validates ecosystem analysis requests
 */
function validateEcosystemAnalysisRequest(request, errors, warnings) {
  // Scope validation
  if (request.scope) {
    const validScopes = ['all-modes', 'specific-domain', 'capability-focused'];
    if (!validScopes.includes(request.scope)) {
      warnings.push(`Scope should be one of: ${validScopes.join(', ')}`);
    }
  }

  // Analysis depth validation
  if (request.analysisDepth) {
    const validDepths = ['shallow', 'standard', 'comprehensive'];
    if (!validDepths.includes(request.analysisDepth)) {
      errors.push(`Analysis depth must be one of: ${validDepths.join(', ')}`);
    }
  }
}

/**
 * Validates mode validation requests
 */
function validateModeValidationRequest(request, errors, warnings) {
  // Mode content validation
  if (!request.mode || typeof request.mode !== 'object') {
    errors.push('Mode validation request must include mode content');
  }

  // Validation standards
  if (request.standards && !Array.isArray(request.standards)) {
    errors.push('Standards must be an array');
  }
}

/**
 * Validates constraint objects
 */
function validateConstraints(constraints, errors, warnings) {
  // Compatibility constraints
  if (constraints.compatibility) {
    const validCompatibilities = ['roo-ecosystem', 'legacy', 'experimental'];
    if (!validCompatibilities.includes(constraints.compatibility)) {
      warnings.push(`Compatibility should be one of: ${validCompatibilities.join(', ')}`);
    }
  }

  // Performance constraints
  if (constraints.performance) {
    const validPerformance = ['low', 'standard', 'high', 'optimal'];
    if (!validPerformance.includes(constraints.performance)) {
      warnings.push(`Performance should be one of: ${validPerformance.join(', ')}`);
    }
  }

  // Dependencies validation
  if (constraints.dependencies && !Array.isArray(constraints.dependencies)) {
    errors.push('Dependencies must be an array');
  }
}

/**
 * Validates mode YAML structure
 */
function validateModeYAMLStructure(modeDefinition) {
  const errors = [];
  const warnings = [];

  // Required fields
  const requiredFields = ['slug', 'name', 'model', 'roleDefinition', 'whenToUse'];
  requiredFields.forEach(field => {
    if (!modeDefinition[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Slug validation
  if (modeDefinition.slug) {
    if (!/^[a-z0-9-]+$/.test(modeDefinition.slug)) {
      errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
    }
    if (modeDefinition.slug.length > 50) {
      warnings.push('Slug should be shorter than 50 characters');
    }
  }

  // Name validation
  if (modeDefinition.name) {
    if (modeDefinition.name.length > 100) {
      warnings.push('Name should be shorter than 100 characters');
    }
    if (!/^[🎯🏗️💻🪲❓🪃🪄🗃️].+/.test(modeDefinition.name)) {
      warnings.push('Name should start with an emoji for consistency');
    }
  }

  // Model validation
  if (modeDefinition.model) {
    const validModels = ['claude-sonnet-4', 'claude-haiku-3', 'gpt-4', 'gpt-3.5-turbo'];
    if (!validModels.includes(modeDefinition.model)) {
      warnings.push(`Model should be one of the supported models: ${validModels.join(', ')}`);
    }
  }

  // Role definition validation
  if (modeDefinition.roleDefinition) {
    if (modeDefinition.roleDefinition.length < 50) {
      warnings.push('Role definition should be more detailed (at least 50 characters)');
    }
    if (modeDefinition.roleDefinition.length > 1000) {
      warnings.push('Role definition should be more concise (less than 1000 characters)');
    }
  }

  // When to use validation
  if (modeDefinition.whenToUse) {
    if (modeDefinition.whenToUse.length < 30) {
      warnings.push('When to use description should be more detailed');
    }
  }

  // Custom instructions validation
  if (modeDefinition.customInstructions) {
    if (modeDefinition.customInstructions.length > 10000) {
      warnings.push('Custom instructions are very long, consider breaking into sections');
    }
  }

  // Permissions validation
  if (modeDefinition.permissions) {
    validatePermissions(modeDefinition.permissions, errors, warnings);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: calculateStructureScore(modeDefinition, errors, warnings)
  };
}

/**
 * Validates permission structure
 */
function validatePermissions(permissions, errors, warnings) {
  // Read permissions
  if (permissions.read && !Array.isArray(permissions.read)) {
    errors.push('Read permissions must be an array');
  }

  // Edit permissions
  if (permissions.edit && !Array.isArray(permissions.edit)) {
    errors.push('Edit permissions must be an array');
  }

  // Boolean permissions
  const booleanPermissions = ['browser', 'command', 'mcp'];
  booleanPermissions.forEach(perm => {
    if (permissions[perm] !== undefined && typeof permissions[perm] !== 'boolean') {
      errors.push(`${perm} permission must be a boolean`);
    }
  });

  // Check for overly broad permissions
  if (permissions.edit && permissions.edit.includes('**/*')) {
    warnings.push('Edit permissions include all files - consider being more specific');
  }
}

/**
 * Validates framework integration in mode
 */
function validateFrameworkIntegration(modeDefinition, availableFrameworks = []) {
  const errors = [];
  const warnings = [];
  const integrations = [];

  const customInstructions = modeDefinition.customInstructions || '';

  // Check for Phase 4 framework usage
  const frameworks = ['KDAP', 'AKAF', 'KSE', 'SIVS', 'AMO', 'CCF'];
  frameworks.forEach(framework => {
    const pattern = new RegExp(`${framework}\\s+Integration`, 'i');
    if (pattern.test(customInstructions)) {
      integrations.push(framework);
    }
  });

  // Validate framework consistency
  if (integrations.length > 0) {
    if (!customInstructions.includes('utilities/frameworks/mode-engineer')) {
      warnings.push('Mode uses frameworks but does not reference mode engineering utilities');
    }

    if (!customInstructions.includes('ConPort')) {
      warnings.push('Framework integration should include ConPort integration');
    }
  }

  // Check for utility references
  const utilityPattern = /utilities\/[a-zA-Z0-9-_\/]+/g;
  const utilityReferences = customInstructions.match(utilityPattern) || [];

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    integrations,
    utilityReferences,
    frameworkUtilization: integrations.length / frameworks.length
  };
}

/**
 * Validates ecosystem compatibility
 */
function validateEcosystemCompatibility(newMode, existingModes = []) {
  const errors = [];
  const warnings = [];
  const conflicts = [];

  // Check for slug conflicts
  const slugConflict = existingModes.find(mode => mode.slug === newMode.slug);
  if (slugConflict) {
    errors.push(`Slug '${newMode.slug}' already exists`);
  }

  // Check for name conflicts
  const nameConflict = existingModes.find(mode => mode.name === newMode.name);
  if (nameConflict) {
    warnings.push(`Name '${newMode.name}' is very similar to existing mode`);
  }

  // Check for capability overlaps
  if (newMode.capabilities && Array.isArray(newMode.capabilities)) {
    existingModes.forEach(existingMode => {
      if (existingMode.capabilities && Array.isArray(existingMode.capabilities)) {
        const overlap = newMode.capabilities.filter(cap => 
          existingMode.capabilities.includes(cap)
        );
        if (overlap.length > 0) {
          conflicts.push({
            mode: existingMode.slug,
            overlappingCapabilities: overlap,
            severity: overlap.length === newMode.capabilities.length ? 'high' : 'medium'
          });
        }
      }
    });
  }

  // Check permission conflicts
  if (newMode.permissions && newMode.permissions.edit) {
    existingModes.forEach(existingMode => {
      if (existingMode.permissions && existingMode.permissions.edit) {
        const editOverlap = newMode.permissions.edit.filter(path =>
          existingMode.permissions.edit.some(existingPath =>
            path === existingPath || path.includes('**') || existingPath.includes('**')
          )
        );
        if (editOverlap.length > 0) {
          warnings.push(`Edit permission overlap with ${existingMode.slug}: ${editOverlap.join(', ')}`);
        }
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    conflicts,
    compatibilityScore: calculateCompatibilityScore(errors, warnings, conflicts)
  };
}

/**
 * Comprehensive mode validation combining all validation aspects
 */
function validateMode(mode, context = {}) {
  const results = {
    overall: { isValid: true, errors: [], warnings: [] },
    structure: null,
    framework: null,
    ecosystem: null
  };

  // Structure validation
  results.structure = validateModeYAMLStructure(mode);
  if (!results.structure.isValid) {
    results.overall.isValid = false;
    results.overall.errors.push(...results.structure.errors);
  }
  results.overall.warnings.push(...results.structure.warnings);

  // Framework integration validation
  results.framework = validateFrameworkIntegration(mode, context.availableFrameworks);
  if (!results.framework.isValid) {
    results.overall.isValid = false;
    results.overall.errors.push(...results.framework.errors);
  }
  results.overall.warnings.push(...results.framework.warnings);

  // Ecosystem compatibility validation
  if (context.existingModes) {
    results.ecosystem = validateEcosystemCompatibility(mode, context.existingModes);
    if (!results.ecosystem.isValid) {
      results.overall.isValid = false;
      results.overall.errors.push(...results.ecosystem.errors);
    }
    results.overall.warnings.push(...results.ecosystem.warnings);
  }

  // Calculate overall score
  results.overall.score = calculateOverallValidationScore(results);

  return results;
}

/**
 * Calculate structure quality score
 */
function calculateStructureScore(modeDefinition, errors, warnings) {
  let score = 100;
  score -= errors.length * 20;
  score -= warnings.length * 5;
  
  // Bonus points for good practices
  if (modeDefinition.customInstructions && modeDefinition.customInstructions.length > 500) {
    score += 10;
  }
  if (modeDefinition.permissions && modeDefinition.permissions.read && modeDefinition.permissions.edit) {
    score += 5;
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate ecosystem compatibility score
 */
function calculateCompatibilityScore(errors, warnings, conflicts) {
  let score = 100;
  score -= errors.length * 30;
  score -= warnings.length * 10;
  score -= conflicts.filter(c => c.severity === 'high').length * 25;
  score -= conflicts.filter(c => c.severity === 'medium').length * 15;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate overall validation score
 */
function calculateOverallValidationScore(results) {
  const weights = {
    structure: 0.4,
    framework: 0.3,
    ecosystem: 0.3
  };

  let totalScore = 0;
  let totalWeight = 0;

  if (results.structure) {
    totalScore += (results.structure.score || 0) * weights.structure;
    totalWeight += weights.structure;
  }

  if (results.framework) {
    const frameworkScore = results.framework.frameworkUtilization * 100;
    totalScore += frameworkScore * weights.framework;
    totalWeight += weights.framework;
  }

  if (results.ecosystem) {
    totalScore += (results.ecosystem.compatibilityScore || 0) * weights.ecosystem;
    totalWeight += weights.ecosystem;
  }

  return totalWeight > 0 ? totalScore / totalWeight : 0;
}

module.exports = {
  validateModeEngineeringRequest,
  validateModeCreationRequest,
  validateModeEnhancementRequest,
  validateEcosystemAnalysisRequest,
  validateModeValidationRequest,
  validateModeYAMLStructure,
  validateFrameworkIntegration,
  validateEcosystemCompatibility,
  validateMode,
  validateConstraints,
  validatePermissions,
  calculateStructureScore,
  calculateCompatibilityScore,
  calculateOverallValidationScore
};