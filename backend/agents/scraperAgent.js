/**
 * Scraper Agent
 *
 * Fetches articles from Indian news RSS feeds and returns them
 * in a structured format for the LLM to process.
 */

import Parser from 'rss-parser';
import sources from '../config/sources.js';

const parser = new Parser();
const FETCH_TIMEOUT = 10000; // 10 seconds timeout per feed

/**
 * Fetch articles from a single RSS feed with timeout protection
 */
async function fetchFromFeed(source) {
  try {
    // Use Promise.race for timeout since rss-parser doesn't support AbortSignal
    const feedPromise = parser.parseURL(source.url);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), FETCH_TIMEOUT);
    });
    
    const feed = await Promise.race([feedPromise, timeoutPromise]);
    
    // Transform RSS items to article objects
    const articles = feed.items ? feed.items.map(item => ({
      title: item.title || '',
      content: item.contentSnippet || item.content || item.description || '',
      source: source.name,
      url: item.link || '',
      publishDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      guid: item.guid || `${source.name}-${item.link}`
    })) : [];
    
    console.log(`  ✓ ${source.name}: ${articles.length} articles`);
    return { source: source.name, articles, success: true };
  } catch (error) {
    console.log(`  ✗ ${source.name}: ${error.message} (skipping)`);
    return { source: source.name, articles: [], success: false, error: error.message };
  }
}

/**
 * Filter articles based on topic relevance (simple keyword matching)
 * Note: The LLM will do semantic matching, this is just a pre-filter
 */
function filterArticlesByTopic(articles, topic) {
  if (!topic || topic.trim() === '') {
    return articles;
  }
  
  const topicLower = topic.toLowerCase();
  const topicWords = topicLower.split(/\s+/).filter(w => w.length > 2);
  
  // If no significant words, return all articles
  if (topicWords.length === 0) {
    return articles;
  }
  
  return articles.filter(article => {
    const textToSearch = `${article.title} ${article.content}`.toLowerCase();
    
    // Check if at least one topic word appears in the article
    return topicWords.some(word => textToSearch.includes(word));
  });
}

/**
 * Fetch articles from all configured RSS feeds
 */
export async function fetchAllArticles() {
  console.log('📰 Fetching articles from all sources...');
  
  const allArticles = [];
  const feedResults = [];
  
  for (const source of sources) {
    const result = await fetchFromFeed(source);
    feedResults.push(result);
    allArticles.push(...result.articles);
  }
  
  const successfulSources = feedResults.filter(r => r.success).length;
  const totalArticles = allArticles.length;
  
  console.log(`\n📊 Summary: ${successfulSources}/${sources.length} sources, ${totalArticles} total articles\n`);
  
  return {
    articles: allArticles,
    feedResults,
    successfulSources,
    totalArticles
  };
}

/**
 * Main function: Fetch articles filtered by topic
 * This is what the LangGraph workflow will call
 */
export async function fetchArticlesByTopic(topic) {
  console.log(`\n📰 Fetching articles for topic: "${topic}"`);
  
  // Fetch all articles from all sources
  const { articles, feedResults, successfulSources, totalArticles } = await fetchAllArticles();
  
  // Handle source failures - we still return what we got from successful sources
  if (successfulSources === 0) {
    console.error('❌ All sources failed to fetch articles');
    return [];
  }
  
  // Filter articles by topic (pre-filter)
  const filteredArticles = filterArticlesByTopic(articles, topic);
  
  console.log(`  Filtered to ${filteredArticles.length} relevant articles\n`);
  
  // Sort by publication date (newest first)
  filteredArticles.sort((a, b) => b.publishDate - a.publishDate);
  
  // Limit to top 20 articles for LLM processing (to manage costs and latency)
  const limitedArticles = filteredArticles.slice(0, 20);
  
  console.log(`  Returning top ${limitedArticles.length} articles for synthesis\n`);
  
  return limitedArticles;
}

/**
 * Get article statistics
 */
export function getArticleStats(articles) {
  const stats = {
    total: articles.length,
    sources: [...new Set(articles.map(a => a.source))],
    dateRange: {
      oldest: null,
      newest: null
    }
  };
  
  if (articles.length > 0) {
    const dates = articles.map(a => a.publishDate);
    stats.dateRange.oldest = new Date(Math.min(...dates));
    stats.dateRange.newest = new Date(Math.max(...dates));
  }
  
  return stats;
}

export default {
  fetchArticlesByTopic,
  fetchAllArticles,
  getArticleStats
};
