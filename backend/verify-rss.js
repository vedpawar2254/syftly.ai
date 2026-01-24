/**
 * RSS Feed Verification Script
 *
 * This script tests all configured RSS feeds to verify they are accessible
 * and returning valid data.
 */

import Parser from 'rss-parser';
import sources from './config/sources.js';

const parser = new Parser();

async function testRSSFeed(source) {
  console.log(`\nTesting: ${source.name}`);
  console.log(`URL: ${source.url}`);

  try {
    const feed = await parser.parseURL(source.url);
    console.log(`✓ Success! Found ${feed.items.length} articles`);
    console.log(`  Latest article: ${feed.items[0]?.title || 'N/A'}`);
    console.log(`  Published: ${feed.items[0]?.pubDate || 'N/A'}`);
    return { success: true, articleCount: feed.items.length, latestArticle: feed.items[0] };
  } catch (error) {
    console.log(`✗ Failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function verifyAllFeeds() {
  console.log('=== RSS Feed Verification ===');
  console.log('Testing all configured RSS feeds...\n');

  const results = [];

  for (const source of sources) {
    const result = await testRSSFeed(source);
    results.push({ source, result });
  }

  console.log('\n=== Summary ===');
  const successful = results.filter(r => r.result.success).length;
  const failed = results.filter(r => !r.result.success).length;

  console.log(`Total sources: ${sources.length}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);

  return results;
}

// Run verification
verifyAllFeeds()
  .then(results => {
    process.exit(0);
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
