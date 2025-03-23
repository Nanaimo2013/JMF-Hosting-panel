import React, { useEffect, useState } from 'react';
import { XIcon } from '@heroicons/react/solid';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import styles from '@/theme/style.module.css';
import { useSignal } from '@preact/signals-react';
import Portal from './Portal';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    duration?: number;
    onClose?: () => void;
}

const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationCircleIcon,
    info: InformationCircleIcon,
};

export const Notification = ({ id, type, title, message, duration = 5000, onClose }: NotificationProps) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (duration > 0 && onClose) {
            const timeout = setTimeout(() => {
                setIsExiting(true);
                setTimeout(onClose, 300);
            }, duration);

            return () => clearTimeout(timeout);
        }
    }, [duration, onClose]);

    const Icon = icons[type];

    return (
        <div
            className={classNames(
                styles.notification,
                styles[`notification_${type}`],
                isExiting && styles.notification_exiting
            )}
        >
            <div className={styles.notification_icon}>
                <Icon className="w-6 h-6" />
            </div>
            <div className={styles.notification_content}>
                <div className={styles.notification_title}>{title}</div>
                <div className={styles.notification_message}>{message}</div>
            </div>
            <button className={styles.notification_close} onClick={() => setIsExiting(true)}>
                <XIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

interface NotificationManagerProps {
    maxVisible?: number;
}

export const NotificationManager = ({ maxVisible = 5 }: NotificationManagerProps) => {
    const notifications = useSignal<NotificationProps[]>([]);

    const addNotification = (notification: Omit<NotificationProps, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        notifications.value = [
            { ...notification, id },
            ...notifications.value,
        ].slice(0, maxVisible);
    };

    const removeNotification = (id: string) => {
        notifications.value = notifications.value.filter((n) => n.id !== id);
    };

    return (
        <Portal>
            <div className={styles.notification_container}>
                {notifications.value.map((notification) => (
                    <Notification
                        key={notification.id}
                        {...notification}
                        onClose={() => removeNotification(notification.id)}
                    />
                ))}
            </div>
        </Portal>
    );
};

export const useNotification = () => {
    const addNotification = (type: NotificationType, title: string, message: string, duration?: number) => {
        // This will be implemented by the NotificationContext provider
        window.dispatchEvent(
            new CustomEvent('notification', {
                detail: { type, title, message, duration },
            })
        );
    };

    return {
        success: (title: string, message: string, duration?: number) =>
            addNotification('success', title, message, duration),
        error: (title: string, message: string, duration?: number) => addNotification('error', title, message, duration),
        warning: (title: string, message: string, duration?: number) =>
            addNotification('warning', title, message, duration),
        info: (title: string, message: string, duration?: number) => addNotification('info', title, message, duration),
    };
};

export default NotificationManager; 