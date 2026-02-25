import { useNotifications } from '../context/NotificationContext';
import { FiCheck, FiInfo, FiAlertTriangle, FiCheckCircle, FiBell } from 'react-icons/fi';
import './NotificationPanel.css';

const typeIcons = {
    info: <FiInfo />,
    success: <FiCheckCircle />,
    warning: <FiAlertTriangle />,
};

export default function NotificationPanel({ onClose }) {
    const { notifications, markAsRead, markAllAsRead } = useNotifications();

    return (
        <div className="notification-panel animate-slide-up">
            <div className="notif-header">
                <h3>Notifications</h3>
                <button className="notif-mark-all" onClick={markAllAsRead}>
                    <FiCheck /> Mark all read
                </button>
            </div>
            <div className="notif-list">
                {notifications.length === 0 ? (
                    <div className="notif-empty">
                        <FiBell />
                        <p>No notifications</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`notif-item ${!notif.read ? 'notif-unread' : ''}`}
                            onClick={() => markAsRead(notif.id)}
                        >
                            <div className={`notif-icon notif-icon-${notif.type}`}>
                                {typeIcons[notif.type] || <FiInfo />}
                            </div>
                            <div className="notif-content">
                                <span className="notif-title">{notif.title}</span>
                                <p className="notif-message">{notif.message}</p>
                                <span className="notif-time">{notif.time}</span>
                            </div>
                            {!notif.read && <span className="notif-dot" />}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
