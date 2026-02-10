import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bug, Zap, Clock, Shield, ArrowRight } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

        <div className="relative container mx-auto px-4 pt-32 pb-24">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="font-mono text-sm text-primary">Live matching active</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-mono font-bold tracking-tight mb-6">
              Find a debugger
              <br />
              <span className="text-primary text-glow">in minutes</span>
              <span className="terminal-cursor text-primary">_</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-12">
              Production down? Bug blocking launch? Connect with expert debuggers instantly.
              Real-time matching. Structured outcomes. Root cause in hours, not days.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup?role=client">
                <Button size="lg" className="w-full sm:w-auto gap-2 font-mono gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
                  <Bug className="h-5 w-5" />
                  I have a bug
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/signup?role=debugger">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 font-mono border-primary/30 text-primary hover:bg-primary/10">
                  <Zap className="h-5 w-5" />
                  I debug bugs
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: Clock,
              title: 'Minutes, not days',
              desc: 'Post your bug, get matched with a debugger, and receive a fix — all in record time.',
            },
            {
              icon: Shield,
              title: 'Structured outcomes',
              desc: 'Every fix includes root cause analysis, the fix itself, and a post-mortem. No guessing.',
            },
            {
              icon: Zap,
              title: 'Expert network',
              desc: 'Students, seniors, specialists — filtered by tech stack and experience level.',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="group p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:box-glow transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-mono font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 pb-24">
        <h2 className="font-mono font-bold text-3xl text-center mb-16">
          How it <span className="text-primary">works</span>
        </h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { step: '01', title: 'Submit bug', desc: 'Describe the issue, attach logs and repo access.' },
            { step: '02', title: 'Get matched', desc: 'Our system finds debuggers matching your tech stack.' },
            { step: '03', title: 'Fix in progress', desc: 'Debugger works on it with real-time status updates.' },
            { step: '04', title: 'Verified fix', desc: 'Receive root cause analysis and verified solution.' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-mono text-4xl font-bold text-primary/20 mb-3">{s.step}</div>
              <h3 className="font-mono font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
            <Bug className="h-4 w-4 text-primary" />
            DebugNow
          </div>
          <p className="text-sm text-muted-foreground">© 2026 DebugNow. Ship faster.</p>
        </div>
      </footer>
    </div>
  );
}
