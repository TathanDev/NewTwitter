"use client";

import UserPosts from "../../components/userPosts";
import FollowButton from "../../components/FollowButton";
import FollowList from "../../components/FollowList";
import MessageModal from "../../components/MessageModal";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser } from "../../context/UserContext";

export default function ProfilePage() {
  const params = useParams();
  const userParam = params.user;
  const { currentUser } = useUser();
  
  const [isFollowersVisible, setFollowersVisible] = useState(false);
  const [isFollowingVisible, setFollowingVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [startingConversation, setStartingConversation] = useState(false);
  const [conversationAllowed, setConversationAllowed] = useState(true);
  const [conversationMessage, setConversationMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetch(`/api/user/${userParam}`);
        const userData = await data.json();
        
        if (userData.error) {
          setError(userData.error);
          return;
        }
        
        setUserData(userData);
        
        // Récupérer les statistiques
        const statsData = await fetch(`/api/user/stats/${userData.id_user}`);
        const stats = await statsData.json();
        setStats(stats);
        
        // Vérifier les paramètres de conversation
        setConversationAllowed(true);
        setConversationMessage('');
        
        if (userData.allow_new_conversations === 'none') {
          setConversationAllowed(false);
          setConversationMessage('Cet utilisateur n\'accepte pas de nouvelles conversations.');
        } else if (userData.allow_new_conversations === 'followers') {
          setConversationMessage('Vous devez suivre cet utilisateur pour lui envoyer un message.');
          // On laisse le bouton actif, l'API vérifiera le suivi
        }
      } catch (err) {
        setError("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };
    
    if (userParam) {
      fetchUserData();
    }
  }, [userParam]);

  // Fonction pour démarrer une conversation avec cet utilisateur
  const handleStartConversation = async () => {
    if (!currentUser || !userData) {
      alert("Vous devez être connecté pour envoyer un message.");
      return;
    }

    if (currentUser.id_user === userData.id_user) {
      alert("Vous ne pouvez pas vous envoyer un message à vous-même.");
      return;
    }

    try {
      setStartingConversation(true);
      
      // Créer une nouvelle conversation vide
      const response = await fetch('/api/messages/conversations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: userData.id_user,
        }),
      });

      if (response.ok) {
        // Ouvrir le modal des messages
        setIsMessageModalOpen(true);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Erreur lors du démarrage de la conversation");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur réseau lors du démarrage de la conversation");
    } finally {
      setStartingConversation(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement du profil...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500/20 to-pink-500/20 dark:from-red-500/30 dark:to-pink-500/30 rounded-full blur-xl mx-auto mb-6"></div>
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
            Utilisateur non trouvé
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ce profil n'existe pas ou a été supprimé.
          </p>
        </div>
      </main>
    );
  }

  if (!userData || !stats) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 px-4 py-8 relative overflow-hidden">
      {/* Formes décoratives d'arrière-plan */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Bulles flottantes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-500/30 dark:to-purple-500/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-purple-400/15 to-pink-400/15 dark:from-purple-500/25 dark:to-pink-500/25 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-r from-pink-400/25 to-blue-400/25 dark:from-pink-500/35 dark:to-blue-500/35 rounded-full blur-lg animate-pulse delay-500"></div>

        {/* Formes géométriques */}
        <div
          className="absolute top-1/3 right-10 w-16 h-16 border border-blue-300/30 dark:border-blue-400/50 rotate-45 animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
        <div className="absolute bottom-1/4 right-1/3 w-8 h-8 bg-gradient-to-r from-purple-500/40 to-pink-500/40 dark:from-purple-400/60 dark:to-pink-400/60 transform rotate-12"></div>

        {/* Lignes ondulées */}
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-20"
          viewBox="0 0 1000 1000"
        >
          <path
            d="M0,200 Q250,150 500,200 T1000,200"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0,800 Q250,750 500,800 T1000,800"
            stroke="url(#gradient2)"
            strokeWidth="2"
            fill="none"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        {/* Header avec retour */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
              <a href="/" className="cursor-pointer">
                ⥃{" "}
              </a>
              Profil utilisateur
            </h1>
          </div>
        </div>

        {/* Carte de profil principale */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm relative overflow-hidden">
          {/* Halo effect derrière la carte */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-pink-400/20 rounded-3xl blur-2xl"></div>

          <div className="relative">
            {/* Avatar et nom */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={userData.pfp_user}
                  alt={`Photo de profil de ${userData.pseudo_user}`}
                  className="w-32 h-32 rounded-full shadow-2xl from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400"
                />
                {/* Indicateur en ligne */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Informations principales */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                    {userData.pseudo_user || "Utilisateur"}
                  </span>
                </h2>

                {userData.description_user && (
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 max-w-2xl">
                    {userData.description_user}
                  </p>
                )}

                {/* Email avec icône */}
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 dark:text-gray-400">
                  <span className="text-xl">📧</span>
                  <span className="text-sm">{userData.mail_user}</span>
                </div>
              </div>
            </div>

            {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 p-4 rounded-2xl shadow-lg border border-blue-200/50 dark:border-blue-600/40 text-center group hover:shadow-xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 opacity-0 rounded-2xl"></div>
                  <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 relative z-10">
                    42
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10">
                    Publications
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 p-4 rounded-2xl shadow-lg border border-purple-200/50 dark:border-purple-600/40 text-center group hover:shadow-xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-400/20 dark:to-pink-400/20 opacity-0 rounded-2xl"></div>
                  <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 relative z-10">
                    {stats.data.followersCount}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10" 
                     onClick={() => currentUser && currentUser.id_user === userData.id_user && setFollowersVisible(true)}
                     style={{ cursor: currentUser && currentUser.id_user === userData.id_user ? 'pointer' : 'default' }}>
                    Abonnés
                  </p>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/40 dark:to-pink-800/40 p-4 rounded-2xl shadow-lg border border-pink-200/50 dark:border-pink-600/40 text-center group hover:shadow-xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-blue-500/10 dark:from-pink-400/20 dark:to-blue-400/20 opacity-0 rounded-2xl"></div>
                  <h3 className="text-2xl font-bold text-pink-600 dark:text-pink-400 relative z-10">
                    {stats.data.followingCount}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10" 
                     onClick={() => currentUser && currentUser.id_user === userData.id_user && setFollowingVisible(true)}
                     style={{ cursor: currentUser && currentUser.id_user === userData.id_user ? 'pointer' : 'default' }}>
                    Abonnements
                  </p>
                </div>
              </div>

              {/* Afficher les listes seulement si c'est le profil de l'utilisateur connecté */}
              {currentUser && currentUser.id_user === userData.id_user && (
                <>
                  <FollowList
                    userId={userData.id_user}
                    type="followers"
                    isVisible={isFollowersVisible}
                    onClose={() => setFollowersVisible(false)}
                  />

                  <FollowList
                    userId={userData.id_user}
                    type="following"
                    isVisible={isFollowingVisible}
                    onClose={() => setFollowingVisible(false)}
                  />
                </>
              )}

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* Bouton Envoyer un message - ne s'affiche que si ce n'est pas le profil de l'utilisateur connecté */}
                {currentUser && currentUser.id_user !== userData.id_user && (
                  <div className="flex flex-col items-center gap-2">
                    <button 
                      onClick={handleStartConversation}
                      disabled={startingConversation || !conversationAllowed}
                      title={!conversationAllowed ? conversationMessage : ''}
                      className={`group px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 ${
                        !conversationAllowed 
                          ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed'
                          : startingConversation 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white opacity-75 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600'
                      }`}
                    >
                      {startingConversation ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Démarrage...</span>
                        </>
                      ) : (
                        <>
                          <span>💬</span>
                          <span>Envoyer un message</span>
                        </>
                      )}
                    </button>
                    {conversationMessage && userData.allow_new_conversations !== 'everyone' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs">
                        {conversationMessage}
                      </p>
                    )}
                  </div>
                )}

                <FollowButton targetUserId={userData.id_user} />

                <button className="group px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
                  <span>⚙️</span>
                  <span>Plus</span>
                </button>
              </div>
          </div>
        </div>

        {/* Section des posts de l'utilisateur */}
        <UserPosts 
          userId={userData.id_user} 
          username={userData.pseudo_user} 
        />

        {/* Élément décoratif du bas */}
        <div className="flex justify-center mt-8">
        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 rounded-full"></div>
        </div>
      </div>
      
      {/* Modal des messages */}
      <MessageModal 
        isOpen={isMessageModalOpen} 
        onClose={() => setIsMessageModalOpen(false)} 
      />
    </main>
  );
}
