export default function UserSettings() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 px-4 py-8 relative overflow-hidden">
      {/* Formes décoratives d'arrière-plan */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-500/30 dark:to-purple-500/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-purple-400/15 to-pink-400/15 dark:from-purple-500/25 dark:to-pink-500/25 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-r from-pink-400/25 to-blue-400/25 dark:from-pink-500/35 dark:to-blue-500/35 rounded-full blur-lg animate-pulse delay-500"></div>

        <div
          className="absolute top-1/3 right-10 w-16 h-16 border border-blue-300/30 dark:border-blue-400/50 rotate-45 animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
        <div className="absolute bottom-1/4 right-1/3 w-8 h-8 bg-gradient-to-r from-purple-500/40 to-pink-500/40 dark:from-purple-400/60 dark:to-pink-400/60 transform rotate-12"></div>

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

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header avec style NewT */}
        <div className="text-center mb-12 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-400/30 dark:via-purple-400/30 dark:to-pink-400/30 rounded-3xl blur-2xl"></div>
          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                Paramètres
              </span>
            </h1>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
              Gérez vos informations personnelles
            </p>
          </div>
        </div>

        {/* Formulaire avec style NewT */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm">
            {/* Section Informations personnelles */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Informations personnelles
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                Utilisez une adresse permanente où vous pouvez recevoir du
                courrier.
              </p>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                {/* Prénom et Nom */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
                  >
                    Prénom
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300"></div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className="relative block w-full py-4 px-6 text-base text-gray-900 dark:text-gray-100 
                                bg-white dark:bg-gray-800 rounded-2xl border border-gray-300/50 dark:border-gray-600/30
                                placeholder:text-gray-400 dark:placeholder:text-gray-500 
                                focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50
                                focus:border-transparent transition-all durationport default function UserSettings({ user -300
                                shadow-lg hover:shadow-xl"
                      placeholder="Votre prénom"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
                  >
                    Nom
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300"></div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className="relative block w-full py-4 px-6 text-base text-gray-900 dark:text-gray-100 
                                bg-white dark:bg-gray-800 rounded-2xl border border-gray-300/50 dark:border-gray-600/30
                                placeholder:text-gray-400 dark:placeholder:text-gray-500 
                                focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-400/50
                                focus:border-transparent transition-all duration-300
                                shadow-lg hover:shadow-xl"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="sm:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
                  >
                    Adresse email
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-400 dark:to-blue-400 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300"></div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="relative block w-full py-4 px-6 text-base text-gray-900 dark:text-gray-100 
                                bg-white dark:bg-gray-800 rounded-2xl border border-gray-300/50 dark:border-gray-600/30
                                placeholder:text-gray-400 dark:placeholder:text-gray-500 
                                focus:outline-none focus:ring-2 focus:ring-green-500/50 dark:focus:ring-green-400/50
                                focus:border-transparent transition-all duration-300
                                shadow-lg hover:shadow-xl"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {/* Pays */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
                  >
                    Pays
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300"></div>
                    <select
                      id="country"
                      name="country"
                      className="relative block w-full py-4 px-6 pr-12 text-base text-gray-900 dark:text-gray-100 
                                bg-white dark:bg-gray-800 rounded-2xl border border-gray-300/50 dark:border-gray-600/30
                                focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-orange-400/50
                                focus:border-transparent transition-all duration-300
                                shadow-lg hover:shadow-xl appearance-none cursor-pointer"
                    >
                      <option value="United States">États-Unis</option>
                      <option value="Canada">Canada</option>
                      <option value="Mexico">Mexique</option>
                      <option value="France">France</option>
                    </select>
                  </div>
                </div>

                {/* Adresse */}
                <div className="col-span-full">
                  <label
                    htmlFor="streetAddress"
                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
                  >
                    Adresse
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-400 dark:to-cyan-400 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300"></div>
                    <input
                      id="streetAddress"
                      name="streetAddress"
                      type="text"
                      className="relative block w-full py-4 px-6 text-base text-gray-900 dark:text-gray-100 
                                bg-white dark:bg-gray-800 rounded-2xl border border-gray-300/50 dark:border-gray-600/30
                                placeholder:text-gray-400 dark:placeholder:text-gray-500 
                                focus:outline-none focus:ring-2 focus:ring-teal-500/50 dark:focus:ring-teal-400/50
                                focus:border-transparent transition-all duration-300
                                shadow-lg hover:shadow-xl"
                      placeholder="123 Rue de la Paix"
                    />
                  </div>
                </div>

                {/* Ville, Région, Code postal */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="city"
                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
                  >
                    Ville
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300"></div>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      className="relative block w-full py-4 px-6 text-base text-gray-900 dark:text-gray-100 
                                bg-white dark:bg-gray-800 rounded-2xl border border-gray-300/50 dark:border-gray-600/30
                                placeholder:text-gray-400 dark:placeholder:text-gray-500 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50
                                focus:border-transparent transition-all duration-300
                                shadow-lg hover:shadow-xl"
                      placeholder="Paris"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="region"
                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
                  >
                    Région
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-purple-500 dark:from-violet-400 dark:to-purple-400 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300"></div>
                    <input
                      id="region"
                      name="region"
                      type="text"
                      className="relative block w-full py-4 px-6 text-base text-gray-900 dark:text-gray-100 
                                bg-white dark:bg-gray-800 rounded-2xl border border-gray-300/50 dark:border-gray-600/30
                                placeholder:text-gray-400 dark:placeholder:text-gray-500 
                                focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:focus:ring-violet-400/50
                                focus:border-transparent transition-all duration-300
                                shadow-lg hover:shadow-xl"
                      placeholder="Île-de-France"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
                  >
                    Code postal
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-rose-500 dark:from-pink-400 dark:to-rose-400 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300"></div>
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      className="relative block w-full py-4 px-6 text-base text-gray-900 dark:text-gray-100 
                                bg-white dark:bg-gray-800 rounded-2xl border border-gray-300/50 dark:border-gray-600/30
                                placeholder:text-gray-400 dark:placeholder:text-gray-500 
                                focus:outline-none focus:ring-2 focus:ring-pink-500/50 dark:focus:ring-pink-400/50
                                focus:border-transparent transition-all duration-300
                                shadow-lg hover:shadow-xl"
                      placeholder="75001"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-center gap-6">
            <button
              type="button"
              className="group px-8 py-4 bg-transparent border-2 border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <span>Annuler</span>
            </button>

            <button
              type="button"
              className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 
                        text-white font-semibold rounded-2xl 
                        hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 
                        transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 
                        flex items-center gap-3 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative">Sauvegarder</span>
              <span className="relative group-hover:translate-x-1 transition-transform duration-300">
                ✨
              </span>
            </button>
          </div>
        </div>

        {/* Élément décoratif du bas */}
        <div className="flex justify-center mt-12">
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
