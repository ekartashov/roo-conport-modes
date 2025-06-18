# Frequently Asked Questions

## General Questions

### What exactly is this project?
It's a collection of specialized AI modes that make your AI assistant better at specific tasks like coding, system design, debugging, and documentation. Think of it as giving your AI different "expert personalities" for different types of work.

### Do I need to install anything special?
No. If you have Roo installed in VS Code, you just copy some YAML files and you're done. No dependencies, no complex setup.

### Will this slow down my AI?
The enhanced modes do more sophisticated processing, so initial responses might take slightly longer. However, they build up knowledge over time that makes future responses faster and more relevant.

### Can I use multiple modes together?
Yes! You can switch between modes during a conversation, or use Orchestrator Mode to coordinate multiple modes automatically.

## Technical Questions

### What's ConPort and do I need to understand it?
ConPort is the knowledge database that makes modes "remember" things. You don't need to understand it - it works automatically in the background. Just know that it's what makes your AI get smarter about your specific projects over time.

### Can I modify the modes?
Absolutely! The YAML files are designed to be readable and editable. You can customize existing modes or create entirely new ones.

### What if I only want some modes, not all of them?
Perfect - just copy the ones you want. Start with 1-2 modes that match your current needs.

### Are the hybrid modes worth it?
If you're doing complex work, yes. Hybrid modes combine multiple capabilities and are more powerful. But start with basic modes first to get familiar with the system.

## Usage Questions

### How do I know which mode to use?
- **Building something?** → Architect (planning) + Code (implementation)
- **Fixing issues?** → Debug mode
- **Writing docs?** → Docs mode  
- **Research/questions?** → Ask mode
- **Complex project?** → Orchestrator mode

### Do I need to explicitly tell the AI which mode to use?
Not always, but it helps. You can say "Use architect mode to..." or just describe what you want and the AI will often choose the right mode.

### What happens to my existing AI conversations?
Nothing changes with your existing setup. These modes are additive - they give you new capabilities without breaking anything.

### Can I remove modes if I don't like them?
Yes, just delete the YAML files from your configuration directory. Everything goes back to normal immediately.

## Knowledge and Learning Questions

### What kind of things do modes "remember"?
- Architectural decisions you make
- Coding patterns that work well for your projects
- Solutions to problems you've encountered
- Your preferences and coding style
- Project-specific terminology and concepts

### Do modes share knowledge with each other?
Yes! That's one of the key benefits. A solution discovered in Debug Mode can inform future Code Mode suggestions, etc.

### What if I work on multiple different projects?
The system is smart about context. It can keep knowledge separate for different projects or identify when patterns from one project might help another.

### Can I export or backup this knowledge?
Yes, there are utilities to export everything to markdown files for backup or sharing.

## Advanced Questions

### Can I create my own modes?
Yes! Use the templates in [`templates/`](templates/) as starting points. The YAML format is straightforward.

### What are utilities and frameworks?
They're the "engine" that powers the enhanced capabilities. You don't need to understand them to use the modes, but they're available if you want to customize or extend things.

### How do I contribute new modes or improvements?
The project is designed to be extensible. Create new modes, document them well, and they can be shared with others.

### Is this compatible with future Roo updates?
The modes are designed to be forward-compatible. They use standard Roo mode formats and shouldn't break with updates.

## Getting Started Questions

### I'm overwhelmed - where should I start?
1. Read [`SIMPLE_SETUP.md`](SIMPLE_SETUP.md) (5 minutes)
2. Copy just `ask.yaml` and `code.yaml` to start
3. Try asking: "Use ask mode to explain how this project works"
4. Add more modes as you need them

### What's the minimum useful setup?
Just `ask.yaml` gives you an enhanced research assistant that builds knowledge over time. That alone is useful for most people.

### How long before I see benefits?
Immediately for enhanced capabilities, and within a few uses for the knowledge-building benefits. The more you use it, the more useful it becomes.

### Should I read all the documentation first?
No! Start with [`SIMPLE_SETUP.md`](SIMPLE_SETUP.md), try it out, then read more as needed. The system is designed to be useful immediately and learnable gradually.