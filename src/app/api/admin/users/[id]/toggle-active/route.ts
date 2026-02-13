import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// Toggle user active status (enable/disable)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 });
    }

    const { id } = await params;
    const userId = parseInt(id);

    // Don't allow disabling yourself
    if (userId === session.userId) {
      return NextResponse.json({ error: 'Sie können sich nicht selbst deaktivieren' }, { status: 400 });
    }

    // Get current status
    const [users] = await pool.query<RowDataPacket[]>('SELECT active FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
    }

    const newActive = users[0].active ? 0 : 1;
    await pool.query('UPDATE users SET active = ? WHERE id = ?', [newActive, userId]);

    return NextResponse.json({ 
      message: newActive ? 'Benutzer aktiviert' : 'Benutzer deaktiviert',
      active: newActive
    });
  } catch (error) {
    console.error('Toggle active error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
