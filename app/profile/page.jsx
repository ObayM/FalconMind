'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiUser, FiMail, FiBriefcase, FiMapPin, FiEdit2, FiLock, FiSave } from 'react-icons/fi';

// Simulated API functions
const fetchUserProfile = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "Obay Rashad",
        email: "obay@gmail.com",
        skill: "Python",
        location: "New York, USA",
        bio: "Passionate software developer with a keen interest in building user-friendly applications."
      });
    }, 500);
  });
};

const updateUserProfile = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Profile updated:", data);
      resolve({ success: true });
    }, 500);
  });
};

// Custom hook for managing field state
const useField = (initialValue, isEditable = true) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  
  const onChange = useCallback((e) => setValue(e.target.value), []);
  const onEdit = useCallback(() => setIsEditing(true), []);
  const onSave = useCallback(() => setIsEditing(false), []);

  return { value, isEditing, onChange, onEdit, onSave, isEditable };
};

const InputField = React.memo(({ icon: Icon, label, name, type, placeholder, field }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (field.isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [field.isEditing]);

  return (
    <div className="sm:col-span-3 mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        {field.isEditing && field.isEditable ? (
          <div className="relative">
            <input
              ref={inputRef}
              type={type}
              name={name}
              id={name}
              className="block w-full pl-10 pr-20 py-2 sm:text-sm rounded-md border-2 border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-indigo-600 dark:text-white transition-all duration-200 ease-in-out shadow-sm"
              placeholder={placeholder}
              value={field.value}
              onChange={field.onChange}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
              <button
                onClick={field.onSave}
                className="p-1 bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 rounded-full transition-colors duration-200"
              >
                <FiSave className="h-4 w-4" />
              </button>
              
            </div>
          </div>
        ) : (
          <div className="relative">
            <div
              className="block w-full pl-10 pr-10 py-2 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 cursor-default transition-all duration-200 ease-in-out"
            >
              {field.value}
            </div>
            {field.isEditable && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  onClick={field.onEdit}
                  className="p-1 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 hover:text-indigo-700 rounded-full transition-colors duration-200"
                >
                  <FiEdit2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const nameField = useField("");
  const emailField = useField("", false);
  const skillField = useField("", false); 
  const locationField = useField("");
  const bioField = useField("");

  useEffect(() => {
    fetchUserProfile().then((data) => {
      setProfile(data);
      nameField.onChange({ target: { value: data.name } });
      emailField.onChange({ target: { value: data.email } });
      skillField.onChange({ target: { value: data.skill } });
      locationField.onChange({ target: { value: data.location } });
      bioField.onChange({ target: { value: data.bio } });
    });
  }, []);

  const handleSave = useCallback(async (field, value) => {
    try {
      await updateUserProfile({ [field]: value });
      // Update the profile state here if needed
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }, []);

  if (!profile) {
      return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }
  

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
        <div className="px-6 py-8 sm:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile & Settings</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            <img
              className="h-32 w-32 rounded-full object-cover border-4 border-indigo-500"
              src="/profile.png"
              alt="Profile"
            />
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{nameField.value}</h3>
              <p className="text-md text-gray-600 dark:text-gray-400">{skillField.value}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <InputField icon={FiMail} label="Email" name="email" type="email" placeholder="you@example.com" field={emailField} />
            <InputField icon={FiBriefcase} label="Your Course" name="skill" type="text" placeholder="Python" field={skillField} />
            <InputField icon={FiUser} label="Name" name="name" type="text" placeholder="John Doe" field={nameField} />
            <InputField icon={FiMapPin} label="Location" name="location" type="text" placeholder="New York, USA" field={locationField} />

            <div className="sm:col-span-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <div className="relative rounded-md shadow-sm">
                {bioField.isEditing ? (
                  <div className="relative">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      className="block w-full sm:text-sm rounded-md border-2 border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-indigo-600 dark:text-white transition-all duration-200 ease-in-out shadow-sm"
                      placeholder="Write a few sentences about yourself."
                      value={bioField.value}
                      onChange={bioField.onChange}
                    />
                    <div className="absolute top-2 right-2 flex items-center space-x-1">
                      <button
                        onClick={() => {
                          handleSave('bio', bioField.value);
                          bioField.onSave();
                        }}
                        className="p-1 bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 rounded-full transition-colors duration-200"
                      >
                        <FiSave className="h-4 w-4" />
                      </button>
                      
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div
                      className="block w-full sm:text-sm rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 p-2 min-h-[6rem] cursor-default transition-all duration-200 ease-in-out"
                    >
                      {bioField.value}
                    </div>
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={bioField.onEdit}
                        className="p-1 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 hover:text-indigo-700 rounded-full transition-colors duration-200"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
            <FiLock className="mr-2" /> Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;