import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import './Notification.css';

interface NotificationData {
  id: number;
  type: string;
  message: string;
}

const socket: Socket = io('http://localhost:5000');

export const Notification = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    socket.on('notification', (data: NotificationData) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  return (
    <div className="notification-container">
      <button className="notify-btn" onClick={() => setOpen(!open)}>
        <img src="/assets/bell.png" alt="알림" className="bell-icon" />
      </button>

      {open && (
        <div className="notify-list">
          <h4>알림</h4>
          {notifications.length === 0 ? (
            <p className="empty">알림이 없습니다.</p>
          ) : (
            notifications.map((n) => (
              <div className="notify-item" key={n.id}>
                <strong>{n.type}</strong>
                <p>{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
