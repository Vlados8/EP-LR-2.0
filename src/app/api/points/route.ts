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

    const [transactions] = await pool.query<RowDataPacket[]>(
      `SELECT pt.*, p.service_type, p.client_name 
       FROM point_transactions pt 
       LEFT JOIN projects p ON pt.project_id = p.id 
       WHERE pt.user_id = ? 
       ORDER BY pt.created_at DESC`,
      [session.userId]
    );

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Points error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
