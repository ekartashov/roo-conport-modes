# Clean Reorganization Plan - Roo Modes Collection

## Overview

This is a **continuation of existing standardization work** (ConPort Decision #85), not a complete restructure. The project has solid architecture - we're just cleaning up inconsistencies and applying established patterns consistently.

## Current State Analysis

### ✅ Well-Organized (No Changes Needed)
- `modes/` - Core mode definitions (16 YAML files)
- `templates/` - Mode templates (5 template files)
- `scripts/` - Sync system with proper Python package structure
- `tools/` - Demo tools
- `tests/` - Centralized testing
- `context_portal/` - ConPort database
- `utilities/phase-4/` - Already follows three-layer architecture

### 🔄 Areas Needing Clean Organization

#### 1. Documentation Consolidation
**Problem**: Documentation scattered across multiple levels
```
Current:
docs/*.md (19 loose files)
docs/guides/ (sparse)
docs/examples/ (incomplete)
docs/analysis/ (exists)
docs/phase-*/ (exists)
examples/ (separate directory)

Target:
docs/
├── guides/ (all how-to guides)
├── examples/ (all usage examples)  
├── analysis/ (all design docs)
└── phases/ (phase-specific docs)
```

**Actions**:
- Move `docs/*.md` files to appropriate subdirectories based on content type
- Merge `examples/` content into `docs/examples/`
- Rename `docs/phase-*` to `docs/phases/phase-*` for consistency
- Remove empty `examples/` directory

#### 2. Core Utilities Organization
**Problem**: 7 loose utility files at root level of `utilities/`
```
Current:
utilities/
├── conport-validation-manager.js
├── data-locality-detector.js
├── knowledge-first-guidelines.js
├── knowledge-first-initialization.js
├── knowledge-metrics-dashboard.js
├── knowledge-source-classifier.js
├── validation-checkpoints.js
└── mode-enhancements/

Target:
utilities/
├── core/ (moved loose utilities)
├── enhancements/ (renamed from mode-enhancements)
├── phase-1/
├── phase-2/
├── phase-3/
└── phase-4/
```

**Actions**:
- Create `utilities/core/` directory
- Move 7 loose `.js` files to `utilities/core/`
- Rename `utilities/mode-enhancements/` to `utilities/enhancements/`

#### 3. Phase 2-3 Standardization
**Problem**: Some Phase 2-3 components don't follow three-layer architecture
**Actions**: Continue standardization work from Decision #85

## Implementation Steps

### Phase 1: Documentation Consolidation
1. Analyze content of `docs/*.md` files to categorize them
2. Move guides to `docs/guides/`
3. Move examples to `docs/examples/`
4. Move analysis to `docs/analysis/`
5. Move phase docs to `docs/phases/`
6. Merge `examples/` into `docs/examples/`
7. Update any file references

### Phase 2: Utilities Organization
1. Create `utilities/core/`
2. Move loose utility files
3. Rename `mode-enhancements` to `enhancements`
4. Update any import references

### Phase 3: Continue Standardization
1. Apply three-layer architecture to remaining Phase 2-3 components
2. Ensure all components have index.js, README.md, tests/
3. Update ConPort entries with new paths

## File Categorization

### Documentation Files to Move

#### To `docs/guides/`:
- `docs/ask-mode-enhancements.md`
- `docs/code-mode-enhancements.md`
- `docs/conport-maintenance-mode-enhancements.md`
- `docs/conport-validation-checkpoints.md`
- `docs/conport-validation-strategy.md`
- `docs/debug-mode-enhancements.md`
- `docs/docs-mode-enhancements.md`
- `docs/knowledge-first-initialization-guide.md`
- `docs/orchestrator-mode-enhancements.md`
- `docs/prompt-enhancer-mode-enhancements.md`

#### To `docs/analysis/`:
- `docs/sync-system-diagnostic-strategy.md`
- `docs/sync-system-package-design.md`
- `docs/sync-system-tdd-strategy.md`
- `docs/sync-system-validation-enhancement.md`

#### To `docs/phases/`:
- `docs/phase-2-mode-enhancements-plan.md`
- `docs/phase-3-advanced-knowledge-management-plan.md`
- `docs/phase-3.5-executive-summary.md`
- `docs/phase-3.5-sync-system-fix-plan.md`
- `docs/phase-4-plan.md`

#### Keep in Root:
- `docs/README.md`
- `docs/CLI-SHORTCUTS.md`

### Core Utilities to Move to `utilities/core/`:
- `utilities/conport-validation-manager.js`
- `utilities/data-locality-detector.js`
- `utilities/knowledge-first-guidelines.js`
- `utilities/knowledge-first-initialization.js`
- `utilities/knowledge-metrics-dashboard.js`
- `utilities/knowledge-source-classifier.js`
- `utilities/validation-checkpoints.js`

## Benefits

1. **Clearer Navigation**: All documentation properly categorized
2. **Consistent Architecture**: Three-layer pattern applied throughout
3. **Maintained Functionality**: No breaking changes to working systems
4. **ConPort Continuity**: Builds on existing standardization work
5. **Developer Experience**: Easier to find and understand components

## Risk Mitigation

- All changes use `git mv` to preserve history
- Update import/require statements incrementally
- Test functionality after each phase
- Document all changes in ConPort
- Minimal disruption to working components

## Success Criteria

- All documentation properly categorized and findable
- All utilities follow consistent organizational patterns
- All components have required standard files (index.js, README.md, tests/)
- No broken imports or references
- ConPort entries updated with new paths
- Improved developer navigation experience