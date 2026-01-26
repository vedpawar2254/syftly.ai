import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { Landing, Feed, NotFound } from './pages';
import FollowedTopics from './components/FollowedTopics';
import { getFollowedTopics } from './utils/storage.js';

/**
 * syftly.ai - Main App Component
 *
 * Routes:
 * - / : Landing / Countdown page
 * - /feed : Topic-based news synthesis feed
 * - /feed/:topic : Specific topic view
 */
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [followedTopics, setFollowedTopics] = useState([]);

  // Load followed topics on mount
  useEffect(() => {
    const topics = getFollowedTopics();
    setFollowedTopics(topics);
  }, []);

  const handleTopicSelect = (topic) => {
    // Navigate to topic feed
    window.location.href = `/feed/${encodeURIComponent(topic)}`;
  };

  return (
    <BrowserRouter>
      <Layout>
        {/* Navigation */}
        <nav className="border-b border-gray-200 mb-8 bg-white sticky top-0 z-50">
          <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              syftly.ai
            </Link>
            
            <div className="flex gap-6 items-center">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Home
              </Link>
              <Link 
                to="/feed" 
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Feed
              </Link>
              
              {/* Followed Topics Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
                >
                  <span>Followed Topics</span>
                  <span className="text-xs">{followedTopics.length}</span>
                  <span className={`transition-transform duration-200 ${sidebarOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {/* Sidebar Dropdown */}
                {sidebarOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    <FollowedTopics onTopicSelect={handleTopicSelect} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/feed/:topic" element={<Feed />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
