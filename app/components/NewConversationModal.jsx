"use client";
import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

function NewConversationModal({ isOpen, onClose, onConversationCreated }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const response = await fetch('/api/search/autocomplete?q=&type=users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function searchUsers(query) {
    if (query.trim() === "") {
      fetchUsers();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche d'utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function startConversation(user) {
    try {
      setCreating(true);
      const response = await fetch('/api/messages/conversations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: user.id_user,
        }),
      });

      if (response.ok) {
        // Fermer le modal et notifier le parent
        onClose();
        if (onConversationCreated) {
          onConversationCreated();
        }
      } else {
        console.error("Erreur lors du démarrage de la conversation");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setCreating(false);
    }
  }

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchUsers(query);
  };

  const filteredUsers = users.filter(user => 
    user.pseudo_user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl transition-all">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                      Nouvelle conversation
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Barre de recherche */}
                  <div className="mt-4 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un utilisateur..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Liste des utilisateurs */}
                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                      <UserPlusIcon className="w-12 h-12 mb-2" />
                      <p className="text-lg font-medium">Aucun utilisateur trouvé</p>
                      <p className="text-sm text-center">
                        {searchQuery ? "Essayez avec d'autres mots-clés" : "Commencez à taper pour rechercher"}
                      </p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {filteredUsers.map((user) => (
                        <button
                          key={user.id_user}
                          onClick={() => startConversation(user)}
                          disabled={creating}
                          className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex items-center space-x-3">
                            <Image
                              src={user.pfp_user || "/default-avatar.png"}
                              alt={user.pseudo_user}
                              width={48}
                              height={48}
                              className="rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {user.pseudo_user}
                              </h3>
                              {user.description_user && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                  {user.description_user}
                                </p>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                                <UserPlusIcon className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Sélectionnez un utilisateur pour commencer une conversation
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default NewConversationModal;
