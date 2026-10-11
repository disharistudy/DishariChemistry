import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const { lessonId, isCompleted } = await req.json();
    if (!lessonId) return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 });

    const activeUser = db.getActiveUser();
    const progress = db.markLessonCompleted(activeUser.id, lessonId, isCompleted ?? true);
    return NextResponse.json({ progress });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
