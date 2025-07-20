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
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 relative overflow-hidden">
      {/* Formes décoratives d'arrière-plan */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-500/30 dark:to-purple-500/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-purple-400/15 to-pink-400/15 dark:from-purple-500/25 dark:to-pink-500/25 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-r from-pink-400/25 to-blue-400/25 dark:from-pink-500/35 dark:to-blue-500/35 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto h-screen flex relative z-10">
        {/* Sidebar des conversations */}
        <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} md:w-1/3 w-full border-r border-gray-200/50 dark:border-gray-700/30 flex-col bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 backdrop-blur-sm`}>
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-gray-200/50 dark:border-gray-700/30">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Messages
              </h1>
              <button 
                onClick={() => setIsNewConversationModalOpen(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-2xl transition-all duration-300 hover:shadow-md transform hover:scale-105"
              >
                <PlusIcon className="w-5 md:w-6 h-5 md:h-6" />
              </button>
            </div>
            
            {/* Barre de recherche */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300"></div>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans les conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="relative w-full pl-12 pr-4 py-3 md:py-4 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-600/30 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none focus:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl"
                />
              </div>
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
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-600/30">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">💬</span>
                  </div>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200 text-center mb-2">Aucune conversation</p>
                  <p className="text-sm text-center text-gray-600 dark:text-gray-400">Commencez une nouvelle conversation</p>
                </div>
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
              <div className="p-4 md:p-6 border-b border-gray-200/50 dark:border-gray-700/30 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowMobileChat(false)}
                      className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-2xl transition-all duration-300"
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
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50">
              <div className="text-center">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-8 md:p-12 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm">
                  <div className="w-16 md:w-20 h-16 md:h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <PaperAirplaneIcon className="w-8 md:w-10 h-8 md:h-10 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
                    Vos messages
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-sm">
                    Sélectionnez une conversation dans la liste pour commencer à discuter
                  </p>
                </div>
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
