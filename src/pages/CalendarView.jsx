import { useState, useMemo } from 'react';
import { activities, activityCategories } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi';
import './CalendarView.css';

export default function CalendarView() {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
    const [selectedDate, setSelectedDate] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const filteredActivities = useMemo(() => {
        if (activeFilter === 'all') return activities;
        return activities.filter(a => a.category === activeFilter);
    }, [activeFilter]);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const monthName = new Date(year, month).toLocaleString('en', { month: 'long', year: 'numeric' });

    const getEventsForDate = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return filteredActivities.filter(a => a.date === dateStr);
    };

    const calendarDays = [];
    for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

    const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const categoryColors = {};
    activityCategories.forEach(c => { categoryColors[c.id] = c.color; });

    return (
        <div className="page-transition calendar-page">
            <div className="page-header">
                <h1>📅 Event Calendar</h1>
                <p>View upcoming activities by date</p>
            </div>

            {/* Filter Bar */}
            <div className="calendar-filters glass-card">
                <FiFilter />
                <button
                    className={`filter-chip ${activeFilter === 'all' ? 'filter-active' : ''}`}
                    onClick={() => setActiveFilter('all')}
                >All</button>
                {activityCategories.map(cat => (
                    <button
                        key={cat.id}
                        className={`filter-chip ${activeFilter === cat.id ? 'filter-active' : ''}`}
                        onClick={() => setActiveFilter(cat.id)}
                        style={activeFilter === cat.id ? { background: cat.color, borderColor: cat.color, color: '#fff' } : {}}
                    >
                        {cat.icon} {cat.label}
                    </button>
                ))}
            </div>

            <div className="calendar-layout">
                {/* Calendar Grid */}
                <div className="glass-card calendar-main">
                    <div className="calendar-nav">
                        <button className="btn-icon" onClick={prevMonth}><FiChevronLeft /></button>
                        <h2>{monthName}</h2>
                        <button className="btn-icon" onClick={nextMonth}><FiChevronRight /></button>
                    </div>

                    <div className="calendar-weekdays">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="weekday">{d}</div>
                        ))}
                    </div>

                    <div className="calendar-grid">
                        {calendarDays.map((day, i) => {
                            const events = day ? getEventsForDate(day) : [];
                            const isToday = day === 24 && month === 1 && year === 2026;
                            const isSelected = day === selectedDate;

                            return (
                                <div
                                    key={i}
                                    className={`calendar-day ${!day ? 'empty' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${events.length > 0 ? 'has-events' : ''}`}
                                    onClick={() => day && setSelectedDate(day)}
                                >
                                    {day && (
                                        <>
                                            <span className="day-number">{day}</span>
                                            {events.length > 0 && (
                                                <div className="day-dots">
                                                    {events.slice(0, 3).map((e, j) => (
                                                        <span
                                                            key={j}
                                                            className="day-dot"
                                                            style={{ background: categoryColors[e.category] || '#3b82f6' }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Day Events */}
                <div className="glass-card calendar-sidebar">
                    <h3>
                        {selectedDate
                            ? new Date(year, month, selectedDate).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })
                            : 'Select a date'}
                    </h3>
                    {selectedDate ? (
                        selectedEvents.length > 0 ? (
                            <div className="calendar-events">
                                {selectedEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className="calendar-event-card animate-slide-up"
                                        onClick={() => navigate(`/activities/${event.id}`)}
                                        style={{ borderLeft: `4px solid ${categoryColors[event.category]}` }}
                                    >
                                        <span className="event-card-time">{event.time}</span>
                                        <h4>{event.title}</h4>
                                        <p>{event.venue}</p>
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                                            <span className="badge badge-primary">{event.category}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {event.totalSeats - event.registeredSeats} seats left
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-events">
                                <p>📭</p>
                                <p>No events on this day</p>
                            </div>
                        )
                    ) : (
                        <div className="no-events">
                            <p>👈</p>
                            <p>Click a date to see events</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
