import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiAward, FiBook, FiCalendar } from 'react-icons/fi';
import './Auth.css';

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: '',
        email: '',
        department: '',
        year: '',
        password: '',
        confirmPassword: '',
        role: 'student',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleNext = () => {
        if (!form.name || !form.email || !form.department || !form.year) {
            setError('Please fill in all fields');
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.password || !form.confirmPassword) { setError('Please fill in all fields'); return; }
        if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
        setLoading(true);
        try {
            await signup(form);
            navigate('/dashboard');
        } catch {
            setError('Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-shapes">
                <div className="auth-shape auth-shape-1" />
                <div className="auth-shape auth-shape-2" />
                <div className="auth-shape auth-shape-3" />
            </div>

            <div className="auth-card glass animate-scale-in">
                <div className="auth-header">
                    <div className="auth-logo">
                        <FiAward />
                    </div>
                    <h1>Create Account</h1>
                    <p>Join CoHub</p>
                </div>

                <div className="signup-progress">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                        <span className="step-num">1</span>
                        <span className="step-label">Info</span>
                    </div>
                    <div className="progress-line">
                        <div className={`progress-line-fill ${step >= 2 ? 'filled' : ''}`} />
                    </div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                        <span className="step-num">2</span>
                        <span className="step-label">Security</span>
                    </div>
                </div>

                {error && <div className="auth-error animate-fade-in">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {step === 1 ? (
                        <div className="animate-slide-left" key="step1">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div className="input-wrapper">
                                    <FiUser className="input-icon" />
                                    <input type="text" name="name" className="form-input form-input-icon"
                                        placeholder="John Doe" value={form.name} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <div className="input-wrapper">
                                    <FiMail className="input-icon" />
                                    <input type="email" name="email" className="form-input form-input-icon"
                                        placeholder="your@email.com" value={form.email} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <div className="input-wrapper">
                                    <FiBook className="input-icon" />
                                    <input
                                        type="text"
                                        name="department"
                                        className="form-input form-input-icon"
                                        placeholder="e.g. Computer Science"
                                        value={form.department}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Year</label>
                                <div className="input-wrapper">
                                    <FiCalendar className="input-icon" />
                                    <input
                                        type="text"
                                        name="year"
                                        className="form-input form-input-icon"
                                        placeholder="e.g. 3rd Year"
                                        value={form.year}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">I am a</label>
                                <div className="role-toggle">
                                    <button type="button" className={`role-btn ${form.role === 'student' ? 'role-active' : ''}`}
                                        onClick={() => setForm({ ...form, role: 'student' })}>🎓 Student</button>
                                    <button type="button" className={`role-btn ${form.role === 'admin' ? 'role-active' : ''}`}
                                        onClick={() => setForm({ ...form, role: 'admin' })}>🔑 Admin</button>
                                    <button type="button" className={`role-btn ${form.role === 'faculty' ? 'role-active' : ''}`}
                                        onClick={() => setForm({ ...form, role: 'faculty' })}>👩‍🏫 Faculty</button>
                                </div>
                            </div>
                            <button type="button" className="btn btn-primary auth-submit" onClick={handleNext}>
                                Continue
                            </button>
                        </div>
                    ) : (
                        <div className="animate-slide-right" key="step2">
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="input-wrapper">
                                    <FiLock className="input-icon" />
                                    <input type={showPassword ? 'text' : 'password'} name="password"
                                        className="form-input form-input-icon" placeholder="Create password"
                                        value={form.password} onChange={handleChange} />
                                    <button type="button" className="input-toggle" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <div className="input-wrapper">
                                    <FiLock className="input-icon" />
                                    <input type="password" name="confirmPassword"
                                        className="form-input form-input-icon" placeholder="Confirm password"
                                        value={form.confirmPassword} onChange={handleChange} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>
                                    Back
                                </button>
                                <button type="submit" className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
                                    disabled={loading} style={{ flex: 1 }}>
                                    {loading ? <span className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Create Account'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
