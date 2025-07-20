import { login } from "@/app/actions/auth";

export function LoginForm() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex items-center justify-center px-4 relative overflow-hidden">
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

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-400/30 dark:via-purple-400/30 dark:to-pink-400/30 rounded-3xl blur-2xl"></div>
          
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse">
                NewT
              </span>
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
              Connectez-vous à votre compte
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Retrouvez votre réseau social
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm">
          <form action={login} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
              >
                Adresse email
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300"></div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="relative block w-full py-4 px-6 text-base text-gray-900 dark:text-gray-100 
                            bg-white dark:bg-gray-800 rounded-2xl border border-gray-300/50 dark:border-gray-600/30
                            placeholder:text-gray-400 dark:placeholder:text-gray-500 
                            focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50
                            focus:border-transparent transition-all duration-300
                            shadow-lg hover:shadow-xl"
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800 dark:text-gray-200"
                >
                  Mot de passe
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-300 dark:hover:to-purple-300 transition-all duration-300"
                >
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300"></div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="relative block w-full py-4 px-6 text-base text-gray-900 dark:text-gray-100 
                            bg-white dark:bg-gray-800 rounded-2xl border border-gray-300/50 dark:border-gray-600/30
                            placeholder:text-gray-400 dark:placeholder:text-gray-500 
                            focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-400/50
                            focus:border-transparent transition-all duration-300
                            shadow-lg hover:shadow-xl"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 
                        text-white font-semibold rounded-2xl 
                        hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 
                        transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 
                        flex items-center justify-center gap-3 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative text-lg">Se connecter</span>
              <span className="relative">🔑</span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pas encore de compte ?{" "}
              <a
                href="register"
                className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-300 dark:hover:to-purple-300 transition-all duration-300"
              >
                Créer un compte
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
