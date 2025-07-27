"use client";
import ModernPost from "../components/ModernPost";
import SearchBar from "../components/searchBar";

export default function GetHomePage({ postsList = [], user }) {
  return (
    <div>
      <div className="flex flex-col justify-center min-h-screen space-y-4">
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
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div
          tabIndex={0}
          className="overflow-y-scroll h-[100vh] py-9 space-y-4 hide-scrollbar"
        >
          {postsList && postsList.length > 0 ? (
            postsList.map((post) => (
              <ModernPost
                key={post.post_id}
                post={post}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Aucun post à afficher
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-4 right-4">
        <SearchBar></SearchBar>
      </div>
    </div>
  );
}
