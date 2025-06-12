# Scripts Directory

This directory contains utility and automation scripts for the Roo Modes project.

## Available Scripts

### [`sync_modes_to_global_config.py`](sync_modes_to_global_config.py)
**Purpose**: Synchronizes local mode YAML files to the global Roo configuration with schema validation.

**Features**:
- Strategic mode ordering (core → enhanced → specialized)
- JSON schema validation
- Backup creation
- YAML format verification
- Dry-run capability

**Usage**:
```bash
# Perform the sync
python tooling/scripts/sync_modes_to_global_config.py

# Preview without changes
python tooling/scripts/sync_modes_to_global_config.py --dry-run

# Show help
python tooling/scripts/sync_modes_to_global_config.py --help
```

### [`test_sync_modes.py`](test_sync_modes.py)
**Purpose**: Comprehensive test suite for the sync script validation.

**Features**:
- Schema validation testing
- Complex group structure validation
- Slug pattern validation
- YAML output format testing
- Complete workflow testing

**Usage**:
```bash
# Run all tests
python tooling/scripts/test_sync_modes.py

# Run with verbose output
python tooling/scripts/test_sync_modes.py -v
```

## Script Requirements

- Python 3.7+
- PyYAML library
- Access to core/modes/ directory
- Write permissions for global config location

## Global Configuration Location

The scripts target the standard Roo configuration path:
```
~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/custom_modes.yaml
```

## Best Practices

1. **Always run dry-run first** to preview changes
2. **Backup important configurations** before sync
3. **Validate modes** using the test suite
4. **Check permissions** for global config directory
5. **Review sync output** for any validation errors