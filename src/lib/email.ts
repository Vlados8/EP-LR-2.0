import nodemailer from 'nodemailer';
import { getSettings } from '@/lib/settings';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: (process.env.SMTP_PASS || '').replace(/^"|"$/g, ''),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

export async function sendApprovalEmail(email: string, name: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4f46e5;">Willkommen bei EP!</h2>
      <p>Hallo ${name},</p>
      <p>Ihr Konto wurde genehmigt. Sie können sich jetzt anmelden und die Plattform nutzen.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" 
         style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
        Jetzt anmelden
      </a>
    </div>
  `;
  return sendEmail(email, 'Ihr Konto wurde genehmigt — EP', html);
}

const PACKAGE_LABELS: Record<string, string> = {
  popular: 'Popular (Start Pack)',
  business: 'Business (Standard Pack)',
  premium: 'Premium Pack',
};

const PACKAGE_PRICES: Record<string, string> = {
  popular: '49,00 €',
  business: '99,00 €',
  premium: '199,00 €',
};

export async function sendPaymentEmail(
  email: string,
  name: string,
  orderId: string,
  packageType: string
) {
  const packageLabel = PACKAGE_LABELS[packageType] || packageType;
  const price = PACKAGE_PRICES[packageType] || '—';
  const paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/${orderId}`;
  const s = await getSettings();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">⚡ EP — Energy Platform</h1>
      </div>
      <div style="padding: 32px;">
        <p style="font-size: 16px;">Hallo <strong>${name}</strong>,</p>
        <p>vielen Dank für Ihre Bestellung! Hier sind Ihre Zahlungsinformationen:</p>
        
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Zahlungs-ID (Referenz):</td>
              <td style="padding: 8px 0; text-align: right;">
                <strong style="color: #4f46e5; font-size: 18px; font-family: monospace;">${orderId}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Paket:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold;">${packageLabel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Betrag:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; font-size: 18px;">${price}</td>
            </tr>
          </table>
        </div>

        <h2 style="font-size: 16px; color: #111827; margin: 24px 0 12px 0;">🏦 Überweisungsdaten</h2>
        <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 12px; padding: 20px; margin: 0 0 24px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Empfänger:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #1e1b4b;">${s.bank_recipient}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">IBAN:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; font-family: monospace; color: #1e1b4b;">${s.bank_iban}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">BIC:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; font-family: monospace; color: #1e1b4b;">${s.bank_bic}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Bank:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #1e1b4b;">${s.bank_name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Betrag:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; font-size: 16px; color: #1e1b4b;">${price}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Verwendungszweck:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; font-family: monospace; font-size: 16px; color: #4f46e5;">${orderId}</td>
            </tr>
          </table>
        </div>

        <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            <strong>⚠ Wichtig:</strong> Bitte geben Sie bei der Überweisung unbedingt die Zahlungs-ID 
            <strong style="font-family: monospace;">${orderId}</strong> als Verwendungszweck an.
          </p>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${paymentUrl}" 
             style="display: inline-block; background: #4f46e5; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">
            Zahlungsdetails ansehen
          </a>
        </div>
      </div>
      <div style="background: #f9fafb; padding: 16px 32px; text-align: center; font-size: 12px; color: #9ca3af;">
        Bei Fragen kontaktieren Sie uns unter ${s.contact_email}
      </div>
    </div>
  `;
  return sendEmail(email, `Zahlungsdetails — Bestellung ${orderId} — EP`, html);
}

export async function sendOrderConfirmationEmail(
  email: string,
  name: string,
  orderId: string,
  packageType: string
) {
  const packageLabel = PACKAGE_LABELS[packageType] || packageType;
  const s = await getSettings();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">✅ Zahlung bestätigt!</h1>
      </div>
      <div style="padding: 32px;">
        <p style="font-size: 16px;">Hallo <strong>${name}</strong>,</p>
        <p>Ihre Zahlung für die Bestellung <strong style="font-family: monospace; color: #4f46e5;">${orderId}</strong> wurde erfolgreich bestätigt!</p>
        
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Ihr neues Paket</p>
          <p style="margin: 0; font-size: 24px; font-weight: bold; color: #15803d;">${packageLabel}</p>
          <p style="margin: 8px 0 0 0; color: #16a34a; font-size: 14px;">ist jetzt aktiv! 🎉</p>
        </div>

        <p>Alle Vorteile Ihres Pakets stehen Ihnen ab sofort zur Verfügung. Melden Sie sich in Ihrem Dashboard an, um loszulegen.</p>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
             style="display: inline-block; background: #16a34a; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">
            Zum Dashboard
          </a>
        </div>
      </div>
      <div style="background: #f9fafb; padding: 16px 32px; text-align: center; font-size: 12px; color: #9ca3af;">
        Vielen Dank für Ihr Vertrauen! — ${s.company_name}
      </div>
    </div>
  `;
  return sendEmail(email, `Zahlung bestätigt — ${packageLabel} aktiviert — EP`, html);
}
