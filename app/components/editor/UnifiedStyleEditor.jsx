"use client";
import React from "react";
import { Palette, Eye } from "lucide-react";

export default function UnifiedStyleEditor({ styleConfig, onStyleChange }) {
  const backgroundPresets = [
    { name: 'Blanc', value: '#ffffff' },
    { name: 'Bleu clair', value: '#e3f2fd' },
    { name: 'Vert clair', value: '#e8f5e8' },
    { name: 'Orange clair', value: '#fff3e0' },
    { name: 'Rose clair', value: '#fce4ec' },
    { name: 'Gris clair', value: '#f5f5f5' },
  ];

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

  const updateBorderWidth = (width) => {
    onStyleChange({
      ...styleConfig,
      border: { ...styleConfig.border, width }
    });
  };

  const updateBorderStyle = (style) => {
    onStyleChange({
      ...styleConfig,
      border: { ...styleConfig.border, style }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center mb-4">
        <Palette className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Style du post
        </h3>
      </div>

      <div className="space-y-6">
        {/* Thèmes prédéfinis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Thèmes prédéfinis
          </label>
          <div className="grid grid-cols-3 gap-2">
            {backgroundPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => updateBackground(preset.value)}
                className={`p-2 rounded-lg border text-xs transition-all ${
                  styleConfig.background?.value === preset.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
                style={{ backgroundColor: preset.value }}
              >
                <div className="text-gray-800 font-medium">{preset.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Couleur d'arrière-plan personnalisée */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Couleur personnalisée
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={styleConfig.background?.value || '#ffffff'}
              onChange={(e) => updateBackground(e.target.value)}
              className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={styleConfig.background?.value || '#ffffff'}
              onChange={(e) => updateBackground(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              placeholder="#ffffff"
            />
          </div>
        </div>

        {/* Bordures arrondies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bordures arrondies
          </label>
          <div className="flex flex-wrap gap-2">
            {["0px", "8px", "12px", "16px", "20px", "24px"].map((radius) => (
              <button
                key={radius}
                onClick={() => updateBorderRadius(radius)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  styleConfig.border?.radius === radius
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {radius === "0px" ? "Aucun" : radius}
              </button>
            ))}
          </div>
        </div>

        {/* Style de bordure */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Style de bordure
          </label>
          <select
            value={styleConfig.border?.style || 'solid'}
            onChange={(e) => updateBorderStyle(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="none">Aucune</option>
            <option value="solid">Solide</option>
            <option value="dashed">Pointillés</option>
            <option value="dotted">Points</option>
          </select>
        </div>

        {/* Épaisseur de bordure */}
        {styleConfig.border?.style !== 'none' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Épaisseur de bordure
            </label>
            <select
              value={styleConfig.border?.width || '1px'}
              onChange={(e) => updateBorderWidth(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="1px">1px</option>
              <option value="2px">2px</option>
              <option value="3px">3px</option>
              <option value="4px">4px</option>
              <option value="5px">5px</option>
            </select>
          </div>
        )}

        {/* Couleur de bordure */}
        {styleConfig.border?.style !== 'none' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Couleur de bordure
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={styleConfig.border?.color || '#e0e0e0'}
                onChange={(e) => updateBorderColor(e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={styleConfig.border?.color || '#e0e0e0'}
                onChange={(e) => updateBorderColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                placeholder="#e0e0e0"
              />
            </div>
          </div>
        )}

        {/* Aperçu */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center mb-3">
            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Aperçu du style</p>
          </div>
          <div className="space-y-3">
            <div 
              className="w-full h-20 flex items-center justify-center text-sm text-gray-600"
              style={{
                backgroundColor: styleConfig.background?.value || '#ffffff',
                borderRadius: styleConfig.border?.radius || '12px',
                borderWidth: styleConfig.border?.style === 'none' ? '0px' : (styleConfig.border?.width || '1px'),
                borderColor: styleConfig.border?.color || '#e0e0e0',
                borderStyle: styleConfig.border?.style === 'none' ? 'none' : (styleConfig.border?.style || 'solid')
              }}
            >
              Aperçu du post
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <div>Arrière-plan: {styleConfig.background?.value || '#ffffff'}</div>
              <div>Bordure: {styleConfig.border?.style === 'none' ? 'Aucune' : `${styleConfig.border?.width || '1px'} ${styleConfig.border?.style || 'solid'} ${styleConfig.border?.color || '#e0e0e0'}`}</div>
              <div>Arrondi: {styleConfig.border?.radius || '12px'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
