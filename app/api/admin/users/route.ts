import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  try {
    const users = db.getUsers();
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId, role, institution, academic_level } = await req.json();
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const activeUser = db.getActiveUser();
    const updated = db.updateUserProfile(userId, { role, institution, academic_level });

    if (updated) {
      db.addAuditLog(
        activeUser.full_name,
        'ব্যবহারকারী অনুমতি পরিবর্তন',
        'User Role Management',
        `ব্যবহারকারী ${updated.full_name} (${updated.email}) এর রোল পরিবর্তিত হয়ে ${role} হয়েছে।`
      );
    }

    return NextResponse.json({ user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
