import { adminStats } from '../../data/mockData';
import { FiUser, FiMail, FiCalendar, FiActivity } from 'react-icons/fi';
import './AdminStudents.css';

const mockStudentsList = [
    { id: 1, name: 'Priya Sharma', email: 'priya.s@university.edu', department: 'Computer Science', year: '2nd Year', activities: 8 },
    { id: 2, name: 'Mike Chen', email: 'mike.c@university.edu', department: 'Mechanical Eng.', year: '3rd Year', activities: 5 },
    { id: 3, name: 'Aisha Patel', email: 'aisha.p@university.edu', department: 'Electronics', year: '1st Year', activities: 12 },
    { id: 4, name: 'James Wilson', email: 'james.w@university.edu', department: 'Business Admin', year: '4th Year', activities: 3 },
    { id: 5, name: 'Sara Kim', email: 'sara.k@university.edu', department: 'Architecture', year: '2nd Year', activities: 7 },
    { id: 6, name: 'Alex Johnson', email: 'alex.j@university.edu', department: 'Computer Science', year: '3rd Year', activities: 10 },
];

export default function AdminStudents() {
    return (
        <div className="page-transition admin-students">
            <div className="page-header">
                <h1>Students</h1>
                <p>View and manage student participation</p>
            </div>

            <div className="grid-3">
                {[
                    { label: 'Total Students', value: adminStats.totalStudents, icon: <FiUser />, color: '#8b5cf6' },
                    { label: 'Active This Month', value: 342, icon: <FiActivity />, color: '#22c55e' },
                    { label: 'New This Semester', value: 186, icon: <FiCalendar />, color: '#3b82f6' },
                ].map((stat, i) => (
                    <div key={stat.label} className={`stat-card animate-slide-up stagger-${i + 1}`}>
                        <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>{stat.icon}</div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Year</th>
                                <th>Activities</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockStudentsList.map((stu, i) => (
                                <tr key={stu.id} className={`animate-slide-up stagger-${i + 1}`}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: 32, height: 32, borderRadius: '50%',
                                                background: 'var(--gradient-cool)', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                color: 'white', fontWeight: 700, fontSize: '0.8rem'
                                            }}>
                                                {stu.name.charAt(0)}
                                            </div>
                                            <strong>{stu.name}</strong>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>{stu.email}</td>
                                    <td>{stu.department}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{stu.year}</td>
                                    <td><span className="badge badge-primary">{stu.activities}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
