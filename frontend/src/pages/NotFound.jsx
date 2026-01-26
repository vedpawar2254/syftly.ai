/**
 * NotFound Page
 * 404 page for invalid routes
 */

import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <div className="not-found__code">404</div>
        <h1 className="not-found__title">Page Not Found</h1>
        <p className="not-found__message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="not-found__button">
          Return Home
        </Link>

        <div className="not-found__suggestions">
          <h3 className="not-found__suggestions-title">Did you mean?</h3>
          <ul className="not-found__suggestions-list">
            <li>
              <Link to="/feed">Go to the Feed</Link>
            </li>
            <li>
              <Link to="/">Explore topics</Link>
            </li>
            <li>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                Visit our GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <style>{`
        .not-found {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 2rem;
        }

        .not-found__content {
          text-align: center;
          max-width: 600px;
          animation: fadeInUp 0.5s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .not-found__code {
          font-size: 8rem;
          font-weight: 700;
          color: #667eea;
          line-height: 1;
          margin-bottom: 1rem;
        }

        .not-found__title {
          font-size: 2.5rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 1rem;
        }

        .not-found__message {
          font-size: 1.125rem;
          color: #666;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .not-found__button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.875rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(102, 126, 234, 0.2);
        }

        .not-found__button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
        }

        .not-found__suggestions {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px solid #e5e7eb;
        }

        .not-found__suggestions-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #555;
          margin-bottom: 1rem;
        }

        .not-found__suggestions-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: center;
        }

        .not-found__suggestions-list li {
          width: 100%;
        }

        .not-found__suggestions-list a {
          display: block;
          padding: 0.75rem 1rem;
          background: white;
          color: #667eea;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .not-found__suggestions-list a:hover {
          background: #f0f4ff;
          color: #5568d3;
          transform: translateX(8px);
        }

        @media (max-width: 640px) {
          .not-found__code {
            font-size: 5rem;
          }

          .not-found__title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
}
