/**
 * Prompt Enhancer Isolated Mode Enhancement Usage Example
 * 
 * This example demonstrates how to use the Prompt Enhancer Isolated Mode
 * enhancement to improve prompts using only universal best practices without
 * project-specific context influence.
 */

const { PromptEnhancerIsolatedModeEnhancement } = require('../utilities/mode-enhancements/prompt-enhancer-isolated-mode-enhancement');

/**
 * Run the example
 */
async function runExample() {
  console.log('=== Prompt Enhancer Isolated Mode Enhancement Example ===\n');
  
  // Create and initialize the mode enhancement
  console.log('Initializing Prompt Enhancer Isolated Mode Enhancement...');
  const promptEnhancerIsolated = new PromptEnhancerIsolatedModeEnhancement();
  await promptEnhancerIsolated.initialize();
  console.log('Initialization complete.\n');
  
  // Example 1: Simple prompt enhancement
  await enhanceAndShowResult(
    promptEnhancerIsolated,
    "Create a login form",
    "Example 1: Simple prompt enhancement"
  );
  
  // Example 2: Technical prompt enhancement
  await enhanceAndShowResult(
    promptEnhancerIsolated,
    "Implement a REST API for user management with CRUD operations",
    "Example 2: Technical prompt enhancement"
  );
  
  // Example 3: UI component prompt enhancement
  await enhanceAndShowResult(
    promptEnhancerIsolated,
    "Create a responsive navigation menu that collapses on mobile",
    "Example 3: UI component prompt enhancement"
  );
  
  // Example 4: Ambiguous prompt enhancement with clarification request
  console.log('=== Example 4: Ambiguous prompt with clarification request ===');
  const ambiguousPrompt = "Make it better with some improvements";
  
  console.log('Original prompt:');
  console.log(ambiguousPrompt);
  console.log();
  
  const ambiguousResult = await promptEnhancerIsolated.enhancePrompt(ambiguousPrompt);
  
  if (ambiguousResult.status === 'clarification_needed') {
    console.log('Clarification needed:');
    console.log(JSON.stringify(ambiguousResult.clarificationRequests, null, 2));
    console.log();
    
    // Simulate user providing clarification
    const clarificationResponses = [
      { isContent: true }  // Indicate that this segment should be treated as content to enhance
    ];
    
    console.log('Processing clarification responses...');
    const clarifiedResult = await promptEnhancerIsolated.processClarificationResponses(
      ambiguousPrompt,
      ambiguousResult.disambiguationResult,
      clarificationResponses
    );
    
    console.log('Enhanced prompt after clarification:');
    console.log(clarifiedResult.enhancedPrompt);
    console.log();
    console.log('Validation passed:', clarifiedResult.validationResult.passed);
    
    if (!clarifiedResult.validationResult.passed) {
      console.log('Validation errors:');
      console.log(clarifiedResult.validationResult.errors);
      console.log();
    }
  }
  
  // Example 5: Looking at enhancement history
  console.log('=== Example 5: Enhancement History ===');
  const history = promptEnhancerIsolated.getEnhancementHistory();
  console.log(`History contains ${history.length} items.`);
  console.log('Most recent enhancement:');
  
  if (history.length > 0) {
    console.log(`Original: "${history[0].originalPrompt.substring(0, 50)}..."`);
    console.log(`Enhanced: "${history[0].enhancedPrompt.substring(0, 50)}..."`);
    console.log('Domain:', history[0].metadata.domain);
    console.log('Template used:', history[0].metadata.templateUsed);
    console.log('Validation passed:', history[0].metadata.validationPassed);
  }
  console.log();
  
  console.log('=== End of Prompt Enhancer Isolated Mode Enhancement Example ===');
}

/**
 * Helper function to enhance a prompt and display the result
 * @param {PromptEnhancerIsolatedModeEnhancement} enhancer - The enhancer instance
 * @param {string} prompt - The original prompt to enhance
 * @param {string} exampleTitle - Title of the example
 */
async function enhanceAndShowResult(enhancer, prompt, exampleTitle) {
  console.log(`=== ${exampleTitle} ===`);
  console.log('Original prompt:');
  console.log(prompt);
  console.log();
  
  const result = await enhancer.enhancePrompt(prompt);
  
  if (result.status === 'success') {
    console.log('Enhanced prompt:');
    console.log(result.enhancedPrompt);
    console.log();
    console.log('Domain:', result.domain);
    console.log('Template used:', result.templateUsed);
    console.log('Techniques applied:', result.techniquesApplied.join(', '));
    console.log('Validation passed:', result.validationResult.passed);
    
    if (!result.validationResult.passed) {
      console.log('Validation errors:');
      console.log(result.validationResult.errors);
    }
  } else {
    console.log('Enhancement failed:');
    console.log(result.error || 'Unknown error');
  }
  
  console.log('\n---\n');
}

// Run the example
runExample().catch(error => {
  console.error('Error running example:', error);
});