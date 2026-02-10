import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, SeverityBadge, UrgencyBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Zap } from 'lucide-react';

interface BugRow {
  id: string;
  title: string;
  description: string;
  status: string;
  severity: string;
  urgency_tier: string;
  tech_stack: string;
  created_at: string;
}

export default function DebuggerAvailable() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bugs, setBugs] = useState<BugRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);

  const fetchBugs = () => {
    supabase
      .from('bugs')
      .select('id, title, description, status, severity, urgency_tier, tech_stack, created_at')
      .eq('status', 'OPEN')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setBugs((data as BugRow[]) || []);
        setLoading(false);
      });
  };

  useEffect(() => { fetchBugs(); }, []);

  const acceptBug = async (bugId: string) => {
    if (!user) return;
    setAccepting(bugId);
    const { error } = await supabase.from('bugs').update({
      debugger_id: user.id,
      status: 'ASSIGNED' as any,
    }).eq('id', bugId);
    setAccepting(null);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Bug accepted!', description: 'You can now start working on it.' });
      fetchBugs();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold">Available Bugs</h1>
        <p className="text-muted-foreground text-sm mt-1">Open bugs waiting for a debugger</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : bugs.length === 0 ? (
        <Card className="p-12 text-center">
          <Zap className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-mono font-semibold text-lg mb-2">No bugs available</h3>
          <p className="text-muted-foreground text-sm">Check back soon for new bugs to fix</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {bugs.map((bug) => (
            <Card key={bug.id} className="p-4 hover:border-primary/30 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <Link to={`/bugs/${bug.id}`}>
                    <h3 className="font-mono font-medium hover:text-primary transition-colors">{bug.title}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{bug.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">{bug.tech_stack}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(bug.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={bug.severity} />
                    <UrgencyBadge urgency={bug.urgency_tier} />
                  </div>
                  <Button
                    size="sm"
                    className="font-mono"
                    onClick={() => acceptBug(bug.id)}
                    disabled={accepting === bug.id}
                  >
                    {accepting === bug.id ? 'Accepting...' : 'Accept'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
