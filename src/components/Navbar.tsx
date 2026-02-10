import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { Bug, LogOut, User } from 'lucide-react';

export function Navbar() {
  const { user, role, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Bug className="h-6 w-6 text-primary" />
          <span className="font-mono font-bold text-lg">DebugNow</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {role === 'client' && (
                <>
                  <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                  <Link to="/bugs/new" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Submit Bug</Link>
                </>
              )}
              {role === 'debugger' && (
                <>
                  <Link to="/debugger/available" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Available Bugs</Link>
                  <Link to="/debugger/my-bugs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">My Bugs</Link>
                  <Link to="/debugger/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Profile</Link>
                </>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{profile?.name || user.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
