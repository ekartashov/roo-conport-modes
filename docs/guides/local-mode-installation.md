# Local Mode Installation Guide

## Overview

This guide explains how to install and use the local mode definitions from this repository in your Roo system. Local modes provide specialized functionality while maintaining version control and project-specific customization.

### Quick Start
```bash
# Copy modes to global configuration
cp core/modes/*.yaml ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/

# Or manually add to custom_modes.yaml
cat core/core/modes/prompt-enhancer.yaml >> ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/custom_modes.yaml

# Restart Roo to load new modes
# Switch to desired mode
/mode prompt-enhancer
```

## Installation

### Method 1: Direct Copy (Recommended)

```bash
# Navigate to your global Roo settings directory
cd ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/

# Backup existing configuration
cp custom_modes.yaml custom_modes.yaml.backup

# Copy local modes to global configuration
cat /path/to/roo-core/modes/core/core/modes/prompt-enhancer.yaml >> custom_modes.yaml
cat /path/to/roo-core/modes/core/core/modes/conport-maintenance.yaml >> custom_modes.yaml
```

### Method 2: Manual Integration

1. **Open Global Configuration**
   ```bash
   code ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/custom_modes.yaml
   ```

2. **Copy Mode Definitions**
   - Open each mode file in `core/modes/` directory
   - Copy the YAML content (excluding the outer `customModes:` wrapper if present)
   - Paste into the `customModes:` array in your global configuration

3. **Verify YAML Structure**
   ```yaml
   customModes:
     - slug: existing-mode-1
       name: Existing Mode
       # ... existing mode configuration
     
     - slug: prompt-enhancer
       name: 🪄 Prompt Enhancer
       # ... copied from core/core/modes/prompt-enhancer.yaml
     
     - slug: conport-maintenance
       name: 🗃️ ConPort Maintenance
       # ... copied from core/core/modes/conport-maintenance.yaml
   ```

### Method 3: Symlink (Advanced)

```bash
# Create symlinks for dynamic updates
ln -s /path/to/roo-core/modes/core/core/modes/prompt-enhancer.yaml ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/modes/
ln -s /path/to/roo-core/modes/core/core/modes/conport-maintenance.yaml ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/modes/

# Note: This method requires Roo support for mode directory scanning
```

## Usage

### Switching to Local Modes

```bash
# Prompt Enhancer mode
/mode prompt-enhancer

# ConPort Maintenance mode
/mode conport-maintenance
```

### Verifying Installation

```bash
# Test mode switching
/mode prompt-enhancer
"Hello, are you working correctly?"

# Check mode capabilities
/mode conport-maintenance
"Verify ConPort connectivity"
```

## Configuration

### Source Field Modification

When installing local modes, ensure the `source` field is correctly set:

```yaml
# Local development
source: local

# Production deployment
source: global
```

### Customization Options

#### Prompt Enhancer Customization

```yaml
customInstructions: >-
  # Add project-specific enhancement patterns
  **Project Context:** Working with [YOUR_FRAMEWORK] projects
  
  **Custom Templates:**
  - API Development: Include OpenAPI specification requirements
  - Frontend: Include accessibility and responsive design criteria
  - Backend: Include security and performance requirements
  
  # ... rest of original instructions
```

#### ConPort Maintenance Customization

```yaml
customInstructions: >-
  # Add organization-specific quality standards
  **Quality Standards:**
  - Target 40%+ knowledge graph connectivity for enterprise projects
  - Mandatory security scanning for financial data projects
  - Custom compliance requirements for [YOUR_INDUSTRY]
  
  # ... rest of original instructions
```

## Troubleshooting

### Common Installation Issues

**YAML Syntax Errors**
```bash
# Validate YAML syntax
python -c "import yaml; yaml.safe_load(open('custom_modes.yaml'))"

# Or use online YAML validators
```

**Mode Not Loading**
- Verify `slug` is unique across all modes
- Check that all required fields are present
- Ensure proper indentation in YAML
- Restart Roo after configuration changes

**Permission Denied Errors**
```bash
# Check file permissions
ls -la ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/

# Fix permissions if needed
chmod 644 ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/custom_modes.yaml
```

### Validation Steps

1. **Syntax Validation**
   ```bash
   # Test YAML parsing
   python -c "import yaml; print('Valid YAML' if yaml.safe_load(open('custom_modes.yaml')) else 'Invalid YAML')"
   ```

2. **Mode Loading Test**
   ```bash
   # Switch to each new mode
   /mode prompt-enhancer
   /mode conport-maintenance
   ```

3. **Functionality Test**
   ```bash
   # Test core functionality
   /mode prompt-enhancer
   "Enhance this prompt: Create a web app"
   
   /mode conport-maintenance
   "Check ConPort connectivity"
   ```

## Updates and Maintenance

### Updating Local Modes

```bash
# Pull latest changes from repository
cd /path/to/roo-modes
git pull origin main

# Re-copy updated modes
cp core/modes/*.yaml ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/

# Restart Roo to reload
```

### Version Control

```bash
# Track your customizations
cd ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/
git init
git add custom_modes.yaml
git commit -m "Add local modes from roo-modes repository"
```

### Backup Strategy

```bash
# Regular backups
cp custom_modes.yaml custom_modes.yaml.$(date +%Y%m%d)

# Or automated backup
crontab -e
# Add: 0 2 * * * cp ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/custom_modes.yaml ~/.config/VSCodium/User/globalStorage/rooveterinaryinc.roo-cline/settings/custom_modes.yaml.$(date +\%Y\%m\%d)
```

## Best Practices

### Development Workflow

1. **Local Testing**: Test modes in development environment first
2. **Incremental Deployment**: Install one mode at a time
3. **Documentation**: Keep local customizations documented
4. **Version Control**: Track configuration changes

### Team Collaboration

1. **Shared Repository**: Use this repository for team mode sharing
2. **Standardization**: Establish team conventions for mode customization
3. **Review Process**: Implement code review for mode changes
4. **Deployment**: Use consistent deployment process across team

### Maintenance Schedule

- **Weekly**: Check for mode updates in repository
- **Monthly**: Review and update local customizations
- **Quarterly**: Full configuration audit and cleanup