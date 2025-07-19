"use client";
import React, { useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";
import NewConversationModal from "./NewConversationModal";
import useSocket from "../hooks/useSocket";
import {
  XMarkIcon,
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

function MessageModal({ isOpen, onClose }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] =
    useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize WebSocket hook
  const {
    socket,
    isConnected,
    sendMessage: sendSocketMessage,
    joinConversation,
    leaveConversation,
    markAsRead,
    startTyping,
    stopTyping,
  } = useSocket(currentUser?.id_user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      fetchCurrentUser();
      fetchConversations();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket effects - Join/leave conversations
  useEffect(() => {
    if (!socket || !isConnected || !currentUser || !activeConversation) return;

    console.log('Joining conversation:', activeConversation);
    joinConversation(activeConversation);
    
    // Mark messages as read when joining conversation
    markAsRead(activeConversation, currentUser.id_user);

    return () => {
      console.log('Leaving conversation:', activeConversation);
      leaveConversation(activeConversation);
    };
  }, [socket, isConnected, currentUser, activeConversation]);

  // Listen for new messages via WebSocket
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (message) => {
      console.log('Received new message:', message);
      
      // Only add message if it belongs to the active conversation
      if (message.conversation_id === activeConversation) {
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(msg => msg.message_id === message.message_id);
          if (!exists) {
            console.log('Adding message to conversation');
            return [...prev, message];
          }
          return prev;
        });
      }
      
      // Always update conversations list for new messages
      fetchConversations();
    };

    const handleMessageSent = (data) => {
      console.log('Message sent successfully:', data);
    };

    const handleMessageError = (error) => {
      console.error('Message sending failed:', error);
    };

    // Listen to socket events
    socket.on('new-message', handleNewMessage);
    socket.on('message-sent', handleMessageSent);
    socket.on('message-error', handleMessageError);
    
    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('message-sent', handleMessageSent);
      socket.off('message-error', handleMessageError);
    };
  }, [socket, isConnected, activeConversation]);

  async function fetchCurrentUser() {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      setCurrentUser(data);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
    }
  }

  async function fetchConversations() {
    try {
      setLoading(true);
      const response = await fetch("/api/messages/conversations");
      const data = await response.json();
      if (response.ok) {
        setConversations(data.conversations || []);
        if (data.conversations && data.conversations.length > 0) {
          selectConversation(data.conversations[0]);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des conversations:", error);
    } finally {
      setLoading(false);
    }
  }

  async function selectConversation(conversation) {
    setActiveConversation(conversation.conversation_id);
    setActivePartner(conversation.partner);
    try {
      const response = await fetch(
        `/api/messages/${conversation.conversation_id}`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
    }
  }

  function sendMessage() {
    if (newMessage.trim() === "" || !activeConversation || !currentUser || !activePartner || !isConnected) return;

    const messageContent = newMessage.trim();
    setNewMessage("");

    // Send message via WebSocket
    sendSocketMessage({
      senderId: currentUser.id_user,
      receiverId: activePartner.id,
      content: messageContent,
      messageType: 'text'
    });
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays < 7) {
      return date.toLocaleDateString("fr-FR", { weekday: "short" });
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.partner?.pseudo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationCreated = () => {
    // Actualiser la liste des conversations après création d'une nouvelle
    fetchConversations();
    setIsNewConversationModalOpen(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl h-[80vh] transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl transition-all">
                <div className="flex h-full">
                  {/* Sidebar des conversations */}
                  <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Messages
                          </h2>
                          <div className={`w-2 h-2 rounded-full ${
                            isConnected ? 'bg-green-500' : 'bg-red-500'
                          }`} title={isConnected ? 'Connecté' : 'Déconnecté'} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setIsNewConversationModalOpen(true)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                          >
                            <PlusIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={onClose}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Barre de recherche */}
                      <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Rechercher..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Liste des conversations */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                      {loading ? (
                        <div className="flex justify-center items-center h-32">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      ) : filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                          <p>Aucune conversation</p>
                          <p className="text-sm">
                            Commencez une nouvelle conversation
                          </p>
                        </div>
                      ) : (
                        filteredConversations.map((conv) => (
                          <button
                            key={conv.conversation_id}
                            className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                              conv.conversation_id === activeConversation
                                ? "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500"
                                : ""
                            }`}
                            onClick={() => selectConversation(conv)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <Image
                                  src={
                                    conv.partner?.pfp || "/default-avatar.png"
                                  }
                                  alt={conv.partner?.pseudo || "Utilisateur"}
                                  width={48}
                                  height={48}
                                  className="rounded-full object-cover w-12 h-12"
                                />
                                {conv.unread_count > 0 && (
                                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {conv.unread_count}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                    {conv.partner?.pseudo ||
                                      "Utilisateur inconnu"}
                                  </h3>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatTime(conv.last_message?.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                  {conv.last_message?.content ||
                                    "Aucun message"}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Zone de chat */}
                  <div className="flex-1 flex flex-col">
                    {activeConversation && activePartner ? (
                      <>
                        {/* Header de la conversation */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Image
                                src={activePartner.pfp || "/default-avatar.png"}
                                alt={activePartner.pseudo}
                                width={40}
                                height={40}
                                className="rounded-full object-cover w-10 h-10"
                              />
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {activePartner.pseudo}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Actif il y a 2h
                                </p>
                              </div>
                            </div>
                            <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                              <EllipsisVerticalIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800 hide-scrollbar">
                          {messages.map((message, index) => {
                            const isOwn =
                              message.sender_id === currentUser?.id_user;
                            const showAvatar =
                              index === 0 ||
                              messages[index - 1].sender_id !==
                                message.sender_id;

                            return (
                              <div
                                key={message.message_id || index}
                                className={`flex ${
                                  isOwn ? "justify-end" : "justify-start"
                                }`}
                              >
                                <div
                                  className={`flex max-w-xs lg:max-w-md ${
                                    isOwn ? "flex-row-reverse" : "flex-row"
                                  }`}
                                >
                                  {showAvatar && !isOwn && (
                                    <Image
                                      src={
                                        message.sender?.pfp ||
                                        "/default-avatar.png"
                                      }
                                      alt={message.sender?.pseudo}
                                      width={32}
                                      height={32}
                                      className="rounded-full object-cover mr-2 w-8 h-8"
                                    />
                                  )}
                                  <div
                                    className={`px-4 py-2 rounded-2xl ${
                                      isOwn
                                        ? "bg-blue-500 text-white rounded-br-md"
                                        : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md"
                                    }`}
                                  >
                                    <p className="text-sm">{message.content}</p>
                                    <p
                                      className={`text-xs mt-1 ${
                                        isOwn
                                          ? "text-blue-100"
                                          : "text-gray-500 dark:text-gray-400"
                                      }`}
                                    >
                                      {formatTime(message.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </div>

                        {/* Input de message */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                placeholder="Écrivez un message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) =>
                                  e.key === "Enter" && sendMessage()
                                }
                                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                              />
                            </div>
                            <button
                              onClick={sendMessage}
                              disabled={!newMessage.trim()}
                              className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-full transition-colors disabled:cursor-not-allowed"
                            >
                              <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <PaperAirplaneIcon className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Sélectionnez une conversation
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            Choisissez une conversation dans la liste pour
                            commencer à discuter
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>

      {/* Modal de nouvelle conversation */}
      <NewConversationModal
        isOpen={isNewConversationModalOpen}
        onClose={() => setIsNewConversationModalOpen(false)}
        onConversationCreated={handleConversationCreated}
      />
    </Transition>
  );
}

export default MessageModal;
