#!/usr/bin/env python3
"""
Repository Reorganization Script for roo-modes project
Reorganizes the repository structure for better maintainability and developer experience.
"""

import os
import shutil
import subprocess
import re
import argparse
from pathlib import Path
from typing import Dict, List, Tuple

class RepositoryReorganizer:
    def __init__(self, dry_run: bool = False):
        self.dry_run = dry_run
        self.repo_root = Path.cwd()
        self.migration_map = {
            "modes": "core/modes",
            "templates": "core/templates", 
            "scripts": "tooling/scripts",
            "tools": "tooling/tools",
            "docs": "documentation/guides",
            "examples": "documentation/examples",
            "analysis": "documentation/analysis",
            "context_portal": "data/context_portal"
        }
        self.path_updates = []
        
    def log(self, message: str, level: str = "INFO"):
        """Log messages with level prefix"""
        print(f"[{level}] {message}")
        
    def run_command(self, command: List[str], description: str = "") -> bool:
        """Run a command with optional dry-run mode"""
        if description:
            self.log(description)
            
        if self.dry_run:
            self.log(f"DRY-RUN: Would execute: {' '.join(command)}")
            return True
            
        try:
            result = subprocess.run(command, check=True, capture_output=True, text=True)
            if result.stdout:
                self.log(result.stdout.strip())
            return True
        except subprocess.CalledProcessError as e:
            self.log(f"Command failed: {' '.join(command)}", "ERROR")
            self.log(f"Error: {e.stderr}", "ERROR")
            return False
            
    def create_directory_structure(self):
        """Create the new directory structure"""
        self.log("Creating new directory structure...")
        
        new_dirs = [
            "core",
            "core/config",
            "tooling", 
            "tooling/maintenance",
            "documentation",
            "documentation/reference",
            "data",
            "data/cache",
            "tests",
            "tests/unit",
            "tests/integration", 
            "tests/fixtures"
        ]
        
        for dir_path in new_dirs:
            full_path = self.repo_root / dir_path
            if self.dry_run:
                self.log(f"DRY-RUN: Would create directory: {full_path}")
            else:
                full_path.mkdir(parents=True, exist_ok=True)
                self.log(f"Created directory: {dir_path}")
                
    def move_files(self):
        """Move files according to migration map using git mv"""
        self.log("Moving files to new structure...")
        
        for old_path, new_path in self.migration_map.items():
            old_full_path = self.repo_root / old_path
            new_full_path = self.repo_root / new_path
            
            if old_full_path.exists():
                # Ensure parent directory exists
                new_full_path.parent.mkdir(parents=True, exist_ok=True)
                
                # Use git mv to preserve history
                success = self.run_command(
                    ["git", "mv", str(old_path), str(new_path)],
                    f"Moving {old_path} -> {new_path}"
                )
                
                if success:
                    self.log(f"Successfully moved {old_path} to {new_path}")
                else:
                    self.log(f"Failed to move {old_path} to {new_path}", "ERROR")
            else:
                self.log(f"Source path does not exist: {old_path}", "WARNING")
                
    def update_file_content(self, file_path: Path, updates: List[Tuple[str, str]]) -> bool:
        """Update file content with path replacements"""
        if not file_path.exists():
            return False
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            original_content = content
            
            for old_pattern, new_pattern in updates:
                content = re.sub(old_pattern, new_pattern, content)
                
            if content != original_content:
                if self.dry_run:
                    self.log(f"DRY-RUN: Would update file: {file_path}")
                    return True
                    
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                self.log(f"Updated file: {file_path}")
                self.path_updates.append(str(file_path))
                return True
                
        except Exception as e:
            self.log(f"Error updating {file_path}: {e}", "ERROR")
            return False
            
        return False
        
    def update_path_references(self):
        """Update all path references in files"""
        self.log("Updating path references in files...")
        
        # Define path update patterns
        path_patterns = [
            # Script references
            (r'python scripts/', 'python tooling/scripts/'),
            (r'scripts/([^/\s]+\.py)', r'tooling/scripts/\1'),
            (r'scripts/([^/\s]+\.yaml)', r'tooling/scripts/\1'),
            (r'scripts/example_configs/', 'tooling/scripts/example_configs/'),
            
            # Mode references  
            (r'modes/([^/\s]+\.yaml)', r'core/modes/\1'),
            (r'`modes/`', '`core/modes/`'),
            (r'\bmodes/\b', 'core/modes/'),
            (r'cp modes/\*\.yaml', 'cp core/modes/*.yaml'),
            (r'cat modes/', 'cat core/modes/'),
            
            # Documentation references
            (r'docs/([^/\s]+\.md)', r'documentation/guides/\1'),
            (r'\bdocs/\b', 'documentation/guides/'),
            (r'`docs/`', '`documentation/guides/`'),
            
            # Examples references
            (r'examples/([^/\s]+\.md)', r'documentation/examples/\1'),
            (r'\bexamples/\b', 'documentation/examples/'),
            
            # Analysis references
            (r'analysis/([^/\s]+\.md)', r'documentation/analysis/\1'),
            (r'\banalysis/\b', 'documentation/analysis/'),
            
            # Templates references
            (r'templates/([^/\s]+\.yaml)', r'core/templates/\1'),
            (r'\btemplates/\b', 'core/templates/'),
            
            # Tools references
            (r'python tools/', 'python tooling/tools/'),
            (r'tools/([^/\s]+\.py)', r'tooling/tools/\1'),
            (r'\btools/\b', 'tooling/tools/'),
            
            # Context portal references
            (r'context_portal/', 'data/context_portal/'),
        ]
        
        # Files that need updating
        files_to_update = [
            "README.md",
            "tooling/scripts/README.md",
            "tooling/scripts/example_configs/README.md", 
            "tooling/scripts/mode_ordering_config.yaml",
            "documentation/guides/local-mode-installation.md",
            "documentation/guides/configuration-sync-analysis.md",
            "documentation/guides/configuration-sync-completion-report.md",
            "documentation/examples/mode-manager-examples.md",
            "core/templates/README.md",
            "core/templates/restricted-edit-mode-template.yaml",
            "tooling/tools/README.md"
        ]
        
        for file_path in files_to_update:
            full_path = self.repo_root / file_path
            self.update_file_content(full_path, path_patterns)
            
    def create_additional_config(self):
        """Create additional configuration files for the new structure"""
        self.log("Creating additional configuration files...")
        
        # Create paths configuration
        paths_config = """# Path Configuration for roo-modes
# Centralized path definitions to support future reorganizations

paths:
  core:
    modes: "core/modes"
    templates: "core/templates"
    config: "core/config"
    
  tooling:
    scripts: "tooling/scripts"
    tools: "tooling/tools"
    maintenance: "tooling/maintenance"
    
  documentation:
    guides: "documentation/guides"
    examples: "documentation/examples"
    analysis: "documentation/analysis"
    reference: "documentation/reference"
    
  data:
    context_portal: "data/context_portal"
    cache: "data/cache"
    
  tests:
    unit: "tests/unit"
    integration: "tests/integration"
    fixtures: "tests/fixtures"
"""
        
        config_path = self.repo_root / "core/config/paths.yaml"
        if self.dry_run:
            self.log(f"DRY-RUN: Would create {config_path}")
        else:
            config_path.parent.mkdir(parents=True, exist_ok=True)
            with open(config_path, 'w') as f:
                f.write(paths_config)
            self.log(f"Created paths configuration: {config_path}")
            
    def validate_migration(self):
        """Validate that all expected files exist in new locations"""
        self.log("Validating migration...")
        
        expected_files = [
            "core/modes",
            "core/templates", 
            "tooling/scripts",
            "tooling/tools",
            "documentation/guides",
            "documentation/examples",
            "documentation/analysis",
            "data/context_portal"
        ]
        
        all_valid = True
        for expected_path in expected_files:
            full_path = self.repo_root / expected_path
            if full_path.exists():
                self.log(f"✓ Validated: {expected_path}")
            else:
                self.log(f"✗ Missing: {expected_path}", "ERROR")
                all_valid = False
                
        return all_valid
        
    def generate_migration_report(self):
        """Generate a report of the migration"""
        self.log("\n" + "="*60)
        self.log("MIGRATION REPORT")
        self.log("="*60)
        
        self.log(f"Migration mode: {'DRY-RUN' if self.dry_run else 'LIVE'}")
        self.log(f"Files updated: {len(self.path_updates)}")
        
        if self.path_updates:
            self.log("\nUpdated files:")
            for file_path in self.path_updates:
                self.log(f"  - {file_path}")
                
        self.log(f"\nDirectory mapping:")
        for old_path, new_path in self.migration_map.items():
            self.log(f"  {old_path} -> {new_path}")
            
    def execute_migration(self):
        """Execute the complete migration process"""
        self.log(f"Starting repository reorganization ({'DRY-RUN' if self.dry_run else 'LIVE MODE'})...")
        
        # Step 1: Create new directory structure
        self.create_directory_structure()
        
        # Step 2: Move files
        self.move_files()
        
        # Step 3: Update path references
        self.update_path_references()
        
        # Step 4: Create additional configuration
        self.create_additional_config()
        
        # Step 5: Validate migration
        if not self.dry_run:
            if self.validate_migration():
                self.log("Migration validation successful!", "SUCCESS")
            else:
                self.log("Migration validation failed!", "ERROR")
                return False
                
        # Step 6: Generate report
        self.generate_migration_report()
        
        if not self.dry_run:
            self.log("\nMigration completed successfully!")
            self.log("Next steps:")
            self.log("1. Test all scripts and functionality")
            self.log("2. Commit changes: git add -A && git commit -m 'Repository reorganization'")
            self.log("3. Update any external references to this repository structure")
        else:
            self.log("\nDry-run completed. Use --execute to perform actual migration.")
            
        return True

def main():
    parser = argparse.ArgumentParser(description="Reorganize roo-modes repository structure")
    parser.add_argument("--dry-run", action="store_true", 
                       help="Preview changes without executing them")
    parser.add_argument("--execute", action="store_true",
                       help="Execute the migration (default is dry-run)")
    
    args = parser.parse_args()
    
    # Default to dry-run unless --execute is specified
    dry_run = not args.execute
    
    reorganizer = RepositoryReorganizer(dry_run=dry_run)
    
    try:
        success = reorganizer.execute_migration()
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\nMigration interrupted by user")
        exit(1)
    except Exception as e:
        print(f"Migration failed: {e}")
        exit(1)

if __name__ == "__main__":
    main()
