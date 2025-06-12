#!/usr/bin/env python3
"""
Enhanced Roo Modes Global Configuration Sync Script with Dynamic Discovery
and Configurable Ordering Strategies

This enhanced version provides:
- Dynamic file discovery with automatic categorization
- Multiple ordering strategies (strategic, alphabetical, category-based, custom)
- CLI options for ordering specification and filtering
- External configuration file support
- Backward compatibility with original functionality

Author: Roo AI System (Enhanced)
"""

import os
import sys
import yaml
import re
import json
import argparse
from pathlib import Path
import shutil
from typing import Dict, List, Any, Optional, Union
from abc import ABC, abstractmethod


class ModeValidationError(Exception):
    """Custom exception for mode validation errors."""
    pass


class ModeDiscovery:
    """Handles dynamic discovery and categorization of mode files."""
    
    def __init__(self, modes_dir: Path):
        self.modes_dir = modes_dir
        self.category_patterns = {
            'core': [r'^(code|architect|debug|ask|orchestrator)$'],
            'enhanced': [r'.*-enhanced$', r'.*-plus$'],
            'specialized': [
                r'.*-maintenance$',
                r'.*-enhancer.*$',
                r'.*-creator$',
                r'.*-auditor$'
            ]
        }
    
    def discover_all_modes(self) -> Dict[str, List[str]]:
        """
        Discover and categorize all YAML mode files.
        
        Returns:
            Dict with categories as keys and lists of mode slugs as values
        """
        categorized_modes = {
            'core': [],
            'enhanced': [],
            'specialized': [],
            'discovered': []
        }
        
        if not self.modes_dir.exists():
            return categorized_modes
        
        yaml_files = list(self.modes_dir.glob("*.yaml"))
        
        for yaml_file in yaml_files:
            mode_slug = yaml_file.stem
            
            # Skip if not a valid YAML file that can be loaded
            if not self._is_valid_mode_file(yaml_file):
                continue
            
            category = self.categorize_mode(mode_slug)
            categorized_modes[category].append(mode_slug)
        
        # Sort within categories for consistency
        for category in categorized_modes:
            categorized_modes[category].sort()
        
        return categorized_modes
    
    def categorize_mode(self, mode_slug: str) -> str:
        """
        Categorize a mode based on naming patterns.
        
        Args:
            mode_slug: The mode slug to categorize
            
        Returns:
            Category name ('core', 'enhanced', 'specialized', or 'discovered')
        """
        for category, patterns in self.category_patterns.items():
            for pattern in patterns:
                if re.match(pattern, mode_slug):
                    return category
        
        return 'discovered'
    
    def _is_valid_mode_file(self, yaml_file: Path) -> bool:
        """Check if a YAML file is a valid mode file."""
        try:
            with open(yaml_file, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f)
                
            # Basic validation - must have required fields
            required_fields = ['slug', 'name', 'roleDefinition', 'groups']
            return all(field in config for field in required_fields)
            
        except (yaml.YAMLError, FileNotFoundError, KeyError):
            return False


class OrderingStrategy(ABC):
    """Abstract base class for mode ordering strategies."""
    
    @abstractmethod
    def order_modes(self, categorized_modes: Dict[str, List[str]], 
                   options: Dict[str, Any]) -> List[str]:
        """
        Return ordered list of mode slugs.
        
        Args:
            categorized_modes: Dict of categorized mode lists
            options: Strategy-specific options
            
        Returns:
            Ordered list of mode slugs
        """
        pass
    
    @abstractmethod
    def get_description(self) -> str:
        """Return human-readable strategy description."""
        pass
    
    def _apply_filters(self, mode_list: List[str], options: Dict[str, Any]) -> List[str]:
        """Apply priority and exclusion filters to mode list."""
        result = mode_list.copy()
        
        # Apply exclusions
        exclude = options.get('exclude', [])
        if exclude:
            result = [mode for mode in result if mode not in exclude]
        
        # Apply priority-first
        priority_first = options.get('priority_first', [])
        if priority_first:
            # Find priority modes that exist in the result
            priority_modes_found = [mode for mode in priority_first if mode in result]
            # Remove priority modes from their current positions
            non_priority = [mode for mode in result if mode not in priority_modes_found]
            # Add priority modes at the beginning (in specified order)
            result = priority_modes_found + non_priority
        
        return result


class StrategicOrderingStrategy(OrderingStrategy):
    """Maintains the original hardcoded strategic ordering."""
    
    def __init__(self):
        # Original strategic order from the base script
        self.strategic_order = [
            # Core Development Workflow Modes
            "code", "architect", "debug", "ask", "orchestrator",
            # Enhanced Variants
            "code-enhanced",
            # Specialized Tool Modes
            "prompt-enhancer", "prompt-enhancer-isolated", "conport-maintenance"
        ]
    
    def order_modes(self, categorized_modes: Dict[str, List[str]], 
                   options: Dict[str, Any]) -> List[str]:
        """Apply strategic ordering with discovered modes appended."""
        # Start with strategic order for known modes
        ordered_modes = []
        all_modes = []
        
        # Collect all available modes
        for modes in categorized_modes.values():
            all_modes.extend(modes)
        
        # Add modes in strategic order if they exist
        for mode in self.strategic_order:
            if mode in all_modes:
                ordered_modes.append(mode)
        
        # Add any remaining modes (discovered/unknown) alphabetically
        remaining_modes = [mode for mode in all_modes if mode not in ordered_modes]
        remaining_modes.sort()
        ordered_modes.extend(remaining_modes)
        
        return self._apply_filters(ordered_modes, options)
    
    def get_description(self) -> str:
        return "Strategic ordering (original hardcoded order with discovered modes appended)"


class AlphabeticalOrderingStrategy(OrderingStrategy):
    """Simple alphabetical ordering within categories."""
    
    def order_modes(self, categorized_modes: Dict[str, List[str]], 
                   options: Dict[str, Any]) -> List[str]:
        """Apply alphabetical ordering within category precedence."""
        category_order = ['core', 'enhanced', 'specialized', 'discovered']
        ordered_modes = []
        
        for category in category_order:
            if category in categorized_modes:
                # Sort alphabetically within category
                category_modes = sorted(categorized_modes[category])
                ordered_modes.extend(category_modes)
        
        return self._apply_filters(ordered_modes, options)
    
    def get_description(self) -> str:
        return "Alphabetical ordering within categories (core → enhanced → specialized → discovered)"


class CategoryBasedOrderingStrategy(OrderingStrategy):
    """Order by custom category precedence."""
    
    def order_modes(self, categorized_modes: Dict[str, List[str]], 
                   options: Dict[str, Any]) -> List[str]:
        """Apply category-based ordering with optional custom category order."""
        # Default category order
        default_category_order = ['core', 'enhanced', 'specialized', 'discovered']
        category_order = options.get('category_order', default_category_order)
        
        within_category_sort = options.get('within_category_sort', 'alphabetical')
        manual_category_order = options.get('manual_category_order', {})
        
        ordered_modes = []
        
        for category in category_order:
            if category not in categorized_modes:
                continue
                
            category_modes = categorized_modes[category].copy()
            
            if within_category_sort == 'manual' and category in manual_category_order:
                # Use manual ordering for this category
                manual_order = manual_category_order[category]
                ordered_category_modes = []
                
                # Add modes in manual order
                for mode in manual_order:
                    if mode in category_modes:
                        ordered_category_modes.append(mode)
                        category_modes.remove(mode)
                
                # Add any remaining modes alphabetically
                category_modes.sort()
                ordered_category_modes.extend(category_modes)
                
                ordered_modes.extend(ordered_category_modes)
            else:
                # Alphabetical ordering within category
                category_modes.sort()
                ordered_modes.extend(category_modes)
        
        return self._apply_filters(ordered_modes, options)
    
    def get_description(self) -> str:
        return "Category-based ordering with configurable category precedence and within-category sorting"


class CustomOrderingStrategy(OrderingStrategy):
    """User-specified explicit ordering."""
    
    def order_modes(self, categorized_modes: Dict[str, List[str]], 
                   options: Dict[str, Any]) -> List[str]:
        """Apply custom explicit ordering."""
        custom_order = options.get('custom_order', [])
        
        # Collect all available modes
        all_modes = []
        for modes in categorized_modes.values():
            all_modes.extend(modes)
        
        ordered_modes = []
        
        # Add modes in custom order if they exist
        for mode in custom_order:
            if mode in all_modes:
                ordered_modes.append(mode)
        
        # Add remaining modes alphabetically
        remaining_modes = [mode for mode in all_modes if mode not in ordered_modes]
        remaining_modes.sort()
        ordered_modes.extend(remaining_modes)
        
        return self._apply_filters(ordered_modes, options)
    
    def get_description(self) -> str:
        return "Custom explicit ordering with remaining modes appended alphabetically"


class OrderingConfig:
    """Handles loading and validation of external ordering configuration."""
    
    def __init__(self, config_path: Optional[Path] = None):
        self.config_path = config_path
        self.config = {}
        
        if config_path:
            self.config = self.load_config(config_path)
            if not self.is_valid():
                raise ValueError(f"Invalid configuration file: {config_path}")
    
    def load_config(self, config_path: Path) -> Dict[str, Any]:
        """Load configuration from YAML file."""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f)
                return config if config else {}
        except (yaml.YAMLError, FileNotFoundError) as e:
            raise ValueError(f"Failed to load configuration file {config_path}: {e}")
    
    def is_valid(self) -> bool:
        """Validate configuration schema."""
        if not self.config:
            return True  # Empty config is valid (uses defaults)
        
        # Strategy must be valid if specified
        valid_strategies = ['strategic', 'alphabetical', 'category', 'custom']
        strategy = self.config.get('strategy')
        if strategy and strategy not in valid_strategies:
            return False
        
        return True
    
    def get_strategy_options(self) -> Dict[str, Any]:
        """Extract strategy-specific options from config."""
        options = {}
        
        # Copy relevant config keys to options
        config_mappings = {
            'category_order': 'category_order',
            'within_category_sort': 'within_category_sort',
            'manual_category_order': 'manual_category_order',
            'priority_modes': 'priority_first',
            'exclude_modes': 'exclude',
            'custom_order': 'custom_order'
        }
        
        for config_key, option_key in config_mappings.items():
            if config_key in self.config:
                options[option_key] = self.config[config_key]
        
        return options
    
    @property
    def strategy(self) -> str:
        """Get the configured strategy."""
        return self.config.get('strategy', 'strategic')
    
    @property
    def category_order(self) -> List[str]:
        """Get the configured category order."""
        return self.config.get('category_order', ['core', 'enhanced', 'specialized', 'discovered'])
    
    @property
    def priority_modes(self) -> List[str]:
        """Get the configured priority modes."""
        return self.config.get('priority_modes', [])
    
    @property
    def exclude_modes(self) -> List[str]:
        """Get the configured exclude modes."""
        return self.config.get('exclude_modes', [])


class OrderingStrategyFactory:
    """Factory for creating ordering strategy instances."""
    
    strategies = {
        'strategic': StrategicOrderingStrategy,
        'alphabetical': AlphabeticalOrderingStrategy,
        'category': CategoryBasedOrderingStrategy,
        'custom': CustomOrderingStrategy
    }
    
    @classmethod
    def create_strategy(cls, strategy_name: str) -> OrderingStrategy:
        """Create ordering strategy instance."""
        if strategy_name not in cls.strategies:
            raise ValueError(f"Unknown ordering strategy: {strategy_name}")
        return cls.strategies[strategy_name]()
    
    @classmethod
    def get_available_strategies(cls) -> List[str]:
        """Get list of available strategy names."""
        return list(cls.strategies.keys())


class ModeConfigSyncEnhanced:
    """Enhanced version of ModeConfigSync with dynamic discovery and configurable ordering."""
    
    def __init__(self):
        self.workspace_dir = Path("/home/user/Projects/agentic/roo-modes")
        self._modes_dir = self.workspace_dir / "core/modes"
        self.global_config_path = Path.home() / ".config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/custom_modes.yaml"
        
        # Valid tool groups according to schema
        self.valid_groups = {"read", "edit", "browser", "command", "mcp"}
        
        # Initialize discovery - will be created when modes_dir is accessed
        self._discovery = None
    
    @property
    def modes_dir(self):
        """Get the modes directory path."""
        return self._modes_dir
    
    @modes_dir.setter
    def modes_dir(self, value):
        """Set the modes directory path and update discovery."""
        self._modes_dir = value
        self._discovery = None  # Reset discovery to force recreation
    
    @property
    def discovery(self):
        """Get the discovery instance, creating it if necessary."""
        if self._discovery is None:
            self._discovery = ModeDiscovery(self._modes_dir)
        return self._discovery
    
    def validate_slug_pattern(self, slug: str) -> bool:
        """Validate slug matches pattern ^[a-z0-9\\-]+$"""
        pattern = r'^[a-z0-9\-]+$'
        return bool(re.match(pattern, slug))
    
    def validate_string_field(self, value: Any, field_name: str, min_length: int = 1) -> bool:
        """Validate that a field is a non-empty string."""
        if not isinstance(value, str):
            raise ModeValidationError(f"{field_name} must be a string, got {type(value).__name__}")
        
        if len(value.strip()) < min_length:
            raise ModeValidationError(f"{field_name} must be at least {min_length} character(s) long")
        
        return True
    
    def validate_groups_structure(self, groups: List[Any]) -> bool:
        """Validate the groups array structure according to schema."""
        if not isinstance(groups, list):
            raise ModeValidationError("groups must be an array")
        
        if len(groups) < 1:
            raise ModeValidationError("groups array must have at least one item")
        
        for i, group in enumerate(groups):
            if isinstance(group, str):
                # Simple group - must be one of valid groups
                if group not in self.valid_groups:
                    raise ModeValidationError(f"Invalid group '{group}' at index {i}. Valid groups: {self.valid_groups}")
            
            elif isinstance(group, list):
                # Complex group (edit with file filters)
                if len(group) != 2:
                    raise ModeValidationError(f"Complex group at index {i} must have exactly 2 items, got {len(group)}")
                
                if group[0] != "edit":
                    raise ModeValidationError(f"Complex group at index {i} must start with 'edit', got '{group[0]}'")
                
                if not isinstance(group[1], dict):
                    raise ModeValidationError(f"Second item of complex group at index {i} must be an object")
                
                filter_obj = group[1]
                if "fileRegex" not in filter_obj:
                    raise ModeValidationError(f"Complex group at index {i} must have 'fileRegex' property")
                
                if not isinstance(filter_obj["fileRegex"], str):
                    raise ModeValidationError(f"fileRegex in complex group at index {i} must be a string")
                
                # Validate regex pattern
                try:
                    re.compile(filter_obj["fileRegex"])
                except re.error as e:
                    raise ModeValidationError(f"Invalid fileRegex pattern at index {i}: {e}")
                
                # Validate optional description
                if "description" in filter_obj:
                    if not isinstance(filter_obj["description"], str):
                        raise ModeValidationError(f"description in complex group at index {i} must be a string")
                
                # No additional properties allowed
                allowed_props = {"fileRegex", "description"}
                extra_props = set(filter_obj.keys()) - allowed_props
                if extra_props:
                    raise ModeValidationError(f"Complex group at index {i} has unexpected properties: {extra_props}")
            
            else:
                raise ModeValidationError(f"Group at index {i} must be either a string or an array")
        
        return True
    
    def validate_mode_schema(self, config: Dict[str, Any], mode_slug: str) -> bool:
        """Validate mode configuration against JSON schema."""
        try:
            # Required fields validation
            required_fields = ['slug', 'name', 'roleDefinition', 'groups']
            for field in required_fields:
                if field not in config:
                    raise ModeValidationError(f"Missing required field: {field}")
            
            # Validate slug
            self.validate_string_field(config['slug'], 'slug')
            if not self.validate_slug_pattern(config['slug']):
                raise ModeValidationError(f"slug '{config['slug']}' must match pattern ^[a-z0-9\\-]+$")
            
            # Validate name
            self.validate_string_field(config['name'], 'name')
            
            # Validate roleDefinition
            self.validate_string_field(config['roleDefinition'], 'roleDefinition')
            
            # Validate optional whenToUse
            if 'whenToUse' in config:
                self.validate_string_field(config['whenToUse'], 'whenToUse')
            
            # Validate optional customInstructions
            if 'customInstructions' in config:
                self.validate_string_field(config['customInstructions'], 'customInstructions')
            
            # Validate groups structure
            self.validate_groups_structure(config['groups'])
            
            # No additional properties at top level (except source which we add)
            allowed_props = {
                'slug', 'name', 'roleDefinition', 'whenToUse', 
                'customInstructions', 'groups', 'source'
            }
            extra_props = set(config.keys()) - allowed_props
            if extra_props:
                raise ModeValidationError(f"Mode has unexpected top-level properties: {extra_props}")
            
            return True
            
        except ModeValidationError:
            raise
        except Exception as e:
            raise ModeValidationError(f"Validation error: {e}")
    
    def load_mode_config(self, mode_slug: str) -> Optional[Dict[str, Any]]:
        """Load and validate a single mode configuration."""
        mode_file = self.modes_dir / f"{mode_slug}.yaml"
        
        if not mode_file.exists():
            print(f"⚠️  Warning: Mode file not found: {mode_file}")
            return None
            
        try:
            with open(mode_file, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f)
                
            # Validate against schema
            self.validate_mode_schema(config, mode_slug)
                
            # Ensure source is set to 'global'
            config['source'] = 'global'
            
            return config
            
        except yaml.YAMLError as e:
            print(f"❌ Error parsing YAML for {mode_slug}: {e}")
            return None
        except ModeValidationError as e:
            print(f"❌ Validation error for {mode_slug}: {e}")
            return None
        except Exception as e:
            print(f"❌ Error loading {mode_slug}: {e}")
            return None
    
    def list_discovered_modes(self) -> None:
        """List all discovered modes by category."""
        categorized = self.discovery.discover_all_modes()
        
        category_info = {
            'core': ('🏗️  Core Workflow', 'Fundamental development operations'),
            'enhanced': ('💻+ Enhanced', 'Extended functionality variants'),
            'specialized': ('🔧  Specialized Tools', 'Specific utilities and tools'),
            'discovered': ('📋  Discovered', 'Additional modes found')
        }
        
        total_modes = sum(len(modes) for modes in categorized.values())
        print(f"📋 Discovered Mode Files ({total_modes} total):\n")
        
        for category, modes in categorized.items():
            if not modes:
                continue
                
            icon, description = category_info[category]
            print(f"{icon} ({len(modes)}):")
            
            for mode in modes:
                # Try to load mode config for name/description
                config = self.load_mode_config(mode)
                if config:
                    name = config.get('name', mode)
                    when_to_use = config.get('whenToUse', '')
                    if when_to_use:
                        when_to_use = when_to_use[:60] + '...' if len(when_to_use) > 60 else when_to_use
                        print(f"    • {mode} - {name}")
                        print(f"      {when_to_use}")
                    else:
                        print(f"    • {mode} - {name}")
                else:
                    print(f"    • {mode} - ❌ Invalid configuration")
            
            print()
        
        print("✅ Mode discovery completed")
    
    def create_global_config(self, order: str = 'strategic', 
                           options: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Create the complete global configuration with specified ordering."""
        if options is None:
            options = {}
        
        config = {'customModes': []}
        
        # Discover all modes
        categorized_modes = self.discovery.discover_all_modes()
        
        # Create ordering strategy
        try:
            strategy = OrderingStrategyFactory.create_strategy(order)
        except ValueError as e:
            print(f"❌ {e}")
            print("🔄 Falling back to strategic ordering")
            strategy = OrderingStrategyFactory.create_strategy('strategic')
        
        # Get ordered mode list
        ordered_mode_slugs = strategy.order_modes(categorized_modes, options)
        
        print(f"🔄 Processing modes using {strategy.get_description()}...")
        
        # Load modes in the specified order
        for mode_slug in ordered_mode_slugs:
            mode_config = self.load_mode_config(mode_slug)
            if mode_config:
                config['customModes'].append(mode_config)
                print(f"✅ Loaded mode: {mode_config['name']} ({mode_slug})")
        
        return config
    
    def validate_only(self) -> bool:
        """Validate all mode files without creating configuration."""
        print("🔍 Validating all mode files...")
        
        categorized_modes = self.discovery.discover_all_modes()
        all_modes = []
        for modes in categorized_modes.values():
            all_modes.extend(modes)
        
        if not all_modes:
            print("❌ No mode files found")
            return False
        
        valid_count = 0
        total_count = len(all_modes)
        
        for mode_slug in all_modes:
            config = self.load_mode_config(mode_slug)
            if config:
                valid_count += 1
        
        print(f"\n📊 Validation Summary:")
        print(f"Total modes: {total_count}")
        print(f"Valid modes: {valid_count}")
        print(f"Invalid modes: {total_count - valid_count}")
        print(f"Success rate: {(valid_count/total_count)*100:.1f}%")
        
        return valid_count == total_count
    
    # ... [Rest of the methods from original script like backup_existing_config, 
    #      write_global_config, etc. - keeping them the same for compatibility]
    
    def backup_existing_config(self) -> bool:
        """Create a backup of the existing global config if it exists."""
        if self.global_config_path.exists() and self.global_config_path.stat().st_size > 0:
            backup_path = self.global_config_path.with_suffix('.yaml.backup')
            try:
                shutil.copy2(self.global_config_path, backup_path)
                print(f"💾 Created backup: {backup_path}")
                return True
            except Exception as e:
                print(f"⚠️  Warning: Could not create backup: {e}")
                return False
        else:
            print("📝 No existing config to backup (file empty or doesn't exist)")
            return True
    
    def format_multiline_string(self, text: str, indent: int = 2) -> str:
        """Format a multiline string with proper YAML folded scalar syntax."""
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


    def write_global_config(self, config: Dict[str, Any]) -> bool:
        """Write the configuration to the global config file with proper formatting."""
        try:
            # Ensure the parent directory exists
            self.global_config_path.parent.mkdir(parents=True, exist_ok=True)
            
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
            with open(self.global_config_path, 'w', encoding='utf-8') as f:
                f.write(yaml_content)
            
            print(f"✅ Global configuration written to: {self.global_config_path}")
            return True
            
        except Exception as e:
            print(f"❌ Error writing global configuration: {e}")
            return False
    
    def sync_modes(self, order: str = 'strategic', 
                   options: Optional[Dict[str, Any]] = None,
                   dry_run: bool = False) -> bool:
        """Main synchronization method."""
        if options is None:
            options = {}
            
        print("🔄 Starting Roo Modes Global Configuration Sync (Enhanced)")
        print(f"📂 Source directory: {self.modes_dir}")
        print(f"🎯 Target configuration: {self.global_config_path}")
        print(f"📋 Ordering strategy: {order}")
        
        if dry_run:
            print("🔍 DRY RUN MODE - No files will be modified")
        
        print()
        
        # Check if modes directory exists
        if not self.modes_dir.exists():
            print(f"❌ Modes directory not found: {self.modes_dir}")
            return False
        
        # Create backup if not dry run
        if not dry_run:
            if not self.backup_existing_config():
                print("⚠️  Continuing without backup...")
        
        # Create configuration
        try:
            config = self.create_global_config(order, options)
            
            if not config['customModes']:
                print("❌ No valid modes found to sync")
                return False
            
            print(f"\n📊 Sync Summary:")
            print(f"Total modes processed: {len(config['customModes'])}")
            
            # Write configuration if not dry run
            if not dry_run:
                success = self.write_global_config(config)
                if success:
                    print("\n🎉 Sync completed successfully!")
                else:
                    print("\n❌ Sync failed during write operation")
                return success
            else:
                print("\n🔍 Dry run completed - no files modified")
                return True
                
        except Exception as e:
            print(f"❌ Sync failed: {e}")
            return False


def create_argument_parser() -> argparse.ArgumentParser:
    """Create and configure the command line argument parser."""
    parser = argparse.ArgumentParser(
        description="Enhanced Roo Modes Global Configuration Sync Script",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ordering Strategies:
  strategic    : Original hardcoded strategic order (default)
  alphabetical : Alphabetical within categories (core → enhanced → specialized → discovered)
  category     : Custom category precedence with configurable within-category sorting
  custom       : User-specified explicit ordering

Examples:
  %(prog)s                                    # Strategic ordering (default)
  %(prog)s --order alphabetical               # Alphabetical ordering
  %(prog)s --order category --category-order core,specialized  # Custom category order
  %(prog)s --priority code,debug              # Priority modes first
  %(prog)s --exclude old-mode                 # Exclude specific modes
  %(prog)s --config ordering.yaml             # Use external config file
  %(prog)s --list-modes                       # List discovered modes
  %(prog)s --validate-only                    # Validate without syncing
  %(prog)s --dry-run                         # Preview changes without writing
        """)
    
    # Main action arguments
    action_group = parser.add_mutually_exclusive_group()
    action_group.add_argument(
        '--list-modes', '-l',
        action='store_true',
        help='List all discovered mode files by category and exit'
    )
    action_group.add_argument(
        '--validate-only', '-v',
        action='store_true',
        help='Validate all mode files without creating configuration'
    )
    
    # Ordering strategy
    parser.add_argument(
        '--order', '-o',
        choices=['strategic', 'alphabetical', 'category', 'custom'],
        default='strategic',
        help='Ordering strategy to use (default: strategic)'
    )
    
    # Filtering options
    parser.add_argument(
        '--priority', '-p',
        nargs='*',
        default=[],
        help='Modes to prioritize at the beginning (space-separated)'
    )
    parser.add_argument(
        '--exclude', '-e',
        nargs='*',
        default=[],
        help='Modes to exclude from sync (space-separated)'
    )
    
    # Category ordering options
    parser.add_argument(
        '--category-order',
        help='Custom category precedence (comma-separated: core,enhanced,specialized,discovered)'
    )
    parser.add_argument(
        '--custom-order',
        help='Explicit mode ordering (comma-separated mode slugs)'
    )
    
    # Configuration file
    parser.add_argument(
        '--config', '-c',
        type=Path,
        help='External YAML configuration file'
    )
    
    # Output options
    parser.add_argument(
        '--dry-run', '-n',
        action='store_true',
        help='Preview changes without writing files'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Enable verbose output'
    )
    
    return parser


def main():
    """Main entry point for the enhanced sync script."""
    parser = create_argument_parser()
    args = parser.parse_args()
    
    # Initialize sync manager
    sync_manager = ModeConfigSyncEnhanced()
    
    # Handle list modes action
    if args.list_modes:
        sync_manager.list_discovered_modes()
        return
    
    # Handle validate only action
    if args.validate_only:
        success = sync_manager.validate_only()
        sys.exit(0 if success else 1)
    
    # Load external configuration if provided
    ordering_config = None
    if args.config:
        try:
            ordering_config = OrderingConfig(args.config)
            print(f"📄 Loaded configuration from: {args.config}")
        except Exception as e:
            print(f"❌ Error loading configuration file: {e}")
            sys.exit(1)
    
    # Determine ordering strategy and options
    if ordering_config:
        order = ordering_config.strategy
        options = ordering_config.get_strategy_options()
    else:
        order = args.order
        options = {}
        
        # Add CLI options to strategy options
        if args.priority:
            options['priority_first'] = args.priority
        if args.exclude:
            options['exclude'] = args.exclude
        if args.category_order:
            options['category_order'] = args.category_order.split(',')
        if args.custom_order:
            options['custom_order'] = args.custom_order.split(',')
    
    # Perform sync
    try:
        success = sync_manager.sync_modes(order=order, options=options, dry_run=args.dry_run)
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⚠️  Sync interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
