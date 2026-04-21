import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2, ShieldCheck, Wallet } from 'lucide-react';
import { FancyButton } from '../../components/FancyButton';

export default function DepositPage() {
  const { currentUser, userProfile } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [deposits, setDeposits] = useState<any[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchDeposits = async () => {
      const q = query(collection(db, 'deposits'), where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setDeposits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchDeposits();
  }, [currentUser]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return alert('Invalid amount');

    setLoading(true);
    try {
      // Create pending deposit in DB first
      const depositRef = doc(collection(db, 'deposits'));
      const reference = depositRef.id;

      await setDoc(depositRef, {
        userId: currentUser.uid,
        amount: amt,
        status: 'pending',
        reference: reference, // we can use this as custom ref for paystack if we want
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Call API to initialize paystack
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email, amount: amt })
      });
      
      const data = await res.json();
      if (data.status && data.data && data.data.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        alert('Payment initialization failed: ' + data.message);
      }

    } catch (err: any) {
      console.error(err);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl relative z-10">
      <div>
        <h1 className="text-3xl font-light tracking-tight mb-2">Capital Injection</h1>
        <p className="text-neutral-500 font-mono text-sm">Transfer funds securely via Paystack pipeline.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="grey-glass shadow-[0_0_40px_rgba(0,255,163,0.03)] rounded-[24px] p-8">
          <div className="flex items-center gap-3 text-neutral-400 mb-6 font-mono text-sm uppercase">
            <Wallet size={18} className="text-[#00FFA3]" /> Top Up Balance
          </div>
          
          <form onSubmit={handleDeposit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#00E5FF] mb-2 font-mono">Amount (₦)</label>
              <input 
                type="number" 
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="100"
                step="100"
                className="w-full bg-[#0B0E11]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FFA3] focus:shadow-[0_0_15px_rgba(0,255,163,0.2)] transition-all"
                placeholder="e.g. 5000"
                required
              />
            </div>
            
            <FancyButton 
              type="submit" 
              disabled={loading}
              wrapperClassName="w-full"
              className="w-full py-4 text-[#0B0E11]"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Proceed to Gateway'}
            </FancyButton>
          </form>

          <div className="mt-6 flex items-start gap-3 bg-[#0B0E11]/80 border border-white/10 p-4 rounded-xl text-xs text-neutral-400 backdrop-blur-md">
            <ShieldCheck size={24} className="text-[#00FFA3] shrink-0" />
            <p className="font-mono leading-relaxed tracking-tight">Payments are securely processed by Paystack. Financial payload is encrypted and never stored on local servers.</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4 font-mono text-[#00FFA3]">Transfer Log</h2>
          <div className="grey-glass rounded-[24px] overflow-hidden divide-y divide-white/5">
            {deposits.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 font-mono text-sm">No transaction records found.</div>
            ) : (
              deposits.map(dep => (
                <div key={dep.id} className="p-4 px-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div>
                    <div className="font-medium text-sm text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">₦{dep.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-neutral-500 font-mono uppercase mt-1 tracking-widest">
                      {new Date(dep.createdAt?.toMillis() || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-semibold font-mono ${
                    dep.status === 'success' ? 'bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/20' :
                    dep.status === 'failed' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                  }`}>
                    {dep.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
