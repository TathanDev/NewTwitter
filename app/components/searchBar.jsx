"use client";
import React, { useState } from "react";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterOptions = [
    { value: "all", label: "Tout", icon: "🔍" },
    { value: "users", label: "Utilisateurs", icon: "👥" },
    { value: "posts", label: "Posts", icon: "📝" },
    { value: "hashtags", label: "Hashtags", icon: "#️⃣" },
  ];

  const handleSearch = () => {
    console.log("Recherche:", searchQuery, "Filtre:", selectedFilter);
    // Ici vous pouvez ajouter votre logique de recherche
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-600/30 shadow-lg rounded-xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Barre de recherche principale */}
          <div className="flex-1 relative">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Rechercher sur NewT..."
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300/50 dark:border-gray-600/50 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Menu déroulant des filtres */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 border border-gray-300/50 dark:border-gray-600/50 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 shadow-sm hover:shadow-md min-w-[120px] justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs">
                  {
                    filterOptions.find((opt) => opt.value === selectedFilter)
                      ?.icon
                  }
                </span>
                <span className="hidden sm:inline">
                  {
                    filterOptions.find((opt) => opt.value === selectedFilter)
                      ?.label
                  }
                </span>
                <svg
                  className="w-3 h-3 sm:hidden"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m19 9-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown menu */}
            {isFilterOpen && (
              <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-600/50 rounded-xl shadow-xl z-50 min-w-[160px] overflow-hidden">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedFilter(option.value);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 ${
                      selectedFilter === option.value
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <span className="text-base">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                    {selectedFilter === option.value && (
                      <span className="ml-auto w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bouton de validation */}
          <button
            onClick={handleSearch}
            className="group px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center gap-2 text-sm font-medium"
          >
            <span className="hidden sm:inline">Rechercher</span>
            <svg
              className="w-4 h-4 sm:hidden"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="group-hover:translate-x-0.5 transition-transform duration-300 hidden sm:inline">
              →
            </span>
          </button>
        </div>

        {/* Indicateur de recherche active (optionnel) */}
        {searchQuery && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
              <span>Recherche active:</span>
              <span className="font-semibold">"{searchQuery}"</span>
              <span className="text-blue-500 dark:text-blue-400">
                {
                  filterOptions.find((opt) => opt.value === selectedFilter)
                    ?.icon
                }
              </span>
              <button
                onClick={() => setSearchQuery("")}
                className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5 transition-colors duration-200"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
