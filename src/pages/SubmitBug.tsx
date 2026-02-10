import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function SubmitBug() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    tech_stack: '',
    severity: 'medium' as string,
    urgency_tier: 'normal' as string,
    repo_url: '',
    logs: '',
    steps_to_reproduce: '',
    access_notes: '',
  });

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from('bugs').insert({
      client_id: user.id,
      title: form.title.trim(),
      description: form.description.trim(),
      tech_stack: form.tech_stack.trim(),
      severity: form.severity as any,
      urgency_tier: form.urgency_tier as any,
      repo_url: form.repo_url.trim() || null,
      logs: form.logs.trim() || null,
      steps_to_reproduce: form.steps_to_reproduce.trim(),
      access_notes: form.access_notes.trim() || null,
    });

    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Bug submitted!', description: 'A debugger will be matched soon.' });
      navigate('/dashboard');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="font-mono text-2xl">Submit a Bug</CardTitle>
          <CardDescription>Describe the issue and we'll match you with a debugger</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={form.title} onChange={e => update('title', e.target.value)} required placeholder="API returns 500 on user creation" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" value={form.description} onChange={e => update('description', e.target.value)} required rows={4} placeholder="Describe the bug in detail..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tech_stack">Tech Stack *</Label>
              <Input id="tech_stack" value={form.tech_stack} onChange={e => update('tech_stack', e.target.value)} required placeholder="React, Node.js, PostgreSQL" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select value={form.severity} onValueChange={v => update('severity', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Urgency</Label>
                <Select value={form.urgency_tier} onValueChange={v => update('urgency_tier', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="production_fire">🔥 Production Fire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="steps">Steps to Reproduce *</Label>
              <Textarea id="steps" value={form.steps_to_reproduce} onChange={e => update('steps_to_reproduce', e.target.value)} required rows={3} placeholder="1. Navigate to...\n2. Click on...\n3. Observe..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="repo">Repository URL</Label>
              <Input id="repo" value={form.repo_url} onChange={e => update('repo_url', e.target.value)} placeholder="https://github.com/..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logs">Logs / Error Output</Label>
              <Textarea id="logs" value={form.logs} onChange={e => update('logs', e.target.value)} rows={3} placeholder="Paste error logs here..." className="font-mono text-sm" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="access">Access Notes</Label>
              <Textarea id="access" value={form.access_notes} onChange={e => update('access_notes', e.target.value)} rows={2} placeholder="How can the debugger access the codebase?" />
            </div>

            <Button type="submit" className="w-full font-mono" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Bug'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
