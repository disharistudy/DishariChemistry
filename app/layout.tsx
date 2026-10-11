import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Dishari Chemistry (দিশারী কেমিস্ট্রি)',
  description: 'SSC, HSC ও Honors রসায়ন শিক্ষার্থীদের জন্য সমৃদ্ধ বাংলা লার্নিং প্ল্যাটফর্ম, ইন্টারঅ্যাক্টিভ পর্যায় সারণি, বিক্রিয়া ও ফর্মুলা লাইব্রেরি, কুইজ এবং স্টুডেন্ট ড্যাশবোর্ড।',
  openGraph: {
    title: 'Dishari Chemistry (দিশারী কেমিস্ট্রি)',
    description: 'SSC, HSC ও Honors রসায়ন শিক্ষার্থীদের জন্য সমৃদ্ধ বাংলা লার্নিং প্ল্যাটফর্ম, ইন্টারঅ্যাক্টিভ পর্যায় সারণি, বিক্রিয়া ও ফর্মুলা লাইব্রেরি, কুইজ এবং স্টুডেন্ট ড্যাশবোর্ড।',
    type: 'website',
    locale: 'bn_BD',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dishari Chemistry (দিশারী কেমিস্ট্রি)',
    description: 'SSC, HSC ও Honors রসায়ন শিক্ষার্থীদের জন্য সমৃদ্ধ বাংলা লার্নিং প্ল্যাটফর্ম, ইন্টারঅ্যাক্টিভ পর্যায় সারণি, বিক্রিয়া ও ফর্মুলা লাইব্রেরি, কুইজ এবং স্টুডেন্ট ড্যাশবোর্ড।',
  },
};

import { FirebaseProvider } from '@/components/FirebaseProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-teal-500 selection:text-white" suppressHydrationWarning>
        <FirebaseProvider>
          <Navbar />
          <main className="flex-1 pb-16 lg:pb-0">
            {children}
          </main>
          <Footer />
        </FirebaseProvider>
      </body>
    </html>
  );
}
