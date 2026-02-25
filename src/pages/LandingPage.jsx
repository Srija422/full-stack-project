import { useNavigate } from 'react-router-dom';
import { FiAward, FiCalendar, FiActivity, FiUsers, FiArrowRight } from 'react-icons/fi';
import './LandingPage.css';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <div className="landing-bg" />

            <header className="landing-header">
                <div className="landing-logo">
                    <div className="landing-logo-icon">
                        <FiAward />
                    </div>
                    <div className="landing-logo-text">
                        <span className="landing-logo-title">CoHub</span>
                        <span className="landing-logo-subtitle">Campus Activity Hub</span>
                    </div>
                </div>

                <div className="landing-header-actions">
                    <button
                        className="btn btn-ghost"
                        onClick={() => navigate('/login')}
                    >
                        Sign in
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/signup')}
                    >
                        Get started
                    </button>
                </div>
            </header>

            <main className="landing-main">
                <section className="landing-hero glass">
                    <div className="landing-hero-text">
                        <h1>
                            Welcome to <span>CoHub</span>
                        </h1>
                        <p>
                            A modern platform to discover, manage, and track all your campus
                            activities in one collaborative hub for students and administrators.
                        </p>
                        <div className="landing-cta">
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/login?role=student')}
                            >
                                I&apos;m a Student <FiArrowRight />
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate('/login?role=admin')}
                            >
                                I&apos;m an Admin
                            </button>
                        </div>
                        <div className="landing-highlights">
                            <span><FiActivity /> Smart activity tracking</span>
                            <span><FiCalendar /> Unified event calendar</span>
                            <span><FiUsers /> Student–admin collaboration</span>
                        </div>
                    </div>

                    <div className="landing-hero-preview">
                        <div className="preview-card preview-card-primary">
                            <div className="preview-icon">
                                <FiCalendar />
                            </div>
                            <h3>Upcoming Events</h3>
                            <p>Stay ahead with a clear view of your next activities.</p>
                        </div>
                        <div className="preview-card preview-card-secondary">
                            <div className="preview-icon">
                                <FiActivity />
                            </div>
                            <h3>Engagement Insights</h3>
                            <p>Visualize participation, badges, and achievements at a glance.</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="landing-footer">
                <span>© {new Date().getFullYear()} CoHub. All rights reserved.</span>
            </footer>
        </div>
    );
}

