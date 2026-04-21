import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowUpRight, ArrowDownRight, Clock, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FancyLink } from '../../components/FancyButton';
import { SiteLoader } from '../../components/SiteLoader';

export default function DashboardOverview() {
  const { currentUser, userProfile } = useAuth();
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [servicesMap, setServicesMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetchActivity = async () => {
      try {
        // Fetch services to map service names
        const svcSnap = await getDocs(collection(db, 'services'));
        const sMap: Record<string, string> = {};
        svcSnap.docs.forEach(d => { sMap[d.id] = d.data().name; });
        setServicesMap(sMap);

        const depositsQuery = query(collection(db, 'deposits'), where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'), limit(5));
        const txQuery = query(collection(db, 'transactions'), where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'), limit(15));
        
        const [depSnap, txSnap] = await Promise.all([getDocs(depositsQuery), getDocs(txQuery)]);
        const deps = depSnap.docs.map(d => ({ ...d.data(), id: d.id, type: 'deposit' }));
        const txs = txSnap.docs.map(d => ({ ...d.data(), id: d.id, type: 'transaction' }));
        
        const combined = [...deps, ...txs].sort((a: any, b: any) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)).slice(0, 10);
        setRecentActivity(combined);
      } catch (err) {
        console.error('Error fetching activity', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [currentUser]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light tracking-tight mb-2">Control Center</h1>
        <p className="text-neutral-500 font-mono text-sm">SYSTEM_READY // Initialize command</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="grey-glass rounded-[24px] p-8 relative overflow-hidden shadow-[0_0_30px_rgba(0,255,163,0.03)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FFA3] blur-[60px] opacity-10 -mr-10 -mt-10 rounded-full" />
          <div className="text-xs uppercase tracking-widest text-[#00FFA3] mb-4 font-mono">Available Funds</div>
          <div className="text-5xl font-light mb-6 drop-shadow-[0_0_10px_rgba(0,255,163,0.2)]">₦{(userProfile?.balance || 0).toLocaleString()}</div>
          <Link to="/dashboard/deposit" className="inline-block">
            <FancyLink className="!py-2 !px-6 !text-sm">Add Funds</FancyLink>
          </Link>
        </div>

        <div className="grey-glass rounded-[24px] p-8 flex flex-col justify-center shadow-[0_0_30px_rgba(0,229,255,0.03)]">
          <div className="text-xs uppercase tracking-widest text-[#00E5FF] mb-4 font-mono">Quick Navigation</div>
          <div className="space-y-3">
            <Link to="/dashboard/tools" className="flex items-center justify-between group p-3 -mx-3 rounded-xl hover:bg-white/5 transition-all">
              <span className="text-lg text-neutral-300 group-hover:text-white transition-colors">Access Tools Generator</span>
              <ArrowUpRight className="text-neutral-500 group-hover:text-[#00FFA3] transition-colors" />
            </Link>
            <div className="h-px w-full bg-white/10" />
            <Link to="/dashboard/deposit" className="flex items-center justify-between group p-3 -mx-3 rounded-xl hover:bg-white/5 transition-all">
              <span className="text-lg text-neutral-300 group-hover:text-white transition-colors">View Deposit History</span>
              <ArrowUpRight className="text-neutral-500 group-hover:text-[#00E5FF] transition-colors" />
            </Link>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse"/> Recent Generations & Activity</h2>
        <div className="grey-glass rounded-[24px] overflow-hidden">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-center text-neutral-500 font-mono text-sm">
              <div className="mb-4"><SiteLoader /></div>
              Loading telemetry...
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 flex flex-col items-center">
              <Clock className="mb-2 opacity-50" size={24} />
              <p className="font-mono text-sm">No recent activity detected.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentActivity.map((item, i) => (
                <div key={i} className="p-4 px-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${item.type === 'deposit' ? 'bg-[#00FFA3]/10 text-[#00FFA3]' : 'bg-[#00E5FF]/10 text-[#00E5FF]'}`}>
                      {item.type === 'deposit' ? <ArrowDownRight size={16} /> : <Box size={16} />}
                    </div>
                    <div>
                      {item.type === 'deposit' ? (
                        <div className="font-medium text-sm text-white">Deposit Authorized</div>
                      ) : (
                        <div className="font-medium text-sm text-white">{servicesMap[item.serviceId] || 'Tool Generation'}</div>
                      )}
                      <div className="text-xs text-neutral-500 uppercase tracking-widest mt-1 font-mono">
                        {item.type === 'deposit' ? (item.status || 'success') : 'GENERATED'} // {new Date(item.createdAt?.toMillis() || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className={`font-medium ${item.type === 'deposit' ? 'text-[#00FFA3]' : 'text-neutral-300'}`}>
                    {item.type === 'deposit' ? '+' : '-'}₦{item.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
