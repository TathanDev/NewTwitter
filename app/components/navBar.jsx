/* eslint-disable @next/next/no-img-element */
import { logout } from "../actions/auth";
import { verifySession } from "@/utils/dal";
import MessageButton from "./MessageButton";
import NewConversationButton from "./NewConversationButton";
import NotificationBell from "./NotificationBell";
import ProfileImage from "./ProfileImage";
import LogoutButton from "./LogoutButton";
import { createApiUrl } from "@/utils/url";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  ChatBubbleBottomCenterTextIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const navigation = [];

const profile = [];
var pfp = "";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default async function NavBar() {
  pfp = "/users_pfp/1752950264309-archlinux-btw.png";
  const session = await verifySession();
  profile.length = 0;

  if (session) {
    profile.push({
      name: "Profile",
      href: "/profile",
      current: false,
    });
    profile.push({
      name: "Settings",
      href: "/settings",
      current: false,
    });
    profile.push({
      name: "Favorites",
      href: "/favorites",
      current: false,
    });
    profile.push({ name: "Logout", href: "", current: false });

    const response = await fetch(createApiUrl(`/api/user/${session.userId}`));
    if (response.ok) {
      const user = await response.json();
      pfp = user.pfp_user;
    } else {
      console.error(
        `Failed to fetch user: ${response.status} ${response.statusText}`
      );
    }
  } else {
    profile.push({ name: "Login", href: "login", current: false });
    profile.push({ name: "Register", href: "register", current: false });
  }

  return (
    <div>
      <Disclosure
        as="nav"
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 transition-colors duration-300"
      >
        {/* Effet de halo subtil en arrière-plan */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative flex h-16 items-center justify-between">
            {/* Mobile menu button */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-xl p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>

            {/* Logo et Navigation */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              {/* Logo NewT avec effet moderne */}
              <div className="flex shrink-0 items-center">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-400/30 dark:via-purple-400/30 dark:to-pink-400/30 rounded-2xl blur-lg"></div>
                  <a
                    href="/"
                    className="relative text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 tracking-tight"
                  >
                    NewT
                  </a>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="hidden sm:ml-8 sm:block">
                <div className="flex space-x-2">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? "page" : undefined}
                      className={classNames(
                        item.current
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
                        "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-md"
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions à droite */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 space-x-2 sm:space-x-3">
              {/* Post - Hidden on mobile et quand pas connecté */}
              {session && (
                <a
                  href="createPost"
                  className="hidden sm:flex relative rounded-xl bg-gray-100 dark:bg-gray-800 p-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-all duration-200 hover:shadow-md group"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Poster</span>
                  <PlusIcon
                    aria-hidden="true"
                    className="size-5 group-hover:scale-110 transition-transform duration-200"
                  />
                </a>
              )}
              {/* Notifications - More compact on mobile */}
              {session && (
                <div className="hidden sm:block">
                  <NotificationBell />
                </div>
              )}

              {/* Message - More compact on mobile */}
              {session && (
                <div className="hidden sm:block">
                  <MessageButton />
                </div>
              )}

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <div>
                  <MenuButton className="relative flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 hover:shadow-md transition-all duration-200 group">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <ProfileImage
                      src={pfp}
                      alt=""
                      className="size-8 rounded-lg group-hover:scale-110 transition-transform duration-200 object-cover"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-3 w-56 origin-top-right rounded-2xl bg-white dark:bg-gray-800 py-2 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in border border-gray-100 dark:border-gray-700"
                >
                  {profile.map((item, index) => (
                    <MenuItem key={item.name}>
                      {item.name === "Logout" ? (
                        <LogoutButton
                          className={classNames(
                            "group flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 data-[focus]:bg-gradient-to-r data-[focus]:from-blue-50 data-[focus]:to-purple-50 dark:data-[focus]:from-blue-900/20 dark:data-[focus]:to-purple-900/20 data-[focus]:outline rounded-sm w-full text-left",
                            "text-red-600 dark:text-red-400 data-[focus]:text-red-700 dark:data-[focus]:text-red-300"
                          )}
                        >
                          <span className="flex-1">{item.name}</span>
                          <span className="text-red-400 group-data-[focus]:text-red-500">
                            🚪
                          </span>
                        </LogoutButton>
                      ) : (
                        <a
                          href={item.href}
                          className={classNames(
                            "group flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 data-[focus]:bg-gradient-to-r data-[focus]:from-blue-50 data-[focus]:to-purple-50 dark:data-[focus]:from-blue-900/20 dark:data-[focus]:to-purple-900/20 data-[focus]:outline rounded-sm",
                            "text-gray-700 dark:text-gray-300 data-[focus]:text-gray-900 dark:data-[focus]:text-white"
                          )}
                        >
                          <span className="flex-1">{item.name}</span>
                          {item.name === "Profile" && (
                            <span className="text-gray-400 group-data-[focus]:text-gray-600 dark:group-data-[focus]:text-gray-300">
                              👤
                            </span>
                          )}
                          {item.name === "Settings" && (
                            <span className="text-gray-400 group-data-[focus]:text-gray-600 dark:group-data-[focus]:text-gray-300">
                              ⚙️
                            </span>
                          )}
                          {item.name === "Favorites" && (
                            <span className="text-gray-400 group-data-[focus]:text-gray-600 dark:group-data-[focus]:text-gray-300">
                              <svg
                                className="size-5 group-hover:scale-110 transition-transform duration-200"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                            </span>
                          )}
                          {item.name === "Login" && (
                            <span className="text-gray-400 group-data-[focus]:text-gray-600 dark:group-data-[focus]:text-gray-300">
                              🔑
                            </span>
                          )}
                          {item.name === "Register" && (
                            <span className="text-gray-400 group-data-[focus]:text-gray-600 dark:group-data-[focus]:text-gray-300">
                              ✨
                            </span>
                          )}
                        </a>
                      )}
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <DisclosurePanel className="sm:hidden border-t border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg">
          <div className="space-y-2 px-4 pb-4 pt-4">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={classNames(
                  item.current
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
                  "block rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 hover:shadow-md"
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
            
            {/* Mobile Actions */}
            {session && (
              <>
                {/* Créer un post */}
                <DisclosureButton
                  as="a"
                  href="/createPost"
                  className="flex items-center space-x-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:shadow-md"
                >
                  <PlusIcon className="size-5" aria-hidden="true" />
                  <span>Créer un post</span>
                </DisclosureButton>
                
                {/* Messages */}
                <DisclosureButton
                  as="a"
                  href="/messages"
                  className="flex items-center space-x-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:shadow-md"
                >
                  <ChatBubbleBottomCenterTextIcon className="size-5" aria-hidden="true" />
                  <span>Messages</span>
                </DisclosureButton>
                
                {/* Notifications */}
                <DisclosureButton
                  as="a"
                  href="/notifications"
                  className="flex items-center space-x-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:shadow-md"
                >
                  <BellIcon className="size-5" aria-hidden="true" />
                  <span>Notifications</span>
                </DisclosureButton>
              </>
            )}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}
