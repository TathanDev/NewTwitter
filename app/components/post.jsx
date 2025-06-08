import React, { useState, useEffect } from "react";

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

// Fonction utilitaire pour calculer le nombre de commentaires
const getCommentsCount = (comments) => {
  if (Array.isArray(comments)) return comments.length;
  if (typeof comments === "number") return comments;
  return 0;
};

export default function PostComponent({ post }) {
  // États pour gérer les données utilisateur
  const [author, setAuthor] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);

  // États locaux pour les interactions
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(0);

  // Vérification que le post existe
  if (!post) {
    return (
      <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-6">
        <p className="text-red-600">Erreur : Aucun post fourni</p>
      </div>
    );
  }

  // Effect pour charger les données utilisateur
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoadingUser(true);
        setUserError(null);

        // Récupérer les données utilisateur
        const userData = await getUser(post.author);
        console.log("Données utilisateur récupérées:", userData);
        setAuthor(userData);

        // Initialiser le nombre de likes
        setLocalLikesCount(getLikesCount(post.likes));
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
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUser();
  }, [post.author, post.likes]);

  // Extraction des données du post
  const username = generateUsername(author);
  const timeAgo = formatTimeAgo(post.time);
  const content = post.text || "";
  const commentsCount = getCommentsCount(post.comments);
  const sharesCount = post.share_count || 0;
  const mediaUrl = post.media;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLocalLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    console.log(`${isLiked ? "Unlike" : "Like"} post ${post.post_id}`);
  };

  const handleComment = () => {
    console.log(`Ouvrir les commentaires pour le post ${post.post_id}`);
  };

  const handleShare = () => {
    console.log(`Partager le post ${post.post_id}`);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    console.log(
      `${isSaved ? "Retirer des favoris" : "Sauvegarder"} le post ${
        post.post_id
      }`
    );
  };

  return (
    <div className="max-w-2xl px-4 mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-colors duration-300">
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
          {content}
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
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
              isLiked
                ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            <span className="font-medium">{localLikesCount}</span>
          </button>

          {/* Bouton Comment */}
          <button
            onClick={handleComment}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">{commentsCount}</span>
          </button>

          {/* Bouton Share */}
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <Share className="w-5 h-5" />
            <span className="font-medium">{sharesCount}</span>
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
            <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
