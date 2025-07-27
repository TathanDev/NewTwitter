"use client";
import React from "react";
import { 
  Type, 
  Image, 
  Video, 
  Quote, 
  Minus, 
  Link,
  Plus
} from "lucide-react";

const COMPONENT_TYPES = [
  { type: 'text', icon: Type, label: 'Texte', color: 'bg-blue-500' },
  { type: 'image', icon: Image, label: 'Image', color: 'bg-green-500' },
  { type: 'video', icon: Video, label: 'Vidéo', color: 'bg-red-500' },
  { type: 'quote', icon: Quote, label: 'Citation', color: 'bg-purple-500' },
  { type: 'link', icon: Link, label: 'Lien', color: 'bg-orange-500' },
  { type: 'spacer', icon: Minus, label: 'Espace', color: 'bg-gray-500' },
];

export default function ComponentToolbar({ onAddComponent }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center mb-3">
        <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Ajouter un composant
        </h3>
      </div>
      
      <div className="space-y-2">
        {COMPONENT_TYPES.map(({ type, icon: Icon, label, color }) => (
          <button
            key={type}
            onClick={() => onAddComponent(type)}
            className="w-full flex items-center p-3 text-left rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
            title={`Ajouter ${label}`}
          >
            <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-xs text-blue-600 dark:text-blue-400">
          💡 <strong>Astuce:</strong> Glissez-déposez les composants pour les réorganiser
        </p>
      </div>
    </div>
  );
}
