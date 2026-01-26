import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import { Landing, Feed, NotFound } from "./pages";
import FollowedTopics from "./components/FollowedTopics";
import { getFollowedTopics } from "./utils/storage.js";

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
