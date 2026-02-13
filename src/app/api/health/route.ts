import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check - app is running
    // DB connectivity is checked separately during init
    return NextResponse.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Health check failed' },
      { status: 503 }
    );
  }
}
