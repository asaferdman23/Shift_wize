import { getAllWeeks } from '@/db/store';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, Users, LayoutGrid, Smartphone } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const weeks = await getAllWeeks();
  const weekId = weeks.length > 0 ? weeks[0].id : null;

  const features = [
    {
      icon: Calendar,
      title: 'תכנון שבועי',
      desc: 'צור לוח משמרות שבועי עם עמדות ומשמרות גמישות.',
    },
    {
      icon: Users,
      title: 'הגשה קלה',
      desc: 'לינק אחד משותף. החיילים ממלאים זמינות מהנייד תוך שניות.',
    },
    {
      icon: LayoutGrid,
      title: 'לוח חכם',
      desc: 'גרירה ושחרור עם המלצות אוטומטיות. כמו ג\'ירה למשמרות.',
    },
    {
      icon: Smartphone,
      title: 'לוח משמרות לנייד',
      desc: 'לוח משמרות סופי בנייד. מוכן לצילום מסך ושליחה בוואטסאפ.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-background to-background">
      {/* Nav */}
      <nav className="border-b bg-white/60 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">ShiftBoard</span>
          </div>
          <Link href="/manager">
            <Button variant="ghost" size="sm">פורטל מנהל</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          ניהול משמרות מילואים
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance max-w-2xl mx-auto leading-[1.15]">
          תפסיקו לבזבז זמן על אקסלים.
          <br />
          <span className="text-primary">תנהלו משמרות חכם.</span>
        </h1>
        <p className="text-muted-foreground text-lg mt-4 max-w-xl mx-auto">
          החליפו את הגוגל פורם + האקסל בלינק משותף אחד,
          המלצות חכמות, ולוח גרירה ושחרור.
        </p>

        <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
          <Link href="/manager">
            <Button size="lg" className="gap-2">
              כניסה לפורטל מנהל
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          {weekId && (
            <Link href={`/week/${weekId}`}>
              <Button size="lg" variant="outline" className="gap-2">
                נסה טופס חייל
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(f => (
            <Card key={f.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl border p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold">קישורים מהירים</h3>
            <p className="text-sm text-muted-foreground">שבוע לדוגמה עם 55 חיילים ו-32 תגובות.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link href="/manager">
              <Button variant="outline" size="sm">לוח מנהל</Button>
            </Link>
            {weekId && (
              <>
                <Link href={`/week/${weekId}`}>
                  <Button variant="outline" size="sm">טופס חייל</Button>
                </Link>
                <Link href={`/week/${weekId}/schedule`}>
                  <Button variant="outline" size="sm">לוח משמרות</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
