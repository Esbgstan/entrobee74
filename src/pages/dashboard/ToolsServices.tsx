import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FancyLink } from '../../components/FancyButton';
import { SiteLoader } from '../../components/SiteLoader';

export default function ToolsServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, 'services'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setServices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error('Failed to fetch services', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light tracking-tight mb-2">Premium Toolset</h1>
        <p className="text-neutral-500 font-mono text-sm">Select module to execute protocol.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <SiteLoader />
        </div>
      ) : services.length === 0 ? (
        <div className="grey-glass rounded-[24px] p-12 text-center">
          <p className="text-neutral-500 font-mono text-sm">// NO MODULES ONLINE</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <motion.div 
              key={svc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/dashboard/tools/${svc.id}`} className="block group grey-glass rounded-[24px] p-6 hover:border-[#00FFA3] hover:shadow-[0_0_20px_rgba(0,255,163,0.15)] transition-all relative h-full flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF] blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity -mr-10 -mt-10 rounded-full" />
                
                <div className="mb-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-medium">{svc.name}</h3>
                    <div className="bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/20 px-3 py-1 rounded-full text-xs font-mono">₦{svc.price.toLocaleString()}</div>
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed">{svc.description}</p>
                </div>
                
                <div className="flex items-center mt-2 group-hover:translate-y-0 transition-transform">
                  <FancyLink className="!py-2 !text-xs !px-4 w-full justify-between tracking-widest font-mono">
                    EXECUTE <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </FancyLink>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
