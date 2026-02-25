import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAward } from 'react-icons/fi';
import './Auth.css';

export default function LoginPage() {
    const [searchParams] = useSearchParams();
    const initialRoleParam = searchParams.get('role');
    const initialRole = ['student', 'admin', 'faculty'].includes(initialRoleParam)
        ? initialRoleParam
        : 'student';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(initialRole);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loginMethod, setLoginMethod] = useState('password'); // 'password' | 'otp'
    const [otp, setOtp] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email');
            return;
        }

        const usingPassword = loginMethod === 'password';

        if (usingPassword && !password) {
            setError('Please enter your password');
            return;
        }

        if (!usingPassword) {
            if (!otp) {
                setError('Please enter the OTP');
                return;
            }
            if (otp !== '123456') {
                setError('Invalid OTP. Use 123456 for demo login.');
                return;
            }
        }

        setLoading(true);
        setError('');
        try {
            const secret = usingPassword ? password : otp;
            await login(email, secret, role);
            navigate('/dashboard');
        } catch {
            setError('Authentication failed. Please try again.');
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
                    <h1>Welcome Back</h1>
                    <p>Sign in to CoHub</p>
                </div>

                <div className="role-toggle">
                    <button
                        className={`role-btn ${role === 'student' ? 'role-active' : ''}`}
                        onClick={() => setRole('student')}
                        type="button"
                    >
                        🎓 Student
                    </button>
                    <button
                        className={`role-btn ${role === 'admin' ? 'role-active' : ''}`}
                        onClick={() => setRole('admin')}
                        type="button"
                    >
                        🔑 Admin
                    </button>
                    <button
                        className={`role-btn ${role === 'faculty' ? 'role-active' : ''}`}
                        onClick={() => setRole('faculty')}
                        type="button"
                    >
                        👩‍🏫 Faculty
                    </button>
                </div>

                <div className="role-toggle" style={{ marginTop: '1rem' }}>
                    <button
                        type="button"
                        className={`role-btn ${loginMethod === 'password' ? 'role-active' : ''}`}
                        onClick={() => { setLoginMethod('password'); setError(''); }}
                    >
                        Password Login
                    </button>
                    <button
                        type="button"
                        className={`role-btn ${loginMethod === 'otp' ? 'role-active' : ''}`}
                        onClick={() => { setLoginMethod('otp'); setError(''); }}
                    >
                        OTP Login
                    </button>
                </div>

                {error && <div className="auth-error animate-fade-in">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div className="input-wrapper">
                            <FiMail className="input-icon" />
                            <input
                                type="email"
                                className="form-input form-input-icon"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {loginMethod === 'password' && (
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input form-input-icon"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="input-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>
                    )}

                    {loginMethod === 'otp' && (
                        <div className="form-group">
                            <label className="form-label">One-Time Passcode</label>
                            <div className="input-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    type="text"
                                    className="form-input form-input-icon"
                                    placeholder="Enter 6-digit OTP (use 123456)"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <p className="form-helper-text">
                                For demo purposes, use <strong>123456</strong> as the OTP.
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`btn btn-primary auth-submit ${loading ? 'btn-loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? <span className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Sign In'}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Create one</Link>
                </p>
            </div>
        </div>
    );
}
