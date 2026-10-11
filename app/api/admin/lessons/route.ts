import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  try {
    const lessons = db.getLessons();
    const chapters = db.getChapters();
    const courses = db.getCourses();
    return NextResponse.json({ lessons, chapters, courses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const activeUser = db.getActiveUser();
    const saved = db.createOrUpdateLesson(body);

    db.addAuditLog(
      activeUser.full_name,
      body.id ? 'পাঠ হালনাগাদ' : 'নতুন পাঠ প্রকাশ',
      'Lesson Management',
      `পাঠ: "${saved.title_bn}" (slug: ${saved.slug}) ডেটাবেজে সংরক্ষিত হয়েছে।`
    );

    return NextResponse.json({ lesson: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
