/**
 * Knowledge-First Guidelines Usage Example
 * 
 * This example demonstrates how to implement Knowledge-First Guidelines
 * in a practical application, showing the complete workflow from initialization
 * to completion and analysis.
 */

const { KnowledgeFirstGuidelines } = require('../utilities/knowledge-first-guidelines');
const { ValidationManager } = require('../utilities/conport-validation-manager');
const { KnowledgeSourceClassifier } = require('../utilities/knowledge-source-classifier');

// Mock ConPort access for demonstration purposes
const ConPortClient = {
  getProductContext: async (workspaceId) => {
    return {
      projectName: "Roo ConPort Modes",
      projectDescription: "A system for managing specialized AI agent modes with ConPort integration",
      architecture: {
        coreComponents: ["Mode Templates", "ConPort Integration", "Sync System"],
        patterns: ["ConPort-First Knowledge Operation", "Knowledge Preservation Protocol"]
      }
    };
  },
  getActiveContext: async (workspaceId) => {
    return {
      currentFocus: "Implementing Knowledge-First Guidelines",
      openIssues: [
        "Need to implement actual semantic validation capabilities",
        "Consider creating a validation dashboard for monitoring validation health metrics"
      ],
      currentPhase: "Phase 1: Foundation Building"
    };
  },
  getDecisions: async (workspaceId, options) => {
    return [
      {
        id: 53,
        summary: "Implementation of validation checkpoints in all modes",
        rationale: "To ensure systematic verification of AI-generated content against ConPort knowledge",
        tags: ["validation", "consistency", "knowledge-verification"]
      },
      {
        id: 29,
        summary: "Creation of Knowledge Source Classification Framework",
        rationale: "To create explicit distinction between retrieved and generated knowledge",
        tags: ["classification", "transparency", "knowledge-quality"]
      }
    ];
  },
  getSystemPatterns: async (workspaceId, options) => {
    return [
      {
        id: 24,
        name: "Standardized Knowledge Preservation Protocol",
        description: "A structured approach for identifying, evaluating, and preserving valuable knowledge in ConPort",
        tags: ["knowledge-preservation", "standardization"]
      },
      {
        id: 29,
        name: "Staged Validation Checkpoints Pattern",
        description: "A systematic approach for validating AI-generated content at defined checkpoints in the workflow",
        tags: ["validation", "quality-control"]
      }
    ];
  },
  logDecision: async (workspaceId, decision) => {
    console.log(`[ConPort] Logged decision: ${decision.summary}`);
    return { id: 60, ...decision };
  },
  updateActiveContext: async (workspaceId, update) => {
    console.log(`[ConPort] Updated active context`);
    return { status: "success" };
  }
};

/**
 * Example: Using Knowledge-First Guidelines in an AI Agent Implementation
 */
async function knowledgeFirstExample() {
  console.log("==========================================");
  console.log("Knowledge-First Guidelines Usage Example");
  console.log("==========================================\n");

  // 1. Knowledge-First Initialization
  console.log("Step 1: Knowledge-First Initialization");
  console.log("--------------------------------------");
  
  const workspaceId = "/home/user/Projects/agentic/roo-conport-modes";
  const userQuery = "What's the best way to implement the knowledge-first approach in our architecture?";
  
  // Initialize the session with ConPort integration
  const session = await initializeSession(workspaceId, userQuery);
  console.log("✅ Session initialized with ConPort knowledge");
  console.log(`📊 Retrieved ${Object.keys(session.retrievedKnowledge.customData).length} custom data categories`);
  console.log(`📊 Retrieved ${session.retrievedKnowledge.decisions.length} relevant decisions`);
  console.log(`📊 Retrieved ${session.retrievedKnowledge.systemPatterns.length} system patterns`);
  console.log();

  // 2. Knowledge-First Response Protocol
  console.log("Step 2: Knowledge-First Response Protocol");
  console.log("----------------------------------------");
  
  // Generate a response using knowledge-first principles
  const response = await generateResponse(session, userQuery);
  console.log("📝 Generated response with knowledge-first principles:");
  console.log("---");
  console.log(response.formattedResponse);
  console.log("---");
  console.log(`📊 Knowledge utilization: ${response.knowledgeUtilizationSummary}`);
  console.log();

  // 3. Knowledge-First Decision Making
  console.log("Step 3: Knowledge-First Decision Making");
  console.log("--------------------------------------");
  
  // Make a decision using knowledge-first principles
  const decision = await makeArchitecturalDecision(session, "knowledge_preservation_approach", [
    "session-based",
    "continuous-integration",
    "event-driven"
  ]);
  console.log("🧠 Made architectural decision with knowledge-first principles:");
  console.log(`Decision: ${decision.decision} for ${decision.point}`);
  console.log(`Rationale: ${decision.rationale}`);
  console.log(`📊 Knowledge sources: ${JSON.stringify(decision.knowledgeSources)}`);
  console.log();

  // 4. Knowledge-First Completion Protocol
  console.log("Step 4: Knowledge-First Completion Protocol");
  console.log("------------------------------------------");
  
  // Complete the session with knowledge preservation
  const completionReport = await completeSession(session, {
    summary: "Completed knowledge-first guidelines implementation",
    newKnowledge: [
      {
        content: "Knowledge-First implementation requires systematic integration at each step of the AI workflow",
        context: "Architecture decision",
        type: "insight"
      },
      {
        content: "The knowledge utilization ratio is a key metric for evaluating knowledge-first effectiveness",
        context: "Metrics definition",
        type: "pattern"
      }
    ]
  });
  console.log("✅ Session completed with knowledge preservation");
  console.log(`📊 Knowledge utilization ratio: ${completionReport.knowledgeUtilizationRatio.toFixed(2)}`);
  console.log(`📊 Validation success rate: ${(completionReport.validationMetrics.validationSuccesses / completionReport.validationMetrics.validationAttempts).toFixed(2)}`);
  console.log(`📊 Preservation recommendations: ${completionReport.preservationRecommendations}`);
  console.log();

  // 5. Knowledge-First Feedback Loop
  console.log("Step 5: Knowledge-First Feedback Loop");
  console.log("------------------------------------");
  
  // Analyze the session for knowledge improvement
  const analysisReport = await analyzeSession(session);
  console.log("📊 Session analysis complete");
  console.log(`Knowledge utilization from ConPort: ${analysisReport.utilizationAnalysis.conPortDerivedPercentage.toFixed(2)}%`);
  console.log(`Knowledge gaps identified: ${analysisReport.gapsAnalysis.totalGaps}`);
  console.log("Recommendations:");
  analysisReport.recommendations.forEach((rec, i) => {
    console.log(`  ${i+1}. [${rec.priority}] ${rec.description}`);
  });
  console.log(`Overall knowledge-first score: ${analysisReport.overallScore.toFixed(2)}/100`);
  console.log();

  console.log("Knowledge-First Guidelines Example Complete");
}

/**
 * Initialize a knowledge-first session
 */
async function initializeSession(workspaceId, userQuery) {
  // Create a mock ConPort-integrated initialization
  // In a real implementation, this would use the actual KnowledgeFirstGuidelines.initialize
  // with real ConPort API access
  
  const session = await KnowledgeFirstGuidelines.initialize({
    workspace: workspaceId,
    taskContext: userQuery,
    mode: "ask"
  });
  
  // Simulate loading real data from ConPort
  session.retrievedKnowledge.productContext = await ConPortClient.getProductContext(workspaceId);
  session.retrievedKnowledge.activeContext = await ConPortClient.getActiveContext(workspaceId);
  session.retrievedKnowledge.decisions = await ConPortClient.getDecisions(workspaceId, { limit: 5 });
  session.retrievedKnowledge.systemPatterns = await ConPortClient.getSystemPatterns(workspaceId, { limit: 5 });
  session.retrievedKnowledge.customData = {
    "ProjectGlossary": [
      { 
        key: "ConPort",
        value: "A knowledge management system that serves as cognitive infrastructure for AI agents"
      },
      {
        key: "Knowledge-First Guidelines",
        value: "A framework for prioritizing retrieved knowledge over generated content"
      }
    ]
  };
  
  return session;
}

/**
 * Generate a response using knowledge-first principles
 */
async function generateResponse(session, query) {
  // In a real implementation, this would use the actual KnowledgeFirstResponder.createResponse
  
  // Simulate the knowledge-first response process
  console.log("🔍 Retrieving knowledge relevant to query...");
  console.log("📚 Prioritizing retrieved knowledge in response...");
  console.log("✅ Validating generated content against ConPort...");
  console.log("🏷️ Classifying knowledge sources in response...");
  
  // Create a classified response using real knowledge from the session
  const patterns = session.retrievedKnowledge.systemPatterns;
  const decisions = session.retrievedKnowledge.decisions;
  const glossary = session.retrievedKnowledge.customData.ProjectGlossary;
  
  const formattedResponse = `
[R] Based on our existing Standardized Knowledge Preservation Protocol (System Pattern #${patterns[0].id}), the best way to implement the knowledge-first approach is to integrate it at each stage of the AI workflow.

[V] This aligns with our previous decision (#${decisions[0].id}) to implement validation checkpoints in all modes.

[I] For your specific implementation, you should extend the existing validation utilities to include knowledge-first principles, ensuring that knowledge retrieval occurs before generation.

[G] I recommend implementing a Knowledge Utilization Monitor that tracks the ratio of retrieved vs. generated content in real-time, as this is not covered by existing patterns but would enhance transparency.

---
Knowledge Sources:
[R] - Retrieved directly from ConPort
[V] - Validated against ConPort
[I] - Inferred from context
[G] - Generated during this session
---`;

  // Track knowledge utilization
  session.knowledgeUtilization = {
    retrieved: 4,
    validated: 2,
    inferred: 2,
    generated: 1,
    uncertain: 0,
    total: 9
  };
  
  return {
    formattedResponse,
    knowledgeUtilizationSummary: `${((6/9)*100).toFixed(2)}% from ConPort (Retrieved + Validated)`
  };
}

/**
 * Make an architectural decision using knowledge-first principles
 */
async function makeArchitecturalDecision(session, decisionPoint, options) {
  // In a real implementation, this would use the actual KnowledgeFirstDecisionMaker.makeDecision
  
  // Simulate the knowledge-first decision process
  console.log("🔍 Retrieving relevant past decisions...");
  console.log("📚 Analyzing system patterns for consistency...");
  console.log("🧠 Formulating decision based on existing knowledge...");
  console.log("✅ Validating decision consistency...");
  
  // Make a decision aligned with existing knowledge
  const decision = {
    point: decisionPoint,
    decision: options[1], // "continuous-integration"
    summary: `Use continuous integration approach for knowledge preservation`,
    rationale: "This approach aligns with our existing Staged Validation Checkpoints Pattern and ensures knowledge is preserved throughout the development process rather than only at session boundaries.",
    tags: [decisionPoint, options[1], "knowledge-preservation"],
    knowledgeSources: {
      retrieved: 2,
      validated: 2,
      inferred: 1,
      generated: 0,
      uncertain: 0
    }
  };
  
  // Simulate logging the decision to ConPort
  const loggedDecision = await ConPortClient.logDecision(session.workspaceId, {
    summary: decision.summary,
    rationale: decision.rationale,
    tags: decision.tags
  });
  
  decision.id = loggedDecision.id;
  
  return decision;
}

/**
 * Complete a session with knowledge preservation
 */
async function completeSession(session, outcome) {
  // In a real implementation, this would use the actual KnowledgeFirstCompleter.complete
  
  // Simulate the knowledge-first completion process
  console.log("📝 Documenting new knowledge from session...");
  console.log("✅ Validating critical outputs...");
  console.log("🔄 Updating active context...");
  
  // Process new knowledge
  for (const knowledge of outcome.newKnowledge) {
    session.recordGeneratedKnowledge({
      content: knowledge.content,
      context: knowledge.context,
      validated: true,
      preserved: true
    });
    
    // Add preservation recommendation based on knowledge type
    if (knowledge.type === "pattern") {
      session.addPreservationRecommendation({
        type: 'system_pattern',
        content: {
          name: knowledge.content.split(':')[0],
          description: knowledge.content
        },
        reason: 'Identified pattern during knowledge-first implementation',
        priority: 'medium'
      });
    }
  }
  
  // Update active context in ConPort
  await ConPortClient.updateActiveContext(session.workspaceId, {
    patch_content: {
      current_focus: outcome.summary,
      knowledge_first_implementation: {
        status: "in_progress",
        recent_insights: outcome.newKnowledge.map(k => k.content)
      }
    }
  });
  
  // Generate completion report
  return {
    sessionId: session.timestamp,
    knowledgeUtilization: session.knowledgeUtilization,
    validationMetrics: {
      validationAttempts: 4,
      validationSuccesses: 4,
      validationFailures: 0,
      uncheckedContent: 1
    },
    preservationRecommendations: session.preservationRecommendations.length + 1,
    knowledgeGaps: session.knowledgeGaps.length,
    knowledgeUtilizationRatio: session.getKnowledgeUtilizationRatio()
  };
}

/**
 * Analyze the session for knowledge improvement
 */
async function analyzeSession(session) {
  // In a real implementation, this would use the actual KnowledgeFirstAnalyzer.analyzeSession
  
  // Simulate the knowledge-first analysis process
  console.log("📊 Analyzing knowledge utilization...");
  console.log("🔍 Analyzing knowledge gaps...");
  console.log("📈 Generating improvement recommendations...");
  
  // Perform utilization analysis
  const totalItems = Object.values(session.knowledgeUtilization)
    .filter(val => typeof val === 'number' && val !== session.knowledgeUtilization.total)
    .reduce((sum, val) => sum + val, 0);
  
  const utilizationAnalysis = {
    retrievedPercentage: session.knowledgeUtilization.retrieved / totalItems * 100,
    validatedPercentage: session.knowledgeUtilization.validated / totalItems * 100,
    inferredPercentage: session.knowledgeUtilization.inferred / totalItems * 100,
    generatedPercentage: session.knowledgeUtilization.generated / totalItems * 100,
    uncertainPercentage: session.knowledgeUtilization.uncertain / totalItems * 100,
    conPortDerivedPercentage: (session.knowledgeUtilization.retrieved + session.knowledgeUtilization.validated) / totalItems * 100
  };
  
  // Analyze knowledge gaps
  const gapsAnalysis = {
    totalGaps: 2,
    highPriorityGaps: 1,
    mediumPriorityGaps: 1,
    lowPriorityGaps: 0,
    topGapCategories: ['metrics', 'implementation']
  };
  
  // Generate recommendations
  const recommendations = [
    {
      type: 'knowledge_enrichment',
      description: 'Document the Knowledge Utilization Monitor as a new system pattern',
      priority: 'high'
    },
    {
      type: 'retrieval_enhancement',
      description: 'Create more detailed implementation examples for knowledge-first principles',
      priority: 'medium'
    }
  ];
  
  // Calculate overall score
  const overallScore = utilizationAnalysis.conPortDerivedPercentage * 0.6 + 
    (4 / 4) * 40; // validation success rate * weight
  
  return {
    sessionId: session.timestamp,
    utilizationAnalysis,
    gapsAnalysis,
    recommendations,
    overallScore
  };
}

// Export the example runner
module.exports = {
  runExample: knowledgeFirstExample
};

// Run the example if this file is executed directly
if (require.main === module) {
  knowledgeFirstExample().catch(console.error);
}