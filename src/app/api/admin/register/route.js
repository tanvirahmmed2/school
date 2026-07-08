import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, number, address, password } = await request.json();

    // Validation
    if (!name || !email || !number || !address || !password) {
      return NextResponse.json(
        { error: 'All fields (name, email, number, address, password) are required.' },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await query('SELECT id FROM admins WHERE email = $1', [email]);
    if (existingAdmin.rows.length > 0) {
      return NextResponse.json(
        { error: 'An admin account with this email already exists.' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Save admin
    const newAdmin = await query(
      `INSERT INTO admins (name, email, number, address, password_hash) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, number, address, is_active, created_at`,
      [name, email, number, address, passwordHash]
    );

    return NextResponse.json(
      { message: 'Admin account created successfully.', admin: newAdmin.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering admin:', error);
    return NextResponse.json(
      { error: 'Failed to create admin account. Internal server error.' },
      { status: 500 }
    );
  }
}
