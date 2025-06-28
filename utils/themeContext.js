// contexts/ThemeContext.js
"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Initialiser avec le thème actuel si possible
  const [theme, setTheme] = useState(() => {
    // Côté client, vérifier immédiatement le thème
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme");
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      const currentTheme = savedTheme || systemTheme;
      
      // Vérifier si le thème est déjà appliqué dans le DOM
      const isDarkApplied = document.documentElement.classList.contains('dark');
      const shouldBeDark = currentTheme === 'dark';
      
      // Seulement ajuster si nécessaire
      if (isDarkApplied !== shouldBeDark) {
        if (shouldBeDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      
      return currentTheme;
    }
    return "light"; // Fallback pour le SSR
  });

  useEffect(() => {
    // Ce useEffect ne s'exécute que si le thème change vraiment
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    const correctTheme = savedTheme || systemTheme;
    
    // Seulement mettre à jour si différent
    if (correctTheme !== theme) {
      setTheme(correctTheme);
    }
  }, []);

  useEffect(() => {
    // Vérifier si le changement est réellement nécessaire
    const isDarkApplied = document.documentElement.classList.contains('dark');
    const shouldBeDark = theme === "dark";
    
    if (isDarkApplied !== shouldBeDark) {
      if (shouldBeDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
