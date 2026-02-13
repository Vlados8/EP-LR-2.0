import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { sendApprovalEmail } from '@/lib/email';
import { RowDataPacket } from 'mysql2';

// Approve user
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 });
    }

    const { id } = await params;
    const userId = parseInt(id);

    await pool.query('UPDATE users SET approved = 1 WHERE id = ?', [userId]);

    // Send approval email
    const [users] = await pool.query<RowDataPacket[]>('SELECT name, email FROM users WHERE id = ?', [userId]);
    if (users.length > 0) {
      sendApprovalEmail(users[0].email, users[0].name).catch(console.error);
    }

    return NextResponse.json({ message: 'Benutzer genehmigt' });
  } catch (error) {
    console.error('Approve error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
