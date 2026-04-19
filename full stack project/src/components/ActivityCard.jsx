import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Clock, MapPin, ArrowRight, Star } from 'lucide-react';
import { categories } from '../data/mockData';
import './ActivityCard.css';

export default function ActivityCard({ activity, index = 0 }) {
    const category = categories.find(c => c.id === activity.category);
    const fillPercent = Math.round((activity.enrolled / activity.capacity) * 100);
    const spotsLeft = activity.capacity - activity.enrolled;

    return (
        <motion.div
            className="activity-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
        >
            <Link to={`/activity/${activity.id}`} className="activity-card__link">
                {/* Image */}
                <div className="activity-card__image-wrapper">
                    <img
                        src={activity.image}
                        alt={activity.title}
                        className="activity-card__image"
                        loading="lazy"
                    />
                    <div className="activity-card__image-overlay" />

                    {/* Badges */}
                    <div className="activity-card__badges">
                        {activity.featured && (
                            <span className="activity-card__badge activity-card__badge--featured">
                                <Star size={12} /> Featured
                            </span>
                        )}
                        <span
                            className="activity-card__badge"
                            style={{ background: category?.color || '#6366f1' }}
                        >
                            {category?.label}
                        </span>
                    </div>

                    {activity.status === 'upcoming' && (
                        <div className="activity-card__status">Upcoming</div>
                    )}
                </div>

                {/* Content */}
                <div className="activity-card__content">
                    <h3 className="activity-card__title">{activity.title}</h3>
                    <p className="activity-card__desc">{activity.shortDesc}</p>

                    <div className="activity-card__meta">
                        <div className="activity-card__meta-item">
                            <Clock size={14} />
                            <span>{activity.schedule.split(',')[0]}</span>
                        </div>
                        <div className="activity-card__meta-item">
                            <MapPin size={14} />
                            <span>{activity.venue}</span>
                        </div>
                    </div>

                    {/* Capacity Bar */}
                    <div className="activity-card__capacity">
                        <div className="activity-card__capacity-header">
                            <div className="activity-card__capacity-info">
                                <Users size={14} />
                                <span>{activity.enrolled}/{activity.capacity}</span>
                            </div>
                            <span className={`activity-card__spots ${spotsLeft <= 5 ? 'activity-card__spots--low' : ''}`}>
                                {spotsLeft} spots left
                            </span>
                        </div>
                        <div className="activity-card__progress">
                            <motion.div
                                className="activity-card__progress-fill"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${fillPercent}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                                style={{
                                    background: fillPercent > 90
                                        ? 'var(--error-500)'
                                        : fillPercent > 70
                                            ? 'var(--warning-500)'
                                            : 'var(--gradient-primary)',
                                }}
                            />
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="activity-card__cta">
                        <span>View Details</span>
                        <ArrowRight size={16} />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
