/**
 * ConPort Maintenance Validation Checkpoints
 * 
 * Provides specialized validation logic for ConPort maintenance operations,
 * ensuring that knowledge management tasks are properly structured and validated.
 */

/**
 * Validation checkpoint for database operation specifications
 */
class OperationSpecificationCheckpoint {
  constructor() {
    this.name = 'OperationSpecification';
    this.description = 'Validates that maintenance operations are properly specified';
  }
  
  /**
   * Validate operation specification
   * @param {Object} operationData - Operation data for validation
   * @returns {Object} - Validation result
   */
  validate(operationData) {
    const { operationType, targetCollection, criteria, options } = operationData;
    
    // Check if operation type is valid
    const validOperationTypes = [
      'audit', 'cleanup', 'reorganize', 'optimize', 'archive', 
      'validate', 'repair', 'migrate', 'enhance', 'merge'
    ];
    
    const hasValidOperationType = validOperationTypes.includes(operationType);
    
    // Check if target collection is specified
    const hasTargetCollection = !!targetCollection && typeof targetCollection === 'string' && targetCollection.trim() !== '';
    
    // Check if criteria is specified for relevant operation types
    const needsCriteria = ['cleanup', 'archive', 'validate', 'repair', 'migrate'];
    const hasCriteria = criteria !== undefined && criteria !== null;
    const criteriaShouldBePresent = needsCriteria.includes(operationType);
    const criteriaValid = !criteriaShouldBePresent || hasCriteria;
    
    // Check if options is an object (if present)
    const optionsValid = !options || (typeof options === 'object' && !Array.isArray(options));
    
    // Determine if validation passed
    const valid = hasValidOperationType && hasTargetCollection && criteriaValid && optionsValid;
    
    // Collect errors
    const errors = [];
    
    if (!hasValidOperationType) {
      errors.push(`Invalid operation type: "${operationType}". Must be one of: ${validOperationTypes.join(', ')}`);
    }
    
    if (!hasTargetCollection) {
      errors.push('Target collection must be specified');
    }
    
    if (criteriaShouldBePresent && !hasCriteria) {
      errors.push(`Operation type "${operationType}" requires criteria to be specified`);
    }
    
    if (!optionsValid) {
      errors.push('Options must be an object if specified');
    }
    
    return {
      valid,
      errors: valid ? null : errors,
      details: {
        hasValidOperationType,
        hasTargetCollection,
        criteriaValid,
        optionsValid
      }
    };
  }
}

/**
 * Validation checkpoint for quality criteria definition
 */
class QualityCriteriaCheckpoint {
  constructor() {
    this.name = 'QualityCriteria';
    this.description = 'Validates that quality criteria are properly defined for maintenance operations';
  }
  
  /**
   * Validate quality criteria
   * @param {Object} operationData - Operation data for validation
   * @returns {Object} - Validation result
   */
  validate(operationData) {
    const { qualityCriteria, operationType } = operationData;
    
    // Check if quality criteria object exists
    const hasCriteriaObject = qualityCriteria && typeof qualityCriteria === 'object' && !Array.isArray(qualityCriteria);
    
    // Define operations that require specific criteria types
    const criteriaRequirements = {
      'audit': ['completeness', 'consistency'],
      'cleanup': ['redundancy', 'staleness'],
      'optimize': ['performance', 'efficiency'],
      'validate': ['accuracy', 'integrity'],
      'repair': ['integrity', 'consistency'],
      'merge': ['consistency', 'uniqueness']
    };
    
    // Check if the operation has specific criteria requirements
    const requiredCriteria = criteriaRequirements[operationType] || [];
    const hasCriteria = {};
    let missingRequiredCriteria = [];
    
    if (hasCriteriaObject && requiredCriteria.length > 0) {
      requiredCriteria.forEach(criteriaType => {
        hasCriteria[criteriaType] = qualityCriteria[criteriaType] !== undefined;
        if (!hasCriteria[criteriaType]) {
          missingRequiredCriteria.push(criteriaType);
        }
      });
    } else if (requiredCriteria.length > 0) {
      missingRequiredCriteria = requiredCriteria;
    }
    
    // Check if criteria values are properly defined (if exist)
    let invalidCriteria = [];
    
    if (hasCriteriaObject) {
      for (const [key, value] of Object.entries(qualityCriteria)) {
        const isValidType = typeof value === 'boolean' || 
                           typeof value === 'number' || 
                           typeof value === 'string' ||
                           typeof value === 'object';
                           
        if (!isValidType) {
          invalidCriteria.push(key);
        }
      }
    }
    
    // Determine if validation passed
    const requiredCriteriaPresent = missingRequiredCriteria.length === 0;
    const criteriaValuesValid = invalidCriteria.length === 0;
    const valid = (requiredCriteria.length === 0 || (hasCriteriaObject && requiredCriteriaPresent)) && criteriaValuesValid;
    
    // Collect errors
    const errors = [];
    
    if (requiredCriteria.length > 0 && !hasCriteriaObject) {
      errors.push(`Quality criteria object required for "${operationType}" operation`);
    } else if (missingRequiredCriteria.length > 0) {
      errors.push(`Missing required quality criteria for "${operationType}" operation: ${missingRequiredCriteria.join(', ')}`);
    }
    
    if (invalidCriteria.length > 0) {
      errors.push(`Invalid quality criteria values: ${invalidCriteria.join(', ')}`);
    }
    
    return {
      valid,
      errors: valid ? null : errors,
      details: {
        hasCriteriaObject,
        requiredCriteriaPresent,
        criteriaValuesValid,
        missingRequiredCriteria,
        invalidCriteria
      }
    };
  }
}

/**
 * Validation checkpoint for relationship integrity
 */
class RelationshipIntegrityCheckpoint {
  constructor() {
    this.name = 'RelationshipIntegrity';
    this.description = 'Validates that relationships between ConPort items are maintained during operations';
  }
  
  /**
   * Validate relationship integrity
   * @param {Object} operationData - Operation data for validation
   * @returns {Object} - Validation result
   */
  validate(operationData) {
    const { operationType, relationshipHandling, targetCollection, affectedRelationships } = operationData;
    
    // Operations that affect relationships
    const relationshipAffectingOperations = ['cleanup', 'archive', 'migrate', 'merge', 'reorganize'];
    const operationAffectsRelationships = relationshipAffectingOperations.includes(operationType);
    
    // Check if relationship handling strategy is specified for relevant operations
    const needsRelationshipHandling = operationAffectsRelationships;
    const hasRelationshipHandling = relationshipHandling !== undefined && relationshipHandling !== null;
    const relationshipHandlingSpecified = !needsRelationshipHandling || hasRelationshipHandling;
    
    // Check if relationship handling strategy is valid
    const validRelationshipHandlingStrategies = ['preserve', 'update', 'delete', 'cascade', 'ignore'];
    const relationshipHandlingValid = !hasRelationshipHandling || 
      (typeof relationshipHandling === 'string' && validRelationshipHandlingStrategies.includes(relationshipHandling));
    
    // Check if affected relationships are identified for relevant operations
    const hasAffectedRelationships = affectedRelationships && Array.isArray(affectedRelationships) && affectedRelationships.length > 0;
    const affectedRelationshipsIdentified = !operationAffectsRelationships || hasAffectedRelationships;
    
    // Determine if validation passed
    const valid = relationshipHandlingSpecified && relationshipHandlingValid && affectedRelationshipsIdentified;
    
    // Collect errors
    const errors = [];
    
    if (needsRelationshipHandling && !hasRelationshipHandling) {
      errors.push(`Relationship handling strategy must be specified for "${operationType}" operation`);
    }
    
    if (hasRelationshipHandling && !relationshipHandlingValid) {
      errors.push(`Invalid relationship handling strategy: "${relationshipHandling}". Must be one of: ${validRelationshipHandlingStrategies.join(', ')}`);
    }
    
    if (operationAffectsRelationships && !hasAffectedRelationships) {
      errors.push(`Affected relationships must be identified for "${operationType}" operation on "${targetCollection}"`);
    }
    
    return {
      valid,
      errors: valid ? null : errors,
      details: {
        operationAffectsRelationships,
        relationshipHandlingSpecified,
        relationshipHandlingValid,
        affectedRelationshipsIdentified
      }
    };
  }
}

/**
 * ConPort Maintenance Validation Checkpoints
 */
class ConPortMaintenanceValidationCheckpoints {
  constructor() {
    this.mode = 'conport-maintenance';
    
    // Initialize checkpoints
    this.checkpoints = [
      new OperationSpecificationCheckpoint(),
      new QualityCriteriaCheckpoint(),
      new RelationshipIntegrityCheckpoint()
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

module.exports = { ConPortMaintenanceValidationCheckpoints };