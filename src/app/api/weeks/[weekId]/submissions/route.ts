import { NextResponse } from 'next/server';
import {
  getSubmissionsForWeek,
  upsertSoldier,
  upsertSubmission,
  findSoldierByPersonalNumber,
  ensureParticipant,
} from '@/db/store';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ weekId: string }> }
) {
  const { weekId } = await params;
  return NextResponse.json(getSubmissionsForWeek(weekId));
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ weekId: string }> }
) {
  const { weekId } = await params;
  const body = await req.json();

  // Check if soldier exists already; if not, they're reinforcement (external)
  const existingSoldier = findSoldierByPersonalNumber(body.personal_number);

  // Upsert soldier — new soldiers default to 'reinforcement'
  const soldier = upsertSoldier({
    first_name: body.first_name,
    last_name: body.last_name,
    personal_number: body.personal_number,
    phone: body.phone,
    car_number: body.car_number,
    participant_type: existingSoldier?.participant_type, // keep existing type
  });

  // Ensure they're registered as a participant for this week
  ensureParticipant(weekId, soldier.id);

  // Upsert submission (also updates participant status)
  const submission = upsertSubmission({
    week_id: weekId,
    soldier_id: soldier.id,
    constraints_text: body.constraints_text,
    availability: body.availability,
  });

  return NextResponse.json(submission, { status: 201 });
}
