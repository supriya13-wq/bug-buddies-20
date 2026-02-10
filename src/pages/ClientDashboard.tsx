import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge, SeverityBadge, UrgencyBadge } from '@/components/StatusBadge';
import { Plus, Bug } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface BugRow {
  id: string;
  title: string;
  status: string;
  severity: string;
  urgency_tier: string;
  tech_stack: string;
  created_at: string;
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const [bugs, setBugs] = useState<BugRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('bugs')
      .select('id, title, status, severity, urgency_tier, tech_stack, created_at')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setBugs((data as BugRow[]) || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-mono text-2xl font-bold">My Bugs</h1>
          <p className="text-muted-foreground text-sm mt-1">Track all your submitted bugs</p>
        </div>
        <Link to="/bugs/new">
          <Button className="gap-2 font-mono">
            <Plus className="h-4 w-4" />
            Submit Bug
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : bugs.length === 0 ? (
        <Card className="p-12 text-center">
          <Bug className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-mono font-semibold text-lg mb-2">No bugs yet</h3>
          <p className="text-muted-foreground text-sm mb-4">Submit your first bug to get started</p>
          <Link to="/bugs/new">
            <Button className="font-mono">Submit a Bug</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {bugs.map((bug) => (
            <Link key={bug.id} to={`/bugs/${bug.id}`}>
              <Card className="p-4 hover:border-primary/30 hover:box-glow transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-mono font-medium truncate">{bug.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {bug.tech_stack} · {formatDistanceToNow(new Date(bug.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <SeverityBadge severity={bug.severity} />
                    <UrgencyBadge urgency={bug.urgency_tier} />
                    <StatusBadge status={bug.status} />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
