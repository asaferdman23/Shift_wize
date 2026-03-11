import { NextResponse } from 'next/server';
import { getSampleWeekId } from '@/db/store';

export async function POST() {
  const weekId = getSampleWeekId();
  return NextResponse.json({ weekId });
}

export async function GET() {
  const weekId = getSampleWeekId();
  return NextResponse.json({ weekId });
}
