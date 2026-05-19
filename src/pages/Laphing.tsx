import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { toast } from 'sonner';
import heroImg from '@/assets/laphing-hero-girl.jpg';
import pack1 from '@/assets/laphing-pack-1.png';
import pack2 from '@/assets/laphing-pack-2.png';
import pack3 from '@/assets/laphing-pack-3.jpg';

const COLORS = {
  fire: '#E8230A',
  chilli: '#F7610A',
  turmeric: '#F5A623',
  yellow: '#FFD600',
  black: '#0D0D0D',
  off: '#FAF5EE',
  sauce: '#8B0000',
};

const NAV = [
  { label: 'About', href: '#about' },
  { label: 'How It Works', href: '#how' },
  { label: 'Explore', href: '#explore' },
  { label: 'Shop', href: '#shop' },
];

function Wordmark({ size = 'text-xl' }: { size?: string }) {
  return (
    <span
      className={`font-display ${size} font-black tracking-tight inline-block`}
      style={{
        color: COLORS.yellow,
        background: COLORS.black,
        letterSpacing: '0.02em',
      }}
    >
      THE LAPHING CO
    </span>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? COLORS.black : 'transparent',
        borderBottom: scrolled ? `2px solid ${COLORS.fire}` : '2px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
        <a href="#top"><Wordmark /></a>
        <ul className="hidden md:flex items-center gap-8 font-body text-sm uppercase tracking-wider" style={{ color: COLORS.off }}>
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href} className="hover:opacity-70 transition-opacity">{n.label}</a>
            </li>
          ))}
        </ul>
        <a
          href="#waitlist"
          className="font-display font-bold uppercase text-xs md:text-sm px-5 py-3 rounded-full whitespace-nowrap"
          style={{
            background: COLORS.fire,
            color: COLORS.off,
            boxShadow: `0 0 0 0 ${COLORS.fire}`,
            animation: 'laphingPulse 1.8s infinite',
          }}
        >
          Join the Waitlist
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  const heroSlides = [heroImg, heroImg, heroImg];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % heroSlides.length), 3000);
    return () => clearInterval(t);
  }, []);
  const headline = 'Miss it? Make it in 5 minutes. Spicy Yellow Laphing - now at home.'.split(' ');
  return (
    <section id="top" className="relative min-h-screen pt-28 pb-12 overflow-hidden" style={{ background: COLORS.black }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1
          className="font-display font-black uppercase leading-[0.85] text-[8vw] md:text-[5.5vw] text-center"
          style={{ color: COLORS.off }}
        >
          {headline.map((w, i) => (
            <motion.span
              key={i}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              className="inline-block mr-[0.25em]"
              style={/laphing/i.test(w) ? { color: COLORS.fire } : {}}
            >
              {w}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="font-body mt-6 text-lg md:text-2xl text-center"
          style={{ color: COLORS.turmeric }}
        >
          The craving doesn't wait. <span style={{ color: COLORS.off }}>Neither should you.</span>
        </motion.p>

        <div className="relative mt-10 md:mt-14 w-full aspect-[16/9] overflow-hidden rounded-2xl" style={{ border: `3px solid ${COLORS.fire}` }}>
          {heroSlides.map((src, i) => (
            <motion.img
              key={i}
              src={src}
              alt="Woman eating laphing at sunset"
              className="absolute inset-0 w-full h-full object-cover"
              initial={false}
              animate={{ opacity: idx === i ? 1 : 0, scale: idx === i ? 1.02 : 1 }}
              transition={{ duration: 0.9 }}
            />
          ))}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
            }}
          />
        </div>
      </div>

      {/* Marquee */}
      <div className="mt-10 overflow-hidden border-y-2 py-4" style={{ borderColor: COLORS.fire, background: COLORS.black }}>
        <div className="flex whitespace-nowrap" style={{ animation: 'laphingMarquee 28s linear infinite' }}>
          {Array.from({ length: 4 }).map((_, k) => (
            <span key={k} className="font-display font-bold uppercase text-2xl md:text-3xl mx-8" style={{ color: COLORS.off }}>
              🌶️ Built by Cravers for Cravers 🔥 5 Mins Flat ✨ Soupy or Dry 💀 No Soggy Deliveries 🌶️ Craving Emergency Kit 🔥
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ children, color = COLORS.off }: { children: React.ReactNode; color?: string }) {
  return (
    <h2
      className="font-display font-black uppercase text-5xl md:text-7xl leading-none mb-12"
      style={{ color }}
    >
      {children}
    </h2>
  );
}

function Problem() {
  const items = [
    { icon: '🍳', title: 'Cook from scratch', desc: '2 hours. A starch disaster. Your kitchen looks like a crime scene.' },
    { icon: '📦', title: 'Order online', desc: '4x the price. Arrives soggy. Tastes like regret.' },
    { icon: '🚌', title: 'Go to Majnu Ka Tilla', desc: "45 mins away. Peak Delhi traffic. You're not doing that." },
  ];
  return (
    <section id="about" className="py-24 md:py-32 px-4 md:px-8" style={{ background: COLORS.black }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader>
          <span style={{ WebkitTextStroke: `2px ${COLORS.fire}`, color: 'transparent' }}>The Laphing</span>{' '}
          <span style={{ color: COLORS.off }}>Situation</span>{' '}
          <span style={{ color: COLORS.fire }}>is Dire 😩</span>
        </SectionHeader>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="p-8 rounded-2xl"
              style={{ background: '#161616', border: `2px solid ${COLORS.sauce}` }}
            >
              <div className="text-5xl mb-4">{it.icon}</div>
              <h3 className="font-display font-bold uppercase text-2xl mb-3" style={{ color: COLORS.turmeric }}>{it.title}</h3>
              <p className="font-body text-base" style={{ color: COLORS.off, opacity: 0.85 }}>{it.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mt-12"
        >
          <p className="font-display font-black uppercase text-7xl md:text-[12rem] leading-none" style={{ color: COLORS.fire }}>
            We Fixed It.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Products() {
  const products = [
    { name: 'Classic Dry Pack', tag: 'The OG. Just vibes and chilli oil.', spice: 3, color: COLORS.chilli, img: pack1 },
    { name: 'Soupy Laphing Pack', tag: 'For when you want a hug. A spicy, chaotic hug.', spice: 2, color: COLORS.turmeric, img: pack2 },
    { name: 'Spicy Firebomb Edition', tag: "Not for the weak. You've been warned. 🔥💀", spice: 5, color: COLORS.fire, img: pack3 },
    { name: 'Starter Kit (Pack + Sauces)', tag: 'Everything. All at once. The full craving kit.', spice: 3, color: COLORS.yellow, img: pack1 },
  ];
  return (
    <section id="shop" className="py-24 md:py-32 px-4 md:px-8" style={{ background: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader>
          <span style={{ color: COLORS.off }}>Pick Your</span>{' '}
          <span style={{ color: COLORS.fire }}>Poison 🌶️</span>
        </SectionHeader>
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4">
          {products.map((p, i) => (
            <div
              key={i}
              className="group min-w-[280px] md:min-w-0 snap-center rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
              style={{
                background: COLORS.black,
                border: `2px solid #222`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 40px ${COLORS.chilli}80`;
                e.currentTarget.style.borderColor = COLORS.chilli;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#222';
              }}
            >
              <div className="aspect-square overflow-hidden" style={{ background: COLORS.black }}>
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <p className="font-body text-sm mb-4" style={{ color: COLORS.off, opacity: 0.8 }}>{p.tag}</p>
                <div className="text-xl mb-4">{'🌶️'.repeat(p.spice)}</div>
                <button
                  onClick={() => toast.success("Added to your craving list 🔥")}
                  className="w-full font-display font-bold uppercase text-sm py-3 rounded-full transition-colors"
                  style={{ background: COLORS.fire, color: COLORS.off }}
                >
                  Add to Waitlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: '💧', title: 'Rehydrate the sheet', desc: 'Soak the laphing sheet. Watch it come alive.' },
    { icon: '🌶️', title: 'Add chilli oil', desc: "Don't be shy. More is more." },
    { icon: '🧂', title: 'Spice it up', desc: "Dump in the spice mix + soya mix. It's giving everything." },
    { icon: '🌀', title: 'Roll & chop', desc: "The satisfying part. Chef's kiss." },
    { icon: '🍜', title: 'Soupy or dry', desc: 'Your call. Both are elite.' },
  ];
  return (
    <section id="how" className="py-24 md:py-32 px-4 md:px-8" style={{ background: COLORS.black }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader>
          <span style={{ color: COLORS.off }}>It's Literally</span>{' '}
          <span style={{ color: COLORS.turmeric }}>5 Steps 🤌</span>
        </SectionHeader>
        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.6, opacity: 0, y: 30 }}
              whileInView={{ scale: 1, opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.12, type: 'spring', stiffness: 200, damping: 14 }}
              className="text-center p-6 rounded-2xl"
              style={{ background: '#151515', border: `2px solid ${COLORS.turmeric}40` }}
            >
              <div className="text-6xl mb-4">{s.icon}</div>
              <div className="font-display font-black text-5xl mb-2" style={{ color: COLORS.fire }}>0{i + 1}</div>
              <h3 className="font-display font-bold uppercase text-lg mb-2" style={{ color: COLORS.off }}>{s.title}</h3>
              <p className="font-body text-sm" style={{ color: COLORS.off, opacity: 0.7 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-14">
          <span
            className="inline-block font-display font-black uppercase text-2xl md:text-3xl px-8 py-4 rounded-full"
            style={{ background: COLORS.fire, color: COLORS.off }}
          >
            ⏱ Total Time: ~5 Minutes
          </span>
        </div>
      </div>
    </section>
  );
}

function CountUp({ to, suffix = '', duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      setVal(Math.floor(p * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function Stats() {
  const stats = [
    { icon: '🔍', value: 3, suffix: 'x', label: 'Search growth in 12 months. Delhi is obsessed.' },
    { icon: '🏙️', value: 10, suffix: '+', label: 'Cities catching the craving.' },
    { icon: '⚡', value: 5, suffix: ' mins', label: 'Average prep time. Certified.' },
  ];
  return (
    <section className="py-24 md:py-32 px-4 md:px-8" style={{ background: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader>
          <span style={{ color: COLORS.off }}>The Numbers</span>{' '}
          <span style={{ color: COLORS.yellow }}>Don't Lie 📈</span>
        </SectionHeader>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stats.map((s, i) => (
            <div key={i} className="text-center p-8 rounded-2xl" style={{ background: COLORS.black, border: `2px solid ${COLORS.fire}` }}>
              <div className="text-5xl mb-4">{s.icon}</div>
              <div className="font-display font-black text-7xl md:text-8xl mb-3" style={{ color: COLORS.fire }}>
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <p className="font-body" style={{ color: COLORS.off, opacity: 0.8 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="max-w-md mx-auto p-6 rounded-2xl" style={{ background: '#191919', border: `2px solid ${COLORS.turmeric}` }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full" style={{ background: `linear-gradient(135deg, ${COLORS.fire}, ${COLORS.yellow})` }} />
            <div>
              <div className="font-display font-bold text-sm" style={{ color: COLORS.off }}>@delhi.foodie.real</div>
              <div className="text-xs" style={{ color: COLORS.off, opacity: 0.5 }}>placeholder · 2h</div>
            </div>
          </div>
          <p className="font-body" style={{ color: COLORS.off }}>
            "bro i made laphing at home at 2am using this kit and i actually cried 😭🌶️"
          </p>
        </div>
      </div>
    </section>
  );
}

function Explore() {
  const cards = [
    { icon: '🎬', title: 'Watch on YouTube', tag: 'See it made. Fall in love.', href: 'https://youtube.com/results?search_query=laphing+tibetan+street+food', color: COLORS.fire, body: null },
    { icon: '📸', title: 'Instagram', tag: 'The craving is contagious.', href: 'https://instagram.com/explore/tags/laphing', color: COLORS.chilli, body: null },
    { icon: '📖', title: 'Read about Laphing', tag: 'The rise of Tibetan street food in Delhi.', href: '#', color: COLORS.turmeric, body: null },
    { icon: '🏔️', title: 'Tibetan Food Culture', tag: 'The community behind the craving.', href: null, color: COLORS.yellow, body: 'Majnu Ka Tilla is Delhi\'s little Tibet — momos steaming on every corner, butter tea, and laphing sheets stacked like zines. The Tibetan community brought their street food here decades ago. We just packed it for your couch.' },
  ];
  return (
    <section id="explore" className="py-24 md:py-32 px-4 md:px-8" style={{ background: COLORS.black }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader>
          <span style={{ color: COLORS.off }}>New to Laphing?</span>{' '}
          <span style={{ color: COLORS.fire }}>Let Us Corrupt You.</span>
        </SectionHeader>
        <p className="font-body text-lg md:text-xl max-w-3xl mb-12" style={{ color: COLORS.off, opacity: 0.85 }}>
          Laphing is Tibetan street food. Cold, slippery, spicy sheets of starch in a sauce that will rewire your brain. It's from Lhasa. It lives in Majnu Ka Tilla. And now it lives in your kitchen.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => {
            const Comp: any = c.href ? 'a' : 'div';
            return (
              <Comp
                key={i}
                href={c.href || undefined}
                target={c.href ? '_blank' : undefined}
                rel={c.href ? 'noopener noreferrer' : undefined}
                className="group relative block p-6 rounded-2xl overflow-hidden cursor-pointer min-h-[220px]"
                style={{ background: '#151515', border: `3px solid ${c.color}` }}
              >
                <div className="text-4xl mb-3">{c.icon}</div>
                <h3 className="font-display font-black uppercase text-xl mb-2" style={{ color: c.color }}>{c.title}</h3>
                <p className="font-body text-sm" style={{ color: COLORS.off, opacity: 0.85 }}>{c.body || c.tag}</p>
                <span
                  className="absolute inset-0 flex items-center justify-center font-display font-black uppercase text-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `${COLORS.black}E6`,
                    color: c.color,
                    transform: 'rotate(-8deg)',
                  }}
                >
                  Explore →
                </span>
              </Comp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Waitlist() {
  const [email, setEmail] = useState('');
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("You're a certified craver now. We'll hit you up.");
    setEmail('');
  };
  return (
    <section id="waitlist" className="py-24 md:py-32 px-4 md:px-8" style={{ background: COLORS.fire }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display font-black uppercase text-6xl md:text-8xl leading-none mb-6" style={{ color: COLORS.off }}>
          Be First. <br/>Be a Craver.
        </h2>
        <p className="font-body text-lg md:text-2xl mb-10" style={{ color: COLORS.off, opacity: 0.95 }}>
          We're launching soon. Get early access, first drops, and craver-only deals.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-4 rounded-full font-body text-base outline-none focus:ring-4 focus:ring-yellow-300/60"
            style={{ background: COLORS.off, color: COLORS.black }}
          />
          <button
            type="submit"
            className="font-display font-bold uppercase px-8 py-4 rounded-full text-base whitespace-nowrap transition-transform hover:scale-105"
            style={{ background: COLORS.black, color: COLORS.off }}
          >
            I'm In 🔥
          </button>
        </form>
        <div className="flex flex-wrap justify-center gap-6 mt-10 font-body text-sm" style={{ color: COLORS.off }}>
          <span>✅ No spam. Ever.</span>
          <span>✅ Early access pricing</span>
          <span>✅ First to know about new flavours</span>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-16 px-4 md:px-8 text-center" style={{ background: COLORS.black, borderTop: `2px solid ${COLORS.fire}` }}>
      <h3 className="font-display font-black uppercase text-5xl md:text-7xl mb-4" style={{ color: COLORS.yellow }}>
        The Laphing Co
      </h3>
      <p className="font-body italic mb-6" style={{ color: COLORS.turmeric }}>built by cravers. for cravers.</p>
      <div className="flex justify-center gap-6 font-body text-sm mb-6" style={{ color: COLORS.off }}>
        <a href="#" className="hover:opacity-70">Instagram</a>
        <a href="#" className="hover:opacity-70">YouTube</a>
        <a href="#" className="hover:opacity-70">Contact</a>
      </div>
      <p className="font-body text-xs" style={{ color: COLORS.off, opacity: 0.5 }}>© 2025 The Laphing Co. All cravings reserved.</p>
    </footer>
  );
}

export default function Laphing() {
  return (
    <div className="min-h-screen" style={{ background: COLORS.black, color: COLORS.off }}>
      <style>{`
        @keyframes laphingPulse {
          0%, 100% { box-shadow: 0 0 0 0 ${COLORS.fire}cc; transform: scale(1); }
          50% { box-shadow: 0 0 0 12px ${COLORS.fire}00; transform: scale(1.03); }
        }
        @keyframes laphingMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .font-display { font-family: 'Bebas Neue', 'Black Han Sans', system-ui, sans-serif; }
        .font-body { font-family: 'DM Sans', 'Plus Jakarta Sans', system-ui, sans-serif; }
        html { scroll-behavior: smooth; }
      `}</style>
      <Navbar />
      <Hero />
      <Problem />
      <Products />
      <HowItWorks />
      <Stats />
      <Explore />
      <Waitlist />
      <Footer />
    </div>
  );
}
