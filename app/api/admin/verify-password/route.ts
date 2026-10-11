import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { verifyAdminPassword, ADMIN_AUTH_COOKIE } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    if (verifyAdminPassword(password)) {
      // Set active user in store to admin
      const adminUser = db.setActiveUser('user-admin');

      const response = NextResponse.json({
        success: true,
        message: 'পাসওয়ার্ড সঠিক! অ্যাডমিন প্যানেল আনলক করা হয়েছে।',
        user: adminUser,
      });

      // Set cookie for persistence across pages
      response.cookies.set(ADMIN_AUTH_COOKIE, 'verified', {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, error: 'ভুল পাসওয়ার্ড! সঠিক অ্যাডমিন পাসওয়ার্ড প্রদান করুন।' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_AUTH_COOKIE);
  const isAuth = cookie?.value === 'verified';
  return NextResponse.json({ authenticated: isAuth });
}
