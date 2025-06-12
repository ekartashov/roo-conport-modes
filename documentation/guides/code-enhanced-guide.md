# Enhanced Code Mode Guide

## Overview

The Enhanced Code mode (`💻+ Enhanced Code`) extends traditional coding capabilities with systematic knowledge management through ConPort integration. This mode automatically captures implementation decisions, patterns, and lessons learned while maintaining the full coding functionality of the standard code mode.

### Quick Start
```bash
# Switch to Enhanced Code mode
/mode code-enhanced

# Work normally - the mode automatically documents decisions
"Implement user authentication with JWT tokens"

# Mode will code AND log decisions, patterns, progress to ConPort
```

## Installation

The Enhanced Code mode is available in this local modes collection:

1. Copy the mode configuration to your global modes file
2. Ensure ConPort MCP server is configured and running  
3. Restart Roo to load the new mode
4. Switch using `/mode code-enhanced`

## Core Capabilities

### Standard Coding Features
- Write, review, and refactor code across multiple languages
- Implement solutions following best practices
- Debug issues and optimize performance
- Create comprehensive test suites and documentation
- Handle complex multi-file codebases

### Enhanced Knowledge Management
- **Automatic Decision Logging**: Captures architectural and technology choices
- **Pattern Documentation**: Records reusable implementation solutions
- **Progress Tracking**: Links milestones to implementing decisions
- **Knowledge Preservation**: Stores important project artifacts and discoveries

## Knowledge Preservation Protocol

### Pre-Completion Evaluation

Before every `attempt_completion`, the mode evaluates:

1. **Decision Documentation**: Were significant choices made?
2. **Pattern Identification**: Were reusable solutions created?
3. **Progress Tracking**: Were major milestones reached?
4. **Knowledge Artifacts**: Was important information discovered?

### Auto-Documentation Triggers

The mode automatically documents when you:

- Choose between technology alternatives
- Solve complex technical problems
- Create new project structure or configuration
- Implement security, performance, or error handling patterns
- Discover constraints, limitations, or requirements
- Create reusable components or architectural patterns
- Make database or data modeling decisions
- Implement integrations or external service connections

## Documentation Types and Examples

### Decision Logging

**Technology Choices:**
```
Decision: "Selected React Query for state management over Redux Toolkit"
Rationale: "Project has heavy API interaction needs, React Query provides better caching and synchronization with 50% less boilerplate code than RTK Query"
Tags: ["state-management", "react", "performance"]
```

**Architecture Decisions:**
```
Decision: "Implemented microservices pattern for user and product domains"
Rationale: "Enables independent deployment and scaling, team can work in parallel, aligns with business domain boundaries"
Tags: ["architecture", "microservices", "scalability"]
```

**Implementation Decisions:**
```
Decision: "Used PostgreSQL stored procedures for complex business logic"
Rationale: "Business rules change frequently, stored procedures allow updates without application deployment, ensures data consistency"
Tags: ["database", "business-logic", "deployment"]
```

### Pattern Documentation

**Reusable Implementations:**
```
Pattern: "API Error Handling Middleware"
Description: "Centralized error handling with structured logging and user-friendly messages"
Implementation: Express middleware with error classification and response formatting
Tags: ["error-handling", "middleware", "api"]
```

**Architectural Patterns:**
```
Pattern: "Event-Driven Architecture with Message Queues"
Description: "Async processing pattern using RabbitMQ for order processing and notifications"
Implementation: Producer-consumer pattern with dead letter queues and retry logic
Tags: ["architecture", "async", "messaging"]
```

**Code Organization:**
```
Pattern: "Feature-Based Directory Structure"
Description: "Organizing code by business features rather than technical layers"
Implementation: /features/auth/, /features/products/, /features/orders/ structure
Tags: ["organization", "architecture", "maintainability"]
```

### Progress Tracking

**Feature Milestones:**
```
Progress: "Completed user authentication system with JWT and refresh tokens"
Status: DONE
Links: Decision on JWT strategy, Authentication middleware pattern
```

**Infrastructure Milestones:**
```
Progress: "Set up CI/CD pipeline with automated testing and deployment"
Status: DONE
Links: DevOps architecture decisions, Testing strategy patterns
```

### Knowledge Artifacts

**Configuration Templates:**
```
Category: "templates"
Key: "docker-compose-dev"
Value: [Complete Docker Compose configuration for development environment]
```

**Important Discoveries:**
```
Category: "constraints"
Key: "api-rate-limits"
Value: "Stripe API: 100 req/sec, SendGrid: 600 req/hour, consider caching and queuing"
```

**Setup Procedures:**
```
Category: "procedures"
Key: "local-dev-setup"
Value: [Step-by-step development environment setup guide]
```

## Workflow Integration

### During Implementation

1. **Make Decisions Consciously**: Consider alternatives and document rationale
2. **Identify Patterns**: Recognize when creating reusable solutions
3. **Note Discoveries**: Capture constraints, gotchas, and important findings
4. **Think Future Value**: Consider what would help future developers

### Before Completion

1. **Review Work**: Assess what knowledge was created
2. **Document Systematically**: Use appropriate ConPort tools
3. **Build Relationships**: Link decisions to patterns to progress
4. **Update Context**: Reflect current development state

### Example Workflow

```bash
# 1. Start coding task
/mode code-enhanced
"Implement user registration with email verification"

# 2. Mode implements AND documents:
# - Decision: Email service provider choice (SendGrid vs AWS SES)
# - Pattern: Email template system
# - Progress: User registration feature completion
# - Custom Data: Email template examples and configuration

# 3. Automatic ConPort logging before attempt_completion
# 4. Proper relationship linking between items
# 5. Context updates for team awareness
```

## Configuration

### Mode Structure

```yaml
slug: code-enhanced
name: 💻+ Enhanced Code
roleDefinition: Advanced coding with integrated knowledge management
whenToUse: Code implementation with systematic decision documentation
customInstructions: Knowledge preservation protocol and ConPort integration
groups:
  - read    # Full file system access
  - edit    # Code modification capabilities
  - browser # Research and documentation access
  - command # CLI tools and system operations
  - mcp     # Full ConPort integration
source: local
```

### Quality Standards

- Document ALL architectural and technology decisions with clear rationale
- Log reusable patterns immediately when created or discovered
- Track significant progress milestones with proper linking
- Preserve important project knowledge and constraints
- Build relationships between decisions, patterns, and implementations
- Update project context to reflect current development state

## Benefits

### For Individual Developers

- **Knowledge Retention**: Never lose important implementation decisions
- **Pattern Reuse**: Build library of proven solutions
- **Context Preservation**: Maintain project understanding across sessions
- **Learning Acceleration**: Systematic capture of lessons learned

### for Teams

- **Decision Transparency**: Understand why choices were made
- **Pattern Sharing**: Leverage proven solutions across projects
- **Onboarding Efficiency**: New team members access implementation context
- **Architectural Consistency**: Maintain coherent system design

### For Projects

- **Technical Debt Prevention**: Document design decisions and constraints
- **Maintenance Efficiency**: Understand system evolution and reasoning
- **Knowledge Transfer**: Preserve critical implementation knowledge
- **Quality Improvement**: Learn from patterns and decisions across codebase

## Troubleshooting

### Common Issues

**Mode Not Documenting Automatically**
- Verify ConPort MCP server connectivity
- Check workspace ID configuration
- Ensure you're in `code-enhanced` mode, not standard `code` mode
- Validate ConPort permissions and database access

**Excessive Documentation Overhead**
- Mode should document significant decisions, not every code change
- Focus on reusable patterns and architectural choices
- Use judgment on what constitutes "important" knowledge
- Batch related decisions into coherent entries

**Missing Relationships Between Items**
- Mode automatically links progress to implementing decisions
- Review and create additional relationships manually if needed
- Use ConPort maintenance mode for relationship optimization
- Ensure proper tagging for semantic clustering

**Documentation Quality Issues**
- Provide clear rationale explaining "why" not just "what"
- Include alternatives considered and trade-offs made
- Add implementation notes and usage examples
- Tag appropriately for future discoverability

### Validation Steps

1. **ConPort Connectivity Test**
   ```bash
   /mode code-enhanced
   "Test ConPort integration by logging a simple decision"
   ```

2. **Documentation Review**
   ```bash
   # Switch to ConPort maintenance mode
   /mode conport-maintenance
   "Review recent decisions and patterns logged by code-enhanced mode"
   ```

3. **Relationship Validation**
   ```bash
   # Check knowledge graph connectivity
   /mode conport-maintenance
   "Analyze relationships between recent code-enhanced entries"
   ```

## Best Practices

### Decision Documentation

1. **Clear Rationale**: Explain why the decision was made
2. **Alternatives Considered**: Note other options and why they were rejected
3. **Constraints and Trade-offs**: Document limitations and compromises
4. **Future Implications**: Consider long-term impact and maintenance

### Pattern Creation

1. **Generalizability**: Ensure pattern applies beyond current use case
2. **Implementation Details**: Provide concrete examples and code snippets
3. **Usage Guidelines**: Explain when to use and when not to use
4. **Integration Notes**: Document how pattern fits with other system components

### Progress Tracking

1. **Milestone Significance**: Track meaningful development achievements
2. **Proper Linking**: Connect progress to implementing decisions and patterns
3. **Status Accuracy**: Keep progress status current and accurate
4. **Outcome Documentation**: Record results and lessons learned

### Knowledge Management

1. **Systematic Approach**: Follow consistent documentation patterns
2. **Future Perspective**: Consider what future developers need to know
3. **Relationship Building**: Create meaningful connections between knowledge items
4. **Context Maintenance**: Keep project context current and relevant

This enhanced workflow transforms coding from isolated implementation into systematic knowledge building, making future development more efficient and informed.