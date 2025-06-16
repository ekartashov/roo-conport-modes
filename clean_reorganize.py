#!/usr/bin/env python3
"""
Clean Project Reorganization Script
Continues the existing standardization work (ConPort Decision #85)
Focus: Documentation consolidation and utilities organization
"""

import os
import shutil
import sys
from pathlib import Path
import argparse
from datetime import datetime

class CleanReorganizer:
    def __init__(self, root_path: Path, dry_run: bool = False):
        self.root_path = root_path
        self.dry_run = dry_run
        self.actions = []
        
    def log_action(self, action: str, source: str = "", target: str = ""):
        """Log reorganization actions"""
        entry = f"✅ {action}: {source} -> {target}" if source and target else f"✅ {action}"
        if self.dry_run:
            entry = f"🔍 [DRY RUN] {action}: {source} -> {target}" if source and target else f"🔍 [DRY RUN] {action}"
        
        self.actions.append(entry)
        print(entry)

    def ensure_directory(self, path: Path):
        """Create directory if it doesn't exist"""
        if not self.dry_run:
            path.mkdir(parents=True, exist_ok=True)
        self.log_action(f"Ensure directory exists", target=str(path))

    def move_file(self, source: Path, target: Path):
        """Move file with logging"""
        if source.exists():
            self.ensure_directory(target.parent)
            if not self.dry_run:
                if target.exists():
                    print(f"⚠️  Target exists, skipping: {target}")
                    return False
                shutil.move(str(source), str(target))
            self.log_action("Move file", str(source), str(target))
            return True
        else:
            self.log_action(f"Source not found: {source}")
            return False

    def reorganize(self):
        """Execute the clean reorganization"""
        print("🚀 Starting clean project reorganization...")
        print("📋 This continues existing standardization work (ConPort Decision #85)")
        
        # Phase 1: Documentation consolidation
        self.consolidate_documentation()
        
        # Phase 2: Utilities organization  
        self.organize_utilities()
        
        # Phase 3: Summary
        self.print_summary()

    def consolidate_documentation(self):
        """Phase 1: Consolidate documentation structure"""
        print("\n📚 Phase 1: Documentation Consolidation")
        
        docs_path = self.root_path / "docs"
        
        # Ensure target directories exist
        self.ensure_directory(docs_path / "guides")
        self.ensure_directory(docs_path / "examples") 
        self.ensure_directory(docs_path / "analysis")
        self.ensure_directory(docs_path / "phases")
        
        # Guide files (mode enhancements and how-tos)
        guide_files = [
            "ask-mode-enhancements.md",
            "code-mode-enhancements.md", 
            "conport-maintenance-mode-enhancements.md",
            "conport-validation-checkpoints.md",
            "conport-validation-strategy.md",
            "cross-mode-knowledge-workflows.md",
            "data-locality-detection.md",
            "debug-mode-enhancements.md",
            "docs-mode-enhancements.md",
            "knowledge-first-guidelines.md",
            "knowledge-first-initialization-guide.md",
            "knowledge-metrics-dashboard.md",
            "knowledge-quality-enhancement.md",
            "knowledge-source-classification.md",
            "orchestrator-mode-enhancements.md",
            "prompt-enhancer-mode-enhancements.md",
            "temporal-knowledge-management.md",
            "unified-context-refresh-protocol.md"
        ]
        
        for file_name in guide_files:
            source = docs_path / file_name
            target = docs_path / "guides" / file_name
            self.move_file(source, target)
        
        # Analysis files (technical design docs)
        analysis_files = [
            "sync-system-diagnostic-strategy.md",
            "sync-system-package-design.md", 
            "sync-system-tdd-strategy.md",
            "sync-system-validation-enhancement.md"
        ]
        
        for file_name in analysis_files:
            source = docs_path / file_name
            target = docs_path / "analysis" / file_name
            self.move_file(source, target)
        
        # Phase-specific files
        phase_files = [
            "phase-2-mode-enhancements-plan.md",
            "phase-3-advanced-knowledge-management-plan.md", 
            "phase-3.5-executive-summary.md",
            "phase-3.5-sync-system-fix-plan.md",
            "phase-4-plan.md"
        ]
        
        for file_name in phase_files:
            source = docs_path / file_name
            # Extract phase number from filename
            if "phase-2" in file_name:
                target = docs_path / "phases" / "phase-2" / file_name
            elif "phase-3.5" in file_name:
                target = docs_path / "phases" / "phase-3" / file_name
            elif "phase-3" in file_name:
                target = docs_path / "phases" / "phase-3" / file_name
            elif "phase-4" in file_name:
                target = docs_path / "phases" / "phase-4" / file_name
            else:
                target = docs_path / "phases" / file_name
            
            self.move_file(source, target)
        
        # Move existing phase directories to phases/
        for phase_dir in docs_path.glob("phase-*"):
            if phase_dir.is_dir():
                target = docs_path / "phases" / phase_dir.name
                if not self.dry_run and not target.exists():
                    shutil.move(str(phase_dir), str(target))
                self.log_action("Move directory", str(phase_dir), str(target))
        
        # Merge top-level examples/ into docs/examples/
        examples_path = self.root_path / "examples"
        if examples_path.exists():
            for item in examples_path.iterdir():
                if item.is_file():
                    target = docs_path / "examples" / item.name
                    self.move_file(item, target)
                elif item.is_dir():
                    target = docs_path / "examples" / item.name
                    if not self.dry_run and not target.exists():
                        shutil.move(str(item), str(target))
                    self.log_action("Move directory", str(item), str(target))
            
            # Remove empty examples directory
            if not self.dry_run and examples_path.exists() and not any(examples_path.iterdir()):
                examples_path.rmdir()
                self.log_action("Remove empty directory", str(examples_path))

    def organize_utilities(self):
        """Phase 2: Organize utilities structure"""
        print("\n🛠️ Phase 2: Utilities Organization")
        
        utilities_path = self.root_path / "utilities"
        
        # Create core utilities directory
        core_path = utilities_path / "core"
        self.ensure_directory(core_path)
        
        # Move loose utility files to core/
        loose_utilities = [
            "conport-validation-manager.js",
            "data-locality-detector.js",
            "knowledge-first-guidelines.js", 
            "knowledge-first-initialization.js",
            "knowledge-metrics-dashboard.js",
            "knowledge-source-classifier.js",
            "validation-checkpoints.js"
        ]
        
        for file_name in loose_utilities:
            source = utilities_path / file_name
            target = core_path / file_name
            self.move_file(source, target)
        
        # Rename mode-enhancements to enhancements
        mode_enhancements = utilities_path / "mode-enhancements"
        enhancements = utilities_path / "enhancements"
        
        if mode_enhancements.exists() and not enhancements.exists():
            if not self.dry_run:
                shutil.move(str(mode_enhancements), str(enhancements))
            self.log_action("Rename directory", str(mode_enhancements), str(enhancements))

    def print_summary(self):
        """Print reorganization summary"""
        print(f"\n🎉 Clean reorganization completed!")
        print(f"📊 Total actions: {len(self.actions)}")
        
        print("\n📋 Summary of changes:")
        print("✅ Documentation consolidated into:")
        print("   - docs/guides/ (mode guides and how-tos)")
        print("   - docs/examples/ (all usage examples)")
        print("   - docs/analysis/ (technical design docs)")
        print("   - docs/phases/ (phase-specific documentation)")
        print("✅ Utilities organized:")
        print("   - utilities/core/ (core utility functions)")
        print("   - utilities/enhancements/ (mode enhancement utilities)")
        print("✅ Maintained existing working structure:")
        print("   - modes/, templates/, scripts/, tools/, tests/, context_portal/")
        
        print(f"\n💾 Actions log:")
        for action in self.actions:
            print(f"  {action}")

def main():
    parser = argparse.ArgumentParser(
        description="Clean reorganization continuing standardization work"
    )
    parser.add_argument(
        "--dry-run", 
        action="store_true",
        help="Preview changes without executing them"
    )
    parser.add_argument(
        "--root", 
        type=str, 
        default=".",
        help="Root directory of the repository"
    )
    
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
    
    reorganizer = CleanReorganizer(root_path, dry_run=args.dry_run)
    reorganizer.reorganize()

if __name__ == "__main__":
    main()