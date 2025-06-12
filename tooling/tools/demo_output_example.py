#!/usr/bin/env python3
"""
Demo script to show the improved YAML output format for custom_modes.yaml
"""

import sys
from pathlib import Path

# Add the scripts directory to path to import our module
sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from sync_modes_to_global_config import ModeConfigSync

def demo_yaml_output():
    """Demonstrate the corrected YAML output format."""
    sync = ModeConfigSync()
    
    # Example modes based on the schema
    test_config = {
        'customModes': [
            {
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
                ],
                'source': 'global'
            },
            {
                'slug': 'security-review',
                'name': 'Security Reviewer',
                'roleDefinition': 'You are a security expert reviewing code for vulnerabilities,\ninjection flaws, and insecure configurations.',
                'whenToUse': 'Use this mode during code reviews for security audits.',
                'groups': ['read', 'browser', 'command'],
                'source': 'global'
            }
        ]
    }
    
    print("🎯 Enhanced YAML Output Format Demo")
    print("=" * 50)
    print()
    
    # Generate the YAML output
    yaml_output = sync.write_global_config_yaml(test_config)
    
    print("Generated custom_modes.yaml:")
    print("-" * 30)
    print(yaml_output)
    print("-" * 30)
    print()
    
    # Validate the output
    is_valid = sync.validate_output_format(yaml_output)
    print(f"✅ Format validation: {'PASSED' if is_valid else 'FAILED'}")
    
    if is_valid:
        print()
        print("🔍 Key improvements:")
        print("  • Proper JSON schema validation")
        print("  • Correct complex group structure with fileRegex")
        print("  • Slug pattern validation (^[a-z0-9\\-]+$)")
        print("  • Required field enforcement")
        print("  • Output format verification")
        print()
        print("📝 The complex edit group is now properly formatted as:")
        print("     - - edit")
        print("       - fileRegex: \\.(md|mdx)$")
        print("         description: Markdown and MDX files only")
    
    return is_valid

if __name__ == '__main__':
    success = demo_yaml_output()
    sys.exit(0 if success else 1)