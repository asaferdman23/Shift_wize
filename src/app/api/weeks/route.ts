import { NextResponse } from 'next/server';
import { getAllWeeks, createWeek } from '@/db/store';

export async function GET() {
  return NextResponse.json(getAllWeeks());
}

export async function POST(req: Request) {
  const body = await req.json();
  const week = createWeek(body);
  return NextResponse.json(week, { status: 201 });
}
