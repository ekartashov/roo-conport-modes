# Mode Groupings Examples

This directory contains example configuration files that demonstrate different ways to select and combine modes for specific workflows and use cases. Each configuration showcases how to leverage the GroupingsOrderingStrategy to create targeted mode selections.

## Available Configurations

### 🚀 **Minimal Workflow** (`minimal-workflow.yaml`)
**Purpose**: Essential modes for straightforward development without complexity
- **Modes**: `code`, `debug`, `ask`
- **Best For**: Personal projects, learning, simple bug fixes
- **Characteristics**: Fast switching, low overhead, direct problem-solving

### 🏢 **Enterprise Workflow** (`enterprise-workflow.yaml`)
**Purpose**: Comprehensive enterprise development with advanced hybrid capabilities
- **Modes**: `architect-kdap-hybrid`, `orchestrator-ccf-hybrid`, `code-kse-hybrid`, `debug-sivs-hybrid`, `docs-amo-hybrid`, `mode-engineer`, `ask`
- **Best For**: Large-scale systems, distributed teams, systematic knowledge management
- **Characteristics**: Advanced validation, cognitive continuity, comprehensive documentation

### 🔬 **Hybrid Research Workflow** (`hybrid-research-workflow.yaml`)
**Purpose**: R&D projects with knowledge synthesis and pattern discovery
- **Modes**: `code-kse-hybrid`, `architect-kdap-hybrid`, `docs-amo-hybrid`, `ask`, `debug-sivs-hybrid`, `mode-engineer`
- **Best For**: Cross-domain research, experimental architecture, pattern discovery
- **Characteristics**: Knowledge synthesis, autonomous mapping, experimental validation

### ⚡ **Rapid Prototyping Workflow** (`rapid-prototyping-workflow.yaml`)
**Purpose**: Fast iteration and quick validation of ideas
- **Modes**: `code`, `debug`, `ask`, `architect`, `docs`
- **Best For**: MVPs, hackathons, proof-of-concepts, startup development
- **Characteristics**: Minimal overhead, fast cycles, lightweight planning

### 📚 **Documentation-Focused Workflow** (`documentation-focused-workflow.yaml`)
**Purpose**: Comprehensive documentation with relationship mapping
- **Modes**: `docs-amo-hybrid`, `ask`, `architect-kdap-hybrid`, `code-kse-hybrid`, `debug-sivs-hybrid`, `mode-engineer`
- **Best For**: API documentation, knowledge bases, technical writing
- **Characteristics**: Relationship discovery, cross-referential systems, knowledge graphs

### 🐛 **Debugging Specialist Workflow** (`debugging-specialist-workflow.yaml`)
**Purpose**: Complex debugging with multi-dimensional validation
- **Modes**: `debug-sivs-hybrid`, `code-kse-hybrid`, `architect-kdap-hybrid`, `ask`, `docs-amo-hybrid`, `mode-engineer`
- **Best For**: Complex system debugging, performance optimization, security investigation
- **Characteristics**: Multi-dimensional validation, systematic improvement, custom tooling

### 🎭 **Advanced Orchestration Workflow** (`orchestration-workflow.yaml`)
**Purpose**: Master coordination for complex multi-mode projects
- **Modes**: `orchestrator-ccf-hybrid`, `mode-engineer`, `architect-kdap-hybrid`, `code-kse-hybrid`, `debug-sivs-hybrid`, `docs-amo-hybrid`, `ask`
- **Best For**: Large-scale coordination, long-term projects, strategic transformation
- **Characteristics**: Complete hybrid ecosystem, cognitive continuity, strategic coordination

### 🎓 **Learning-Focused Workflow** (`learning-workflow.yaml`)
**Purpose**: Educational scenarios and skill development
- **Modes**: `ask`, `architect-kdap-hybrid`, `code`, `debug`, `docs-amo-hybrid`, `code-kse-hybrid`
- **Best For**: Learning new technologies, technical education, onboarding
- **Characteristics**: Guided exploration, systematic knowledge building, relationship discovery

## Legacy Configurations

### **Essential Workflow** (`essential-workflow.yaml`)
Classic essential development modes
- **Modes**: `code`, `debug`, `architect`, `ask`

### **Full Development Cycle** (`full-development-cycle.yaml`)
Complete development lifecycle with all core modes
- **Modes**: `architect`, `code`, `debug`, `docs`, `ask`, `orchestrator`

### **Specialized Workflows** (`specialized-workflows.yaml`)
Task-specific mode combinations
- Multiple groupings for different specialized tasks

## Mode Categories Overview

### **Core Modes (6)**
- `💻 code` - Implementation specialist with knowledge management
- `🪲 debug` - Debugging specialist with systematic knowledge capture
- `🏗️ architect` - System architect with integrated knowledge management
- `❓ ask` - Knowledge consultant for conceptual questions
- `📝 docs` - Technical documentation specialist
- `🪃 orchestrator` - Strategic workflow orchestrator

### **Hybrid Modes (5)**
- `🏗️🧠 architect-kdap-hybrid` - Architecture + Knowledge-Driven Autonomous Planning
- `💻⚛️ code-kse-hybrid` - Code + Knowledge Synthesis Engine
- `🪲🛡️ debug-sivs-hybrid` - Debug + Self-Improving Validation System
- `📝🗺️ docs-amo-hybrid` - Docs + Autonomous Mapping Orchestrator
- `🪃🔄 orchestrator-ccf-hybrid` - Orchestrator + Cognitive Continuity Framework

### **Specialized Modes (1)**
- `🏗️ mode-engineer` - Meta-mode for creating and managing other modes

## Usage Examples

### Apply a specific workflow:
```bash
python -m scripts.roo_modes_sync --config examples/mode-groupings/enterprise-workflow.yaml
```

### Create custom workflow:
```yaml
name: "My Custom Workflow"
description: "Tailored mode selection for my specific needs"
strategy: "GroupingsOrderingStrategy"

groupings:
  my_core_group:
    modes:
      - code-kse-hybrid
      - debug-sivs-hybrid
      - ask
    description: "My essential modes with hybrid capabilities"
```

## Choosing the Right Configuration

### **For Beginners**: Start with `minimal-workflow.yaml` or `learning-workflow.yaml`
### **For Teams**: Use `enterprise-workflow.yaml` or `full-development-cycle.yaml`
### **For Research**: Try `hybrid-research-workflow.yaml`
### **For Speed**: Use `rapid-prototyping-workflow.yaml`
### **For Documentation**: Use `documentation-focused-workflow.yaml`
### **For Complex Projects**: Use `orchestration-workflow.yaml`

Each configuration is designed to optimize mode selection for specific scenarios while leveraging the system's advanced hybrid capabilities and knowledge management features.