import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// GET — list all payouts (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const userId = searchParams.get('user_id');

    let query = `
      SELECT p.*, u.name as user_name, u.email as user_email
      FROM payouts p
      JOIN users u ON p.user_id = u.id
    `;
    const conditions: string[] = [];
    const params: any[] = [];

    if (userId) {
      conditions.push('p.user_id = ?');
      params.push(parseInt(userId));
    }

    if (status && status !== 'all') {
      conditions.push('p.status = ?');
      params.push(status);
    }

    if (search) {
      conditions.push(
        '(u.name LIKE ? OR u.email LIKE ? OR p.first_name LIKE ? OR p.last_name LIKE ? OR p.recipient LIKE ?)'
      );
      const s = `%${search}%`;
      params.push(s, s, s, s, s);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY p.created_at DESC';

    const [payouts] = await pool.query<RowDataPacket[]>(query, params);

    return NextResponse.json({ payouts });
  } catch (error) {
    console.error('Admin payouts error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
