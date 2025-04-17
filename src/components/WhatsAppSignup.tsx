"use client";
import { useEffect } from 'react';
import Script from 'next/script';

export default function WhatsAppSignup() {
  // Escucha los mensajes del iframe de WhatsApp Embedded Signup
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (
        event.origin !== 'https://www.facebook.com' &&
        event.origin !== 'https://web.facebook.com'
      ) {
        return;
      }
      let data: any;
      try {
        data = JSON.parse(event.data);
      } catch {
        console.error('WA_EMBEDDED_SIGNUP message event', event.data);
        return;
      }
      if (data.type === 'WA_EMBEDDED_SIGNUP') {
        fetch('/api/whatsapp-registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((result) => console.log('Embedded signup event sent', result))
          .catch((error) =>
            console.error('Error sending embedded signup event', error)
          );
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <>
      <div
        className="fb-whatsapp-signup"
        data-app-id={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
        data-config-id={process.env.NEXT_PUBLIC_FB_LOGIN_CONFIG_ID}
        data-size="large"
        data-button-text="Registrarse"
        data-redirect-uri={
          process.env.NEXT_PUBLIC_WHATSAPP_REDIRECT_URI
            ? encodeURIComponent(
                process.env.NEXT_PUBLIC_WHATSAPP_REDIRECT_URI
              )
            : ''
        }
      />
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
            autoLogAppEvents: true,
            xfbml: true,
            version: process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || 'v16.0',
          });
          if (typeof FB.XFBML?.parse === 'function') {
            FB.XFBML.parse();
          }
        }}
      />
    </>
  );
}