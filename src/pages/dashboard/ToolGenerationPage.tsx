import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2, ArrowLeft, Download, Link as LinkIcon, Info } from 'lucide-react';
import { GenerationLoader } from '../../components/GenerationLoader';
import { FancyButton } from '../../components/FancyButton';
import { SiteLoader } from '../../components/SiteLoader';

export default function ToolGenerationPage() {
  const { toolId } = useParams();
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [viewState, setViewState] = useState<'INPUT' | 'PROCESSING' | 'RESULT'>('INPUT');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [dynamicPrice, setDynamicPrice] = useState<number>(0);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!toolId) return;
    const fetchService = async () => {
      try {
        const snap = await getDoc(doc(db, 'services', toolId));
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() };
          setService(data);
          setDynamicPrice(data.price);
        } else {
          setError('Tool not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load tool');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [toolId]);

  useEffect(() => {
    // Poll the iframe to calculate dynamic pricing based on user inputs
    const interval = setInterval(() => {
      if (!service || viewState !== 'INPUT' || !iframeRef.current?.contentDocument) return;
      const doc = iframeRef.current.contentDocument;
      
      let newPrice = service.price;
      
      // Look for uptime slider (e.g. support center)
      const uptimeSlider = doc.getElementById('uptime-slider') as HTMLInputElement;
      if (uptimeSlider) {
        const days = parseInt(uptimeSlider.value || '14', 10);
        // Base price is assuming 14 days
        newPrice = Math.ceil((service.price / 14) * days);
      }
      
      if (newPrice !== dynamicPrice) setDynamicPrice(newPrice);
    }, 500);

    return () => clearInterval(interval);
  }, [service, dynamicPrice, viewState]);

  const handleExecute = async () => {
    if (!service || !userProfile || !currentUser) return;
    
    // Check if enough balance
    if (userProfile.balance < dynamicPrice) {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ action: 'REJECT_PURCHASE' }, '*');
      }
      return alert(`Insufficient workspace balance. You need ₦${dynamicPrice.toLocaleString()} but have ₦${userProfile.balance.toLocaleString()}.`);
    }

    setViewState('PROCESSING');
    setError('');
    
    try {
      const batch = writeBatch(db);
      
      const userRef = doc(db, 'users', currentUser.uid);
      batch.update(userRef, {
        balance: userProfile.balance - dynamicPrice,
        updatedAt: serverTimestamp()
      });
      
      const txRef = doc(collection(db, 'transactions'));
      batch.set(txRef, {
        userId: currentUser.uid,
        amount: dynamicPrice,
        serviceId: service.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      await batch.commit();

      // Trigger Iframe generation
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ action: 'EXECUTE_GENERATION' }, '*');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      setViewState('INPUT');
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ action: 'SET_MODE_INPUT' }, '*');
      }
    }
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data.action === 'GENERATION_COMPLETE') {
        setGeneratedLink(e.data.link);
        setViewState('RESULT');
      } else if (e.data.action === 'REQUEST_PURCHASE') {
        handleExecute();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleExecute]);

  const handleDownload = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Support native download if defined
      iframeRef.current.contentWindow.postMessage({ action: 'DOWNLOAD' }, '*');
    }
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      alert('Shareable link copied to clipboard!');
    } else {
      alert('This specific tool does not support shareable live links, please download the image instead.');
    }
  };

  if (loading) return <div className="p-20 flex justify-center"><SiteLoader /></div>;
  if (error || !service) return <div className="p-10 text-red-500 bg-red-500/10 rounded-xl">{error}</div>;

  return (
    <div className="flex flex-col h-[85vh] relative z-10 -m-4">
      {/* Top Banner Control */}
      <div className="flex items-center justify-between p-4 bg-[#0B0E11]/90 backdrop-blur-md border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-medium text-[#00FFA3] uppercase tracking-widest font-mono flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse" />
              {service.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-neutral-400 font-mono text-sm hidden sm:block">
            BALANCE: <span className="text-white">₦{userProfile?.balance?.toLocaleString() || 0}</span>
          </div>
          
          {viewState === 'INPUT' && (
            <div className="bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/20 px-6 py-2 rounded-full font-semibold uppercase tracking-widest text-xs font-mono">
              COST WILL BE ₦{dynamicPrice.toLocaleString()}
            </div>
          )}

          {viewState === 'PROCESSING' && (
            <div className="bg-transparent border border-white/5 text-white/50 px-6 py-2 rounded-full font-semibold uppercase tracking-widest text-sm font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse"></span> PROCESSING
            </div>
          )}

          {viewState === 'RESULT' && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                    setViewState('INPUT');
                    if (iframeRef.current && iframeRef.current.contentWindow) {
                      iframeRef.current.contentWindow.postMessage({ action: 'SET_MODE_INPUT' }, '*');
                    }
                }}
                className="bg-white/5 border border-white/10 text-white px-4 py-2 flex items-center gap-2 rounded-full hover:bg-white/10 transition-colors uppercase tracking-widest text-xs font-mono mr-2"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button 
                onClick={handleCopyLink}
                className="bg-[#00E5FF]/20 border border-[#00E5FF]/30 text-[#00E5FF] px-4 py-2 flex items-center gap-2 rounded-full hover:bg-[#00E5FF]/30 transition-colors uppercase tracking-widest text-xs font-mono"
              >
                <LinkIcon size={14} /> Link
              </button>
              <FancyButton 
                onClick={handleDownload}
                wrapperClassName="scale-[0.85] origin-right"
                className="px-4 py-2 flex items-center gap-2 uppercase tracking-widest text-xs font-mono font-semibold"
              >
                <Download size={14} /> Save Output
              </FancyButton>
            </div>
          )}
        </div>
      </div>

      {/* iFrame Container */}
      <div className="flex-1 w-full bg-[#07090C] relative">
        <iframe 
          ref={iframeRef}
          src={`/tools/${service.id}/index.html`}
          className="w-full h-full border-none transition-opacity duration-300 relative z-10"
          style={{ opacity: viewState === 'PROCESSING' ? 0.3 : 1 }}
          title={service.name}
        />
        
        {viewState === 'PROCESSING' && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0B0E11]/90 backdrop-blur-md">
                <GenerationLoader />
            </div>
        )}
      </div>
    </div>
  );
}
