import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
  children: React.ReactNode;
  className?: string;
}

const variants: Record<string, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  destructive: 'bg-red-100 text-red-700',
  outline: 'border border-border text-foreground bg-transparent',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
