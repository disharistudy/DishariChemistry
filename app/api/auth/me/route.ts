import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  try {
    const user = db.getActiveUser();
    const allUsers = db.getUsers();
    return NextResponse.json({ user, allUsers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, profile } = body;

    if (action === 'switch' && userId) {
      if (userId === 'user-admin') {
        const adminCookie = req.cookies.get('dishari_admin_auth');
        const hasVerifiedCookie = adminCookie?.value === 'verified';
        const passwordMatches = body.password === 'SHSaydi@25';

        if (!hasVerifiedCookie && !passwordMatches) {
          return NextResponse.json(
            { error: 'অ্যাডমিন অ্যাকাউন্টে প্রবেশ করতে সঠিক পাসওয়ার্ড (SHSaydi@25) প্রয়োজন।' },
            { status: 403 }
          );
        }
      }
      const user = db.setActiveUser(userId);
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
      return NextResponse.json({ user });
    }

    if (action === 'register' && profile) {
      const user = db.registerUser(profile);
      return NextResponse.json({ user });
    }

    if (action === 'update' && profile) {
      const activeUser = db.getActiveUser();
      const updated = db.updateUserProfile(activeUser.id, profile);
      return NextResponse.json({ user: updated });
    }

    if (action === 'switch_firebase' && body.firebaseUser) {
      const fbUser = body.firebaseUser;
      const isAdmin = fbUser.email === 'disharistudy@gmail.com';
      const existingUser = db.getUsers().find(u => u.email === fbUser.email || u.id === fbUser.uid);
      if (existingUser) {
        db.setActiveUser(existingUser.id);
        return NextResponse.json({ user: existingUser });
      } else {
        const newUser = db.registerUser({
          email: fbUser.email || '',
          full_name: fbUser.displayName || 'দিশারী শিক্ষার্থী',
          academic_level: 'hsc',
          avatar_url: fbUser.photoURL || undefined,
          role: isAdmin ? 'admin' : 'student',
        });
        return NextResponse.json({ user: newUser });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
