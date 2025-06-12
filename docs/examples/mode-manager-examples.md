# Mode Manager Interactive Examples

## Overview

Real-world examples of using the Mode Manager mode to create, edit, and optimize Roo modes through guided conversations.

## Example 1: Creating a Database Management Mode

### Initial Request
```
User: "I want to create a mode for database management tasks"
```

### Mode Manager Response
```
I'll help you create a database management mode. Let me gather the specific requirements through some targeted questions:

1. **Database Systems**: Which databases will this mode primarily work with?
   - Relational databases (PostgreSQL, MySQL, SQLite)
   - NoSQL databases (MongoDB, Redis, CouchDB)
   - All of the above

2. **Primary Tasks**: What are the main database operations this mode should handle?
   - Schema design and migration management
   - Query optimization and performance tuning
   - Data modeling and relationship design
   - Database administration and maintenance

3. **File Access Needs**: What types of files should this mode be able to edit?
   - Migration files (.sql, .js, .ts)
   - Schema definition files
   - Database configuration files
   - All database-related files

4. **Tool Requirements**: What additional capabilities does this mode need?
   - Command line database tools (psql, mongo, etc.)
   - ConPort integration for tracking schema decisions
   - Browser access for database documentation

Please provide your preferences for each area.
```

### User Clarification
```
User: "Primarily PostgreSQL and MySQL, focusing on schema design and migrations. 
Should be able to edit migration files and schema definitions. 
Needs command line access and ConPort integration."
```

### Mode Manager Configuration Generation
```
Based on your requirements, I'll create a database management mode configuration:

**Mode Configuration:**
- **Name**: 🗄️ Database Manager
- **Slug**: database-manager
- **Focus**: PostgreSQL/MySQL schema design and migration management
- **File Access**: Migration files, SQL scripts, schema definitions
- **Tools**: Read, Edit (restricted), Command, MCP

**Generated Configuration:**
```yaml
- slug: database-manager
  name: 🗄️ Database Manager
  roleDefinition: >-
    You are a database specialist focused on PostgreSQL and MySQL schema design, 
    migration management, and data modeling. You excel at creating maintainable 
    database structures and managing schema evolution.
  whenToUse: >-
    Activate for database schema design, migration creation, query optimization,
    data modeling, and database-related architectural decisions.
  customInstructions: >-
    **Database Expertise:**
    - PostgreSQL and MySQL schema design and optimization
    - Migration script generation with rollback strategies
    - Data relationship modeling and normalization
    - Performance optimization and indexing strategies
    
    **Migration Management:**
    - Create reversible migration scripts
    - Validate schema changes against existing data
    - Generate migration sequences for complex changes
    - Document schema evolution decisions in ConPort
    
    **Best Practices:**
    - Always include rollback scripts in migrations
    - Use descriptive naming for tables, columns, and constraints
    - Consider performance implications of schema changes
    - Log major schema decisions for future reference
  groups:
    - read
    - - edit
      - fileRegex: .*migrations/.*|.*\.sql$|.*schema\.(js|ts|json)$|.*knexfile.*
        description: Database files (migrations, SQL scripts, schema definitions)
    - command
    - mcp
  source: global
```

**Validation Questions:**
1. Does this configuration match your intended use cases?
2. Are the file access restrictions appropriate?
3. Should I add any specific database tools or frameworks to the instructions?
4. Would you like to test this configuration now?
```

### Live Testing
```
User: "Yes, let's test it"

Mode Manager: "I'll add this configuration and then we can test it. Let me:

1. Add the configuration to your custom_modes.yaml
2. Switch to the new mode to verify it loads correctly
3. Test the file access permissions
4. Validate the ConPort integration

[Configuration added successfully]

Now let's test by switching to the new mode:
/mode database-manager

If the mode loads successfully, try asking it to:
- 'Create a migration for adding user profiles table'
- 'Review this schema design: [paste some SQL]'
- 'Log this database decision in ConPort'

This will validate that all the configured capabilities work as expected."
```

## Example 2: Editing an Existing Mode

### Enhancement Request
```
User: "The docs-creator mode should also handle API documentation like OpenAPI specs"
```

### Mode Manager Analysis
```
I'll help you enhance the docs-creator mode for API documentation. Let me first analyze 
the current configuration and understand your requirements:

**Current docs-creator capabilities:**
- Structured README creation with strict standards
- Markdown documentation with quality scoring
- ConPort integration for documentation tracking
- File access: *.md, *.mdx, documentation/*, README*, *.json

**API Documentation Questions:**
1. **Format Support**: Which API documentation formats should it handle?
   - OpenAPI/Swagger specifications (*.yaml, *.json)
   - AsyncAPI for event-driven APIs
   - GraphQL schema documentation
   - Plain markdown API docs

2. **Generation vs. Editing**: Should the mode:
   - Generate API docs from code/comments
   - Edit existing API specification files
   - Both generation and editing

3. **Validation Features**: Should it validate:
   - OpenAPI specification syntax
   - API endpoint consistency
   - Documentation completeness

4. **Integration Points**: How should this work with:
   - Existing documentation quality standards
   - ConPort tracking for API changes
   - Code generation from API specs

What are your preferences for each area?
```

### User Response
```
User: "Focus on editing OpenAPI specs and generating docs from them. 
Need validation and should integrate with existing quality standards."
```

### Mode Manager Update Process
```
Perfect! I'll enhance the docs-creator mode to handle OpenAPI specifications while 
maintaining its existing documentation standards. Here's my plan:

**Proposed Changes:**
1. **Expand file access** to include OpenAPI specification files
2. **Add API documentation expertise** to customInstructions
3. **Integrate OpenAPI validation** with existing quality scoring
4. **Extend ConPort tracking** for API documentation changes

**Updated Configuration:**
```yaml
# Enhanced docs-creator mode
customInstructions: >-
  [Existing documentation standards...]
  
  **API DOCUMENTATION SUPPORT:**
  - OpenAPI 3.0+ specification editing and validation
  - API documentation generation from OpenAPI specs
  - Endpoint documentation with examples and schemas
  - Integration with existing structural standards
  
  **OpenAPI Quality Standards:**
  - Complete endpoint descriptions with examples
  - Proper schema definitions with validation rules
  - Consistent naming conventions across endpoints
  - Security scheme documentation
  
  **Validation Process:**
  - Validate OpenAPI specification syntax
  - Check documentation completeness for all endpoints
  - Ensure consistent error response patterns
  - Score API docs using same 1-5 scale as other documentation

groups:
  - read
  - - edit
    - fileRegex: .*\.md$|.*\.mdx$|documentation/.*|README.*|.*\.json$|.*openapi.*|.*swagger.*|.*\.ya?ml$
      description: Documentation files including API specifications
  - command
  - mcp
```

**Before I apply these changes:**
1. Should the OpenAPI validation be as strict as the markdown standards?
2. Do you want separate ConPort tracking for API vs. regular documentation?
3. Any specific OpenAPI tools or validators I should mention in the instructions?

Once confirmed, I'll update the configuration and we can test with an actual OpenAPI file.
```

## Example 3: Resolving Mode Conflicts

### Conflict Identification
```
User: "I notice the debug mode and code mode seem to overlap when fixing bugs"
```

### Mode Manager Conflict Analysis
```
You've identified an important overlap issue. Let me analyze the current modes 
and help resolve this conflict:

**Current Mode Analysis:**
- **Code Mode**: General code writing, reviewing, refactoring
- **Debug Mode**: Bug diagnosis, troubleshooting, error analysis

**Overlap Areas I've Identified:**
1. **Bug Fixing**: Both modes can be used for fixing code issues
2. **Code Review**: Debug mode might review code for potential bugs
3. **Error Analysis**: Code mode might analyze errors during implementation

**Resolution Strategy Questions:**
1. **Primary Use Cases**: When do you typically use each mode?
   - Code mode for: _______________
   - Debug mode for: ______________

2. **Workflow Preference**: How do you envision the ideal workflow?
   - Use debug mode to identify issues, then switch to code mode to fix
   - Have debug mode handle both identification and fixing
   - Merge capabilities into a single enhanced mode

3. **Specialization Approach**: Should we:
   - **Specialize Debug Mode**: Focus purely on diagnosis and root cause analysis
   - **Enhance Code Mode**: Add better debugging capabilities
   - **Create Clear Boundaries**: Define specific triggers for each mode

4. **Tool Differences**: Are there different tool requirements?
   - Debug mode: Might need more analysis tools, less write access
   - Code mode: Needs full edit access, less specialized analysis

What's your preferred approach for resolving this overlap?
```

### User Preference
```
User: "I want debug mode to focus on analysis and diagnosis, 
then hand off to code mode for actual fixes"
```

### Mode Manager Resolution Plan
```
Excellent approach! This creates a clear separation of concerns. I'll help you 
refine both modes to work together seamlessly:

**Refined Debug Mode:**
- **Focus**: Pure diagnosis, analysis, and root cause identification
- **Output**: Clear problem descriptions and fix recommendations
- **Handoff**: Explicit recommendations to switch to code mode for implementation

**Enhanced Code Mode:**
- **Addition**: Better integration with debug mode findings
- **Focus**: Implementation, fixing, and validation of solutions

**Proposed Changes:**

**Debug Mode Refinement:**
```yaml
customInstructions: >-
  **DIAGNOSIS-FIRST APPROACH:**
  - Focus on understanding the problem before suggesting solutions
  - Provide detailed root cause analysis
  - Suggest debugging strategies and investigation steps
  - Document findings for handoff to implementation modes
  
  **HANDOFF PROTOCOL:**
  - End analysis with clear summary of findings
  - Provide specific, actionable fix recommendations
  - Suggest switching to code mode for implementation
  - Use ConPort to log debugging decisions and findings
  
  **NO DIRECT FIXES:**
  - Avoid implementing fixes directly
  - Focus on analysis, diagnosis, and planning
  - Leave implementation to specialized modes
```

**Code Mode Enhancement:**
```yaml
customInstructions: >-
  [Existing code instructions...]
  
  **DEBUG INTEGRATION:**
  - Check ConPort for recent debugging findings
  - Reference previous debug analysis when available
  - Implement fixes based on debug mode recommendations
  - Validate fixes against original problem analysis
```

**Workflow Example:**
1. User encounters bug → Switch to debug mode
2. Debug mode analyzes and documents findings in ConPort
3. Debug mode recommends: "Switch to code mode to implement the fix for [specific issue]"
4. User switches to code mode
5. Code mode retrieves debug findings and implements solution

Should I implement these changes to create this diagnostic → implementation workflow?
```

## Example 4: Testing Mode Functionality

### Validation Process
```
User: "How do I test if my new mode is working correctly?"
```

### Mode Manager Testing Guide
```
I'll guide you through comprehensive mode testing using Roo's native capabilities:

**Step 1: Configuration Validation**
```bash
# Switch to your new mode to test loading
/mode your-new-mode-slug
```

If the mode loads successfully, you'll see the mode name in the interface. 
If not, check for YAML syntax errors or missing required fields.

**Step 2: Basic Functionality Test**
```bash
# Test basic conversation
"Hello, can you explain your purpose and capabilities?"
```

The mode should respond according to its roleDefinition and customInstructions.

**Step 3: Tool Permission Testing**
```bash
# Test file reading (if read group enabled)
"Can you read the README.md file?"

# Test file editing (if edit group enabled)  
"Can you create a test file for me?"

# Test command execution (if command group enabled)
"Can you run 'ls -la' to show current directory contents?"

# Test MCP integration (if mcp group enabled)
"Can you check ConPort for recent activity?"
```

**Step 4: File Restriction Validation**
```bash
# Test edit restrictions work correctly
"Try to edit a file outside your configured patterns"
```

You should receive a FileRestrictionError if the mode correctly enforces restrictions.

**Step 5: Scenario-Based Testing**
Create 3-5 realistic scenarios for your mode:

```bash
# Example for database-manager mode:
"I need to create a migration to add a user_profiles table with foreign key to users"
"Review this SQL query for performance issues: SELECT * FROM users WHERE email LIKE '%@domain.com%'"
"Help me design a schema for a blog system with posts, comments, and tags"
```

**Step 6: Integration Testing**
```bash
# Test handoffs to other modes (if applicable)
"This seems like a job for [other-mode]. Should I switch?"

# Test ConPort integration
"Log this decision in ConPort: [some relevant decision]"
```

**Step 7: Error Handling**
```bash
# Test edge cases
"What happens if I give you an impossible request?"
"How do you handle requests outside your expertise?"
```

**Validation Checklist:**
- [ ] Mode loads without errors
- [ ] Responds appropriately to role-specific requests
- [ ] File access permissions work as configured
- [ ] Tool permissions are correctly enforced
- [ ] ConPort integration functions (if enabled)
- [ ] Error handling is graceful and helpful
- [ ] Mode boundaries are respected
- [ ] Handoff recommendations are appropriate

Would you like me to walk through this testing process with your specific mode?
```

## Best Practices Summary

### Mode Creation Workflow
1. **Start with User Needs**: Understand specific use cases and scenarios
2. **Ask Targeted Questions**: Gather detailed requirements through guided conversation
3. **Generate Configuration**: Create syntactically correct YAML based on requirements
4. **Live Testing**: Switch to mode and test with real scenarios
5. **Iterative Refinement**: Adjust based on actual usage patterns

### Validation Strategy
1. **Use Roo's Native Validation**: Leverage built-in mode loading and permission testing
2. **Test Real Scenarios**: Validate with actual use cases, not theoretical ones
3. **Verify Boundaries**: Ensure mode scope is appropriate and doesn't overlap
4. **Check Integration**: Test ConPort integration and mode handoffs
5. **Document Findings**: Use ConPort to track mode development decisions

### Maintenance Approach
1. **Regular Review**: Periodically assess mode effectiveness and usage
2. **User Feedback**: Collect and incorporate real user experiences
3. **Conflict Resolution**: Address overlaps and boundaries as system evolves
4. **Documentation Updates**: Keep mode documentation current with changes
5. **Performance Monitoring**: Ensure modes remain efficient and focused