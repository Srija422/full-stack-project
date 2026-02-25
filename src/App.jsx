import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProgressTracking from './pages/student/ProgressTracking';
import CalendarView from './pages/CalendarView';
import ActivitiesPage from './pages/ActivitiesPage';
import ActivityDetail from './pages/ActivityDetail';
import ProfilePage from './pages/ProfilePage';
import SearchResults from './pages/SearchResults';
import ManageActivities from './pages/admin/ManageActivities';
import AdminStudents from './pages/admin/AdminStudents';
import './App.css';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (location.pathname === '/') {
      return <LandingPage />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

// Dashboard redirect based on role
function DashboardRedirect() {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminDashboard />;
  return <StudentDashboard />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />}
      />

      {/* Dashboard Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardRedirect />} />
        <Route path="calendar" element={<CalendarView />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="activities/:id" element={<ActivityDetail />} />
        <Route path="progress" element={<ProgressTracking />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="search" element={<SearchResults />} />

        {/* Admin Routes */}
        <Route path="manage-activities" element={<ManageActivities />} />
        <Route path="admin-reports" element={<AdminDashboard />} />
        <Route path="admin-students" element={<AdminStudents />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
