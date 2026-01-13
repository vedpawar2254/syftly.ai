import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Landing } from './pages';

/**
 * syftly.ai - Main App Component
 *
 * Routes:
 * - / : Landing / Countdown page
 * - /feed : Insight feed
 * - /situation/:id : Situation deep dive
 */
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
