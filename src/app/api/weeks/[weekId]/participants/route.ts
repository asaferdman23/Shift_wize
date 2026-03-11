import { NextResponse } from 'next/server';
import {
  getWeekParticipants,
  getParticipantSummary,
  getMissingResponders,
} from '@/db/store';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ weekId: string }> }
) {
  const { weekId } = await params;
  const url = new URL(req.url);
  const view = url.searchParams.get('view');

  if (view === 'summary') {
    return NextResponse.json(getParticipantSummary(weekId));
  }

  if (view === 'missing') {
    return NextResponse.json(getMissingResponders(weekId));
  }

  return NextResponse.json(getWeekParticipants(weekId));
}
