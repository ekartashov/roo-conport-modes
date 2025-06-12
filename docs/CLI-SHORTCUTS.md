# CLI Tool Shortcuts

The roo-modes project now uses shortened, memorable CLI tool names:

## Available Tools

### Main Tools
- `python scripts/sync.py` - Enhanced mode synchronization tool
- `python scripts/sync-basic.py` - Basic mode sync (legacy)
- `python scripts/test.py` - Test suite for sync functionality
- `python tools/demo.py` - YAML output format demo

### Configuration
- `scripts/order.yaml` - Mode ordering configuration

## Quick Commands

```bash
# Sync modes to global config
python scripts/sync.py

# Preview sync (dry run) 
python scripts/sync.py --dry-run

# Test sync functionality
python scripts/test.py

# Demo YAML output
python tools/demo.py

# List available modes
python scripts/sync.py --list-modes

# Validate configurations
python scripts/sync.py --validate-only
```

## Benefits of New Structure

- **Shorter commands**: `sync.py` instead of `sync_modes_to_global_config_enhanced.py`
- **Memorable paths**: `scripts/` and `tools/` instead of `tooling/scripts/`
- **Simplified structure**: `docs/` instead of `documentation/`
- **Easy navigation**: Top-level directories for common tasks
