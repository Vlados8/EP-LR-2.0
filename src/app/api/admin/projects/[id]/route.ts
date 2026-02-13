import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { calculatePoints, BASE_PROJECT_POINTS, PackageType } from '@/lib/points';
import { RowDataPacket } from 'mysql2';

// Approve or reject project
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 });
    }

    const { id } = await params;
    const projectId = parseInt(id);
    const { status } = await req.json();

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Ungültiger Status' }, { status: 400 });
    }

    // Check current project status
    const [projects] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM projects WHERE id = ?',
      [projectId]
    );

    if (projects.length === 0) {
      return NextResponse.json({ error: 'Projekt nicht gefunden' }, { status: 404 });
    }

    const project = projects[0];
    if (project.status !== 'pending') {
      return NextResponse.json({ error: 'Projekt wurde bereits bearbeitet' }, { status: 400 });
    }

    await pool.query('UPDATE projects SET status = ? WHERE id = ?', [status, projectId]);

    // If approved, distribute points
    if (status === 'approved') {
      await distributePoints(project.user_id, projectId);
    }

    return NextResponse.json({ message: `Projekt ${status === 'approved' ? 'genehmigt' : 'abgelehnt'}` });
  } catch (error) {
    console.error('Project status error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

async function distributePoints(authorId: number, projectId: number) {
  // Award base points to author (level 0)
  const authorPoints = BASE_PROJECT_POINTS;
  await pool.query(
    'INSERT INTO point_transactions (user_id, project_id, points, level) VALUES (?, ?, ?, 0)',
    [authorId, projectId, authorPoints]
  );
  await pool.query('UPDATE users SET points = points + ? WHERE id = ?', [authorPoints, authorId]);

  // Walk up the sponsor chain for levels 1-3
  let currentUserId = authorId;
  for (let level = 1; level <= 3; level++) {
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT sponsor_id FROM users WHERE id = ?',
      [currentUserId]
    );

    if (users.length === 0 || !users[0].sponsor_id) break;

    const sponsorId = users[0].sponsor_id;

    // Get sponsor's package type
    const [sponsors] = await pool.query<RowDataPacket[]>(
      'SELECT package_type FROM users WHERE id = ?',
      [sponsorId]
    );

    if (sponsors.length === 0) break;

    const packageType = (sponsors[0].package_type || 'starter') as PackageType;
    const points = calculatePoints(BASE_PROJECT_POINTS, level, packageType);

    if (points > 0) {
      await pool.query(
        'INSERT INTO point_transactions (user_id, project_id, points, level) VALUES (?, ?, ?, ?)',
        [sponsorId, projectId, points, level]
      );
      await pool.query('UPDATE users SET points = points + ? WHERE id = ?', [points, sponsorId]);
    }

    currentUserId = sponsorId;
  }
}
