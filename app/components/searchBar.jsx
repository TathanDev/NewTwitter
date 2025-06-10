"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearch } from "../hooks/useSearch";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { results, loading, suggestions, search, getSuggestions } = useSearch();
  const router = useRouter();
  const searchRef = useRef(null);

  const filterOptions = [
    { value: "all", label: "Tout", icon: "🔍" },
    { value: "users", label: "Utilisateurs", icon: "👥" },
    { value: "posts", label: "Posts", icon: "📝" },
    { value: "hashtags", label: "Hashtags", icon: "#️⃣" },
  ];

  // Gestion de l'autocomplétion
  useEffect(() => {
    if (searchQuery.length > 0) {
      getSuggestions(searchQuery, selectedFilter);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, selectedFilter, getSuggestions]);

  // Fermer les suggestions en cliquant ailleurs
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      await search(searchQuery, selectedFilter);
      // Rediriger vers la page de résultats
      router.push(
        `/search?q=${encodeURIComponent(searchQuery)}&type=${selectedFilter}`
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.value);
    setShowSuggestions(false);
    if (suggestion.type === "user") {
      router.push(`/profile/${suggestion.id}`);
    } else {
      search(
        suggestion.value,
        suggestion.type === "hashtag" ? "hashtags" : selectedFilter
      );
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-600/30 shadow-lg rounded-xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Barre de recherche principale avec autocomplétion */}
          <div className="flex-1 relative" ref={searchRef}>
            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className=" bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-600/50 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${suggestion.id || index}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                  >
                    {suggestion.type === "user" && (
                      <img
                        src={suggestion.avatar}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    {suggestion.type === "hashtag" && (
                      <span className="text-blue-500">#</span>
                    )}
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {suggestion.label}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                      {suggestion.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
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
                onFocus={() => searchQuery && setShowSuggestions(true)}
                placeholder="Rechercher sur NewT..."
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300/50 dark:border-gray-600/50 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>

          {/* Menu déroulant des filtres - rest of your existing filter code */}
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
            disabled={loading}
            className="group px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">
              {loading ? "Recherche..." : "Rechercher"}
            </span>
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
          </button>
        </div>

        {/* Indicateur de recherche active */}
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
