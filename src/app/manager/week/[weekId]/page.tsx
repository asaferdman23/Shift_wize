import {
  getSampleWeekId, getWeek, getWeekSlots, getAllRoles,
  getSubmissionsForWeek, getWeekParticipants, getParticipantSummary, getMissingResponders,
} from '@/db/store';
import { ManagerDashboardClient } from '@/components/manager/ManagerDashboardClient';

export const dynamic = 'force-dynamic';

export default async function ManagerWeekPage({ params }: { params: Promise<{ weekId: string }> }) {
  const { weekId } = await params;
  getSampleWeekId(); // ensure seeded

  const week = getWeek(weekId);
  if (!week) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Week not found</h1>
          <a href="/manager" className="text-primary underline text-sm mt-2 block">Back to weeks</a>
        </div>
      </div>
    );
  }

  const slots = getWeekSlots(weekId);
  const roles = getAllRoles();
  const submissions = getSubmissionsForWeek(weekId);
  const participants = getWeekParticipants(weekId);
  const summary = getParticipantSummary(weekId);
  const missing = getMissingResponders(weekId);

  return (
    <ManagerDashboardClient
      week={week}
      slots={slots}
      roles={roles}
      initialSubmissions={submissions}
      initialParticipants={participants}
      initialSummary={summary}
      initialMissing={missing}
    />
  );
}
