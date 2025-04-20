"use client";
import React from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from '@/auth/msalConfig';
import { CssVarsProvider } from '@mui/joy/styles';

// Initialize MSAL instance for Azure AD B2C
const msalInstance = new PublicClientApplication(msalConfig);

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  // Initialize MSAL instance before rendering MsalProvider
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    msalInstance.initialize()
      .then(() => setInitialized(true))
      .catch((error) => {
        console.error('MSAL initialization failed:', error);
        setInitialized(true);
      });
  }, []);

  if (!initialized) {
    // Optionally render a loading indicator while MSAL initializes
    return null;
  }

  // Wrap application with MUI Joy CSS variables provider
  // and MSAL provider
  return (
    <CssVarsProvider>
      <MsalProvider instance={msalInstance}>
        {children}
      </MsalProvider>
    </CssVarsProvider>
  );
}