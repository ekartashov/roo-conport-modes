#!/usr/bin/env python3
"""
Mode discovery and categorization functionality.
"""

import re
from pathlib import Path
import yaml
from typing import Dict, List, Optional, Any

from ..exceptions import DiscoveryError


class ModeDiscovery:
    """Handles dynamic discovery and categorization of mode files."""
    
    def __init__(self, modes_dir: Path):
        """
        Initialize with modes directory path.
        
        Args:
            modes_dir: Path to directory containing mode YAML files
        """
        self.modes_dir = modes_dir
        
        self.category_patterns = {
            'core': [r'^(code|architect|debug|ask|orchestrator|docs)$'],
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
        """
        Check if a YAML file is a valid mode file.
        
        Args:
            yaml_file: Path to the YAML file
            
        Returns:
            True if valid, False otherwise
        """
        try:
            with open(yaml_file, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f)
                
            # Basic validation - must have required fields
            required_fields = ['slug', 'name', 'roleDefinition', 'groups']
            return all(field in config for field in required_fields)
            
        except (yaml.YAMLError, FileNotFoundError, KeyError):
            return False

    def get_mode_count(self) -> int:
        """
        Get the total number of valid modes.
        
        Returns:
            Count of valid mode files
        """
        modes = self.discover_all_modes()
        return sum(len(category_modes) for category_modes in modes.values())
    
    def get_category_info(self) -> Dict[str, Dict[str, str]]:
        """
        Get information about mode categories.
        
        Returns:
            Dictionary with category information
        """
        return {
            'core': {
                'icon': '🏗️',
                'name': 'Core Workflow',
                'description': 'Fundamental development operations'
            },
            'enhanced': {
                'icon': '💻+',
                'name': 'Enhanced Variants',
                'description': 'Extended functionality variants'
            },
            'specialized': {
                'icon': '🔧',
                'name': 'Specialized Tools',
                'description': 'Specific utilities and tools'
            },
            'discovered': {
                'icon': '📋',
                'name': 'Discovered',
                'description': 'Additional modes found'
            }
        }