"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from '../context/UserContext';
import { ParsedText } from '../utils/textParser';

const Heart = ({ className, ...props }) => (
  <svg
    className={className}
    {...props}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.682l-1.318-1.364a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const MessageCircle = ({ className, ...props }) => (
  <svg
    className={className}
    {...props}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const Share = ({ className, ...props }) => (
  <svg
    className={className}
    {...props}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
    />
  </svg>
);

const Trash = ({ className, ...props }) => (
  <svg
    className={className}
    {...props}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const Bookmark = ({ className, ...props }) => (
  <svg
    className={className}
    {...props}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
    />
  </svg>
);

// Fonction utilitaire pour formater la date
const formatTimeAgo = (dateString) => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInSeconds = Math.floor((now - postDate) / 1000);

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
    return postDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  }
};

// Fonction simulée pour récupérer les données utilisateur
const getUser = async (pseudo) => {
  try {
    if (!pseudo) {
      throw new Error("Pseudo manquant");
    }

    const response = await fetch(`http://localhost:3000/api/user/${pseudo}`);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    throw error;
  }
};

// Fonction pour gérer les likes
const toggleLike = async (postId, userId, isCurrentlyLiked, setLoading) => {
  try {
    const method = isCurrentlyLiked ? "DELETE" : "POST";
    const response = await fetch(`/api/posts/${postId}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur HTTP: ${response.status}`, errorText);
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
console.error("Erreur lors de la gestion du like:", error);
    throw error;
  }
};

// Fonction utilitaire pour générer un nom d'utilisateur depuis l'auteur
const generateUsername = (author) => {
  if (!author) return "@utilisateur";
  let pseudo = author.pseudo_user || author.id_user || "utilisateur";
  return `@${pseudo.toLowerCase().replace(/\s+/g, "_")}`;
};

// Fonction utilitaire pour calculer le nombre de likes
const getLikesCount = (likes) => {
  if (typeof likes === "number") return likes;
  if (Array.isArray(likes)) return likes.length;
  if (typeof likes === "object" && likes !== null) {
    return Object.keys(likes).length;
  }
  return 0;
};

// Fonction utilitaire pour vérifier si l'utilisateur a liké
const checkIfUserLiked = (likes, userId) => {
  if (Array.isArray(likes)) {
    return likes.includes(userId);
  }
  if (typeof likes === "object" && likes !== null) {
    return Object.keys(likes).includes(userId);
  }
  return false;
};

// Fonction utilitaire pour calculer le nombre de commentaires
const getCommentsCount = (commentsCount) => {
  if (typeof commentsCount === "number") return commentsCount;
  return 0;
};

export default function PostComponent({
  post,
  isDetailView = false,
  onCommentsCountChange,
  externalCommentsCount,
}) {

  const [loading, setLoading] = useState(false);
  // Récupérer l'utilisateur connecté depuis le contexte
  const { currentUser } = useUser();
  const currentUserId = currentUser?.id_user;
  const router = useRouter();

  // États pour gérer les données utilisateur
  const [author, setAuthor] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);

  // États locaux pour les interactions
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(0);
  const [localCommentsCount, setLocalCommentsCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  // Vérification que le post existe
  if (!post) {
    return (
      <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-6">
        <p className="text-red-600">Erreur : Aucun post fourni</p>
      </div>
    );
  }

  // Effect pour charger les données utilisateur et initialiser les states
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoadingUser(true);
        setUserError(null);

        // Récupérer les données utilisateur
        const userData = await getUser(post.author);
        setAuthor(userData);

        // Initialiser le nombre de likes et le statut liked
        const likesArray = Array.isArray(post.likes) ? post.likes : [];
        const likesCount = likesArray.length;
        const userHasLiked = currentUserId ? likesArray.includes(currentUserId) : false;

        setLocalLikesCount(likesCount);
        setIsLiked(userHasLiked);

        // Utiliser le compteur externe s'il est fourni, sinon utiliser celui du post
        const commentsCountValue =
          externalCommentsCount !== undefined
            ? externalCommentsCount
            : (post.comments_count || 0);
        setLocalCommentsCount(commentsCountValue);
      } catch (error) {
        setUserError("Impossible de charger les données utilisateur");

        // Fallback avec des données par défaut
        setAuthor({
          id_user: post.author || "unknown",
          pseudo_user: post.author || "utilisateur",
          user_pseudo: "Utilisateur inconnu",
          pfp_user:
            "https://ui-avatars.com/api/?name=User&background=random&color=fff&size=64",
        });

        // Initialiser les likes même en cas d'erreur
        const likesArray = Array.isArray(post.likes) ? post.likes : [];
        setLocalLikesCount(likesArray.length);
        setIsLiked(currentUserId ? likesArray.includes(currentUserId) : false);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUser();
  }, [post.author, post.likes, currentUserId]);

  // Effect pour mettre à jour le compteur de commentaires quand il change de l'extérieur
  useEffect(() => {
    if (externalCommentsCount !== undefined) {
      setLocalCommentsCount(externalCommentsCount);
    }
  }, [externalCommentsCount]);

  // Effect pour notifier le parent du changement initial
  useEffect(() => {
    if (onCommentsCountChange && localCommentsCount !== undefined) {
      onCommentsCountChange(localCommentsCount);
    }
  }, [localCommentsCount, onCommentsCountChange]);

  // Extraction des données du post
  const username = generateUsername(author);
  const timeAgo = formatTimeAgo(post.time);
  const content = post.text || "";
  const commentsCount = getCommentsCount(post.comments_count);
  const mediaUrl = post.media;

  const handleLike = async (e) => {
    // Empêcher la propagation pour éviter la redirection
    e.stopPropagation();

    // Vérifier si l'utilisateur est connecté
    if (!currentUserId) {
      console.warn("Utilisateur non connecté - impossible de liker");
      // Vous pouvez ici déclencher une modal de connexion ou rediriger
      return;
    }

    // Éviter les doubles clics
    if (isLikeLoading) return;

    // Optimistic update
    const previousLiked = isLiked;
    const previousCount = localLikesCount;

    setIsLiked(!isLiked);
    setLocalLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLikeLoading(true);

    try {
      const result = await toggleLike(post.post_id, currentUserId, isLiked);

      // Mettre à jour avec la réponse du serveur
      setLocalLikesCount(result.likesCount);
      setIsLiked(result.hasLiked);

      console.log(
        `${result.hasLiked ? "Liked" : "Unliked"} post ${post.post_id}`
      );
    } catch (error) {
      // Rollback en cas d'erreur
      setIsLiked(previousLiked);
      setLocalLikesCount(previousCount);
      console.error("Erreur lors du like:", error);

      // Vous pouvez ici afficher une notification d'erreur
      // showErrorNotification("Impossible de liker ce post");
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleComment = (e) => {
    // Empêcher la propagation pour éviter la redirection
    e.stopPropagation();

    // Naviguer vers la page de détail du post avec focus sur les commentaires
    router.push(`/post/${post.post_id}#comments`);
  };

  const handleShare = async (e) => {
    // Empêcher la propagation pour éviter la redirection
    e.stopPropagation();

    const postUrl = `${window.location.origin}/post/${post.post_id}`;

    try {
      // Tenter d'utiliser l'API Web Share si disponible
      if (navigator.share && navigator.canShare) {
        await navigator.share({
          title: `Post de ${author?.pseudo_user || "Utilisateur"}`,
          text: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
          url: postUrl,
        });
      } else {
        // Fallback : copier dans le presse-papiers
        await navigator.clipboard.writeText(postUrl);

        // Afficher la notification de succès
        triggerCopyNotification();
      }
    } catch (error) {
      console.error("Erreur lors du partage:", error);

      // Fallback ultime : sélectionner le texte pour copie manuelle
      const textArea = document.createElement("textarea");
      textArea.value = postUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        // Afficher la notification même en cas de fallback
        triggerCopyNotification();
      } catch (fallbackError) {
        console.error("Impossible de copier le lien", fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  // Fonction pour afficher la notification de copie
  const triggerCopyNotification = () => {
    setShowCopyNotification(true);
    setTimeout(() => {
      setShowCopyNotification(false);
    }, 3000); // Masquer après 3 secondes
  };

  const handleSave = (e) => {
    // Empêcher la propagation pour éviter la redirection
    e.stopPropagation();

    setIsSaved(!isSaved);
    console.log(
      `${isSaved ? "Retirer des favoris" : "Sauvegarder"} le post ${
        post.post_id
      }`
    );
  };

  const handleDelete = async (e) => {
    // Empêcher la propagation pour éviter la redirection
    e.stopPropagation();

    // Vérifier si l'utilisateur est connecté et est l'auteur
    if (!currentUserId || !author || author.id_user !== currentUserId) {
      console.warn("Non autorisé à supprimer ce post");
      return;
    }

    // Demander confirmation
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${post.post_id}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("Post supprimé avec succès", result);

      // Rediriger vers la page d'accueil après suppression
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la suppression du post:", error);
      alert("Erreur lors de la suppression du post. Veuillez réessayer.");
    }
  };

  // Vérifier si l'utilisateur peut supprimer ce post
  const canDeletePost =
    currentUserId && author && author.id_user === currentUserId;

  const handlePostClick = (e) => {
    // Ne pas naviguer si on clique sur un bouton ou un lien
    if (e.target.closest("button") || e.target.closest("a")) {
      return;
    }

    // Ne pas naviguer si on est déjà sur la page de détail
    if (isDetailView) {
      return;
    }

    router.push(`/post/${post.post_id}`);
  };

  return (
    <div className="relative">
      {/* Notification de copie */}
      {showCopyNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-medium">
            Lien copié dans le presse-papiers !
          </span>
        </div>
      )}

      <div
        className={`max-w-2xl px-4 mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-colors duration-300 ${
          !isDetailView ? "cursor-pointer" : ""
        }`}
        onClick={handlePostClick}
      >
        {/* En-tête du post */}
        <div className="p-6 pb-4">
          <div className="flex items-center space-x-3">
            {isLoadingUser ? (
              // Skeleton loading pour l'avatar et les informations
              <>
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
                </div>
              </>
            ) : (
              <>
                <img
                  src={author.pfp_user}
                  alt="Profil utilisateur"
                  className="relative size-16 rounded-full bg-gray-50 dark:bg-gray-800"
                  onError={(e) => {
                    e.target.src =
                      "https://ui-avatars.com/api/?name=User&background=random&color=fff&size=64";
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {author.pseudo_user}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{username}</span>
                    <span>•</span>
                    <span>{timeAgo}</span>
                    {userError && (
                      <>
                        <span>•</span>
                        <span className="text-red-500 text-xs">
                          Erreur de chargement
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contenu du post */}
        <div className="px-6 pb-4">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            <ParsedText text={content} />
          </p>
        </div>

        {/* Média du post (si présent) */}
        {mediaUrl && (
          <div className="px-6 pb-4">
            <div className="w-full rounded-xl overflow-hidden">
              {mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img
                  src={mediaUrl}
                  alt="Média du post"
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : (
                <video
                  src={mediaUrl}
                  className="w-full h-64 object-cover"
                  controls
                />
              )}
              <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-xl items-center justify-center hidden">
                <span className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                  Erreur de chargement du média
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-around">
            {/* Bouton Like */}
            <button
              onClick={handleLike}
              disabled={isLikeLoading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                isLiked
                  ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              } ${
                isLikeLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              } ${!currentUserId ? "opacity-50" : ""}`}
              title={!currentUserId ? "Connectez-vous pour liker" : ""}
            >
              <Heart
                className={`w-5 h-5 ${isLiked ? "fill-current" : ""} ${
                  isLikeLoading ? "animate-pulse" : ""
                }`}
              />
              <span className="font-medium">{localLikesCount}</span>
            </button>

            {/* Bouton Comment */}
            <button
              onClick={handleComment}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{localCommentsCount}</span>
            </button>

            {/* Bouton Share */}
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <Share className="w-5 h-5" />
            </button>

            {/* Bouton Save */}
            <button
              onClick={handleSave}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                isSaved
                  ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Bookmark
                className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`}
              />
            </button>

            {/* Bouton Delete - visible seulement pour l'auteur */}
            {canDeletePost && (
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                title="Supprimer ce post"
              >
                <Trash className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
