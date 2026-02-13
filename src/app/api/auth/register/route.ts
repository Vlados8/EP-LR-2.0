import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, referralCode } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Alle Felder sind erforderlich' }, { status: 400 });
    }

    // Check if user exists
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: 'E-Mail ist bereits registriert' }, { status: 400 });
    }

    // Find sponsor by referral code
    let sponsorId: number | null = null;
    if (referralCode) {
      const [sponsors] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM users WHERE referral_code = ?',
        [referralCode]
      );
      if (sponsors.length > 0) {
        sponsorId = sponsors[0].id;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const myReferralCode = `EP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const [result] = await pool.query(
      `INSERT INTO users (name, email, phone, password, sponsor_id, referral_code, approved, role, package_type, points)
       VALUES (?, ?, ?, ?, ?, ?, 0, 'user', 'starter', 0)`,
      [name, email, phone || null, hashedPassword, sponsorId, myReferralCode]
    );

    return NextResponse.json({ message: 'Registrierung erfolgreich. Warten Sie auf die Genehmigung.' });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
