"use client";
import React, { useState, useEffect } from "react";
import { useUser } from '../context/UserContext';
import CommentComponent from './comment';

export default function CommentSection({ postId, onCommentsCountChange }) {
  const { currentUser } = useUser();
  const currentUserId = currentUser?.id_user;

  // États pour gérer les commentaires
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  // Charger les commentaires au montage du composant
  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/comments?postId=${postId}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      // Filtrer pour ne garder que les commentaires principaux (sans parent)
      const topLevelComments = data.comments.filter(comment => 
        comment.parent_comment_id === null || comment.parent_comment_id === undefined
      );
      
      setComments(topLevelComments);
      
      // Notifier le parent du nombre total de commentaires (incluant les réponses)
      if (onCommentsCountChange) {
        const totalCommentsCount = data.comments.length;
        onCommentsCountChange(totalCommentsCount);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires:", error);
      setError("Impossible de charger les commentaires");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!currentUserId || !newComment.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: postId,
          parentCommentId: null, // Commentaire principal
          text: newComment.trim()
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      // Ajouter le nouveau commentaire à la liste
      setComments(prev => [result.comment, ...prev]);
      
      // Notifier le parent du nouveau nombre de commentaires
      if (onCommentsCountChange) {
        // Recharger pour avoir le nombre exact
        fetchComments();
      }
      
      // Réinitialiser le formulaire
      setNewComment("");
      setShowCommentForm(false);
      
    } catch (error) {
      console.error("Erreur lors de la création du commentaire:", error);
      alert("Erreur lors de la création du commentaire");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentReply = (newReply) => {
    // Recharger les commentaires pour avoir les dernières réponses
    fetchComments();
  };

  const handleCommentDelete = (deletedCommentId) => {
    // Recharger les commentaires pour refléter la suppression
    fetchComments();
  };

  if (!postId) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mt-4">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Commentaires
        </h3>

        {/* Formulaire pour ajouter un nouveau commentaire */}
        {currentUserId ? (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="flex space-x-3">
              <img
                src={currentUser.pfp_user || "https://ui-avatars.com/api/?name=User&background=random&color=fff&size=40"}
                alt="Votre profil"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"
              />
              <div className="flex-1">
                {showCommentForm ? (
                  <>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Écrivez votre commentaire..."
                      className="w-full border border-transparent focus:border-blue-500 dark:focus:border-blue-500 rounded-2xl px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 resize-none transition-all duration-200"
                      rows={3}
                      maxLength={500}
                      disabled={isSubmitting}
                      autoFocus
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {newComment.length}/500
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCommentForm(false);
                            setNewComment("");
                          }}
                          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                          disabled={isSubmitting}
                        >
                          Annuler
                        </button>
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 font-medium shadow-md"
                        disabled={!newComment.trim() || isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Envoi...</span>
                          </div>
                        ) : (
                          "Publier"
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-500"
                    onClick={() => setShowCommentForm(true)}
                  >
                    <span className="text-gray-500 dark:text-gray-400">Écrivez un commentaire...</span>
                  </div>
                )}
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400">
              <a href="/login" className="text-blue-500 hover:text-blue-600">
                Connectez-vous
              </a>{" "}
              pour écrire un commentaire
            </p>
          </div>
        )}

        {/* Liste des commentaires */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchComments}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Aucun commentaire pour le moment.</p>
            <p className="text-sm mt-2">Soyez le premier à commenter !</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentComponent
                key={comment.comment_id}
                comment={comment}
                onReply={handleCommentReply}
                onDelete={handleCommentDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
