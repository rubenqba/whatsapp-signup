"use client";
import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function WhatsAppSignup() {
  const [isSignupVisible, setIsSignupVisible] = useState(false);

  const handleStartSignup = () => {
    setIsSignupVisible(true);
  };

  const launchWhatsAppSignup = () => {
    const FB = (window as any).FB;
    if (!FB) {
      console.error('Facebook SDK not initialized');
      return;
    }

    FB.login(
      (response: any) => {
        if (response.authResponse) {
          const code = response.authResponse.code;
          console.log('Signup successful, code:', code);
          fetch('/api/whatsapp-registration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          })
            .then((res) => res.json())
            .then((result) => console.log('Registration event sent', result))
            .catch((error) => console.error('Error sending registration event', error));
        } else {
          console.log('Signup cancelled or failed', response);
        }
      },
      {
        config_id: process.env.NEXT_PUBLIC_FB_LOGIN_CONFIG_ID,
        response_type: 'code',
        override_default_response_type: true,
      }
    );
  };

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
      <button
        onClick={launchWhatsAppSignup}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Iniciar Registro de WhatsApp Business
      </button>

      {isSignupVisible && (
        <div
          className="fb-whatsapp-embedded-signup mt-4"
          data-app-id={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
          data-config-id={process.env.NEXT_PUBLIC_FB_LOGIN_CONFIG_ID}
          data-size="large"
          data-button-text="Registrarse"
        />
      )}

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