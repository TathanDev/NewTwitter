"use client";
import React, { useState } from 'react';
import MentionAutocomplete from '../components/MentionAutocomplete';

export default function TestMentionsPage() {
  const [testText, setTestText] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Test du système de mentions
        </h1>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Tapez @ suivi d'un nom ou # suivi d'un mot :
          </label>
          
          <MentionAutocomplete
            value={testText}
            onChange={setTestText}
            placeholder="Tapez @ ou # pour tester..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
            maxLength={500}
          />
          
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Valeur actuelle :</h3>
            <pre className="text-sm text-gray-600 dark:text-gray-400">{JSON.stringify(testText, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
