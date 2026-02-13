import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

// POST — public: submit a support message
export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Alle Felder sind erforderlich' }, { status: 400 });
    }

    await pool.query<ResultSetHeader>(
      'INSERT INTO support_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );

    return NextResponse.json({ message: 'Nachricht gesendet' });
  } catch (error) {
    console.error('Support submit error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
