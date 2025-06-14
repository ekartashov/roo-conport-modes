#!/usr/bin/env python3
"""
Mode configuration validation functionality.
"""

import re
from typing import Dict, Any, List, Union

from ..exceptions import ModeValidationError


class ModeValidator:
    """Validates mode configuration file contents."""
    
    # Define constants for validation
    REQUIRED_FIELDS = ['slug', 'name', 'roleDefinition', 'groups']
    OPTIONAL_FIELDS = ['whenToUse', 'customInstructions']
    VALID_TOP_LEVEL_FIELDS = REQUIRED_FIELDS + OPTIONAL_FIELDS
    VALID_SIMPLE_GROUPS = ['read', 'edit', 'browser']
    SLUG_PATTERN = r'^[a-z0-9]+(-[a-z0-9]+)*$'
    
    def validate_mode_config(self, config: Dict[str, Any], filename: str) -> bool:
        """
        Validate a mode configuration.
        
        Args:
            config: Mode configuration dictionary
            filename: Source filename (for error messages)
            
        Returns:
            True if valid
            
        Raises:
            ModeValidationError: If validation fails
        """
        # Check for required fields
        missing_fields = [field for field in self.REQUIRED_FIELDS if field not in config]
        if missing_fields:
            raise ModeValidationError(f"Missing required fields in {filename}: {', '.join(missing_fields)}")
        
        # Check for unexpected top-level properties
        unexpected_fields = [field for field in config if field not in self.VALID_TOP_LEVEL_FIELDS]
        if unexpected_fields:
            raise ModeValidationError(
                f"Unexpected properties in {filename}: {', '.join(unexpected_fields)}"
            )
        
        # Validate string fields are strings and not empty
        for field in ['slug', 'name', 'roleDefinition']:
            self._validate_string_field(config, field, filename)
        
        # Validate optional string fields if present
        for field in ['whenToUse', 'customInstructions']:
            if field in config:
                self._validate_string_field(config, field, filename)
        
        # Validate slug format
        if not re.match(self.SLUG_PATTERN, config['slug']):
            raise ModeValidationError(
                f"Invalid slug format in {filename}: {config['slug']}. "
                f"Slugs must be lowercase alphanumeric with hyphens."
            )
        
        # Validate groups
        self._validate_groups(config['groups'], filename)
        
        return True
    
    def _validate_string_field(self, config: Dict[str, Any], field: str, filename: str) -> None:
        """
        Validate that a field is a non-empty string.
        
        Args:
            config: Mode configuration dictionary
            field: Field name to validate
            filename: Source filename (for error messages)
        
        Raises:
            ModeValidationError: If validation fails
        """
        value = config.get(field)
        
        if not isinstance(value, str):
            raise ModeValidationError(
                f"Field '{field}' in {filename} must be a string, got {type(value).__name__}"
            )
        
        if value == "":
            raise ModeValidationError(f"Field '{field}' in {filename} cannot be empty")
    
    def _validate_groups(self, groups: Any, filename: str) -> None:
        """
        Validate groups configuration.
        
        Args:
            groups: Groups configuration (should be a list)
            filename: Source filename (for error messages)
            
        Raises:
            ModeValidationError: If validation fails
        """
        if not isinstance(groups, list):
            raise ModeValidationError(f"Field 'groups' in {filename} must be an array")
        
        if not groups:
            raise ModeValidationError(f"Groups array in {filename} cannot be empty")
        
        # Validate each group item
        for group_item in groups:
            if isinstance(group_item, str):
                self._validate_simple_group(group_item, filename)
            elif isinstance(group_item, list):
                self._validate_complex_group(group_item, filename)
            else:
                raise ModeValidationError(
                    f"Invalid group item in {filename}: {group_item}. "
                    f"Must be a string or array."
                )
    
    def _validate_simple_group(self, group_name: str, filename: str) -> None:
        """
        Validate a simple group name.
        
        Args:
            group_name: Group name to validate
            filename: Source filename (for error messages)
            
        Raises:
            ModeValidationError: If validation fails
        """
        if group_name not in self.VALID_SIMPLE_GROUPS:
            raise ModeValidationError(
                f"Invalid group name in {filename}: '{group_name}'. "
                f"Valid simple groups are: {', '.join(self.VALID_SIMPLE_GROUPS)}"
            )
    
    def _validate_complex_group(self, complex_group: List, filename: str) -> None:
        """
        Validate a complex group configuration.
        
        Args:
            complex_group: Complex group configuration array
            filename: Source filename (for error messages)
            
        Raises:
            ModeValidationError: If validation fails
        """
        # Must have exactly 2 items
        if len(complex_group) != 2:
            raise ModeValidationError(
                f"Complex group in {filename} must have exactly 2 items, got {len(complex_group)}"
            )
        
        # First item must be 'edit'
        if complex_group[0] != 'edit':
            raise ModeValidationError(
                f"First item in complex group must be 'edit', got '{complex_group[0]}'"
            )
        
        # Second item must be an object
        if not isinstance(complex_group[1], dict):
            raise ModeValidationError(
                f"Second item in complex group must be an object, got {type(complex_group[1]).__name__}"
            )
        
        # Must have fileRegex property
        config_obj = complex_group[1]
        if 'fileRegex' not in config_obj:
            raise ModeValidationError(
                f"Complex group config must have 'fileRegex' property in {filename}"
            )
        
        # fileRegex must be a valid regex
        file_regex = config_obj['fileRegex']
        if not isinstance(file_regex, str):
            raise ModeValidationError(
                f"'fileRegex' must be a string in {filename}, got {type(file_regex).__name__}"
            )
        
        # Check that the regex is valid
        try:
            re.compile(file_regex)
        except re.error:
            raise ModeValidationError(
                f"Invalid regex pattern '{file_regex}' in {filename}"
            )
        
        # Check for unexpected properties
        valid_config_props = ['fileRegex', 'description']
        unexpected_props = [prop for prop in config_obj if prop not in valid_config_props]
        if unexpected_props:
            raise ModeValidationError(
                f"Unexpected properties in complex group config in {filename}: "
                f"{', '.join(unexpected_props)}"
            )
        
        # If description is present, validate it's a string
        if 'description' in config_obj:
            description = config_obj['description']
            if not isinstance(description, str):
                raise ModeValidationError(
                    f"'description' must be a string in {filename}, got {type(description).__name__}"
                )