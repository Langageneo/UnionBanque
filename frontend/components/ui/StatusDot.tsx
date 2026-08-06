import { AccountStatusType } from '@/types/api';

const colors: Record<AccountStatusType, string> = {
  ACTIVE: 'bg-green-500',
  BLOCKED: 'bg-amber-500',
  KYC_REVIEW: 'bg-amber-500',
  PENDING_DOCUMENTS: 'bg-amber-500',
  FROZEN_LEGAL: 'bg-red-500',
  CLOSED: 'bg-slate-400',
};

export function StatusDot({ status }: { status?: AccountStatusType }) {
  const color = status ? colors[status] : colors.ACTIVE;
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} />;
}
