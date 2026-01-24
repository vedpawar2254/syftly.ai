/**
 * Indian News RSS Feed Sources Configuration
 *
 * These are the RSS feed URLs for major Indian news sources.
 * All feeds are validated and tested for accessibility.
 */

const sources = [
  {
    name: 'The Hindu',
    type: 'rss',
    url: 'https://www.thehindu.com/news/national/?service=rss',
    category: 'national',
    description: 'National news from The Hindu'
  },
  {
    name: 'Times of India',
    type: 'rss',
    url: 'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
    category: 'national',
    description: 'Top news from Times of India'
  },
  {
    name: 'Indian Express',
    type: 'rss',
    url: 'https://indianexpress.com/section/india/feed/',
    category: 'national',
    description: 'India news from Indian Express'
  }
];

export default sources;
