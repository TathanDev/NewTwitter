"use client";

import Image from "next/image";
import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex items-center justify-center px-6">
      <div className="max-w-6xl w-full space-y-16">
        {/* Header section */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Company Name */}
          <div className="text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                NewT
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Le nouveau réseau social qui révolutionne votre expérience en
              ligne.
            </p>
          </div>

          {/* Right: Description */}
          <div className="text-right">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Lorem Inpsum <strong>NewT</strong>, Lorem InpsumLorem InpsumLorem
              InpsumLorem Inpsum Lorem InpsumLorem InpsumLorem InpsumLorem
              InpsumLorem InpsumLorem InpsumLorem Inpsum Lorem InpsumLorem
              InpsumLorem InpsumLorem InpsumLorem InpsumLorem InpsumLorem Inpsum
              Lorem InpsumLorem InpsumLorem InpsumLorem InpsumLorem InpsumLorem
              InpsumLorem Inpsum
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow">
            <h2 className="text-3xl font-bold">12,457</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Utilisateurs inscrits
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow">
            <h2 className="text-3xl font-bold">132</h2>
            <p className="text-gray-600 dark:text-gray-400">
              En ligne actuellement
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow">
            <h2 className="text-3xl font-bold">8,349</h2>
            <p className="text-gray-600 dark:text-gray-400">Posts publiés</p>
          </div>
        </section>

        {/* Call to action buttons */}
        <section className="flex justify-center gap-6 pt-4">
          <button
            onClick={() => {
              window.location.href = "login";
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Se connecter
          </button>
          <button
            onClick={() => {
              window.location.href = "register";
            }}
            className="px-6 py-3 bg-transparent border border-blue-600 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition"
          >
            S'inscrire
          </button>
        </section>
      </div>
    </main>
  );
}
