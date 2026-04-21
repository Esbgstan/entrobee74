import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Wallet, Boxes, LogOut, Shield, Zap } from 'lucide-react';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';

export default function DashboardLayout() {
  const { userProfile, isAdmin } = useAuth();
  const location = useLocation();

  const handleLogout = () => auth.signOut();

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tools Market', path: '/dashboard/tools', icon: Boxes },
    { name: 'Deposit Funds', path: '/dashboard/deposit', icon: Wallet },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin Control', path: '/admin', icon: Shield });
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] flex text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0B0E11]/80 backdrop-blur-xl hidden md:flex flex-col relative z-20">
        <div className="p-6 border-b border-white/10 flex items-center gap-2">
          <Zap className="text-[#00FFA3]" fill="#00FFA3" size={20} />
          <Link to="/" className="font-display text-xl tracking-tight text-white">ENTROPY<span className="text-[#00FFA3]">TOOLS</span></Link>
        </div>
        <div className="p-6">
          <div className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Available Funds</div>
          <div className="text-3xl font-light text-[#00FFA3]">₦{(userProfile?.balance || 0).toLocaleString()}</div>
        </div>
        <nav className="flex-1 px-4 py-2 space-y-2">
          <div className="text-xs uppercase tracking-widest text-neutral-500 mb-4 px-4 mt-2">Menu</div>
          {navItems.map(item => {
            const active = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-[#00FFA3]/10 text-[#00FFA3] shadow-[inset_2px_0_0_#00FFA3]' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-red-500/10 w-full transition-colors">
            <LogOut size={18} />
            <span className="font-medium text-sm">System Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-h-screen overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00E5FF]/5 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Mobile Header */}
        <header className="md:hidden p-4 border-b border-white/10 flex items-center justify-between bg-[#0B0E11]/80 backdrop-blur-xl sticky top-0 z-20">
          <Link to="/" className="font-display text-lg tracking-tight flex items-center gap-1">
            <Zap className="text-[#00FFA3]" fill="#00FFA3" size={16} /> ENTROPY<span className="text-[#00FFA3]">TOOLS</span>
          </Link>
          <div className="text-sm text-[#00FFA3] font-medium">₦{(userProfile?.balance || 0).toLocaleString()}</div>
        </header>

        <div className="p-6 md:p-10 max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
