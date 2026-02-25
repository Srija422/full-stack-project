import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { participationStats, mockUsers } from '../../data/mockData';
import { FiTrendingUp, FiTarget, FiClock, FiAward } from 'react-icons/fi';
import './ProgressTracking.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function ProgressTracking() {
    const stats = participationStats;

    const categoryData = {
        labels: stats.categoryBreakdown.map(c => c.category),
        datasets: [{
            data: stats.categoryBreakdown.map(c => c.count),
            backgroundColor: stats.categoryBreakdown.map(c => c.color),
            borderWidth: 0,
            hoverOffset: 8,
        }],
    };

    const trendData = {
        labels: stats.monthlyTrend.map(m => m.month),
        datasets: [{
            label: 'Activities',
            data: stats.monthlyTrend.map(m => m.count),
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#667eea',
        }],
    };

    const overallPercent = Math.round((stats.completedActivities / stats.totalActivities) * 100);

    const milestones = [
        { name: 'Join 5 Activities', progress: 100, completed: true },
        { name: 'Complete 10 Activities', progress: 50, completed: false },
        { name: 'Earn 5 Badges', progress: 80, completed: false },
        { name: '50 Hours Active', progress: 76, completed: false },
    ];

    return (
        <div className="page-transition progress-page">
            <div className="page-header">
                <h1>Progress Tracking</h1>
                <p>Monitor your extracurricular participation and achievements</p>
            </div>

            {/* Summary Stats */}
            <div className="grid-4 dashboard-stats">
                {[
                    { label: 'Total Activities', value: stats.totalActivities, icon: <FiTarget />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
                    { label: 'Completed', value: stats.completedActivities, icon: <FiTrendingUp />, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
                    { label: 'Upcoming', value: stats.upcomingActivities, icon: <FiClock />, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
                    { label: 'Hours Invested', value: stats.hoursSpent, icon: <FiAward />, color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
                ].map((stat, i) => (
                    <div key={stat.label} className={`stat-card animate-slide-up stagger-${i + 1}`}>
                        <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>{stat.icon}</div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="progress-content-grid">
                {/* Category Breakdown */}
                <div className="glass-card progress-section">
                    <h2>Category Breakdown</h2>
                    <div className="doughnut-container">
                        <Doughnut data={categoryData} options={{
                            responsive: true, maintainAspectRatio: false,
                            cutout: '60%',
                            plugins: {
                                legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, font: { family: 'Inter', size: 12 }, color: '#94a3b8' } },
                                tooltip: { backgroundColor: 'rgba(15,23,42,0.9)', padding: 12, cornerRadius: 8, titleFont: { family: 'Inter' }, bodyFont: { family: 'Inter' } },
                            },
                        }} />
                    </div>
                </div>

                {/* Monthly Trend */}
                <div className="glass-card progress-section">
                    <h2>Monthly Activity Trend</h2>
                    <div className="trend-chart-wrapper">
                        <Line data={trendData} options={{
                            responsive: true, maintainAspectRatio: false,
                            plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(15,23,42,0.9)', padding: 12, cornerRadius: 8 } },
                            scales: {
                                x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 12 }, color: '#94a3b8' } },
                                y: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { font: { family: 'Inter', size: 12 }, color: '#94a3b8', stepSize: 1 } },
                            },
                        }} />
                    </div>
                </div>
            </div>

            {/* Milestones */}
            <div className="glass-card progress-section">
                <h2>🎯 Milestones</h2>
                <div className="milestones-grid">
                    {milestones.map((m, i) => (
                        <div key={m.name} className={`milestone-card animate-slide-up stagger-${i + 1}`}>
                            <div className="milestone-header">
                                <span className="milestone-name">{m.name}</span>
                                <span className={`milestone-status ${m.completed ? 'completed' : ''}`}>
                                    {m.completed ? '✅ Done' : `${m.progress}%`}
                                </span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-bar-fill" style={{
                                    width: `${m.progress}%`,
                                    background: m.completed ? '#22c55e' : 'var(--gradient-primary)',
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Category Progress Bars */}
            <div className="glass-card progress-section">
                <h2>Category-wise Progress</h2>
                <div className="category-bars">
                    {stats.categoryBreakdown.map((cat, i) => (
                        <div key={cat.category} className={`category-bar-item animate-slide-up stagger-${i + 1}`}>
                            <div className="category-bar-header">
                                <span className="category-bar-label">
                                    <span className="category-dot" style={{ background: cat.color }} />
                                    {cat.category}
                                </span>
                                <span className="category-bar-count">{cat.count} activities</span>
                            </div>
                            <div className="progress-bar" style={{ height: '10px' }}>
                                <div className="progress-bar-fill" style={{
                                    width: `${(cat.count / 5) * 100}%`,
                                    background: cat.color,
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
