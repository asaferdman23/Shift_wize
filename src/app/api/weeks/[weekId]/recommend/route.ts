import { NextResponse } from 'next/server';
import { generateRecommendations } from '@/lib/recommendation-engine';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ weekId: string }> }
) {
  const { weekId } = await params;
  const result = generateRecommendations(weekId);
  return NextResponse.json(result);
}
