import { NextResponse } from 'next/server';
import { getAllWeeks, createWeek, createWeekSlot, getAllRoles } from '@/db/store';
import type { ShiftType } from '@/db/types';
import { getWeekDates } from '@/db/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getAllWeeks());
}

// Slot requirements per role per shift
const SLOT_REQUIREMENTS: { roleName: string; morning: number; noon: number; night: number }[] = [
  { roleName: 'יולדות', morning: 4, noon: 3, night: 3 },
  { roleName: 'מטבח', morning: 3, noon: 3, night: 2 },
  { roleName: 'מכון הלב', morning: 2, noon: 2, night: 2 },
  { roleName: 'מסר', morning: 1, noon: 1, night: 1 },
  { roleName: 'מעלית שיקום', morning: 3, noon: 1, night: 0 },
  { roleName: 'סדרן חניה + מעלית שיקום', morning: 2, noon: 0, night: 0 },
  { roleName: 'צירים', morning: 1, noon: 0, night: 0 },
  { roleName: 'שינוע דמים', morning: 2, noon: 0, night: 2 },
  { roleName: 'שיקום', morning: 1, noon: 0, night: 1 },
];

export async function POST(req: Request) {
  const body = await req.json();
  const week = await createWeek(body);

  // Auto-create slots for all dates × shifts × roles
  const roles = await getAllRoles();
  const roleByName = new Map(roles.map(r => [r.name, r]));
  const dates = getWeekDates(week);
  const shifts: ShiftType[] = ['morning', 'noon', 'night'];

  for (const date of dates) {
    for (const shift of shifts) {
      for (const req of SLOT_REQUIREMENTS) {
        const role = roleByName.get(req.roleName);
        if (!role) continue;
        const count = req[shift];
        if (count <= 0) continue;
        await createWeekSlot({
          week_id: week.id,
          date,
          shift_type: shift,
          role_id: role.id,
          required_count: count,
        });
      }
    }
  }

  return NextResponse.json(week, { status: 201 });
}
