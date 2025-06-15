"""
Tests for path resolution issues.

These tests verify that paths are resolved correctly regardless of
the working directory, especially for mode files and configuration files.
"""

import os
import sys
import pytest
from pathlib import Path


def test_absolute_path_usage():
    """Test that paths are properly converted to absolute paths."""
    # Import here to ensure we're testing the updated package
    from roo_modes_sync.core.sync import ModeSync
    
    # Test with relative path
    relative_path = Path("./test_modes")
    sync = ModeSync(relative_path)
    
    # Verify the path was converted to absolute
    assert sync.modes_dir.is_absolute(), f"Path should be absolute, got {sync.modes_dir}"
    assert str(sync.modes_dir).startswith('/'), f"Absolute path should start with '/', got {sync.modes_dir}"


def test_path_resolution_from_different_directories():
    """Test that paths resolve correctly regardless of working directory."""
    import os
    from pathlib import Path
    
    # Import here to ensure we're testing the updated package
    from roo_modes_sync.core.sync import ModeSync
    
    # Save current directory
    original_dir = os.getcwd()
    
    try:
        # Test paths from different working directories
        test_dirs = [
            Path('/tmp'),  # System temp directory
            Path.home(),    # User's home directory
            Path.home() / "Documents"  # User's documents
        ]
        
        # Find at least one directory that exists
        test_dir = None
        for directory in test_dirs:
            if directory.exists():
                test_dir = directory
                break
        
        if test_dir is None:
            pytest.skip("Could not find a suitable test directory")
            return
        
        # Create a test mode path
        test_modes_dir = Path(original_dir) / "test_modes_dir"
        test_modes_dir.mkdir(exist_ok=True)
        
        try:
            # Change working directory
            os.chdir(test_dir)
            
            # Create sync manager with path to original directory
            sync = ModeSync(test_modes_dir)
            
            # Verify the mode directory is still correct
            assert sync.modes_dir.is_absolute()
            assert str(sync.modes_dir).endswith("test_modes_dir")
            
            # Test global config path
            sync.set_global_config_path()
            assert sync.global_config_path.is_absolute()
            
            # Test local config path
            local_dir = Path(original_dir) / "test_project_dir"
            local_dir.mkdir(exist_ok=True)
            
            try:
                sync.set_local_config_path(local_dir)
                assert sync.local_config_path.is_absolute()
                assert str(sync.local_config_path).endswith(f"{ModeSync.LOCAL_CONFIG_DIR}/{ModeSync.LOCAL_CONFIG_FILE}")
            finally:
                # Clean up
                if local_dir.exists():
                    os.rmdir(local_dir)
        finally:
            # Clean up
            if test_modes_dir.exists():
                os.rmdir(test_modes_dir)
    finally:
        # Restore original directory
        os.chdir(original_dir)


def test_environment_variable_paths():
    """Test that environment variables can override paths."""
    import os
    from pathlib import Path
    
    # Import here to ensure we're testing the updated package
    from roo_modes_sync.core.sync import ModeSync
    
    # Save original environment
    original_env = os.environ.copy()
    
    try:
        # Set environment variables
        test_modes_dir = Path("/tmp/test_modes").absolute()
        test_config_file = Path("/tmp/test_config.yaml").absolute()
        
        os.environ["ROO_MODES_DIR"] = str(test_modes_dir)
        os.environ["ROO_MODES_CONFIG"] = str(test_config_file)
        
        # Create sync with default settings (should use environment variables)
        sync = ModeSync()
        
        # Verify environment variables were used
        assert sync.modes_dir == test_modes_dir
        assert sync.global_config_path == test_config_file
        
    finally:
        # Restore original environment
        os.environ.clear()
        os.environ.update(original_env)


def test_config_directory_creation():
    """Test that configuration directories are created if they don't exist."""
    import os
    import tempfile
    from pathlib import Path
    
    # Import here to ensure we're testing the updated package
    from roo_modes_sync.core.sync import ModeSync
    
    # Create temporary project directory
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        
        # Create test modes directory
        modes_dir = temp_path / "modes"
        modes_dir.mkdir()
        
        # Create sync manager
        sync = ModeSync(modes_dir)
        
        # Set local config path to a nested directory that doesn't exist yet
        project_dir = temp_path / "project"
        project_dir.mkdir()
        
        sync.set_local_config_path(project_dir)
        
        # Create local mode directory
        result = sync.create_local_mode_directory()
        
        # Verify directory was created
        assert result is True
        assert (project_dir / ModeSync.LOCAL_CONFIG_DIR).exists()
        assert (project_dir / ModeSync.LOCAL_CONFIG_DIR).is_dir()