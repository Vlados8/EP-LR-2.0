import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { sendPaymentEmail } from '@/lib/email';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

function generateOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'EP-';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

const PACKAGE_AMOUNTS: Record<string, number> = {
  popular: 49.0,
  business: 99.0,
  premium: 199.0,
};

const PACKAGE_LEVELS: Record<string, number> = {
  starter: 0,
  popular: 1,
  business: 2,
  premium: 3,
};

// POST — create a new package order
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const { packageType } = await request.json();

    if (!['popular', 'business', 'premium'].includes(packageType)) {
      return NextResponse.json({ error: 'Ungültiges Paket' }, { status: 400 });
    }

    // Get user's current package to validate upgrade
    const [userRows] = await pool.query<RowDataPacket[]>(
      'SELECT package_type FROM users WHERE id = ?',
      [user.userId]
    );

    if ((userRows as RowDataPacket[]).length === 0) {
      return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
    }

    const currentPackage = (userRows as RowDataPacket[])[0].package_type || 'starter';
    const currentLevel = PACKAGE_LEVELS[currentPackage] ?? 0;
    const requestedLevel = PACKAGE_LEVELS[packageType] ?? 0;

    if (requestedLevel <= currentLevel) {
      return NextResponse.json(
        { error: 'Sie können nur ein höheres Paket als Ihr aktuelles wählen.' },
        { status: 400 }
      );
    }

    const amount = PACKAGE_AMOUNTS[packageType];
    const orderId = generateOrderId();

    // Check for existing pending order
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM package_orders WHERE user_id = ? AND status = "pending"',
      [user.userId]
    );

    if ((existing as RowDataPacket[]).length > 0) {
      // Cancel old pending order
      await pool.query(
        'UPDATE package_orders SET status = "cancelled" WHERE user_id = ? AND status = "pending"',
        [user.userId]
      );
    }

    // Create new order
    await pool.query<ResultSetHeader>(
      'INSERT INTO package_orders (order_id, user_id, package_type, amount, status) VALUES (?, ?, ?, ?, "pending")',
      [orderId, user.userId, packageType, amount]
    );

    // Send payment email
    try {
      await sendPaymentEmail(user.email, user.name, orderId, packageType);
    } catch (emailErr) {
      console.error('Failed to send payment email:', emailErr);
    }

    return NextResponse.json({ orderId, amount, packageType });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

// GET — get current user's orders
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const [orders] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM package_orders WHERE user_id = ? ORDER BY created_at DESC',
      [user.userId]
    );

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
