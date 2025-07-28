// ==========================================
// PAGE DE RÉSULTATS - app/search/page.jsx
// ==========================================

"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSearch } from "../hooks/useSearch";
import ModernPost from "../components/ModernPost";
import Link from "next/link";
import Image from "next/image";

// Composant qui utilise useSearchParams
function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q");
  const type = searchParams.get("type") || "all";

  const { results, loading, error, search } = useSearch();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (query) {
      search(query, type, currentPage);
    }
  }, [query, type, currentPage]);

  const loadMore = () => {
    setCurrentPage((prev) => prev + 1);
    search(query, type, currentPage + 1);
  };

  if (!query) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex items-center justify-center px-4 pt-20 relative overflow-hidden">
        {/* Formes décoratives d'arrière-plan */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-500/30 dark:to-purple-500/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-purple-400/15 to-pink-400/15 dark:from-purple-500/25 dark:to-pink-500/25 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-r from-pink-400/25 to-blue-400/25 dark:from-pink-500/35 dark:to-blue-500/35 rounded-full blur-lg animate-pulse delay-500"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">🔍</span>
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
              Recherche
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Utilisez la barre de recherche pour trouver du contenu, des utilisateurs et des hashtags.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 px-4 pt-20 pb-8 relative overflow-hidden">
      {/* Formes décoratives d'arrière-plan */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Bulles flottantes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-500/30 dark:to-purple-500/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-purple-400/15 to-pink-400/15 dark:from-purple-500/25 dark:to-pink-500/25 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-r from-pink-400/25 to-blue-400/25 dark:from-pink-500/35 dark:to-blue-500/35 rounded-full blur-lg animate-pulse delay-500"></div>

        {/* Formes géométriques */}
        <div
          className="absolute top-1/3 right-10 w-16 h-16 border border-blue-300/30 dark:border-blue-400/50 rotate-45 animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
        <div className="absolute bottom-1/4 right-1/3 w-8 h-8 bg-gradient-to-r from-purple-500/40 to-pink-500/40 dark:from-purple-400/60 dark:to-pink-400/60 transform rotate-12"></div>
        
        {/* Lignes ondulées */}
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-20"
          viewBox="0 0 1000 1000"
        >
          <path
            d="M0,200 Q250,150 500,200 T1000,200"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0,800 Q250,750 500,800 T1000,800"
            stroke="url(#gradient2)"
            strokeWidth="2"
            fill="none"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              Résultats pour "{query}"
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Découvrez du contenu correspondant à votre recherche</p>
        </div>
        {/* Filtres de type */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <FilterButton
              active={type === "all"}
              onClick={() =>
                router.push(`/search?q=${encodeURIComponent(query)}&type=all`)
              }
            >
              Tout
            </FilterButton>
            <FilterButton
              active={type === "users"}
              onClick={() =>
                router.push(`/search?q=${encodeURIComponent(query)}&type=users`)
              }
            >
              Utilisateurs
            </FilterButton>
            <FilterButton
              active={type === "posts"}
              onClick={() =>
                router.push(`/search?q=${encodeURIComponent(query)}&type=posts`)
              }
            >
              Posts
            </FilterButton>
            <FilterButton
              active={type === "hashtags"}
              onClick={() =>
                router.push(
                  `/search?q=${encodeURIComponent(query)}&type=hashtags`
                )
              }
            >
              Hashtags
            </FilterButton>
          </div>
        </div>

        {/* Indicateur de chargement */}
        {loading && currentPage === 1 && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Gestion des erreurs */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Résultats */}
        {results && !loading && (
          <div className="space-y-6">
            {/* Résultats globaux */}
            {type === "all" && (
              <>
                {results.users && results.users.length > 0 && (
                  <ResultSection
                    query={query}
                    title="Utilisateurs"
                    items={results.users}
                    type="user"
                  />
                )}
                {results.posts && results.posts.length > 0 && (
                  <ResultSection
                    query={query}
                    title="Posts"
                    items={results.posts}
                    type="post"
                  />
                )}
              </>
            )}

            {/* Résultats spécifiques */}
            {type === "users" && results.users && (
              <ResultSection
                query={query}
                title="Utilisateurs"
                items={results.users}
                type="user"
                showAll={true}
              />
            )}

            {type === "posts" && results.posts && (
              <ResultSection
                query={query}
                title="Posts"
                items={results.posts}
                type="post"
                showAll={true}
              />
            )}

            {type === "hashtags" && results.posts && (
              <ResultSection
                query={query}
                title={`Posts avec ${results.hashtag || `#${query}`}`}
                items={results.posts}
                type="post"
                showAll={true}
              />
            )}

            {/* Bouton "Charger plus" */}
            {results.hasMore && (
              <div className="text-center py-6">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? "Chargement..." : "Charger plus"}
                </button>
              </div>
            )}

            {/* Aucun résultat */}
            {!results.posts?.length && !results.users?.length && !loading && (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 p-8 backdrop-blur-sm">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Essayez avec d'autres mots-clés ou vérifiez l'orthographe.
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-500">
                  <p className="font-medium mb-2">Suggestions :</p>
                  <ul className="space-y-1">
                    <li>• Utilisez des mots-clés plus généraux</li>
                    <li>• Vérifiez l'orthographe</li>
                    <li>• Essayez différents filtres</li>
                  </ul>
                </div>
              </div>
            </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

// Composant pour les boutons de filtre
function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white shadow-lg"
          : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/30 hover:shadow-md transform hover:scale-105"
      }`}
    >
      {children}
    </button>
  );
}

// Composant pour afficher une section de résultats
function ResultSection({ query, title, items, type, showAll = false }) {
  const displayItems = showAll ? items : items.slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 p-6 backdrop-blur-sm">
      <h2 className="text-lg font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 flex items-center gap-2">
        {type === "user" ? "👥" : "📝"} {title}
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          ({items.length})
        </span>
      </h2>

      <div className="space-y-4">
        {displayItems.map((item) => (
          <div key={item.id_user || item.post_id}>
            {type === "user" ? (
              <UserResultCard user={item} />
            ) : (
              <ModernPost post={item} />
            )}
          </div>
        ))}
      </div>

      {!showAll && items.length > 3 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`/search?q=${encodeURIComponent(query)}&type=${
              type === "user" ? "users" : "posts"
            }`}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          >
            Voir tous les résultats ({items.length})
          </Link>
        </div>
      )}
    </div>
  );
}

// Composant pour afficher un utilisateur dans les résultats
function UserResultCard({ user }) {
  console.log("User Result Card:", user);
  return (
    <Link href={`/profile/${user.pseudo_user}`} className="block">
      <div className="bg-white dark:bg-gray-800 flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
          {user.pfp_user ? (
            <Image
              src={user.pfp_user}
              alt={`Avatar de ${user.pseudo_user}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              👤
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {user.pseudo_user}
            </h3>
            {user.verified && (
              <span className="text-blue-500" title="Compte vérifié">
                ✓
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            @{user.pseudo_user}
          </p>
          {user.description_user && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
              {user.description_user}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
            {user.followers_count !== undefined && (
              <span>{user.followers_count} abonnés</span>
            )}
            {user.posts_count !== undefined && (
              <span>{user.posts_count} posts</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Composant de fallback pour le chargement
function SearchFallback() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
}

// Composant principal exporté avec Suspense
export default function SearchResultsPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent />
    </Suspense>
  );
}
