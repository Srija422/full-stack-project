import { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { adminStats } from '../../data/mockData';
import { FiUsers, FiActivity, FiClipboard, FiLayers, FiTrendingUp } from 'react-icons/fi';
import './AdminDashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function AdminDashboard() {
    const stats = [
        { label: 'Total Students', value: adminStats.totalStudents.toLocaleString(), icon: <FiUsers />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
        { label: 'Total Activities', value: adminStats.totalActivities, icon: <FiActivity />, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
        { label: 'Registrations', value: adminStats.totalRegistrations.toLocaleString(), icon: <FiClipboard />, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
        { label: 'Active Clubs', value: adminStats.activeClubs, icon: <FiLayers />, color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
    ];

    const lineData = {
        labels: adminStats.registrationTrend.map(d => d.month),
        datasets: [{
            label: 'Registrations',
            data: adminStats.registrationTrend.map(d => d.count),
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#667eea',
        }],
    };

    const barData = {
        labels: adminStats.popularActivities.map(a => a.name),
        datasets: [{
            label: 'Registrations',
            data: adminStats.popularActivities.map(a => a.registrations),
            backgroundColor: ['#8b5cf6', '#3b82f6', '#22c55e', '#f97316', '#ec4899'],
            borderRadius: 8,
            maxBarThickness: 50,
        }],
    };

    const doughnutData = {
        labels: adminStats.categoryDistribution.map(c => c.category),
        datasets: [{
            data: adminStats.categoryDistribution.map(c => c.count),
            backgroundColor: ['#ec4899', '#22c55e', '#3b82f6', '#f97316', '#8b5cf6', '#ef4444'],
            borderWidth: 0,
            hoverOffset: 8,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: { family: 'Inter' },
                bodyFont: { family: 'Inter' },
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { family: 'Inter', size: 12 }, color: '#94a3b8' },
            },
            y: {
                grid: { color: 'rgba(148,163,184,0.1)' },
                ticks: { font: { family: 'Inter', size: 12 }, color: '#94a3b8' },
            },
        },
    };

    const statusColors = { confirmed: 'badge-success', pending: 'badge-warning' };

    return (
        <div className="page-transition admin-dashboard">
            <div className="page-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Overview of all extracurricular activities and engagement</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid-4 dashboard-stats">
                {stats.map((stat, i) => (
                    <div key={stat.label} className={`stat-card animate-slide-up stagger-${i + 1}`}>
                        <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="admin-charts-grid">
                <div className="glass-card chart-card">
                    <div className="section-header">
                        <h2><FiTrendingUp /> Registration Trend</h2>
                    </div>
                    <div className="chart-wrapper">
                        <Line data={lineData} options={chartOptions} />
                    </div>
                </div>

                <div className="glass-card chart-card">
                    <div className="section-header">
                        <h2>Popular Activities</h2>
                    </div>
                    <div className="chart-wrapper">
                        <Bar data={barData} options={{ ...chartOptions, indexAxis: 'y' }} />
                    </div>
                </div>

                <div className="glass-card chart-card chart-card-sm">
                    <div className="section-header">
                        <h2>Category Distribution</h2>
                    </div>
                    <div className="chart-wrapper chart-wrapper-doughnut">
                        <Doughnut data={doughnutData} options={{
                            ...chartOptions,
                            scales: undefined,
                            plugins: {
                                ...chartOptions.plugins,
                                legend: {
                                    position: 'bottom',
                                    labels: { padding: 16, usePointStyle: true, font: { family: 'Inter', size: 12 }, color: '#94a3b8' },
                                },
                            },
                            cutout: '65%',
                        }} />
                    </div>
                </div>
            </div>

            {/* Recent Registrations Table */}
            <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                <div className="section-header">
                    <h2>Recent Registrations</h2>
                </div>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Activity</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminStats.recentRegistrations.map((reg, i) => (
                                <tr key={i} className={`animate-slide-up stagger-${i + 1}`}>
                                    <td style={{ fontWeight: 600 }}>{reg.student}</td>
                                    <td>{reg.activity}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{reg.date}</td>
                                    <td><span className={`badge ${statusColors[reg.status]}`}>{reg.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
