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
    case 'image':
      return {
        urls: [],
        alt: "",
        layout: "single",
        aspectRatio: "16:9"
      };
    case 'video':
      return {
        url: "",
        thumbnail: "",
        autoplay: false
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Éditeur de Post Avancé
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                previewMode
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {previewMode ? "Mode Édition" : "Prévisualiser"}
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing || components.length === 0}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPublishing ? "Publication..." : "Publier"}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Fermer
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Barre d'outils */}
          <div className="col-span-12 lg:col-span-2">
            <div className="sticky top-4 space-y-4">
              <ComponentToolbar onAddComponent={addComponent} />
            </div>
          </div>

          {/* Canvas principal */}
          <div className="col-span-12 lg:col-span-7">
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

          {/* Propriétés */}
          <div className="col-span-12 lg:col-span-3">
            <div className="sticky top-4 space-y-4">
              {selectedComponent && (
                <ComponentProperties 
                  component={selectedComponent}
                  onUpdate={(data) => updateComponent(selectedComponent.id, data)}
                  onRemove={() => removeComponent(selectedComponent.id)}
                />
              )}
              <UnifiedStyleEditor 
                styleConfig={styleConfig}
                onStyleChange={setStyleConfig}
                components={components}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
