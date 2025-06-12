# Prompt Enhancer Mode Guide

## Overview

The Prompt Enhancer mode (`🪄 Prompt Enhancer`) transforms vague or under-specified requests into clear, detailed, and actionable instructions for coding and software engineering tasks. This mode treats ALL user input as draft prompts that need enhancement rather than direct commands to execute.

### Quick Start
```bash
# Switch to Prompt Enhancer mode
/mode prompt-enhancer

# Provide your draft prompt
"Create a REST API for user management"

# Get enhanced, structured prompt ready for implementation
```

## Installation

The Prompt Enhancer mode is available in this local modes collection. To use it:

1. Copy the mode configuration to your global modes file
2. Restart Roo to load the new mode
3. Switch using `/mode prompt-enhancer`

## Usage

### Basic Enhancement Workflow

The mode follows a structured enhancement process:

1. **Target Clarification**: Identifies the target system/agent and main goal
2. **Objective & Scope**: Determines languages, frameworks, and task type
3. **Requirements Specification**: Gathers missing details and constraints
4. **Structured Output**: Organizes into Context, Task, Requirements, Acceptance Criteria
5. **Enhanced Delivery**: Provides implementation-ready prompt

### Example Enhancement

**Original Input:**
```
"Please activate conport mcp, and load all the test-related and project progress information"
```

**Enhanced Output:**
```
**Context:** You are working with a TypeScript project that has ConPort MCP integration.

**Task:** Conduct comprehensive project analysis by loading ConPort memory data and examining codebase.

**Requirements:**
1) Retrieve test-related data, progress entries, and decisions from ConPort
2) Analyze current code state
3) Cross-reference memory vs. implementation

**Output:** Summary of test coverage, project status, and next priorities with specific recommendations.
```

### Supported Task Types

- **Implementation**: New feature development, component creation
- **Debugging**: Error analysis, troubleshooting workflows
- **Optimization**: Performance improvements, refactoring
- **Architecture**: System design, pattern implementation
- **Testing**: Test suite creation, validation strategies
- **Documentation**: Technical writing, API documentation

## Configuration

### Mode Structure

```yaml
slug: prompt-enhancer
name: 🪄 Prompt Enhancer
roleDefinition: Advanced prompt enhancement specialist
whenToUse: When prompts need clarification and structuring
customInstructions: Enhancement process and behavior guidelines
groups:
  - read    # File access for context understanding
  - edit    # Template and example creation
  - browser # Research and reference gathering
  - command # Tool integration
  - mcp     # ConPort integration for project context
source: local
```

### Customization Options

- **Target Systems**: Configure for specific LLM systems or frameworks
- **Enhancement Templates**: Add domain-specific prompt structures
- **Quality Criteria**: Define success metrics for enhanced prompts
- **Integration Points**: Connect with project-specific tools and conventions

## Examples

### API Development Enhancement

**Input:** "Build an API"

**Enhanced:**
```
**Context:** Node.js project using Express framework with PostgreSQL database

**Task:** Create RESTful API with CRUD operations for user management

**Requirements:**
- Authentication via JWT tokens
- Input validation using Joi schema
- Database migrations for user table
- Error handling middleware
- API documentation with OpenAPI/Swagger

**Acceptance Criteria:**
- All endpoints return proper HTTP status codes
- Request/response validation implemented
- Unit tests for all endpoints
- Integration tests for authentication flow

**Implementation Notes:**
- Follow REST conventions for URL structure
- Use middleware pattern for cross-cutting concerns
- Implement proper error response format
```

### Database Schema Enhancement

**Input:** "Fix the database"

**Enhanced:**
```
**Context:** E-commerce application with PostgreSQL database experiencing performance issues

**Task:** Optimize database schema and query performance

**Requirements:**
- Analyze current query patterns and bottlenecks
- Add appropriate indexes for frequent queries
- Normalize schema to eliminate data redundancy
- Implement connection pooling

**Acceptance Criteria:**
- Query response time reduced by 50%
- No N+1 query problems
- Database schema passes normalization review
- Migration scripts for all changes

**Implementation Notes:**
- Use EXPLAIN ANALYZE for query optimization
- Consider read replicas for heavy read workloads
- Implement proper foreign key constraints
```

### Testing Strategy Enhancement

**Input:** "Add tests"

**Enhanced:**
```
**Context:** React application with existing Jest setup but low test coverage

**Task:** Implement comprehensive testing strategy with unit, integration, and e2e tests

**Requirements:**
- Unit tests for all utility functions and hooks
- Component tests using React Testing Library
- Integration tests for API interactions
- E2E tests for critical user journeys

**Acceptance Criteria:**
- 80%+ code coverage achieved
- All tests pass in CI/CD pipeline
- Test naming follows consistent convention
- Mock external dependencies properly

**Implementation Notes:**
- Use MSW for API mocking in tests
- Implement custom render utilities for test setup
- Follow AAA pattern (Arrange, Act, Assert)
```

## Troubleshooting

### Common Issues

**Mode Executing Tasks Instead of Enhancing**
- Ensure you're in prompt-enhancer mode: `/mode prompt-enhancer`
- The mode should ask clarifying questions, not execute commands
- If execution occurs, restart the mode and rephrase input as a prompt request

**Enhanced Prompts Too Generic**
- Provide more specific context about your project and requirements
- Include technology stack, constraints, and success criteria
- The mode will ask follow-up questions to gather missing details

**Missing Technical Details**
- The mode should prompt for programming languages, frameworks, and tools
- If not asked, explicitly mention your technology stack
- Include performance requirements, coding standards, and deployment environment

**Output Not Implementation-Ready**
- Request specific examples and code snippets in your original prompt
- Ask for acceptance criteria and testing requirements
- The enhanced prompt should be actionable without further clarification

### Validation Checklist

- [ ] Enhanced prompt includes Context, Task, Requirements, Acceptance Criteria
- [ ] Technology stack and constraints clearly specified
- [ ] Success metrics and testing requirements defined
- [ ] Implementation notes provide architectural guidance
- [ ] Output is actionable without additional clarification
- [ ] Edge cases and error handling considered