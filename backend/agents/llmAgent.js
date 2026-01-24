/**
 * LLM Agent
 *
 * Performs semantic topic matching and abstractive synthesis
 * of multiple articles into a unified summary with source attribution.
 */

/**
 * System prompt for the LLM
 */
const SYSTEM_PROMPT = `You are an expert news analyst who synthesizes information from multiple Indian news sources.

Your task:
1. Review the articles and determine which are relevant to the given topic
2. Filter out irrelevant articles
3. Synthesize the relevant articles into ONE coherent summary (200-300 words)
4. Include source attribution for key points (e.g., "According to The Hindu...")
5. Highlight main events and any differing perspectives
6. Write in a clear, journalistic style

Guidelines:
- The summary should be abstractive (not just concatenated snippets)
- Include at least 2-3 different sources if available
- Mention specific facts, numbers, quotes, or statements with source attribution
- If sources disagree on facts, note the discrepancy
- Keep the summary focused on the topic
- Write in the past tense for events that have occurred
- Avoid editorializing or adding opinions not supported by sources`;

/**
 * Format articles for the LLM prompt
 */
function formatArticlesForPrompt(articles) {
  return articles.map((article, index) => {
    return `
--- Article ${index + 1} ---
Source: ${article.source}
Title: ${article.title}
URL: ${article.url}
Content: ${article.content}
---
`;
  }).join('\n');
}

/**
 * Create the synthesis prompt
 */
function createSynthesisPrompt(topic, articles) {
  const articlesText = formatArticlesForPrompt(articles);
  
  return `Topic: "${topic}"

${articlesText}

Review these articles and:
1. Filter out irrelevant articles (don't mention them)
2. Synthesize the relevant articles into ONE coherent summary (200-300 words)
3. Include source attribution for key points (e.g., "According to The Hindu...", "The Times of India reports...")
4. Highlight main events and any differing perspectives

Return a JSON object with this structure:
{
  "summary": "Your synthesized summary here",
  "sourcesUsed": ["list of source names you referenced"],
  "matchedArticleIds": [indices of articles you used]
}`;
}

/**
 * Parse the LLM response to extract JSON
 */
function parseLLMResponse(responseText) {
  try {
    // Try to find JSON in the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If no JSON found, create a simple response
    return {
      summary: responseText,
      sourcesUsed: [],
      matchedArticleIds: []
    };
  } catch (error) {
    console.error('Failed to parse LLM response:', error.message);
    return {
      summary: responseText,
      sourcesUsed: [],
      matchedArticleIds: []
    };
  }
}

/**
 * Main function: Synthesize articles into a unified summary
 */
export async function synthesizeArticles(topic, articles, llm) {
  console.log('\n🤖 Starting LLM synthesis...');
  console.log(`  Topic: "${topic}"`);
  console.log(`  Articles: ${articles.length}`);
  
  // Edge case: No articles (should be handled earlier, but just in case)
  if (!articles || articles.length === 0) {
    return {
      summary: '',
      sourcesUsed: [],
      matchedArticleIds: []
    };
  }
  
  // Create the prompt
  const prompt = createSynthesisPrompt(topic, articles);
  
  try {
    console.log('  Sending prompt to LLM...');
    
    // Invoke the LLM with the system prompt and user prompt
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ];
    
    const result = await llm.invoke(messages);
    const responseText = result.content;
    
    // Parse the response
    const parsed = parseLLMResponse(responseText);
    
    console.log('  ✓ LLM synthesis complete');
    console.log(`  Summary length: ${parsed.summary.length} words`);
    console.log(`  Sources used: ${parsed.sourcesUsed.length}`);
    console.log(`  Articles used: ${parsed.matchedArticleIds.length}\n`);
    
    return parsed;
  } catch (error) {
    console.error('❌ LLM synthesis failed:', error.message);
    
    // Fallback: Create a simple concatenation summary
    console.log('  Using fallback summary method...');
    const fallbackSummary = createFallbackSummary(topic, articles);
    
    return {
      summary: fallbackSummary.text,
      sourcesUsed: fallbackSummary.sources,
      matchedArticleIds: articles.map((_, i) => i)
    };
  }
}

/**
 * Fallback summary method in case LLM fails
 */
function createFallbackSummary(topic, articles) {
  const sources = [...new Set(articles.map(a => a.source))];
  const summary = `Multiple sources reported on ${topic}. According to ${sources.join(' and ')}, the situation involves ongoing developments with key information being reported across various news outlets. Further updates are expected as the story develops.`;
  
  return {
    text: summary,
    sources
  };
}

/**
 * Validate the summary quality
 */
export function validateSummary(summary, sourcesUsed) {
  const issues = [];
  
  // Check length
  const wordCount = summary.split(/\s+/).length;
  if (wordCount < 50) {
    issues.push('Summary is too short (expected 200-300 words)');
  }
  if (wordCount > 400) {
    issues.push('Summary is too long (expected 200-300 words)');
  }
  
  // Check sources
  if (sourcesUsed.length < 1) {
    issues.push('No sources cited in summary');
  }
  if (sourcesUsed.length < 2) {
    issues.push('Summary should cite at least 2 sources');
  }
  
  return {
    valid: issues.length === 0,
    issues,
    wordCount
  };
}

export default {
  synthesizeArticles,
  validateSummary,
  createSynthesisPrompt
};
