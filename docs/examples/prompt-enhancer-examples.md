# Prompt Enhancer Examples

## Overview

This document provides real-world examples of using the Prompt Enhancer mode to transform vague requests into structured, actionable prompts for implementation.

## Basic Enhancement Examples

### Example 1: API Development

**Original Request:**
```
"Build an API for my app"
```

**Enhancement Process:**
```
User: "Build an API for my app"

Prompt Enhancer: "I'll help enhance this prompt for implementation. First, let me understand:

1. What type of application is this API for?
2. What programming language/framework should be used?
3. What are the main entities/resources the API should handle?
4. What's the target deployment environment?"

User: "It's for a task management app, using Node.js with Express, handling users and tasks, deploying to AWS"

Prompt Enhancer: [Provides enhanced prompt below]
```

**Enhanced Prompt:**
```
**Context:** Node.js task management application using Express framework, deploying to AWS with PostgreSQL database.

**Task:** Create RESTful API with comprehensive CRUD operations for user management and task tracking system.

**Requirements:**
1. User authentication via JWT tokens with role-based access control
2. Task CRUD operations with user ownership validation
3. Input validation using Joi schema validation
4. Database models using Sequelize ORM
5. API documentation with Swagger/OpenAPI specification
6. Error handling middleware with structured error responses
7. Rate limiting and security headers implementation

**Acceptance Criteria:**
- All endpoints return proper HTTP status codes (200, 201, 400, 401, 404, 500)
- Request/response validation prevents invalid data
- Authentication middleware protects private routes
- Unit tests achieve 80%+ code coverage
- Integration tests validate end-to-end workflows
- API documentation is automatically generated and accessible

**Implementation Notes:**
- Follow REST conventions: GET /users, POST /tasks, PUT /tasks/:id, DELETE /tasks/:id
- Use middleware pattern for authentication, validation, and error handling
- Implement proper foreign key relationships between users and tasks
- Use environment variables for configuration (database URL, JWT secret)
- Include CORS configuration for frontend integration
```

### Example 2: Database Optimization

**Original Request:**
```
"The queries are slow, fix the database"
```

**Enhancement Process:**
```
User: "The queries are slow, fix the database"

Prompt Enhancer: "I'll help structure this database optimization prompt. I need more details:

1. What database system are you using? (PostgreSQL, MySQL, MongoDB, etc.)
2. What specific queries or operations are slow?
3. What's the current data volume and expected growth?
4. Are there existing indexes or optimization attempts?"

User: "PostgreSQL with 100k users and 1M tasks, slow when loading user dashboards and searching tasks"

Prompt Enhancer: [Provides enhanced prompt below]
```

**Enhanced Prompt:**
```
**Context:** PostgreSQL database supporting task management application with 100,000 users and 1,000,000 tasks experiencing performance issues on user dashboard loading and task search operations.

**Task:** Analyze and optimize database performance focusing on query optimization, indexing strategy, and schema improvements.

**Requirements:**
1. Analyze current query performance using EXPLAIN ANALYZE
2. Identify N+1 query problems and missing indexes
3. Implement appropriate B-tree and partial indexes
4. Optimize user dashboard queries (user tasks, recent activity, statistics)
5. Improve task search performance with full-text search capabilities
6. Review and optimize foreign key relationships
7. Implement connection pooling and query result caching

**Acceptance Criteria:**
- User dashboard load time reduced from >3s to <500ms
- Task search queries execute in <200ms for keyword searches
- Database connection pool maintains stable performance under load
- All migrations are reversible and tested
- Query performance monitoring is implemented
- Database backup/restore procedures remain functional

**Implementation Notes:**
- Use EXPLAIN (ANALYZE, BUFFERS) for detailed query analysis
- Consider PostgreSQL-specific features: GIN indexes for full-text search, partial indexes for filtered queries
- Implement pg_stat_statements for ongoing query monitoring
- Use read replicas for dashboard analytics if write load is high
- Consider materialized views for complex aggregation queries
- Ensure proper VACUUM and ANALYZE scheduling
```

### Example 3: Frontend Component

**Original Request:**
```
"Create a user profile component"
```

**Enhanced Prompt:**
```
**Context:** React TypeScript application using Material-UI component library with Redux Toolkit for state management and React Hook Form for form validation.

**Task:** Create reusable UserProfile component with view and edit modes supporting avatar upload, form validation, and optimistic updates.

**Requirements:**
1. Display mode showing user information in clean, accessible layout
2. Edit mode with form validation using React Hook Form and Yup schema
3. Avatar upload with image preview and validation (size, format)
4. Real-time form validation with clear error messaging
5. Optimistic UI updates with error rollback capability
6. Responsive design working on mobile and desktop
7. Accessibility compliance (ARIA labels, keyboard navigation)

**Acceptance Criteria:**
- Component renders correctly in both view and edit modes
- Form validation prevents invalid submissions
- Avatar upload handles errors gracefully
- Loading states provide clear user feedback
- Component is fully accessible (WCAG 2.1 AA compliant)
- Unit tests cover all interaction scenarios
- Storybook stories document component usage

**Implementation Notes:**
- Use React.memo for performance optimization
- Implement proper TypeScript interfaces for props and state
- Use CSS-in-JS with consistent theme variables
- Handle file upload with progress indication
- Implement proper error boundaries for error isolation
- Use React Testing Library for user-centric testing
```

## Advanced Enhancement Examples

### Example 4: Microservices Architecture

**Original Request:**
```
"Split the monolith into microservices"
```

**Enhanced Prompt:**
```
**Context:** Existing Node.js monolithic e-commerce application with 200k daily active users, handling product catalog, user management, order processing, and payment integration.

**Task:** Design and implement microservices decomposition strategy with proper service boundaries, data consistency patterns, and deployment architecture.

**Requirements:**
1. Identify service boundaries using Domain-Driven Design principles
2. Design inter-service communication patterns (synchronous vs asynchronous)
3. Implement distributed data management with eventual consistency
4. Set up API Gateway for request routing and authentication
5. Design observability stack (logging, metrics, tracing)
6. Implement service discovery and load balancing
7. Create containerization and orchestration strategy

**Services to Extract:**
- User Service (authentication, profiles, preferences)
- Product Service (catalog, inventory, pricing)
- Order Service (cart, checkout, order history)
- Payment Service (payment processing, billing)
- Notification Service (email, SMS, push notifications)

**Acceptance Criteria:**
- Each service can be developed, tested, and deployed independently
- System maintains 99.9% uptime during gradual migration
- Data consistency is maintained across service boundaries
- End-to-end request tracing is available for debugging
- Service-to-service communication latency <100ms within cluster
- Automated testing covers inter-service integration scenarios

**Implementation Notes:**
- Use event sourcing for order state management
- Implement saga pattern for distributed transactions
- Use Docker with Kubernetes for container orchestration
- Implement circuit breaker pattern for resilience
- Use message queues (RabbitMQ/Apache Kafka) for async communication
- Establish proper service versioning and backward compatibility
```

### Example 5: Testing Strategy

**Original Request:**
```
"Add tests to the project"
```

**Enhanced Prompt:**
```
**Context:** React TypeScript SPA with Node.js API backend, currently has minimal test coverage and no CI/CD testing pipeline.

**Task:** Implement comprehensive testing strategy covering unit, integration, and end-to-end testing with automated CI/CD integration.

**Requirements:**
1. Frontend unit tests for components, hooks, and utilities using Jest and React Testing Library
2. Backend unit tests for API endpoints, middleware, and business logic
3. Integration tests for API routes with test database
4. End-to-end tests for critical user journeys using Playwright
5. Visual regression testing for UI components
6. Performance testing for API endpoints
7. CI/CD pipeline with test automation and quality gates

**Test Coverage Goals:**
- Unit tests: 80% code coverage minimum
- Integration tests: All API endpoints covered
- E2E tests: Top 5 user journeys (signup, login, core workflow)
- Visual tests: All public-facing components

**Acceptance Criteria:**
- All tests pass consistently in CI/CD pipeline
- Test execution time under 10 minutes for full suite
- Flaky tests identified and fixed (success rate >95%)
- Test reports provide actionable feedback for developers
- Code coverage metrics tracked and displayed in dashboard
- Performance regression tests prevent API slowdowns

**Implementation Notes:**
- Use MSW (Mock Service Worker) for API mocking in frontend tests
- Implement test data factories for consistent test setup
- Use database transactions for test isolation
- Create custom testing utilities for common patterns
- Implement parallel test execution for faster feedback
- Set up separate test databases for different test types
- Use Storybook for component visual testing
```

## Interactive Enhancement Sessions

### Session 1: Complex Feature Request

**Initial User Input:**
```
"I need a real-time chat system"
```

**Prompt Enhancer Dialogue:**
```
Prompt Enhancer: "I'll help enhance this real-time chat system prompt. Let me gather the essential details:

1. What's the target platform? (Web, mobile app, desktop)
2. What's the expected user scale? (10s, 100s, 1000s of concurrent users)
3. What chat features are needed? (1-on-1, groups, file sharing, etc.)
4. What's your current tech stack?
5. Are there any specific real-time requirements or constraints?"

User: "Web-based for customer support, up to 500 concurrent users, needs 1-on-1 chat with file sharing, using React and Node.js"

Prompt Enhancer: "Great! A few more clarifications:
1. Should this integrate with existing customer support tools?
2. Do you need chat history persistence and search?
3. Are there any compliance requirements (data retention, encryption)?
4. What's the expected message volume per conversation?"

User: "Yes, integrate with Zendesk, need searchable history, GDPR compliant, average 50 messages per conversation"

Prompt Enhancer: [Provides comprehensive enhanced prompt]
```

**Final Enhanced Prompt:**
```
**Context:** Customer support web application built with React frontend and Node.js backend, requiring integration with Zendesk ticketing system and GDPR compliance for EU customers.

**Task:** Implement real-time chat system supporting 500 concurrent users with 1-on-1 customer-agent conversations, file sharing capabilities, and comprehensive chat history management.

**Requirements:**
1. Real-time messaging using WebSocket connections (Socket.io)
2. File upload/sharing with virus scanning and type validation
3. Chat history persistence with full-text search capabilities
4. Zendesk integration for ticket creation from chat sessions
5. GDPR-compliant data handling with user consent management
6. Message encryption in transit and at rest
7. Agent presence indicators and typing notifications
8. Chat session routing and queue management

**Technical Specifications:**
- Support 500 concurrent WebSocket connections
- Message delivery latency <100ms
- File uploads up to 10MB with virus scanning
- Chat history searchable within 200ms
- Horizontal scaling capability for growth

**Acceptance Criteria:**
- Agents can handle multiple simultaneous conversations
- File sharing works reliably with progress indicators
- Chat history is searchable and exportable for compliance
- System maintains performance under peak load (500 concurrent users)
- Integration with Zendesk creates tickets seamlessly
- GDPR data export/deletion requests are automated

**Implementation Notes:**
- Use Redis for session storage and message caching
- Implement proper WebSocket connection management with reconnection logic
- Use PostgreSQL with full-text search for chat history
- Implement rate limiting to prevent spam and abuse
- Use CDN for file sharing with signed URLs
- Implement proper error handling and graceful degradation
- Set up monitoring for WebSocket connection health and message latency
```

## Common Enhancement Patterns

### Pattern 1: Vague Technology Requests

**Before:** "Use AI to improve the app"
**After:** Specific AI integration with defined use cases, performance metrics, and implementation approach

### Pattern 2: Missing Context

**Before:** "Fix the bug"
**After:** Detailed debugging approach with reproduction steps, expected behavior, and validation criteria

### Pattern 3: Unclear Requirements

**Before:** "Make it faster"
**After:** Performance optimization with specific metrics, profiling approach, and acceptance criteria

### Pattern 4: Implementation Without Planning

**Before:** "Add user authentication"
**After:** Complete authentication system design with security requirements, user flows, and integration points

## Tips for Effective Enhancement

1. **Ask Clarifying Questions**: Always gather context before enhancing
2. **Define Success Criteria**: Include measurable acceptance criteria
3. **Consider Edge Cases**: Address error handling and boundary conditions
4. **Include Examples**: Provide concrete code snippets when helpful
5. **Structure Clearly**: Use consistent formatting for easy implementation
6. **Think Implementation**: Consider the actual development process and challenges