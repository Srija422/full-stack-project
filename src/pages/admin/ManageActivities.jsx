import { useState } from 'react';
import { activities, activityCategories } from '../../data/mockData';
import { useNotifications } from '../../context/NotificationContext';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import './ManageActivities.css';

export default function ManageActivities() {
    const { addToast } = useNotifications();
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);

    const filtered = activities.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase())
    );

    const categoryColors = {};
    activityCategories.forEach(c => { categoryColors[c.id] = c.color; });

    const handleAdd = () => {
        setEditingActivity(null);
        setShowModal(true);
    };

    const handleEdit = (activity) => {
        setEditingActivity(activity);
        setShowModal(true);
    };

    const handleDelete = (activity) => {
        addToast({ type: 'success', title: 'Activity Deleted', message: `${activity.title} has been removed.` });
    };

    const handleSave = () => {
        setShowModal(false);
        addToast({
            type: 'success',
            title: editingActivity ? 'Activity Updated' : 'Activity Created',
            message: editingActivity ? 'The activity has been updated successfully.' : 'New activity has been created.',
        });
    };

    return (
        <div className="page-transition manage-page">
            <div className="page-header">
                <div>
                    <h1>Manage Activities</h1>
                    <p>Create, edit, and manage all extracurricular activities</p>
                </div>
                <button className="btn btn-primary" onClick={handleAdd}>
                    <FiPlus /> Add Activity
                </button>
            </div>

            {/* Search */}
            <div className="glass-card manage-toolbar">
                <div className="search-container" style={{ maxWidth: '360px' }}>
                    <FiSearch className="search-icon" />
                    <input
                        type="text" className="search-input" placeholder="Search activities..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <span className="manage-count">{filtered.length} activities</span>
            </div>

            {/* Table */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Activity</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Seats</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((activity, i) => (
                                <tr key={activity.id} className={`animate-slide-up stagger-${(i % 6) + 1}`}>
                                    <td>
                                        <div className="manage-activity-name">
                                            <strong>{activity.title}</strong>
                                            <span>{activity.organizer}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="activity-category-tag" style={{ background: categoryColors[activity.category] }}>
                                            {activity.category}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>{activity.date}</td>
                                    <td>{activity.registeredSeats}/{activity.totalSeats}</td>
                                    <td>
                                        <span className={`badge ${activity.status === 'upcoming' ? 'badge-success' : 'badge-warning'}`}>
                                            {activity.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="manage-actions">
                                            <button className="btn-icon" onClick={() => handleEdit(activity)} title="Edit">
                                                <FiEdit2 />
                                            </button>
                                            <button className="btn-icon" onClick={() => handleDelete(activity)} title="Delete"
                                                style={{ color: 'var(--accent-red)' }}>
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h2>{editingActivity ? 'Edit Activity' : 'Add New Activity'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <FiX />
                            </button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input className="form-input" defaultValue={editingActivity?.title || ''} placeholder="Activity title" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select className="form-input" defaultValue={editingActivity?.category || ''}>
                                        {activityCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date</label>
                                    <input className="form-input" type="date" defaultValue={editingActivity?.date || ''} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Venue</label>
                                    <input className="form-input" defaultValue={editingActivity?.venue || ''} placeholder="Venue" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Total Seats</label>
                                    <input className="form-input" type="number" defaultValue={editingActivity?.totalSeats || ''} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-input" rows={3} defaultValue={editingActivity?.description || ''} placeholder="Activity description" />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingActivity ? 'Update' : 'Create'} Activity
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
