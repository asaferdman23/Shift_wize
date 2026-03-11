import { NextResponse } from 'next/server';
import { getWeek, getWeekSlots, updateWeekStatus } from '@/db/store';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ weekId: string }> }
) {
  const { weekId } = await params;
  const week = getWeek(weekId);
  if (!week) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const slots = getWeekSlots(weekId);
  return NextResponse.json({ ...week, slots });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ weekId: string }> }
) {
  const { weekId } = await params;
  const body = await req.json();
  if (body.status) {
    const updated = updateWeekStatus(weekId, body.status);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  }
  return NextResponse.json({ error: 'No update provided' }, { status: 400 });
}
