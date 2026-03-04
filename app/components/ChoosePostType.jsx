"use client";

import Link from "next/link";
import { Sparkles, Zap } from "lucide-react";

export default function ChoosePostType() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 px-4 py-8 relative overflow-hidden">
      {/* Formes décoratives d'arrière-plan */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-500/30 dark:to-purple-500/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-purple-400/15 to-pink-400/15 dark:from-purple-500/25 dark:to-pink-500/25 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-r from-pink-400/25 to-blue-400/25 dark:from-pink-500/35 dark:to-blue-500/35 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              Créer un Post
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Choisissez le mode de création qui vous convient
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Option Simple */}
          <Link
            href="/createPost?mode=simple"
            className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-8 rounded-3xl shadow-xl border-2 border-transparent hover:border-blue-500 transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Mode Simple
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Création rapide et classique. Texte + un fichier média (image ou vidéo).
              </p>
              <div className="mt-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium">
                Pour un post rapide
              </div>
            </div>
          </Link>

          {/* Option Avancé */}
          <Link
            href="/createPost?mode=advanced"
            className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-8 rounded-3xl shadow-xl border-2 border-transparent hover:border-purple-500 transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Mode Avancé
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Éditeur complet avec composants multiples, styles personnalisés et support de plusieurs médias.
              </p>
              <div className="mt-4 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 text-sm font-medium">
                Pour un post personnalisé
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
