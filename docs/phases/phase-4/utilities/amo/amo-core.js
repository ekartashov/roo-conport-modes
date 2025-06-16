/**
 * Autonomous Mapping Orchestrator (AMO) - Core Layer
 * 
 * This module provides the core functionality for the AMO system,
 * including relationship management, mapping orchestration, and knowledge graph operations.
 */

const { 
  validateRelationship, 
  validateMappingSchema,
  validateQuery 
} = require('./amo-validation');

/**
 * Manages knowledge artifact relationships
 */
class RelationshipManager {
  /**
   * Creates a new RelationshipManager instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.relationships = new Map();
    this.options = {
      strictValidation: false,
      autoGenerateMetadata: true,
      deduplicateRelationships: true,
      trackHistory: true,
      ...options
    };
    
    // Initialize storage for different relationship indices
    this._sourceIndex = new Map(); // sourceType:sourceId -> [relationships]
    this._targetIndex = new Map(); // targetType:targetId -> [relationships]
    this._typeIndex = new Map();   // type -> [relationships]
    
    // Track relationship version history if enabled
    this._relationshipHistory = this.options.trackHistory ? new Map() : null;
  }
  
  /**
   * Adds a new relationship
   * @param {Object} relationship - The relationship to add
   * @param {Object} options - Additional options
   * @returns {Object} The added relationship with generated ID
   */
  addRelationship(relationship, options = {}) {
    const { 
      skipValidation = false,
      overwriteExisting = false,
      validateOptions = {},
      generateId = true
    } = options;
    
    // Validate the relationship
    if (!skipValidation) {
      const validationResults = validateRelationship(relationship, {
        strictMode: this.options.strictValidation,
        ...validateOptions
      });
      
      if (!validationResults.isValid) {
        throw new Error(`Invalid relationship: ${validationResults.errors.join(', ')}`);
      }
    }
    
    // Generate metadata if not present and auto-generation is enabled
    if (this.options.autoGenerateMetadata && (!relationship.metadata || Object.keys(relationship.metadata).length === 0)) {
      relationship = {
        ...relationship,
        metadata: {
          created: new Date().toISOString(),
          createdBy: 'amo-system',
          version: 1
        }
      };
    }
    
    // Generate an ID if not present and generation is enabled
    let relationshipId = relationship.id;
    if (!relationshipId && generateId) {
      relationshipId = this._generateRelationshipId(relationship);
      relationship = { ...relationship, id: relationshipId };
    }
    
    // Check for duplicates if configured to deduplicate
    if (this.options.deduplicateRelationships && !overwriteExisting) {
      const existingRelationship = this.findDuplicateRelationship(relationship);
      if (existingRelationship) {
        return existingRelationship; // Return the existing relationship instead of adding a duplicate
      }
    }
    
    // Store the relationship
    if (relationshipId) {
      if (this.relationships.has(relationshipId) && !overwriteExisting) {
        throw new Error(`Relationship with ID ${relationshipId} already exists`);
      }
      
      // Save history if tracking is enabled
      if (this.options.trackHistory && this.relationships.has(relationshipId)) {
        this._saveRelationshipHistory(relationshipId, this.relationships.get(relationshipId));
      }
      
      // Store the relationship and update indices
      this.relationships.set(relationshipId, relationship);
      this._indexRelationship(relationship);
      
      return relationship;
    } else {
      throw new Error('Failed to generate or determine relationship ID');
    }
  }
  
  /**
   * Updates an existing relationship
   * @param {string} relationshipId - The ID of the relationship to update
   * @param {Object} updates - The updates to apply
   * @param {Object} options - Additional options
   * @returns {Object} The updated relationship
   */
  updateRelationship(relationshipId, updates, options = {}) {
    const { 
      skipValidation = false,
      validateOptions = {},
      incrementVersion = true
    } = options;
    
    if (!this.relationships.has(relationshipId)) {
      throw new Error(`Relationship ${relationshipId} not found`);
    }
    
    const currentRelationship = this.relationships.get(relationshipId);
    
    // Save to history before updating if tracking is enabled
    if (this.options.trackHistory) {
      this._saveRelationshipHistory(relationshipId, currentRelationship);
    }
    
    // Create updated relationship (shallow merge)
    const updatedRelationship = {
      ...currentRelationship,
      ...updates,
      metadata: {
        ...currentRelationship.metadata,
        ...updates.metadata,
        lastUpdated: new Date().toISOString()
      }
    };
    
    // Increment version if configured
    if (incrementVersion && updatedRelationship.metadata && updatedRelationship.metadata.version !== undefined) {
      updatedRelationship.metadata.version = updatedRelationship.metadata.version + 1;
    }
    
    // Validate the updated relationship
    if (!skipValidation) {
      const validationResults = validateRelationship(updatedRelationship, {
        strictMode: this.options.strictValidation,
        ...validateOptions
      });
      
      if (!validationResults.isValid) {
        throw new Error(`Invalid updated relationship: ${validationResults.errors.join(', ')}`);
      }
    }
    
    // Remove old indices and add updated indices
    this._removeRelationshipFromIndices(currentRelationship);
    this.relationships.set(relationshipId, updatedRelationship);
    this._indexRelationship(updatedRelationship);
    
    return updatedRelationship;
  }
  
  /**
   * Removes a relationship by ID
   * @param {string} relationshipId - The ID of the relationship to remove
   * @returns {boolean} True if the relationship was removed, false if not found
   */
  removeRelationship(relationshipId) {
    if (!this.relationships.has(relationshipId)) {
      return false;
    }
    
    // Get the relationship before removing it
    const relationship = this.relationships.get(relationshipId);
    
    // Save to history before removing if tracking is enabled
    if (this.options.trackHistory) {
      this._saveRelationshipHistory(relationshipId, relationship, true);
    }
    
    // Remove from indices
    this._removeRelationshipFromIndices(relationship);
    
    // Remove from main storage
    this.relationships.delete(relationshipId);
    
    return true;
  }
  
  /**
   * Gets a relationship by ID
   * @param {string} relationshipId - The ID of the relationship to get
   * @returns {Object|null} The relationship or null if not found
   */
  getRelationship(relationshipId) {
    return this.relationships.has(relationshipId) ? 
      this.relationships.get(relationshipId) : null;
  }
  
  /**
   * Finds relationships by source
   * @param {string} sourceType - The source type
   * @param {string} sourceId - The source ID
   * @returns {Array} Matching relationships
   */
  findRelationshipsBySource(sourceType, sourceId) {
    const key = `${sourceType}:${sourceId}`;
    return this._sourceIndex.has(key) ? 
      [...this._sourceIndex.get(key)] : [];
  }
  
  /**
   * Finds relationships by target
   * @param {string} targetType - The target type
   * @param {string} targetId - The target ID
   * @returns {Array} Matching relationships
   */
  findRelationshipsByTarget(targetType, targetId) {
    const key = `${targetType}:${targetId}`;
    return this._targetIndex.has(key) ? 
      [...this._targetIndex.get(key)] : [];
  }
  
  /**
   * Finds relationships by type
   * @param {string} type - The relationship type
   * @returns {Array} Matching relationships
   */
  findRelationshipsByType(type) {
    return this._typeIndex.has(type) ? 
      [...this._typeIndex.get(type)] : [];
  }
  
  /**
   * Finds relationships between specific source and target
   * @param {string} sourceType - The source type
   * @param {string} sourceId - The source ID
   * @param {string} targetType - The target type
   * @param {string} targetId - The target ID
   * @returns {Array} Matching relationships
   */
  findRelationshipsBetween(sourceType, sourceId, targetType, targetId) {
    const sourceKey = `${sourceType}:${sourceId}`;
    if (!this._sourceIndex.has(sourceKey)) {
      return [];
    }
    
    return [...this._sourceIndex.get(sourceKey)]
      .filter(rel => rel.targetType === targetType && rel.targetId === targetId);
  }
  
  /**
   * Finds all relationships connected to an item (as source or target)
   * @param {string} itemType - The item type
   * @param {string} itemId - The item ID
   * @returns {Array} Matching relationships
   */
  findRelationshipsForItem(itemType, itemId) {
    const sourceRelationships = this.findRelationshipsBySource(itemType, itemId);
    const targetRelationships = this.findRelationshipsByTarget(itemType, itemId);
    
    // Combine and deduplicate
    const allRelationships = [...sourceRelationships];
    for (const rel of targetRelationships) {
      if (!allRelationships.some(r => r.id === rel.id)) {
        allRelationships.push(rel);
      }
    }
    
    return allRelationships;
  }
  
  /**
   * Finds a potential duplicate of the given relationship
   * @param {Object} relationship - The relationship to check for duplicates
   * @returns {Object|null} The duplicate relationship or null if none found
   */
  findDuplicateRelationship(relationship) {
    // Look for relationships with same source/target/type
    const relsBetween = this.findRelationshipsBetween(
      relationship.sourceType, 
      relationship.sourceId, 
      relationship.targetType, 
      relationship.targetId
    );
    
    return relsBetween.find(rel => rel.type === relationship.type) || null;
  }
  
  /**
   * Gets relationship version history
   * @param {string} relationshipId - The ID of the relationship
   * @returns {Array|null} Array of historical versions or null if not tracked
   */
  getRelationshipHistory(relationshipId) {
    if (!this.options.trackHistory || !this._relationshipHistory) {
      return null;
    }
    
    return this._relationshipHistory.has(relationshipId) ?
      [...this._relationshipHistory.get(relationshipId)] : [];
  }
  
  /**
   * Validates all relationships
   * @param {Object} options - Validation options
   * @returns {Object} Validation results
   */
  validateAllRelationships(options = {}) {
    const results = {
      valid: 0,
      invalid: 0,
      errors: []
    };
    
    for (const [id, relationship] of this.relationships.entries()) {
      const validationResult = validateRelationship(relationship, options);
      
      if (validationResult.isValid) {
        results.valid++;
      } else {
        results.invalid++;
        results.errors.push({
          id,
          errors: validationResult.errors,
          warnings: validationResult.warnings
        });
      }
      
      // Update last validated timestamp if configured
      if (options.updateLastValidated) {
        this.updateRelationship(id, {
          metadata: {
            lastValidated: new Date().toISOString()
          }
        }, { skipValidation: true, incrementVersion: false });
      }
    }
    
    return results;
  }
  
  /**
   * Generates an ID for a relationship
   * @param {Object} relationship - The relationship
   * @returns {string} Generated ID
   * @private
   */
  _generateRelationshipId(relationship) {
    // Create a deterministic ID based on source, target, and type
    const idBase = `rel_${relationship.sourceType}_${relationship.sourceId}_${relationship.targetType}_${relationship.targetId}_${relationship.type}`;
    
    // Add a timestamp for uniqueness if needed
    if (this.findRelationshipsBetween(
      relationship.sourceType, 
      relationship.sourceId, 
      relationship.targetType, 
      relationship.targetId
    ).some(rel => rel.type === relationship.type)) {
      return `${idBase}_${Date.now()}`;
    }
    
    return idBase;
  }
  
  /**
   * Indexes a relationship for fast lookup
   * @param {Object} relationship - The relationship to index
   * @private
   */
  _indexRelationship(relationship) {
    // Source index
    const sourceKey = `${relationship.sourceType}:${relationship.sourceId}`;
    if (!this._sourceIndex.has(sourceKey)) {
      this._sourceIndex.set(sourceKey, new Set());
    }
    this._sourceIndex.get(sourceKey).add(relationship);
    
    // Target index
    const targetKey = `${relationship.targetType}:${relationship.targetId}`;
    if (!this._targetIndex.has(targetKey)) {
      this._targetIndex.set(targetKey, new Set());
    }
    this._targetIndex.get(targetKey).add(relationship);
    
    // Type index
    if (!this._typeIndex.has(relationship.type)) {
      this._typeIndex.set(relationship.type, new Set());
    }
    this._typeIndex.get(relationship.type).add(relationship);
  }
  
  /**
   * Removes a relationship from all indices
   * @param {Object} relationship - The relationship to remove
   * @private
   */
  _removeRelationshipFromIndices(relationship) {
    // Source index
    const sourceKey = `${relationship.sourceType}:${relationship.sourceId}`;
    if (this._sourceIndex.has(sourceKey)) {
      this._sourceIndex.get(sourceKey).delete(relationship);
      if (this._sourceIndex.get(sourceKey).size === 0) {
        this._sourceIndex.delete(sourceKey);
      }
    }
    
    // Target index
    const targetKey = `${relationship.targetType}:${relationship.targetId}`;
    if (this._targetIndex.has(targetKey)) {
      this._targetIndex.get(targetKey).delete(relationship);
      if (this._targetIndex.get(targetKey).size === 0) {
        this._targetIndex.delete(targetKey);
      }
    }
    
    // Type index
    if (this._typeIndex.has(relationship.type)) {
      this._typeIndex.get(relationship.type).delete(relationship);
      if (this._typeIndex.get(relationship.type).size === 0) {
        this._typeIndex.delete(relationship.type);
      }
    }
  }
  
  /**
   * Saves a relationship version to history
   * @param {string} relationshipId - The relationship ID
   * @param {Object} relationship - The relationship version to save
   * @param {boolean} isDeleted - Whether this is a deletion record
   * @private
   */
  _saveRelationshipHistory(relationshipId, relationship, isDeleted = false) {
    if (!this.options.trackHistory || !this._relationshipHistory) {
      return;
    }
    
    // Initialize history array if needed
    if (!this._relationshipHistory.has(relationshipId)) {
      this._relationshipHistory.set(relationshipId, []);
    }
    
    // Clone relationship to avoid reference issues and add history metadata
    const historyEntry = {
      ...relationship,
      _historyMetadata: {
        timestamp: new Date().toISOString(),
        isDeleted
      }
    };
    
    // Add to history
    this._relationshipHistory.get(relationshipId).push(historyEntry);
  }
}

/**
 * Orchestrates knowledge mapping based on schemas and rules
 */
class MappingOrchestrator {
  /**
   * Creates a new MappingOrchestrator instance
   * @param {RelationshipManager} relationshipManager - The relationship manager to use
   * @param {Object} options - Configuration options
   */
  constructor(relationshipManager, options = {}) {
    this.relationshipManager = relationshipManager;
    this.schemas = new Map();
    this.options = {
      validateSchemas: true,
      enableAutoMapping: true,
      ...options
    };
  }
  
  /**
   * Registers a mapping schema
   * @param {Object} schema - The mapping schema to register
   * @param {Object} options - Registration options
   * @returns {string} The registered schema ID
   */
  registerSchema(schema, options = {}) {
    const {
      skipValidation = false,
      overwriteExisting = false
    } = options;
    
    // Validate the schema
    if (!skipValidation && this.options.validateSchemas) {
      const validationResults = validateMappingSchema(schema);
      
      if (!validationResults.isValid) {
        throw new Error(`Invalid mapping schema: ${validationResults.errors.join(', ')}`);
      }
    }
    
    // Generate an ID if not present
    const schemaId = schema.id || `schema_${schema.name.replace(/\s+/g, '_')}_${schema.version}`;
    
    // Check for existing schema
    if (this.schemas.has(schemaId) && !overwriteExisting) {
      throw new Error(`Schema with ID ${schemaId} already exists`);
    }
    
    // Store the schema with its ID
    this.schemas.set(schemaId, {
      ...schema,
      id: schemaId,
      _registeredAt: new Date().toISOString()
    });
    
    return schemaId;
  }
  
  /**
   * Gets a registered schema by ID
   * @param {string} schemaId - The schema ID
   * @returns {Object|null} The schema or null if not found
   */
  getSchema(schemaId) {
    return this.schemas.has(schemaId) ? 
      this.schemas.get(schemaId) : null;
  }
  
  /**
   * Applies a mapping schema to discover and create relationships
   * @param {string} schemaId - The ID of the schema to apply
   * @param {Object} context - The mapping context
   * @param {Object} options - Mapping options
   * @returns {Object} Mapping results
   */
  applySchema(schemaId, context, options = {}) {
    const {
      dryRun = false,
      confidenceThreshold = 0.5,
      maxRelationships = 1000
    } = options;
    
    // Get the schema
    const schema = this.getSchema(schemaId);
    if (!schema) {
      throw new Error(`Schema ${schemaId} not found`);
    }
    
    // Initialize results
    const results = {
      schemaId,
      schemaName: schema.name,
      relationshipsDiscovered: 0,
      relationshipsCreated: 0,
      relationshipsSkipped: 0,
      errors: [],
      relationships: []
    };
    
    // Process mapping rules
    if (schema.mappingRules && Array.isArray(schema.mappingRules)) {
      for (const rule of schema.mappingRules) {
        try {
          // Apply the rule to discover relationships
          const ruleResults = this._applyMappingRule(rule, context, {
            dryRun,
            confidenceThreshold,
            maxRelationships: maxRelationships - results.relationshipsDiscovered
          });
          
          // Update results
          results.relationshipsDiscovered += ruleResults.discovered;
          results.relationshipsCreated += ruleResults.created;
          results.relationshipsSkipped += ruleResults.skipped;
          results.relationships.push(...ruleResults.relationships);
          
          // Check if we've hit the maximum
          if (results.relationshipsDiscovered >= maxRelationships) {
            results.errors.push(`Reached maximum relationship limit (${maxRelationships})`);
            break;
          }
        } catch (error) {
          results.errors.push(`Error applying rule: ${error.message}`);
        }
      }
    } else {
      results.errors.push('Schema has no mapping rules or rules are not in array format');
    }
    
    return results;
  }
  
  /**
   * Applies all registered schemas
   * @param {Object} context - The mapping context
   * @param {Object} options - Mapping options
   * @returns {Object} Mapping results
   */
  applyAllSchemas(context, options = {}) {
    const results = {
      schemasApplied: 0,
      relationshipsDiscovered: 0,
      relationshipsCreated: 0,
      relationshipsSkipped: 0,
      errors: [],
      schemaResults: []
    };
    
    // Apply each schema
    for (const [schemaId] of this.schemas.entries()) {
      try {
        const schemaResults = this.applySchema(schemaId, context, options);
        
        // Update results
        results.schemasApplied++;
        results.relationshipsDiscovered += schemaResults.relationshipsDiscovered;
        results.relationshipsCreated += schemaResults.relationshipsCreated;
        results.relationshipsSkipped += schemaResults.relationshipsSkipped;
        results.schemaResults.push({
          schemaId,
          ...schemaResults
        });
      } catch (error) {
        results.errors.push(`Error applying schema ${schemaId}: ${error.message}`);
      }
    }
    
    return results;
  }
  
  /**
   * Applies a mapping rule to discover relationships
   * @param {Object} rule - The mapping rule to apply
   * @param {Object} context - The mapping context
   * @param {Object} options - Rule application options
   * @returns {Object} Rule application results
   * @private
   */
  _applyMappingRule(rule, context, options) {
    const { 
      dryRun = false,
      confidenceThreshold = 0.5,
      maxRelationships = 1000
    } = options;
    
    const results = {
      discovered: 0,
      created: 0,
      skipped: 0,
      relationships: []
    };
    
    // Extract source and target items from context
    const sourceItems = this._getItemsOfType(context, rule.sourceType);
    const targetItems = this._getItemsOfType(context, rule.targetType);
    
    // Check condition and calculate confidence for each source-target pair
    for (const sourceItem of sourceItems) {
      for (const targetItem of targetItems) {
        if (results.discovered >= maxRelationships) {
          break;
        }
        
        // Skip self-references unless explicitly allowed by the rule
        if (sourceItem.id === targetItem.id && 
            sourceItem.type === targetItem.type && 
            !rule.allowSelfReferences) {
          continue;
        }
        
        // Check if the rule condition is satisfied
        const conditionMet = this._evaluateCondition(rule, sourceItem, targetItem, context);
        
        if (conditionMet) {
          // Calculate confidence
          const confidence = this._calculateConfidence(rule, sourceItem, targetItem, context);
          
          // Create relationship if confidence is high enough
          if (confidence >= confidenceThreshold) {
            results.discovered++;
            
            // Build the relationship
            const relationship = {
              sourceType: sourceItem.type,
              sourceId: sourceItem.id,
              targetType: targetItem.type,
              targetId: targetItem.id,
              type: rule.relationshipType,
              confidence,
              properties: this._mapProperties(rule, sourceItem, targetItem, context),
              metadata: {
                created: new Date().toISOString(),
                createdBy: 'amo-mapper',
                schemaId: rule.schemaId || 'unknown',
                ruleId: rule.id || 'unknown'
              }
            };
            
            // Add relationship to results
            results.relationships.push(relationship);
            
            // Actually create the relationship if not a dry run
            if (!dryRun) {
              try {
                this.relationshipManager.addRelationship(relationship, { 
                  skipValidation: false,
                  overwriteExisting: rule.overwriteExisting || false
                });
                results.created++;
              } catch (error) {
                results.skipped++;
                // Relationship already exists or validation failed
              }
            } else {
              // In dry run mode, we don't create relationships
              results.skipped++;
            }
          }
        }
      }
    }
    
    return results;
  }
  
  /**
   * Gets items of a specific type from the mapping context
   * @param {Object} context - The mapping context
   * @param {string} itemType - The type of items to get
   * @returns {Array} Matching items
   * @private
   */
  _getItemsOfType(context, itemType) {
    // Check if context has this item type
    if (!context[itemType] && !context.items?.[itemType]) {
      return [];
    }
    
    // Get items from either direct property or items container
    const items = context[itemType] || context.items?.[itemType] || [];
    
    // Ensure each item has type and id
    return items.map(item => ({
      ...item,
      type: item.type || itemType,
      id: item.id || item._id || item.name
    }));
  }
  
  /**
   * Evaluates a mapping rule condition
   * @param {Object} rule - The mapping rule
   * @param {Object} sourceItem - The source item
   * @param {Object} targetItem - The target item
   * @param {Object} context - The mapping context
   * @returns {boolean} Whether the condition is satisfied
   * @private
   */
  _evaluateCondition(rule, sourceItem, targetItem, context) {
    // If no condition, assume always satisfied
    if (!rule.condition) {
      return true;
    }
    
    // Handle function conditions
    if (typeof rule.condition === 'function') {
      try {
        return rule.condition(sourceItem, targetItem, context);
      } catch (error) {
        return false;
      }
    }
    
    // Handle string conditions (expressions)
    if (typeof rule.condition === 'string') {
      try {
        // Simplified expression evaluation for the example
        // In a real implementation, use a proper expression evaluator
        const evalContext = {
          source: sourceItem,
          target: targetItem,
          context,
          // Helper functions
          includes: (arr, val) => Array.isArray(arr) && arr.includes(val),
          containsText: (text, search) => typeof text === 'string' && 
                                        typeof search === 'string' && 
                                        text.toLowerCase().includes(search.toLowerCase()),
          sameCategory: () => sourceItem.category === targetItem.category,
          // Add more helper functions as needed
        };
        
        // CAUTION: In a real implementation, use a safer evaluation method
        // This is just for demonstration purposes
        return new Function('source', 'target', 'context', 'includes', 'containsText', 'sameCategory',
          `return ${rule.condition};`
        )(
          evalContext.source,
          evalContext.target,
          evalContext.context,
          evalContext.includes,
          evalContext.containsText,
          evalContext.sameCategory
        );
      } catch (error) {
        return false;
      }
    }
    
    return false;
  }
  
  /**
   * Calculates confidence for a relationship based on a rule
   * @param {Object} rule - The mapping rule
   * @param {Object} sourceItem - The source item
   * @param {Object} targetItem - The target item
   * @param {Object} context - The mapping context
   * @returns {number} Confidence score between 0 and 1
   * @private
   */
  _calculateConfidence(rule, sourceItem, targetItem, context) {
    // If no confidence calculation defined, use default
    if (!rule.confidenceCalculation) {
      return rule.defaultConfidence || 0.8;
    }
    
    // Handle function-based confidence calculation
    if (typeof rule.confidenceCalculation === 'function') {
      try {
        const confidence = rule.confidenceCalculation(sourceItem, targetItem, context);
        return Math.max(0, Math.min(1, confidence)); // Clamp between 0 and 1
      } catch (error) {
        return rule.defaultConfidence || 0.8;
      }
    }
    
    // Handle string-based confidence calculation (expressions)
    if (typeof rule.confidenceCalculation === 'string') {
      try {
        const evalContext = {
          source: sourceItem,
          target: targetItem,
          context,
          // Helper functions for confidence calculations
          textSimilarity: (text1, text2) => {
            if (typeof text1 !== 'string' || typeof text2 !== 'string') return 0;
            // Simple similarity calculation for demonstration
            const set1 = new Set(text1.toLowerCase().split(/\s+/));
            const set2 = new Set(text2.toLowerCase().split(/\s+/));
            const intersection = new Set([...set1].filter(word => set2.has(word)));
            const union = new Set([...set1, ...set2]);
            return intersection.size / union.size;
          },
          // Add more helper functions as needed
        };
        
        // CAUTION: In a real implementation, use a safer evaluation method
        const confidence = new Function('source', 'target', 'context', 'textSimilarity',
          `return ${rule.confidenceCalculation};`
        )(
          evalContext.source,
          evalContext.target,
          evalContext.context,
          evalContext.textSimilarity
        );
        
        return Math.max(0, Math.min(1, confidence)); // Clamp between 0 and 1
      } catch (error) {
        return rule.defaultConfidence || 0.8;
      }
    }
    
    return rule.defaultConfidence || 0.8;
  }
  
  /**
   * Maps properties for a relationship based on a rule
   * @param {Object} rule - The mapping rule
   * @param {Object} sourceItem - The source item
   * @param {Object} targetItem - The target item
   * @param {Object} context - The mapping context
   * @returns {Object} Mapped properties
   * @private
   */
  _mapProperties(rule, sourceItem, targetItem, context) {
    const properties = {};
    
    // If no property mappings defined, return empty properties
    if (!rule.propertyMappings) {
      return properties;
    }
    
    // Apply each property mapping
    for (const [propName, mapping] of Object.entries(rule.propertyMappings)) {
      try {
        // Handle function mappings
        if (typeof mapping === 'function') {
          properties[propName] = mapping(sourceItem, targetItem, context);
          continue;
        }
        
        // Handle string mappings (direct property access or expression)
        if (typeof mapping === 'string') {
          if (mapping.startsWith('source.')) {
            // Extract source property
            const propPath = mapping.substring(7).split('.');
            properties[propName] = this._getNestedProperty(sourceItem, propPath);
          } else if (mapping.startsWith('target.')) {
            // Extract target property
            const propPath = mapping.substring(7).split('.');
            properties[propName] = this._getNestedProperty(targetItem, propPath);
          } else if (mapping.startsWith('context.')) {
            // Extract context property
            const propPath = mapping.substring(8).split('.');
            properties[propName] = this._getNestedProperty(context, propPath);
          } else {
            // Assume expression
            // In a real implementation, use a safer evaluation method
            const evalContext = {
              source: sourceItem,
              target: targetItem,
              context
            };
            
            // CAUTION: This is just for demonstration
            properties[propName] = new Function('source', 'target', 'context',
              `return ${mapping};`
            )(
              evalContext.source,
              evalContext.target,
              evalContext.context
            );
          }
        } else if (typeof mapping === 'object' && mapping !== null) {
          // Handle object mapping (with default value, etc.)
          if (mapping.path) {
            let value;
            
            if (mapping.path.startsWith('source.')) {
              const propPath = mapping.path.substring(7).split('.');
              value = this._getNestedProperty(sourceItem, propPath);
            } else if (mapping.path.startsWith('target.')) {
              const propPath = mapping.path.substring(7).split('.');
              value = this._getNestedProperty(targetItem, propPath);
            } else if (mapping.path.startsWith('context.')) {
              const propPath = mapping.path.substring(8).split('.');
              value = this._getNestedProperty(context, propPath);
            }
            
            // Apply default if needed
            if ((value === undefined || value === null) && mapping.default !== undefined) {
              value = mapping.default;
            }
            
            properties[propName] = value;
          } else {
            // Direct object assignment
            properties[propName] = mapping;
          }
        } else {
          // Direct value assignment
          properties[propName] = mapping;
        }
      } catch (error) {
        // On error, use default if available, otherwise skip
        if (rule.propertyMappingDefaults && 
            rule.propertyMappingDefaults[propName] !== undefined) {
          properties[propName] = rule.propertyMappingDefaults[propName];
        }
      }
    }
    
    return properties;
  }
  
  /**
   * Gets a nested property from an object using a property path
   * @param {Object} obj - The object to get property from
   * @param {Array|string} path - The property path (array or dot-notation string)
   * @returns {*} The property value or undefined if not found
   * @private
   */
  _getNestedProperty(obj, path) {
    // Handle string path
    if (typeof path === 'string') {
      path = path.split('.');
    }
    
    // Handle null or undefined object
    if (obj === null || obj === undefined) {
      return undefined;
    }
    
    // Handle empty path
    if (path.length === 0) {
      return obj;
    }
    
    // Navigate the property path
    let current = obj;
    for (const segment of path) {
      if (current === null || current === undefined || 
          typeof current !== 'object') {
        return undefined;
      }
      current = current[segment];
    }
    
    return current;
  }
}

/**
 * Enables querying of the knowledge graph
 */
class KnowledgeGraphQuery {
  /**
   * Creates a new KnowledgeGraphQuery instance
   * @param {RelationshipManager} relationshipManager - The relationship manager to use for queries
   * @param {Object} options - Configuration options
   */
  constructor(relationshipManager, options = {}) {
    this.relationshipManager = relationshipManager;
    this.options = {
      validateQueries: true,
      defaultQueryDepth: 2,
      defaultDirection: 'all',
      maxDepth: 5,
      maxResults: 1000,
      ...options
    };
    
    // Cache for query results
    this._queryCache = new Map();
  }
  
  /**
   * Executes a query on the knowledge graph
   * @param {Object} query - The query to execute
   * @param {Object} options - Query execution options
   * @returns {Object} Query results
   */
  executeQuery(query, options = {}) {
    const {
      skipValidation = false,
      useCache = true,
      updateCache = true
    } = options;
    
    // Generate query hash for caching
    const queryHash = this._hashQuery(query);
    
    // Check cache if enabled
    if (useCache && this._queryCache.has(queryHash)) {
      const cachedResult = this._queryCache.get(queryHash);
      if (Date.now() - cachedResult.timestamp <= this.options.cacheExpiry) {
        return {
          ...cachedResult.result,
          fromCache: true
        };
      }
    }
    
    // Validate the query
    if (!skipValidation && this.options.validateQueries) {
      const validationResults = validateQuery(query, {
        maxDepth: this.options.maxDepth,
        maxLimit: this.options.maxResults
      });
      
      if (!validationResults.isValid) {
        throw new Error(`Invalid query: ${validationResults.errors.join(', ')}`);
      }
    }
    
    // Fill in defaults
    const fullQuery = {
      depth: this.options.defaultQueryDepth,
      direction: this.options.defaultDirection,
      ...query
    };
    
    // Execute the query based on its type
    let results;
    
    if (fullQuery.startNode) {
      // Single start node query
      results = this._executeNodeQuery(fullQuery);
    } else if (fullQuery.startNodes && Array.isArray(fullQuery.startNodes)) {
      // Multi-node query
      results = this._executeMultiNodeQuery(fullQuery);
    } else if (fullQuery.query) {
      // Custom query
      results = this._executeCustomQuery(fullQuery);
    } else {
      throw new Error('Query must include startNode, startNodes, or a custom query');
    }
    
    // Add execution metadata
    results.metadata = {
      executedAt: new Date().toISOString(),
      queryType: fullQuery.startNode ? 'node' : 
                 fullQuery.startNodes ? 'multiNode' : 'custom',
      depth: fullQuery.depth,
      nodeCount: results.nodes?.length || 0,
      relationshipCount: results.relationships?.length || 0
    };
    
    // Update cache if enabled
    if (updateCache) {
      this._queryCache.set(queryHash, {
        result: results,
        timestamp: Date.now()
      });
      
      // Limit cache size
      if (this._queryCache.size > this.options.maxCacheSize) {
        // Remove oldest entry
        const oldestKey = [...this._queryCache.entries()]
          .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
        this._queryCache.delete(oldestKey);
      }
    }
    
    return results;
  }
  
  /**
   * Executes a depth-first traversal from a start node
   * @param {Object} query - The node query
   * @returns {Object} Query results
   * @private
   */
  _executeNodeQuery(query) {
    const results = {
      nodes: [],
      relationships: [],
      rootNodeId: `${query.startNode.type}:${query.startNode.id}`
    };
    
    // Set of visited nodes to avoid cycles
    const visitedNodes = new Set();
    
    // Traverse the graph
    this._traverseGraph(
      query.startNode.type,
      query.startNode.id,
      query.depth || 1,
      query.direction || 'all',
      visitedNodes,
      results,
      query
    );
    
    // Apply sorting if specified
    if (query.sortBy) {
      results.relationships = this._sortRelationships(results.relationships, query.sortBy);
    }
    
    // Apply limit if specified
    if (query.limit && query.limit > 0) {
      results.relationships = results.relationships.slice(0, query.limit);
      
      // Rebuild nodes based on limited relationships
      const nodeSet = new Set();
      nodeSet.add(`${query.startNode.type}:${query.startNode.id}`); // Always include start node
      
      for (const rel of results.relationships) {
        nodeSet.add(`${rel.sourceType}:${rel.sourceId}`);
        nodeSet.add(`${rel.targetType}:${rel.targetId}`);
      }
      
      results.nodes = results.nodes.filter(node => 
        nodeSet.has(`${node.type}:${node.id}`)
      );
    }
    
    return results;
  }
  
  /**
   * Executes a query from multiple start nodes
   * @param {Object} query - The multi-node query
   * @returns {Object} Query results
   * @private
   */
  _executeMultiNodeQuery(query) {
    const results = {
      nodes: [],
      relationships: [],
      rootNodeIds: []
    };
    
    // Set of visited nodes to avoid cycles and duplicates
    const visitedNodes = new Set();
    const visitedRelationships = new Set();
    
    // Track root node IDs
    for (const startNode of query.startNodes) {
      results.rootNodeIds.push(`${startNode.type}:${startNode.id}`);
    }
    
    // Traverse from each start node
    for (const startNode of query.startNodes) {
      const nodeResults = {
        nodes: [],
        relationships: []
      };
      
      this._traverseGraph(
        startNode.type,
        startNode.id,
        query.depth || 1,
        query.direction || 'all',
        visitedNodes,
        nodeResults,
        query
      );
      
      // Add new nodes and relationships, avoiding duplicates
      for (const node of nodeResults.nodes) {
        if (!results.nodes.some(n => n.id === node.id && n.type === node.type)) {
          results.nodes.push(node);
        }
      }
      
      for (const rel of nodeResults.relationships) {
        const relId = rel.id || `${rel.sourceType}:${rel.sourceId}-${rel.type}-${rel.targetType}:${rel.targetId}`;
        if (!visitedRelationships.has(relId)) {
          results.relationships.push(rel);
          visitedRelationships.add(relId);
        }
      }
    }
    
    // Apply sorting if specified
    if (query.sortBy) {
      results.relationships = this._sortRelationships(results.relationships, query.sortBy);
    }
    
    // Apply limit if specified
    if (query.limit && query.limit > 0) {
      results.relationships = results.relationships.slice(0, query.limit);
      
      // Rebuild nodes based on limited relationships
      const nodeSet = new Set();
      for (const rootNodeId of results.rootNodeIds) {
        nodeSet.add(rootNodeId); // Always include start nodes
      }
      
      for (const rel of results.relationships) {
        nodeSet.add(`${rel.sourceType}:${rel.sourceId}`);
        nodeSet.add(`${rel.targetType}:${rel.targetId}`);
      }
      
      results.nodes = results.nodes.filter(node => 
        nodeSet.has(`${node.type}:${node.id}`)
      );
    }
    
    return results;
  }
  
  /**
   * Executes a custom query
   * @param {Object} query - The custom query
   * @returns {Object} Query results
   * @private
   */
  _executeCustomQuery(query) {
    // Custom query implementation would depend on the specific
    // query language or API being used. This is just a placeholder.
    const results = {
      nodes: [],
      relationships: [],
      customQueryExecuted: true
    };
    
    // In a real implementation, this would interpret and execute
    // a custom query language or API call
    
    // For now, we'll just return a basic result with a warning
    results.warning = 'Custom queries are not fully implemented';
    
    return results;
  }
  
  /**
   * Traverses the graph from a start node
   * @param {string} nodeType - The start node type
   * @param {string} nodeId - The start node ID
   * @param {number} depth - The current traversal depth
   * @param {string} direction - The traversal direction
   * @param {Set} visitedNodes - Set of already visited nodes
   * @param {Object} results - The accumulating results
   * @param {Object} query - The original query
   * @private
   */
  _traverseGraph(nodeType, nodeId, depth, direction, visitedNodes, results, query) {
    const nodeKey = `${nodeType}:${nodeId}`;
    
    // Skip if already visited
    if (visitedNodes.has(nodeKey)) {
      return;
    }
    
    // Mark as visited
    visitedNodes.add(nodeKey);
    
    // Add node to results if not already present
    if (!results.nodes.some(n => n.type === nodeType && n.id === nodeId)) {
      results.nodes.push({
        type: nodeType,
        id: nodeId
      });
    }
    
    // Stop if we've reached max depth
    if (depth <= 0) {
      return;
    }
    
    // Get relationships based on direction
    let relationships = [];
    
    if (direction === 'outbound' || direction === 'all') {
      // Get outbound relationships
      relationships.push(...this.relationshipManager.findRelationshipsBySource(nodeType, nodeId));
    }
    
    if (direction === 'inbound' || direction === 'all') {
      // Get inbound relationships
      relationships.push(...this.relationshipManager.findRelationshipsByTarget(nodeType, nodeId));
    }
    
    // Filter relationships by type if specified
    if (query.relationshipTypes && Array.isArray(query.relationshipTypes) && query.relationshipTypes.length > 0) {
      relationships = relationships.filter(rel => 
        query.relationshipTypes.includes(rel.type)
      );
    }
    
    // Apply additional filters
    if (query.filters) {
      relationships = this._applyFilters(relationships, query.filters);
    }
    
    // Add relationships to results and traverse connected nodes
    for (const relationship of relationships) {
      // Skip if this relationship is already in results
      if (results.relationships.some(r => r.id === relationship.id)) {
        continue;
      }
      
      // Add to results
      results.relationships.push(relationship);
      
      // Determine next node to traverse based on traversal direction
      let nextNodeType, nextNodeId;
      
      if (relationship.sourceType === nodeType && relationship.sourceId === nodeId) {
        // This relationship goes from current node to another node
        nextNodeType = relationship.targetType;
        nextNodeId = relationship.targetId;
      } else {
        // This relationship comes from another node to current node
        nextNodeType = relationship.sourceType;
        nextNodeId = relationship.sourceId;
      }
      
      // Recursively traverse the next node
      this._traverseGraph(
        nextNodeType,
        nextNodeId,
        depth - 1,
        direction,
        visitedNodes,
        results,
        query
      );
    }
  }
  
  /**
   * Applies filters to relationships
   * @param {Array} relationships - The relationships to filter
   * @param {Object} filters - The filters to apply
   * @returns {Array} Filtered relationships
   * @private
   */
  _applyFilters(relationships, filters) {
    if (!filters) {
      return relationships;
    }
    
    let filtered = [...relationships];
    
    // Filter by item types
    if (filters.itemTypes && Array.isArray(filters.itemTypes)) {
      filtered = filtered.filter(rel =>
        filters.itemTypes.includes(rel.sourceType) || 
        filters.itemTypes.includes(rel.targetType)
      );
    }
    
    // Filter by minimum confidence
    if (filters.minConfidence !== undefined && filters.minConfidence >= 0) {
      filtered = filtered.filter(rel => 
        rel.confidence === undefined || rel.confidence >= filters.minConfidence
      );
    }
    
    // Filter by creation date
    if (filters.createdAfter || filters.createdBefore) {
      filtered = filtered.filter(rel => {
        if (!rel.metadata?.created) {
          return true; // Include relationships without creation date
        }
        
        try {
          const createdDate = new Date(rel.metadata.created);
          
          if (filters.createdAfter) {
            const afterDate = new Date(filters.createdAfter);
            if (createdDate < afterDate) {
              return false;
            }
          }
          
          if (filters.createdBefore) {
            const beforeDate = new Date(filters.createdBefore);
            if (createdDate > beforeDate) {
              return false;
            }
          }
          
          return true;
        } catch (e) {
          return true; // Include on date parsing error
        }
      });
    }
    
    // Apply property filters
    if (filters.properties && typeof filters.properties === 'object') {
      filtered = filtered.filter(rel => {
        if (!rel.properties) {
          return false;
        }
        
        for (const [key, value] of Object.entries(filters.properties)) {
          if (rel.properties[key] !== value) {
            return false;
          }
        }
        
        return true;
      });
    }
    
    return filtered;
  }
  
  /**
   * Sorts relationships based on a sort field
   * @param {Array} relationships - The relationships to sort
   * @param {string} sortBy - The field to sort by
   * @returns {Array} Sorted relationships
   * @private
   */
  _sortRelationships(relationships, sortBy) {
    if (!sortBy) {
      return relationships;
    }
    
    return [...relationships].sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return (b.confidence || 0) - (a.confidence || 0);
        case 'created':
          const aDate = a.metadata?.created ? new Date(a.metadata.created) : new Date(0);
          const bDate = b.metadata?.created ? new Date(b.metadata.created) : new Date(0);
          return bDate - aDate;
        case 'relevance':
          // Simple relevance calculation based on confidence and recency
          const aConfidence = a.confidence || 0.5;
          const bConfidence = b.confidence || 0.5;
          const aCreated = a.metadata?.created ? new Date(a.metadata.created) : new Date(0);
          const bCreated = b.metadata?.created ? new Date(b.metadata.created) : new Date(0);
          
          // Weighted score (70% confidence, 30% recency)
          const aScore = aConfidence * 0.7 + (aCreated.getTime() / Date.now()) * 0.3;
          const bScore = bConfidence * 0.7 + (bCreated.getTime() / Date.now()) * 0.3;
          
          return bScore - aScore;
        default:
          return 0;
      }
    });
  }
  
  /**
   * Creates a hash for a query object (for caching)
   * @param {Object} query - The query to hash
   * @returns {string} Hash string
   * @private
   */
  _hashQuery(query) {
    // Simple implementation - in a real system, use a proper hashing function
    return JSON.stringify(query);
  }
}

// Export the core classes
module.exports = {
  RelationshipManager,
  MappingOrchestrator,
  KnowledgeGraphQuery
};