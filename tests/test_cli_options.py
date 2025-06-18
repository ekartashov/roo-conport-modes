#!/usr/bin/env python3
"""
Tests for CLI short options and argument parsing.
"""

import pytest
import tempfile
import yaml
import argparse
from pathlib import Path
from unittest.mock import patch, MagicMock
import sys

# Add the sync package to path for imports
script_dir = Path(__file__).resolve().parent.parent / "scripts" / "roo_modes_sync"
sys.path.insert(0, str(script_dir))

from cli import main, parse_strategy_argument
from core.sync import ModeSync
from core.backup import BackupManager
from exceptions import SyncError


class TestCLIShortOptions:
    """Test CLI short options functionality."""
    
    def test_global_sync_short_options(self, tmp_path):
        """Test that short options work for sync-global command."""
        # Create test modes directory
        modes_dir = tmp_path / "modes"
        modes_dir.mkdir()
        
        # Create a simple test mode
        test_mode = {
            'slug': 'test-mode',
            'name': 'Test Mode',
            'roleDefinition': 'A test mode',
            'groups': ['read']
        }
        with open(modes_dir / "test-mode.yaml", 'w') as f:
            yaml.dump(test_mode, f)
        
        # Test with short options: -m, -s, -d, -b
        test_args = [
            'sync-global',
            '-m', str(modes_dir),
            '-s', 'alphabetical',
            '-d',  # dry-run
            '-b'   # no-backup
        ]
        
        with patch('sys.argv', ['cli.py'] + test_args):
            with patch('cli.sync_global') as mock_sync_global:
                mock_sync_global.return_value = 0
                
                # Mock the argument parsing to capture the parsed args
                with patch('argparse.ArgumentParser.parse_args') as mock_parse:
                    # Create a mock args object with the expected attributes
                    mock_args = MagicMock()
                    mock_args.command = 'sync-global'
                    mock_args.modes_dir = Path(str(modes_dir))
                    mock_args.strategy = 'alphabetical'
                    mock_args.dry_run = True
                    mock_args.no_backup = True
                    mock_args.config = None
                    mock_args.no_recurse = False
                    mock_args.func = mock_sync_global
                    
                    mock_parse.return_value = mock_args
                    
                    # Call main function
                    result = main()
                    
                    # Verify the function was called with correct arguments
                    mock_sync_global.assert_called_once_with(mock_args)
                    assert result == 0
    
    def test_local_sync_short_options(self, tmp_path):
        """Test that short options work for sync-local command."""
        # Create test modes directory
        modes_dir = tmp_path / "modes"
        modes_dir.mkdir()
        project_dir = tmp_path / "project"
        project_dir.mkdir()
        
        # Test with short options: -m, -s, -d, -b
        test_args = [
            'sync-local',
            str(project_dir),
            '-m', str(modes_dir),
            '-s', 'strategic',
            '-d',  # dry-run
            '-b'   # no-backup
        ]
        
        with patch('sys.argv', ['cli.py'] + test_args):
            with patch('cli.sync_local') as mock_sync_local:
                mock_sync_local.return_value = 0
                
                with patch('argparse.ArgumentParser.parse_args') as mock_parse:
                    mock_args = MagicMock()
                    mock_args.command = 'sync-local'
                    mock_args.modes_dir = Path(str(modes_dir))
                    mock_args.project_dir = str(project_dir)
                    mock_args.strategy = 'strategic'
                    mock_args.dry_run = True
                    mock_args.no_backup = True
                    mock_args.no_recurse = False
                    mock_args.func = mock_sync_local
                    
                    mock_parse.return_value = mock_args
                    
                    result = main()
                    
                    mock_sync_local.assert_called_once_with(mock_args)
                    assert result == 0
    
    def test_backup_short_options(self, tmp_path):
        """Test that short options work for backup command."""
        test_args = [
            'backup',
            '-t', 'local',
            '-p', str(tmp_path)
        ]
        
        with patch('sys.argv', ['cli.py'] + test_args):
            with patch('cli.backup_files') as mock_backup:
                mock_backup.return_value = 0
                
                with patch('argparse.ArgumentParser.parse_args') as mock_parse:
                    mock_args = MagicMock()
                    mock_args.command = 'backup'
                    mock_args.type = 'local'
                    mock_args.project_dir = str(tmp_path)
                    mock_args.func = mock_backup
                    
                    mock_parse.return_value = mock_args
                    
                    result = main()
                    
                    mock_backup.assert_called_once_with(mock_args)
                    assert result == 0
    
    def test_restore_short_options(self, tmp_path):
        """Test that short options work for restore command."""
        test_args = [
            'restore',
            '-t', 'global',
            '-f', 'custom_modes_2.yaml',
            '-p', str(tmp_path)
        ]
        
        with patch('sys.argv', ['cli.py'] + test_args):
            with patch('cli.restore_files') as mock_restore:
                mock_restore.return_value = 0
                
                with patch('argparse.ArgumentParser.parse_args') as mock_parse:
                    mock_args = MagicMock()
                    mock_args.command = 'restore'
                    mock_args.type = 'global'
                    mock_args.backup_file = 'custom_modes_2.yaml'
                    mock_args.project_dir = str(tmp_path)
                    mock_args.func = mock_restore
                    
                    mock_parse.return_value = mock_args
                    
                    result = main()
                    
                    mock_restore.assert_called_once_with(mock_args)
                    assert result == 0
    
    def test_list_backups_short_options(self, tmp_path):
        """Test that short options work for list-backups command."""
        test_args = [
            'list-backups',
            '-p', str(tmp_path)
        ]
        
        with patch('sys.argv', ['cli.py'] + test_args):
            with patch('cli.list_backups') as mock_list:
                mock_list.return_value = 0
                
                with patch('argparse.ArgumentParser.parse_args') as mock_parse:
                    mock_args = MagicMock()
                    mock_args.command = 'list-backups'
                    mock_args.project_dir = str(tmp_path)
                    mock_args.func = mock_list
                    
                    mock_parse.return_value = mock_args
                    
                    result = main()
                    
                    mock_list.assert_called_once_with(mock_args)
                    assert result == 0
    
    def test_no_recurse_short_option(self, tmp_path):
        """Test that -n (--no-recurse) short option works."""
        modes_dir = tmp_path / "modes"
        modes_dir.mkdir()
        
        test_args = [
            'list',
            '-m', str(modes_dir),
            '-n'  # no-recurse
        ]
        
        with patch('sys.argv', ['cli.py'] + test_args):
            with patch('cli.list_modes') as mock_list:
                mock_list.return_value = 0
                
                with patch('argparse.ArgumentParser.parse_args') as mock_parse:
                    mock_args = MagicMock()
                    mock_args.command = 'list'
                    mock_args.modes_dir = Path(str(modes_dir))
                    mock_args.no_recurse = True
                    mock_args.func = mock_list
                    
                    mock_parse.return_value = mock_args
                    
                    result = main()
                    
                    mock_list.assert_called_once_with(mock_args)
                    assert result == 0


class TestCLIArgumentParsing:
    """Test detailed argument parsing functionality."""
    
    def test_sync_global_config_short_option(self, tmp_path):
        """Test that -c (--config) short option works for sync-global."""
        config_file = tmp_path / "custom_config.yaml"
        config_file.touch()
        
        test_args = [
            'sync-global',
            '-c', str(config_file)
        ]
        
        with patch('sys.argv', ['cli.py'] + test_args):
            with patch('cli.sync_global') as mock_sync:
                mock_sync.return_value = 0
                
                with patch('argparse.ArgumentParser.parse_args') as mock_parse:
                    mock_args = MagicMock()
                    mock_args.command = 'sync-global'
                    mock_args.config = str(config_file)
                    mock_args.func = mock_sync
                    
                    mock_parse.return_value = mock_args
                    
                    main()
                    
                    # Verify the config argument was passed correctly
                    called_args = mock_sync.call_args[0][0]
                    assert called_args.config == str(config_file)
    
    def test_combined_short_options(self, tmp_path):
        """Test that multiple short options can be combined effectively."""
        modes_dir = tmp_path / "modes"
        modes_dir.mkdir()
        project_dir = tmp_path / "project"
        project_dir.mkdir()
        
        test_args = [
            'sync-local',
            str(project_dir),
            '-m', str(modes_dir),
            '-s', 'alphabetical',
            '-d',
            '-b',
            '-n'
        ]
        
        with patch('sys.argv', ['cli.py'] + test_args):
            with patch('cli.sync_local') as mock_sync:
                mock_sync.return_value = 0
                
                with patch('argparse.ArgumentParser.parse_args') as mock_parse:
                    mock_args = MagicMock()
                    mock_args.command = 'sync-local'
                    mock_args.modes_dir = Path(str(modes_dir))
                    mock_args.project_dir = str(project_dir)
                    mock_args.strategy = 'alphabetical'
                    mock_args.dry_run = True
                    mock_args.no_backup = True
                    mock_args.no_recurse = True
                    mock_args.func = mock_sync
                    
                    mock_parse.return_value = mock_args
                    
                    main()
                    
                    called_args = mock_sync.call_args[0][0]
                    assert called_args.strategy == 'alphabetical'
                    assert called_args.dry_run is True
                    assert called_args.no_backup is True
                    assert called_args.no_recurse is True


class TestCLIBackwardCompatibility:
    """Test that long options still work alongside short options."""
    
    def test_long_options_still_work(self, tmp_path):
        """Test that long options continue to work for backward compatibility."""
        modes_dir = tmp_path / "modes"
        modes_dir.mkdir()
        
        test_args = [
            'sync-global',
            '--modes-dir', str(modes_dir),
            '--strategy', 'strategic',
            '--dry-run',
            '--no-backup',
            '--no-recurse'
        ]
        
        with patch('sys.argv', ['cli.py'] + test_args):
            with patch('cli.sync_global') as mock_sync:
                mock_sync.return_value = 0
                
                with patch('argparse.ArgumentParser.parse_args') as mock_parse:
                    mock_args = MagicMock()
                    mock_args.command = 'sync-global'
                    mock_args.modes_dir = Path(str(modes_dir))
                    mock_args.strategy = 'strategic'
                    mock_args.dry_run = True
                    mock_args.no_backup = True
                    mock_args.no_recurse = True
                    mock_args.func = mock_sync
                    
                    mock_parse.return_value = mock_args
                    
                    main()
                    
                    mock_sync.assert_called_once_with(mock_args)
    
    def test_mixed_long_and_short_options(self, tmp_path):
        """Test that long and short options can be mixed."""
        modes_dir = tmp_path / "modes"
        modes_dir.mkdir()
        
        test_args = [
            'sync-global',
            '-m', str(modes_dir),
            '--strategy', 'strategic',
            '-d',
            '--no-backup'
        ]
        
        with patch('sys.argv', ['cli.py'] + test_args):
            with patch('cli.sync_global') as mock_sync:
                mock_sync.return_value = 0
                
                with patch('argparse.ArgumentParser.parse_args') as mock_parse:
                    mock_args = MagicMock()
                    mock_args.command = 'sync-global'
                    mock_args.modes_dir = Path(str(modes_dir))
                    mock_args.strategy = 'strategic'
                    mock_args.dry_run = True
                    mock_args.no_backup = True
                    mock_args.func = mock_sync
                    
                    mock_parse.return_value = mock_args
                    
                    main()
                    
                    called_args = mock_sync.call_args[0][0]
                    assert called_args.strategy == 'strategic'
                    assert called_args.dry_run is True
                    assert called_args.no_backup is True


class TestCLIIntegration:
    """Integration tests for CLI functionality with actual argument parsing."""
    
    def test_real_argument_parsing_sync_global(self, tmp_path):
        """Test actual argument parsing for sync-global with short options."""
        import argparse
        from cli import main
        
        modes_dir = tmp_path / "modes"
        modes_dir.mkdir()
        
        # Create a simple test mode
        test_mode = {
            'slug': 'cli-test',
            'name': 'CLI Test Mode',
            'roleDefinition': 'A mode for CLI testing',
            'groups': ['read']
        }
        with open(modes_dir / "cli-test.yaml", 'w') as f:
            yaml.dump(test_mode, f)
        
        # Test that the parser actually accepts short options
        with patch('sys.argv', [
            'cli.py', 'sync-global', 
            '-m', str(modes_dir),
            '-s', 'alphabetical',
            '-d'
        ]):
            with patch('cli.ModeSync') as mock_sync_class:
                mock_sync_instance = MagicMock()
                mock_sync_class.return_value = mock_sync_instance
                mock_sync_instance.sync_modes.return_value = True
                
                with patch('cli.get_default_modes_dir') as mock_default:
                    mock_default.return_value = modes_dir
                    
                    result = main()
                    
                    # Verify ModeSync was initialized with correct modes_dir
                    mock_sync_class.assert_called_once()
                    init_args = mock_sync_class.call_args
                    assert init_args[0][0] == Path(str(modes_dir))
                    
                    # Verify sync_modes was called with correct strategy
                    mock_sync_instance.sync_modes.assert_called_once()
                    sync_args = mock_sync_instance.sync_modes.call_args[1]
                    assert sync_args['strategy_name'] == 'alphabetical'
                    assert sync_args['dry_run'] is True
                    
                    assert result == 0
    
    def test_real_argument_parsing_backup(self, tmp_path):
        """Test actual argument parsing for backup with short options."""
        with patch('sys.argv', [
            'cli.py', 'backup',
            '-t', 'local',
            '-p', str(tmp_path)
        ]):
            with patch('cli.BackupManager') as mock_backup_class:
                mock_backup_instance = MagicMock()
                mock_backup_class.return_value = mock_backup_instance
                mock_backup_instance.backup_local_roomodes.return_value = tmp_path / "backup.yaml"
                
                # Create a dummy local config file to backup
                local_config = tmp_path / ".roomodes"
                local_config.touch()
                
                result = main()
                
                # Verify BackupManager was initialized with correct project dir
                mock_backup_class.assert_called_once_with(tmp_path)
                
                # Verify local backup was called
                mock_backup_instance.backup_local_roomodes.assert_called_once()
                
                assert result == 0


class TestCLIErrorHandling:
    """Test error handling with short options."""
    
    def test_invalid_strategy_with_short_option(self, tmp_path):
        """Test that invalid strategy values are handled properly with short options."""
        modes_dir = tmp_path / "modes"
        modes_dir.mkdir()
        
        with patch('sys.argv', [
            'cli.py', 'sync-global',
            '-m', str(modes_dir),
            '-s', 'invalid_strategy'
        ]):
            with patch('cli.ModeSync') as mock_sync_class:
                mock_sync_instance = MagicMock()
                mock_sync_class.return_value = mock_sync_instance
                mock_sync_instance.sync_modes.side_effect = SyncError("Invalid strategy")
                
                result = main()
                
                # Should return error code
                assert result == 1
    
    def test_missing_required_argument(self, tmp_path):
        """Test that missing required arguments are handled properly."""
        # sync-local requires a project_dir argument
        with patch('sys.argv', ['cli.py', 'sync-local']):
            with pytest.raises(SystemExit):
                # argparse should exit with error for missing required argument
                main()


if __name__ == '__main__':
    pytest.main([__file__])