import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Grid3X3, List, Users, Trophy, Palette, Cpu, Heart, BookOpen, Zap } from 'lucide-react';
import ActivityCard from '../components/ActivityCard';
import { initialActivities, categories } from '../data/mockData';
import './Activities.css';

const iconMap = { Users, Trophy, Palette, Cpu, Heart, BookOpen };

export default function Activities() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
    const [sortBy, setSortBy] = useState('featured');
    const [viewMode, setViewMode] = useState('grid');

    const filteredActivities = useMemo(() => {
        let result = [...initialActivities];

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                a =>
                    a.title.toLowerCase().includes(q) ||
                    a.description.toLowerCase().includes(q) ||
                    a.tags.some(t => t.toLowerCase().includes(q))
            );
        }

        if (selectedCategory !== 'all') {
            result = result.filter(a => a.category === selectedCategory);
        }

        switch (sortBy) {
            case 'featured':
                result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
                break;
            case 'popular':
                result.sort((a, b) => b.enrolled - a.enrolled);
                break;
            case 'name':
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'spots':
                result.sort((a, b) => (a.capacity - a.enrolled) - (b.capacity - b.enrolled));
                break;
            default:
                break;
        }

        return result;
    }, [search, selectedCategory, sortBy]);

    const handleCategoryChange = (catId) => {
        setSelectedCategory(catId);
        if (catId === 'all') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', catId);
        }
        setSearchParams(searchParams);
    };

    return (
        <div className="activities-page">
            {/* Header */}
            <section className="activities-page__header">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="activities-page__title">
                            Explore <span className="gradient-text">Activities</span>
                        </h1>
                        <p className="activities-page__subtitle">
                            Discover {initialActivities.length} activities across {categories.length} categories
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container">
                {/* Filters */}
                <motion.div
                    className="activities-page__filters"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Search */}
                    <div className="activities-page__search">
                        <Search size={18} className="activities-page__search-icon" />
                        <input
                            type="text"
                            placeholder="Search activities, clubs, sports..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="activities-page__search-input"
                        />
                        {search && (
                            <button className="activities-page__search-clear" onClick={() => setSearch('')}>
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Category Chips */}
                    <div className="activities-page__chips">
                        <motion.button
                            className={`activities-page__chip ${selectedCategory === 'all' ? 'activities-page__chip--active' : ''}`}
                            onClick={() => handleCategoryChange('all')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Zap size={14} />
                            All
                        </motion.button>
                        {categories.map(cat => {
                            const Icon = iconMap[cat.icon] || Zap;
                            return (
                                <motion.button
                                    key={cat.id}
                                    className={`activities-page__chip ${selectedCategory === cat.id ? 'activities-page__chip--active' : ''}`}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={selectedCategory === cat.id ? { background: cat.color, borderColor: cat.color } : {}}
                                >
                                    <Icon size={14} />
                                    {cat.label}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Sort & View */}
                    <div className="activities-page__toolbar">
                        <div className="activities-page__sort">
                            <Filter size={16} />
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="featured">Featured</option>
                                <option value="popular">Most Popular</option>
                                <option value="name">Name A-Z</option>
                                <option value="spots">Spots Left</option>
                            </select>
                        </div>
                        <div className="activities-page__view-toggle">
                            <button
                                className={`activities-page__view-btn ${viewMode === 'grid' ? 'activities-page__view-btn--active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid3X3 size={18} />
                            </button>
                            <button
                                className={`activities-page__view-btn ${viewMode === 'list' ? 'activities-page__view-btn--active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List size={18} />
                            </button>
                        </div>
                        <span className="activities-page__count">
                            {filteredActivities.length} {filteredActivities.length === 1 ? 'result' : 'results'}
                        </span>
                    </div>
                </motion.div>

                {/* Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${selectedCategory}-${sortBy}-${viewMode}`}
                        className={`activities-page__grid ${viewMode === 'list' ? 'activities-page__grid--list' : ''}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {filteredActivities.length > 0 ? (
                            filteredActivities.map((activity, i) => (
                                <ActivityCard key={activity.id} activity={activity} index={i} />
                            ))
                        ) : (
                            <motion.div
                                className="activities-page__empty"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Search size={48} />
                                <h3>No activities found</h3>
                                <p>Try adjusting your search or filters</p>
                                <button className="activities-page__reset-btn" onClick={() => { setSearch(''); handleCategoryChange('all'); }}>
                                    Reset Filters
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
