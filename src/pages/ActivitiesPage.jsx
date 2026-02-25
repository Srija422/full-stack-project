import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { activities, activityCategories } from '../data/mockData';
import { FiSearch, FiMapPin, FiClock, FiUsers, FiStar } from 'react-icons/fi';
import './ActivitiesPage.css';

export default function ActivitiesPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredActivities = useMemo(() => {
        return activities.filter(a => {
            const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                a.description.toLowerCase().includes(search.toLowerCase());
            const matchCategory = activeCategory === 'all' || a.category === activeCategory;
            const matchStatus = statusFilter === 'all' || a.status === statusFilter;
            return matchSearch && matchCategory && matchStatus;
        });
    }, [search, activeCategory, statusFilter]);

    const categoryColors = {};
    activityCategories.forEach(c => { categoryColors[c.id] = c.color; });

    return (
        <div className="page-transition activities-page">
            <div className="page-header">
                <h1>🎯 Activities</h1>
                <p>Explore and register for extracurricular activities</p>
            </div>

            {/* Search & Filters */}
            <div className="glass-card activities-filters">
                <div className="search-container" style={{ maxWidth: '400px' }}>
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search activities..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="filter-row">
                    <button
                        className={`filter-chip ${activeCategory === 'all' ? 'filter-active' : ''}`}
                        onClick={() => setActiveCategory('all')}
                    >All</button>
                    {activityCategories.map(cat => (
                        <button
                            key={cat.id}
                            className={`filter-chip ${activeCategory === cat.id ? 'filter-active' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                            style={activeCategory === cat.id ? { background: cat.color, borderColor: cat.color, color: '#fff' } : {}}
                        >
                            {cat.icon} {cat.label}
                        </button>
                    ))}
                </div>
                <div className="filter-row">
                    {['all', 'upcoming', 'completed'].map(s => (
                        <button
                            key={s}
                            className={`filter-chip ${statusFilter === s ? 'filter-active' : ''}`}
                            onClick={() => setStatusFilter(s)}
                        >
                            {s === 'all' ? '📋 All Status' : s === 'upcoming' ? '🟢 Upcoming' : '✅ Completed'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Activity Cards Grid */}
            {filteredActivities.length === 0 ? (
                <div className="empty-state glass-card">
                    <p style={{ fontSize: '3rem' }}>🔍</p>
                    <h3>No activities found</h3>
                    <p>Try adjusting your filters or search query</p>
                </div>
            ) : (
                <div className="activities-grid">
                    {filteredActivities.map((activity, i) => {
                        const seatsLeft = activity.totalSeats - activity.registeredSeats;
                        const seatPercent = (activity.registeredSeats / activity.totalSeats) * 100;

                        return (
                            <div
                                key={activity.id}
                                className={`activity-card glass-card animate-slide-up stagger-${(i % 6) + 1}`}
                                onClick={() => navigate(`/activities/${activity.id}`)}
                            >
                                <div className="activity-card-banner">
                                    <img src={activity.banner} alt={activity.title} loading="lazy" />
                                    <div className="activity-card-overlay">
                                        <span
                                            className="activity-category-tag"
                                            style={{ background: categoryColors[activity.category] }}
                                        >
                                            {activity.category}
                                        </span>
                                        {activity.status === 'completed' && (
                                            <span className="activity-status-tag">Completed</span>
                                        )}
                                    </div>
                                </div>

                                <div className="activity-card-body">
                                    <h3>{activity.title}</h3>
                                    <p className="activity-card-desc">{activity.description.slice(0, 80)}...</p>

                                    <div className="activity-card-meta">
                                        <span><FiMapPin /> {activity.venue.split(',')[0]}</span>
                                        <span><FiClock /> {activity.date}</span>
                                    </div>

                                    <div className="activity-card-footer">
                                        <div className="seats-info">
                                            <div className="seats-bar">
                                                <div className="seats-bar-fill" style={{
                                                    width: `${seatPercent}%`,
                                                    background: seatPercent > 90 ? '#ef4444' : seatPercent > 70 ? '#f97316' : '#22c55e'
                                                }} />
                                            </div>
                                            <span className="seats-text">
                                                <FiUsers /> {seatsLeft} seats left
                                            </span>
                                        </div>
                                        <div className="activity-rating">
                                            <FiStar style={{ color: '#eab308', fill: '#eab308' }} />
                                            <span>{activity.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
