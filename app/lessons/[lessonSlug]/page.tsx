import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db/store';
import LessonReader from '@/components/LessonReader';

export const dynamic = 'force-dynamic';

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}) {
  const { lessonSlug } = await params;
  const lessonData = db.getLessonBySlug(lessonSlug);

  if (!lessonData) {
    notFound();
  }

  const activeUser = db.getActiveUser();
  const isBookmarked = db.isLessonBookmarked(activeUser.id, lessonData.lesson.id);
  const isCompleted = db.isLessonCompleted(activeUser.id, lessonData.lesson.id);
  const userNote = db.getNote(activeUser.id, lessonData.lesson.id);

  return (
    <LessonReader
      lesson={lessonData.lesson}
      chapter={lessonData.chapter}
      course={lessonData.course}
      prevLesson={lessonData.prevLesson}
      nextLesson={lessonData.nextLesson}
      relatedQuestions={lessonData.relatedQuestions}
      initialIsBookmarked={isBookmarked}
      initialIsCompleted={isCompleted}
      initialNote={userNote?.note_text || ''}
    />
  );
}
