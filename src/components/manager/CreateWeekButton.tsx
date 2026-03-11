'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, formatDate } from '@/lib/utils';
import { Plus, X, Loader2, CalendarPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CreateWeekButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [dateInput, setDateInput] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addDate = (dateStr: string) => {
    if (!dateStr) return;
    if (selectedDates.includes(dateStr)) return;
    const updated = [...selectedDates, dateStr].sort();
    setSelectedDates(updated);
    setDateInput('');
  };

  const removeDate = (dateStr: string) => {
    setSelectedDates(prev => prev.filter(d => d !== dateStr));
  };

  // Quick presets
  const addWeekendPreset = () => {
    const today = new Date();
    // Find next Thursday
    const dayOfWeek = today.getDay();
    const daysUntilThursday = (4 - dayOfWeek + 7) % 7 || 7;
    const thu = new Date(today);
    thu.setDate(today.getDate() + daysUntilThursday);
    const fri = new Date(thu);
    fri.setDate(thu.getDate() + 1);
    const sat = new Date(fri);
    sat.setDate(fri.getDate() + 1);

    const fmt = (d: Date) => d.toISOString().split('T')[0];
    setSelectedDates([fmt(thu), fmt(fri), fmt(sat)]);
    setTitle(`סופ"ש ${thu.getDate()}-${sat.getDate()}.${thu.getMonth() + 1}`);
  };

  const addFullWeekPreset = () => {
    const today = new Date();
    // Find next Sunday
    const dayOfWeek = today.getDay();
    const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;
    const sun = new Date(today);
    sun.setDate(today.getDate() + daysUntilSunday);

    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sun);
      d.setDate(sun.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    setSelectedDates(dates);
    const first = new Date(dates[0]);
    const last = new Date(dates[dates.length - 1]);
    setTitle(`שבוע ${first.getDate()}.${first.getMonth() + 1} - ${last.getDate()}.${last.getMonth() + 1}`);
  };

  const handleSubmit = async () => {
    if (!title.trim() || selectedDates.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/weeks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          dates: selectedDates,
          status: 'open',
        }),
      });
      if (res.ok) {
        const week = await res.json();
        setOpen(false);
        setTitle('');
        setSelectedDates([]);
        router.push(`/manager/week/${week.id}`);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="w-4 h-4" />
        שבוע חדש
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-semibold text-lg">יצירת שבוע חדש</h3>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Title */}
          <Input
            id="week-title"
            label="כותרת"
            placeholder='לדוגמה: סופ"ש 20-22.3'
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          {/* Quick presets */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">קיצורים</label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" type="button" onClick={addWeekendPreset}>
                <CalendarPlus className="w-3.5 h-3.5" />
                סופ&quot;ש הבא
              </Button>
              <Button variant="outline" size="sm" type="button" onClick={addFullWeekPreset}>
                <CalendarPlus className="w-3.5 h-3.5" />
                שבוע מלא
              </Button>
            </div>
          </div>

          {/* Date picker */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">ימים</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateInput}
                onChange={e => setDateInput(e.target.value)}
                className="flex h-10 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                dir="ltr"
              />
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => addDate(dateInput)}
                disabled={!dateInput}
                className="h-10"
              >
                <Plus className="w-4 h-4" />
                הוסף
              </Button>
            </div>
          </div>

          {/* Selected dates */}
          {selectedDates.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                {selectedDates.length} ימים נבחרו
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedDates.map(d => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                  >
                    {formatDate(d)}
                    <button
                      type="button"
                      onClick={() => removeDate(d)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            ביטול
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !title.trim() || selectedDates.length === 0}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            צור שבוע
          </Button>
        </div>
      </div>
    </div>
  );
}
