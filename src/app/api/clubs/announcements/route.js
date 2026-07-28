import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin, isRegister } from '@/lib/auth';

// Helper for auto migration
async function ensureTableExists() {
  await query(`
    CREATE TABLE IF NOT EXISTS club_announcements (
        id BIGSERIAL PRIMARY KEY,
        club_id BIGINT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        is_important BOOLEAN DEFAULT FALSE,
        expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// GET all club announcements
export async function GET(request) {
  try {
    await ensureTableExists();

    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get('club_id');

    let sql = `
      SELECT ca.*, c.name AS club_name
      FROM club_announcements ca
      JOIN clubs c ON ca.club_id = c.id
    `;
    const params = [];

    if (clubId) {
      sql += ` WHERE ca.club_id = $1`;
      params.push(clubId);
    }

    sql += ` ORDER BY ca.is_important DESC, ca.created_at DESC`;

    const result = await query(sql, params);
    const payload = { announcements: result.rows };

    return NextResponse.json({
      success: true,
      message: 'Successfully fetched club announcements',
      paylod: payload,
      payload: payload
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching club announcements:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve club announcements',
      error: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}

// POST create club announcement (Admin / Staff)
export async function POST(request) {
  try {
    await ensureTableExists();
    const authenticated = (await isAdmin()) || (await isRegister());

    if (!authenticated) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. Admins and registrars only.'
      }, { status: 403 });
    }

    const { club_id, title, content, is_important, expires_at } = await request.json();

    if (!club_id || !title || !content) {
      return NextResponse.json({
        success: false,
        message: 'Club, title, and content are required.'
      }, { status: 400 });
    }

    const result = await query(`
      INSERT INTO club_announcements (club_id, title, content, is_important, expires_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [club_id, title, content, Boolean(is_important), expires_at || null]);

    const announcement = result.rows[0];

    // Fetch club name
    const clubRes = await query(`SELECT name FROM clubs WHERE id = $1`, [club_id]);
    announcement.club_name = clubRes.rows[0]?.name || 'Club';

    const payload = { announcement };

    return NextResponse.json({
      success: true,
      message: 'Club announcement created successfully',
      paylod: payload,
      payload: payload
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating club announcement:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create club announcement',
      error: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}
