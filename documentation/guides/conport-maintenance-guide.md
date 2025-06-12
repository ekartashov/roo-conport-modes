# ConPort Maintenance Mode Guide

## Overview

The ConPort Maintenance mode (`🗃️ ConPort Maintenance`) specializes in maintaining high-quality project knowledge management systems through ConPort database operations. This mode focuses on data auditing, cleanup, optimization, and strategic relationship building to enhance AI agent effectiveness.

### Quick Start
```bash
# Switch to ConPort Maintenance mode
/mode conport-maintenance

# Start with workspace connectivity check
"Audit the current ConPort database for data quality issues"

# Follow maintenance workflows
"Perform weekly maintenance cycle"
```

## Installation

The ConPort Maintenance mode is available in this local modes collection. To use it:

1. Ensure ConPort MCP server is configured and running
2. Copy the mode configuration to your global modes file
3. Restart Roo to load the new mode
4. Switch using `/mode conport-maintenance`

## Usage

### Core Maintenance Operations

#### Data Quality Management
- **Audit Process**: Systematic review of ConPort database contents
- **Duplicate Detection**: Identify and consolidate redundant information
- **Outdated Content**: Remove or archive obsolete decisions and progress
- **Sensitive Data Scanning**: Ensure no confidential information exposure

#### Knowledge Graph Optimization
- **Relationship Building**: Create strategic links between ConPort items
- **Connectivity Analysis**: Measure and improve knowledge graph density
- **Semantic Clustering**: Group related decisions, patterns, and progress
- **Cross-Reference Validation**: Ensure consistency across linked items

#### Security & Compliance
- **Data Boundary Enforcement**: Maintain proper information isolation
- **Access Pattern Analysis**: Review ConPort usage patterns
- **Sensitive Content Removal**: Clean up accidentally stored secrets
- **Compliance Verification**: Ensure data governance standards

### Maintenance Cycles

#### Weekly Maintenance (60 minutes)
```bash
# Progress validation and new relationships
"Perform weekly ConPort maintenance cycle"

# The mode will:
# 1. Validate recent progress entries
# 2. Identify new relationship opportunities
# 3. Conduct security scan
# 4. Update knowledge graph connectivity
```

#### Monthly Maintenance (2 hours)
```bash
# Decision relevance and pattern coverage
"Perform monthly ConPort optimization"

# The mode will:
# 1. Review decision relevance and impact
# 2. Analyze system pattern coverage
# 3. Optimize caching strategies
# 4. Consolidate related information
```

#### Quarterly Maintenance (4 hours)
```bash
# Historical archival and full optimization
"Perform quarterly ConPort overhaul"

# The mode will:
# 1. Archive historical data
# 2. Consolidate duplicate entries
# 3. Full knowledge graph optimization
# 4. Performance tuning and cleanup
```

## Configuration

### Mode Structure

```yaml
slug: conport-maintenance
name: 🗃️ ConPort Maintenance
roleDefinition: ConPort database specialist for quality management
whenToUse: ConPort maintenance, auditing, and optimization tasks
customInstructions: Maintenance procedures and quality standards
groups:
  - read    # Access to all project files for context
  - edit    # Modify documentation and config files
  - command # Execute maintenance scripts
  - mcp     # Full ConPort MCP integration
source: local
```

### Quality Standards

- **Knowledge Graph Connectivity**: Target 30%+ for mature projects
- **Data Sensitivity**: Zero tolerance for exposed sensitive information
- **Documentation Alignment**: 100% consistency between docs and implementation
- **Information Depth**: Actionable for AI agents without cluttering

### Standard Operating Procedures

1. **Workspace Identification**: Always verify ConPort connectivity first
2. **Progressive Analysis**: Core contexts → recent activity → historical data
3. **Impact Prioritization**: Focus on high-impact, low-effort improvements
4. **Audit Trail Maintenance**: Document all cleanup decisions
5. **Agent Effectiveness**: Optimize for AI agent knowledge retrieval

## Examples

### Data Quality Audit

```bash
# Input
"Audit ConPort database for quality issues"

# Mode Process:
# 1. Connects to ConPort MCP
# 2. Analyzes product/active contexts
# 3. Reviews recent decisions and progress
# 4. Identifies duplicates, outdated content
# 5. Scans for sensitive data exposure
# 6. Generates quality report with recommendations
```

### Knowledge Graph Optimization

```bash
# Input
"Optimize ConPort knowledge graph connectivity"

# Mode Process:
# 1. Analyzes current relationship density
# 2. Identifies potential new connections
# 3. Creates strategic links between items
# 4. Measures connectivity improvements
# 5. Documents relationship rationale
# 6. Updates graph metrics
```

### Security Scan

```bash
# Input
"Scan ConPort for sensitive data exposure"

# Mode Process:
# 1. Searches for common sensitive patterns
# 2. Reviews custom data for credentials
# 3. Checks decision rationale for secrets
# 4. Validates data boundary compliance
# 5. Generates security report
# 6. Provides cleanup recommendations
```

### Relationship Building

```bash
# Input
"Build strategic relationships between ConPort items"

# Mode Process:
# 1. Analyzes unlinked decisions and patterns
# 2. Identifies implementation relationships
# 3. Maps decision-to-progress connections
# 4. Creates semantic clustering
# 5. Validates relationship accuracy
# 6. Documents relationship types
```

## Troubleshooting

### Common Issues

**ConPort MCP Connection Failed**
- Verify ConPort server is running and accessible
- Check workspace ID configuration
- Ensure MCP permissions are properly configured
- Restart ConPort server if connection timeout occurs

**Data Quality Issues Not Detected**
- Run full audit cycle instead of quick scan
- Check if ConPort database has sufficient data
- Verify audit criteria match project requirements
- Review quality standards configuration

**Knowledge Graph Optimization Slow**
- Large databases may require incremental processing
- Use progressive analysis approach
- Focus on recent data first, then historical
- Consider quarterly maintenance for full optimization

**Sensitive Data False Positives**
- Review and update sensitive data patterns
- Configure project-specific exclusions
- Validate scan results manually
- Update detection algorithms based on project context

### Validation Framework

#### Pre-Maintenance Checklist
- [ ] ConPort MCP connectivity verified
- [ ] Workspace ID correctly identified
- [ ] Backup of current ConPort state available
- [ ] Maintenance scope and objectives defined

#### Post-Maintenance Validation
- [ ] All ConPort operations completed successfully
- [ ] Knowledge graph connectivity metrics improved
- [ ] No sensitive data exposure detected
- [ ] Audit trail properly documented
- [ ] Agent effectiveness measurements updated

#### Quality Metrics Tracking
- [ ] Relationship density percentage calculated
- [ ] Duplicate elimination count recorded
- [ ] Security scan results documented
- [ ] Performance improvement measurements taken
- [ ] User satisfaction with AI agent effectiveness assessed

### Performance Optimization

**Token Efficiency Strategies**
- Use targeted queries instead of full data dumps
- Implement progressive analysis workflows
- Cache frequently accessed ConPort data
- Batch related operations together

**Maintenance Scheduling**
- Align maintenance cycles with project milestones
- Perform heavy operations during low-activity periods
- Use incremental updates instead of full rebuilds
- Monitor ConPort database size and performance

**Integration Best Practices**
- Coordinate with other modes using ConPort
- Maintain consistency across mode interactions
- Document maintenance decisions for future reference
- Establish governance frameworks for team usage