/**
 * Ask Mode Enhancement Usage Example
 * 
 * This example demonstrates how to use the Ask Mode Enhancement for:
 * - Answer validation with specialized checkpoints
 * - Knowledge extraction from answers
 * - Knowledge persistence to ConPort
 * - Knowledge retrieval for questions
 * - Contextual relevance assessment
 */

// Import Ask Mode Enhancement
const { AskModeEnhancement } = require('../utilities/mode-enhancements/ask-mode-enhancement');

// Import ConPort client (mock implementation for example)
const ConPortClient = require('../utilities/mock-conport-client');

// Create a ConPort client instance
const conportClient = new ConPortClient({
  workspace_id: '/path/to/workspace'
});

// Create an Ask Mode Enhancement instance
const askEnhancement = new AskModeEnhancement({
  conportClient,
  autoValidate: true,
  validateBeforePersistence: true,
  minConfidenceForPersistence: 0.8,
  
  // Optional custom configurations for individual checkpoints
  informationAccuracyOptions: {
    requiredCitations: true,
    citationThreshold: 0.6,
    threshold: 0.75
  },
  sourceReliabilityOptions: {
    minimumSourceCount: 2,
    preferredSourceTypes: [
      'official_documentation',
      'peer_reviewed',
      'academic_publication'
    ]
  }
});

// Example 1: Simple question validation
async function validateSimpleAnswer() {
  console.log('Example 1: Validating a simple answer');
  
  const question = {
    text: 'What is React Query and how does it differ from Redux?',
    type: 'comparison',
    aspects: ['React Query definition', 'Redux comparison', 'use cases']
  };
  
  const answer = {
    directAnswer: 'React Query is a data-fetching and state management library for React applications, focusing on server state management, while Redux is a general state management library primarily for client state.',
    explanation: 'React Query automatically handles caching, background updates, and stale data, making it ideal for API interactions. Redux requires more boilerplate but offers predictable state containers for any JavaScript environment.',
    context: 'Both libraries serve different primary purposes: React Query simplifies data fetching and API state, while Redux provides a centralized store for application state.',
    
    // Source information
    sources: [
      {
        title: 'React Query Documentation',
        url: 'https://tanstack.com/query/latest/docs/react/overview',
        type: 'official_documentation',
        reliability: 'high'
      },
      {
        title: 'Redux Documentation',
        url: 'https://redux.js.org/',
        type: 'official_documentation',
        reliability: 'high'
      }
    ],
    
    // Accuracy assessment
    accuracyAssessment: {
      factualConsistency: 0.9,
      technicalPrecision: 0.85,
      currentRelevance: 0.95,
      contextualCorrectness: 0.9
    },
    
    // Relevance assessment
    relevanceAssessment: {
      questionAlignment: 0.9,
      userContextRelevance: 0.8,
      technicalLevelMatch: 0.85,
      applicationFocus: 0.9
    },
    
    // Additional components
    examples: 'React Query example: useQuery({ queryKey: ["todos"], queryFn: fetchTodos })\nRedux example: store.dispatch({ type: "ADD_TODO", payload: newTodo })',
    limitations: 'React Query is primarily focused on server state, while Redux requires more setup but offers more flexibility for complex state interactions.',
    alternatives: 'Other alternatives include SWR, Zustand, Recoil, and Context API with useReducer.',
    furtherReading: 'For more information, see the TanStack Query documentation and Redux documentation.'
  };
  
  const context = {
    user: {
      technicalLevel: 'intermediate',
      preferredFrameworks: ['React', 'Vue']
    }
  };
  
  // Validate the answer
  const validationResults = askEnhancement.validateAnswer(answer, { ...context, question });
  
  console.log('Validation result:', validationResults.isValid ? 'Valid' : 'Invalid');
  console.log('Information accuracy result:', validationResults.results.informationAccuracy.valid ? 'Valid' : 'Invalid');
  console.log('Source reliability result:', validationResults.results.sourceReliability.valid ? 'Valid' : 'Invalid');
  console.log('Answer completeness result:', validationResults.results.answerCompleteness.valid ? 'Valid' : 'Invalid');
  console.log('Contextual relevance result:', validationResults.results.contextualRelevance.valid ? 'Valid' : 'Invalid');
  
  // If invalid, show suggested improvements for each failed checkpoint
  if (!validationResults.isValid) {
    Object.entries(validationResults.results).forEach(([checkpoint, result]) => {
      if (!result.valid && result.suggestedImprovements) {
        console.log(`\nImprovements for ${checkpoint}:`);
        result.suggestedImprovements.forEach(improvement => {
          console.log(`- ${improvement.description}`);
        });
      }
    });
    
    // Improve the answer
    const improvedAnswer = askEnhancement.improveAnswer(answer, validationResults, { ...context, question });
    console.log('\nImproved answer flags:', Object.keys(improvedAnswer).filter(key => 
      key.startsWith('needs') || key.startsWith('has') || key.startsWith('missing')
    ));
  }
}

// Example 2: Knowledge extraction from an answer
async function extractAndPersistKnowledge() {
  console.log('\nExample 2: Extracting and persisting knowledge');
  
  const question = {
    text: 'What are the best practices for managing React component state?',
    type: 'bestPractice'
  };
  
  const answer = {
    directAnswer: 'The best practices for managing React component state include using the useState hook for simple state, useReducer for complex state logic, lifting state up when needed, and leveraging context for global state.',
    explanation: 'React\'s state management approach depends on the complexity of your application. For most components, local state via useState is sufficient. As complexity grows, consider more advanced patterns.',
    context: 'Effective state management is crucial for maintaining predictable React applications and avoiding prop drilling or unnecessary re-renders.',
    examples: 'const [count, setCount] = useState(0); // Simple state\n\n// Complex state with useReducer\nconst [state, dispatch] = useReducer(reducer, initialState);',
    
    // Additional comprehensive information with knowledge that could be extracted
    detailedBestPractices: 'Best practice for React state management is to keep state as local as possible. Only lift state up when multiple components need access to the same data. For server data, consider specialized libraries like React Query or SWR instead of managing in React state.',
    limitations: 'When the application grows beyond a certain complexity, consider adopting a state management library like Redux, Zustand, or Recoil. Context API with useReducer has performance implications for large-scale applications.',
    comparativeInsight: 'Compared to class components, functional components with hooks provide a more concise and readable approach to state management. The ability to create custom hooks also allows for better reuse of stateful logic.',
    
    // Source information
    sources: [
      {
        title: 'React Documentation - Hooks',
        url: 'https://reactjs.org/docs/hooks-intro.html',
        type: 'official_documentation',
        reliability: 'high'
      },
      {
        title: 'React State Management in 2023',
        url: 'https://example.com/blog/react-state-management',
        type: 'technical_blog',
        reliability: 'medium'
      }
    ],
    
    // Accuracy and relevance assessments
    accuracyAssessment: {
      factualConsistency: 0.95,
      technicalPrecision: 0.9,
      currentRelevance: 0.85,
      contextualCorrectness: 0.9
    },
    
    relevanceAssessment: {
      questionAlignment: 0.95,
      userContextRelevance: 0.9,
      technicalLevelMatch: 0.9,
      applicationFocus: 0.85
    }
  };
  
  // Extract knowledge
  const extractedKnowledge = askEnhancement.extractKnowledge(answer, question);
  
  console.log('Extracted knowledge items:', extractedKnowledge.length);
  extractedKnowledge.forEach((item, index) => {
    console.log(`\nItem ${index + 1}:`);
    console.log(`- Type: ${item.type}`);
    console.log(`- Category: ${item.category}`);
    console.log(`- Confidence: ${item.confidence}`);
    console.log(`- Data:`, item.data);
  });
  
  // Persist knowledge to ConPort
  const persistResult = await askEnhancement.persistKnowledge(extractedKnowledge);
  
  console.log('\nPersistence result:', persistResult.success ? 'Success' : 'Failed');
  console.log('Operations performed:', persistResult.operations.length);
}

// Example 3: Retrieving knowledge for a question
async function retrieveKnowledgeForQuestion() {
  console.log('\nExample 3: Retrieving knowledge for a question');
  
  const question = {
    text: 'What are the limitations of using React Context API for state management?',
    type: 'constraint'
  };
  
  // Retrieve knowledge
  const retrievedKnowledge = await askEnhancement.retrieveKnowledge(question);
  
  console.log('Knowledge retrieval successful:', retrievedKnowledge.success);
  console.log('Retrieved sources:', retrievedKnowledge.sources.length);
  
  retrievedKnowledge.sources.forEach((source, index) => {
    console.log(`\nSource type: ${source.type}`);
    console.log(`Items: ${source.items ? source.items.length : 0}`);
  });
  
  // Update active context
  const contextUpdate = await askEnhancement.updateActiveContext(question, null, { updateCurrentFocus: true });
  
  console.log('\nContext update successful:', contextUpdate.success);
}

// Example 4: Complete question-answer processing workflow
async function completeQuestionAnswerWorkflow() {
  console.log('\nExample 4: Complete question-answer workflow');
  
  const question = {
    text: 'How does the performance of React Query compare to SWR for data fetching?',
    type: 'comparison',
    aspects: ['Performance comparison', 'Feature differences', 'Use case suitability']
  };
  
  const answer = {
    directAnswer: 'React Query and SWR have comparable performance for basic data fetching scenarios, with React Query offering more advanced features for complex caching needs and SWR providing a simpler API with excellent performance for common use cases.',
    explanation: 'Both libraries use stale-while-revalidate caching strategies, but differ in implementation details. React Query offers more built-in features like query invalidation, dependent queries, and mutation handling, while SWR focuses on simplicity and speed.',
    context: 'The choice between these libraries depends on your specific requirements. For simpler applications, SWR\'s minimal API may be preferable, while complex applications with many data dependencies might benefit from React Query\'s additional features.',
    examples: 'React Query: useQuery({ queryKey: ["todos"], queryFn: fetchTodos })\nSWR: useSWR("/api/todos", fetcher)',
    
    // Additional components
    limitations: 'Both libraries add some bundle size to your application. React Query is larger due to its feature set, while SWR is more lightweight.',
    alternatives: 'Other alternatives include Apollo Client (GraphQL-focused), RTK Query (Redux ecosystem), and custom hooks with useEffect.',
    furtherReading: 'For more information, see the documentation for both libraries and performance benchmarks.',
    
    // Source information
    sources: [
      {
        title: 'React Query Documentation',
        url: 'https://tanstack.com/query/latest/docs/react/overview',
        type: 'official_documentation',
        reliability: 'high'
      },
      {
        title: 'SWR Documentation',
        url: 'https://swr.vercel.app/',
        type: 'official_documentation',
        reliability: 'high'
      },
      {
        title: 'Data Fetching in React: Performance Comparison',
        url: 'https://example.com/blog/react-data-fetching-performance',
        type: 'technical_blog',
        reliability: 'medium'
      }
    ],
    
    // Detailed comparison for knowledge extraction
    comparisonDetail: 'Compared to SWR, React Query offers more granular control over caching behavior and has built-in devtools for debugging. SWR has a smaller bundle size and slightly simpler API, making it easier to integrate into existing projects.',
    
    // Accuracy and relevance assessments
    accuracyAssessment: {
      factualConsistency: 0.9,
      technicalPrecision: 0.85,
      currentRelevance: 0.95,
      contextualCorrectness: 0.9
    },
    
    relevanceAssessment: {
      questionAlignment: 0.95,
      userContextRelevance: 0.85,
      technicalLevelMatch: 0.9,
      applicationFocus: 0.9
    }
  };
  
  const context = {
    user: {
      technicalLevel: 'expert',
      preferredFrameworks: ['React'],
      currentProject: 'Building a data-intensive dashboard application'
    }
  };
  
  // Process the complete question-answer workflow
  const processResult = await askEnhancement.processQuestionAnswer(question, answer, context);
  
  console.log('Process completed');
  console.log('Validation successful:', processResult.validation.isValid);
  console.log('Knowledge items extracted:', processResult.knowledgeExtraction.length);
  console.log('Persistence successful:', processResult.persistence ? processResult.persistence.success : 'N/A');
  console.log('Context update successful:', processResult.contextUpdate ? processResult.contextUpdate.success : 'N/A');
  
  // If validation failed, examine the improvements
  if (!processResult.validation.isValid) {
    console.log('\nValidation issues:');
    Object.entries(processResult.validation.results).forEach(([checkpoint, result]) => {
      if (!result.valid) {
        console.log(`- ${checkpoint}: ${result.message}`);
      }
    });
  }
}

// Run the examples
async function runExamples() {
  try {
    await validateSimpleAnswer();
    await extractAndPersistKnowledge();
    await retrieveKnowledgeForQuestion();
    await completeQuestionAnswerWorkflow();
    
    console.log('\nAll examples completed successfully');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run if called directly
if (require.main === module) {
  runExamples();
}

module.exports = {
  validateSimpleAnswer,
  extractAndPersistKnowledge,
  retrieveKnowledgeForQuestion,
  completeQuestionAnswerWorkflow,
  runExamples
};