"use client";
import React, { useCallback } from "react";
import { useDrop } from "react-dnd";
import DraggableComponent from "./DraggableComponent";

const getCanvasStyle = (styleConfig) => {
  const style = {
    minHeight: "400px",
    padding: "20px",
    borderRadius: styleConfig.border?.radius || "12px",
    border: styleConfig.border?.style !== "none" 
      ? `${styleConfig.border?.width || "1px"} ${styleConfig.border?.style || "solid"} ${styleConfig.border?.color || "#e0e0e0"}`
      : "none"
  };

  // Gestion de l'arrière-plan
  if (styleConfig.background?.type === "gradient" && styleConfig.background?.gradient) {
    const { from, to, direction } = styleConfig.background.gradient;
    style.background = `linear-gradient(${direction || "45deg"}, ${from}, ${to})`;
  } else {
    style.backgroundColor = styleConfig.background?.value || "#ffffff";
  }

  return style;
};

export default function PostCanvas({
  components,
  onComponentsChange,
  onComponentSelect,
  selectedComponent,
  onMoveComponent,
  onUpdateComponent,
  onRemoveComponent,
  styleConfig,
  previewMode,
  user
}) {
  const [{ isOver }, drop] = useDrop({
    accept: "component",
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        // Élément déposé sur le canvas
        console.log("Dropped on canvas:", item);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  const moveComponent = useCallback((dragIndex, dropIndex) => {
    const newComponents = [...components];
    const draggedComponent = newComponents[dragIndex];
    newComponents.splice(dragIndex, 1);
    newComponents.splice(dropIndex, 0, draggedComponent);

    // Réordonner les indices
    const reorderedComponents = newComponents.map((comp, index) => ({
      ...comp,
      order: index
    }));

    onComponentsChange(reorderedComponents);
  }, [components, onComponentsChange]);

  const sortedComponents = components.sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      {/* Header du post */}
      <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
          {user?.pseudo_user?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {user?.pseudo_user || "Utilisateur"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{user?.pseudo_user || "utilisateur"} • À l'instant
          </p>
        </div>
      </div>

      {/* Canvas de contenu */}
      <div
        ref={drop}
        className={`relative transition-all duration-200 ${
          isOver ? "bg-blue-50 dark:bg-blue-900/20" : ""
        } ${previewMode ? "preview-mode" : "edit-mode"}`}
        style={getCanvasStyle(styleConfig)}
      >
        {sortedComponents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Votre post est vide
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              Ajoutez des composants depuis la barre d'outils pour commencer à créer votre post personnalisé
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedComponents.map((component, index) => (
              <DraggableComponent
                key={component.id}
                component={component}
                index={index}
                moveComponent={moveComponent}
                previewMode={previewMode}
                isSelected={selectedComponent?.id === component.id}
                onSelect={() => onComponentSelect(component)}
                onUpdate={(data) => onUpdateComponent(component.id, data)}
                onRemove={() => onRemoveComponent(component.id)}
              />
            ))}
          </div>
        )}

        {/* Indicateur de drop */}
        {isOver && (
          <div className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50/20 rounded-lg flex items-center justify-center pointer-events-none">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium">
              Déposez le composant ici
            </div>
          </div>
        )}
      </div>

      {/* Boutons d'action du post */}
      <div className="flex items-center justify-around pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.682l-1.318-1.364a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="font-medium">0</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-medium">0</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
