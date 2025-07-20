'use client';

import { TrashIcon } from '@heroicons/react/24/outline';

export default function DebugNotificationsPage() {
  const handleDelete = () => {
    alert('Bouton cliqué !');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  DEBUG Notifications
                </h1>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                <TrashIcon className="size-4" />
                BOUTON DEBUG
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Page de debug</h2>
        <p>Si vous voyez cette page et le bouton rouge en haut à droite, cela signifie que le problème vient du fichier page.jsx original.</p>
      </div>
    </div>
  );
}
