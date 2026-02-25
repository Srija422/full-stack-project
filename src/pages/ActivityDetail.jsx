import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activities, activityCategories, feedbacks } from '../data/mockData';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import FeedbackModal from '../components/FeedbackModal';
import {
    FiArrowLeft, FiMapPin, FiClock, FiCalendar, FiUsers,
    FiStar, FiCheckCircle, FiHeart
} from 'react-icons/fi';
import './ActivityDetail.css';

export default function ActivityDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useNotifications();
    const { user } = useAuth();
    const [registered, setRegistered] = useState(false);
    const [liked, setLiked] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    const activity = activities.find(a => a.id === id);
    if (!activity) return (
        <div className="page-transition" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2>Activity not found</h2>
            <button className="btn btn-primary" onClick={() => navigate('/activities')} style={{ marginTop: '16px' }}>
                Back to Activities
            </button>
        </div>
    );

    const categoryInfo = activityCategories.find(c => c.id === activity.category);
    const seatsLeft = activity.totalSeats - activity.registeredSeats;
    const seatPercent = (activity.registeredSeats / activity.totalSeats) * 100;
    const activityFeedbacks = feedbacks.filter(f => f.activityId === activity.id);

    const handleRegister = () => {
        setRegistered(true);
        addToast({
            type: 'success',
            title: 'Registration Successful!',
            message: `You've been registered for ${activity.title}`,
        });
    };

    return (
        <div className="page-transition activity-detail">
            {/* Back Button */}
            <button className="back-btn" onClick={() => navigate(-1)}>
                <FiArrowLeft /> Back
            </button>

            {/* Banner */}
            <div className="detail-banner">
                <img src={activity.banner} alt={activity.title} />
                <div className="banner-overlay">
                    <span
                        className="activity-category-tag"
                        style={{ background: categoryInfo?.color || '#3b82f6' }}
                    >
                        {categoryInfo?.icon} {activity.category}
                    </span>
                </div>
            </div>

            <div className="detail-content">
                <div className="detail-main">
                    {/* Title & Actions */}
                    <div className="detail-title-row">
                        <div>
                            <h1>{activity.title}</h1>
                            <p className="detail-organizer">by {activity.organizer}</p>
                        </div>
                        <div className="detail-actions">
                            <button
                                className={`btn-icon like-btn ${liked ? 'liked' : ''}`}
                                onClick={() => setLiked(!liked)}
                            >
                                <FiHeart />
                            </button>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="detail-info-grid glass-card">
                        <div className="info-item">
                            <FiCalendar className="info-icon" />
                            <div>
                                <span className="info-label">Date</span>
                                <span className="info-value">{activity.date}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <FiClock className="info-icon" />
                            <div>
                                <span className="info-label">Time</span>
                                <span className="info-value">{activity.time}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <FiMapPin className="info-icon" />
                            <div>
                                <span className="info-label">Venue</span>
                                <span className="info-value">{activity.venue}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <FiUsers className="info-icon" />
                            <div>
                                <span className="info-label">Seats</span>
                                <span className="info-value">{seatsLeft} / {activity.totalSeats} available</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="glass-card detail-section">
                        <h2>About This Activity</h2>
                        <p>{activity.description}</p>
                        <div style={{ marginTop: '16px' }}>
                            <strong style={{ fontSize: '0.875rem' }}>Eligibility:</strong>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{activity.eligibility}</p>
                        </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="glass-card detail-section">
                        <div className="section-header">
                            <h2>Reviews & Feedback</h2>
                            <button className="btn btn-secondary" onClick={() => setShowFeedback(true)}>
                                <FiStar /> Write Review
                            </button>
                        </div>
                        <div className="rating-summary">
                            <div className="rating-big">
                                <span className="rating-number">{activity.rating}</span>
                                <div className="rating-stars">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <FiStar key={s} style={{
                                            color: s <= Math.floor(activity.rating) ? '#eab308' : 'var(--neutral-300)',
                                            fill: s <= Math.floor(activity.rating) ? '#eab308' : 'none',
                                        }} />
                                    ))}
                                </div>
                                <span className="rating-count">{activity.feedbackCount} reviews</span>
                            </div>
                        </div>

                        {activityFeedbacks.length > 0 && (
                            <div className="feedback-list">
                                {activityFeedbacks.map(fb => (
                                    <div key={fb.id} className="feedback-item">
                                        <div className="feedback-header">
                                            <div className="feedback-user-avatar">{fb.userName.charAt(0)}</div>
                                            <div>
                                                <strong>{fb.userName}</strong>
                                                <div className="feedback-stars-sm">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <FiStar key={s} size={12} style={{
                                                            color: s <= fb.rating ? '#eab308' : 'var(--neutral-300)',
                                                            fill: s <= fb.rating ? '#eab308' : 'none',
                                                        }} />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="feedback-date">{fb.date}</span>
                                        </div>
                                        <p className="feedback-text">{fb.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="detail-sidebar">
                    <div className="glass-card register-card">
                        <div className="register-seats">
                            <div className="seats-visual">
                                <svg viewBox="0 0 100 100" className="seats-ring">
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--neutral-200)" strokeWidth="6" />
                                    <circle cx="50" cy="50" r="42" fill="none"
                                        stroke={seatPercent > 90 ? '#ef4444' : seatPercent > 70 ? '#f97316' : '#22c55e'}
                                        strokeWidth="6" strokeLinecap="round"
                                        strokeDasharray={`${seatPercent * 2.64} 264`}
                                        transform="rotate(-90 50 50)" />
                                </svg>
                                <div className="seats-ring-text">
                                    <span className="seats-ring-number">{seatsLeft}</span>
                                    <span className="seats-ring-label">seats left</span>
                                </div>
                            </div>
                        </div>

                        {registered ? (
                            <div className="registered-badge animate-scale-in">
                                <FiCheckCircle size={24} />
                                <span>You're Registered!</span>
                            </div>
                        ) : (
                            <button
                                className="btn btn-primary register-btn"
                                onClick={handleRegister}
                                disabled={seatsLeft === 0 || activity.status === 'completed'}
                            >
                                {seatsLeft === 0 ? 'Fully Booked' : activity.status === 'completed' ? 'Event Ended' : 'Register Now'}
                            </button>
                        )}

                        <div className="register-meta">
                            <div className="register-meta-item">
                                <FiStar style={{ color: '#eab308' }} />
                                <span>{activity.rating} rating ({activity.feedbackCount} reviews)</span>
                            </div>
                            <div className="register-meta-item">
                                <span style={{ color: categoryInfo?.color }}>{categoryInfo?.icon}</span>
                                <span>{activity.category}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showFeedback && (
                <FeedbackModal
                    activity={activity}
                    onClose={() => setShowFeedback(false)}
                    onSubmit={(data) => {
                        addToast({ type: 'success', title: 'Thank you!', message: 'Your review has been submitted.' });
                    }}
                />
            )}
        </div>
    );
}
