'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useMsal } from '@azure/msal-react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { loginRequest } from '@/auth/msalConfig';
import { TwilioPhoneNumber } from '@/lib/models';
import { routeModule } from 'next/dist/build/templates/pages';

interface WhatsAppSignupProps {
    row: TwilioPhoneNumber;
}

export default function WhatsAppSignupPrefilled({ row }: WhatsAppSignupProps) {
    const [isSignupVisible, setIsSignupVisible] = useState(false);
    const { instance, accounts } = useMsal();

    const handleStartSignup = () => {
        setIsSignupVisible(true);
    };

    const launchWhatsAppSignup = async () => {
        // Show the signup UI
        handleStartSignup();
        // Ensure user is signed in
        if (!accounts || accounts.length === 0) {
            try {
                await instance.loginPopup(loginRequest);
            } catch (error) {
                console.error('Login required for registration:', error);
                return;
            }
        }
        // Acquire token silently for API
        let tokenResponse;
        const tokenRequest = { ...loginRequest, account: accounts[0] };
        try {
            tokenResponse = await instance.acquireTokenSilent(tokenRequest);
        } catch (error: any) {
            if (error instanceof InteractionRequiredAuthError) {
                tokenResponse = await instance.acquireTokenPopup(tokenRequest);
            } else {
                console.error('Token acquisition error:', error);
                return;
            }
        }
        const FB = (window as any).FB;
        if (!FB) {
            console.error('Facebook SDK not initialized');
            return;
        }
        const setup = {
            solutionID: process.env.NEXT_PUBLIC_FB_SOLUTION_ID,
        };
        console.log('Setup', JSON.stringify(setup, null, 2));
        FB.login(
            function () {
                // Since you are using Twilio's APIs, you do not need to do anything with the response here.
            },
            {
                config_id: process.env.NEXT_PUBLIC_FB_LOGIN_CONFIG_ID,
                auth_type: 'rerequest',
                response_type: 'code',
                override_default_response_type: true,
                extras: {
                    setup,
                    featureType: row.capabilities.sms ? 'only_waba_sharing' : null,
                    sessionInfoVersion: '3',
                },
            }
        );
    };

    // Escucha los mensajes del iframe de WhatsApp Embedded Signup
    useEffect(() => {
        function handleMessage(event: MessageEvent) {
            if (!event.origin.endsWith('facebook.com')) return;
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'WA_EMBEDDED_SIGNUP') {
                    // if user finishes the Embedded Signup flow
                    if (data.event === 'FINISH' || data.event === 'FINISH_ONLY_WABA') {
                        const { phone_number_id, waba_id } = data.data;
                        console.log('Phone number ID ', phone_number_id, ' WhatsApp business account ID ', waba_id);
                        alert(`Phone number ID: ${phone_number_id}\nWABA ID: ${waba_id}`);
                        // if user cancels the Embedded Signup flow
                    } else if (data.event === 'CANCEL') {
                        const { current_step } = data.data;
                        console.warn('Cancel at ', current_step);

                        // if user reports an error during the Embedded Signup flow
                    } else if (data.event === 'ERROR') {
                        const { error_message } = data.data;
                        console.error('error ', error_message);
                    }
                }
            } catch {
                console.log('Non JSON Responses', event.data);
            }
        }
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <>
            <button onClick={launchWhatsAppSignup} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Prefilled
            </button>

            {isSignupVisible && (
                <div
                    className="fb-whatsapp-embedded-signup mt-4"
                    data-app-id={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
                    data-config-id={process.env.NEXT_PUBLIC_FB_LOGIN_CONFIG_ID}
                    data-phone-number={row.number}
                    data-size="large"
                    data-button-text="Registrarse"
                />
            )}
            <Script
                src="https://connect.facebook.net/en_US/sdk.js"
                async
                crossOrigin="anonymous"
                defer
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
                        version: process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || 'v22.0',
                    });
                    if (typeof FB.XFBML?.parse === 'function') {
                        FB.XFBML.parse();
                    }
                }}
            />
        </>
    );
}
