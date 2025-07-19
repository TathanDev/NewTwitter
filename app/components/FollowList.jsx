"use client";

import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import Image from "next/image";
import Link from "next/link";

export default function FollowList({ userId, type, isVisible, onClose }) {
  const { currentUser: user } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (isVisible && userId && type) {
      fetchUsers(1);
    }
  }, [isVisible, userId, type]);

  const fetchUsers = async (page = 1) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `/api/follow/list?userId=${userId}&type=${type}&page=${page}&limit=20`
      );

      if (response.ok) {
        const result = await response.json();
        setUsers(result.data.users);
        setPagination(result.data.pagination);
        setCurrentPage(page);
      } else {
        console.error("Erreur lors du chargement de la liste");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  const title = type === "followers" ? "Abonnés" : "Abonnements";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Corps */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {type === "followers" 
                  ? "Aucun abonné pour le moment" 
                  : "Aucun abonnement pour le moment"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id_user}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {/* Avatar */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 flex-shrink-0">
                    {user.pfp_user ? (
                      <Image
                        src={user.pfp_user}
                        alt={`Avatar de ${user.pseudo_user}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.target.src = "https://ui-avatars.com/api/?name=" + 
                            encodeURIComponent(user.pseudo_user) + 
                            "&background=random&color=fff&size=48";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                        👤
                      </div>
                    )}
                  </div>

                  {/* Informations utilisateur */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/profile/${user.pseudo_user}`}
                      className="block hover:underline"
                      onClick={onClose}
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {user.pseudo_user}
                      </h3>
                    </Link>
                    {user.description_user && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {user.description_user}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {type === "followers" ? "Vous suit depuis" : "Suivi depuis"} le{" "}
                      {new Date(user.followed_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  {/* Bouton d'action */}
                  <Link
                    href={`/profile/${user.pseudo_user}`}
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    Voir le profil
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <button
              onClick={() => fetchUsers(currentPage - 1)}
              disabled={!pagination.hasPreviousPage || loading}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} sur {pagination.totalPages}
            </span>
            
            <button
              onClick={() => fetchUsers(currentPage + 1)}
              disabled={!pagination.hasNextPage || loading}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
