# Enhanced Prompt Enhancer Design: Intelligent Tool/Content Separation with Global Learning

## Core Problem Expansion

The separation challenge extends beyond ConPort to **any tool or MCP server**:
- GitHub integration commands vs GitHub-related prompts
- Database tools vs database creation prompts  
- File operations vs file management task descriptions
- Browser automation vs web development requests

## Confidence-Based Intelligent Parsing (80% Threshold)

### Multi-Dimensional Confidence Scoring

**1. Semantic Context Analysis**
```
Content Indicators (High Confidence 85-95%):
- Direct task verbs: "create", "build", "implement", "design"
- Problem statements: "I have an issue with...", "The system fails when..."
- Feature specifications: "Add a button that...", "Make the API return..."

Tool/Meta Indicators (High Confidence 85-95%):
- Tool activation language: "activate", "use", "enable", "connect to"
- Context gathering: "load from", "get data", "retrieve information"
- Enhancement directives: "make sure to include", "consider the project"
```

**2. Syntactic Pattern Recognition**
```
High Confidence Patterns:
- Imperative sentences about building/creating = Content
- Conditional/modal language about tools = Meta ("please use X to...")
- Sequential instructions mixing both = Requires disambiguation

Medium Confidence Patterns (50-79%):
- Mixed statements: "Use GitHub to create a CI pipeline"
- Ambiguous pronouns: "Make it connect to the database"
- Domain overlap: "Activate debug mode" (tool command vs feature requirement)
```

**3. Contextual Relationship Mapping**
```
Confidence Boosters:
- Clear subject separation: "Use ConPort for context. Create an API for users."
- Explicit purpose statements: "I want to enhance this prompt: [content]"
- Tool justification: "Use GitHub because I need project history"

Confidence Reducers:
- Nested references: tool mentions within task descriptions
- Ambiguous scope: unclear what "it" or "this" refers to
- Domain terminology overlap
```

## Dual-Layer Learning Framework: Local + Global Intelligence

### Local Learning (Project-Specific ConPort)

**Category: `local_mode_patterns`**
```json
{
  "category": "local_mode_patterns",
  "key": "prompt_enhancer_project_context",
  "value": {
    "project_specific_patterns": [
      {
        "pattern": "Use our internal API framework",
        "classification": "content",
        "confidence": 95,
        "context": "This project has custom API terminology"
      },
      {
        "pattern": "Load user stories from Jira",
        "classification": "meta_instruction",
        "confidence": 90,
        "context": "Project uses Jira integration"
      }
    ],
    "domain_vocabulary": {
      "custom_tools": ["our_deploy_script", "company_linter"],
      "project_frameworks": ["internal_ui_lib", "custom_auth"],
      "disambiguation_hints": [
        "When user mentions 'deploy', usually means task content not tool activation",
        "References to 'our API' typically content, 'use API tool' typically meta"
      ]
    },
    "local_confidence_adjustments": {
      "boost_patterns": ["internal framework terms"],
      "lower_patterns": ["ambiguous company terms"]
    }
  }
}
```

### Global Learning (Cross-Project Intelligence)

**Category: `mode_enhancement_intelligence`**

```json
{
  "category": "mode_enhancement_intelligence",
  "key": "prompt_enhancer_patterns",
  "value": {
    "disambiguation_patterns": [
      {
        "input_pattern": "Use [tool] to [action]",
        "classification": "meta_instruction",
        "confidence": 92,
        "correction_count": 0,
        "success_rate": 98
      },
      {
        "input_pattern": "Create [system] that [action]",
        "classification": "content",
        "confidence": 96,
        "correction_count": 1,
        "success_rate": 95
      }
    ],
    "correction_learning": [
      {
        "original_input": "Use ConPort to load test data",
        "mode_classification": "meta_instruction",
        "user_correction": "content",
        "pattern_learned": "Context loading can be task requirement",
        "timestamp": "2025-06-12T00:09:00Z"
      }
    ],
    "confidence_thresholds": {
      "auto_proceed": 80,
      "ask_clarification": 79,
      "require_confirmation": 50
    }
  }
}
```

**Category: `agent_improvement_insights`**

```json
{
  "category": "agent_improvement_insights", 
  "key": "mode_behavioral_patterns",
  "value": {
    "mode": "prompt_enhancer",
    "improvement_areas": [
      {
        "area": "tool_content_disambiguation",
        "insights": [
          "Users often mix enhancement context with prompt content",
          "80% threshold reduces false positives by 23%",
          "Clarification questions improve user satisfaction"
        ],
        "evidence_count": 15,
        "impact_score": 8.5
      }
    ],
    "enhancement_methods": [
      {
        "method": "confidence_based_clarification",
        "effectiveness": 92,
        "user_feedback": "positive",
        "implementation_complexity": "medium"
      }
    ]
  }
}
```

## Implementation Strategy with Local/Global Intelligence

### Phase 1: Dual-Layer Confidence Engine
```yaml
Enhancement Process:
1. Load local project patterns from ConPort
2. Apply global intelligence patterns
3. Parse input with combined semantic analysis
4. Calculate confidence scores (local + global factors)
5. If any segment < 80% confidence: trigger clarification
6. If all segments >= 80%: proceed with classified enhancement
7. Log classifications and corrections to appropriate layer
```

### Phase 2: Dual-Layer Learning Integration
```yaml
Local Learning Loop:
1. Track project-specific corrections in current session
2. Update local confidence patterns in project ConPort
3. Build domain vocabulary and disambiguation hints
4. Apply project-specific patterns to future sessions

Global Learning Loop:
1. Extract generalizable patterns from local learning
2. Log cross-project insights to global intelligence
3. Build universal improvement database
4. Apply global patterns to new projects
```

### Phase 3: Intelligence Stratification
```yaml
Local Intelligence (Project ConPort):
- Project-specific tool names and frameworks
- Domain-specific terminology patterns
- Team communication style adaptations
- Custom workflow disambiguation rules

Global Intelligence (Cross-Project):
- Universal disambiguation patterns
- Common tool/content separation rules
- General confidence threshold optimizations
- Mode behavioral improvements

Intelligence Synthesis:
- Local patterns override global when confident
- Global patterns provide fallback for unknown cases
- Continuous bidirectional learning between layers
```

### Phase 4: Intelligent Harvesting System
```yaml
"Organize Findings" Enhanced Capability:
1. Analyze local patterns across all projects
2. Identify candidates for global promotion
3. Recognize project-specific vs universal patterns
4. Generate targeted recommendations:
   - Local: Project workflow optimizations
   - Global: Mode architecture improvements
5. Create stratified enhancement guidelines
```

## Clarification Question Framework

### Dynamic Question Generation Based on Confidence Gaps

**For Tool/Content Ambiguity (Confidence 60-79%):**
```
"I'm analyzing your input and see you mentioned [tool]. I'm 70% confident about the classification. 
To be sure: 
- Should I actually [activate/use] [tool] to gather context for enhancing your prompt?
- Or is '[tool reference]' part of the content you want me to enhance?"
```

**For Mixed Content (Confidence 50-79%):**
```
"I see both task instructions and enhancement context in your input. Let me confirm:

TASK CONTENT (what I should enhance):
- [extracted content segments]

ENHANCEMENT CONTEXT (instructions for me):  
- [extracted meta instructions]

Is this separation correct?"
```

**For Domain Overlap (Confidence 40-79%):**
```
"The phrase '[ambiguous phrase]' could mean either:
1. A feature you want to implement (part of the prompt)
2. An instruction for how I should enhance the prompt

Which interpretation is correct?"
```

## Cross-Mode Learning Architecture

### Global Pattern Database Structure

**Mode Enhancement Patterns:**
- Input disambiguation techniques
- Confidence threshold optimizations
- User interaction improvements
- Error pattern recognition

**Behavioral Insights:**
- Mode-specific user preferences
- Effective clarification strategies
- Success rate improvements
- User satisfaction metrics

**Enhancement Methods:**
- Confidence-based decision making
- Dynamic question generation
- Learning from corrections
- Pattern recognition improvements

## Implementation Benefits

### Immediate Gains:
- 80% confidence threshold reduces false classifications
- Transparent uncertainty builds user trust
- Local patterns adapt to project-specific terminology
- Global patterns provide universal fallbacks

### Local Intelligence Benefits:
- **Project Adaptation**: Mode learns project-specific tools and frameworks
- **Domain Specialization**: Builds vocabulary for company/team terminology
- **Workflow Optimization**: Adapts to team communication patterns
- **Context Preservation**: Maintains project-specific disambiguation rules

### Global Intelligence Benefits:
- **Universal Learning**: Patterns apply across all new projects
- **Mode Evolution**: Systematic improvement of core disambiguation logic
- **Cross-Project Transfer**: Knowledge gained in one project helps others
- **Scalable Intelligence**: Global patterns improve with each project

### Long-term Stratified Intelligence:
- **Dual-Layer Learning**: Local specificity + Global generalization
- **Intelligent Promotion**: Local patterns graduate to global when proven universal
- **Hierarchical Confidence**: Local overrides global when contextually confident
- **Bidirectional Evolution**: Global improvements inform local adaptations

### Meta-Intelligence Architecture:
- **"Organize findings" becomes stratified enhancement tool**:
  - Local: Project workflow and terminology optimizations
  - Global: Mode architecture and universal pattern improvements
- **Systematic multi-level identification of improvement opportunities**
- **Data-driven mode evolution with context awareness**
- **Cross-project knowledge transfer with local customization**

### Strategic Value:
This dual-layer approach transforms the Prompt Enhancer from a static tool into a **contextually intelligent, continuously learning system** that:

1. **Solves immediate disambiguation** with high accuracy
2. **Adapts to project contexts** while building universal knowledge
3. **Contributes to ecosystem-wide improvement** through stratified learning
4. **Enables systematic mode enhancement** via organized intelligence harvesting
5. **Creates sustainable AI agent evolution** with both local and global optimization

The result is a mode that becomes more valuable to each specific project while simultaneously contributing to the improvement of the entire Roo ecosystem.