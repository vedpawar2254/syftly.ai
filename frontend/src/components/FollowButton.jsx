/**
 * FollowButton Component
 * Button to follow/unfollow a topic with loading states and visual feedback
 */

import { useState } from 'react';

export default function FollowButton({ topic, isFollowed, onFollow, onUnfollow, disabled = false }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClick = async () => {
        if (loading || disabled) return;

        setLoading(true);
        setError(null);

        try {
            if (isFollowed) {
                await onUnfollow(topic);
            } else {
                await onFollow(topic);
            }
        } catch (err) {
            setError(err.message || 'Failed to update follow status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled || loading}
            className={`follow-button ${isFollowed ? 'following' : 'not-following'} ${loading ? 'loading' : ''} ${error ? 'error' : ''}`}
            aria-label={isFollowed ? `Unfollow ${topic}` : `Follow ${topic}`}
        >
            {loading ? (
                <span className="follow-button__text">
                    <span className="follow-button__spinner" />
                    Processing...
                </span>
            ) : isFollowed ? (
                <span className="follow-button__text">
                    <span className="follow-button__icon">✓</span>
                    Following {topic}
                </span>
            ) : (
                <span className="follow-button__text">
                    + Follow {topic}
                </span>
            )}

            {error && <span className="follow-button__error">Error: {error}</span>}

            <style>{`
                .follow-button {
                    padding: 0.75rem 1.5rem;
                    font-size: 1rem;
                    font-weight: 600;
                    border: 2px solid transparent;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    min-width: 180px;
                }

                .follow-button:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .follow-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .follow-button.not-following {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .follow-button.not-following:hover:not(:disabled) {
                    background: linear-gradient(135deg, #5568d3 0%, #6a3f9e 100%);
                }

                .follow-button.following {
                    background: #f0f0f0;
                    color: #333;
                    border-color: #667eea;
                }

                .follow-button.following:hover:not(:disabled) {
                    background: #e0e0e0;
                    border-color: #5568d3;
                }

                .follow-button.loading {
                    opacity: 0.7;
                    cursor: wait;
                }

                .follow-button.error {
                    background: #fee2e2;
                    color: #991b1b;
                }

                .follow-button__text {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .follow-button__icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 20px;
                    height: 20px;
                    background: #667eea;
                    color: white;
                    border-radius: 50%;
                    font-size: 0.75rem;
                }

                .follow-button.following .follow-button__icon {
                    background: #10b981;
                }

                .follow-button__spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid white;
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                .follow-button__error {
                    position: absolute;
                    top: -30px;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 4px 8px;
                    background: #fee2e2;
                    color: #991b1b;
                    font-size: 0.75rem;
                    border-radius: 4px;
                    white-space: nowrap;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </button>
    );
}
