/**
 * LangGraph News Synthesis Workflow
 *
 * This module defines a simple 2-agent LangGraph workflow:
 * 1. Scraper Agent - Fetches articles from RSS feeds
 * 2. LLM Agent - Synthesizes articles into a unified summary with source attribution
 */

import { StateGraph, END, Annotation } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import dotenv from 'dotenv';

dotenv.config();

// Define the state schema for the workflow using LangGraph's Annotation
const StateAnnotation = Annotation.Root({
  topic: Annotation({
    reducer: (prev, next) => next ?? prev,
    default: () => ''
  }),
  articles: Annotation({
    reducer: (prev, next) => next ?? prev,
    default: () => []
  }),
  summary: Annotation({
    reducer: (prev, next) => next ?? prev,
    default: () => ''
  }),
  sources: Annotation({
    reducer: (prev, next) => next ?? prev,
    default: () => []
  }),
  error: Annotation({
    reducer: (prev, next) => next ?? prev,
    default: () => null
  })
});

export { StateAnnotation };

// Initialize LLM
const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4o-mini',
  temperature: 0.7
});

/**
 * Scraper Agent Node
 * Fetches articles from RSS feeds based on the topic
 */
async function scraperAgent(state) {
  console.log('🕷️  Scraper Agent: Fetching articles...');
  
  try {
    // Import scraper dynamically to avoid circular dependencies
    const { fetchArticlesByTopic } = await import('../agents/scraperAgent.js');
    
    const articles = await fetchArticlesByTopic(state.topic);
    
    return {
      articles,
      sources: [...new Set(articles.map(a => a.source))]
    };
  } catch (error) {
    console.error('❌ Scraper Agent Error:', error.message);
    return {
      error: `Scraping failed: ${error.message}`
    };
  }
}

/**
 * LLM Agent Node
 * Synthesizes articles into a unified summary with source attribution
 */
async function llmAgent(state) {
  console.log('🤖 LLM Agent: Synthesizing summary...');
  
  // Check for errors from previous nodes
  if (state.error) {
    return { error: state.error };
  }
  
  // Edge case: No articles found
  if (!state.articles || state.articles.length === 0) {
    return {
      error: `No articles found for topic: "${state.topic}". Try a different keyword.`,
      summary: ''
    };
  }
  
  // Edge case: Single article - return it directly
  if (state.articles.length === 1) {
    const article = state.articles[0];
    return {
      summary: `${article.title}\n\n${article.content}`,
      sources: [article.source]
    };
  }
  
  try {
    // Import LLM agent dynamically
    const { synthesizeArticles } = await import('../agents/llmAgent.js');
    
    const result = await synthesizeArticles(state.topic, state.articles, llm);
    
    return {
      summary: result.summary,
      sources: result.sourcesUsed
    };
  } catch (error) {
    console.error('❌ LLM Agent Error:', error.message);
    return {
      error: `LLM synthesis failed: ${error.message}`
    };
  }
}

/**
 * Build and return the LangGraph workflow
 */
export function createNewsGraph() {
  console.log('🔧 Building LangGraph workflow...');
  
  // Create the graph
  const workflow = new StateGraph(StateAnnotation);
  
  // Add nodes
  workflow.addNode('scraper', scraperAgent);
  workflow.addNode('llm', llmAgent);
  
  // Add edges: topic -> scraper -> llm -> END
  workflow.setEntryPoint('scraper');
  workflow.addEdge('scraper', 'llm');
  workflow.addEdge('llm', END);
  
  // Compile the graph
  const app = workflow.compile();
  
  console.log('✅ LangGraph workflow built successfully!\n');
  
  return app;
}

/**
 * Execute the workflow with a given topic
 */
export async function executeNewsGraph(topic) {
  console.log(`\n🚀 Starting news synthesis for topic: "${topic}"`);
  console.log('='.repeat(60));
  
  const graph = createNewsGraph();
  
  const initialState = {
    topic,
    articles: [],
    summary: '',
    sources: [],
    error: null
  };
  
  try {
    const result = await graph.invoke(initialState);
    
    console.log('='.repeat(60));
    console.log('✅ Workflow completed!\n');
    
    return result;
  } catch (error) {
    console.error('💥 Workflow execution failed:', error);
    return {
      topic,
      articles: [],
      summary: '',
      sources: [],
      error: `Workflow error: ${error.message}`
    };
  }
}

export default {
  createNewsGraph,
  executeNewsGraph,
  StateAnnotation
};
