"use client";
import { useState, useEffect } from "react";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import MessageModal from "./MessageModal";
import { useSocket } from '../hooks/useSocket';
import { useUser } from '@/app/context/UserContext';

export default function MessageButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useUser();
  const { socket } = useSocket(currentUser?.id_user);

  useEffect(() => {
    // Fetch initial unread count
    fetchUnreadCount();

    // Listen for real-time unread count updates
    if (socket) {
      const handleUnreadCountUpdate = (data) => {
        setUnreadCount(data.unreadCount);
      };

      socket.on('unread-count-update', handleUnreadCountUpdate);

      return () => {
        socket.off('unread-count-update', handleUnreadCountUpdate);
      };
    }
  }, [socket]);

  async function fetchUnreadCount() {
    try {
      const response = await fetch('/api/messages/unread-count');
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du nombre de messages non lus:", error);
    }
  }

  const openModal = (e) => {
    // Si Ctrl+click ou clic du milieu, ouvrir la page dédiée
    if (e.ctrlKey || e.metaKey || e.button === 1) {
      window.open('/messages', '_blank');
      return;
    }
    
    setIsModalOpen(true);
    // Réinitialiser le compteur quand l'utilisateur ouvre les messages
    setUnreadCount(0);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="relative rounded-xl bg-gray-100 dark:bg-gray-800 p-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-all duration-200 hover:shadow-md group"
      >
        <span className="absolute -inset-1.5" />
        <span className="sr-only">Voir les messages</span>
        <ChatBubbleBottomCenterTextIcon
          aria-hidden="true"
          className="size-5 group-hover:scale-110 transition-transform duration-200"
        />
        
        {/* Badge de notification pour les messages non lus */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <MessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
