import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { SCHOOL_NAME, LOGO_URL, META_TITLE, META_DESCRIPTION } from '@/lib/secret';

// GET Public Website Settings
export async function GET() {
  try {
    const res = await query('SELECT * FROM website_settings ORDER BY id ASC LIMIT 1');
    
    const dbSettings = res.rows[0] || {};
    const settings = {
      ...dbSettings,
      school_name: SCHOOL_NAME || dbSettings.school_name || 'School Management Portal',
      logo_url: LOGO_URL || dbSettings.logo_url || '',
      meta_title: META_TITLE || dbSettings.meta_title || '',
      meta_description: META_DESCRIPTION || dbSettings.meta_description || ''
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
