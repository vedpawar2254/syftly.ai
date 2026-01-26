/**
 * FollowedTopics Component
 * Displays list of followed topics in sidebar or dropdown
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFollowedTopics, removeFollowedTopic } from '../utils/storage.js';
import { unfollowTopic } from '../api/feed.js';

export default function FollowedTopics({ onTopicSelect }) {
    const [followedTopics, setFollowedTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Load followed topics on mount
    useEffect(() => {
        loadFollowedTopics();
    }, []);

    const loadFollowedTopics = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get from localStorage first for instant display
            const localTopics = getFollowedTopics();
            setFollowedTopics(localTopics);

            // Optionally sync with backend (commented out for now)
            // await syncWithBackend();
        } catch (err) {
            setError('Failed to load followed topics');
            console.error('Load followed topics error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTopicClick = (topic) => {
        if (onTopicSelect) {
            onTopicSelect(topic);
        } else {
            navigate(`/feed/${encodeURIComponent(topic)}`);
        }
    };

    const handleUnfollow = async (e, topic) => {
        e.stopPropagation(); // Prevent navigation to topic

        try {
            // Update UI optimistically
            setFollowedTopics(prev => prev.filter(t => t.topic !== topic));

            // Remove from localStorage
            removeFollowedTopic(topic);

            // Unfollow from backend
            await unfollowTopic(topic);
        } catch (err) {
            setError('Failed to unfollow topic');
            console.error('Unfollow error:', err);
            // Reload to revert optimistic update
            loadFollowedTopics();
        }
    };

    if (loading) {
        return (
            <div className="followed-topics">
                <div className="followed-topics__loading">Loading followed topics...</div>
                <style>{`
                    .followed-topics__loading {
                        padding: 1.5rem;
                        text-align: center;
                        color: #666;
                        font-size: 0.875rem;
                    }
                `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div className="followed-topics">
                <div className="followed-topics__error">{error}</div>
                <style>{`
                    .followed-topics__error {
                        padding: 1rem;
                        background: #fee2e2;
                        color: #991b1b;
                        border-radius: 4px;
                        font-size: 0.875rem;
                    }
                `}</style>
            </div>
        );
    }

    if (followedTopics.length === 0) {
        return (
            <div className="followed-topics">
                <div className="followed-topics__empty">
                    <span className="followed-topics__icon">📌</span>
                    <p className="followed-topics__message">No topics followed yet</p>
                </div>
                <style>{`
                    .followed-topics__empty {
                        padding: 2rem 1.5rem;
                        text-align: center;
                        color: #999;
                    }

                    .followed-topics__icon {
                        font-size: 2.5rem;
                        display: block;
                        margin-bottom: 0.75rem;
                    }

                    .followed-topics__message {
                        margin: 0;
                        font-size: 0.875rem;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="followed-topics">
            <div className="followed-topics__header">
                <h3 className="followed-topics__title">
                    Followed Topics
                </h3>
                <span className="followed-topics__count">
                    {followedTopics.length}
                </span>
            </div>

            <ul className="followed-topics__list">
                {followedTopics.map((item, index) => (
                    <li key={`${item.topic}-${index}`} className="followed-topics__item">
                        <button
                            onClick={() => handleTopicClick(item.topic)}
                            className="followed-topics__link"
                            title={item.topic}
                        >
                            {item.topic}
                        </button>

                        <button
                            onClick={(e) => handleUnfollow(e, item.topic)}
                            className="followed-topics__unfollow"
                            title={`Unfollow ${item.topic}`}
                            aria-label={`Unfollow ${item.topic}`}
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>

            <style>{`
                .followed-topics {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }

                .followed-topics__header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 1.25rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .followed-topics__title {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 600;
                }

                .followed-topics__count {
                    background: rgba(255, 255, 255, 0.2);
                    padding: 0.25rem 0.75rem;
                    border-radius: 12px;
                    font-size: 0.875rem;
                    font-weight: 700;
                }

                .followed-topics__list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    max-height: 400px;
                    overflow-y: auto;
                }

                .followed-topics__list::-webkit-scrollbar {
                    width: 6px;
                }

                .followed-topics__list::-webkit-scrollbar-thumb {
                    background: #ccc;
                    border-radius: 3px;
                }

                .followed-topics__item {
                    display: flex;
                    align-items: center;
                    padding: 0.75rem 1.25rem;
                    border-bottom: 1px solid #f0f0f0;
                    transition: background 0.2s;
                }

                .followed-topics__item:hover {
                    background: #f9fafb;
                }

                .followed-topics__item:last-child {
                    border-bottom: none;
                }

                .followed-topics__link {
                    flex: 1;
                    background: none;
                    border: none;
                    padding: 0.5rem 0.75rem;
                    text-align: left;
                    font-size: 0.875rem;
                    color: #333;
                    cursor: pointer;
                    border-radius: 4px;
                    font-weight: 500;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    transition: all 0.2s;
                }

                .followed-topics__link:hover {
                    background: #e0e7ff;
                    color: #667eea;
                }

                .followed-topics__unfollow {
                    width: 24px;
                    height: 24px;
                    background: none;
                    border: none;
                    border-radius: 4px;
                    color: #999;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    transition: all 0.2s;
                    flex-shrink: 0;
                    margin-left: 0.5rem;
                }

                .followed-topics__unfollow:hover {
                    background: #fee2e2;
                    color: #991b1b;
                }
            `}</style>
        </div>
    );
}
