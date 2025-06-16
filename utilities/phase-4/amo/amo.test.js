/**
 * Autonomous Mapping Orchestrator (AMO) - Tests
 * 
 * This file contains tests for the AMO system components.
 */

// Mock dependencies for integration tests
const mockConPortClient = {
  logCustomData: jest.fn().mockResolvedValue({ success: true }),
  getCustomData: jest.fn().mockResolvedValue({ value: {} }),
  batchLogCustomData: jest.fn().mockResolvedValue({ success: true }),
};

const mockKdapClient = {
  getDecisions: jest.fn().mockResolvedValue([]),
  getSystemPatterns: jest.fn().mockResolvedValue([]),
  getProgress: jest.fn().mockResolvedValue([]),
  getCustomData: jest.fn().mockResolvedValue([]),
  semanticSearchKnowledge: jest.fn().mockResolvedValue([]),
};

const mockAkafClient = {};

// Import AMO components
const {
  // Validation
  validateRelationship,
  validateMappingSchema,
  validateQuery,
  validateRelationshipMetadata,
  
  // Core
  RelationshipManager,
  MappingOrchestrator,
  KnowledgeGraphQuery,
  
  // Integration
  ConPortAMOIntegration,
  KDAPAMOIntegration,
  AKAFAMOIntegration
} = require('./index');

/**
 * Validation Layer Tests
 */
describe('AMO Validation Layer', () => {
  describe('validateRelationship', () => {
    test('should validate a valid relationship', () => {
      const validRelationship = {
        sourceId: 'decision-123',
        sourceType: 'decision',
        targetId: 'pattern-456',
        targetType: 'system_pattern',
        type: 'implements',
        confidence: 0.9,
        direction: 'source_to_target',
        metadata: {
          created: new Date().toISOString(),
          createdBy: 'test'
        },
        properties: {
          strength: 'strong',
          description: 'Implementation relationship'
        }
      };
      
      const result = validateRelationship(validRelationship);
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
    
    test('should reject an invalid relationship', () => {
      const invalidRelationship = {
        // Missing required fields
        sourceId: 'decision-123',
        targetId: 'pattern-456',
        type: 'implements'
      };
      
      const result = validateRelationship(invalidRelationship);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
    
    test('should identify a self-referential relationship', () => {
      const selfRefRelationship = {
        sourceId: 'decision-123',
        sourceType: 'decision',
        targetId: 'decision-123',
        targetType: 'decision',
        type: 'depends_on'
      };
      
      const result = validateRelationship(selfRefRelationship);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('self-referential'))).toBe(true);
    });
  });
  
  describe('validateMappingSchema', () => {
    test('should validate a valid mapping schema', () => {
      const validSchema = {
        name: 'Test Schema',
        version: '1.0.0',
        relationshipTypes: ['implements', 'depends_on'],
        mappingRules: [
          {
            sourceType: 'decision',
            targetType: 'system_pattern',
            relationshipType: 'implements'
          }
        ]
      };
      
      const result = validateMappingSchema(validSchema);
      expect(result.isValid).toBe(true);
    });
    
    test('should reject a schema with invalid version format', () => {
      const invalidSchema = {
        name: 'Test Schema',
        version: '1.0', // Should be semver (x.y.z)
        relationshipTypes: ['implements']
      };
      
      const result = validateMappingSchema(invalidSchema);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('version format'))).toBe(true);
    });
    
    test('should validate complex relationship type definitions', () => {
      const schema = {
        name: 'Complex Types Schema',
        version: '1.0.0',
        relationshipTypes: [
          'implements',
          { name: 'depends_on', bidirectional: false },
          { name: 'related_to', bidirectional: true }
        ]
      };
      
      const result = validateMappingSchema(schema);
      expect(result.isValid).toBe(true);
    });
  });
  
  describe('validateQuery', () => {
    test('should validate a valid node query', () => {
      const validQuery = {
        startNode: { type: 'decision', id: 'decision-123' },
        depth: 2,
        direction: 'all',
        relationshipTypes: ['implements', 'depends_on'],
        filters: {
          minConfidence: 0.7
        }
      };
      
      const result = validateQuery(validQuery);
      expect(result.isValid).toBe(true);
    });
    
    test('should reject a query without start node', () => {
      const invalidQuery = {
        depth: 2,
        direction: 'all'
      };
      
      const result = validateQuery(invalidQuery);
      expect(result.isValid).toBe(false);
    });
    
    test('should warn about high depth with high limit', () => {
      const riskyQuery = {
        startNode: { type: 'decision', id: 'decision-123' },
        depth: 4,
        limit: 100
      };
      
      const result = validateQuery(riskyQuery);
      expect(result.isValid).toBe(true);
      expect(result.warnings.some(w => w.includes('performance'))).toBe(true);
    });
  });
});

/**
 * Core Layer Tests
 */
describe('AMO Core Layer', () => {
  describe('RelationshipManager', () => {
    let relationshipManager;
    
    beforeEach(() => {
      relationshipManager = new RelationshipManager();
    });
    
    test('should add and retrieve a relationship', () => {
      const relationship = {
        sourceId: 'decision-123',
        sourceType: 'decision',
        targetId: 'pattern-456',
        targetType: 'system_pattern',
        type: 'implements'
      };
      
      const added = relationshipManager.addRelationship(relationship);
      expect(added.id).toBeDefined();
      
      const retrieved = relationshipManager.getRelationship(added.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved.sourceId).toBe('decision-123');
      expect(retrieved.type).toBe('implements');
    });
    
    test('should update a relationship', () => {
      const relationship = {
        sourceId: 'decision-123',
        sourceType: 'decision',
        targetId: 'pattern-456',
        targetType: 'system_pattern',
        type: 'implements',
        confidence: 0.7
      };
      
      const added = relationshipManager.addRelationship(relationship);
      
      const updated = relationshipManager.updateRelationship(
        added.id,
        { confidence: 0.9 }
      );
      
      expect(updated.confidence).toBe(0.9);
      expect(updated.sourceId).toBe('decision-123'); // Original fields preserved
    });
    
    test('should remove a relationship', () => {
      const relationship = {
        sourceId: 'decision-123',
        sourceType: 'decision',
        targetId: 'pattern-456',
        targetType: 'system_pattern',
        type: 'implements'
      };
      
      const added = relationshipManager.addRelationship(relationship);
      expect(relationshipManager.getRelationship(added.id)).not.toBeNull();
      
      const removed = relationshipManager.removeRelationship(added.id);
      expect(removed).toBe(true);
      expect(relationshipManager.getRelationship(added.id)).toBeNull();
    });
    
    test('should find relationships by source', () => {
      // Add multiple relationships
      relationshipManager.addRelationship({
        sourceId: 'decision-123',
        sourceType: 'decision',
        targetId: 'pattern-456',
        targetType: 'system_pattern',
        type: 'implements'
      });
      
      relationshipManager.addRelationship({
        sourceId: 'decision-123',
        sourceType: 'decision',
        targetId: 'pattern-789',
        targetType: 'system_pattern',
        type: 'depends_on'
      });
      
      const found = relationshipManager.findRelationshipsBySource('decision', 'decision-123');
      expect(found.length).toBe(2);
    });
    
    test('should find relationships between specific nodes', () => {
      relationshipManager.addRelationship({
        sourceId: 'decision-123',
        sourceType: 'decision',
        targetId: 'pattern-456',
        targetType: 'system_pattern',
        type: 'implements'
      });
      
      relationshipManager.addRelationship({
        sourceId: 'decision-123',
        sourceType: 'decision',
        targetId: 'pattern-456',
        targetType: 'system_pattern',
        type: 'depends_on'
      });
      
      const found = relationshipManager.findRelationshipsBetween(
        'decision', 
        'decision-123',
        'system_pattern',
        'pattern-456'
      );
      
      expect(found.length).toBe(2);
      expect(found.some(r => r.type === 'implements')).toBe(true);
      expect(found.some(r => r.type === 'depends_on')).toBe(true);
    });
    
    test('should deduplicate relationships when configured', () => {
      const dedupeManager = new RelationshipManager({
        deduplicateRelationships: true
      });
      
      const relationship = {
        sourceId: 'decision-123',
        sourceType: 'decision',
        targetId: 'pattern-456',
        targetType: 'system_pattern',
        type: 'implements'
      };
      
      const first = dedupeManager.addRelationship(relationship);
      const second = dedupeManager.addRelationship(relationship);
      
      expect(first.id).toBe(second.id);
      expect(dedupeManager.findRelationshipsBetween(
        'decision', 'decision-123', 
        'system_pattern', 'pattern-456'
      ).length).toBe(1);
    });
  });
  
  describe('MappingOrchestrator', () => {
    let relationshipManager;
    let mappingOrchestrator;
    
    beforeEach(() => {
      relationshipManager = new RelationshipManager();
      mappingOrchestrator = new MappingOrchestrator(relationshipManager);
    });
    
    test('should register and retrieve a schema', () => {
      const schema = {
        name: 'Test Schema',
        version: '1.0.0',
        relationshipTypes: ['implements']
      };
      
      const schemaId = mappingOrchestrator.registerSchema(schema);
      expect(schemaId).toBeDefined();
      
      const retrieved = mappingOrchestrator.getSchema(schemaId);
      expect(retrieved).not.toBeNull();
      expect(retrieved.name).toBe('Test Schema');
    });
    
    test('should apply a schema to discover relationships', () => {
      const schema = {
        name: 'Test Schema',
        version: '1.0.0',
        relationshipTypes: ['implements'],
        mappingRules: [
          {
            sourceType: 'decision',
            targetType: 'system_pattern',
            relationshipType: 'implements',
            defaultConfidence: 0.8
          }
        ]
      };
      
      const schemaId = mappingOrchestrator.registerSchema(schema);
      
      const context = {
        decision: [
          { id: 'decision-123', summary: 'Test decision' }
        ],
        system_pattern: [
          { id: 'pattern-456', name: 'Test pattern' }
        ]
      };
      
      const results = mappingOrchestrator.applySchema(schemaId, context);
      
      expect(results.relationshipsDiscovered).toBe(1);
      expect(results.relationshipsCreated).toBe(1);
      expect(results.relationships.length).toBe(1);
      expect(results.relationships[0].sourceId).toBe('decision-123');
      expect(results.relationships[0].targetId).toBe('pattern-456');
      expect(results.relationships[0].type).toBe('implements');
    });
    
    test('should apply condition check when discovering relationships', () => {
      const schema = {
        name: 'Conditional Schema',
        version: '1.0.0',
        relationshipTypes: ['implements'],
        mappingRules: [
          {
            sourceType: 'decision',
            targetType: 'system_pattern',
            relationshipType: 'implements',
            // Only create relationship if tag matches
            condition: 'source.tag === "important"',
            defaultConfidence: 0.8
          }
        ]
      };
      
      const schemaId = mappingOrchestrator.registerSchema(schema);
      
      const context = {
        decision: [
          { id: 'decision-123', tag: 'important' },
          { id: 'decision-456', tag: 'minor' }
        ],
        system_pattern: [
          { id: 'pattern-789', name: 'Test pattern' }
        ]
      };
      
      const results = mappingOrchestrator.applySchema(schemaId, context);
      
      expect(results.relationshipsDiscovered).toBe(1);
      expect(results.relationships[0].sourceId).toBe('decision-123');
    });
  });
  
  describe('KnowledgeGraphQuery', () => {
    let relationshipManager;
    let graphQuery;
    
    beforeEach(() => {
      relationshipManager = new RelationshipManager();
      graphQuery = new KnowledgeGraphQuery(relationshipManager);
      
      // Add test relationships
      relationshipManager.addRelationship({
        sourceId: 'decision-1',
        sourceType: 'decision',
        targetId: 'pattern-1',
        targetType: 'system_pattern',
        type: 'implements'
      });
      
      relationshipManager.addRelationship({
        sourceId: 'pattern-1',
        sourceType: 'system_pattern',
        targetId: 'progress-1',
        targetType: 'progress',
        type: 'tracked_by'
      });
      
      relationshipManager.addRelationship({
        sourceId: 'decision-1',
        sourceType: 'decision',
        targetId: 'decision-2',
        targetType: 'decision',
        type: 'depends_on'
      });
    });
    
    test('should execute a node query', () => {
      const query = {
        startNode: { type: 'decision', id: 'decision-1' },
        depth: 1,
        direction: 'outbound'
      };
      
      const results = graphQuery.executeQuery(query);
      
      expect(results.nodes.length).toBeGreaterThan(0);
      expect(results.relationships.length).toBe(2); // decision-1 -> pattern-1 and decision-1 -> decision-2
      expect(results.rootNodeId).toBe('decision:decision-1');
    });
    
    test('should execute a multi-node query', () => {
      const query = {
        startNodes: [
          { type: 'decision', id: 'decision-1' },
          { type: 'system_pattern', id: 'pattern-1' }
        ],
        depth: 1
      };
      
      const results = graphQuery.executeQuery(query);
      
      expect(results.nodes.length).toBeGreaterThan(0);
      expect(results.relationships.length).toBe(3); // All three relationships we added
      expect(results.rootNodeIds.length).toBe(2);
    });
    
    test('should respect query depth limits', () => {
      // First query with depth 1
      const query1 = {
        startNode: { type: 'decision', id: 'decision-1' },
        depth: 1,
        direction: 'all'
      };
      
      const results1 = graphQuery.executeQuery(query1);
      
      // Now with depth 2
      const query2 = {
        startNode: { type: 'decision', id: 'decision-1' },
        depth: 2,
        direction: 'all'
      };
      
      const results2 = graphQuery.executeQuery(query2);
      
      // Depth 2 should find more nodes (including progress-1 via pattern-1)
      expect(results2.nodes.length).toBeGreaterThan(results1.nodes.length);
      expect(results2.relationships.length).toBeGreaterThan(results1.relationships.length);
    });
    
    test('should filter relationships by type', () => {
      const query = {
        startNode: { type: 'decision', id: 'decision-1' },
        depth: 2,
        direction: 'all',
        relationshipTypes: ['implements'] // Only include 'implements' relationships
      };
      
      const results = graphQuery.executeQuery(query);
      
      expect(results.relationships.length).toBe(1);
      expect(results.relationships[0].type).toBe('implements');
    });
  });
});

/**
 * Integration Layer Tests
 */
describe('AMO Integration Layer', () => {
  describe('ConPortAMOIntegration', () => {
    let relationshipManager;
    let conPortIntegration;
    
    beforeEach(() => {
      relationshipManager = new RelationshipManager();
      conPortIntegration = new ConPortAMOIntegration(
        mockConPortClient,
        relationshipManager,
        {
          syncOnInit: false,
          autoSync: false
        }
      );
      
      // Reset mock calls
      mockConPortClient.logCustomData.mockClear();
      mockConPortClient.getCustomData.mockClear();
    });
    
    test('should sync relationships from ConPort', async () => {
      // Mock the ConPort response
      mockConPortClient.getCustomData.mockResolvedValueOnce([
        { 
          key: 'rel-1',
          value: {
            id: 'rel-1',
            sourceId: 'decision-123',
            sourceType: 'decision',
            targetId: 'pattern-456',
            targetType: 'system_pattern',
            type: 'implements'
          }
        }
      ]);
      
      const results = await conPortIntegration.syncFromConPort();
      
      expect(results.relationshipsRetrieved).toBe(1);
      expect(results.relationshipsAdded).toBe(1);
      
      // Verify relationship was added to the manager
      const relationship = relationshipManager.getRelationship('rel-1');
      expect(relationship).not.toBeNull();
      expect(relationship.sourceId).toBe('decision-123');
    });
    
    test('should sync relationships to ConPort', async () => {
      // Add a relationship to the manager
      relationshipManager.addRelationship({
        id: 'rel-1',
        sourceId: 'decision-123',
        sourceType: 'decision',
        targetId: 'pattern-456',
        targetType: 'system_pattern',
        type: 'implements'
      });
      
      const results = await conPortIntegration.syncToConPort();
      
      expect(results.relationshipsProcessed).toBe(1);
      expect(results.relationshipsSaved).toBe(1);
      
      // Verify ConPort client was called
      expect(mockConPortClient.logCustomData).toHaveBeenCalledTimes(1);
    });
    
    test('should save a mapping schema to ConPort', async () => {
      const mappingOrchestrator = new MappingOrchestrator(relationshipManager);
      
      const schema = {
        name: 'Test Schema',
        version: '1.0.0',
        relationshipTypes: ['implements']
      };
      
      const schemaId = mappingOrchestrator.registerSchema(schema);
      
      const result = await conPortIntegration.saveSchemaToConPort(schemaId, mappingOrchestrator);
      
      expect(result.success).toBe(true);
      expect(mockConPortClient.logCustomData).toHaveBeenCalled();
    });
  });
  
  describe('KDAPAMOIntegration', () => {
    let relationshipManager;
    let mappingOrchestrator;
    let kdapIntegration;
    
    beforeEach(() => {
      relationshipManager = new RelationshipManager();
      mappingOrchestrator = new MappingOrchestrator(relationshipManager);
      kdapIntegration = new KDAPAMOIntegration(
        mockKdapClient,
        relationshipManager,
        mappingOrchestrator,
        { autoDiscover: false }
      );
      
      // Register a test schema
      mappingOrchestrator.registerSchema({
        name: 'Test Schema',
        version: '1.0.0',
        relationshipTypes: ['implements'],
        mappingRules: [
          {
            sourceType: 'decision',
            targetType: 'system_pattern',
            relationshipType: 'implements',
            defaultConfidence: 0.8
          }
        ]
      });
      
      // Reset mock calls
      mockKdapClient.getDecisions.mockClear();
      mockKdapClient.getSystemPatterns.mockClear();
    });
    
    test('should discover relationships using KDAP knowledge', async () => {
      // Mock KDAP responses
      mockKdapClient.getDecisions.mockResolvedValueOnce([
        { id: 'decision-123', summary: 'Test decision' }
      ]);
      
      mockKdapClient.getSystemPatterns.mockResolvedValueOnce([
        { id: 'pattern-456', name: 'Test pattern' }
      ]);
      
      const results = await kdapIntegration.discoverRelationships({
        knowledgeTypes: ['decision', 'system_pattern']
      });
      
      expect(mockKdapClient.getDecisions).toHaveBeenCalled();
      expect(mockKdapClient.getSystemPatterns).toHaveBeenCalled();
      
      expect(results.relationshipsDiscovered).toBeGreaterThan(0);
    });
    
    test('should analyze relationships for a specific artifact', async () => {
      // Mock KDAP responses
      mockKdapClient.semanticSearchKnowledge.mockResolvedValueOnce([
        { id: 'pattern-456', type: 'system_pattern', name: 'Test pattern' }
      ]);
      
      const artifact = { id: 'decision-123', summary: 'Test decision' };
      
      const results = await kdapIntegration.analyzeArtifactRelationships(
        artifact,
        'decision',
        { relatedArtifactTypes: ['system_pattern'] }
      );
      
      expect(mockKdapClient.semanticSearchKnowledge).toHaveBeenCalled();
      expect(results.artifactId).toBe('decision-123');
    });
  });
  
  describe('AKAFAMOIntegration', () => {
    let relationshipManager;
    let graphQuery;
    let akafIntegration;
    
    beforeEach(() => {
      relationshipManager = new RelationshipManager();
      graphQuery = new KnowledgeGraphQuery(relationshipManager);
      akafIntegration = new AKAFAMOIntegration(
        mockAkafClient,
        relationshipManager,
        graphQuery
      );
      
      // Add test relationships
      relationshipManager.addRelationship({
        sourceId: 'decision-1',
        sourceType: 'decision',
        targetId: 'pattern-1',
        targetType: 'system_pattern',
        type: 'implements'
      });
      
      relationshipManager.addRelationship({
        sourceId: 'pattern-1',
        sourceType: 'system_pattern',
        targetId: 'progress-1',
        targetType: 'progress',
        type: 'tracked_by'
      });
    });
    
    test('should enhance a knowledge request with relationships', async () => {
      const request = {
        query: 'How to implement caching?',
        context: {
          decisions: [{ id: 'decision-1', summary: 'Implement caching' }]
        }
      };
      
      const enhanced = await akafIntegration.enhanceKnowledgeRequest(request);
      
      expect(enhanced.context.relationships).toBeDefined();
      expect(enhanced.context.relationships.length).toBeGreaterThan(0);
    });
    
    test('should analyze knowledge connectivity', async () => {
      const artifacts = [
        { id: 'decision-1', type: 'decision' },
        { id: 'pattern-1', type: 'system_pattern' },
        { id: 'progress-1', type: 'progress' }
      ];
      
      const analysis = await akafIntegration.analyzeKnowledgeConnectivity(artifacts);
      
      expect(analysis.artifacts).toBe(3);
      expect(analysis.relationships).toBeGreaterThan(0);
      expect(analysis.connectivity).toBeDefined();
    });
  });
});