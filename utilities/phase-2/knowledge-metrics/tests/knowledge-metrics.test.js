/**
 * Knowledge Metrics Dashboard Tests
 */

const {
  KnowledgeMetricsDashboard,
  KnowledgeMetric,
  KnowledgeMetricsIntegration,
  validateConPortClient,
  validateDashboardOptions
} = require('../index');

// Mock tests - in a real implementation, these would use a testing framework like Jest
console.log('Running Knowledge Metrics Dashboard Tests...');

// Mock ConPort client for testing
const mockConPortClient = {
  getProductContext: () => ({ name: 'Test Project' }),
  getActiveContext: () => ({ currentFocus: 'Testing' }),
  getDecisions: () => [{ id: 1, summary: 'Test Decision' }],
  getSystemPatterns: () => [{ id: 1, name: 'Test Pattern' }],
  getProgress: () => [{ id: 1, description: 'Test Progress', status: 'DONE' }],
  getCustomData: () => []
};

// Test metric creation
function testMetricCreation() {
  console.log('Testing metric creation...');
  
  const metric = new KnowledgeMetric(
    'Test Metric',
    'A test metric',
    (data) => 0.75,
    'percentage',
    [0.7, 0.5]
  );
  
  if (metric.name === 'Test Metric' && 
      metric.description === 'A test metric' && 
      metric.unit === 'percentage') {
    console.log('✅ Metric creation test passed');
    return true;
  } else {
    console.error('❌ Metric creation test failed');
    return false;
  }
}

// Test dashboard creation
function testDashboardCreation() {
  console.log('Testing dashboard creation...');
  
  const dashboard = new KnowledgeMetricsDashboard();
  
  if (dashboard.categories && 
      typeof dashboard.categories.coverage === 'object' &&
      typeof dashboard.categories.quality === 'object') {
    console.log('✅ Dashboard creation test passed');
    return true;
  } else {
    console.error('❌ Dashboard creation test failed');
    return false;
  }
}

// Test ConPort client validation
function testClientValidation() {
  console.log('Testing ConPort client validation...');
  
  const validResult = validateConPortClient(mockConPortClient);
  const invalidResult = validateConPortClient({});
  
  if (validResult.isValid && !invalidResult.isValid) {
    console.log('✅ Client validation test passed');
    return true;
  } else {
    console.error('❌ Client validation test failed');
    return false;
  }
}

// Test dashboard options validation
function testOptionsValidation() {
  console.log('Testing dashboard options validation...');
  
  const validResult = validateDashboardOptions({ limit: 100 });
  const invalidResult = validateDashboardOptions({ limit: -1 });
  
  if (validResult.isValid && !invalidResult.isValid) {
    console.log('✅ Options validation test passed');
    return true;
  } else {
    console.error('❌ Options validation test failed');
    return false;
  }
}

// Test integration creation
function testIntegrationCreation() {
  console.log('Testing integration creation...');
  
  const dashboard = new KnowledgeMetricsDashboard();
  const integration = new KnowledgeMetricsIntegration(dashboard);
  
  if (integration.dashboard === dashboard) {
    console.log('✅ Integration creation test passed');
    return true;
  } else {
    console.error('❌ Integration creation test failed');
    return false;
  }
}

// Run tests
(function runTests() {
  const results = {
    metricCreation: testMetricCreation(),
    dashboardCreation: testDashboardCreation(),
    clientValidation: testClientValidation(),
    optionsValidation: testOptionsValidation(),
    integrationCreation: testIntegrationCreation()
  };
  
  const allPassed = Object.values(results).every(result => result === true);
  
  console.log('');
  console.log('Test Results Summary:');
  console.log('--------------------------');
  Object.entries(results).forEach(([name, passed]) => {
    console.log(`${name}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  });
  console.log('--------------------------');
  console.log(`Overall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
})();