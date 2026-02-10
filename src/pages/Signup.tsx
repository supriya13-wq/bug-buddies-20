import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { Bug, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function Signup() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'debugger' ? 'debugger' : 'client';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'debugger'>(defaultRole);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, name, role);
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Check your email', description: 'We sent you a confirmation link to verify your account.' });
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Bug className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-mono text-2xl">Create your account</CardTitle>
          <CardDescription>Join DebugNow as a client or debugger</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                role === 'client' ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground/30'
              )}
            >
              <Bug className={cn('h-6 w-6', role === 'client' ? 'text-primary' : 'text-muted-foreground')} />
              <span className={cn('font-mono text-sm font-medium', role === 'client' ? 'text-primary' : 'text-muted-foreground')}>
                I have a bug
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRole('debugger')}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                role === 'debugger' ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground/30'
              )}
            >
              <Zap className={cn('h-6 w-6', role === 'debugger' ? 'text-primary' : 'text-muted-foreground')} />
              <span className={cn('font-mono text-sm font-medium', role === 'debugger' ? 'text-primary' : 'text-muted-foreground')}>
                I debug bugs
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters" />
            </div>
            <Button type="submit" className="w-full font-mono" disabled={loading}>
              {loading ? 'Creating account...' : `Sign up as ${role}`}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
