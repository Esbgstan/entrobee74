import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Code, LayoutDashboard, CheckCircle2, Star, ShieldCheck } from 'lucide-react';
import { FancyLink } from '../components/FancyButton';

export default function LandingPage() {
  const services = [
    { name: "Crypto Receipt Builder", desc: "Generate authentic-looking transaction receipts for top exchanges and banks instantly." },
    { name: "Position Generator", desc: "Design perfect futures positions & trading cards to showcase market analysis visually." },
    { name: "Support Site Creator", desc: "Deploy high-fidelity frontend support centers and microsites routed to your contact logic." }
  ];

  return (
    <div className="min-h-screen bg-[#07090C] text-white overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00FFA3]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#00E5FF]/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 md:p-8 max-w-7xl mx-auto">
        <div className="font-display text-2xl tracking-tight text-white flex items-center gap-1">
          <Zap className="text-[#00FFA3]" fill="#00FFA3" size={24} />
          ENTROPY<span className="text-[#00FFA3]">TOOLS</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/login" className="px-5 py-2 text-sm font-medium hover:text-[#00FFA3] transition-colors">Log In</Link>
          <Link to="/login">
            <FancyLink className="!py-2 !px-6 !text-sm">Get Started</FancyLink>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="flex flex-col gap-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00FFA3]/30 bg-[#00FFA3]/5 text-[#00FFA3] text-xs font-semibold uppercase tracking-widest w-max">
            <span className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse" /> System Online
          </div>
          <h1 className="font-display text-6xl md:text-8xl leading-[0.9] tracking-tighter decoration-[#00FFA3]">
            Build The <br/><span className="text-white drop-shadow-[0_0_15px_rgba(0,255,163,0.3)]">Future</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-lg font-light leading-relaxed">
            High-fidelity tools and services for the modern web. Access receipt generators, trading positions, and support centers instantly.
          </p>
          <div className="flex gap-4 mt-4">
            <Link to="/login">
              <FancyLink className="font-bold flex items-center gap-2 uppercase tracking-widest">
                Initialize Portal <ArrowRight size={18} />
              </FancyLink>
            </Link>
          </div>
        </motion.div>

        {/* Visual Graphic */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="relative aspect-square flex items-center justify-center border border-white/10 rounded-[40px] bg-white/5 backdrop-blur-2xl overflow-hidden shadow-[0_0_50px_rgba(0,255,163,0.05)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#00FFA311,_transparent_70%)]" />
          
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="w-64 h-64 border border-[#00FFA3]/20 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-2 border border-[#00E5FF]/20 rounded-full border-dashed animate-[spin_20s_linear_reverse_infinite]" />
            <div className="w-32 h-32 bg-[#00FFA3] rounded-full blur-[60px] opacity-20" />
            <Code size={48} className="absolute text-[#00FFA3]" strokeWidth={1} />
          </motion.div>

          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-12 left-8 border border-white/10 rounded-2xl bg-[#0B0E11]/80 backdrop-blur-md p-4 flex items-center gap-4 shadow-xl">
            <div className="w-10 h-10 bg-[#00FFA3]/10 rounded-lg flex items-center justify-center text-[#00FFA3]"><LayoutDashboard size={20} /></div>
            <div>
              <div className="text-xs text-neutral-400">Status</div>
              <div className="text-sm font-semibold text-white">Position Gen</div>
            </div>
          </motion.div>

          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-12 right-8 border border-[#00FFA3]/20 rounded-2xl bg-[#0B0E11]/80 backdrop-blur-md p-4 flex items-center gap-4 shadow-xl shadow-[#00FFA3]/10">
            <div>
              <div className="text-xs text-[#00FFA3] text-right">Online</div>
              <div className="text-sm font-semibold text-white">Support Center</div>
            </div>
            <div className="w-10 h-10 bg-[#00E5FF]/10 rounded-lg flex items-center justify-center text-[#00E5FF]"><Zap size={20} /></div>
          </motion.div>
        </motion.div>
      </main>

      {/* Trust Score & Badges */}
      <section className="relative z-10 py-12 border-y border-white/5 grey-glass">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-8">
            <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#00FFA3]" size={40} />
                <div>
                    <div className="text-2xl font-semibold">99.9%</div>
                    <div className="text-xs text-neutral-400 uppercase tracking-widest font-mono">Uptime SLA</div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} fill="#00FFA3" className="text-[#00FFA3]" size={20} />)}
                </div>
                <div>
                    <div className="text-xl font-semibold">4.9/5</div>
                    <div className="text-xs text-neutral-400 uppercase tracking-widest font-mono">TrustScore™</div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="font-display font-medium text-2xl tracking-tighter">1M+</div>
                <div className="text-xs text-neutral-400 uppercase tracking-widest font-mono leading-tight">Assets<br/>Generated</div>
            </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display tracking-tight mb-4">Available Protocols</h2>
            <p className="text-neutral-400 font-mono text-sm uppercase tracking-widest">Select an execution module to proceed</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
            {services.map((svc, i) => (
                <div key={i} className="bg-[#11161d] border border-white/5 rounded-3xl p-8 hover:border-[#00FFA3]/30 hover:bg-[#151b24] transition-all">
                    <div className="w-12 h-12 bg-[#00FFA3]/10 text-[#00FFA3] rounded-xl flex items-center justify-center mb-6">
                        <Code size={24} />
                    </div>
                    <h3 className="text-xl font-medium mb-3">{svc.name}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-8">{svc.desc}</p>
                    <div className="text-[#00FFA3] text-sm font-mono uppercase tracking-widest flex items-center gap-2">
                        Preview module <ArrowRight size={16} />
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* How To Use */}
      <section className="relative z-10 border-t border-white/5 bg-[radial-gradient(ellipse_at_top,_#00FFA30a,_transparent_50%)]">
        <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-3xl md:text-5xl font-display tracking-tight mb-6">How It Works</h2>
                    <p className="text-neutral-400 mb-12">Entropy Tools allows you to orchestrate premium frontend components instantly with zero backend setup. Follow our secure deployment pipeline.</p>
                    
                    <div className="space-y-8">
                        {[
                            { step: "01", title: "Fund Your Workspace", desc: "Deposit credits safely using Paystack integration. Your balance grants execution rights." },
                            { step: "02", title: "Configure Payload", desc: "Select a tool and input your specified parameters. Adjust values securely in your browser." },
                            { step: "03", title: "Execute Transaction", desc: "Hit generate. The exact cost resolves from your balance immediately and unlocks the asset." },
                            { step: "04", title: "Download & Deploy", desc: "Retrieve your rendered PNG or grab your unique live shareable link instantly." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="text-xl font-mono font-bold text-[#00FFA3] opacity-60 mt-1">{item.step}</div>
                                <div>
                                    <h4 className="text-lg font-medium mb-1">{item.title}</h4>
                                    <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-[#11161d] border border-white/10 p-8 rounded-[40px] relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#00E5FF]/10 blur-[80px] rounded-full pointer-events-none" />
                    <div className="space-y-6">
                        {[
                            { u: "alex_dev", text: "Incredible UX. The crypto receipt tool saved me hundreds of hours of design work." },
                            { u: "satoshi_99", text: "Support center microsites look 100% authentic. The SLA uptime is flawless." },
                            { u: "web3_builder", text: "Atomic transactions & fast pipeline. Position generator is easily the best on the market." }
                        ].map((review, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    {[1,2,3,4,5].map(s => <Star key={s} fill="#00FFA3" className="text-[#00FFA3]" size={14} />)}
                                </div>
                                <p className="text-sm font-light leading-relaxed mb-4">"{review.text}"</p>
                                <div className="text-[#00FFA3] font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle2 size={12} /> verified user @{review.u}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
        &copy; 2026 ENTROPY TOOLS. HIGH-FIDELITY WEB INFRASTRUCTURE.
      </footer>
    </div>
  );
}
