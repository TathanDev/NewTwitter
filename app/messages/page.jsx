"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import NewConversationModal from "../components/NewConversationModal";
import {
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function fetchCurrentUser() {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
    }
  }

  async function fetchConversations() {
    try {
      setLoading(true);
      const response = await fetch('/api/messages/conversations');
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
    setShowMobileChat(true);
    try {
      const response = await fetch(`/api/messages/${conversation.conversation_id}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
    }
  }

  async function sendMessage() {
    if (newMessage.trim() === "" || !activeConversation || !currentUser) return;
    
    const messageContent = newMessage.trim();
    
    const tempMessage = {
      message_id: Date.now(),
      content: messageContent,
      sender_id: currentUser.id_user,
      sender: {
        id: currentUser.id_user,
        pseudo: currentUser.pseudo_user,
        pfp: currentUser.pfp_user
      },
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage("");

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: activePartner.id,
          content: messageContent,
        }),
      });

      if (!response.ok) {
        setMessages(prev => prev.filter(msg => msg.message_id !== tempMessage.message_id));
        const errorData = await response.json();
        console.error("Erreur lors de l'envoi du message:", errorData);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      setMessages(prev => prev.filter(msg => msg.message_id !== tempMessage.message_id));
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.partner?.pseudo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationCreated = () => {
    // Actualiser la liste des conversations après création d'une nouvelle
    fetchConversations();
    setIsNewConversationModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto h-screen flex">
        {/* Sidebar des conversations */}
        <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} md:w-1/3 w-full border-r border-gray-200 dark:border-gray-700 flex-col bg-white dark:bg-gray-900`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Messages
              </h1>
              <button 
                onClick={() => setIsNewConversationModalOpen(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <PlusIcon className="w-6 h-6" />
              </button>
            </div>
            
            {/* Barre de recherche */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Liste des conversations */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400 p-4">
                <p className="text-lg font-medium">Aucune conversation</p>
                <p className="text-sm text-center">Commencez une nouvelle conversation en envoyant un message à un utilisateur</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.conversation_id}
                  className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    conv.conversation_id === activeConversation 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-r-3 border-blue-500' 
                      : ''
                  }`}
                  onClick={() => selectConversation(conv)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Image
                        src={conv.partner?.pfp || "/default-avatar.png"}
                        alt={conv.partner?.pseudo || "Utilisateur"}
                        width={56}
                        height={56}
                        className="rounded-full object-cover"
                      />
                      {conv.unread_count > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
                          {conv.unread_count}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {conv.partner?.pseudo || "Utilisateur inconnu"}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(conv.last_message?.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {conv.last_message?.content || "Aucun message"}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Zone de chat */}
        <div className={`${showMobileChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
          {activeConversation && activePartner ? (
            <>
              {/* Header de la conversation */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowMobileChat(false)}
                      className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    >
                      <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <Image
                      src={activePartner.pfp || "/default-avatar.png"}
                      alt={activePartner.pseudo}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
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
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
                {messages.map((message, index) => {
                  const isOwn = message.sender_id === currentUser?.id_user;
                  const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id;
                  
                  return (
                    <div
                      key={message.message_id || index}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex max-w-xs lg:max-w-md xl:max-w-lg ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                        {showAvatar && !isOwn && (
                          <Image
                            src={message.sender?.pfp || "/default-avatar.png"}
                            alt={message.sender?.pseudo}
                            width={32}
                            height={32}
                            className="rounded-full object-cover mr-2 flex-shrink-0"
                          />
                        )}
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isOwn
                              ? 'bg-blue-500 text-white rounded-br-md'
                              : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md shadow-sm'
                          }`}
                        >
                          <p className="text-sm break-words">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                          }`}>
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
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-full transition-colors disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <PaperAirplaneIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Vos messages
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                  Sélectionnez une conversation dans la liste pour commencer à discuter
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de nouvelle conversation */}
      <NewConversationModal 
        isOpen={isNewConversationModalOpen} 
        onClose={() => setIsNewConversationModalOpen(false)}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
}
