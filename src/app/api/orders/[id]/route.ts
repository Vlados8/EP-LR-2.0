import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET — get order by orderId (public, no auth required so user can view payment page)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT po.*, u.name as user_name, u.email as user_email
       FROM package_orders po
       JOIN users u ON po.user_id = u.id
       WHERE po.order_id = ?`,
      [orderId]
    );

    if ((rows as RowDataPacket[]).length === 0) {
      return NextResponse.json(
        { error: 'Bestellung nicht gefunden' },
        { status: 404 }
      );
    }

    const order = (rows as RowDataPacket[])[0];

    // Return limited info (no sensitive data)
    return NextResponse.json({
      order: {
        order_id: order.order_id,
        package_type: order.package_type,
        amount: order.amount,
        status: order.status,
        created_at: order.created_at,
        user_name: order.user_name,
      },
    });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
