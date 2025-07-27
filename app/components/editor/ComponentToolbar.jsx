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
    <div>
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
          <Plus className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Composants
        </h3>
      </div>
      
      <div className="space-y-3">
        {COMPONENT_TYPES.map(({ type, icon: Icon, label, color }) => (
          <button
            key={type}
            onClick={() => onAddComponent(type)}
            className="w-full flex items-center p-3 text-left rounded-2xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-200/50 dark:border-gray-600/30"
            title={`Ajouter ${label}`}
          >
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              {label}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/30">
        <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
          💡 <strong>Astuce:</strong> Glissez-déposez les composants dans le canvas pour les réorganiser facilement
        </p>
      </div>
    </div>
  );
}
