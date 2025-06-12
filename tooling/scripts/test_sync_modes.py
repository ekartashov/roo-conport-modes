#!/usr/bin/env python3
"""
Test Suite for Roo Modes Global Configuration Sync Script

This test suite validates the sync script against the JSON schema specification
and ensures proper handling of various mode configurations.
"""

import os
import sys
import yaml
import tempfile
import shutil
import unittest
from pathlib import Path
from unittest.mock import patch, MagicMock

# Add the current directory to path to import our module
sys.path.insert(0, str(Path(__file__).parent))

from sync_modes_to_global_config import ModeConfigSync, ModeValidationError

class TestModeConfigSync(unittest.TestCase):
    """Test cases for ModeConfigSync class."""
    
    def setUp(self):
        """Set up test environment with temporary directories."""
        self.test_dir = Path(tempfile.mkdtemp())
        self.modes_dir = self.test_dir / "modes"
        self.modes_dir.mkdir()
        self.global_config_dir = self.test_dir / "global"
        self.global_config_dir.mkdir()
        self.global_config_path = self.global_config_dir / "custom_modes.yaml"
        
        # Create sync instance with test paths
        self.sync = ModeConfigSync()
        self.sync.workspace_dir = self.test_dir
        self.sync.modes_dir = self.modes_dir
        self.sync.global_config_path = self.global_config_path
    
    def tearDown(self):
        """Clean up test environment."""
        shutil.rmtree(self.test_dir)
    
    def create_test_mode_file(self, slug: str, config: dict):
        """Helper to create a test mode file."""
        mode_file = self.modes_dir / f"{slug}.yaml"
        with open(mode_file, 'w') as f:
            yaml.dump(config, f, default_flow_style=False)
        return mode_file

    def test_valid_simple_mode(self):
        """Test validation of a simple mode with basic groups."""
        valid_mode = {
            'slug': 'test-mode',
            'name': 'Test Mode',
            'roleDefinition': 'You are a test mode for validation',
            'whenToUse': 'Use this mode for testing',
            'groups': ['read', 'edit', 'browser']
        }
        
        self.create_test_mode_file('test-mode', valid_mode)
        result = self.sync.load_mode_config('test-mode')
        
        self.assertIsNotNone(result)
        self.assertEqual(result['slug'], 'test-mode')
        self.assertEqual(result['source'], 'global')
    
    def test_valid_complex_mode_with_file_filters(self):
        """Test validation of mode with edit file filters (example from schema)."""
        docs_writer_mode = {
            'slug': 'docs-writer',
            'name': 'Documentation Writer',
            'roleDefinition': 'You are a technical writer specializing in clear, concise developer documentation.\nYou focus on giving examples and step-by-step guides.',
            'whenToUse': 'Use this mode whenever generating or editing user-facing docs.',
            'customInstructions': '• Always include code snippets in fenced blocks.\n• Validate all YAML examples before publishing.',
            'groups': [
                'read',
                'edit',
                ['edit', {'fileRegex': r'\.(md|mdx)$', 'description': 'Markdown and MDX files only'}],
                'browser'
            ]
        }
        
        self.create_test_mode_file('docs-writer', docs_writer_mode)
        result = self.sync.load_mode_config('docs-writer')
        
        self.assertIsNotNone(result)
        self.assertEqual(result['slug'], 'docs-writer')
        self.assertTrue(self.sync.validate_groups_structure(result['groups']))
    
    def test_security_review_mode_example(self):
        """Test the security review mode from the schema example."""
        security_mode = {
            'slug': 'security-review',
            'name': 'Security Reviewer',
            'roleDefinition': 'You are a security expert reviewing code for vulnerabilities,\ninjection flaws, and insecure configurations.',
            'whenToUse': 'Use this mode during code reviews for security audits.',
            'groups': ['read', 'browser', 'command']
        }
        
        self.create_test_mode_file('security-review', security_mode)
        result = self.sync.load_mode_config('security-review')
        
        self.assertIsNotNone(result)
        self.assertEqual(result['slug'], 'security-review')
        self.assertEqual(len(result['groups']), 3)
    
    def test_invalid_slug_pattern(self):
        """Test rejection of invalid slug patterns."""
        invalid_slugs = [
            'UPPERCASE',
            'has_underscore',
            'has space',
            'has@symbol',
            '123-abc!',
            ''
        ]
        
        for invalid_slug in invalid_slugs:
            with self.subTest(slug=invalid_slug):
                invalid_mode = {
                    'slug': invalid_slug,
                    'name': 'Test Mode',
                    'roleDefinition': 'Test role',
                    'groups': ['read']
                }
                
                self.create_test_mode_file('test', invalid_mode)
                result = self.sync.load_mode_config('test')
                self.assertIsNone(result)
    
    def test_valid_slug_patterns(self):
        """Test acceptance of valid slug patterns."""
        valid_slugs = [
            'lowercase',
            'with-hyphens',
            'with123numbers',
            'a',
            'mode-v2-enhanced'
        ]
        
        for valid_slug in valid_slugs:
            with self.subTest(slug=valid_slug):
                valid_mode = {
                    'slug': valid_slug,
                    'name': 'Test Mode',
                    'roleDefinition': 'Test role',
                    'groups': ['read']
                }
                
                self.create_test_mode_file('test', valid_mode)
                result = self.sync.load_mode_config('test')
                self.assertIsNotNone(result)
    
    def test_missing_required_fields(self):
        """Test rejection when required fields are missing."""
        required_fields = ['slug', 'name', 'roleDefinition', 'groups']
        
        for missing_field in required_fields:
            with self.subTest(missing_field=missing_field):
                incomplete_mode = {
                    'slug': 'test-mode',
                    'name': 'Test Mode',
                    'roleDefinition': 'Test role',
                    'groups': ['read']
                }
                del incomplete_mode[missing_field]
                
                self.create_test_mode_file('test', incomplete_mode)
                result = self.sync.load_mode_config('test')
                self.assertIsNone(result)
    
    def test_empty_string_fields(self):
        """Test rejection of empty string fields."""
        string_fields = ['slug', 'name', 'roleDefinition']
        
        for field in string_fields:
            with self.subTest(field=field):
                mode_with_empty_field = {
                    'slug': 'test-mode',
                    'name': 'Test Mode',
                    'roleDefinition': 'Test role',
                    'groups': ['read']
                }
                mode_with_empty_field[field] = ''
                
                self.create_test_mode_file('test', mode_with_empty_field)
                result = self.sync.load_mode_config('test')
                self.assertIsNone(result)
    
    def test_invalid_group_names(self):
        """Test rejection of invalid group names."""
        invalid_groups = [
            ['invalid-group'],
            ['read', 'write'],  # 'write' is not valid
            ['edit', 'make'],   # 'make' is not valid
            []  # empty groups
        ]
        
        for invalid_group_list in invalid_groups:
            with self.subTest(groups=invalid_group_list):
                invalid_mode = {
                    'slug': 'test-mode',
                    'name': 'Test Mode',
                    'roleDefinition': 'Test role',
                    'groups': invalid_group_list
                }
                
                self.create_test_mode_file('test', invalid_mode)
                result = self.sync.load_mode_config('test')
                self.assertIsNone(result)
    
    def test_invalid_complex_group_structure(self):
        """Test rejection of malformed complex group structures."""
        invalid_complex_groups = [
            # Wrong number of items
            [['edit']],
            [['edit', {'fileRegex': 'pattern'}, 'extra']],
            
            # Wrong first item
            [['read', {'fileRegex': 'pattern'}]],
            
            # Missing fileRegex
            [['edit', {'description': 'test'}]],
            
            # Invalid fileRegex type
            [['edit', {'fileRegex': 123}]],
            
            # Extra properties
            [['edit', {'fileRegex': 'pattern', 'extraProp': 'value'}]],
            
            # Invalid regex pattern
            [['edit', {'fileRegex': '['}]]  # Unclosed bracket
        ]
        
        for invalid_groups in invalid_complex_groups:
            with self.subTest(groups=invalid_groups):
                invalid_mode = {
                    'slug': 'test-mode',
                    'name': 'Test Mode',
                    'roleDefinition': 'Test role',
                    'groups': invalid_groups
                }
                
                self.create_test_mode_file('test', invalid_mode)
                result = self.sync.load_mode_config('test')
                self.assertIsNone(result)
    
    def test_yaml_output_format(self):
        """Test that generated YAML matches expected format."""
        test_modes = [
            {
                'slug': 'simple-mode',
                'name': 'Simple Mode',
                'roleDefinition': 'Simple role definition',
                'whenToUse': 'Use when testing',
                'groups': ['read', 'edit'],
                'source': 'global'
            },
            {
                'slug': 'complex-mode',
                'name': 'Complex Mode',
                'roleDefinition': 'Complex role definition',
                'groups': [
                    'read',
                    ['edit', {'fileRegex': r'\.py$', 'description': 'Python files only'}],
                    'browser'
                ],
                'source': 'global'
            }
        ]
        
        config = {'customModes': test_modes}
        yaml_output = self.sync.write_global_config_yaml(config)
        
        # Parse the output back to verify it's valid YAML
        parsed = yaml.safe_load(yaml_output)
        self.assertIsNotNone(parsed)
        self.assertIn('customModes', parsed)
        self.assertEqual(len(parsed['customModes']), 2)
        
        # Validate the complex group structure
        complex_mode = parsed['customModes'][1]
        groups = complex_mode['groups']
        
        # Find the complex edit group
        edit_group = None
        for group in groups:
            if isinstance(group, list) and len(group) == 2 and group[0] == 'edit':
                edit_group = group
                break
        
        self.assertIsNotNone(edit_group)
        self.assertEqual(edit_group[0], 'edit')
        self.assertIn('fileRegex', edit_group[1])
        self.assertEqual(edit_group[1]['fileRegex'], r'\.py$')
    
    def test_output_format_validation(self):
        """Test the output format validation method."""
        # Valid YAML
        valid_yaml = """
customModes:
  - slug: test-mode
    name: Test Mode
    roleDefinition: Test role
    groups:
      - read
      - edit
    source: global
"""
        self.assertTrue(self.sync.validate_output_format(valid_yaml))
        
        # Invalid YAML (missing customModes)
        invalid_yaml = """
modes:
  - slug: test-mode
    name: Test Mode
"""
        self.assertFalse(self.sync.validate_output_format(invalid_yaml))
        
        # Invalid YAML (malformed)
        malformed_yaml = """
customModes:
  - slug: test-mode
    name: Test Mode
    groups: [read, edit
"""  # Missing closing bracket
        self.assertFalse(self.sync.validate_output_format(malformed_yaml))
    
    def test_complete_workflow(self):
        """Test the complete sync workflow with example modes."""
        # Create the example modes from the schema
        docs_writer = {
            'slug': 'docs-writer',
            'name': 'Documentation Writer',
            'roleDefinition': 'You are a technical writer specializing in clear, concise developer documentation.\nYou focus on giving examples and step-by-step guides.',
            'whenToUse': 'Use this mode whenever generating or editing user-facing docs.',
            'customInstructions': '• Always include code snippets in fenced blocks.\n• Validate all YAML examples before publishing.',
            'groups': [
                'read',
                'edit',
                ['edit', {'fileRegex': r'\.(md|mdx)$', 'description': 'Markdown and MDX files only'}],
                'browser'
            ]
        }
        
        security_review = {
            'slug': 'security-review',
            'name': 'Security Reviewer',
            'roleDefinition': 'You are a security expert reviewing code for vulnerabilities,\ninjection flaws, and insecure configurations.',
            'whenToUse': 'Use this mode during code reviews for security audits.',
            'groups': ['read', 'browser', 'command']
        }
        
        self.create_test_mode_file('docs-writer', docs_writer)
        self.create_test_mode_file('security-review', security_review)
        
        # Override the mode order to include our test modes
        self.sync.mode_order = ['docs-writer', 'security-review']
        
        # Run the sync process
        config = self.sync.create_global_config()
        
        # Verify the configuration
        self.assertEqual(len(config['customModes']), 2)
        
        # Check docs-writer mode
        docs_mode = config['customModes'][0]
        self.assertEqual(docs_mode['slug'], 'docs-writer')
        self.assertEqual(docs_mode['source'], 'global')
        
        # Check security-review mode
        security_mode = config['customModes'][1]
        self.assertEqual(security_mode['slug'], 'security-review')
        self.assertEqual(security_mode['source'], 'global')
        
        # Generate and validate YAML output
        yaml_output = self.sync.write_global_config_yaml(config)
        self.assertTrue(self.sync.validate_output_format(yaml_output))
        
        # Parse and verify structure
        parsed = yaml.safe_load(yaml_output)
        self.assertEqual(len(parsed['customModes']), 2)
        
        # Verify complex groups are properly formatted
        docs_groups = parsed['customModes'][0]['groups']
        has_complex_edit = any(
            isinstance(g, list) and len(g) == 2 and g[0] == 'edit' 
            and isinstance(g[1], dict) and 'fileRegex' in g[1]
            for g in docs_groups
        )
        self.assertTrue(has_complex_edit)

class TestValidationMethods(unittest.TestCase):
    """Test individual validation methods."""
    
    def setUp(self):
        self.sync = ModeConfigSync()
    
    def test_slug_pattern_validation(self):
        """Test slug pattern validation method."""
        valid_slugs = ['test', 'test-mode', 'mode123', 'a', 'complex-mode-v2']
        invalid_slugs = ['Test', 'test_mode', 'test mode', 'test@mode', '']
        
        for slug in valid_slugs:
            self.assertTrue(self.sync.validate_slug_pattern(slug), f"Should accept: {slug}")
        
        for slug in invalid_slugs:
            self.assertFalse(self.sync.validate_slug_pattern(slug), f"Should reject: {slug}")
    
    def test_string_field_validation(self):
        """Test string field validation method."""
        # Valid strings
        self.assertTrue(self.sync.validate_string_field('valid string', 'test'))
        self.assertTrue(self.sync.validate_string_field('a', 'test', min_length=1))
        
        # Invalid strings
        with self.assertRaises(ModeValidationError):
            self.sync.validate_string_field('', 'test')
        
        with self.assertRaises(ModeValidationError):
            self.sync.validate_string_field(123, 'test')
        
        with self.assertRaises(ModeValidationError):
            self.sync.validate_string_field('a', 'test', min_length=2)
    
    def test_groups_structure_validation(self):
        """Test groups structure validation method."""
        # Valid groups
        valid_groups = [
            ['read'],
            ['read', 'edit', 'browser'],
            ['read', ['edit', {'fileRegex': r'\.py$'}]],
            [['edit', {'fileRegex': r'\.md$', 'description': 'Markdown files'}]]
        ]
        
        for groups in valid_groups:
            self.assertTrue(self.sync.validate_groups_structure(groups))
        
        # Invalid groups
        invalid_groups = [
            [],  # Empty
            ['invalid'],  # Invalid group name
            [['read', {'fileRegex': 'pattern'}]],  # Wrong complex structure
            [['edit']],  # Incomplete complex structure
            [['edit', {'missing': 'fileRegex'}]]  # Missing required field
        ]
        
        for groups in invalid_groups:
            with self.assertRaises(ModeValidationError):
                self.sync.validate_groups_structure(groups)

def run_tests():
    """Run all tests with detailed output."""
    # Create test suite
    test_classes = [TestModeConfigSync, TestValidationMethods]
    
    suite = unittest.TestSuite()
    for test_class in test_classes:
        tests = unittest.TestLoader().loadTestsFromTestCase(test_class)
        suite.addTests(tests)
    
    # Run tests with verbose output
    runner = unittest.TextTestRunner(verbosity=2, buffer=True)
    result = runner.run(suite)
    
    # Print summary
    print(f"\n{'='*50}")
    print(f"Test Summary:")
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Success rate: {(result.testsRun - len(result.failures) - len(result.errors))/result.testsRun*100:.1f}%")
    
    if result.failures:
        print(f"\nFailures:")
        for test, trace in result.failures:
            print(f"  {test}: {trace}")
    
    if result.errors:
        print(f"\nErrors:")
        for test, trace in result.errors:
            print(f"  {test}: {trace}")
    
    return result.wasSuccessful()

if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)