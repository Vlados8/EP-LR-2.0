import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// Update user role (admin only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    const { role } = await req.json();

    if (!role || !['user', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Ungültige Rolle' }, { status: 400 });
    }

    // Prevent admin from changing their own role
    if (session.userId === userId) {
      return NextResponse.json({ error: 'Sie können Ihre eigene Rolle nicht ändern' }, { status: 400 });
    }

    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);

    return NextResponse.json({ message: 'Rolle aktualisiert', role });
  } catch (error: any) {
    console.error('Role change error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
