import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Calendar, Clock, MapPin, Plus, Pencil,
    Trash2, CheckCircle2, XCircle, AlertTriangle, BarChart3,
    Activity, TrendingUp, Eye, Star, ChevronRight, Search, X, Save,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { initialActivities, categories, upcomingEvents, notifications } from '../data/mockData';
import './Dashboard.css';

export default function Dashboard() {
    const { user, isAdmin, isStudent } = useAuth();

    if (!user) {
        return (
            <div className="dashboard-page">
                <div className="container">
                    <div className="dashboard-page__empty">
                        <LayoutDashboard size={48} />
                        <h2>Please Sign In</h2>
                        <p>Sign in to access your dashboard.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                {isAdmin ? <AdminDashboard user={user} /> : <StudentDashboard user={user} />}
            </div>
        </div>
    );
}

/* ============================== */
/*         ADMIN DASHBOARD        */
/* ============================== */

function AdminDashboard({ user }) {
    const [activities, setActivities] = useState(initialActivities);
    const [showModal, setShowModal] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const totalEnrolled = activities.reduce((sum, a) => sum + a.enrolled, 0);
    const totalCapacity = activities.reduce((sum, a) => sum + a.capacity, 0);
    const activeCount = activities.filter(a => a.status === 'active').length;

    const adminStats = [
        { label: 'Total Activities', value: activities.length, icon: <Activity size={22} />, color: '#6366f1' },
        { label: 'Total Enrolled', value: totalEnrolled, icon: <Users size={22} />, color: '#14b8a6' },
        { label: 'Active Now', value: activeCount, icon: <TrendingUp size={22} />, color: '#22c55e' },
        { label: 'Avg Capacity', value: `${Math.round((totalEnrolled / totalCapacity) * 100)}%`, icon: <BarChart3 size={22} />, color: '#f59e0b' },
    ];

    const filteredActivities = activities.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        setActivities(prev => prev.filter(a => a.id !== id));
    };

    const handleEdit = (activity) => {
        setEditingActivity(activity);
        setShowModal(true);
    };

    const handleAdd = () => {
        setEditingActivity(null);
        setShowModal(true);
    };

    const handleSave = (formData) => {
        if (editingActivity) {
            setActivities(prev => prev.map(a => a.id === editingActivity.id ? { ...a, ...formData } : a));
        } else {
            const newActivity = {
                ...formData,
                id: `act-${Date.now()}`,
                enrolled: 0,
                featured: false,
                status: 'active',
                image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop',
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
            };
            setActivities(prev => [...prev, newActivity]);
        }
        setShowModal(false);
        setEditingActivity(null);
    };

    return (
        <>
            {/* Welcome Header */}
            <motion.div
                className="dashboard__header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h1 className="dashboard__welcome">
                        Welcome back, <span className="gradient-text">{user.name.split(' ')[0]}</span>
                    </h1>
                    <p className="dashboard__welcome-sub">Here's an overview of your platform.</p>
                </div>
                <motion.button
                    className="dashboard__add-btn"
                    onClick={handleAdd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Plus size={18} />
                    Add Activity
                </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
                className="dashboard__stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                {adminStats.map((stat, i) => (
                    <motion.div
                        key={i}
                        className="dashboard__stat-card"
                        whileHover={{ y: -4 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className="dashboard__stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="dashboard__stat-value">{stat.value}</p>
                            <p className="dashboard__stat-label">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Activity Management Table */}
            <motion.div
                className="dashboard__section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="dashboard__section-header">
                    <h2 className="dashboard__section-title">
                        <Activity size={20} />
                        Manage Activities
                    </h2>
                    <div className="dashboard__search">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')}>
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="dashboard__table-wrapper">
                    <table className="dashboard__table">
                        <thead>
                            <tr>
                                <th>Activity</th>
                                <th>Category</th>
                                <th>Enrolled</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredActivities.map(activity => {
                                    const cat = categories.find(c => c.id === activity.category);
                                    const fill = Math.round((activity.enrolled / activity.capacity) * 100);
                                    return (
                                        <motion.tr
                                            key={activity.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            layout
                                        >
                                            <td>
                                                <div className="dashboard__table-activity">
                                                    <img src={activity.image} alt={activity.title} />
                                                    <div>
                                                        <p className="dashboard__table-name">{activity.title}</p>
                                                        <p className="dashboard__table-schedule">{activity.schedule.split(',')[0]}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="dashboard__table-cat" style={{ color: cat?.color, background: `${cat?.color}15` }}>
                                                    {cat?.label}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="dashboard__table-enrollment">
                                                    <span>{activity.enrolled}/{activity.capacity}</span>
                                                    <div className="dashboard__table-bar">
                                                        <div style={{ width: `${fill}%`, background: fill > 90 ? 'var(--error-500)' : 'var(--primary-500)' }} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`dashboard__status-badge dashboard__status-badge--${activity.status}`}>
                                                    {activity.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="dashboard__table-actions">
                                                    <Link to={`/activity/${activity.id}`} className="dashboard__tbl-btn dashboard__tbl-btn--view">
                                                        <Eye size={15} />
                                                    </Link>
                                                    <button className="dashboard__tbl-btn dashboard__tbl-btn--edit" onClick={() => handleEdit(activity)}>
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button className="dashboard__tbl-btn dashboard__tbl-btn--delete" onClick={() => handleDelete(activity.id)}>
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Recent Notifications */}
            <motion.div
                className="dashboard__section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="dashboard__section-header">
                    <h2 className="dashboard__section-title">
                        <AlertTriangle size={20} />
                        Recent Notifications
                    </h2>
                </div>
                <div className="dashboard__notif-list">
                    {notifications.map(notif => (
                        <div key={notif.id} className={`dashboard__notif ${!notif.read ? 'dashboard__notif--unread' : ''}`}>
                            <div className={`dashboard__notif-dot dashboard__notif-dot--${notif.type}`} />
                            <div className="dashboard__notif-content">
                                <p className="dashboard__notif-title">{notif.title}</p>
                                <p className="dashboard__notif-msg">{notif.message}</p>
                            </div>
                            <span className="dashboard__notif-time">{notif.time}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <ActivityModal
                        activity={editingActivity}
                        onSave={handleSave}
                        onClose={() => { setShowModal(false); setEditingActivity(null); }}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

/* ============================== */
/*       STUDENT DASHBOARD        */
/* ============================== */

function StudentDashboard({ user }) {
    const { unregisterFromActivity } = useAuth();
    const registeredActivities = initialActivities.filter(
        a => user.registeredActivities?.includes(a.id)
    );
    const otherActivities = initialActivities.filter(
        a => !user.registeredActivities?.includes(a.id)
    ).slice(0, 4);

    const attendedCount = user.participationHistory?.filter(p => p.status === 'attended').length || 0;
    const missedCount = user.participationHistory?.filter(p => p.status === 'missed').length || 0;

    const studentStats = [
        { label: 'Registered', value: registeredActivities.length, icon: <CheckCircle2 size={22} />, color: '#6366f1' },
        { label: 'Attended', value: attendedCount, icon: <Star size={22} />, color: '#22c55e' },
        { label: 'Missed', value: missedCount, icon: <XCircle size={22} />, color: '#ef4444' },
        { label: 'Upcoming Events', value: upcomingEvents.length, icon: <Calendar size={22} />, color: '#f59e0b' },
    ];

    return (
        <>
            {/* Welcome */}
            <motion.div
                className="dashboard__header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h1 className="dashboard__welcome">
                        Welcome, <span className="gradient-text">{user.name.split(' ')[0]}</span>! 👋
                    </h1>
                    <p className="dashboard__welcome-sub">{user.department} — {user.year}</p>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div
                className="dashboard__stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                {studentStats.map((stat, i) => (
                    <motion.div
                        key={i}
                        className="dashboard__stat-card"
                        whileHover={{ y: -4 }}
                    >
                        <div className="dashboard__stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="dashboard__stat-value">{stat.value}</p>
                            <p className="dashboard__stat-label">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* My Activities */}
            <motion.div
                className="dashboard__section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="dashboard__section-header">
                    <h2 className="dashboard__section-title">
                        <CheckCircle2 size={20} />
                        My Activities
                    </h2>
                    <Link to="/activities" className="dashboard__section-link">
                        View All <ChevronRight size={16} />
                    </Link>
                </div>

                {registeredActivities.length > 0 ? (
                    <div className="dashboard__my-activities">
                        {registeredActivities.map(activity => {
                            const cat = categories.find(c => c.id === activity.category);
                            return (
                                <motion.div key={activity.id} className="dashboard__my-card" whileHover={{ y: -4 }}>
                                    <Link to={`/activity/${activity.id}`} className="dashboard__my-card-link">
                                        <img src={activity.image} alt={activity.title} />
                                        <div className="dashboard__my-card-body">
                                            <span className="dashboard__my-card-cat" style={{ color: cat?.color }}>{cat?.label}</span>
                                            <h3>{activity.title}</h3>
                                            <div className="dashboard__my-card-meta">
                                                <span><Clock size={12} /> {activity.schedule.split(',')[0]}</span>
                                                <span><MapPin size={12} /> {activity.venue}</span>
                                            </div>
                                        </div>
                                    </Link>
                                    <button
                                        className="dashboard__my-card-unreg"
                                        onClick={() => unregisterFromActivity(activity.id)}
                                    >
                                        <XCircle size={14} />
                                        Unregister
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="dashboard__empty-activities">
                        <p>You haven't registered for any activities yet.</p>
                        <Link to="/activities" className="dashboard__explore-btn">
                            Explore Activities <ChevronRight size={16} />
                        </Link>
                    </div>
                )}
            </motion.div>

            {/* Participation History */}
            <motion.div
                className="dashboard__section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="dashboard__section-header">
                    <h2 className="dashboard__section-title">
                        <BarChart3 size={20} />
                        Participation History
                    </h2>
                </div>
                <div className="dashboard__history">
                    {user.participationHistory?.map((entry, i) => {
                        const activity = initialActivities.find(a => a.id === entry.activityId);
                        return (
                            <div key={i} className="dashboard__history-item">
                                <div className={`dashboard__history-status dashboard__history-status--${entry.status}`}>
                                    {entry.status === 'attended' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                </div>
                                <div>
                                    <p className="dashboard__history-name">{activity?.title || 'Unknown Activity'}</p>
                                    <p className="dashboard__history-date">{new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <span className={`dashboard__status-badge dashboard__status-badge--${entry.status}`}>
                                    {entry.status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Explore More */}
            <motion.div
                className="dashboard__section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="dashboard__section-header">
                    <h2 className="dashboard__section-title">
                        <Star size={20} />
                        Explore More
                    </h2>
                    <Link to="/activities" className="dashboard__section-link">
                        See All <ChevronRight size={16} />
                    </Link>
                </div>
                <div className="dashboard__explore-grid">
                    {otherActivities.map(activity => (
                        <Link key={activity.id} to={`/activity/${activity.id}`} className="dashboard__explore-card">
                            <img src={activity.image} alt={activity.title} />
                            <div className="dashboard__explore-overlay">
                                <h4>{activity.title}</h4>
                                <p>{activity.shortDesc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
                className="dashboard__section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <div className="dashboard__section-header">
                    <h2 className="dashboard__section-title">
                        <Calendar size={20} />
                        Upcoming Events
                    </h2>
                </div>
                <div className="dashboard__events">
                    {upcomingEvents.slice(0, 3).map(event => {
                        const d = new Date(event.date);
                        return (
                            <div key={event.id} className="dashboard__event-card">
                                <div className="dashboard__event-date">
                                    <span className="dashboard__event-month">{d.toLocaleString('en', { month: 'short' }).toUpperCase()}</span>
                                    <span className="dashboard__event-day">{d.getDate()}</span>
                                </div>
                                <div>
                                    <p className="dashboard__event-title">{event.title}</p>
                                    <p className="dashboard__event-meta">
                                        <Clock size={12} /> {event.time} · <MapPin size={12} /> {event.venue}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </>
    );
}

/* ============================== */
/*         ACTIVITY MODAL         */
/* ============================== */

function ActivityModal({ activity, onSave, onClose }) {
    const [form, setForm] = useState({
        title: activity?.title || '',
        category: activity?.category || 'clubs',
        description: activity?.description || '',
        shortDesc: activity?.shortDesc || '',
        schedule: activity?.schedule || '',
        venue: activity?.venue || '',
        instructor: activity?.instructor || '',
        capacity: activity?.capacity || 30,
        startDate: activity?.startDate || '',
        endDate: activity?.endDate || '',
        tags: activity?.tags?.join(', ') || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'capacity' ? Number(value) : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="modal"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
            >
                <div className="modal__header">
                    <h2>{activity ? 'Edit Activity' : 'New Activity'}</h2>
                    <button className="modal__close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="modal__form">
                    <div className="modal__row">
                        <div className="modal__field">
                            <label>Title</label>
                            <input name="title" value={form.title} onChange={handleChange} required placeholder="Activity name" />
                        </div>
                        <div className="modal__field">
                            <label>Category</label>
                            <select name="category" value={form.category} onChange={handleChange}>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="modal__field">
                        <label>Short Description</label>
                        <input name="shortDesc" value={form.shortDesc} onChange={handleChange} placeholder="Brief one-liner" />
                    </div>
                    <div className="modal__field">
                        <label>Full Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Detailed description" />
                    </div>
                    <div className="modal__row">
                        <div className="modal__field">
                            <label>Schedule</label>
                            <input name="schedule" value={form.schedule} onChange={handleChange} placeholder="e.g. Mon & Wed, 4-6 PM" />
                        </div>
                        <div className="modal__field">
                            <label>Venue</label>
                            <input name="venue" value={form.venue} onChange={handleChange} placeholder="Location" />
                        </div>
                    </div>
                    <div className="modal__row">
                        <div className="modal__field">
                            <label>Instructor</label>
                            <input name="instructor" value={form.instructor} onChange={handleChange} placeholder="Name" />
                        </div>
                        <div className="modal__field">
                            <label>Capacity</label>
                            <input name="capacity" type="number" value={form.capacity} onChange={handleChange} min={1} />
                        </div>
                    </div>
                    <div className="modal__row">
                        <div className="modal__field">
                            <label>Start Date</label>
                            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
                        </div>
                        <div className="modal__field">
                            <label>End Date</label>
                            <input name="endDate" type="date" value={form.endDate} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="modal__field">
                        <label>Tags (comma separated)</label>
                        <input name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. Tech, AI, Innovation" />
                    </div>
                    <div className="modal__actions">
                        <button type="button" className="modal__cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="modal__submit">
                            <Save size={16} />
                            {activity ? 'Save Changes' : 'Create Activity'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
