/**
 * Semantic Knowledge Graph Core
 * 
 * This module implements core semantic knowledge graph functionality,
 * including relationship discovery, concept mapping, and semantic search.
 */

/**
 * Creates a semantic knowledge graph manager with capabilities for
 * relationship discovery, concept mapping, and graph operations.
 * 
 * @param {Object} options Configuration options
 * @param {string} options.workspaceId ConPort workspace ID
 * @param {Object} options.conPortClient ConPort client instance
 * @returns {Object} Semantic knowledge graph methods
 */
function createSemanticKnowledgeGraph(options = {}) {
  const { workspaceId, conPortClient } = options;
  
  // Internal graph representation
  const graph = {
    nodes: new Map(),
    edges: new Map()
  };
  
  /**
   * Extracts key concepts from text using NLP techniques
   * @param {string} text The text to analyze
   * @returns {Array<Object>} Extracted concepts with relevance scores
   */
  function extractConcepts(text) {
    if (!text) return [];
    
    // This is a simplified implementation
    // In a real system, this would use NLP libraries for concept extraction
    
    // Remove common stop words and punctuation
    const cleanText = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Split into tokens
    const tokens = cleanText.split(' ');
    
    // Count token frequency
    const tokenFrequency = {};
    tokens.forEach(token => {
      if (token.length < 3) return; // Skip very short tokens
      tokenFrequency[token] = (tokenFrequency[token] || 0) + 1;
    });
    
    // Convert to array and sort by frequency
    const concepts = Object.entries(tokenFrequency)
      .map(([text, frequency]) => ({
        text,
        frequency,
        relevance: frequency / tokens.length
      }))
      .filter(concept => concept.relevance > 0.01) // Filter low relevance concepts
      .sort((a, b) => b.relevance - a.relevance);
    
    return concepts.slice(0, 10); // Return top 10 concepts
  }
  
  /**
   * Calculates semantic similarity between two texts
   * @param {string} text1 First text
   * @param {string} text2 Second text
   * @returns {number} Similarity score between 0 and 1
   */
  function calculateSimilarity(text1, text2) {
    if (!text1 || !text2) return 0;
    
    // Extract concepts from both texts
    const concepts1 = extractConcepts(text1);
    const concepts2 = extractConcepts(text2);
    
    // Create a set of all unique concept texts
    const allConceptTexts = new Set([
      ...concepts1.map(c => c.text),
      ...concepts2.map(c => c.text)
    ]);
    
    // Count shared concepts
    const conceptsInText1 = new Set(concepts1.map(c => c.text));
    const conceptsInText2 = new Set(concepts2.map(c => c.text));
    
    let sharedCount = 0;
    for (const concept of allConceptTexts) {
      if (conceptsInText1.has(concept) && conceptsInText2.has(concept)) {
        sharedCount++;
      }
    }
    
    // Calculate Jaccard similarity coefficient
    return allConceptTexts.size > 0 ? sharedCount / allConceptTexts.size : 0;
  }
  
  /**
   * Discovers potential relationships between ConPort items based on semantic similarity
   * @param {Object} options Discovery options
   * @param {string} options.sourceType Source item type
   * @param {string|number} options.sourceId Source item ID
   * @param {Array<string>} [options.targetTypes] Types of items to check
   * @param {number} [options.similarityThreshold=0.3] Minimum similarity threshold
   * @param {number} [options.limit=10] Maximum number of relationships to discover
   * @returns {Promise<Array<Object>>} Discovered relationships
   */
  async function discoverRelationships(options) {
    const {
      sourceType,
      sourceId,
      targetTypes = ['decision', 'system_pattern', 'custom_data'],
      similarityThreshold = 0.3,
      limit = 10
    } = options;
    
    // Get source item content
    const sourceContent = await getItemContent(sourceType, sourceId);
    if (!sourceContent) {
      throw new Error(`Could not retrieve content for ${sourceType}:${sourceId}`);
    }
    
    const discoveredRelationships = [];
    
    // For each target type
    for (const targetType of targetTypes) {
      // Get potential target items
      const targetItems = await getItemsOfType(targetType);
      
      // Calculate similarity with each target
      for (const targetItem of targetItems) {
        // Skip self-comparison
        if (targetType === sourceType && targetItem.id === sourceId) {
          continue;
        }
        
        const targetContent = getContentFromItem(targetItem, targetType);
        const similarity = calculateSimilarity(sourceContent, targetContent);
        
        if (similarity >= similarityThreshold) {
          // Determine relationship type based on similarity and content analysis
          const relationshipType = inferRelationshipType(
            sourceContent, 
            targetContent,
            sourceType,
            targetType,
            similarity
          );
          
          discoveredRelationships.push({
            sourceType,
            sourceId,
            targetType,
            targetId: targetItem.id,
            relationshipType,
            similarity,
            confidence: similarity * 100
          });
        }
      }
    }
    
    // Sort by similarity (highest first) and limit results
    return discoveredRelationships
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }
  
  /**
   * Infers the most likely relationship type between two items
   * @param {string} sourceContent Source item content
   * @param {string} targetContent Target item content
   * @param {string} sourceType Source item type
   * @param {string} targetType Target item type
   * @param {number} similarity Calculated similarity score
   * @returns {string} Inferred relationship type
   */
  function inferRelationshipType(
    sourceContent, 
    targetContent, 
    sourceType, 
    targetType,
    similarity
  ) {
    // This is a simplified implementation
    // A real system would use more sophisticated NLP techniques
    
    // Default relationship
    let relationship = 'related_to';
    
    // Decision + System Pattern often has implementation relationship
    if (
      (sourceType === 'decision' && targetType === 'system_pattern') ||
      (sourceType === 'system_pattern' && targetType === 'decision')
    ) {
      // Check for implementation keywords
      if (
        targetContent.includes('implement') || 
        targetContent.includes('execution') ||
        targetContent.includes('application')
      ) {
        relationship = 'implements';
      }
    }
    
    // Check for extension relationship
    if (
      targetContent.includes('extends') || 
      targetContent.includes('builds on') ||
      targetContent.includes('enhances')
    ) {
      relationship = 'extends';
    }
    
    // Check for dependency relationship
    if (
      targetContent.includes('depends') || 
      targetContent.includes('requires') ||
      targetContent.includes('needs')
    ) {
      relationship = 'depends_on';
    }
    
    // Very high similarity might indicate similarity relationship
    if (similarity > 0.7) {
      relationship = 'similar_to';
    }
    
    return relationship;
  }
  
  /**
   * Retrieves content for a ConPort item by type and ID
   * @param {string} itemType Item type
   * @param {string|number} itemId Item ID
   * @returns {Promise<string>} Content text from the item
   */
  async function getItemContent(itemType, itemId) {
    try {
      switch (itemType) {
        case 'decision': {
          const decision = await conPortClient.get_decisions({
            workspace_id: workspaceId,
            decision_id: Number(itemId)
          });
          
          return [
            decision.summary,
            decision.rationale,
            decision.implementation_details
          ].filter(Boolean).join(' ');
        }
        
        case 'system_pattern': {
          const pattern = await conPortClient.get_system_patterns({
            workspace_id: workspaceId,
            pattern_id: Number(itemId)
          });
          
          return [pattern.name, pattern.description].filter(Boolean).join(' ');
        }
        
        case 'custom_data': {
          // For custom data, itemId should be in format "category:key"
          if (typeof itemId === 'string' && itemId.includes(':')) {
            const [category, key] = itemId.split(':');
            const data = await conPortClient.get_custom_data({
              workspace_id: workspaceId,
              category,
              key
            });
            
            if (typeof data.value === 'string') {
              return data.value;
            } else {
              return JSON.stringify(data.value);
            }
          }
          break;
        }
        
        case 'product_context': {
          const context = await conPortClient.get_product_context({
            workspace_id: workspaceId
          });
          
          return JSON.stringify(context);
        }
        
        case 'active_context': {
          const context = await conPortClient.get_active_context({
            workspace_id: workspaceId
          });
          
          return JSON.stringify(context);
        }
        
        case 'progress_entry': {
          const progress = await conPortClient.get_progress({
            workspace_id: workspaceId,
            progress_id: Number(itemId)
          });
          
          return progress.description;
        }
      }
    } catch (error) {
      console.error(`Error retrieving content for ${itemType}:${itemId}:`, error);
      return '';
    }
    
    return '';
  }
  
  /**
   * Extracts content from an item object based on its type
   * @param {Object} item The item object
   * @param {string} itemType Item type
   * @returns {string} Content text
   */
  function getContentFromItem(item, itemType) {
    switch (itemType) {
      case 'decision':
        return [
          item.summary,
          item.rationale,
          item.implementation_details
        ].filter(Boolean).join(' ');
        
      case 'system_pattern':
        return [item.name, item.description].filter(Boolean).join(' ');
        
      case 'custom_data':
        if (typeof item.value === 'string') {
          return item.value;
        } else {
          return JSON.stringify(item.value);
        }
        
      case 'progress_entry':
        return item.description;
        
      default:
        return JSON.stringify(item);
    }
  }
  
  /**
   * Retrieves items of a specific type from ConPort
   * @param {string} itemType Type of items to retrieve
   * @param {Object} [options] Additional options
   * @returns {Promise<Array<Object>>} Retrieved items
   */
  async function getItemsOfType(itemType, options = {}) {
    try {
      switch (itemType) {
        case 'decision':
          const decisions = await conPortClient.get_decisions({
            workspace_id: workspaceId,
            limit: options.limit || 50
          });
          return Array.isArray(decisions) ? decisions : [];
          
        case 'system_pattern':
          const patterns = await conPortClient.get_system_patterns({
            workspace_id: workspaceId
          });
          return Array.isArray(patterns) ? patterns : [];
          
        case 'custom_data':
          // This is simplified - would need to handle categories/keys appropriately
          const customData = await conPortClient.get_custom_data({
            workspace_id: workspaceId,
            category: options.category
          });
          
          // Transform custom data into array format with category+key as ID
          return Object.entries(customData || {}).map(([key, value]) => ({
            id: `${options.category || 'unknown'}:${key}`,
            key,
            value
          }));
          
        case 'progress_entry':
          const progress = await conPortClient.get_progress({
            workspace_id: workspaceId,
            limit: options.limit || 50
          });
          return Array.isArray(progress) ? progress : [];
      }
    } catch (error) {
      console.error(`Error retrieving items of type ${itemType}:`, error);
      return [];
    }
    
    return [];
  }
  
  /**
   * Builds a knowledge graph starting from a root item and following relationships
   * @param {Object} options Graph building options
   * @param {string} options.rootItemType Root item type
   * @param {string|number} options.rootItemId Root item ID
   * @param {number} [options.depth=2] Maximum traversal depth
   * @param {Array<string>} [options.relationshipTypes] Optional filter for relationship types
   * @returns {Promise<Object>} Built graph with nodes and edges
   */
  async function buildKnowledgeGraph(options) {
    const {
      rootItemType,
      rootItemId,
      depth = 2,
      relationshipTypes
    } = options;
    
    // Reset the graph
    graph.nodes = new Map();
    graph.edges = new Map();
    
    // Add root node
    const rootNodeId = `${rootItemType}:${rootItemId}`;
    const rootContent = await getItemContent(rootItemType, rootItemId);
    
    graph.nodes.set(rootNodeId, {
      id: rootNodeId,
      type: rootItemType,
      itemId: rootItemId,
      content: rootContent
    });
    
    // Process the root node
    await expandGraphNode(rootNodeId, depth, relationshipTypes);
    
    // Convert to serializeable format
    return {
      nodes: Array.from(graph.nodes.values()),
      edges: Array.from(graph.edges.values())
    };
  }
  
  /**
   * Expands the graph from a node, discovering and adding related items
   * @param {string} nodeId ID of the node to expand from
   * @param {number} remainingDepth Remaining depth for traversal
   * @param {Array<string>} [relationshipTypes] Optional filter for relationship types
   */
  async function expandGraphNode(nodeId, remainingDepth, relationshipTypes) {
    if (remainingDepth <= 0) return;
    
    const node = graph.nodes.get(nodeId);
    if (!node) return;
    
    const [itemType, itemId] = nodeId.split(':');
    
    // Get existing relationships from ConPort
    const linkedItems = await conPortClient.get_linked_items({
      workspace_id: workspaceId,
      item_type: itemType,
      item_id: itemId,
      relationship_type_filter: relationshipTypes ? relationshipTypes[0] : undefined
    });
    
    // Process each linked item
    for (const link of linkedItems) {
      const targetNodeId = `${link.target_item_type}:${link.target_item_id}`;
      
      // Skip if we've already processed this node
      if (graph.nodes.has(targetNodeId)) continue;
      
      // Get target item content
      const targetContent = await getItemContent(
        link.target_item_type,
        link.target_item_id
      );
      
      // Add node to graph
      graph.nodes.set(targetNodeId, {
        id: targetNodeId,
        type: link.target_item_type,
        itemId: link.target_item_id,
        content: targetContent
      });
      
      // Add edge to graph
      const edgeId = `${nodeId}--${link.relationship_type}-->${targetNodeId}`;
      graph.edges.set(edgeId, {
        id: edgeId,
        source: nodeId,
        target: targetNodeId,
        type: link.relationship_type,
        description: link.description || ''
      });
      
      // Recursively expand this node
      await expandGraphNode(targetNodeId, remainingDepth - 1, relationshipTypes);
    }
    
    // If we're at the first level, try to discover additional relationships
    if (remainingDepth === depth) {
      const discoveredRelationships = await discoverRelationships({
        sourceType: itemType,
        sourceId: itemId,
        similarityThreshold: 0.4
      });
      
      // Add discovered relationships if they pass relationship type filter
      for (const rel of discoveredRelationships) {
        if (
          relationshipTypes &&
          !relationshipTypes.includes(rel.relationshipType)
        ) {
          continue;
        }
        
        const targetNodeId = `${rel.targetType}:${rel.targetId}`;
        
        // Skip if we've already processed this node
        if (graph.nodes.has(targetNodeId)) continue;
        
        // Get target item content
        const targetContent = await getItemContent(
          rel.targetType,
          rel.targetId
        );
        
        // Add node to graph
        graph.nodes.set(targetNodeId, {
          id: targetNodeId,
          type: rel.targetType,
          itemId: rel.targetId,
          content: targetContent,
          discovery: {
            similarity: rel.similarity,
            confidence: rel.confidence
          }
        });
        
        // Add edge to graph
        const edgeId = `${nodeId}--${rel.relationshipType}-->${targetNodeId}`;
        graph.edges.set(edgeId, {
          id: edgeId,
          source: nodeId,
          target: targetNodeId,
          type: rel.relationshipType,
          discovered: true,
          confidence: rel.confidence
        });
      }
    }
  }
  
  /**
   * Performs a semantic search across ConPort items
   * @param {Object} options Search options
   * @param {string} options.conceptQuery The concept/query text
   * @param {Array<string>} [options.itemTypes] Optional filter for item types
   * @param {number} [options.limit=10] Maximum number of results
   * @returns {Promise<Array<Object>>} Search results with relevance scores
   */
  async function semanticSearch(options) {
    const {
      conceptQuery,
      itemTypes = ['decision', 'system_pattern', 'custom_data', 'progress_entry'],
      limit = 10
    } = options;
    
    const results = [];
    
    // For each item type
    for (const itemType of itemTypes) {
      // Get items of this type
      const items = await getItemsOfType(itemType);
      
      // Calculate relevance for each item
      for (const item of items) {
        const content = getContentFromItem(item, itemType);
        const relevance = calculateSimilarity(conceptQuery, content);
        
        if (relevance > 0.2) { // Minimum relevance threshold
          results.push({
            id: `${itemType}:${item.id}`,
            type: itemType,
            item,
            relevance,
            matchScore: relevance * 100
          });
        }
      }
    }
    
    // Sort by relevance and limit results
    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit);
  }
  
  return {
    discoverRelationships,
    buildKnowledgeGraph,
    semanticSearch,
    // Expose helper methods for testing
    _extractConcepts: extractConcepts,
    _calculateSimilarity: calculateSimilarity,
    _inferRelationshipType: inferRelationshipType
  };
}

module.exports = {
  createSemanticKnowledgeGraph
};