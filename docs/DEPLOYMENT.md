# Dishari Chemistry — Deployment Instructions

এই নির্দেশিকাটি Dishari Chemistry অ্যাপ্লিকেশনটিকে Vercel, Docker অথবা Cloud Run এ প্রোডাকশনে ডেপ্লয় করার জন্য নির্দেশাবলী প্রদান করে।

---

## ১. Vercel এ ডেপ্লয়মেন্ট

1. আপনার গিটহাব রিপোজিটরিটিকে Vercel এর সাথে কানেক্ট করুন।
2. **Build & Development Settings**:
   - Framework Preset: `Next.js`
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`
3. **Environment Variables**:
   - `APP_URL`: আপনার প্রোডাকশন ডোমেইন (যেমন: `https://disharichemistry.com`)
   - `GEMINI_API_KEY`: প্রয়োজনীয় সার্ভার সাইড সিক্রেট কি
4. **Deploy** বাটনে ক্লিক করুন।

---

## ২. Docker / Cloud Run ডেপ্লয়মেন্ট

`next.config.ts` ফাইলে `output: 'standalone'` কনফিগার করা আছে।
```bash
docker build -t dishari-chemistry .
docker run -p 3000:3000 dishari-chemistry
```

প্রোডাকশন বিল্ড রান করতে:
```bash
npm run build
npm start
```
সার্ভার স্বয়ংক্রিয়ভাবে পোর্ট ৩০০০-এ চালু হবে।
