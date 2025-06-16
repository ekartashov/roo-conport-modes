# Mode-Specific Enhancements

Specialized knowledge-first enhancements and validation checkpoints tailored for each Roo mode.

## Mode Categories

### Core Development Modes
- **Architect Mode:** [`architect-*`](./architect-knowledge-first.js) - Architectural decision support and design pattern validation
- **Code Mode:** [`code-*`](./code-knowledge-first.js) - Implementation pattern guidance and code consistency validation  
- **Debug Mode:** [`debug-*`](./debug-knowledge-first.js) - Issue resolution patterns and debugging workflow enhancement

### Knowledge & Communication Modes
- **Ask Mode:** [`ask-*`](./ask-knowledge-first.js) - Factual accuracy and educational consistency validation
- **Docs Mode:** [`docs-*`](./docs-knowledge-first.js) - Documentation standards and content completeness validation
- **Prompt Enhancer Mode:** [`prompt-enhancer-*`](./prompt-enhancer-knowledge-first.js) - Prompt quality and improvement validation
- **Prompt Enhancer Isolated Mode:** [`prompt-enhancer-isolated-*`](./prompt-enhancer-isolated-knowledge-first.js) - Context-free prompt enhancement

### Coordination & Maintenance Modes  
- **Orchestrator Mode:** [`orchestrator-*`](./orchestrator-knowledge-first.js) - Workflow optimization and task delegation patterns
- **ConPort Maintenance Mode:** [`conport-maintenance-*`](./conport-maintenance-knowledge-first.js) - Knowledge quality and database health validation
- **Knowledge Metrics Mode:** [`knowledge-metrics-*`](./knowledge-metrics-knowledge-first.js) - Metrics collection and analysis enhancement

## Enhancement Patterns

Each mode follows a consistent three-component pattern:

1. **Knowledge-First Specialization** (`*-knowledge-first.js`)
   - Prioritizes retrieval of mode-specific knowledge patterns
   - Implements specialized knowledge classification for the mode's domain
   - Develops domain-specific consistency validation logic

2. **Mode Enhancement** (`*-mode-enhancement.js`)  
   - Extends base mode capabilities with knowledge-first principles
   - Integrates with core framework utilities
   - Provides mode-specific optimization patterns

3. **Validation Checkpoints** (`*-validation-checkpoints.js`)
   - Custom validation rules tailored to the mode's function
   - Quality checks specific to the mode's output types
   - Integration validation with ConPort and other systems

## Usage

Mode enhancements are automatically integrated when the corresponding mode is activated. They build upon the core framework utilities to provide specialized functionality tailored to each mode's specific purpose and workflow.

## Related Documentation

- **Mode Templates:** [`templates/`](../../templates/) contains YAML mode configurations
- **Enhancement Guides:** [`docs/guides/`](../../docs/guides/) contains mode-specific implementation guides
- **Usage Examples:** [`docs/examples/`](../../docs/examples/) contains mode enhancement examples