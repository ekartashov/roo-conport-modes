# Advanced Setup and Technical Guide

> **New to this project? Start with [`SIMPLE_SETUP.md`](SIMPLE_SETUP.md) instead - it's much faster and easier!**

This document provides comprehensive technical details for users who need advanced configuration or want to understand the full system architecture.

## 🚦 Choose Your Path

### 🟢 **Just Want to Use It?** 
→ Go to [`SIMPLE_SETUP.md`](SIMPLE_SETUP.md) for a 5-minute setup

### 🟡 **Want to Understand How It Works?**
→ Read [`HOW_IT_WORKS.md`](HOW_IT_WORKS.md) for a technical overview without jargon

### 🟠 **Need to Customize or Extend?**
→ Check [`CUSTOMIZATION_GUIDE.md`](CUSTOMIZATION_GUIDE.md) for modification instructions

### 🔴 **Advanced User Needing Full Control?**
→ Continue reading this document for complete technical details

---

## 🔧 Advanced Configuration Details

This section covers advanced setup scenarios, custom configurations, and detailed technical implementation for power users who need full control over the system.

### Advanced ConPort Configuration

ConPort (the knowledge database) can be customized for specific enterprise or development workflows:

#### Custom Database Location
```bash
# Set custom ConPort location via environment variable
export CONPORT_DB_PATH="/custom/path/to/context_portal/"
```

#### Advanced Knowledge Management
```yaml
# Advanced ConPort configuration (create as conport-config.yaml)
knowledge_management:
  decision_retention: "permanent"  # or "30_days", "1_year"
  pattern_recognition: "enhanced"  # or "basic", "disabled"
  cross_project_learning: true
  semantic_search: true
  knowledge_graph_depth: 3
```

#### Enterprise Integration
```bash
# Integration with enterprise knowledge systems
CONPORT_ENTERPRISE_MODE=true
CONPORT_SSO_PROVIDER="azure_ad"  # or "okta", "custom"
CONPORT_BACKUP_SCHEDULE="daily"
```

### Advanced Mode Configuration

#### Custom Utility Integration
For modes that need custom JavaScript utilities:

```yaml
# In your mode YAML file
customInstructions: |
  Utility Integration:
  - Load custom utilities from: utilities/custom/my-domain-utils.js
  - Use enhanced validation: utilities/custom/my-validation.js
  - Apply domain patterns: utilities/custom/my-patterns.js

utilityPaths:
  - "utilities/custom/my-domain-utils.js"
  - "utilities/core/knowledge-first-guidelines.js"
  - "utilities/frameworks/kse/kse-core.js"
```

#### Framework-Level Customization
Advanced users can modify the underlying frameworks:

```javascript
// Custom KSE configuration
// File: utilities/custom/kse-custom-config.js
module.exports = {
  synthesis_depth: 5,
  pattern_matching: "advanced",
  cross_domain_learning: true,
  custom_knowledge_sources: [
    "enterprise_documentation",
    "team_wikis", 
    "previous_projects"
  ]
};
```

### Multi-Project Workspace Configuration

For users managing multiple projects with different mode configurations:

#### Project-Specific Modes
```bash
# Directory structure for multi-project setup
~/.config/VSCode/projects/
├── project-a/
│   ├── modes/
│   └── conport-config.yaml
├── project-b/
│   ├── modes/
│   └── conport-config.yaml
└── shared/
    ├── modes/
    └── utilities/
```

#### Workspace Detection
```yaml
# Automatic workspace detection configuration
workspace_detection:
  method: "git_root"  # or "package_json", "custom_marker"
  fallback_to_shared: true
  inherit_from_parent: false
```

### Performance Optimization

#### Large Codebase Optimization
```yaml
# Performance tuning for large projects
performance:
  file_indexing: "selective"  # or "full", "disabled"
  pattern_cache_size: "10MB"
  knowledge_retention: "smart_cleanup"
  response_time_target: "2s"
```

#### Resource Management
```bash
# Environment variables for resource control
CONPORT_MAX_MEMORY="512MB"
CONPORT_CACHE_STRATEGY="aggressive"  # or "conservative", "minimal"
CONPORT_PARALLEL_PROCESSING=true
```

### Security and Compliance

#### Enterprise Security Configuration
```yaml
# Security configuration for enterprise environments
security:
  data_encryption: "AES-256"
  knowledge_isolation: true
  audit_logging: true
  pii_detection: true
  data_retention_policy: "company_standard"
```

#### Compliance Settings
```yaml
compliance:
  gdpr_mode: true
  data_residency: "eu"  # or "us", "apac", "local"
  audit_trail: "comprehensive"
  data_export_format: "standard"
```

### Advanced Testing and Validation

#### Comprehensive Test Suite
```bash
# Run full test suite with advanced validation
cd scripts/
python run_comprehensive_tests.py --include-performance --include-security
```

#### Custom Validation Rules
```javascript
// Custom validation rules for enterprise environments
// File: utilities/custom/enterprise-validation.js
module.exports = {
  validateDecisions: (decision) => {
    // Custom business logic validation
    return decision.hasApproval && decision.meetsComplianceStandards;
  },
  validatePatterns: (pattern) => {
    // Custom pattern validation
    return pattern.isSecure && pattern.followsArchitectureGuidelines;
  }
};
```

### Integration with External Systems

#### CI/CD Integration
```yaml
# GitHub Actions workflow for mode validation
name: Validate Roo Modes
on: [push, pull_request]
jobs:
  validate-modes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Validate Mode Configurations
        run: python scripts/validate_modes.py
      - name: Test ConPort Integration
        run: python scripts/test_conport_integration.py
```

#### Monitoring and Analytics
```yaml
# Advanced monitoring configuration
monitoring:
  mode_usage_analytics: true
  performance_metrics: true
  knowledge_growth_tracking: true
  user_satisfaction_metrics: true
  integration_with: "prometheus"  # or "datadog", "custom"
```

### Backup and Recovery

#### Automated Backup Configuration
```bash
# Automated ConPort backup script
#!/bin/bash
# File: scripts/backup_conport.sh
BACKUP_DIR="/backup/conport/$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"
cp -r context_portal/ "$BACKUP_DIR/"
echo "Backup completed: $BACKUP_DIR"
```

#### Recovery Procedures
```bash
# ConPort recovery from backup
python scripts/conport_recovery.py --backup-path="/backup/conport/20231215" --verify-integrity
```

### Development and Debugging

#### Debug Mode for Development
```bash
# Enable debug mode for development
export ROO_MODES_DEBUG=true
export CONPORT_VERBOSE_LOGGING=true
export UTILITY_TRACE_EXECUTION=true
```

#### Advanced Logging Configuration
```yaml
# Advanced logging for troubleshooting
logging:
  level: "debug"  # or "info", "warn", "error"
  format: "structured"  # or "simple", "json"
  output: ["file", "console", "syslog"]
  rotation: "daily"
  retention: "30_days"
```

### Migration and Upgrades

#### Version Migration
```bash
# Migrate from previous versions
python scripts/migrate_configuration.py --from-version="1.0" --to-version="2.0"
```

#### Schema Updates
```bash
# Update ConPort database schema
python scripts/update_conport_schema.py --backup-first --verify-migration
```

---

## 🛠️ Advanced Troubleshooting

### Performance Issues
```bash
# Performance analysis tools
python scripts/analyze_performance.py --profile-modes --check-memory-usage
```

### Knowledge Consistency Issues
```bash
# ConPort consistency check and repair
python scripts/conport_maintenance.py --check-consistency --repair-if-needed
```

### Advanced Diagnostics
```bash
# Comprehensive system diagnostics
python scripts/system_diagnostics.py --full-report --include-recommendations
```

---

## 📚 Advanced Documentation

### Technical Architecture
- [`docs/analysis/sync-system-package-design.md`](docs/analysis/sync-system-package-design.md) - Detailed system architecture
- [`docs/frameworks/`](docs/frameworks/) - Framework implementation details
- [`utilities/advanced/README.md`](utilities/advanced/README.md) - Advanced utilities documentation

### Development Guidelines
- [`docs/guides/universal-mode-enhancement-framework.md`](docs/guides/universal-mode-enhancement-framework.md) - Framework development
- [`docs/phases/`](docs/phases/) - Historical development phases
- [`templates/`](templates/) - Advanced mode templates

---

## 🎯 For Most Users

**Remember:** This advanced guide is for power users with specific technical requirements. 

**For typical usage**, the simplified guides provide everything you need:
- [`SIMPLE_SETUP.md`](SIMPLE_SETUP.md) - Quick setup
- [`WHAT_EACH_MODE_DOES.md`](WHAT_EACH_MODE_DOES.md) - Understanding modes
- [`COMMON_WORKFLOWS.md`](COMMON_WORKFLOWS.md) - Usage patterns
- [`HOW_IT_WORKS.md`](HOW_IT_WORKS.md) - Technical overview

The advanced configuration in this document is optional and only needed for enterprise deployments, custom integrations, or specialized development workflows.