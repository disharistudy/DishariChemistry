import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const { lessonId } = await req.json();
    if (!lessonId) return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 });

    const activeUser = db.getActiveUser();
    const isBookmarked = db.toggleBookmark(activeUser.id, lessonId);
    return NextResponse.json({ isBookmarked });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
