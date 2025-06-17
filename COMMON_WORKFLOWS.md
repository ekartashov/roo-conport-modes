# Common Workflows

**Real examples of how to use modes for typical tasks**

## 🏗️ Building a New Software Project

**The workflow:**
1. **Plan** (Architect Mode) → 2. **Code** (Code Mode) → 3. **Fix** (Debug Mode) → 4. **Document** (Docs Mode)

### Step 1: Planning with Architect Mode
```
You: "Use architect mode to help me design a task management web app"

AI: Switches to Architect Mode and helps you:
- Define requirements and user stories
- Choose technology stack
- Design database schema
- Plan API endpoints
- Create system architecture diagram
```

### Step 2: Implementation with Code Mode  
```
You: "Use code mode to implement the user authentication system we planned"

AI: Switches to Code Mode and:
- Remembers the architecture decisions from Step 1
- Implements JWT authentication
- Creates user registration/login endpoints
- Follows the patterns established in planning
```

### Step 3: Debugging Issues
```
You: "Debug mode - my login endpoint is returning 500 errors"

AI: Switches to Debug Mode and:
- Analyzes the error systematically
- Checks against the planned architecture
- Suggests fixes based on common auth issues
- Helps you test the solution
```

### Step 4: Creating Documentation
```
You: "Docs mode - create API documentation for what we built"

AI: Switches to Docs Mode and:
- Remembers the API design from earlier steps
- Creates comprehensive API docs
- Includes examples and error codes
- Maintains consistency with project terminology
```

**Key benefit:** Each mode remembers context from the previous steps, making the whole process smoother.

---

## 🔬 Research and Learning

**Use Case:** Learning a new technology or framework

### Using Ask Mode for Deep Research
```
You: "Ask mode - I need to choose between React and Vue for my project. 
Consider that I'm building a dashboard with real-time data."

AI: Uses Ask Mode to:
- Compare React vs Vue for dashboard use cases
- Consider real-time data requirements
- Provide pros/cons with specific examples
- Ask clarifying questions about your team and timeline
- Remember your preferences for future recommendations
```

### Following Up with Code Mode
```
You: "Code mode - create a proof of concept dashboard with React and real-time updates"

AI: Remembers the research from Ask Mode and:
- Implements based on the decision rationale
- Uses patterns that address the concerns raised in research
- Creates a working example that proves the concept
```

---

## 🐛 Systematic Problem Solving

**Use Case:** Something is broken and you're not sure why

### Debug Mode Workflow
```
You: "Debug mode - my React app is really slow, especially when users type in the search box"

AI: Uses Debug Mode to:
1. Ask systematic diagnostic questions
2. Guide you through performance profiling
3. Identify re-rendering issues
4. Suggest specific optimization strategies
5. Help implement and test fixes
6. Document the solution for future reference
```

**What makes it special:** Debug Mode builds a database of solutions, so similar issues in the future get faster, more targeted responses.

---

## 📖 Documentation Projects

**Use Case:** Creating or updating project documentation

### Docs Mode for Comprehensive Documentation
```
You: "Docs mode - our API has grown organically and the docs are scattered. 
Help me create organized, comprehensive documentation."

AI: Uses Docs Mode to:
1. Audit existing documentation
2. Identify gaps and inconsistencies  
3. Create a documentation structure
4. Generate missing sections
5. Ensure consistent terminology
6. Create examples and usage guides
```

---

## 🪃 Complex Multi-Phase Projects

**Use Case:** Large projects that need coordination between different types of work

### Orchestrator Mode for Project Management
```
You: "I need to build a complete e-commerce platform. Help me plan and execute this."

AI: Uses Orchestrator Mode to:
1. Break down the project into phases
2. Coordinate between Architect, Code, Debug, and Docs modes
3. Maintain context across all phases
4. Track progress and adjust plans
5. Ensure consistency across different types of work
```

**Example flow:**
- **Phase 1:** Architect Mode plans the overall system
- **Phase 2:** Code Mode implements user authentication  
- **Phase 3:** Code Mode builds product catalog
- **Phase 4:** Debug Mode optimizes performance
- **Phase 5:** Docs Mode creates user guides
- **Throughout:** Orchestrator Mode maintains coherence and tracks progress

---

## 🔄 Hybrid Mode Workflows (Advanced)

### Code + Knowledge Synthesis (code-kse-hybrid)
**Use Case:** Building something that combines patterns from multiple domains

```
You: "I'm building a real-time collaboration tool. Use code-kse-hybrid to 
implement the conflict resolution system."

AI: Uses the hybrid mode to:
- Synthesize patterns from version control, operational transforms, and conflict resolution
- Apply knowledge from database, networking, and UI domains
- Create a solution that combines multiple approaches intelligently
```

### Architect + Planning (architect-kdap-hybrid)
**Use Case:** Complex system design that needs autonomous planning

```
You: "Design a microservices architecture for a fintech platform. 
Use architect-kdap-hybrid for comprehensive planning."

AI: Uses the hybrid mode to:
- Autonomously research fintech requirements and regulations
- Plan architecture that considers security, scalability, and compliance
- Create detailed implementation roadmaps
- Consider multiple architectural approaches and trade-offs
```

---

## 💡 Tips for Effective Workflows

### 1. Start Simple, Add Complexity
- Begin with one mode for immediate needs
- Add more modes as your project grows
- Use hybrid modes for complex, multi-domain challenges

### 2. Let Modes Build on Each Other
- Don't start fresh each time - reference previous work
- Say things like "Based on our earlier architecture discussion..."
- Let the knowledge accumulate across sessions

### 3. Be Explicit When Helpful
- "Use debug mode to help me fix this"
- "Switch to docs mode for this task"
- "I need architect mode thinking for this decision"

### 4. Use Orchestrator for Coordination
- When working on large projects with multiple phases
- When you need to switch between modes frequently
- When you want the AI to manage the workflow complexity

### 5. Trust the Knowledge Building
- The more you use the modes, the better they get at understanding your specific needs
- Early sessions establish patterns that improve later sessions
- Don't hesitate to correct or refine the AI's understanding

---

## 🎯 Choosing Your Starting Workflow

**For Software Development:** Architect → Code → Debug → Docs
**For Research Projects:** Ask → Docs
**For Troubleshooting:** Debug (with Ask for background research)
**For Content Creation:** Docs (with Ask for research)
**For Complex Projects:** Orchestrator (coordinates all other modes)

**Remember:** These are patterns, not rules. Use what works for your specific situation and don't be afraid to experiment.