import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ lessonSlug: string }> }
) {
  try {
    const { lessonSlug } = await params;
    const lessonData = db.getLessonBySlug(lessonSlug);
    if (!lessonData) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const activeUser = db.getActiveUser();
    const isBookmarked = db.isLessonBookmarked(activeUser.id, lessonData.lesson.id);
    const isCompleted = db.isLessonCompleted(activeUser.id, lessonData.lesson.id);
    const userNote = db.getNote(activeUser.id, lessonData.lesson.id);

    return NextResponse.json({
      ...lessonData,
      isBookmarked,
      isCompleted,
      note: userNote?.note_text || '',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
