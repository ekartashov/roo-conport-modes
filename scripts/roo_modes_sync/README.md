# Roo Modes Sync

A modular synchronization system for Roo modes configuration, enabling both global (system-wide) and local (project-specific) mode application with Model Context Protocol (MCP) integration.

## Overview

Roo Modes Sync provides a flexible and extensible system for managing Roo assistant modes. It allows you to discover, validate, order, and synchronize mode configurations across different contexts:

- **Global synchronization**: Apply modes system-wide for consistent experience
- **Local synchronization**: Configure project-specific mode overrides
- **Dynamic discovery**: Automatically find and categorize available modes
- **Validation**: Ensure mode configurations meet required standards
- **Flexible ordering**: Multiple strategies for arranging modes in a meaningful sequence
- **MCP integration**: Integrate with AI assistants through the Model Context Protocol

## Directory Structure

The Roo modes synchronization functionality is organized as follows:

```
scripts/
├── roo_modes_sync/           # Main package (this project)
│   ├── core/                 # Core functionality modules
│   │   ├── discovery.py      # Mode discovery and categorization
│   │   ├── validation.py     # Configuration validation
│   │   ├── ordering.py       # Ordering strategies
│   │   └── sync.py           # Main synchronization logic
│   ├── cli.py                # Command-line interface
│   ├── mcp.py                # Model Context Protocol server
│   ├── exceptions.py         # Custom exceptions
│   ├── pyproject.toml        # Package configuration
│   └── README.md             # This documentation
│
├── run_sync.py               # Entry point script
├── order.yaml                # Example ordering configuration
└── example_configs/          # Example configuration files
```

This modular implementation provides a clean separation of concerns and a more maintainable architecture, while adding new features like local mode application and MCP server integration.

## Installation

```bash
# From source
pip install -e .

# Or once published
pip install roo-modes-sync
```

## Usage

### Command Line Interface

#### Global Synchronization

Synchronize modes to the global system-wide configuration:

```bash
# Using default settings
roo-modes sync-global

# With custom strategy and config path
roo-modes sync-global --strategy alphabetical --config /path/to/custom/config.yaml

# Dry run to see what would be done
roo-modes sync-global --dry-run
```

#### Local Synchronization

Synchronize modes to a local project directory:

```bash
# Basic local sync
roo-modes sync-local /path/to/project

# With custom strategy
roo-modes sync-local /path/to/project --strategy alphabetical

# Dry run to see what would be done
roo-modes sync-local /path/to/project --dry-run
```

#### Listing Modes

List available modes and their status:

```bash
roo-modes list
```

Example output:
```
Found 10 modes in /path/to/modes

Categories:
  🏗️ Core Workflow: 5 modes
  💻+ Enhanced Variants: 2 modes
  🔧 Specialized Tools: 2 modes
  📋 Discovered: 1 modes

Modes:
  [✓] Code (code) - core
  [✓] Architect (architect) - core
  [✓] Debug (debug) - core
  [✓] Ask (ask) - core
  [✓] Orchestrator (orchestrator) - core
  [✓] Prompt Enhancer (prompt-enhancer) - specialized
  [✓] Docs Creator (docs-creator) - specialized
  [✓] Code Enhanced (code-enhanced) - enhanced
  [✓] Debug Plus (debug-plus) - enhanced
  [✓] Custom Mode (custom-mode) - discovered
```

#### MCP Server

Run as an MCP server for AI assistant integration:

```bash
roo-modes serve
```

### Python API

#### Basic Usage

```python
from pathlib import Path
from scripts.roo_modes_sync.core.sync import ModeSync

# Initialize with modes directory
sync = ModeSync(Path("/path/to/modes"))

# Global synchronization
sync.set_global_config_path()  # Use default path
sync.sync_modes(strategy_name="strategic")

# Local synchronization
sync.set_local_config_path(Path("/path/to/project"))
sync.sync_modes(strategy_name="alphabetical")

# Get sync status
status = sync.get_sync_status()
print(f"Found {status['mode_count']} modes")
```

#### Advanced Usage with Options

```python
from pathlib import Path
from scripts.roo_modes_sync.core.sync import ModeSync

# Initialize sync object
sync = ModeSync(Path("/path/to/modes"))

# Set local project directory
sync.set_local_config_path(Path("/path/to/project"))

# Sync with custom options
options = {
    "exclude": ["legacy-mode", "experimental-mode"],
    "priority_first": ["code", "architect"]
}

sync.sync_modes(
    strategy_name="category",
    options=options
)

# Create backup of existing config
sync.backup_existing_config()

# Load and validate a specific mode
mode_config = sync.load_mode_config("code")
```

## Configuration

### Ordering Strategies

The system supports several ordering strategies that can be used when synchronizing modes:

- **Strategic** (default): Orders modes based on predefined strategic importance, with core modes first, followed by enhanced, specialized, and discovered modes.
- **Alphabetical**: Orders modes alphabetically within each category.
- **Category**: Orders modes by category with configurable category order.
- **Custom**: Orders modes according to a custom list provided in options.

Strategy options:
- `exclude`: List of mode slugs to exclude from the configuration
- `priority_first`: List of mode slugs to place at the beginning of the order
- `category_order`: (Category strategy) Custom order of categories
- `within_category_order`: (Category strategy) How to order modes within categories
- `custom_order`: (Custom strategy) Explicit ordered list of mode slugs

### Mode Files

Mode configuration files are YAML files with the following structure:

```yaml
slug: example-mode
name: Example Mode
roleDefinition: >-
  You are a helpful assistant.
whenToUse: Use this mode when you need help with examples.
customInstructions: >-
  Always provide clear examples.
groups:
  - read
  - - edit
    - fileRegex: \.py$
      description: Python files
```

#### Required Fields

- `slug`: Unique identifier for the mode (lowercase with hyphens)
- `name`: Display name for the mode
- `roleDefinition`: The primary instruction for the AI assistant
- `groups`: Access groups and file type restrictions

#### Optional Fields

- `whenToUse`: Description of when this mode should be used
- `customInstructions`: Additional instructions for the AI assistant

#### Group Configuration

Groups can be configured in two ways:

1. Simple string groups: `read`, `edit`, or `browser`
2. Complex groups with file type restrictions:
   ```yaml
   - - edit
     - fileRegex: \.py$
       description: Python files
   ```

### Environment Variables

- `ROO_MODES_DIR`: Path to the directory containing mode YAML files

## MCP Integration

Roo Modes Sync provides MCP server capabilities for integration with AI assistants that support the Model Context Protocol. The MCP server exposes the following tools:

- `sync_modes`: Synchronize Roo modes to a target directory
- `get_sync_status`: Get current sync status with mode information

And the following resources:

- `modes/{mode_slug}`: Access to individual mode configuration

#### MCP Usage Examples

Example 1: Synchronizing modes to a project directory using the MCP interface:

```json
// Request
{
  "type": "tool_call",
  "tool": {
    "name": "sync_modes",
    "arguments": {
      "target": "/path/to/project",
      "strategy": "strategic",
      "options": {
        "priority_first": ["code", "architect"],
        "exclude": ["legacy-mode"]
      }
    }
  }
}

// Response
{
  "type": "tool_call_response",
  "content": {
    "result": {
      "success": true,
      "message": "Successfully synced modes to /path/to/project"
    }
  }
}
```

Example 2: Getting sync status via MCP:

```json
// Request
{
  "type": "tool_call",
  "tool": {
    "name": "get_sync_status",
    "arguments": {}
  }
}

// Response
{
  "type": "tool_call_response",
  "content": {
    "result": {
      "mode_count": 10,
      "categories": [
        {
          "name": "core",
          "display_name": "Core Workflow",
          "icon": "🏗️",
          "count": 5
        },
        // Other categories...
      ],
      "modes": [
        {
          "slug": "code",
          "name": "Code",
          "category": "core",
          "valid": true
        },
        // Other modes...
      ]
    }
  }
}
```

Example 3: Accessing a specific mode configuration:

```json
// Request
{
  "type": "resource_access",
  "uri": "modes/code"
}

// Response
{
  "type": "resource_response",
  "content": {
    "mode": {
      "slug": "code",
      "name": "💻 Code",
      "roleDefinition": "You are an expert developer...",
      "groups": ["code", "core"],
      "source": "global"
    }
  }
}
```

## Architecture

The codebase is organized in a modular architecture with clear separation of concerns:

- **Core Components**:
  - `core/discovery.py`: Finding and categorizing available modes
  - `core/validation.py`: Ensuring mode configurations are valid
  - `core/ordering.py`: Arranging modes in a specific order
  - `core/sync.py`: Main synchronization functionality

- **Interfaces**:
  - `cli.py`: Command line interface
  - `mcp.py`: Model Context Protocol server

- **Support**:
  - `exceptions.py`: Custom exceptions

### Class Structure

- **ModeDiscovery**: Handles finding and categorizing mode files
- **ModeValidator**: Validates mode configuration structure and content
- **OrderingStrategy**: Base class for mode ordering strategies
  - **StrategicOrderingStrategy**: Orders by predefined importance
  - **AlphabeticalOrderingStrategy**: Orders alphabetically within categories
  - **CategoryOrderingStrategy**: Orders by customizable category order
  - **CustomOrderingStrategy**: Orders by explicit custom list
- **OrderingStrategyFactory**: Creates the appropriate ordering strategy
- **ModeSync**: Main class that orchestrates the synchronization process
- **ModesMCPServer**: Implements the MCP server interface

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/example/roo-modes-sync.git
cd roo-modes-sync

# Install in development mode with dev dependencies
pip install -e ".[dev]"
```

### Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=scripts.roo_modes_sync
```

### Code Style

```bash
# Format code
black scripts/roo_modes_sync

# Sort imports
isort scripts/roo_modes_sync

# Type checking
mypy scripts/roo_modes_sync

# Linting
flake8 scripts/roo_modes_sync
```

## Troubleshooting

### Common Issues

#### Mode not appearing in configuration

If a mode is not appearing in the generated configuration:
- Check if the mode file is a valid YAML file
- Ensure the mode file has all required fields (slug, name, roleDefinition, groups)
- Verify the mode is not excluded via the `exclude` option
- Check if the mode file is in the correct directory

#### Ordering not working as expected

If modes are not ordered as expected:
- Verify the strategy name is correct (strategic, alphabetical, category, custom)
- Check if the options are properly formatted
- For custom strategy, ensure the `custom_order` option is provided

#### Local configuration not being applied

If the local configuration is not being applied:
- Ensure the target directory exists and is writable
- Check if `.roomodes/modes.yaml` is created in the target directory
- Verify your application is configured to check for local mode configurations

#### MCP server issues

If the MCP server is not working as expected:
- Check if the server is running (`roo-modes serve`)
- Verify the client is sending properly formatted MCP requests
- Look for error messages in the server output

### Debug Logging

Enable debug logging for more detailed output:

```bash
# Set environment variable before running
export ROO_MODES_SYNC_LOG_LEVEL=DEBUG
roo-modes sync-global
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request