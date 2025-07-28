"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from '../context/UserContext';
import { ParsedText } from '../utils/textParser';

// Composant pour rendre un composant individuel
const ComponentRenderer = ({ component }) => {
  switch (component.type) {
    case 'text':
      return (
        <div 
          style={component.data.formatting}
          className="text-component"
        >
          <ParsedText text={component.data.content} />
        </div>
      );

    case 'image':
      return component.data.urls?.[0] ? (
        <div className="w-full rounded-xl overflow-hidden">
          <img
            src={component.data.urls[0]}
            alt={component.data.alt || 'Image'}
            className="w-full h-auto object-cover"
          />
        </div>
      ) : null;

    case 'video':
      return component.data.url ? (
        <div className="w-full rounded-xl overflow-hidden">
          <video
            src={component.data.url}
            className="w-full h-auto object-cover"
            controls
            autoPlay={component.data.autoplay}
          />
        </div>
      ) : null;

    case 'quote':
      return (
        <blockquote className="pl-4 border-l-4 border-gray-300 dark:border-gray-600 italic bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-800 dark:text-gray-200 text-lg">
            "{component.data.text}"
          </p>
          {component.data.author && (
            <footer className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              — {component.data.author}
            </footer>
          )}
        </blockquote>
      );

    case 'link':
      return (
        <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
          <a 
            href={component.data.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium block"
          >
            {component.data.title || component.data.url || 'Lien'}
          </a>
          {component.data.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {component.data.description}
            </p>
          )}
          {component.data.url && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
              {component.data.url}
            </p>
          )}
        </div>
      );

    case 'spacer':
      return (
        <div 
          style={{ height: component.data.height || '20px' }}
          className="w-full"
        />
      );

    default:
      return null;
  }
};

// Fonction pour obtenir le style du post
const getPostStyle = (styleConfig) => {
  const style = {
    borderRadius: styleConfig.border?.radius || '12px',
    border: styleConfig.border?.style !== 'none' 
      ? `${styleConfig.border?.width || '1px'} ${styleConfig.border?.style || 'solid'} ${styleConfig.border?.color || '#e0e0e0'}`
      : 'none'
  };

  // Gestion de l'arrière-plan
  if (styleConfig.background?.type === 'gradient' && styleConfig.background?.gradient) {
    const { from, to, direction } = styleConfig.background.gradient;
    style.background = `linear-gradient(${direction || '45deg'}, ${from}, ${to})`;
  } else {
    // Utiliser un fond blanc par défaut au lieu de transparent
    style.backgroundColor = styleConfig.background?.value || '#ffffff';
  }

  return style;
};

export default function ModernPost({ post, isDetailView = false, onCommentsCountChange, externalCommentsCount }) {
  const { currentUser } = useUser();
  const router = useRouter();
  
  // États locaux pour les interactions
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(0);
  const [localCommentsCount, setLocalCommentsCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [showFavoriteNotification, setShowFavoriteNotification] = useState(false);
  
  // États pour les données utilisateur
  const [author, setAuthor] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);

  // Effect pour charger les données utilisateur
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoadingUser(true);
        setUserError(null);

        const response = await fetch(`/api/user/${post.author}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const userData = await response.json();
        setAuthor(userData);
      } catch (error) {
        setUserError("Impossible de charger les données utilisateur");
        // Fallback avec des données par défaut
        setAuthor({
          id_user: post.author || "unknown",
          pseudo_user: post.author || "utilisateur",
          user_pseudo: "Utilisateur inconnu",
          pfp_user: `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author || 'User')}&background=random&color=fff&size=64`,
        });
      } finally {
        setIsLoadingUser(false);
      }
    };

    if (post.author) {
      loadUser();
    }
  }, [post.author]);

  // Effect pour initialiser les états utilisateur (likes, favoris)
  useEffect(() => {
    // Initialiser le nombre de likes et le statut liked
    const likesArray = Array.isArray(post.likes) ? post.likes : [];
    const likesCount = likesArray.length;
    const userHasLiked = currentUser?.id_user ? likesArray.includes(currentUser.id_user) : false;

    setLocalLikesCount(likesCount);
    setIsLiked(userHasLiked);

    // Vérifier si ce post est dans les favoris de l'utilisateur
    if (currentUser?.id_user && currentUser?.favorite_posts) {
      const favoritesList = Array.isArray(currentUser.favorite_posts) ? currentUser.favorite_posts : [];
      setIsSaved(favoritesList.includes(String(post.post_id)));
    } else {
      setIsSaved(false);
    }
    
    // Utiliser le compteur externe s'il est fourni, sinon utiliser celui du post
    const commentsCountValue = externalCommentsCount !== undefined ? externalCommentsCount : (post.comments_count || 0);
    setLocalCommentsCount(commentsCountValue);
  }, [post.likes, currentUser?.id_user, currentUser?.favorite_posts, post.post_id, externalCommentsCount, post.comments_count]);

  // Fonction pour gérer les likes
  const toggleLike = async (postId, userId, isCurrentlyLiked) => {
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

  // Fonctions pour gérer les interactions
  const handleLike = async (e) => {
    e.stopPropagation();
    
    // Vérifier si l'utilisateur est connecté
    if (!currentUser?.id_user) {
      console.warn("Utilisateur non connecté - impossible de liker");
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
      const result = await toggleLike(post.post_id, currentUser.id_user, isLiked);

      // Mettre à jour avec la réponse du serveur
      setLocalLikesCount(result.likesCount);
      setIsLiked(result.hasLiked);

      console.log(`${result.hasLiked ? "Liked" : "Unliked"} post ${post.post_id}`);
    } catch (error) {
      // Rollback en cas d'erreur
      setIsLiked(previousLiked);
      setLocalLikesCount(previousCount);
      console.error("Erreur lors du like:", error);
    } finally {
      setIsLikeLoading(false);
    }
  };
  
  const handleComment = (e) => {
    e.stopPropagation();
    if (!isDetailView) {
      router.push(`/post/${post.post_id}`);
    }
  };
  
  const handleShare = async (e) => {
    e.stopPropagation();
    
    const postUrl = `${window.location.origin}/post/${post.post_id}`;

    try {
      // Tenter d'utiliser l'API Web Share si disponible
      if (navigator.share && navigator.canShare) {
        await navigator.share({
          title: `Post de ${post.author || "Utilisateur"}`,
          text: post.text ? post.text.substring(0, 100) + (post.text.length > 100 ? "..." : "") : "Découvrez ce post",
          url: postUrl,
        });
      } else {
        // Fallback : copier dans le presse-papiers
        await navigator.clipboard.writeText(postUrl);
        // Afficher la notification de succès
        setShowCopyNotification(true);
        setTimeout(() => {
          setShowCopyNotification(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Erreur lors du partage:", error);
    }
  };
  
  const handleBookmark = async (e) => {
    e.stopPropagation();
    
    // Vérifier si l'utilisateur est connecté
    if (!currentUser?.id_user) {
      console.warn("Utilisateur non connecté - impossible d'ajouter aux favoris");
      return;
    }

    // Éviter les doubles clics
    if (isFavoriteLoading) return;

    // Optimistic update
    const previousSaved = isSaved;
    setIsSaved(!isSaved);
    setIsFavoriteLoading(true);

    try {
      const action = isSaved ? "remove" : "add";
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post.post_id,
          action: action,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      // Mettre à jour avec la réponse du serveur
      setIsSaved(result.isFavorite);
      
      // Afficher la notification
      setShowFavoriteNotification(true);
      setTimeout(() => {
        setShowFavoriteNotification(false);
      }, 3000);

    } catch (error) {
      // Rollback en cas d'erreur
      setIsSaved(previousSaved);
    } finally {
      setIsFavoriteLoading(false);
    }
  };
  
  const handleDelete = async (e) => {
    e.stopPropagation();
    
    // Vérifier si l'utilisateur est connecté et est l'auteur
    if (!currentUser?.id_user || !author || author.id_user !== currentUser.id_user) {
      console.warn("Non autorisé à supprimer ce post");
      return;
    }

    // Ouvrir le modal de confirmation
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    setShowDeleteModal(false);

    try {
      const response = await fetch(`/api/posts/${post.post_id}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser.id_user }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();

      // Rediriger vers la page d'accueil après suppression
      router.push("/");
    } catch (error) {
      setShowDeleteError(true);
      setTimeout(() => {
        setShowDeleteError(false);
      }, 5000);
    }
  };
  
  // Vérifier si l'utilisateur peut supprimer ce post
  const canDeletePost = currentUser?.id_user && author && author.id_user === currentUser.id_user;
  
  // Vérifier si c'est un post legacy ou moderne
  const isLegacyPost = !post.content_structure || post.content_version === 1;
  
  // Si c'est un post legacy, utiliser l'affichage classique
  if (isLegacyPost) {
    // Importer et utiliser le composant Post classique
    const LegacyPost = require('./post.jsx').default;
    return (
      <LegacyPost 
        post={post}
        isDetailView={isDetailView}
        onCommentsCountChange={onCommentsCountChange}
        externalCommentsCount={externalCommentsCount}
      />
    );
  }

  const components = post.content_structure?.components || [];
  const styleConfig = post.style_config || {};
  
  
  // Trier les composants par ordre (vérifier que l'ordre existe)
  const sortedComponents = components.sort((a, b) => (a.order || 0) - (b.order || 0));

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
    <div className="relative mb-6">
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
      
      {/* Notification de favoris */}
      {showFavoriteNotification && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span className="font-medium">
            {isSaved ? "Ajouté aux favoris !" : "Retiré des favoris !"}
          </span>
        </div>
      )}
      
      {/* Notification d'erreur de suppression */}
      {showDeleteError && (
        <div className="fixed top-28 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-300">
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">
            Erreur lors de la suppression du post. Veuillez réessayer.
          </span>
        </div>
      )}
      
      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Supprimer le post
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Êtes-vous sûr de vouloir supprimer ce post ? Cette action est irréversible.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`max-w-2xl px-4 mx-auto bg-white dark:bg-gray-800 shadow-lg overflow-hidden transition-colors duration-300 ${
          !isDetailView ? "cursor-pointer hover:shadow-xl" : ""
        }`}
        style={getPostStyle(styleConfig)}
        onClick={handlePostClick}
      >
        {/* En-tête du post */}
        <div className="p-6 pb-4">
          <div className="flex items-center space-x-3">
            {isLoadingUser ? (
              // Skeleton loading pour l'avatar et les informations
              <>
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href={`/profile/${author?.pseudo_user || post.author}`}
                  className="flex-shrink-0 hover:opacity-80 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={author?.pfp_user || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author || 'User')}&background=random&color=fff&size=64`}
                    alt="Profil utilisateur"
                    className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author || 'User')}&background=random&color=fff&size=64`;
                    }}
                  />
                </Link>
                <div className="flex-1">
                  <Link 
                    href={`/profile/${author?.pseudo_user || post.author}`}
                    className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {author?.pseudo_user || post.author}
                    </h3>
                  </Link>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>@{author?.pseudo_user || post.author}</span>
                    <span>•</span>
                    <span>{new Date(post.time).toLocaleDateString()}</span>
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

        {/* Contenu modulaire */}
        <div className="px-6 pb-4 space-y-4">
          {sortedComponents.map((component) => (
            <ComponentRenderer
              key={component.id}
              component={component}
            />
          ))}
        </div>

        {/* Boutons d'action */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-around">
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
              } ${!currentUser?.id_user ? "opacity-50" : ""}`}
              title={!currentUser?.id_user ? "Connectez-vous pour liker" : ""}
            >
              <svg className={`w-5 h-5 ${isLiked ? "fill-current" : ""} ${
                  isLikeLoading ? "animate-pulse" : ""
                }`} fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.682l-1.318-1.364a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-medium">{localLikesCount}</span>
            </button>
            <button 
              onClick={handleComment}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-500 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-medium">{externalCommentsCount || post.comments_count || 0}</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-green-500 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            <button 
              onClick={handleBookmark}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                isSaved
                  ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <svg className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            
            {/* Bouton Delete - visible seulement pour l'auteur */}
            {canDeletePost && (
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                title="Supprimer ce post"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
