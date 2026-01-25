import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Feed Page
 * 
 * Main feed page for topic-based news synthesis.
 * Users can search for topics and get AI-synthesized summaries.
 */
function Feed() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [synthesis, setSynthesis] = useState(null);
  const [articlesExpanded, setArticlesExpanded] = useState(false);
  const [followedTopics, setFollowedTopics] = useState([]);

  // Generate a session ID for localStorage
  const sessionId = useMemo(() => {
    return localStorage.getItem('sessionId') || 
           Date.now().toString(36) + Math.random().toString(36).substr(2);
  }, []);
  
  useEffect(() => {
    localStorage.setItem('sessionId', sessionId);
    loadFollowedTopics();
  }, [sessionId]);

  /**
   * Load followed topics from localStorage
   */
  const loadFollowedTopics = () => {
    const stored = localStorage.getItem('followedTopics');
    if (stored) {
      try {
        setFollowedTopics(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load followed topics:', e);
      }
    }
  };

  /**
   * Save followed topics to localStorage
   */
  const saveFollowedTopics = (topics) => {
    localStorage.setItem('followedTopics', JSON.stringify(topics));
    setFollowedTopics(topics);
  };

  /**
   * Handle topic search submission
   */
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError(null);
    setSynthesis(null);
    setTopic(searchQuery);

    try {
      const response = await axios.get(`${API_BASE_URL}/feed/topic`, {
        params: { topic: searchQuery }
      });

      if (response.data.success) {
        setSynthesis(response.data.data);
        setArticlesExpanded(false);
      } else {
        setError(response.data.error || 'Failed to generate synthesis');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to connect to server'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle follow/unfollow topic
   */
  const toggleFollow = async (topicToFollow) => {
    try {
      const isFollowing = followedTopics.includes(topicToFollow);
      
      if (isFollowing) {
        // Unfollow
        const response = await axios.delete(`${API_BASE_URL}/feed/follow`, {
          data: { topic: topicToFollow, sessionId }
        });
        
        if (response.data.success) {
          const updated = followedTopics.filter(t => t !== topicToFollow);
          saveFollowedTopics(updated);
        }
      } else {
        // Follow
        const response = await axios.post(`${API_BASE_URL}/feed/follow`, {
          topic: topicToFollow,
          sessionId
        });
        
        if (response.data.success) {
          const updated = [...followedTopics, topicToFollow];
          saveFollowedTopics(updated);
        }
      }
    } catch (err) {
      console.error('Failed to toggle follow:', err);
    }
  };

  /**
   * Handle clicking on a followed topic
   */
  const handleFollowedTopicClick = (topicName) => {
    setSearchQuery(topicName);
    handleSearch(new Event('submit'));
  };

  const isFollowing = synthesis && followedTopics.includes(synthesis.topic);

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI-Powered News Synthesis
          </h1>
          <p className="text-gray-600 text-lg">
            Enter a topic to get an AI-synthesized summary from multiple Indian news sources
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter a topic (e.g., 'Indian elections', 'ISRO launches')"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium text-lg transition-colors"
            >
              {loading ? 'Synthesizing...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Fetching articles and synthesizing summary...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Synthesis Result */}
        {synthesis && !loading && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {synthesis.topic}
                </h2>
                <button
                  onClick={() => toggleFollow(synthesis.topic)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isFollowing ? 'Following' : `Follow ${synthesis.topic}`}
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {synthesis.summary}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  From {synthesis.sourceCount} sources ({synthesis.articleCount} articles)
                </p>
              </div>

              {/* Expand/Collapse Articles */}
              <button
                onClick={() => setArticlesExpanded(!articlesExpanded)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {articlesExpanded ? '▼ Hide articles' : '▶ Show articles'}
              </button>

              {/* Articles List */}
              {articlesExpanded && (
                <div className="mt-4 space-y-3 pt-4 border-t border-gray-200">
                  {synthesis.articles.map((article, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <p className="text-sm text-gray-600 mb-1">{article.source}</p>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {article.title}
                      </a>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(article.publishDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Followed Topics Section */}
        {followedTopics.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Followed Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {followedTopics.map((topicName) => (
                <button
                  key={topicName}
                  onClick={() => handleFollowedTopicClick(topicName)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  {topicName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;
