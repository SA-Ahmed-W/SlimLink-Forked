"use client";

import { useState } from "react";
import NavLink from "./NavLink";

// Icons as React components for reusability
const DashboardIcon = () => (
  <svg
    stroke="currentColor"
    className="icon glyph"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M14,10V22H4a2,2,0,0,1-2-2V10Z"></path>
    <path d="M22,10V20a2,2,0,0,1-2,2H16V10Z"></path>
    <path d="M22,4V8H2V4A2,2,0,0,1,4,2H20A2,2,0,0,1,22,4Z"></path>
  </svg>
);

const HealthIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);

const URLShortenerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
  >
    {/* Left link */}
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    {/* Right link */}
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    {/* Compression arrows */}
    <path d="M8 12h8" />
    <path d="M13 9l3 3-3 3" />
    <path d="M11 15l-3-3 3-3" />
  </svg>
);

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// Navigation configuration - easily add more links here
const navigationLinks = [
  {
    href: "/",
    label: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    href: "/health",
    label: "System Health",
    icon: <HealthIcon />,
  },
];

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      {/* Main Navbar */}
      <header className="relative flex items-center justify-between whitespace-nowrap px-4 sm:px-6 lg:px-10 py-4 w-full ">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-purple-400 to-purple-600 opacity-20"></div>
        {/* Logo Section with Gradient and Brand Icon */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-r from-purple-400 to-purple-600 p-2">
            <URLShortenerIcon />
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-purple-600">
            SlimLink
          </h2>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex flex-1 justify-end">
          <ul className="flex gap-2">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href} label={link.label} icon={link.icon} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleDrawer}
          className="sm:hidden p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-gray-700 dark:text-gray-300"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden transition-opacity duration-300 ease-in-out"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer - Right Side */}
      <aside
        className={`fixed top-0 right-0 h-screen w-80 max-w-[85vw] bg-white dark:bg-[#101322] shadow-2xl z-50 sm:hidden transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#222949]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-r from-purple-400 to-purple-600 p-2">
              <URLShortenerIcon />
            </div>
            <h2 className="text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-purple-600">
              SlimLink
            </h2>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-gray-700 dark:text-gray-300"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Drawer Navigation */}
        <nav className="p-5">
          <ul className="flex flex-col gap-2">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  onClick={closeDrawer}
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* Drawer Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-[#222949]">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            © 2025 SlimLink
          </p>
        </div>
      </aside>
    </>
  );
}
