"use client";
import React, { useState } from 'react';
import MentionAutocomplete from './MentionAutocomplete';
import { ParsedText } from '../utils/textParser';

export default function TestMentions() {
  const [testText, setTestText] = useState("Salut @john ! As-tu vu le nouveau #nextjs ? C'est fantastique ! @marie et @pierre vont adorer #react #javascript");

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Test du système de mentions et hashtags
      </h2>
      
      <div className="space-y-6">
        {/* Zone de saisie avec auto-complétion */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tapez votre message avec @ ou # :
          </label>
          <MentionAutocomplete
            value={testText}
            onChange={setTestText}
            placeholder="Tapez @ ou # pour tester l'auto-complétion..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
            maxLength={500}
          />
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {testText.length}/500 caractères
          </div>
        </div>

        {/* Aperçu du rendu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Aperçu du rendu avec mentions et hashtags cliquables :
          </label>
          <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
            <ParsedText 
              text={testText} 
              className="text-gray-900 dark:text-gray-100 leading-relaxed"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Instructions de test :
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Tapez @ suivi d'un nom d'utilisateur pour voir l'auto-complétion</li>
            <li>• Tapez # suivi d'un mot pour voir les hashtags suggérés</li>
            <li>• Utilisez les flèches ↑↓ pour naviguer dans les suggestions</li>
            <li>• Appuyez sur Entrée ou Tab pour sélectionner une suggestion</li>
            <li>• Les mentions apparaissent en bleu et redirigent vers le profil</li>
            <li>• Les hashtags apparaissent en bleu et lancent une recherche</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
