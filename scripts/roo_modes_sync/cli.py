#!/usr/bin/env python3
"""
Command Line Interface for Roo Modes Sync.

Provides a user-friendly interface for synchronizing Roo modes:
- Global mode application (system-wide configuration)
- Local mode application (project-specific configuration)
- Mode listing and status information
- MCP server functionality
"""

import argparse
import os
import sys
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional, Union

from .core.sync import ModeSync
from .exceptions import SyncError
from .mcp import run_mcp_server

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("roo_modes_cli")


def get_default_modes_dir() -> Path:
    """
    Get the default modes directory path.
    
    Returns:
        Path to the default modes directory
    """
    # Check for environment variable
    env_modes_dir = os.environ.get("ROO_MODES_DIR")
    if env_modes_dir:
        return Path(env_modes_dir)
        
    # Default location (relative to this file)
    script_dir = Path(__file__).resolve().parent
    return script_dir.parent.parent / "modes"


def sync_global(args: argparse.Namespace) -> int:
    """
    Synchronize modes to the global configuration.
    
    Args:
        args: Command line arguments
        
    Returns:
        Exit code (0 for success, non-zero for failure)
    """
    try:
        # Create sync object
        sync = ModeSync(args.modes_dir)
        
        # Set global config path if provided
        if args.config:
            sync.set_global_config_path(Path(args.config))
        else:
            sync.set_global_config_path()
            
        # Perform sync
        success = sync.sync_modes(
            strategy_name=args.strategy,
            options={},
            dry_run=args.dry_run
        )
        
        if success:
            config_path = sync.global_config_path
            action = "would be synchronized" if args.dry_run else "synchronized"
            print(f"Modes {action} to {config_path}")
            return 0
        else:
            print("Sync failed - no valid modes found or write error")
            return 1
            
    except SyncError as e:
        print(f"Error: {e}")
        return 1
    except Exception as e:
        print(f"Unexpected error: {e}")
        return 1


def sync_local(args: argparse.Namespace) -> int:
    """
    Synchronize modes to a local project directory.
    
    Args:
        args: Command line arguments
        
    Returns:
        Exit code (0 for success, non-zero for failure)
    """
    try:
        # Create sync object
        sync = ModeSync(args.modes_dir)
        
        # Set local project directory
        project_dir = Path(args.project_dir).resolve()
        sync.set_local_config_path(project_dir)
            
        # Perform sync
        success = sync.sync_modes(
            strategy_name=args.strategy,
            options={},
            dry_run=args.dry_run
        )
        
        if success:
            config_path = sync.local_config_path
            action = "would be synchronized" if args.dry_run else "synchronized"
            print(f"Modes {action} to {config_path}")
            return 0
        else:
            print("Sync failed - no valid modes found or write error")
            return 1
            
    except SyncError as e:
        print(f"Error: {e}")
        return 1
    except Exception as e:
        print(f"Unexpected error: {e}")
        return 1


def list_modes(args: argparse.Namespace) -> int:
    """
    List available modes and their status.
    
    Args:
        args: Command line arguments
        
    Returns:
        Exit code (0 for success, non-zero for failure)
    """
    try:
        # Create sync object
        sync = ModeSync(args.modes_dir)
        
        # Get sync status
        status = sync.get_sync_status()
        
        # Print status information
        print(f"Found {status['mode_count']} modes in {args.modes_dir}")
        print("\nCategories:")
        for category in status['categories']:
            print(f"  {category['icon']} {category['display_name']}: {category['count']} modes")
            
        print("\nModes:")
        for mode in status['modes']:
            valid_str = "✓" if mode['valid'] else "✗"
            print(f"  [{valid_str}] {mode['name']} ({mode['slug']}) - {mode['category']}")
            
        return 0
            
    except SyncError as e:
        print(f"Error: {e}")
        return 1
    except Exception as e:
        print(f"Unexpected error: {e}")
        return 1


def serve_mcp(args: argparse.Namespace) -> int:
    """
    Run as an MCP server.
    
    Args:
        args: Command line arguments
        
    Returns:
        Exit code (0 for success, non-zero for failure)
    """
    try:
        print(f"Starting MCP server with modes directory: {args.modes_dir}")
        run_mcp_server(args.modes_dir)
        return 0
    except Exception as e:
        print(f"Error running MCP server: {e}")
        return 1


def main() -> int:
    """
    Main CLI entry point.
    
    Returns:
        Exit code (0 for success, non-zero for failure)
    """
    # Create main parser
    parser = argparse.ArgumentParser(
        description="Roo Modes Sync - Synchronize Roo modes configuration"
    )
    
    # Add global arguments
    parser.add_argument(
        "--modes-dir", 
        type=Path,
        default=get_default_modes_dir(),
        help="Directory containing mode YAML files"
    )
    
    # Create subparsers for commands
    subparsers = parser.add_subparsers(
        dest="command",
        help="Command to execute"
    )
    subparsers.required = True
    
    # Sync global command
    sync_global_parser = subparsers.add_parser(
        "sync-global",
        help="Synchronize modes to global configuration"
    )
    sync_global_parser.add_argument(
        "--config",
        help="Path to global configuration file (overrides default)"
    )
    sync_global_parser.add_argument(
        "--strategy",
        default="strategic",
        help="Ordering strategy (strategic, alphabetical, etc.)"
    )
    sync_global_parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Don't write configuration file, just show what would be done"
    )
    sync_global_parser.set_defaults(func=sync_global)
    
    # Sync local command
    sync_local_parser = subparsers.add_parser(
        "sync-local",
        help="Synchronize modes to local project directory"
    )
    sync_local_parser.add_argument(
        "project_dir",
        help="Path to project directory"
    )
    sync_local_parser.add_argument(
        "--strategy",
        default="strategic",
        help="Ordering strategy (strategic, alphabetical, etc.)"
    )
    sync_local_parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Don't write configuration file, just show what would be done"
    )
    sync_local_parser.set_defaults(func=sync_local)
    
    # List command
    list_parser = subparsers.add_parser(
        "list",
        help="List available modes and their status"
    )
    list_parser.set_defaults(func=list_modes)
    
    # Serve MCP command
    serve_parser = subparsers.add_parser(
        "serve",
        help="Run as an MCP server"
    )
    serve_parser.set_defaults(func=serve_mcp)
    
    # Parse arguments
    args = parser.parse_args()
    
    # Run command function
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())