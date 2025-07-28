"use client";
import React, { useState } from 'react';
import SearchBar from '../components/searchBar';
import MentionAutocomplete from '../components/MentionAutocomplete';
import { ParsedText } from '../utils/textParser';
import TestMentions from '../components/TestMentions';

export default function TestSystemsPage() {
  const [testText, setTestText] = useState("Test @john #react #javascript avec @marie et #nextjs");

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              Test des Systèmes
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vérification de tous les systèmes autour des posts
          </p>
        </div>

        <div className="grid gap-8">
          {/* Test 1: Barre de recherche */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-6 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30">
            <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              ✅ Test 1: Barre de recherche
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Testez la barre de recherche avec autocomplétion. Essayez de chercher des utilisateurs, posts ou hashtags.
            </p>
            <SearchBar />
          </div>

          {/* Test 2: Auto-complétion des mentions */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-6 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30">
            <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              ✅ Test 2: Auto-complétion des mentions et hashtags
            </h2>
            <TestMentions />
          </div>

          {/* Test 3: Parsing du texte */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-6 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30">
            <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400">
              ✅ Test 3: Parsing des mentions et hashtags
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Vérifiez que les mentions (@) et hashtags (#) sont correctement parsés et cliquables.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Texte de test:
                </label>
                <input
                  type="text"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rendu avec liens cliquables:
                </label>
                <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <ParsedText text={testText} className="text-gray-900 dark:text-gray-100" />
                </div>
              </div>
            </div>
          </div>

          {/* Test 4: Statut des systèmes */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-6 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30">
            <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400">
              📊 Statut des systèmes
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 dark:text-green-300 font-medium">Barre de recherche</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 dark:text-green-300 font-medium">Auto-complétion utilisateurs</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 dark:text-green-300 font-medium">Auto-complétion hashtags</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 dark:text-green-300 font-medium">Parsing des mentions</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 dark:text-green-300 font-medium">Parsing des hashtags</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 dark:text-green-300 font-medium">Recherche dans nouveaux posts</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 dark:text-green-300 font-medium">Création de posts avec mentions</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 dark:text-green-300 font-medium">Commentaires avec mentions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl shadow-xl border border-blue-200/50 dark:border-blue-600/30">
            <h2 className="text-xl font-bold mb-4 text-blue-800 dark:text-blue-200">
              📋 Instructions de test
            </h2>
            
            <div className="space-y-4 text-blue-700 dark:text-blue-300">
              <div>
                <h3 className="font-semibold mb-2">1. Test de la barre de recherche :</h3>
                <ul className="space-y-1 ml-4 text-sm">
                  <li>• Tapez quelques lettres pour voir l'autocomplétion</li>
                  <li>• Testez la recherche d'utilisateurs, posts et hashtags</li>
                  <li>• Vérifiez que les suggestions apparaissent rapidement</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">2. Test des mentions et hashtags :</h3>
                <ul className="space-y-1 ml-4 text-sm">
                  <li>• Dans la zone de test, tapez @ suivi de lettres</li>
                  <li>• Tapez # suivi de lettres pour les hashtags</li>
                  <li>• Utilisez les flèches et Entrée pour sélectionner</li>
                  <li>• Vérifiez que les liens sont cliquables dans l'aperçu</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">3. Test de création de posts :</h3>
                <ul className="space-y-1 ml-4 text-sm">
                  <li>• Allez sur la page de création de posts</li>
                  <li>• Utilisez @ et # pendant la saisie</li>
                  <li>• Vérifiez l'aperçu en temps réel</li>
                  <li>• Créez un post et vérifiez qu'il est trouvable par la recherche</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
