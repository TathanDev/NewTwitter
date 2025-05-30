"use client";
import { useState } from "react";

export default function ProfileForm({ user }) {
  console.log("User data:", user);
  const [username, setUsername] = useState(user.pseudo_user);
  const [about, setAbout] = useState(user.description_user);
  const [pdp, setPdp] = useState(user.pfp_user);
  let pdp_url = user.pfp_user;

  async function handleSubmit(e) {
    e.preventDefault();
    let pdp_url = user.pfp_user;

    if (pdp && pdp instanceof File) {
      const formData = new FormData();
      formData.append("pdp", pdp);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      pdp_url = data.url || data;
    }

    await fetch("/api/user/" + user.id_user, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pseudo_user: username,
        description_user: about,
        pfp_user: pdp_url,
      }),
    });
    location.reload();
  }

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
                Profil
              </span>
            </h1>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
              Personnalisez votre profil NewT
            </p>
          </div>
        </div>

        {/* Formulaire avec style NewT */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm">
            {/* Section Photo de profil */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Photo de profil
              </h3>

              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-full blur-sm opacity-75"></div>
                  <img
                    src={user.pfp_user}
                    alt="Votre profil"
                    className="relative size-16 rounded-full bg-gray-50 dark:bg-gray-800"
                  />
                </div>

                <div className="flex-1">
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-gray-700 dark:text-gray-300
                                file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 
                                file:text-sm file:font-semibold file:text-white
                                file:bg-gradient-to-r file:from-blue-600 file:to-purple-600 
                                dark:file:from-blue-500 dark:file:to-purple-500
                                file:shadow-lg file:hover:shadow-xl
                                file:hover:from-blue-700 file:hover:to-purple-700 
                                dark:file:hover:from-blue-600 dark:file:hover:to-purple-600
                                file:transition-all file:duration-300 file:transform file:hover:scale-105
                                focus:outline-none cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (
                          file &&
                          user.pfp_user &&
                          user.pfp_user.endsWith(file.name)
                        ) {
                          alert("Vous semblez déjà utiliser cette image.");
                          e.target.value = "";
                          return;
                        }
                        setPdp(file);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section Informations */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
                >
                  Nom d'utilisateur
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300"></div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="relative block w-full py-4 px-6 text-base text-gray-900 dark:text-gray-100 
                              bg-white dark:bg-gray-800 rounded-2xl border border-gray-300/50 dark:border-gray-600/30
                              placeholder:text-gray-400 dark:placeholder:text-gray-500 
                              focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50
                              focus:border-transparent transition-all duration-300
                              shadow-lg hover:shadow-xl"
                    placeholder="Votre nom d'utilisateur"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="about"
                  className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
                >
                  À propos
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300"></div>
                  <textarea
                    id="about"
                    name="about"
                    rows={4}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="relative block w-full py-4 px-6 text-base text-gray-900 dark:text-gray-100 
                              bg-white dark:bg-gray-800 rounded-2xl border border-gray-300/50 dark:border-gray-600/30
                              placeholder:text-gray-400 dark:placeholder:text-gray-500 
                              focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-400/50
                              focus:border-transparent transition-all duration-300
                              shadow-lg hover:shadow-xl resize-none"
                    placeholder="Parlez-nous de vous..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bouton de sauvegarde */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSubmit}
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
