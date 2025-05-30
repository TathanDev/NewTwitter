import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex items-center justify-center px-4 relative overflow-hidden">
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

      <div className="max-w-7xl w-full space-y-8 relative z-10">
        {/* Header section - Plus compact */}
        <section className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Left: Company Name */}
          <div className="text-center lg:text-left relative">
            {/* Halo effect behind the title */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-400/30 dark:via-purple-400/30 dark:to-pink-400/30 rounded-3xl blur-2xl"></div>
            <div className="relative">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse">
                  NewT
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
                Le réseau social nouvelle génération
              </p>
            </div>
          </div>

          {/* Center: Stats Section - Intégrées dans le header */}
          <div className="grid grid-cols-3 gap-3 text-center order-3 lg:order-2">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-4 rounded-2xl shadow-lg border border-gray-300/50 dark:border-gray-600/30 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent relative z-10">
                12k+
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 relative z-10">
                Utilisateurs
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-4 rounded-2xl shadow-lg border border-gray-300/50 dark:border-gray-600/30 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 dark:from-green-400/20 dark:to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent relative z-10">
                132
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 relative z-10">
                En ligne
              </p>
              <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
            </div>

            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-4 rounded-2xl shadow-lg border border-gray-300/50 dark:border-gray-600/30 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-400/20 dark:to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent relative z-10">
                8k+
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 relative z-10">
                Posts
              </p>
            </div>
          </div>

          {/* Right: Description */}
          <div className="text-center lg:text-right relative order-2 lg:order-3">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-5 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                Découvrez{" "}
                <strong className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  NewT
                </strong>
                , le réseau social qui connecte les utilisateurs à travers des
                publications innovantes, un système de messages privés intuitif,
                et des fonctionnalités sociales avancées.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section - Plus compacte et sur une ligne */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 p-5 rounded-3xl shadow-lg border border-blue-200/50 dark:border-blue-600/40 transform hover:scale-105 transition-transform duration-300">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-xl flex items-center justify-center mb-3">
              <span className="text-white text-lg">📝</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-blue-800 dark:text-blue-200">
              Publications
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Partagez vos idées avec des posts riches en médias, likes et
              commentaires intégrés.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 p-5 rounded-3xl shadow-lg border border-purple-200/50 dark:border-purple-600/40 transform hover:scale-105 transition-transform duration-300">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 rounded-xl flex items-center justify-center mb-3">
              <span className="text-white text-lg">💬</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-purple-800 dark:text-purple-200">
              Messages Privés
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Système de messagerie avancé avec conversations privées et groupes
              personnalisés.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/40 dark:to-pink-800/40 p-5 rounded-3xl shadow-lg border border-pink-200/50 dark:border-pink-600/40 transform hover:scale-105 transition-transform duration-300">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 dark:from-pink-400 dark:to-pink-500 rounded-xl flex items-center justify-center mb-3">
              <span className="text-white text-lg">👥</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-pink-800 dark:text-pink-200">
              Réseau Social
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Suivez vos amis, découvrez du contenu personnalisé et explorez
              différentes catégories.
            </p>
          </div>
        </section>

        {/* Call to action buttons */}
        <section className="flex justify-center gap-6 pt-2">
          <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2">
            <span>Se connecter</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </button>
          <button className="group px-8 py-4 bg-transparent border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-700 dark:hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2">
            <span>S'inscrire</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              ✨
            </span>
          </button>
        </section>

        {/* Bottom decorative element */}
        <div className="flex justify-center mt-8">
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 rounded-full"></div>
        </div>
      </div>
    </main>
  );
}
