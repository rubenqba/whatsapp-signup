import { NextResponse } from 'next/server';
import { createAxiosInstance } from '@/lib/axios-config';

export async function GET(request: Request) {
  // Validate Bearer token
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Use axios instance with dynamic access token to get user numbers available
  const client = createAxiosInstance(token);

  return client
    .get('/api/twilio/numbers')
    .then(res => {
      console.log('Numbers API response:', res.data);
      return NextResponse.json(res.data);
    })
    .catch(error => {
      console.error('Error fetching numbers:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    });
}
