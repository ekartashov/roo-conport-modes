# Test-Driven Development Strategy for Sync System Fix

## Overview

This document outlines a Test-Driven Development (TDD) approach for implementing the Phase 3.5 Sync System Fix. Following TDD principles will ensure that each component functions correctly and that future changes don't reintroduce issues.

## TDD Workflow

For each feature or fix, we'll follow the standard TDD workflow:

1. **Write a failing test** that defines the expected behavior
2. **Implement the minimal code** to make the test pass
3. **Refactor the code** while keeping tests passing
4. **Repeat** for each feature or bug fix

## Test Suite Structure

The test suite will be organized in a hierarchical structure matching the system architecture:

```
tests/
├── __init__.py
├── unit/                 # Unit tests for individual components
│   ├── __init__.py
│   ├── test_discovery.py # Tests for mode discovery
│   ├── test_validation.py # Tests for mode validation
│   ├── test_ordering.py  # Tests for ordering strategies
│   └── test_sync.py      # Tests for sync module
├── integration/          # Integration tests for component interactions
│   ├── __init__.py
│   ├── test_cli.py       # Tests for CLI interactions
│   └── test_workflow.py  # Tests for complete workflows
├── fixtures/             # Test fixtures and data
│   ├── __init__.py
│   ├── invalid_modes/    # Invalid mode files for testing validation
│   ├── valid_modes/      # Valid mode files for testing
│   └── config_templates/ # Configuration templates for testing
└── conftest.py           # PyTest configuration and fixtures
```

## Phase 1: Diagnostic Test Suite

### 1.1 Package Import Tests

```python
def test_package_imports():
    """Test that all package modules can be imported."""
    # Should pass if package structure is correct
    from roo_modes_sync import cli
    from roo_modes_sync.core import sync, discovery, validation, ordering
    from roo_modes_sync import exceptions
    from roo_modes_sync import mcp
    
    # Verify imported modules have expected attributes
    assert hasattr(cli, 'main')
    assert hasattr(sync, 'ModeSync')
    assert hasattr(discovery, 'ModeDiscovery')
    assert hasattr(validation, 'ModeValidator')
```

### 1.2 Path Resolution Tests

```python
def test_path_resolution():
    """Test that paths resolve correctly regardless of working directory."""
    import os
    from pathlib import Path
    from roo_modes_sync.core.sync import ModeSync
    
    # Save current directory
    original_dir = os.getcwd()
    
    try:
        # Change to different directories and test path resolution
        test_dirs = [
            Path.home(),
            Path.home() / "Documents",
            Path("/tmp")
        ]
        
        for test_dir in test_dirs:
            if test_dir.exists():
                os.chdir(test_dir)
                sync = ModeSync(Path("./test_modes"))
                # Verify paths are absolute and don't depend on cwd
                assert sync.modes_dir.is_absolute()
    finally:
        # Restore original directory
        os.chdir(original_dir)
```

### 1.3 Validation Diagnostics Tests

```python
def test_validation_diagnostics():
    """Test that validation provides detailed diagnostics."""
    from pathlib import Path
    import yaml
    from roo_modes_sync.core.validation import ModeValidator
    
    # Create test mode with various issues
    test_mode = {
        # Missing required fields
        # Invalid slug format
        "slug": "Invalid Slug",
        "name": "",  # Empty string
        "roleDefinition": "Test role",
        "groups": []  # Empty array
    }
    
    validator = ModeValidator()
    
    try:
        validator.validate_mode_config(test_mode, "test_mode.yaml")
        assert False, "Validation should fail for invalid mode"
    except Exception as e:
        # Verify error message contains details about all issues
        error_msg = str(e)
        assert "slug" in error_msg, "Error should mention invalid slug"
        assert "groups" in error_msg, "Error should mention empty groups"
        assert "name" in error_msg, "Error should mention empty name"
```

## Phase 2: Core Fix Tests

### 2.1 Package Structure Tests

```python
def test_package_installation():
    """Test that package can be installed and imported as expected."""
    import subprocess
    import sys
    import tempfile
    import os
    from pathlib import Path
    
    # Create temporary virtual environment
    with tempfile.TemporaryDirectory() as temp_dir:
        venv_dir = Path(temp_dir) / "venv"
        
        # Create virtual environment
        subprocess.run([sys.executable, "-m", "venv", str(venv_dir)], check=True)
        
        # Get path to python in virtual environment
        if os.name == 'nt':  # Windows
            python_path = venv_dir / "Scripts" / "python.exe"
        else:  # Unix
            python_path = venv_dir / "bin" / "python"
        
        # Install package in development mode
        package_dir = Path(__file__).parent.parent.parent  # Root of package
        subprocess.run([str(python_path), "-m", "pip", "install", "-e", str(package_dir)], check=True)
        
        # Test import in fresh environment
        result = subprocess.run(
            [str(python_path), "-c", "from roo_modes_sync import cli; print('Success')"],
            capture_output=True,
            text=True
        )
        
        assert "Success" in result.stdout
        assert result.returncode == 0
```

### 2.2 Mode Discovery Tests

```python
def test_mode_discovery(tmp_path):
    """Test that modes are correctly discovered and categorized."""
    from pathlib import Path
    import yaml
    from roo_modes_sync.core.discovery import ModeDiscovery
    
    # Create test modes in different categories
    modes_dir = tmp_path / "modes"
    modes_dir.mkdir()
    
    # Create core mode
    core_mode = {
        "slug": "code",
        "name": "Code Mode",
        "roleDefinition": "Test role",
        "groups": ["read"]
    }
    with open(modes_dir / "code.yaml", "w") as f:
        yaml.dump(core_mode, f)
    
    # Create enhanced mode
    enhanced_mode = {
        "slug": "code-enhanced",
        "name": "Enhanced Code Mode",
        "roleDefinition": "Test role",
        "groups": ["read"]
    }
    with open(modes_dir / "code-enhanced.yaml", "w") as f:
        yaml.dump(enhanced_mode, f)
    
    # Discover modes
    discovery = ModeDiscovery(modes_dir)
    categorized_modes = discovery.discover_all_modes()
    
    # Verify categorization
    assert "code" in categorized_modes["core"]
    assert "code-enhanced" in categorized_modes["enhanced"]
```

### 2.3 Validation Fix Tests

```python
def test_tiered_validation():
    """Test that validation works at different strictness levels."""
    from pathlib import Path
    import yaml
    from roo_modes_sync.core.validation import ModeValidator, ValidationLevel
    
    # Create test mode with minor issues
    test_mode = {
        "slug": "test-mode",
        "name": "Test Mode",
        "roleDefinition": "Test role",
        "groups": ["read"],
        "unknownField": "This field is not in the schema"
    }
    
    # Strict validation should fail
    validator = ModeValidator()
    validator.set_validation_level(ValidationLevel.STRICT)
    
    try:
        validator.validate_mode_config(test_mode, "test_mode.yaml")
        assert False, "Strict validation should fail for unknown field"
    except Exception:
        pass  # Expected failure
    
    # Permissive validation should pass with warnings
    validator.set_validation_level(ValidationLevel.PERMISSIVE)
    result = validator.validate_mode_config(test_mode, "test_mode.yaml", collect_warnings=True)
    
    assert result.valid, "Permissive validation should pass"
    assert len(result.warnings) > 0, "Warnings should be collected"
    assert any("unknownField" in w["message"] for w in result.warnings), "Warning about unknown field"
```

## Phase 3: Robustness Tests

### 3.1 Error Handling Tests

```python
def test_error_recovery():
    """Test that system can recover from various error conditions."""
    from pathlib import Path
    from roo_modes_sync.core.sync import ModeSync
    from roo_modes_sync.exceptions import SyncError, ValidationError
    
    modes_dir = Path("./nonexistent_dir")  # Directory that doesn't exist
    
    # Test graceful handling of missing directory
    sync = ModeSync(modes_dir)
    
    try:
        result = sync.sync_modes(dry_run=True)
        assert not result, "Sync should fail but not crash with nonexistent directory"
    except SyncError:
        pass  # Expected behavior
    
    # Test partial success with some invalid modes
    modes_dir = Path("./test_fixtures/mixed_modes")  # Mix of valid and invalid
    sync = ModeSync(modes_dir)
    
    # Set recovery options
    sync.set_options({"continue_on_validation_error": True})
    
    result = sync.sync_modes(dry_run=True)
    assert result, "Sync should partially succeed with recovery options"
```

### 3.2 Configuration Flexibility Tests

```python
def test_environment_variable_config():
    """Test that environment variables can configure the system."""
    import os
    from pathlib import Path
    from roo_modes_sync.core.sync import ModeSync
    
    # Save original environment
    original_env = os.environ.copy()
    
    try:
        # Set environment variables
        test_modes_dir = Path("./test_fixtures/valid_modes")
        os.environ["ROO_MODES_DIR"] = str(test_modes_dir)
        os.environ["ROO_MODES_CONFIG"] = str(Path("./test_output/custom_config.yaml"))
        
        # Create sync with default settings (should use environment variables)
        sync = ModeSync()
        
        # Verify environment variables were used
        assert sync.modes_dir == test_modes_dir
        assert "custom_config.yaml" in str(sync.global_config_path)
    finally:
        # Restore original environment
        os.environ.clear()
        os.environ.update(original_env)
```

### 3.3 Integration Tests

```python
def test_end_to_end_workflow():
    """Test complete workflow from CLI to config generation."""
    import subprocess
    import tempfile
    from pathlib import Path
    import yaml
    
    # Create temporary directory for test
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        modes_dir = temp_path / "modes"
        modes_dir.mkdir()
        
        # Create test mode
        test_mode = {
            "slug": "test-mode",
            "name": "Test Mode",
            "roleDefinition": "Test role",
            "groups": ["read"]
        }
        
        with open(modes_dir / "test-mode.yaml", "w") as f:
            yaml.dump(test_mode, f)
        
        # Create project directory
        project_dir = temp_path / "project"
        project_dir.mkdir()
        
        # Run CLI command
        result = subprocess.run(
            ["roo-modes-sync", "sync-local", str(project_dir), "--modes-dir", str(modes_dir)],
            capture_output=True,
            text=True
        )
        
        assert result.returncode == 0, f"CLI command failed: {result.stderr}"
        
        # Verify config file was created
        config_file = project_dir / ".roomodes" / "modes.yaml"
        assert config_file.exists(), "Config file should be created"
        
        # Verify content
        with open(config_file, "r") as f:
            config = yaml.safe_load(f)
        
        assert "customModes" in config
        assert len(config["customModes"]) == 1
        assert config["customModes"][0]["slug"] == "test-mode"
```

## CI/CD Integration

The test suite will be integrated into CI/CD pipelines to ensure continuous quality:

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: [3.8, 3.9, '3.10']

    steps:
    - uses: actions/checkout@v2
    - name: Set up Python ${{ matrix.python-version }}
      uses: actions/setup-python@v2
      with:
        python-version: ${{ matrix.python-version }}
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install pytest pytest-cov
        pip install -e .
    - name: Test with pytest
      run: |
        pytest --cov=roo_modes_sync tests/
```

## Implementation Strategy

Using this test suite, we'll implement the sync system fix following TDD principles:

1. Start by implementing the basic test infrastructure
2. Write failing tests for the package structure and imports
3. Implement the package reorganization to make these tests pass
4. Continue with tests for path resolution, validation, and other components
5. Implement each fix incrementally, always starting with a failing test

This approach ensures that:

1. All fixes are verified by tests
2. No regression issues are introduced
3. The final system is robust and maintainable
4. The implementation matches the design specifications

## Switching to Code Mode

To implement these tests and fixes, we'll need to switch to Code mode, as Architect mode is limited to editing Markdown files. The Code mode will use these test specifications as a guide for implementing the actual fixes while following TDD principles.