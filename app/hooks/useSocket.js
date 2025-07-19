'use client';

import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (userId) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only initialize if we have a userId
    if (!userId) return;

    // Initialize socket connection first to make sure server exists
    const initSocket = async () => {
      try {
        await fetch('/api/socket');
        
        // Initialize socket connection
        socketRef.current = io({
          path: '/api/socket',
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
          console.log('Connected to socket server');
          setIsConnected(true);
          
          // Join user's personal room
          socket.emit('join-user', userId);
        });

        socket.on('disconnect', () => {
          console.log('Disconnected from socket server');
          setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
        });
      } catch (error) {
        console.error('Failed to initialize socket:', error);
      }
    };

    initSocket();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  // Helper functions
  const sendMessage = (messageData) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send-message', messageData);
    }
  };

  const joinConversation = (conversationId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join-conversation', conversationId);
    }
  };

  const leaveConversation = (conversationId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave-conversation', conversationId);
    }
  };

  const markAsRead = (conversationId, userId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('mark-read', { conversationId, userId });
    }
  };

  const startTyping = (conversationId, userId, userName) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing-start', { conversationId, userId, userName });
    }
  };

  const stopTyping = (conversationId, userId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing-stop', { conversationId, userId });
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    sendMessage,
    joinConversation,
    leaveConversation,
    markAsRead,
    startTyping,
    stopTyping
  };
};

export default useSocket;
