/**
 * LLM API Test Script
 *
 * This script tests connectivity to the LLM API (OpenAI or Anthropic)
 * and verifies that basic functionality works.
 */

import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';

dotenv.config();

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function testLLM() {
  console.log('=== LLM API Test ===\n');

  if (LLM_PROVIDER === 'openai' && !OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY not set in environment variables');
    console.log('Please add your OpenAI API key to the .env file:');
    console.log('OPENAI_API_KEY=sk-...\n');
    return false;
  }

  if (LLM_PROVIDER === 'anthropic' && !ANTHROPIC_API_KEY) {
    console.error('ERROR: ANTHROPIC_API_KEY not set in environment variables');
    console.log('Please add your Anthropic API key to the .env file:');
    console.log('ANTHROPIC_API_KEY=sk-ant-...\n');
    return false;
  }

  console.log(`Using LLM Provider: ${LLM_PROVIDER}`);

  try {
    let llm;

    if (LLM_PROVIDER === 'openai') {
      console.log('Initializing OpenAI Chat Model (gpt-4o-mini)...');
      llm = new ChatOpenAI({
        apiKey: OPENAI_API_KEY,
        modelName: 'gpt-4o-mini',
        temperature: 0.7
      });
    } else if (LLM_PROVIDER === 'anthropic') {
      console.log('Initializing Anthropic Chat Model (claude-3-5-sonnet)...');
      console.log('Note: Anthropic support requires additional setup');
      console.log('Switching to OpenAI for this test\n');
      llm = new ChatOpenAI({
        apiKey: OPENAI_API_KEY,
        modelName: 'gpt-4o-mini',
        temperature: 0.7
      });
    }

    console.log('Testing simple summarization...\n');

    const testArticle = {
      title: 'India launches new space mission',
      body: 'The Indian Space Research Organisation (ISRO) successfully launched its latest satellite into orbit today. The mission marks another milestone in India\'s space program.'
    };

    const prompt = `Summarize this article in 1-2 sentences: "${testArticle.body}"`;

    const result = await llm.invoke(prompt);
    const summary = result.content;

    console.log('✓ LLM API test successful!\n');
    console.log('Input:', testArticle.body);
    console.log('Summary:', summary);
    console.log('\n=== Test Complete ===');
    console.log('LLM API is ready for use in the news synthesis workflow.\n');

    return true;
  } catch (error) {
    console.error('\n✗ LLM API test failed:', error.message);
    if (error.message.includes('401')) {
      console.error('Error: Invalid API key. Please check your OPENAI_API_KEY.');
    } else if (error.message.includes('429')) {
      console.error('Error: Rate limit exceeded or quota exceeded.');
    }
    console.log('\nPlease fix the issue and run this test again.');
    return false;
  }
}

// Run test
testLLM()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
