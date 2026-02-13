import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET — list user's payouts
export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const [payouts] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM payouts WHERE user_id = ? ORDER BY created_at DESC',
      [session.userId]
    );

    return NextResponse.json({ payouts });
  } catch (error) {
    console.error('Payouts list error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

// POST — create a new payout request
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const { firstName, lastName, recipient, iban, points } = await req.json();

    if (!firstName || !lastName || !recipient || !iban || !points) {
      return NextResponse.json({ error: 'Alle Felder sind erforderlich' }, { status: 400 });
    }

    const pointsNum = parseInt(points);
    if (isNaN(pointsNum) || pointsNum <= 0) {
      return NextResponse.json({ error: 'Ungültige Punkteanzahl' }, { status: 400 });
    }

    // Check user has enough points
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT points FROM users WHERE id = ?',
      [session.userId]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
    }

    // Calculate pending payouts
    const [pendingPayouts] = await pool.query<RowDataPacket[]>(
      'SELECT COALESCE(SUM(points), 0) as pending_points FROM payouts WHERE user_id = ? AND status = ?',
      [session.userId, 'pending']
    );

    const availablePoints = users[0].points - (pendingPayouts[0]?.pending_points || 0);

    if (pointsNum > availablePoints) {
      return NextResponse.json({ error: `Nicht genügend verfügbare Punkte. Verfügbar: ${availablePoints}` }, { status: 400 });
    }

    // Amount is 1:1  (1 point = 1 EUR)
    const amount = pointsNum;

    await pool.query<ResultSetHeader>(
      'INSERT INTO payouts (user_id, first_name, last_name, recipient, iban, points, amount) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [session.userId, firstName, lastName, recipient, iban, pointsNum, amount]
    );

    return NextResponse.json({ message: 'Auszahlungsantrag erstellt', amount });
  } catch (error) {
    console.error('Payout create error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
