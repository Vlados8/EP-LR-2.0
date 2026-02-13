import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// Admin: get all projects
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 });
    }

    const status = req.nextUrl.searchParams.get('status');
    const type = req.nextUrl.searchParams.get('type');
    const search = req.nextUrl.searchParams.get('search');
    const userId = req.nextUrl.searchParams.get('user_id');

    let query = `SELECT p.*, u.name as user_name, u.email as user_email 
                 FROM projects p LEFT JOIN users u ON p.user_id = u.id WHERE 1=1`;
    const params: any[] = [];

    if (userId) {
      query += ' AND p.user_id = ?';
      params.push(parseInt(userId));
    }
    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }
    if (type) {
      query += ' AND p.service_type = ?';
      params.push(type);
    }
    if (search) {
      query += ' AND (p.client_name LIKE ? OR p.phone LIKE ? OR p.address LIKE ? OR p.email LIKE ? OR u.name LIKE ? OR u.email LIKE ? OR CAST(p.user_id AS CHAR) = ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, search);
    }

    query += ' ORDER BY p.created_at DESC';

    const [projects] = await pool.query<RowDataPacket[]>(query, params);
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Admin projects error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
