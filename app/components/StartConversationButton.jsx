"use client";
import { useState } from "react";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";

export default function StartConversationButton({ userId, userPseudo, className = "" }) {
  const [isLoading, setIsLoading] = useState(false);

  const startConversation = async () => {
    setIsLoading(true);
    try {
      // Démarrer une conversation en envoyant un message d'introduction
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: userId,
          content: `👋 Salut ${userPseudo} !`,
        }),
      });

      if (response.ok) {
        // Rediriger vers la page de messages
        window.location.href = '/messages';
      } else {
        console.error("Erreur lors du démarrage de la conversation");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={startConversation}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 ${className}`}
    >
      <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
      {isLoading ? "Chargement..." : "Message"}
    </button>
  );
}
