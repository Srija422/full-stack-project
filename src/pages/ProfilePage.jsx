import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { mockUsers, badges as allBadges, certificates } from '../data/mockData';
import {
    FiEdit2, FiUpload, FiMail, FiBook, FiCalendar, FiAward,
    FiDownload, FiChevronRight, FiHash, FiX, FiCheck, FiAlertCircle
} from 'react-icons/fi';
import './ProfilePage.css';

export default function ProfilePage() {
    const { user, updateUser } = useAuth();
    const { addToast } = useNotifications();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [showIdModal, setShowIdModal] = useState(false);
    const [newProfileId, setNewProfileId] = useState('');
    const [idError, setIdError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const baseUser =
        user?.role === 'admin'
            ? mockUsers.admin
            : user?.role === 'faculty'
                ? mockUsers.faculty
                : mockUsers.student;
    const profileData = { ...baseUser, ...user };

    const [editableProfile, setEditableProfile] = useState({
        name: profileData.name || '',
        email: profileData.email || '',
        department: profileData.department || '',
        year: profileData.year || '',
        enrollmentId: profileData.enrollmentId || '',
    });

    const [activities, setActivities] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/activities')
            .then(res => res.json())
            .then(data => setActivities(data));
    }, []);

    useEffect(() => {
        setEditableProfile({
            name: profileData.name || '',
            email: profileData.email || '',
            department: profileData.department || '',
            year: profileData.year || '',
            enrollmentId: profileData.enrollmentId || '',
        });
    }, [profileData.name, profileData.email, profileData.department, profileData.year, profileData.enrollmentId]);

    const userBadges = allBadges.filter(b => (profileData.badges || []).includes(b.id));
    const participatedActivities = activities.filter(a =>
        (profileData.registeredActivities || []).includes(a.id)
    );

    const handleFieldChange = (key, value) => {
        setEditableProfile(prev => ({ ...prev, [key]: value }));
    };

    const handleToggleEdit = () => {
        if (isEditing) {
            updateUser(editableProfile);
            addToast({
                type: 'success',
                title: 'Profile Updated',
                message: 'Your profile details have been saved.',
            });
        }
        setIsEditing(prev => !prev);
    };

    const handleAvatarUpload = () => {
        addToast({ type: 'success', title: 'Avatar Updated', message: 'Your profile picture has been updated.' });
    };

    const openIdModal = () => {
        setNewProfileId(profileData.enrollmentId || '');
        setIdError('');
        setShowIdModal(true);
    };

    const closeIdModal = () => {
        setShowIdModal(false);
        setNewProfileId('');
        setIdError('');
        setIsSubmitting(false);
    };

    const handleChangeProfileId = () => {
        const trimmed = newProfileId.trim();
        if (!trimmed) {
            setIdError('Profile ID cannot be empty.');
            return;
        }
        if (trimmed.length < 4) {
            setIdError('Profile ID must be at least 4 characters.');
            return;
        }
        if (!/^[A-Za-z0-9_-]+$/.test(trimmed)) {
            setIdError('Only letters, numbers, hyphens, and underscores are allowed.');
            return;
        }
        const currentId = profileData.enrollmentId;
        if (trimmed === currentId) {
            setIdError('New ID is the same as your current ID.');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            updateUser({ enrollmentId: trimmed });
            studentData.enrollmentId = trimmed;
            addToast({ type: 'success', title: 'Profile ID Changed', message: `Your ID has been updated to ${trimmed}.` });
            closeIdModal();
        }, 600);
    };

    return (
        <div className="page-transition profile-page">
            {/* Profile Header */}
            <div className="profile-header glass-card">
                <div className="profile-cover" />
                <div className="profile-info">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar-lg">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <button className="avatar-upload-btn" onClick={handleAvatarUpload}>
                            <FiUpload />
                        </button>
                    </div>
                    <div className="profile-details">
                        <h1>{user?.name || 'User Name'}</h1>
                        <p className="profile-role">
                            {user?.role === 'admin'
                                ? '🔑 Administrator'
                                : user?.role === 'faculty'
                                    ? '👩‍🏫 Faculty'
                                    : '🎓 Student'}
                        </p>
                        <div className="profile-meta">
                            <span><FiMail /> {user?.email}</span>
                            <span><FiBook /> {profileData.department}</span>
                            <span><FiCalendar /> {profileData.year}</span>
                        </div>
                    </div>
                    <div className="profile-header-actions">
                        <button className="btn btn-accent change-id-btn" onClick={openIdModal}>
                            <FiHash /> Change ID
                        </button>
                        <button className="btn btn-secondary" onClick={handleToggleEdit}>
                            <FiEdit2 /> {isEditing ? 'Save' : 'Edit Profile'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="profile-tabs">
                {['overview', 'badges', 'certificates', 'history'].map(tab => (
                    <button
                        key={tab}
                        className={`profile-tab ${activeTab === tab ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="profile-grid animate-fade-in">
                    <div className="glass-card profile-section">
                        <h2>Personal Information</h2>
                        <div className="info-list">
                            {[
                                { label: 'Full Name', key: 'name' },
                                { label: 'Email', key: 'email' },
                                { label: 'Department', key: 'department' },
                                { label: 'Year', key: 'year' },
                                { label: 'Enrollment ID', key: 'enrollmentId' },
                            ].map(item => (
                                <div key={item.key} className="info-row">
                                    <span className="info-row-label">{item.label}</span>
                                    {isEditing ? (
                                        <input
                                            className="form-input"
                                            style={{ maxWidth: '280px' }}
                                            value={editableProfile[item.key] || ''}
                                            onChange={e => handleFieldChange(item.key, e.target.value)}
                                        />
                                    ) : (
                                        <span className="info-row-value">{profileData[item.key]}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card profile-section">
                        <h2>Quick Stats</h2>
                        <div className="profile-stats-grid">
                            {[
                                { label: 'Activities', value: (profileData.registeredActivities || []).length, icon: '🎯' },
                                { label: 'Completed', value: (profileData.completedActivities || []).length, icon: '✅' },
                                { label: 'Badges', value: (profileData.badges || []).length, icon: '🏅' },
                                { label: 'Certificates', value: certificates.length, icon: '📜' },
                            ].map(stat => (
                                <div key={stat.label} className="profile-stat-card">
                                    <span className="profile-stat-icon">{stat.icon}</span>
                                    <span className="profile-stat-value">{stat.value}</span>
                                    <span className="profile-stat-label">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Badges Tab */}
            {activeTab === 'badges' && (
                <div className="glass-card profile-section animate-fade-in">
                    <h2><FiAward /> Achievement Badges</h2>
                    <div className="badges-grid">
                        {allBadges.map((badge, i) => {
                            const earned = (profileData.badges || []).includes(badge.id);
                            return (
                                <div
                                    key={badge.id}
                                    className={`badge-tile ${earned ? '' : 'badge-locked'} animate-scale-in stagger-${i + 1}`}
                                >
                                    <div className="badge-tile-icon" style={{ background: earned ? `${badge.color}20` : 'var(--neutral-100)' }}>
                                        <span>{badge.icon}</span>
                                    </div>
                                    <h4>{badge.name}</h4>
                                    <p>{badge.description}</p>
                                    {earned ? (
                                        <span className="badge badge-success" style={{ marginTop: '8px' }}>Earned ✓</span>
                                    ) : (
                                        <span className="badge badge-warning" style={{ marginTop: '8px' }}>Locked 🔒</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
                <div className="glass-card profile-section animate-fade-in">
                    <h2>📜 Certificates</h2>
                    <div className="certificates-list">
                        {certificates.map((cert, i) => (
                            <div key={cert.id} className={`certificate-card animate-slide-up stagger-${i + 1}`}>
                                <div className="cert-preview">
                                    <div className="cert-mock">
                                        <div className="cert-mock-header">Certificate of {cert.type}</div>
                                        <div className="cert-mock-title">{cert.title}</div>
                                        <div className="cert-mock-date">{cert.date}</div>
                                    </div>
                                </div>
                                <div className="cert-info">
                                    <h4>{cert.title}</h4>
                                    <p>{cert.activity}</p>
                                    <div className="cert-meta">
                                        <span className="badge badge-purple">{cert.type}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cert.date}</span>
                                    </div>
                                    <button className="btn btn-secondary" style={{ marginTop: '12px' }}>
                                        <FiDownload /> Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <div className="glass-card profile-section animate-fade-in">
                    <h2>Activity History</h2>
                    <div className="history-list">
                        {participatedActivities.map((activity, i) => {
                            const isCompleted = (profileData.completedActivities || []).includes(activity.id);
                            return (
                                <div key={activity.id} className={`history-item animate-slide-up stagger-${i + 1}`}>
                                    <div className={`history-status ${isCompleted ? 'completed' : 'upcoming'}`}>
                                        {isCompleted ? '✅' : '🕐'}
                                    </div>
                                    <div className="history-info">
                                        <h4>{activity.title}</h4>
                                        <p>{activity.date} • {activity.venue}</p>
                                    </div>
                                    <span className={`badge ${isCompleted ? 'badge-success' : 'badge-primary'}`}>
                                        {isCompleted ? 'Completed' : 'Upcoming'}
                                    </span>
                                    <FiChevronRight className="history-arrow" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Change Profile ID Modal */}
            {showIdModal && (
                <div className="modal-overlay" onClick={closeIdModal}>
                    <div className="modal-content change-id-modal animate-scale-in" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeIdModal}>
                            <FiX />
                        </button>
                        <div className="modal-icon-wrapper">
                            <FiHash className="modal-icon" />
                        </div>
                        <h2>Change Profile ID</h2>
                        <p className="modal-subtitle">Update your enrollment / profile identifier below.</p>

                        <div className="modal-current-id">
                            <span className="label">Current ID</span>
                            <span className="value">{profileData.enrollmentId}</span>
                        </div>

                        <div className={`modal-input-group ${idError ? 'has-error' : ''}`}>
                            <label htmlFor="new-profile-id">New Profile ID</label>
                            <input
                                id="new-profile-id"
                                className="form-input"
                                type="text"
                                placeholder="e.g. CS2026100"
                                value={newProfileId}
                                onChange={e => { setNewProfileId(e.target.value); setIdError(''); }}
                                onKeyDown={e => e.key === 'Enter' && handleChangeProfileId()}
                                autoFocus
                            />
                            {idError && (
                                <span className="input-error"><FiAlertCircle /> {idError}</span>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={closeIdModal} disabled={isSubmitting}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleChangeProfileId} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <><span className="spinner-sm" /> Updating…</>
                                ) : (
                                    <><FiCheck /> Update ID</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
