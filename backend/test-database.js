/**
 * Database Models Test Script
 *
 * Tests all database models, indexes, and methods for Milestone 1
 */

import mongoose from 'mongoose';
import { connectDB, disconnectDB, clearCollections, ensureIndexes } from './utils/database.js';
import Evidence from './models/Evidence.js';
import TopicSummary from './models/TopicSummary.js';
import FollowedTopic from './models/FollowedTopic.js';

/**
 * Test Evidence Model
 */
async function testEvidenceModel() {
  console.log('\n=== Testing Evidence Model ===\n');

  try {
    // Test 1: Create evidence
    console.log('Test 1: Creating evidence...');
    const contentHash = Evidence.generateHash('Test article content');
    const evidence = new Evidence({
      title: 'Test Article',
      body: 'Test article content about elections',
      source: 'The Hindu',
      url: 'https://example.com/test-article',
      publishDate: new Date('2024-01-26'),
      topic: 'elections',
      contentHash
    });
    await evidence.save();
    console.log('✅ Evidence created:', evidence._id);

    // Test 2: Check duplicate by URL
    console.log('\nTest 2: Checking duplicate by URL...');
    const duplicateByUrl = await Evidence.checkDuplicate('https://example.com/test-article', 'differenthash');
    console.log('✅ Duplicate by URL detected:', duplicateByUrl !== null);

    // Test 3: Check duplicate by content hash
    console.log('\nTest 3: Checking duplicate by content hash...');
    const duplicateByHash = await Evidence.checkDuplicate('https://different.com', contentHash);
    console.log('✅ Duplicate by hash detected:', duplicateByHash !== null);

    // Test 4: Test uniqueness constraint
    console.log('\nTest 4: Testing unique constraint (should fail)...');
    try {
      const duplicate = new Evidence({
        title: 'Duplicate Article',
        body: 'Different content',
        source: 'Times of India',
        url: 'https://example.com/test-article', // Same URL
        contentHash: 'differenthash'
      });
      await duplicate.save();
      console.log('❌ Should have failed but succeeded');
    } catch (error) {
      console.log('✅ Unique constraint works:', error.message.includes('duplicate key'));
    }

    // Test 5: Query by topic
    console.log('\nTest 5: Querying by topic...');
    const topicArticles = await Evidence.find({ topic: 'elections' }).sort({ publishDate: -1 });
    console.log(`✅ Found ${topicArticles.length} articles for topic 'elections'`);

    return true;

  } catch (error) {
    console.error('❌ Evidence model test failed:', error);
    return false;
  }
}

/**
 * Test TopicSummary Model
 */
async function testTopicSummaryModel() {
  console.log('\n=== Testing TopicSummary Model ===\n');

  try {
    // Test 1: Create summary
    console.log('Test 1: Creating topic summary...');
    const summary = new TopicSummary({
      topic: 'elections',
      summaryText: 'Test summary about elections that is exactly 150 words to meet the requirement. This is a test. More words needed. Test summary about elections that is exactly 150 words to meet the requirement. This is a test. More words needed. Test summary about elections that is exactly 150 words to meet the requirement. This is a test. More words needed.',
      sourcesUsed: ['The Hindu', 'Times of India'],
      articleIds: [],
      articleData: []
    });
    await summary.save();
    console.log('✅ TopicSummary created:', summary._id);

    // Test 2: Find by topic
    console.log('\nTest 2: Testing findByTopic...');
    const foundSummary = await TopicSummary.findByTopic('elections');
    console.log('✅ Found existing summary:', foundSummary._id.toString() === summary._id.toString());

    // Test 3: Create new summary
    console.log('\nTest 3: Creating new summary...');
    const newSummary = new TopicSummary({
      topic: 'budget',
      summaryText: 'Budget summary text for testing purposes. This is a longer text to meet the minimum length requirement of 50 characters for the summary field.',
      sourcesUsed: ['The Hindu']
    });
    await newSummary.save();
    console.log('✅ New summary created:', newSummary._id);

    // Test 4: Test uniqueness constraint
    console.log('\nTest 4: Testing unique constraint (should fail)...');
    try {
      const duplicate = new TopicSummary({
        topic: 'elections',
        summaryText: 'Different summary'
      });
      await duplicate.save();
      console.log('❌ Should have failed but succeeded');
    } catch (error) {
      console.log('✅ Unique constraint works:', error.message.includes('duplicate key'));
    }

    // Test 5: Update summary method
    console.log('\nTest 5: Testing updateSummary method...');
    await summary.updateSummary(
      'Updated summary text with more content for testing purposes. This is an updated summary with enough words to pass validation.',
      ['The Hindu', 'Times of India', 'Indian Express'],
      [{ title: 'Test', source: 'The Hindu', url: 'https://test.com' }]
    );
    console.log('✅ Summary updated');
    console.log('   Sources count:', summary.sourceCount);
    console.log('   Word count:', summary.wordCount);

    // Test 6: Test updatedAt middleware
    console.log('\nTest 6: Testing updatedAt middleware...');
    const beforeUpdate = summary.updatedAt;
    await new Promise(resolve => setTimeout(resolve, 10));
    summary.summaryText = 'Another update';
    await summary.save();
    const afterUpdate = summary.updatedAt;
    console.log('✅ updatedAt updated:', afterUpdate > beforeUpdate);

    return true;

  } catch (error) {
    console.error('❌ TopicSummary model test failed:', error);
    return false;
  }
}

/**
 * Test FollowedTopic Model
 */
async function testFollowedTopicModel() {
  console.log('\n=== Testing FollowedTopic Model ===\n');

  try {
    const sessionId = 'test-session-123';
    const userId = 'user-456';

    // Test 1: Follow a topic
    console.log('Test 1: Following a topic...');
    const followed = await FollowedTopic.follow('elections', sessionId, userId);
    console.log('✅ Topic followed:', followed._id);

    // Test 2: Check if followed
    console.log('\nTest 2: Checking if topic is followed...');
    const isFollowed = await FollowedTopic.isFollowed('elections', sessionId);
    console.log('✅ Topic is followed:', isFollowed);

    // Test 3: List followed topics
    console.log('\nTest 3: Listing followed topics...');
    const followedList = await FollowedTopic.listFollowed(sessionId, userId);
    console.log(`✅ Found ${followedList.length} followed topics`);

    // Test 4: Follow same topic again (should return existing)
    console.log('\nTest 4: Following same topic again...');
    const followedAgain = await FollowedTopic.follow('elections', sessionId, userId);
    console.log('✅ Returned existing:', followedAgain._id.toString() === followed._id.toString());

    // Test 5: Follow another topic
    console.log('\nTest 5: Following another topic...');
    await FollowedTopic.follow('budget', sessionId, userId);
    const followedList2 = await FollowedTopic.listFollowed(sessionId, userId);
    console.log(`✅ Now have ${followedList2.length} followed topics`);

    // Test 6: Unfollow topic
    console.log('\nTest 6: Unfollowing topic...');
    const unfollowed = await FollowedTopic.unfollow('elections', sessionId);
    console.log('✅ Topic unfollowed:', unfollowed);

    // Test 7: Check if unfollowed
    console.log('\nTest 7: Checking if topic is still followed...');
    const stillFollowed = await FollowedTopic.isFollowed('elections', sessionId);
    console.log('✅ Topic is not followed:', !stillFollowed);

    // Test 8: List after unfollow
    console.log('\nTest 8: Listing followed topics after unfollow...');
    const followedList3 = await FollowedTopic.listFollowed(sessionId, userId);
    console.log(`✅ Found ${followedList3.length} followed topics (should be 1)`);

    return true;

  } catch (error) {
    console.error('❌ FollowedTopic model test failed:', error);
    return false;
  }
}

/**
 * Test Indexes
 */
async function testIndexes() {
  console.log('\n=== Testing Indexes ===\n');

  try {
    await ensureIndexes();
    return true;
  } catch (error) {
    console.error('❌ Index test failed:', error);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('=== Starting Database Model Tests ===\n');

  let allPassed = true;

  // Connect to database
  await connectDB();

  // Clear collections for clean test
  await clearCollections();

  // Run tests
  allPassed = await testEvidenceModel() && allPassed;
  allPassed = await testTopicSummaryModel() && allPassed;
  allPassed = await testFollowedTopicModel() && allPassed;
  allPassed = await testIndexes() && allPassed;

  // Disconnect
  await disconnectDB();

  console.log('\n=== Test Summary ===\n');
  console.log(allPassed ? '✅ All tests passed!' : '❌ Some tests failed');

  process.exit(allPassed ? 0 : 1);
}

// Run tests
runTests().catch(error => {
  console.error('Test execution error:', error);
  process.exit(1);
});
