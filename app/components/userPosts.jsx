"use client";
import { useState, useEffect } from "react";
import ModernPost from './ModernPost';

export default function UserPosts({ userId, username }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setIsLoading(true);
        // Récupérer tous les posts et filtrer par auteur
        const response = await fetch("/api/posts");
        const allPosts = await response.json();
        
        // Filtrer les posts de cet utilisateur
        const userPosts = allPosts.filter(post => 
          post.author === username || post.author === userId
        );
        
        setPosts(userPosts);
      } catch (error) {
        console.error("Erreur lors de la récupération des posts:", error);
        setError("Impossible de charger les publications");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserPosts();
    }
  }, [userId, username]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="w-6 h-6 bg-white dark:bg-gray-800 rounded-full"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des publications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-8 rounded-3xl shadow-xl border border-red-200/50 dark:border-red-600/30 backdrop-blur-sm">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Aucune publication
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {username} n'a pas encore publié de contenu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Publications de {username}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {posts.length} publication{posts.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <ModernPost
            key={post.post_id}
            post={post}
            isDetailView={false}
          />
        ))}
      </div>
    </div>
  );
}
