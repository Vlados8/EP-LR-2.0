import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// GET — list all orders (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = `
      SELECT po.*, u.name as user_name, u.email as user_email, u.package_type as user_package
      FROM package_orders po
      JOIN users u ON po.user_id = u.id
    `;
    const conditions: string[] = [];
    const params: any[] = [];

    if (status && status !== 'all') {
      conditions.push('po.status = ?');
      params.push(status);
    }

    if (search) {
      conditions.push(
        '(po.order_id LIKE ? OR u.name LIKE ? OR u.email LIKE ?)'
      );
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY po.created_at DESC';

    const [orders] = await pool.query<RowDataPacket[]>(query, params);

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Admin get orders error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
