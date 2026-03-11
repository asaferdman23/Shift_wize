import { NextResponse } from 'next/server';
import { generateRecommendations } from '@/lib/recommendation-engine';
import { getWeekSlots, getSubmissionsForWeek, getAssignmentsForWeek, getAllRoles } from '@/db/store';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ weekId: string }> }
) {
  const { weekId } = await params;

  const [slots, subs, existingAssignments, roles] = await Promise.all([
    getWeekSlots(weekId),
    getSubmissionsForWeek(weekId),
    getAssignmentsForWeek(weekId),
    getAllRoles(),
  ]);

  const result = generateRecommendations(slots, subs, existingAssignments, roles);
  return NextResponse.json(result);
}
