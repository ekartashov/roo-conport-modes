#!/usr/bin/env python3
"""
Mode configuration validation functionality.
"""

import re
import enum
from typing import Dict, Any, List, Union, Optional, Set


class ValidationLevel(enum.Enum):
    """Validation strictness levels."""
    PERMISSIVE = 1  # Allow minor issues, collect warnings
    NORMAL = 2      # Default level, balance between strictness and flexibility
    STRICT = 3      # Strict validation, reject any deviation from schema


class ValidationResult:
    """Result of a validation operation, including warnings."""
    
    def __init__(self, valid: bool, warnings: Optional[List[Dict[str, str]]] = None):
        """
        Initialize validation result.
        
        Args:
            valid: Whether validation passed
            warnings: List of warning dictionaries, each with 'level' and 'message'
        """
        self.valid = valid
        self.warnings = warnings or []
    
    def add_warning(self, message: str, level: str = "warning"):
        """
        Add a warning to the validation result.
        
        Args:
            message: Warning message
            level: Warning level ('info', 'warning', 'error')
        """
        self.warnings.append({
            'level': level,
            'message': message
        })
    
    def __str__(self):
        """String representation of validation result."""
        return f"ValidationResult(valid={self.valid}, {len(self.warnings)} warnings)"


class ModeValidationError(Exception):
    """Error raised when mode validation fails."""
    pass


class ModeValidator:
    """Validates mode configuration file contents."""
    
    # Define constants for validation
    REQUIRED_FIELDS = ['slug', 'name', 'roleDefinition', 'groups']
    OPTIONAL_FIELDS = ['whenToUse', 'customInstructions']
    VALID_TOP_LEVEL_FIELDS = REQUIRED_FIELDS + OPTIONAL_FIELDS
    VALID_SIMPLE_GROUPS = ['read', 'edit', 'browser']
    SLUG_PATTERN = r'^[a-z0-9]+(-[a-z0-9]+)*$'
    
    def __init__(self):
        """Initialize the validator with default settings."""
        self.validation_level = ValidationLevel.NORMAL
        self.extended_schemas = {}
    
    def set_validation_level(self, level: ValidationLevel):
        """
        Set the validation strictness level.
        
        Args:
            level: Validation level (PERMISSIVE, NORMAL, or STRICT)
        """
        self.validation_level = level
    
    def register_extended_schema(self, name: str, schema: Dict[str, Any]):
        """
        Register an extended validation schema for specific extensions.
        
        Args:
            name: Name of the extension schema
            schema: Schema dictionary defining additional validation rules
        """
        self.extended_schemas[name] = schema
    
    def validate_mode_config(self, config: Dict[str, Any], filename: str, 
                            collect_warnings: bool = False,
                            extensions: Optional[List[str]] = None) -> Union[bool, ValidationResult]:
        """
        Validate a mode configuration.
        
        Args:
            config: Mode configuration dictionary
            filename: Source filename (for error messages)
            collect_warnings: If True, return ValidationResult with warnings
            extensions: List of extension schemas to apply
            
        Returns:
            If collect_warnings is False: True if valid
            If collect_warnings is True: ValidationResult object
            
        Raises:
            ModeValidationError: If validation fails
        """
        result = ValidationResult(valid=True)
        validation_errors = []
        
        # Check for required fields (always strict)
        missing_fields = [field for field in self.REQUIRED_FIELDS if field not in config]
        if missing_fields:
            error_msg = f"Missing required fields in {filename}: {', '.join(missing_fields)}"
            if collect_warnings:
                result.valid = False
                result.add_warning(error_msg, "error")
                return result
            else:
                raise ModeValidationError(error_msg)
        
        # Check for unexpected top-level properties
        unexpected_fields = [field for field in config if field not in self.VALID_TOP_LEVEL_FIELDS]
        if unexpected_fields:
            error_msg = f"Unexpected properties in {filename}: {', '.join(unexpected_fields)}"
            if self.validation_level == ValidationLevel.STRICT:
                validation_errors.append(error_msg)
            else:
                # For non-strict levels, this is a warning
                result.add_warning(error_msg)
        
        # Validate string fields are strings and not empty
        for field in ['slug', 'name', 'roleDefinition']:
            try:
                self._validate_string_field(config, field, filename)
            except ModeValidationError as e:
                validation_errors.append(str(e))
        
        # Validate optional string fields if present
        for field in ['whenToUse', 'customInstructions']:
            if field in config:
                try:
                    self._validate_string_field(config, field, filename)
                except ModeValidationError as e:
                    validation_errors.append(str(e))
        
        # Validate slug format
        if 'slug' in config and isinstance(config['slug'], str):
            if not re.match(self.SLUG_PATTERN, config['slug']):
                error_msg = (
                    f"Invalid slug format in {filename}: {config['slug']}. "
                    f"Slugs must be lowercase alphanumeric with hyphens."
                )
                
                if self.validation_level == ValidationLevel.PERMISSIVE:
                    result.add_warning(error_msg)
                else:
                    validation_errors.append(error_msg)
        
        # Validate groups
        if 'groups' in config:
            # First check if groups is an array
            if not isinstance(config['groups'], list):
                error_msg = f"Field 'groups' in {filename} must be an array"
                if collect_warnings:
                    result.valid = False
                    result.add_warning(error_msg, "error")
                else:
                    raise ModeValidationError(error_msg)
            else:
                try:
                    self._validate_groups(config['groups'], filename)
                except ModeValidationError as e:
                    if (self.validation_level == ValidationLevel.PERMISSIVE and
                        'cannot be empty' not in str(e)):  # Empty groups always invalid
                        result.add_warning(str(e))
                    else:
                        validation_errors.append(str(e))
        
        # Apply extended schemas if specified
        if extensions:
            for extension in extensions:
                if extension in self.extended_schemas:
                    schema = self.extended_schemas[extension]
                    try:
                        self._validate_against_extended_schema(config, schema, filename)
                    except ModeValidationError as e:
                        validation_errors.append(str(e))
        
        # If there are validation errors, raise exception or add to result
        if validation_errors:
            error_msg = "\n".join(validation_errors)
            if collect_warnings:
                result.valid = False
                for error in validation_errors:
                    result.add_warning(error, "error")
            else:
                raise ModeValidationError(error_msg)
        
        # Return appropriate result
        if collect_warnings:
            return result
        else:
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
    
    def _validate_groups(self, groups: List, filename: str) -> None:
        """
        Validate groups configuration.
        
        Args:
            groups: Groups configuration (must be a list)
            filename: Source filename (for error messages)
            
        Raises:
            ModeValidationError: If validation fails
        """
        
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
            if self.validation_level == ValidationLevel.STRICT:
                raise ModeValidationError(
                    f"Unexpected properties in complex group config in {filename}: "
                    f"{', '.join(unexpected_props)}"
                )
            # Otherwise, we'll let it pass (NORMAL or PERMISSIVE levels)
    
    def _validate_against_extended_schema(self, config: Dict[str, Any], schema: Dict[str, Any], filename: str) -> None:
        """
        Validate a config against an extended schema.
        
        Args:
            config: Mode configuration dictionary
            schema: Extended schema dictionary
            filename: Source filename (for error messages)
            
        Raises:
            ModeValidationError: If validation fails
        """
        # Simple implementation - can be expanded with a full JSON Schema validator
        if 'properties' in schema:
            for prop_name, prop_schema in schema['properties'].items():
                # Check if the property is present
                if prop_name in config:
                    # Check type
                    if 'type' in prop_schema:
                        expected_type = prop_schema['type']
                        if expected_type == 'object' and not isinstance(config[prop_name], dict):
                            raise ModeValidationError(
                                f"Property '{prop_name}' in {filename} must be an object"
                            )
                        elif expected_type == 'array' and not isinstance(config[prop_name], list):
                            raise ModeValidationError(
                                f"Property '{prop_name}' in {filename} must be an array"
                            )
                        elif expected_type == 'string' and not isinstance(config[prop_name], str):
                            raise ModeValidationError(
                                f"Property '{prop_name}' in {filename} must be a string"
                            )
                    
                    # Check required sub-properties for objects
                    if isinstance(config[prop_name], dict) and 'required' in prop_schema:
                        obj = config[prop_name]
                        missing = [field for field in prop_schema['required'] if field not in obj]
                        if missing:
                            raise ModeValidationError(
                                f"Missing required fields in '{prop_name}' in {filename}: {', '.join(missing)}"
                            )