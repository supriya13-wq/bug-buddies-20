import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge, SeverityBadge, UrgencyBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { Send, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface BugData {
  id: string;
  title: string;
  description: string;
  tech_stack: string;
  severity: string;
  urgency_tier: string;
  status: string;
  repo_url: string | null;
  logs: string | null;
  steps_to_reproduce: string;
  access_notes: string | null;
  client_id: string;
  debugger_id: string | null;
  created_at: string;
}

interface Message {
  id: string;
  message: string;
  sender_id: string;
  created_at: string;
}

export default function BugDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [bug, setBug] = useState<BugData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    supabase.from('bugs').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (data) setBug(data as unknown as BugData);
    });

    const fetchMessages = () => {
      supabase.from('bug_messages').select('id, message, sender_id, created_at').eq('bug_id', id).order('created_at').then(({ data }) => {
        const msgs = (data || []) as Message[];
        setMessages(msgs);
        // Fetch profiles for senders
        const senderIds = [...new Set(msgs.map(m => m.sender_id))];
        if (senderIds.length > 0) {
          supabase.from('profiles').select('user_id, name').in('user_id', senderIds).then(({ data: profs }) => {
            const map: Record<string, string> = {};
            profs?.forEach((p: any) => { map[p.user_id] = p.name; });
            setProfiles(map);
          });
        }
      });
    };
    fetchMessages();

    // Realtime subscription
    const channel = supabase.channel(`bug-messages-${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bug_messages', filter: `bug_id=eq.${id}` }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !id) return;
    setSending(true);
    const { error } = await supabase.from('bug_messages').insert({
      bug_id: id,
      sender_id: user.id,
      message: newMessage.trim(),
    });
    setSending(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setNewMessage('');
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!id) return;
    const { error } = await supabase.from('bugs').update({ status: newStatus as any }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setBug(prev => prev ? { ...prev, status: newStatus } : null);
      toast({ title: 'Status updated' });
    }
  };

  if (!bug) return <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">Loading...</div>;

  const isDebugger = role === 'debugger' && bug.debugger_id === user?.id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bug info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="font-mono text-xl">{bug.title}</CardTitle>
                <StatusBadge status={bug.status} />
              </div>
              <div className="flex gap-2 mt-2">
                <SeverityBadge severity={bug.severity} />
                <UrgencyBadge urgency={bug.urgency_tier} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-mono text-sm font-medium text-muted-foreground mb-1">Description</h4>
                <p className="text-sm whitespace-pre-wrap">{bug.description}</p>
              </div>
              <div>
                <h4 className="font-mono text-sm font-medium text-muted-foreground mb-1">Tech Stack</h4>
                <p className="text-sm">{bug.tech_stack}</p>
              </div>
              <div>
                <h4 className="font-mono text-sm font-medium text-muted-foreground mb-1">Steps to Reproduce</h4>
                <p className="text-sm whitespace-pre-wrap">{bug.steps_to_reproduce}</p>
              </div>
              {bug.logs && (
                <div>
                  <h4 className="font-mono text-sm font-medium text-muted-foreground mb-1">Logs</h4>
                  <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto font-mono">{bug.logs}</pre>
                </div>
              )}
              {bug.repo_url && (
                <a href={bug.repo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                  <ExternalLink className="h-3 w-3" />
                  Repository
                </a>
              )}
              {bug.access_notes && (
                <div>
                  <h4 className="font-mono text-sm font-medium text-muted-foreground mb-1">Access Notes</h4>
                  <p className="text-sm">{bug.access_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-lg">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                {messages.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No messages yet</p>
                )}
                {messages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender_id === user?.id ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.sender_id === user?.id ? 'bg-primary/10 border border-primary/20' : 'bg-muted'}`}>
                      <div className="font-mono text-xs text-muted-foreground mb-1">
                        {profiles[msg.sender_id] || 'User'} · {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                      </div>
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  rows={2}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                />
                <Button onClick={sendMessage} disabled={sending || !newMessage.trim()} size="icon" className="shrink-0 self-end">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar actions */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-mono font-medium text-sm mb-3">Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={bug.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{formatDistanceToNow(new Date(bug.created_at), { addSuffix: true })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Debugger</span>
                <span>{bug.debugger_id ? 'Assigned' : 'Unassigned'}</span>
              </div>
            </div>
          </Card>

          {isDebugger && (
            <Card className="p-4">
              <h3 className="font-mono font-medium text-sm mb-3">Update Status</h3>
              <Select value={bug.status} onValueChange={updateStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="AWAITING_VERIFICATION">Awaiting Verification</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="REOPENED">Reopened</SelectItem>
                </SelectContent>
              </Select>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
