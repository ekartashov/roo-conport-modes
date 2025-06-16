#!/usr/bin/env python3
"""
Comprehensive Repository Reorganization Script
Reorganizes roo-conport-modes project into a clear, logical structure
"""

import os
import shutil
import sys
from pathlib import Path
import argparse
import json
from datetime import datetime

class RepositoryReorganizer:
    def __init__(self, root_path: Path, dry_run: bool = False):
        self.root_path = root_path
        self.dry_run = dry_run
        self.changes_log = []
        
    def log_action(self, action: str, source: str = "", target: str = ""):
        """Log reorganization actions"""
        entry = {
            "action": action,
            "source": source,
            "target": target,
            "timestamp": datetime.now().isoformat()
        }
        self.changes_log.append(entry)
        if not self.dry_run:
            print(f"✅ {action}: {source} -> {target}" if source and target else f"✅ {action}")
        else:
            print(f"🔍 [DRY RUN] {action}: {source} -> {target}" if source and target else f"🔍 [DRY RUN] {action}")

    def ensure_directory(self, path: Path):
        """Create directory if it doesn't exist"""
        if not self.dry_run:
            path.mkdir(parents=True, exist_ok=True)
        self.log_action(f"Create directory", target=str(path))

    def move_file_or_dir(self, source: Path, target: Path):
        """Move file or directory with logging"""
        if source.exists():
            self.ensure_directory(target.parent)
            if not self.dry_run:
                if target.exists():
                    if target.is_dir():
                        shutil.rmtree(target)
                    else:
                        target.unlink()
                shutil.move(str(source), str(target))
            self.log_action("Move", str(source), str(target))
        else:
            self.log_action(f"Source not found: {source}")

    def copy_file_or_dir(self, source: Path, target: Path):
        """Copy file or directory with logging"""
        if source.exists():
            self.ensure_directory(target.parent)
            if not self.dry_run:
                if source.is_dir():
                    if target.exists():
                        shutil.rmtree(target)
                    shutil.copytree(str(source), str(target))
                else:
                    shutil.copy2(str(source), str(target))
            self.log_action("Copy", str(source), str(target))
        else:
            self.log_action(f"Source not found: {source}")

    def reorganize_structure(self):
        """Execute the complete reorganization"""
        print("🚀 Starting comprehensive repository reorganization...")
        
        # Define new structure
        new_structure = {
            # Core system files
            "core": {
                "modes": "modes",
                "templates": "templates",
                "config": "config"
            },
            
            # Development tooling
            "tooling": {
                "scripts": "scripts",
                "tools": "tools",
                "tests": "tests"
            },
            
            # Documentation hub
            "documentation": {
                "guides": "docs/guides",
                "examples": "docs/examples", 
                "analysis": "docs/analysis",
                "phase-docs": "docs/phase-*"
            },
            
            # Knowledge management utilities
            "knowledge": {
                "core-utilities": "utilities/core",
                "enhancements": "utilities/enhancements", 
                "phase-1": "utilities/phase-1",
                "phase-2": "utilities/phase-2",
                "phase-3": "utilities/phase-3",
                "phase-4": "utilities/phase-4"
            },
            
            # Data and logs
            "data": {
                "context_portal": "context_portal",
                "logs": "logs"
            }
        }

        # Phase 1: Create new directory structure
        self.create_new_structure()
        
        # Phase 2: Move core system files  
        self.move_core_files()
        
        # Phase 3: Reorganize tooling
        self.reorganize_tooling()
        
        # Phase 4: Consolidate documentation
        self.consolidate_documentation()
        
        # Phase 5: Organize knowledge utilities
        self.organize_knowledge_utilities()
        
        # Phase 6: Handle data and configuration
        self.organize_data_and_config()
        
        # Phase 7: Clean up empty directories
        self.cleanup_empty_directories()
        
        # Phase 8: Update file references
        self.update_file_references()
        
        print(f"\n🎉 Reorganization completed! {len(self.changes_log)} changes made.")
        
        # Save changes log
        self.save_changes_log()

    def create_new_structure(self):
        """Create the new directory structure"""
        print("\n📁 Creating new directory structure...")
        
        directories = [
            "core/modes",
            "core/templates", 
            "core/config",
            "tooling/scripts",
            "tooling/tools",
            "tooling/tests",
            "documentation/guides",
            "documentation/examples",
            "documentation/analysis",
            "documentation/phase-docs",
            "knowledge/core-utilities",
            "knowledge/enhancements",
            "knowledge/phase-1",
            "knowledge/phase-2", 
            "knowledge/phase-3",
            "knowledge/phase-4",
            "data/context_portal",
            "data/logs"
        ]
        
        for dir_path in directories:
            self.ensure_directory(self.root_path / dir_path)

    def move_core_files(self):
        """Move core system files"""
        print("\n🔧 Moving core system files...")
        
        # Move modes
        if (self.root_path / "modes").exists():
            self.move_file_or_dir(
                self.root_path / "modes",
                self.root_path / "core" / "modes"
            )
            
        # Move templates
        if (self.root_path / "templates").exists():
            self.move_file_or_dir(
                self.root_path / "templates", 
                self.root_path / "core" / "templates"
            )
            
        # Move config if it exists
        if (self.root_path / "config").exists():
            self.move_file_or_dir(
                self.root_path / "config",
                self.root_path / "core" / "config"
            )

    def reorganize_tooling(self):
        """Reorganize development tooling"""
        print("\n🛠️ Reorganizing development tooling...")
        
        # Move scripts (but preserve internal structure)
        if (self.root_path / "scripts").exists():
            self.move_file_or_dir(
                self.root_path / "scripts",
                self.root_path / "tooling" / "scripts"
            )
            
        # Move tools
        if (self.root_path / "tools").exists():
            self.move_file_or_dir(
                self.root_path / "tools",
                self.root_path / "tooling" / "tools"
            )
            
        # Move tests
        if (self.root_path / "tests").exists():
            self.move_file_or_dir(
                self.root_path / "tests",
                self.root_path / "tooling" / "tests"
            )

    def consolidate_documentation(self):
        """Consolidate all documentation"""
        print("\n📚 Consolidating documentation...")
        
        # Move existing docs subdirectories
        docs_path = self.root_path / "docs"
        if docs_path.exists():
            # Move guides, examples, analysis if they exist as subdirs
            for subdir in ["guides", "examples", "analysis"]:
                subdir_path = docs_path / subdir
                if subdir_path.exists():
                    self.move_file_or_dir(
                        subdir_path,
                        self.root_path / "documentation" / subdir
                    )
            
            # Move phase-specific docs
            for phase_dir in docs_path.glob("phase-*"):
                if phase_dir.is_dir():
                    self.move_file_or_dir(
                        phase_dir,
                        self.root_path / "documentation" / "phase-docs" / phase_dir.name
                    )
            
            # Move remaining docs files to guides
            for doc_file in docs_path.glob("*.md"):
                self.move_file_or_dir(
                    doc_file,
                    self.root_path / "documentation" / "guides" / doc_file.name
                )
        
        # Move top-level examples if they exist separately
        examples_path = self.root_path / "examples"
        if examples_path.exists():
            # Merge with documentation/examples
            for example_file in examples_path.iterdir():
                target_path = self.root_path / "documentation" / "examples" / example_file.name
                self.move_file_or_dir(example_file, target_path)
            
            # Remove empty examples directory
            if not self.dry_run and examples_path.exists():
                examples_path.rmdir()

    def organize_knowledge_utilities(self):
        """Organize knowledge management utilities by category"""
        print("\n🧠 Organizing knowledge utilities...")
        
        utilities_path = self.root_path / "utilities"
        if not utilities_path.exists():
            return
            
        # Move core utilities (top-level JS files)
        core_utilities = [
            "conport-validation-manager.js",
            "data-locality-detector.js", 
            "knowledge-first-guidelines.js",
            "knowledge-first-initialization.js",
            "knowledge-metrics-dashboard.js",
            "knowledge-source-classifier.js",
            "validation-checkpoints.js"
        ]
        
        for utility in core_utilities:
            utility_path = utilities_path / utility
            if utility_path.exists():
                self.move_file_or_dir(
                    utility_path,
                    self.root_path / "knowledge" / "core-utilities" / utility
                )
        
        # Move mode enhancements
        mode_enhancements_path = utilities_path / "mode-enhancements"
        if mode_enhancements_path.exists():
            self.move_file_or_dir(
                mode_enhancements_path,
                self.root_path / "knowledge" / "enhancements"
            )
        
        # Move phase-specific utilities
        for phase in ["phase-1", "phase-2", "phase-3", "phase-4"]:
            phase_path = utilities_path / phase
            if phase_path.exists():
                self.move_file_or_dir(
                    phase_path,
                    self.root_path / "knowledge" / phase
                )

    def organize_data_and_config(self):
        """Organize data and configuration files"""
        print("\n🗄️ Organizing data and configuration...")
        
        # Move context_portal
        context_portal_path = self.root_path / "context_portal"
        if context_portal_path.exists():
            self.move_file_or_dir(
                context_portal_path,
                self.root_path / "data" / "context_portal"
            )
        
        # Move logs if they exist
        logs_path = self.root_path / "logs"
        if logs_path.exists():
            self.move_file_or_dir(
                logs_path,
                self.root_path / "data" / "logs"
            )
        
        # Move alembic directory to data if it exists
        alembic_path = self.root_path / "alembic"
        if alembic_path.exists():
            self.move_file_or_dir(
                alembic_path,
                self.root_path / "data" / "alembic"
            )

    def cleanup_empty_directories(self):
        """Remove empty directories"""
        print("\n🧹 Cleaning up empty directories...")
        
        # Remove empty original directories
        empty_dirs = ["docs", "examples", "utilities"]
        for dir_name in empty_dirs:
            dir_path = self.root_path / dir_name
            if dir_path.exists() and not any(dir_path.iterdir()):
                if not self.dry_run:
                    dir_path.rmdir()
                self.log_action(f"Remove empty directory", str(dir_path))

    def update_file_references(self):
        """Update file references in documentation and scripts"""
        print("\n🔗 Updating file references...")
        
        # This would be expanded to update specific file references
        # For now, we'll note that this needs to be done
        self.log_action("Note: File references need manual review and updating")

    def save_changes_log(self):
        """Save the changes log to a file"""
        log_file = self.root_path / "reorganization_log.json"
        if not self.dry_run:
            with open(log_file, 'w') as f:
                json.dump(self.changes_log, f, indent=2)
        self.log_action("Save changes log", target=str(log_file))

def main():
    parser = argparse.ArgumentParser(description="Reorganize repository structure")
    parser.add_argument("--dry-run", action="store_true", 
                       help="Preview changes without executing them")
    parser.add_argument("--root", type=str, default=".",
                       help="Root directory of the repository")
    
    args = parser.parse_args()
    
    root_path = Path(args.root).resolve()
    
    if not root_path.exists():
        print(f"❌ Error: Root path {root_path} does not exist")
        sys.exit(1)
        
    print(f"📂 Repository root: {root_path}")
    
    if args.dry_run:
        print("🔍 DRY RUN MODE - No changes will be made")
    else:
        print("⚠️  LIVE MODE - Changes will be applied")
        response = input("Continue? (y/N): ")
        if response.lower() != 'y':
            print("❌ Aborted")
            sys.exit(0)
    
    reorganizer = RepositoryReorganizer(root_path, dry_run=args.dry_run)
    reorganizer.reorganize_structure()

if __name__ == "__main__":
    main()