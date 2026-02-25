import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { activities, activityCategories } from '../data/mockData';
import { FiSearch, FiMapPin, FiClock } from 'react-icons/fi';
import './SearchResults.css';

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    const [localQuery, setLocalQuery] = useState(query);

    const results = useMemo(() => {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        return activities.filter(a =>
            a.title.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q) ||
            a.venue.toLowerCase().includes(q) ||
            a.organizer.toLowerCase().includes(q)
        );
    }, [query]);

    const categoryColors = {};
    activityCategories.forEach(c => { categoryColors[c.id] = c.color; });

    const handleSearch = (e) => {
        e.preventDefault();
        if (localQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(localQuery.trim())}`);
        }
    };

    const highlightMatch = (text) => {
        if (!query.trim()) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) =>
            regex.test(part)
                ? <mark key={i} className="search-highlight">{part}</mark>
                : part
        );
    };

    return (
        <div className="page-transition search-page">
            <div className="page-header">
                <h1>🔍 Search Results</h1>
            </div>

            <form className="search-form glass-card" onSubmit={handleSearch}>
                <div className="search-container" style={{ maxWidth: '100%', flex: 1 }}>
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search activities, events, clubs..."
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        autoFocus
                        style={{ width: '100%' }}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Search</button>
            </form>

            {query && (
                <p className="search-meta">
                    Found <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''} for "<strong>{query}</strong>"
                </p>
            )}

            <div className="search-results">
                {results.length === 0 && query ? (
                    <div className="empty-state glass-card">
                        <p style={{ fontSize: '3rem' }}>🔍</p>
                        <h3>No results found</h3>
                        <p>Try different keywords or browse all activities</p>
                    </div>
                ) : (
                    results.map((activity, i) => (
                        <div
                            key={activity.id}
                            className={`search-result-item glass-card animate-slide-up stagger-${(i % 6) + 1}`}
                            onClick={() => navigate(`/activities/${activity.id}`)}
                        >
                            <img src={activity.banner} alt={activity.title} className="result-thumb" />
                            <div className="result-content">
                                <div className="result-header">
                                    <h3>{highlightMatch(activity.title)}</h3>
                                    <span
                                        className="activity-category-tag"
                                        style={{ background: categoryColors[activity.category] }}
                                    >
                                        {activity.category}
                                    </span>
                                </div>
                                <p className="result-desc">{highlightMatch(activity.description.slice(0, 120))}...</p>
                                <div className="result-meta">
                                    <span><FiMapPin /> {activity.venue}</span>
                                    <span><FiClock /> {activity.date}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
