# Mode Engineer Path Updates Required

## Status
The Mode Engineer directory has been successfully moved from `utilities/mode-engineering/` to `utilities/frameworks/mode-engineer/`, but configuration files still reference the old path and need updates.

## Files Requiring Updates

### 1. modes/mode-engineer.yaml
**Lines requiring updates:**
- **Line 246:** Update utilities path reference
- **Line 253:** Update require statement example  
- **Line 274:** Update permissions edit path

**Required Changes:**

```yaml
# Line 246: Change from
Always use the Mode Engineering utilities located at `utilities/mode-engineering/`:

# To:
Always use the Mode Engineering utilities located at `utilities/frameworks/mode-engineer/`:

# Line 253: Change from  
const ModeEngineer = require('./utilities/mode-engineering');

# To:
const ModeEngineer = require('./utilities/frameworks/mode-engineer');

# Line 274: Change from
- utilities/mode-engineering/**/*

# To:
- utilities/frameworks/mode-engineer/**/*
```

### 2. Any other files with import references
Search for references to `utilities/mode-engineering` and update to `utilities/frameworks/mode-engineer`.

## Framework Integration Verification

After path updates, verify:
1. Mode Engineer properly loads from new location
2. Framework integrations (KDAP, AKAF, KSE, SIVS, AMO, CCF) still function
3. ConPort integration remains intact
4. All examples and documentation reflect correct paths

## Next Steps
1. Switch to Code mode to make the required file updates
2. Update the YAML configuration paths
3. Search for any other references to update
4. Test the corrected Mode Engineer functionality
5. Update ConPort with the completed architectural correction

## Architectural Compliance Achieved
✅ Mode Engineer now properly located in `utilities/frameworks/mode-engineer/`  
✅ Consistent with other autonomous frameworks (AKAF, AMO, CCF, KDAP, KSE, SIVS)  
✅ Follows established functional organization pattern  
✅ Maintains three-layer architecture (validation, core, integration)  
🔄 Configuration file updates pending (requires Code mode)