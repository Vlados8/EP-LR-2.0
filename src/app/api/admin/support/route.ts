import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// GET — list all support messages
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = 'SELECT * FROM support_messages';
    const conditions: string[] = [];
    const params: any[] = [];

    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ? OR subject LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const [messages] = await pool.query<RowDataPacket[]>(query, params);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Admin support error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
