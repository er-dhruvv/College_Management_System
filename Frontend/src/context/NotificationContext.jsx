import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message, type }]);
        
        // Auto-remove after duration
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full">
                {notifications.map((n) => (
                    <NotificationItem 
                        key={n.id} 
                        notification={n} 
                        onClose={() => removeNotification(n.id)} 
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

const NotificationItem = ({ notification, onClose }) => {
    const { message, type } = notification;

    const getIcon = () => {
        switch (type) {
            case 'success': return 'fa-circle-check';
            case 'error': return 'fa-circle-xmark';
            case 'warning': return 'fa-triangle-exclamation';
            default: return 'fa-circle-info';
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success': return 'border-emerald-200 bg-emerald-50 text-emerald-800';
            case 'error': return 'border-rose-200 bg-rose-50 text-rose-800';
            case 'warning': return 'border-amber-200 bg-amber-50 text-amber-800';
            default: return 'border-blue-200 bg-blue-50 text-blue-800';
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'success': return 'text-emerald-500';
            case 'error': return 'text-rose-500';
            case 'warning': return 'text-amber-500';
            default: return 'text-blue-500';
        }
    };

    return (
        <div className={`notification-item animate-slide-in p-4 rounded-xl border-l-4 shadow-sm backdrop-blur-md flex items-start gap-3 relative overflow-hidden ${getColors()}`}>
            <div className={`mt-0.5 ${getIconColor()}`}>
                <i className={`fa-solid ${getIcon()} text-lg`}></i>
            </div>
            <div className="flex-1 pr-6">
                <p className="text-sm font-medium leading-relaxed">{message}</p>
            </div>
            <button 
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
                <i className="fa-solid fa-xmark text-sm"></i>
            </button>
            <div className="notification-progress-bar opacity-20 bg-current"></div>
        </div>
    );
};
