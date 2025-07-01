"use client";
import { useState } from "react";
import { useTheme } from "@/utils/themeContext";
import NoSSR from "./NoSSR";

export default function UnifiedProfile({ user }) {
  const { theme, toggleTheme } = useTheme();

  // Fonction pour convertir yyyy-mm-dd vers dd/mm/yy
  const formatDateForDisplay = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Fonction pour convertir dd/mm/yy vers yyyy-mm-dd
  const formatDateForStorage = (displayDate) => {
    if (!displayDate) return "";
    const parts = displayDate.split("/");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts;
    const fullYear = year.length === 2 ? `20${year}` : year;
    return `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  // États pour le profil
  const [username, setUsername] = useState(user.pseudo_user);
  const [about, setAbout] = useState(user.description_user);
  const [pdp, setPdp] = useState(user.pfp_user);

  // États pour les paramètres
  const [formData, setFormData] = useState({
    mail_user: user?.mail_user || "",
    birth_date: formatDateForDisplay(user?.birth_date) || "",
    country: user?.country || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("profile"); // "profile" ou "settings"

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validation spéciale pour la date de naissance
    if (name === "birth_date") {
      const cleanedValue = value.replace(/[^0-9/]/g, "");

      let formattedValue = cleanedValue;
      if (cleanedValue.length === 2 && !cleanedValue.includes("/")) {
        formattedValue = cleanedValue + "/";
      } else if (
        cleanedValue.length === 5 &&
        cleanedValue.indexOf("/") === 2 &&
        cleanedValue.lastIndexOf("/") === 2
      ) {
        formattedValue = cleanedValue + "/";
      }

      if (formattedValue.length <= 8) {
        setFormData((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      let pdp_url = user.pfp_user;

      // Gestion de l'upload d'image
      if (pdp && pdp instanceof File) {
        if (user.pfp_user) {
          try {
            await fetch("/api/pdpHandler", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                url: user.pfp_user,
              }),
            });
          } catch (error) {
            console.error(
              "Erreur lors de la suppression de l'ancienne photo:",
              error
            );
          }
        }

        const formDataImg = new FormData();
        formDataImg.append("pdp", pdp);
        const res = await fetch("/api/pdpHandler", {
          method: "POST",
          body: formDataImg,
        });
        const data = await res.json();
        pdp_url = data.url || data;
      }

      // Prépare les données avec la date convertie au format ISO
      const dataToSend = {
        pseudo_user: username,
        description_user: about,
        pfp_user: pdp_url,
        mail_user: formData.mail_user,
        birth_date: formatDateForStorage(formData.birth_date),
        country: formData.country,
      };

      const response = await fetch(`/api/user/${user.id_user}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const responseText = await response.text();
      let responseData;

      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Erreur de parsing JSON:", responseText);
        setMessage("Erreur de communication avec le serveur.");
        return;
      }

      if (response.ok) {
        setMessage("Profil mis à jour avec succès !");
        // Recharger la page après un court délai pour voir les changements
        setTimeout(() => location.reload(), 1500);
      } else {
        setMessage(responseData.error || "Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("Erreur de connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 px-4 py-8 relative overflow-hidden">
      {/* Formes décoratives d'arrière-plan */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-500/30 dark:to-purple-500/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-purple-400/15 to-pink-400/15 dark:from-purple-500/25 dark:to-pink-500/25 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-r from-pink-400/25 to-blue-400/25 dark:from-pink-500/35 dark:to-blue-500/35 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-400/30 dark:via-purple-400/30 dark:to-pink-400/30 rounded-3xl blur-2xl"></div>

          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                Mon Profil
              </span>
            </h1>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
              Gérez votre profil et vos paramètres
            </p>
          </div>
        </div>
        {/* Onglets */}
        <div className="flex mb-8 bg-gray-100 dark:bg-gray-800 rounded-2xl p-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "profile"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            👤 Profil
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "settings"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            ⚙️ Paramètres
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "preferences"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            🎨 Préférences
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm">
              {/* Contenu du profil */}
              {activeTab === "profile" && (
                <div className="space-y-8">
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
                                alert(
                                  "Vous semblez déjà utiliser cette image."
                                );
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

                  {/* Section Informations de base */}
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
              )}

              {/* Contenu des paramètres */}
              {activeTab === "settings" && (
                <div>
                  <h3 className="text-lg font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    Informations personnelles
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                    Ces informations sont optionnelles et vous pouvez les
                    modifier à tout moment.
                  </p>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Email */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="mail_user"
                        className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
                      >
                        Adresse email
                      </label>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-400 dark:to-blue-400 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300"></div>
                        <input
                          id="mail_user"
                          name="mail_user"
                          type="email"
                          value={formData.mail_user}
                          onChange={handleInputChange}
                          className="relative block w-full py-4 px-6 text-base text-gray-900 dark:text-gray-100 
                                    bg-white dark:bg-gray-800 rounded-2xl border border-gray-300/50 dark:border-gray-600/30
                                    placeholder:text-gray-400 dark:placeholder:text-gray-500 
                                    focus:outline-none focus:ring-2 focus:ring-green-500/50 dark:focus:ring-green-400/50
                                    focus:border-transparent transition-all duration-300
                                    shadow-lg hover:shadow-xl"
                          placeholder="votre@email.com"
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Utilisé pour la connexion et les notifications
                      </p>
                    </div>

                    {/* Date de naissance */}
                    <div>
                      <label
                        htmlFor="birth_date"
                        className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
                      >
                        Date de naissance
                      </label>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300"></div>
                        <input
                          id="birth_date"
                          name="birth_date"
                          type="text"
                          value={formData.birth_date}
                          onChange={handleInputChange}
                          placeholder="jj/mm/aa"
                          maxLength="8"
                          className="relative block w-full py-4 px-6 text-base text-gray-900 dark:text-gray-100 
                                    bg-white dark:bg-gray-800 rounded-2xl border border-gray-300/50 dark:border-gray-600/30
                                    focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-400/50
                                    focus:border-transparent transition-all duration-300
                                    shadow-lg hover:shadow-xl"
                        />
                      </div>
                    </div>

                    {/* Pays */}
                    <div>
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
                          value={formData.country}
                          onChange={handleInputChange}
                          className="relative block w-full py-4 px-6 pr-12 text-base text-gray-900 dark:text-gray-100 
                                    bg-white dark:bg-gray-800 rounded-2xl border border-gray-300/50 dark:border-gray-600/30
                                    focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-orange-400/50
                                    focus:border-transparent transition-all duration-300
                                    shadow-lg hover:shadow-xl appearance-none cursor-pointer"
                        >
                          <option value="">Sélectionnez un pays</option>
                          <option value="France">France</option>
                          <option value="Canada">Canada</option>
                          <option value="Belgique">Belgique</option>
                          <option value="Suisse">Suisse</option>
                          <option value="Luxembourg">Luxembourg</option>
                          <option value="États-Unis">États-Unis</option>
                          <option value="Royaume-Uni">Royaume-Uni</option>
                          <option value="Allemagne">Allemagne</option>
                          <option value="Espagne">Espagne</option>
                          <option value="Italie">Italie</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Contenu des préférences */}
              {activeTab === "preferences" && (
                <div>
                  <h3 className="text-lg font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    Préférences de l'application
                  </h3>

                  <div className="space-y-6">
                    {/* Section Thème */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-600">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Apparence
                      </h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700 dark:text-gray-300">
                            Thème
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Basculer entre les modes clair et sombre
                          </p>
                        </div>
                        <NoSSR
                          fallback={
                            <div className="relative p-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-lg w-12 h-12 flex items-center justify-center">
                              <span className="text-xl">🌙</span>
                            </div>
                          }
                        >
                          <button
                            onClick={toggleTheme}
                            className="relative p-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                            type="button"
                          >
                            <div className="relative flex items-center justify-center w-6 h-6">
                              {theme === "light" ? (
                                <span className="text-xl">🌙</span>
                              ) : (
                                <span className="text-xl">☀️</span>
                              )}
                            </div>
                          </button>
                        </NoSSR>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-center gap-6">
              <button
                type="button"
                onClick={() => window.location.href = "/favorites"}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <span>📖</span>
                <span>Mes Favoris</span>
              </button>

              <button
                type="button"
                className="group px-8 py-4 bg-transparent border-2 border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <span>Annuler</span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 
                          text-white font-semibold rounded-2xl 
                          hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 
                          transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 
                          flex items-center gap-3 relative overflow-hidden
                          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative">
                  {isLoading ? "Sauvegarde..." : "Sauvegarder"}
                </span>
                <span className="relative group-hover:translate-x-1 transition-transform duration-300">
                  {isLoading ? "⏳" : "✨"}
                </span>
              </button>
            </div>

            {/* Message de statut */}
            {message && (
              <div
                className={`mt-6 p-4 rounded-2xl text-center font-medium ${
                  message.includes("succès")
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700"
                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </form>

        {/* Élément décoratif du bas */}
        <div className="flex justify-center mt-12">
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
