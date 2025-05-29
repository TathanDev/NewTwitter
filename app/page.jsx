import Image from "next/image";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-green-500 dark:bg-purple-500 text-white dark:text-yellow-300">
      <h1 className="text-4xl p-8">Test Dark Mode</h1>
      <p className="p-8">Ce texte devrait changer de couleur</p>
    </div>
  );
}
