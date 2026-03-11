import { NextResponse } from 'next/server';
import {
  getAssignmentsForWeek,
  createAssignment,
  deleteAssignment,
  moveAssignment,
  clearAssignmentsForWeek,
} from '@/db/store';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ weekId: string }> }
) {
  const { weekId } = await params;
  return NextResponse.json(getAssignmentsForWeek(weekId));
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ weekId: string }> }
) {
  const { weekId } = await params;
  const body = await req.json();

  // Batch create (from recommendations)
  if (Array.isArray(body)) {
    const results = body.map((item: any) =>
      createAssignment({
        week_id: weekId,
        soldier_id: item.soldier_id,
        week_slot_id: item.week_slot_id,
        source: item.source || 'recommended',
      })
    );
    return NextResponse.json(results, { status: 201 });
  }

  const assignment = createAssignment({
    week_id: weekId,
    soldier_id: body.soldier_id,
    week_slot_id: body.week_slot_id,
    source: body.source || 'manual',
  });
  return NextResponse.json(assignment, { status: 201 });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ weekId: string }> }
) {
  const body = await req.json();
  if (body.assignment_id && body.new_slot_id) {
    const result = moveAssignment(body.assignment_id, body.new_slot_id);
    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(result);
  }
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ weekId: string }> }
) {
  const { weekId } = await params;
  const url = new URL(req.url);
  const assignmentId = url.searchParams.get('id');
  const clearAll = url.searchParams.get('clear');

  if (clearAll === 'true') {
    clearAssignmentsForWeek(weekId);
    return NextResponse.json({ ok: true });
  }

  if (assignmentId) {
    deleteAssignment(assignmentId);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'id or clear param required' }, { status: 400 });
}
