import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Public endpoint — no auth required
// Saves project from landing page configurator
export async function POST(req: NextRequest) {
  try {
    const { service_type, client_name, phone, email, address, answers } = await req.json();

    if (!service_type || !client_name || !phone || !address) {
      return NextResponse.json({ error: 'Bitte füllen Sie alle Pflichtfelder aus' }, { status: 400 });
    }

    if (!['PV', 'WP'].includes(service_type)) {
      return NextResponse.json({ error: 'Ungültiger Servicetyp' }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO projects (user_id, service_type, client_name, phone, email, address, answers, status, source)
       VALUES (NULL, ?, ?, ?, ?, ?, ?, 'pending', 'website')`,
      [service_type, client_name, phone, email || null, address, JSON.stringify(answers || {})]
    );

    return NextResponse.json({ message: 'Ihre Anfrage wurde erfolgreich gesendet! Wir melden uns in Kürze bei Ihnen.' });
  } catch (error) {
    console.error('Configurator submit error:', error);
    return NextResponse.json({ error: 'Serverfehler. Bitte versuchen Sie es später erneut.' }, { status: 500 });
  }
}
