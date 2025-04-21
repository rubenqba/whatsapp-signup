"use client";

import React, { useEffect, useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { loginRequest } from '@/auth/msalConfig';
import { SignInButton } from '@/components/Authentication';
import { TwilioPhoneNumber } from '@/lib/models';
import WhatsAppSignup from '@/components/WhatsAppSignup';
// MUI Joy components
import Table from '@mui/joy/Table';

/**
 * Dashboard page: shows a list of numbers associated to the authenticated user.
 * Redirects to sign-in if not authenticated.
 */
export default function DashboardPage() {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const [numbers, setNumbers] = useState<TwilioPhoneNumber[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Action handler is handled by WhatsAppSignup component per row
  // (previous handleAction is no longer required)

  useEffect(() => {
    if (inProgress === InteractionStatus.Startup) {
      return;
    }
    if (!isAuthenticated) {
      return;
    }

    const account = instance.getActiveAccount() || instance.getAllAccounts()[0];
    if (!account) {
      setError('No account found');
      return;
    }

    instance.acquireTokenSilent({ ...loginRequest, account })
      .then(tokenResponse => {
        return fetch('/api/numbers', {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        });
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error fetching numbers: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setNumbers(data);
        } else if (data.numbers && Array.isArray(data.numbers)) {
          setNumbers(data.numbers);
        } else {
          throw new Error('Unexpected response format');
        }
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      });
  }, [inProgress, isAuthenticated, instance]);

  if (inProgress === InteractionStatus.Startup) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <SignInButton />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}
      {!error && (
        <Table size="md" variant="outlined" sx={{ minWidth: 400 }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Phone Number</th>
              <th>Origin</th>
              <th>Requirements</th>
              <th>Status</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {numbers.length > 0 ? (
              numbers.map((num, idx) => (
                <tr key={num.id}>
                  <td>{idx + 1}</td>
                  <td>{num.number}</td>
                  <td>{num.origin}</td>
                  <td>{num.requirements.type}</td>
                  <td>{num.status}</td>
                  <td>{new Date(num.created).toLocaleString()}</td>
                  <td>{new Date(num.updated).toLocaleString()}</td>
                  <td>
                    <WhatsAppSignup row={num} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center' }}>
                  No numbers found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
}