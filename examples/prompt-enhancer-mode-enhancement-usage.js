/**
 * Prompt Enhancer Mode Enhancement Usage Example
 * 
 * This example demonstrates how to use the Prompt Enhancer Mode Enhancement
 * to improve prompts with disambiguation, knowledge-first enhancement, and validation.
 */

const { PromptEnhancerValidationCheckpoints } = require('../utilities/mode-enhancements/prompt-enhancer-validation-checkpoints');
const { PromptEnhancerKnowledgeFirst } = require('../utilities/mode-enhancements/prompt-enhancer-knowledge-first');
const { PromptEnhancerModeEnhancement } = require('../utilities/mode-enhancements/prompt-enhancer-mode-enhancement');
const { ConPortClient } = require('../services/conport-client');

/**
 * Example implementation demonstrating Prompt Enhancer Mode Enhancement usage
 */
async function promptEnhancerModeEnhancementExample() {
  try {
    console.log('=== Prompt Enhancer Mode Enhancement Example ===');
    
    // Initialize ConPort client
    const conportClient = new ConPortClient();
    
    // Initialize validation checkpoints
    const validationCheckpoints = new PromptEnhancerValidationCheckpoints({
      promptClarityThreshold: 0.8,
      promptCompletenessThreshold: 0.85,
      promptImprovementThreshold: 0.7,
      disambiguationAccuracyThreshold: 0.9
    });
    
    // Initialize knowledge-first module
    const knowledgeFirst = new PromptEnhancerKnowledgeFirst({
      conportClient
    });
    
    // Initialize mode enhancement
    const promptEnhancerMode = new PromptEnhancerModeEnhancement({
      conportClient,
      validationCheckpoints,
      knowledgeFirst,
      enableHistoryTracking: true
    });
    
    // Initialize the mode enhancement
    console.log('Initializing Prompt Enhancer Mode Enhancement...');
    const initResult = await promptEnhancerMode.initialize();
    console.log('Initialization result:', initResult);
    
    // Example 1: Simple prompt enhancement
    console.log('\n--- Example 1: Simple Prompt Enhancement ---');
    const simplePrompt = 'Create a login form';
    console.log('Original prompt:', simplePrompt);
    
    const simpleEnhancementResult = await promptEnhancerMode.enhancePrompt(simplePrompt);
    
    if (simpleEnhancementResult.status === 'success') {
      console.log('Enhanced prompt:');
      console.log(simpleEnhancementResult.enhancedPrompt);
      console.log('\nEnhancement metadata:');
      console.log('- Domain:', simpleEnhancementResult.domain);
      console.log('- Template used:', simpleEnhancementResult.templateUsed);
      console.log('- Techniques applied:', simpleEnhancementResult.techniquesApplied.join(', '));
      console.log('- Validation passed:', simpleEnhancementResult.validationResult.passed);
    } else if (simpleEnhancementResult.status === 'clarification_needed') {
      console.log('Clarification needed:');
      simpleEnhancementResult.clarificationRequests.forEach((request, i) => {
        console.log(`${i + 1}. ${request.clarificationQuestion}`);
      });
      
      // Example of handling clarification responses
      const clarificationResponses = simpleEnhancementResult.clarificationRequests.map(req => ({
        isContent: true // Assuming all segments are content to enhance
      }));
      
      console.log('\nProcessing clarification responses...');
      const clarifiedResult = await promptEnhancerMode.processClarificationResponses(
        simplePrompt,
        simpleEnhancementResult.disambiguationResult,
        clarificationResponses
      );
      
      console.log('Enhanced prompt after clarification:');
      console.log(clarifiedResult.enhancedPrompt);
    } else {
      console.log('Enhancement failed:', simpleEnhancementResult.error);
    }
    
    // Example 2: Complex prompt with disambiguation
    console.log('\n--- Example 2: Complex Prompt with Disambiguation ---');
    const complexPrompt = 'Use ConPort to load project data and create a responsive navigation component for our web app';
    console.log('Original prompt:', complexPrompt);
    
    const complexEnhancementResult = await promptEnhancerMode.enhancePrompt(complexPrompt);
    
    if (complexEnhancementResult.status === 'success') {
      console.log('Enhanced prompt:');
      console.log(complexEnhancementResult.enhancedPrompt);
      console.log('\nEnhancement metadata:');
      console.log('- Domain:', complexEnhancementResult.domain);
      console.log('- Template used:', complexEnhancementResult.templateUsed);
      console.log('- Techniques applied:', complexEnhancementResult.techniquesApplied.join(', '));
      console.log('- Validation passed:', complexEnhancementResult.validationResult.passed);
    } else if (complexEnhancementResult.status === 'clarification_needed') {
      console.log('Clarification needed:');
      complexEnhancementResult.clarificationRequests.forEach((request, i) => {
        console.log(`${i + 1}. ${request.clarificationQuestion}`);
      });
      
      // Example of handling clarification responses
      const clarificationResponses = [
        { isContent: false }, // Meta-instruction: "Use ConPort to load project data"
        { isContent: true }   // Content: "create a responsive navigation component for our web app"
      ];
      
      console.log('\nProcessing clarification responses...');
      const clarifiedResult = await promptEnhancerMode.processClarificationResponses(
        complexPrompt,
        complexEnhancementResult.disambiguationResult,
        clarificationResponses
      );
      
      console.log('Enhanced prompt after clarification:');
      console.log(clarifiedResult.enhancedPrompt);
    } else {
      console.log('Enhancement failed:', complexEnhancementResult.error);
    }
    
    // Example 3: Technical prompt with specific template
    console.log('\n--- Example 3: Technical Prompt with Specific Template ---');
    const technicalPrompt = 'Create a REST API endpoint for user authentication';
    console.log('Original prompt:', technicalPrompt);
    
    const technicalEnhancementResult = await promptEnhancerMode.enhancePrompt(technicalPrompt, {
      templateKey: 'technical' // Specify a specific template
    });
    
    if (technicalEnhancementResult.status === 'success') {
      console.log('Enhanced prompt:');
      console.log(technicalEnhancementResult.enhancedPrompt);
      console.log('\nEnhancement metadata:');
      console.log('- Domain:', technicalEnhancementResult.domain);
      console.log('- Template used:', technicalEnhancementResult.templateUsed);
      console.log('- Techniques applied:', technicalEnhancementResult.techniquesApplied.join(', '));
      console.log('- Validation passed:', technicalEnhancementResult.validationResult.passed);
    } else {
      console.log('Enhancement failed:', technicalEnhancementResult.error);
    }
    
    // Get enhancement history
    console.log('\n--- Enhancement History ---');
    const enhancementHistory = promptEnhancerMode.getEnhancementHistory();
    console.log(`Total enhancements: ${enhancementHistory.length}`);
    enhancementHistory.forEach((history, i) => {
      console.log(`\n${i + 1}. Enhancement at ${history.timestamp}:`);
      console.log(`   Domain: ${history.domain}`);
      console.log(`   Template: ${history.templateUsed}`);
      console.log(`   Validation: ${history.validationPassed ? 'Passed' : 'Failed'}`);
    });
    
    // Get validation metrics
    console.log('\n--- Validation Metrics ---');
    const validationMetrics = promptEnhancerMode.getValidationMetrics();
    console.log('Overall success rate:', validationMetrics.overallSuccessRate);
    console.log('Checkpoint success rates:');
    Object.entries(validationMetrics.checkpointSuccessRates).forEach(([checkpoint, rate]) => {
      console.log(`- ${checkpoint}: ${rate}`);
    });
    
    console.log('\n=== Example completed successfully ===');
  } catch (error) {
    console.error('Example failed with error:', error);
  }
}

// Run the example
promptEnhancerModeEnhancementExample().catch(console.error);

/**
 * Example of direct disambiguation usage
 */
async function disambiguationExample() {
  try {
    console.log('\n=== Direct Disambiguation Example ===');
    
    // Initialize ConPort client
    const conportClient = new ConPortClient();
    
    // Initialize knowledge-first module
    const knowledgeFirst = new PromptEnhancerKnowledgeFirst({
      conportClient
    });
    
    // Initialize knowledge-first module
    await knowledgeFirst.initialize();
    
    // Example prompt with mixed content and meta-instructions
    const mixedPrompt = 'Use ConPort to load project glossary and enhance this prompt for creating a data visualization dashboard with filtering capabilities';
    console.log('Original prompt:', mixedPrompt);
    
    // Perform disambiguation
    const disambiguationResult = await knowledgeFirst.disambiguatePrompt(mixedPrompt);
    
    console.log('\nDisambiguation result:');
    console.log('Overall confidence:', disambiguationResult.overallConfidence);
    console.log('\nContent segments:');
    disambiguationResult.contentSegments.forEach((segment, i) => {
      console.log(`${i + 1}. "${segment.text}" (confidence: ${segment.confidence.toFixed(2)})`);
    });
    
    console.log('\nMeta-instruction segments:');
    disambiguationResult.metaInstructionSegments.forEach((segment, i) => {
      console.log(`${i + 1}. "${segment.text}" (confidence: ${segment.confidence.toFixed(2)})`);
    });
    
    console.log('\nAmbiguous segments:');
    disambiguationResult.ambiguousSegments.forEach((segment, i) => {
      console.log(`${i + 1}. "${segment.text}" (confidence: ${segment.confidence.toFixed(2)})`);
    });
    
    if (disambiguationResult.clarificationRequests) {
      console.log('\nClarification requests:');
      disambiguationResult.clarificationRequests.forEach((request, i) => {
        console.log(`${i + 1}. ${request.clarificationQuestion}`);
      });
    }
    
    console.log('\n=== Disambiguation Example completed successfully ===');
  } catch (error) {
    console.error('Disambiguation example failed with error:', error);
  }
}

// Run the disambiguation example
disambiguationExample().catch(console.error);

/**
 * Example of direct enhancement usage
 */
async function directEnhancementExample() {
  try {
    console.log('\n=== Direct Enhancement Example ===');
    
    // Initialize ConPort client
    const conportClient = new ConPortClient();
    
    // Initialize knowledge-first module
    const knowledgeFirst = new PromptEnhancerKnowledgeFirst({
      conportClient
    });
    
    // Initialize knowledge-first module
    await knowledgeFirst.initialize();
    
    // Example content to enhance
    const contentToEnhance = 'Create a user authentication system';
    console.log('Content to enhance:', contentToEnhance);
    
    // Prepare disambiguation result (assuming all content)
    const simplifiedDisambiguation = {
      contentSegments: [
        { type: 'content', text: contentToEnhance, confidence: 0.9 }
      ],
      metaInstructionSegments: []
    };
    
    // Perform enhancement
    const enhancementResult = await knowledgeFirst.enhancePrompt(
      contentToEnhance,
      simplifiedDisambiguation,
      { templateKey: 'technical' }
    );
    
    console.log('\nEnhancement result:');
    console.log('Domain:', enhancementResult.domain);
    console.log('Template used:', enhancementResult.templateUsed);
    console.log('Techniques applied:', enhancementResult.techniquesApplied.join(', '));
    console.log('\nEnhanced prompt:');
    console.log(enhancementResult.enhancedPrompt);
    
    console.log('\n=== Direct Enhancement Example completed successfully ===');
  } catch (error) {
    console.error('Direct enhancement example failed with error:', error);
  }
}

// Run the direct enhancement example
directEnhancementExample().catch(console.error);