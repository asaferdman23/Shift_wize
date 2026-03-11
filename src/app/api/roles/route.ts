import { NextResponse } from 'next/server';
import { getAllRoles } from '@/db/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getAllRoles());
}
