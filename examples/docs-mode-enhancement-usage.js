/**
 * Docs Mode Enhancement Usage Example
 * 
 * This example demonstrates how to use the Docs Mode Enhancement
 * to validate documentation, extract knowledge, and integrate with ConPort.
 */

const { DocsModeEnhancement } = require('../utilities/mode-enhancements/docs-mode-enhancement');
const { DocsValidationCheckpoints } = require('../utilities/mode-enhancements/docs-validation-checkpoints');
const { DocsKnowledgeFirstGuidelines } = require('../utilities/mode-enhancements/docs-knowledge-first');

// Sample API documentation
const apiDocExample = {
  filename: 'api-reference.md',
  type: 'api_reference',
  content: `# API Reference

## Overview

This document describes the public API for the knowledge management system.

## get_document(id)

Retrieves a document by its ID.

### Parameters

- \`id\` - The unique identifier of the document to retrieve.

### Returns

Returns a document object if found, otherwise returns null.

### Examples

\`\`\`javascript
const document = get_document('doc123');
console.log(document.title);
\`\`\`

### Errors

- 404: Document not found
- 500: Internal server error

## create_document(data)

Creates a new document.

### Parameters

- \`data\` - An object containing the document data. Must include 'title' and 'content'.

### Returns

Returns the newly created document object with a generated ID.

### Examples

\`\`\`javascript
const newDoc = create_document({
  title: 'Sample Document',
  content: 'This is the content of the sample document.'
});
console.log(newDoc.id);
\`\`\`

## delete_document(id)

Deletes a document.

### Parameters

- \`id\` - The unique identifier of the document to delete.

### Returns

Returns true if the document was successfully deleted, otherwise false.

## Examples

\`\`\`javascript
const result = delete_document('doc123');
console.log(result); // true if successfully deleted
\`\`\`

## Best Practices

**Best Practice** - Always check the return value of delete_document to confirm successful deletion.

## Glossary

**Document** - A single piece of content in the knowledge management system.
**Collection** - A group of related documents.

## See also: Knowledge Management System Design Document, User Guide
`
};

// Sample design document
const designDocExample = {
  filename: 'design-document.md',
  type: 'design_doc',
  content: `# Design Document: Knowledge Management System

## Overview

This design document outlines the architecture and implementation details of the Knowledge Management System.

## Goals and Non-Goals

### Goals

- Provide a centralized repository for organizational knowledge
- Support multiple document formats and knowledge extraction
- Enable efficient search and retrieval of information
- Ensure data consistency and integrity

### Non-Goals

- Replace existing content management systems
- Provide real-time collaboration features
- Support multimedia content

## Architecture

The Knowledge Management System follows a modular architecture with the following components:

1. Storage Layer - Responsible for document persistence
2. Extraction Layer - Extracts structured knowledge from documents
3. API Layer - Provides access to documents and knowledge
4. Search Layer - Enables efficient searching across documents

## Trade-offs

- **Performance vs. Flexibility**: We chose a schema-less document store for flexibility, sacrificing some query performance.
- **Simplicity vs. Features**: We prioritized a simple API over feature richness to ensure ease of adoption.

## Alternatives Considered

We considered a graph-based storage system which would allow more complex relationships between knowledge entities. However, we decided against this approach due to:
1. Higher complexity
2. Steeper learning curve
3. Less mature tooling

## Decision Log

### Database Selection

Decision: Use MongoDB as the primary data store.
Rationale: MongoDB provides the schema flexibility we need while offering good performance and mature tooling.
Alternatives: PostgreSQL with JSONB, Neo4j, Elasticsearch

### API Design

Decision: Implement a REST API with GraphQL for complex queries.
Rationale: REST provides simplicity for basic operations, while GraphQL enables complex data fetching in a single request.
Alternatives: REST-only, GraphQL-only, RPC

## Implementation Plan

1. Phase 1: Core storage and API (Weeks 1-2)
2. Phase 2: Knowledge extraction (Weeks 3-4)
3. Phase 3: Search capabilities (Weeks 5-6)
4. Phase 4: Integration with existing systems (Weeks 7-8)

**Constraint** - The system must maintain backward compatibility with existing document formats.

**Pattern** - Repository Pattern for data access abstraction.
\`\`\`javascript
class DocumentRepository {
  async findById(id) {
    // Implementation
  }
  
  async create(data) {
    // Implementation
  }
  
  async update(id, data) {
    // Implementation
  }
  
  async delete(id) {
    // Implementation
  }
}
\`\`\`
`
};

// Sample troubleshooting guide
const troubleshootingGuideExample = {
  filename: 'troubleshooting-guide.md',
  type: 'troubleshooting',
  content: `# Troubleshooting Guide

This guide helps you resolve common issues with the Knowledge Management System.

## Issue: Unable to connect to the database

If you're unable to connect to the database, try the following steps:

### Solution

1. Check that the database server is running
2. Verify your connection string is correct
3. Ensure your IP address is allowed in the database firewall
4. Check for proper authentication credentials

### Steps

1. Run \`systemctl status mongodb\` to check if MongoDB is running
2. Open the configuration file at \`/etc/mongodb.conf\` and verify the connection details
3. Check the MongoDB logs at \`/var/log/mongodb/mongodb.log\` for error messages
4. Restart the database service with \`systemctl restart mongodb\`

## Issue: Search not returning expected results

If your searches are not returning expected results, the search index may be out of sync.

### Solution

Rebuild the search index using the admin interface or API.

### Steps

1. Log in to the admin interface
2. Navigate to "Maintenance" > "Search Index"
3. Click "Rebuild Index"
4. Wait for the indexing process to complete

## Issue: Document upload fails

### Solution

Check the file size and format, and ensure you have proper permissions.

### Steps

1. Verify the file is smaller than the 10MB limit
2. Ensure the file format is supported (PDF, DOCX, MD, TXT)
3. Check your user account has upload permissions
4. Try uploading a smaller test file to verify the upload functionality

## See also: System Configuration Guide, API Reference
`
};

// Initialize the Docs Mode Enhancement
const docsEnhancement = new DocsModeEnhancement({
  // Optional custom validation checkpoints
  checkpoints: new DocsValidationCheckpoints({
    // You can customize checkpoint thresholds
    documentationCompletenessThreshold: 0.8,
    documentationConsistencyThreshold: 0.9
  }).getCheckpoints(),
  
  // Optional custom knowledge first guidelines
  knowledgeGuidelines: new DocsKnowledgeFirstGuidelines({
    // You can customize document types or extraction patterns
    documentTypes: {
      // Adding a custom document type
      system_specification: {
        priority: 'high',
        sections: ['overview', 'requirements', 'design', 'implementation'],
        knowledgeDensity: 0.8
      }
    }
  }),
  
  // ConPort integration options
  conportOptions: {
    enabled: true,
    autoExtract: true,
    autoLog: true,
    workspace: '/home/user/Projects/agentic/roo-conport-modes'
  },
  
  // Custom event handlers
  onValidationComplete: (results, document, context) => {
    console.log(`Validation completed for ${document.filename}`);
    console.log(`Valid: ${results.valid}`);
    
    if (!results.valid) {
      console.log('Validation errors:');
      results.errors.forEach(error => console.log(`- ${error}`));
    }
  },
  
  onKnowledgeExtracted: (results, document, context) => {
    console.log(`Knowledge extracted from ${document.filename}`);
    console.log(`Extracted ${results.extractedKnowledge.length} knowledge items`);
    console.log(`Extracted ${results.extractedReferences.length} references`);
    
    // Example: Log the first 3 items
    if (results.extractedKnowledge.length > 0) {
      console.log('Sample extracted knowledge:');
      results.extractedKnowledge.slice(0, 3).forEach(item => {
        console.log(`- Type: ${item.type}, Category: ${item.category}`);
        console.log(`  Data: ${JSON.stringify(item.data).substring(0, 100)}...`);
      });
    }
  }
});

// Example 1: Validate API documentation
console.log('\nExample 1: Validating API documentation');
const apiValidationResults = docsEnhancement.validate(apiDocExample);

// Example 2: Extract knowledge from design document
console.log('\nExample 2: Extracting knowledge from design document');
const designDocKnowledge = docsEnhancement.extractDocumentKnowledge(designDocExample);

// Example 3: Validate and extract from troubleshooting guide
console.log('\nExample 3: Validating and extracting from troubleshooting guide');
const troubleshootingResults = docsEnhancement.validate(troubleshootingGuideExample);

// Example 4: Access knowledge guidelines and validation manager
console.log('\nExample 4: Accessing knowledge guidelines and validation manager');
const knowledgeGuidelines = docsEnhancement.getKnowledgeGuidelines();
const validationManager = docsEnhancement.getValidationManager();

console.log(`Knowledge guidelines mode: ${knowledgeGuidelines.mode}`);
console.log(`Validation manager mode: ${validationManager.mode}`);

// Example 5: Get available knowledge types and document types
console.log('\nExample 5: Available knowledge types and document types');
const knowledgeTypes = docsEnhancement.getKnowledgeTypes();
const documentationTypes = docsEnhancement.getDocumentationTypes();

console.log('Knowledge types:');
Object.keys(knowledgeTypes).forEach(type => {
  console.log(`- ${type} (Priority: ${knowledgeTypes[type].priority})`);
});

console.log('Documentation types:');
Object.keys(documentationTypes).forEach(type => {
  console.log(`- ${type} (Priority: ${documentationTypes[type].priority})`);
});

// Example 6: ConPort integration (simulated)
console.log('\nExample 6: ConPort integration');
const simulatedConportOperation = {
  method: 'log_custom_data',
  params: {
    category: 'DocumentationCatalog',
    key: 'api_reference_md',
    value: {
      filename: 'api-reference.md',
      type: 'api_reference',
      title: 'API Reference',
      sections: ['Overview', 'get_document', 'create_document', 'delete_document'],
      lastUpdated: new Date().toISOString()
    }
  }
};

docsEnhancement.executeConportOperation(simulatedConportOperation);