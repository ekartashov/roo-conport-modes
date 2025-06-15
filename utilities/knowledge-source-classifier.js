/**
 * Knowledge Source Classifier
 * 
 * A utility for explicitly classifying and marking knowledge sources in AI responses,
 * creating clear distinctions between retrieved, inferred, and generated knowledge.
 */

/**
 * Enum for different knowledge source types
 */
const KnowledgeSourceType = {
  RETRIEVED: 'retrieved',    // Directly retrieved from ConPort
  INFERRED: 'inferred',      // Derived from context but not explicitly in ConPort
  GENERATED: 'generated',    // Newly created during the current session
  VALIDATED: 'validated',    // Verified against ConPort but not directly retrieved
  UNCERTAIN: 'uncertain'     // Cannot be confidently classified
};

/**
 * Class representing a piece of knowledge with its source classification
 */
class KnowledgeItem {
  /**
   * Create a new knowledge item
   * @param {string} content - The knowledge content
   * @param {string} sourceType - The source type from KnowledgeSourceType
   * @param {Object} metadata - Additional metadata about the knowledge
   */
  constructor(content, sourceType, metadata = {}) {
    this.content = content;
    this.sourceType = sourceType;
    this.metadata = {
      timestamp: new Date().toISOString(),
      confidence: 1.0,
      references: [],
      ...metadata
    };
  }

  /**
   * Get a formatted string representation with source marking
   * @param {boolean} includeMetadata - Whether to include metadata in the output
   * @return {string} - Formatted knowledge item with source marking
   */
  toString(includeMetadata = false) {
    const sourceMarkers = {
      [KnowledgeSourceType.RETRIEVED]: '[R]',
      [KnowledgeSourceType.INFERRED]: '[I]',
      [KnowledgeSourceType.GENERATED]: '[G]',
      [KnowledgeSourceType.VALIDATED]: '[V]',
      [KnowledgeSourceType.UNCERTAIN]: '[?]'
    };
    
    const marker = sourceMarkers[this.sourceType] || '[?]';
    let result = `${marker} ${this.content}`;
    
    if (includeMetadata) {
      const metadataStr = JSON.stringify(this.metadata, null, 2);
      result += `\n(Metadata: ${metadataStr})`;
    }
    
    return result;
  }
}

/**
 * Classifier for determining knowledge source types
 */
class KnowledgeSourceClassifier {
  /**
   * Create a new knowledge source classifier
   * @param {Object} options - Configuration options
   * @param {Object} options.conPortClient - ConPort client for querying
   * @param {string} options.workspaceId - ConPort workspace ID
   */
  constructor(options = {}) {
    this.conPortClient = options.conPortClient;
    this.workspaceId = options.workspaceId;
    this.confidenceThreshold = options.confidenceThreshold || 0.7;
  }

  /**
   * Classify a piece of knowledge based on its source
   * @param {string} content - The knowledge content to classify
   * @param {Object} context - Context information to aid classification
   * @return {Promise<KnowledgeItem>} - Classified knowledge item
   */
  async classifyKnowledge(content, context = {}) {
    // First check if this is directly retrieved from ConPort
    const retrieveResult = await this.checkIfRetrieved(content);
    if (retrieveResult.isRetrieved) {
      return new KnowledgeItem(content, KnowledgeSourceType.RETRIEVED, {
        confidence: retrieveResult.confidence,
        references: retrieveResult.references
      });
    }
    
    // Next check if it can be validated against ConPort
    const validationResult = await this.validateAgainstConPort(content);
    if (validationResult.isValid) {
      return new KnowledgeItem(content, KnowledgeSourceType.VALIDATED, {
        confidence: validationResult.confidence,
        references: validationResult.references
      });
    }
    
    // Check if it can be inferred from context
    const inferenceResult = await this.checkIfInferred(content, context);
    if (inferenceResult.isInferred) {
      return new KnowledgeItem(content, KnowledgeSourceType.INFERRED, {
        confidence: inferenceResult.confidence,
        derivation: inferenceResult.derivation
      });
    }
    
    // If no other classification applies, it's generated
    const confidence = context.generationConfidence || 0.5;
    return new KnowledgeItem(content, 
      confidence > this.confidenceThreshold ? 
        KnowledgeSourceType.GENERATED : 
        KnowledgeSourceType.UNCERTAIN, 
      {
        confidence,
        generationContext: context.generationContext
      }
    );
  }

  /**
   * Check if knowledge was directly retrieved from ConPort
   * @param {string} content - The knowledge content
   * @return {Promise<Object>} - Result with isRetrieved flag and metadata
   */
  async checkIfRetrieved(content) {
    if (!this.conPortClient || !this.workspaceId) {
      return { isRetrieved: false, confidence: 0 };
    }
    
    try {
      // This would perform semantic search or exact match in ConPort
      // Simplified implementation for demonstration
      const references = [];
      let isRetrieved = false;
      let confidence = 0;
      
      // In a real implementation, this would search ConPort entries
      
      return { isRetrieved, confidence, references };
    } catch (error) {
      console.error('Error checking if content was retrieved:', error);
      return { isRetrieved: false, confidence: 0 };
    }
  }

  /**
   * Validate knowledge against ConPort without exact retrieval
   * @param {string} content - The knowledge content
   * @return {Promise<Object>} - Result with isValid flag and metadata
   */
  async validateAgainstConPort(content) {
    if (!this.conPortClient || !this.workspaceId) {
      return { isValid: false, confidence: 0 };
    }
    
    try {
      // This would validate against ConPort using semantic search
      // Simplified implementation for demonstration
      const references = [];
      let isValid = false;
      let confidence = 0;
      
      // In a real implementation, this would perform validation against ConPort
      
      return { isValid, confidence, references };
    } catch (error) {
      console.error('Error validating against ConPort:', error);
      return { isValid: false, confidence: 0 };
    }
  }

  /**
   * Check if knowledge can be inferred from context
   * @param {string} content - The knowledge content
   * @param {Object} context - Context information
   * @return {Promise<Object>} - Result with isInferred flag and metadata
   */
  async checkIfInferred(content, context) {
    // This would check if the content can be logically derived
    // Simplified implementation for demonstration
    let isInferred = false;
    let confidence = 0;
    let derivation = null;
    
    // In a real implementation, this would analyze context and content
    
    return { isInferred, confidence, derivation };
  }

  /**
   * Process a complete response to mark knowledge sources
   * @param {string} response - The full response text
   * @param {Object} context - Context information
   * @return {Promise<string>} - Response with knowledge sources marked
   */
  async markKnowledgeSources(response, context = {}) {
    // Split response into sentences or logical units
    const sentences = response.split(/(?<=[.!?])\s+/);
    const processedSentences = [];
    
    // Process each sentence
    for (const sentence of sentences) {
      if (sentence.trim().length === 0) {
        processedSentences.push(sentence);
        continue;
      }
      
      // Classify the sentence
      const knowledgeItem = await this.classifyKnowledge(sentence, context);
      processedSentences.push(knowledgeItem.toString());
    }
    
    return processedSentences.join(' ');
  }

  /**
   * Add a legend explaining the knowledge source markers
   * @param {string} markedResponse - Response with knowledge sources marked
   * @return {string} - Response with legend added
   */
  addSourceLegend(markedResponse) {
    const legend = `
---
Knowledge Source Legend:
[R] - Retrieved directly from ConPort
[I] - Inferred from context but not explicitly in ConPort
[G] - Generated during this session
[V] - Validated against ConPort but not directly retrieved
[?] - Source uncertain or cannot be confidently classified
---
`;
    
    return `${legend}\n\n${markedResponse}`;
  }
}

/**
 * Factory function for creating knowledge source classifiers
 * @param {Object} options - Configuration options
 * @return {KnowledgeSourceClassifier} - New classifier instance
 */
function createKnowledgeSourceClassifier(options) {
  return new KnowledgeSourceClassifier(options);
}

module.exports = {
  KnowledgeSourceType,
  KnowledgeItem,
  KnowledgeSourceClassifier,
  createKnowledgeSourceClassifier
};