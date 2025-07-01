"use client";

import { useState, useEffect } from "react";
import PostComponent from "../components/post";
import { useUser } from "../context/UserContext";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useUser();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/favorites");
        const favoritePosts = await response.json();
        setFavorites(favoritePosts);
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris:", error);
        setError("Impossible de charger vos favoris");
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchFavorites();
    }
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <div className="animate-spin w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        Vos Favoris
      </h1>
      {favorites.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Aucun post favoris pour le moment.</p>
          <p className="text-sm mt-2">Ajoutez en et retrouvez les ici !</p>
        </div>
      ) : (
        <div className="grid gap-6 pt-7">
          {favorites.map((post) => (
            <PostComponent key={post.post_id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
