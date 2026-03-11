'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  Shield,
  ArrowLeft,
  Calendar,
  Users,
  LayoutGrid,
  Sparkles,
  AlertTriangle,
  Share2,
  GripVertical,
  CheckCircle,
  Clock,
  Wand2,
  Copy,
  UserX,
  Filter,
  Phone,
  Star,
  Check,
  ExternalLink,
  Table2,
  ChevronLeft,
} from 'lucide-react';

/* ── animation variants ── */
const fade = {
  hidden: { opacity: 0, y: 20 },
  show: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: d * 0.1, duration: 0.55, ease: [0.25, 0.4, 0.45, 1] as const },
  }),
};

/* ── Reusable mini-components for demos ── */
function BrowserChrome({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200/80 bg-white shadow-2xl overflow-hidden">
      <div className="bg-gray-50/80 px-4 py-2 flex items-center gap-3 border-b border-gray-100">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white rounded-md px-3 py-0.5 text-[11px] text-gray-400 border border-gray-100 min-w-[200px] text-center font-mono">
            {url}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ text, variant }: { text: string; variant: 'green' | 'red' | 'amber' | 'gray' | 'blue' }) {
  const styles = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    gray: 'bg-gray-50 text-gray-500 border-gray-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${styles[variant]}`}>
      {text}
    </span>
  );
}

function Avatar({ letter, color }: { letter: string; color: string }) {
  return (
    <div className={`w-7 h-7 rounded-full ${color} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
      {letter}
    </div>
  );
}

function AvailDot({ available }: { available: boolean }) {
  return (
    <div className={`w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-bold ${
      available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-400'
    }`}>
      {available ? '✓' : '—'}
    </div>
  );
}

/* ══════════════════════════════════════════════════ */
/*                   LANDING PAGE                     */
/* ══════════════════════════════════════════════════ */

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-[#fafafa] overflow-x-hidden">

      {/* ─────────────────── NAV ─────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#111] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[15px] tracking-tight text-[#111]">ShiftWize</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[13px] text-gray-500">
            <a href="#features" className="hover:text-[#111] transition-colors">תכונות</a>
            <a href="#product" className="hover:text-[#111] transition-colors">המוצר</a>
            <a href="#pricing" className="hover:text-[#111] transition-colors">תמחור</a>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-[13px] text-gray-600 hover:text-[#111]">
                התחברות
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="text-[13px] bg-[#111] hover:bg-[#222] text-white rounded-lg h-8 px-4">
                התחל בחינם
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─────────────────── HERO ─────────────────── */}
      <section ref={heroRef} className="relative pt-28 pb-4 sm:pt-36 sm:pb-8">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-[1200px] mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[12px] font-medium border border-emerald-100 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            נבנה ע&quot;י מילואימניק עבור צה&quot;ל
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[40px] sm:text-[56px] md:text-[72px] font-extrabold tracking-[-0.03em] leading-[1.05] text-[#111] max-w-[900px] mx-auto"
          >
            ניהול משמרות
            <br />
            <span className="bg-gradient-to-l from-blue-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
              בלי האקסלים.
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-[17px] sm:text-[19px] text-gray-500 mt-5 max-w-[560px] mx-auto leading-relaxed"
          >
            שתפו לינק &rarr; החיילים ממלאים זמינות &rarr; גררו ושחררו. זהו.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex items-center justify-center gap-3 mt-8"
          >
            <Link href="/auth/register">
              <Button className="h-11 px-6 text-[14px] bg-[#111] hover:bg-[#222] text-white rounded-xl gap-2">
                התחילו בחינם
                <ArrowLeft className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <a href="#product">
              <Button variant="outline" className="h-11 px-6 text-[14px] rounded-xl border-gray-200 text-gray-600 hover:text-[#111]">
                צפו בדמו
              </Button>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[12px] text-gray-400 mt-4"
          >
            חינם לצוותים עד 100 חיילים &bull; ללא כרטיס אשראי &bull; הגדרה ב-2 דקות
          </motion.p>
        </motion.div>

        {/* ── HERO PRODUCT DEMO ── */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-[1100px] mx-auto px-6 mt-12"
        >
          <BrowserChrome url="shiftwize.app/manager/week/march-2026">
            <div className="bg-[#f8f8f8] p-4 sm:p-6">
              {/* Header bar */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#111]">שבוע מילואים — 15-17 מרץ</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">55 חיילים צפויים &bull; פתוח להגשה</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[11px] text-gray-500">
                    <Copy className="w-3 h-3" />
                    העתק לינק
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#111] text-white rounded-lg px-3 py-1.5 text-[11px]">
                    <ExternalLink className="w-3 h-3" />
                    פתח טופס
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded-lg w-fit mb-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md text-[11px] font-medium text-[#111] shadow-sm">
                  <Table2 className="w-3 h-3" />
                  תגובות
                  <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">32</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-gray-400">
                  <UserX className="w-3 h-3" />
                  חסרים
                  <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">23</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-gray-400">
                  <LayoutGrid className="w-3 h-3" />
                  לוח שיבוץ
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-2.5 mb-4">
                {[
                  { icon: Users, label: 'סה"כ צפויים', value: '55', sub: '38 ליבה · 17 תגבור', bg: 'bg-blue-50', iconColor: 'text-blue-500' },
                  { icon: CheckCircle, label: 'הגיבו', value: '32 (58%)', sub: '4 עדכנו', bg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
                  { icon: Clock, label: 'לא הגיבו', value: '23', sub: 'שלח תזכורת', bg: 'bg-red-50', iconColor: 'text-red-500' },
                  { icon: AlertTriangle, label: 'עם הגבלות', value: '8', sub: 'לא לילות, לא מטבח...', bg: 'bg-amber-50', iconColor: 'text-amber-500' },
                ].map((c) => (
                  <div key={c.label} className="bg-white rounded-xl border border-gray-100 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center`}>
                        <c.icon className={`w-3.5 h-3.5 ${c.iconColor}`} />
                      </div>
                      <span className="text-[10px] text-gray-400">{c.label}</span>
                    </div>
                    <div className="text-lg font-bold text-[#111] leading-none">{c.value}</div>
                    <div className="text-[10px] text-gray-400 mt-1">{c.sub}</div>
                  </div>
                ))}
              </div>

              {/* Filter bar */}
              <div className="flex items-center gap-1.5 mb-3">
                <Filter className="w-3 h-3 text-gray-300" />
                {[
                  { label: 'הכל', count: 55, active: true },
                  { label: 'לא הגישו', count: 23, active: false },
                  { label: 'תגבור', count: 17, active: false },
                  { label: 'עם הגבלות', count: 8, active: false },
                ].map((f) => (
                  <span
                    key={f.label}
                    className={`text-[10px] px-2 py-1 rounded-full ${
                      f.active
                        ? 'bg-[#111] text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {f.label} ({f.count})
                  </span>
                ))}
              </div>

              {/* Response Table */}
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-[2fr_0.8fr_0.8fr_repeat(3,0.5fr)_1.2fr] gap-2 px-3 py-2 bg-gray-50/80 border-b text-[10px] font-medium text-gray-400">
                  <span>חייל</span>
                  <span className="text-center">סוג</span>
                  <span className="text-center">סטטוס</span>
                  <span className="text-center">🌅 ה׳</span>
                  <span className="text-center">☀️ ו׳</span>
                  <span className="text-center">🌙 ש׳</span>
                  <span>הגבלות</span>
                </div>
                {/* Rows */}
                {[
                  { name: 'אבי כהן', id: '8401234', type: 'ליבה', typeBadge: 'blue' as const, status: 'הוגש', statusBadge: 'green' as const, avail: [true, true, false], constraint: '' },
                  { name: 'דני לוי', id: '8405678', type: 'ליבה', typeBadge: 'blue' as const, status: 'עודכן', statusBadge: 'green' as const, avail: [true, true, true], constraint: '' },
                  { name: 'יוסי דהן', id: '8409012', type: 'תגבור', typeBadge: 'amber' as const, status: 'הוגש', statusBadge: 'green' as const, avail: [true, false, true], constraint: 'לא לילות' },
                  { name: 'משה פרץ', id: '8403456', type: 'ליבה', typeBadge: 'blue' as const, status: 'חסר', statusBadge: 'red' as const, avail: [false, false, false], constraint: '' },
                  { name: 'שרה אלון', id: '8407890', type: 'תגבור', typeBadge: 'amber' as const, status: 'הוגש', statusBadge: 'green' as const, avail: [true, true, true], constraint: 'רק מטבח' },
                ].map((s, i) => (
                  <div
                    key={s.id}
                    className={`grid grid-cols-[2fr_0.8fr_0.8fr_repeat(3,0.5fr)_1.2fr] gap-2 px-3 py-2 items-center border-b border-gray-50 text-[11px] ${
                      s.statusBadge === 'red' ? 'bg-red-50/30' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar letter={s.name[0]} color={i % 3 === 0 ? 'bg-blue-500' : i % 3 === 1 ? 'bg-violet-500' : 'bg-amber-500'} />
                      <div>
                        <div className="font-medium text-[#111]">{s.name}</div>
                        <div className="text-[9px] text-gray-400">{s.id}</div>
                      </div>
                    </div>
                    <div className="text-center"><StatusBadge text={s.type} variant={s.typeBadge} /></div>
                    <div className="text-center"><StatusBadge text={s.status} variant={s.statusBadge} /></div>
                    {s.avail.map((a, j) => (
                      <div key={j} className="flex justify-center">
                        {s.statusBadge === 'red' ? (
                          <div className="w-5 h-5 rounded-full bg-gray-50 text-gray-300 text-[9px] flex items-center justify-center">—</div>
                        ) : (
                          <AvailDot available={a} />
                        )}
                      </div>
                    ))}
                    <div>
                      {s.constraint ? (
                        <StatusBadge text={s.constraint} variant="amber" />
                      ) : (
                        <span className="text-gray-300 text-[10px]">—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BrowserChrome>
          {/* Fade overlay */}
          <div className="h-24 -mt-24 relative z-10 bg-gradient-to-t from-[#fafafa] to-transparent pointer-events-none" />
        </motion.div>
      </section>

      {/* ─────────────────── FEATURES ─────────────────── */}
      <section id="features" className="py-20 sm:py-28">
        <div className="max-w-[1100px] mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16"
          >
            <motion.p variants={fade} custom={0} className="text-[12px] font-semibold text-violet-600 tracking-wide mb-3">
              תכונות
            </motion.p>
            <motion.h2 variants={fade} custom={1} className="text-[32px] sm:text-[40px] font-extrabold tracking-tight text-[#111]">
              הכל מה שצריך. כלום מה שלא.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Share2,
                iconBg: 'bg-blue-50',
                iconColor: 'text-blue-600',
                title: 'לינק אחד לכולם',
                desc: 'שתפו לינק בוואטסאפ. החיילים פותחים מהנייד, ממלאים שם + זמינות, והתגובה אצלכם תוך שניות.',
              },
              {
                icon: LayoutGrid,
                iconBg: 'bg-violet-50',
                iconColor: 'text-violet-600',
                title: 'לוח גרירה ושחרור',
                desc: 'גררו חיילים לעמדות. המערכת מזהה קונפליקטים, עומס יתר, וחיילים חסרים — בזמן אמת.',
              },
              {
                icon: Sparkles,
                iconBg: 'bg-amber-50',
                iconColor: 'text-amber-600',
                title: 'שיבוץ אוטומטי',
                desc: 'לחצו "שרביט קסם" והמערכת תשבץ חיילים לפי זמינות, חלוקה הוגנת, ואילוצים אישיים.',
              },
              {
                icon: AlertTriangle,
                iconBg: 'bg-red-50',
                iconColor: 'text-red-500',
                title: 'זיהוי קונפליקטים',
                desc: 'חייל שובץ פעמיים? סימן "לא זמין" אבל שובץ? שגיאות ואזהרות מוצגות מיד.',
              },
              {
                icon: UserX,
                iconBg: 'bg-rose-50',
                iconColor: 'text-rose-500',
                title: 'מעקב חסרי תגובה',
                desc: 'רשימת חיילים שטרם הגיבו עם כפתור העתקת טלפונים ושליחת תזכורת בוואטסאפ.',
              },
              {
                icon: Phone,
                iconBg: 'bg-emerald-50',
                iconColor: 'text-emerald-600',
                title: 'לוח משמרות לנייד',
                desc: 'לוח סופי מותאם לנייד. מוכן לצילום מסך ושליחה בקבוצה.',
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="show"
                custom={i * 0.5}
                viewport={{ once: true, margin: '-40px' }}
                variants={fade}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-md transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                </div>
                <h3 className="text-[15px] font-bold text-[#111] mb-1.5">{f.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── PRODUCT DEMO: BOARD ─────────────── */}
      <section id="product" className="py-20 sm:py-28 bg-white border-y border-gray-100">
        <div className="max-w-[1100px] mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-14"
          >
            <motion.p variants={fade} custom={0} className="text-[12px] font-semibold text-violet-600 tracking-wide mb-3">
              לוח השיבוץ
            </motion.p>
            <motion.h2 variants={fade} custom={1} className="text-[32px] sm:text-[40px] font-extrabold tracking-tight text-[#111]">
              גררו. שחררו. סיימתם.
            </motion.h2>
            <motion.p variants={fade} custom={2} className="text-gray-500 mt-3 text-[16px] max-w-md mx-auto">
              לוח שיבוץ בגרירה עם המלצות חכמות וזיהוי קונפליקטים בזמן אמת.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <BrowserChrome url="shiftwize.app/manager/week/march-2026#board">
              <div className="bg-[#f8f8f8] p-4 sm:p-6">
                {/* Board controls */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-[#111] text-white rounded-lg px-3 py-1.5 text-[11px]">
                      <Wand2 className="w-3 h-3" />
                      מילוי אוטומטי
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-500 rounded-lg px-3 py-1.5 text-[11px]">
                      נקה הכל
                    </div>
                    <span className="text-[10px] text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">14 שיבוצים</span>
                  </div>
                  {/* Conflict summary */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 rounded-lg px-2 py-1 text-[10px] border border-emerald-100">
                      <CheckCircle className="w-3 h-3" />
                      אין שגיאות
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 rounded-lg px-2 py-1 text-[10px] border border-amber-100">
                      <AlertTriangle className="w-3 h-3" />
                      2 אזהרות
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {/* Unassigned panel */}
                  <div className="w-44 shrink-0">
                    <div className="bg-white rounded-xl border border-gray-100 p-2.5">
                      <div className="text-[10px] font-medium text-gray-400 mb-2">לא שובצו (8)</div>
                      <div className="space-y-1.5">
                        {[
                          { name: 'רון אביב', color: 'bg-blue-500' },
                          { name: 'תמר שלום', color: 'bg-violet-500' },
                          { name: 'עומר כץ', color: 'bg-emerald-500' },
                          { name: 'נועה בר', color: 'bg-pink-500' },
                        ].map((s) => (
                          <div key={s.name} className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-1.5 cursor-grab">
                            <GripVertical className="w-3 h-3 text-gray-300" />
                            <Avatar letter={s.name[0]} color={s.color} />
                            <span className="text-[10px] font-medium text-[#111]">{s.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Schedule grid */}
                  <div className="flex-1 grid grid-cols-3 gap-2.5">
                    {[
                      { day: 'חמישי 15/3', shift: '🌅 בוקר', slots: [
                        { role: 'קב"ט מחנה', soldier: 'אבי כהן', color: 'bg-blue-500', ok: true },
                        { role: 'אב"ט שער', soldier: 'דני לוי', color: 'bg-violet-500', ok: true },
                        { role: 'סייר', soldier: null, color: '', ok: true },
                      ]},
                      { day: 'שישי 16/3', shift: '☀️ צהריים', slots: [
                        { role: 'קב"ט מחנה', soldier: 'יוסי דהן', color: 'bg-amber-500', ok: true },
                        { role: 'אב"ט שער', soldier: 'שרה אלון', color: 'bg-pink-500', ok: false },
                        { role: 'סייר', soldier: 'אבי כהן', color: 'bg-blue-500', ok: true },
                      ]},
                      { day: 'שבת 17/3', shift: '🌙 לילה', slots: [
                        { role: 'קב"ט מחנה', soldier: 'דני לוי', color: 'bg-violet-500', ok: true },
                        { role: 'אב"ט שער', soldier: 'משה פרץ', color: 'bg-emerald-500', ok: true },
                        { role: 'סייר', soldier: null, color: '', ok: true },
                      ]},
                    ].map((col) => (
                      <div key={col.day} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 text-center">
                          <div className="text-[10px] text-gray-400">{col.day}</div>
                          <div className="text-[12px] font-medium text-[#111]">{col.shift}</div>
                        </div>
                        <div className="p-2 space-y-1.5">
                          {col.slots.map((slot) => (
                            <div key={slot.role}>
                              <div className="text-[9px] text-gray-400 mb-0.5 px-1">{slot.role}</div>
                              {slot.soldier ? (
                                <div className={`flex items-center gap-1.5 rounded-lg p-1.5 border ${
                                  !slot.ok ? 'border-red-200 bg-red-50/50' : 'border-gray-100 bg-gray-50/50'
                                }`}>
                                  <GripVertical className="w-2.5 h-2.5 text-gray-300" />
                                  <Avatar letter={slot.soldier[0]} color={slot.color} />
                                  <span className="text-[10px] font-medium text-[#111] flex-1">{slot.soldier}</span>
                                  {!slot.ok && (
                                    <AlertTriangle className="w-3 h-3 text-red-400" />
                                  )}
                                </div>
                              ) : (
                                <div className="h-8 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                                  <span className="text-[9px] text-gray-300">גרור לכאן</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </BrowserChrome>
          </motion.div>
        </div>
      </section>

      {/* ──────────── PRODUCT DEMO: SOLDIER FORM ──────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
            >
              <motion.p variants={fade} custom={0} className="text-[12px] font-semibold text-violet-600 tracking-wide mb-3">
                טופס החייל
              </motion.p>
              <motion.h2 variants={fade} custom={1} className="text-[32px] sm:text-[36px] font-extrabold tracking-tight text-[#111] leading-tight">
                30 שניות מהנייד.
                <br />
                <span className="text-gray-400">בלי אפליקציה.</span>
              </motion.h2>
              <motion.p variants={fade} custom={2} className="text-gray-500 mt-4 text-[15px] leading-relaxed max-w-md">
                שלחו לינק אחד בוואטסאפ. החיילים פותחים מהדפדפן, ממלאים שם וזמינות, ומקבלים אישור מיידי. בלי הורדות, בלי הרשמה.
              </motion.p>
              <motion.div variants={fade} custom={3} className="mt-6 space-y-3">
                {[
                  'זיהוי אוטומטי לפי מספר אישי',
                  'עדכון זמינות חוזר עד הסגירה',
                  'אילוצים בטקסט חופשי',
                  'מותאם למובייל — 100%',
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-[13px] text-gray-600">{f}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Phone mockup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-[280px] bg-white rounded-[32px] border-[6px] border-gray-900 shadow-2xl overflow-hidden">
                {/* Phone notch */}
                <div className="bg-gray-900 h-6 flex items-center justify-center">
                  <div className="w-20 h-3 bg-gray-800 rounded-full" />
                </div>
                {/* Phone content */}
                <div className="bg-white">
                  {/* Form header */}
                  <div className="bg-white/90 backdrop-blur-sm border-b px-4 py-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#111] flex items-center justify-center">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-[#111]">ShiftWize</div>
                      <div className="text-[9px] text-gray-400">שבוע 15-17 מרץ</div>
                    </div>
                  </div>
                  {/* Form fields */}
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="text-[10px] font-medium text-gray-600 mb-1">מספר אישי</div>
                      <div className="h-8 bg-gray-50 rounded-lg border border-gray-200 flex items-center px-2.5 text-[11px] text-gray-400">8401234</div>
                      <div className="text-[9px] text-emerald-600 mt-0.5 flex items-center gap-1">
                        <CheckCircle className="w-2.5 h-2.5" />
                        נמצאה הגשה קיימת — הנתונים נטענו
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-[10px] font-medium text-gray-600 mb-1">שם פרטי</div>
                        <div className="h-8 bg-gray-50 rounded-lg border border-gray-200 flex items-center px-2.5 text-[11px] text-[#111]">אבי</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-medium text-gray-600 mb-1">שם משפחה</div>
                        <div className="h-8 bg-gray-50 rounded-lg border border-gray-200 flex items-center px-2.5 text-[11px] text-[#111]">כהן</div>
                      </div>
                    </div>
                    {/* Availability matrix */}
                    <div>
                      <div className="text-[10px] font-medium text-gray-600 mb-2">זמינות</div>
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-2">
                        <div className="grid grid-cols-4 gap-1 text-center text-[8px] text-gray-400 mb-1.5">
                          <span></span>
                          <span>🌅 בוקר</span>
                          <span>☀️ צהריים</span>
                          <span>🌙 לילה</span>
                        </div>
                        {['ה׳ 15', 'ו׳ 16', 'ש׳ 17'].map((day, di) => (
                          <div key={day} className="grid grid-cols-4 gap-1 mb-1">
                            <span className="text-[9px] text-gray-500 flex items-center">{day}</span>
                            {[0, 1, 2].map((si) => {
                              const on = !(di === 0 && si === 2) && !(di === 2 && si === 1);
                              return (
                                <div
                                  key={si}
                                  className={`h-6 rounded flex items-center justify-center text-[9px] font-bold ${
                                    on ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-400'
                                  }`}
                                >
                                  {on ? '✓' : '✗'}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#111] text-white text-[12px] font-medium text-center rounded-lg py-2.5 flex items-center justify-center gap-1.5">
                      עדכן זמינות
                      <ChevronLeft className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                {/* Phone bottom bar */}
                <div className="h-4 bg-white flex items-center justify-center">
                  <div className="w-24 h-1 bg-gray-200 rounded-full" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────── HOW IT WORKS ─────────────────── */}
      <section className="py-20 sm:py-28 bg-white border-y border-gray-100">
        <div className="max-w-[1100px] mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16"
          >
            <motion.p variants={fade} custom={0} className="text-[12px] font-semibold text-violet-600 tracking-wide mb-3">
              איך זה עובד
            </motion.p>
            <motion.h2 variants={fade} custom={1} className="text-[32px] sm:text-[40px] font-extrabold tracking-tight text-[#111]">
              שלושה צעדים. שתי דקות.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              {
                num: '1',
                icon: Calendar,
                title: 'צרו שבוע',
                desc: 'בחרו תאריכים, עמדות ומשמרות. הכל גמיש.',
              },
              {
                num: '2',
                icon: Users,
                title: 'שתפו לינק',
                desc: 'העתיקו לינק ושלחו בוואטסאפ. ממלאים תוך 30 שניות.',
              },
              {
                num: '3',
                icon: LayoutGrid,
                title: 'גררו ושחררו',
                desc: 'בנו את הלוח, קבלו המלצות, ופרסמו.',
              },
            ].map((s, i) => (
              <motion.div
                key={s.num}
                initial="hidden"
                whileInView="show"
                custom={i}
                viewport={{ once: true, margin: '-40px' }}
                variants={fade}
                className="text-center px-8 py-8 relative"
              >
                {i < 2 && (
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gray-200" />
                )}
                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-6 h-6 text-[#111]" />
                </div>
                <div className="text-[11px] font-bold text-violet-600 mb-2">שלב {s.num}</div>
                <h3 className="text-[17px] font-bold text-[#111] mb-1">{s.title}</h3>
                <p className="text-[13px] text-gray-500">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── TESTIMONIAL ─────────────────── */}
      <section className="py-20 sm:py-24">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center gap-0.5 mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <blockquote className="text-[22px] sm:text-[28px] font-bold leading-snug text-[#111]">
              &ldquo;מאז ShiftWize, אני חוסך 4 שעות כל שבוע מילואים.
              <span className="text-violet-600"> פשוט עובד.</span>&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">
                מ
              </div>
              <div className="text-right">
                <div className="font-semibold text-[13px] text-[#111]">מפקד פלוגה</div>
                <div className="text-[11px] text-gray-400">גדוד 51, חטיבת גולני</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────── PRICING ─────────────────── */}
      <section id="pricing" className="py-20 sm:py-28 bg-white border-y border-gray-100">
        <div className="max-w-[900px] mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-14"
          >
            <motion.p variants={fade} custom={0} className="text-[12px] font-semibold text-violet-600 tracking-wide mb-3">
              תמחור
            </motion.p>
            <motion.h2 variants={fade} custom={1} className="text-[32px] sm:text-[40px] font-extrabold tracking-tight text-[#111]">
              חינם. כי מגיע לכם.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Free */}
            <motion.div
              initial="hidden"
              whileInView="show"
              custom={0}
              viewport={{ once: true }}
              variants={fade}
              className="bg-[#fafafa] rounded-2xl border-2 border-[#111] p-7 relative"
            >
              <div className="absolute -top-3 right-6">
                <span className="text-[10px] font-bold bg-[#111] text-white px-3 py-1 rounded-full">
                  פופולרי
                </span>
              </div>
              <h3 className="text-[15px] font-bold text-[#111]">חינם</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-[48px] font-extrabold text-[#111] leading-none">₪0</span>
                <span className="text-gray-400 text-[14px]">/ לתמיד</span>
              </div>
              <p className="text-[13px] text-gray-500 mt-2">לצוותים עד 100 חיילים</p>
              <Link href="/auth/register" className="block mt-5">
                <Button className="w-full h-10 bg-[#111] hover:bg-[#222] text-white rounded-xl text-[13px]">
                  התחילו עכשיו
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <ul className="mt-5 space-y-2.5">
                {[
                  'שבועות ומשמרות ללא הגבלה',
                  'עד 100 חיילים בצוות',
                  'לוח גרירה ושחרור',
                  'המלצות חכמות',
                  'זיהוי קונפליקטים',
                  'לינק שיתוף לחיילים',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[13px] text-gray-600">
                    <Check className="w-4 h-4 text-[#111] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              initial="hidden"
              whileInView="show"
              custom={1}
              viewport={{ once: true }}
              variants={fade}
              className="bg-white rounded-2xl border border-gray-200 p-7"
            >
              <h3 className="text-[15px] font-bold text-[#111]">ארגוני</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-[32px] font-extrabold text-[#111] leading-none">צרו קשר</span>
              </div>
              <p className="text-[13px] text-gray-500 mt-2">לחטיבות ויחידות גדולות</p>
              <a href="mailto:contact@shiftwize.app" className="block mt-5">
                <Button variant="outline" className="w-full h-10 rounded-xl text-[13px] border-gray-200">
                  דברו איתנו
                </Button>
              </a>
              <ul className="mt-5 space-y-2.5">
                {[
                  'הכל בתוכנית החינמית',
                  'חיילים ללא הגבלה',
                  'ניהול מרובה צוותים',
                  'אינטגרציה עם מערכות צה"ל',
                  'תמיכה ייעודית',
                  'SLA מותאם',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[13px] text-gray-600">
                    <Check className="w-4 h-4 text-gray-300 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────── FINAL CTA ─────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[32px] sm:text-[44px] font-extrabold tracking-tight text-[#111] leading-tight">
              מוכנים לנהל משמרות
              <br />
              <span className="bg-gradient-to-l from-blue-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
                בלי כאב ראש?
              </span>
            </h2>
            <p className="text-gray-500 mt-4 text-[16px]">
              הגדרה בשתי דקות. בלי כרטיס אשראי. בלי התחייבות.
            </p>
            <Link href="/auth/register" className="inline-block mt-8">
              <Button className="h-12 px-8 text-[15px] bg-[#111] hover:bg-[#222] text-white rounded-xl gap-2">
                התחילו בחינם
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────── FOOTER ─────────────────── */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#111] flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
              <span className="text-[13px] font-bold text-[#111]">ShiftWize</span>
            </div>
            <p className="text-[11px] text-gray-400">
              נבנה ע&quot;י מילואימניק עבור צה&quot;ל &bull; &copy; {new Date().getFullYear()} ShiftWize
            </p>
            <div className="flex gap-5 text-[11px] text-gray-400">
              <a href="#" className="hover:text-[#111] transition-colors">תנאי שימוש</a>
              <a href="#" className="hover:text-[#111] transition-colors">פרטיות</a>
              <a href="mailto:contact@shiftwize.app" className="hover:text-[#111] transition-colors">צור קשר</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
