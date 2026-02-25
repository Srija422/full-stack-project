import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ToastContainer from '../ToastContainer';
import './DashboardLayout.css';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="dashboard-layout">
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
            <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <main className="main-content">
                <Outlet />
            </main>
            <ToastContainer />
        </div>
    );
}
