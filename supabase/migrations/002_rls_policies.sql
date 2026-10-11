-- Dishari Chemistry (দিশারী কেমিস্ট্রি)
-- Row Level Security (RLS) Policies Migration
-- Migration: 002_rls_policies.sql

-- Enable RLS on user private data tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Enable RLS on content tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role_id = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Bookmarks Policies: Students can only view, insert and delete their own bookmarks
CREATE POLICY "Users can view their own bookmarks" 
ON bookmarks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add bookmarks" 
ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- 3. Lesson Progress Policies: Students can only view and update their own progress
CREATE POLICY "Users can view their own progress" 
ON lesson_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can modify their own progress" 
ON lesson_progress FOR ALL USING (auth.uid() = user_id);

-- 4. Student Notes Policies: Strictly private
CREATE POLICY "Users can view their own notes" 
ON student_notes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create and edit their own notes" 
ON student_notes FOR ALL USING (auth.uid() = user_id);

-- 5. Quiz Attempts Policies: Students see only their own attempts; admins can see all
CREATE POLICY "Users can view their own attempts" 
ON quiz_attempts FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can submit their own quiz attempts" 
ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Content Tables Policies (Public read for published content; admin write)
CREATE POLICY "Published courses are viewable by everyone" 
ON courses FOR SELECT USING (is_published = true OR is_admin());

CREATE POLICY "Admins can manage courses" 
ON courses FOR ALL USING (is_admin());

CREATE POLICY "Published lessons are viewable by everyone" 
ON lessons FOR SELECT USING (is_published = true OR is_admin());

CREATE POLICY "Admins can manage lessons" 
ON lessons FOR ALL USING (is_admin());

CREATE POLICY "Published quiz sets are viewable by everyone" 
ON quiz_sets FOR SELECT USING (is_published = true OR is_admin());

CREATE POLICY "Questions can be viewed by authenticated users" 
ON questions FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage questions" 
ON questions FOR ALL USING (is_admin());

CREATE POLICY "Elements, reactions and formulas are viewable by everyone" 
ON elements FOR SELECT USING (true);
CREATE POLICY "Reactions viewable by everyone" 
ON reactions FOR SELECT USING (true);
CREATE POLICY "Formulas viewable by everyone" 
ON formulas FOR SELECT USING (true);
CREATE POLICY "Announcements viewable by everyone" 
ON announcements FOR SELECT USING (is_active = true OR is_admin());

-- 7. Audit logs viewable only by admins
CREATE POLICY "Admins can view audit logs" 
ON audit_logs FOR SELECT USING (is_admin());

CREATE POLICY "Admins can create audit logs" 
ON audit_logs FOR INSERT WITH CHECK (is_admin());
