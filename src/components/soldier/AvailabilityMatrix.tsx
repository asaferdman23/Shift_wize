'use client';

import { cn, formatDate, getShiftEmoji } from '@/lib/utils';
import type { ShiftType, Preference } from '@/db/types';
import { SHIFT_LABELS, SHIFT_ORDER } from '@/db/types';

interface AvailabilityMatrixProps {
  dates: string[];
  value: Record<string, Record<ShiftType, Preference>>;
  onChange: (val: Record<string, Record<ShiftType, Preference>>) => void;
}

export function AvailabilityMatrix({ dates, value, onChange }: AvailabilityMatrixProps) {
  const toggle = (date: string, shift: ShiftType) => {
    const current = value[date]?.[shift] || 'off';
    const next: Preference = current === 'available' ? 'off' : 'available';
    onChange({
      ...value,
      [date]: {
        ...value[date],
        [shift]: next,
      },
    });
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground">
        Availability
      </label>
      <p className="text-xs text-muted-foreground mb-3">
        Tap to toggle. Green = available, gray = off.
      </p>

      {/* Desktop: table view */}
      <div className="hidden sm:block">
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground p-3">Day</th>
                {SHIFT_ORDER.map(s => (
                  <th key={s} className="text-center text-xs font-medium text-muted-foreground p-3">
                    {getShiftEmoji(s)} {SHIFT_LABELS[s]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dates.map(date => (
                <tr key={date} className="border-t">
                  <td className="p-3 text-sm font-medium">{formatDate(date)}</td>
                  {SHIFT_ORDER.map(shift => {
                    const isAvail = value[date]?.[shift] === 'available';
                    return (
                      <td key={shift} className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => toggle(date, shift)}
                          className={cn(
                            'w-full h-10 rounded-lg text-sm font-medium transition-all duration-150',
                            isAvail
                              ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300 hover:bg-emerald-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          )}
                        >
                          {isAvail ? 'Available' : 'Off'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="sm:hidden space-y-3">
        {dates.map(date => (
          <div key={date} className="rounded-xl border p-4 space-y-3">
            <div className="text-sm font-semibold">{formatDate(date)}</div>
            <div className="grid grid-cols-3 gap-2">
              {SHIFT_ORDER.map(shift => {
                const isAvail = value[date]?.[shift] === 'available';
                return (
                  <button
                    key={shift}
                    type="button"
                    onClick={() => toggle(date, shift)}
                    className={cn(
                      'flex flex-col items-center gap-1 p-3 rounded-xl text-xs font-medium transition-all duration-150',
                      isAvail
                        ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
                        : 'bg-gray-100 text-gray-400'
                    )}
                  >
                    <span className="text-lg">{getShiftEmoji(shift)}</span>
                    <span>{SHIFT_LABELS[shift]}</span>
                    <span className="text-[10px] mt-0.5">
                      {isAvail ? 'Available' : 'Off'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
