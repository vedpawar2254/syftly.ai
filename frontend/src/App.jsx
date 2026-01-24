import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import { Landing, Feed } from './pages';

/**
 * syftly.ai - Main App Component
 *
 * Routes:
 * - / : Landing / Countdown page
 * - /feed : Topic-based news synthesis feed
 * - /situation/:id : Situation deep dive (future)
 */
function App() {
  return (
    <BrowserRouter>
      <Layout>
        {/* Navigation */}
        <nav className="border-b border-gray-200 mb-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              syftly.ai
            </Link>
            <div className="flex gap-6">
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
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
