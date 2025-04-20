/**
 * Configuration for MSAL (Microsoft Authentication Library) to use Azure AD B2C
 */
import { Configuration, SilentRequest } from "@azure/msal-browser";

// MSAL configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_B2C_CLIENT_ID || "",
    // Use v2.0 endpoint for PKCE and public client flows
    authority: `https://${process.env.NEXT_PUBLIC_AZURE_B2C_TENANT_NAME}.b2clogin.com/` +
               `${process.env.NEXT_PUBLIC_AZURE_B2C_TENANT_NAME}.onmicrosoft.com/` +
               `${process.env.NEXT_PUBLIC_AZURE_B2C_POLICY_SIGNUP_SIGNIN}/v2.0`,
    knownAuthorities: [
      `${process.env.NEXT_PUBLIC_AZURE_B2C_TENANT_NAME}.b2clogin.com`,
    ],
    // URI to redirect to after login
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || window.location.origin,
    // URI to redirect to after logout (front-channel logout)
    postLogoutRedirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

// Token request parameters for acquiring an access token for the backend API
export const loginRequest: SilentRequest = {
  scopes: [
    // Example: 'https://<tenant>.onmicrosoft.com/<api-client-id>/user_impersonation'
    process.env.NEXT_PUBLIC_AZURE_B2C_API_SCOPE || "",
  ],
};
