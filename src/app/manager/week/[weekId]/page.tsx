import {
  getSampleWeekId, getWeek, getWeekSlots, getAllRoles,
  getSubmissionsForWeek, getWeekParticipants, getParticipantSummary, getMissingResponders,
} from '@/db/store';
import { ManagerDashboardClient } from '@/components/manager/ManagerDashboardClient';

export const dynamic = 'force-dynamic';

export default async function ManagerWeekPage({ params }: { params: Promise<{ weekId: string }> }) {
  const { weekId } = await params;
  await getSampleWeekId(); // ensure seeded

  const week = await getWeek(weekId);
  if (!week) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">שבוע לא נמצא</h1>
          <a href="/manager" className="text-primary underline text-sm mt-2 block">חזור לשבועות</a>
        </div>
      </div>
    );
  }

  const [slots, roles, submissions, participants, summary, missing] = await Promise.all([
    getWeekSlots(weekId),
    getAllRoles(),
    getSubmissionsForWeek(weekId),
    getWeekParticipants(weekId),
    getParticipantSummary(weekId),
    getMissingResponders(weekId),
  ]);

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
