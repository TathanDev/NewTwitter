"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearch } from "../hooks/useSearch";

// Fonction utilitaire pour extraire la position du curseur et le texte de mention/hashtag
const extractMentionInfo = (text, cursorPosition) => {
  // Rechercher en arrière depuis la position du curseur pour trouver @ ou #
  let startIndex = cursorPosition - 1;
  let mentionChar = null;

  // Rechercher le caractère @ ou # le plus proche avant le curseur
  while (startIndex >= 0) {
    const char = text[startIndex];
    if (char === "@" || char === "#") {
      mentionChar = char;
      break;
    }
    // Si on rencontre un espace, une nouvelle ligne ou un autre caractère spécial, on arrête
    if (char === " " || char === "\n" || char === "\t") {
      return null;
    }
    startIndex--;
  }

  if (!mentionChar || startIndex < 0) {
    return null;
  }

  // Extraire le texte après @ ou #
  const mentionText = text.substring(startIndex + 1, cursorPosition);

  // Vérifier que le texte ne contient que des caractères valides (lettres, chiffres, _)
  if (!/^[\w]*$/.test(mentionText)) {
    return null;
  }

  return {
    type: mentionChar === "@" ? "user" : "hashtag",
    text: mentionText,
    startIndex,
    endIndex: cursorPosition,
    fullMatch: mentionChar + mentionText,
  };
};

export default function MentionAutocomplete({
  value,
  onChange,
  onKeyDown,
  placeholder,
  className,
  maxLength,
  rows = 3,
  disabled = false,
}) {
  const textareaRef = useRef(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompletePosition, setAutocompletePosition] = useState({
    x: 0,
    y: 0,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentMention, setCurrentMention] = useState(null);
  const { getSuggestions, suggestions, clearSuggestions } = useSearch();

  // Fonction pour obtenir la position du curseur en pixels
  const getCursorPosition = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return { x: 0, y: 0 };

    const selection = textarea.selectionStart;
    const text = textarea.value;

    // Créer un élément temporaire pour mesurer la position
    const div = document.createElement("div");
    const style = window.getComputedStyle(textarea);

    // Copier tous les styles pertinents
    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "pre-wrap";
    div.style.wordWrap = "break-word";
    div.style.fontSize = style.fontSize;
    div.style.fontFamily = style.fontFamily;
    div.style.fontWeight = style.fontWeight;
    div.style.lineHeight = style.lineHeight;
    div.style.padding = style.padding;
    div.style.border = style.border;
    div.style.width = style.width;

    document.body.appendChild(div);

    // Ajouter le texte jusqu'à la position du curseur
    div.textContent = text.substring(0, selection);

    // Ajouter un caractère pour marquer la position du curseur
    const span = document.createElement("span");
    span.textContent = "|";
    div.appendChild(span);

    const rect = textarea.getBoundingClientRect();
    const spanRect = span.getBoundingClientRect();

    const x = spanRect.left - rect.left;
    const y = spanRect.top - rect.top + parseInt(style.lineHeight);

    document.body.removeChild(div);

    return { x, y };
  }, []);

  // Gérer les changements de texte
  const handleTextChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      const cursorPosition = e.target.selectionStart;
      onChange(newValue);

      // Extraire les informations de mention
      const mentionInfo = extractMentionInfo(newValue, cursorPosition);

      if (mentionInfo) {
        // Détecter dès qu'on a @ ou # même sans texte après
        setCurrentMention(mentionInfo);
        setSelectedIndex(0);

        // Obtenir les suggestions
        const searchType = mentionInfo.type === "user" ? "users" : "hashtags";
        getSuggestions(mentionInfo.text, searchType);

        // Calculer la position de l'auto-complétion
        setTimeout(() => {
          const position = getCursorPosition();
          setAutocompletePosition(position);
        }, 0);
      } else {
        setShowAutocomplete(false);
        setCurrentMention(null);
        clearSuggestions();
      }
    },
    [onChange, getSuggestions, clearSuggestions, getCursorPosition]
  );

  // Gérer les touches du clavier
  const handleKeyDown = useCallback(
    (e) => {
      if (showAutocomplete && suggestions.length > 0) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % suggestions.length);
            break;
          case "ArrowUp":
            e.preventDefault();
            setSelectedIndex(
              (prev) => (prev - 1 + suggestions.length) % suggestions.length
            );
            break;
          case "Enter":
          case "Tab":
            e.preventDefault();
            handleSuggestionSelect(suggestions[selectedIndex]);
            break;
          case "Escape":
            setShowAutocomplete(false);
            setCurrentMention(null);
            clearSuggestions();
            break;
        }
      }

      if (onKeyDown) {
        onKeyDown(e);
      }
    },
    [showAutocomplete, suggestions, selectedIndex, onKeyDown, clearSuggestions]
  );

  // Sélectionner une suggestion
  const handleSuggestionSelect = useCallback(
    (suggestion) => {
      if (!currentMention || !suggestion) return;

      const textarea = textareaRef.current;
      if (!textarea) return;

      const beforeMention = value.substring(0, currentMention.startIndex);
      const afterMention = value.substring(currentMention.endIndex);

      // Construire le nouveau texte avec la suggestion sélectionnée
      const suggestionText =
        currentMention.type === "user"
          ? `@${
              suggestion.pseudo_user || suggestion.username || suggestion.text
            }`
          : `#${suggestion.text || suggestion.hashtag}`;

      const newValue = beforeMention + suggestionText + " " + afterMention;
      const newCursorPosition =
        beforeMention.length + suggestionText.length + 1;

      onChange(newValue);

      // Masquer l'auto-complétion
      setShowAutocomplete(false);
      setCurrentMention(null);
      clearSuggestions();

      // Repositionner le curseur
      setTimeout(() => {
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        textarea.focus();
      }, 0);
    },
    [currentMention, value, onChange, clearSuggestions]
  );

  // Afficher les suggestions quand elles arrivent - FORCER L'AFFICHAGE
  useEffect(() => {
    if (currentMention && suggestions.length > 0) {
      setShowAutocomplete(true);
    } else if (currentMention && suggestions.length === 0) {
      // Ne pas masquer immédiatement, laisser le temps aux suggestions d'arriver
    } else if (!currentMention) {
      setShowAutocomplete(false);
    }
  }, [suggestions, currentMention]);

  // Fermer l'auto-complétion si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (textareaRef.current && !textareaRef.current.contains(event.target)) {
        setShowAutocomplete(false);
        setCurrentMention(null);
        clearSuggestions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clearSuggestions]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        maxLength={maxLength}
        rows={rows}
        disabled={disabled}
      />

      {suggestions.length > 0 && (
        <div
          className="hide-scrollbar absolute z-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto min-w-48"
          style={{
            left: "0px",
            top: "100%",
            marginTop: "4px",
          }}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id || suggestion.text || index}
              className={`px-3 py-2 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                index === selectedIndex
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <div className="flex items-center space-x-2">
                {currentMention?.type === "user" ? (
                  <>
                    <img
                      src={
                        suggestion.pfp_user ||
                        "https://ui-avatars.com/api/?name=User&background=random&color=fff&size=32"
                      }
                      alt="Avatar"
                      className="w-6 h-6 rounded-full"
                      onError={(e) => {
                        e.target.src =
                          "https://ui-avatars.com/api/?name=User&background=random&color=fff&size=32";
                      }}
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {suggestion.pseudo_user ||
                          suggestion.username ||
                          suggestion.text}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        @
                        {suggestion.pseudo_user ||
                          suggestion.username ||
                          suggestion.text}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 bg-blue-500 dark:bg-blue-400 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">#</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        #{suggestion.text || suggestion.hashtag}
                      </div>
                      {suggestion.count && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {suggestion.count} posts
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
