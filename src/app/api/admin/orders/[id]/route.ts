import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { RowDataPacket } from 'mysql2';

// PUT — update order status (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 });
    }

    const { id: orderId } = await params;
    const { status } = await request.json();

    if (!['pending', 'paid', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Ungültiger Status' }, { status: 400 });
    }

    // Get order details
    const [orders] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM package_orders WHERE order_id = ?',
      [orderId]
    );

    if ((orders as RowDataPacket[]).length === 0) {
      return NextResponse.json(
        { error: 'Bestellung nicht gefunden' },
        { status: 404 }
      );
    }

    const order = (orders as RowDataPacket[])[0];

    // Update order status
    await pool.query(
      'UPDATE package_orders SET status = ? WHERE order_id = ?',
      [status, orderId]
    );

    // If marking as paid, also approve user and set their package
    if (status === 'paid') {
      await pool.query(
        'UPDATE users SET package_type = ?, approved = TRUE WHERE id = ?',
        [order.package_type, order.user_id]
      );

      // Send confirmation email to the user
      try {
        const [userRows] = await pool.query<RowDataPacket[]>(
          'SELECT name, email FROM users WHERE id = ?',
          [order.user_id]
        );
        if ((userRows as RowDataPacket[]).length > 0) {
          const u = (userRows as RowDataPacket[])[0];
          await sendOrderConfirmationEmail(u.email, u.name, orderId, order.package_type);
        }
      } catch (emailErr) {
        console.error('Failed to send order confirmation email:', emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin update order error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
