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

    // Get direct referrals
    const [referrals] = await pool.query<RowDataPacket[]>(
      `SELECT id, name, email, points, package_type, created_at, approved 
       FROM users WHERE sponsor_id = ? ORDER BY created_at DESC`,
      [session.userId]
    );

    // Get team tree (3 levels)
    const tree = await buildTeamTree(session.userId, 1);

    // Get total team count
    const [countResult] = await pool.query<RowDataPacket[]>(
      `WITH RECURSIVE team AS (
         SELECT id FROM users WHERE sponsor_id = ?
         UNION ALL
         SELECT u.id FROM users u INNER JOIN team t ON u.sponsor_id = t.id
       )
       SELECT COUNT(*) as total FROM team`,
      [session.userId]
    );

    return NextResponse.json({
      referrals,
      tree,
      totalTeam: countResult[0]?.total || 0,
    });
  } catch (error) {
    console.error('Team error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

async function buildTeamTree(userId: number, level: number): Promise<any[]> {
  if (level > 3) return [];

  const [children] = await pool.query<RowDataPacket[]>(
    'SELECT id, name, email, points, package_type FROM users WHERE sponsor_id = ?',
    [userId]
  );

  const result = [];
  for (const child of children) {
    const subChildren = await buildTeamTree(child.id, level + 1);
    result.push({
      ...child,
      level,
      children: subChildren,
    });
  }

  return result;
}
