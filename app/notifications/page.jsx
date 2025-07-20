'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { createApiUrl } from '@/utils/url';
import {
  ArrowLeftIcon,
  CheckIcon,
  TrashIcon,
  UserPlusIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  AtSymbolIcon,
  EnvelopeIcon,
  BellIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';

const NotificationTypeIcon = ({ type }) => {
  const iconClass = "size-6";
  
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
      return <BellIcon className={`${iconClass} text-gray-500`} />;
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
      month: "long",
      year: "numeric",
    });
  }
};

export default function NotificationsPage() {
  const { currentUser } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Redirection si pas connecté
  useEffect(() => {
    if (!currentUser && !loading) {
      window.location.href = '/login';
    }
  }, [currentUser, loading]);

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
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

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

  // Supprimer toutes les notifications
  const deleteAllNotifications = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer toutes les notifications ? Cette action est irréversible.')) {
      return;
    }
    
    try {
      const deletePromises = notifications.map(notification =>
        fetch(createApiUrl(`/api/notifications/${notification.notification_id}`), {
          method: 'DELETE',
        })
      );
      
      await Promise.all(deletePromises);
      setNotifications([]);
    } catch (error) {
      console.error('Erreur lors de la suppression de toutes les notifications:', error);
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
        // Pour les réponses, naviguer vers le commentaire spécifique
        if (notification.related_type === 'comment' && notification.related_id) {
          // On suppose que le related_id pour une réponse est l'ID du commentaire parent
          // Il faudra récupérer le post_id à partir du commentaire
          // Pour l'instant, on navigue vers le post général
          window.location.href = `/post/${notification.metadata?.post_id}#comment-${notification.related_id}`;
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

  // Filtrer les notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.is_read;
    if (filter === 'all') return true;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;


  if (loading && !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Actions - seulement si des notifications existent */}
      {notifications.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="flex justify-end gap-2">
            <button
              onClick={deleteAllNotifications}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              <TrashIcon className="size-4" />
              Supprimer tout
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                <CheckIcon className="size-4" />
                Tout marquer comme lu
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            { key: 'all', label: 'Toutes', count: notifications.length },
            { key: 'unread', label: 'Non lues', count: unreadCount },
            { key: 'mention', label: 'Mentions', count: notifications.filter(n => n.type === 'mention').length },
            { key: 'comment', label: 'Commentaires', count: notifications.filter(n => n.type === 'comment').length },
            { key: 'reply', label: 'Réponses', count: notifications.filter(n => n.type === 'reply').length },
            { key: 'like', label: 'Likes', count: notifications.filter(n => n.type === 'like').length },
            { key: 'follow', label: 'Abonnés', count: notifications.filter(n => n.type === 'follow').length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {label} {count > 0 && <span className="ml-1">({count})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Chargement...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchNotifications}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Réessayer
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {filter === 'unread' 
                  ? 'Vous êtes à jour !'
                  : 'Les notifications apparaîtront ici quand vous en recevrez.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group ${
                    !notification.is_read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-4">
                    {/* Photo de profil de l'expéditeur ou icône du type */}
                    <div className="flex-shrink-0">
                      {notification.sender?.pfp_user ? (
                        <img
                          src={notification.sender.pfp_user}
                          alt={notification.sender.pseudo_user}
                          className="size-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="size-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <NotificationTypeIcon type={notification.type} />
                        </div>
                      )}
                    </div>

                    {/* Contenu de la notification */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <NotificationTypeIcon type={notification.type} />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {notification.title}
                            </span>
                            {!notification.is_read && (
                              <div className="size-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">
                            {notification.content}
                          </p>
                          {notification.sender && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">
                              Par @{notification.sender.pseudo_user}
                            </p>
                          )}
                          <p className="text-sm text-gray-400 dark:text-gray-500">
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
                              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                              title="Marquer comme lu"
                            >
                              <CheckIcon className="size-5" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.notification_id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            title="Supprimer"
                          >
                            <TrashIcon className="size-5" />
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
      </div>
    </div>
  );
}
