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
python scripts/run_sync.py --dry-run
# or run as a module
python -m scripts.sync_system --dry-run

# Perform the actual sync
python scripts/run_sync.py
# or run as a module
python -m scripts.sync_system

# Test the sync script
python scripts/test.py
```

### 2. Demo YAML Output Format
```bash
# See the enhanced YAML format
python tools/demo.py
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
cp modes/*.yaml ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/

# Or manually append to existing configuration
cat modes/prompt-enhancer.yaml >> ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/custom_modes.yaml
cat modes/conport-maintenance.yaml >> ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/custom_modes.yaml

# Restart Roo to load new modes
# Test installation
/mode prompt-enhancer
/mode conport-maintenance
```

For detailed installation instructions, see [Local Mode Installation Guide](docs/guides/local-mode-installation.md).

### Requirements
- Roo system with custom mode support
- ConPort MCP server (for ConPort Maintenance mode)
- VSCodium/VSCode with Roo extension

## Documentation

For detailed information about the project structure, individual modes, guides, and examples, please see our comprehensive documentation:

- **[Project Documentation Hub](docs/README.md)**: Your starting point for all project-related documentation.

## Usage

### Available Modes

- **🏗️ Architect** (`architect`) - High-level planning and system design.
- **❓ Ask** (`ask`) - Answers conceptual or informational questions about software development.
- **💻 Code** (`code`) - Enhanced code writing, reviewing, and refactoring with ConPort integration.
- **🗃️ ConPort Maintenance** (`conport-maintenance`) - Database maintenance and optimization for ConPort.
- **🪲 Debug** (`debug`) - Diagnosis, troubleshooting, and fixing buggy code.
- **📝 Docs** (`docs`) - Creates, audits, and manages technical documentation.
- **🛠️ Mode Manager** (`mode-manager`) - Interactive creation and management of Roo modes.
- **🪃 Orchestrator** (`orchestrator`) - Coordinates complex tasks by delegating to specialized modes.
- **🪄 Prompt Enhancer** (`prompt-enhancer`) - Refines prompts for better LLM output with project context.
- **🪄 Prompt Enhancer (Isolated)** (`prompt-enhancer-isolated`) - Generic prompt enhancement without project context.

### Local Mode Files

This repository now contains local mode definitions in the `modes/` directory:
- [`architect.yaml`](modes/architect.yaml:0) - High-level planning and system design mode.
- [`ask.yaml`](modes/ask.yaml:0) - Conceptual and informational question-answering mode.
- [`code.yaml`](modes/code.yaml:0) - Enhanced Code mode with automatic ConPort docs (overrides built-in).
- [`conport-maintenance.yaml`](modes/conport-maintenance.yaml:0) - ConPort database management and maintenance mode.
- [`debug.yaml`](modes/debug.yaml:0) - Code diagnosis and troubleshooting mode.
- [`docs.yaml`](modes/docs.yaml:0) - Documentation creation, auditing, and management mode.
- [`mode-manager.yaml`](modes/mode-manager.yaml:0) - Interactive creation and management of Roo modes.
- [`orchestrator.yaml`](modes/orchestrator.yaml:0) - Strategic workflow orchestration mode.
- [`prompt-enhancer.yaml`](modes/prompt-enhancer.yaml:0) - Project-aware prompt enhancement and structuring.
- [`prompt-enhancer-isolated.yaml`](modes/prompt-enhancer-isolated.yaml:0) - Generic prompt enhancement without project context.

### Project Structure

```
roo-modes/
├── README.md                          # This file
├── modes/                             # Local mode definitions
│   ├── architect.yaml                 # System architecture and planning mode
│   ├── ask.yaml                       # Q&A mode for software development topics
│   ├── code.yaml                      # Code mode with enhanced docs (overrides built-in)
│   ├── conport-maintenance.yaml       # ConPort maintenance mode
│   ├── debug.yaml                     # Debugging and troubleshooting mode
│   ├── docs.yaml                      # Documentation mode (creator & auditor)
│   ├── mode-manager.yaml              # Mode management mode
│   ├── orchestrator.yaml              # Workflow orchestration mode
│   ├── prompt-enhancer.yaml           # Project-aware prompt enhancement mode
│   └── prompt-enhancer-isolated.yaml  # Generic prompt enhancement mode
├── scripts/                           # Utility and automation scripts
│   ├── run_sync.py                    # Convenience runner for the sync system
│   ├── sync_system/                   # Consolidated sync system package
│   │   ├── __init__.py                # Package initialization
│   │   ├── __main__.py                # Module entry point
│   │   ├── pyproject.toml             # Package build configuration
│   │   ├── sync.py                    # Main sync implementation with relative path detection
│   │   └── tests/                     # Test suite for sync system
│   │       ├── __init__.py            # Test package initialization
│   │       ├── test_discovery.py      # Tests for mode discovery
│   │       ├── test_integration.py    # Integration tests
│   │       ├── test_ordering.py       # Tests for mode ordering
│   │       └── test_validation.py     # Tests for mode validation
│   └── test.py                        # Test suite for original sync script (legacy)
├── tools/                             # Development and demonstration tools
│   └── demo.py         # YAML output format demo
├── docs/                              # Detailed docs
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
│   ├── enhanced-prompt-enhancer-config.md # Configuration docs
│   ├── enhanced-prompt-enhancer-implementation.md # Implementation details
│   └── prompt-enhancer-solution-analysis.md # Solution analysis
├── templates/                         # Mode templates for quick creation
│   ├── README.md                      # Template usage guide
│   ├── basic-mode-template.yaml       # General-purpose mode template
│   ├── restricted-edit-mode-template.yaml  # File-restricted editor template
│   └── analysis-mode-template.yaml    # Analysis-focused mode template
└── context_portal/                    # ConPort database and vector storage
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
cp templates/basic-mode-template.yaml my-new-mode.yaml

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

We welcome contributions! Please see our **[Contributing Guidelines](CONTRIBUTING.md)** for detailed information on how to get involved, report issues, and submit pull requests.

All contributors are expected to adhere to our **[Code of Conduct](CODE_OF_CONDUCT.md)**.

### Quick Summary for Mode Contributions:
1. Use Mode Manager for interactive mode creation.
2. Follow templates in the [`templates/`](templates/) directory for consistency.
3. Test thoroughly with real-world scenarios.
4. Document the mode's purpose, usage patterns, and any specific examples in the [`docs/`](docs/) directory.
5. Validate your new mode against the existing mode ecosystem to ensure compatibility and avoid conflicts.

## Development Tools

### Scripts ([`scripts/`](scripts/))
- **[`run_sync.py`](scripts/run_sync.py)** - Convenience runner for the sync system
- **[`sync_system/`](scripts/sync_system/)** - Consolidated sync system as a Python package
  - **[`sync.py`](scripts/sync_system/sync.py)** - Main sync implementation with relative path detection
  - **[`tests/`](scripts/sync_system/tests/)** - Test suite for sync system
- **[`test.py`](scripts/test.py)** - Test suite for original sync script (legacy)

### Tools ([`tools/`](tools/))
- **[`demo.py`](tools/demo.py)** - Demonstrate enhanced YAML output format

## Resources

### Documentation
- [Mode Manager Guide](docs/guides/mode-manager-guide.md) - Comprehensive mode management docs
- [Prompt Enhancer Guide](docs/guides/prompt-enhancer-guide.md) - Project-aware prompt enhancement workflows and techniques
- [Prompt Enhancer (Isolated) Guide](docs/guides/prompt-enhancer-isolated-guide.md) - Generic prompt enhancement without project context
- [ConPort Maintenance Guide](docs/guides/conport-maintenance-guide.md) - Database maintenance procedures and best practices
- [Enhanced Code Guide](docs/guides/code-enhanced-guide.md) - Coding with automatic knowledge docs
- [Local Mode Installation](docs/guides/local-mode-installation.md) - Installation guide for local mode definitions

### Examples and Workflows
- [Mode Manager Examples](docs/examples/mode-manager-examples.md) - Real-world mode creation scenarios
- [Prompt Enhancer Examples](docs/examples/prompt-enhancer-examples.md) - Project-aware prompt enhancement sessions
- [Prompt Enhancer (Isolated) Examples](docs/examples/prompt-enhancer-isolated-examples.md) - Generic prompt enhancement workflows
- [ConPort Maintenance Examples](docs/examples/conport-maintenance-examples.md) - Database maintenance and optimization workflows

### Templates and Analysis
- [Mode Templates](templates/) - Starting points for creating new modes
- [Analysis Documents](analysis/) - Project design and analysis docs
- [Local Modes](modes/) - Ready-to-use mode definitions for immediate deployment