"use client";
import React from "react";
import { Palette, Eye } from "lucide-react";

export default function UnifiedStyleEditor({ styleConfig, onStyleChange }) {
  const backgroundPresets = [
    { name: 'Blanc pur', value: '#ffffff' },
    { name: 'Gris perle', value: '#f8fafc' },
    { name: 'Bleu lavande', value: '#e0e7ff' },
    { name: 'Vert menthe', value: '#dcfce7' },
    { name: 'Rose poudré', value: '#fdf2f8' },
    { name: 'Pêche douce', value: '#fed7aa' },
    { name: 'Violet parme', value: '#f3e8ff' },
    { name: 'Jaune crème', value: '#fefce8' },
    { name: 'Corail tendre', value: '#fecaca' },
    { name: 'Bleu ciel', value: '#bfdbfe' },
    { name: 'Vert sauge', value: '#bbf7d0' },
    { name: 'Gris ardoise', value: '#e2e8f0' },
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
    <div>
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-xl flex items-center justify-center mr-3">
          <Palette className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400">
          Style du Post
        </h3>
      </div>

      <div className="space-y-6">
        {/* Couleur d'arrière-plan */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Couleur d'arrière-plan
          </label>
          
          {/* Presets de couleurs */}
          <div className="grid grid-cols-6 gap-2 mb-4">
            {backgroundPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => updateBackground(preset.value)}
                className={`w-full h-12 rounded-lg border-2 transition-all ${
                  styleConfig.background?.value === preset.value
                    ? "border-blue-500 scale-110"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                }`}
                style={{ backgroundColor: preset.value }}
                title={preset.name}
              />
            ))}
          </div>
          
          {/* Couleur personnalisée */}
          <div className="flex items-center space-x-3">
            <div className="color-input w-16 h-10">
              <input
                type="color"
                value={styleConfig.background?.value || '#ffffff'}
                onChange={(e) => updateBackground(e.target.value)}
                title="Sélectionner une couleur personnalisée"
              />
            </div>
            <input
              type="text"
              value={styleConfig.background?.value || '#ffffff'}
              onChange={(e) => updateBackground(e.target.value)}
              className="w-24 px-2 py-2 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="#ffffff"
            />
          </div>
        </div>

        {/* Style de bordure */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Style de bordure
          </label>
          <select
            value={styleConfig.border?.style || 'solid'}
            onChange={(e) => updateBorderStyle(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="none">Pas de bordure</option>
            <option value="solid">Bordure solide</option>
            <option value="dashed">Bordure en tirets</option>
            <option value="dotted">Bordure en points</option>
          </select>
        </div>

        {/* Options de bordure (conditionnelles) */}
        {styleConfig.border?.style !== 'none' && (
          <>
            {/* Couleur de bordure */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Couleur de bordure
              </label>
              <div className="flex items-center space-x-3">
                <div className="color-input w-16 h-10">
                  <input
                    type="color"
                    value={styleConfig.border?.color || '#e0e0e0'}
                    onChange={(e) => updateBorderColor(e.target.value)}
                    title="Sélectionner une couleur de bordure"
                  />
                </div>
                <input
                  type="text"
                  value={styleConfig.border?.color || '#e0e0e0'}
                  onChange={(e) => updateBorderColor(e.target.value)}
                  className="w-24 px-2 py-2 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="#e0e0e0"
                />
              </div>
            </div>

            {/* Épaisseur de bordure */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Épaisseur: <span className="font-normal">{styleConfig.border?.width || '1px'}</span>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={parseInt(styleConfig.border?.width || '1')}
                onChange={(e) => updateBorderWidth(`${e.target.value}px`)}
                className="w-full h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 dark:from-blue-500 dark:via-purple-600 dark:to-pink-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>1px</span>
                <span>2px</span>
                <span>3px</span>
                <span>4px</span>
                <span>5px</span>
              </div>
            </div>
          </>
        )}

        {/* Arrondi des coins */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Arrondi des coins: <span className="font-normal">{styleConfig.border?.radius === '0px' ? 'Aucun' : styleConfig.border?.radius || '12px'}</span>
          </label>
          <input
            type="range"
            min="0"
            max="24"
            step="4"
            value={parseInt(styleConfig.border?.radius || '12')}
            onChange={(e) => updateBorderRadius(`${e.target.value}px`)}
            className="w-full h-2 bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 dark:from-orange-500 dark:via-red-600 dark:to-pink-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0px</span>
            <span>4px</span>
            <span>8px</span>
            <span>12px</span>
            <span>16px</span>
            <span>20px</span>
            <span>24px</span>
          </div>
        </div>
      </div>
    </div>
  );
}
