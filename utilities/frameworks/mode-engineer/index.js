/**
 * Mode Engineering Utilities - Main Index
 * 
 * This module exports the complete Mode Engineer system, providing a unified
 * interface for intelligent mode creation, enhancement, and ecosystem management
 * using all Phase 4 autonomous frameworks.
 */

const { 
  ModeEngineerIntegration, 
  createModeEngineer 
} = require('./mode-engineer-integration');
const { ModeEngineeringEngine } = require('./mode-engineer-core');
const validation = require('./mode-engineer-validation');

/**
 * Main Mode Engineer class that provides the complete functionality
 */
class ModeEngineer {
  constructor(options = {}) {
    this.integration = new ModeEngineerIntegration(options);
    this.initialized = false;
  }

  /**
   * Initialize the Mode Engineer
   */
  async initialize() {
    await this.integration.initialize();
    this.initialized = true;
    return this;
  }

  /**
   * Create a new mode
   */
  async createMode(description, options = {}) {
    this._ensureInitialized();

    const request = {
      type: 'create-mode',
      description,
      domain: options.domain,
      capabilities: options.capabilities,
      constraints: options.constraints,
      complexity: options.complexity
    };

    return await this.integration.processRequest(request);
  }

  /**
   * Enhance an existing mode
   */
  async enhanceMode(modeId, enhancementGoals, options = {}) {
    this._ensureInitialized();

    const request = {
      type: 'enhance-mode',
      modeId,
      enhancementGoals,
      preserveExisting: options.preserveExisting !== false
    };

    return await this.integration.processRequest(request);
  }

  /**
   * Analyze the mode ecosystem
   */
  async analyzeEcosystem(options = {}) {
    this._ensureInitialized();

    const request = {
      type: 'analyze-ecosystem',
      scope: options.scope || 'all-modes',
      analysisDepth: options.analysisDepth || 'comprehensive'
    };

    return await this.integration.processRequest(request);
  }

  /**
   * Validate a mode
   */
  async validateMode(mode, context = {}) {
    this._ensureInitialized();

    const request = {
      type: 'validate-mode',
      mode,
      context,
      standards: context.standards || ['roo-ecosystem']
    };

    return await this.integration.processRequest(request);
  }

  /**
   * Get framework status
   */
  getStatus() {
    return this.integration.getFrameworkStatus();
  }

  /**
   * Ensure the Mode Engineer is initialized
   */
  _ensureInitialized() {
    if (!this.initialized) {
      throw new Error('Mode Engineer must be initialized before use. Call await modeEngineer.initialize()');
    }
  }
}

/**
 * Quick validation functions for immediate use
 */
const quickValidation = {
  validateRequest: validation.validateModeEngineeringRequest,
  validateYAML: validation.validateModeYAMLStructure,
  validateFrameworks: validation.validateFrameworkIntegration,
  validateEcosystem: validation.validateEcosystemCompatibility
};

/**
 * Utility functions for mode engineering
 */
const utilities = {
  /**
   * Parse mode requirements from natural language description
   */
  parseRequirements(description) {
    const requirements = {
      type: 'general',
      capabilities: [],
      domain: 'general',
      complexity: 'medium'
    };

    // Extract type indicators
    if (/debug|fix|troubleshoot/i.test(description)) {
      requirements.type = 'debug';
      requirements.capabilities.push('debugging', 'analysis');
    } else if (/code|develop|implement/i.test(description)) {
      requirements.type = 'code';
      requirements.capabilities.push('coding', 'implementation');
    } else if (/architect|design|plan/i.test(description)) {
      requirements.type = 'architect';
      requirements.capabilities.push('planning', 'design');
    } else if (/analyze|review|audit/i.test(description)) {
      requirements.type = 'analysis';
      requirements.capabilities.push('analysis', 'review');
    }

    // Extract domain indicators
    if (/security|auth|crypto/i.test(description)) {
      requirements.domain = 'security';
    } else if (/performance|speed|optimize/i.test(description)) {
      requirements.domain = 'performance';
    } else if (/data|database|storage/i.test(description)) {
      requirements.domain = 'data';
    } else if (/ui|interface|frontend/i.test(description)) {
      requirements.domain = 'frontend';
    } else if (/api|backend|server/i.test(description)) {
      requirements.domain = 'backend';
    }

    // Extract complexity indicators
    if (/simple|basic|quick/i.test(description)) {
      requirements.complexity = 'low';
    } else if (/complex|advanced|sophisticated/i.test(description)) {
      requirements.complexity = 'high';
    }

    // Extract additional capabilities
    if (/test|testing/i.test(description)) {
      requirements.capabilities.push('testing');
    }
    if (/document|docs/i.test(description)) {
      requirements.capabilities.push('documentation');
    }
    if (/deploy|deployment/i.test(description)) {
      requirements.capabilities.push('deployment');
    }

    return requirements;
  },

  /**
   * Generate mode slug from name
   */
  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '');   // Remove leading/trailing hyphens
  },

  /**
   * Suggest emoji for mode based on type and domain
   */
  suggestEmoji(type, domain) {
    const emojiMap = {
      'code': '💻',
      'debug': '🪲',
      'architect': '🏗️',
      'analysis': '🔍',
      'security': '🔒',
      'performance': '⚡',
      'data': '📊',
      'frontend': '🎨',
      'backend': '🔧',
      'testing': '🧪',
      'documentation': '📚',
      'deployment': '🚀'
    };

    return emojiMap[domain] || emojiMap[type] || '🎯';
  },

  /**
   * Generate mode template based on requirements
   */
  generateModeTemplate(requirements) {
    const emoji = this.suggestEmoji(requirements.type, requirements.domain);
    const slug = this.generateSlug(`${requirements.domain}-${requirements.type}`);
    
    return {
      slug,
      name: `${emoji} ${requirements.domain} ${requirements.type}`.replace(/\b\w/g, l => l.toUpperCase()),
      model: 'claude-sonnet-4',
      roleDefinition: `You are a specialized ${requirements.type} mode focused on ${requirements.domain} tasks.`,
      whenToUse: `Activate this mode when you need to perform ${requirements.type} operations in the ${requirements.domain} domain.`,
      customInstructions: this.generateCustomInstructions(requirements),
      permissions: this.generatePermissions(requirements)
    };
  },

  /**
   * Generate custom instructions based on requirements
   */
  generateCustomInstructions(requirements) {
    let instructions = `SPECIALIZED ${requirements.type.toUpperCase()} MODE FOR ${requirements.domain.toUpperCase()}:\n\n`;
    
    instructions += `Core Capabilities:\n`;
    requirements.capabilities.forEach(cap => {
      instructions += `- ${cap.charAt(0).toUpperCase() + cap.slice(1)} operations\n`;
    });

    instructions += `\nFramework Integration:\n`;
    instructions += `- Utilize Phase 4 frameworks for enhanced capabilities\n`;
    instructions += `- Integrate with ConPort for knowledge management\n`;
    instructions += `- Apply domain-specific patterns and best practices\n`;

    return instructions;
  },

  /**
   * Generate permissions based on requirements
   */
  generatePermissions(requirements) {
    const permissions = {
      read: ['utilities/**/*', 'docs/**/*'],
      edit: [],
      browser: false,
      command: false,
      mcp: true
    };

    // Add domain-specific permissions
    if (requirements.domain === 'frontend') {
      permissions.edit.push('src/**/*.js', 'src/**/*.css', 'src/**/*.html');
    } else if (requirements.domain === 'backend') {
      permissions.edit.push('src/**/*.js', 'src/**/*.py', 'config/**/*');
      permissions.command = true;
    } else if (requirements.domain === 'data') {
      permissions.edit.push('data/**/*', 'scripts/**/*');
    }

    // Add type-specific permissions
    if (requirements.type === 'code') {
      permissions.edit.push('src/**/*');
      permissions.command = true;
    } else if (requirements.type === 'debug') {
      permissions.read.push('logs/**/*', 'test/**/*');
    }

    return permissions;
  }
};

// Export everything
module.exports = {
  // Main classes
  ModeEngineer,
  ModeEngineerIntegration,
  ModeEngineeringEngine,

  // Factory functions
  createModeEngineer,
  
  // Validation functions
  validation,
  quickValidation,

  // Utilities
  utilities,

  // Direct access to layers
  core: require('./mode-engineer-core'),
  integration: require('./mode-engineer-integration'),

  /**
   * Initialize a Mode Engineer instance (convenience function)
   */
  async initialize(options = {}) {
    const modeEngineer = new ModeEngineer(options);
    await modeEngineer.initialize();
    return modeEngineer;
  },

  /**
   * Quick mode creation without full initialization (for simple cases)
   */
  async quickCreate(description, conportClient, options = {}) {
    const modeEngineer = await createModeEngineer({
      conportClient,
      workspaceId: options.workspaceId,
      ...options
    });

    return await modeEngineer.processRequest({
      type: 'create-mode',
      description,
      ...options
    });
  },

  /**
   * Quick mode validation without full initialization
   */
  quickValidate(mode, context = {}) {
    return validation.validateMode(mode, context);
  }
};