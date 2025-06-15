/**
 * Prompt Enhancer Isolated Knowledge-First Module
 * 
 * Provides specialized knowledge management capabilities for prompt enhancement
 * tasks in isolation from project-specific context, focusing on universal
 * disambiguation patterns, generic prompt templates, and standard enhancement
 * techniques.
 */

/**
 * Knowledge-first implementation for Prompt Enhancer Isolated Mode
 * 
 * Unlike the regular Prompt Enhancer Knowledge-First module, this implementation
 * operates in isolation from project-specific knowledge. It uses only universal
 * best practices and generic templates without project influence.
 */
class PromptEnhancerIsolatedKnowledgeFirst {
  /**
   * Constructor for PromptEnhancerIsolatedKnowledgeFirst
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.mode = 'prompt-enhancer-isolated';
    
    // Default templates
    this.defaultTemplates = {
      basic: `**Context:**
[General domain and type of task]

**Task:**
[Specific action with clear success criteria]

**Requirements:**
1. [Technical constraint 1]
2. [Technical constraint 2]
3. [Input/output spec]

**Acceptance Criteria:**
1. [Test/example 1]
2. [Success metric 1]

**Implementation Notes:**
[Best practices, general approaches]`,
      
      technical: `**Environment:**
- Programming Language: [language]
- Frameworks: [frameworks]
- Libraries: [libraries]
- Tools: [tools]

**Task Definition:**
[Detailed description of the technical task]

**Technical Requirements:**
1. [Specific technical requirement 1]
2. [Specific technical requirement 2]
3. [Performance constraints]
4. [Security considerations]

**API/Interface Specifications:**
\`\`\`
[Interface definition, method signatures, data structures]
\`\`\`

**Expected Behavior:**
- [Behavior 1]
- [Behavior 2]
- [Edge case handling]

**Technical Constraints:**
- [Constraint 1]
- [Constraint 2]

**Testing Criteria:**
- [Test scenario 1]
- [Test scenario 2]`,
      
      ui: `**UI Component Requirements:**

**Visual Design:**
- Style: [design system/style guide]
- Colors: [color palette]
- Typography: [font specifications]
- Responsive Behavior: [breakpoints and adaptations]

**Functionality:**
- User Interactions: [detailed interactions]
- State Management: [states and transitions]
- Accessibility: [WCAG requirements]

**Technical Implementation:**
- Framework: [UI framework]
- Component Architecture: [component hierarchy]
- Props/API: [component interface]
- Event Handling: [events and handlers]

**Examples:**
\`\`\`
[Code example or mockup]
\`\`\`

**Acceptance Criteria:**
1. [Visual criteria]
2. [Functional criteria]
3. [Performance criteria]
4. [Accessibility criteria]`
    };
    
    // Default disambiguation patterns
    this.defaultDisambiguationPatterns = [
      {
        id: 'content-indicators',
        name: 'Content Indicators',
        description: 'Patterns that indicate prompt content',
        patterns: [
          { indicator: 'create', confidence: 0.9, type: 'verb' },
          { indicator: 'build', confidence: 0.9, type: 'verb' },
          { indicator: 'implement', confidence: 0.9, type: 'verb' },
          { indicator: 'develop', confidence: 0.9, type: 'verb' },
          { indicator: 'design', confidence: 0.85, type: 'verb' },
          { indicator: 'write', confidence: 0.9, type: 'verb' },
          { indicator: 'code', confidence: 0.9, type: 'verb' },
          { indicator: 'fix', confidence: 0.85, type: 'verb' },
          { indicator: 'improve', confidence: 0.8, type: 'verb' },
          { indicator: 'optimize', confidence: 0.85, type: 'verb' },
          { indicator: 'refactor', confidence: 0.85, type: 'verb' },
          { indicator: 'api', confidence: 0.7, type: 'noun' },
          { indicator: 'function', confidence: 0.7, type: 'noun' },
          { indicator: 'component', confidence: 0.7, type: 'noun' },
          { indicator: 'application', confidence: 0.7, type: 'noun' },
          { indicator: 'website', confidence: 0.7, type: 'noun' },
          { indicator: 'database', confidence: 0.7, type: 'noun' },
          { indicator: 'algorithm', confidence: 0.7, type: 'noun' }
        ]
      },
      {
        id: 'meta-instruction-indicators',
        name: 'Meta-Instruction Indicators',
        description: 'Patterns that indicate meta-instructions',
        patterns: [
          { indicator: 'enhance this prompt', confidence: 0.95, type: 'instruction' },
          { indicator: 'improve this prompt', confidence: 0.95, type: 'instruction' },
          { indicator: 'make this prompt better', confidence: 0.9, type: 'instruction' },
          { indicator: 'clarify this prompt', confidence: 0.9, type: 'instruction' },
          { indicator: 'restructure this prompt', confidence: 0.9, type: 'instruction' },
          { indicator: 'use template', confidence: 0.85, type: 'instruction' },
          { indicator: 'with confidence', confidence: 0.8, type: 'parameter' },
          { indicator: 'apply pattern', confidence: 0.85, type: 'instruction' },
          { indicator: 'in isolation mode', confidence: 0.95, type: 'instruction' },
          { indicator: 'without project context', confidence: 0.95, type: 'instruction' },
          { indicator: 'using universal', confidence: 0.9, type: 'instruction' },
          { indicator: 'with generic', confidence: 0.9, type: 'instruction' }
        ]
      },
      {
        id: 'ambiguity-indicators',
        name: 'Ambiguity Indicators',
        description: 'Patterns that indicate ambiguity in the prompt',
        patterns: [
          { indicator: 'use', confidence: 0.3, type: 'ambiguous' },
          { indicator: 'with', confidence: 0.3, type: 'ambiguous' },
          { indicator: 'using', confidence: 0.3, type: 'ambiguous' },
          { indicator: 'apply', confidence: 0.4, type: 'ambiguous' },
          { indicator: 'make', confidence: 0.4, type: 'ambiguous' },
          { indicator: 'do', confidence: 0.3, type: 'ambiguous' },
          { indicator: 'help', confidence: 0.5, type: 'ambiguous' },
          { indicator: 'need', confidence: 0.4, type: 'ambiguous' },
          { indicator: 'want', confidence: 0.4, type: 'ambiguous' },
          { indicator: 'please', confidence: 0.5, type: 'ambiguous' }
        ]
      }
    ];
    
    // Default enhancement techniques
    this.defaultEnhancementTechniques = [
      {
        id: 'context-enhancement',
        name: 'Context Enhancement',
        description: 'Add universal context to make the prompt more specific',
        procedure: [
          'Identify the general domain/application type',
          'Add relevant technical environment details',
          'Specify the type of technology or approach',
          'Include general domain considerations'
        ],
        examples: [
          {
            before: 'Create a login form',
            after: '**Context:** You are creating a web application component that handles user authentication.\n\n**Task:** Create a login form component that handles user authentication with proper security measures.'
          }
        ]
      },
      {
        id: 'requirement-decomposition',
        name: 'Requirement Decomposition',
        description: 'Break down vague requirements into specific, testable criteria',
        procedure: [
          'Identify the main requirement',
          'Break it down into specific sub-requirements',
          'Make each requirement measurable/testable',
          'Organize requirements logically'
        ],
        examples: [
          {
            before: 'Make the website responsive',
            after: '**Requirements:**\n1. Site must be fully functional on devices with screen widths from 320px to 1920px\n2. Text must remain readable (minimum 16px for body text)\n3. Navigation must transform into a hamburger menu below 768px width\n4. Touch targets must be at least 44x44px on mobile devices\n5. Forms must adjust layout to single column on mobile'
          }
        ]
      },
      {
        id: 'success-criteria-definition',
        name: 'Success Criteria Definition',
        description: 'Add clear success metrics and acceptance criteria',
        procedure: [
          'Define functional success criteria',
          'Define non-functional success criteria (performance, security, etc.)',
          'Include test cases or validation methods',
          'Specify edge cases that must be handled'
        ],
        examples: [
          {
            before: 'Create a data processing function',
            after: '**Task:** Create a data processing function\n\n**Acceptance Criteria:**\n1. Function processes 10,000 records in under 500ms\n2. Memory usage stays below 100MB during processing\n3. Invalid inputs are handled gracefully with appropriate error messages\n4. Edge cases handled: empty input, malformed data, duplicate records\n5. Unit tests achieve 90%+ coverage'
          }
        ]
      },
      {
        id: 'technical-specificity',
        name: 'Technical Specificity Enhancement',
        description: 'Add technical details and specifications',
        procedure: [
          'Specify programming languages, frameworks, libraries',
          'Include version numbers when relevant',
          'Add specific technical constraints',
          'Include code examples or interfaces when helpful'
        ],
        examples: [
          {
            before: 'Create an API endpoint',
            after: '**Technical Specifications:**\n- Node.js with Express.js\n- Endpoint: POST /api/v1/users\n- Request body must validate against this JSON Schema:\n```json\n{\n  "type": "object",\n  "required": ["username", "email", "password"],\n  "properties": {\n    "username": { "type": "string", "minLength": 3 },\n    "email": { "type": "string", "format": "email" },\n    "password": { "type": "string", "minLength": 8 }\n  }\n}\n```\n- Must return 201 on success with Location header'
          }
        ]
      },
      {
        id: 'structured-formatting',
        name: 'Structured Formatting',
        description: 'Reorganize the prompt into a clear, structured format',
        procedure: [
          'Add clear section headings',
          'Use numbered or bulleted lists for multiple items',
          'Group related requirements together',
          'Use code blocks for code examples or technical specifications'
        ],
        examples: [
          {
            before: 'I need a script that processes CSV files and extracts specific columns then formats them as JSON. It should handle errors and large files efficiently.',
            after: '**Task: CSV Processing Script**\n\n**Functionality:**\n1. Read CSV files from a specified directory\n2. Extract columns based on configurable headers\n3. Transform extracted data to JSON format\n4. Write output to specified destination\n\n**Technical Requirements:**\n- Support for files up to 1GB in size\n- Memory-efficient streaming processing\n- Proper error handling for malformed CSV files\n\n**Input/Output Specification:**\n- Input: CSV files with headers in first row\n- Output: JSON files with array of objects\n- Configuration via YAML file (specify input/output paths and column mappings)\n\n**Error Handling:**\n- Log detailed errors to separate log file\n- Continue processing on non-critical errors\n- Summary report of successful/failed files'
          }
        ]
      }
    ];
  }
  
  /**
   * Initialize the knowledge-first module
   * @returns {Promise<Object>} - Initialization result
   */
  async initialize() {
    try {
      console.log('Initializing Prompt Enhancer Isolated Knowledge-First module');
      
      return {
        status: 'success',
        message: 'Prompt Enhancer Isolated Knowledge-First module initialized successfully'
      };
    } catch (error) {
      console.error('Failed to initialize Prompt Enhancer Isolated Knowledge-First module:', error);
      
      return {
        status: 'error',
        message: 'Failed to initialize Prompt Enhancer Isolated Knowledge-First module',
        error: error.message
      };
    }
  }
  
  /**
   * Perform prompt disambiguation
   * @param {string} originalPrompt - The original prompt
   * @returns {Promise<Object>} - Disambiguation result
   */
  async disambiguatePrompt(originalPrompt) {
    try {
      // Get disambiguation patterns
      const disambiguationPatterns = this.defaultDisambiguationPatterns;
      
      // Tokenize the prompt (simple word-based tokenization)
      const words = originalPrompt.split(/\s+/);
      const segments = [];
      
      // Process each word against patterns
      let currentSegment = { type: null, text: '', words: [], confidence: 0, confidenceScores: [] };
      
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        let highestConfidence = 0;
        let segmentType = null;
        
        // Check content indicators
        const contentIndicators = disambiguationPatterns.find(p => p.id === 'content-indicators');
        if (contentIndicators) {
          for (const pattern of contentIndicators.patterns) {
            if (word.toLowerCase().includes(pattern.indicator.toLowerCase())) {
              const confidence = pattern.confidence;
              if (confidence > highestConfidence) {
                highestConfidence = confidence;
                segmentType = 'content';
              }
            }
          }
        }
        
        // Check meta-instruction indicators
        const metaIndicators = disambiguationPatterns.find(p => p.id === 'meta-instruction-indicators');
        if (metaIndicators) {
          // Check for multi-word patterns
          for (const pattern of metaIndicators.patterns) {
            const patternWords = pattern.indicator.toLowerCase().split(/\s+/);
            if (patternWords.length > 1) {
              // Check if the next words match the pattern
              let matches = true;
              for (let j = 0; j < patternWords.length; j++) {
                if (i + j >= words.length || !words[i + j].toLowerCase().includes(patternWords[j])) {
                  matches = false;
                  break;
                }
              }
              
              if (matches) {
                const confidence = pattern.confidence;
                if (confidence > highestConfidence) {
                  highestConfidence = confidence;
                  segmentType = 'meta-instruction';
                  
                  // Skip the words that are part of this pattern
                  i += patternWords.length - 1;
                  break;
                }
              }
            } else if (word.toLowerCase().includes(pattern.indicator.toLowerCase())) {
              const confidence = pattern.confidence;
              if (confidence > highestConfidence) {
                highestConfidence = confidence;
                segmentType = 'meta-instruction';
              }
            }
          }
        }
        
        // Check ambiguity indicators
        const ambiguityIndicators = disambiguationPatterns.find(p => p.id === 'ambiguity-indicators');
        if (ambiguityIndicators && highestConfidence === 0) {
          for (const pattern of ambiguityIndicators.patterns) {
            if (word.toLowerCase() === pattern.indicator.toLowerCase()) {
              // Ambiguity indicators have lower confidence
              const confidence = pattern.confidence;
              if (confidence > highestConfidence) {
                highestConfidence = confidence;
                segmentType = 'ambiguous';
              }
            }
          }
        }
        
        // Default to content if no match found
        if (highestConfidence === 0) {
          highestConfidence = 0.6; // Default confidence
          segmentType = 'content'; // Default type
        }
        
        // If segment type changes or this is an ambiguous segment, start a new segment
        if (currentSegment.type !== segmentType || segmentType === 'ambiguous') {
          if (currentSegment.text.trim() !== '') {
            // Calculate average confidence for the current segment
            const avgConfidence = currentSegment.confidenceScores.length > 0
              ? currentSegment.confidenceScores.reduce((sum, score) => sum + score, 0) / currentSegment.confidenceScores.length
              : 0;
            
            segments.push({
              ...currentSegment,
              text: currentSegment.text.trim(),
              confidence: avgConfidence
            });
          }
          
          currentSegment = {
            type: segmentType,
            text: word,
            words: [word],
            confidence: highestConfidence,
            confidenceScores: [highestConfidence]
          };
        } else {
          // Continue current segment
          currentSegment.text += ' ' + word;
          currentSegment.words.push(word);
          currentSegment.confidenceScores.push(highestConfidence);
        }
      }
      
      // Add the last segment
      if (currentSegment.text.trim() !== '') {
        const avgConfidence = currentSegment.confidenceScores.length > 0
          ? currentSegment.confidenceScores.reduce((sum, score) => sum + score, 0) / currentSegment.confidenceScores.length
          : 0;
        
        segments.push({
          ...currentSegment,
          text: currentSegment.text.trim(),
          confidence: avgConfidence
        });
      }
      
      // Group segments by type
      const contentSegments = segments.filter(s => s.type === 'content');
      const metaInstructionSegments = segments.filter(s => s.type === 'meta-instruction');
      const ambiguousSegments = segments.filter(s => s.type === 'ambiguous');
      
      // Identify segments requiring clarification (confidence < 0.8)
      const lowConfidenceSegments = segments.filter(s => s.confidence < 0.8);
      
      // Generate clarification requests if needed
      let clarificationRequests = null;
      if (lowConfidenceSegments.length > 0) {
        clarificationRequests = lowConfidenceSegments.map(segment => ({
          segment: segment.text,
          type: segment.type,
          confidence: segment.confidence,
          clarificationQuestion: `I'm ${Math.round(segment.confidence * 100)}% confident that "${segment.text}" is ${segment.type === 'content' ? 'content to enhance' : 'a meta-instruction for me'}. Is this correct?`
        }));
      }
      
      return {
        originalPrompt,
        segments,
        contentSegments,
        metaInstructionSegments,
        ambiguousSegments,
        lowConfidenceSegments,
        clarificationRequests,
        overallConfidence: segments.reduce((sum, s) => sum + s.confidence, 0) / segments.length
      };
    } catch (error) {
      console.error('Failed to disambiguate prompt:', error);
      
      // Return basic disambiguation with error
      return {
        originalPrompt,
        segments: [{ type: 'content', text: originalPrompt, confidence: 0.5 }],
        contentSegments: [{ type: 'content', text: originalPrompt, confidence: 0.5 }],
        metaInstructionSegments: [],
        ambiguousSegments: [],
        lowConfidenceSegments: [{ type: 'content', text: originalPrompt, confidence: 0.5 }],
        clarificationRequests: [{
          segment: originalPrompt,
          type: 'content',
          confidence: 0.5,
          clarificationQuestion: 'I encountered an error during disambiguation. Should I treat this entire text as content to enhance?'
        }],
        overallConfidence: 0.5,
        error: error.message
      };
    }
  }
  
  /**
   * Enhance a prompt using appropriate techniques
   * @param {string} originalPrompt - The original prompt
   * @param {Object} disambiguationResult - Disambiguation result
   * @param {Object} options - Enhancement options
   * @returns {Promise<Object>} - Enhancement result
   */
  async enhancePrompt(originalPrompt, disambiguationResult, options = {}) {
    try {
      // Extract content to enhance
      let contentToEnhance = '';
      if (disambiguationResult && disambiguationResult.contentSegments) {
        contentToEnhance = disambiguationResult.contentSegments
          .map(segment => segment.text)
          .join(' ');
      } else {
        contentToEnhance = originalPrompt;
      }
      
      // Determine the domain or task type from the content
      const domainInfo = this._determineDomain(contentToEnhance);
      
      // Select appropriate template based on domain
      const templateKey = options.templateKey || domainInfo.templateKey || 'basic';
      const selectedTemplate = this.defaultTemplates[templateKey];
      
      // Apply enhancement techniques
      const enhancedContent = await this._applyEnhancementTechniques(
        contentToEnhance,
        this.defaultEnhancementTechniques,
        domainInfo
      );
      
      // Apply template structure
      const enhancedPrompt = this._applyTemplate(enhancedContent, selectedTemplate, domainInfo);
      
      return {
        originalPrompt,
        enhancedPrompt,
        domain: domainInfo.domain,
        templateUsed: templateKey,
        techniquesApplied: domainInfo.techniquesToApply
      };
    } catch (error) {
      console.error('Failed to enhance prompt:', error);
      
      // Return simple enhancement with error
      return {
        originalPrompt,
        enhancedPrompt: this._applyBasicEnhancement(originalPrompt),
        domain: 'unknown',
        templateUsed: 'basic',
        techniquesApplied: ['basic-enhancement'],
        error: error.message
      };
    }
  }
  
  /**
   * Determine the domain or task type from the content
   * @param {string} content - The content to analyze
   * @returns {Object} - Domain information
   * @private
   */
  _determineDomain(content) {
    const lowerContent = content.toLowerCase();
    
    // Check for UI/frontend indicators
    const uiIndicators = [
      'ui', 'interface', 'component', 'css', 'html', 'styling', 'responsive',
      'design', 'layout', 'web page', 'website', 'front-end', 'frontend'
    ];
    
    // Check for backend/API indicators
    const backendIndicators = [
      'api', 'endpoint', 'server', 'database', 'backend', 'back-end',
      'service', 'microservice', 'function', 'route', 'controller'
    ];
    
    // Check for data processing indicators
    const dataIndicators = [
      'data', 'processing', 'analytics', 'algorithm', 'model', 'machine learning',
      'ml', 'ai', 'dataset', 'pipeline', 'transformation', 'etl'
    ];
    
    // Count matches for each domain
    let uiCount = 0;
    let backendCount = 0;
    let dataCount = 0;
    
    uiIndicators.forEach(indicator => {
      if (lowerContent.includes(indicator)) uiCount++;
    });
    
    backendIndicators.forEach(indicator => {
      if (lowerContent.includes(indicator)) backendCount++;
    });
    
    dataIndicators.forEach(indicator => {
      if (lowerContent.includes(indicator)) dataCount++;
    });
    
    // Determine domain based on highest count
    let domain = 'general';
    let templateKey = 'basic';
    
    if (uiCount > backendCount && uiCount > dataCount) {
      domain = 'ui';
      templateKey = 'ui';
    } else if (backendCount > uiCount && backendCount > dataCount) {
      domain = 'backend';
      templateKey = 'technical';
    } else if (dataCount > uiCount && dataCount > backendCount) {
      domain = 'data';
      templateKey = 'technical';
    }
    
    // Determine techniques to apply based on domain
    const techniquesToApply = ['structured-formatting', 'success-criteria-definition'];
    
    if (domain === 'ui') {
      techniquesToApply.push('technical-specificity');
    } else if (domain === 'backend') {
      techniquesToApply.push('technical-specificity');
      techniquesToApply.push('requirement-decomposition');
    } else if (domain === 'data') {
      techniquesToApply.push('technical-specificity');
      techniquesToApply.push('requirement-decomposition');
    }
    
    // Always add context enhancement
    techniquesToApply.push('context-enhancement');
    
    return {
      domain,
      templateKey,
      techniquesToApply
    };
  }
  
  /**
   * Apply enhancement techniques to the prompt content
   * @param {string} content - The content to enhance
   * @param {Array} techniques - Available enhancement techniques
   * @param {Object} domainInfo - Domain information
   * @returns {Promise<Object>} - Enhanced content parts
   * @private
   */
  async _applyEnhancementTechniques(content, techniques, domainInfo) {
    // Initialize enhanced content parts
    const enhancedParts = {
      context: '',
      task: content.trim(), // Default task is the original content
      requirements: [],
      acceptanceCriteria: [],
      implementationNotes: []
    };
    
    // Apply specific techniques based on domain
    for (const techniqueId of domainInfo.techniquesToApply) {
      const technique = techniques.find(t => t.id === techniqueId);
      if (!technique) continue;
      
      switch (techniqueId) {
        case 'context-enhancement':
          enhancedParts.context = this._enhanceUniversalContext(content, domainInfo);
          break;
        
        case 'requirement-decomposition':
          enhancedParts.requirements = this._decomposeRequirements(content, domainInfo);
          break;
        
        case 'success-criteria-definition':
          enhancedParts.acceptanceCriteria = this._defineSuccessCriteria(content, domainInfo);
          break;
        
        case 'technical-specificity':
          const technicalDetails = this._enhanceUniversalTechnicalSpecificity(content, domainInfo);
          enhancedParts.implementationNotes = technicalDetails.implementationNotes;
          // Add technical requirements to requirements list
          if (technicalDetails.technicalRequirements && technicalDetails.technicalRequirements.length > 0) {
            enhancedParts.requirements = [
              ...enhancedParts.requirements,
              ...technicalDetails.technicalRequirements
            ];
          }
          break;
      }
    }
    
    return enhancedParts;
  }
  
  /**
   * Enhance universal context (not project-specific)
   * @param {string} content - The original content
   * @param {Object} domainInfo - Domain information
   * @returns {string} - Enhanced context
   * @private
   */
  _enhanceUniversalContext(content, domainInfo) {
    // Build context based on domain
    let context = '';
    
    // Domain-specific universal context
    switch (domainInfo.domain) {
      case 'ui':
        context = 'You are working on a user interface component that needs to be intuitive, accessible, and responsive across different device sizes.\n\n';
        break;
      case 'backend':
        context = 'You are working on a backend service that requires robustness, security, and good performance characteristics.\n\n';
        break;
      case 'data':
        context = 'You are working on a data processing component that must handle varying data volumes efficiently while maintaining data integrity.\n\n';
        break;
      default:
        context = 'You are working on a software development task that should follow industry best practices and standard conventions.\n\n';
    }
    
    // Add universal environment information based on detected domain
    if (domainInfo.domain === 'ui') {
      context += 'Environment: Modern web browsers with standard HTML5, CSS3, and JavaScript support.\n';
    } else if (domainInfo.domain === 'backend') {
      context += 'Environment: Server infrastructure with standard security and scaling requirements.\n';
    } else if (domainInfo.domain === 'data') {
      context += 'Environment: Data processing system with standard reliability and integrity requirements.\n';
    }
    
    return context.trim();
  }
  
  /**
   * Decompose requirements from content
   * @param {string} content - The original content
   * @param {Object} domainInfo - Domain information
   * @returns {Array} - Decomposed requirements
   * @private
   */
  _decomposeRequirements(content, domainInfo) {
    // Extract potential requirements from content
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Identify sentences that likely contain requirements
    const requirementIndicators = [
      'must', 'should', 'need', 'require', 'support', 'handle',
      'implement', 'include', 'provide', 'ensure', 'allow'
    ];
    
    const potentialRequirements = sentences.filter(sentence => {
      const lowerSentence = sentence.toLowerCase();
      return requirementIndicators.some(indicator => lowerSentence.includes(indicator));
    });
    
    // If no potential requirements found, create basic requirements based on domain
    if (potentialRequirements.length === 0) {
      switch (domainInfo.domain) {
        case 'ui':
          return [
            'Interface must follow standard design principles',
            'UI must be responsive and work on all standard screen sizes',
            'All interactive elements must have appropriate hover/focus states',
            'Component must be accessible according to WCAG 2.1 AA standards'
          ];
        
        case 'backend':
          return [
            'API must follow RESTful design principles',
            'All endpoints must include proper error handling',
            'Responses must follow standard API response formats',
            'Input validation must be implemented for all parameters',
            'Authentication and authorization must be properly enforced'
          ];
        
        case 'data':
          return [
            'Solution must handle the expected data volume efficiently',
            'Data processing must maintain data integrity',
            'Error handling must include proper logging and recovery',
            'Performance must meet specified processing time requirements',
            'Output data must conform to the specified schema'
          ];
        
        default:
          return [
            'Solution must satisfy all functional requirements',
            'Code must follow standard coding practices and conventions',
            'Implementation must include appropriate error handling',
            'Documentation must be provided for main functionality'
          ];
      }
    }
    
    // Clean up and format requirements
    return potentialRequirements.map(req => req.trim());
  }
  
  /**
   * Define success criteria based on content
   * @param {string} content - The original content
   * @param {Object} domainInfo - Domain information
   * @returns {Array} - Success criteria
   * @private
   */
  _defineSuccessCriteria(content, domainInfo) {
    // Define basic success criteria based on domain
    const domainCriteria = {
      ui: [
        'UI renders correctly across all standard browsers and devices',
        'All interactive elements function as expected',
        'Component meets accessibility standards',
        'Design follows consistent visual language'
      ],
      
      backend: [
        'All API endpoints return expected responses for valid inputs',
        'Error responses include appropriate status codes and messages',
        'Performance meets standard response time requirements',
        'Authentication and authorization work as expected'
      ],
      
      data: [
        'Data processing completes within acceptable time constraints',
        'Output data meets specified format and quality requirements',
        'Solution handles edge cases (empty data, malformed input, etc.)',
        'Error conditions are properly logged and handled'
      ],
      
      general: [
        'Solution meets all specified functional requirements',
        'Code passes all standard tests',
        'Implementation follows standard coding practices',
        'Documentation is complete and accurate'
      ]
    };
    
    // Get base criteria for domain
    const baseCriteria = domainCriteria[domainInfo.domain] || domainCriteria.general;
    
    // Extract any explicit success criteria from the content
    const successPatterns = [
      /should (?:return|produce|output|display|show|ensure) (.+?)[.!?]/i,
      /expected (?:output|result|outcome|behavior) (?:is|are|should be) (.+?)[.!?]/i,
      /success (?:means|is defined as|will be) (.+?)[.!?]/i,
      /(?:test|verify|validate) (?:that|if|whether) (.+?)[.!?]/i
    ];
    
    const extractedCriteria = [];
    
    for (const pattern of successPatterns) {
      const matches = content.match(pattern);
      if (matches && matches[1]) {
        extractedCriteria.push(matches[1].trim());
      }
    }
    
    // Combine extracted and base criteria, removing duplicates
    const allCriteria = [...extractedCriteria];
    
    for (const criterion of baseCriteria) {
      if (!extractedCriteria.some(c => c.toLowerCase().includes(criterion.toLowerCase().substring(0, 15)))) {
        allCriteria.push(criterion);
      }
    }
    
    return allCriteria;
  }
  
  /**
   * Enhance universal technical specificity (not project-specific)
   * @param {string} content - The original content
   * @param {Object} domainInfo - Domain information
   * @returns {Object} - Technical details
   * @private
   */
  _enhanceUniversalTechnicalSpecificity(content, domainInfo) {
    // Extract technical details mentioned in the content
    const techPatterns = {
      languages: /(?:javascript|typescript|python|java|c\+\+|c#|ruby|go|rust|php|swift|kotlin|scala)/gi,
      frameworks: /(?:react|angular|vue|node\.js|express|django|flask|spring|laravel|symfony|rails)/gi,
      databases: /(?:mysql|postgresql|mongodb|cassandra|redis|sqlite|oracle|sql server|dynamodb)/gi,
      cloud: /(?:aws|azure|gcp|google cloud|firebase|heroku|netlify|vercel)/gi
    };
    
    // Extract mentioned technologies
    const extractedTech = {};
    
    for (const [category, pattern] of Object.entries(techPatterns)) {
      const matches = content.match(pattern);
      if (matches) {
        extractedTech[category] = [...new Set(matches)];
      }
    }
    
    // Combine all extracted technologies
    const allTech = [];
    for (const techs of Object.values(extractedTech)) {
      for (const tech of techs) {
        if (!allTech.some(t => t.toLowerCase() === tech.toLowerCase())) {
          allTech.push(tech);
        }
      }
    }
    
    // If no specific technologies detected, suggest common ones for the domain
    if (allTech.length === 0) {
      if (domainInfo.domain === 'ui') {
        allTech.push('HTML5', 'CSS3', 'JavaScript');
      } else if (domainInfo.domain === 'backend') {
        allTech.push('a modern server-side language', 'a standard database');
      } else if (domainInfo.domain === 'data') {
        allTech.push('standard data processing libraries');
      }
    }
    
    // Generate technical requirements based on domain and technologies
    const technicalRequirements = [];
    const implementationNotes = [];
    
    // Add technology-specific requirements
    if (allTech.length > 0) {
      implementationNotes.push(`Use ${allTech.join(', ')}`);
    }
    
    // Add domain-specific technical details (using universal patterns, not project-specific)
    switch (domainInfo.domain) {
      case 'ui':
        if (extractedTech.frameworks && extractedTech.frameworks.some(t => t.toLowerCase().includes('react'))) {
          technicalRequirements.push('Component should use functional React components with hooks');
          technicalRequirements.push('Props should be properly typed');
        } else if (extractedTech.frameworks && extractedTech.frameworks.some(t => t.toLowerCase().includes('angular'))) {
          technicalRequirements.push('Component should follow Angular best practices and lifecycle hooks');
        } else if (extractedTech.frameworks && extractedTech.frameworks.some(t => t.toLowerCase().includes('vue'))) {
          technicalRequirements.push('Component should follow Vue.js component structure and lifecycle');
        }
        
        implementationNotes.push('Follow responsive design principles');
        implementationNotes.push('Ensure proper component encapsulation');
        implementationNotes.push('Use semantic HTML for accessibility');
        break;
      
      case 'backend':
        implementationNotes.push('Implement proper async/await or Promise-based error handling');
        implementationNotes.push('Follow REST API design best practices');
        implementationNotes.push('Include appropriate error handling with meaningful error messages');
        break;
      
      case 'data':
        implementationNotes.push('Ensure memory-efficient data processing');
        implementationNotes.push('Implement proper error handling for data inconsistencies');
        implementationNotes.push('Include logging for monitoring and debugging');
        implementationNotes.push('Consider performance optimization for large datasets');
        break;
      
      default:
        implementationNotes.push('Follow standard code style and conventions');
        implementationNotes.push('Include appropriate error handling');
        implementationNotes.push('Add comments for complex logic');
        implementationNotes.push('Consider performance and maintainability');
    }
    
    return {
      technicalRequirements,
      implementationNotes
    };
  }
  
  /**
   * Apply template to enhanced content
   * @param {Object} enhancedParts - Enhanced content parts
   * @param {string} template - Template to apply
   * @param {Object} domainInfo - Domain information
   * @returns {string} - Formatted enhanced prompt
   * @private
   */
  _applyTemplate(enhancedParts, template, domainInfo) {
    // Start with the template
    let result = template;
    
    // Replace context placeholder
    if (enhancedParts.context) {
      result = result.replace(/\[(?:General domain and type of task|Context|Background)\]/g, enhancedParts.context);
    } else {
      // Remove context section if no context available
      result = result.replace(/\*\*Context:\*\*\n\[General domain and type of task\]\n\n/g, '');
    }
    
    // Replace task placeholder
    if (enhancedParts.task) {
      result = result.replace(/\[(?:Specific action with clear success criteria|Task|Goal)\]/g, enhancedParts.task);
    }
    
    // Replace requirements placeholders
    const requirementsSection = enhancedParts.requirements.length > 0
      ? enhancedParts.requirements.map((req, i) => `${i + 1}. ${req}`).join('\n')
      : '[No specific requirements identified]';
    
    result = result.replace(/(?:\d+\.\s*\[(?:Technical constraint|requirement|spec)\s*\d*\](?:\n|$))+/g, requirementsSection);
    
    // Replace acceptance criteria placeholders
    const criteriaSection = enhancedParts.acceptanceCriteria.length > 0
      ? enhancedParts.acceptanceCriteria.map((crit, i) => `${i + 1}. ${crit}`).join('\n')
      : '[Success criteria to be determined]';
    
    result = result.replace(/(?:\d+\.\s*\[(?:Test\/example|Success metric)\s*\d*\](?:\n|$))+/g, criteriaSection);
    
    // Replace implementation notes placeholder
    const notesSection = enhancedParts.implementationNotes.length > 0
      ? enhancedParts.implementationNotes.join('\n- ')
      : '[No specific implementation notes]';
    
    result = result.replace(/\[(?:Best practices, general approaches|Implementation notes)\]/g, `- ${notesSection}`);
    
    // Remove any remaining placeholders
    result = result.replace(/\[(.*?)\]/g, '');
    
    // Clean up extra whitespace and line breaks
    result = result.replace(/\n{3,}/g, '\n\n');
    
    return result.trim();
  }
  
  /**
   * Apply basic enhancement to prompt
   * @param {string} prompt - The prompt to enhance
   * @returns {string} - Enhanced prompt
   * @private
   */
  _applyBasicEnhancement(prompt) {
    // Simple structure enhancement for when more advanced techniques fail
    return `**Task:**\n${prompt.trim()}\n\n**Requirements:**\n1. Follow industry best practices\n2. Include proper error handling\n3. Document your solution\n\n**Acceptance Criteria:**\n1. Solution fulfills the specified task\n2. Code is clean and maintainable\n3. Appropriate tests are included`;
  }
}

module.exports = { PromptEnhancerIsolatedKnowledgeFirst };