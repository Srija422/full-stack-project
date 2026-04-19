import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Activities from './pages/Activities';
import ActivityDetail from './pages/ActivityDetail';
import Dashboard from './pages/Dashboard';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/activities"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Activities />
            </motion.div>
          }
        />
        <Route
          path="/activity/:id"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <ActivityDetail />
            </motion.div>
          }
        />
        <Route
          path="/dashboard"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Dashboard />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <AnimatedRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
