import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// GET — get all settings
export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 });
    }

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM site_settings');
    const settings: Record<string, string> = {};
    rows.forEach((row) => {
      settings[row.setting_key] = row.setting_value;
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

// PUT — update settings
export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 });
    }

    const { settings } = await req.json();

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Ungültige Daten' }, { status: 400 });
    }

    for (const [key, value] of Object.entries(settings)) {
      await pool.query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
    }

    return NextResponse.json({ message: 'Einstellungen gespeichert' });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
