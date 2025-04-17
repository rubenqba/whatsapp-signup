"use client";
import Script from 'next/script';

export default function WhatsAppSignup() {
  const containerId = 'whatsapp-embedded-signup';

  return (
    <div>
      <div id={containerId} />
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="afterInteractive"
        onLoad={() => {
          const FB = (window as any).FB;
          if (!FB) {
            console.error('Facebook SDK not available');
            return;
          }
          FB.init({
            appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
            version: process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || 'v16.0',
          });

          const plugin = (FB as any).WhatsAppEmbeddedSignup;
          if (!plugin) {
            console.error('WhatsApp Embedded Signup plugin not available');
            return;
          }

          plugin.attachTo(`#${containerId}`, {
            appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
            configId: process.env.NEXT_PUBLIC_FB_LOGIN_CONFIG_ID,
            origin: window.location.origin,
            onReady: () => {
              console.log('WhatsApp embedded signup is ready');
            },
            onLoginSuccess: (response: any) => {
              fetch('/api/whatsapp-registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response),
              })
                .then((res) => res.json())
                .then((data) => console.log('Embedded signup event sent', data))
                .catch((err) =>
                  console.error('Error sending embedded signup event', err)
                );
            },
            onError: (error: any) => {
              console.error('Embedded signup encountered an error', error);
            },
          });
        }}
      />
    </div>
  );
}