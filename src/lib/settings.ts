import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export interface SiteSettings {
  company_name: string;
  company_address: string;
  company_zip: string;
  company_city: string;
  company_country: string;
  company_ceo: string;
  company_register: string;
  company_vat: string;
  contact_email: string;
  contact_phone: string;
  contact_website: string;
  support_hours: string;
  bank_recipient: string;
  bank_iban: string;
  bank_bic: string;
  bank_name: string;
  [key: string]: string;
}

const DEFAULTS: SiteSettings = {
  company_name: 'EP Energy Platform GmbH',
  company_address: 'Musterstraße 123',
  company_zip: '12345',
  company_city: 'Musterstadt',
  company_country: 'Deutschland',
  company_ceo: 'Max Mustermann',
  company_register: 'AG Musterstadt, HRB 123456',
  company_vat: 'DE123456789',
  contact_email: 'info@energy-platform.de',
  contact_phone: '+49 123 456 789',
  contact_website: 'www.energy-platform.de',
  support_hours: 'Mo – Fr, 9:00 – 17:00 Uhr',
  bank_recipient: 'EP Energy Platform GmbH',
  bank_iban: 'DE89 3704 0044 0532 0130 00',
  bank_bic: 'COBADEFFXXX',
  bank_name: 'Commerzbank',
};

/**
 * Load all site settings from DB (server-side only).
 * Falls back to defaults for missing keys.
 */
export async function getSettings(): Promise<SiteSettings> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT setting_key, setting_value FROM site_settings');
    const settings = { ...DEFAULTS };
    rows.forEach((row) => {
      if (row.setting_value) {
        settings[row.setting_key] = row.setting_value;
      }
    });
    return settings;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return { ...DEFAULTS };
  }
}
