/**
 * Orchestrator Knowledge-First Component
 * 
 * Implements the knowledge-first capabilities for the Orchestrator Mode,
 * focusing on task decomposition, mode selection, and transition protocols.
 * 
 * This component follows System Pattern #31 (Mode-Specific Knowledge-First Enhancement Pattern)
 * by providing specialized knowledge structures for orchestration tasks.
 */

/**
 * Orchestration templates for common workflows
 */
const ORCHESTRATION_TEMPLATES = {
  'development_workflow': {
    name: 'Software Development Workflow',
    description: 'Template for orchestrating a complete software development workflow',
    steps: [
      { mode: 'architect', task: 'Design the system architecture', outputs: ['architecture_diagram', 'component_interfaces'] },
      { mode: 'code', task: 'Implement the core components', outputs: ['code_modules'] },
      { mode: 'debug', task: 'Test and debug implementation', outputs: ['verified_code'] },
      { mode: 'docs', task: 'Create technical documentation', outputs: ['documentation'] }
    ],
    transitionLogic: [
      { from: 'architect', to: 'code', handoffData: ['component_specifications', 'interfaces', 'dependencies'] },
      { from: 'code', to: 'debug', handoffData: ['implementation_details', 'known_issues', 'test_cases'] },
      { from: 'debug', to: 'docs', handoffData: ['verified_features', 'usage_examples', 'edge_cases'] }
    ]
  },
  'enhancement_workflow': {
    name: 'Feature Enhancement Workflow',
    description: 'Template for orchestrating enhancement of existing functionality',
    steps: [
      { mode: 'ask', task: 'Gather requirements and context', outputs: ['requirements', 'constraints'] },
      { mode: 'architect', task: 'Design the enhancement', outputs: ['design_changes'] },
      { mode: 'code', task: 'Implement the enhancement', outputs: ['updated_code'] },
      { mode: 'debug', task: 'Validate the enhancement', outputs: ['verified_enhancement'] },
      { mode: 'docs', task: 'Update documentation', outputs: ['updated_docs'] }
    ],
    transitionLogic: [
      { from: 'ask', to: 'architect', handoffData: ['requirements', 'constraints', 'user_needs'] },
      { from: 'architect', to: 'code', handoffData: ['design_changes', 'affected_components'] },
      { from: 'code', to: 'debug', handoffData: ['implementation_details', 'test_cases'] },
      { from: 'debug', to: 'docs', handoffData: ['verified_changes', 'new_functionality'] }
    ]
  },
  'prompt_optimization_workflow': {
    name: 'Prompt Optimization Workflow',
    description: 'Template for orchestrating prompt improvement and refinement',
    steps: [
      { mode: 'ask', task: 'Understand the prompt objectives', outputs: ['objectives', 'success_criteria'] },
      { mode: 'prompt-enhancer', task: 'Enhance the prompt structure', outputs: ['enhanced_prompt'] },
      { mode: 'prompt-enhancer-isolated', task: 'Create universal version', outputs: ['universal_prompt'] },
      { mode: 'code', task: 'Implement prompt in application code', outputs: ['implemented_prompt'] }
    ],
    transitionLogic: [
      { from: 'ask', to: 'prompt-enhancer', handoffData: ['objectives', 'context', 'original_prompt'] },
      { from: 'prompt-enhancer', to: 'prompt-enhancer-isolated', handoffData: ['enhanced_prompt', 'enhancement_rationale'] },
      { from: 'prompt-enhancer-isolated', to: 'code', handoffData: ['universal_prompt', 'integration_guidelines'] }
    ]
  },
  'knowledge_management_workflow': {
    name: 'Knowledge Management Workflow',
    description: 'Template for orchestrating knowledge capture and maintenance',
    steps: [
      { mode: 'architect', task: 'Design knowledge structure', outputs: ['knowledge_schema', 'taxonomy'] },
      { mode: 'conport-maintenance', task: 'Configure knowledge database', outputs: ['configured_database'] },
      { mode: 'code', task: 'Implement knowledge integration', outputs: ['integration_code'] },
      { mode: 'docs', task: 'Document knowledge processes', outputs: ['knowledge_docs'] }
    ],
    transitionLogic: [
      { from: 'architect', to: 'conport-maintenance', handoffData: ['knowledge_schema', 'data_model', 'access_patterns'] },
      { from: 'conport-maintenance', to: 'code', handoffData: ['database_interfaces', 'query_patterns'] },
      { from: 'code', to: 'docs', handoffData: ['integration_examples', 'api_references'] }
    ]
  }
};

/**
 * Mode selection heuristics based on task characteristics
 */
const MODE_SELECTION_HEURISTICS = {
  'code': {
    taskIndicators: ['implement', 'code', 'program', 'develop', 'create function', 'build', 'write code'],
    contextualFactors: {
      'implementation_focus': 5,
      'has_clear_requirements': 4,
      'needs_working_solution': 5
    }
  },
  'debug': {
    taskIndicators: ['debug', 'fix', 'error', 'issue', 'not working', 'problem', 'failing test'],
    contextualFactors: {
      'has_existing_code': 5,
      'has_error_symptoms': 5,
      'needs_investigation': 4
    }
  },
  'architect': {
    taskIndicators: ['design', 'architecture', 'structure', 'plan', 'high-level', 'organize', 'system design'],
    contextualFactors: {
      'early_project_stage': 5,
      'complex_system': 4,
      'needs_planning': 5
    }
  },
  'ask': {
    taskIndicators: ['explain', 'how to', 'what is', 'why does', 'concept', 'information about', 'describe'],
    contextualFactors: {
      'needs_information': 5,
      'educational_focus': 4,
      'conceptual_inquiry': 5
    }
  },
  'docs': {
    taskIndicators: ['document', 'documentation', 'write guide', 'explain usage', 'readme', 'manual', 'instructions'],
    contextualFactors: {
      'needs_explanation': 4,
      'has_implemented_feature': 3,
      'documentation_focus': 5
    }
  },
  'prompt-enhancer': {
    taskIndicators: ['improve prompt', 'better prompt', 'optimize prompt', 'refine prompt', 'enhance prompt'],
    contextualFactors: {
      'has_existing_prompt': 5,
      'needs_improvement': 4,
      'project_specific_context': 4
    }
  },
  'prompt-enhancer-isolated': {
    taskIndicators: ['universal prompt', 'generic prompt', 'context-free prompt', 'isolated prompt enhancement'],
    contextualFactors: {
      'needs_portability': 5,
      'universal_application': 4,
      'context_independence': 5
    }
  },
  'conport-maintenance': {
    taskIndicators: ['knowledge base', 'conport', 'database maintenance', 'clean up knowledge', 'organize knowledge'],
    contextualFactors: {
      'knowledge_management_focus': 5,
      'data_organization_need': 4,
      'maintenance_operation': 5
    }
  },
  'orchestrator': {
    taskIndicators: ['coordinate', 'multiple steps', 'workflow', 'process', 'sequence of tasks', 'orchestrate'],
    contextualFactors: {
      'multi_step_process': 5,
      'involves_multiple_modes': 5,
      'needs_coordination': 5
    }
  }
};

/**
 * Task decomposition patterns for different types of objectives
 */
const TASK_DECOMPOSITION_PATTERNS = {
  'feature_development': {
    name: 'Feature Development Pattern',
    steps: [
      'Analyze requirements and constraints',
      'Design the feature architecture',
      'Implement core functionality',
      'Add error handling and edge cases',
      'Write tests',
      'Document usage and APIs'
    ]
  },
  'bug_fixing': {
    name: 'Bug Fixing Pattern',
    steps: [
      'Reproduce the issue',
      'Analyze logs and error messages',
      'Trace through code execution',
      'Identify root cause',
      'Implement fix',
      'Verify fix resolves issue',
      'Add regression test'
    ]
  },
  'documentation_creation': {
    name: 'Documentation Creation Pattern',
    steps: [
      'Identify documentation goals and audience',
      'Gather technical information and examples',
      'Create structure and outline',
      'Write content sections',
      'Add diagrams and examples',
      'Review for accuracy and completeness',
      'Format for readability'
    ]
  },
  'prompt_engineering': {
    name: 'Prompt Engineering Pattern',
    steps: [
      'Analyze current prompt performance',
      'Identify improvement opportunities',
      'Enhance clarity and specificity',
      'Add context and examples',
      'Structure for model comprehension',
      'Test with different inputs',
      'Document effective patterns'
    ]
  },
  'knowledge_base_maintenance': {
    name: 'Knowledge Base Maintenance Pattern',
    steps: [
      'Audit current knowledge entries',
      'Identify gaps and outdated information',
      'Organize knowledge structure',
      'Update information',
      'Add cross-references and links',
      'Validate knowledge integrity',
      'Document maintenance procedures'
    ]
  }
};

/**
 * Transition protocols for mode handoffs
 */
const TRANSITION_PROTOCOLS = {
  'architect_to_code': {
    essentialContext: [
      'architecture_diagram',
      'component_specifications',
      'interfaces',
      'constraints',
      'dependencies',
      'performance_requirements'
    ],
    contextFormat: {
      architecture_overview: 'High-level description of the system architecture',
      component_details: 'Specifications for each component to be implemented',
      interfaces: 'API definitions and communication protocols',
      non_functional_requirements: 'Performance, security, and other constraints'
    },
    handoffChecklist: [
      'Architecture diagram provided',
      'Component interfaces clearly defined',
      'Dependencies and external systems identified',
      'Constraints and requirements specified'
    ]
  },
  'code_to_debug': {
    essentialContext: [
      'implemented_functionality',
      'known_limitations',
      'test_cases',
      'expected_behavior',
      'implementation_details',
      'current_issues'
    ],
    contextFormat: {
      functionality_overview: 'Description of implemented features',
      code_structure: 'Overview of code organization and key files',
      edge_cases: 'Known edge cases and how they\'re handled',
      observed_issues: 'Any issues already identified'
    },
    handoffChecklist: [
      'Implementation details provided',
      'Test cases available',
      'Expected behavior defined',
      'Current issues described'
    ]
  },
  'debug_to_docs': {
    essentialContext: [
      'verified_functionality',
      'usage_examples',
      'edge_cases',
      'limitations',
      'performance_characteristics'
    ],
    contextFormat: {
      features: 'List of verified features',
      usage: 'Examples of usage with inputs and outputs',
      limitations: 'Known limitations and constraints',
      troubleshooting: 'Common issues and their resolutions'
    },
    handoffChecklist: [
      'Functionality verification completed',
      'Usage examples provided',
      'Edge cases and limitations documented',
      'Common issues and resolutions noted'
    ]
  },
  'any_to_ask': {
    essentialContext: [
      'question_topic',
      'background_information',
      'required_detail_level',
      'purpose_of_information'
    ],
    contextFormat: {
      question: 'Clear formulation of the question',
      context: 'Relevant background information',
      purpose: 'How the information will be used'
    },
    handoffChecklist: [
      'Question clearly formulated',
      'Relevant context provided',
      'Purpose of information specified'
    ]
  },
  'any_to_prompt_enhancer': {
    essentialContext: [
      'original_prompt',
      'current_performance',
      'enhancement_goals',
      'application_context'
    ],
    contextFormat: {
      prompt: 'The original prompt text',
      performance: 'Current effectiveness and issues',
      goals: 'Specific enhancement objectives',
      context: 'How and where the prompt is used'
    },
    handoffChecklist: [
      'Original prompt provided',
      'Enhancement goals specified',
      'Application context described'
    ]
  },
  'any_to_conport_maintenance': {
    essentialContext: [
      'knowledge_structure',
      'maintenance_objectives',
      'quality_criteria',
      'specific_operations'
    ],
    contextFormat: {
      structure: 'Current knowledge organization',
      objectives: 'Maintenance goals and targets',
      operations: 'Specific maintenance tasks to perform',
      criteria: 'Quality standards and metrics'
    },
    handoffChecklist: [
      'Knowledge structure described',
      'Maintenance objectives defined',
      'Specific operations listed',
      'Quality criteria specified'
    ]
  }
};

/**
 * Orchestrator Knowledge-First class for organizing and applying orchestration knowledge
 */
class OrchestratorKnowledgeFirst {
  constructor() {
    this.mode = 'orchestrator';
    this.templates = ORCHESTRATION_TEMPLATES;
    this.modeHeuristics = MODE_SELECTION_HEURISTICS;
    this.decompositionPatterns = TASK_DECOMPOSITION_PATTERNS;
    this.transitionProtocols = TRANSITION_PROTOCOLS;
  }
  
  /**
   * Get optimal mode for a given task
   * @param {string} taskDescription - Description of the task
   * @param {Object} context - Additional context about the task
   * @returns {Object} - Selected mode and confidence score
   */
  getModeForTask(taskDescription, context = {}) {
    const scores = {};
    
    // Calculate scores for each mode based on task indicators
    for (const [mode, heuristic] of Object.entries(this.modeHeuristics)) {
      // Calculate score based on task indicators
      const indicatorScore = heuristic.taskIndicators.reduce((score, indicator) => {
        if (taskDescription.toLowerCase().includes(indicator.toLowerCase())) {
          return score + 1;
        }
        return score;
      }, 0);
      
      // Calculate score based on contextual factors if provided
      let contextScore = 0;
      if (context.factors) {
        for (const [factor, weight] of Object.entries(heuristic.contextualFactors)) {
          if (context.factors[factor]) {
            contextScore += weight;
          }
        }
      }
      
      // Calculate total score (indicator score has more weight)
      scores[mode] = (indicatorScore * 2) + contextScore;
    }
    
    // Find mode with highest score
    let bestMode = null;
    let highestScore = -1;
    
    for (const [mode, score] of Object.entries(scores)) {
      if (score > highestScore) {
        highestScore = score;
        bestMode = mode;
      }
    }
    
    // Calculate confidence level (max possible score depends on number of indicators)
    const maxPossibleScore = Object.values(this.modeHeuristics)
      .reduce((max, heuristic) => Math.max(max, heuristic.taskIndicators.length * 2 + 
        Object.values(heuristic.contextualFactors).reduce((sum, weight) => sum + weight, 0)), 0);
    
    const confidence = highestScore / maxPossibleScore;
    
    return {
      mode: bestMode,
      confidence,
      allScores: scores
    };
  }
  
  /**
   * Decompose a task into subtasks
   * @param {string} taskDescription - Description of the task
   * @param {string} patternName - Optional specific pattern to apply
   * @returns {Array} - Array of subtask descriptions
   */
  decomposeTask(taskDescription, patternName = null) {
    // Identify which pattern to use based on the task description
    let pattern = null;
    
    if (patternName && this.decompositionPatterns[patternName]) {
      // Use specified pattern
      pattern = this.decompositionPatterns[patternName];
    } else {
      // Auto-select pattern based on task description
      const patternIndicators = {
        'feature_development': ['feature', 'implement', 'create', 'develop', 'build'],
        'bug_fixing': ['bug', 'fix', 'issue', 'problem', 'error', 'not working'],
        'documentation_creation': ['document', 'documentation', 'write guide', 'manual'],
        'prompt_engineering': ['prompt', 'engineering', 'enhance prompt', 'optimize prompt'],
        'knowledge_base_maintenance': ['knowledge base', 'conport', 'database', 'organize knowledge']
      };
      
      let bestMatch = null;
      let highestScore = 0;
      
      for (const [patternKey, indicators] of Object.entries(patternIndicators)) {
        const score = indicators.filter(indicator => 
          taskDescription.toLowerCase().includes(indicator.toLowerCase())
        ).length;
        
        if (score > highestScore) {
          highestScore = score;
          bestMatch = patternKey;
        }
      }
      
      if (bestMatch) {
        pattern = this.decompositionPatterns[bestMatch];
      } else {
        // Default to feature development if no pattern matches
        pattern = this.decompositionPatterns['feature_development'];
      }
    }
    
    // Customize the steps based on the task description
    return pattern.steps.map(step => {
      // Simple customization by appending context from the task
      let customizedStep = step;
      
      // Extract key entities from task description
      const potentialEntities = taskDescription.match(/\b([A-Z][a-z]+|[a-z]+)\b/g) || [];
      const entities = potentialEntities.filter(entity => entity.length > 3 && 
        !['with', 'from', 'this', 'that', 'these', 'those', 'then', 'when'].includes(entity.toLowerCase()));
      
      // If we have entities and the step doesn't already mention them, append most relevant entity
      if (entities.length > 0) {
        // Find entity that doesn't already appear in the step
        const relevantEntity = entities.find(entity => !customizedStep.toLowerCase().includes(entity.toLowerCase()));
        
        if (relevantEntity) {
          // Append entity in an appropriate way based on step type
          if (customizedStep.includes('Analyze') || customizedStep.includes('Identify')) {
            customizedStep += ` for ${relevantEntity}`;
          } else if (customizedStep.includes('Implement') || customizedStep.includes('Create') || 
                    customizedStep.includes('Write') || customizedStep.includes('Add')) {
            customizedStep += ` for ${relevantEntity}`;
          } else if (customizedStep.includes('Test') || customizedStep.includes('Verify')) {
            customizedStep += ` in ${relevantEntity}`;
          } else if (customizedStep.includes('Document')) {
            customizedStep += ` for ${relevantEntity}`;
          }
        }
      }
      
      return customizedStep;
    });
  }
  
  /**
   * Get transition protocol for handoff between modes
   * @param {string} fromMode - Source mode
   * @param {string} toMode - Target mode
   * @returns {Object} - Transition protocol object
   */
  getTransitionProtocol(fromMode, toMode) {
    // Check for specific transition
    const specificTransition = `${fromMode}_to_${toMode}`;
    
    if (this.transitionProtocols[specificTransition]) {
      return this.transitionProtocols[specificTransition];
    }
    
    // Fall back to generic transition
    const genericTransition = `any_to_${toMode}`;
    
    if (this.transitionProtocols[genericTransition]) {
      return this.transitionProtocols[genericTransition];
    }
    
    // Return a minimal default protocol if no match
    return {
      essentialContext: [
        'task_description',
        'requirements',
        'constraints'
      ],
      contextFormat: {
        task: 'Description of the task to perform',
        context: 'Relevant background information',
        requirements: 'Specific requirements for the task'
      },
      handoffChecklist: [
        'Task clearly described',
        'Requirements specified',
        'Constraints identified'
      ]
    };
  }
  
  /**
   * Get workflow template for a specific type of task
   * @param {string} workflowType - Type of workflow to get
   * @returns {Object} - Workflow template
   */
  getWorkflowTemplate(workflowType) {
    return this.templates[workflowType] || null;
  }
  
  /**
   * Get all available workflow templates
   * @returns {Object} - All workflow templates
   */
  getAllWorkflowTemplates() {
    return this.templates;
  }
  
  /**
   * Evaluate handoff context completeness
   * @param {Object} handoffContext - The context for handoff
   * @param {string} fromMode - Source mode
   * @param {string} toMode - Target mode
   * @returns {Object} - Evaluation result with completeness score and missing elements
   */
  evaluateHandoffCompleteness(handoffContext, fromMode, toMode) {
    const protocol = this.getTransitionProtocol(fromMode, toMode);
    const essentialContext = protocol.essentialContext;
    const providedElements = Object.keys(handoffContext || {});
    
    // Find missing elements
    const missingElements = essentialContext.filter(
      element => !providedElements.includes(element)
    );
    
    // Calculate completeness score
    const completenessScore = essentialContext.length > 0 ? 
      (essentialContext.length - missingElements.length) / essentialContext.length : 0;
    
    return {
      complete: missingElements.length === 0,
      completenessScore,
      missingElements,
      protocol
    };
  }
}

module.exports = { OrchestratorKnowledgeFirst };