import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowRight, Sparkles, ChevronRight, Calendar, MapPin, Clock,
    Users, Trophy, Zap, Award, BookOpen, Palette, Heart, Cpu,
} from 'lucide-react';
import ActivityCard from '../components/ActivityCard';
import { initialActivities, upcomingEvents, stats, testimonials, categories } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const iconMap = { Users, Trophy, Zap, Award, Calendar, BookOpen, Palette, Heart, Cpu };

function CountUp({ end, duration = 2000 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const numericEnd = parseInt(end.replace(/[^0-9]/g, ''));

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = 0;
                    const step = numericEnd / (duration / 16);
                    const timer = setInterval(() => {
                        start += step;
                        if (start >= numericEnd) {
                            setCount(numericEnd);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [numericEnd, duration]);

    const suffix = end.replace(/[0-9,]/g, '');
    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
    const { isAuthenticated } = useAuth();
    const { scrollYProgress } = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
    const featuredActivities = initialActivities.filter(a => a.featured);

    const containerVariants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <div className="home">
            {/* ===== HERO ===== */}
            <motion.section className="hero" style={{ y: heroY, opacity: heroOpacity }}>
                <div className="hero__bg">
                    <div className="hero__orb hero__orb--1" />
                    <div className="hero__orb hero__orb--2" />
                    <div className="hero__orb hero__orb--3" />
                    <div className="hero__grid" />
                </div>

                <div className="container hero__content">
                    <motion.div
                        className="hero__text"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className="hero__badge"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Sparkles size={16} />
                            <span>Discover Your Passion</span>
                        </motion.div>

                        <h1 className="hero__title">
                            Unlock Your
                            <br />
                            <span className="hero__title-gradient animate-gradient">
                                Extraordinary
                            </span>
                            <br />
                            Potential
                        </h1>

                        <p className="hero__subtitle">
                            Explore 50+ extracurricular activities, join vibrant communities,
                            and build skills that shape your future. Your journey starts here.
                        </p>

                        <div className="hero__actions">
                            <Link to="/activities" className="hero__btn hero__btn--primary">
                                <span>Explore Activities</span>
                                <ArrowRight size={18} />
                            </Link>
                            {!isAuthenticated && (
                                <Link to="/activities" className="hero__btn hero__btn--secondary">
                                    <span>Learn More</span>
                                    <ChevronRight size={18} />
                                </Link>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero__visual"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <div className="hero__card-stack">
                            {featuredActivities.slice(0, 3).map((act, i) => (
                                <motion.div
                                    key={act.id}
                                    className="hero__floating-card"
                                    style={{ '--card-index': i }}
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, 1, -1, 0],
                                    }}
                                    transition={{
                                        duration: 4 + i,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                        delay: i * 0.5,
                                    }}
                                >
                                    <img src={act.image} alt={act.title} />
                                    <div className="hero__floating-card-info">
                                        <span className="hero__floating-card-category" style={{ color: categories.find(c => c.id === act.category)?.color }}>
                                            {categories.find(c => c.id === act.category)?.label}
                                        </span>
                                        <h4>{act.title}</h4>
                                        <div className="hero__floating-card-meta">
                                            <Users size={12} />
                                            <span>{act.enrolled} members</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="hero__scroll"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="hero__scroll-line" />
                </motion.div>
            </motion.section>

            {/* ===== STATS ===== */}
            <section className="stats-section section">
                <div className="container">
                    <motion.div
                        className="stats-grid"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                    >
                        {stats.map((stat, i) => {
                            const Icon = iconMap[stat.icon] || Zap;
                            return (
                                <motion.div key={i} className="stat-card" variants={itemVariants}>
                                    <div className="stat-card__icon">
                                        <Icon size={24} />
                                    </div>
                                    <div className="stat-card__value">
                                        <CountUp end={stat.value} />
                                    </div>
                                    <div className="stat-card__label">{stat.label}</div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ===== CATEGORIES ===== */}
            <section className="categories-section section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="section-header__tag">Categories</span>
                        <h2 className="section-header__title">
                            Find Your <span className="gradient-text">Perfect Fit</span>
                        </h2>
                        <p className="section-header__desc">
                            Browse activities across multiple categories to find what excites you most.
                        </p>
                    </motion.div>

                    <motion.div
                        className="categories-grid"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {categories.map((cat, i) => {
                            const Icon = iconMap[cat.icon] || Zap;
                            const count = initialActivities.filter(a => a.category === cat.id).length;
                            return (
                                <motion.div
                                    key={cat.id}
                                    className="category-card"
                                    variants={itemVariants}
                                    whileHover={{ y: -6, scale: 1.02 }}
                                >
                                    <Link to={`/activities?category=${cat.id}`} className="category-card__inner">
                                        <div className="category-card__icon" style={{ background: `${cat.color}20`, color: cat.color }}>
                                            <Icon size={28} />
                                        </div>
                                        <h3 className="category-card__title">{cat.label}</h3>
                                        <p className="category-card__count">{count} {count === 1 ? 'activity' : 'activities'}</p>
                                        <div className="category-card__arrow" style={{ color: cat.color }}>
                                            <ArrowRight size={16} />
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ===== FEATURED ===== */}
            <section className="featured-section section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="section-header__tag">Featured</span>
                        <h2 className="section-header__title">
                            Popular <span className="gradient-text">Activities</span>
                        </h2>
                        <p className="section-header__desc">
                            Most sought-after extracurriculars this semester.
                        </p>
                    </motion.div>

                    <div className="featured-grid">
                        {featuredActivities.map((activity, i) => (
                            <ActivityCard key={activity.id} activity={activity} index={i} />
                        ))}
                    </div>

                    <motion.div
                        className="section-cta"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/activities" className="section-cta__btn">
                            View All Activities
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ===== UPCOMING EVENTS ===== */}
            <section className="events-section section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="section-header__tag">Events</span>
                        <h2 className="section-header__title">
                            Upcoming <span className="gradient-text">Events</span>
                        </h2>
                        <p className="section-header__desc">
                            Don't miss these exciting events happening soon on campus.
                        </p>
                    </motion.div>

                    <motion.div
                        className="events-grid"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {upcomingEvents.map((event, i) => {
                            const eventDate = new Date(event.date);
                            const month = eventDate.toLocaleString('en', { month: 'short' }).toUpperCase();
                            const day = eventDate.getDate();
                            return (
                                <motion.div key={event.id} className="event-card" variants={itemVariants} whileHover={{ y: -4 }}>
                                    <div className="event-card__image">
                                        <img src={event.image} alt={event.title} loading="lazy" />
                                        <div className="event-card__date">
                                            <span className="event-card__month">{month}</span>
                                            <span className="event-card__day">{day}</span>
                                        </div>
                                    </div>
                                    <div className="event-card__content">
                                        <span className="event-card__category" style={{ color: categories.find(c => c.id === event.category)?.color }}>
                                            {categories.find(c => c.id === event.category)?.label}
                                        </span>
                                        <h3 className="event-card__title">{event.title}</h3>
                                        <p className="event-card__desc">{event.description}</p>
                                        <div className="event-card__meta">
                                            <div className="event-card__meta-item">
                                                <Clock size={14} />
                                                <span>{event.time}</span>
                                            </div>
                                            <div className="event-card__meta-item">
                                                <MapPin size={14} />
                                                <span>{event.venue}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className="testimonials-section section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="section-header__tag">Testimonials</span>
                        <h2 className="section-header__title">
                            What Students <span className="gradient-text">Say</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        className="testimonials-grid"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {testimonials.map((t, i) => (
                            <motion.div key={i} className="testimonial-card" variants={itemVariants} whileHover={{ y: -6 }}>
                                <div className="testimonial-card__quote">"</div>
                                <p className="testimonial-card__text">{t.text}</p>
                                <div className="testimonial-card__author">
                                    <div className="testimonial-card__avatar">{t.avatar}</div>
                                    <div>
                                        <p className="testimonial-card__name">{t.name}</p>
                                        <p className="testimonial-card__role">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="cta-section section">
                <div className="container">
                    <motion.div
                        className="cta-card"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="cta-card__bg">
                            <div className="cta-card__orb cta-card__orb--1" />
                            <div className="cta-card__orb cta-card__orb--2" />
                        </div>
                        <h2 className="cta-card__title">Ready to Get Started?</h2>
                        <p className="cta-card__desc">
                            Join thousands of students who are already making the most of their college experience.
                        </p>
                        <div className="cta-card__actions">
                            <Link to="/activities" className="hero__btn hero__btn--primary">
                                <span>Browse Activities</span>
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="footer">
                <div className="container footer__inner">
                    <div className="footer__brand">
                        <div className="navbar__logo">
                            <span className="navbar__logo-text">
                                Nex<span className="gradient-text">us</span>
                            </span>
                        </div>
                        <p className="footer__desc">
                            Empowering students to discover, participate, and excel in extracurricular activities.
                        </p>
                    </div>
                    <div className="footer__links">
                        <div className="footer__col">
                            <h4>Platform</h4>
                            <Link to="/activities">Activities</Link>
                            <Link to="/activities">Events</Link>
                            <Link to="/dashboard">Dashboard</Link>
                        </div>
                        <div className="footer__col">
                            <h4>Categories</h4>
                            {categories.slice(0, 4).map(c => (
                                <Link key={c.id} to={`/activities?category=${c.id}`}>{c.label}</Link>
                            ))}
                        </div>
                        <div className="footer__col">
                            <h4>Support</h4>
                            <a href="#">Help Center</a>
                            <a href="#">Contact Us</a>
                            <a href="#">Privacy Policy</a>
                        </div>
                    </div>
                    <div className="footer__bottom">
                        <p>&copy; 2026 Nexus. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
