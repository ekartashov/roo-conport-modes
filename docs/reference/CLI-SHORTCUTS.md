# CLI Shortcuts Reference

The roo-modes sync script now supports short options for faster command-line usage.

## Available Commands

### Main Sync Commands
- `python scripts/roo_modes_sync/cli.py sync-global` - Sync modes to global configuration
- `python scripts/roo_modes_sync/cli.py sync-local <project_dir>` - Sync modes to local project
- `python scripts/roo_modes_sync/cli.py list` - List available modes
- `python scripts/roo_modes_sync/cli.py serve` - Run as MCP server

### Backup Commands
- `python scripts/roo_modes_sync/cli.py backup` - Create backups
- `python scripts/roo_modes_sync/cli.py restore` - Restore from backups
- `python scripts/roo_modes_sync/cli.py list-backups` - List available backups

## Short Options

### Global Options
- `-m, --modes-dir` - Directory containing mode YAML files
- `-n, --no-recurse` - Disable recursive search for mode files

### Sync Options
- `-c, --config` - Path to global configuration file (sync-global only)
- `-s, --strategy` - Ordering strategy (strategic, alphabetical, etc.)
- `-d, --dry-run` - Preview changes without writing files
- `-b, --no-backup` - Skip creating backup before sync

### Backup/Restore Options
- `-t, --type` - Type of files (local, global, all)
- `-f, --backup-file` - Specific backup file to restore
- `-p, --project-dir` - Project directory path

## Quick Command Examples

### Sync Operations
```bash
# Sync modes to global config (long form)
python scripts/roo_modes_sync/cli.py sync-global --strategy strategic --dry-run

# Sync modes to global config (short form)
python scripts/roo_modes_sync/cli.py sync-global -s strategic -d

# Sync to local project with no backup (short form)
python scripts/roo_modes_sync/cli.py sync-local /path/to/project -b

# Preview local sync with custom modes directory
python scripts/roo_modes_sync/cli.py sync-local /path/to/project -m ./custom-modes -d
```

### Backup Operations
```bash
# Backup all configuration files
python scripts/roo_modes_sync/cli.py backup -t all

# Backup only local configurations
python scripts/roo_modes_sync/cli.py backup -t local

# Restore specific backup file
python scripts/roo_modes_sync/cli.py restore -f custom_modes_3.yaml

# List all available backups
python scripts/roo_modes_sync/cli.py list-backups
```

### Information Commands
```bash
# List modes in custom directory
python scripts/roo_modes_sync/cli.py list -m ./my-modes

# List modes without recursive search
python scripts/roo_modes_sync/cli.py list -n
```

## Most Common Shortcuts

```bash
# Quick global sync with preview
python scripts/roo_modes_sync/cli.py sync-global -d

# Quick local sync to current directory
python scripts/roo_modes_sync/cli.py sync-local . -s strategic

# Quick backup before major changes
python scripts/roo_modes_sync/cli.py backup -t all

# Quick mode listing
python scripts/roo_modes_sync/cli.py list
```

## Benefits of Short Options

- **Faster typing**: `-d` instead of `--dry-run`
- **Reduced errors**: Shorter commands are less prone to typos
- **Easier scripting**: More concise in automation scripts
- **Familiar patterns**: Following standard CLI conventions
- **Backward compatibility**: Long options still work for clarity
