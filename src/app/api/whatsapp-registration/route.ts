import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const apiUrl = process.env.REGISTRATION_API_URL;
    if (!apiUrl) {
      return NextResponse.json({ error: 'REGISTRATION_API_URL not configured' }, { status: 500 });
    }
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: 'Failed to register', details: errorText }, { status: response.status });
    }
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in whatsapp-registration API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}