import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  try {
    const activeUser = db.getActiveUser();
    // Allow admin review; if not admin, can still view if testing or demo
    const stats = db.getAdminStats();
    return NextResponse.json({ ...stats, currentUser: activeUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
