# Repository Reorganization Implementation Plan

## Project: roo-modes Structure Reorganization

### Current Analysis Complete
- **Dependencies identified**: 45 markdown references and 3 YAML references to current paths
- **Key areas affected**: Script documentation, installation guides, README files
- **No Python file dependencies**: All scripts use relative paths appropriately

### Migration Strategy

#### Phase 1: Structure Creation and File Movement
```
Current → New Structure:
├── modes/ → core/modes/
├── templates/ → core/templates/
├── scripts/ → tooling/scripts/
├── tools/ → tooling/tools/
├── docs/ → documentation/guides/
├── examples/ → documentation/examples/
├── analysis/ → documentation/analysis/
└── context_portal/ → data/context_portal/
```

#### Phase 2: Reference Updates Required

**High Priority Updates (functional impact):**
1. `scripts/mode_ordering_config.yaml` - Update script path references
2. `scripts/example_configs/README.md` - Update all script command examples
3. `scripts/README.md` - Update script paths and mode directory references
4. `README.md` - Update all file paths, installation commands, and directory structure

**Medium Priority Updates (documentation):**
1. `docs/local-mode-installation.md` - Update mode file paths in installation commands
2. `docs/configuration-sync-*.md` - Update mode file references
3. `examples/*.md` - Update file path references in examples
4. `templates/README.md` - Update path examples

#### Phase 3: Implementation Steps

1. **Create new directory structure**
2. **Move files systematically**:
   - `git mv modes core/modes`
   - `git mv templates core/templates`
   - `git mv scripts tooling/scripts`
   - `git mv tools tooling/tools`
   - `git mv docs documentation/guides`
   - `git mv examples documentation/examples`
   - `git mv analysis documentation/analysis`
   - `git mv context_portal data/context_portal`

3. **Update path references** in identified files
4. **Test functionality** - verify scripts work with new paths
5. **Update ConPort context** with new structure

### Migration Script Requirements

The migration script needs to:
- Create new directory structure
- Move files using git mv to preserve history
- Update all hardcoded path references
- Generate mapping report
- Validate completion

### Post-Migration Benefits

- **Logical grouping**: Core system files separated from tooling
- **Better navigation**: Documentation consolidated
- **Scalability**: Clear separation supports future growth
- **Maintenance**: Tooling centralized for easier updates

### Risk Mitigation

- All changes tracked via git
- Script provides dry-run option
- Complete backup before migration
- Rollback procedure documented

## Next Steps

1. Switch to Code mode to implement migration script
2. Execute migration with validation
3. Update ConPort with architectural decisions
4. Test all functionality post-migration