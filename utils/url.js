/**
 * Génère l'URL de base pour les appels API
 */
export function getBaseUrl() {
  // En mode client, utiliser l'origin de la fenêtre
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // En mode serveur, essayer différentes sources d'URL
  // VERCEL_URL est défini automatiquement sur Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Pour les déploiements autres ou développement local
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Fallback pour développement local
  return process.env.NODE_ENV === 'production'
    ? 'http://localhost:3000'
    : 'http://localhost:3000';
}

/**
 * Crée une URL API complète
 */
export function createApiUrl(path) {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
