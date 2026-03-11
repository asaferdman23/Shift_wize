'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Shield, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const supabase = createSupabaseBrowserClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          team_name: teamName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message === 'User already registered'
        ? 'המשתמש כבר רשום'
        : 'שגיאה בהרשמה. נסו שוב.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-xl font-bold mb-2">נרשמתם בהצלחה!</h2>
          <p className="text-muted-foreground text-sm mb-6">
            שלחנו לינק אימות ל-<strong>{email}</strong>
            <br />
            לחצו על הלינק כדי להפעיל את החשבון.
          </p>
          <Link href="/auth/login">
            <Button variant="outline">
              חזרה להתחברות
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg glow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">ShiftWize</span>
        </Link>
      </div>

      {/* Card */}
      <div className="glass-card rounded-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">צרו חשבון חדש</h1>
          <p className="text-muted-foreground text-sm mt-1">
            התחילו לנהל משמרות בשתי דקות
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            id="fullName"
            label="שם מלא"
            type="text"
            placeholder="ישראל ישראלי"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            id="teamName"
            label="שם הצוות / היחידה"
            type="text"
            placeholder='למשל: פלוגה א׳ גד"ס 51'
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <Input
            id="email"
            label="אימייל"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            dir="ltr"
          />
          <Input
            id="password"
            label="סיסמה"
            type="password"
            placeholder="לפחות 6 תווים"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            dir="ltr"
          />

          {error && (
            <p className="text-sm text-destructive text-center bg-destructive/5 rounded-lg p-2">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full glow" size="lg" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                צרו חשבון
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          בלחיצה על &quot;צרו חשבון&quot; אתם מסכימים ל
          <span className="text-primary">תנאי השימוש</span> ול
          <span className="text-primary">מדיניות הפרטיות</span>
        </p>

        {/* Login link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          כבר יש לכם חשבון?{' '}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            התחברו
          </Link>
        </p>
      </div>
    </div>
  );
}
