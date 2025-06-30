"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * Composant pour les liens de hashtags qui redirigent vers la recherche
 */
function HashtagLink({ hashtag }) {
  const router = useRouter();
  
  const handleHashtagClick = (e) => {
    e.stopPropagation();
    router.push(`/search?q=${encodeURIComponent(hashtag)}&type=hashtags`);
  };
  
  return (
    <span
      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline cursor-pointer"
      onClick={handleHashtagClick}
    >
      #{hashtag}
    </span>
  );
}

/**
 * Parse un texte pour détecter les mentions (@username) et hashtags (#hashtag)
 * et les transformer en éléments React cliquables
 * @param {string} text - Le texte à parser
 * @returns {React.ReactElement[]} - Array d'éléments React
 */
export function parseText(text) {
  if (!text) return [];

  // Créer un regex combiné pour split le texte
  const combinedRegex = /(@\w+|#\w+)/g;
  
  // Split le texte en gardant les délimiteurs
  const parts = text.split(combinedRegex);
  
  return parts.map((part, index) => {
    // Vérifier si c'est une mention
    const mentionMatch = part.match(/^@(\w+)$/);
    if (mentionMatch) {
      const username = mentionMatch[1];
      return (
        <Link
          key={index}
          href={`/profile/${username}`}
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          @{username}
        </Link>
      );
    }
    
    // Vérifier si c'est un hashtag
    const hashtagMatch = part.match(/^#(\w+)$/);
    if (hashtagMatch) {
      const hashtag = hashtagMatch[1];
      return (
        <HashtagLink
          key={index}
          hashtag={hashtag}
        />
      );
    }
    
    // Texte normal
    return part;
  });
}

/**
 * Version simplifiée qui retourne directement un élément React
 * Utilisée pour l'affichage dans les composants
 */
export function ParsedText({ text, className = "" }) {
  const parsedElements = parseText(text);
  
  return (
    <span className={className}>
      {parsedElements}
    </span>
  );
}
