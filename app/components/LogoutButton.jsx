"use client";

import { logout as logoutAction } from "../actions/auth";
import { useUser } from "../context/UserContext";

export default function LogoutButton({ className, children }) {
  const { logout: logoutContext } = useUser();

  const handleLogout = async () => {
    try {
      // D'abord nettoyer le contexte côté client
      logoutContext();
      
      // Puis exécuter l'action serveur pour nettoyer la session
      await logoutAction();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // En cas d'erreur, on force quand même la redirection
      window.location.href = "/";
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={className}
    >
      {children}
    </button>
  );
}
