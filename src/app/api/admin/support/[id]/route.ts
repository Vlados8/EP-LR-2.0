import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';
import { sendEmail } from '@/lib/email';
import { getSettings } from '@/lib/settings';

// PUT — update support message (mark read, reply)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 });
    }

    const { id } = await params;
    const msgId = parseInt(id);
    const { status, admin_reply } = await req.json();

    // Get message
    const [msgs] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM support_messages WHERE id = ?',
      [msgId]
    );

    if (msgs.length === 0) {
      return NextResponse.json({ error: 'Nachricht nicht gefunden' }, { status: 404 });
    }

    const msg = msgs[0];

    if (status) {
      await pool.query('UPDATE support_messages SET status = ? WHERE id = ?', [status, msgId]);
    }

    if (admin_reply) {
      await pool.query(
        'UPDATE support_messages SET admin_reply = ?, status = ? WHERE id = ?',
        [admin_reply, 'answered', msgId]
      );

      const s = await getSettings();

      // Send reply email
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">⚡ EP — Energy Platform</h1>
          </div>
          <div style="padding: 32px;">
            <p style="font-size: 16px;">Hallo <strong>${msg.name}</strong>,</p>
            <p>Vielen Dank für Ihre Anfrage zum Thema „<strong>${msg.subject}</strong>". Hier ist unsere Antwort:</p>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; white-space: pre-line; color: #1e1b4b;">${admin_reply}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px;">Falls Sie weitere Fragen haben, antworten Sie einfach auf diese E-Mail.</p>
          </div>
          <div style="background: #f9fafb; padding: 16px 32px; text-align: center; font-size: 12px; color: #9ca3af;">
            ${s.company_name} — Support
          </div>
        </div>
      `;
      await sendEmail(msg.email, `Antwort: ${msg.subject} — EP Support`, html);
    }

    return NextResponse.json({ message: 'Aktualisiert' });
  } catch (error) {
    console.error('Admin support update error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

// DELETE — delete support message
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Zugriff verweigert' }, { status: 403 });
    }

    const { id } = await params;
    await pool.query('DELETE FROM support_messages WHERE id = ?', [parseInt(id)]);
    return NextResponse.json({ message: 'Gelöscht' });
  } catch (error) {
    console.error('Admin support delete error:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
