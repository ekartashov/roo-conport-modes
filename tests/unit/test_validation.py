"""
Tests for validation functionality and diagnostics.

These tests verify that the validation system provides detailed diagnostics
and can operate at different strictness levels.
"""

import pytest
import yaml
from pathlib import Path


class TestValidationLevels:
    """Tests for validation at different strictness levels."""
    
    def test_validation_levels_enum(self):
        """Test that ValidationLevel enum is defined correctly."""
        from roo_modes_sync.core.validation import ValidationLevel
        
        # Verify the enum values
        assert hasattr(ValidationLevel, 'STRICT')
        assert hasattr(ValidationLevel, 'NORMAL')
        assert hasattr(ValidationLevel, 'PERMISSIVE')
        
        # Verify ordering (strict > normal > permissive)
        assert ValidationLevel.STRICT.value > ValidationLevel.NORMAL.value
        assert ValidationLevel.NORMAL.value > ValidationLevel.PERMISSIVE.value
    
    def test_validation_at_strict_level(self, invalid_mode_configs):
        """Test that strict validation catches all issues."""
        from roo_modes_sync.core.validation import ModeValidator, ValidationLevel
        
        validator = ModeValidator()
        validator.set_validation_level(ValidationLevel.STRICT)
        
        # Test each invalid config
        for slug, config in invalid_mode_configs.items():
            with pytest.raises(Exception) as exc_info:
                validator.validate_mode_config(config, f"{slug}.yaml")
            
            # Verify error message is detailed
            error_msg = str(exc_info.value)
            if slug == 'missing-required':
                assert 'Missing required fields' in error_msg
            elif slug == 'invalid-slug':
                assert 'Invalid slug format' in error_msg
            elif slug == 'empty-groups':
                assert 'cannot be empty' in error_msg
            elif slug == 'invalid-groups':
                assert 'Invalid group name' in error_msg
    
    def test_validation_at_permissive_level(self, invalid_mode_configs):
        """Test that permissive validation allows minor issues with warnings."""
        from roo_modes_sync.core.validation import ModeValidator, ValidationLevel, ValidationResult
        
        validator = ModeValidator()
        validator.set_validation_level(ValidationLevel.PERMISSIVE)
        
        # Test each invalid config
        for slug, config in invalid_mode_configs.items():
            try:
                # Missing required fields should still fail
                if slug == 'missing-required':
                    with pytest.raises(Exception) as exc_info:
                        result = validator.validate_mode_config(config, f"{slug}.yaml", collect_warnings=True)
                    assert 'Missing required fields' in str(exc_info.value)
                else:
                    # Others should pass with warnings in permissive mode
                    result = validator.validate_mode_config(config, f"{slug}.yaml", collect_warnings=True)
                    assert isinstance(result, ValidationResult)
                    assert result.valid
                    assert len(result.warnings) > 0
                    
                    # Check specific warnings
                    if slug == 'invalid-slug':
                        assert any('slug format' in w['message'] for w in result.warnings)
                    elif slug == 'empty-groups':
                        assert any('empty groups' in w['message'] for w in result.warnings)
                    elif slug == 'invalid-groups':
                        assert any('Invalid group' in w['message'] for w in result.warnings)
            except Exception as e:
                if slug != 'missing-required':  # We expect missing-required to fail
                    pytest.fail(f"Validation for {slug} should pass in permissive mode but raised: {e}")


class TestValidationDiagnostics:
    """Tests for validation diagnostics and reporting."""
    
    def test_validation_error_details(self):
        """Test that validation errors provide detailed information."""
        from roo_modes_sync.core.validation import ModeValidator
        
        validator = ModeValidator()
        
        # Create test mode with multiple issues
        test_mode = {
            'slug': 'Invalid Slug',  # Invalid slug format
            'name': '',  # Empty name
            'roleDefinition': 'Test role definition',
            'groups': []  # Empty groups
        }
        
        # Validate and collect all errors
        with pytest.raises(Exception) as exc_info:
            validator.validate_mode_config(test_mode, "test_mode.yaml")
        
        # Check that error message contains details about all issues
        error_msg = str(exc_info.value)
        assert 'slug' in error_msg, "Error should mention invalid slug"
        assert 'name' in error_msg, "Error should mention empty name"
        assert 'groups' in error_msg, "Error should mention empty groups"
    
    def test_validation_warning_collection(self, temp_modes_dir):
        """Test that warnings can be collected without failing validation."""
        from roo_modes_sync.core.validation import ModeValidator, ValidationLevel
        
        validator = ModeValidator()
        validator.set_validation_level(ValidationLevel.NORMAL)
        
        # Create test mode with minor issues
        test_mode = {
            'slug': 'test-mode',
            'name': 'Test Mode',
            'roleDefinition': 'Test role definition',
            'groups': ['read'],
            'unknownField': 'This field is not in the schema'  # Unknown field
        }
        
        # Create mode file
        mode_file = temp_modes_dir / "test-mode.yaml"
        with open(mode_file, 'w') as f:
            yaml.dump(test_mode, f)
        
        # Validate with warning collection
        result = validator.validate_mode_config(test_mode, str(mode_file), collect_warnings=True)
        
        # Check that validation passed but warnings were collected
        assert result.valid
        assert len(result.warnings) > 0
        assert any('unknownField' in w['message'] for w in result.warnings)
    
    def test_validation_result_object(self):
        """Test that ValidationResult object works correctly."""
        from roo_modes_sync.core.validation import ValidationResult
        
        # Create a validation result
        result = ValidationResult(
            valid=True,
            warnings=[
                {'level': 'warning', 'message': 'Test warning 1'},
                {'level': 'info', 'message': 'Test info'}
            ]
        )
        
        # Test properties
        assert result.valid
        assert len(result.warnings) == 2
        assert result.warnings[0]['message'] == 'Test warning 1'
        
        # Test adding warnings
        result.add_warning('Another warning')
        assert len(result.warnings) == 3
        assert result.warnings[2]['message'] == 'Another warning'
        
        # Test string representation
        assert str(result).startswith('ValidationResult')
        assert 'valid=True' in str(result)
        assert '3 warnings' in str(result)


class TestExtendedValidation:
    """Tests for extended validation functionality."""
    
    def test_validate_with_extra_schemas(self):
        """Test validation with additional schemas for extensions."""
        from roo_modes_sync.core.validation import ModeValidator
        
        validator = ModeValidator()
        
        # Define an extended schema
        extended_schema = {
            'properties': {
                'customExtension': {
                    'type': 'object',
                    'required': ['feature']
                }
            }
        }
        
        # Register the extended schema
        validator.register_extended_schema('test-extension', extended_schema)
        
        # Test valid extended config
        valid_extended = {
            'slug': 'extended-mode',
            'name': 'Extended Mode',
            'roleDefinition': 'Test role definition',
            'groups': ['read'],
            'customExtension': {
                'feature': 'test-feature'
            }
        }
        
        # This should pass with the extended schema
        result = validator.validate_mode_config(
            valid_extended, 
            "extended-mode.yaml",
            extensions=['test-extension']
        )
        assert result
        
        # Test invalid extended config
        invalid_extended = {
            'slug': 'extended-mode',
            'name': 'Extended Mode',
            'roleDefinition': 'Test role definition',
            'groups': ['read'],
            'customExtension': {
                # Missing required 'feature' field
            }
        }
        
        # This should fail with the extended schema
        with pytest.raises(Exception) as exc_info:
            validator.validate_mode_config(
                invalid_extended, 
                "invalid-extended.yaml",
                extensions=['test-extension']
            )
        
        assert 'customExtension' in str(exc_info.value)