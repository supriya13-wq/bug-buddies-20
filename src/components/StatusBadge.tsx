import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; className: string }> = {
  OPEN: { label: 'Open', className: 'bg-primary/15 text-primary border-primary/30' },
  ASSIGNED: { label: 'Assigned', className: 'bg-accent/15 text-accent border-accent/30' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-warning/15 text-warning border-warning/30' },
  AWAITING_VERIFICATION: { label: 'Awaiting Verification', className: 'bg-accent/15 text-accent border-accent/30' },
  RESOLVED: { label: 'Resolved', className: 'bg-success/15 text-success border-success/30' },
  REOPENED: { label: 'Reopened', className: 'bg-critical/15 text-critical border-critical/30' },
};

const severityConfig: Record<string, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-muted text-muted-foreground border-border' },
  medium: { label: 'Medium', className: 'bg-warning/15 text-warning border-warning/30' },
  high: { label: 'High', className: 'bg-urgent/15 text-urgent border-urgent/30' },
  critical: { label: 'Critical', className: 'bg-critical/15 text-critical border-critical/30 animate-pulse-glow' },
};

const urgencyConfig: Record<string, { label: string; className: string }> = {
  normal: { label: 'Normal', className: 'bg-muted text-muted-foreground border-border' },
  urgent: { label: 'Urgent', className: 'bg-warning/15 text-warning border-warning/30' },
  production_fire: { label: '🔥 Production Fire', className: 'bg-critical/15 text-critical border-critical/30' },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, className: '' };
  return <Badge variant="outline" className={cn('font-mono text-xs', config.className)}>{config.label}</Badge>;
}

export function SeverityBadge({ severity }: { severity: string }) {
  const config = severityConfig[severity] || { label: severity, className: '' };
  return <Badge variant="outline" className={cn('font-mono text-xs', config.className)}>{config.label}</Badge>;
}

export function UrgencyBadge({ urgency }: { urgency: string }) {
  const config = urgencyConfig[urgency] || { label: urgency, className: '' };
  return <Badge variant="outline" className={cn('font-mono text-xs', config.className)}>{config.label}</Badge>;
}
