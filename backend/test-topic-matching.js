/**
 * Topic Matching Sandbox Test
 *
 * This script tests the topic matching logic with various edge cases
 * to ensure accurate article-topic matching with acceptable false positive/negative rates.
 */

import Parser from 'rss-parser';
import sources from './config/sources.js';

const parser = new Parser();

/**
 * Case-insensitive topic matching
 */
function matchesTopic(article, topic) {
  if (!article || !topic) return false;

  const topicLower = topic.toLowerCase().trim();

  // Check title (higher priority)
  if (article.title && article.title.toLowerCase().includes(topicLower)) {
    return { matched: true, inTitle: true };
  }

  // Check description/content
  const content = article.description || article['content:encoded'] || '';
  if (content.toLowerCase().includes(topicLower)) {
    return { matched: true, inTitle: false };
  }

  return { matched: false, inTitle: false };
}

/**
 * Test cases for topic matching
 */
const testCases = [
  // Positive test cases (should match)
  { topic: 'elections', title: 'Elections 2024 results announced', description: 'The Election Commission announced final results...', expected: true },
  { topic: 'elections', title: 'ELECTION VOTER TURNOUT HITS RECORD HIGH', description: 'Voter turnout...', expected: true },
  { topic: 'ISRO', title: 'ISRO launches new satellite', description: 'Indian Space Research Organization successfully launched...', expected: true },
  { topic: 'ISRO', title: 'isro mission success', description: 'The mission was successful...', expected: true },
  { topic: 'cricket', title: 'India wins Cricket World Cup', description: 'Team India celebrated...', expected: true },
  { topic: 'cricket', title: 'Cricket team selected for Asia Cup', description: 'The BCCI announced...', expected: true },
  { topic: 'budget', title: 'Union Budget 2024 presented', description: 'Finance Minister presented...', expected: true },
  { topic: 'election', title: 'Elections 2024 results', description: 'Results declared...', expected: true }, // Partial match

  // Negative test cases (should not match)
  { topic: 'rocket', title: 'ISRO launches satellite', description: 'Indian Space Research Organization launched...', expected: false },
  { topic: 'football', title: 'Cricket World Cup', description: 'India wins...', expected: false },
];

/**
 * Edge cases to test
 */
const edgeCases = [
  { topic: 'ELECTIONS', title: 'elections results', description: '...', test: 'Case-insensitivity' },
  { topic: '  elections  ', title: 'elections results', description: '...', test: 'Whitespace trimming' },
  { topic: 'ISRO launches', title: 'ISRO launches satellite', description: '...', test: 'Multi-word topic' },
  { topic: 'India-China', title: 'India-China border talks', description: '...', test: 'Special characters' },
  { topic: 'G20 summit', title: 'G20 summit to be held', description: '...', test: 'Numbers in topic' },
];

/**
 * Run test cases
 */
function runTests() {
  console.log('=== Topic Matching Tests ===\n');

  let passed = 0;
  let failed = 0;
  let falsePositives = 0;
  let falseNegatives = 0;

  console.log('--- Standard Test Cases ---\n');

  testCases.forEach((testCase, index) => {
    const article = { title: testCase.title, description: testCase.description };
    const result = matchesTopic(article, testCase.topic);
    const actualMatch = result.matched;

    let status;
    if (actualMatch === testCase.expected) {
      status = '✅ PASS';
      passed++;
    } else {
      status = '❌ FAIL';
      failed++;

      if (testCase.expected && !actualMatch) {
        falseNegatives++;
      } else if (!testCase.expected && actualMatch) {
        falsePositives++;
      }
    }

    console.log(`Test ${index + 1}: ${status}`);
    console.log(`  Topic: "${testCase.topic}"`);
    console.log(`  Article: "${testCase.title}"`);
    console.log(`  Expected: ${testCase.expected}, Actual: ${actualMatch}`);
    if (result.matched) {
      console.log(`  Matched in: ${result.inTitle ? 'Title' : 'Content'}`);
    }
    console.log('');
  });

  console.log('--- Edge Case Tests ---\n');

  edgeCases.forEach((edgeCase, index) => {
    const article = { title: edgeCase.title, description: edgeCase.description };
    const result = matchesTopic(article, edgeCase.topic);

    console.log(`Edge Case ${index + 1}: ${edgeCase.test}`);
    console.log(`  Topic: "${edgeCase.topic}"`);
    console.log(`  Article: "${edgeCase.title}"`);
    console.log(`  Result: ${result.matched ? '✅ Matched' : '❌ Not matched'}`);
    console.log('');
  });

  // Calculate rates
  const totalTests = testCases.length;
  const falsePositiveRate = (falsePositives / totalTests) * 100;
  const falseNegativeRate = (falseNegatives / totalTests) * 100;

  console.log('=== Test Summary ===\n');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`False Positives: ${falsePositives} (${falsePositiveRate.toFixed(1)}%)`);
  console.log(`False Negatives: ${falseNegatives} (${falseNegativeRate.toFixed(1)}%)`);
  console.log('');

  // Check threshold
  const threshold = 20;
  const passesThreshold = falsePositiveRate < threshold && falseNegativeRate < threshold;

  console.log(`Threshold: <${threshold}% for both rates`);
  console.log(`Result: ${passesThreshold ? '✅ PASSED' : '❌ FAILED'}`);
  console.log('');

  return {
    passed,
    failed,
    falsePositives,
    falseNegatives,
    falsePositiveRate,
    falseNegativeRate,
    passesThreshold
  };
}

/**
 * Test with real articles from RSS feeds
 */
async function testWithRealArticles() {
  console.log('=== Testing with Real RSS Feed Articles ===\n');

  const testTopics = ['elections', 'ISRO', 'cricket', 'budget'];
  const results = {};

  for (const source of sources) {
    console.log(`Testing source: ${source.name}`);
    try {
      const feed = await parser.parseURL(source.url);
      results[source.name] = { total: feed.items.length, matched: {} };

      for (const topic of testTopics) {
        let matchedCount = 0;
        for (const item of feed.items.slice(0, 50)) { // Test first 50 items
          const result = matchesTopic(item, topic);
          if (result.matched) matchedCount++;
        }
        results[source.name].matched[topic] = matchedCount;
        console.log(`  Topic "${topic}": ${matchedCount} articles matched`);
      }
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`);
    }
    console.log('');
  }

  return results;
}

/**
 * Main execution
 */
async function main() {
  // Run standard tests
  const testResults = runTests();

  // Test with real articles
  console.log('---\n');
  await testWithRealArticles();

  console.log('=== Validation Complete ===\n');
  console.log('Topic matching logic has been validated.');
  console.log(`False positive rate: ${testResults.falsePositiveRate.toFixed(1)}%`);
  console.log(`False negative rate: ${testResults.falseNegativeRate.toFixed(1)}%`);

  if (testResults.passesThreshold) {
    console.log('\n✅ Topic matching validation PASSED. Ready for implementation.');
    process.exit(0);
  } else {
    console.log('\n❌ Topic matching validation FAILED. Rates above threshold.');
    process.exit(1);
  }
}

// Run the tests
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
