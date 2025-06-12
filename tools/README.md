# Tools Directory

This directory contains development and demonstration tools for the Roo Modes project.

## Available Tools

### [`demo_output_example.py`](demo_output_example.py)
**Purpose**: Demonstrates the enhanced YAML output format for custom_modes.yaml configuration.

**Features**:
- Shows proper JSON schema compliance
- Demonstrates complex group structure formatting
- Validates output format
- Highlights key improvements in YAML generation

**Usage**:
```bash
# Run the demo
python tooling/tooling/tooling/tools/demo_output_example.py

# The demo will show:
# - Generated YAML output
# - Format validation results
# - Key improvements summary
```

**Example Output**:
```yaml
customModes:
  - slug: docs-writer
    name: Documentation Writer
    roleDefinition: >-
      You are a technical writer specializing in clear, concise developer documentation.
      You focus on giving examples and step-by-step guides.
    whenToUse: Use this mode whenever generating or editing user-facing docs.
    customInstructions: >-
      • Always include code snippets in fenced blocks.
      • Validate all YAML examples before publishing.
    groups:
      - read
      - edit
      - - edit
        - fileRegex: \.(md|mdx)$
          description: Markdown and MDX files only
      - browser
    source: global
```

## Tool Requirements

- Python 3.7+
- PyYAML library
- Access to sync_modes_to_global_config module

## Key Features Demonstrated

1. **Schema Validation**: Proper JSON schema compliance
2. **Complex Groups**: File restriction patterns with regex
3. **Slug Patterns**: Valid naming conventions (^[a-z0-9\\-]+$)
4. **Required Fields**: Enforcement of mandatory configuration
5. **Output Verification**: YAML format validation

## Development Usage

These tools are primarily for:
- **Development Testing**: Validating configuration changes
- **Format Verification**: Ensuring YAML output correctness
- **Example Generation**: Creating sample configurations
- **Quality Assurance**: Testing before deployment