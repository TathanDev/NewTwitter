'use client';

import { useState, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useSocket } from '@/app/hooks/useSocket';
import { useUser } from '@/app/context/UserContext';

export default function NotificationBell() {
  const [notificationCount, setNotificationCount] = useState(0);
  const { currentUser } = useUser();
  const { socket } = useSocket(currentUser?.id_user);

  // For now, no actual notifications endpoint exists, so we'll keep it at 0
  // This is where you would fetch real notifications (likes, follows, comments, etc.)
  useEffect(() => {
    // TODO: Implement actual notifications API endpoint
    // For now, just set to 0
    setNotificationCount(0);
  }, []);

  // Listen for real-time notification updates (for actual notifications, not messages)
  useEffect(() => {
    if (!socket) return;

    const handleNotificationUpdate = (data) => {
      setNotificationCount(data.count || 0);
    };

    // This would be for actual notifications (likes, comments, follows, etc.)
    socket.on('notification-update', handleNotificationUpdate);

    return () => {
      socket.off('notification-update', handleNotificationUpdate);
    };
  }, [socket]);

  return (
    <a
      type="button"
      className="relative rounded-xl bg-gray-100 dark:bg-gray-800 p-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-all duration-200 hover:shadow-md group"
    >
      <span className="absolute -inset-1.5" />
      <span className="sr-only">View notifications</span>
      <BellIcon
        aria-hidden="true"
        className="size-5 group-hover:scale-110 transition-transform duration-200"
      />

      {/* Dynamic notification badge - only show if count > 0 */}
      {notificationCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[12px] h-3 px-1 bg-gradient-to-r from-pink-500 to-red-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
          <span className="text-[10px] font-bold text-white leading-none">
            {notificationCount > 99 ? '99+' : notificationCount}
          </span>
        </span>
      )}
    </a>
  );
}
