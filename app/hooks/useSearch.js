import { useState, useCallback } from "react";

// Fonction debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function useSearch() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // Fonction de recherche principale
  const search = async (query, type = "all", page = 1) => {
    if (!query || query.trim().length < 2) {
      setResults({});
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: query.trim(),
        type,
        page: page.toString(),
        limit: "20",
      });

      const response = await fetch(
        `http://localhost:3000/api/search?${params}`
      );
      const data = await response.json();

      if (data && typeof data === "object" && "success" in data) {
        if (data.success) {
          setResults(data);
        } else {
          setError(data.error || "Erreur inconnue");
        }
      } else {
        setError("Réponse inattendue du serveur");
      }
    } catch (err) {
      setError("Erreur lors de la recherche");
      console.error("Erreur recherche:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'autocomplétion avec debounce
  const getSuggestions = useCallback(
    debounce(async (query, type = "all") => {
      if (!query || query.trim().length < 1) {
        setSuggestions([]);
        return;
      }

      try {
        const params = new URLSearchParams({
          q: query.trim(),
          type,
        });

        const response = await fetch(`/api/search/autocomplete?${params}`);
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } catch (err) {
        console.error("Erreur autocomplétion:", err);
        setSuggestions([]);
      }
    }, 300),
    []
  );

  return {
    results,
    loading,
    error,
    suggestions,
    search,
    getSuggestions,
    clearResults: () => setResults({}),
    clearSuggestions: () => setSuggestions([]),
  };
}
