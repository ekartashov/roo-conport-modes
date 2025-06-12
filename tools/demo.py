#!/usr/bin/env python3
"""
Demo script to show the improved YAML output format for custom_modes.yaml
"""

import sys
from pathlib import Path

# Add the scripts directory to path to import our module
sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from sync import ModeConfigSyncEnhanced as ModeConfigSync

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
    # Create the config and get the YAML representation
    config = test_config
    
    # Use the sync manager's formatting method to get YAML output
    yaml_lines = ["customModes:"]
    for mode in config['customModes']:
        yaml_lines.append(f"  - slug: {mode['slug']}")
        yaml_lines.append(f"    name: {sync.format_multiline_string(mode['name'], 4)}")
        yaml_lines.append(f"    roleDefinition: {sync.format_multiline_string(mode['roleDefinition'], 4)}")
        
        if 'whenToUse' in mode:
            yaml_lines.append(f"    whenToUse: {sync.format_multiline_string(mode['whenToUse'], 4)}")
        
        if 'customInstructions' in mode:
            yaml_lines.append(f"    customInstructions: {sync.format_multiline_string(mode['customInstructions'], 4)}")
        
        yaml_lines.append("    groups:")
        for group in mode['groups']:
            if isinstance(group, str):
                yaml_lines.append(f"      - {group}")
            elif isinstance(group, list) and len(group) == 2:
                yaml_lines.append(f"      - - {group[0]}")
                yaml_lines.append(f"        - fileRegex: {group[1]['fileRegex']}")
                if 'description' in group[1]:
                    yaml_lines.append(f"          description: {group[1]['description']}")
        
        yaml_lines.append(f"    source: {mode['source']}")
    
    yaml_output = "\n".join(yaml_lines)
    
    print("Generated custom_modes.yaml:")
    print("-" * 30)
    print(yaml_output)
    print("-" * 30)
    print()
    
    # Validate the configuration structure
    is_valid = True
    try:
        for mode in config['customModes']:
            sync.validate_mode_schema(mode, mode['slug'])
        print("✅ All modes passed validation")
    except Exception as e:
        print(f"❌ Validation failed: {e}")
        is_valid = False
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