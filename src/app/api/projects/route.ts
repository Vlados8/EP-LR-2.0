import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// Create project
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    // Check if user is approved
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT approved FROM users WHERE id = ?',
      [session.userId]
    );
    if (users.length === 0 || !users[0].approved) {
      return NextResponse.json({ error: 'Konto nicht genehmigt' }, { status: 403 });
    }

    const { service_type, client_name, phone, address, answers } = await req.json();

    if (!service_type || !client_name || !phone || !address) {
      return NextResponse.json({ error: 'Alle Pflichtfelder ausfüllen' }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO projects (user_id, service_type, client_name, phone, address, answers, status, source)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', 'partner')`,
      [session.userId, service_type, client_name, phone, address, JSON.stringify(answers || {})]
    );

    return NextResponse.json({ message: 'Projekt erstellt' });
  } catch (error) {
    console.error('Project create error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

// Get my projects
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const [projects] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC',
      [session.userId]
    );

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Projects list error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
