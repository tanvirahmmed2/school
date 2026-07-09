import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set('fit-staff', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/',
      sameSite: 'strict',
    });

    return NextResponse.json({ message: 'Staff logged out successfully.' });
  } catch (error) {
    console.error('Staff logout error:', error);
    return NextResponse.json({ error: 'Internal server error during logout.' }, { status: 500 });
  }
}
