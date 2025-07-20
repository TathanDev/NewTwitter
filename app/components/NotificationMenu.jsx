'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { createApiUrl } from '@/utils/url';
import {
  XMarkIcon,
  CheckIcon,
  TrashIcon,
  UserPlusIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  AtSymbolIcon,
  EnvelopeIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';

const NotificationTypeIcon = ({ type }) => {
  const iconClass = "size-5";
  
  switch (type) {
    case 'mention':
      return <AtSymbolIcon className={`${iconClass} text-blue-500`} />;
    case 'comment':
      return <ChatBubbleLeftIcon className={`${iconClass} text-green-500`} />;
    case 'reply':
      return <ArrowUturnLeftIcon className={`${iconClass} text-teal-500`} />;
    case 'like':
      return <HeartIcon className={`${iconClass} text-red-500`} />;
    case 'follow':
      return <UserPlusIcon className={`${iconClass} text-purple-500`} />;
    case 'message':
      return <EnvelopeIcon className={`${iconClass} text-orange-500`} />;
    default:
      return null;
  }
};

const formatTimeAgo = (dateString) => {
  const now = new Date();
  const notifDate = new Date(dateString);
  const diffInSeconds = Math.floor((now - notifDate) / 1000);

  if (diffInSeconds < 60) {
    return "à l'instant";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `il y a ${minutes}min`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `il y a ${hours}h`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `il y a ${days}j`;
  } else {
    return notifDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  }
};

export default function NotificationMenu({ isOpen, onClose }) {
  const { currentUser } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(createApiUrl('/api/notifications'));
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des notifications');
      }
      
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      setError('Impossible de charger les notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchNotifications();
    }
  }, [isOpen, currentUser]);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    try {
      const response = await fetch(createApiUrl('/api/notifications'), {
        method: 'PATCH',
      });
      
      if (response.ok) {
        setNotifications(notifications.map(notif => ({ ...notif, is_read: true })));
      }
    } catch (error) {
      console.error('Erreur lors du marquage des notifications:', error);
    }
  };

  // Marquer une notification comme lue
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(createApiUrl(`/api/notifications/${notificationId}`), {
        method: 'PATCH',
      });
      
      if (response.ok) {
        setNotifications(notifications.map(notif => 
          notif.notification_id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        ));
      }
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  // Supprimer une notification
  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(createApiUrl(`/api/notifications/${notificationId}`), {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setNotifications(notifications.filter(notif => notif.notification_id !== notificationId));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
    }
  };

  // Gérer le clic sur une notification (navigation)
  const handleNotificationClick = (notification) => {
    // Marquer comme lue si pas encore lue
    if (!notification.is_read) {
      markAsRead(notification.notification_id);
    }

    // Navigation selon le type de notification
    switch (notification.type) {
      case 'mention':
      case 'comment':
      case 'like':
        if (notification.related_type === 'post' && notification.related_id) {
          window.location.href = `/post/${notification.related_id}`;
        }
        break;
      case 'reply':
        if (notification.related_type === 'comment' && notification.related_id) {
          // Pour les réponses, on utilise les métadonnées pour naviguer vers le post
          const metadata = notification.metadata;
          if (metadata && metadata.post_id) {
            // Navigation vers le post avec ancrage sur le commentaire
            window.location.href = `/post/${metadata.post_id}#comment-${notification.related_id}`;
          } else {
            // Fallback : navigation directe vers le commentaire (peut ne pas fonctionner selon le contexte)
            window.location.href = `#comment-${notification.related_id}`;
          }
        }
        break;
      case 'follow':
        if (notification.sender_id) {
          window.location.href = `/profile/${notification.sender_id}`;
        }
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Menu des notifications */}
      <div className="fixed top-16 right-4 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 z-50 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
          <div className="flex items-center gap-2">
            {notifications.some(n => !n.is_read) && (
              <button
                onClick={markAllAsRead}
                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Tout marquer comme lu"
              >
                <CheckIcon className="size-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XMarkIcon className="size-4" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Chargement...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchNotifications}
                className="mt-2 text-blue-500 hover:text-blue-600"
              >
                Réessayer
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <p className="text-gray-500 dark:text-gray-400">Aucune notification</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group ${
                    !notification.is_read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    {/* Photo de profil de l'expéditeur ou icône du type */}
                    <div className="flex-shrink-0">
                      {notification.sender?.pfp_user ? (
                        <img
                          src={notification.sender.pfp_user}
                          alt={notification.sender.pseudo_user}
                          className="size-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="size-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <NotificationTypeIcon type={notification.type} />
                        </div>
                      )}
                    </div>

                    {/* Contenu de la notification */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <NotificationTypeIcon type={notification.type} />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </span>
                            {!notification.is_read && (
                              <div className="size-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {notification.content}
                          </p>
                          {notification.sender && (
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              Par @{notification.sender.pseudo_user}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatTimeAgo(notification.created_at)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.is_read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.notification_id);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                              title="Marquer comme lu"
                            >
                              <CheckIcon className="size-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.notification_id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            title="Supprimer"
                          >
                            <TrashIcon className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => window.location.href = '/notifications'}
              className="w-full text-center text-sm text-blue-500 hover:text-blue-600 font-medium"
            >
              Voir toutes les notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
}
