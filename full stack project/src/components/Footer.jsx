import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Twitter, Linkedin, Youtube, Mail } from 'lucide-react';
import { categories } from '../data/mockData';
import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="site-footer__glow" />
            <div className="container">
                {/* Newsletter */}
                <motion.div
                    className="site-footer__newsletter"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="site-footer__newsletter-text">
                        <h3>Stay in the loop</h3>
                        <p>Get the latest updates on new activities, events, and platform features.</p>
                    </div>
                    <form className="site-footer__newsletter-form" onSubmit={e => e.preventDefault()}>
                        <div className="site-footer__newsletter-input-wrap">
                            <Mail size={18} />
                            <input type="email" placeholder="Enter your email" />
                        </div>
                        <motion.button
                            type="submit"
                            className="site-footer__newsletter-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Subscribe <ArrowRight size={16} />
                        </motion.button>
                    </form>
                </motion.div>

                {/* Main Footer Grid */}
                <div className="site-footer__grid">
                    {/* Brand */}
                    <div className="site-footer__brand">
                        <Link to="/" className="navbar__logo">
                            <span className="navbar__logo-text">
                                Nex<span className="gradient-text">us</span>
                            </span>
                        </Link>
                        <p className="site-footer__desc">
                            The #1 platform for managing student extracurricular activities. Trusted by 500+ universities worldwide.
                        </p>
                        <div className="site-footer__socials">
                            <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
                            <a href="#" aria-label="GitHub"><Github size={18} /></a>
                            <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
                            <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
                        </div>
                    </div>

                    {/* Product */}
                    <div className="site-footer__col">
                        <h4>Product</h4>
                        <Link to="/activities">Activities</Link>
                        <Link to="/calendar">Calendar</Link>
                        <Link to="/analytics">Analytics</Link>
                        <Link to="/pricing">Pricing</Link>
                        <Link to="/dashboard">Dashboard</Link>
                    </div>

                    {/* Categories */}
                    <div className="site-footer__col">
                        <h4>Categories</h4>
                        {categories.map(c => (
                            <Link key={c.id} to={`/activities?category=${c.id}`}>{c.label}</Link>
                        ))}
                    </div>

                    {/* Resources */}
                    <div className="site-footer__col">
                        <h4>Resources</h4>
                        <a href="#">Documentation</a>
                        <a href="#">API Reference</a>
                        <a href="#">Blog</a>
                        <a href="#">Community</a>
                    </div>

                    {/* Company */}
                    <div className="site-footer__col">
                        <h4>Company</h4>
                        <a href="#">About Us</a>
                        <a href="#">Careers</a>
                        <a href="#">Contact</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="site-footer__bottom">
                    <p>&copy; {currentYear} Nexus. All rights reserved.</p>
                    <p className="site-footer__tagline">Built with ❤️ for campus communities</p>
                </div>
            </div>
        </footer>
    );
}
