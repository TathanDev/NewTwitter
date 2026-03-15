"use client";

/* eslint-disable @next/next/no-img-element */

import { signup } from "@/app/actions/auth";
import { useState } from "react";

function PasswordRequirements({ password }) {
  const requirements = [
    { test: password.length >= 8, label: "Au moins 8 caractères" },
    { test: /[A-Z]/.test(password), label: "Une majuscule" },
    { test: /[0-9]/.test(password), label: "Un chiffre" },
    { test: /[!@#$%^&*(),.?":{}|<>]/.test(password), label: "Un caractère spécial" },
  ];

  return (
    <div className="mt-2 space-y-1">
      {requirements.map((req, index) => (
        <div key={index} className={`text-xs flex items-center gap-2 ${req.test ? "text-green-500" : "text-gray-400"}`}>
          <span>{req.test ? "✓" : "○"}</span>
          <span>{req.label}</span>
        </div>
      ))}
    </div>
  );
}

export function SignupForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Le mot de passe doit contenir au moins 8 caractères";
    if (!/[A-Z]/.test(pwd)) return "Le mot de passe doit contenir au moins une majuscule";
    if (!/[0-9]/.test(pwd)) return "Le mot de passe doit contenir au moins un chiffre";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return "Le mot de passe doit contenir au moins un caractère spécial";
    return null;
  };

  const handleSubmit = async (formData) => {
    const pwd = formData.get("password");
    const validationError = validatePassword(pwd);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await signup(formData);
    } catch (e) {
      setIsSubmitting(false);
    }
  };

  const isPasswordValid = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password);

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
              Créez votre compte NewT
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Rejoignez la communauté dès maintenant
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-700/80 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm">
          <form action={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="pseudo"
                className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
              >
                Nom d'utilisateur
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-400 dark:to-blue-400 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300"></div>
                <input
                  id="pseudo"
                  name="pseudo"
                  type="text"
                  required
                  className="relative block w-full py-4 px-6 text-base text-gray-900 dark:text-gray-100
                            bg-white dark:bg-gray-800 rounded-2xl border border-gray-300/50 dark:border-gray-600/30
                            placeholder:text-gray-400 dark:placeholder:text-gray-500
                            focus:outline-none focus:ring-2 focus:ring-green-500/50 dark:focus:ring-green-400/50
                            focus:border-transparent transition-all duration-300
                            shadow-lg hover:shadow-xl"
                  placeholder="Votre nom d'utilisateur"
                />
              </div>
            </div>

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
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3"
              >
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300"></div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full py-4 px-6 text-base text-gray-900 dark:text-gray-100
                            bg-white dark:bg-gray-800 rounded-2xl border border-gray-300/50 dark:border-gray-600/30
                            placeholder:text-gray-400 dark:placeholder:text-gray-500
                            focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-400/50
                            focus:border-transparent transition-all duration-300
                            shadow-lg hover:shadow-xl"
                  placeholder="Choisissez un mot de passe sécurisé"
                />
              </div>
              {password && <PasswordRequirements password={password} />}
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!isPasswordValid || isSubmitting}
              className={`w-full py-4 px-6 bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-500 dark:to-blue-500
                        text-white font-semibold rounded-2xl
                        hover:from-green-700 hover:to-blue-700 dark:hover:from-green-600 dark:hover:to-blue-600
                        transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105
                        flex items-center justify-center gap-3 relative overflow-hidden
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative text-lg">{isSubmitting ? "Création..." : "Créer mon compte"}</span>
              <span className="relative">✨</span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Déjà un compte ?{" "}
              <a
                href="/login"
                className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-300 dark:hover:to-purple-300 transition-all duration-300"
              >
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
