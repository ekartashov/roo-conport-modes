#!/usr/bin/env python3
"""
Test Suite for CLI Interface Enhancements
Test-Driven Development for dynamic file discovery and configurable ordering
"""

import os
import sys
import yaml
import tempfile
import shutil
import unittest
from pathlib import Path
from unittest.mock import patch, MagicMock
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional

# Add the current directory to path to import our module
sys.path.insert(0, str(Path(__file__).parent))

class TestDynamicFileDiscovery(unittest.TestCase):
    """Test cases for dynamic file discovery functionality."""
    
    def setUp(self):
        """Set up test environment with temporary directories."""
        self.test_dir = Path(tempfile.mkdtemp())
        self.modes_dir = self.test_dir / "modes"
        self.modes_dir.mkdir()
        
    def tearDown(self):
        """Clean up test environment."""
        shutil.rmtree(self.test_dir)
    
    def create_test_mode_file(self, slug: str, config: dict):
        """Helper to create a test mode file."""
        mode_file = self.modes_dir / f"{slug}.yaml"
        with open(mode_file, 'w') as f:
            yaml.dump(config, f, default_flow_style=False)
        return mode_file
    
    def test_discover_core_modes(self):
        """Test discovery of core workflow modes."""
        # Create core mode files
        core_modes = ['code', 'architect', 'debug', 'ask', 'orchestrator']
        for mode in core_modes:
            self.create_test_mode_file(mode, {
                'slug': mode,
                'name': f'{mode.title()} Mode',
                'roleDefinition': f'Test {mode} role',
                'groups': ['read']
            })
        
        # This will be implemented
        from sync_modes_to_global_config_enhanced import ModeDiscovery
        discovery = ModeDiscovery(self.modes_dir)
        categorized = discovery.discover_all_modes()
        
        self.assertEqual(set(categorized['core']), set(core_modes))
        self.assertEqual(len(categorized['core']), 5)
    
    def test_discover_enhanced_modes(self):
        """Test discovery of enhanced variant modes."""
        enhanced_modes = ['code-enhanced', 'debug-plus', 'architect-enhanced']
        for mode in enhanced_modes:
            self.create_test_mode_file(mode, {
                'slug': mode,
                'name': f'{mode} Mode',
                'roleDefinition': f'Test {mode} role',
                'groups': ['read']
            })
        
        from sync_modes_to_global_config_enhanced import ModeDiscovery
        discovery = ModeDiscovery(self.modes_dir)
        categorized = discovery.discover_all_modes()
        
        self.assertEqual(set(categorized['enhanced']), set(enhanced_modes))
    
    def test_discover_specialized_modes(self):
        """Test discovery of specialized tool modes."""
        specialized_modes = [
            'prompt-enhancer', 'conport-maintenance', 'docs-creator', 
            'security-auditor', 'test-enhancer-isolated'
        ]
        for mode in specialized_modes:
            self.create_test_mode_file(mode, {
                'slug': mode,
                'name': f'{mode} Mode',
                'roleDefinition': f'Test {mode} role',
                'groups': ['read']
            })
        
        from sync_modes_to_global_config_enhanced import ModeDiscovery
        discovery = ModeDiscovery(self.modes_dir)
        categorized = discovery.discover_all_modes()
        
        self.assertEqual(set(categorized['specialized']), set(specialized_modes))
    
    def test_discover_unknown_modes(self):
        """Test discovery categorizes unknown modes as 'discovered'."""
        unknown_modes = ['custom-mode', 'experimental-feature', 'user-defined']
        for mode in unknown_modes:
            self.create_test_mode_file(mode, {
                'slug': mode,
                'name': f'{mode} Mode',
                'roleDefinition': f'Test {mode} role',
                'groups': ['read']
            })
        
        from sync_modes_to_global_config_enhanced import ModeDiscovery
        discovery = ModeDiscovery(self.modes_dir)
        categorized = discovery.discover_all_modes()
        
        self.assertEqual(set(categorized['discovered']), set(unknown_modes))
    
    def test_mixed_mode_discovery(self):
        """Test discovery with mixed mode types."""
        # Create various mode types
        modes = {
            'core': ['code', 'debug'],
            'enhanced': ['code-enhanced'],
            'specialized': ['prompt-enhancer', 'docs-creator'],
            'discovered': ['custom-mode', 'experimental']
        }
        
        all_modes = []
        for category, mode_list in modes.items():
            all_modes.extend(mode_list)
        
        for mode in all_modes:
            self.create_test_mode_file(mode, {
                'slug': mode,
                'name': f'{mode} Mode',
                'roleDefinition': f'Test {mode} role',
                'groups': ['read']
            })
        
        from sync_modes_to_global_config_enhanced import ModeDiscovery
        discovery = ModeDiscovery(self.modes_dir)
        categorized = discovery.discover_all_modes()
        
        for category, expected_modes in modes.items():
            self.assertEqual(set(categorized[category]), set(expected_modes),
                           f"Category {category} mismatch")
    
    def test_empty_directory(self):
        """Test discovery with empty modes directory."""
        from sync_modes_to_global_config_enhanced import ModeDiscovery
        discovery = ModeDiscovery(self.modes_dir)
        categorized = discovery.discover_all_modes()
        
        for category in ['core', 'enhanced', 'specialized', 'discovered']:
            self.assertEqual(categorized[category], [])
    
    def test_invalid_yaml_files_skipped(self):
        """Test that invalid YAML files are skipped during discovery."""
        # Create valid mode
        self.create_test_mode_file('valid-mode', {
            'slug': 'valid-mode',
            'name': 'Valid Mode',
            'roleDefinition': 'Valid role',
            'groups': ['read']
        })
        
        # Create invalid YAML file
        invalid_file = self.modes_dir / "invalid-mode.yaml"
        with open(invalid_file, 'w') as f:
            f.write("invalid: yaml: content: [unclosed")
        
        from sync_modes_to_global_config_enhanced import ModeDiscovery
        discovery = ModeDiscovery(self.modes_dir)
        categorized = discovery.discover_all_modes()
        
        # Should only find the valid mode
        total_modes = sum(len(modes) for modes in categorized.values())
        self.assertEqual(total_modes, 1)
        self.assertIn('valid-mode', categorized['discovered'])


class TestOrderingStrategies(unittest.TestCase):
    """Test cases for different ordering strategies."""
    
    def setUp(self):
        """Set up test data for ordering tests."""
        self.sample_categorized_modes = {
            'core': ['code', 'architect', 'debug', 'ask', 'orchestrator'],
            'enhanced': ['code-enhanced'],
            'specialized': ['prompt-enhancer', 'conport-maintenance'],
            'discovered': ['custom-mode', 'experimental']
        }
    
    def test_strategic_ordering_strategy(self):
        """Test strategic ordering maintains predefined order."""
        from sync_modes_to_global_config_enhanced import StrategicOrderingStrategy
        
        strategy = StrategicOrderingStrategy()
        ordered = strategy.order_modes(self.sample_categorized_modes, {})
        
        # Should start with strategic order for known modes
        expected_start = ['code', 'architect', 'debug', 'ask', 'orchestrator', 'code-enhanced']
        self.assertEqual(ordered[:6], expected_start)
        
        # Should include all modes
        all_modes = []
        for modes in self.sample_categorized_modes.values():
            all_modes.extend(modes)
        self.assertEqual(set(ordered), set(all_modes))
    
    def test_alphabetical_ordering_strategy(self):
        """Test alphabetical ordering within categories."""
        from sync_modes_to_global_config_enhanced import AlphabeticalOrderingStrategy
        
        strategy = AlphabeticalOrderingStrategy()
        ordered = strategy.order_modes(self.sample_categorized_modes, {})
        
        # Should be alphabetical within each category
        # Core: architect, ask, code, debug, orchestrator (actual alphabetical order)
        core_section = ordered[:5]
        self.assertEqual(core_section, ['architect', 'ask', 'code', 'debug', 'orchestrator'])
    
    def test_category_based_ordering_strategy(self):
        """Test category-based ordering with custom category order."""
        from sync_modes_to_global_config_enhanced import CategoryBasedOrderingStrategy
        
        strategy = CategoryBasedOrderingStrategy()
        options = {'category_order': ['specialized', 'core', 'enhanced', 'discovered']}
        ordered = strategy.order_modes(self.sample_categorized_modes, options)
        
        # Should start with specialized modes
        self.assertIn(ordered[0], ['prompt-enhancer', 'conport-maintenance'])
        self.assertIn(ordered[1], ['prompt-enhancer', 'conport-maintenance'])
        
        # Core modes should come after specialized
        core_start_idx = next(i for i, mode in enumerate(ordered) if mode in self.sample_categorized_modes['core'])
        self.assertGreater(core_start_idx, 1)
    
    def test_custom_ordering_strategy(self):
        """Test custom explicit ordering."""
        from sync_modes_to_global_config_enhanced import CustomOrderingStrategy
        
        strategy = CustomOrderingStrategy()
        custom_order = ['debug', 'code', 'custom-mode', 'architect']
        options = {'custom_order': custom_order}
        ordered = strategy.order_modes(self.sample_categorized_modes, options)
        
        # Should start with specified order
        self.assertEqual(ordered[:4], custom_order)
        
        # Should include remaining modes after custom order
        self.assertGreater(len(ordered), 4)
    
    def test_priority_and_exclusion_filters(self):
        """Test priority-first and exclusion options."""
        from sync_modes_to_global_config_enhanced import AlphabeticalOrderingStrategy
        
        strategy = AlphabeticalOrderingStrategy()
        options = {
            'priority_first': ['debug', 'custom-mode'],
            'exclude': ['orchestrator', 'experimental']
        }
        ordered = strategy.order_modes(self.sample_categorized_modes, options)
        
        # Should start with priority modes
        self.assertEqual(ordered[:2], ['debug', 'custom-mode'])
        
        # Should not include excluded modes
        self.assertNotIn('orchestrator', ordered)
        self.assertNotIn('experimental', ordered)


class TestCLIArgumentParsing(unittest.TestCase):
    """Test cases for enhanced CLI argument parsing."""
    
    def test_default_arguments(self):
        """Test default argument parsing (backward compatibility)."""
        from sync_modes_to_global_config_enhanced import create_argument_parser
        
        parser = create_argument_parser()
        args = parser.parse_args([])
        
        self.assertEqual(args.order, 'strategic')
        self.assertFalse(args.dry_run)
        self.assertFalse(args.list_modes)
        self.assertFalse(args.validate_only)
        self.assertIsNone(args.custom_order)
        self.assertEqual(args.priority, [])
        self.assertEqual(args.exclude, [])
    
    def test_ordering_arguments(self):
        """Test ordering strategy arguments."""
        from sync_modes_to_global_config_enhanced import create_argument_parser
        
        parser = create_argument_parser()
        
        # Test alphabetical ordering
        args = parser.parse_args(['--order', 'alphabetical'])
        self.assertEqual(args.order, 'alphabetical')
        
        # Test custom ordering
        args = parser.parse_args(['--order', 'custom', '--custom-order', 'debug,code,architect'])
        self.assertEqual(args.order, 'custom')
        self.assertEqual(args.custom_order, 'debug,code,architect')
        
        # Test category ordering
        args = parser.parse_args(['--order', 'category', '--category-order', 'specialized,core'])
        self.assertEqual(args.order, 'category')
        self.assertEqual(args.category_order, 'specialized,core')
    
    def test_filtering_arguments(self):
        """Test filtering arguments (priority and exclusion)."""
        from sync_modes_to_global_config_enhanced import create_argument_parser
        
        parser = create_argument_parser()
        args = parser.parse_args([
            '--priority', 'debug', 'code',
            '--exclude', 'experimental', 'deprecated'
        ])
        
        self.assertEqual(args.priority, ['debug', 'code'])
        self.assertEqual(args.exclude, ['experimental', 'deprecated'])
    
    def test_information_arguments(self):
        """Test information and validation arguments."""
        from sync_modes_to_global_config_enhanced import create_argument_parser
        
        parser = create_argument_parser()
        
        # Test list modes
        args = parser.parse_args(['--list-modes'])
        self.assertTrue(args.list_modes)
        
        # Test validate only
        args = parser.parse_args(['--validate-only'])
        self.assertTrue(args.validate_only)
        
        # Test config file
        args = parser.parse_args(['--config', 'order_config.yaml'])
        self.assertEqual(args.config, Path('order_config.yaml'))
    
    def test_combined_arguments(self):
        """Test combining multiple arguments."""
        from sync_modes_to_global_config_enhanced import create_argument_parser
        
        parser = create_argument_parser()
        args = parser.parse_args([
            '--order', 'category',
            '--priority', 'debug',
            '--exclude', 'experimental',
            '--dry-run',
            '--category-order', 'specialized,core'
        ])
        
        self.assertEqual(args.order, 'category')
        self.assertEqual(args.priority, ['debug'])
        self.assertEqual(args.exclude, ['experimental'])
        self.assertTrue(args.dry_run)
        self.assertEqual(args.category_order, 'specialized,core')


class TestConfigFileSupport(unittest.TestCase):
    """Test cases for external configuration file support."""
    
    def setUp(self):
        """Set up test environment."""
        self.test_dir = Path(tempfile.mkdtemp())
        
    def tearDown(self):
        """Clean up test environment."""
        shutil.rmtree(self.test_dir)
    
    def create_config_file(self, config: dict) -> Path:
        """Helper to create a configuration file."""
        config_path = self.test_dir / "order_config.yaml"
        with open(config_path, 'w') as f:
            yaml.dump(config, f, default_flow_style=False)
        return config_path
    
    def test_load_valid_config_file(self):
        """Test loading a valid configuration file."""
        config = {
            'strategy': 'category',
            'category_order': ['specialized', 'core', 'enhanced'],
            'within_category_sort': 'alphabetical',
            'priority_modes': ['debug', 'code'],
            'exclude_modes': ['experimental']
        }
        config_path = self.create_config_file(config)
        
        from sync_modes_to_global_config_enhanced import OrderingConfig
        ordering_config = OrderingConfig(config_path)
        
        self.assertEqual(ordering_config.strategy, 'category')
        self.assertEqual(ordering_config.category_order, ['specialized', 'core', 'enhanced'])
        self.assertEqual(ordering_config.priority_modes, ['debug', 'code'])
        self.assertEqual(ordering_config.exclude_modes, ['experimental'])
    
    def test_config_file_validation(self):
        """Test validation of configuration file schema."""
        # Valid config
        valid_config = {
            'strategy': 'alphabetical'
        }
        config_path = self.create_config_file(valid_config)
        
        from sync_modes_to_global_config_enhanced import OrderingConfig
        ordering_config = OrderingConfig(config_path)
        self.assertTrue(ordering_config.is_valid())
        
        # Invalid config (invalid strategy)
        invalid_config = {
            'strategy': 'invalid_strategy'
        }
        config_path = self.create_config_file(invalid_config)
        
        with self.assertRaises(ValueError):
            OrderingConfig(config_path)
    
    def test_config_file_strategy_options(self):
        """Test extracting strategy options from config file."""
        config = {
            'strategy': 'category',
            'category_order': ['specialized', 'core'],
            'within_category_sort': 'manual',
            'manual_category_order': {
                'core': ['debug', 'code', 'architect'],
                'specialized': ['prompt-enhancer', 'conport-maintenance']
            }
        }
        config_path = self.create_config_file(config)
        
        from sync_modes_to_global_config_enhanced import OrderingConfig
        ordering_config = OrderingConfig(config_path)
        options = ordering_config.get_strategy_options()
        
        self.assertEqual(options['category_order'], ['specialized', 'core'])
        self.assertEqual(options['within_category_sort'], 'manual')
        self.assertIn('manual_category_order', options)


class TestIntegration(unittest.TestCase):
    """Integration tests for the complete enhanced functionality."""
    
    def setUp(self):
        """Set up test environment with comprehensive mode setup."""
        self.test_dir = Path(tempfile.mkdtemp())
        self.modes_dir = self.test_dir / "modes"
        self.modes_dir.mkdir()
        self.global_config_dir = self.test_dir / "global"
        self.global_config_dir.mkdir()
        self.global_config_path = self.global_config_dir / "custom_modes.yaml"
        
        # Create comprehensive set of test modes
        self.test_modes = {
            'code': {'category': 'core'},
            'architect': {'category': 'core'},
            'debug': {'category': 'core'},
            'code-enhanced': {'category': 'enhanced'},
            'prompt-enhancer': {'category': 'specialized'},
            'conport-maintenance': {'category': 'specialized'},
            'custom-mode': {'category': 'discovered'},
            'experimental': {'category': 'discovered'}
        }
        
        for mode_slug, info in self.test_modes.items():
            # Fix mode names to not have double hyphens
            display_name = mode_slug.replace('-', ' ').title()
            mode_config = {
                'slug': mode_slug,
                'name': f'{display_name} Mode',
                'roleDefinition': f'Test {mode_slug} role definition',
                'whenToUse': f'Use for {mode_slug} tasks',
                'groups': ['read', 'edit']
            }
            mode_file = self.create_test_mode_file(mode_slug, mode_config)
            print(f"DEBUG: Created test mode file: {mode_file}")
    
    def tearDown(self):
        """Clean up test environment."""
        shutil.rmtree(self.test_dir)
    
    def create_test_mode_file(self, slug: str, config: dict):
        """Helper to create a test mode file."""
        mode_file = self.modes_dir / f"{slug}.yaml"
        with open(mode_file, 'w') as f:
            yaml.dump(config, f, default_flow_style=False)
        return mode_file
    
    def test_complete_workflow_with_strategic_ordering(self):
        """Test complete workflow with strategic ordering (default)."""
        from sync_modes_to_global_config_enhanced import ModeConfigSyncEnhanced
        
        sync = ModeConfigSyncEnhanced()
        sync.workspace_dir = self.test_dir
        sync.modes_dir = self.modes_dir
        sync.global_config_path = self.global_config_path
        
        # Use strategic ordering (default)
        config = sync.create_global_config(order='strategic')
        
        self.assertIsNotNone(config)
        self.assertIn('customModes', config)
        self.assertGreater(len(config['customModes']), 0)
        
        # Strategic ordering should prioritize known core modes
        mode_slugs = [mode['slug'] for mode in config['customModes']]
        core_modes = ['code', 'architect', 'debug']
        
        for core_mode in core_modes:
            if core_mode in mode_slugs:
                core_idx = mode_slugs.index(core_mode)
                # Core modes should appear early
                self.assertLess(core_idx, 5)
    
    def test_complete_workflow_with_alphabetical_ordering(self):
        """Test complete workflow with alphabetical ordering."""
        from sync_modes_to_global_config_enhanced import ModeConfigSyncEnhanced
        
        sync = ModeConfigSyncEnhanced()
        sync.workspace_dir = self.test_dir
        sync.modes_dir = self.modes_dir
        sync.global_config_path = self.global_config_path
        
        config = sync.create_global_config(
            order='alphabetical',
            options={}
        )
        
        mode_slugs = [mode['slug'] for mode in config['customModes']]
        
        # Within each category, modes should be alphabetical
        # This is a simplified check - in practice, we'd verify category-wise ordering
        self.assertGreater(len(mode_slugs), 0)
        
        # Find core modes and verify they're alphabetical within their section
        core_modes_found = [slug for slug in mode_slugs if slug in ['architect', 'code', 'debug']]
        if len(core_modes_found) > 1:
            self.assertEqual(core_modes_found, sorted(core_modes_found))
    
    def test_complete_workflow_with_exclusions(self):
        """Test complete workflow with mode exclusions."""
        from sync_modes_to_global_config_enhanced import ModeConfigSyncEnhanced
        
        sync = ModeConfigSyncEnhanced()
        sync.workspace_dir = self.test_dir
        sync.modes_dir = self.modes_dir
        sync.global_config_path = self.global_config_path
        
        config = sync.create_global_config(
            order='alphabetical',
            options={'exclude': ['experimental', 'custom-mode']}
        )
        
        mode_slugs = [mode['slug'] for mode in config['customModes']]
        
        self.assertNotIn('experimental', mode_slugs)
        self.assertNotIn('custom-mode', mode_slugs)
        
        # Should still include other modes
        self.assertIn('code', mode_slugs)
        self.assertIn('architect', mode_slugs)
    
    def test_complete_workflow_with_priority_modes(self):
        """Test complete workflow with priority modes."""
        from sync_modes_to_global_config_enhanced import ModeConfigSyncEnhanced
        
        sync = ModeConfigSyncEnhanced()
        sync.workspace_dir = self.test_dir
        sync.modes_dir = self.modes_dir
        sync.global_config_path = self.global_config_path
        
        # First check what discovery finds
        categorized = sync.discovery.discover_all_modes()
        print(f"DEBUG: Discovered categorized modes: {categorized}")
        
        config = sync.create_global_config(
            order='alphabetical',
            options={'priority_first': ['debug', 'custom-mode']}
        )
        
        mode_slugs = [mode['slug'] for mode in config['customModes']]
        
        # Debug what we actually got
        print(f"DEBUG: All mode slugs: {mode_slugs}")
        print(f"DEBUG: Looking for priority modes: ['debug', 'custom-mode']")
        
        # Priority modes should appear first (if they exist)
        self.assertEqual(mode_slugs[0], 'debug')
        # custom-mode should be second if it exists
        if 'custom-mode' in mode_slugs:
            self.assertEqual(mode_slugs[1], 'custom-mode')
        else:
            self.fail("custom-mode not found in created modes")


def run_tests():
    """Run all tests with detailed output."""
    test_classes = [
        TestDynamicFileDiscovery,
        TestOrderingStrategies,
        TestCLIArgumentParsing,
        TestConfigFileSupport,
        TestIntegration
    ]
    
    suite = unittest.TestSuite()
    for test_class in test_classes:
        tests = unittest.TestLoader().loadTestsFromTestCase(test_class)
        suite.addTests(tests)
    
    runner = unittest.TextTestRunner(verbosity=2, buffer=True)
    result = runner.run(suite)
    
    print(f"\n{'='*50}")
    print(f"TDD Test Summary:")
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
    print("🧪 Running TDD Test Suite for CLI Enhancements")
    print("=" * 60)
    success = run_tests()
    sys.exit(0 if success else 1)