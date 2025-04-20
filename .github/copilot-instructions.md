# GitHub Copilot Context

This file provides context and guidelines to GitHub Copilot to assist in generating and reasoning about code for this application.

## Project Overview

- Purpose: Onboard WhatsApp Business users via Meta's [Embedded Signup](https://developers.facebook.com/docs/whatsapp/embedded-signup/implementation) flow inside a Next.js application.
- Stack: Next.js 15 (App Router), React 19, TypeScript 5.x, Tailwind CSS
- Key Feature: WhatsApp Embedded Signup plugin to capture OAuth codes and forward them to a backend API.

## Tech Stack & Dependencies

- Next.js 15 (App Router)
- React 19
- TypeScript 5.x
- Tailwind CSS
- MUI Joy UI (@mui/joy, @emotion/react, @emotion/styled)
- Authentication: MSAL (@azure/msal-browser, @azure/msal-react)
- Data Validation: zod
- Phone formatting: google-libphonenumber
- HTTP client: axios
- JWT & JWK: jsonwebtoken, jwks-rsa
- Package manager: pnpm

## Architecture & Components

- `src/components/WhatsAppSignup.tsx`
  - Client component ("use client") that renders the **Facebook Login for Business** element:
  - Loads Facebook SDK via next/script and initializes it.
  - Listens to events of type `WA_EMBEDDED_SIGNUP` and POSTs payload to `/api/whatsapp-registration`.

- `src/app/page.tsx`
  - Simplified homepage that centers the `WhatsAppSignup` component.

- `src/app/api/whatsapp-registration/route.ts`
  - Next.js API route that receives signup events and forwards them to an external service defined by `REGISTRATION_API_URL`.

## Environment Variables

| Name                                       | Description                                                                 |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| NEXT_PUBLIC_AZURE_B2C_CLIENT_ID            | Azure AD B2C Application (Client) ID                                        |
| NEXT_PUBLIC_AZURE_B2C_TENANT_NAME           | Azure AD B2C tenant name (e.g., yourtenant.b2clogin.com)                   |
| NEXT_PUBLIC_AZURE_B2C_POLICY_SIGNUP_SIGNIN  | Azure AD B2C sign-up/sign-in policy name                                    |
| NEXT_PUBLIC_REDIRECT_URI                    | Redirect URI after login/logout (defaults to window.location.origin)        |
| NEXT_PUBLIC_AZURE_B2C_API_SCOPE             | API scope for Azure AD B2C (e.g., `https://<tenant>.onmicrosoft.com/api/user_impersonation`) |
| NEXT_PUBLIC_FACEBOOK_APP_ID                 | Facebook App ID                                                             |
| NEXT_PUBLIC_FACEBOOK_API_VERSION            | Facebook SDK version (default: v22.0)                                       |
| NEXT_PUBLIC_FB_LOGIN_CONFIG_ID              | Facebook Embedded Signup configuration ID                                   |
| REGISTRATION_API_URL                        | Base URL for backend APIs (Twilio numbers & WhatsApp registration)           |

Store these in `.env.local` at the project root.

## Coding Guidelines

1. Client Components: Must include "use client" and only use React hooks.
2. Script Loading: Use `next/script` with `strategy="afterInteractive"` for external SDKs.
3. Event Handling: Use `window.addEventListener('message', ...)` to capture `WA_EMBEDDED_SIGNUP` events.
4. Error Handling: Log errors clearly in console and return meaningful HTTP statuses in API routes.
5. Styling: Use Tailwind CSS utility classes; avoid custom global CSS where possible.

## Testing & Debugging

- Verify in browser console:
  - "WhatsApp embedded signup is ready"
  - "Embedded signup event sent" with payload data
- Inspect network tab for POST requests to `/api/whatsapp-registration` and to the external `REGISTRATION_API_URL`.

## Copilot Assistant Instructions

> When suggesting code, follow the above architecture and guidelines. Use Next.js App Router conventions, TypeScript types, and Tailwind CSS. Provide clear error handling, environment variable usage, and refer to Meta's Embedded Signup documentation where needed.
