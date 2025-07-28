"use client";
import React, { useState } from "react";
import { Settings, Trash2, Edit3 } from "lucide-react";
import MentionAutocomplete from '../MentionAutocomplete';

export default function ComponentProperties({ component, onUpdate, onRemove }) {
  const [activeTab, setActiveTab] = useState('content');

  const renderContentEditor = () => {
    switch (component.type) {
      case 'text':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Contenu
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300"></div>
                <MentionAutocomplete
                  value={component.data.content || ''}
                  onChange={(value) => onUpdate({ content: value })}
                  className="relative w-full py-3 px-4 text-base text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-2xl border border-gray-300/50 dark:border-gray-600/30 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl resize-none"
                  rows={3}
                  placeholder="Tapez votre texte ici... Utilisez @ pour mentionner ou # pour les hashtags"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Couleur du texte
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-300/50 dark:border-gray-600/30">
                    <div className="color-input w-12 h-12">
                      <input
                        type="color"
                        value={component.data.formatting?.color || '#333333'}
                        onChange={(e) => onUpdate({ 
                          formatting: { 
                            ...component.data.formatting, 
                            color: e.target.value 
                        }
                        })}
                        title="Sélectionner une couleur de texte"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Couleur actuelle</div>
                      <input
                        type="text"
                        value={component.data.formatting?.color || '#333333'}
                        onChange={(e) => onUpdate({ 
                          formatting: { 
                            ...component.data.formatting, 
                            color: e.target.value 
                        }
                        })}
                        className="w-20 px-2 py-1 text-xs font-mono bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="#333333"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  Taille de police
                </label>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="range"
                      min="12"
                      max="32"
                      step="2"
                      value={parseInt(component.data.formatting?.fontSize || '16')}
                      onChange={(e) => onUpdate({ 
                        formatting: { 
                          ...component.data.formatting, 
                          fontSize: `${e.target.value}px` 
                        }
                      })}
                      className="w-full h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <span>Petit</span>
                      <span>Normal</span>
                      <span>Grand</span>
                      <span>Très grand</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      {component.data.formatting?.fontSize || '16px'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Formatage
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => onUpdate({ 
                    formatting: { 
                      ...component.data.formatting, 
                      fontWeight: component.data.formatting?.fontWeight === 'bold' ? 'normal' : 'bold'
                    }
                  })}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    component.data.formatting?.fontWeight === 'bold'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-600/30'
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
                  className={`px-4 py-2 rounded-xl text-sm italic transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    component.data.formatting?.fontStyle === 'italic'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-600/30'
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
                  className={`px-4 py-2 rounded-xl text-sm underline transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    component.data.formatting?.textDecoration === 'underline'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-600/30'
                  }`}
                >
                  U
                </button>
              </div>
            </div>
          </div>
        );

      case 'media':
        return (
          <div className="space-y-4">
            {/* Sélecteur de type de média */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Type de média
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => onUpdate({ type: 'image' })}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    component.data.type === 'image'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  🖼️ Image
                </button>
                <button
                  onClick={() => onUpdate({ type: 'video' })}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    component.data.type === 'video'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  🎥 Vidéo
                </button>
              </div>
            </div>

            {/* Configuration pour les images */}
            {component.data.type === 'image' && (
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
            )}

            {/* Configuration pour les vidéos */}
            {component.data.type === 'video' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Uploader une vidéo
                  </label>
                  <input
                    type="file"
                    accept="video/*"
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
                              onUpdate({ url: result.files[0].url });
                            }
                          }
                        } catch (error) {
                          console.error('Erreur lors de l\'upload:', error);
                        }
                      }
                    }}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  />
                </div>
                
                <div className="text-center text-gray-500 text-sm">
                  ou
                </div>
                
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
                
                {/* Aperçu de la vidéo */}
                {component.data.url && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Aperçu
                    </label>
                    <video
                      src={component.data.url}
                      controls
                      className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
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
              <MentionAutocomplete
                value={component.data.text || ''}
                onChange={(value) => onUpdate({ text: value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
                placeholder="Votre citation inspirante... Utilisez @ ou # si nécessaire"
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
              <MentionAutocomplete
                value={component.data.description || ''}
                onChange={(value) => onUpdate({ description: value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={2}
                placeholder="Description optionnelle du lien... Utilisez @ ou # si nécessaire"
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
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Hauteur de l'espacement
            </label>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="10"
                  value={parseInt(component.data.height || '20')}
                  onChange={(e) => onUpdate({ height: `${e.target.value}px` })}
                  className="w-full h-2 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>Petit</span>
                  <span>Moyen</span>
                  <span>Grand</span>
                  <span>Très grand</span>
                </div>
              </div>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">
                  {component.data.height || '20px'}
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return <p className="text-gray-500">Aucune propriété disponible pour ce composant.</p>;
    }
  };

  if (!component) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <Settings className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Sélectionnez un composant pour modifier ses propriétés
        </p>
      </div>
    );
  }

  const getComponentIcon = (type) => {
    switch (type) {
      case 'text': return '📝';
      case 'media': return '🎬';
      case 'quote': return '💬';
      case 'link': return '🔗';
      case 'spacer': return '📏';
      default: return '⚙️';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-3">
            <span className="text-lg">{getComponentIcon(component.type)}</span>
          </div>
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
            Propriétés
          </h3>
        </div>
        
        <button
          onClick={onRemove}
          className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
