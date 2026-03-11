'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AvailabilityMatrix } from './AvailabilityMatrix';
import type { ShiftType, Preference, Week } from '@/db/types';
import { getWeekDates } from '@/db/types';
import { CheckCircle, Loader2 } from 'lucide-react';

const schema = z.object({
  first_name: z.string().min(1, 'שדה חובה'),
  last_name: z.string().min(1, 'שדה חובה'),
  personal_number: z.string().min(5, 'מינימום 5 ספרות'),
  phone: z.string().min(8, 'מספר טלפון תקין'),
  car_number: z.string().optional(),
  constraints_text: z.string().optional(),
});

type FormFields = z.infer<typeof schema>;

interface SoldierAvailabilityFormProps {
  week: Week & { slots?: any[] };
}

export function SoldierAvailabilityForm({ week }: SoldierAvailabilityFormProps) {
  const dates = getWeekDates(week);

  const [availability, setAvailability] = useState<Record<string, Record<ShiftType, Preference>>>(() => {
    const init: Record<string, Record<ShiftType, Preference>> = {};
    for (const d of dates) {
      init[d] = { morning: 'off', noon: 'off', night: 'off' };
    }
    return init;
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lookupDone, setLookupDone] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const personalNumber = watch('personal_number');

  useEffect(() => {
    if (!personalNumber || personalNumber.length < 5) {
      setLookupDone(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLookupLoading(true);
      try {
        const res = await fetch(
          `/api/weeks/${week.id}/submissions/lookup?personal_number=${personalNumber}`
        );
        const data = await res.json();
        if (data.found && data.soldier && data.submission) {
          setValue('first_name', data.soldier.first_name);
          setValue('last_name', data.soldier.last_name);
          setValue('phone', data.soldier.phone);
          if (data.soldier.car_number) setValue('car_number', data.soldier.car_number);
          if (data.submission.constraints_text) {
            setValue('constraints_text', data.submission.constraints_text);
          }
          if (data.submission.entries) {
            const restored: Record<string, Record<ShiftType, Preference>> = {};
            for (const d of dates) {
              restored[d] = { morning: 'off', noon: 'off', night: 'off' };
            }
            for (const e of data.submission.entries) {
              if (restored[e.date]) {
                restored[e.date][e.shift_type as ShiftType] = e.preference;
              }
            }
            setAvailability(restored);
          }
          setIsUpdate(true);
        }
        setLookupDone(true);
      } catch {
        // ignore
      } finally {
        setLookupLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [personalNumber]);

  const onSubmit = async (data: FormFields) => {
    setLoading(true);
    try {
      await fetch(`/api/weeks/${week.id}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, availability }),
      });
      setSubmitted(true);
    } catch {
      alert('שגיאה בשמירה. נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-emerald-50 to-background">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold">
              {isUpdate ? 'הזמינות עודכנה!' : 'הזמינות נשמרה!'}
            </h2>
            <p className="text-sm text-muted-foreground">
              אפשר לחזור ולעדכן עד שהשיבוץ ייסגר.
            </p>
            <Button
              variant="outline"
              onClick={() => setSubmitted(false)}
              className="mt-4"
            >
              ערוך תגובה
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold">ShiftBoard</h1>
              <p className="text-xs text-muted-foreground">{week.title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">הגשת זמינות</h2>
          <p className="text-sm text-muted-foreground mt-1">
            מלא את הפרטים וסמן באילו משמרות אתה יכול.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Personal Number first - for lookup */}
          <div className="relative">
            <Input
              id="personal_number"
              label="מספר אישי"
              placeholder="לדוגמה 8001001"
              {...register('personal_number')}
              error={errors.personal_number?.message}
            />
            {lookupLoading && (
              <div className="absolute left-3 top-8">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            )}
            {isUpdate && lookupDone && (
              <p className="text-xs text-emerald-600 mt-1">
                נמצאה הגשה קיימת — הנתונים שלך נטענו.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              id="first_name"
              label="שם פרטי"
              placeholder="יוסי"
              {...register('first_name')}
              error={errors.first_name?.message}
            />
            <Input
              id="last_name"
              label="שם משפחה"
              placeholder="כהן"
              {...register('last_name')}
              error={errors.last_name?.message}
            />
          </div>

          <Input
            id="phone"
            label="טלפון"
            placeholder="050-1234567"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
          />

          <Input
            id="car_number"
            label="מספר רכב (אופציונלי)"
            placeholder="12-345-67"
            {...register('car_number')}
          />

          {/* Availability matrix */}
          <AvailabilityMatrix
            dates={dates}
            value={availability}
            onChange={setAvailability}
          />

          {/* Constraints */}
          <Textarea
            id="constraints_text"
            label="אילוצים מיוחדים"
            placeholder='לדוגמה: "לא לילות", "לא מטבח", "רק בוקר ביום שישי"'
            {...register('constraints_text')}
          />

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isUpdate ? (
              'עדכן זמינות'
            ) : (
              'שלח זמינות'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
