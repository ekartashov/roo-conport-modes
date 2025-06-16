# Sync System Package Design

## Overview

This document outlines the proposed package design for the Roo Modes Sync system to address the identified package installation issues. Implementing a proper Python package structure will resolve import errors and ensure consistent functionality across different execution environments.

## Current Package Structure Issues

The current implementation has several issues:

1. The package is not properly installable or importable
2. Import statements are inconsistent and rely on path manipulation
3. The system depends on specific working directories for operation
4. There's no clear separation between package code and executable scripts

## Proposed Package Structure

```
roo-modes-sync/
├── LICENSE
├── README.md
├── pyproject.toml         # Modern Python packaging configuration
├── setup.py               # Package installation script
├── MANIFEST.in            # Additional files to include in the package
├── roo_modes_sync/        # Main package directory (renamed from scripts/roo_modes_sync)
│   ├── __init__.py        # Package initialization with version info
│   ├── cli.py             # Command-line interface module
│   ├── mcp.py             # MCP server implementation
│   ├── exceptions.py      # Exception hierarchy
│   ├── core/              # Core modules
│   │   ├── __init__.py
│   │   ├── sync.py        # Synchronization logic
│   │   ├── discovery.py   # Mode discovery
│   │   ├── validation.py  # Mode validation
│   │   └── ordering.py    # Mode ordering strategies
│   └── utils/             # Utility functions
│       ├── __init__.py
│       └── paths.py       # Path handling utilities
├── bin/                   # Executable scripts
│   ├── roo-modes-sync     # Main executable (no .py extension)
│   └── roo-modes-mcp      # MCP server executable
└── tests/                 # Test suite
    ├── __init__.py
    ├── test_sync.py
    ├── test_discovery.py
    ├── test_validation.py
    └── fixtures/          # Test fixtures
        └── sample_modes/  # Sample mode files for testing
```

## Package Configuration

### pyproject.toml

```toml
[build-system]
requires = ["setuptools>=42", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "roo-modes-sync"
version = "1.0.0"
description = "Synchronization tools for Roo Modes"
readme = "README.md"
authors = [
    {name = "Roo Team", email = "info@example.com"}
]
license = {text = "MIT"}
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.8",
    "Programming Language :: Python :: 3.9",
    "Programming Language :: Python :: 3.10",
]
requires-python = ">=3.8"
dependencies = [
    "pyyaml>=6.0",
]

[project.scripts]
roo-modes-sync = "roo_modes_sync.cli:main_entry_point"
roo-modes-mcp = "roo_modes_sync.mcp:main_entry_point"

[project.urls]
"Homepage" = "https://github.com/example/roo-modes-sync"
"Bug Tracker" = "https://github.com/example/roo-modes-sync/issues"
```

### setup.py

```python
#!/usr/bin/env python3

from setuptools import setup, find_packages

# Load version from package
with open('roo_modes_sync/__init__.py', 'r') as f:
    for line in f:
        if line.startswith('__version__'):
            version = line.split('=')[1].strip().strip('"\'')
            break

setup(
    name="roo-modes-sync",
    version=version,
    packages=find_packages(),
    include_package_data=True,
    scripts=[
        'bin/roo-modes-sync',
        'bin/roo-modes-mcp',
    ],
    install_requires=[
        'pyyaml>=6.0',
    ],
)
```

### MANIFEST.in

```
include LICENSE
include README.md
include pyproject.toml
```

## Package Initialization

### roo_modes_sync/\_\_init\_\_.py

```python
"""
Roo Modes Sync package for synchronizing Roo modes configuration.
"""

__version__ = "1.0.0"

# Import commonly used classes for convenience
from .core.sync import ModeSync
from .exceptions import SyncError, ConfigurationError
```

## Path Resolution Strategy

The package should implement a robust path resolution strategy:

1. **Configuration File Paths**:
   - Use XDG Base Directory Specification for configuration locations
   - Support environment variables for overriding defaults
   - Implement platform-specific paths (Windows, macOS, Linux)

2. **Mode Directory Discovery**:
   - Support environment variable (ROO_MODES_DIR)
   - Search in common locations (package directory, user directory)
   - Allow explicit specification via command line

## Entry Points

### bin/roo-modes-sync

```bash
#!/usr/bin/env python3

from roo_modes_sync.cli import main

if __name__ == "__main__":
    import sys
    sys.exit(main())
```

### bin/roo-modes-mcp

```bash
#!/usr/bin/env python3

from roo_modes_sync.mcp import run_mcp_server
from pathlib import Path
import sys
import os

def main():
    # Default to current directory if not specified
    modes_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
    run_mcp_server(modes_dir)

if __name__ == "__main__":
    main()
```

## CLI Module Updates

The CLI module needs to be updated with a main entry point for packaging:

```python
def main_entry_point():
    """
    Entry point for packaged script.
    """
    import sys
    return main()
```

## MCP Module Updates

The MCP module needs a similar entry point:

```python
def main_entry_point():
    """
    Entry point for packaged MCP server script.
    """
    import sys
    from pathlib import Path
    
    # Default to current directory if not specified
    modes_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
    run_mcp_server(modes_dir)
```

## Installation Instructions

### Development Installation

```bash
# Clone repository
git clone https://github.com/example/roo-modes-sync.git
cd roo-modes-sync

# Install in development mode
pip install -e .
```

### User Installation

```bash
# Install from PyPI (future)
pip install roo-modes-sync

# Install from GitHub
pip install git+https://github.com/example/roo-modes-sync.git
```

## Migration Steps

1. Rename `scripts/roo_modes_sync` to `roo_modes_sync` at the project root
2. Create proper package files (pyproject.toml, setup.py, etc.)
3. Create executable scripts in the `bin` directory
4. Update import statements throughout the codebase
5. Add package initialization with version information
6. Update path resolution strategy
7. Add entry point functions for packaging

## Benefits of Package Structure

1. **Consistent Imports**: Eliminates import errors and path manipulation
2. **Installation Simplicity**: Provides standard installation methods
3. **Path Independence**: Functions correctly regardless of working directory
4. **Executable Scripts**: Provides system-wide commands after installation
5. **Dependency Management**: Clearly specifies and manages dependencies
6. **Testing**: Facilitates proper test infrastructure

This package design addresses the core installation and import issues while maintaining the clean architecture of the existing sync system.