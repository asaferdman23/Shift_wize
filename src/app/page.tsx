import { getSampleWeekId } from '@/db/store';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Calendar, Users, LayoutGrid, Smartphone } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const weekId = getSampleWeekId();

  const features = [
    {
      icon: Calendar,
      title: 'Weekly Planning',
      desc: 'Create weekly schedules with flexible day/shift/role configuration.',
    },
    {
      icon: Users,
      title: 'Easy Submission',
      desc: 'One shared link. Soldiers fill availability from their phone in seconds.',
    },
    {
      icon: LayoutGrid,
      title: 'Smart Board',
      desc: 'Drag-and-drop scheduling with auto-recommendations. Like Jira for shifts.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Schedule',
      desc: 'Final schedule visible on mobile. Screenshot-ready for WhatsApp.',
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
            <Button variant="ghost" size="sm">Manager Portal</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          MVP — Reserve Duty Shift Scheduling
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance max-w-2xl mx-auto leading-[1.15]">
          Stop juggling spreadsheets.
          <br />
          <span className="text-primary">Schedule smarter.</span>
        </h1>
        <p className="text-muted-foreground text-lg mt-4 max-w-xl mx-auto">
          Replace your Google Form + Excel workflow with a single shared link,
          smart recommendations, and a drag-and-drop board.
        </p>

        <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
          <Link href={`/week/${weekId}`}>
            <Button size="lg" className="gap-2">
              Try Soldier Form
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href={`/manager/week/${weekId}`}>
            <Button size="lg" variant="outline" className="gap-2">
              Open Manager Dashboard
            </Button>
          </Link>
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
            <h3 className="font-semibold">Quick Demo Links</h3>
            <p className="text-sm text-muted-foreground">Sample week is pre-seeded with 20 soldiers and 12 responses.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link href={`/week/${weekId}`}>
              <Button variant="outline" size="sm">Soldier Form</Button>
            </Link>
            <Link href={`/manager/week/${weekId}`}>
              <Button variant="outline" size="sm">Manager Dashboard</Button>
            </Link>
            <Link href={`/week/${weekId}/schedule`}>
              <Button variant="outline" size="sm">Schedule View</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
