"use client";

import { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';

export default function SessionWatcher() {
  const { currentUser, refetch } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Vérifier périodiquement le statut de session
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const wasLoggedIn = currentUser !== null;
        const isNowLoggedIn = response.ok;

        // Si l'état de connexion a changé, recharger les données
        if (wasLoggedIn !== isNowLoggedIn) {
          await refetch();
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de session:', error);
      }
    };

    // Vérifier immédiatement
    checkSession();

    // Puis vérifier toutes les 30 secondes
    const interval = setInterval(checkSession, 30000);

    // Vérifier aussi quand la fenêtre reprend le focus
    const handleFocus = () => {
      checkSession();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [currentUser, refetch]);

  // Ce composant ne rend rien, il s'exécute juste en arrière-plan
  return null;
}
