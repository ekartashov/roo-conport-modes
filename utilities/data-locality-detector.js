/**
 * Data Locality Detector
 * 
 * This utility detects whether specific information exists in ConPort (locally) or needs to be
 * generated, inferred, or requested from the user. It helps prevent hallucinations by clearly
 * distinguishing between retrieved knowledge and generated knowledge.
 */

class DataLocalityDetector {
  /**
   * Constructor initializes the detector with workspace information
   * @param {string} workspaceId - The identifier for the workspace
   * @param {Object} options - Configuration options
   */
  constructor(workspaceId, options = {}) {
    this.workspaceId = workspaceId;
    this.options = {
      confidenceThresholds: {
        directMatch: 0.8,
        inference: 0.6,
        minimumInferenceSources: 2
      },
      searchLimits: {
        semantic: 5,
        factual: 5,
        decisions: 5,
        patterns: 10
      },
      ...options
    };
  }
  
  /**
   * Main method to detect if information exists in ConPort
   * @param {string} query - The query to check for locality
   * @param {string} type - Type of locality check to perform (semantic, factual, decision, pattern)
   * @returns {Promise<Object>} Locality result with source information
   */
  async detectLocality(query, type = "semantic") {
    try {
      switch (type) {
        case "semantic":
          return await this.semanticLocalityCheck(query);
        case "factual":
          return await this.factualLocalityCheck(query);
        case "decision":
          return await this.decisionLocalityCheck(query);
        case "pattern":
          return await this.patternLocalityCheck(query);
        case "comprehensive":
          return await this.comprehensiveLocalityCheck(query);
        default:
          throw new Error(`Unsupported locality check type: ${type}`);
      }
    } catch (error) {
      console.error("Locality detection error:", error);
      return this.generateFallbackLocality(error);
    }
  }
  
  /**
   * Performs a semantic search to check locality
   * @param {string} query - Natural language query
   * @returns {Promise<Object>} Locality result
   */
  async semanticLocalityCheck(query) {
    try {
      const results = await this.callMcpTool("semantic_search_conport", {
        workspace_id: this.workspaceId,
        query_text: query,
        top_k: this.options.searchLimits.semantic
      });
      
      return this.evaluateLocalityResults(results, "semantic");
    } catch (error) {
      throw new Error(`Semantic locality check failed: ${error.message}`);
    }
  }
  
  /**
   * Performs a factual search to check locality
   * @param {string} query - Keywords for custom data search
   * @returns {Promise<Object>} Locality result
   */
  async factualLocalityCheck(query) {
    try {
      const results = await this.callMcpTool("search_custom_data_value_fts", {
        workspace_id: this.workspaceId,
        query_term: query,
        limit: this.options.searchLimits.factual
      });
      
      return this.evaluateLocalityResults(results, "factual");
    } catch (error) {
      throw new Error(`Factual locality check failed: ${error.message}`);
    }
  }
  
  /**
   * Performs a decision search to check locality
   * @param {string} query - Keywords for decision search
   * @returns {Promise<Object>} Locality result
   */
  async decisionLocalityCheck(query) {
    try {
      const results = await this.callMcpTool("search_decisions_fts", {
        workspace_id: this.workspaceId,
        query_term: query,
        limit: this.options.searchLimits.decisions
      });
      
      return this.evaluateLocalityResults(results, "decision");
    } catch (error) {
      throw new Error(`Decision locality check failed: ${error.message}`);
    }
  }
  
  /**
   * Performs a pattern search to check locality
   * @param {string} query - Keywords or tags for pattern search
   * @returns {Promise<Object>} Locality result
   */
  async patternLocalityCheck(query) {
    try {
      // Split query into potential tags
      const tags = query
        .toLowerCase()
        .split(/\s+/)
        .filter(tag => tag.length > 3)
        // Remove punctuation and transform to kebab-case
        .map(tag => tag.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'));
      
      const results = await this.callMcpTool("get_system_patterns", {
        workspace_id: this.workspaceId,
        tags_filter_include_any: tags
      });
      
      return this.evaluateLocalityResults(results, "pattern");
    } catch (error) {
      throw new Error(`Pattern locality check failed: ${error.message}`);
    }
  }
  
  /**
   * Performs a comprehensive locality check across multiple dimensions
   * @param {string} query - The query to check
   * @returns {Promise<Object>} Best locality result from all checks
   */
  async comprehensiveLocalityCheck(query) {
    try {
      const results = await Promise.all([
        this.semanticLocalityCheck(query),
        this.factualLocalityCheck(query),
        this.decisionLocalityCheck(query),
        this.patternLocalityCheck(query)
      ]);
      
      // Find the result with the highest confidence
      return results.reduce((best, current) => {
        // RETRIEVED takes precedence over INFERRED
        if (current.locality === "RETRIEVED" && best.locality !== "RETRIEVED") {
          return current;
        } 
        
        // If both are same locality type, choose highest confidence
        if (current.locality === best.locality && current.confidence > best.confidence) {
          return current;
        }
        
        // If current is INFERRED and best is GENERATED, choose current
        if (current.locality === "INFERRED" && best.locality === "GENERATED") {
          return current;
        }
        
        return best;
      }, { locality: "GENERATED", confidence: 0, sources: [] });
    } catch (error) {
      throw new Error(`Comprehensive locality check failed: ${error.message}`);
    }
  }
  
  /**
   * Evaluates search results to determine locality
   * @param {Array} results - Results from ConPort search
   * @param {string} type - Type of search performed
   * @returns {Object} Locality determination
   */
  evaluateLocalityResults(results, type) {
    if (!results || results.length === 0) {
      return {
        locality: "GENERATED",
        confidence: 0,
        sources: [],
        type
      };
    }
    
    // Normalize results structure based on the type
    const normalizedResults = this.normalizeResults(results, type);
    
    // Check for direct matches
    const directMatches = normalizedResults.filter(result => 
      result.score > this.options.confidenceThresholds.directMatch
    );
    
    if (directMatches.length > 0) {
      return {
        locality: "RETRIEVED",
        confidence: this.computeAverageConfidence(directMatches),
        sources: directMatches.map(match => this.formatSource(match)),
        type,
        results: directMatches
      };
    }
    
    // Check for possible inference base
    const inferenceBase = normalizedResults.filter(result => 
      result.score > this.options.confidenceThresholds.inference
    );
    
    if (inferenceBase.length >= this.options.confidenceThresholds.minimumInferenceSources) {
      return {
        locality: "INFERRED",
        confidence: this.computeInferenceConfidence(inferenceBase),
        sources: inferenceBase.map(source => this.formatSource(source)),
        type,
        results: inferenceBase
      };
    }
    
    // No locality detected
    return {
      locality: "GENERATED",
      confidence: 0,
      sources: [],
      type
    };
  }
  
  /**
   * Normalizes results from different ConPort tools to a standard structure
   * @param {Array} results - Results from ConPort search
   * @param {string} type - Type of search performed
   * @returns {Array} Normalized results with consistent structure
   */
  normalizeResults(results, type) {
    // Handle different result structures based on tool type
    switch (type) {
      case "semantic":
        // semantic_search_conport returns results with score
        return results.map(item => ({
          id: item.id,
          type: item.item_type,
          score: item.score || item.similarity || 0,
          content: item.content || item
        }));
        
      case "factual":
        // search_custom_data_value_fts returns items with score/relevance
        return results.map(item => ({
          id: item.id || item.key,
          type: "custom_data",
          category: item.category,
          key: item.key,
          score: item.score || item.relevance || 0.7, // Default reasonable score
          content: item.value
        }));
        
      case "decision":
        // search_decisions_fts returns decisions with score
        return results.map(item => ({
          id: item.id,
          type: "decision",
          score: item.score || item.relevance || 0.7,
          content: { summary: item.summary, rationale: item.rationale }
        }));
        
      case "pattern":
        // get_system_patterns returns patterns without scores, so we compute relevance
        return results.map(item => {
          // Calculate a relevance score based on tag matches
          let score = 0.6; // Base score
          if (item.tags && item.tags.length > 0) {
            score += 0.05 * Math.min(item.tags.length, 5); // Boost for having tags
          }
          // If name or description has high term overlap, boost score
          // This is a simplified heuristic
          
          return {
            id: item.id,
            type: "system_pattern",
            score,
            content: { name: item.name, description: item.description }
          };
        });
        
      default:
        // Generic normalization
        return results.map(item => ({
          id: item.id || "unknown",
          type: item.type || "unknown",
          score: item.score || item.relevance || 0.5,
          content: item
        }));
    }
  }
  
  /**
   * Computes average confidence from matched results
   * @param {Array} matches - Matching results
   * @returns {number} Average confidence score
   */
  computeAverageConfidence(matches) {
    return matches.reduce((sum, match) => sum + match.score, 0) / matches.length;
  }
  
  /**
   * Computes inference confidence from multiple sources
   * @param {Array} sources - Source results that support inference
   * @returns {number} Confidence score for inferred information
   */
  computeInferenceConfidence(sources) {
    // Inference confidence is lower than direct matches
    // and decreases as the number of sources increases (more complex inference)
    const baseConfidence = sources.reduce((sum, source) => sum + source.score, 0) / sources.length;
    return baseConfidence * (0.8 - (Math.min(sources.length - 2, 3) * 0.05));
  }
  
  /**
   * Formats a source reference from a result item
   * @param {Object} result - The result to format as a source
   * @returns {string} Formatted source reference
   */
  formatSource(result) {
    if (result.type && result.id) {
      return `${result.type}#${result.id}`;
    } else if (result.id) {
      return `item#${result.id}`;
    } else if (result.category && result.key) {
      return `${result.category}:${result.key}`;
    } else {
      return "unknown";
    }
  }
  
  /**
   * Generates a fallback locality result when checks fail
   * @param {Error} error - The error that occurred
   * @returns {Object} Fallback locality result
   */
  generateFallbackLocality(error) {
    return {
      locality: "GENERATED",
      confidence: 0,
      sources: [],
      error: error ? error.message : "Failed to check locality"
    };
  }
  
  /**
   * Calls MCP tool to interact with ConPort
   * @param {string} toolName - Name of the ConPort tool
   * @param {Object} args - Arguments for the tool
   * @returns {Promise<Object>} Result from the tool
   */
  async callMcpTool(toolName, args) {
    // This is a placeholder - in a real implementation, we would use 
    // the actual MCP framework to call the tool
    console.log(`Calling ${toolName} with args:`, args);
    
    // Mock implementation for reference
    // In actual code, this would make a real MCP tool call
    return [];
  }
  
  /**
   * Creates appropriate prefix for response based on locality
   * @param {Object} localityResult - Result from detectLocality
   * @returns {string} Prefix to use in response
   */
  static getResponsePrefix(localityResult) {
    switch (localityResult.locality) {
      case "RETRIEVED":
        return "[RETRIEVED]";
      case "INFERRED":
        return "[INFERRED]";
      case "GENERATED":
        return "[SUGGESTION]";
      default:
        return "[UNKNOWN]";
    }
  }
  
  /**
   * Creates a formatted response with appropriate attribution
   * @param {Object} localityResult - Result from detectLocality
   * @param {string} content - The content to present
   * @returns {string} Formatted response with attribution
   */
  static formatResponse(localityResult, content) {
    const prefix = DataLocalityDetector.getResponsePrefix(localityResult);
    
    if (localityResult.locality === "RETRIEVED") {
      return `${prefix} According to ${localityResult.sources.join(", ")}: ${content}`;
    } else if (localityResult.locality === "INFERRED") {
      return `${prefix} Based on ${localityResult.sources.join(", ")}, I can infer that: ${content}`;
    } else {
      return `${prefix} ${content}`;
    }
  }
}

/**
 * Example usage:
 * 
 * async function answerQuestion(question) {
 *   const localityDetector = new DataLocalityDetector(workspaceId);
 *   const localityResult = await localityDetector.detectLocality(question, "comprehensive");
 * 
 *   let response;
 *   if (localityResult.locality === "RETRIEVED") {
 *     response = `According to ${localityResult.sources[0]}, the answer is...`;
 *   } else if (localityResult.locality === "INFERRED") {
 *     response = `Based on several sources (${localityResult.sources.join(", ")}), I believe the answer is...`;
 *   } else {
 *     response = "I don't have this information in ConPort, but my suggestion would be...";
 *   }
 *   
 *   return response;
 * }
 */

module.exports = DataLocalityDetector;