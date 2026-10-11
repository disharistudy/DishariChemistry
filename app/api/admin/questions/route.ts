import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  try {
    const questions = db.getQuestions();
    const quizSets = db.getQuizSets();
    return NextResponse.json({ questions, quizSets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const saved = db.saveQuestion(body);
    const activeUser = db.getActiveUser();
    db.addAuditLog(activeUser.full_name, 'প্রশ্ন তৈরি/হালনাগাদ', 'Question Bank', `প্রশ্ন ID: ${saved.id} সফলভাবে সংরক্ষিত হয়েছে।`);
    return NextResponse.json({ question: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Question ID required' }, { status: 400 });

    const deleted = db.deleteQuestion(id);
    const activeUser = db.getActiveUser();
    db.addAuditLog(activeUser.full_name, 'প্রশ্ন মুছে ফেলা', 'Question Bank', `প্রশ্ন ID: ${id} সিস্টেম থেকে মুছে ফেলা হয়েছে।`);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
