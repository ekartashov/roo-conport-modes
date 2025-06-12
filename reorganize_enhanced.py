#!/usr/bin/env python3
"""
Enhanced Repository Reorganization Script for roo-modes project
Reorganizes structure for better developer experience with compact naming and CLI tool renaming.
"""

import os
import shutil
import subprocess
import re
import argparse
from pathlib import Path
from typing import Dict, List, Tuple

class EnhancedRepositoryReorganizer:
    def __init__(self, dry_run: bool = False):
        self.dry_run = dry_run
        self.repo_root = Path.cwd()
        
        # Enhanced migration map with compact naming
        self.migration_map = {
            # Current -> New (more compact and memorable)
            "documentation": "docs",
            "tooling/scripts": "scripts", 
            "tooling/tools": "tools",
            "core/templates": "templates",
            "core/modes": "modes",
            "core/config": "config",
            "data/context_portal": "context_portal",
            "tests": "test"  # More compact
        }
        
        # Tool renaming map for shorter CLI commands
        self.tool_renames = {
            "sync_modes_to_global_config_enhanced.py": "sync.py",
            "sync_modes_to_global_config.py": "sync-basic.py", 
            "test_sync_modes.py": "test.py",
            "test_cli_enhancements.py": "test-cli.py",
            "demo_output_example.py": "demo.py",
            "mode_ordering_config.yaml": "order.yaml"
        }
        
        self.path_updates = []
        self.files_renamed = []
        
    def log(self, message: str, level: str = "INFO"):
        """Log messages with level prefix"""
        emoji_map = {
            "INFO": "ℹ️",
            "SUCCESS": "✅",
            "WARNING": "⚠️",
            "ERROR": "❌"
        }
        emoji = emoji_map.get(level, "ℹ️")
        print(f"{emoji} {message}")
        
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
            if e.stderr:
                self.log(f"Error: {e.stderr}", "ERROR")
            return False
            
    def analyze_current_structure(self):
        """Analyze current structure to identify what can be removed"""
        self.log("Analyzing current repository structure...")
        
        unnecessary_dirs = []
        empty_dirs = []
        
        # Check for empty or unnecessary directories
        for root, dirs, files in os.walk(self.repo_root):
            rel_path = Path(root).relative_to(self.repo_root)
            
            # Skip .git and other hidden directories
            if any(part.startswith('.') for part in rel_path.parts):
                continue
                
            # Check if directory is empty
            if not dirs and not files:
                empty_dirs.append(rel_path)
                
            # Check for potentially unnecessary directories
            if rel_path.name in ['cache', '__pycache__', '.pytest_cache']:
                unnecessary_dirs.append(rel_path)
                
        if unnecessary_dirs:
            self.log(f"Found {len(unnecessary_dirs)} unnecessary directories to remove")
            for dir_path in unnecessary_dirs:
                self.log(f"  - {dir_path}")
                
        if empty_dirs:
            self.log(f"Found {len(empty_dirs)} empty directories")
            
        return unnecessary_dirs, empty_dirs
        
    def remove_unnecessary_dirs(self, unnecessary_dirs: List[Path]):
        """Remove unnecessary directories"""
        if not unnecessary_dirs:
            return
            
        self.log("Removing unnecessary directories...")
        
        for dir_path in unnecessary_dirs:
            full_path = self.repo_root / dir_path
            if full_path.exists():
                if self.dry_run:
                    self.log(f"DRY-RUN: Would remove directory: {dir_path}")
                else:
                    shutil.rmtree(full_path)
                    self.log(f"Removed directory: {dir_path}")
                    
    def create_new_structure(self):
        """Create the enhanced directory structure"""
        self.log("Creating enhanced directory structure...")
        
        # Simple, memorable structure
        new_dirs = [
            "config",
            "docs",
            "docs/guides", 
            "docs/examples",
            "docs/analysis",
            "scripts",
            "tools", 
            "templates",
            "modes",
            "test",
            "test/unit",
            "test/integration"
        ]
        
        for dir_path in new_dirs:
            full_path = self.repo_root / dir_path
            if self.dry_run:
                self.log(f"DRY-RUN: Would create directory: {dir_path}")
            else:
                full_path.mkdir(parents=True, exist_ok=True)
                self.log(f"Created directory: {dir_path}")
                
    def move_directories(self):
        """Move directories according to migration map"""
        self.log("Reorganizing directory structure...")
        
        # Process moves in dependency order to avoid conflicts
        move_order = [
            ("documentation/guides", "docs/guides"),
            ("documentation/examples", "docs/examples"), 
            ("documentation/analysis", "docs/analysis"),
            ("documentation", "docs"),  # This will be empty at this point
            ("tooling/scripts", "scripts"),
            ("tooling/tools", "tools"),
            ("core/templates", "templates"),
            ("core/modes", "modes"),
            ("core/config", "config"),
            ("data/context_portal", "context_portal"),
            ("tests", "test")
        ]
        
        for old_path, new_path in move_order:
            old_full_path = self.repo_root / old_path
            new_full_path = self.repo_root / new_path
            
            if old_full_path.exists():
                # Skip if target already exists and has content
                if new_full_path.exists() and any(new_full_path.iterdir()):
                    self.log(f"Target {new_path} already exists with content, skipping move")
                    continue
                    
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
                
    def rename_tools(self):
        """Rename CLI tools to shorter names"""
        self.log("Renaming CLI tools for shorter commands...")
        
        for old_name, new_name in self.tool_renames.items():
            # Check multiple possible locations
            possible_paths = [
                self.repo_root / "scripts" / old_name,
                self.repo_root / "tools" / old_name,
                self.repo_root / "tooling" / "scripts" / old_name,
                self.repo_root / "tooling" / "tools" / old_name
            ]
            
            old_path = None
            for path in possible_paths:
                if path.exists():
                    old_path = path
                    break
                    
            if old_path:
                new_path = old_path.parent / new_name
                
                success = self.run_command(
                    ["git", "mv", str(old_path), str(new_path)],
                    f"Renaming {old_path.name} -> {new_name}"
                )
                
                if success:
                    self.files_renamed.append((str(old_path.relative_to(self.repo_root)), 
                                             str(new_path.relative_to(self.repo_root))))
                    self.log(f"Renamed {old_name} to {new_name}")
                else:
                    self.log(f"Failed to rename {old_name} to {new_name}", "ERROR")
            else:
                self.log(f"Tool not found: {old_name}", "WARNING")
                
    def update_file_content(self, file_path: Path, updates: List[Tuple[str, str]]) -> bool:
        """Update file content with replacements"""
        if not file_path.exists():
            return False
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            original_content = content
            
            for old_pattern, new_pattern in updates:
                content = re.sub(old_pattern, new_pattern, content, flags=re.MULTILINE)
                
            if content != original_content:
                if self.dry_run:
                    self.log(f"DRY-RUN: Would update file: {file_path}")
                    return True
                    
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                self.log(f"Updated references in: {file_path}")
                self.path_updates.append(str(file_path))
                return True
                
        except Exception as e:
            self.log(f"Error updating {file_path}: {e}", "ERROR")
            return False
            
        return False
        
    def update_all_references(self):
        """Update all path and tool references in files"""
        self.log("Updating all references to new structure and tool names...")
        
        # Comprehensive update patterns
        update_patterns = [
            # Directory structure updates
            (r'\bdocumentation/guides\b', 'docs/guides'),
            (r'\bdocumentation/examples\b', 'docs/examples'), 
            (r'\bdocumentation/analysis\b', 'docs/analysis'),
            (r'\bdocumentation\b', 'docs'),
            (r'\btooling/scripts\b', 'scripts'),
            (r'\btooling/tools\b', 'tools'),
            (r'\bcore/templates\b', 'templates'),
            (r'\bcore/modes\b', 'modes'),
            (r'\bcore/config\b', 'config'),
            (r'\bdata/context_portal\b', 'context_portal'),
            (r'\btests\b', 'test'),
            
            # CLI tool name updates
            (r'sync_modes_to_global_config_enhanced\.py', 'sync.py'),
            (r'sync_modes_to_global_config\.py', 'sync-basic.py'),
            (r'test_sync_modes\.py', 'test.py'),
            (r'test_cli_enhancements\.py', 'test-cli.py'),
            (r'demo_output_example\.py', 'demo.py'),
            (r'mode_ordering_config\.yaml', 'order.yaml'),
            
            # Python import updates
            (r'from tooling\.scripts\.', 'from scripts.'),
            (r'import tooling\.scripts\.', 'import scripts.'),
            (r'tooling/tooling/scripts/', 'scripts/'),
            (r'tooling/tooling/tools/', 'tools/'),
            (r'tooling/tooling/tooling/tools/', 'tools/'),
            
            # Path references in commands
            (r'python tooling/scripts/', 'python scripts/'),
            (r'python tooling/tools/', 'python tools/'),
            (r'cp core/modes/\*\.yaml', 'cp modes/*.yaml'),
            (r'cat core/modes/', 'cat modes/'),
            (r'cp core/templates/', 'cp templates/'),
            
            # Markdown link updates
            (r'\]\(documentation/guides/', '](docs/guides/'),
            (r'\]\(documentation/examples/', '](docs/examples/'),
            (r'\]\(documentation/analysis/', '](docs/analysis/'),
            (r'\]\(tooling/scripts/', '](scripts/'),
            (r'\]\(tooling/tools/', '](tools/'),
            (r'\]\(core/modes/', '](modes/'),
            (r'\]\(core/templates/', '](templates/'),
            
            # Config file updates  
            (r'"core/modes"', '"modes"'),
            (r'"core/templates"', '"templates"'),
            (r'"core/config"', '"config"'),
            (r'"tooling/scripts"', '"scripts"'),
            (r'"tooling/tools"', '"tools"'),
            (r'"documentation/guides"', '"docs/guides"'),
            (r'"documentation/examples"', '"docs/examples"'),
            (r'"documentation/analysis"', '"docs/analysis"'),
            (r'"data/context_portal"', '"context_portal"'),
            (r'"tests/unit"', '"test/unit"'),
            (r'"tests/integration"', '"test/integration"'),
        ]
        
        # Files that need updating
        files_to_update = [
            "README.md",
            "scripts/README.md",
            "scripts/example_configs/README.md",
            "scripts/order.yaml",
            "docs/guides/local-mode-installation.md",
            "docs/guides/configuration-sync-analysis.md", 
            "docs/guides/configuration-sync-completion-report.md",
            "docs/examples/mode-manager-examples.md",
            "templates/README.md",
            "tools/README.md",
            "config/paths.yaml"
        ]
        
        # Also update the renamed files
        for old_rel, new_rel in self.files_renamed:
            files_to_update.append(new_rel)
            
        for file_path in files_to_update:
            full_path = self.repo_root / file_path
            self.update_file_content(full_path, update_patterns)
            
    def create_enhanced_config(self):
        """Create enhanced configuration files"""
        self.log("Creating enhanced configuration files...")
        
        # Create simplified paths configuration
        paths_config = """# Simplified Path Configuration for roo-modes
# Compact, memorable directory structure

paths:
  # Core functionality
  modes: "modes"
  templates: "templates" 
  config: "config"
  
  # Development tools
  scripts: "scripts"
  tools: "tools"
  
  # Documentation
  docs: "docs"
  guides: "docs/guides"
  examples: "docs/examples"
  analysis: "docs/analysis"
  
  # Data and testing
  context_portal: "context_portal"
  test: "test"
  
# CLI Tool Shortcuts
tools:
  sync: "scripts/sync.py"              # Main sync tool
  sync_basic: "scripts/sync-basic.py"  # Basic sync
  test: "scripts/test.py"              # Test suite
  demo: "tools/demo.py"                # Demo tool
  order_config: "scripts/order.yaml"   # Ordering config
"""
        
        config_path = self.repo_root / "config/paths.yaml"
        if self.dry_run:
            self.log(f"DRY-RUN: Would create enhanced config: {config_path}")
        else:
            config_path.parent.mkdir(parents=True, exist_ok=True)
            with open(config_path, 'w') as f:
                f.write(paths_config)
            self.log(f"Created enhanced configuration: {config_path}")
            
        # Create CLI shortcuts documentation
        cli_doc = """# CLI Tool Shortcuts

The roo-modes project now uses shortened, memorable CLI tool names:

## Available Tools

### Main Tools
- `python scripts/sync.py` - Enhanced mode synchronization tool
- `python scripts/sync-basic.py` - Basic mode sync (legacy)
- `python scripts/test.py` - Test suite for sync functionality
- `python tools/demo.py` - YAML output format demo

### Configuration
- `scripts/order.yaml` - Mode ordering configuration

## Quick Commands

```bash
# Sync modes to global config
python scripts/sync.py

# Preview sync (dry run) 
python scripts/sync.py --dry-run

# Test sync functionality
python scripts/test.py

# Demo YAML output
python tools/demo.py

# List available modes
python scripts/sync.py --list-modes

# Validate configurations
python scripts/sync.py --validate-only
```

## Benefits of New Structure

- **Shorter commands**: `sync.py` instead of `sync_modes_to_global_config_enhanced.py`
- **Memorable paths**: `scripts/` and `tools/` instead of `tooling/scripts/`
- **Simplified structure**: `docs/` instead of `documentation/`
- **Easy navigation**: Top-level directories for common tasks
"""
        
        cli_doc_path = self.repo_root / "docs/CLI-SHORTCUTS.md"
        if self.dry_run:
            self.log(f"DRY-RUN: Would create CLI shortcuts doc: {cli_doc_path}")
        else:
            cli_doc_path.parent.mkdir(parents=True, exist_ok=True)
            with open(cli_doc_path, 'w') as f:
                f.write(cli_doc)
            self.log(f"Created CLI shortcuts documentation: {cli_doc_path}")
            
    def clean_up_old_structure(self):
        """Clean up empty directories from old structure"""
        self.log("Cleaning up empty directories...")
        
        # Directories that should be removed if empty
        cleanup_dirs = [
            "tooling/scripts",
            "tooling/tools", 
            "tooling",
            "core/modes",
            "core/templates",
            "core/config",
            "core",
            "data/context_portal", 
            "data",
            "documentation/guides",
            "documentation/examples",
            "documentation/analysis",
            "documentation"
        ]
        
        for dir_path in cleanup_dirs:
            full_path = self.repo_root / dir_path
            if full_path.exists() and full_path.is_dir():
                try:
                    # Only remove if empty
                    if not any(full_path.iterdir()):
                        if self.dry_run:
                            self.log(f"DRY-RUN: Would remove empty directory: {dir_path}")
                        else:
                            full_path.rmdir()
                            self.log(f"Removed empty directory: {dir_path}")
                except OSError:
                    # Directory not empty, that's fine
                    pass
                    
    def validate_new_structure(self):
        """Validate the new repository structure"""
        self.log("Validating new repository structure...")
        
        expected_structure = {
            "modes": "Mode definitions",
            "templates": "Mode templates", 
            "scripts": "CLI scripts",
            "tools": "Development tools",
            "docs": "Documentation",
            "docs/guides": "User guides",
            "docs/examples": "Usage examples", 
            "config": "Configuration files",
            "context_portal": "ConPort database",
            "test": "Test files"
        }
        
        all_valid = True
        for expected_path, description in expected_structure.items():
            full_path = self.repo_root / expected_path
            if full_path.exists():
                self.log(f"✓ {expected_path} - {description}")
            else:
                self.log(f"✗ Missing: {expected_path} - {description}", "ERROR")
                all_valid = False
                
        # Validate renamed tools
        expected_tools = ["sync.py", "test.py", "demo.py"]
        scripts_dir = self.repo_root / "scripts"
        tools_dir = self.repo_root / "tools"
        
        for tool in expected_tools:
            script_path = scripts_dir / tool
            tool_path = tools_dir / tool
            
            if script_path.exists() or tool_path.exists():
                location = "scripts" if script_path.exists() else "tools"
                self.log(f"✓ {tool} found in {location}/")
            else:
                self.log(f"✗ Missing tool: {tool}", "ERROR")
                all_valid = False
                
        return all_valid
        
    def generate_enhanced_report(self):
        """Generate comprehensive migration report"""
        self.log("\n" + "="*70)
        self.log("🎯 ENHANCED REPOSITORY REORGANIZATION REPORT")
        self.log("="*70)
        
        self.log(f"Migration mode: {'🔍 DRY-RUN' if self.dry_run else '🚀 LIVE'}")
        self.log(f"Files updated: {len(self.path_updates)}")
        self.log(f"Tools renamed: {len(self.files_renamed)}")
        
        if self.files_renamed:
            self.log("\n📝 Tool Renames (shorter CLI commands):")
            for old_path, new_path in self.files_renamed:
                old_name = Path(old_path).name
                new_name = Path(new_path).name
                self.log(f"  {old_name} → {new_name}")
                
        self.log("\n📁 New Directory Structure:")
        structure_map = {
            "modes/": "Mode definitions (was core/modes/)",
            "templates/": "Mode templates (was core/templates/)",
            "scripts/": "CLI scripts (was tooling/scripts/)",
            "tools/": "Development tools (was tooling/tools/)",
            "docs/": "Documentation (was documentation/)",
            "config/": "Configuration (was core/config/)",
            "context_portal/": "ConPort database (was data/context_portal/)",
            "test/": "Test files (was tests/)"
        }
        
        for new_path, description in structure_map.items():
            self.log(f"  {new_path:<20} {description}")
            
        self.log("\n🚀 Quick Command Examples:")
        commands = [
            "python scripts/sync.py                 # Sync modes",
            "python scripts/sync.py --dry-run       # Preview sync", 
            "python scripts/test.py                 # Run tests",
            "python tools/demo.py                   # Demo output",
            "python scripts/sync.py --list-modes    # List modes"
        ]
        
        for cmd in commands:
            self.log(f"  {cmd}")
            
    def execute_enhanced_migration(self):
        """Execute the complete enhanced migration process"""
        self.log(f"🚀 Starting enhanced repository reorganization ({'🔍 DRY-RUN' if self.dry_run else '🚀 LIVE MODE'})...")
        
        # Step 1: Analyze current structure
        unnecessary_dirs, empty_dirs = self.analyze_current_structure()
        
        # Step 2: Remove unnecessary directories
        self.remove_unnecessary_dirs(unnecessary_dirs)
        
        # Step 3: Create new structure
        self.create_new_structure()
        
        # Step 4: Move directories
        self.move_directories()
        
        # Step 5: Rename tools to shorter names
        self.rename_tools()
        
        # Step 6: Update all references
        self.update_all_references()
        
        # Step 7: Create enhanced configuration
        self.create_enhanced_config()
        
        # Step 8: Clean up old structure
        self.clean_up_old_structure()
        
        # Step 9: Validate new structure
        if not self.dry_run:
            if self.validate_new_structure():
                self.log("✅ Migration validation successful!", "SUCCESS")
            else:
                self.log("❌ Migration validation failed!", "ERROR")
                return False
                
        # Step 10: Generate report
        self.generate_enhanced_report()
        
        if not self.dry_run:
            self.log("\n🎉 Enhanced migration completed successfully!")
            self.log("\n📋 Next steps:")
            self.log("1. Test all scripts: python scripts/test.py")
            self.log("2. Try sync tool: python scripts/sync.py --dry-run")
            self.log("3. Commit changes: git add -A && git commit -m 'Enhanced repo reorganization'")
            self.log("4. Update external references to new structure")
        else:
            self.log("\n🔍 Dry-run completed. Use --execute to perform actual migration.")
            
        return True

def main():
    parser = argparse.ArgumentParser(description="Enhanced roo-modes repository reorganization")
    parser.add_argument("--dry-run", action="store_true", 
                       help="Preview changes without executing them")
    parser.add_argument("--execute", action="store_true",
                       help="Execute the migration (default is dry-run)")
    
    args = parser.parse_args()
    
    # Default to dry-run unless --execute is specified
    dry_run = not args.execute
    
    reorganizer = EnhancedRepositoryReorganizer(dry_run=dry_run)
    
    try:
        success = reorganizer.execute_enhanced_migration()
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⚠️ Migration interrupted by user")
        exit(1)
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        exit(1)

if __name__ == "__main__":
    main()