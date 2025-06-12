# Prompt Enhancer (Isolated) Mode Guide

## Overview

The Prompt Enhancer (Isolated) mode (`🪄 Prompt Enhancer (Isolated)`) provides project-agnostic prompt enhancement using universal software engineering principles. Unlike the standard prompt enhancer, this mode operates in complete isolation from any project-specific context, making it ideal for enhancing prompts for different projects or when you need purely generic enhancement.

### Quick Start
```bash
# Switch to Isolated Prompt Enhancer mode
/mode prompt-enhancer-isolated

# Provide your draft prompt (will be enhanced generically)
"Create a REST API for user management"

# Get enhanced, universally-applicable prompt
```

## Key Differences from Standard Prompt Enhancer

| Feature | Standard Prompt Enhancer | Isolated Prompt Enhancer |
|---------|-------------------------|--------------------------|
| **ConPort Access** | Full access to project context | No ConPort access |
| **Project Context** | Uses current project details | Uses generic assumptions |
| **Technology Stack** | Infers from project | Asks user or uses generic patterns |
| **Patterns Used** | Project-specific + universal | Universal patterns only |
| **Use Case** | Enhancing prompts for current project | Enhancing prompts for any project |

## When to Use

### Use Isolated Mode When:
- Enhancing prompts for different projects
- Creating generic, reusable prompts
- Working on experimental or proof-of-concept tasks
- Teaching or creating educational content
- Avoiding contamination from current project context
- Creating templates for multiple projects

### Use Standard Mode When:
- Enhancing prompts for the current project
- Leveraging existing project patterns and decisions
- Building on established project architecture
- Using project-specific terminology and constraints

## Enhancement Process

### Phase 1: Generic Input Analysis
The mode identifies task content while ignoring any project-specific references:
- Focuses on universal task patterns
- Classifies enhancement requests vs operational commands
- Applies generic software engineering principles

### Phase 2: Universal Clarification
When technology stack or scope is unclear:
```
"Should I enhance this as a generic software engineering task?"
"What programming language or framework should I assume?"
"Should I include universal best practices or keep it technology-agnostic?"
```

### Phase 3: Isolated Enhancement
Applies universal patterns without project context:
- **Context**: Generic environment assumptions
- **Task**: Clear, technology-appropriate objectives
- **Requirements**: Universal best practices
- **Acceptance Criteria**: Standard quality metrics
- **Implementation Notes**: Common patterns and principles

## Universal Best Practices Integrated

### Security
- Input validation and sanitization
- Authentication and authorization patterns
- Secure coding practices
- Data encryption considerations

### Performance
- Efficient algorithms and data structures
- Caching strategies
- Database optimization techniques
- Resource management

### Testing
- Unit testing frameworks
- Integration testing approaches
- Test-driven development principles
- Code coverage standards

### Architecture
- SOLID principles
- Common design patterns
- Separation of concerns
- Modular design approaches

### Documentation
- API documentation standards
- Code commenting best practices
- User guide templates
- Technical specification formats

## Examples

### Example 1: Generic API Enhancement

**Input:**
```
"Build an API for managing users"
```

**Enhanced Output:**
```
**Context:** Generic web application requiring user management API functionality.

**Task:** Create RESTful API with comprehensive CRUD operations for user management following REST principles and industry standards.

**Requirements:**
1. HTTP status code compliance (200, 201, 400, 401, 404, 500)
2. JSON request/response format with consistent structure
3. Input validation and sanitization for all endpoints
4. Error handling with structured, user-friendly responses
5. API documentation following OpenAPI specification
6. Authentication mechanism (JWT tokens recommended)
7. Rate limiting to prevent abuse
8. CORS configuration for frontend integration

**Acceptance Criteria:**
- All endpoints follow REST conventions (GET /users, POST /users, PUT /users/:id, DELETE /users/:id)
- Proper HTTP methods and status codes implemented
- Input validation prevents invalid data submission
- Comprehensive error handling with meaningful messages
- API documentation is auto-generated and accessible
- Authentication protects appropriate endpoints
- Unit tests achieve 80%+ code coverage

**Implementation Notes:**
- Use standard HTTP methods with semantic meaning
- Implement proper status codes (200 for success, 201 for creation, 400 for bad requests)
- Include pagination for list endpoints (offset/limit or cursor-based)
- Use consistent naming conventions (camelCase for JSON, kebab-case for URLs)
- Implement proper foreign key relationships if using relational database
- Consider using middleware pattern for cross-cutting concerns
- Include health check endpoint for monitoring
```

### Example 2: Database Performance Enhancement

**Input:**
```
"The database is slow, make it faster"
```

**Enhanced Output:**
```
**Context:** Application experiencing database performance degradation requiring systematic optimization analysis.

**Task:** Analyze and optimize database performance through comprehensive performance tuning and optimization strategies.

**Requirements:**
1. Query performance analysis using database-specific tools
2. Index strategy review and optimization
3. Database schema normalization assessment
4. Connection pooling configuration
5. Query result caching implementation
6. Performance monitoring and alerting setup
7. Query optimization and rewriting
8. Hardware resource utilization analysis

**Acceptance Criteria:**
- Query response times improved by minimum 50%
- No N+1 query problems identified in application
- Appropriate indexes implemented on frequently queried columns
- Connection pool properly configured for concurrent load
- Performance monitoring dashboard established
- Database maintenance procedures documented
- Backup and recovery performance tested

**Implementation Notes:**
- Use database EXPLAIN/ANALYZE commands for query performance analysis
- Implement B-tree indexes for equality searches, composite indexes for multi-column queries
- Consider partial indexes for filtered queries on large tables
- Set up read replicas for heavy read workloads
- Implement query result caching with appropriate TTL values
- Monitor key metrics: query time, connection count, CPU/memory usage
- Establish performance baselines before and after optimization
- Document optimization decisions and their impact
```

### Example 3: Frontend Component Enhancement

**Input:**
```
"Create a user profile component"
```

**Enhanced Output:**
```
**Context:** Frontend application requiring reusable user profile component with modern UX patterns and accessibility compliance.

**Task:** Create comprehensive user profile component with view/edit modes, form validation, and responsive design.

**Requirements:**
1. Display mode with clean, accessible layout
2. Edit mode with real-time form validation
3. File upload capability for profile pictures
4. Responsive design for mobile and desktop
5. Accessibility compliance (WCAG 2.1 AA standards)
6. Loading states and error handling
7. Optimistic UI updates with rollback capability
8. Component testing and documentation

**Acceptance Criteria:**
- Component renders correctly in both view and edit modes
- Form validation provides immediate, clear feedback
- File upload handles errors gracefully with progress indication
- Design works seamlessly across device sizes
- All interactive elements are keyboard accessible
- Screen readers can navigate component effectively
- Loading states provide clear user feedback
- Component is documented with usage examples

**Implementation Notes:**
- Use semantic HTML elements for accessibility
- Implement proper ARIA labels and roles
- Use CSS Grid/Flexbox for responsive layout
- Include focus management for keyboard navigation
- Implement client-side validation with server-side backup
- Use progressive enhancement principles
- Include proper error boundaries for fault isolation
- Provide Storybook stories or similar documentation
- Use performance optimization techniques (memoization, lazy loading)
```

## Technology-Agnostic Patterns

### Web APIs
- REST principles and resource naming
- HTTP status codes and methods
- JSON response formatting
- Authentication patterns (JWT, OAuth)
- Rate limiting strategies

### Databases
- ACID properties and transaction management
- Indexing strategies and query optimization
- Schema design and normalization
- Connection pooling and resource management
- Backup and disaster recovery

### Frontend Development
- Responsive design principles
- Accessibility standards (WCAG)
- Progressive enhancement
- Performance optimization
- Cross-browser compatibility

### DevOps and Deployment
- CI/CD pipeline patterns
- Containerization best practices
- Monitoring and observability
- Security scanning and compliance
- Infrastructure as code

## Troubleshooting

### Common Issues

**Enhanced Prompts Too Generic**
- Provide more specific technology stack in your input
- Ask follow-up questions about framework preferences
- Specify constraints or requirements in your original prompt

**Missing Technology-Specific Details**
- The mode will ask clarifying questions about technology choices
- Specify your preferred programming language or framework
- Include any specific tool or library requirements

**Output Not Implementation-Ready**
- Request specific examples in your original prompt
- Ask for code snippets or configuration examples
- Specify the level of detail needed (high-level vs detailed)

### Validation Checklist

- [ ] Enhanced prompt is technology-appropriate but not project-specific
- [ ] Universal best practices are integrated throughout
- [ ] Success criteria are measurable and realistic
- [ ] Implementation notes provide actionable guidance
- [ ] Output is ready for any implementation agent
- [ ] No assumptions about existing project infrastructure