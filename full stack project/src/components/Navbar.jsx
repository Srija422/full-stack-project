import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sun, Moon, Menu, X, LogIn, LogOut, User, Shield,
    Home, LayoutDashboard, Compass, Bell, ChevronDown,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { notifications as mockNotifications } from '../data/mockData';
import './Navbar.css';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { user, isAuthenticated, isAdmin, loginAsAdmin, loginAsStudent, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [loginDropdown, setLoginDropdown] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const location = useLocation();
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);
    const profileRef = useRef(null);

    const unreadCount = mockNotifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
        setLoginDropdown(false);
        setNotifOpen(false);
        setProfileOpen(false);
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setLoginDropdown(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { path: '/', label: 'Home', icon: <Home size={18} /> },
        { path: '/activities', label: 'Activities', icon: <Compass size={18} /> },
        ...(isAuthenticated ? [{ path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> }] : []),
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <motion.nav
            className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
            <div className="navbar__inner container">
                {/* Logo */}
                <Link to="/" className="navbar__logo">
                    <motion.div
                        className="navbar__logo-icon"
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                    >
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <defs>
                                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#a78bfa" />
                                </linearGradient>
                            </defs>
                            <circle cx="16" cy="16" r="14" stroke="url(#logoGrad)" strokeWidth="2.5" fill="none" />
                            <path d="M10 16L14 20L22 12" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.div>
                    <span className="navbar__logo-text">
                        Nex<span className="gradient-text">us</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="navbar__links">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`navbar__link ${isActive(link.path) ? 'navbar__link--active' : ''}`}
                        >
                            {link.icon}
                            <span>{link.label}</span>
                            {isActive(link.path) && (
                                <motion.div
                                    className="navbar__link-indicator"
                                    layoutId="navIndicator"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Right Section */}
                <div className="navbar__actions">
                    {/* Theme Toggle */}
                    <motion.button
                        className="navbar__icon-btn"
                        onClick={toggleTheme}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Toggle theme"
                    >
                        <AnimatePresence mode="wait">
                            {theme === 'dark' ? (
                                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <Sun size={20} />
                                </motion.div>
                            ) : (
                                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <Moon size={20} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    {isAuthenticated ? (
                        <>
                            {/* Notifications */}
                            <div className="navbar__dropdown-wrapper" ref={notifRef}>
                                <motion.button
                                    className="navbar__icon-btn navbar__notif-btn"
                                    onClick={() => setNotifOpen(!notifOpen)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && <span className="navbar__badge">{unreadCount}</span>}
                                </motion.button>
                                <AnimatePresence>
                                    {notifOpen && (
                                        <motion.div
                                            className="navbar__dropdown navbar__dropdown--notif"
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="navbar__dropdown-header">
                                                <h4>Notifications</h4>
                                                <span className="navbar__dropdown-count">{unreadCount} new</span>
                                            </div>
                                            <div className="navbar__notif-list">
                                                {mockNotifications.map(notif => (
                                                    <div key={notif.id} className={`navbar__notif-item ${!notif.read ? 'navbar__notif-item--unread' : ''}`}>
                                                        <div className={`navbar__notif-dot navbar__notif-dot--${notif.type}`} />
                                                        <div>
                                                            <p className="navbar__notif-title">{notif.title}</p>
                                                            <p className="navbar__notif-msg">{notif.message}</p>
                                                            <span className="navbar__notif-time">{notif.time}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Profile */}
                            <div className="navbar__dropdown-wrapper" ref={profileRef}>
                                <motion.button
                                    className="navbar__profile-btn"
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="navbar__avatar">
                                        {isAdmin ? <Shield size={16} /> : <User size={16} />}
                                    </div>
                                    <span className="navbar__profile-name">{user.name.split(' ')[0]}</span>
                                    <ChevronDown size={14} className={`navbar__chevron ${profileOpen ? 'navbar__chevron--open' : ''}`} />
                                </motion.button>
                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            className="navbar__dropdown navbar__dropdown--profile"
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="navbar__dropdown-user">
                                                <div className="navbar__avatar navbar__avatar--lg">
                                                    {isAdmin ? <Shield size={20} /> : <User size={20} />}
                                                </div>
                                                <div>
                                                    <p className="navbar__dropdown-name">{user.name}</p>
                                                    <p className="navbar__dropdown-role">{isAdmin ? 'Administrator' : 'Student'}</p>
                                                </div>
                                            </div>
                                            <div className="navbar__dropdown-divider" />
                                            <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={logout}>
                                                <LogOut size={16} />
                                                <span>Sign Out</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        <div className="navbar__dropdown-wrapper" ref={dropdownRef}>
                            <motion.button
                                className="navbar__login-btn"
                                onClick={() => setLoginDropdown(!loginDropdown)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <LogIn size={18} />
                                <span>Sign In</span>
                            </motion.button>
                            <AnimatePresence>
                                {loginDropdown && (
                                    <motion.div
                                        className="navbar__dropdown"
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <button className="navbar__dropdown-item" onClick={() => { loginAsStudent(); setLoginDropdown(false); }}>
                                            <User size={16} />
                                            <div>
                                                <p className="navbar__dropdown-item-title">Student</p>
                                                <p className="navbar__dropdown-item-desc">Browse & register for activities</p>
                                            </div>
                                        </button>
                                        <button className="navbar__dropdown-item" onClick={() => { loginAsAdmin(); setLoginDropdown(false); }}>
                                            <Shield size={16} />
                                            <div>
                                                <p className="navbar__dropdown-item-title">Admin</p>
                                                <p className="navbar__dropdown-item-desc">Manage activities & events</p>
                                            </div>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <motion.button
                        className="navbar__icon-btn navbar__menu-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="navbar__mobile"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="navbar__mobile-inner">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.path}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        to={link.path}
                                        className={`navbar__mobile-link ${isActive(link.path) ? 'navbar__mobile-link--active' : ''}`}
                                    >
                                        {link.icon}
                                        <span>{link.label}</span>
                                    </Link>
                                </motion.div>
                            ))}
                            {!isAuthenticated && (
                                <>
                                    <div className="navbar__dropdown-divider" />
                                    <motion.button
                                        className="navbar__mobile-link"
                                        onClick={() => { loginAsStudent(); setMenuOpen(false); }}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: navLinks.length * 0.1 }}
                                    >
                                        <User size={18} />
                                        <span>Sign in as Student</span>
                                    </motion.button>
                                    <motion.button
                                        className="navbar__mobile-link"
                                        onClick={() => { loginAsAdmin(); setMenuOpen(false); }}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: (navLinks.length + 1) * 0.1 }}
                                    >
                                        <Shield size={18} />
                                        <span>Sign in as Admin</span>
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
