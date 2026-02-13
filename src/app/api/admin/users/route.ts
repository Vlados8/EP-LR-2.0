import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// Get all users (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 });
    }

    const status = req.nextUrl.searchParams.get('status'); // approved / pending
    const search = req.nextUrl.searchParams.get('search');

    let query = 'SELECT id, name, email, role, approved, active, package_type, points, referral_code, sponsor_id, created_at FROM users WHERE 1=1';
    const params: any[] = [];

    if (status === 'pending') {
      query += ' AND approved = 0';
    } else if (status === 'approved') {
      query += ' AND approved = 1';
    } else if (status === 'disabled') {
      query += ' AND active = 0';
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [users] = await pool.query<RowDataPacket[]>(query, params);
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Users list error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
