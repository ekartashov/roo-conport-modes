"""
Tests for package structure and imports.

These tests verify that the package structure is correct and all
modules can be imported properly. This helps diagnose import errors
and package installation issues.
"""

import os
import sys
import pytest
from pathlib import Path


def test_package_imports():
    """Test that all package modules can be imported."""
    # This test will fail initially as we need to fix the package structure
    try:
        # Import the main package
        import roo_modes_sync
        # Import submodules
        from roo_modes_sync import cli, exceptions, mcp
        from roo_modes_sync.core import sync, discovery, validation, ordering
        from roo_modes_sync.config import ordering as config_ordering
        
        # Verify imported modules have expected attributes
        assert hasattr(cli, 'main'), "cli module is missing 'main' function"
        assert hasattr(sync, 'ModeSync'), "sync module is missing 'ModeSync' class"
        assert hasattr(discovery, 'ModeDiscovery'), "discovery module is missing 'ModeDiscovery' class"
        assert hasattr(validation, 'ModeValidator'), "validation module is missing 'ModeValidator' class"
        assert hasattr(exceptions, 'SyncError'), "exceptions module is missing 'SyncError' class"
        
        # If we got here, all imports worked correctly
        assert True
    except ImportError as e:
        pytest.fail(f"Import error: {e}")


def test_package_directory_structure():
    """Test that the package directory structure is correct."""
    # Get the root directory of the package
    # Assuming this test is in tests/unit/test_package_structure.py
    root_dir = Path(__file__).parent.parent.parent
    
    # Check that essential directories and files exist
    assert (root_dir / "roo_modes_sync").exists(), "roo_modes_sync package directory missing"
    assert (root_dir / "roo_modes_sync" / "__init__.py").exists(), "roo_modes_sync/__init__.py missing"
    assert (root_dir / "roo_modes_sync" / "core").exists(), "roo_modes_sync/core directory missing"
    assert (root_dir / "roo_modes_sync" / "core" / "__init__.py").exists(), "roo_modes_sync/core/__init__.py missing"
    assert (root_dir / "pyproject.toml").exists(), "pyproject.toml missing"


def test_installed_package():
    """Test that the package can be imported when installed."""
    import subprocess
    import sys
    import tempfile
    
    # Create a temporary directory for a virtual environment
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        venv_dir = temp_path / "venv"
        
        # Create virtual environment
        subprocess.run([sys.executable, "-m", "venv", str(venv_dir)], check=True)
        
        # Get path to python in virtual environment
        if os.name == 'nt':  # Windows
            python_path = venv_dir / "Scripts" / "python.exe"
        else:  # Unix
            python_path = venv_dir / "bin" / "python"
        
        # Get path to package
        package_dir = Path(__file__).parent.parent.parent
        
        # Prepare the test script
        test_script = temp_path / "test_import.py"
        with open(test_script, 'w') as f:
            f.write("""
try:
    import roo_modes_sync
    from roo_modes_sync import cli
    from roo_modes_sync.core import sync
    print("SUCCESS: All imports successful")
    exit(0)
except ImportError as e:
    print(f"FAILURE: Import error: {e}")
    exit(1)
""")
        
        # Install package in development mode
        result = subprocess.run(
            [str(python_path), "-m", "pip", "install", "-e", str(package_dir)],
            capture_output=True,
            text=True
        )
        
        # Check installation succeeded
        assert result.returncode == 0, f"Failed to install package: {result.stderr}"
        
        # Run test script to test import
        result = subprocess.run(
            [str(python_path), str(test_script)],
            capture_output=True,
            text=True
        )
        
        # Check import succeeded
        assert "SUCCESS" in result.stdout, f"Failed to import installed package: {result.stdout}\n{result.stderr}"
        assert result.returncode == 0, f"Test script failed with code {result.returncode}"