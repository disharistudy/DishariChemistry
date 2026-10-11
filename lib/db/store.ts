import fs from 'fs';
import path from 'path';
import {
  Course,
  Paper,
  Chapter,
  Lesson,
  ElementData,
  ChemicalReaction,
  FormulaRecord,
  QuizSet,
  Question,
  QuizAttempt,
  Bookmark,
  StudentNote,
  LessonProgress,
  Announcement,
  ContentReport,
  AuditLog,
  UserProfile,
} from '../types';
import { getAll118Elements } from '../data/elements-data';
import {
  SEED_COURSES,
  SEED_PAPERS,
  SEED_CHAPTERS,
  SEED_LESSONS,
  SEED_REACTIONS,
  SEED_FORMULAS,
  SEED_QUIZ_SETS,
  SEED_QUESTIONS,
  SEED_ANNOUNCEMENTS,
  SEED_USERS,
} from '../data/seed-data';

interface DatabaseSchema {
  courses: Course[];
  papers: Paper[];
  chapters: Chapter[];
  lessons: Lesson[];
  elements: ElementData[];
  reactions: ChemicalReaction[];
  formulas: FormulaRecord[];
  quiz_sets: QuizSet[];
  questions: Question[];
  quiz_attempts: QuizAttempt[];
  bookmarks: Bookmark[];
  student_notes: StudentNote[];
  lesson_progress: LessonProgress[];
  announcements: Announcement[];
  content_reports: ContentReport[];
  audit_logs: AuditLog[];
  users: UserProfile[];
  active_user_id: string; // Current simulated session
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'dishari-db.json');

class DishariDatabase {
  private data: DatabaseSchema;
  private isLoaded: boolean = false;

  constructor() {
    this.data = this.getDefaultState();
    this.init();
  }

  private getDefaultState(): DatabaseSchema {
    return {
      courses: [...SEED_COURSES],
      papers: [...SEED_PAPERS],
      chapters: [...SEED_CHAPTERS],
      lessons: [...SEED_LESSONS],
      elements: getAll118Elements(),
      reactions: [...SEED_REACTIONS],
      formulas: [...SEED_FORMULAS],
      quiz_sets: [...SEED_QUIZ_SETS],
      questions: [...SEED_QUESTIONS],
      quiz_attempts: [
        {
          id: 'attempt-sample-1',
          user_id: 'user-student-hsc',
          quiz_set_id: 'quiz-daily',
          started_at: new Date(Date.now() - 3600000 * 24).toISOString(),
          completed_at: new Date(Date.now() - 3600000 * 24 + 480000).toISOString(),
          score: 4.75,
          total_marks: 5,
          correct_count: 5,
          incorrect_count: 0,
          unanswered_count: 0,
          answers: { 'q-d-1': 1, 'q-d-2': 1, 'q-d-3': 1, 'q-d-4': 2, 'q-d-5': 1 },
        },
        {
          id: 'attempt-sample-2',
          user_id: 'user-student-ssc',
          quiz_set_id: 'quiz-ssc-model',
          started_at: new Date(Date.now() - 3600000 * 12).toISOString(),
          completed_at: new Date(Date.now() - 3600000 * 12 + 600000).toISOString(),
          score: 5.75,
          total_marks: 6,
          correct_count: 6,
          incorrect_count: 0,
          unanswered_count: 0,
          answers: { 'q-ssc-1': 1, 'q-ssc-2': 1, 'q-ssc-3': 2, 'q-ssc-4': 1, 'q-ssc-5': 1, 'q-ssc-6': 0 },
        }
      ],
      bookmarks: [
        {
          id: 'bm-1',
          user_id: 'user-student-hsc',
          lesson_id: 'lesson-hsc-quantum',
          created_at: new Date().toISOString()
        },
        {
          id: 'bm-2',
          user_id: 'user-student-hsc',
          lesson_id: 'lesson-hsc-organic-benzene',
          created_at: new Date().toISOString()
        }
      ],
      student_notes: [
        {
          id: 'note-1',
          user_id: 'user-student-hsc',
          lesson_id: 'lesson-hsc-quantum',
          note_text: 'হুন্ডের নিয়ম শুধুমাত্র সমশক্তিসম্পন্ন ডিজেনারেট অরবিটালের (px, py, pz) ক্ষেত্রে প্রযোজ্য। ক্রোমিয়ামের ব্যতিক্রমী বিন্যাস 3d5 4s1 পরীক্ষায় মনে রাখতে হবে!',
          updated_at: new Date().toISOString()
        }
      ],
      lesson_progress: [
        {
          id: 'prog-1',
          user_id: 'user-student-hsc',
          lesson_id: 'lesson-hsc-quantum',
          is_completed: true,
          progress_percent: 100,
          last_read_at: new Date().toISOString()
        },
        {
          id: 'prog-2',
          user_id: 'user-student-ssc',
          lesson_id: 'lesson-ssc-states',
          is_completed: true,
          progress_percent: 100,
          last_read_at: new Date().toISOString()
        }
      ],
      announcements: [...SEED_ANNOUNCEMENTS],
      content_reports: [
        {
          id: 'rep-1',
          user_id: 'user-student-ssc',
          user_name: 'সুমাইয়া জাহান (SSC)',
          lesson_id: 'lesson-ssc-atom',
          lesson_title: 'পরমাণুর মূল কণিকা, রাদারফোর্ড ও বোর পরমাণু মডেল',
          report_type: 'বানান সংশোধনের পরামর্শ',
          description: 'বোর পরমাণু মডেলের কৌণিক ভরবেগের সূত্রে পাই (π) চিহ্নের ফন্ট মোবাইল ডিসপ্লেতে আরেকটু স্পষ্ট করা যায় কিনা।',
          status: 'resolved',
          created_at: new Date(Date.now() - 3600000 * 48).toISOString()
        }
      ],
      audit_logs: [
        {
          id: 'log-1',
          admin_name: 'দিশারী কেমিস্ট্রি কেয়ার (অ্যাডমিন)',
          action: 'সিস্টেম ইনিশিয়ালাইজেশন',
          target_entity: 'Database',
          details: 'দিশারী কেমিস্ট্রি প্ল্যাটফর্ম ডেটাবেজ ও ১৯টি মূল অধ্যায় ও পূর্ণাঙ্গ পাঠ্যক্রম কনফিগারেশন সফল।',
          created_at: new Date().toISOString()
        }
      ],
      users: [...SEED_USERS],
      active_user_id: 'user-student-hsc', // default logged-in learner
    };
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        const defaultState = this.getDefaultState();
        this.data = {
          ...defaultState,
          ...parsed,
          // Always ensure the comprehensive academic curriculum is preserved
          courses: defaultState.courses,
          papers: defaultState.papers,
          chapters: defaultState.chapters,
          lessons: defaultState.lessons.length >= (parsed.lessons?.length || 0) ? defaultState.lessons : parsed.lessons,
          reactions: defaultState.reactions.length >= (parsed.reactions?.length || 0) ? defaultState.reactions : parsed.reactions,
          formulas: defaultState.formulas.length >= (parsed.formulas?.length || 0) ? defaultState.formulas : parsed.formulas,
          quiz_sets: defaultState.quiz_sets.length >= (parsed.quiz_sets?.length || 0) ? defaultState.quiz_sets : parsed.quiz_sets,
          questions: defaultState.questions.length >= (parsed.questions?.length || 0) ? defaultState.questions : parsed.questions,
          announcements: defaultState.announcements,
          // Keep user accounts up to date with real admin and students, plus any new registrations
          users: defaultState.users,
        };
        this.save();
      } else {
        this.save();
      }
      this.isLoaded = true;
    } catch (e) {
      console.warn('Failed to read database file, falling back to memory state:', e);
      this.data = this.getDefaultState();
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Failed to write database file:', e);
    }
  }

  // --- Users & Session ---
  public getUsers(): UserProfile[] {
    return this.data.users;
  }

  public getActiveUser(): UserProfile {
    const user = this.data.users.find(u => u.id === this.data.active_user_id);
    return user || this.data.users[2]; // Default to Rakibul (HSC student)
  }

  public setActiveUser(userId: string): UserProfile | null {
    const user = this.data.users.find(u => u.id === userId);
    if (user) {
      this.data.active_user_id = user.id;
      this.save();
      return user;
    }
    return null;
  }

  public updateUserProfile(userId: string, updates: Partial<UserProfile>): UserProfile | null {
    const idx = this.data.users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.save();
      return this.data.users[idx];
    }
    return null;
  }

  public registerUser(profile: Omit<UserProfile, 'id' | 'created_at'>): UserProfile {
    const id = `user-${Date.now()}`;
    const newUser: UserProfile = {
      ...profile,
      id,
      created_at: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.data.active_user_id = id;
    this.save();
    return newUser;
  }

  // --- Courses, Chapters, Lessons ---
  public getCourses(): Course[] {
    return this.data.courses.map(course => {
      const courseChapters = this.data.chapters.filter(c => c.course_id === course.id);
      const courseChapterIds = new Set(courseChapters.map(c => c.id));
      const totalLessons = this.data.lessons.filter(l => courseChapterIds.has(l.chapter_id)).length;
      return {
        ...course,
        total_chapters: courseChapters.length,
        total_lessons: totalLessons,
      };
    });
  }

  public getCourseBySlug(slug: string): Course | undefined {
    return this.data.courses.find(c => c.slug === slug);
  }

  public getPapers(courseId?: string): Paper[] {
    if (!courseId) return this.data.papers;
    return this.data.papers.filter(p => p.course_id === courseId);
  }

  public getChapters(courseId?: string): Chapter[] {
    let chapters = this.data.chapters;
    if (courseId) {
      chapters = chapters.filter(c => c.course_id === courseId);
    }
    return chapters.map(chap => ({
      ...chap,
      lesson_count: this.data.lessons.filter(l => l.chapter_id === chap.id).length
    }));
  }

  public getChapterBySlug(courseSlug: string, chapterSlug: string): { chapter: Chapter; course: Course; lessons: Lesson[] } | null {
    const course = this.getCourseBySlug(courseSlug);
    if (!course) return null;
    const chapter = this.data.chapters.find(c => c.course_id === course.id && c.slug === chapterSlug);
    if (!chapter) return null;
    const lessons = this.data.lessons.filter(l => l.chapter_id === chapter.id);
    return { chapter, course, lessons };
  }

  public getLessons(): Lesson[] {
    return this.data.lessons;
  }

  public getLessonBySlug(slug: string): {
    lesson: Lesson;
    chapter?: Chapter;
    course?: Course;
    prevLesson?: { slug: string; title_bn: string };
    nextLesson?: { slug: string; title_bn: string };
    relatedQuestions: Question[];
  } | null {
    const lesson = this.data.lessons.find(l => l.slug === slug);
    if (!lesson) return null;

    const chapter = this.data.chapters.find(c => c.id === lesson.chapter_id);
    const course = chapter ? this.data.courses.find(cr => cr.id === chapter.course_id) : undefined;

    // Ordered lessons in chapter or across course
    const allInChapter = this.data.lessons.filter(l => l.chapter_id === lesson.chapter_id);
    const idx = allInChapter.findIndex(l => l.id === lesson.id);

    const prevLesson = idx > 0 ? { slug: allInChapter[idx - 1].slug, title_bn: allInChapter[idx - 1].title_bn } : undefined;
    const nextLesson = idx < allInChapter.length - 1 ? { slug: allInChapter[idx + 1].slug, title_bn: allInChapter[idx + 1].title_bn } : undefined;

    const relatedQuestions = this.data.questions.filter(q => q.chapter_id === lesson.chapter_id).slice(0, 3);

    return {
      lesson,
      chapter,
      course,
      prevLesson,
      nextLesson,
      relatedQuestions
    };
  }

  public createOrUpdateLesson(lesson: Partial<Lesson>): Lesson {
    const now = new Date().toISOString();
    let saved: Lesson;

    if (lesson.id) {
      const idx = this.data.lessons.findIndex(l => l.id === lesson.id);
      if (idx !== -1) {
        this.data.lessons[idx] = {
          ...this.data.lessons[idx],
          ...lesson,
          updated_at: now
        } as Lesson;
        saved = this.data.lessons[idx];
      } else {
        saved = {
          id: lesson.id,
          created_at: now,
          updated_at: now,
          ...lesson
        } as Lesson;
        this.data.lessons.push(saved);
      }
    } else {
      saved = {
        id: `lesson-${Date.now()}`,
        slug: lesson.slug || `lesson-${Date.now()}`,
        title_bn: lesson.title_bn || 'নতুন পাঠ',
        chapter_id: lesson.chapter_id || this.data.chapters[0].id,
        reading_time_minutes: lesson.reading_time_minutes || 10,
        learning_objectives: lesson.learning_objectives || [],
        introduction: lesson.introduction || '',
        content_markdown: lesson.content_markdown || '',
        definitions: lesson.definitions || [],
        worked_examples: lesson.worked_examples || [],
        chemical_equations: lesson.chemical_equations || [],
        common_mistakes: lesson.common_mistakes || [],
        exam_notes: lesson.exam_notes || [],
        quick_revision: lesson.quick_revision || [],
        is_published: lesson.is_published ?? true,
        order_index: lesson.order_index || 1,
        author_name: 'দিশারী কেমিস্ট্রি টিম',
        created_at: now,
        updated_at: now
      };
      this.data.lessons.push(saved);
    }

    this.save();
    return saved;
  }

  // --- Elements & Chemistry Tools ---
  public getElements(): ElementData[] {
    return this.data.elements;
  }

  public getElementBySymbolOrNumber(query: string | number): ElementData | undefined {
    if (typeof query === 'number' || !isNaN(Number(query))) {
      const num = Number(query);
      return this.data.elements.find(e => e.atomic_number === num);
    }
    const clean = query.trim().toLowerCase();
    return this.data.elements.find(e => 
      e.symbol.toLowerCase() === clean || 
      e.name_en.toLowerCase() === clean || 
      e.name_bn === query.trim()
    );
  }

  public getReactions(categoryKey?: string, search?: string): ChemicalReaction[] {
    let list = this.data.reactions;
    if (categoryKey && categoryKey !== 'all') {
      list = list.filter(r => r.category_key === categoryKey);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(r => 
        r.title_bn.toLowerCase().includes(q) ||
        r.reactants.toLowerCase().includes(q) ||
        r.products.toLowerCase().includes(q) ||
        r.balanced_equation.toLowerCase().includes(q) ||
        r.category_bn.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getFormulas(search?: string): FormulaRecord[] {
    let list = this.data.formulas;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(f => 
        f.name_bn.toLowerCase().includes(q) ||
        f.name_en.toLowerCase().includes(q) ||
        f.category_bn.toLowerCase().includes(q) ||
        f.latex_expression.toLowerCase().includes(q)
      );
    }
    return list;
  }

  // --- Quizzes & Examination ---
  public getQuizSets(): (QuizSet & { question_count: number })[] {
    return this.data.quiz_sets.map(qs => ({
      ...qs,
      question_count: this.data.questions.filter(q => q.quiz_set_id === qs.id).length
    }));
  }

  public getQuizDetails(quizId: string): { quizSet: QuizSet; questions: Omit<Question, 'correct_option_index' | 'explanation_bn'>[] } | null {
    const quizSet = this.data.quiz_sets.find(qs => qs.id === quizId || qs.slug === quizId);
    if (!quizSet) return null;

    // Secure: strip out correct_option_index and explanation_bn for the active exam attempt
    const questions = this.data.questions
      .filter(q => q.quiz_set_id === quizSet.id)
      .map(({ correct_option_index, explanation_bn, ...safeQuestion }) => safeQuestion);

    return { quizSet, questions };
  }

  public submitQuizAttempt(
    userId: string,
    quizId: string,
    answers: Record<string, number>
  ): {
    attempt: QuizAttempt;
    gradedQuestions: (Question & { studentAnswer: number | undefined; isCorrect: boolean })[];
  } {
    const quizSet = this.data.quiz_sets.find(qs => qs.id === quizId || qs.slug === quizId);
    if (!quizSet) throw new Error('Quiz not found');

    const allQuestions = this.data.questions.filter(q => q.quiz_set_id === quizSet.id);
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let totalMarks = 0;
    let score = 0;

    const gradedQuestions = allQuestions.map(q => {
      totalMarks += q.marks;
      const studentAns = answers[q.id];
      if (studentAns === undefined || studentAns === null) {
        unansweredCount++;
        return { ...q, studentAnswer: undefined, isCorrect: false };
      }
      if (studentAns === q.correct_option_index) {
        correctCount++;
        score += q.marks;
        return { ...q, studentAnswer: studentAns, isCorrect: true };
      } else {
        incorrectCount++;
        score -= quizSet.negative_marking_per_question;
        return { ...q, studentAnswer: studentAns, isCorrect: false };
      }
    });

    if (score < 0) score = 0;
    score = Math.round(score * 100) / 100;

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      user_id: userId,
      quiz_set_id: quizSet.id,
      started_at: new Date(Date.now() - 600000).toISOString(),
      completed_at: new Date().toISOString(),
      score,
      total_marks: totalMarks,
      correct_count: correctCount,
      incorrect_count: incorrectCount,
      unanswered_count: unansweredCount,
      answers,
    };

    this.data.quiz_attempts.unshift(attempt);
    this.save();

    return { attempt, gradedQuestions };
  }

  public getAttemptsForUser(userId: string): (QuizAttempt & { quiz_title: string })[] {
    return this.data.quiz_attempts
      .filter(a => a.user_id === userId)
      .map(a => {
        const qs = this.data.quiz_sets.find(s => s.id === a.quiz_set_id);
        return {
          ...a,
          quiz_title: qs ? qs.title_bn : 'রসায়ন কুইজ'
        };
      });
  }

  // --- Student Dashboard & Interactions ---
  public getStudentDashboard(userId: string) {
    const user = this.data.users.find(u => u.id === userId) || this.getActiveUser();
    const attempts = this.data.quiz_attempts.filter(a => a.user_id === user.id);
    const bookmarks = this.data.bookmarks.filter(b => b.user_id === user.id);
    const notes = this.data.student_notes.filter(n => n.user_id === user.id);
    const progressList = this.data.lesson_progress.filter(p => p.user_id === user.id);

    const totalAttempts = attempts.length;
    const avgScore = totalAttempts > 0 
      ? Math.round((attempts.reduce((sum, a) => sum + (a.score / (a.total_marks || 1)) * 100, 0) / totalAttempts)) 
      : 0;

    const bookmarkedLessons = bookmarks.map(bm => {
      const lesson = this.data.lessons.find(l => l.id === bm.lesson_id);
      return { bookmark: bm, lesson };
    }).filter(item => item.lesson !== undefined);

    const notesWithLessons = notes.map(n => {
      const lesson = this.data.lessons.find(l => l.id === n.lesson_id);
      return { note: n, lesson };
    }).filter(item => item.lesson !== undefined);

    return {
      user,
      totalAttempts,
      avgScore,
      completedLessonsCount: progressList.filter(p => p.is_completed).length,
      attempts: attempts.slice(0, 5),
      bookmarkedLessons,
      notes: notesWithLessons,
      recentProgress: progressList.slice(0, 5)
    };
  }

  public toggleBookmark(userId: string, lessonId: string): boolean {
    const idx = this.data.bookmarks.findIndex(b => b.user_id === userId && b.lesson_id === lessonId);
    let isBookmarked: boolean;
    if (idx !== -1) {
      this.data.bookmarks.splice(idx, 1);
      isBookmarked = false;
    } else {
      this.data.bookmarks.push({
        id: `bm-${Date.now()}`,
        user_id: userId,
        lesson_id: lessonId,
        created_at: new Date().toISOString()
      });
      isBookmarked = true;
    }
    this.save();
    return isBookmarked;
  }

  public isLessonBookmarked(userId: string, lessonId: string): boolean {
    return this.data.bookmarks.some(b => b.user_id === userId && b.lesson_id === lessonId);
  }

  public saveNote(userId: string, lessonId: string, noteText: string): StudentNote {
    const idx = this.data.student_notes.findIndex(n => n.user_id === userId && n.lesson_id === lessonId);
    let saved: StudentNote;
    if (idx !== -1) {
      this.data.student_notes[idx].note_text = noteText;
      this.data.student_notes[idx].updated_at = new Date().toISOString();
      saved = this.data.student_notes[idx];
    } else {
      saved = {
        id: `note-${Date.now()}`,
        user_id: userId,
        lesson_id: lessonId,
        note_text: noteText,
        updated_at: new Date().toISOString()
      };
      this.data.student_notes.push(saved);
    }
    this.save();
    return saved;
  }

  public getNote(userId: string, lessonId: string): StudentNote | undefined {
    return this.data.student_notes.find(n => n.user_id === userId && n.lesson_id === lessonId);
  }

  public markLessonCompleted(userId: string, lessonId: string, isCompleted: boolean): LessonProgress {
    const idx = this.data.lesson_progress.findIndex(p => p.user_id === userId && p.lesson_id === lessonId);
    let prog: LessonProgress;
    if (idx !== -1) {
      this.data.lesson_progress[idx].is_completed = isCompleted;
      this.data.lesson_progress[idx].progress_percent = isCompleted ? 100 : 50;
      this.data.lesson_progress[idx].last_read_at = new Date().toISOString();
      prog = this.data.lesson_progress[idx];
    } else {
      prog = {
        id: `prog-${Date.now()}`,
        user_id: userId,
        lesson_id: lessonId,
        is_completed: isCompleted,
        progress_percent: isCompleted ? 100 : 50,
        last_read_at: new Date().toISOString()
      };
      this.data.lesson_progress.push(prog);
    }
    this.save();
    return prog;
  }

  public isLessonCompleted(userId: string, lessonId: string): boolean {
    const prog = this.data.lesson_progress.find(p => p.user_id === userId && p.lesson_id === lessonId);
    return prog ? prog.is_completed : false;
  }

  // --- Content Reports & Admin ---
  public submitReport(report: Omit<ContentReport, 'id' | 'status' | 'created_at'>): ContentReport {
    const newReport: ContentReport = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    this.data.content_reports.unshift(newReport);
    this.save();
    return newReport;
  }

  public getAdminStats() {
    return {
      totalCourses: this.data.courses.length,
      publishedCourses: this.data.courses.filter(c => c.is_published).length,
      totalLessons: this.data.lessons.length,
      publishedLessons: this.data.lessons.filter(l => l.is_published).length,
      totalStudents: this.data.users.length,
      totalAttempts: this.data.quiz_attempts.length,
      pendingReports: this.data.content_reports.filter(r => r.status === 'pending').length,
      reports: this.data.content_reports.slice(0, 10),
      auditLogs: this.data.audit_logs.slice(0, 10),
      recentAttempts: this.data.quiz_attempts.slice(0, 8),
    };
  }

  public addAuditLog(adminName: string, action: string, targetEntity: string, details: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      admin_name: adminName,
      action,
      target_entity: targetEntity,
      details,
      created_at: new Date().toISOString()
    };
    this.data.audit_logs.unshift(log);
    this.save();
  }

  public getQuestions(): Question[] {
    return this.data.questions;
  }

  public saveQuestion(question: Partial<Question>): Question {
    let saved: Question;
    if (question.id) {
      const idx = this.data.questions.findIndex(q => q.id === question.id);
      if (idx !== -1) {
        this.data.questions[idx] = { ...this.data.questions[idx], ...question } as Question;
        saved = this.data.questions[idx];
      } else {
        saved = question as Question;
        this.data.questions.push(saved);
      }
    } else {
      saved = {
        id: `q-${Date.now()}`,
        quiz_set_id: question.quiz_set_id || this.data.quiz_sets[0].id,
        chapter_id: question.chapter_id,
        question_bn: question.question_bn || 'নতুন প্রশ্ন',
        question_type: question.question_type || 'mcq',
        options: question.options || ['অপশন ১', 'অপশন ২', 'অপশন ৩', 'অপশন ৪'],
        correct_option_index: question.correct_option_index ?? 0,
        explanation_bn: question.explanation_bn || '',
        difficulty: question.difficulty || 'medium',
        marks: question.marks || 1.0,
      };
      this.data.questions.push(saved);
    }
    this.save();
    return saved;
  }

  public deleteQuestion(questionId: string): boolean {
    const idx = this.data.questions.findIndex(q => q.id === questionId);
    if (idx !== -1) {
      this.data.questions.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  public getAnnouncements(): Announcement[] {
    return this.data.announcements;
  }

  // --- Global Search ---
  public globalSearch(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return { courses: [], chapters: [], lessons: [], elements: [], reactions: [], formulas: [] };

    const courses = this.data.courses.filter(c => 
      c.title_bn.toLowerCase().includes(q) || 
      c.title_en.toLowerCase().includes(q) || 
      c.description.toLowerCase().includes(q)
    );

    const chapters = this.data.chapters.filter(ch => 
      ch.title_bn.toLowerCase().includes(q) || 
      ch.title_en.toLowerCase().includes(q) || 
      ch.description.toLowerCase().includes(q)
    );

    const lessons = this.data.lessons.filter(l => 
      l.title_bn.toLowerCase().includes(q) || 
      (l.title_en && l.title_en.toLowerCase().includes(q)) || 
      l.introduction.toLowerCase().includes(q) ||
      l.content_markdown.toLowerCase().includes(q)
    );

    const elements = this.data.elements.filter(el => 
      el.symbol.toLowerCase() === q ||
      el.name_en.toLowerCase().includes(q) ||
      el.name_bn.includes(query.trim()) ||
      String(el.atomic_number) === q
    ).slice(0, 6);

    const reactions = this.data.reactions.filter(r => 
      r.title_bn.toLowerCase().includes(q) ||
      r.reactants.toLowerCase().includes(q) ||
      r.products.toLowerCase().includes(q) ||
      r.balanced_equation.toLowerCase().includes(q)
    ).slice(0, 6);

    const formulas = this.data.formulas.filter(f => 
      f.name_bn.toLowerCase().includes(q) ||
      f.name_en.toLowerCase().includes(q) ||
      f.category_bn.toLowerCase().includes(q) ||
      f.latex_expression.toLowerCase().includes(q)
    ).slice(0, 6);

    return { courses, chapters, lessons, elements, reactions, formulas };
  }
}

// Global singleton instance
const globalForDb = globalThis as unknown as { dishariDb: DishariDatabase };
export const db = globalForDb.dishariDb || new DishariDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.dishariDb = db;
