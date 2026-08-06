import { AlertTriangle, ShieldAlert, Clock } from 'lucide-react';
import { AccountStatusType } from '@/types/api';

interface Props {
  status: AccountStatusType;
  reason?: string;
}

const config: Record<AccountStatusType, { icon: any; bg: string; text: string; label: string } | null> = {
  ACTIVE: null,
  BLOCKED: {
    icon: AlertTriangle,
    bg: 'bg-amber-50 border-amber-300',
    text: 'text-amber-800',
    label: 'Compte temporairement bloqué',
  },
  KYC_REVIEW: {
    icon: Clock,
    bg: 'bg-amber-50 border-amber-300',
    text: 'text-amber-800',
    label: 'Sous vérification KYC',
  },
  PENDING_DOCUMENTS: {
    icon: Clock,
    bg: 'bg-amber-50 border-amber-300',
    text: 'text-amber-800',
    label: 'Documents en attente',
  },
  FROZEN_LEGAL: {
    icon: ShieldAlert,
    bg: 'bg-red-50 border-red-300',
    text: 'text-red-800',
    label: 'Compte gelé — procédure légale',
  },
  CLOSED: {
    icon: ShieldAlert,
    bg: 'bg-slate-100 border-slate-300',
    text: 'text-slate-700',
    label: 'Compte clôturé',
  },
};

export function AccountStatusBanner({ status, reason }: Props) {
  const c = config[status];
  if (!c) return null;
  const Icon = c.icon;

  return (
    <div className={`border rounded-lg p-4 mb-6 ${c.bg}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${c.text}`} />
        <div>
          <p className={`font-semibold text-sm ${c.text}`}>{c.label}</p>
          {reason && <p className={`text-sm mt-1 ${c.text} opacity-90`}>{reason}</p>}
        </div>
      </div>
    </div>
  );
}
