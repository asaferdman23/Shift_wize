import { NextResponse } from 'next/server';
import { getSampleWeekId } from '@/db/store';

export async function POST() {
  const weekId = await getSampleWeekId();
  return NextResponse.json({ weekId });
}

export async function GET() {
  const weekId = await getSampleWeekId();
  return NextResponse.json({ weekId });
}
