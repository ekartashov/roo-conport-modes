# Prompt Enhancer (Isolated) Examples

## Overview

This document provides real-world examples of using the Prompt Enhancer (Isolated) mode to transform vague requests into structured, actionable prompts using universal software engineering principles without any project-specific context.

## Basic Isolated Enhancement Examples

### Example 1: Generic API Development

**Original Request:**
```
"Build a simple API"
```

**Enhancement Process:**
```
User: "Build a simple API"

Prompt Enhancer (Isolated): "I'll enhance this prompt using generic best practices. A few clarifications:

1. What type of data/resources should this API manage?
2. What programming language or framework would you prefer?
3. What's the primary use case (mobile app, web frontend, service integration)?"

User: "User authentication API, any modern language, for a web application"

Prompt Enhancer (Isolated): [Provides enhanced prompt below]
```

**Enhanced Prompt:**
```
**Context:** Modern web application requiring user authentication functionality with industry-standard security practices.

**Task:** Create secure authentication API with registration, login, and token management following OAuth 2.0 and JWT best practices.

**Requirements:**
1. User registration with email validation and password hashing
2. Login endpoint with secure credential verification
3. JWT token generation and validation middleware
4. Password reset functionality with secure token generation
5. Rate limiting for authentication attempts
6. Input validation and sanitization for all endpoints
7. HTTPS enforcement and secure header configuration
8. Session management with token refresh capability

**Acceptance Criteria:**
- Passwords are hashed using bcrypt or similar secure algorithm
- JWT tokens include appropriate expiration times and claims
- Rate limiting prevents brute force attacks (max 5 attempts per minute)
- All authentication endpoints return consistent error messages
- Password reset tokens expire within 15 minutes
- API follows OWASP security guidelines
- Comprehensive logging for security events

**Implementation Notes:**
- Use industry-standard libraries for cryptographic operations
- Implement proper CORS configuration for web frontend integration
- Store sensitive configuration in environment variables
- Use middleware pattern for token validation
- Implement proper HTTP status codes (200, 401, 403, 429)
- Consider implementing account lockout after failed attempts
- Include health check endpoint for monitoring
```

### Example 2: Database Design

**Original Request:**
```
"Design a database for an e-commerce site"
```

**Enhanced Prompt:**
```
**Context:** E-commerce web application requiring comprehensive database schema design for product catalog, user management, and order processing.

**Task:** Design normalized relational database schema with proper relationships, constraints, and indexing strategy for e-commerce functionality.

**Requirements:**
1. User management (customers, administrators, vendors)
2. Product catalog with categories, variants, and inventory tracking
3. Shopping cart and order management system
4. Payment processing integration tables
5. Product reviews and ratings system
6. Shipping and address management
7. Promotional codes and discount system
8. Audit trails for critical operations

**Database Design Specifications:**
- Primary entities: Users, Products, Categories, Orders, OrderItems, Addresses, Reviews
- Proper foreign key relationships with referential integrity
- Indexes on frequently queried columns (email, product_name, order_date)
- Constraints for data validation (email format, positive prices, valid status values)
- Timestamp tracking for created_at and updated_at on all entities
- Soft delete capability for critical business data

**Acceptance Criteria:**
- Schema supports concurrent users without data corruption
- Query performance is optimized for common operations (product search, order lookup)
- Data integrity is maintained through proper constraints
- Schema can scale to handle growth in products and orders
- Backup and recovery procedures are clearly defined
- Migration scripts are provided for schema updates

**Implementation Notes:**
- Use UUID or auto-incrementing IDs as primary keys
- Implement proper indexing strategy (B-tree for equality, composite for multi-column queries)
- Consider partitioning for large tables (orders by date range)
- Use appropriate data types (DECIMAL for currency, TEXT for descriptions)
- Implement database connection pooling for performance
- Include sample data and test queries
- Document all table relationships and business rules
```

### Example 3: Frontend Testing Strategy

**Original Request:**
```
"Add tests to my React app"
```

**Enhanced Prompt:**
```
**Context:** React application requiring comprehensive testing strategy implementation to ensure code quality, reliability, and maintainability.

**Task:** Implement multi-layered testing approach with unit tests, integration tests, and end-to-end testing coverage for React application.

**Requirements:**
1. Unit tests for components, hooks, and utility functions
2. Integration tests for component interactions and API calls
3. End-to-end tests for critical user workflows
4. Visual regression testing for UI consistency
5. Accessibility testing for WCAG compliance
6. Performance testing for component rendering
7. Test automation in CI/CD pipeline
8. Code coverage reporting and quality gates

**Testing Framework Setup:**
- Jest for unit and integration testing
- React Testing Library for component testing
- Mock Service Worker (MSW) for API mocking
- Playwright or Cypress for end-to-end testing
- Storybook for component documentation and visual testing
- ESLint testing plugin for test code quality

**Acceptance Criteria:**
- Unit test coverage above 80% for critical business logic
- All interactive components have interaction tests
- API integration tests cover success and error scenarios
- E2E tests validate complete user journeys (signup, checkout, etc.)
- Tests run reliably in CI/CD pipeline without flakiness
- Test execution time under 5 minutes for full suite
- Clear test naming convention and organization

**Implementation Notes:**
- Use React Testing Library's user-centric testing approach
- Implement custom render utilities with providers for consistent test setup
- Mock external dependencies (APIs, third-party services) consistently
- Follow AAA pattern (Arrange, Act, Assert) for test structure
- Use data-testid attributes sparingly, prefer role-based queries
- Implement test factories for creating mock data
- Set up parallel test execution for faster feedback
- Include accessibility testing with jest-axe or similar tools
```

## Advanced Isolated Enhancement Examples

### Example 4: Microservices Architecture

**Original Request:**
```
"Split my app into microservices"
```

**Enhanced Prompt:**
```
**Context:** Monolithic application requiring decomposition into microservices architecture with proper service boundaries, communication patterns, and operational considerations.

**Task:** Design and implement microservices decomposition strategy using Domain-Driven Design principles with comprehensive service architecture.

**Requirements:**
1. Service boundary identification using business capability mapping
2. Inter-service communication patterns (synchronous and asynchronous)
3. Data management strategy with service-owned databases
4. API Gateway implementation for request routing and cross-cutting concerns
5. Service discovery and load balancing configuration
6. Distributed tracing and monitoring setup
7. Circuit breaker pattern for resilience
8. Event-driven architecture for loose coupling

**Service Decomposition Strategy:**
- Identify bounded contexts using Domain-Driven Design
- Extract services based on business capabilities, not technical layers
- Ensure each service has single responsibility
- Design for failure with graceful degradation
- Implement proper authentication and authorization across services
- Plan for data consistency with eventual consistency patterns

**Acceptance Criteria:**
- Each service can be developed, tested, and deployed independently
- System maintains functionality during individual service failures
- Data consistency is maintained across service boundaries
- End-to-end request tracing is available for debugging
- Service-to-service communication latency is under acceptable limits
- Automated testing covers inter-service integration scenarios

**Implementation Notes:**
- Use Docker containers with orchestration platform (Kubernetes)
- Implement API versioning strategy for backward compatibility
- Use message queues (RabbitMQ, Apache Kafka) for asynchronous communication
- Implement saga pattern for distributed transactions
- Set up centralized logging with correlation IDs
- Use infrastructure as code for consistent environments
- Implement health checks and readiness probes for each service
- Plan for blue-green or canary deployment strategies
```

### Example 5: Security Implementation

**Original Request:**
```
"Make my app secure"
```

**Enhanced Prompt:**
```
**Context:** Web application requiring comprehensive security implementation following industry best practices and compliance standards.

**Task:** Implement multi-layered security strategy covering authentication, authorization, data protection, and threat prevention.

**Requirements:**
1. Secure authentication with multi-factor authentication support
2. Role-based access control (RBAC) with fine-grained permissions
3. Input validation and sanitization for all user inputs
4. SQL injection and XSS prevention measures
5. HTTPS enforcement with proper TLS configuration
6. Security headers implementation (CSP, HSTS, X-Frame-Options)
7. Rate limiting and DDoS protection
8. Security logging and monitoring
9. Data encryption at rest and in transit
10. Regular security scanning and vulnerability assessment

**Security Implementation Layers:**
- **Application Layer**: Input validation, output encoding, secure coding practices
- **Authentication Layer**: Strong password policies, MFA, session management
- **Authorization Layer**: RBAC, principle of least privilege, resource-level permissions
- **Network Layer**: HTTPS, secure cookies, CORS configuration
- **Infrastructure Layer**: Security groups, firewalls, intrusion detection

**Acceptance Criteria:**
- Application passes OWASP Top 10 security assessment
- All user inputs are validated and sanitized
- Authentication cannot be bypassed or brute-forced
- Sensitive data is encrypted using industry-standard algorithms
- Security headers are properly configured and tested
- Security events are logged and monitored
- Regular penetration testing shows no critical vulnerabilities

**Implementation Notes:**
- Use security-focused libraries and frameworks
- Implement Content Security Policy to prevent XSS attacks
- Use parameterized queries to prevent SQL injection
- Store passwords using bcrypt or Argon2 hashing
- Implement JWT with proper expiration and refresh strategies
- Use HTTPS Strict Transport Security (HSTS) headers
- Implement rate limiting at application and infrastructure levels
- Set up automated security scanning in CI/CD pipeline
- Create incident response procedures for security breaches
- Regular security training for development team
```

### Example 6: Performance Optimization

**Original Request:**
```
"My app is slow, make it faster"
```

**Enhanced Prompt:**
```
**Context:** Web application experiencing performance issues requiring systematic analysis and optimization across multiple layers.

**Task:** Implement comprehensive performance optimization strategy with profiling, bottleneck identification, and systematic improvements.

**Requirements:**
1. Performance profiling and bottleneck identification
2. Frontend optimization (bundle size, rendering, loading)
3. Backend optimization (query performance, caching, algorithms)
4. Database optimization (indexing, query tuning, connection pooling)
5. Network optimization (CDN, compression, HTTP/2)
6. Caching strategy implementation (browser, application, database)
7. Code splitting and lazy loading for large applications
8. Performance monitoring and alerting setup

**Performance Analysis Areas:**
- **Frontend**: Bundle analysis, Core Web Vitals, rendering performance
- **Backend**: API response times, memory usage, CPU utilization
- **Database**: Query execution plans, index usage, connection metrics
- **Network**: Time to First Byte (TTFB), resource loading, CDN effectiveness
- **User Experience**: Page load times, interaction responsiveness

**Optimization Techniques:**
- Code splitting and lazy loading for JavaScript bundles
- Image optimization with modern formats (WebP, AVIF)
- Database query optimization and proper indexing
- Implement caching at multiple levels (Redis, CDN, browser)
- Optimize critical rendering path for faster perceived performance
- Use performance budgets to prevent regressions

**Acceptance Criteria:**
- Page load times reduced by minimum 50% from baseline
- Core Web Vitals scores meet Google's recommendations
- API response times under 200ms for 95th percentile
- Database queries optimized with proper index usage
- Bundle sizes reduced through code splitting and tree shaking
- Performance monitoring dashboard shows sustained improvements
- Performance budgets prevent future regressions

**Implementation Notes:**
- Use performance profiling tools (Chrome DevTools, WebPageTest)
- Implement performance budgets in CI/CD pipeline
- Set up Real User Monitoring (RUM) for production insights
- Use CDN for static assets with proper cache headers
- Implement progressive loading strategies for content
- Optimize database with proper indexing and query analysis
- Use compression for text-based resources (gzip, brotli)
- Monitor performance metrics continuously in production
```

## Comparison Examples: Generic vs Project-Specific

### Scenario: "Create a user dashboard"

**Isolated Enhancement (Generic):**
```
**Context:** Web application requiring user dashboard with data visualization and user management features.

**Task:** Create responsive user dashboard with customizable widgets, data visualization, and user account management.

**Requirements:**
1. Responsive grid layout with draggable widgets
2. Data visualization components (charts, graphs, metrics)
3. User profile management with settings
4. Real-time data updates where applicable
5. Accessibility compliance for all dashboard elements
6. Performance optimization for large datasets
7. Export functionality for data and reports

**Technology Considerations:**
- Modern frontend framework (React, Vue, Angular)
- Chart library (Chart.js, D3.js, Recharts)
- State management solution for complex data
- Responsive CSS framework or custom grid system
```

**Project-Specific Enhancement (Hypothetical):**
```
**Context:** TaskFlow project using React/TypeScript with Material-UI, Redux Toolkit, and PostgreSQL backend.

**Task:** Create TaskFlow user dashboard integrating with existing task management system and team collaboration features.

**Requirements:**
1. Integration with existing TaskFlow API endpoints
2. Display task completion metrics from PostgreSQL analytics
3. Team performance widgets using established Redux patterns
4. Consistent with TaskFlow's Material-UI design system
5. Real-time updates via existing WebSocket connection
6. Export to PDF using TaskFlow's reporting service

**Project-Specific Details:**
- Use TaskFlow's custom hooks for API integration
- Follow established Redux slice patterns
- Integrate with TaskFlow's notification system
- Use TaskFlow's custom Material-UI theme
```

## Tips for Effective Isolated Enhancement

### Input Best Practices
1. **Be Specific About Technology**: Mention preferred languages, frameworks, or platforms
2. **Define Scope Clearly**: Specify if you want high-level architecture or detailed implementation
3. **Include Constraints**: Mention any limitations, requirements, or standards to follow
4. **Specify Use Case**: Explain the primary purpose and user context

### Enhancement Quality Indicators
- [ ] Technology-appropriate but not project-specific
- [ ] Universal best practices integrated
- [ ] Success criteria are measurable
- [ ] Implementation guidance is actionable
- [ ] No assumptions about existing infrastructure
- [ ] Suitable for any team or project context

### Common Enhancement Patterns

**Web Development:**
- REST API design with proper HTTP semantics
- Frontend component architecture with reusability
- Database schema design with normalization
- Authentication and security implementations

**System Architecture:**
- Microservices decomposition strategies
- Caching and performance optimization
- Monitoring and observability setup
- CI/CD pipeline configuration

**Quality Assurance:**
- Testing strategy across multiple layers
- Code quality and review processes
- Security assessment and compliance
- Performance benchmarking and optimization

This isolated enhancement approach ensures that your prompts can be used across different projects, teams, and contexts while maintaining high quality and industry best practices.