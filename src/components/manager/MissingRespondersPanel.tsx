'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MissingResponder } from '@/db/types';
import { PARTICIPANT_LABELS } from '@/db/types';
import { Check, MessageCircle, Phone, User, ChevronDown, ChevronUp } from 'lucide-react';

interface MissingRespondersProps {
  missing: MissingResponder[];
  shareUrl: string;
}

export function MissingRespondersPanel({ missing, shareUrl }: MissingRespondersProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const coreCount = missing.filter(m => m.participant_type === 'core').length;
  const reinforcementCount = missing.filter(m => m.participant_type === 'reinforcement').length;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const missingNames = missing.map(m => `${m.soldier.first_name} ${m.soldier.last_name}`).join('\n');
  const missingPhones = missing.map(m => m.soldier.phone).filter(Boolean).join('\n');
  const reminderText = `מי שעדיין לא מילא אילוצים לסופ״ש, למלא כאן:\n${shareUrl}`;

  const displayList = expanded ? missing : missing.slice(0, 8);

  if (missing.length === 0) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">כל המשתתפים הצפויים הגיבו!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">חסרי תגובה</CardTitle>
            <Badge variant="destructive" className="text-xs">{missing.length}</Badge>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(missingNames, 'names')}
              className="text-xs h-7"
            >
              {copied === 'names' ? <Check className="w-3 h-3" /> : <User className="w-3 h-3" />}
              {copied === 'names' ? 'הועתק!' : 'שמות'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(missingPhones, 'phones')}
              className="text-xs h-7"
            >
              {copied === 'phones' ? <Check className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
              {copied === 'phones' ? 'הועתק!' : 'טלפונים'}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => copyToClipboard(reminderText, 'whatsapp')}
              className="text-xs h-7 bg-emerald-600 hover:bg-emerald-700"
            >
              {copied === 'whatsapp' ? <Check className="w-3 h-3" /> : <MessageCircle className="w-3 h-3" />}
              {copied === 'whatsapp' ? 'הועתק!' : 'תזכורת וואטסאפ'}
            </Button>
          </div>
        </div>
        <div className="flex gap-3 text-xs text-muted-foreground mt-1">
          <span>{coreCount} ליבה</span>
          <span>{reinforcementCount} תגבור</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 text-xs">
                <th className="text-right p-2.5 font-medium text-muted-foreground">שם</th>
                <th className="text-right p-2.5 font-medium text-muted-foreground">סוג</th>
                <th className="text-right p-2.5 font-medium text-muted-foreground">טלפון</th>
                <th className="text-right p-2.5 font-medium text-muted-foreground">סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {displayList.map(m => (
                <tr key={m.soldier.id} className="border-t hover:bg-muted/20 transition-colors">
                  <td className="p-2.5">
                    <div className="font-medium">
                      {m.soldier.first_name} {m.soldier.last_name}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{m.soldier.personal_number}</div>
                  </td>
                  <td className="p-2.5">
                    <Badge
                      variant={m.participant_type === 'core' ? 'default' : 'secondary'}
                      className="text-[10px]"
                    >
                      {PARTICIPANT_LABELS[m.participant_type]}
                    </Badge>
                  </td>
                  <td className="p-2.5 text-xs text-muted-foreground" dir="ltr">{m.soldier.phone}</td>
                  <td className="p-2.5">
                    <Badge variant="destructive" className="text-[10px]">
                      לא הגיש
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {missing.length > 8 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-primary hover:underline mt-2 mx-auto"
          >
            {expanded ? (
              <>הצג פחות <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>הצג את כל {missing.length} <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
