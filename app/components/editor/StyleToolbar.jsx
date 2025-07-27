"use client";
import React from "react";
import { Palette, Brush } from "lucide-react";

const PRESET_THEMES = [
  {
    name: "Classique",
    config: {
      background: { type: "solid", value: "#ffffff" },
      border: { style: "solid", width: "1px", color: "#e0e0e0", radius: "12px" }
    }
  },
  {
    name: "Moderne",
    config: {
      background: { type: "solid", value: "#f8fafc" },
      border: { style: "none", width: "0px", color: "#transparent", radius: "16px" }
    }
  },
  {
    name: "Coloré",
    config: {
      background: { 
        type: "gradient", 
        gradient: { from: "#ff6b6b", to: "#4ecdc4", direction: "45deg" } 
      },
      border: { style: "solid", width: "2px", color: "#ffffff", radius: "20px" }
    }
  },
  {
    name: "Sombre",
    config: {
      background: { type: "solid", value: "#1f2937" },
      border: { style: "solid", width: "1px", color: "#374151", radius: "12px" }
    }
  }
];

const BACKGROUND_COLORS = [
  "#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0",
  "#fef2f2", "#fef3c7", "#ecfdf5", "#eff6ff",
  "#1f2937", "#374151", "#4b5563", "#6b7280"
];

export default function StyleToolbar({ styleConfig, onStyleChange }) {
  const applyPreset = (preset) => {
    onStyleChange({ ...styleConfig, ...preset.config });
  };

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center mb-3">
        <Palette className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Style global
        </h3>
      </div>

      {/* Thèmes prédéfinis */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          Thèmes prédéfinis
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_THEMES.map((preset, index) => (
            <button
              key={index}
              onClick={() => applyPreset(preset)}
              className="p-2 text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Couleurs d'arrière-plan */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          Arrière-plan
        </h4>
        <div className="grid grid-cols-6 gap-1">
          {BACKGROUND_COLORS.map((color, index) => (
            <button
              key={index}
              onClick={() => updateBackground(color)}
              className={`w-6 h-6 rounded border-2 transition-all ${
                styleConfig.background?.value === color
                  ? "border-blue-500 scale-110"
                  : "border-gray-300 dark:border-gray-600 hover:scale-105"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Bordures arrondies */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          Bordures arrondies
        </h4>
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

      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <p className="text-xs text-green-600 dark:text-green-400">
          🎨 <strong>Style:</strong> Ces paramètres s'appliquent à tout le post
        </p>
      </div>
    </div>
  );
}
