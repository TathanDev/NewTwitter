"use client";
import React, { useState } from "react";
import { Settings, Trash2, Edit3 } from "lucide-react";

export default function ComponentProperties({ component, onUpdate, onRemove }) {
  const [activeTab, setActiveTab] = useState('content');

  const renderContentEditor = () => {
    switch (component.type) {
      case 'text':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contenu
              </label>
              <textarea
                value={component.data.content || ''}
                onChange={(e) => onUpdate({ content: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
                placeholder="Tapez votre texte ici..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Couleur
                </label>
                <input
                  type="color"
                  value={component.data.formatting?.color || '#333333'}
                  onChange={(e) => onUpdate({ 
                    formatting: { 
                      ...component.data.formatting, 
                      color: e.target.value 
                    }
                  })}
                  className="w-full h-10 rounded border border-gray-300 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Taille
                </label>
                <select
                  value={component.data.formatting?.fontSize || '16px'}
                  onChange={(e) => onUpdate({ 
                    formatting: { 
                      ...component.data.formatting, 
                      fontSize: e.target.value 
                    }
                  })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="12px">12px</option>
                  <option value="14px">14px</option>
                  <option value="16px">16px</option>
                  <option value="18px">18px</option>
                  <option value="20px">20px</option>
                  <option value="24px">24px</option>
                  <option value="32px">32px</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => onUpdate({ 
                  formatting: { 
                    ...component.data.formatting, 
                    fontWeight: component.data.formatting?.fontWeight === 'bold' ? 'normal' : 'bold'
                  }
                })}
                className={`px-3 py-1 rounded text-sm font-bold ${
                  component.data.formatting?.fontWeight === 'bold'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                B
              </button>
              
              <button
                onClick={() => onUpdate({ 
                  formatting: { 
                    ...component.data.formatting, 
                    fontStyle: component.data.formatting?.fontStyle === 'italic' ? 'normal' : 'italic'
                  }
                })}
                className={`px-3 py-1 rounded text-sm italic ${
                  component.data.formatting?.fontStyle === 'italic'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                I
              </button>
              
              <button
                onClick={() => onUpdate({ 
                  formatting: { 
                    ...component.data.formatting, 
                    textDecoration: component.data.formatting?.textDecoration === 'underline' ? 'none' : 'underline'
                  }
                })}
                className={`px-3 py-1 rounded text-sm underline ${
                  component.data.formatting?.textDecoration === 'underline'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                U
              </button>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Uploader une image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('files', file);
                    
                    try {
                      const response = await fetch('/api/media/batch', {
                        method: 'POST',
                        body: formData
                      });
                      
                      if (response.ok) {
                        const result = await response.json();
                        if (result.files && result.files.length > 0) {
                          onUpdate({ urls: [result.files[0].url] });
                        }
                      }
                    } catch (error) {
                      console.error('Erreur lors de l\'upload:', error);
                    }
                  }
                }}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            
            <div className="text-center text-gray-500 text-sm">
              ou
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL de l'image
              </label>
              <input
                type="url"
                value={component.data.urls?.[0] || ''}
                onChange={(e) => onUpdate({ urls: [e.target.value] })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Texte alternatif
              </label>
              <input
                type="text"
                value={component.data.alt || ''}
                onChange={(e) => onUpdate({ alt: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Description de l'image"
              />
            </div>
            
            {/* Aperçu de l'image */}
            {component.data.urls?.[0] && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Aperçu
                </label>
                <img
                  src={component.data.urls[0]}
                  alt={component.data.alt || 'Aperçu'}
                  className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );

      case 'quote':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Citation
              </label>
              <textarea
                value={component.data.text || ''}
                onChange={(e) => onUpdate({ text: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
                placeholder="Votre citation inspirante..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Auteur
              </label>
              <input
                type="text"
                value={component.data.author || ''}
                onChange={(e) => onUpdate({ author: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Nom de l'auteur"
              />
            </div>
          </div>
        );

      case 'link':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL du lien
              </label>
              <input
                type="url"
                value={component.data.url || ''}
                onChange={(e) => onUpdate({ url: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="https://example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre du lien
              </label>
              <input
                type="text"
                value={component.data.title || ''}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Nom d'affichage du lien"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={component.data.description || ''}
                onChange={(e) => onUpdate({ description: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={2}
                placeholder="Description optionnelle du lien"
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL de la vidéo
              </label>
              <input
                type="url"
                value={component.data.url || ''}
                onChange={(e) => onUpdate({ url: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="https://example.com/video.mp4"
              />
            </div>
            
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={component.data.autoplay || false}
                  onChange={(e) => onUpdate({ autoplay: e.target.checked })}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lecture automatique
                </span>
              </label>
            </div>
          </div>
        );

      case 'spacer':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hauteur
            </label>
            <select
              value={component.data.height || '20px'}
              onChange={(e) => onUpdate({ height: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="10px">10px</option>
              <option value="20px">20px</option>
              <option value="30px">30px</option>
              <option value="40px">40px</option>
              <option value="60px">60px</option>
            </select>
          </div>
        );

      default:
        return <p className="text-gray-500">Aucune propriété disponible pour ce composant.</p>;
    }
  };

  if (!component) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Sélectionnez un composant pour modifier ses propriétés
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Propriétés - {component.type}
          </h3>
        </div>
        
        <button
          onClick={onRemove}
          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
          title="Supprimer le composant"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {renderContentEditor()}
      </div>
    </div>
  );
}
