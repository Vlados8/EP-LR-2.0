import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// User selects a package
export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const { package_type } = await req.json();

    const validPackages = ['popular', 'business', 'premium'];
    if (!validPackages.includes(package_type)) {
      return NextResponse.json({ error: 'Ungültiger Pakettyp' }, { status: 400 });
    }

    await pool.query(
      'UPDATE users SET package_type = ? WHERE id = ?',
      [package_type, session.userId]
    );

    return NextResponse.json({ message: 'Paket ausgewählt' });
  } catch (error) {
    console.error('Package select error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
