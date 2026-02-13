import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, phone, role, approved, active, package_type, points, referral_code, sponsor_id, created_at FROM users WHERE id = ?',
      [session.userId]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
    }

    // Block disabled users
    if (!users[0].active) {
      return NextResponse.json({ error: 'Konto deaktiviert' }, { status: 403 });
    }

    return NextResponse.json({ user: users[0] });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
