#!/usr/bin/env python3
"""
Backup and restore functionality for Roo modes files.
"""

import re
import shutil
from pathlib import Path
from typing import Dict, List, Optional, Union


class BackupError(Exception):
    """Error raised during backup or restore operations."""
    pass


class BackupManager:
    """Manages backup and restore operations for Roo modes files."""
    
    def __init__(self, project_root: Union[str, Path]):
        """
        Initialize the BackupManager.
        
        Args:
            project_root: Path to the project root directory
            
        Raises:
            BackupError: If project root doesn't exist
        """
        self.project_root = Path(project_root)
        
        if not self.project_root.exists():
            raise BackupError(f"Project root does not exist: {self.project_root}")
        
        # Setup backup directory structure
        self.cache_dir = self.project_root / 'cache'
        self.local_backup_dir = self.cache_dir / 'roo_modes_local_backup'
        self.global_backup_dir = self.cache_dir / 'roo_modes_global_backup'
        
        # Create directories if they don't exist
        self._ensure_backup_directories()
    
    def _ensure_backup_directories(self) -> None:
        """Create backup directories if they don't exist."""
        self.cache_dir.mkdir(exist_ok=True)
        self.local_backup_dir.mkdir(exist_ok=True)
        self.global_backup_dir.mkdir(exist_ok=True)
    
    def _get_next_backup_number(self, backup_dir: Path, base_filename: str) -> int:
        """
        Get the next available backup number for a file.
        
        Args:
            backup_dir: Directory containing backup files
            base_filename: Base filename (e.g., '.roomodes', 'custom_modes.yaml')
            
        Returns:
            Next available backup number
        """
        existing_numbers = []
        
        if base_filename.endswith('.yaml'):
            # For custom_modes.yaml -> custom_modes_N.yaml
            base_name = base_filename.replace('.yaml', '')
            pattern = f"{base_name}_(\\d+)\\.yaml"
        else:
            # For .roomodes -> .roomodes_N
            pattern = f"{re.escape(base_filename)}_(\\d+)"
        
        for backup_file in backup_dir.iterdir():
            if backup_file.is_file():
                match = re.match(pattern, backup_file.name)
                if match:
                    existing_numbers.append(int(match.group(1)))
        
        return max(existing_numbers, default=0) + 1
    
    def _get_latest_backup_number(self, backup_dir: Path, base_filename: str) -> Optional[int]:
        """
        Get the highest backup number for a file.
        
        Args:
            backup_dir: Directory containing backup files
            base_filename: Base filename (e.g., '.roomodes', 'custom_modes.yaml')
            
        Returns:
            Latest backup number or None if no backups exist
        """
        existing_numbers = []
        
        if base_filename.endswith('.yaml'):
            # For custom_modes.yaml -> custom_modes_N.yaml
            base_name = base_filename.replace('.yaml', '')
            pattern = f"{base_name}_(\\d+)\\.yaml"
        else:
            # For .roomodes -> .roomodes_N
            pattern = f"{re.escape(base_filename)}_(\\d+)"
        
        for backup_file in backup_dir.iterdir():
            if backup_file.is_file():
                match = re.match(pattern, backup_file.name)
                if match:
                    existing_numbers.append(int(match.group(1)))
        
        return max(existing_numbers) if existing_numbers else None
    
    def _create_backup_filename(self, base_filename: str, backup_number: int) -> str:
        """
        Create a backup filename with number suffix.
        
        Args:
            base_filename: Base filename (e.g., '.roomodes', 'custom_modes.yaml')
            backup_number: Backup number to append
            
        Returns:
            Backup filename with number suffix
        """
        if base_filename.endswith('.yaml'):
            # For custom_modes.yaml -> custom_modes_N.yaml
            base_name = base_filename.replace('.yaml', '')
            return f"{base_name}_{backup_number}.yaml"
        else:
            # For .roomodes -> .roomodes_N
            return f"{base_filename}_{backup_number}"
    
    def backup_local_roomodes(self) -> Path:
        """
        Backup the local .roomodes file.
        
        Returns:
            Path to the created backup file
            
        Raises:
            BackupError: If the file doesn't exist or backup fails
        """
        source_file = self.project_root / '.roomodes'
        
        if not source_file.exists():
            raise BackupError(f"Local .roomodes file not found: {source_file}")
        
        backup_number = self._get_next_backup_number(self.local_backup_dir, '.roomodes')
        backup_filename = self._create_backup_filename('.roomodes', backup_number)
        backup_path = self.local_backup_dir / backup_filename
        
        try:
            shutil.copy2(source_file, backup_path)
            return backup_path
        except (OSError, IOError) as e:
            raise BackupError(f"Failed to backup local .roomodes file: {e}")
    
    def backup_global_roomodes(self) -> Path:
        """
        Backup the global .roomodes file.
        
        Returns:
            Path to the created backup file
            
        Raises:
            BackupError: If the file doesn't exist or backup fails
        """
        source_file = self.project_root / 'global.roomodes'
        
        if not source_file.exists():
            raise BackupError(f"Global .roomodes file not found: {source_file}")
        
        backup_number = self._get_next_backup_number(self.global_backup_dir, '.roomodes')
        backup_filename = self._create_backup_filename('.roomodes', backup_number)
        backup_path = self.global_backup_dir / backup_filename
        
        try:
            shutil.copy2(source_file, backup_path)
            return backup_path
        except (OSError, IOError) as e:
            raise BackupError(f"Failed to backup global .roomodes file: {e}")
    
    def backup_custom_modes(self) -> Path:
        """
        Backup the custom_modes.yaml file.
        
        Returns:
            Path to the created backup file
            
        Raises:
            BackupError: If the file doesn't exist or backup fails
        """
        source_file = self.project_root / 'custom_modes.yaml'
        
        if not source_file.exists():
            raise BackupError(f"Custom modes file not found: {source_file}")
        
        backup_number = self._get_next_backup_number(self.global_backup_dir, 'custom_modes.yaml')
        backup_filename = self._create_backup_filename('custom_modes.yaml', backup_number)
        backup_path = self.global_backup_dir / backup_filename
        
        try:
            shutil.copy2(source_file, backup_path)
            return backup_path
        except (OSError, IOError) as e:
            raise BackupError(f"Failed to backup custom_modes.yaml file: {e}")
    
    def backup_all(self) -> List[Path]:
        """
        Backup all Roo modes files that exist.
        
        Returns:
            List of paths to created backup files
            
        Raises:
            BackupError: If any backup operation fails
        """
        backup_paths = []
        
        # Try to backup each file, but only if it exists
        local_roomodes = self.project_root / '.roomodes'
        if local_roomodes.exists():
            backup_paths.append(self.backup_local_roomodes())
        
        global_roomodes = self.project_root / 'global.roomodes'
        if global_roomodes.exists():
            backup_paths.append(self.backup_global_roomodes())
        
        custom_modes = self.project_root / 'custom_modes.yaml'
        if custom_modes.exists():
            backup_paths.append(self.backup_custom_modes())
        
        return backup_paths
    
    def restore_local_roomodes(self, backup_file_path: Optional[Path] = None) -> Path:
        """
        Restore the local .roomodes file from backup.
        
        Args:
            backup_file_path: Specific backup file to restore from.
                             If None, restores from the latest backup.
        
        Returns:
            Path to the restored file
            
        Raises:
            BackupError: If no backups available or restore fails
        """
        target_file = self.project_root / '.roomodes'
        
        if backup_file_path is None:
            # Find latest backup
            latest_number = self._get_latest_backup_number(self.local_backup_dir, '.roomodes')
            if latest_number is None:
                raise BackupError("No local .roomodes backups available")
            
            backup_filename = self._create_backup_filename('.roomodes', latest_number)
            backup_file_path = self.local_backup_dir / backup_filename
        
        if not backup_file_path.exists():
            raise BackupError(f"Backup file not found: {backup_file_path}")
        
        try:
            shutil.copy2(backup_file_path, target_file)
            backup_file_path.unlink()  # Remove backup file after successful restore
            return target_file
        except (OSError, IOError) as e:
            raise BackupError(f"Failed to restore local .roomodes file: {e}")
    
    def restore_global_roomodes(self, backup_file_path: Optional[Path] = None) -> Path:
        """
        Restore the global .roomodes file from backup.
        
        Args:
            backup_file_path: Specific backup file to restore from.
                             If None, restores from the latest backup.
        
        Returns:
            Path to the restored file
            
        Raises:
            BackupError: If no backups available or restore fails
        """
        target_file = self.project_root / 'global.roomodes'
        
        if backup_file_path is None:
            # Find latest backup
            latest_number = self._get_latest_backup_number(self.global_backup_dir, '.roomodes')
            if latest_number is None:
                raise BackupError("No global .roomodes backups available")
            
            backup_filename = self._create_backup_filename('.roomodes', latest_number)
            backup_file_path = self.global_backup_dir / backup_filename
        
        if not backup_file_path.exists():
            raise BackupError(f"Backup file not found: {backup_file_path}")
        
        try:
            shutil.copy2(backup_file_path, target_file)
            backup_file_path.unlink()  # Remove backup file after successful restore
            return target_file
        except (OSError, IOError) as e:
            raise BackupError(f"Failed to restore global .roomodes file: {e}")
    
    def restore_custom_modes(self, backup_file_path: Optional[Path] = None) -> Path:
        """
        Restore the custom_modes.yaml file from backup.
        
        Args:
            backup_file_path: Specific backup file to restore from.
                             If None, restores from the latest backup.
        
        Returns:
            Path to the restored file
            
        Raises:
            BackupError: If no backups available or restore fails
        """
        target_file = self.project_root / 'custom_modes.yaml'
        
        if backup_file_path is None:
            # Find latest backup
            latest_number = self._get_latest_backup_number(self.global_backup_dir, 'custom_modes.yaml')
            if latest_number is None:
                raise BackupError("No custom_modes.yaml backups available")
            
            backup_filename = self._create_backup_filename('custom_modes.yaml', latest_number)
            backup_file_path = self.global_backup_dir / backup_filename
        
        if not backup_file_path.exists():
            raise BackupError(f"Backup file not found: {backup_file_path}")
        
        try:
            shutil.copy2(backup_file_path, target_file)
            backup_file_path.unlink()  # Remove backup file after successful restore
            return target_file
        except (OSError, IOError) as e:
            raise BackupError(f"Failed to restore custom_modes.yaml file: {e}")
    
    def list_available_backups(self) -> Dict[str, List[Dict[str, Union[int, str, Path]]]]:
        """
        List all available backup files.
        
        Returns:
            Dictionary containing backup information organized by file type:
            {
                'local_roomodes': [{'number': 1, 'path': Path, 'size': '1.2KB', 'file_type': 'local_roomodes', 'mtime': '2023-06-16 11:28:00'}, ...],
                'global_roomodes': [...],
                'custom_modes': [...]
            }
        """
        import datetime
        
        def get_file_size_str(file_path: Path) -> str:
            """Get human-readable file size."""
            size = file_path.stat().st_size
            for unit in ['B', 'KB', 'MB', 'GB']:
                if size < 1024:
                    return f"{size:.1f}{unit}"
                size /= 1024
            return f"{size:.1f}TB"
        
        def extract_backups(backup_dir: Path, pattern: str, file_type: str) -> List[Dict[str, Union[int, str, Path]]]:
            """Extract backup information from a directory."""
            backups = []
            for backup_file in backup_dir.iterdir():
                if backup_file.is_file():
                    match = re.match(pattern, backup_file.name)
                    if match:
                        stat = backup_file.stat()
                        mtime = datetime.datetime.fromtimestamp(stat.st_mtime)
                        backups.append({
                            'number': int(match.group(1)),
                            'path': backup_file,
                            'size': get_file_size_str(backup_file),
                            'file_type': file_type,  # Use file_type instead of type
                            'mtime': mtime.strftime('%Y-%m-%d %H:%M:%S')
                        })
            return sorted(backups, key=lambda x: x['number'])
        
        result = {
            'local_roomodes': extract_backups(
                self.local_backup_dir, 
                r'\.roomodes_(\d+)$', 
                'local_roomodes'
            ),
            'global_roomodes': extract_backups(
                self.global_backup_dir, 
                r'\.roomodes_(\d+)$', 
                'global_roomodes'
            ),
            'custom_modes': extract_backups(
                self.global_backup_dir, 
                r'custom_modes_(\d+)\.yaml$', 
                'custom_modes'
            )
        }
        
        return result