"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useSession, signOut } from "next-auth/react";
import { MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function TopNav() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-1 items-center justify-between">
      <div className="flex flex-1">
        <div className="flex w-full md:ml-0">
          <div className="relative w-full text-gray-400 focus-within:text-gray-600">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <input
              type="search"
              className="block h-full w-full border-transparent py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm bg-gray-50 rounded-md"
              placeholder="Search..."
            />
          </div>
        </div>
      </div>
      <div className="ml-4 flex items-center space-x-4">
        <button
          type="button"
          className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        </button>

        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center space-x-3 rounded-full text-sm focus:outline-none">
            <span className="sr-only">Open user menu</span>
            <UserCircleIcon
              className="h-8 w-8 text-gray-400"
              aria-hidden="true"
            />
            <div className="hidden md:flex md:items-center md:space-x-2">
              <span className="text-sm font-medium text-gray-700">
                {session?.user?.name || session?.user?.email}
              </span>
              <span className="text-xs text-gray-500">
                {session?.user?.role}
              </span>
            </div>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="/profile"
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    Your Profile
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="/settings"
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    Settings
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => signOut()}
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block w-full px-4 py-2 text-left text-sm text-gray-700"
                    )}
                  >
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}
