'use client';

import { useState, useEffect, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useSocket } from '@/app/hooks/useSocket';
import { useUser } from '../context/UserContext';
import { createApiUrl } from '@/utils/url';
import NotificationMenu from './NotificationMenu';

export default function NotificationBell() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useUser();
  const { socket } = useSocket(currentUser?.id_user);
  const containerRef = useRef(null);

  // Récupérer le nombre de notifications non lues
  const fetchNotificationCount = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(createApiUrl('/api/notifications/unread-count'));
      if (response.ok) {
        const data = await response.json();
        setNotificationCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de notifications:', error);
    }
  };

  // Charger le nombre initial de notifications
  useEffect(() => {
    fetchNotificationCount();
  }, [currentUser]);

  // Écouter les mises à jour de notifications en temps réel
  useEffect(() => {
    if (!socket) return;

    const handleNotificationUpdate = (data) => {
      setNotificationCount(data.count || 0);
    };

    const handleNewNotification = () => {
      // Recharger le compte exact depuis l'API au lieu d'incrémenter
      // Évite les problèmes de désynchronisation
      fetchNotificationCount();
    };

    socket.on('notification-update', handleNotificationUpdate);
    socket.on('new-notification', handleNewNotification);

    return () => {
      socket.off('notification-update', handleNotificationUpdate);
      socket.off('new-notification', handleNewNotification);
    };
  }, [socket]);

  const handleBellClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
    // Recharger le nombre de notifications quand on ferme le menu
    fetchNotificationCount();
  };

  // Gérer le clic extérieur pour fermer le menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={handleBellClick}
        className="relative rounded-xl bg-gray-100 dark:bg-gray-800 p-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-all duration-200 hover:shadow-md group"
      >
        <span className="absolute -inset-1.5" />
        <span className="sr-only">View notifications</span>
        <BellIcon
          aria-hidden="true"
          className={`size-5 group-hover:scale-110 transition-transform duration-200 ${
            isMenuOpen ? 'text-blue-500' : ''
          }`}
        />

        {/* Badge de notification pour les notifications non lues */}
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 font-medium">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </button>

      <NotificationMenu 
        isOpen={isMenuOpen}
        onClose={handleMenuClose}
      />
    </div>
  );
}
