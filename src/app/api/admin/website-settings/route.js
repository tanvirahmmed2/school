import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { SCHOOL_NAME, LOGO_URL, META_TITLE, META_DESCRIPTION } from '@/lib/secret';

// GET Website Settings
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
      paylod: { settings }
    });
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

    const body = await request.json();
    const {
      school_name,
      site_title,
      logo_url,
      logo_id,
      contact_phone,
      contact_email,
      address,
      facebook_url,
      twitter_url,
      instagram_url,
      youtube_url,
      meta_title,
      meta_description
    } = body;

    const schoolNameValue = SCHOOL_NAME || school_name;
    if (!schoolNameValue) {
      return NextResponse.json({ success: false, error: 'School name is required' }, { status: 400 });
    }

    // Check if settings row exists
    const checkRes = await query('SELECT id FROM website_settings ORDER BY id ASC LIMIT 1');
    
    let result;
    if (checkRes.rows.length === 0) {
      // Insert
      result = await query(`
        INSERT INTO website_settings (
          site_title, logo_id, contact_phone, contact_email, 
          address, facebook_url, twitter_url, instagram_url, youtube_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        site_title?.trim() || null, logo_id || null,
        contact_phone || null, contact_email || null, address || null,
        facebook_url || null, twitter_url || null, instagram_url || null, youtube_url || null
      ]);
    } else {
      // Update
      const id = checkRes.rows[0].id;
      result = await query(`
        UPDATE website_settings SET
          site_title = $1, logo_id = $2, contact_phone = $3,
          contact_email = $4, address = $5, facebook_url = $6, twitter_url = $7,
          instagram_url = $8, youtube_url = $9,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $10
        RETURNING *
      `, [
        site_title?.trim() || null, logo_id || null,
        contact_phone || null, contact_email || null, address || null,
        facebook_url || null, twitter_url || null, instagram_url || null, youtube_url || null,
        id
      ]);
    }

    const savedSettings = result.rows[0] || {};
    const settings = {
      ...savedSettings,
      school_name: SCHOOL_NAME || schoolNameValue || 'School Management Portal',
      logo_url: LOGO_URL || logo_url || '',
      meta_title: META_TITLE || meta_title || '',
      meta_description: META_DESCRIPTION || meta_description || ''
    };

    return NextResponse.json({
      success: true,
      message: 'Website settings saved successfully.',
      paylod: { settings }
    });
  } catch (error) {
    console.error('Error saving website settings:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error'
    }, { status: 500 });
  }
}

