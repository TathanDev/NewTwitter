"use client";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import NewConversationModal from "./NewConversationModal";

export default function NewConversationButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConversationCreated = () => {
    // Optionnel : actualiser la page ou naviguer vers les messages
    window.location.href = '/messages';
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="relative rounded-xl bg-gray-100 dark:bg-gray-800 p-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-all duration-200 hover:shadow-md group"
      >
        <span className="absolute -inset-1.5" />
        <span className="sr-only">Nouvelle conversation</span>
        <PlusIcon
          aria-hidden="true"
          className="size-5 group-hover:scale-110 transition-transform duration-200"
        />
      </button>

      <NewConversationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onConversationCreated={handleConversationCreated}
      />
    </>
  );
}
