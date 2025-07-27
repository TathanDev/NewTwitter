"use client";
import React from "react";
import { Palette, Eye } from "lucide-react";

export default function StyleProperties({ styleConfig, onStyleChange }) {
  const updateBackground = (value) => {
    onStyleChange({
      ...styleConfig,
      background: { ...styleConfig.background, value }
    });
  };

  const updateBorderRadius = (radius) => {
    onStyleChange({
      ...styleConfig,
      border: { ...styleConfig.border, radius }
    });
  };

  const updateBorderColor = (color) => {
    onStyleChange({
      ...styleConfig,
      border: { ...styleConfig.border, color }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center mb-4">
        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Style du post
        </h3>
      </div>

      <div className="space-y-4">
        {/* Arrière-plan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Couleur d'arrière-plan
          </label>
          <input
            type="color"
            value={styleConfig.background?.value || '#ffffff'}
            onChange={(e) => updateBackground(e.target.value)}
            className="w-full h-10 rounded border border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Bordures arrondies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bordures arrondies
          </label>
          <div className="flex space-x-1">
            {["8px", "12px", "16px", "20px", "24px"].map((radius) => (
              <button
                key={radius}
                onClick={() => updateBorderRadius(radius)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  styleConfig.border?.radius === radius
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {radius}
              </button>
            ))}
          </div>
        </div>

        {/* Couleur de bordure */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Couleur de bordure
          </label>
          <input
            type="color"
            value={styleConfig.border?.color || '#e0e0e0'}
            onChange={(e) => updateBorderColor(e.target.value)}
            className="w-full h-10 rounded border border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Épaisseur de bordure */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Épaisseur de bordure
          </label>
          <select
            value={styleConfig.border?.width || '1px'}
            onChange={(e) => onStyleChange({
              ...styleConfig,
              border: { ...styleConfig.border, width: e.target.value }
            })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="0px">Aucune</option>
            <option value="1px">1px</option>
            <option value="2px">2px</option>
            <option value="3px">3px</option>
            <option value="4px">4px</option>
          </select>
        </div>

        {/* Aperçu */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Aperçu:</p>
          <div 
            className="w-full h-16 border"
            style={{
              backgroundColor: styleConfig.background?.value || '#ffffff',
              borderRadius: styleConfig.border?.radius || '12px',
              borderWidth: styleConfig.border?.width || '1px',
              borderColor: styleConfig.border?.color || '#e0e0e0',
              borderStyle: 'solid'
            }}
          />
        </div>
      </div>
    </div>
  );
}
