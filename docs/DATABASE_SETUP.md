# Dishari Chemistry — PostgreSQL & Supabase Database Setup Guide

এই নির্দেশিকাটি Dishari Chemistry প্ল্যাটফর্মের জন্য PostgreSQL ও Supabase ডেটাবেজ সেটআপের পূর্ণাঙ্গ রূপরেখা প্রদান করে।

---

## ১. ডেটাবেজ মাইগ্রেশন স্ক্রিপ্টসমূহ

প্রকল্পের রুট ফোল্ডারে `supabase/migrations/` ডিরেক্টরিতে দুটি মূল মাইগ্রেশন ফাইল রাখা হয়েছে:

1. `supabase/migrations/001_initial_schema.sql`:
   - ২০টি মূল টেবিল, ইউআইডি (UUID) এক্সটেনশন, ফরেন কি রিলেশনশিপ এবং পারফরম্যান্স ইনডেক্স।
   - টেবিলসমূহ: `roles`, `profiles`, `user_roles`, `courses`, `papers`, `chapters`, `topics`, `lessons`, `lesson_progress`, `bookmarks`, `student_notes`, `elements`, `reactions`, `formulas`, `quiz_sets`, `questions`, `quiz_attempts`, `announcements`, `content_reports`, `audit_logs`।

2. `supabase/migrations/002_rls_policies.sql`:
   - রো-লেভেল সিকিউরিটি (RLS) পলিসি।
   - প্রাইভেট স্টুডেন্ট ডেটা সুরক্ষা (নোট, বুকমার্ক, কুইজ রেজাল্ট কেবল সংশ্লিষ্ট শিক্ষার্থী দেখতে পাবে)।
   - অ্যাডমিন রোল ভ্যালিডেশন ফাংশন (`is_admin()`) এবং কন্টেন্ট রাইট পারমিশন।

---

## ২. Supabase প্রজেক্টে সেটআপের ধাপসমূহ

1. **Supabase অ্যাকাউন্টে লগইন করুন** এবং একটি নতুন প্রজেক্ট তৈরি করুন।
2. প্রজেক্টের ড্যাশবোর্ডে **SQL Editor** অপশনে প্রবেশ করুন।
3. প্রথমে `supabase/migrations/001_initial_schema.sql` ফাইলের সম্পূর্ণ কোড কপি করে SQL Editor এ পেস্ট করে **RUN** করুন।
4. এরপর `supabase/migrations/002_rls_policies.sql` ফাইলের কোড পেস্ট করে **RUN** করুন।
5. আপনার টেবিলগুলো তৈরি হয়েছে কিনা দেখতে **Table Editor** ট্যাবে যান।
