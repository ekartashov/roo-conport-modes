# Mode Manager Guide

## Overview

The Mode Manager mode (`🛠️ Mode Manager`) enables interactive creation, editing, and optimization of Roo AI system modes through guided conversations and scenario-based validation.

### Quick Start
```bash
# Switch to Mode Manager mode
/mode mode-manager

# Create a new mode
"I want to create a mode for database management tasks"

# Edit existing mode
"The debug mode needs better error analysis capabilities"
```

## Installation

The Mode Manager mode is automatically available in Roo systems with custom mode support. No additional installation required.

## Usage

### Creating New Modes

The Mode Manager guides you through interactive mode creation:

1. **Domain Discovery**: Defines the specific area of focus
2. **Capability Mapping**: Determines required tools and permissions  
3. **Behavior Design**: Establishes mode personality and expertise
4. **Scenario Validation**: Tests against real-world use cases
5. **Configuration Generation**: Creates validated YAML configuration

#### Example Interaction Flow:
```
User: "I want a mode for API testing and validation"

Mode Manager: "Let me help you create an API testing mode. I need to understand the specific requirements:

1. What types of APIs will this mode work with? (REST, GraphQL, gRPC, etc.)
2. What testing scenarios should it handle? (functional, performance, security?)
3. Does it need to generate test data or just validate responses?
4. Should it integrate with specific testing frameworks or tools?"
```

### Editing Existing Modes

Modify existing mode configurations safely:

1. **Current State Analysis**: Loads and reviews existing configuration
2. **Change Requirements**: Understands modification goals
3. **Impact Assessment**: Evaluates effects on functionality
4. **Incremental Updates**: Applies changes with validation
5. **Testing Confirmation**: Verifies modifications work correctly

#### Example Modification:
```
User: "The docs-creator mode should also handle API documentation"

Mode Manager: "I'll help you expand the docs-creator mode. Let me analyze the current configuration and understand:

1. What types of API documentation formats? (OpenAPI, AsyncAPI, etc.)
2. Should it auto-generate from code or work with existing specs?
3. Do you need new file access patterns for API definition files?
4. How should this integrate with the existing documentation standards?"
```

### Scenario-Based Validation

Test modes against concrete use cases:

- **Primary Use Cases**: Core functionality scenarios
- **Edge Cases**: Error conditions and boundary situations  
- **Integration Points**: Interaction with other modes
- **Performance Considerations**: Tool usage and efficiency

### Conflict Resolution

Identify and resolve mode overlaps:

- **Functional Analysis**: Compare mode capabilities
- **Usage Pattern Review**: Understand when each mode is used
- **Resolution Strategies**: Merger, specialization, or deprecation
- **Migration Planning**: Handle existing user workflows

## Configuration

### Mode Structure

All modes require these fields:

```yaml
- slug: mode-identifier
  name: 🔧 Mode Display Name  
  roleDefinition: >-
    Core role and expertise description
  whenToUse: >-
    Activation criteria and use cases
  customInstructions: >-
    Detailed behavior and implementation guidance
  groups:
    - read          # File reading access
    - edit          # File modification access (with optional restrictions)
    - browser       # Web browsing capabilities
    - command       # CLI command execution
    - mcp           # MCP server integration
  source: global
```

### File Access Restrictions

Limit edit access to specific file patterns:

```yaml
groups:
  - read
  - - edit
    - fileRegex: .*\.test\.(js|ts)$|.*\.spec\.(js|ts)$
      description: Test files only
  - command
```

### Tool Permission Levels

- **read**: File reading, code analysis, search operations
- **edit**: File modification, content creation/updates
- **browser**: Web browsing, external resource access
- **command**: CLI execution, system operations
- **mcp**: MCP server integration (ConPort, GitHub, etc.)

## Examples

### Database Management Mode

```yaml
- slug: database-manager
  name: 🗄️ Database Manager
  roleDefinition: >-
    You are a database specialist focused on schema design, migration management, 
    query optimization, and data integrity validation across multiple database systems.
  whenToUse: >-
    Activate for database schema changes, migration creation, query optimization,
    data modeling, and database-related debugging tasks.
  customInstructions: >-
    **Database Expertise:**
    - Schema design and normalization
    - Migration script generation and validation
    - Query performance analysis and optimization
    - Data integrity and constraint management
    
    **Supported Systems:**
    - PostgreSQL, MySQL, SQLite
    - MongoDB, Redis
    - Database migration tools (Knex, Prisma, etc.)
  groups:
    - read
    - - edit
      - fileRegex: .*migrations/.*|.*\.sql$|.*schema\.(js|ts|json)$
        description: Database files (migrations, SQL scripts, schema definitions)
    - command
    - mcp
  source: global
```

### API Testing Mode

```yaml
- slug: api-tester
  name: 🔌 API Tester
  roleDefinition: >-
    You are an API testing specialist focused on endpoint validation, test automation,
    performance testing, and API documentation verification.
  whenToUse: >-
    Activate for API endpoint testing, test suite creation, performance validation,
    and API contract verification tasks.
  customInstructions: >-
    **Testing Capabilities:**
    - REST/GraphQL endpoint validation
    - Test case generation and automation
    - Performance and load testing
    - API contract and schema validation
    
    **Framework Integration:**
    - Jest, Mocha, Postman collections
    - OpenAPI/Swagger specifications
    - Performance testing tools
  groups:
    - read
    - - edit
      - fileRegex: .*test.*api.*|.*\.test\.(js|ts)$|.*openapi.*|.*swagger.*
        description: API test files and specifications
    - browser
    - command
    - mcp
  source: global
```

## Troubleshooting

### Common Issues

**Mode Creation Fails**
- Check YAML syntax validity
- Ensure slug is unique and follows naming conventions
- Verify required fields are present
- Confirm file permissions for configuration directory

**Mode Not Loading**
- Validate YAML structure against existing modes
- Check for conflicting slugs or names
- Verify groups array format is correct
- Restart Roo system after configuration changes

**Permission Errors**
- Review file access patterns in edit restrictions
- Ensure tool permissions match mode requirements
- Check MCP server integration settings
- Validate command execution permissions

**Mode Conflicts**
- Use Mode Manager conflict resolution workflow
- Analyze overlapping functionality between modes
- Consider mode specialization or merger strategies
- Update whenToUse criteria for clearer boundaries

### Roo-Native Validation

The Mode Manager leverages Roo's built-in validation capabilities:

**YAML Syntax Validation**
```bash
# Test mode configuration loading
/mode mode-manager
"Test if my new mode configuration is valid"
```

**Mode Loading Test**
```bash
# Switch to newly created mode to verify it loads
/mode your-new-mode-slug
"Hello, testing mode functionality"
```

**Permission Testing**
```bash
# Test file access permissions
/mode your-new-mode-slug
"Try to read/edit files according to configured restrictions"
```

**Tool Access Validation**
```bash
# Test MCP integration
/mode your-new-mode-slug
"Test ConPort integration" # (if mcp group enabled)

# Test command execution
"Run a simple command" # (if command group enabled)
```

### Validation Workflow

1. **Configuration Syntax**: Mode Manager validates YAML structure during creation
2. **Field Completeness**: Checks all required fields are present and properly formatted
3. **Naming Conventions**: Verifies slug and name follow Roo conventions
4. **Permission Logic**: Ensures tool access matches intended functionality
5. **Live Testing**: Switch to mode and test actual functionality in real scenarios
6. **Integration Check**: Verify mode works harmoniously with existing mode ecosystem

### Best Practices

1. **Iterative Development**: Create basic version, test live, then enhance based on real usage
2. **Live Validation**: Always test modes by actually switching to them and performing tasks
3. **Permission Minimization**: Use least privileges necessary for intended functionality
4. **Clear Boundaries**: Define distinct use cases that don't overlap with existing modes
5. **Real Scenario Testing**: Validate with actual user workflows, not hypothetical cases
6. **Documentation Integration**: Include practical examples in customInstructions field
7. **Continuous Refinement**: Update modes based on usage patterns and user feedback