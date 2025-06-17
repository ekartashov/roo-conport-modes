# Mode Groupings Examples

This directory contains example configurations for the new **mode groupings** feature in roo_modes_sync. Mode groupings allow you to define custom collections of modes with specific ordering, making it much easier to configure workflows.

## Quick Start

Instead of manually specifying every mode and its order, you can now define named groups:

```yaml
strategy: groupings

mode_groups:
  essential:
    - code
    - debug
    - ask

active_group: essential
```

## Example Configurations

### 1. Essential Workflow (`essential-workflow.yaml`)
**Use case**: Simple daily development tasks
- Just the core modes: code, debug, ask
- Debug prioritized for quick troubleshooting access
- Perfect for focused development work

### 2. Full Development Cycle (`full-development-cycle.yaml`)
**Use case**: Complete project workflows
- Multiple groups for different phases (planning, development, quality)
- Demonstrates using multiple active groups
- Shows group ordering for structured workflows

### 3. Specialized Workflows (`specialized-workflows.yaml`)
**Use case**: Task-specific configurations
- Multiple predefined workflows for different scenarios
- Easy switching between debugging, security, learning, etc.
- Shows how to adapt groupings for different work contexts

## Key Features

### Single Group Selection
```yaml
mode_groups:
  my-workflow:
    - code
    - debug
active_group: my-workflow
```

### Multiple Group Selection
```yaml
mode_groups:
  planning: [architect, ask]
  coding: [code, debug]
active_groups: [planning, coding]
group_order: [planning, coding]  # Optional: specify order
```

### Advanced Options
```yaml
priority_first: [debug]      # Always put debug first
exclude: [old-mode]          # Exclude specific modes
```

## Benefits

1. **Intuitive Configuration**: Name your workflows instead of listing modes
2. **Easy Switching**: Change `active_group` to switch entire workflows
3. **Reusable Groups**: Define once, use in multiple combinations
4. **Preserved Order**: Modes appear in the exact order you specify
5. **Backward Compatible**: All existing strategies still work

## Usage

Use these examples as starting points:

```bash
# Copy an example
cp examples/mode-groupings/essential-workflow.yaml my-config.yaml

# Edit for your needs
vim my-config.yaml

# Use with roo_modes_sync (when implemented)
roo_modes_sync --config my-config.yaml
```

## Integration with Existing Strategies

The groupings strategy works alongside existing strategies:

- `strategic`: Strategic importance ordering (default)
- `alphabetical`: Alphabetical ordering
- `category`: Category-based ordering  
- `custom`: Custom explicit ordering
- `groupings`: **NEW** - Group-based workflows

Choose `groupings` when you want intuitive, workflow-based configuration instead of technical ordering rules.