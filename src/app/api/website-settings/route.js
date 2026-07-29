import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { SCHOOL_NAME, LOGO_URL, META_TITLE, META_DESCRIPTION } from '@/lib/secret';

async function ensureWebsiteSettingsColumns() {
  try {
    await query(`
      ALTER TABLE website_settings 
      ADD COLUMN IF NOT EXISTS map_url TEXT,
      ADD COLUMN IF NOT EXISTS motto TEXT,
      ADD COLUMN IF NOT EXISTS mission TEXT,
      ADD COLUMN IF NOT EXISTS vission TEXT,
      ADD COLUMN IF NOT EXISTS history TEXT;
    `);
  } catch (err) {
    console.error('Error ensuring website_settings columns:', err);
  }
}

// GET Public Website Settings
export async function GET() {
  try {
    await ensureWebsiteSettingsColumns();

    const res = await query('SELECT * FROM website_settings ORDER BY id ASC LIMIT 1');
    
    const dbSettings = res.rows[0] || {};
    const settings = {
      ...dbSettings,
      school_name: SCHOOL_NAME || dbSettings.school_name || '',
      logo_url: LOGO_URL || '',
      meta_title: META_TITLE || '',
      meta_description: META_DESCRIPTION || ''
    };

    return NextResponse.json({
      success: true,
      payload: { settings },
      paylod: { settings },
      settings
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching website settings:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error'
    }, { status: 500 });
  }
}
