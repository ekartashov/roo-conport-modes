# File Organization Guide

> **New to this project? You probably want [`SIMPLE_SETUP.md`](SIMPLE_SETUP.md) or [`HOW_IT_WORKS.md`](HOW_IT_WORKS.md) instead!**

This is a comprehensive technical guide to the project's file structure and architecture. Most users don't need this level of detail.

## 🚦 Choose Your Path

### 🟢 **Just Getting Started?**
→ [`SIMPLE_SETUP.md`](SIMPLE_SETUP.md) - Get going in 5 minutes

### 🟡 **Want to Understand the Basics?** 
→ [`HOW_IT_WORKS.md`](HOW_IT_WORKS.md) - Simple technical overview

### 🟠 **Ready to Customize?**
→ [`CUSTOMIZATION_GUIDE.md`](CUSTOMIZATION_GUIDE.md) - Modify or create modes

### 🔴 **Need Complete Technical Architecture?**
→ Continue reading for full file organization details

---

## 📁 Quick File Reference

**For typical users, you only need to know about:**

- **[`modes/`](modes/)** - The YAML files you copy to get enhanced AI capabilities
- **[`README.md`](README.md)** - Project overview and navigation
- **[`SIMPLE_SETUP.md`](SIMPLE_SETUP.md)** - Quick setup guide

**Everything else is advanced/internal:**

- **[`utilities/`](utilities/)** - JavaScript code that powers the enhancements (you don't need to touch this)
- **[`docs/`](docs/)** - Technical documentation for developers
- **[`context_portal/`](context_portal/)** - Knowledge database (created automatically)

---

## 🏗️ **Complete Technical Architecture**

*This section is for developers, contributors, and advanced users who need to understand the full system.*

### Project Structure Overview

```
roo-conport-modes/
├── 📁 USER-FACING COMPONENTS
│   ├── modes/                    # ← What users copy to get enhanced AI
│   ├── README.md                 # ← Project overview and navigation  
│   ├── SIMPLE_SETUP.md           # ← 5-minute setup guide
│   ├── WHAT_EACH_MODE_DOES.md    # ← Plain English mode explanations
│   ├── COMMON_WORKFLOWS.md       # ← Usage examples and patterns
│   ├── HOW_IT_WORKS.md           # ← Technical overview without jargon
│   ├── CUSTOMIZATION_GUIDE.md    # ← How to modify or create modes
│   ├── FAQ.md                    # ← Common questions and answers
│   └── TROUBLESHOOTING.md        # ← Problem-solving guide
│
├── 📁 ADVANCED/TECHNICAL COMPONENTS  
│   ├── utilities/                # ← JavaScript code that powers enhancements
│   ├── docs/                     # ← Technical documentation and guides
│   ├── templates/               # ← Mode creation templates
│   ├── context_portal/          # ← Knowledge database (auto-created)
│   ├── scripts/                 # ← Development and testing scripts
│   ├── tools/                   # ← Development utilities
│   ├── tests/                   # ← Validation and testing suites
│   ├── NEWCOMER_WALKTHROUGH.md   # ← Advanced technical setup guide
│   └── FILE_ORGANIZATION_GUIDE.md # ← This file
```

### Layer Architecture

The system follows a **Three-Layer Enhancement Architecture**:

#### 1. User Interface Layer
**Files users interact with:**
- **Mode definitions** (`modes/*.yaml`) - Define AI behavior and capabilities
- **Setup guides** (`SIMPLE_SETUP.md`, etc.) - Human-readable instructions
- **Documentation** (`README.md`, `FAQ.md`, etc.) - User guidance and help

#### 2. Enhancement Layer  
**Files that power the enhanced capabilities:**
- **Core utilities** (`utilities/core/`) - Fundamental enhancement functions
- **Framework implementations** (`utilities/frameworks/`) - Advanced AI capabilities
- **Advanced integration** (`utilities/advanced/`) - Coordination and optimization

#### 3. Knowledge Layer
**Files that manage persistent knowledge:**
- **ConPort database** (`context_portal/context.db`) - Stores decisions, patterns, progress
- **Knowledge utilities** (embedded in enhancement layer) - Manage knowledge operations
- **Export/import tools** (in utilities) - Knowledge backup and migration

---

## 📂 Detailed Directory Breakdown

### Core User Files

#### Mode Definitions (`modes/`)
```
modes/
├── architect.yaml              # System design and planning AI behavior
├── code.yaml                   # Programming and development AI behavior  
├── debug.yaml                  # Troubleshooting and diagnostic AI behavior
├── docs.yaml                   # Documentation creation AI behavior
├── ask.yaml                    # Research and Q&A AI behavior
├── orchestrator.yaml           # Workflow coordination AI behavior
├── conport-maintenance.yaml    # Knowledge database management
├── mode-engineer.yaml          # Mode creation and modification
├── mode-manager.yaml           # Mode configuration management
└── hybrid/                     # Advanced combined-capability modes
    ├── code-kse-hybrid.yaml           # Code + Knowledge Synthesis
    ├── architect-kdap-hybrid.yaml     # Architect + Autonomous Planning
    ├── debug-sivs-hybrid.yaml         # Debug + Self-Improving Validation
    ├── docs-amo-hybrid.yaml           # Docs + Autonomous Mapping
    └── orchestrator-ccf-hybrid.yaml   # Orchestrator + Cognitive Continuity
```

**What these do:** Each YAML file defines a specialized AI personality with specific capabilities, tools, and behavior patterns.

#### User Documentation
```
├── README.md                   # Project overview and navigation hub
├── SIMPLE_SETUP.md             # 5-minute setup walkthrough  
├── WHAT_EACH_MODE_DOES.md      # Plain English mode explanations
├── COMMON_WORKFLOWS.md         # Usage examples and typical patterns
├── HOW_IT_WORKS.md             # Technical overview without jargon
├── CUSTOMIZATION_GUIDE.md      # Mode modification and creation guide
├── FAQ.md                      # Frequently asked questions
└── TROUBLESHOOTING.md          # Problem-solving and fixes
```

### Advanced Technical Files

#### Enhancement Utilities (`utilities/`)
```
utilities/
├── core/                       # Fundamental building blocks
│   ├── conport-validation-manager.js       # Knowledge database validation
│   ├── knowledge-first-guidelines.js       # Knowledge-driven development patterns
│   ├── knowledge-metrics-dashboard.js      # Quality metrics and monitoring
│   ├── validation-checkpoints.js           # Quality gates and validation
│   └── knowledge-metrics/                  # Advanced metrics subsystem
├── frameworks/                 # Advanced AI capability implementations
│   ├── kse/                    # Knowledge Synthesis Engine
│   ├── kdap/                   # Knowledge-Driven Autonomous Planning
│   ├── sivs/                   # Self-Improving Validation System
│   ├── amo/                    # Autonomous Mapping Orchestrator
│   ├── ccf/                    # Cognitive Continuity Framework
│   └── akaf/                   # Adaptive Knowledge Application Framework
├── advanced/                   # High-level integration and coordination
│   ├── advanced-utilities-integration.js   # Master integration orchestrator
│   ├── advanced-utilities-config.yaml      # System-wide configuration
│   ├── knowledge-quality-enhancement/      # Quality improvement systems
│   ├── semantic-knowledge-graph/          # Knowledge relationship mapping
│   ├── temporal-knowledge-management/     # Time-aware knowledge systems
│   ├── cross-mode-knowledge-workflows/    # Inter-mode coordination
│   └── conport-analytics/                 # Analytics and insights
└── modes/                      # Mode-specific enhancement modules
    ├── architect-mode-enhancement.js       # Architect mode enhancements
    ├── code-mode-enhancement.js            # Code mode enhancements
    ├── debug-mode-enhancement.js           # Debug mode enhancements
    └── docs-mode-enhancement.js            # Documentation mode enhancements
```

#### Technical Documentation (`docs/`)
```
docs/
├── README.md                   # Documentation hub overview
├── frameworks/                 # Framework architecture documentation
│   ├── kse-architecture.md        # Knowledge Synthesis Engine details
│   ├── kdap-architecture.md       # Knowledge-Driven Planning details
│   ├── sivs-architecture.md       # Self-Improving Validation details
│   ├── amo-architecture.md        # Autonomous Mapping details
│   ├── ccf-architecture.md        # Cognitive Continuity details
│   └── akaf-architecture.md       # Adaptive Knowledge Application details
├── guides/                     # Technical how-to documentation
│   ├── universal-mode-enhancement-framework.md
│   ├── knowledge-first-guidelines.md
│   ├── conport-validation-strategy.md
│   └── [mode-specific enhancement guides]
├── examples/                   # Working code examples and demonstrations
│   ├── [mode]-enhancement-usage.js
│   ├── framework-integration-examples/
│   └── workflow-coordination-examples/
├── analysis/                   # Technical design documents
│   ├── sync-system-package-design.md
│   ├── package-architecture-documentation.md
│   └── tdd-strategies-validation-enhancement.md
└── phases/                     # Development phase documentation
    ├── phase-1/                # Foundation & Core Architecture
    ├── phase-2/                # Mode Enhancements
    ├── phase-3/                # Advanced Knowledge Management
    └── phase-4/                # Current Development Phase
```

#### Knowledge Database (`context_portal/`)
```
context_portal/
└── context.db                 # SQLite database containing:
                                # - Product and Active Context
                                # - Decisions with rationale and implementation details
                                # - System patterns and reusable approaches
                                # - Progress tracking and milestone completion
                                # - Custom project data and glossaries
                                # - Knowledge relationships and links
```

#### Development Tools
```
templates/                      # Mode creation scaffolding
├── README.md                           # Template usage documentation
├── basic-mode-template.yaml            # Simple mode creation template
├── conport-integrated-mode-template.yaml # Knowledge-enabled mode template
├── analysis-mode-template.yaml         # Research/analysis mode template
└── restricted-edit-mode-template.yaml  # File-restricted mode template

scripts/                        # Development and automation
├── roo_modes_sync/             # Synchronization system
├── run_tests.py                # Test execution
├── validate_modes.py           # Mode validation
└── conport_maintenance.py      # Database maintenance

tools/                          # Development utilities
└── [various development and maintenance tools]

tests/                          # System validation
├── unit/                       # Component-level testing
├── integration/                # System integration testing
└── [test suites and validation scripts]
```

---

## 🔄 **How Files Work Together**

### User Workflow
```
User reads README.md → Follows SIMPLE_SETUP.md → Copies mode YAML files → Enhanced AI capabilities activated
```

### System Integration Flow
```
Mode YAML → Loads Enhancement Utilities → Integrates with Frameworks → Stores Knowledge in ConPort → Improves Future Responses
```

### Knowledge Building Flow  
```
User Interaction → Mode Processes with Enhancements → Decisions/Patterns Stored → Knowledge Retrieved for Future Use → Continuous Improvement
```

### Development Workflow
```
Templates → Custom Mode Creation → Utility Integration → Testing with Scripts → Documentation → Deployment
```

---

## 🎯 **For Different User Types**

### Casual Users
**Files you need:** `modes/` (copy to Roo), `SIMPLE_SETUP.md`, `WHAT_EACH_MODE_DOES.md`
**Files you can ignore:** Everything else

### Power Users  
**Additional files:** `CUSTOMIZATION_GUIDE.md`, `templates/`, `FAQ.md`, `TROUBLESHOOTING.md`
**Still can ignore:** `utilities/`, `docs/`, internal scripts

### Developers/Contributors
**Need to understand:** All directories, especially `utilities/`, `docs/`, `scripts/`, `tests/`
**Key files:** `docs/guides/`, `utilities/advanced/`, framework implementations

### Enterprise/Advanced Users
**May need:** Advanced configuration files, enterprise setup docs, monitoring and backup scripts
**Key areas:** `utilities/advanced/`, `scripts/`, detailed `docs/analysis/`

---

## 📚 **Further Reading**

### For Understanding the System
- [`HOW_IT_WORKS.md`](HOW_IT_WORKS.md) - Technical overview without overwhelming detail
- [`docs/frameworks/`](docs/frameworks/) - Deep technical documentation on frameworks

### For Using the System
- [`COMMON_WORKFLOWS.md`](COMMON_WORKFLOWS.md) - Practical usage patterns and examples
- [`FAQ.md`](FAQ.md) - Common questions and answers

### For Customizing the System  
- [`CUSTOMIZATION_GUIDE.md`](CUSTOMIZATION_GUIDE.md) - Modification and creation instructions
- [`templates/`](templates/) - Starting points for custom modes

### For Contributing to Development
- [`docs/guides/universal-mode-enhancement-framework.md`](docs/guides/universal-mode-enhancement-framework.md) - Development patterns
- [`docs/analysis/`](docs/analysis/) - System design and architecture documentation

---

**Remember:** This comprehensive guide is for advanced users. Most people should start with [`SIMPLE_SETUP.md`](SIMPLE_SETUP.md) and only dig deeper into specific areas as needed.