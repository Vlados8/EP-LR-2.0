import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// Update user package
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    const { package_type } = await req.json();

    const validPackages = ['starter', 'popular', 'business', 'premium'];
    if (!validPackages.includes(package_type)) {
      return NextResponse.json({ error: 'Ungültiger Pakettyp' }, { status: 400 });
    }

    await pool.query('UPDATE users SET package_type = ? WHERE id = ?', [package_type, userId]);
    return NextResponse.json({ message: 'Paket aktualisiert' });
  } catch (error) {
    console.error('Package update error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
