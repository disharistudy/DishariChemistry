import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get('lessonId');
    if (!lessonId) return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 });

    const activeUser = db.getActiveUser();
    const note = db.getNote(activeUser.id, lessonId);
    return NextResponse.json({ note: note?.note_text || '' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { lessonId, noteText } = await req.json();
    if (!lessonId) return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 });

    const activeUser = db.getActiveUser();
    const saved = db.saveNote(activeUser.id, lessonId, noteText || '');
    return NextResponse.json({ note: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
