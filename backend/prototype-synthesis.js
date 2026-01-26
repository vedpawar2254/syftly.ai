/**
 * Synthesis Algorithm Prototype
 *
 * This script implements and tests the extractive synthesis algorithm
 * for combining multiple articles into a unified summary.
 */

import crypto from 'crypto';
import Parser from 'rss-parser';
import sources from './config/sources.js';

const parser = new Parser();

/**
 * Generate content hash for duplicate detection
 */
function generateContentHash(content) {
  return crypto
    .createHash('sha256')
    .update(content)
    .digest('hex');
}

/**
 * Extract first 1-2 sentences from content
 */
function extractSentences(content, maxSentences = 2) {
  if (!content) return '';

  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, ' ');

  // Split into sentences
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 10)
    .slice(0, maxSentences);

  return sentences.join('. ') + (sentences.length > 0 ? '.' : '');
}

/**
 * Check for duplicate sentences using similarity threshold
 */
function isDuplicateSentence(sentence1, sentence2, threshold = 0.8) {
  const words1 = sentence1.toLowerCase().split(/\s+/);
  const words2 = sentence2.toLowerCase().split(/\s+/);

  // Calculate Jaccard similarity
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  const intersection = [...set1].filter(x => set2.has(x));
  const union = new Set([...set1, ...set2]);

  const similarity = intersection.length / union.length;
  return similarity >= threshold;
}

/**
 * Synthesize multiple articles into a unified summary
 */
function synthesizeArticles(articles, topic) {
  console.log(`Synthesizing ${articles.length} articles on topic: ${topic}\n`);

  // Step 1: Sort articles by relevance (title match first, then date)
  const sortedArticles = [...articles].sort((a, b) => {
    const aInTitle = a.title.toLowerCase().includes(topic.toLowerCase());
    const bInTitle = b.title.toLowerCase().includes(topic.toLowerCase());

    if (aInTitle && !bInTitle) return -1;
    if (!aInTitle && bInTitle) return 1;

    // Then by date (newest first)
    const aDate = new Date(a.pubDate || 0);
    const bDate = new Date(b.pubDate || 0);
    return bDate - aDate;
  });

  // Step 2: Extract sentences from each article
  const extractedSentences = sortedArticles.map(article => {
    const sentence = extractSentences(article.description || article['content:encoded']);
    return {
      sentence,
      source: article.source,
      title: article.title,
      contentHash: generateContentHash(sentence)
    };
  });

  // Step 3: Remove duplicates and near-duplicates
  const uniqueSentences = [];
  const seenHashes = new Set();

  for (const item of extractedSentences) {
    // Skip if exact duplicate (same hash)
    if (seenHashes.has(item.contentHash)) {
      console.log(`Skipping exact duplicate from ${item.source}`);
      continue;
    }

    // Check for near-duplicates
    const isNearDuplicate = uniqueSentences.some(existing =>
      isDuplicateSentence(item.sentence, existing.sentence)
    );

    if (isNearDuplicate) {
      console.log(`Skipping near-duplicate from ${item.source}`);
      continue;
    }

    uniqueSentences.push(item);
    seenHashes.add(item.contentHash);
  }

  // Step 4: Build summary with source attribution
  const summaryParts = uniqueSentences.map(item =>
    `[${item.source}] ${item.sentence}`
  );

  const summary = summaryParts.join(' ');

  // Step 5: Check word count
  const wordCount = summary.split(/\s+/).length;

  // Step 6: Limit to 150-300 words
  let finalSummary = summary;
  if (wordCount > 300) {
    console.log(`Summary too long (${wordCount} words), trimming...`);
    const words = summary.split(/\s+/).slice(0, 300);
    finalSummary = words.join(' ') + '...';
  }

  const finalWordCount = finalSummary.split(/\s+/).length;
  const sourcesRepresented = new Set(uniqueSentences.map(s => s.source)).size;

  console.log(`\nSynthesis complete:`);
  console.log(`  Input articles: ${articles.length}`);
  console.log(`  Unique sentences: ${uniqueSentences.length}`);
  console.log(`  Sources represented: ${sourcesRepresented}`);
  console.log(`  Final word count: ${finalWordCount}`);

  return {
    summary: finalSummary,
    wordCount: finalWordCount,
    sourcesRepresented,
    sourceCount: sourcesRepresented,
    articleIds: articles.map(a => a.id),
    articleCount: articles.length
  };
}

/**
 * Create sample articles for testing
 */
function createSampleArticles() {
  return [
    {
      id: '1',
      title: 'Elections 2024 results announced',
      description: 'The Election Commission announced final results for the 2024 general elections, with voter turnout reaching a record 67% across all states.',
      source: 'The Hindu',
      pubDate: '2024-06-04T10:00:00Z'
    },
    {
      id: '2',
      title: 'Counting of votes concludes',
      description: 'Counting of votes concluded across all constituencies early this morning, with the ruling party securing a comfortable majority in the Lok Sabha.',
      source: 'Times of India',
      pubDate: '2024-06-04T11:30:00Z'
    },
    {
      id: '3',
      title: 'Exit polls predictions',
      description: 'Exit polls had predicted a close contest in several states, but the final results showed a decisive victory for the incumbent government.',
      source: 'Indian Express',
      pubDate: '2024-06-04T12:00:00Z'
    },
    {
      id: '4',
      title: 'Opposition raises EVM concerns',
      description: 'Opposition parties have raised concerns about Electronic Voting Machine reliability and demanded a recount in certain constituencies.',
      source: 'The Hindu',
      pubDate: '2024-06-04T13:00:00Z'
    },
    {
      id: '5',
      title: 'New government to take oath',
      description: 'The new government is expected to take oath within the next week, with senior ministers being finalized by the party leadership.',
      source: 'Times of India',
      pubDate: '2024-06-04T14:00:00Z'
    },
    {
      id: '6',
      title: 'International observers certify election',
      description: 'International observers have certified the election as free and fair, praising the peaceful conduct of polling across the country.',
      source: 'Indian Express',
      pubDate: '2024-06-04T15:00:00Z'
    },
    {
      id: '7',
      title: 'Voter turnout record high',
      description: 'The Election Commission announced final results for the 2024 general elections, with voter turnout reaching a record 67% across all states.',
      source: 'Times of India',
      pubDate: '2024-06-04T10:30:00Z'
    }, // Duplicate of article 1
    {
      id: '8',
      title: 'PM congratulates voters',
      description: 'Prime Minister thanked citizens for participating in the democratic process and exercising their franchise in record numbers.',
      source: 'The Hindu',
      pubDate: '2024-06-04T16:00:00Z'
    },
    {
      id: '9',
      title: 'Stock market reacts',
      description: 'Stock markets opened positively as election results aligned with market expectations, with major indices gaining over 2%.',
      source: 'Times of India',
      pubDate: '2024-06-04T16:30:00Z'
    },
    {
      id: '10',
      title: 'State-wise breakdown',
      description: 'Detailed state-wise results show the ruling party retained key states while opposition made inroads in some regions.',
      source: 'Indian Express',
      pubDate: '2024-06-04T17:00:00Z'
    }
  ];
}

/**
 * Test synthesis with sample articles
 */
function testSynthesis() {
  console.log('=== Synthesis Algorithm Prototype Test ===\n');

  const articles = createSampleArticles();
  const topic = 'elections';

  console.log(`Input: ${articles.length} sample articles`);
  console.log(`Topic: ${topic}`);
  console.log('');

  const result = synthesizeArticles(articles, topic);

  console.log('\n--- Generated Summary ---\n');
  console.log(result.summary);
  console.log('\n--- End of Summary ---\n');

  console.log('--- Quality Metrics ---\n');
  console.log(`Word count: ${result.wordCount} (target: 150-300)`);
  console.log(`Sources represented: ${result.sourcesRepresented}/3`);
  console.log(`Articles used: ${result.articleCount}`);

  const wordCountValid = result.wordCount >= 150 && result.wordCount <= 300;
  const sourcesValid = result.sourcesRepresented >= 2;

  console.log(`\nValidation:`);
  console.log(`  Word count valid: ${wordCountValid ? '✅' : '❌'} (${result.wordCount} words)`);
  console.log(`  Sources valid: ${sourcesValid ? '✅' : '❌'} (${result.sourcesRepresented} sources)`);

  const passed = wordCountValid && sourcesValid;
  console.log(`\nOverall: ${passed ? '✅ PASSED' : '❌ FAILED'}`);

  return passed;
}

/**
 * Test with real articles from RSS feeds
 */
async function testWithRealFeeds() {
  console.log('\n=== Testing with Real RSS Feeds ===\n');

  const topic = 'elections';
  const allArticles = [];

  for (const source of sources) {
    try {
      console.log(`Fetching from ${source.name}...`);
      const feed = await parser.parseURL(source.url);

      // Filter articles matching the topic
      const matchingArticles = feed.items
        .filter(item => {
          const titleMatch = item.title.toLowerCase().includes(topic);
          const contentMatch = item.description?.toLowerCase().includes(topic);
          return titleMatch || contentMatch;
        })
        .slice(0, 10) // Take first 10 matches
        .map(item => ({
          id: generateContentHash(item.link),
          title: item.title,
          description: item.description,
          source: source.name,
          pubDate: item.pubDate
        }));

      console.log(`  Found ${matchingArticles.length} articles matching "${topic}"`);
      allArticles.push(...matchingArticles);
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`);
    }
  }

  console.log(`\nTotal articles fetched: ${allArticles.length}`);

  if (allArticles.length >= 2) {
    console.log('Running synthesis...\n');
    const result = synthesizeArticles(allArticles, topic);

    console.log('\n--- Generated Summary ---\n');
    console.log(result.summary);
    console.log('\n--- End of Summary ---\n');

    console.log(`Metrics: ${result.wordCount} words, ${result.sourcesRepresented} sources`);
  } else {
    console.log('Not enough articles to run synthesis.');
  }
}

/**
 * Main execution
 */
async function main() {
  // Test with sample articles
  const sampleTestPassed = testSynthesis();

  // Test with real feeds (optional, can be commented out)
  await testWithRealFeeds();

  console.log('\n=== Synthesis Algorithm Validation Complete ===\n');

  if (sampleTestPassed) {
    console.log('✅ Synthesis algorithm validation PASSED.');
    console.log('Algorithm is ready for implementation.');
    process.exit(0);
  } else {
    console.log('❌ Synthesis algorithm validation FAILED.');
    console.log('Algorithm needs refinement.');
    process.exit(1);
  }
}

// Run the tests
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
