import { verifySession } from "@/utils/dal";

export default async function Settings() {
  const session = await verifySession();
  if (!session) {
    return (
      <div>
        <h1>Vous devez etre connecté</h1>
      </div>
    );
  }

  let data = await fetch("http://localhost:3000//api/user/" + session.userId);
  let posts = await data.json();
  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex items-center justify-center h-screen">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex items-center space-x-2 mb-6">
          <img src={posts.pfp_user} alt="Lock Icon" className="rounded-full" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Update password for enhanced account security.
        </p>
        <form id="changePasswordForm" className="space-y-6">
          <div>
            <label
              htmlFor="currentPassword"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 block mb-2"
            >
              Current Password *
            </label>
            <input
              type="password"
              id="currentPassword"
              className="password-input form-input block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 block mb-2"
            >
              New Password *
            </label>
            <input
              type="password"
              id="newPassword"
              className="password-input form-input block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 block mb-2"
            >
              Confirm New Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="password-input form-input block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm"
              required
            />
            <button
              type="button"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
            >
              Clear
            </button>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            >
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
