import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
    FiHome, FiCalendar, FiActivity, FiUser, FiSettings,
    FiLogOut, FiSun, FiMoon, FiMenu, FiX, FiBarChart2,
    FiUsers, FiAward, FiGrid
} from 'react-icons/fi';
import './Sidebar.css';

const studentLinks = [
    { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/calendar', icon: <FiCalendar />, label: 'Calendar' },
    { to: '/activities', icon: <FiActivity />, label: 'Activities' },
    { to: '/progress', icon: <FiBarChart2 />, label: 'Progress' },
    { to: '/profile', icon: <FiUser />, label: 'Profile' },
];

const adminLinks = [
    { to: '/dashboard', icon: <FiGrid />, label: 'Overview' },
    { to: '/manage-activities', icon: <FiSettings />, label: 'Manage Activities' },
    { to: '/calendar', icon: <FiCalendar />, label: 'Calendar' },
    { to: '/admin-reports', icon: <FiBarChart2 />, label: 'Reports' },
    { to: '/admin-students', icon: <FiUsers />, label: 'Students' },
];

export default function Sidebar({ isOpen, onToggle }) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const links = user?.role === 'admin' ? adminLinks : studentLinks;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}
            <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="logo-icon">
                            <FiAward />
                        </div>
                        <div className="logo-text">
                            <span className="logo-title">CoHub</span>
                            <span className="logo-subtitle">Campus Activity Hub</span>
                        </div>
                    </div>
                    <button className="sidebar-close hide-desktop" onClick={onToggle}>
                        <FiX />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <span className="nav-section-title">Menu</span>
                        {links.map((link, i) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'nav-link-active' : ''} stagger-${i + 1}`
                                }
                                onClick={() => window.innerWidth < 769 && onToggle()}
                            >
                                <span className="nav-icon">{link.icon}</span>
                                <span className="nav-label">{link.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <button className="theme-toggle" onClick={toggleTheme}>
                        {theme === 'light' ? <FiMoon /> : <FiSun />}
                        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>

                    <div className="sidebar-user">
                        <div className="sidebar-avatar">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="sidebar-user-info">
                            <span className="sidebar-user-name">{user?.name}</span>
                            <span className="sidebar-user-role">{user?.role}</span>
                        </div>
                        <button className="logout-btn" onClick={handleLogout} title="Logout">
                            <FiLogOut />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
