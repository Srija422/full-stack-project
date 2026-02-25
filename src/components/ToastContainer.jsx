import { useNotifications } from '../context/NotificationContext';
import { FiX, FiInfo, FiCheckCircle, FiAlertTriangle, FiAlertCircle } from 'react-icons/fi';

const icons = {
    info: <FiInfo />,
    success: <FiCheckCircle />,
    warning: <FiAlertTriangle />,
    error: <FiAlertCircle />,
};

export default function ToastContainer() {
    const { toasts, removeToast } = useNotifications();

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast toast-${toast.type || 'info'}`}>
                    <div className="toast-icon">
                        {icons[toast.type] || icons.info}
                    </div>
                    <div style={{ flex: 1 }}>
                        {toast.title && (
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                {toast.title}
                            </div>
                        )}
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: toast.title ? '2px' : 0 }}>
                            {toast.message}
                        </div>
                    </div>
                    <button
                        onClick={() => removeToast(toast.id)}
                        style={{
                            background: 'none', border: 'none', color: 'var(--text-muted)',
                            cursor: 'pointer', padding: '4px', display: 'flex'
                        }}
                    >
                        <FiX />
                    </button>
                </div>
            ))}
        </div>
    );
}
