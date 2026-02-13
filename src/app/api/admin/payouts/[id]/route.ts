import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// PUT — update payout status (admin only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 });
    }

    const { id } = await params;
    const payoutId = parseInt(id);
    const { status } = await req.json();

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Ungültiger Status' }, { status: 400 });
    }

    // Get payout details
    const [payouts] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM payouts WHERE id = ?',
      [payoutId]
    );

    if (payouts.length === 0) {
      return NextResponse.json({ error: 'Auszahlung nicht gefunden' }, { status: 404 });
    }

    const payout = payouts[0];

    if (payout.status !== 'pending') {
      return NextResponse.json({ error: 'Auszahlung wurde bereits bearbeitet' }, { status: 400 });
    }

    // If approving, deduct points from user
    if (status === 'approved') {
      // Re-check user has enough points
      const [users] = await pool.query<RowDataPacket[]>(
        'SELECT points FROM users WHERE id = ?',
        [payout.user_id]
      );

      if (users.length === 0 || users[0].points < payout.points) {
        return NextResponse.json({ error: 'Benutzer hat nicht genügend Punkte' }, { status: 400 });
      }

      // Deduct points
      await pool.query(
        'UPDATE users SET points = points - ? WHERE id = ?',
        [payout.points, payout.user_id]
      );
    }

    // Update payout status
    await pool.query(
      'UPDATE payouts SET status = ? WHERE id = ?',
      [status, payoutId]
    );

    return NextResponse.json({ 
      message: status === 'approved' ? 'Auszahlung genehmigt' : 'Auszahlung abgelehnt' 
    });
  } catch (error) {
    console.error('Admin payout update error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
