"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children, initialUser = null }) {
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);

  useEffect(() => {
    // Si on n'a pas d'utilisateur initial, on essaie de le récupérer
    if (!initialUser) {
      fetchCurrentUser();
    }
  }, [initialUser]);


  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData) => {
    setCurrentUser(userData);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      isLoading, 
      updateUser, 
      logout, 
      refetch: fetchCurrentUser 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Export UserContext for backwards compatibility
export { UserContext };
