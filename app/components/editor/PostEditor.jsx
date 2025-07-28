"use client";
import React, { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRouter } from "next/navigation";
import ComponentToolbar from "./ComponentToolbar";
import PostCanvas from "./PostCanvas";
import ComponentProperties from "./ComponentProperties";
import UnifiedStyleEditor from "./UnifiedStyleEditor";
import { createPost } from "@/app/actions/post";

const getDefaultData = (type) => {
  switch (type) {
    case 'text':
      return {
        content: "Nouveau texte",
        formatting: {
          fontSize: "16px",
          color: "#333333",
          fontWeight: "normal",
          textAlign: "left"
        }
      };
    case 'media':
      return {
        type: "image", // "image" ou "video"
        urls: [], // Pour les images
        url: "", // Pour les vidéos
        alt: "",
        thumbnail: "",
        autoplay: false,
        layout: "single",
        aspectRatio: "16:9"
      };
    case 'quote':
      return {
        text: "Citation inspirante",
        author: "Auteur",
        style: "italic"
      };
    case 'spacer':
      return {
        height: "20px"
      };
    case 'link':
      return {
        url: "",
        title: "",
        description: "",
        preview: true
      };
    default:
      return {};
  }
};

export default function PostEditor({ user, onClose }) {
  const [components, setComponents] = useState([]);
  const [styleConfig, setStyleConfig] = useState({
    background: {
      type: "solid",
      value: "#ffffff"
    },
    border: {
      style: "solid",
      width: "1px",
      color: "#e0e0e0",
      radius: "12px"
    },
    theme: "light"
  });
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const addComponent = useCallback((type) => {
    const newComponent = {
      id: `comp_${Date.now()}`,
      type,
      order: components.length,
      data: getDefaultData(type)
    };
    setComponents(prev => [...prev, newComponent]);
  }, [components.length]);

  const updateComponent = useCallback((id, newData) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === id ? { ...comp, data: { ...comp.data, ...newData } } : comp
      )
    );
    
    // Mettre à jour selectedComponent si c'est le composant modifié
    setSelectedComponent(prev => {
      if (prev && prev.id === id) {
        return { ...prev, data: { ...prev.data, ...newData } };
      }
      return prev;
    });
  }, []);

  const removeComponent = useCallback((id) => {
    setComponents(prev => {
      const filtered = prev.filter(comp => comp.id !== id);
      // Réorganiser les ordres
      return filtered.map((comp, index) => ({ ...comp, order: index }));
    });
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
  }, [selectedComponent]);

  const moveComponent = useCallback((dragIndex, dropIndex) => {
    setComponents(prev => {
      const newComponents = [...prev];
      const draggedComponent = newComponents[dragIndex];
      newComponents.splice(dragIndex, 1);
      newComponents.splice(dropIndex, 0, draggedComponent);
      
      // Réordonner les indices
      return newComponents.map((comp, index) => ({ ...comp, order: index }));
    });
  }, []);

  const handlePublish = async () => {
    if (components.length === 0) {
      alert("Ajoutez au moins un composant à votre post");
      return;
    }

    setIsPublishing(true);
    try {
      const postData = {
        author: user.pseudo_user,
        content_structure: { components },
        style_config: styleConfig,
        text: "", // Fallback vide
        media: ""
      };

      // Logs de débogage
      console.log("=== DONNÉES DE PUBLICATION ===");
      console.log("Nombre de composants:", components.length);
      console.log("Composants:", components);
      console.log("Configuration de style:", styleConfig);
      console.log("Données complètes du post:", postData);
      console.log("JSON stringifié:", JSON.stringify(postData, null, 2));
      console.log("================================");

      const response = await createPost(postData);
      
      if (response.success) {
        // Redirection côté client vers la page d'accueil
        window.location.href = "/";
      } else {
        alert("Erreur lors de la publication du post");
      }
      
    } catch (error) {
      console.error("Erreur lors de la publication:", error);
      alert("Erreur lors de la publication du post");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 relative overflow-hidden">
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-400/30 dark:via-purple-400/30 dark:to-pink-400/30 rounded-3xl blur-2xl"></div>
          
          <div className="relative">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                Éditeur de Post Avancé
              </span>
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Créez du contenu riche et personnalisé
            </p>
          </div>
        </div>

        {/* Actions Header - Mobile First */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
              previewMode
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700/80 dark:hover:to-gray-600/80"
            }`}
          >
            {previewMode ? "✏️ Mode Édition" : "👁️ Prévisualiser"}
          </button>
          
          <button
            onClick={handlePublish}
            disabled={isPublishing || components.length === 0}
            className="w-full sm:w-auto group px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative">
              {isPublishing ? "Publication..." : "Publier"}
            </span>
            <span className="relative group-hover:translate-x-1 transition-transform duration-300">
              {isPublishing ? "⏳" : "🚀"}
            </span>
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 bg-transparent border-2 border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>❌</span>
              <span>Fermer</span>
            </button>
          )}
        </div>

        {/* Layout responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Barre d'outils - Mobile: pleine largeur, Desktop: colonne gauche */}
          <div className="lg:col-span-2 order-1 lg:order-1">
            <div className="lg:sticky lg:top-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-4 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm">
                <ComponentToolbar onAddComponent={addComponent} />
              </div>
            </div>
          </div>

          {/* Canvas principal - Mobile: ordre 2, Desktop: milieu */}
          <div className="lg:col-span-7 order-3 lg:order-2">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm overflow-hidden">
              <DndProvider backend={HTML5Backend}>
                <PostCanvas 
                  components={components}
                  onComponentsChange={setComponents}
                  onComponentSelect={setSelectedComponent}
                  selectedComponent={selectedComponent}
                  onMoveComponent={moveComponent}
                  onUpdateComponent={updateComponent}
                  onRemoveComponent={removeComponent}
                  styleConfig={styleConfig}
                  previewMode={previewMode}
                  user={user}
                />
              </DndProvider>
            </div>
          </div>

          {/* Propriétés - Mobile: ordre 2, Desktop: colonne droite */}
          <div className="lg:col-span-3 order-2 lg:order-3">
            <div className="lg:sticky lg:top-4 space-y-4">
              {selectedComponent && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-4 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm">
                  <ComponentProperties 
                    component={selectedComponent}
                    onUpdate={(data) => updateComponent(selectedComponent.id, data)}
                    onRemove={() => removeComponent(selectedComponent.id)}
                  />
                </div>
              )}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-4 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm">
                <UnifiedStyleEditor 
                  styleConfig={styleConfig}
                  onStyleChange={setStyleConfig}
                  components={components}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Élément décoratif du bas */}
        <div className="flex justify-center mt-12">
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
