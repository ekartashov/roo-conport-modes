# Prompt Enhancer Input Disambiguation Analysis

## Problem Statement

The current Prompt Enhancer mode has ambiguity between:
- **Prompt Content**: The actual prompt that needs enhancement
- **Enhancement Directives**: Meta-instructions about how to enhance (context gathering, tool activation, etc.)

Example conflict: User wants to enhance a prompt that contains "please activate conport" while also needing ConPort activated for project context.

## Solution Option 2: Two-Phase Workflow

### Implementation Approach

**Phase 1: Content Capture**
```
Mode Response: "Please provide the raw prompt you want enhanced. I'll treat everything you share next as content to be improved, not as instructions to me."

User Input: "please activate conport mcp, and load all the test-related and project progress information"

Mode Confirms: "I've captured your prompt content. Now let me gather enhancement requirements..."
```

**Phase 2: Enhancement Configuration**
```
Mode Questions:
1. "What target system/agent is this enhanced prompt for?" 
2. "Should I activate ConPort to gather project context for this enhancement?"
3. "What's the main goal: implementation, debugging, analysis, etc.?"
4. "Any specific technical constraints or requirements?"
```

### Pros
- **Clear Separation**: Complete disambiguation between content and directives
- **User Control**: Explicit confirmation of what's being enhanced
- **Flexible Context**: Can gather rich project context without contaminating the prompt
- **Reduces Errors**: Eliminates misinterpretation of prompt content as instructions
- **Better UX**: Users know exactly what's happening at each step

### Cons
- **More Steps**: Requires additional interaction rounds
- **Cognitive Load**: Users must think about the process in phases
- **Interruption**: Breaks natural conversational flow
- **Time Investment**: Longer interaction for simple enhancements

### Edge Cases to Consider

1. **User Provides Both Phases at Once**
   ```
   User: "Enhance this: 'create API' - and please activate ConPort for context"
   
   Challenge: Mode must parse mixed input
   Solution: Ask for clarification or implement smart parsing
   ```

2. **Multi-Part Prompts**
   ```
   User: "I have several related prompts to enhance..."
   
   Challenge: Batch processing vs individual phases
   Solution: Offer batch mode or individual processing choice
   ```

3. **Iterative Refinement**
   ```
   User: "Actually, change the target from Node.js to Python"
   
   Challenge: Which phase to return to
   Solution: Allow phase navigation and state preservation
   ```

4. **Context Dependencies**
   ```
   User prompt mentions project-specific terms that need ConPort lookup
   
   Challenge: When to activate tools during Phase 1
   Solution: Defer all tool activation to Phase 2
   ```

## Solution Option 3: Intelligent Parsing

### Implementation Approach

**Smart Content Detection**
```yaml
Content Indicators:
- Imperative verbs: "create", "build", "implement", "fix"
- Task descriptions: "I need...", "Please make..."
- Technical requirements: specific technologies, frameworks
- Problem statements: error descriptions, issues

Meta-Instruction Indicators:
- Mode directives: "activate", "use", "switch to"
- Enhancement requests: "make this clearer", "add more details"
- Context requests: "consider the project", "use ConPort"
- Tool specifications: "with examples", "include code"
```

**Parsing Logic**
```
1. Analyze user input for content vs meta-instruction patterns
2. Extract core prompt content (task/requirement statements)
3. Extract enhancement directives (context needs, tool activation)
4. Confirm interpretation with user before proceeding
5. Apply enhancement with gathered context
```

### Pros
- **Natural Flow**: Single input, intelligent processing
- **Efficiency**: Minimal additional user interaction required
- **Smart Context**: Automatically determines when tools are needed
- **User Friendly**: Works with natural language without rigid structure
- **Adaptive**: Can handle various input styles and complexity levels

### Cons
- **Parsing Complexity**: Requires sophisticated natural language understanding
- **Ambiguity Risk**: May misclassify content vs instructions
- **False Positives**: Could treat prompt content as meta-instructions
- **Maintenance Overhead**: Parsing rules need continuous refinement
- **Unpredictable**: Users can't be certain how input will be interpreted

### Edge Cases to Consider

1. **Prompt Contains Meta-Language**
   ```
   User: "Create a prompt that asks users to activate debug mode"
   
   Challenge: "activate" appears in content, not as instruction
   Solution: Context-aware parsing, confirmation queries
   ```

2. **Nested Instructions**
   ```
   User: "Enhance this prompt: 'Please use ConPort to load project data' - and actually activate ConPort while enhancing"
   
   Challenge: Multiple layers of instruction vs content
   Solution: Hierarchical parsing with explicit confirmation
   ```

3. **Domain-Specific Conflicts**
   ```
   User: "Build a CLI tool that activates various system modes"
   
   Challenge: Technical terms overlap with mode meta-commands
   Solution: Domain context detection, technical vocabulary awareness
   ```

4. **Ambiguous Pronouns**
   ```
   User: "Make it use the project context when analyzing code"
   
   Challenge: "it" could refer to the prompt or the enhancement process
   Solution: Clarification questions, pronoun resolution
   ```

## Recommendation Analysis

### For Most Users: **Two-Phase Workflow (Option 2)**
- Predictable and clear
- Eliminates ambiguity completely
- Better for complex project contexts
- Easier to implement reliably

### For Advanced Users: **Intelligent Parsing (Option 3)**
- More sophisticated experience
- Requires robust fallback to clarification
- Could be offered as an "expert mode" option

### Hybrid Approach Possibility
```
Default: Two-phase workflow
Advanced: Smart parsing with confirmation
Fallback: Always confirm interpretation before proceeding
```

## Implementation Priority

1. **Immediate**: Implement two-phase workflow
2. **Future**: Add intelligent parsing as optional enhancement
3. **Always**: Include confirmation mechanisms for ambiguous cases