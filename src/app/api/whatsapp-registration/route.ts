import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Validate Bearer token
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const data = await request.json();
    console.log('Registration event data:', data);
    return NextResponse.json({ message: 'Registration event sent successfully' });
  } catch (error: any) {
    console.error('Error in whatsapp-registration API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
