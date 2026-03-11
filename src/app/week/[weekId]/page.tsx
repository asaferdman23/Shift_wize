import { getWeek, getWeekSlots } from '@/db/store';
import { SoldierAvailabilityForm } from '@/components/soldier/SoldierAvailabilityForm';

export const dynamic = 'force-dynamic';

export default async function SoldierWeekPage({ params }: { params: Promise<{ weekId: string }> }) {
  const { weekId } = await params;

  const week = await getWeek(weekId);
  if (!week) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">שבוע לא נמצא</h1>
          <p className="text-muted-foreground">הלינק עשוי להיות לא תקין או פג תוקף.</p>
        </div>
      </div>
    );
  }

  if (week.status === 'closed' || week.status === 'published') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">ההגשות נסגרו</h1>
          <p className="text-muted-foreground">
            טופס הזמינות לשבוע זה כבר לא מקבל תגובות.
          </p>
          {week.status === 'published' && (
            <a href={`/week/${weekId}/schedule`} className="text-primary underline text-sm">
              צפה בלוח משמרות
            </a>
          )}
        </div>
      </div>
    );
  }

  const slots = await getWeekSlots(weekId);

  return <SoldierAvailabilityForm week={{ ...week, slots }} />;
}
