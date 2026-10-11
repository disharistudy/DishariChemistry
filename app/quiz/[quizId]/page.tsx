import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db/store';
import QuizRunner from '@/components/QuizRunner';

export const dynamic = 'force-dynamic';

export default async function SingleQuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const quizData = db.getQuizDetails(quizId);

  if (!quizData) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <QuizRunner
        quizSet={quizData.quizSet}
        initialQuestions={quizData.questions as any}
      />
    </div>
  );
}
