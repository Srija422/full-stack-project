import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import './Toast.css';

const ToastContext = createContext();

const icons = {
    success: <CheckCircle2 size={18} />,
    error: <XCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    info: <Info size={18} />,
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type, duration }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

function Toast({ toast, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, toast.duration);
        return () => clearTimeout(timer);
    }, [toast.duration, onClose]);

    return (
        <motion.div
            className={`toast toast--${toast.type}`}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
            <div className="toast__icon">{icons[toast.type]}</div>
            <p className="toast__message">{toast.message}</p>
            <button className="toast__close" onClick={onClose}>
                <X size={14} />
            </button>
            <motion.div
                className="toast__progress"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: toast.duration / 1000, ease: 'linear' }}
            />
        </motion.div>
    );
}

export const useToast = () => useContext(ToastContext);
