"use client";

import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

export default function FollowButton({ targetUserId, onFollowChange }) {
  const { currentUser: user } = useUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Vérifier le statut de suivi au chargement
  useEffect(() => {
    if (user && targetUserId && user.id_user !== parseInt(targetUserId)) {
      checkFollowStatus();
    }
  }, [user, targetUserId]);

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(
        `/api/follow?targetUserId=${targetUserId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du statut:", error);
    }
  };

  const handleFollowToggle = async () => {
    if (!user) {
      alert("Vous devez être connecté pour suivre des utilisateurs");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId,
          action: isFollowing ? "unfollow" : "follow",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsFollowing(data.isFollowing);
        setShowNotification(true);
        
        // Cacher la notification après 3 secondes
        setTimeout(() => setShowNotification(false), 3000);
        
        // Notifier le parent du changement
        if (onFollowChange) {
          onFollowChange(data.isFollowing);
        }
      } else {
        alert(data.error || "Erreur lors de l'action");
      }
    } catch (error) {
      console.error("Erreur lors du follow/unfollow:", error);
      alert("Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  };

  // Ne pas afficher le bouton si c'est le profil de l'utilisateur connecté
  if (!user || !targetUserId || user.id_user === parseInt(targetUserId)) {
    return null;
  }

  return (
    <>
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-300">
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
            {isFollowing ? "Utilisateur suivi !" : "Utilisateur non suivi !"}
          </span>
        </div>
      )}

      <button
        onClick={handleFollowToggle}
        disabled={isLoading}
        className={`group px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 min-w-[140px] ${
          isFollowing
            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/50"
            : "bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>{isFollowing ? "👥" : "➕"}</span>
            <span>{isFollowing ? "Se désabonner" : "Suivre"}</span>
          </>
        )}
      </button>
    </>
  );
}
