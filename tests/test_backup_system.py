#!/usr/bin/env python3
"""
Tests for the backup and restore system with corrected file structure.
"""

import pytest
import tempfile
import yaml
import os
from pathlib import Path
from unittest.mock import patch, mock_open

import sys
script_dir = Path(__file__).resolve().parent.parent / "scripts" / "roo_modes_sync"
sys.path.insert(0, str(script_dir))

from core.backup import BackupManager, BackupError


class TestBackupManagerCorrected:
    """Test backup system with correct file structure understanding."""
    
    def test_backup_local_roomodes_correct_path(self, tmp_path):
        """Test that local backup targets .roomodes file (no extension)."""
        # Create the local config file at correct path
        local_roomodes_file = tmp_path / '.roomodes'
        test_config = {
            'customModes': [
                {
                    'slug': 'test-mode',
                    'name': 'Test Mode',
                    'source': 'global'
                }
            ]
        }
        with open(local_roomodes_file, 'w') as f:
            yaml.dump(test_config, f)
        
        # Initialize backup manager
        backup_manager = BackupManager(tmp_path)
        
        # Backup local config
        backup_path = backup_manager.backup_local_roomodes()
        
        # Verify backup was created
        assert backup_path.exists()
        assert backup_path.parent == backup_manager.local_backup_dir
        assert backup_path.name.startswith('.roomodes_')
        
        # Verify backup content
        with open(backup_path, 'r') as f:
            backup_content = yaml.safe_load(f)
        assert backup_content == test_config
    
    def test_backup_local_roomodes_fails_when_file_missing(self, tmp_path):
        """Test that local backup fails when .roomodes file doesn't exist."""
        backup_manager = BackupManager(tmp_path)
        
        with pytest.raises(BackupError, match="Local .roomodes file not found"):
            backup_manager.backup_local_roomodes()
    
    @patch('os.path.expanduser')
    def test_backup_global_config_correct_path(self, mock_expanduser, tmp_path):
        """Test that global backup targets custom_modes.yaml in VSCodium settings."""
        # Setup mock global config path
        mock_global_dir = tmp_path / "mock_vscodium" / "User" / "globalStorage" / "rooveterinaryinc.roo-cline" / "settings"
        mock_global_dir.mkdir(parents=True)
        mock_global_config = mock_global_dir / "custom_modes.yaml"
        
        # Mock expanduser to return our test path
        def mock_expand(path):
            if path.startswith("~/.config/VSCodium"):
                relative_path = path[len("~/.config/VSCodium/"):]  # Remove "~/.config/VSCodium/"
                return str(tmp_path / "mock_vscodium" / relative_path)
            return path
        mock_expanduser.side_effect = mock_expand
        
        # Create test global config
        test_config = {
            'customModes': [
                {
                    'slug': 'global-mode',
                    'name': 'Global Mode',
                    'source': 'global'
                }
            ]
        }
        with open(mock_global_config, 'w') as f:
            yaml.dump(test_config, f)
        
        # Initialize backup manager with project root
        project_root = tmp_path / "project"
        project_root.mkdir()
        backup_manager = BackupManager(project_root)
        
        # Backup global config
        backup_path = backup_manager.backup_global_roomodes()
        
        # Verify backup was created
        assert backup_path.exists()
        assert backup_path.parent == backup_manager.global_backup_dir
        assert backup_path.name.startswith('custom_modes_')
        assert backup_path.name.endswith('.yaml')
        
        # Verify backup content
        with open(backup_path, 'r') as f:
            backup_content = yaml.safe_load(f)
        assert backup_content == test_config
    
    @patch('os.path.expanduser')
    def test_backup_global_config_fails_when_file_missing(self, mock_expanduser, tmp_path):
        """Test that global backup fails when custom_modes.yaml doesn't exist."""
        # Mock expanduser to return non-existent path
        mock_expanduser.return_value = str(tmp_path / "nonexistent" / "custom_modes.yaml")
        
        project_root = tmp_path / "project"
        project_root.mkdir()
        backup_manager = BackupManager(project_root)
        
        with pytest.raises(BackupError, match="Global custom_modes.yaml file not found"):
            backup_manager.backup_global_roomodes()
    
    def test_backup_custom_modes_alias_works(self, tmp_path):
        """Test that backup_custom_modes is an alias for backup_global_roomodes."""
        project_root = tmp_path / "project"
        project_root.mkdir()
        backup_manager = BackupManager(project_root)
        
        # Mock the global backup method
        with patch.object(backup_manager, 'backup_global_roomodes') as mock_global:
            mock_path = Path("/mock/backup/path")
            mock_global.return_value = mock_path
            
            result = backup_manager.backup_custom_modes()
            
            mock_global.assert_called_once()
            assert result == mock_path
    
    def test_restore_local_roomodes_correct_target(self, tmp_path):
        """Test that local restore targets .roomodes file (no extension)."""
        backup_manager = BackupManager(tmp_path)
        
        # Create a backup file
        test_config = {
            'customModes': [
                {
                    'slug': 'restored-mode',
                    'name': 'Restored Mode',
                    'source': 'global'
                }
            ]
        }
        backup_path = backup_manager.local_backup_dir / '.roomodes_1'
        with open(backup_path, 'w') as f:
            yaml.dump(test_config, f)
        
        # Restore from backup
        restored_path = backup_manager.restore_local_roomodes(backup_path)
        
        # Verify target path is correct
        expected_target = tmp_path / '.roomodes'
        assert restored_path == expected_target
        assert restored_path.exists()
        
        # Verify restored content
        with open(restored_path, 'r') as f:
            restored_content = yaml.safe_load(f)
        assert restored_content == test_config
        
        # Verify backup file was removed after successful restore
        assert not backup_path.exists()
    
    @patch('os.path.expanduser')
    def test_restore_global_config_correct_target(self, mock_expanduser, tmp_path):
        """Test that global restore targets custom_modes.yaml in VSCodium settings."""
        # Setup mock global config path
        mock_global_dir = tmp_path / "mock_vscodium" / "User" / "globalStorage" / "rooveterinaryinc.roo-cline" / "settings"
        mock_global_dir.mkdir(parents=True)
        
        # Mock expanduser to return our test path
        def mock_expand(path):
            if path.startswith("~/.config/VSCodium"):
                relative_path = path[len("~/.config/VSCodium/"):]  # Remove "~/.config/VSCodium/"
                return str(tmp_path / "mock_vscodium" / relative_path)
            return path
        mock_expanduser.side_effect = mock_expand
        
        project_root = tmp_path / "project"
        project_root.mkdir()
        backup_manager = BackupManager(project_root)
        
        # Create a backup file
        test_config = {
            'customModes': [
                {
                    'slug': 'global-restored-mode',
                    'name': 'Global Restored Mode',
                    'source': 'global'
                }
            ]
        }
        backup_path = backup_manager.global_backup_dir / 'custom_modes_1.yaml'
        with open(backup_path, 'w') as f:
            yaml.dump(test_config, f)
        
        # Restore from backup
        restored_path = backup_manager.restore_global_roomodes(backup_path)
        
        # Verify target path is correct
        expected_target = mock_global_dir / "custom_modes.yaml"
        assert restored_path == expected_target
        assert restored_path.exists()
        
        # Verify restored content
        with open(restored_path, 'r') as f:
            restored_content = yaml.safe_load(f)
        assert restored_content == test_config
        
        # Verify backup file was removed after successful restore
        assert not backup_path.exists()
    
    def test_list_backups_correct_patterns(self, tmp_path):
        """Test that list_backups uses correct file patterns."""
        backup_manager = BackupManager(tmp_path)
        
        # Create various backup files
        local_backup1 = backup_manager.local_backup_dir / '.roomodes_1'
        local_backup2 = backup_manager.local_backup_dir / '.roomodes_2'
        global_backup1 = backup_manager.global_backup_dir / 'custom_modes_1.yaml'
        global_backup2 = backup_manager.global_backup_dir / 'custom_modes_2.yaml'
        
        # Write test content to backup files
        for backup_file in [local_backup1, local_backup2, global_backup1, global_backup2]:
            with open(backup_file, 'w') as f:
                yaml.dump({'test': 'content'}, f)
        
        # List backups
        all_backups = backup_manager.list_available_backups()
        
        # Verify local backups are found with correct pattern
        assert len(all_backups['local_roomodes']) == 2
        local_numbers = {backup['number'] for backup in all_backups['local_roomodes']}
        assert local_numbers == {1, 2}
        
        # Verify global custom modes backups are found with correct pattern
        assert len(all_backups['global_custom_modes']) == 2
        global_numbers = {backup['number'] for backup in all_backups['global_custom_modes']}
        assert global_numbers == {1, 2}
    
    def test_backup_all_only_backs_up_existing_files(self, tmp_path):
        """Test that backup_all only backs up files that actually exist."""
        backup_manager = BackupManager(tmp_path)
        
        # Create only local file
        local_roomodes = tmp_path / '.roomodes'
        with open(local_roomodes, 'w') as f:
            yaml.dump({'local': 'config'}, f)
        
        # Mock global config to not exist
        with patch('os.path.expanduser') as mock_expanduser:
            mock_expanduser.return_value = str(tmp_path / "nonexistent" / "custom_modes.yaml")
            
            backup_paths = backup_manager.backup_all()
        
        # Should only backup the local file
        assert len(backup_paths) == 1
        assert backup_paths[0].parent == backup_manager.local_backup_dir
        assert backup_paths[0].name.startswith('.roomodes_')
    
    def test_get_next_backup_number_handles_both_patterns(self, tmp_path):
        """Test that backup numbering works for both .roomodes and .yaml files."""
        backup_manager = BackupManager(tmp_path)
        
        # Create existing local backups (.roomodes_N pattern)
        (backup_manager.local_backup_dir / '.roomodes_1').touch()
        (backup_manager.local_backup_dir / '.roomodes_3').touch()
        
        # Create existing global backups (custom_modes_N.yaml pattern)
        (backup_manager.global_backup_dir / 'custom_modes_1.yaml').touch()
        (backup_manager.global_backup_dir / 'custom_modes_2.yaml').touch()
        
        # Test local backup numbering
        next_local = backup_manager._get_next_backup_number(backup_manager.local_backup_dir, '.roomodes')
        assert next_local == 4  # Should be max(1,3) + 1
        
        # Test global backup numbering
        next_global = backup_manager._get_next_backup_number(backup_manager.global_backup_dir, 'custom_modes.yaml')
        assert next_global == 3  # Should be max(1,2) + 1
    
    def test_create_backup_filename_handles_both_patterns(self, tmp_path):
        """Test that backup filename creation works for both patterns."""
        backup_manager = BackupManager(tmp_path)
        
        # Test local pattern (.roomodes -> .roomodes_N)
        local_filename = backup_manager._create_backup_filename('.roomodes', 5)
        assert local_filename == '.roomodes_5'
        
        # Test global pattern (custom_modes.yaml -> custom_modes_N.yaml)
        global_filename = backup_manager._create_backup_filename('custom_modes.yaml', 3)
        assert global_filename == 'custom_modes_3.yaml'