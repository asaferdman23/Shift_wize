import { getSampleWeekId, getWeek, getWeekSlots, getAssignmentsForWeek, getAllRoles } from '@/db/store';
import { formatDate, getShiftEmoji } from '@/lib/utils';
import { SHIFT_ORDER, SHIFT_LABELS, getWeekDates } from '@/db/types';
import type { ShiftType } from '@/db/types';

export const dynamic = 'force-dynamic';

export default async function SchedulePage({ params }: { params: Promise<{ weekId: string }> }) {
  const { weekId } = await params;
  await getSampleWeekId();

  const week = await getWeek(weekId);
  if (!week) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <h1 className="text-xl font-semibold">שבוע לא נמצא</h1>
      </div>
    );
  }

  const [slots, assignments, roles] = await Promise.all([
    getWeekSlots(weekId),
    getAssignmentsForWeek(weekId),
    getAllRoles(),
  ]);
  const dates = getWeekDates(week);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-lg mx-auto px-4 py-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <div>
              <h1 className="font-semibold">ShiftBoard</h1>
              <p className="text-xs text-white/80">{week.title} — לוח משמרות סופי</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {assignments.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg font-medium text-muted-foreground">טרם פורסם לוח משמרות</p>
            <p className="text-sm text-muted-foreground mt-1">בדוק שוב מאוחר יותר.</p>
          </div>
        ) : (
          dates.map(date => (
            <div key={date} className="space-y-3">
              {/* Day header */}
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-sm font-semibold text-foreground px-2">
                  {formatDate(date)}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {SHIFT_ORDER.map((shift: ShiftType) => {
                const shiftSlots = slots.filter(s => s.date === date && s.shift_type === shift);
                const shiftAssignments = assignments.filter(a =>
                  shiftSlots.some(s => s.id === a.week_slot_id)
                );

                if (shiftAssignments.length === 0) return null;

                return (
                  <div key={shift} className="bg-white rounded-xl border overflow-hidden">
                    <div className="px-4 py-2.5 bg-muted/30 border-b flex items-center gap-2">
                      <span className="text-base">{getShiftEmoji(shift)}</span>
                      <span className="font-medium text-sm">
                        {SHIFT_LABELS[shift]}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {shiftAssignments.length} שובצו
                      </span>
                    </div>

                    <div className="divide-y">
                      {roles.map(role => {
                        const roleSlot = shiftSlots.find(s => s.role_id === role.id);
                        if (!roleSlot) return null;
                        const roleAssignments = shiftAssignments.filter(
                          a => a.week_slot_id === roleSlot.id
                        );
                        if (roleAssignments.length === 0) return null;

                        return (
                          <div key={role.id} className="px-4 py-2.5">
                            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                              {role.name}
                            </div>
                            <div className="space-y-0.5">
                              {roleAssignments.map(a => (
                                <div key={a.id} className="text-sm">
                                  {a.soldier
                                    ? `${a.soldier.first_name} ${a.soldier.last_name}`
                                    : 'לא ידוע'}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            נוצר ע&quot;י ShiftBoard
          </p>
        </div>
      </div>
    </div>
  );
}
