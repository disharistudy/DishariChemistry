import React from 'react';
import AdminAuthGuard from '@/components/AdminAuthGuard';

export const metadata = {
  title: 'অ্যাডমিন প্যানেল | দিশারী কেমিস্ট্রি কেয়ার',
  description: 'দিশারী কেমিস্ট্রি অ্যাডমিন ড্যাশবোর্ড ও কন্টেন্ট ম্যানেজমেন্ট সিস্টেম',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
