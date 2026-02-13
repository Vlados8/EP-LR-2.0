import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// Public GET — returns all site settings (no auth required)
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT setting_key, setting_value FROM site_settings');
    const settings: Record<string, string> = {};
    rows.forEach((row) => {
      settings[row.setting_key] = row.setting_value;
    });
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Public settings GET error:', error);
    return NextResponse.json({ settings: {} });
  }
}
