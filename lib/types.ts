export type AcademicLevel = 'ssc' | 'hsc' | 'honors' | 'all';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  academic_level: AcademicLevel;
  institution?: string;
  avatar_url?: string;
  bio?: string;
  role: 'student' | 'admin' | 'editor';
  created_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title_bn: string;
  title_en: string;
  academic_level: AcademicLevel;
  description: string;
  cover_image?: string;
  prerequisites?: string;
  curriculum_version: string;
  is_published: boolean;
  order_index: number;
  total_chapters?: number;
  total_lessons?: number;
}

export interface Paper {
  id: string;
  course_id: string;
  slug: string;
  title_bn: string;
  title_en: string;
  order_index: number;
}

export interface Chapter {
  id: string;
  course_id: string;
  paper_id?: string;
  slug: string;
  chapter_number: number;
  title_bn: string;
  title_en: string;
  description: string;
  is_published: boolean;
  order_index: number;
  lesson_count?: number;
}

export interface Topic {
  id: string;
  chapter_id: string;
  slug: string;
  title_bn: string;
  title_en?: string;
  order_index: number;
}

export interface Lesson {
  id: string;
  chapter_id: string;
  topic_id?: string;
  slug: string;
  title_bn: string;
  title_en?: string;
  reading_time_minutes: number;
  learning_objectives: string[];
  prerequisites?: string;
  introduction: string;
  content_markdown: string;
  definitions: { term_bn: string; term_en?: string; definition_bn: string }[];
  worked_examples: {
    question_bn: string;
    given_data_bn?: string;
    formula_used?: string;
    solution_steps_bn: string[];
    answer_bn: string;
  }[];
  chemical_equations: {
    title_bn: string;
    equation: string;
    conditions?: string;
    explanation_bn?: string;
  }[];
  common_mistakes?: string[];
  exam_notes?: string[];
  quick_revision?: string[];
  is_published: boolean;
  order_index: number;
  author_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ElementData {
  atomic_number: number;
  symbol: string;
  name_en: string;
  name_bn: string;
  atomic_mass: number;
  category: 'alkali-metal' | 'alkaline-earth' | 'transition-metal' | 'post-transition' | 'metalloid' | 'nonmetal' | 'halogen' | 'noble-gas' | 'lanthanide' | 'actinide';
  period: number;
  group: number;
  block: 's' | 'p' | 'd' | 'f';
  electron_configuration: string;
  oxidation_states: string;
  phase: 'Solid' | 'Liquid' | 'Gas';
  density?: number;
  melting_point?: number; // Kelvin
  boiling_point?: number; // Kelvin
  electronegativity?: number;
  summary_bn: string;
  applications_bn: string;
}

export interface ChemicalReaction {
  id: string;
  title_bn: string;
  category_bn: string;
  category_key: 'synthesis' | 'decomposition' | 'single_replacement' | 'double_replacement' | 'combustion' | 'redox' | 'neutralization' | 'organic';
  reactants: string;
  products: string;
  balanced_equation: string;
  conditions?: string;
  observation_bn?: string;
  explanation_bn: string;
  safety_notes_bn?: string;
  academic_level: AcademicLevel;
  chapter_reference: string;
}

export interface FormulaRecord {
  id: string;
  name_bn: string;
  name_en: string;
  category_bn: string;
  latex_expression: string;
  symbols_explanation: { symbol: string; meaning_bn: string; unit: string }[];
  units: string;
  assumptions_bn?: string;
  worked_example?: {
    problem_bn: string;
    steps_bn: string[];
    result_bn: string;
  };
  calculator_id?: 'molarity' | 'ideal_gas' | 'mole' | 'dilution' | 'ph';
  academic_level: AcademicLevel;
}

export interface Question {
  id: string;
  quiz_set_id: string;
  chapter_id?: string;
  question_bn: string;
  question_type: 'mcq' | 'true_false' | 'numerical';
  options: string[];
  correct_option_index: number;
  explanation_bn: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
}

export interface QuizSet {
  id: string;
  slug: string;
  title_bn: string;
  description_bn: string;
  academic_level: AcademicLevel;
  course_id?: string;
  chapter_id?: string;
  duration_minutes: number;
  pass_marks_percent: number;
  negative_marking_per_question: number;
  is_published: boolean;
  is_daily: boolean;
  total_questions?: number;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_set_id: string;
  started_at: string;
  completed_at?: string;
  score: number;
  total_marks: number;
  correct_count: number;
  incorrect_count: number;
  unanswered_count: number;
  answers: Record<string, number>; // question_id -> selected_option_index
}

export interface Bookmark {
  id: string;
  user_id: string;
  lesson_id: string;
  created_at: string;
}

export interface StudentNote {
  id: string;
  user_id: string;
  lesson_id: string;
  note_text: string;
  updated_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  progress_percent: number;
  last_read_at: string;
}

export interface Announcement {
  id: string;
  title_bn: string;
  content_bn: string;
  tag: string;
  date: string;
}

export interface ContentReport {
  id: string;
  user_id?: string;
  user_name?: string;
  lesson_id: string;
  lesson_title: string;
  report_type: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_name: string;
  action: string;
  target_entity: string;
  details: string;
  created_at: string;
}
