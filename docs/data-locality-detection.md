# Data Locality Detection Mechanisms

## Overview

This document defines standard mechanisms for detecting whether specific information exists in ConPort (locally) or needs to be generated, inferred, or requested from the user. Data locality detection is crucial for preventing hallucinations and maintaining clear boundaries between retrieved knowledge and generated knowledge.

## Core Principles

1. **Knowledge Origin Awareness**: All information used by AI modes must be clearly categorized by its origin
2. **Explicit Locality Checking**: Before generating information, check if it exists in ConPort
3. **Transparency**: Clearly communicate the origin of information to users
4. **Hallucination Prevention**: Never present generated knowledge as retrieved facts
5. **Knowledge Gaps Identification**: Identify and explicitly address information gaps

## Knowledge Origin Categories

All information used by AI modes falls into one of these categories:

| Category | Origin | Reliability | Usage Guidelines |
|----------|--------|------------|-----------------|
| Retrieved Knowledge | Directly from ConPort | Highest | Can be presented as factual for the project |
| Inferred Knowledge | Derived from multiple ConPort sources | Medium | Should indicate derivation process |
| Generated Knowledge | Created during current session | Low | Must be clearly marked as new/potential |
| User-Provided Knowledge | Directly from user input | High | Valid for current session |
| External Knowledge | From AI training data | Variable | Must acknowledge potential staleness |

## Data Locality Detection Process

### Standardized Pre-Generation Check

Before generating any significant information, AI modes must:

1. Formulate a specific query defining what information is needed
2. Check if this information exists in ConPort using appropriate tools
3. Determine if the information can be definitively answered from retrieved data
4. If not, determine if it can be reasonably inferred from multiple pieces of retrieved data
5. Only if neither retrieved nor reliably inferred, proceed with generation

### Query Formulation Patterns

```javascript
function formulateLocalityQuery(informationNeed) {
  // Break down complex information needs into atomic queries
  const atomicQueries = decomposeInformationNeed(informationNeed);
  
  // For each atomic query, create appropriate ConPort query
  return atomicQueries.map(query => {
    if (query.type === "fact") {
      return {
        method: "search_custom_data_value_fts",
        params: { query_term: query.keywords.join(" ") }
      };
    } else if (query.type === "decision") {
      return {
        method: "search_decisions_fts",
        params: { query_term: query.keywords.join(" ") }
      };
    } else if (query.type === "pattern") {
      return {
        method: "get_system_patterns", 
        params: { 
          tags_filter_include_any: query.keywords
        }
      };
    } else if (query.type === "semantic") {
      return {
        method: "semantic_search_conport",
        params: { query_text: query.natural_language_query }
      };
    }
  });
}
```

### Locality Detection Algorithm

```javascript
async function detectDataLocality(informationNeed) {
  // Step 1: Formulate queries
  const queries = formulateLocalityQuery(informationNeed);
  
  // Step 2: Execute queries against ConPort
  const results = await Promise.all(queries.map(query => 
    executeConPortQuery(query.method, query.params)
  ));
  
  // Step 3: Evaluate results for direct matches
  const directMatches = results.filter(result => 
    result.confidence && result.confidence > DIRECT_MATCH_THRESHOLD
  );
  
  if (directMatches.length > 0) {
    return {
      locality: "RETRIEVED",
      confidence: computeAverageConfidence(directMatches),
      sources: directMatches.map(match => match.source)
    };
  }
  
  // Step 4: Evaluate results for possible inference
  const inferenceBase = results.filter(result => 
    result.relevance && result.relevance > INFERENCE_RELEVANCE_THRESHOLD
  );
  
  if (inferenceBase.length >= MINIMUM_INFERENCE_SOURCES) {
    return {
      locality: "INFERRED",
      confidence: computeInferenceConfidence(inferenceBase),
      sources: inferenceBase.map(source => source.reference)
    };
  }
  
  // Step 5: No locality detected - knowledge must be generated
  return {
    locality: "GENERATED",
    confidence: 0,
    sources: []
  };
}
```

## Knowledge Source Attribution System

All information presented to users must include clear source attribution:

### Retrieved Knowledge Attribution

```
According to [ConPort Decision #42], the team decided to use React for the frontend because of its component reusability and large ecosystem.
```

### Inferred Knowledge Attribution

```
Based on several related ConPort entries [System Pattern #7, Decision #23, Progress #35], I can infer that the authentication system uses JWT tokens with a refresh token pattern.
```

### Generated Knowledge Attribution

```
I don't have specific information about this in ConPort. My suggestion (which is not based on existing project knowledge) would be to consider using GraphQL for this API.
```

## Implementation Guidelines

### Required Components in All Modes

The following components must be implemented in all modes:

1. **Pre-Response Locality Check**: Before providing substantive information, check its locality
2. **Source Attribution**: Always attribute information to its origin category
3. **Information Confidence Indicators**: Indicate confidence level in information presented
4. **Locality Transition Markers**: Clearly mark transitions between information of different origins

### Integration with Templates

Add the following section to all mode templates:

```yaml
# Locality-Aware Knowledge Operations
- Before generating information, ALWAYS query ConPort first
- For each key operation, determine if required knowledge exists in ConPort
- Create explicit distinction between retrieved knowledge, inferred knowledge, and generated knowledge
- Never present generated knowledge as fact without verification
```

## Reference Implementation

### Locality Detection Utility

```javascript
class DataLocalityDetector {
  constructor(workspaceId) {
    this.workspaceId = workspaceId;
    this.confidenceThresholds = {
      directMatch: 0.8,
      inference: 0.6,
      minimumInferenceSources: 2
    };
  }
  
  async detectLocality(query, type = "semantic") {
    switch (type) {
      case "semantic":
        return this.semanticLocalityCheck(query);
      case "factual":
        return this.factualLocalityCheck(query);
      case "decision":
        return this.decisionLocalityCheck(query);
      case "pattern":
        return this.patternLocalityCheck(query);
      default:
        throw new Error(`Unsupported locality check type: ${type}`);
    }
  }
  
  async semanticLocalityCheck(query) {
    try {
      const results = await this.callMcpTool("semantic_search_conport", {
        workspace_id: this.workspaceId,
        query_text: query,
        top_k: 5
      });
      
      return this.evaluateLocalityResults(results);
    } catch (error) {
      return this.generateFallbackLocality();
    }
  }
  
  async factualLocalityCheck(query) {
    try {
      const results = await this.callMcpTool("search_custom_data_value_fts", {
        workspace_id: this.workspaceId,
        query_term: query,
        limit: 5
      });
      
      return this.evaluateLocalityResults(results);
    } catch (error) {
      return this.generateFallbackLocality();
    }
  }
  
  async decisionLocalityCheck(query) {
    try {
      const results = await this.callMcpTool("search_decisions_fts", {
        workspace_id: this.workspaceId,
        query_term: query,
        limit: 5
      });
      
      return this.evaluateLocalityResults(results);
    } catch (error) {
      return this.generateFallbackLocality();
    }
  }
  
  async patternLocalityCheck(query) {
    try {
      // Split query into potential tags
      const tags = query.split(/\s+/).filter(tag => tag.length > 3);
      
      const results = await this.callMcpTool("get_system_patterns", {
        workspace_id: this.workspaceId,
        tags_filter_include_any: tags
      });
      
      return this.evaluateLocalityResults(results);
    } catch (error) {
      return this.generateFallbackLocality();
    }
  }
  
  evaluateLocalityResults(results) {
    if (!results || results.length === 0) {
      return {
        locality: "GENERATED",
        confidence: 0,
        sources: []
      };
    }
    
    // Check for direct matches
    const directMatches = results.filter(result => 
      result.score && result.score > this.confidenceThresholds.directMatch
    );
    
    if (directMatches.length > 0) {
      return {
        locality: "RETRIEVED",
        confidence: this.computeAverageConfidence(directMatches),
        sources: directMatches.map(match => this.formatSource(match))
      };
    }
    
    // Check for possible inference base
    const inferenceBase = results.filter(result => 
      result.score && result.score > this.confidenceThresholds.inference
    );
    
    if (inferenceBase.length >= this.confidenceThresholds.minimumInferenceSources) {
      return {
        locality: "INFERRED",
        confidence: this.computeInferenceConfidence(inferenceBase),
        sources: inferenceBase.map(source => this.formatSource(source))
      };
    }
    
    // No locality detected
    return {
      locality: "GENERATED",
      confidence: 0,
      sources: []
    };
  }
  
  computeAverageConfidence(matches) {
    return matches.reduce((sum, match) => sum + match.score, 0) / matches.length;
  }
  
  computeInferenceConfidence(sources) {
    // Inference confidence is lower than direct matches
    // and decreases as the number of sources increases (more complex inference)
    const baseConfidence = sources.reduce((sum, source) => sum + source.score, 0) / sources.length;
    return baseConfidence * (0.8 - (Math.min(sources.length - 2, 3) * 0.05));
  }
  
  formatSource(result) {
    if (result.id && result.type) {
      return `${result.type}#${result.id}`;
    } else if (result.id) {
      return `item#${result.id}`;
    } else {
      return "unknown";
    }
  }
  
  generateFallbackLocality() {
    return {
      locality: "GENERATED",
      confidence: 0,
      sources: [],
      error: "Failed to check locality"
    };
  }
  
  // Mock MCP tool call for reference implementation
  async callMcpTool(toolName, args) {
    // This would be replaced with actual MCP tool call
    console.log(`Calling ${toolName} with args:`, args);
    return []; // Mock empty results
  }
}
```

### Usage Examples

```javascript
// Example 1: Checking locality for technical information
const localityDetector = new DataLocalityDetector("/path/to/workspace");
const query = "What authentication system is used in the project?";

const result = await localityDetector.detectLocality(query);

if (result.locality === "RETRIEVED") {
  console.log(`According to ConPort (${result.sources.join(", ")}), the project uses...`);
} else if (result.locality === "INFERRED") {
  console.log(`Based on several ConPort entries (${result.sources.join(", ")}), I can infer that...`);
} else {
  console.log("I don't have specific information about this in ConPort. My suggestion would be...");
}

// Example 2: Checking locality for a decision
const decisionQuery = "Why did we choose React for the frontend?";
const decisionResult = await localityDetector.detectLocality(decisionQuery, "decision");

if (decisionResult.locality === "RETRIEVED") {
  console.log(`According to ${decisionResult.sources[0]}, React was chosen because...`);
} else {
  console.log("I don't have information about this decision in ConPort.");
}
```

## Response Formatting Guidelines

### Standard Knowledge Origin Prefixing

All substantive information in responses should be prefixed with its origin:

1. **[RETRIEVED]**: For directly retrieved information
2. **[INFERRED]**: For information derived from multiple sources
3. **[SUGGESTION]**: For generated information not backed by ConPort data
4. **[USER-PROVIDED]**: For information provided by the user in the current session

### Mixed Origin Response Example

```
You asked about the project's authentication approach.

[RETRIEVED] According to Decision #15, the project uses JWT tokens for authentication with a 15-minute expiration time.

[INFERRED] Based on System Pattern #3 and Progress #28, I believe the refresh token mechanism uses HttpOnly cookies for security.

[SUGGESTION] While not documented in ConPort, you might also want to consider implementing rate limiting to prevent brute force attacks.

[USER-PROVIDED] As you mentioned earlier, you're planning to add multi-factor authentication next sprint.
```

## Expected Benefits

Implementing data locality detection will:

1. **Reduce Hallucinations**: By clearly distinguishing between retrieved and generated knowledge
2. **Increase User Trust**: Through transparent attribution of information sources
3. **Improve Knowledge Building**: By identifying gaps that need documentation
4. **Enhance Cognitive Continuity**: By prioritizing existing project knowledge

## Integration with Other ConPort Patterns

Data Locality Detection integrates with:

1. **Knowledge-First Initialization**: Provides the baseline context for locality checking
2. **Unified Context Refresh Protocol**: Ensures locality checks use up-to-date information 
3. **Progressive Knowledge Capture**: Identifies knowledge gaps for documentation