const fs = require('fs');
const path = require('path');

const toolsDir = path.join(process.cwd(), 'public', 'tools');
const tools = ['position-gen', 'crypto-receipt', 'support-center'];

const controllerScript = `
<!-- ENTROPY TOOL CONTROLLER -->
<script>
(function() {
  const isViewerMode = window.location.search.includes('r=') || window.location.hash.startsWith('#site=');
  
  const modeStyle = document.createElement('style');
  modeStyle.id = 'entropy-mode-style';
  document.head.appendChild(modeStyle);
  
  const injectTheme = () => {
    const style = document.createElement('style');
    style.textContent = \`
      /* Sleek Interface Overrides */
      :root {
        --bg: #0B0E11 !important;
        --surface: #11161d !important;
        --text: #f8fafc !important;
        --accent: #00FFA3 !important;
      }
      body {
        background-color: var(--bg) !important;
        color: var(--text) !important;
        font-family: 'Inter', system-ui, sans-serif !important;
      }
      .input-field, input, select, textarea {
        background: var(--surface) !important;
        border: 1px solid rgba(255,255,255,0.1) !important;
        color: var(--text) !important;
        border-radius: 8px !important;
      }
      .input-field:focus, input:focus, select:focus, textarea:focus {
        border-color: var(--accent) !important;
        box-shadow: 0 0 0 2px rgba(0,255,163,0.1) !important;
      }
      
      /* Fancy Button CSS natively within tools */
      .fancy-btn-wrapper {
        width: 100%;
        margin-top: 20px;
        display: flex;
        justify-content: center;
      }
      .fancy-btn {
        width: 100%;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 700;
        border-radius: 16px;
        border: none;
        padding: 2px;
        background: radial-gradient(circle 80px at 80% -10%, #ffffff, #181b1b);
        position: relative;
        text-transform: uppercase;
        letter-spacing: 2px;
        transition: transform 0.2s;
        text-decoration: none;
      }
      .fancy-btn:active { transform: scale(0.95); }
      .fancy-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .fancy-btn::after {
        content: ""; position: absolute; width: 65%; height: 60%;
        border-radius: 120px; top: 0; right: 0; box-shadow: 0 0 20px #ffffff38;
        z-index: -1; pointer-events: none;
      }
      .fancy-btn .blob1 {
        position: absolute; width: 70px; height: 100%; border-radius: 16px;
        bottom: 0; left: 0;
        background: radial-gradient(circle 60px at 0% 100%, #3fe9ff, #0000ff80, transparent);
        box-shadow: -10px 10px 30px #0051ff2d; pointer-events: none; z-index: 1;
      }
      .fancy-btn .inner {
        padding: 16px 24px; border-radius: 14px; color: #fff; z-index: 3;
        position: relative; display: flex; align-items: center; justify-content: center; gap: 8px;
        background: radial-gradient(circle 80px at 80% -50%, #777777, #0f1111);
      }
      .fancy-btn .inner::before {
        content: ""; width: 100%; height: 100%; left: 0; top: 0; border-radius: 14px;
        background: radial-gradient(circle 60px at 0% 100%, #00e1ff1a, #0000ff11, transparent);
        position: absolute; pointer-events: none;
      }
    \`;
    document.head.appendChild(style);
  };

  window.entropyAPI = {
    setMode: (mode) => {
      if (mode === 'INPUT') {
        modeStyle.textContent = \`
          #preview-pane { display: none !important; }
          .w-full.md\\\\:w-1\\\\/3 { width: 100% !important; max-width: 800px; margin: 0 auto; max-height: none !important; overflow: visible !important; }
          .share-btn, .gen-btn { display: none !important; }

          .preview-section { display: none !important; }
          .form-section { padding-right: 0 !important; width: 100% !important; max-width: 800px; margin: 0 auto; height: auto !important; max-height: none !important; overflow: visible !important; }

          #sites-section { display: none !important; }
          .create-grid { grid-template-columns: 1fr !important; }
          .admin-header { display: none !important; }
          .admin-hero { display: none !important; }
          #generate-btn { display: none !important; }
          footer { display: none !important; }
        \`;
      } else if (mode === 'RESULT') {
        modeStyle.textContent = \`
          body > div.w-full.md\\\\:w-1\\\\/3 { display: none !important; }
          #preview-pane { display: flex !important; width: 100% !important; height: 100vh !important; }
          .share-btn { display: none !important; }

          .form-section { display: none !important; }
          .preview-section { width: 100% !important; display: flex !important; justify-content: center; align-items: center; margin: 0 auto; }
          .export-btn { display: none !important; }
          button[onclick="generateReceipt()"] { display: none !important; }
          .refresh-btn { display: none !important; }

          .admin-main { display: none !important; }
          #support-site-view { display: flex !important; height: 100vh !important; overflow-y: auto !important; }
          .ss-back-btn { display: none !important; }
        \`;
      } else {
        modeStyle.textContent = '';
      }
    },
    
    injectActionButton: () => {
      if (document.getElementById('entropy-gen-action')) return;
      
      const wrapper = document.createElement('div');
      wrapper.className = 'fancy-btn-wrapper';
      
      const btn = document.createElement('button');
      btn.id = 'entropy-gen-action';
      btn.className = 'fancy-btn';
      
      const blob = document.createElement('div');
      blob.className = 'blob1';
      
      const inner = document.createElement('div');
      inner.className = 'inner';
      inner.innerText = 'GENERATE NOW';
      inner.id = 'entropy-inner-text';
      
      btn.appendChild(blob);
      btn.appendChild(inner);
      wrapper.appendChild(btn);
      
      btn.onclick = (e) => {
        e.preventDefault();
        inner.innerText = 'PROCESSING...';
        btn.disabled = true;
        window.parent.postMessage({ action: 'REQUEST_PURCHASE' }, '*');
      };
      
      setTimeout(() => {
        if (window.location.pathname.includes('crypto-receipt')) {
          const parent = document.getElementById('genBtn')?.parentNode;
          if (parent) parent.appendChild(wrapper);
        } else if (window.location.pathname.includes('position-gen')) {
          const parent = document.querySelector('.form-section')?.querySelector('.space-y-4');
          if (parent) parent.appendChild(wrapper);
        } else if (window.location.pathname.includes('support-center')) {
          const parent = document.querySelector('.create-grid');
          if (parent) parent.appendChild(wrapper);
        }
      }, 500);
    },

    triggerGeneration: () => {
      if (typeof window.generateReceipt === 'function' && window.location.pathname.includes('crypto-receipt')) {
        window.generateReceipt();
      } else if (typeof window.generateReceipt === 'function' && window.location.pathname.includes('position-gen')) {
        window.generateReceipt();
      } else if (document.getElementById('generate-btn')) {
        document.getElementById('generate-btn').disabled = false;
        document.getElementById('generate-btn').click();
      }
    },

    download: () => {
      if (typeof window.exportReceipt === 'function') {
        window.exportReceipt();
      } else {
        alert('Download not natively supported. Provide your own capture wrapper.');
      }
    },

    getLink: () => {
      if (window.location.pathname.includes('crypto-receipt')) {
        let st = document.getElementById('statusText');
        let at = document.getElementById('displayAmount');
        let ad = document.getElementById('displayAddress');
        let nw = document.getElementById('displayNetwork');
        let cr = document.getElementById('displayCurrency');
        let tx = document.getElementById('displayTXID');
        let dt = document.getElementById('displayDate');
        
        let data = {
            st: st ? st.innerText.toLowerCase() : '',
            at: at ? at.innerText : '',
            ad: ad ? ad.innerText : '',
            bn: window.activeBrand || 'Binance',
            nw: nw ? nw.innerText : '',
            cr: cr ? cr.innerText : '',
            tx: tx ? tx.innerText : '',
            dt: dt ? dt.innerText : '',
            ty: window.activeType || 'crypto'
        };
        const encoded = btoa(JSON.stringify(data));
        return window.location.origin + window.location.pathname + '?r=' + encoded;
      }
      if (window.location.pathname.includes('support-center')) {
        return window.location.href;
      }
      return null;
    }
  };

  if (!isViewerMode) {
    injectTheme();
  }

  if (isViewerMode) {
    window.entropyAPI.setMode('VIEWER');
    if (window.location.pathname.includes('support-center') && typeof window.handleRouting === 'function') {
        setTimeout(() => window.handleRouting(), 100);
    }
  } else {
    window.entropyAPI.setMode('INPUT');
    window.addEventListener('DOMContentLoaded', () => window.entropyAPI.injectActionButton());
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      window.entropyAPI.injectActionButton();
    }
  }

  window.addEventListener('message', (e) => {
    if (e.data.action === 'SET_MODE_INPUT') {
      window.entropyAPI.setMode('INPUT');
      const btn = document.getElementById('entropy-gen-action');
      const inner = document.getElementById('entropy-inner-text');
      if (btn && inner) {
        inner.innerText = 'GENERATE NOW';
        btn.disabled = false;
      }
    } else if (e.data.action === 'EXECUTE_GENERATION') {
      window.entropyAPI.triggerGeneration();
      setTimeout(() => {
        window.entropyAPI.setMode('RESULT');
        window.parent.postMessage({ 
          action: 'GENERATION_COMPLETE', 
          link: window.entropyAPI.getLink() 
        }, '*');
      }, 500);
    } else if (e.data.action === 'DOWNLOAD') {
      window.entropyAPI.download();
    } else if (e.data.action === 'REJECT_PURCHASE') {
      const btn = document.getElementById('entropy-gen-action');
      const inner = document.getElementById('entropy-inner-text');
      if (btn && inner) {
        inner.innerText = 'INSUFFICIENT BALANCE';
        setTimeout(() => {
          inner.innerText = 'GENERATE NOW';
          btn.disabled = false;
        }, 3000);
      }
    }
  });

})();
</script>
`;

tools.forEach(tool => {
  const indexPath = path.join(toolsDir, tool, 'index.html');
  const srcPath = path.join(process.cwd(), 'tools-src', tool, 'index.html');
  
  if (fs.existsSync(srcPath)) {
    let html = fs.readFileSync(srcPath, 'utf-8');
    if (html.includes('ENTROPY WATERMARK INJECTION')) {
        html = html.split('<!-- ENTROPY WATERMARK INJECTION -->')[0];
        html += '\\n</body>\\n</html>';
    }
    if (html.includes('ENTROPY TOOL CONTROLLER')) {
        html = html.split('<!-- ENTROPY TOOL CONTROLLER -->')[0];
        html += '\\n</body>\\n</html>';
    }
    
    html = html.replace('</body>', controllerScript + '\\n</body>');
    fs.writeFileSync(indexPath, html);
    console.log('Injected Tool Controller & Theme into ' + tool);
  }
});
