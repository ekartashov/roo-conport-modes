# Sync System Diagnostic Strategy

## Overview

This document outlines a structured approach to diagnosing issues with the Roo Modes Sync system. Since the system is currently non-functional despite having a well-designed architecture, we need a systematic diagnostic methodology to identify the specific failure points.

## Diagnostic Approach

### 1. Component-by-Component Validation

Each component of the sync system should be tested individually to isolate issues:

#### 1.1 Module Import Validation

```python
# Diagnostic code to be implemented
try:
    from scripts.roo_modes_sync.cli import main
    print("✅ CLI module imported successfully")
except Exception as e:
    print(f"❌ CLI module import failed: {e}")

try:
    from scripts.roo_modes_sync.core.sync import ModeSync
    print("✅ Sync module imported successfully")
except Exception as e:
    print(f"❌ Sync module import failed: {e}")

# Similar tests for other modules
```

#### 1.2 Mode Discovery Validation

```python
# Diagnostic code to be implemented
from pathlib import Path
from scripts.roo_modes_sync.core.discovery import ModeDiscovery

try:
    modes_dir = Path("./modes")
    discovery = ModeDiscovery(modes_dir)
    categories = discovery.discover_all_modes()
    print(f"✅ Mode discovery found {sum(len(modes) for modes in categories.values())} modes")
    for category, modes in categories.items():
        print(f"  - {category}: {len(modes)} modes")
        for mode in modes:
            print(f"    - {mode}")
except Exception as e:
    print(f"❌ Mode discovery failed: {e}")
```

#### 1.3 Mode Validation Testing

```python
# Diagnostic code to be implemented
from pathlib import Path
import yaml
from scripts.roo_modes_sync.core.validation import ModeValidator

validator = ModeValidator()
modes_dir = Path("./modes")
mode_files = list(modes_dir.glob("*.yaml"))

print(f"Found {len(mode_files)} mode files")
for mode_file in mode_files:
    try:
        with open(mode_file, 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)
        
        validator.validate_mode_config(config, str(mode_file))
        print(f"✅ {mode_file.name} passed validation")
    except Exception as e:
        print(f"❌ {mode_file.name} failed validation: {e}")
```

#### 1.4 Configuration Path Validation

```python
# Diagnostic code to be implemented
from pathlib import Path
from scripts.roo_modes_sync.core.sync import ModeSync

modes_dir = Path("./modes")
sync = ModeSync(modes_dir)

# Check global config path
try:
    sync.set_global_config_path()
    path = sync.global_config_path
    print(f"Global config path: {path}")
    print(f"  - Exists: {path.exists()}")
    print(f"  - Is directory: {path.is_dir()}")
    print(f"  - Parent exists: {path.parent.exists()}")
    print(f"  - Parent is writable: {os.access(path.parent, os.W_OK)}")
except Exception as e:
    print(f"❌ Global config path error: {e}")

# Check local config path
try:
    project_dir = Path(".")
    sync.set_local_config_path(project_dir)
    path = sync.local_config_path
    print(f"Local config path: {path}")
    print(f"  - Exists: {path.exists()}")
    print(f"  - Is directory: {path.is_dir()}")
    print(f"  - Parent exists: {path.parent.exists()}")
    print(f"  - Parent is writable: {os.access(path.parent, os.W_OK)}")
except Exception as e:
    print(f"❌ Local config path error: {e}")
```

### 2. End-to-End Workflow Validation

Once individual components are validated, test the complete workflow with detailed logging:

```python
# Diagnostic code to be implemented
import logging
import sys
from pathlib import Path
from scripts.roo_modes_sync.core.sync import ModeSync

# Set up detailed logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

# Test sync workflow
try:
    modes_dir = Path("./modes")
    sync = ModeSync(modes_dir)
    
    # Set local config path
    project_dir = Path(".")
    sync.set_local_config_path(project_dir)
    
    # Perform sync with dry run
    print("Attempting sync with dry run...")
    result = sync.sync_modes(
        strategy_name='strategic',
        options={},
        dry_run=True
    )
    
    print(f"Sync result: {'Success' if result else 'Failed'}")
    
    # If dry run succeeded, try actual sync
    if result:
        print("Attempting actual sync...")
        result = sync.sync_modes(
            strategy_name='strategic',
            options={}
        )
        print(f"Actual sync result: {'Success' if result else 'Failed'}")
        
except Exception as e:
    print(f"❌ Sync workflow error: {e}")
```

### 3. Package Installation Validation

Check if the package is properly installed or importable:

```python
# Diagnostic code to be implemented
import sys
import os

print("Python path:")
for p in sys.path:
    print(f"  - {p}")

print("\nCurrent directory:", os.getcwd())
print("\nEnvironment variables:")
for k, v in os.environ.items():
    if 'PATH' in k or 'PYTHON' in k:
        print(f"  - {k}: {v}")

try:
    import scripts.roo_modes_sync
    print("\n✅ scripts.roo_modes_sync package is importable")
    print(f"Package location: {scripts.roo_modes_sync.__file__}")
except ImportError as e:
    print(f"\n❌ scripts.roo_modes_sync package import error: {e}")

try:
    from scripts.roo_modes_sync import cli
    print("✅ cli module is importable")
except ImportError as e:
    print(f"❌ cli module import error: {e}")
```

## Implementation Plan

1. Create a diagnostic script incorporating the code snippets above
2. Run the script in the project environment to collect diagnostic information
3. Analyze the results to identify specific failure points
4. Create targeted fixes based on the diagnostic results
5. Rerun diagnostics after each fix to validate improvements

## Output Analysis

The diagnostic output should be analyzed for these specific indicators:

1. **Import Errors**: Indicate package structure or installation issues
2. **Mode Discovery Failures**: Point to path resolution or file access problems
3. **Validation Failures**: Identify issues with mode file formatting or content
4. **Path Resolution Errors**: Show configuration directory access problems
5. **Workflow Failures**: Highlight integration issues between components

## Diagnostic Result Documentation

All diagnostic results should be documented with:

1. Environment information (Python version, OS, working directory)
2. Component-by-component test results
3. Specific error messages and stack traces
4. Analysis of root causes
5. Recommended fixes with priority levels

This systematic diagnostic approach will provide the necessary insights to effectively fix the sync system issues.