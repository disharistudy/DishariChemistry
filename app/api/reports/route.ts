import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const activeUser = db.getActiveUser();

    const report = db.submitReport({
      user_id: activeUser.id,
      user_name: activeUser.full_name,
      lesson_id: body.lesson_id,
      lesson_title: body.lesson_title || 'রসায়ন পাঠ',
      report_type: body.report_type || 'ত্রুটি সংশোধনের আবেদন',
      description: body.description || ''
    });

    return NextResponse.json({ report });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
