import { getSampleWeekId, getWeek, getWeekSlots } from '@/db/store';
import { SoldierAvailabilityForm } from '@/components/soldier/SoldierAvailabilityForm';

// Ensure data is seeded
export const dynamic = 'force-dynamic';

export default async function SoldierWeekPage({ params }: { params: Promise<{ weekId: string }> }) {
  const { weekId } = await params;
  // Ensure seed
  getSampleWeekId();

  const week = getWeek(weekId);
  if (!week) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Week not found</h1>
          <p className="text-muted-foreground">This link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  if (week.status === 'closed' || week.status === 'published') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Submissions Closed</h1>
          <p className="text-muted-foreground">
            This week&apos;s availability form is no longer accepting responses.
          </p>
          {week.status === 'published' && (
            <a href={`/week/${weekId}/schedule`} className="text-primary underline text-sm">
              View Published Schedule
            </a>
          )}
        </div>
      </div>
    );
  }

  const slots = getWeekSlots(weekId);

  return <SoldierAvailabilityForm week={{ ...week, slots }} />;
}
