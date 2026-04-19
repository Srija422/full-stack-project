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

    const login = async (email, secret, role) => {
        if (!email || !secret) {
            throw new Error('Invalid credentials');
        }
        
        const res = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, secret, role })
        });
        
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Login failed');
        }
        
        const mergedUser = await res.json();

        setUser(mergedUser);
        localStorage.setItem('seam_user', JSON.stringify(mergedUser));
        return mergedUser;
    };

    const signup = async (data) => {
        const res = await fetch('http://localhost:8080/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Signup failed');
        }
        
        const newUser = await res.json();
        setUser(newUser);
        localStorage.setItem('seam_user', JSON.stringify(newUser));
        return newUser;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('seam_user');
    };

    const updateUser = async (updates) => {
        try {
            if (user?.email) {
                const res = await fetch(`http://localhost:8080/api/users/${user.email}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updates)
                });
                if (res.ok) {
                    const updated = await res.json();
                    setUser(updated);
                    localStorage.setItem('seam_user', JSON.stringify(updated));
                    return updated;
                }
            }
        } catch (e) {
            console.error('Failed backend update, falling back to local', e);
        }
        
        // Fallback for no email or offline
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
