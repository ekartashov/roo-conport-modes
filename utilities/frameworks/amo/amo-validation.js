/**
 * Autonomous Mapping Orchestrator (AMO) - Validation Layer
 * 
 * This module provides validation capabilities for the AMO system,
 * implementing specialized validators for relationships, mapping schemas, and queries.
 */

/**
 * Validates a relationship between knowledge artifacts
 * @param {Object} relationship - The relationship to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation results
 */
function validateRelationship(relationship, options = {}) {
  const {
    strictMode = false,
    validateProperties = true,
    validateMetadata = true,
    requiredProperties = [],
    allowedTypes = null,
    minConfidence = 0.5
  } = options;
  
  const results = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // Validate required fields
  const requiredFields = ['sourceId', 'sourceType', 'targetId', 'targetType', 'type'];
  for (const field of requiredFields) {
    if (relationship[field] === undefined || relationship[field] === null) {
      results.errors.push(`Missing required field: ${field}`);
      results.isValid = false;
    }
  }
  
  // Return early if missing required fields in strict mode
  if (!results.isValid && strictMode) {
    return results;
  }
  
  // Validate relationship type
  if (relationship.type && allowedTypes && !allowedTypes.includes(relationship.type)) {
    results.errors.push(`Invalid relationship type: ${relationship.type}. Allowed types: ${allowedTypes.join(', ')}`);
    results.isValid = false;
  }
  
  // Validate direction
  const validDirections = ['bidirectional', 'source_to_target', 'target_to_source'];
  if (relationship.direction && !validDirections.includes(relationship.direction)) {
    results.errors.push(`Invalid direction: ${relationship.direction}. Valid directions: ${validDirections.join(', ')}`);
    results.isValid = false;
  }
  
  // Default direction if not specified
  if (!relationship.direction) {
    results.warnings.push('No direction specified, assuming bidirectional');
  }
  
  // Validate confidence score
  if (relationship.confidence !== undefined) {
    if (typeof relationship.confidence !== 'number' || relationship.confidence < 0 || relationship.confidence > 1) {
      results.errors.push(`Invalid confidence score: ${relationship.confidence}. Must be a number between 0 and 1`);
      results.isValid = false;
    } else if (relationship.confidence < minConfidence) {
      results.warnings.push(`Confidence score (${relationship.confidence}) is below minimum threshold (${minConfidence})`);
    }
  } else {
    results.warnings.push('No confidence score specified');
  }
  
  // Validate metadata if required
  if (validateMetadata && relationship.metadata) {
    const metadataResults = validateRelationshipMetadata(relationship.metadata);
    if (!metadataResults.isValid) {
      results.errors.push(...metadataResults.errors);
      results.warnings.push(...metadataResults.warnings);
      results.isValid = false;
    }
  }
  
  // Validate properties if required
  if (validateProperties && relationship.properties) {
    const propertyResults = validateRelationshipProperties(relationship.properties, { requiredProperties });
    if (!propertyResults.isValid) {
      results.errors.push(...propertyResults.errors);
      results.warnings.push(...propertyResults.warnings);
      results.isValid = false;
    }
  }
  
  // Validate IDs are not identical (self-reference)
  if (relationship.sourceId === relationship.targetId && relationship.sourceType === relationship.targetType) {
    results.errors.push('Self-referential relationship detected: source and target are identical');
    results.isValid = false;
  }
  
  return results;
}

/**
 * Validates relationship metadata
 * @param {Object} metadata - The metadata to validate
 * @returns {Object} Validation results
 */
function validateRelationshipMetadata(metadata) {
  const results = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // Check for created timestamp
  if (!metadata.created) {
    results.warnings.push('Missing creation timestamp in metadata');
  } else {
    // Validate timestamp format
    try {
      const date = new Date(metadata.created);
      if (isNaN(date.getTime())) {
        results.errors.push(`Invalid creation timestamp format: ${metadata.created}`);
        results.isValid = false;
      }
    } catch (e) {
      results.errors.push(`Invalid creation timestamp: ${metadata.created}`);
      results.isValid = false;
    }
  }
  
  // Check for creator information
  if (!metadata.createdBy) {
    results.warnings.push('Missing creator information in metadata');
  }
  
  // If there's a lastValidated field, validate its format
  if (metadata.lastValidated) {
    try {
      const date = new Date(metadata.lastValidated);
      if (isNaN(date.getTime())) {
        results.errors.push(`Invalid last validation timestamp format: ${metadata.lastValidated}`);
        results.isValid = false;
      }
    } catch (e) {
      results.errors.push(`Invalid last validation timestamp: ${metadata.lastValidated}`);
      results.isValid = false;
    }
  }
  
  // Check if lastValidated is not in the future
  if (metadata.lastValidated) {
    const lastValidated = new Date(metadata.lastValidated);
    const now = new Date();
    if (lastValidated > now) {
      results.errors.push('Last validation timestamp is in the future');
      results.isValid = false;
    }
  }
  
  return results;
}

/**
 * Validates relationship properties
 * @param {Object} properties - The properties to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation results
 */
function validateRelationshipProperties(properties, options = {}) {
  const {
    requiredProperties = []
  } = options;
  
  const results = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // Check for required properties
  for (const prop of requiredProperties) {
    if (properties[prop] === undefined) {
      results.errors.push(`Missing required property: ${prop}`);
      results.isValid = false;
    }
  }
  
  // Validate strength property if present
  if (properties.strength !== undefined) {
    const validStrengths = ['weak', 'moderate', 'strong', 'definitive'];
    if (!validStrengths.includes(properties.strength)) {
      results.errors.push(`Invalid strength value: ${properties.strength}. Valid values: ${validStrengths.join(', ')}`);
      results.isValid = false;
    }
  }
  
  // Validate description property if present
  if (properties.description !== undefined) {
    if (typeof properties.description !== 'string') {
      results.errors.push('Description must be a string');
      results.isValid = false;
    } else if (properties.description.length < 3) {
      results.warnings.push('Description is too short (< 3 characters)');
    }
  }
  
  // Validate tags property if present
  if (properties.tags !== undefined) {
    if (!Array.isArray(properties.tags)) {
      results.errors.push('Tags must be an array');
      results.isValid = false;
    } else {
      // Check that all tags are strings
      const nonStringTags = properties.tags.filter(tag => typeof tag !== 'string');
      if (nonStringTags.length > 0) {
        results.errors.push('All tags must be strings');
        results.isValid = false;
      }
    }
  }
  
  return results;
}

/**
 * Validates a mapping schema
 * @param {Object} schema - The mapping schema to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation results
 */
function validateMappingSchema(schema, options = {}) {
  const {
    strictMode = false,
    validateRules = true,
    validateTaxonomies = true
  } = options;
  
  const results = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // Validate required fields
  const requiredFields = ['name', 'version', 'relationshipTypes'];
  for (const field of requiredFields) {
    if (schema[field] === undefined) {
      results.errors.push(`Missing required field: ${field}`);
      results.isValid = false;
    }
  }
  
  // Return early if missing required fields in strict mode
  if (!results.isValid && strictMode) {
    return results;
  }
  
  // Validate version format (semver)
  if (schema.version) {
    const semverRegex = /^\d+\.\d+\.\d+$/;
    if (!semverRegex.test(schema.version)) {
      results.errors.push(`Invalid version format: ${schema.version}. Expected semver format (e.g., 1.0.0)`);
      results.isValid = false;
    }
  }
  
  // Validate relationship types
  if (Array.isArray(schema.relationshipTypes)) {
    for (let i = 0; i < schema.relationshipTypes.length; i++) {
      const type = schema.relationshipTypes[i];
      
      if (typeof type === 'string') {
        // Simple string type definition
        continue;
      } else if (typeof type === 'object') {
        // Complex type definition with properties
        if (!type.name) {
          results.errors.push(`Relationship type at index ${i} missing name property`);
          results.isValid = false;
        }
        
        if (type.bidirectional !== undefined && typeof type.bidirectional !== 'boolean') {
          results.errors.push(`Relationship type ${type.name || `at index ${i}`} has invalid bidirectional property (must be boolean)`);
          results.isValid = false;
        }
      } else {
        results.errors.push(`Invalid relationship type definition at index ${i}`);
        results.isValid = false;
      }
    }
  } else if (schema.relationshipTypes !== undefined) {
    results.errors.push('relationshipTypes must be an array');
    results.isValid = false;
  }
  
  // Validate mapping rules if present and required
  if (validateRules && schema.mappingRules) {
    if (!Array.isArray(schema.mappingRules)) {
      results.errors.push('mappingRules must be an array');
      results.isValid = false;
    } else {
      for (let i = 0; i < schema.mappingRules.length; i++) {
        const rule = schema.mappingRules[i];
        const ruleResults = validateMappingRule(rule);
        
        if (!ruleResults.isValid) {
          results.errors.push(`Invalid mapping rule at index ${i}: ${ruleResults.errors.join(', ')}`);
          results.isValid = false;
        }
      }
    }
  }
  
  // Validate taxonomies if present and required
  if (validateTaxonomies && schema.taxonomies) {
    if (typeof schema.taxonomies !== 'object') {
      results.errors.push('taxonomies must be an object');
      results.isValid = false;
    } else {
      for (const [taxonomyName, taxonomy] of Object.entries(schema.taxonomies)) {
        const taxonomyResults = validateTaxonomy(taxonomy);
        
        if (!taxonomyResults.isValid) {
          results.errors.push(`Invalid taxonomy "${taxonomyName}": ${taxonomyResults.errors.join(', ')}`);
          results.isValid = false;
        }
      }
    }
  }
  
  return results;
}

/**
 * Validates a mapping rule
 * @param {Object} rule - The mapping rule to validate
 * @returns {Object} Validation results
 */
function validateMappingRule(rule) {
  const results = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // Check required fields
  const requiredFields = ['sourceType', 'targetType', 'relationshipType'];
  for (const field of requiredFields) {
    if (rule[field] === undefined) {
      results.errors.push(`Missing required field: ${field}`);
      results.isValid = false;
    }
  }
  
  // Validate condition if present
  if (rule.condition) {
    if (typeof rule.condition !== 'string' && typeof rule.condition !== 'function') {
      results.errors.push('Condition must be a string (expression) or function');
      results.isValid = false;
    }
  }
  
  // Validate confidence calculation if present
  if (rule.confidenceCalculation) {
    if (typeof rule.confidenceCalculation !== 'string' && typeof rule.confidenceCalculation !== 'function') {
      results.errors.push('Confidence calculation must be a string (expression) or function');
      results.isValid = false;
    }
  }
  
  // Validate property mappings if present
  if (rule.propertyMappings) {
    if (typeof rule.propertyMappings !== 'object') {
      results.errors.push('Property mappings must be an object');
      results.isValid = false;
    }
  }
  
  return results;
}

/**
 * Validates a taxonomy definition
 * @param {Object} taxonomy - The taxonomy to validate
 * @returns {Object} Validation results
 */
function validateTaxonomy(taxonomy) {
  const results = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  if (!Array.isArray(taxonomy)) {
    if (!taxonomy.terms) {
      results.errors.push('Taxonomy must be an array or an object with a terms property');
      results.isValid = false;
      return results;
    }
    
    if (!Array.isArray(taxonomy.terms)) {
      results.errors.push('Taxonomy terms must be an array');
      results.isValid = false;
      return results;
    }
  }
  
  const terms = Array.isArray(taxonomy) ? taxonomy : taxonomy.terms;
  
  // Check for duplicate term IDs
  const termIds = new Set();
  for (const term of terms) {
    if (typeof term !== 'object') {
      results.errors.push('Each taxonomy term must be an object');
      results.isValid = false;
      continue;
    }
    
    if (!term.id) {
      results.errors.push('Each taxonomy term must have an id');
      results.isValid = false;
      continue;
    }
    
    if (termIds.has(term.id)) {
      results.errors.push(`Duplicate taxonomy term ID: ${term.id}`);
      results.isValid = false;
    } else {
      termIds.add(term.id);
    }
    
    if (!term.name) {
      results.warnings.push(`Taxonomy term ${term.id} has no name`);
    }
    
    // Validate children recursively if present
    if (term.children) {
      if (!Array.isArray(term.children)) {
        results.errors.push(`Children of taxonomy term ${term.id} must be an array`);
        results.isValid = false;
      } else {
        const childResults = validateTaxonomy(term.children);
        if (!childResults.isValid) {
          results.errors.push(`Invalid children for taxonomy term ${term.id}: ${childResults.errors.join(', ')}`);
          results.isValid = false;
        }
      }
    }
  }
  
  return results;
}

/**
 * Validates a knowledge graph query
 * @param {Object} query - The query to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation results
 */
function validateQuery(query, options = {}) {
  const {
    strictMode = false,
    maxDepth = 5,
    maxLimit = 100,
    allowedRelationshipTypes = null,
    allowedItemTypes = null,
    allowedSortFields = ['confidence', 'created', 'relevance']
  } = options;
  
  const results = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // Check if query is empty
  if (!query || Object.keys(query).length === 0) {
    results.errors.push('Query cannot be empty');
    results.isValid = false;
    return results;
  }
  
  // Validate start node (required in most queries)
  if (!query.startNode && !query.startNodes && !query.query) {
    results.errors.push('Query must include startNode, startNodes, or a custom query');
    results.isValid = false;
  }
  
  // Return early if missing required fields in strict mode
  if (!results.isValid && strictMode) {
    return results;
  }
  
  // Validate depth
  if (query.depth !== undefined) {
    if (!Number.isInteger(query.depth) || query.depth < 1) {
      results.errors.push('Depth must be a positive integer');
      results.isValid = false;
    } else if (query.depth > maxDepth) {
      results.warnings.push(`Depth (${query.depth}) exceeds maximum recommended depth (${maxDepth}), which may impact performance`);
    }
  }
  
  // Validate relationship types
  if (query.relationshipTypes !== undefined) {
    if (!Array.isArray(query.relationshipTypes)) {
      results.errors.push('RelationshipTypes must be an array');
      results.isValid = false;
    } else if (allowedRelationshipTypes) {
      // Check if all specified types are allowed
      const invalidTypes = query.relationshipTypes.filter(type => !allowedRelationshipTypes.includes(type));
      if (invalidTypes.length > 0) {
        results.errors.push(`Invalid relationship types: ${invalidTypes.join(', ')}`);
        results.isValid = false;
      }
    }
  }
  
  // Validate direction
  if (query.direction !== undefined) {
    const validDirections = ['inbound', 'outbound', 'bidirectional', 'all'];
    if (!validDirections.includes(query.direction)) {
      results.errors.push(`Invalid direction: ${query.direction}. Valid directions: ${validDirections.join(', ')}`);
      results.isValid = false;
    }
  }
  
  // Validate filters
  if (query.filters !== undefined) {
    if (typeof query.filters !== 'object') {
      results.errors.push('Filters must be an object');
      results.isValid = false;
    } else {
      // Validate itemTypes filter
      if (query.filters.itemTypes !== undefined) {
        if (!Array.isArray(query.filters.itemTypes)) {
          results.errors.push('filters.itemTypes must be an array');
          results.isValid = false;
        } else if (allowedItemTypes) {
          // Check if all specified item types are allowed
          const invalidTypes = query.filters.itemTypes.filter(type => !allowedItemTypes.includes(type));
          if (invalidTypes.length > 0) {
            results.errors.push(`Invalid item types in filter: ${invalidTypes.join(', ')}`);
            results.isValid = false;
          }
        }
      }
      
      // Validate minConfidence filter
      if (query.filters.minConfidence !== undefined) {
        if (typeof query.filters.minConfidence !== 'number' || query.filters.minConfidence < 0 || query.filters.minConfidence > 1) {
          results.errors.push('filters.minConfidence must be a number between 0 and 1');
          results.isValid = false;
        }
      }
      
      // Validate date filters
      if (query.filters.createdAfter || query.filters.createdBefore) {
        try {
          if (query.filters.createdAfter) {
            const date = new Date(query.filters.createdAfter);
            if (isNaN(date.getTime())) {
              results.errors.push(`Invalid createdAfter date format: ${query.filters.createdAfter}`);
              results.isValid = false;
            }
          }
          
          if (query.filters.createdBefore) {
            const date = new Date(query.filters.createdBefore);
            if (isNaN(date.getTime())) {
              results.errors.push(`Invalid createdBefore date format: ${query.filters.createdBefore}`);
              results.isValid = false;
            }
          }
        } catch (e) {
          results.errors.push('Invalid date format in filters');
          results.isValid = false;
        }
      }
    }
  }
  
  // Validate sortBy
  if (query.sortBy !== undefined) {
    if (!allowedSortFields.includes(query.sortBy)) {
      results.errors.push(`Invalid sortBy field: ${query.sortBy}. Allowed fields: ${allowedSortFields.join(', ')}`);
      results.isValid = false;
    }
  }
  
  // Validate limit
  if (query.limit !== undefined) {
    if (!Number.isInteger(query.limit) || query.limit < 1) {
      results.errors.push('Limit must be a positive integer');
      results.isValid = false;
    } else if (query.limit > maxLimit) {
      results.warnings.push(`Limit (${query.limit}) exceeds maximum recommended limit (${maxLimit}), which may impact performance`);
      
      if (strictMode) {
        results.errors.push(`Limit exceeds maximum allowed value of ${maxLimit}`);
        results.isValid = false;
      }
    }
  }
  
  // Check for potential performance issues
  if ((!query.limit || query.limit > 20) && query.depth && query.depth > 2) {
    results.warnings.push('High depth combined with high or unlimited limit may cause performance issues');
  }
  
  return results;
}

// Export validation functions
module.exports = {
  validateRelationship,
  validateMappingSchema,
  validateQuery,
  validateRelationshipMetadata,
  validateRelationshipProperties,
  validateMappingRule,
  validateTaxonomy
};