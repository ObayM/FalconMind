'use client'
import React from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { FiUser, FiMail, FiBriefcase, FiMapPin } from 'react-icons/fi';

const ProfileCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <div className="flex-shrink-0">
      <Icon className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const ProfilePage = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
          <div className="relative h-48 bg-indigo-600">
            <div className="flex justify-center absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <div className="relative">
                <UserButton appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: '8rem',
                      height: '8rem',
                    },
                  },
                }}/>
                <div className="absolute -right-28 top-0 transform -translate-y-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  Click on the photo
                </div>
              </div>
            </div>
          </div>
          <div className="pt-16 pb-8 px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user.fullName}</h2>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <ProfileCard icon={FiMail} label="Email" value={user.primaryEmailAddress?.emailAddress} />
              <ProfileCard icon={FiBriefcase} label="Course" value={user.publicMetadata?.role || 'Python'} />
            </div>
          </div>
          {user.publicMetadata?.bio && (
            <div className="px-6 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Bio</h3>
              <p className="text-gray-700 dark:text-gray-300">{user.publicMetadata.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;