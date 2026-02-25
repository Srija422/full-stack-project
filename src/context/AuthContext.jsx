import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('seam_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem('seam_user');
            }
        }
        setLoading(false);
    }, []);

    const login = (email, secret, role) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!email || !secret) {
                    reject(new Error('Invalid credentials'));
                    return;
                }

                let baseUser = null;
                try {
                    const savedRaw = localStorage.getItem('seam_user');
                    if (savedRaw) {
                        const saved = JSON.parse(savedRaw);
                        if (saved?.email === email) {
                            baseUser = saved;
                        }
                    }
                } catch {
                    // ignore parse errors and fall back to mock users
                }

                if (!baseUser) {
                    baseUser =
                        role === 'admin'
                            ? mockUsers.admin
                            : role === 'faculty'
                                ? mockUsers.faculty
                                : mockUsers.student;
                }

                let mergedUser = {
                    ...baseUser,
                    email,
                    role: role || baseUser.role,
                };

                const defaultNames = new Set([
                    mockUsers.student.name,
                    mockUsers.admin.name,
                    mockUsers.faculty?.name,
                ]);

                if (!mergedUser.name || defaultNames.has(mergedUser.name)) {
                    const localPart = email.split('@')[0] || 'User';
                    const prettyName = localPart
                        .split(/[._-]/)
                        .filter(Boolean)
                        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                        .join(' ');
                    mergedUser = { ...mergedUser, name: prettyName || 'User' };
                }

                setUser(mergedUser);
                localStorage.setItem('seam_user', JSON.stringify(mergedUser));
                resolve(mergedUser);
            }, 800);
        });
    };

    const signup = (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const baseUser =
                    data.role === 'admin'
                        ? mockUsers.admin
                        : data.role === 'faculty'
                            ? mockUsers.faculty
                            : mockUsers.student;

                const newUser = {
                    ...baseUser,
                    name: data.name,
                    email: data.email,
                    role: data.role || 'student',
                    department: data.department || baseUser.department,
                    year: data.year || baseUser.year,
                };
                setUser(newUser);
                localStorage.setItem('seam_user', JSON.stringify(newUser));
                resolve(newUser);
            }, 800);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('seam_user');
    };

    const updateUser = (updates) => {
        setUser(prev => {
            const updated = { ...prev, ...updates };
            localStorage.setItem('seam_user', JSON.stringify(updated));
            return updated;
        });
    };

    const value = { user, login, signup, logout, updateUser, loading, isAuthenticated: !!user };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
