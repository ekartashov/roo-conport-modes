# Roo Mode Templates

## Overview

This directory contains templates for creating different types of Roo modes. Each template provides a starting point with common patterns and best practices.

## Available Templates

### 1. Basic Mode Template (`basic-mode-template.yaml`)
- **Use Case**: General-purpose modes with standard functionality
- **Features**: All tool permissions, flexible configuration
- **Best For**: New modes that need full capabilities

### 2. Restricted Edit Mode Template (`restricted-edit-mode-template.yaml`)
- **Use Case**: Modes that only edit specific file types
- **Features**: File access restrictions, domain-specific editing
- **Best For**: Specialized editors (config files, tests, docs, etc.)

### 3. Analysis Mode Template (`analysis-mode-template.yaml`)
- **Use Case**: Modes focused on analysis and recommendations
- **Features**: Read-only analysis, no direct editing
- **Best For**: Code review, architectural analysis, planning modes

## Using Templates

1. **Copy Template**: Copy the appropriate template file
2. **Customize Fields**: Replace placeholder text with your specific requirements
3. **Configure Access**: Adjust file patterns and tool permissions
4. **Test Configuration**: Use Mode Manager to validate and test

## Template Customization Guide

### Required Changes
- `slug`: Unique identifier (lowercase, hyphens only)
- `name`: Display name with appropriate emoji
- `roleDefinition`: Specific role and expertise description
- `whenToUse`: Clear activation criteria
- `customInstructions`: Detailed behavior guidelines

### File Access Patterns
Common regex patterns for restricted edit modes:

```yaml
# Test files
fileRegex: .*\.test\.(js|ts)$|.*\.spec\.(js|ts)$

# Configuration files
fileRegex: .*config.*\.(json|yaml|yml|js|ts)$

# Documentation
fileRegex: .*\.md$|.*\.mdx$|documentation/.*|README.*

# Database files
fileRegex: .*migrations/.*|.*\.sql$|.*schema\.(js|ts|json)$

# API specifications
fileRegex: .*openapi.*|.*swagger.*|.*\.ya?ml$

# Styles
fileRegex: .*\.(css|scss|sass|less)$|.*styles/.*

# Scripts
fileRegex: .*tooling/scripts/.*|.*\.sh$|.*\.ps1$
```

### Tool Permission Guidelines

- **read**: Always include for file access
- **edit**: Only if mode needs to modify files
- **browser**: For research and external resource access
- **command**: For CLI tools and system operations
- **mcp**: For ConPort/GitHub integration

## Best Practices

1. **Start Simple**: Begin with basic template, add complexity as needed
2. **Minimal Permissions**: Use least privileges necessary
3. **Clear Boundaries**: Define specific scope and limitations
4. **Test Thoroughly**: Validate with real use cases
5. **Document Well**: Include examples in customInstructions

## Validation Checklist

- [ ] Unique slug (lowercase, hyphens only)
- [ ] Meaningful name with emoji
- [ ] Specific roleDefinition
- [ ] Clear whenToUse criteria
- [ ] Detailed customInstructions with examples
- [ ] Appropriate tool permissions
- [ ] Correct file access restrictions (if applicable)
- [ ] Valid YAML syntax