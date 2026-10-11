import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { ADMIN_AUTH_COOKIE } from '@/lib/admin-auth';

export async function POST() {
  // Reset active user to default student
  db.setActiveUser('user-student-hsc');

  const response = NextResponse.json({
    success: true,
    message: 'অ্যাডমিন প্যানেল সুরক্ষিতভাবে লক করা হয়েছে।',
  });

  response.cookies.delete(ADMIN_AUTH_COOKIE);
  return response;
}
