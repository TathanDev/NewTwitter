"use client";
import { useState } from "react";

export default function ProfileForm({ user }) {
  const [username, setUsername] = useState(user.pseudo_user);
  const [about, setAbout] = useState(user.description_user);

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/user/" + user.id_user, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pseudo_user: username,
        description_user: about,
      }),
    });
  }

  return (
    <form
      className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8"
      onSubmit={handleSubmit}
    >
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Profile
        </h2>
        <div className="mt-10 col-span-full">
          <div className="mt-2 flex items-center gap-x-3">
            <img
              src={user.pfp_user}
              alt="Your profile"
              className="size-12 rounded-full bg-gray-50 dark:bg-gray-800"
            />
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 dark:text-gray-100 bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none sm:text-sm"
              />
            </div>
          </div>
          <div className="col-span-full">
            <label
              htmlFor="about"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              About
            </label>
            <div className="mt-2">
              <textarea
                id="about"
                name="about"
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-400 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400"
        >
          Save
        </button>
      </div>
    </form>
  );
}
