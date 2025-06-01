"use client";

import React, { useState } from "react";
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

export default function Post({
  author = "Marie Dubois",
  username = "@marie_dubois",
  timeAgo = "il y a 2h",
  content = "Magnifique coucher de soleil aujourd'hui ! 🌅 Parfois il faut s'arrêter et apprécier les petits moments de bonheur que la vie nous offre. #nature #sunset #gratitude",
  likesCount = 42,
  commentsCount = 8,
  sharesCount = 3,
  avatar = "/api/placeholder/40/40",
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(likesCount);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLocalLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleComment = () => {
    console.log("Ouvrir les commentaires");
  };

  const handleShare = () => {
    console.log("Partager le post");
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    console.log(isSaved ? "Post retiré des favoris" : "Post sauvegardé");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-colors duration-300">
      {/* En-tête du post */}
      <div className="p-6 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {author.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {author}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{username}</span>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu du post */}
      <div className="px-6 pb-4">
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
          {content}
        </p>
      </div>

      {/* Image du post (optionnelle) */}
      <div className="px-6 pb-4">
        <div className="w-full h-64 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
          <span className="text-white text-lg font-medium">
            Image du coucher de soleil
          </span>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="px-6 py-4 ">
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
            <span className="font-medium"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
