# Mode Ordering Configuration Examples

This directory contains example configuration files for the enhanced sync script that demonstrate different ordering strategies and options.

## Available Configuration Files

### 1. `alphabetical_config.yaml`
- **Strategy**: Alphabetical ordering within categories
- **Use case**: Simple, predictable ordering
- **Order**: Categories processed as core → enhanced → specialized → discovered, with alphabetical sorting within each category

### 2. `category_based_config.yaml` 
- **Strategy**: Category-based with custom precedence
- **Use case**: Prioritize specialized tools before core workflow modes
- **Order**: Specialized tools first, then core modes with manual ordering within categories

### 3. `custom_order_config.yaml`
- **Strategy**: Custom explicit ordering
- **Use case**: Complete control over mode sequence
- **Order**: Debug-first workflow optimized for development

## Usage Examples

### Using a Configuration File
```bash
# Use the main configuration file
python tooling/scripts/sync_modes_to_global_config_enhanced.py --config tooling/scripts/mode_ordering_config.yaml

# Use an example configuration
python tooling/scripts/sync_modes_to_global_config_enhanced.py --config tooling/scripts/example_configs/alphabetical_config.yaml

# Preview changes without writing
python tooling/scripts/sync_modes_to_global_config_enhanced.py --config tooling/scripts/example_configs/category_based_config.yaml --dry-run
```

### CLI-Only Usage (No Configuration File)
```bash
# Strategic ordering (default)
python tooling/scripts/sync_modes_to_global_config_enhanced.py

# Alphabetical ordering
python tooling/scripts/sync_modes_to_global_config_enhanced.py --order alphabetical

# Category-based with custom category order
python tooling/scripts/sync_modes_to_global_config_enhanced.py --order category --category-order specialized,core,enhanced

# Custom explicit ordering
python tooling/scripts/sync_modes_to_global_config_enhanced.py --order custom --custom-order debug,code,architect,prompt-enhancer

# With priority and exclusions
python tooling/scripts/sync_modes_to_global_config_enhanced.py --priority debug,code --exclude experimental
```

### Override Configuration with CLI Arguments
```bash
# Use config file but override the strategy
python tooling/scripts/sync_modes_to_global_config_enhanced.py --config tooling/scripts/mode_ordering_config.yaml --order alphabetical

# Use config file but add exclusions
python tooling/scripts/sync_modes_to_global_config_enhanced.py --config tooling/scripts/example_configs/alphabetical_config.yaml --exclude old-mode
```

## Testing and Validation

### List Available Modes
```bash
python tooling/scripts/sync_modes_to_global_config_enhanced.py --list-modes
```

### Validate Configuration Without Syncing
```bash
python tooling/scripts/sync_modes_to_global_config_enhanced.py --validate-only
```

### Preview Changes (Dry Run)
```bash
python tooling/scripts/sync_modes_to_global_config_enhanced.py --config tooling/scripts/example_configs/custom_order_config.yaml --dry-run
```

## Configuration File Schema

All configuration files support these options:

```yaml
# Required: Ordering strategy
strategy: strategic | alphabetical | category | custom

# Optional: Modes to prioritize at the beginning
priority_modes:
  - mode1
  - mode2

# Optional: Modes to exclude from sync
exclude_modes:
  - old-mode
  - experimental

# Category strategy options
category_order:
  - specialized
  - core
  - enhanced
  - discovered

within_category_sort: alphabetical | manual

manual_category_order:
  core:
    - code
    - architect
    - debug
  specialized:
    - prompt-enhancer
    - conport-maintenance

# Custom strategy options
custom_order:
  - debug
  - code
  - architect
  - prompt-enhancer
```

## Current Available Modes

Based on the latest discovery:

**Core Workflow (5 modes):**
- `architect` - 🏗️ System design and planning
- `ask` - ❓ Conceptual questions and guidance  
- `code` - 💻 Writing and reviewing code
- `debug` - 🪲 Troubleshooting and bug fixing
- `orchestrator` - 🪃 Workflow coordination

**Specialized Tools (3 modes):**
- `conport-maintenance` - 🗃️ ConPort database maintenance
- `prompt-enhancer` - 🪄 Prompt improvement and clarity
- `prompt-enhancer-isolated` - 🪄 Isolated prompt enhancement

**Enhanced Variants:** (none currently)

**Discovered/Other:** (none currently)