import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;
    const details = db.getQuizDetails(quizId);
    if (!details) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    return NextResponse.json(details);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;
    const body = await req.json();
    const { answers } = body;

    const activeUser = db.getActiveUser();
    const result = db.submitQuizAttempt(activeUser.id, quizId, answers || {});

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
