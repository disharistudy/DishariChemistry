-- Dishari Chemistry (দিশারী কেমিস্ট্রি)
-- PostgreSQL Initial Schema Migration for Supabase
-- Migration: 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Roles table
CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO roles (id, name, description) VALUES
    ('student', 'Student', 'সাধারণ শিক্ষার্থী যার কুইজ, পাঠ ও নোট ব্যবহারের অনুমতি আছে'),
    ('editor', 'Editor', 'কন্টেন্ট এডিটর যার পাঠ ও প্রশ্ন তৈরির অনুমতি আছে'),
    ('admin', 'Administrator', 'সিস্টেম অ্যাডমিন যার পূর্ণ প্রশাসনিক নিয়ন্ত্রণ আছে')
ON CONFLICT (id) DO NOTHING;

-- 2. User Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    academic_level TEXT DEFAULT 'hsc' CHECK (academic_level IN ('ssc', 'hsc', 'honors')),
    institution TEXT,
    avatar_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User Roles
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- 4. Courses
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title_bn TEXT NOT NULL,
    title_en TEXT NOT NULL,
    academic_level TEXT NOT NULL CHECK (academic_level IN ('ssc', 'hsc', 'honors')),
    description TEXT NOT NULL,
    cover_image TEXT,
    prerequisites TEXT,
    curriculum_version TEXT DEFAULT 'NCTB 2024 / National University',
    is_published BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Papers (For HSC 1st/2nd Paper or Honors Specializations)
CREATE TABLE IF NOT EXISTS papers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    title_en TEXT NOT NULL,
    order_index INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, slug)
);

-- 6. Chapters
CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    paper_id UUID REFERENCES papers(id) ON DELETE SET NULL,
    slug TEXT NOT NULL,
    chapter_number INT NOT NULL,
    title_bn TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, slug)
);

-- 7. Topics
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    title_en TEXT,
    order_index INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(chapter_id, slug)
);

-- 8. Lessons
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
    slug TEXT UNIQUE NOT NULL,
    title_bn TEXT NOT NULL,
    title_en TEXT,
    reading_time_minutes INT DEFAULT 10,
    learning_objectives JSONB DEFAULT '[]'::jsonb,
    prerequisites TEXT,
    introduction TEXT,
    content_html TEXT NOT NULL,
    definitions JSONB DEFAULT '[]'::jsonb,
    worked_examples JSONB DEFAULT '[]'::jsonb,
    chemical_equations JSONB DEFAULT '[]'::jsonb,
    common_mistakes TEXT,
    exam_notes TEXT,
    quick_revision TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 1,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Lesson Progress
CREATE TABLE IF NOT EXISTS lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    progress_percent INT DEFAULT 0,
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- 10. Bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- 11. Student Notes
CREATE TABLE IF NOT EXISTS student_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    note_text TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- 12. Elements (Periodic Table 118 Elements)
CREATE TABLE IF NOT EXISTS elements (
    atomic_number INT PRIMARY KEY,
    symbol TEXT UNIQUE NOT NULL,
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    atomic_mass NUMERIC(8, 4) NOT NULL,
    category TEXT NOT NULL,
    period INT NOT NULL,
    "group" INT NOT NULL,
    block TEXT NOT NULL,
    electron_configuration TEXT NOT NULL,
    oxidation_states TEXT,
    phase TEXT NOT NULL,
    density NUMERIC(8, 4),
    melting_point NUMERIC(8, 2),
    boiling_point NUMERIC(8, 2),
    electronegativity NUMERIC(4, 2),
    summary_bn TEXT,
    applications_bn TEXT
);

-- 13. Chemical Reactions Library
CREATE TABLE IF NOT EXISTS reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_bn TEXT NOT NULL,
    category_bn TEXT NOT NULL,
    reactants TEXT NOT NULL,
    products TEXT NOT NULL,
    balanced_equation TEXT NOT NULL,
    conditions TEXT,
    observation_bn TEXT,
    explanation_bn TEXT,
    safety_notes_bn TEXT,
    academic_level TEXT DEFAULT 'all',
    chapter_reference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Formulas and Calculations
CREATE TABLE IF NOT EXISTS formulas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    category_bn TEXT NOT NULL,
    latex_expression TEXT NOT NULL,
    symbols_explanation JSONB NOT NULL,
    units TEXT NOT NULL,
    assumptions_bn TEXT,
    worked_example JSONB,
    calculator_type TEXT,
    academic_level TEXT DEFAULT 'all',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Quiz Sets
CREATE TABLE IF NOT EXISTS quiz_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title_bn TEXT NOT NULL,
    description_bn TEXT,
    academic_level TEXT NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
    duration_minutes INT DEFAULT 15,
    pass_marks_percent INT DEFAULT 50,
    negative_marking_per_question NUMERIC(3, 2) DEFAULT 0.25,
    is_published BOOLEAN DEFAULT TRUE,
    is_daily BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Questions
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_set_id UUID REFERENCES quiz_sets(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
    question_bn TEXT NOT NULL,
    question_type TEXT DEFAULT 'mcq' CHECK (question_type IN ('mcq', 'numerical', 'true_false')),
    options JSONB NOT NULL, -- Array of strings
    correct_option_index INT NOT NULL,
    explanation_bn TEXT,
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    marks NUMERIC(3, 1) DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Quiz Attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    quiz_set_id UUID NOT NULL REFERENCES quiz_sets(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    score NUMERIC(5, 2) DEFAULT 0,
    total_marks NUMERIC(5, 2) DEFAULT 0,
    correct_count INT DEFAULT 0,
    incorrect_count INT DEFAULT 0,
    unanswered_count INT DEFAULT 0,
    answers JSONB DEFAULT '{}'::jsonb
);

-- 18. Announcements
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_bn TEXT NOT NULL,
    content_bn TEXT NOT NULL,
    tag TEXT DEFAULT 'সাধারণ',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Content Reports & Error Submissions
CREATE TABLE IF NOT EXISTS content_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lessons_chapter ON lessons(chapter_id);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON lessons(is_published);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_quiz ON questions(quiz_set_id);
CREATE INDEX IF NOT EXISTS idx_reactions_category ON reactions(category_bn);
