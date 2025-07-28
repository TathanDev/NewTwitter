"use client";
import React, { useState } from "react";
import { createPost } from "@/app/actions/post";
import MentionAutocomplete from './MentionAutocomplete';
import { ParsedText } from '../utils/textParser';
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Upload,
  Video,
  X,
  Eye,
  Send,
} from "lucide-react";

export default function CreatePostPage({ user }) {
  const [postContent, setPostContent] = useState("");
  const [components, setComponents] = useState([]);
  const [styleConfig, setStyleConfig] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Données de l'utilisateur simulées
  const currentUser = {
    name: user.pseudo_user,
    username: user.pseudo_user,
    avatar: "V",
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    if (files && files.length > 0) {
      setSelectedFiles(files);
      const types = files.map(file => file.type.startsWith("image/") ? "image" : "video");
      setFileTypes(types);

      const previews = [];
      let loadedCount = 0;
      
      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews[index] = e.target.result;
          loadedCount++;
          if (loadedCount === files.length) {
            setFilePreviews([...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
    setFileTypes(prev => prev.filter((_, i) => i !== index));
  };

  const removeAllFiles = () => {
    setSelectedFiles([]);
    setFilePreviews([]);
    setFileTypes([]);
  };

  const addComponent = (type) => {
    const newComponent = {
      id: `comp_${Date.now()}`,
      type,
      order: components.length,
      data: {} // Ajouter la logique pour gérer les données par défaut
    };
    setComponents([...components, newComponent]);
  };

  const handleSubmit = async () => {
    if (postContent.trim() || selectedFiles.length > 0) {
      let uploadedFiles = [];
      
      // Upload tous les fichiers sélectionnés
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach(file => {
          formData.append('files', file);
        });
        
        try {
          const res = await fetch("/api/media/batch", {
            method: "POST",
            body: formData,
          });
          const result = await res.json();
          if (result.success && result.files) {
            uploadedFiles = result.files;
          }
        } catch (error) {
          console.error('Erreur lors de l\'upload des fichiers:', error);
        }
      }
      
      // Créer des composants pour le nouveau système s'il y a du contenu
      let contentComponents = [...components];
      
      // Ajouter le composant de texte s'il y a du contenu texte
      if (postContent.trim()) {
        contentComponents.push({
          id: `text_${Date.now()}`,
          type: 'text',
          order: contentComponents.length,
          data: {
            content: postContent,
            formatting: {
              fontSize: '16px',
              lineHeight: '1.5',
              color: 'inherit'
            }
          }
        });
      }
      
      // Ajouter les composants média pour chaque fichier uploadé
      if (uploadedFiles.length > 0) {
        // Séparer les images et les vidéos
        const images = uploadedFiles.filter(file => file.type.startsWith('image/'));
        const videos = uploadedFiles.filter(file => file.type.startsWith('video/'));
        
        // Créer un composant media avec toutes les images
        if (images.length > 0) {
          const imageComponent = {
            id: `images_${Date.now()}`,
            type: 'media',
            order: contentComponents.length,
            data: {
              type: 'image',
              urls: images.map(img => img.url),
              alt: 'Images du post',
              layout: 'multiple',
              aspectRatio: '16:9'
            }
          };
          contentComponents.push(imageComponent);
        }
        
        // Créer des composants vidéo séparés (une vidéo par composant)
        videos.forEach((video, index) => {
          const videoComponent = {
            id: `video_${Date.now()}_${index}`,
            type: 'media',
            order: contentComponents.length,
            data: {
              type: 'video',
              url: video.url,
              urls: [video.url],
              autoplay: false,
              layout: 'single',
              aspectRatio: '16:9'
            }
          };
          contentComponents.push(videoComponent);
        });
      }
      
      let data = {
        author: user.pseudo_user,
        content_structure: { components: contentComponents },
        style_config: styleConfig,
        text: postContent, // Garde la compatibilité avec l'ancien système
        media: uploadedFiles.length > 0 ? uploadedFiles[0].url : "", // Garde la compatibilité avec l'ancien système
      };
      createPost(data);
      setPostContent("");
      setComponents([]);
      setSelectedFiles([]);
      setFilePreviews([]);
      setFileTypes([]);
    }
  };

  // Composant de prévisualisation du post
  const PostPreview = () => (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-colors duration-300">
      {/* En-tête du post */}
      <div className="p-6 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {currentUser.avatar}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {currentUser.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{currentUser.username}</span>
              <span>•</span>
              <span>À l'instant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu du post avec mentions et hashtags parsés */}
      {postContent && (
        <div className="px-6 pb-4">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            <ParsedText text={postContent} />
          </p>
        </div>
      )}

      {/* Média du post */}
      {filePreviews.length > 0 && (
        <div className="px-6 pb-4">
          <div className="space-y-2">
            {filePreviews.map((preview, index) => (
              <div key={index} className="w-full rounded-xl overflow-hidden">
                {fileTypes[index] === "image" ? (
                  <img
                    src={preview}
                    alt={`Aperçu ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <video
                    src={preview}
                    className="w-full h-64 object-cover"
                    controls
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-around">
          <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
            <Heart className="w-5 h-5" />
            <span className="font-medium">0</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">0</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
            <Share className="w-5 h-5" />
            <span className="font-medium">0</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 px-4 py-8 relative overflow-hidden">
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

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div></div>
          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                Créer un Post
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400"></p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulaire de création */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-4 md:p-6 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm">
              <h2 className="text-lg md:text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Contenu du post
              </h2>

              {/* Zone de texte avec auto-complétion */}
              <MentionAutocomplete
                value={postContent}
                onChange={setPostContent}
                placeholder="Qu'avez-vous à partager aujourd'hui ? Utilisez @ pour mentionner un utilisateur ou # pour un hashtag"
                className="w-full h-32 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300"
                maxLength={500}
                rows={5}
              />

              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {postContent.length}/500 caractères
                </span>
              </div>
            </div>

            {/* Zone de téléchargement de fichier */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-4 md:p-6 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm">
              <h2 className="text-lg md:text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                Médias
              </h2>

            {selectedFiles.length === 0 ? (
                <div
                  className={`border-2 border-dashed rounded-2xl p-4 md:p-8 text-center transition-all duration-300 ${
                    isDragOver
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <Upload className="w-8 md:w-12 h-8 md:h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-2">
                    Glissez-déposez des images ou vidéos ici
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-500 mb-4">
                    ou
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-300 cursor-pointer text-sm md:text-base">
                    <Upload className="w-4 md:w-5 h-4 md:h-5" />
                    Choisir des fichiers
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-3">
                      <Upload className="w-6 h-6 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedFiles.length} fichier{selectedFiles.length > 1 ? 's' : ''} sélectionné{selectedFiles.length > 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {(selectedFiles.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(2)} MB total
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeAllFiles}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Liste des fichiers individuels */}
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center gap-2">
                          {fileTypes[index] === "image" ? (
                            <Upload className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Video className="w-4 h-4 text-purple-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Boutons d'action - Mobile uniquement */}
            <div className="lg:hidden">
              <button
                onClick={handleSubmit}
                disabled={!postContent.trim() && selectedFiles.length === 0}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                Publier
              </button>
            </div>
          </div>
          
          {/* Prévisualisation - Desktop uniquement */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <h2 className="text-lg md:text-xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Aperçu en temps réel
              </h2>

              {postContent.trim() || selectedFiles.length > 0 ? (
                <PostPreview />
              ) : (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 md:p-12 text-center">
                  <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-6 md:w-8 h-6 md:h-8 text-white" />
                  </div>
                  <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                    Votre post apparaîtra ici
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Commencez à écrire ou ajoutez un média
                  </p>
                </div>
              )}

              {/* Boutons d'action - Desktop uniquement */}
              <div className="hidden lg:block mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={!postContent.trim() && selectedFiles.length === 0}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  Publier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
