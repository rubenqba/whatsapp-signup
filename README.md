This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
  
## Environment Variables

- `REGISTRATION_API_URL`: URL of the external API endpoint to receive WhatsApp registration data. Set this in `.env.local` (optional, if using external endpoint).
- `NEXT_PUBLIC_FACEBOOK_APP_ID`: Facebook App ID for initializing the JS SDK. Set this in `.env.local`.
- `NEXT_PUBLIC_FACEBOOK_API_VERSION`: Graph API version for the JS SDK (e.g., `v22.0`). Set this in `.env.local`.
- `NEXT_PUBLIC_FB_LOGIN_CONFIG_ID`: Configuration ID for Facebook Login for Business (Embedded Signup variation). Set this in `.env.local`.
  
### Azure AD B2C Authentication
- `NEXT_PUBLIC_AZURE_B2C_TENANT_NAME`: Your Azure AD B2C tenant name (e.g., `contoso`).
- `NEXT_PUBLIC_AZURE_B2C_CLIENT_ID`: Client/Application (frontend) ID for your Azure AD B2C user-flow application. Set in `.env.local`.
- `NEXT_PUBLIC_AZURE_B2C_POLICY_SIGNUP_SIGNIN`: The user-flow policy name for sign up/sign in (e.g., `B2C_1_signupsignin`). Set in `.env.local`.
- `NEXT_PUBLIC_REDIRECT_URI`: Redirect URI for MSAL (defaults to app origin if not set). Optional, set in `.env.local`.
- `NEXT_PUBLIC_AZURE_B2C_API_SCOPE`: The scope URI for your backend API (e.g., `https://<tenant>.onmicrosoft.com/<api-client-id>/user_impersonation`). Set in `.env.local`.
- `AZURE_B2C_API_CLIENT_ID`: Application (backend) ID for validating the token audience in the API. Set in `.env.local` (server-side only, no `NEXT_PUBLIC_` prefix).