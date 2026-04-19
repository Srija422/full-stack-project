import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Calendar, Clock, MapPin, User, Users, Tag,
    CheckCircle2, XCircle, Share2, Heart, Star,
} from 'lucide-react';
import { initialActivities, categories } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import './ActivityDetail.css';

export default function ActivityDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated, isStudent, registerForActivity, unregisterFromActivity } = useAuth();

    const activity = initialActivities.find(a => a.id === id);

    if (!activity) {
        return (
            <div className="detail-page">
                <div className="container">
                    <div className="detail-page__not-found">
                        <h2>Activity not found</h2>
                        <p>The activity you're looking for doesn't exist.</p>
                        <Link to="/activities" className="detail-page__back-link">
                            <ArrowLeft size={18} />
                            Back to Activities
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const category = categories.find(c => c.id === activity.category);
    const fillPercent = Math.round((activity.enrolled / activity.capacity) * 100);
    const isRegistered = isStudent && user?.registeredActivities?.includes(activity.id);
    const relatedActivities = initialActivities
        .filter(a => a.category === activity.category && a.id !== activity.id)
        .slice(0, 3);

    const handleToggleRegister = () => {
        if (!isAuthenticated) return;
        if (isRegistered) {
            unregisterFromActivity(activity.id);
        } else {
            registerForActivity(activity.id);
        }
    };

    return (
        <div className="detail-page">
            {/* Hero Banner */}
            <motion.div
                className="detail-page__hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <img src={activity.image} alt={activity.title} className="detail-page__hero-img" />
                <div className="detail-page__hero-overlay" />
                <div className="container detail-page__hero-content">
                    <motion.button
                        className="detail-page__back"
                        onClick={() => navigate(-1)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: -4 }}
                    >
                        <ArrowLeft size={18} />
                        <span>Back</span>
                    </motion.button>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="detail-page__hero-badges">
                            <span className="detail-page__badge" style={{ background: category?.color }}>
                                {category?.label}
                            </span>
                            {activity.featured && (
                                <span className="detail-page__badge detail-page__badge--featured">
                                    <Star size={12} /> Featured
                                </span>
                            )}
                            <span className={`detail-page__badge detail-page__badge--status detail-page__badge--${activity.status}`}>
                                {activity.status === 'active' ? 'Active' : 'Upcoming'}
                            </span>
                        </div>
                        <h1 className="detail-page__hero-title">{activity.title}</h1>
                        <p className="detail-page__hero-instructor">
                            <User size={16} /> Led by {activity.instructor}
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            <div className="container">
                <div className="detail-page__layout">
                    {/* Main Content */}
                    <motion.div
                        className="detail-page__main"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {/* About */}
                        <section className="detail-page__section">
                            <h2 className="detail-page__section-title">About This Activity</h2>
                            <p className="detail-page__description">{activity.description}</p>
                        </section>

                        {/* Details Grid */}
                        <section className="detail-page__section">
                            <h2 className="detail-page__section-title">Details</h2>
                            <div className="detail-page__details-grid">
                                <div className="detail-page__detail-item">
                                    <div className="detail-page__detail-icon">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="detail-page__detail-label">Duration</p>
                                        <p className="detail-page__detail-value">
                                            {new Date(activity.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} — {new Date(activity.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="detail-page__detail-item">
                                    <div className="detail-page__detail-icon">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="detail-page__detail-label">Schedule</p>
                                        <p className="detail-page__detail-value">{activity.schedule}</p>
                                    </div>
                                </div>
                                <div className="detail-page__detail-item">
                                    <div className="detail-page__detail-icon">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="detail-page__detail-label">Venue</p>
                                        <p className="detail-page__detail-value">{activity.venue}</p>
                                    </div>
                                </div>
                                <div className="detail-page__detail-item">
                                    <div className="detail-page__detail-icon">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="detail-page__detail-label">Instructor</p>
                                        <p className="detail-page__detail-value">{activity.instructor}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Tags */}
                        <section className="detail-page__section">
                            <h2 className="detail-page__section-title">Tags</h2>
                            <div className="detail-page__tags">
                                {activity.tags.map(tag => (
                                    <span key={tag} className="detail-page__tag">
                                        <Tag size={12} />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Related Activities */}
                        {relatedActivities.length > 0 && (
                            <section className="detail-page__section">
                                <h2 className="detail-page__section-title">Related Activities</h2>
                                <div className="detail-page__related">
                                    {relatedActivities.map(rel => (
                                        <Link key={rel.id} to={`/activity/${rel.id}`} className="detail-page__related-card">
                                            <img src={rel.image} alt={rel.title} />
                                            <div className="detail-page__related-info">
                                                <h4>{rel.title}</h4>
                                                <p>{rel.shortDesc}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </motion.div>

                    {/* Sidebar */}
                    <motion.aside
                        className="detail-page__sidebar"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="detail-page__sidebar-card">
                            {/* Enrollment */}
                            <div className="detail-page__enrollment">
                                <div className="detail-page__enrollment-header">
                                    <span className="detail-page__enrollment-label">Enrollment</span>
                                    <span className="detail-page__enrollment-count">{activity.enrolled}/{activity.capacity}</span>
                                </div>
                                <div className="detail-page__progress">
                                    <motion.div
                                        className="detail-page__progress-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${fillPercent}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        style={{
                                            background: fillPercent > 90 ? 'var(--error-500)' : fillPercent > 70 ? 'var(--warning-500)' : 'var(--gradient-primary)',
                                        }}
                                    />
                                </div>
                                <p className="detail-page__spots">
                                    {activity.capacity - activity.enrolled} spots remaining
                                </p>
                            </div>

                            {/* Actions */}
                            {isStudent ? (
                                <motion.button
                                    className={`detail-page__action-btn ${isRegistered ? 'detail-page__action-btn--registered' : ''}`}
                                    onClick={handleToggleRegister}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isRegistered ? (
                                        <>
                                            <CheckCircle2 size={20} />
                                            Registered — Click to Unregister
                                        </>
                                    ) : (
                                        <>
                                            <Users size={20} />
                                            Register Now
                                        </>
                                    )}
                                </motion.button>
                            ) : !isAuthenticated ? (
                                <p className="detail-page__login-prompt">
                                    <Link to="/" className="detail-page__login-link">Sign in</Link> as a student to register.
                                </p>
                            ) : (
                                <p className="detail-page__admin-note">
                                    You are viewing as an Admin.
                                </p>
                            )}

                            {/* Share */}
                            <div className="detail-page__share">
                                <button className="detail-page__share-btn">
                                    <Share2 size={16} />
                                    Share
                                </button>
                                <button className="detail-page__share-btn">
                                    <Heart size={16} />
                                    Save
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                </div>
            </div>
        </div>
    );
}
