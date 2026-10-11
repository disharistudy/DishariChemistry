import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseSlug: string }> }
) {
  try {
    const { courseSlug } = await params;
    const course = db.getCourseBySlug(courseSlug);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const papers = db.getPapers(course.id);
    const chapters = db.getChapters(course.id);

    return NextResponse.json({ course, papers, chapters });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
