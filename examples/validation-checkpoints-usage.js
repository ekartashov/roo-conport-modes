/**
 * Validation Checkpoints Usage Example
 * 
 * This example demonstrates how to integrate the validation checkpoints
 * into a mode's operation flow using the ConPortValidationManager.
 */

const { createValidationManager } = require('../utilities/conport-validation-manager');

/**
 * Example of using validation checkpoints in a typical mode operation flow
 * @param {Object} options - Operation options
 * @param {Object} options.conPortClient - ConPort client instance
 * @param {string} options.workspaceId - ConPort workspace ID
 * @param {string} options.modeType - Type of mode (code, architect, ask, debug)
 * @param {Object} options.sessionContext - Current session context
 * @returns {Promise<void>}
 */
async function modeOperationWithValidation(options) {
  const {
    conPortClient,
    workspaceId,
    modeType,
    sessionContext
  } = options;

  // Initialize the ConPort validation manager
  const validationManager = createValidationManager({
    workspaceId,
    modeType,
    conPortClient,
    strictMode: false, // Set to true to throw errors on validation failures
    autoLog: true      // Automatically log validation results to ConPort
  });

  try {
    console.log("Starting operation with validation checkpoints...");

    // Step 1: Decision making process with validation
    const proposedDecision = {
      summary: "Use React with TypeScript for frontend",
      rationale: "Type safety and component-based architecture benefits",
      alternatives: ["Vue.js", "Angular", "Svelte"],
      tags: ["frontend", "architecture"]
    };

    console.log("Validating design decision...");
    const decisionValidation = await validationManager.validateDecision(proposedDecision);

    if (decisionValidation.valid) {
      console.log("Decision validated successfully!");
      console.log(`Relevant patterns: ${decisionValidation.relevantPatterns.length}`);
      console.log(`Related decisions: ${decisionValidation.relatedDecisions.length}`);
      
      // Log the validated decision to ConPort
      await conPortClient.logDecision({
        workspace_id: workspaceId,
        summary: proposedDecision.summary,
        rationale: proposedDecision.rationale,
        tags: proposedDecision.tags
      });
    } else {
      console.warn("Decision validation failed:");
      console.warn(`Conflicts: ${decisionValidation.conflicts.length}`);
      
      // Either modify the decision or proceed with warnings
      if (decisionValidation.conflicts.length > 0) {
        console.log("Modifying decision to resolve conflicts...");
        // Modify the decision based on conflicts
        proposedDecision.summary += " (with adaptations for compatibility)";
        
        // Re-validate the modified decision
        const revalidation = await validationManager.validateDecision(proposedDecision);
        if (revalidation.valid) {
          // Log the modified decision
          await conPortClient.logDecision({
            workspace_id: workspaceId,
            summary: proposedDecision.summary,
            rationale: proposedDecision.rationale + "\n\nNote: Modified to address conflicts with existing decisions.",
            tags: [...proposedDecision.tags, "conflict_resolution"]
          });
        }
      }
    }

    // Step 2: Implementation planning with validation
    const implementationPlan = {
      phases: [
        {
          name: "Setup",
          tasks: ["Initialize React with TypeScript", "Configure build system"],
          technologies: ["React", "TypeScript", "Webpack"]
        },
        {
          name: "Core Components",
          tasks: ["Create base components", "Implement state management"],
          technologies: ["React Hooks", "Context API"]
        }
      ]
    };

    console.log("Validating implementation plan...");
    const planValidation = await validationManager.validateImplementationPlan(implementationPlan);

    if (planValidation.valid) {
      console.log("Implementation plan validated successfully!");
      
      // Apply any suggested improvements
      if (planValidation.suggestedImprovements.length > 0) {
        console.log("Applying suggested improvements to plan:");
        planValidation.suggestedImprovements.forEach(suggestion => {
          console.log(`- ${suggestion}`);
        });
      }
    } else {
      console.warn("Implementation plan validation had issues:");
      
      // Address invalid technologies or approaches
      const invalidTechs = planValidation.technologies.filter(t => !t.valid);
      if (invalidTechs.length > 0) {
        console.warn(`Invalid technologies: ${invalidTechs.map(t => t.technology).join(', ')}`);
      }
      
      const invalidApproaches = planValidation.approaches.filter(a => !a.valid);
      if (invalidApproaches.length > 0) {
        console.warn(`Invalid approaches: ${invalidApproaches.map(a => a.approach).join(', ')}`);
      }
    }

    // Step 3: Code generation with validation
    const codeContext = {
      task: "Create a user authentication component",
      language: "TypeScript",
      framework: "React",
      requirements: ["Email/password login", "Social auth integration", "Error handling"]
    };

    console.log("Validating code generation context...");
    const codeValidation = await validationManager.validateCodeGeneration(codeContext);

    if (codeValidation.valid) {
      console.log("Code context validated successfully!");
      console.log(`Applicable patterns: ${codeValidation.applicablePatterns.length}`);
      
      // Generate code using the applicable patterns
      console.log("Generating code with validated patterns...");
      const generatedCode = "// Code would be generated here using the validated patterns";
      
      // Document any new patterns discovered during coding
      const newPattern = {
        name: "Authentication Form Pattern",
        description: "Reusable pattern for authentication forms with validation and multi-provider support"
      };
      
      await conPortClient.logSystemPattern({
        workspace_id: workspaceId,
        name: newPattern.name,
        description: newPattern.description,
        tags: ["authentication", "forms", "react"]
      });
    } else {
      console.warn("Code context validation failed:");
      console.warn(codeValidation.message);
      
      // Fall back to more generic approach
      console.log("Falling back to generic implementation approach without patterns");
    }

    // Step 4: Preparing response with validation
    const responseContent = `
      Based on our analysis, we should implement the user authentication using React with TypeScript.
      The implementation will follow these steps:
      1. Initialize the project with Create React App and TypeScript template
      2. Set up the authentication context using React Context API
      3. Implement the login form component with validation
      4. Add social authentication providers
      5. Create protected routes using React Router
    `;

    console.log("Validating response...");
    const responseValidation = await validationManager.validateResponse(responseContent);

    if (responseValidation.valid) {
      console.log("Response validated successfully!");
      console.log("Responding with validated content...");
      
      // Use the original content since it's valid
      const finalResponse = responseValidation.originalContent;
      console.log(finalResponse);
    } else {
      console.warn("Response validation had issues:");
      console.warn(`Unvalidated claims: ${responseValidation.unvalidatedClaims.length}`);
      
      // Use the modified content with disclaimers
      const modifiedResponse = responseValidation.modifiedContent;
      console.log(modifiedResponse);
    }

    // Step 5: Task completion with validation
    console.log("Preparing for task completion...");
    const completionValidation = await validationManager.validateCompletion(sessionContext);

    if (completionValidation.valid) {
      console.log("Completion validation passed! All insights captured.");
      
      // Update active context with completion status
      await conPortClient.updateActiveContext({
        workspace_id: workspaceId,
        patch_content: {
          current_focus: "Completed authentication implementation planning",
          recent_completions: ["Authentication planning with validated patterns"]
        }
      });
      
      // Complete the task
      console.log("Task completed successfully with all knowledge preserved!");
    } else {
      console.warn("Completion validation found uncaptured insights:");
      
      // Log any pending items before completion
      if (completionValidation.pendingDecisions.length > 0) {
        console.warn(`Pending decisions: ${completionValidation.pendingDecisions.length}`);
        // Log the pending decisions
        for (const decision of completionValidation.pendingDecisions) {
          await conPortClient.logDecision({
            workspace_id: workspaceId,
            summary: decision.summary,
            rationale: decision.rationale,
            tags: decision.tags || []
          });
        }
      }
      
      if (completionValidation.pendingPatterns.length > 0) {
        console.warn(`Pending patterns: ${completionValidation.pendingPatterns.length}`);
        // Log the pending patterns
        for (const pattern of completionValidation.pendingPatterns) {
          await conPortClient.logSystemPattern({
            workspace_id: workspaceId,
            name: pattern.name,
            description: pattern.description,
            tags: pattern.tags || []
          });
        }
      }
      
      console.log("All pending items now logged, task can be completed.");
    }

    // Get validation summary
    const summary = validationManager.getRegistry().getValidationSummary();
    console.log("Validation Summary:");
    console.log(`Total validations: ${summary.total}`);
    console.log(`Passed: ${summary.passed} (${Math.round(summary.passRate * 100)}%)`);
    console.log(`Failed: ${summary.failed}`);

    // Log validation registry to ConPort
    await conPortClient.logCustomData({
      workspace_id: workspaceId,
      category: "ValidationMetrics",
      key: `validation_summary_${new Date().toISOString().split('T')[0]}`,
      value: summary
    });

  } catch (error) {
    console.error("Error in validation process:", error);
    
    // Log error to ConPort
    await conPortClient.logCustomData({
      workspace_id: workspaceId,
      category: "ErrorLogs",
      key: `validation_error_${Date.now()}`,
      value: {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }
    });
  }
}

/**
 * Example of use in AI mode operation
 */
async function exampleModeOperation() {
  // This is a mock setup - in real implementation, these would be actual objects
  const mockConPortClient = {
    logDecision: async () => ({ id: 123 }),
    logSystemPattern: async () => ({ id: 456 }),
    updateActiveContext: async () => ({}),
    logCustomData: async () => ({})
  };
  
  const mockWorkspaceId = "/home/user/Projects/example";
  const mockSessionContext = {
    currentTask: "Implement user authentication",
    sessionStartTime: Date.now() - 1000 * 60 * 15, // 15 minutes ago
    generatedArtifacts: ["AuthContext.tsx", "LoginForm.tsx"]
  };
  
  await modeOperationWithValidation({
    conPortClient: mockConPortClient,
    workspaceId: mockWorkspaceId,
    modeType: "code",
    sessionContext: mockSessionContext
  });
}

// Run the example if this file is executed directly
if (require.main === module) {
  exampleModeOperation().catch(console.error);
}

module.exports = {
  modeOperationWithValidation
};