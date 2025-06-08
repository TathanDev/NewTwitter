"use server";

import { logout } from "../actions/auth";

export default async function Page() {
  return (
    <>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm ">
        <form action={logout} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-white"
            >
              Do you want to Logout ?
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
