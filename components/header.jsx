'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaCaretDown,FaUserCircle } from 'react-icons/fa';
import ThemeSwitch from "./ThemeSwitch";
import { useAuth, useClerk } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';

const UserAvatar = () => {
  const { user } = useUser();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (user?.imageUrl) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageLoaded(false);
      img.src = user.imageUrl;
    }
  }, [user]);

  if (!user || !imageLoaded) {
    return <FaUserCircle className="h-8 w-8 rounded-full text-gray-400" />;
  }

  return (
    <img
      className="h-8 w-8 rounded-full"
      src={user.imageUrl}
      alt={user.fullName || "User avatar"}
    />
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isToolsDropdownOpenMobil, setIsToolsDropdownOpenMobli] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { isSignedIn } = useAuth();


  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleToolsDropdown = () => setIsToolsDropdownOpen(!isToolsDropdownOpen);
  const toggleToolsDropdownMobile = () => setIsToolsDropdownOpenMobli(!isToolsDropdownOpenMobil);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const closeAllDropdowns = () => {
    setIsToolsDropdownOpen(false);
    setIsProfileDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const renderAuthSection = () => {
    if (isSignedIn) {
      return (
        <>
          <button
            onClick={toggleProfileDropdown}
            className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            id="user-menu-button"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <span className="sr-only">Open user menu</span>
            <UserAvatar />
          </button>
          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none top-16">
              <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Your Profile</Link>
            </div>
          )}
        </>
      );
    } else {
      return (
        <div className="flex space-x-2">
          <Link href="/login" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
          <Link href="/signup" className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">Sign up</Link>
        </div>
      );
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0">
              <span className="text-indigo-600 dark:text-indigo-400 text-xl font-bold">FalconMind</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/dashboard" className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <div className="relative dropdown-container">
                <button
                  onClick={toggleToolsDropdown}
                  className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                >
                  Tools
                  <FaCaretDown className="ml-1 h-4 w-4" />
                </button>
                {isToolsDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Link href="/poem-creator" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Poem Creator</Link>
                    <Link href="/flashcards" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Flashcards</Link>
                    <Link href="/ai-assistant" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">AI Assistant</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className='cursor-pointer bg-gray-200 dark:bg-gray-600 p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2'>
              <ThemeSwitch/>
            </div>
            <div className="hidden md:ml-3 md:flex md:items-center dropdown-container">
              {renderAuthSection()}
            </div>
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <FaTimes className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <FaBars className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/dashboard" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <div className="space-y-1">
              <button
                onClick={toggleToolsDropdownMobile}
                className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left flex justify-between items-center"
              >
                Tools
                <FaCaretDown className={`h-4 w-4 transition-transform duration-200 ${isToolsDropdownOpenMobil ? 'transform rotate-180' : ''}`} />
              </button>
              {isToolsDropdownOpenMobil && (
                <div className="pl-4 space-y-1">
                  <Link href="/poem-creator" className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 block px-3 py-2 rounded-md text-base font-medium">Poem Creator</Link>
                  <Link href="/flashcards" className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 block px-3 py-2 rounded-md text-base font-medium">Flashcards</Link>
                  <Link href="/ai-assistant" className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 block px-3 py-2 rounded-md text-base font-medium">AI Assistant</Link>
                </div>
              )}
            </div>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-600">
            {isSignedIn ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                  <UserAvatar />
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Your Profile</Link>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-1 px-2">
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Login</Link>
                <Link href="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;