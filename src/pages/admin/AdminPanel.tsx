import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, Plus, Edit2 } from 'lucide-react';
import { SiteLoader } from '../../components/SiteLoader';
import { motion } from 'motion/react';

export default function AdminPanel() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<any>(null);
  
  // Stats
  const [stats, setStats] = useState({ deps: 0, txs: 0 });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'services')));
      setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const [depSnap, txSnap] = await Promise.all([
        getDocs(query(collection(db, 'deposits'))),
        getDocs(query(collection(db, 'transactions')))
      ]);
      setStats({ deps: depSnap.docs.length, txs: txSnap.docs.length });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingService.id;
    try {
      if (isNew) {
        const ref = doc(collection(db, 'services'));
        await setDoc(ref, {
          ...editingService,
          price: parseFloat(editingService.price),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        const ref = doc(db, 'services', editingService.id);
        await updateDoc(ref, {
          name: editingService.name,
          description: editingService.description,
          price: parseFloat(editingService.price),
          githubRepo: editingService.githubRepo,
          updatedAt: serverTimestamp()
        });
      }
      setEditingService(null);
      fetchServices();
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="space-y-8 relative z-10">
      <div>
        <h1 className="text-3xl font-light tracking-tight mb-2">System Administration</h1>
        <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest">Manage protocol pricing, monitor telemetry.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="grey-glass p-6 rounded-[24px] shadow-[0_0_20px_rgba(0,255,163,0.02)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#00FFA3]/10 blur-[20px] rounded-full" />
          <div className="text-xs uppercase tracking-widest text-[#00FFA3] mb-2 font-mono">Active Modules</div>
          <div className="text-3xl font-light text-white">{services.length}</div>
        </div>
        <div className="grey-glass p-6 rounded-[24px] shadow-[0_0_20px_rgba(0,229,255,0.02)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#00E5FF]/10 blur-[20px] rounded-full" />
          <div className="text-xs uppercase tracking-widest text-[#00E5FF] mb-2 font-mono">Total Injections</div>
          <div className="text-3xl font-light text-white">{stats.deps}</div>
        </div>
        <div className="grey-glass p-6 rounded-[24px] shadow-[0_0_20px_rgba(255,255,255,0.02)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 blur-[20px] rounded-full" />
          <div className="text-xs uppercase tracking-widest text-neutral-400 mb-2 font-mono">Executions</div>
          <div className="text-3xl font-light text-white">{stats.txs}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium font-mono uppercase tracking-widest text-white">Module Configuration</h2>
        <button 
          onClick={() => setEditingService({ name: '', description: '', price: 0, githubRepo: '' })}
          className="bg-[#00FFA3] text-[#0B0E11] px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-[#00E5FF] hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all uppercase tracking-widest font-mono"
        >
          <Plus size={16} /> Deploy New
        </button>
      </div>

      {loading ? (
        <div className="p-10 flex justify-center"><SiteLoader /></div>
      ) : (
        <div className="grey-glass rounded-[24px] overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0B0E11]/80 text-[10px] font-mono uppercase tracking-widest text-[#00E5FF]">
              <tr>
                <th className="px-6 py-4 font-semibold">Identifier</th>
                <th className="px-6 py-4 font-semibold">Cost (₦)</th>
                <th className="px-6 py-4 font-semibold">Source Route</th>
                <th className="px-6 py-4 font-semibold text-right">Sys_Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {services.map(svc => (
                <tr key={svc.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{svc.name}</td>
                  <td className="px-6 py-4 text-[#00FFA3] font-mono">₦{svc.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-neutral-400 max-w-[200px] truncate">{svc.githubRepo}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setEditingService(svc)}
                      className="p-2 text-neutral-500 hover:text-[#00FFA3] transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-[#0B0E11]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-[#151921] border border-white/10 shadow-[0_0_50px_rgba(0,255,163,0.05)] rounded-[24px] p-8 w-full max-w-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FFA3]/10 blur-[50px] rounded-full pointer-events-none" />
            <h3 className="text-xl font-medium mb-6 font-mono text-[#00FFA3] uppercase tracking-widest">{editingService.id ? 'Modify Protocol' : 'Initialize Protocol'}</h3>
            <form onSubmit={handleSave} className="space-y-4 relative z-10">
              <div>
                <label className="block text[10px] font-mono uppercase tracking-widest text-[#00E5FF] mb-1">Identifier</label>
                <input required type="text" value={editingService.name} onChange={e => setEditingService({...editingService, name: e.target.value})} className="w-full bg-[#0B0E11] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FFA3] focus:shadow-[0_0_15px_rgba(0,255,163,0.2)] transition-all font-mono text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] mb-1">Specifications</label>
                <textarea required value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} className="w-full bg-[#0B0E11] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FFA3] focus:shadow-[0_0_15px_rgba(0,255,163,0.2)] transition-all font-mono text-sm" rows={3} />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] mb-1">Execution Cost (₦)</label>
                <input required type="number" value={editingService.price} onChange={e => setEditingService({...editingService, price: e.target.value})} className="w-full bg-[#0B0E11] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FFA3] focus:shadow-[0_0_15px_rgba(0,255,163,0.2)] transition-all font-mono text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] mb-1">Source Pipeline (URL)</label>
                <input required type="url" value={editingService.githubRepo} onChange={e => setEditingService({...editingService, githubRepo: e.target.value})} className="w-full bg-[#0B0E11] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FFA3] focus:shadow-[0_0_15px_rgba(0,255,163,0.2)] transition-all font-mono text-sm" />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setEditingService(null)} className="flex-1 py-3 bg-white/5 border border-white/10 text-white rounded-full font-semibold hover:bg-white/10 transition-all uppercase tracking-widest font-mono text-[10px]">Abort</button>
                <button type="submit" className="flex-1 py-3 bg-[#00FFA3] text-[#0B0E11] rounded-full font-semibold hover:bg-[#00E5FF] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all uppercase tracking-widest font-mono text-[10px]">Commit</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
