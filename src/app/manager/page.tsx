import { getSampleWeekId, getAllWeeks } from '@/db/store';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { STATUS_LABELS, getWeekDates } from '@/db/types';
import { formatDate } from '@/lib/utils';
import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CreateWeekButton } from '@/components/manager/CreateWeekButton';

export const dynamic = 'force-dynamic';

export default async function ManagerPage() {
  await getSampleWeekId();
  const weeks = await getAllWeeks();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg">ShiftBoard</h1>
              <p className="text-xs text-muted-foreground">פורטל מנהל</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">שבועות</h2>
          <CreateWeekButton />
        </div>

        <div className="space-y-3">
          {weeks.map(week => {
            const dates = getWeekDates(week);
            return (
              <Link key={week.id} href={`/manager/week/${week.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer border-0 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{week.title}</span>
                            <Badge variant={week.status === 'open' ? 'success' : 'secondary'}>
                              {STATUS_LABELS[week.status]}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(dates[0])} — {formatDate(dates[dates.length - 1])}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
