'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Shield, ArrowLeft, Loader2, Mail } from 'lucide-react';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/manager';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const supabase = createSupabaseBrowserClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('אימייל או סיסמה שגויים');
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  async function handleMagicLink() {
    if (!email) {
      setError('יש להזין אימייל');
      return;
    }
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });

    if (error) {
      setError('שגיאה בשליחת הלינק');
      setLoading(false);
      return;
    }

    setMagicLinkSent(true);
    setLoading(false);
  }

  if (magicLinkSent) {
    return (
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">בדקו את האימייל</h2>
          <p className="text-muted-foreground text-sm mb-6">
            שלחנו לינק התחברות ל-<strong>{email}</strong>
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMagicLinkSent(false)}
          >
            חזרה
          </Button>
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
          <h1 className="text-2xl font-bold">ברוכים השבים</h1>
          <p className="text-muted-foreground text-sm mt-1">
            התחברו כדי להמשיך לפורטל הניהול
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
            placeholder="••••••••"
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
                התחבר
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white/80 px-3 text-muted-foreground">או</span>
          </div>
        </div>

        {/* Magic Link */}
        <Button
          variant="outline"
          className="w-full"
          size="lg"
          onClick={handleMagicLink}
          disabled={loading}
        >
          <Mail className="w-4 h-4" />
          שלחו לי לינק לאימייל
        </Button>

        {/* Register link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          אין לכם חשבון?{' '}
          <Link href="/auth/register" className="text-primary font-medium hover:underline">
            הירשמו עכשיו
          </Link>
        </p>
      </div>
    </div>
  );
}
