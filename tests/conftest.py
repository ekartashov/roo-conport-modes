"""
Common test fixtures and configuration for pytest.
"""

import os
import sys
import yaml
import pytest
import shutil
from pathlib import Path


@pytest.fixture
def temp_modes_dir(tmp_path):
    """Create a temporary directory for test mode files."""
    modes_dir = tmp_path / "modes"
    modes_dir.mkdir()
    return modes_dir


@pytest.fixture
def temp_config_dir(tmp_path):
    """Create a temporary directory for config files."""
    config_dir = tmp_path / "config"
    config_dir.mkdir(parents=True, exist_ok=True)
    return config_dir


@pytest.fixture
def temp_project_dir(tmp_path):
    """Create a temporary directory simulating a project."""
    project_dir = tmp_path / "project"
    project_dir.mkdir(parents=True, exist_ok=True)
    return project_dir


def create_mode_file(modes_dir, slug, config):
    """Helper to create a mode file in the test directory."""
    mode_file = modes_dir / f"{slug}.yaml"
    with open(mode_file, 'w') as f:
        yaml.dump(config, f, default_flow_style=False)
    return mode_file


def create_valid_mode_config(slug):
    """Helper to create a valid mode configuration."""
    return {
        'slug': slug,
        'name': f'{slug.title()} Mode',
        'roleDefinition': f'Test {slug} role definition',
        'groups': ['read', 'edit']
    }


@pytest.fixture
def valid_mode_configs():
    """Return a dictionary of valid mode configurations for testing."""
    return {
        'code': create_valid_mode_config('code'),
        'architect': create_valid_mode_config('architect'),
        'debug': create_valid_mode_config('debug'),
        'custom-mode': create_valid_mode_config('custom-mode')
    }


@pytest.fixture
def invalid_mode_configs():
    """Return a dictionary of invalid mode configurations for testing."""
    return {
        'missing-required': {
            'slug': 'missing-required',
            'name': 'Missing Required Fields Mode',
            # Missing roleDefinition and groups
        },
        'invalid-slug': {
            'slug': 'Invalid Slug',  # Contains uppercase and space
            'name': 'Invalid Slug Mode',
            'roleDefinition': 'Test role definition',
            'groups': ['read']
        },
        'empty-groups': {
            'slug': 'empty-groups',
            'name': 'Empty Groups Mode',
            'roleDefinition': 'Test role definition',
            'groups': []  # Empty groups array
        },
        'invalid-groups': {
            'slug': 'invalid-groups',
            'name': 'Invalid Groups Mode',
            'roleDefinition': 'Test role definition',
            'groups': ['invalid-group']  # Invalid group name
        }
    }


@pytest.fixture
def setup_valid_modes(temp_modes_dir, valid_mode_configs):
    """Set up valid mode files in the temporary directory."""
    mode_files = {}
    for slug, config in valid_mode_configs.items():
        mode_files[slug] = create_mode_file(temp_modes_dir, slug, config)
    return mode_files


@pytest.fixture
def setup_invalid_modes(temp_modes_dir, invalid_mode_configs):
    """Set up invalid mode files in the temporary directory."""
    mode_files = {}
    for slug, config in invalid_mode_configs.items():
        mode_files[slug] = create_mode_file(temp_modes_dir, slug, config)
    return mode_files