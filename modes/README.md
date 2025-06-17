# Mode Organization Structure

This directory contains different categories of Roo modes organized for clarity and proper usage.

## Directory Structure

### `/hybrid/` - Framework Repair Hybrid Modes
**Purpose**: Modes that combine multiple Phase 4 autonomous framework capabilities within single modes to overcome Roo's single-mode execution constraint.

**Current Hybrid Modes**:
- `code-kse-hybrid.yaml` - Code mode with embedded Knowledge Synthesis Engine capabilities

**Usage**: These modes provide enhanced capabilities by internally coordinating multiple frameworks while maintaining single-mode operation.

### `/original/` - Original Phase 4 Framework Modes  
**Purpose**: Original autonomous framework modes designed for concurrent multi-agent operation.

**Framework Modes**:
- `akaf.yaml` - Adaptive Knowledge Application Framework
- `amo.yaml` - Autonomous Mapping Orchestrator  
- `ccf.yaml` - Cognitive Continuity Framework
- `kdap.yaml` - Knowledge-Driven Autonomous Planning
- `kse.yaml` - Knowledge Synthesis Engine
- `sivs.yaml` - Self-Improving Validation System

**Status**: These modes have ~70% reduced effectiveness due to single-mode constraint but are preserved for reference and potential future concurrent implementation.

### `/` (Root) - Standard Operational Modes
**Purpose**: Standard Roo modes that work effectively within the single-mode constraint.

**Standard Modes**:
- `architect.yaml` - System architecture and design
- `ask.yaml` - Information queries and explanations
- `code.yaml` - Code writing and implementation
- `conport-maintenance.yaml` - ConPort database maintenance
- `debug.yaml` - Debugging and troubleshooting
- `docs.yaml` - Documentation creation and management
- `mode-engineer.yaml` - Mode creation and modification
- `mode-manager.yaml` - Interactive mode management
- `orchestrator.yaml` - Complex task coordination
- `prompt-enhancer.yaml` - Prompt optimization
- `prompt-enhancer-isolated.yaml` - Context-free prompt optimization

## Framework Repair Strategy

The hybrid modes in `/hybrid/` represent **Phase 1** of the framework repair strategy:
1. **Phase 0**: ✅ **File Organization** - Separate hybrid modes from originals
2. **Phase 1**: 🚧 **Enhanced Mode Integration** - Create hybrid modes with embedded framework capabilities
3. **Phase 2**: 📋 **Enhanced CCF** - Upgrade context preservation for framework coordination
4. **Phase 3**: 📋 **Coordination Layer** - ConPort-based framework coordination system  
5. **Phase 4**: 📋 **Multi-Framework Integration** - Advanced hybrid modes
6. **Phase 5**: 📋 **Validation and Optimization** - Performance tuning

## Usage Guidelines

### For Standard Development Tasks
Use modes from the root directory (`/`) - these are optimized for single-mode operation.

### For Complex Knowledge-Intensive Tasks  
Use hybrid modes from `/hybrid/` when you need advanced framework capabilities like knowledge synthesis, cross-domain pattern recognition, or complex knowledge integration.

### For Framework Research/Development
Reference original modes in `/original/` to understand framework design and capabilities, but prefer hybrid implementations for actual usage.

## Migration Path

As more hybrid modes are developed, they will be added to `/hybrid/` with clear documentation of their embedded framework capabilities and appropriate use cases.