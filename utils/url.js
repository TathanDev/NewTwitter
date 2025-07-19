/**
 * Génère l'URL de base pour les appels API
 */
export function getBaseUrl() {
  // En mode client, utiliser l'origin de la fenêtre
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // En mode serveur, construire l'URL avec les variables d'environnement
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = process.env.VERCEL_URL || process.env.HOST || 'localhost:3000';
  return `${protocol}://${host}`;
}

/**
 * Crée une URL API complète
 */
export function createApiUrl(path) {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
