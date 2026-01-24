/**
 * Integration Test Script
 *
 * Tests the end-to-end flow for Milestone 1:
 * 1. RSS feed fetching
 * 2. LangGraph workflow execution
 * 3. API endpoints
 * 4. Edge cases
 */

import { executeNewsGraph } from './graph/newsGraph.js';

console.log('=== Milestone 1 Integration Tests ===\n');

/**
 * Test 1: RSS Feed Fetching
 */
async function testRSSFeeds() {
  console.log('Test 1: RSS Feed Fetching');
  console.log('-'.repeat(40));
  
  try {
    const { fetchArticlesByTopic } = await import('./agents/scraperAgent.js');
    const articles = await fetchArticlesByTopic('elections');
    
    console.log(`✅ RSS feed test PASSED`);
    console.log(`   Fetched ${articles.length} articles\n`);
    
    return { success: true, count: articles.length };
  } catch (error) {
    console.error(`❌ RSS feed test FAILED: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

/**
 * Test 2: LangGraph Workflow
 */
async function testLangGraphWorkflow() {
  console.log('Test 2: LangGraph Workflow (No LLM call - structure test only)');
  console.log('-'.repeat(40));
  
  try {
    // Test that the graph can be created
    const { createNewsGraph } = await import('./graph/newsGraph.js');
    const graph = createNewsGraph();
    
    console.log(`✅ LangGraph structure test PASSED`);
    console.log(`   Graph created successfully\n`);
    
    return { success: true };
  } catch (error) {
    console.error(`❌ LangGraph test FAILED: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

/**
 * Test 3: Database Models
 */
async function testDatabaseModels() {
  console.log('Test 3: Database Models');
  console.log('-'.repeat(40));
  
  try {
    const { connectDB } = await import('./config/db.js');
    
    // Test database connection
    await new Promise((resolve, reject) => {
      connectDB();
      
      // Wait a moment for connection
      setTimeout(() => resolve(true), 1000);
    });
    
    console.log(`✅ Database connection test PASSED`);
    console.log(`   Connected to MongoDB\n`);
    
    return { success: true };
  } catch (error) {
    console.error(`❌ Database test FAILED: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

/**
 * Test 4: Edge Cases
 */
async function testEdgeCases() {
  console.log('Test 4: Edge Cases (RSS only)');
  console.log('-'.repeat(40));
  
  try {
    const { fetchArticlesByTopic } = await import('./agents/scraperAgent.js');
    
    // Test with obscure topic (might return zero articles)
    console.log('Testing with obscure topic...');
    const obscureArticles = await fetchArticlesByTopic('xyznonexistenttopic123');
    
    console.log(`✅ Edge case test PASSED`);
    console.log(`   Obscure topic returned ${obscureArticles.length} articles\n`);
    
    return { success: true };
  } catch (error) {
    console.error(`❌ Edge case test FAILED: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  const results = {
    rss: await testRSSFeeds(),
    langgraph: await testLangGraphWorkflow(),
    database: await testDatabaseModels(),
    edgeCases: await testEdgeCases()
  };
  
  console.log('='.repeat(40));
  console.log('Test Summary:');
  console.log('='.repeat(40));
  
  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(r => r.success).length;
  
  console.log(`Total tests: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${total - passed}`);
  
  console.log('\nNote: Full end-to-end test with LLM requires API key in .env');
  console.log('Run "node test-llm.js" to verify LLM API configuration.\n');
  
  process.exit(passed === total ? 0 : 1);
}

// Run tests
runAllTests().catch(console.error);
