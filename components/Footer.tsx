import React from 'react';
import Link from 'next/link';
import { FlaskConical, Atom, Heart, Shield, BookOpen, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pb-16 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-white tracking-tight">
                  দিশারী <span className="text-teal-400">কেমিস্ট্রি</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider">
                  DISHARI CHEMISTRY
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              “রসায়ন শিখি সহজভাবে, এগিয়ে যাই আত্মবিশ্বাসে” — বাংলাদেশের এসএসসি, এইচএসসি এবং স্নাতক (অনার্স) রসায়ন শিক্ষার্থীদের জন্য সম্পূর্ণ বাংলা ডিজিটাল লার্নিং প্ল্যাটফর্ম।
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-teal-400 font-medium">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>বিজ্ঞানচর্চা হোক বোধগম্য, আকর্ষণীয় ও আধুনিক</span>
            </div>
          </div>

          {/* Academic levels */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-teal-500 pl-2">
              একাডেমিক কোর্স
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/courses/ssc-chemistry" className="hover:text-teal-400 transition-colors">
                  এসএসসি রসায়ন (SSC)
                </Link>
              </li>
              <li>
                <Link href="/courses/hsc-chemistry" className="hover:text-teal-400 transition-colors">
                  এইচএসসি ১ম ও ২য় পত্র (HSC)
                </Link>
              </li>
              <li>
                <Link href="/courses/honors-chemistry" className="hover:text-teal-400 transition-colors">
                  অনার্স রসায়ন (Honors)
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-teal-400 transition-colors text-slate-400">
                  সকল কোর্স সূচি
                </Link>
              </li>
            </ul>
          </div>

          {/* Chemistry tools */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-teal-500 pl-2">
              রসায়ন টুলস
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/periodic-table" className="hover:text-teal-400 transition-colors">
                  ইন্টারঅ্যাক্টিভ পর্যায় সারণি
                </Link>
              </li>
              <li>
                <Link href="/reactions" className="hover:text-teal-400 transition-colors">
                  বিক্রিয়া লাইব্রেরি (৮ বিভাগ)
                </Link>
              </li>
              <li>
                <Link href="/formulas" className="hover:text-teal-400 transition-colors">
                  ফর্মুলা ও লাইভ ক্যালকুলেটর
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:text-teal-400 transition-colors">
                  কুইজ ও মডেল টেস্ট
                </Link>
              </li>
            </ul>
          </div>

          {/* Student portal */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-teal-500 pl-2">
              শিক্ষার্থী কর্নার
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/my-learning" className="hover:text-teal-400 transition-colors">
                  আমার পড়াশোনা ড্যাশবোর্ড
                </Link>
              </li>
              <li>
                <Link href="/bookmarks" className="hover:text-teal-400 transition-colors">
                  বুকমার্ককৃত পাঠ
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-teal-400 transition-colors">
                  প্রোফাইল সেটিংস
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-amber-400/90 hover:text-amber-300 transition-colors flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  অ্যাডমিন ড্যাশবোর্ড
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Dishari Chemistry (দিশারী কেমিস্ট্রি)। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <span>বাংলাদেশ জাতীয় শিক্ষাক্রম (NCTB) ও জাতীয় বিশ্ববিদ্যালয় কারিকুলাম ভিত্তিক</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
