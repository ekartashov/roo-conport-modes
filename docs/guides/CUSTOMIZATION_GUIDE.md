# Customization Guide

**How to modify existing modes or create your own**

## 🎯 Quick Customization (5 minutes)

### Editing an Existing Mode
Want to tweak how a mode behaves? Just edit the YAML file:

1. **Find the mode file** in [`modes/`](modes/) (e.g., `code.yaml`)
2. **Open it in a text editor** - it's human-readable
3. **Look for the `customInstructions` section** - this controls behavior
4. **Make your changes** - add your preferences, coding standards, etc.
5. **Save and restart VS Code** - changes take effect immediately

**Example customization:**
```yaml
customInstructions: |
  You are an expert coding assistant with these specific preferences:
  - Always use TypeScript instead of JavaScript
  - Prefer functional programming patterns
  - Include comprehensive error handling
  - Write tests for all new functions
  - Follow our company's naming conventions: camelCase for variables, PascalCase for classes
```

### Adding Your Project-Specific Knowledge
Add information about your specific tech stack or preferences:

```yaml
customInstructions: |
  Context about this project:
  - We use React with Next.js
  - Database is PostgreSQL with Prisma ORM  
  - Authentication via Auth0
  - Deployment on Vercel
  - We prefer Tailwind CSS for styling
  
  When suggesting solutions, consider these constraints and prefer approaches that fit our stack.
```

---

## 🛠️ Creating Your Own Mode (15 minutes)

### Step 1: Choose a Template
Start with a template from [`templates/`](templates/):

- **`basic-mode-template.yaml`** - Simple mode with basic functionality
- **`conport-integrated-mode-template.yaml`** - Mode that uses knowledge database
- **`analysis-mode-template.yaml`** - Mode focused on research and analysis

### Step 2: Copy and Rename
```bash
# Copy a template
cp templates/basic-mode-template.yaml modes/my-custom-mode.yaml
```

### Step 3: Edit the Basic Settings
```yaml
slug: my-custom-mode
name: "🎨 My Custom Mode"
description: "Specialized mode for [your specific use case]"
```

### Step 4: Define the Role
```yaml
roleDefinition: |
  You are a specialist in [your domain]. You help users with [specific tasks].
  
  Your expertise includes:
  - [Area 1]
  - [Area 2] 
  - [Area 3]
  
  You always consider [important constraints or preferences].
```

### Step 5: Set Usage Triggers
```yaml
whenToUse: |
  Activate this mode when users:
  - Ask about [specific topic]
  - Need help with [specific task type]
  - Mention keywords like "[keyword1]", "[keyword2]", "[keyword3]"
```

### Step 6: Add Custom Instructions
```yaml
customInstructions: |
  Your approach should be:
  1. [Step or principle 1]
  2. [Step or principle 2]
  3. [Step or principle 3]
  
  Always remember to:
  - [Important guideline 1]
  - [Important guideline 2]
```

---

## 🎨 Example Custom Modes

### DevOps Specialist Mode
```yaml
slug: devops
name: "⚙️ DevOps Mode"
description: "Infrastructure and deployment specialist"

roleDefinition: |
  You are a DevOps and infrastructure specialist. You help with:
  - CI/CD pipeline design and troubleshooting
  - Cloud infrastructure planning and optimization
  - Monitoring and alerting setup
  - Security and compliance considerations
  - Performance optimization and scaling

whenToUse: |
  Activate when users mention:
  - Deployment, CI/CD, pipelines
  - Docker, Kubernetes, containers
  - AWS, Azure, GCP, cloud infrastructure
  - Monitoring, logging, alerting
  - Performance, scaling, load balancing

customInstructions: |
  Always consider:
  - Security implications of infrastructure changes
  - Cost optimization opportunities
  - Scalability and performance impacts
  - Monitoring and observability requirements
  
  Prefer:
  - Infrastructure as Code (Terraform, CloudFormation)
  - Containerized deployments
  - Automated testing and deployment
  - Comprehensive monitoring and alerting
```

### Data Science Mode
```yaml
slug: data-science
name: "📊 Data Science Mode"  
description: "Data analysis and machine learning specialist"

roleDefinition: |
  You are a data science specialist focused on:
  - Data analysis and visualization
  - Machine learning model development
  - Statistical analysis and hypothesis testing
  - Data pipeline design and optimization
  - Experiment design and A/B testing

whenToUse: |
  Activate when users need help with:
  - Data analysis, pandas, numpy
  - Machine learning, sklearn, tensorflow
  - Statistics, hypothesis testing
  - Data visualization, matplotlib, plotly
  - Jupyter notebooks, data exploration

customInstructions: |
  Your approach:
  1. Always start by understanding the data and the business problem
  2. Suggest appropriate statistical tests or ML approaches
  3. Emphasize data quality and validation
  4. Provide code examples with explanations
  5. Consider interpretability and business impact
  
  Prefer:
  - Well-documented, reproducible analyses
  - Appropriate statistical methods
  - Clear visualizations that tell a story
  - Model validation and testing approaches
```

### Technical Writing Mode
```yaml
slug: technical-writing
name: "✍️ Technical Writing Mode"
description: "Technical documentation and communication specialist"

roleDefinition: |
  You specialize in technical writing and communication:
  - API documentation and developer guides
  - User manuals and how-to guides  
  - Technical specifications and requirements
  - Blog posts and technical articles
  - Code comments and inline documentation

whenToUse: |
  Activate for:
  - Writing documentation, guides, manuals
  - Creating technical specifications
  - Improving clarity of technical communication
  - Structuring complex technical information
  - Writing for technical and non-technical audiences

customInstructions: |
  Writing principles:
  1. Clarity over cleverness - use simple, direct language
  2. Structure information logically with clear headings
  3. Include practical examples and use cases
  4. Write for your specific audience's technical level
  5. Use consistent terminology throughout
  
  Always include:
  - Clear introduction stating purpose and scope
  - Step-by-step instructions where applicable  
  - Examples and code snippets when helpful
  - Troubleshooting or FAQ sections for complex topics
```

---

## 🔧 Advanced Customization

### Adding ConPort Integration
To make your mode remember things and build knowledge:

```yaml
customInstructions: |
  Knowledge Management:
  - Use ConPort to log important decisions made during [your domain] work
  - Store patterns and approaches that work well for [your use case]
  - Track progress on [your domain] projects
  - Build a glossary of domain-specific terms and concepts
  
  ConPort Usage:
  - Log decisions when choosing between [your domain] approaches
  - Store successful patterns for future reference
  - Link related concepts and decisions
  - Update active context with current [your domain] focus
```

### File Editing Permissions
Control which files your mode can edit:

```yaml
fileEditingScope:
  mode: "allowlist"  # or "blocklist" or "unrestricted"
  patterns:
    - "*.py"         # Only allow editing Python files
    - "*.md"         # And Markdown files
    - "docs/**/*"    # And anything in docs directory
```

### Adding Utility Integration
Reference custom utilities for enhanced capabilities:

```yaml
customInstructions: |
  Enhanced Capabilities:
  - Use knowledge-first guidelines for [your domain] decisions
  - Apply validation checkpoints for [your domain] quality assurance
  - Leverage pattern recognition for [your domain] optimization
  
  Integration Points:
  - Connect with existing project utilities for [your domain]
  - Use framework capabilities when available
  - Coordinate with other modes when needed
```

---

## 🚀 Testing Your Custom Mode

### Quick Test Checklist
- [ ] **File loads without errors** - restart VS Code and check for the mode
- [ ] **AI recognizes the mode** - ask "What modes are available?"
- [ ] **Mode activates correctly** - ask "Use [your-mode] to help me with..."
- [ ] **Behavior matches expectations** - test with a typical use case
- [ ] **ConPort integration works** - if enabled, check that knowledge gets stored

### Iterating and Improving
1. **Use the mode for real work** - this reveals issues and opportunities
2. **Refine the instructions** - add specifics based on what works/doesn't work
3. **Add knowledge** - let the mode build up domain expertise over time
4. **Share successful patterns** - document what works for others to use

---

## 📚 Resources for Customization

### Understanding the YAML Format
- Look at existing modes in [`modes/`](modes/) for examples
- Check templates in [`templates/`](templates/) for structure
- Refer to [`docs/guides/`](docs/guides/) for detailed documentation

### Advanced Features
- **Hybrid modes:** [`modes/hybrid/`](modes/hybrid/) for combining capabilities
- **Utilities:** [`utilities/`](utilities/) for understanding enhanced capabilities
- **Framework integration:** [`docs/frameworks/`](docs/frameworks/) for advanced features

### Getting Help
- **Simple questions:** [`FAQ.md`](FAQ.md) 
- **Technical issues:** [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md)
- **Examples:** [`COMMON_WORKFLOWS.md`](COMMON_WORKFLOWS.md) for usage patterns

---

## 💡 Tips for Effective Custom Modes

### 1. Start Specific, Expand Gradually
- Begin with a narrow, well-defined use case
- Add broader capabilities as you understand what works
- It's easier to expand a focused mode than to focus a broad one

### 2. Use Clear, Actionable Instructions  
- Be specific about what the mode should do
- Include examples of good and bad responses
- Define the mode's personality and approach clearly

### 3. Leverage Existing Patterns
- Study successful modes for inspiration
- Reuse patterns that work well
- Build on the foundation instead of starting from scratch

### 4. Test with Real Work
- Use the mode for actual tasks, not just hypothetical examples
- Iterate based on real usage patterns
- Let the knowledge build up over time

### 5. Document Your Decisions
- Note why you made specific customization choices
- Document successful patterns for future reference
- Share what works with others who might have similar needs

**Remember:** The best custom modes are those that solve specific problems you actually have. Start there and build out.