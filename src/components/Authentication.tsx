"use client";
import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@/auth/msalConfig';

/**
 * Button to initiate login with Azure AD B2C
 */
export function SignInButton() {
  const { instance } = useMsal();
  // Use redirect flow (PKCE) instead of popup for public client
  const handleLogin = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error('Login redirect error:', error);
    }
  };
  return (
    <button onClick={handleLogin} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
      Sign In
    </button>
  );
}

/**
 * Button to log out of Azure AD B2C session
 */
export function SignOutButton() {
  const { instance } = useMsal();
  const handleLogout = async () => {
    try {
      await instance.logoutPopup();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
      Sign Out
    </button>
  );
}