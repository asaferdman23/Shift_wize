'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Shield,
  ArrowLeft,
  Calendar,
  Users,
  LayoutGrid,
  Smartphone,
  Sparkles,
  AlertTriangle,
  Share2,
  GripVertical,
  Zap,
  Play,
  Star,
  ChevronDown,
  Check,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* ─── NAV ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">ShiftWize</span>
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">תכונות</a>
            <a href="#how" className="hover:text-foreground transition-colors">איך זה עובד</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">תמחור</a>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">התחבר</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="glow-sm">התחל בחינם</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-mesh noise">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/6 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-medium mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            נבנה ע&quot;י מילואימניק עבור צה&quot;ל
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto"
          >
            תפסיקו לנהל משמרות
            <br />
            <span className="text-gradient">באקסלים מהגיהנום.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-lg sm:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            לינק אחד משותף. החיילים ממלאים זמינות מהנייד.
            <br className="hidden sm:block" />
            אתם גוררים ושוחררים — והלוח מוכן.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-3 mt-10 flex-wrap"
          >
            <Link href="/auth/register">
              <Button size="lg" className="text-base h-13 px-8 glow animate-pulse-glow">
                התחילו בחינם
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#how">
              <Button size="lg" variant="outline" className="text-base h-13 px-8 gap-2">
                <Play className="w-4 h-4" />
                איך זה עובד?
              </Button>
            </a>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 flex items-center justify-center gap-3"
          >
            <div className="flex -space-x-2 rtl:space-x-reverse">
              {[
                'bg-blue-500',
                'bg-emerald-500',
                'bg-orange-500',
                'bg-purple-500',
                'bg-pink-500',
              ].map((color, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-[10px] font-bold text-white`}
                >
                  {['א', 'ד', 'מ', 'י', 'ש'][i]}
                </div>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">+50 צוותים</span> כבר משתמשים
            </div>
          </motion.div>

          {/* Hero Visual — Floating Board Mock */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 relative max-w-4xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20 pointer-events-none" />
            <div className="glass-card rounded-2xl p-1 shadow-2xl border-gradient">
              {/* Browser chrome */}
              <div className="bg-gray-50 rounded-t-xl px-4 py-2.5 flex items-center gap-2 border-b">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white rounded-md px-4 py-1 text-xs text-muted-foreground border w-64 text-center">
                    shiftwize.app/manager
                  </div>
                </div>
              </div>
              {/* Mock Board Content */}
              <div className="bg-white rounded-b-xl p-6 min-h-[280px] sm:min-h-[340px]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="h-5 w-48 bg-gray-100 rounded-md" />
                    <div className="h-3 w-32 bg-gray-50 rounded mt-2" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-24 bg-primary/10 rounded-lg" />
                    <div className="h-8 w-8 bg-primary rounded-lg" />
                  </div>
                </div>
                {/* Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {['בוקר', 'צהריים', 'לילה'].map((shift) => (
                    <div key={shift} className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground text-center py-1 bg-gray-50 rounded-lg">
                        {shift}
                      </div>
                      {[1, 2, 3].map((j) => (
                        <div
                          key={j}
                          className="h-10 rounded-lg border border-dashed border-gray-200 flex items-center justify-center"
                        >
                          {j <= 2 ? (
                            <div className="flex items-center gap-1.5 px-2">
                              <GripVertical className="w-3 h-3 text-gray-300" />
                              <div className="h-5 w-5 rounded-full bg-primary/20" />
                              <div className="h-2.5 w-16 bg-gray-100 rounded" />
                            </div>
                          ) : (
                            <div className="text-[10px] text-gray-300">+ גרור לכאן</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex justify-center mt-8"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground animate-bounce" />
        </motion.div>
      </section>

      {/* ─── TRUST STRIP ─── */}
      <section className="py-12 border-b bg-white/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-6">
            נבנה עבור צוותי מילואים מובילים
          </p>
          <div className="flex items-center justify-center gap-10 sm:gap-16 opacity-30">
            {['חי"ר', 'שריון', 'תותחנים', 'הנדסה', 'חי"ר 51'].map((unit) => (
              <div key={unit} className="text-lg sm:text-xl font-bold tracking-tight">
                {unit}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES BENTO ─── */}
      <section id="features" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp} custom={0}>
              <span className="text-xs font-semibold text-primary bg-primary/8 px-3 py-1 rounded-full">
                תכונות
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-bold mt-4"
            >
              הכל מה שצריך.
              <br />
              <span className="text-muted-foreground">כלום מה שלא.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Feature 1 — Large */}
            <motion.div
              variants={fadeUp}
              custom={0}
              className="group glass-card rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border-gradient"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Share2 className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">לינק אחד — 55 חיילים ממלאים</h3>
              <p className="text-muted-foreground leading-relaxed">
                שתפו לינק בוואטסאפ. החיילים פותחים מהנייד, ממלאים שם + זמינות,
                ותוך שניות — התגובה אצלכם בלוח.
              </p>
              <div className="mt-6 bg-gray-50 rounded-xl p-4 border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    א
                  </div>
                  <div className="flex-1">
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="h-2 w-16 bg-gray-100 rounded mt-1" />
                  </div>
                  <div className="flex gap-1">
                    <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full">זמין</div>
                    <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full">זמין</div>
                    <div className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] rounded-full">לא</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-bold text-orange-600">
                    ד
                  </div>
                  <div className="flex-1">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-2 w-12 bg-gray-100 rounded mt-1" />
                  </div>
                  <div className="flex gap-1">
                    <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full">זמין</div>
                    <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full">זמין</div>
                    <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full">זמין</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2 — Large */}
            <motion.div
              variants={fadeUp}
              custom={1}
              className="group glass-card rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border-gradient"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <LayoutGrid className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">לוח גרירה ושחרור</h3>
              <p className="text-muted-foreground leading-relaxed">
                גררו חיילים לעמדות. הלוח יגיד לכם מיד אם יש קונפליקט,
                עומס יתר, או חייל שחסר.
              </p>
              <div className="mt-6 bg-gray-50 rounded-xl p-4 border space-y-2">
                {['קב"ט מחנה', 'אב"ט שער', 'סייר'].map((role, i) => (
                  <div key={role} className="flex items-center gap-2 bg-white rounded-lg p-2 border">
                    <GripVertical className="w-3.5 h-3.5 text-gray-300" />
                    <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-[9px] font-bold text-primary">
                      {['מ', 'א', 'ס'][i]}
                    </div>
                    <span className="text-xs font-medium flex-1">{role}</span>
                    {i === 2 ? (
                      <div className="px-1.5 py-0.5 bg-red-50 text-red-500 text-[9px] rounded border border-red-100">
                        קונפליקט
                      </div>
                    ) : (
                      <div className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] rounded border border-emerald-100">
                        תקין
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Feature 3 — Small */}
            <motion.div
              variants={fadeUp}
              custom={2}
              className="group glass-card rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border-gradient"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">המלצות חכמות</h3>
              <p className="text-muted-foreground leading-relaxed">
                לחצו &quot;שרביט קסם&quot; — והמערכת תשבץ אוטומטית חיילים
                לפי זמינות, הגינות חלוקה, ואילוצים אישיים.
              </p>
            </motion.div>

            {/* Feature 4 — Small */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="group glass-card rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border-gradient"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">זיהוי קונפליקטים</h3>
              <p className="text-muted-foreground leading-relaxed">
                חייל שובץ פעמיים? סימן &quot;לא זמין&quot; אבל שובץ?
                המערכת מציגה שגיאות ואזהרות בזמן אמת.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" className="py-20 sm:py-28 bg-white/50 border-y">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp} custom={0}>
              <span className="text-xs font-semibold text-primary bg-primary/8 px-3 py-1 rounded-full">
                איך זה עובד
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-bold mt-4"
            >
              שלושה צעדים.
              <br />
              <span className="text-muted-foreground">שתי דקות.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                step: '01',
                icon: Calendar,
                title: 'צרו שבוע',
                desc: 'בחרו תאריכים, עמדות ומשמרות. הכל גמיש — מ-3 ימים עד שבוע שלם.',
                color: 'blue',
              },
              {
                step: '02',
                icon: Users,
                title: 'שתפו לינק',
                desc: 'העתיקו את הלינק ושלחו בקבוצת הוואטסאפ. החיילים ממלאים מהנייד תוך 30 שניות.',
                color: 'purple',
              },
              {
                step: '03',
                icon: LayoutGrid,
                title: 'גררו ושחררו',
                desc: 'בנו את לוח המשמרות בגרירה, קבלו המלצות חכמות, ופרסמו.',
                color: 'emerald',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                custom={i}
                className="relative text-center"
              >
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 -left-4 w-8 border-t-2 border-dashed border-gray-200" />
                )}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10 mb-6 mx-auto">
                  <item.icon className="w-10 h-10 text-primary" />
                </div>
                <div className="text-xs font-bold text-primary/40 mb-2">שלב {item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── PRODUCT SCREENSHOT ─── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl font-bold"
            >
              ממשק שנבנה למהירות
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-muted-foreground mt-3 text-lg"
            >
              כמו ג&apos;ירה למשמרות — מהיר, נקי, ובלי בולשיט.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 rounded-3xl blur-2xl opacity-40" />
            <div className="relative glass-card rounded-2xl p-1 shadow-2xl border-gradient">
              <div className="bg-gray-50 rounded-t-xl px-4 py-2.5 flex items-center gap-2 border-b">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white rounded-md px-4 py-1 text-xs text-muted-foreground border w-72 text-center">
                    shiftwize.app/manager/week/abc123
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-b-xl p-8 min-h-[320px] sm:min-h-[400px]">
                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-gray-50 p-1 rounded-xl w-fit">
                  <div className="px-4 py-2 bg-white rounded-lg text-xs font-medium shadow-sm">תגובות</div>
                  <div className="px-4 py-2 text-xs font-medium text-muted-foreground">חסרים</div>
                  <div className="px-4 py-2 text-xs font-medium text-muted-foreground">לוח שיבוץ</div>
                </div>
                {/* Summary cards */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { label: 'צפויים', value: '55', color: 'bg-blue-50 text-blue-600' },
                    { label: 'הגישו', value: '32', color: 'bg-emerald-50 text-emerald-600' },
                    { label: 'חסרים', value: '23', color: 'bg-red-50 text-red-600' },
                    { label: 'אילוצים', value: '8', color: 'bg-amber-50 text-amber-600' },
                  ].map((card) => (
                    <div key={card.label} className="rounded-xl border p-3 text-center">
                      <div className={`text-2xl font-bold ${card.color.split(' ')[1]}`}>{card.value}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{card.label}</div>
                    </div>
                  ))}
                </div>
                {/* Table mock */}
                <div className="space-y-2">
                  {[
                    { name: 'אבי כהן', status: 'הגיש', badge: 'bg-emerald-100 text-emerald-700' },
                    { name: 'דני לוי', status: 'הגיש', badge: 'bg-emerald-100 text-emerald-700' },
                    { name: 'משה פרץ', status: 'טרם הגיש', badge: 'bg-gray-100 text-gray-500' },
                    { name: 'יוסי דהן', status: 'עם אילוצים', badge: 'bg-amber-100 text-amber-700' },
                  ].map((row) => (
                    <div key={row.name} className="flex items-center gap-3 p-2.5 bg-gray-50/50 rounded-lg">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {row.name[0]}
                      </div>
                      <span className="text-sm font-medium flex-1">{row.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${row.badge}`}>
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── TESTIMONIAL ─── */}
      <section className="py-20 sm:py-24 bg-white/50 border-y">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <blockquote className="text-2xl sm:text-3xl font-bold leading-snug">
              &ldquo;מאז שעברנו לShiftWize, אני חוסך 4 שעות כל שבוע מילואים.
              <span className="text-gradient"> פשוט עובד.</span>&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                מ
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm">מפקד פלוגה</div>
                <div className="text-xs text-muted-foreground">גדוד 51, חטיבת גולני</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp} custom={0}>
              <span className="text-xs font-semibold text-primary bg-primary/8 px-3 py-1 rounded-full">
                תמחור
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-bold mt-4"
            >
              חינם. כי מילואימניקים
              <br />
              <span className="text-muted-foreground">מגיע להם.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
          >
            {/* Free Plan */}
            <motion.div
              variants={fadeUp}
              custom={0}
              className="glass-card rounded-2xl p-8 border-gradient relative overflow-hidden"
            >
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                  פופולרי
                </span>
              </div>
              <h3 className="text-lg font-bold">חינם</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold">₪0</span>
                <span className="text-muted-foreground text-sm">/ לתמיד</span>
              </div>
              <p className="text-sm text-muted-foreground mt-3">לצוותים עד 100 חיילים</p>
              <Link href="/auth/register" className="block mt-6">
                <Button size="lg" className="w-full glow">
                  התחילו עכשיו
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <ul className="mt-6 space-y-3">
                {[
                  'שבועות ומשמרות ללא הגבלה',
                  'עד 100 חיילים בצוות',
                  'לוח גרירה ושחרור',
                  'המלצות חכמות',
                  'זיהוי קונפליקטים',
                  'לינק שיתוף לחיילים',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              variants={fadeUp}
              custom={1}
              className="glass-card rounded-2xl p-8 border border-border"
            >
              <h3 className="text-lg font-bold">ארגוני</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold">צרו קשר</span>
              </div>
              <p className="text-sm text-muted-foreground mt-3">לחטיבות ויחידות גדולות</p>
              <a href="mailto:contact@shiftwize.app" className="block mt-6">
                <Button size="lg" variant="outline" className="w-full">
                  דברו איתנו
                </Button>
              </a>
              <ul className="mt-6 space-y-3">
                {[
                  'הכל בתוכנית החינמית',
                  'חיילים ללא הגבלה',
                  'ניהול מרובה צוותים',
                  'אינטגרציה עם מערכות צה"ל',
                  'תמיכה ייעודית',
                  'SLA מותאם',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-muted-foreground shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 sm:py-28 bg-mesh-dark relative noise">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              מוכנים לנהל משמרות
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                כמו שצריך?
              </span>
            </h2>
            <p className="text-white/60 mt-4 text-lg">
              הגדרה בשתי דקות. בלי כרטיס אשראי. בלי התחייבות.
            </p>
            <Link href="/auth/register" className="inline-block mt-8">
              <Button
                size="lg"
                className="text-base h-14 px-10 bg-white text-foreground hover:bg-white/90 glow animate-pulse-glow"
              >
                התחילו בחינם עכשיו
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <p className="text-white/30 text-xs mt-4">
              ללא כרטיס אשראי &bull; הגדרה ב-2 דקות &bull; ביטול בכל עת
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-10 border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold tracking-tight">ShiftWize</span>
            </div>
            <p className="text-xs text-muted-foreground">
              נבנה ע&quot;י מילואימניק עבור צה&quot;ל &bull; &copy; {new Date().getFullYear()} ShiftWize
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">תנאי שימוש</a>
              <a href="#" className="hover:text-foreground transition-colors">פרטיות</a>
              <a href="mailto:contact@shiftwize.app" className="hover:text-foreground transition-colors">צור קשר</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
