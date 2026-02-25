import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { mockUsers, activities } from '../../data/mockData';
import {
    FiCalendar, FiActivity, FiAward, FiClock, FiArrowRight,
    FiTrendingUp, FiCheckCircle, FiStar
} from 'react-icons/fi';
import './StudentDashboard.css';

export default function StudentDashboard() {
    const { user } = useAuth();
    const { addToast } = useNotifications();
    const navigate = useNavigate();
    const studentData = mockUsers.student;

    const upcomingActivities = activities
        .filter(a => a.status === 'upcoming')
        .slice(0, 3);

    const stats = [
        { label: 'Activities Joined', value: studentData.registeredActivities.length, icon: <FiActivity />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
        { label: 'Completed', value: studentData.completedActivities.length, icon: <FiCheckCircle />, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
        { label: 'Badges Earned', value: studentData.badges.length, icon: <FiAward />, color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
        { label: 'Hours Active', value: 38, icon: <FiClock />, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    ];

    return (
        <div className="page-transition student-dashboard">
            {/* Hero Welcome */}
            <div className="dashboard-hero glass-card">
                <div className="hero-content">
                    <div className="hero-greeting">
                        <span className="hero-wave">👋</span>
                        <div>
                            <h1>Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</h1>
                            <p>Here's what's happening with your activities today.</p>
                        </div>
                    </div>
                    <div className="hero-illustration animate-float">
                        🎓
                    </div>
                </div>
                <div className="hero-quick-actions">
                    <button className="btn btn-primary" onClick={() => navigate('/activities')}>
                        <FiActivity /> Browse Activities
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate('/calendar')}>
                        <FiCalendar /> View Calendar
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid-4 dashboard-stats">
                {stats.map((stat, i) => (
                    <div key={stat.label} className={`stat-card animate-slide-up stagger-${i + 1}`}>
                        <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                        <div className="stat-trend">
                            <FiTrendingUp style={{ color: '#22c55e' }} />
                            <span style={{ color: '#22c55e', fontSize: '0.75rem', fontWeight: 600 }}>+12%</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="dashboard-grid">
                {/* Upcoming Activities */}
                <div className="glass-card dashboard-section">
                    <div className="section-header">
                        <h2>Upcoming Activities</h2>
                        <button className="btn btn-secondary" onClick={() => navigate('/activities')}>
                            View All <FiArrowRight />
                        </button>
                    </div>
                    <div className="upcoming-list">
                        {upcomingActivities.map((activity, i) => (
                            <div
                                key={activity.id}
                                className={`upcoming-item animate-slide-up stagger-${i + 1}`}
                                onClick={() => navigate(`/activities/${activity.id}`)}
                            >
                                <div className="upcoming-date-box">
                                    <span className="upcoming-month">{new Date(activity.date).toLocaleString('en', { month: 'short' })}</span>
                                    <span className="upcoming-day">{new Date(activity.date).getDate()}</span>
                                </div>
                                <div className="upcoming-info">
                                    <h4>{activity.title}</h4>
                                    <p>{activity.venue}</p>
                                    <div className="upcoming-meta">
                                        <span className="badge badge-primary">{activity.category}</span>
                                        <span className="upcoming-seats">
                                            {activity.totalSeats - activity.registeredSeats} seats left
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Progress */}
                <div className="glass-card dashboard-section">
                    <div className="section-header">
                        <h2>Your Progress</h2>
                        <button className="btn btn-secondary" onClick={() => navigate('/progress')}>
                            Details <FiArrowRight />
                        </button>
                    </div>
                    <div className="progress-overview">
                        <div className="progress-circle-container">
                            <svg className="progress-circle" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--neutral-200)" strokeWidth="8" />
                                <circle
                                    cx="60" cy="60" r="52" fill="none"
                                    stroke="url(#progressGradient)" strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={`${(5 / 12) * 327} 327`}
                                    transform="rotate(-90 60 60)"
                                    className="progress-circle-fill"
                                />
                                <defs>
                                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#667eea" />
                                        <stop offset="100%" stopColor="#764ba2" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="progress-circle-text">
                                <span className="progress-percent">42%</span>
                                <span className="progress-sub">Complete</span>
                            </div>
                        </div>

                        <div className="progress-bars">
                            {[
                                { label: 'Sports', value: 70, color: '#22c55e' },
                                { label: 'Workshops', value: 85, color: '#f97316' },
                                { label: 'Cultural', value: 50, color: '#ec4899' },
                                { label: 'Tech', value: 60, color: '#3b82f6' },
                            ].map((item) => (
                                <div key={item.label} className="progress-item">
                                    <div className="progress-item-header">
                                        <span>{item.label}</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.value}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${item.value}%`, background: item.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Badges */}
            <div className="glass-card dashboard-section">
                <div className="section-header">
                    <h2><FiStar style={{ verticalAlign: 'middle' }} /> Recent Achievements</h2>
                </div>
                <div className="badges-row">
                    {[
                        { icon: '🌅', name: 'Early Bird', color: '#f97316' },
                        { icon: '🤝', name: 'Team Player', color: '#3b82f6' },
                        { icon: '🏆', name: 'Champion', color: '#eab308' },
                        { icon: '💪', name: 'Volunteer', color: '#22c55e' },
                    ].map((badge, i) => (
                        <div key={badge.name} className={`badge-card animate-scale-in stagger-${i + 1}`}>
                            <div className="badge-emoji" style={{ background: `${badge.color}20` }}>
                                {badge.icon}
                            </div>
                            <span className="badge-name">{badge.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
