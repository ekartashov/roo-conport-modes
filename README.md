# Roo Modes Collection

## Overview

This repository contains custom modes for the Roo multi-mode AI system, enabling specialized AI behaviors for different software development tasks through interactive mode management.

### Quick Start
```bash
# View available custom modes
cat ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/custom_modes.yaml

# Switch to Mode Manager mode
/mode mode-manager

# Create a new mode
"I want to create a mode for [specific task]"
```

## Quick Start

### 1. Sync Modes to Global Config
```bash
# Preview the sync (recommended first step)
python tooling/tooling/scripts/sync_modes_to_global_config.py --dry-run

# Perform the actual sync
python tooling/tooling/scripts/sync_modes_to_global_config.py

# Test the sync script
python tooling/tooling/scripts/test_sync_modes.py
```

### 2. Demo YAML Output Format
```bash
# See the enhanced YAML format
python tooling/tooling/tooling/tools/demo_output_example.py
```

### 3. Use a Mode
```bash
# Switch to any available mode
/mode prompt-enhancer
/mode conport-maintenance
/mode code
```

## Installation

### Quick Setup
```bash
# Copy local modes to global configuration
cp core/modes/*.yaml ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/

# Or manually append to existing configuration
cat core/core/modes/prompt-enhancer.yaml >> ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/custom_modes.yaml
cat core/core/modes/conport-maintenance.yaml >> ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/custom_modes.yaml

# Restart Roo to load new modes
# Test installation
/mode prompt-enhancer
/mode conport-maintenance
```

For detailed installation instructions, see [Local Mode Installation Guide](documentation/guides/local-mode-installation.md).

### Requirements
- Roo system with custom mode support
- ConPort MCP server (for ConPort Maintenance mode)
- VSCodium/VSCode with Roo extension

## Usage

### Available Modes

- **🛠️ Mode Manager** (`mode-manager`) - Interactive creation and management of Roo modes
- **🪄 Prompt Enhancer** (`prompt-enhancer`) - Refines prompts for better LLM output with project context
- **🪄 Prompt Enhancer (Isolated)** (`prompt-enhancer-isolated`) - Generic prompt enhancement without project context
- **🗃️ ConPort Maintenance** (`conport-maintenance`) - Database maintenance and optimization
- **� Documentation Creator** (`docs-creator`) - Creates structured documentation
- **🔍 Documentation Auditor** (`docs-auditor`) - Audits documentation quality

### Local Mode Files

This repository now contains local mode definitions in the `core/modes/` directory:
- [`code.yaml`](core/core/modes/code.yaml) - Enhanced Code mode with automatic ConPort documentation (overrides built-in)
- [`prompt-enhancer.yaml`](core/core/modes/prompt-enhancer.yaml) - Project-aware prompt enhancement and structuring
- [`prompt-enhancer-isolated.yaml`](core/core/modes/prompt-enhancer-isolated.yaml) - Generic prompt enhancement without project context
- [`conport-maintenance.yaml`](core/core/modes/conport-maintenance.yaml) - ConPort database management

### Project Structure

```
roo-modes/
├── README.md                          # This file
├── modes/                             # Local mode definitions
│   ├── code.yaml                      # Code mode with enhanced documentation (overrides built-in)
│   ├── prompt-enhancer.yaml           # Project-aware prompt enhancement mode
│   ├── prompt-enhancer-isolated.yaml  # Generic prompt enhancement mode
│   └── conport-maintenance.yaml       # ConPort maintenance mode
├── scripts/                           # Utility and automation scripts
│   ├── sync_modes_to_global_config.py # Mode configuration sync script
│   └── test_sync_modes.py             # Test suite for sync script
├── tools/                             # Development and demonstration tools
│   └── demo_output_example.py         # YAML output format demo
├── docs/                              # Detailed documentation
│   ├── mode-manager-guide.md          # Comprehensive Mode Manager guide
│   ├── prompt-enhancer-guide.md       # Project-aware Prompt Enhancer usage guide
│   ├── prompt-enhancer-isolated-guide.md # Generic Prompt Enhancer usage guide
│   ├── conport-maintenance-guide.md   # ConPort Maintenance guide
│   ├── code-guide.md                  # Enhanced Code mode guide
│   └── local-mode-installation.md     # Installation guide for local modes
├── examples/                          # Interactive examples and workflows
│   ├── mode-manager-examples.md       # Real-world usage scenarios
│   ├── prompt-enhancer-examples.md    # Project-aware prompt enhancement workflows
│   ├── prompt-enhancer-isolated-examples.md # Generic prompt enhancement workflows
│   └── conport-maintenance-examples.md # ConPort maintenance operations
├── analysis/                          # Project analysis and design documents
│   ├── enhanced-prompt-enhancer-design.md # Enhanced prompt enhancer design
│   ├── enhanced-prompt-enhancer-config.md # Configuration documentation
│   ├── enhanced-prompt-enhancer-implementation.md # Implementation details
│   └── prompt-enhancer-solution-analysis.md # Solution analysis
├── templates/                         # Mode templates for quick creation
│   ├── README.md                      # Template usage guide
│   ├── basic-mode-template.yaml       # General-purpose mode template
│   ├── restricted-edit-mode-template.yaml  # File-restricted editor template
│   └── analysis-mode-template.yaml    # Analysis-focused mode template
└── data/context_portal/                    # ConPort database and vector storage
    ├── context.db                     # SQLite database for ConPort
    └── conport_vector_data/           # Vector embeddings storage
```

## Configuration

Modes are defined in: `~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/custom_modes.yaml`

### Mode Structure

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

## Examples

### Creating a Database Mode

```bash
/mode mode-manager
"I want to create a mode for database management"

# Mode Manager will guide you through:
# 1. Database systems (PostgreSQL, MySQL, etc.)
# 2. File access needs (migrations, schemas)
# 3. Tool requirements (CLI, ConPort)
# 4. Scenario validation
```

### Using Templates

```bash
# Copy a template
cp core/core/templates/basic-mode-template.yaml my-new-mode.yaml

# Customize the configuration
# Add to custom_modes.yaml
# Test with Mode Manager
```

## Troubleshooting

### Common Issues

- **Mode Not Loading**: Check YAML syntax and required fields
- **Permission Errors**: Verify file access patterns and tool permissions
- **Mode Conflicts**: Use Mode Manager to analyze and resolve overlaps

### Validation

```bash
# Test mode loading
/mode your-new-mode

# Validate permissions
"Test file access and tool usage"

# Check integration
"Verify ConPort and MCP functionality"
```

## Contributing

1. Use Mode Manager for interactive mode creation
2. Follow templates for consistency
3. Test thoroughly with real scenarios
4. Document mode purpose and usage patterns
5. Validate against existing mode ecosystem

## Development Tools

### Scripts ([`scripts/`](scripts/))
- **[`sync_modes_to_global_config.py`](tooling/scripts/sync_modes_to_global_config.py)** - Sync local modes to global configuration with validation
- **[`test_sync_modes.py`](tooling/scripts/test_sync_modes.py)** - Comprehensive test suite for sync validation

### Tools ([`tools/`](tools/))
- **[`demo_output_example.py`](tooling/tooling/tools/demo_output_example.py)** - Demonstrate enhanced YAML output format

## Resources

### Documentation
- [Mode Manager Guide](documentation/guides/mode-manager-guide.md) - Comprehensive mode management documentation
- [Prompt Enhancer Guide](documentation/guides/prompt-enhancer-guide.md) - Project-aware prompt enhancement workflows and techniques
- [Prompt Enhancer (Isolated) Guide](documentation/guides/prompt-enhancer-isolated-guide.md) - Generic prompt enhancement without project context
- [ConPort Maintenance Guide](documentation/guides/conport-maintenance-guide.md) - Database maintenance procedures and best practices
- [Enhanced Code Guide](documentation/guides/code-guide.md) - Coding with automatic knowledge documentation
- [Local Mode Installation](documentation/guides/local-mode-installation.md) - Installation guide for local mode definitions

### Examples and Workflows
- [Mode Manager Examples](documentation/documentation/examples/mode-manager-examples.md) - Real-world mode creation scenarios
- [Prompt Enhancer Examples](documentation/documentation/examples/prompt-enhancer-examples.md) - Project-aware prompt enhancement sessions
- [Prompt Enhancer (Isolated) Examples](documentation/documentation/examples/prompt-enhancer-isolated-examples.md) - Generic prompt enhancement workflows
- [ConPort Maintenance Examples](documentation/documentation/examples/conport-maintenance-examples.md) - Database maintenance and optimization workflows

### Templates and Analysis
- [Mode Templates](templates/) - Starting points for creating new modes
- [Analysis Documents](analysis/) - Project design and analysis documentation
- [Local Modes](modes/) - Ready-to-use mode definitions for immediate deployment