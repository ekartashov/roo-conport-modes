#!/usr/bin/env python3
"""
Mode synchronization functionality.

Provides functionality for synchronizing mode configurations:
- Global mode application (system-wide configuration)
- Local mode application (project-specific configuration)
- Dynamic discovery and categorization
- MCP server interface support
"""

import yaml
import shutil
import os
from pathlib import Path
from typing import Dict, List, Any, Optional, Union, Tuple

from ..exceptions import SyncError, ConfigurationError
from .discovery import ModeDiscovery
from .validation import ModeValidator
from .ordering import OrderingStrategyFactory


class ModeSync:
    """
    Main synchronization class for Roo modes configuration.
    
    Handles loading mode configurations, creating global/local configurations,
    and writing to the target config files.
    """
    
    # Default path for global modes config
    DEFAULT_GLOBAL_CONFIG_PATH = Path(os.path.expanduser(
        "~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/custom_modes.yaml"
    ))
    
    # Local project configuration structure
    LOCAL_CONFIG_DIR = ".roomodes"
    LOCAL_CONFIG_FILE = "modes.yaml"
    
    def __init__(self, modes_dir: Path):
        """
        Initialize with modes directory path.
        
        Args:
            modes_dir: Path to directory containing mode YAML files
        """
        self.modes_dir = modes_dir
        self.global_config_path = None
        self.local_config_path = None
        self.discovery = ModeDiscovery(modes_dir)
        self.validator = ModeValidator()
        
    def set_global_config_path(self, config_path: Optional[Path] = None) -> None:
        """
        Set the path for the global configuration file.
        
        Args:
            config_path: Path to the global config file or None to use default
        """
        self.global_config_path = config_path or self.DEFAULT_GLOBAL_CONFIG_PATH
        self.local_config_path = None  # Reset local path
        
    def set_local_config_path(self, project_dir: Path) -> None:
        """
        Set the path for the local project configuration.
        
        Args:
            project_dir: Path to the project directory
        """
        self.validate_target_directory(project_dir)
        config_dir = project_dir / self.LOCAL_CONFIG_DIR
        self.local_config_path = config_dir / self.LOCAL_CONFIG_FILE
        self.global_config_path = None  # Reset global path
        
    def validate_target_directory(self, directory: Path) -> bool:
        """
        Validate that a directory exists and is actually a directory.
        
        Args:
            directory: Path to validate
            
        Returns:
            True if valid
            
        Raises:
            SyncError: If directory is invalid
        """
        if not directory.exists():
            raise SyncError(f"Target directory does not exist: {directory}")
        
        if not directory.is_dir():
            raise SyncError(f"Target is not a directory: {directory}")
            
        return True
        
    def create_local_mode_directory(self) -> bool:
        """
        Create the local mode directory structure if it doesn't exist.
        
        Returns:
            True if successful
            
        Raises:
            SyncError: If directory creation fails
        """
        if not self.local_config_path:
            raise SyncError("Local config path not set")
            
        config_dir = self.local_config_path.parent
        
        try:
            config_dir.mkdir(parents=True, exist_ok=True)
            return True
        except Exception as e:
            raise SyncError(f"Failed to create local mode directory: {e}")
        
    def load_mode_config(self, slug: str) -> Dict[str, Any]:
        """
        Load and validate a mode configuration.
        
        Args:
            slug: Mode slug to load
            
        Returns:
            Validated mode configuration dictionary
            
        Raises:
            SyncError: If the mode file does not exist or fails validation
        """
        mode_file = self.modes_dir / f"{slug}.yaml"
        
        if not mode_file.exists():
            raise SyncError(f"Mode file not found: {mode_file}")
            
        try:
            with open(mode_file, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f)
                
            # Validate the configuration
            self.validator.validate_mode_config(config, str(mode_file))
                
            # Ensure source is set to 'global'
            config['source'] = 'global'
            
            return config
            
        except yaml.YAMLError as e:
            raise SyncError(f"Error parsing YAML for {slug}: {e}")
        except Exception as e:
            raise SyncError(f"Error loading {slug}: {e}")
    
    def create_global_config(self, strategy_name: str = 'strategic',
                           options: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Create the global configuration with the specified ordering strategy.
        
        Args:
            strategy_name: Name of the ordering strategy to use
            options: Strategy-specific options
            
        Returns:
            Complete global configuration dictionary
        """
        if options is None:
            options = {}
        
        config = {'customModes': []}
        
        # Discover all modes
        categorized_modes = self.discovery.discover_all_modes()
        
        # Create ordering strategy
        try:
            strategy_factory = OrderingStrategyFactory()
            strategy = strategy_factory.create_strategy(strategy_name)
        except Exception as e:
            raise SyncError(f"Failed to create ordering strategy: {e}")
        
        # Get ordered mode list
        ordered_mode_slugs = strategy.order_modes(categorized_modes, options)
        
        # Apply exclusion filter directly here as well (in case strategy didn't)
        if 'exclude' in options and options['exclude']:
            excluded_modes = set(options['exclude'])
            ordered_mode_slugs = [mode for mode in ordered_mode_slugs if mode not in excluded_modes]
        
        # Load modes in the specified order
        for mode_slug in ordered_mode_slugs:
            try:
                mode_config = self.load_mode_config(mode_slug)
                config['customModes'].append(mode_config)
            except SyncError:
                # Skip modes that fail to load
                pass
        
        return config
    
    def format_multiline_string(self, text: str, indent: int = 2) -> str:
        """
        Format a multiline string with proper YAML folded scalar syntax.
        
        Args:
            text: String to format
            indent: Indentation level
            
        Returns:
            Formatted string
        """
        if '\n' in text or len(text) > 80:
            # Use folded scalar syntax for multiline text
            prefix = ' ' * indent
            formatted_text = text.strip().replace('\n', f'\n{prefix}')
            return f">-\n{prefix}{formatted_text}"
        else:
            # Single line - check if it needs quoting
            if ':' in text or text.startswith('Activate') or '"' in text:
                return f'"{text}"'
            return text
    
    def backup_existing_config(self) -> bool:
        """
        Create a backup of the existing config if it exists.
        
        Returns:
            True if backup succeeded or wasn't needed, False if backup failed
        
        Raises:
            SyncError: If backup fails
        """
        # Determine which config path to use
        config_path = self.local_config_path if self.local_config_path else self.global_config_path
        
        if not config_path:
            raise SyncError("No config path set (neither global nor local)")
            
        if config_path.exists() and config_path.stat().st_size > 0:
            backup_path = config_path.with_suffix('.yaml.backup')
            try:
                shutil.copy2(config_path, backup_path)
                return True
            except Exception as e:
                raise SyncError(f"Could not create backup: {e}")
        
        return True
    
    def write_config(self, config: Dict[str, Any]) -> bool:
        """
        Write the configuration to the config file with proper formatting.
        Uses either global or local config path based on which one is set.
        
        Args:
            config: Configuration dictionary
            
        Returns:
            True if write succeeded, False otherwise
            
        Raises:
            SyncError: If write fails
        """
        # Determine which config path to use
        config_path = self.local_config_path if self.local_config_path else self.global_config_path
        
        if not config_path:
            raise SyncError("No config path set (neither global nor local)")
            
        try:
            # Ensure the parent directory exists
            config_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Custom YAML representation for better formatting
            yaml_content = "customModes:\n"
            
            for mode in config['customModes']:
                yaml_content += f"  - slug: {mode['slug']}\n"
                yaml_content += f"    name: {self.format_multiline_string(mode['name'], 4)}\n"
                yaml_content += f"    roleDefinition: {self.format_multiline_string(mode['roleDefinition'], 4)}\n"
                
                if 'whenToUse' in mode:
                    yaml_content += f"    whenToUse: {self.format_multiline_string(mode['whenToUse'], 4)}\n"
                
                if 'customInstructions' in mode:
                    yaml_content += f"    customInstructions: {self.format_multiline_string(mode['customInstructions'], 4)}\n"
                
                yaml_content += "    groups:\n"
                for group in mode['groups']:
                    if isinstance(group, str):
                        yaml_content += f"      - {group}\n"
                    elif isinstance(group, list) and len(group) == 2:
                        yaml_content += f"      - - {group[0]}\n"
                        yaml_content += f"        - fileRegex: {group[1]['fileRegex']}\n"
                        if 'description' in group[1]:
                            yaml_content += f"          description: {group[1]['description']}\n"
                
                yaml_content += f"    source: {mode['source']}\n"
            
            # Write to file
            with open(config_path, 'w', encoding='utf-8') as f:
                f.write(yaml_content)
            
            return True
            
        except Exception as e:
            raise SyncError(f"Error writing configuration: {e}")
    
    def write_global_config(self, config: Dict[str, Any]) -> bool:
        """
        Write the configuration to the global config file.
        Alias for write_config for backward compatibility.
        
        Args:
            config: Configuration dictionary
            
        Returns:
            True if write succeeded, False otherwise
        """
        if not self.global_config_path:
            raise SyncError("Global config path not set")
            
        self.local_config_path = None  # Ensure we're writing to global
        return self.write_config(config)
        
    def sync_modes(self, strategy_name: str = 'strategic', 
                  options: Optional[Dict[str, Any]] = None,
                  dry_run: bool = False) -> bool:
        """
        Main synchronization method.
        
        Args:
            strategy_name: Name of the ordering strategy to use
            options: Strategy-specific options
            dry_run: If True, don't write config file
            
        Returns:
            True if sync succeeded, False otherwise
        """
        if options is None:
            options = {}
            
        # Check if modes directory exists
        if not self.modes_dir.exists():
            raise SyncError(f"Modes directory not found: {self.modes_dir}")
            
        # Ensure we have a config path set (either global or local)
        if not self.global_config_path and not self.local_config_path:
            raise SyncError("No config path set (neither global nor local)")
            
        # Create local directory structure if needed
        if self.local_config_path and not dry_run:
            try:
                self.create_local_mode_directory()
            except SyncError:
                return False
        
        # Create backup if not dry run
        if not dry_run:
            try:
                self.backup_existing_config()
            except SyncError:
                # Continue without backup
                pass
        
        # Create configuration
        try:
            config = self.create_global_config(strategy_name, options)
            
            if not config['customModes']:
                return False
            
            # Write configuration if not dry run
            if not dry_run:
                return self.write_config(config)
            
            return True
                
        except Exception as e:
            raise SyncError(f"Sync failed: {e}")
            
    def get_sync_status(self) -> Dict[str, Any]:
        """
        Get the current sync status with mode information.
        
        Returns:
            Dictionary with sync status information
        """
        categorized_modes = self.discovery.discover_all_modes()
        
        # Flatten the categorized modes for easier access
        all_modes = []
        mode_details = []
        
        for category, modes in categorized_modes.items():
            all_modes.extend(modes)
            
            for mode_slug in modes:
                try:
                    config = self.load_mode_config(mode_slug)
                    mode_details.append({
                        'slug': mode_slug,
                        'name': config.get('name', mode_slug),
                        'category': category,
                        'valid': True
                    })
                except SyncError:
                    mode_details.append({
                        'slug': mode_slug,
                        'name': mode_slug,
                        'category': category,
                        'valid': False
                    })
        
        # Get category information
        category_info = self.discovery.get_category_info()
        categories = []
        
        for category, info in category_info.items():
            categories.append({
                'name': category,
                'display_name': info.get('name', category),
                'icon': info.get('icon', ''),
                'count': len(categorized_modes.get(category, []))
            })
        
        return {
            'mode_count': len(all_modes),
            'categories': categories,
            'modes': mode_details
        }
    
    def sync_from_dict(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Sync modes based on parameters provided in a dictionary.
        This is primarily used for the MCP interface.
        
        Args:
            params: Dictionary with sync parameters:
                   - target: Path to target directory (required)
                   - strategy: Ordering strategy (optional, default: 'strategic')
                   - options: Strategy options (optional)
            
        Returns:
            Dictionary with result information:
                - success: True if sync succeeded, False otherwise
                - message: Success message if succeeded
                - error: Error message if failed
        """
        try:
            # Validate required parameters
            if 'target' not in params:
                return {
                    'success': False,
                    'error': 'Missing required parameter: target'
                }
                
            target_path = Path(params['target'])
            
            # Validate target directory
            try:
                self.validate_target_directory(target_path)
            except SyncError as e:
                return {
                    'success': False,
                    'error': f'Invalid target directory: {str(e)}'
                }
                
            # Set local config path
            self.set_local_config_path(target_path)
            
            # Get strategy and options
            strategy = params.get('strategy', 'strategic')
            options = params.get('options', {})
            
            # Perform sync
            success = self.sync_modes(strategy_name=strategy, options=options)
            
            if success:
                return {
                    'success': True,
                    'message': f'Successfully synced modes to {target_path}'
                }
            else:
                return {
                    'success': False,
                    'error': 'Sync failed - no valid modes found or write error'
                }
                
        except SyncError as e:
            return {
                'success': False,
                'error': str(e)
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            }