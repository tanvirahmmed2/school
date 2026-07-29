import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { SCHOOL_NAME, LOGO_URL, META_TITLE, META_DESCRIPTION } from '@/lib/secret';

async function ensureWebsiteSettingsColumns() {
  try {
    await query(`
      ALTER TABLE website_settings 
      ADD COLUMN IF NOT EXISTS map_url TEXT,
      ADD COLUMN IF NOT EXISTS motto TEXT,
      ADD COLUMN IF NOT EXISTS mission TEXT,
      ADD COLUMN IF NOT EXISTS vission TEXT;
    `);
  } catch (err) {
    console.error('Error ensuring website_settings columns in admin API:', err);
  }
}

// GET Website Settings
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

// POST/PUT Upsert Website Settings
export async function POST(request) {
  try {
    const authenticated = await isAdmin();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    await ensureWebsiteSettingsColumns();

    const body = await request.json();
    const {
      map_url,
      motto,
      mission,
      vission,
      contact_phone,
      contact_email,
      address,
      facebook_url,
      twitter_url,
      instagram_url,
      youtube_url,
    } = body;

    // Check if settings row exists
    const checkRes = await query('SELECT id FROM website_settings ORDER BY id ASC LIMIT 1');
    
    let result;
    if (checkRes.rows.length === 0) {
      // Insert
      result = await query(`
        INSERT INTO website_settings (
          map_url, motto, mission, vission,
          contact_phone, contact_email, address,
          facebook_url, twitter_url, instagram_url, youtube_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        map_url?.trim() || null, motto?.trim() || null,
        mission?.trim() || null, vission?.trim() || null,
        contact_phone?.trim() || null, contact_email?.trim() || null,
        address?.trim() || null, facebook_url?.trim() || null,
        twitter_url?.trim() || null, instagram_url?.trim() || null,
        youtube_url?.trim() || null
      ]);
    } else {
      // Update
      const id = checkRes.rows[0].id;
      result = await query(`
        UPDATE website_settings SET
          map_url = $1, motto = $2, mission = $3, vission = $4,
          contact_phone = $5, contact_email = $6, address = $7,
          facebook_url = $8, twitter_url = $9, instagram_url = $10, youtube_url = $11,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $12
        RETURNING *
      `, [
        map_url?.trim() || null, motto?.trim() || null,
        mission?.trim() || null, vission?.trim() || null,
        contact_phone?.trim() || null, contact_email?.trim() || null,
        address?.trim() || null, facebook_url?.trim() || null,
        twitter_url?.trim() || null, instagram_url?.trim() || null,
        youtube_url?.trim() || null, id
      ]);
    }

    const savedSettings = result.rows[0] || {};
    const settings = {
      ...savedSettings,
      school_name: SCHOOL_NAME || savedSettings.school_name || '',
      logo_url: LOGO_URL || '',
      meta_title: META_TITLE || '',
      meta_description: META_DESCRIPTION || ''
    };

    return NextResponse.json({
      success: true,
      message: 'Website settings saved successfully.',
      payload: { settings },
      paylod: { settings },
      settings
    }, { status: 200 });
  } catch (error) {
    console.error('Error saving website settings:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error'
    }, { status: 500 });
  }
}
