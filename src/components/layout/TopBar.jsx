import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationPanel from '../NotificationPanel';
import './TopBar.css';

export default function TopBar({ onMenuClick }) {
    const { user } = useAuth();
    const { unreadCount } = useNotifications();
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();
    const notifRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="menu-btn hide-desktop" onClick={onMenuClick}>
                    <FiMenu />
                </button>
                <form className="topbar-search" onSubmit={handleSearch}>
                    <div className="search-container">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search activities, events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </form>
            </div>

            <div className="topbar-right">
                <div className="notification-wrapper" ref={notifRef}>
                    <button
                        className="btn-icon notification-btn"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <FiBell />
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadCount}</span>
                        )}
                    </button>
                    {showNotifications && (
                        <NotificationPanel onClose={() => setShowNotifications(false)} />
                    )}
                </div>

                <div className="topbar-user" onClick={() => navigate('/profile')}>
                    <div className="topbar-avatar">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="topbar-username hide-mobile">{user?.name?.split(' ')[0]}</span>
                    <FiChevronDown className="hide-mobile" />
                </div>
            </div>
        </header>
    );
}
