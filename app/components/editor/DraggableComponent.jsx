"use client";
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { Trash2 } from "lucide-react";

export default function DraggableComponent({
  component,
  index,
  moveComponent,
  previewMode,
  isSelected,
  onSelect,
  onUpdate,
  onRemove
}) {
  const [{ isDragging }, drag] = useDrag({
    type: "component",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: "component",
    hover({ index: draggedIndex }) {
      if (draggedIndex !== index) {
        moveComponent(draggedIndex, index);
      }
    }
  });

  const opacity = isDragging ? 0.5 : 1;

  const renderComponent = () => {
    switch (component.type) {
      case 'text':
        return (
          <div 
            style={component.data.formatting}
            className="text-component min-h-[2rem] p-2 border border-transparent hover:border-gray-300 dark:hover:border-gray-600 rounded transition-colors"
          >
            {component.data.content || 'Cliquez pour éditer le texte'}
          </div>
        );

      case 'image':
        return component.data.urls?.[0] ? (
          <img
            src={component.data.urls[0]}
            alt={component.data.alt || 'Image'}
            className="w-full h-auto rounded"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
            <span className="text-gray-500">Aucune image</span>
          </div>
        );

      case 'video':
        return component.data.url ? (
          <video
            src={component.data.url}
            controls
            className="w-full h-auto rounded"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
            <span className="text-gray-500">Aucune vidéo</span>
          </div>
        );

      case 'quote':
        return (
          <blockquote className="pl-4 border-l-4 border-gray-300 dark:border-gray-600 italic">
            <p className="text-gray-800 dark:text-gray-200">
              "{component.data.text}"
            </p>
            {component.data.author && (
              <footer className="text-sm text-gray-500 mt-2">
                — {component.data.author}
              </footer>
            )}
          </blockquote>
        );

      case 'link':
        return (
          <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-3 bg-blue-50 dark:bg-blue-900/20">
            <a 
              href={component.data.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium block"
            >
              {component.data.title || component.data.url || 'Nouveau lien'}
            </a>
            {component.data.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {component.data.description}
              </p>
            )}
            {component.data.url && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
                {component.data.url}
              </p>
            )}
          </div>
        );

      case 'spacer':
        return (
          <div 
            style={{ height: component.data.height || '20px' }}
            className="w-full bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center"
          >
            <span className="text-xs text-gray-400">Espace ({component.data.height || '20px'})</span>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded text-center">
            <span className="text-gray-500">Composant inconnu: {component.type}</span>
          </div>
        );
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ opacity }}
      className={`group relative bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 transition-all ${
        previewMode ? 'pointer-events-none' : 'cursor-move hover:shadow-lg'
      } ${
        isSelected 
          ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
          : 'border-gray-200 dark:border-gray-700'
      } p-4 mb-2`}
      onClick={onSelect}
    >
      {/* Indicateur de sélection */}
      {isSelected && !previewMode && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          ✓
        </div>
      )}

      {/* Contenu du composant */}
      {renderComponent()}

      {/* Actions */}
      {!previewMode && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            title="Supprimer le composant"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

