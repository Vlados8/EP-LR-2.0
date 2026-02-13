import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 });
    }

    const [totalUsers] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM users');
    const [approvedUsers] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM users WHERE approved = 1');
    const [pendingUsers] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM users WHERE approved = 0');
    const [totalProjects] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM projects');
    const [pendingProjects] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM projects WHERE status = 'pending'");
    const [approvedProjects] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM projects WHERE status = 'approved'");
    const [totalPoints] = await pool.query<RowDataPacket[]>('SELECT COALESCE(SUM(points), 0) as total FROM point_transactions');

    // Recent activity
    const [recentUsers] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5'
    );
    const [recentProjects] = await pool.query<RowDataPacket[]>(
      `SELECT p.id, p.service_type, p.client_name, p.status, p.created_at, u.name as user_name 
       FROM projects p JOIN users u ON p.user_id = u.id 
       ORDER BY p.created_at DESC LIMIT 5`
    );

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers[0].count,
        approvedUsers: approvedUsers[0].count,
        pendingUsers: pendingUsers[0].count,
        totalProjects: totalProjects[0].count,
        pendingProjects: pendingProjects[0].count,
        approvedProjects: approvedProjects[0].count,
        totalPoints: totalPoints[0].total,
      },
      recentUsers,
      recentProjects,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
