import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const MOCK_USERS = {
    admin: {
        id: 'admin-001',
        name: 'Dr. Rajesh Kumar',
        email: 'admin@nexus.edu',
        role: 'admin',
        avatar: null,
        department: 'Student Affairs',
    },
    student: {
        id: 'student-001',
        name: 'Arjun Patel',
        email: 'arjun.patel@nexus.edu',
        role: 'student',
        avatar: null,
        department: 'Computer Science',
        year: '3rd Year',
        registeredActivities: ['act-001', 'act-003', 'act-007'],
        participationHistory: [
            { activityId: 'act-001', date: '2025-11-15', status: 'attended' },
            { activityId: 'act-003', date: '2025-12-01', status: 'attended' },
            { activityId: 'act-002', date: '2025-10-20', status: 'missed' },
        ],
    },
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const loginAsAdmin = () => setUser(MOCK_USERS.admin);
    const loginAsStudent = () => setUser(MOCK_USERS.student);
    const logout = () => setUser(null);

    const registerForActivity = (activityId) => {
        if (user && user.role === 'student') {
            setUser(prev => ({
                ...prev,
                registeredActivities: prev.registeredActivities.includes(activityId)
                    ? prev.registeredActivities
                    : [...prev.registeredActivities, activityId],
            }));
        }
    };

    const unregisterFromActivity = (activityId) => {
        if (user && user.role === 'student') {
            setUser(prev => ({
                ...prev,
                registeredActivities: prev.registeredActivities.filter(id => id !== activityId),
            }));
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loginAsAdmin,
                loginAsStudent,
                logout,
                registerForActivity,
                unregisterFromActivity,
                isAuthenticated: !!user,
                isAdmin: user?.role === 'admin',
                isStudent: user?.role === 'student',
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
