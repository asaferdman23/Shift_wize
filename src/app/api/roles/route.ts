import { NextResponse } from 'next/server';
import { getAllRoles } from '@/db/store';

export async function GET() {
  return NextResponse.json(getAllRoles());
}
