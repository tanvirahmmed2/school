import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

// GET Website Settings
export async function GET() {
  try {
    const res = await query('SELECT * FROM website_settings ORDER BY id ASC LIMIT 1');
    
    if (res.rows.length === 0) {
      // Return a default structure
      return NextResponse.json({
        success: true,
        paylod: {
          settings: {
            school_name: 'School Management Portal',
            site_title: 'My School',
            logo_url: '',
            contact_phone: '',
            contact_email: '',
            address: '',
            facebook_url: '',
            twitter_url: '',
            instagram_url: '',
            youtube_url: '',
            meta_title: '',
            meta_description: ''
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      paylod: { settings: res.rows[0] }
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

    if (!school_name) {
      return NextResponse.json({ success: false, error: 'School name is required' }, { status: 400 });
    }

    // Check if settings row exists
    const checkRes = await query('SELECT id FROM website_settings ORDER BY id ASC LIMIT 1');
    
    let result;
    if (checkRes.rows.length === 0) {
      // Insert
      result = await query(`
        INSERT INTO website_settings (
          school_name, site_title, logo_url, logo_id, contact_phone, contact_email, 
          address, facebook_url, twitter_url, instagram_url, youtube_url, meta_title, meta_description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `, [
        school_name.trim(), site_title?.trim() || null, logo_url || null, logo_id || null,
        contact_phone || null, contact_email || null, address || null,
        facebook_url || null, twitter_url || null, instagram_url || null, youtube_url || null,
        meta_title || null, meta_description || null
      ]);
    } else {
      // Update
      const id = checkRes.rows[0].id;
      result = await query(`
        UPDATE website_settings SET
          school_name = $1, site_title = $2, logo_url = $3, logo_id = $4, contact_phone = $5,
          contact_email = $6, address = $7, facebook_url = $8, twitter_url = $9,
          instagram_url = $10, youtube_url = $11, meta_title = $12, meta_description = $13,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $14
        RETURNING *
      `, [
        school_name.trim(), site_title?.trim() || null, logo_url || null, logo_id || null,
        contact_phone || null, contact_email || null, address || null,
        facebook_url || null, twitter_url || null, instagram_url || null, youtube_url || null,
        meta_title || null, meta_description || null, id
      ]);
    }

    return NextResponse.json({
      success: true,
      message: 'Website settings saved successfully.',
      paylod: { settings: result.rows[0] }
    });
  } catch (error) {
    console.error('Error saving website settings:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error'
    }, { status: 500 });
  }
}
