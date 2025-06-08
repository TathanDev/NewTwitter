"use client";
import React, { useState } from "react";
import { createPost } from "@/app/actions/post";
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Données de l'utilisateur simulées
  const currentUser = {
    name: user.pseudo_user,
    username: user.pseudo_user,
    avatar: "V",
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file) {
      setSelectedFile(file);
      const type = file.type.startsWith("image/") ? "image" : "video";
      setFileType(type);

      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    processFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileType("");
  };

  const handleSubmit = async () => {
    if (postContent.trim() || selectedFile) {
      let link = { url: "" };
      if (selectedFile) {
        const res = await fetch("/api/postMedia", {
          method: "POST",
          body: selectedFile,
          headers: {
            "x-filename": selectedFile.name,
          },
        });
        link = await res.json();
      }
      let data = {
        pseudo: user.pseudo_user,
        text: postContent,
        media: link.url || "",
      };
      createPost(data);
      setPostContent("");
      setSelectedFile(null);
      setFilePreview(null);
      setFileType("");
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

      {/* Contenu du post */}
      {postContent && (
        <div className="px-6 pb-4">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            {postContent}
          </p>
        </div>
      )}

      {/* Média du post */}
      {filePreview && (
        <div className="px-6 pb-4">
          <div className="w-full rounded-xl overflow-hidden">
            {fileType === "image" ? (
              <img
                src={filePreview}
                alt="Aperçu"
                className="w-full h-64 object-cover"
              />
            ) : (
              <video
                src={filePreview}
                className="w-full h-64 object-cover"
                controls
              />
            )}
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

        <div className="grid gap-8">
          {/* Formulaire de création */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-6 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Contenu du post
              </h2>

              {/* Zone de texte */}
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Qu'avez-vous à partager aujourd'hui ?"
                className="w-full h-32 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300"
                maxLength={500}
              />

              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {postContent.length}/500 caractères
                </span>
              </div>
            </div>

            {/* Zone de téléchargement de fichier */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-6 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                Médias
              </h2>

              {!selectedFile ? (
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    isDragOver
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Glissez-déposez une image ou vidéo ici
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                    ou
                  </p>
                  <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-300 cursor-pointer">
                    <Upload className="w-5 h-5" />
                    Choisir un fichier
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-3">
                      {fileType === "image" ? (
                        <Upload className="w-6 h-6 text-blue-500" />
                      ) : (
                        <Video className="w-6 h-6 text-purple-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Prévisualisation */}
            <div className="lg:block">
              <div className="sticky top-8">
                <h2 className="text-xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  Aperçu en temps réel
                </h2>

                {postContent.trim() || selectedFile ? (
                  <PostPreview />
                ) : (
                  <div className="max-w-2xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Votre post apparaîtra ici
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Commencez à écrire ou ajoutez un média
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={!postContent.trim() && !selectedFile}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                Publier
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
