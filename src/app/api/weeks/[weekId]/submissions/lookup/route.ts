import { NextResponse } from 'next/server';
import { findSoldierByPersonalNumber, findSubmission } from '@/db/store';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const weekId = url.pathname.split('/')[3]; // /api/weeks/[weekId]/...
  const personalNumber = url.searchParams.get('personal_number');
  
  if (!personalNumber) {
    return NextResponse.json({ error: 'personal_number required' }, { status: 400 });
  }

  const soldier = findSoldierByPersonalNumber(personalNumber);
  if (!soldier) {
    return NextResponse.json({ found: false });
  }

  const submission = findSubmission(weekId, soldier.id);
  if (!submission) {
    return NextResponse.json({ found: false, soldier });
  }

  return NextResponse.json({ found: true, soldier, submission });
}
