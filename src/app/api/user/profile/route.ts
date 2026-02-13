import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';

// Update user profile
export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const { name, email, phone, currentPassword, newPassword } = await req.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: 'Name und E-Mail sind erforderlich' }, { status: 400 });
    }

    // Check if email is taken by another user
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, session.userId]
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Diese E-Mail wird bereits verwendet' }, { status: 400 });
    }

    // If changing password, verify current password first
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Aktuelles Passwort ist erforderlich' }, { status: 400 });
      }

      const [users] = await pool.query<RowDataPacket[]>(
        'SELECT password FROM users WHERE id = ?',
        [session.userId]
      );

      const isValid = await bcrypt.compare(currentPassword, users[0].password);
      if (!isValid) {
        return NextResponse.json({ error: 'Aktuelles Passwort ist falsch' }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Neues Passwort muss mindestens 6 Zeichen lang sein' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await pool.query(
        'UPDATE users SET name = ?, email = ?, phone = ?, password = ? WHERE id = ?',
        [name, email, phone || null, hashedPassword, session.userId]
      );
    } else {
      await pool.query(
        'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
        [name, email, phone || null, session.userId]
      );
    }

    // Return updated user
    const [updated] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, phone, role, approved, active, package_type, points, referral_code, sponsor_id, created_at FROM users WHERE id = ?',
      [session.userId]
    );

    return NextResponse.json({ message: 'Profil aktualisiert', user: updated[0] });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
