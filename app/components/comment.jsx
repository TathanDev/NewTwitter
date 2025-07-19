"use client";
import React, { useState, useEffect } from "react";
import { useUser } from '../context/UserContext';
import { createApiUrl } from '../../utils/url';

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

// Fonction utilitaire pour formater la date
const formatTimeAgo = (dateString) => {
  const now = new Date();
  const commentDate = new Date(dateString);
  const diffInSeconds = Math.floor((now - commentDate) / 1000);

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
    return commentDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  }
};

// Fonction pour récupérer les données utilisateur
const getUser = async (pseudo) => {
  try {
    if (!pseudo) {
      throw new Error("Pseudo manquant");
    }

    const response = await fetch(createApiUrl(`/api/user/${pseudo}`));

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

// Fonction pour gérer les likes de commentaires
const toggleCommentLike = async (commentId, userId, isCurrentlyLiked) => {
  try {
    const action = isCurrentlyLiked ? "unlike" : "like";
    const response = await fetch(`/api/comments/${commentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, userId }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erreur lors de la gestion du like du commentaire:", error);
    throw error;
  }
};

export default function CommentComponent({ 
  comment, 
  isReply = false, 
  onReply = null, 
  onDelete = null 
}) {
  const { currentUser } = useUser();
  const currentUserId = currentUser?.id_user;

  // États pour gérer les données utilisateur
  const [author, setAuthor] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);

  // États locaux pour les interactions
  const [isLiked, setIsLiked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Vérification que le commentaire existe
  if (!comment) {
    return null;
  }

  // Effect pour charger les données utilisateur et initialiser les états
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoadingUser(true);
        setUserError(null);

        // Récupérer les données utilisateur
        const userData = await getUser(comment.author);
        setAuthor(userData);

        // Initialiser le nombre de likes et le statut liked
        const likesCount = Array.isArray(comment.likes) ? comment.likes.length : 0;
        const userHasLiked = currentUserId
          ? comment.likes.includes(currentUserId)
          : false;

        setLocalLikesCount(likesCount);
        setIsLiked(userHasLiked);
      } catch (error) {
        setUserError("Impossible de charger les données utilisateur");

        // Fallback avec des données par défaut
        setAuthor({
          id_user: comment.author || "unknown",
          pseudo_user: comment.author || "utilisateur",
          user_pseudo: "Utilisateur inconnu",
          pfp_user:
            "https://ui-avatars.com/api/?name=User&background=random&color=fff&size=64",
        });

        // Initialiser les likes même en cas d'erreur
        setLocalLikesCount(Array.isArray(comment.likes) ? comment.likes.length : 0);
        setIsLiked(
          currentUserId ? comment.likes.includes(currentUserId) : false
        );
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUser();
  }, [comment.author, comment.likes, currentUserId]);

  const handleLike = async (e) => {
    e.stopPropagation();
    
    if (!currentUserId) {
      console.warn("Utilisateur non connecté - impossible de liker");
      return;
    }

    if (isLikeLoading) return;

    // Optimistic update
    const previousLiked = isLiked;
    const previousCount = localLikesCount;

    setIsLiked(!isLiked);
    setLocalLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLikeLoading(true);

    try {
      const result = await toggleCommentLike(comment.comment_id, currentUserId, isLiked);
      setLocalLikesCount(result.likesCount);
      setIsLiked(result.hasLiked);
    } catch (error) {
      // Rollback en cas d'erreur
      setIsLiked(previousLiked);
      setLocalLikesCount(previousCount);
      console.error("Erreur lors du like:", error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleReply = (e) => {
    e.stopPropagation();
    setShowReplyForm(!showReplyForm);
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    
    if (!currentUserId || !replyText.trim()) {
      return;
    }

    setIsSubmittingReply(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: comment.post_id,
          parentCommentId: comment.comment_id,
          text: replyText.trim()
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      // Réinitialiser le formulaire
      setReplyText("");
      setShowReplyForm(false);
      
      // Notifier le parent
      if (onReply) {
        onReply(result.comment);
      }
      
    } catch (error) {
      console.error("Erreur lors de la création de la réponse:", error);
      alert("Erreur lors de la création de la réponse");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    
    if (!currentUserId || !author || author.id_user !== currentUserId) {
      console.warn("Non autorisé à supprimer ce commentaire");
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/${comment.comment_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Notifier le parent
      if (onDelete) {
        onDelete(comment.comment_id);
      }
      
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
      alert("Erreur lors de la suppression du commentaire. Veuillez réessayer.");
    }
  };

  // Vérifier si l'utilisateur peut supprimer ce commentaire
  const canDeleteComment = currentUserId && author && author.id_user === currentUserId;

  const timeAgo = formatTimeAgo(comment.time);
  const username = author ? `@${(author.pseudo_user || author.id_user).toLowerCase().replace(/\s+/g, "_")}` : "@utilisateur";

  return (
    <div className={`${isReply ? 'ml-8 border-l-2 border-gray-200 dark:border-gray-600 pl-4' : ''} mb-4`}>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        {/* En-tête du commentaire */}
        <div className="flex items-start space-x-3 mb-3">
          {isLoadingUser ? (
            <>
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
              </div>
            </>
          ) : (
            <>
              <img
                src={author.pfp_user}
                alt="Profil utilisateur"
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"
                onError={(e) => {
                  e.target.src =
                    "https://ui-avatars.com/api/?name=User&background=random&color=fff&size=32";
                }}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {author.pseudo_user}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{username}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{timeAgo}</span>
                  {userError && (
                    <>
                      <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-red-500 text-xs">Erreur de chargement</span>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Contenu du commentaire */}
        <div className="mb-3">
          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
            {comment.is_deleted ? (
              <span className="italic text-gray-500">[Commentaire supprimé]</span>
            ) : (
              comment.text
            )}
          </p>
        </div>

        {/* Actions du commentaire */}
        {!comment.is_deleted && (
          <div className="flex items-center space-x-4">
            {/* Bouton Like */}
            <button
              onClick={handleLike}
              disabled={isLikeLoading}
              className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-lg transition-all duration-200 ${
                isLiked
                  ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              } ${
                isLikeLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              } ${!currentUserId ? "opacity-50" : ""}`}
              title={!currentUserId ? "Connectez-vous pour liker" : ""}
            >
              <Heart
                className={`w-3 h-3 ${isLiked ? "fill-current" : ""} ${
                  isLikeLoading ? "animate-pulse" : ""
                }`}
              />
              <span className="font-medium">{localLikesCount}</span>
            </button>

            {/* Bouton Reply */}
            <button
              onClick={handleReply}
              className="flex items-center space-x-1 text-xs px-2 py-1 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <MessageCircle className="w-3 h-3" />
              <span className="font-medium">Répondre</span>
            </button>

            {/* Bouton Delete - visible seulement pour l'auteur */}
            {canDeleteComment && (
              <button
                onClick={handleDelete}
                className="flex items-center space-x-1 text-xs px-2 py-1 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                title="Supprimer ce commentaire"
              >
                <Trash className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Formulaire de réponse */}
        {showReplyForm && currentUserId && (
          <form onSubmit={handleSubmitReply} className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex space-x-2">
              <img
                src={currentUser.pfp_user || "https://ui-avatars.com/api/?name=User&background=random&color=fff&size=32"}
                alt="Votre profil"
                className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"
              />
              <div className="flex-1">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Écrivez votre réponse..."
                  className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                  maxLength={500}
                  disabled={isSubmittingReply}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {replyText.length}/500
                  </span>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowReplyForm(false)}
                      className="text-xs px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      disabled={isSubmittingReply}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="text-xs px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!replyText.trim() || isSubmittingReply}
                    >
                      {isSubmittingReply ? "..." : "Répondre"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Afficher les réponses si elles existent */}
      {comment.Replies && comment.Replies.length > 0 && (
        <div className="mt-2">
          {comment.Replies.map((reply) => (
            <CommentComponent
              key={reply.comment_id}
              comment={reply}
              isReply={true}
              onReply={onReply}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
