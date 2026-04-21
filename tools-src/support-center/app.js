/**
 * SupportCenterX — app.js
 * ========================
 * Pure vanilla JS. No frameworks. No build tools. GitHub Pages ready.
 *
 * LOGO STRATEGY (3-tier, browser-side only):
 *   1. Clearbit Logo API  — high-quality company logo by domain (free, no key)
 *   2. Google S2 Favicon  — fallback favicon service, CORS-safe
 *   3. Branded SVG letter — inline SVG matching the platform brand colors
 *
 * FLOATING CONTACT BUTTON:
 *   Fixed bottom-right FAB that links to the configured contact method.
 *   Expands on hover to show a label. Color inherits from platform palette.
 */

'use strict';

/* ============================================================
   LOGO HELPERS
   ============================================================
   Google S2 favicon is the most reliable cross-origin logo
   source — works in every browser with no CORS issues.
   Wikimedia Commons is used where high-quality SVGs exist.
   These are the fallback chain for each platform.
   ============================================================ */
function googleFavicon(domain, sz = 128) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${sz}`;
}

/* ============================================================
   PLATFORM CONFIGURATIONS
   ============================================================
   logoUrl  — Primary logo. Uses reliable public CDNs only.
              Wikimedia SVG/PNG where available (no CORS issues).
              Google favicon for everything else (always works).
   logoUrl2 — Secondary fallback (Google favicon).
   logoLetter — Final fallback: branded SVG letter badge.

   WHY NOT CLEARBIT: clearbit.com logos are blocked by many
   browsers due to referrer/CORS policy when the page is
   served from GitHub Pages. Removed entirely.
   ============================================================ */
const PLATFORMS = {
  binance: {
    name: 'Binance',
    primaryColor:   '#F0B90B',
    secondaryColor: '#0B0E11',
    accentColor:    '#1E2329',
    surfaceColor:   '#252930',
    textColor:      '#EAECEF',
    mutedColor:     '#848E9C',
    /* Wikimedia Commons — official Binance SVG, public domain CDN */
    logoUrl:  'https://upload.wikimedia.org/wikipedia/commons/a/a2/Binance_Logo.svg',
    logoUrl2: googleFavicon('binance.com'),
    logoLetter: 'B',
    fontFamily:     "'Inter', 'Helvetica Neue', Arial, sans-serif",
    bgStyle:        'background:#0B0E11;',
    headerBg:       'rgba(18,20,25,0.97)',
    chipLabel:      'Crypto Exchange',
    chipColor:      '#F0B90B',
    contactLabel:   'Contact Support',
  },
  bybit: {
    name: 'Bybit',
    primaryColor:   '#F7A600',
    secondaryColor: '#0E0F14',
    accentColor:    '#1A1B22',
    surfaceColor:   '#22232D',
    textColor:      '#E8E8E8',
    mutedColor:     '#8A8B9A',
    /* Google favicon — crisp 128px icon, always resolves */
    logoUrl:  googleFavicon('bybit.com'),
    logoUrl2: googleFavicon('bybit.com'),
    logoLetter: 'B',
    fontFamily:     "'DM Sans', 'Inter', Arial, sans-serif",
    bgStyle:        'background:#0E0F14;',
    headerBg:       'rgba(14,15,20,0.97)',
    chipLabel:      'Derivatives Exchange',
    chipColor:      '#F7A600',
    contactLabel:   'Get Support',
  },
  coinbase: {
    name: 'Coinbase',
    primaryColor:   '#0052FF',
    secondaryColor: '#FFFFFF',
    accentColor:    '#F5F7FA',
    surfaceColor:   '#EEF2F8',
    textColor:      '#0A0B0D',
    mutedColor:     '#5B616E',
    /* Google favicon — Coinbase has a clean, high-res registered icon */
    logoUrl:  googleFavicon('coinbase.com'),
    logoUrl2: googleFavicon('coinbase.com'),
    logoLetter: 'C',
    fontFamily:     "'Inter', 'Helvetica Neue', Arial, sans-serif",
    bgStyle:        'background:#FFFFFF;',
    headerBg:       'rgba(255,255,255,0.97)',
    chipLabel:      'Crypto Exchange',
    chipColor:      '#0052FF',
    darkMode:       false,
    contactLabel:   'Contact Support',
  },
  wazir: {
    name: 'WazirX',
    primaryColor:   '#1CB9EF',
    secondaryColor: '#060B14',
    accentColor:    '#0D1420',
    surfaceColor:   '#141D2E',
    textColor:      '#DDE5F0',
    mutedColor:     '#7B8CA8',
    logoUrl:  googleFavicon('wazirx.com'),
    logoUrl2: googleFavicon('wazirx.com'),
    logoLetter: 'W',
    fontFamily:     "'Poppins', 'Inter', Arial, sans-serif",
    bgStyle:        'background:#060B14;',
    headerBg:       'rgba(6,11,20,0.97)',
    chipLabel:      'Indian Crypto Exchange',
    chipColor:      '#1CB9EF',
    contactLabel:   'Chat With Us',
  },
  trustwallet: {
    name: 'Trust Wallet',
    primaryColor:   '#3375BB',
    secondaryColor: '#FFFFFF',
    accentColor:    '#F0F5FF',
    surfaceColor:   '#E8F0FA',
    textColor:      '#0D1B2E',
    mutedColor:     '#607D9E',
    /* Wikimedia Commons — Trust Wallet PNG, official asset */
    logoUrl:  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Trust_Wallet_Logo.png/240px-Trust_Wallet_Logo.png',
    logoUrl2: googleFavicon('trustwallet.com'),
    logoLetter: 'T',
    fontFamily:     "'DM Sans', 'Inter', Arial, sans-serif",
    bgStyle:        'background:#FFFFFF;',
    headerBg:       'rgba(255,255,255,0.97)',
    chipLabel:      'Self-Custody Wallet',
    chipColor:      '#3375BB',
    darkMode:       false,
    contactLabel:   'Get Help',
  },
  metamask: {
    name: 'MetaMask',
    primaryColor:   '#F6851B',
    secondaryColor: '#161618',
    accentColor:    '#1E1E22',
    surfaceColor:   '#28282E',
    textColor:      '#F8F8F8',
    mutedColor:     '#9B9BA8',
    /* Wikimedia Commons — MetaMask Fox SVG, highest quality */
    logoUrl:  'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
    logoUrl2: googleFavicon('metamask.io'),
    logoLetter: 'M',
    fontFamily:     "'Inter', 'Helvetica Neue', Arial, sans-serif",
    bgStyle:        'background:radial-gradient(ellipse at 20% 20%,#2A1000 0%,#161618 60%);',
    headerBg:       'rgba(22,22,24,0.97)',
    chipLabel:      'Ethereum Wallet',
    chipColor:      '#F6851B',
    contactLabel:   'Get Support',
  },
  robinhood: {
    name: 'Robinhood',
    primaryColor:   '#00C805',
    secondaryColor: '#FFFFFF',
    accentColor:    '#F2F4F5',
    surfaceColor:   '#E9ECEE',
    textColor:      '#151718',
    mutedColor:     '#636B74',
    logoUrl:  googleFavicon('robinhood.com'),
    logoUrl2: googleFavicon('robinhood.com'),
    logoLetter: 'R',
    fontFamily:     "'Inter', 'Helvetica Neue', Arial, sans-serif",
    bgStyle:        'background:#FFFFFF;',
    headerBg:       'rgba(255,255,255,0.97)',
    chipLabel:      'Commission-Free Brokerage',
    chipColor:      '#00C805',
    darkMode:       false,
    contactLabel:   'Contact Us',
  },
  phantom: {
    name: 'Phantom',
    primaryColor:   '#9B8EF2',
    secondaryColor: '#121212',
    accentColor:    '#1C1C28',
    surfaceColor:   '#242436',
    textColor:      '#EEEEF8',
    mutedColor:     '#8888AA',
    logoUrl:  googleFavicon('phantom.app'),
    logoUrl2: googleFavicon('phantom.app'),
    logoLetter: 'P',
    fontFamily:     "'DM Sans', 'Inter', Arial, sans-serif",
    bgStyle:        'background:radial-gradient(ellipse at 30% 0%,#1A1030 0%,#121212 65%);',
    headerBg:       'rgba(18,18,18,0.97)',
    chipLabel:      'Solana Wallet',
    chipColor:      '#9B8EF2',
    contactLabel:   'Get Help',
  },
};

/* ============================================================
   HELP TOPICS PER PLATFORM
   ============================================================ */
const PLATFORM_TOPICS = {
  binance: [
    { icon: '🚀', name: 'Getting Started',       desc: 'Create an account, complete KYC, and set up your first wallet.' },
    { icon: '🔐', name: 'Security & 2FA',         desc: 'Enable two-factor authentication and protect your account.' },
    { icon: '💸', name: 'Deposits & Withdrawals', desc: 'Fund your account or send to external wallets.' },
    { icon: '📊', name: 'Spot & Futures Trading', desc: 'Trade on spot, margin, and derivatives markets.' },
    { icon: '🆔', name: 'Identity Verification',  desc: 'KYC levels, document requirements, and status.' },
    { icon: '⚙️', name: 'Account Settings',        desc: 'Manage your email, password, devices, and API keys.' },
  ],
  bybit: [
    { icon: '🚀', name: 'Getting Started',       desc: 'Open your Bybit account and begin trading in minutes.' },
    { icon: '📈', name: 'Derivatives Trading',   desc: 'Perpetual contracts, USDT futures, and options guides.' },
    { icon: '💸', name: 'Deposits & Withdrawals',desc: 'Top up and withdraw crypto or fiat funds.' },
    { icon: '🔐', name: 'Account Security',      desc: 'Protect your assets with advanced security settings.' },
    { icon: '🏦', name: 'Bybit Earn',            desc: 'Savings, liquidity mining, staking, and dual asset.' },
    { icon: '🆔', name: 'KYC Verification',      desc: 'Verify your identity to unlock full trading limits.' },
  ],
  coinbase: [
    { icon: '🚀', name: 'Getting Started',  desc: 'Buy your first crypto in minutes — no experience needed.' },
    { icon: '💳', name: 'Payment Methods',  desc: 'Link your bank, card, or PayPal to buy and sell crypto.' },
    { icon: '🔐', name: 'Account Security', desc: '2-step verification, trusted devices, and recovery.' },
    { icon: '💸', name: 'Send & Receive',   desc: 'Transfer crypto to friends or external wallets.' },
    { icon: '📑', name: 'Taxes & Reports',  desc: 'Download tax documents and full transaction history.' },
    { icon: '🌐', name: 'Advanced Trading', desc: 'Pro tools, API access, and institutional features.' },
  ],
  wazir: [
    { icon: '🚀', name: 'Getting Started',            desc: 'Sign up, verify your identity, and start trading INR pairs.' },
    { icon: '💸', name: 'INR Deposits & Withdrawals', desc: 'Fund via UPI, NEFT, IMPS and withdraw to your bank.' },
    { icon: '🔐', name: 'Security Centre',            desc: '2FA, anti-phishing codes, and account lockdown.' },
    { icon: '📊', name: 'P2P Trading',                desc: 'Buy and sell crypto directly with other WazirX users.' },
    { icon: '🆔', name: 'KYC & Compliance',           desc: 'PAN and Aadhaar verification requirements.' },
    { icon: '⚙️', name: 'Account Management',          desc: 'Profile, referrals, sub-accounts, and API keys.' },
  ],
  trustwallet: [
    { icon: '🔑', name: 'Wallet Setup',        desc: 'Create or import a wallet and back up your recovery phrase.' },
    { icon: '🌐', name: 'Multi-Chain Assets',  desc: 'Manage BTC, ETH, BNB, SOL and 65+ blockchains.' },
    { icon: '🔁', name: 'Swap & Exchange',     desc: 'Swap tokens directly within the Trust Wallet app.' },
    { icon: '🔐', name: 'Security & Recovery', desc: 'Protect your seed phrase and restore a lost wallet.' },
    { icon: '🖼️', name: 'NFTs & DeFi',         desc: 'View NFTs and access DApps with the built-in browser.' },
    { icon: '🌱', name: 'Staking & Earn',      desc: 'Stake assets and earn yield directly in the app.' },
  ],
  metamask: [
    { icon: '🦊', name: 'Getting Started',    desc: 'Install MetaMask, create your wallet, and stay safe.' },
    { icon: '🔑', name: 'Seed Phrase & Keys', desc: 'Back up your Secret Recovery Phrase — never share it.' },
    { icon: '⛽', name: 'Gas & Transactions', desc: 'Understand gas fees and speed up or cancel transactions.' },
    { icon: '🌐', name: 'Networks & Tokens',  desc: 'Add custom networks, import tokens, and use bridges.' },
    { icon: '🖼️', name: 'NFTs & DApps',       desc: 'Connect to decentralized apps and manage your NFTs.' },
    { icon: '🔁', name: 'Portfolio & Swaps',  desc: 'Track your holdings and swap tokens in one place.' },
  ],
  robinhood: [
    { icon: '📈', name: 'Investing Basics', desc: 'Buy stocks, ETFs, and options with zero commissions.' },
    { icon: '💳', name: 'Cash & Transfers', desc: 'Add funds, instant deposits, and bank withdrawals.' },
    { icon: '🔐', name: 'Account Security', desc: 'Two-factor authentication, biometrics, and PIN.' },
    { icon: '📑', name: 'Tax Documents',    desc: 'Download your 1099 forms and annual tax statements.' },
    { icon: '🪙', name: 'Crypto Investing', desc: 'Buy and hold Bitcoin, Ethereum, and other crypto.' },
    { icon: '🏆', name: 'Robinhood Gold',   desc: 'Premium features, margin investing, and research tools.' },
  ],
  phantom: [
    { icon: '👻', name: 'Getting Started',  desc: 'Install Phantom, create your wallet, and explore Solana.' },
    { icon: '🔑', name: 'Wallet Recovery',  desc: 'Restore using your seed phrase or private key.' },
    { icon: '🔁', name: 'Swapping Tokens',  desc: 'Swap SOL, USDC, and SPL tokens in one tap.' },
    { icon: '🖼️', name: 'NFT Collection',   desc: 'View, send, and manage Solana NFTs in the app.' },
    { icon: '🌐', name: 'DApp Browser',     desc: 'Connect Phantom to DeFi protocols and Solana games.' },
    { icon: '⛽', name: 'Transaction Fees', desc: 'How Solana priority fees work and how to set them.' },
  ],
};

/* ============================================================
   CONTACT METHODS
   ============================================================ */
const CONTACT_METHODS = {
  email:    { label: 'Email',    icon: '✉️' },
  whatsapp: { label: 'WhatsApp', icon: '💬' },
  telegram: { label: 'Telegram', icon: '✈️' },
  chatbot:  { label: 'Chatbot',  icon: '🤖' },
};

/* ============================================================
   FAQ CONTENT
   ============================================================ */
function buildFAQs(platformKey, platformName) {
  return [
    {
      q: `How do I contact ${platformName} support?`,
      a: `You can reach ${platformName} support using the contact button on this page. Response times are typically within 24–48 hours for email, or near-instant for live chat.`,
    },
    {
      q: 'I forgot my password — how do I reset it?',
      a: `Visit the ${platformName} login page and click "Forgot Password." A reset link will be sent to your registered email address within a few minutes.`,
    },
    {
      q: 'Why is my account restricted or suspended?',
      a: `Accounts may be restricted for security reasons, incomplete KYC, or unusual activity. Contact our support team with your account details and we will help resolve the issue promptly.`,
    },
    {
      q: 'My transaction is pending or failed — what do I do?',
      a: `Transactions can take up to 60 minutes depending on network congestion. Check the transaction hash on a block explorer. If it has been longer than expected, please contact support.`,
    },
    {
      q: 'How long does identity verification (KYC) take?',
      a: `Most verifications complete within a few hours. During peak periods it may take up to 3 business days. Ensure your documents are clear, valid, and unexpired before submitting.`,
    },
  ];
}

/* ============================================================
   LOCAL STORAGE
   ============================================================ */
const STORAGE_KEY = 'supportcenterx_sites';

function loadSites() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function saveSites(sites) { localStorage.setItem(STORAGE_KEY, JSON.stringify(sites)); }
function getSiteById(id)  { return loadSites().find(s => s.id === id) || null; }

function createSiteObject({ platformKey, contactMethod, contactDetails, uptimeDays }) {
  return {
    id: `${platformKey}-${Date.now().toString(36)}`,
    platformKey, contactMethod, contactDetails,
    uptimeDays: parseInt(uptimeDays, 10),
    createdAt: Date.now(),
  };
}
function addSite(site) { const s = loadSites(); s.unshift(site); saveSites(s); }
function deleteSite(id) { saveSites(loadSites().filter(s => s.id !== id)); }

/* ============================================================
   ROUTING
   ============================================================ */
function getHashSiteId() {
  const m = window.location.hash.match(/^#site=(.+)$/);
  return m ? m[1] : null;
}
function navigateToSite(id)    { window.location.hash = `site=${id}`; }
function navigateToDashboard() { window.location.hash = ''; }

function handleRouting() {
  const siteId = getHashSiteId();
  if (siteId) {
    const site = getSiteById(siteId);
    site ? showSupportSiteView(site) : (showAdminShell(), showToast('Site not found.', true));
  } else {
    showAdminShell();
  }
}

function showAdminShell() {
  Object.assign(document.getElementById('admin-shell').style,
    { display: 'flex', flexDirection: 'column', minHeight: '100vh' });
  document.getElementById('support-site-view').style.display = 'none';
  document.body.removeAttribute('style');
}

/* ============================================================
   ADMIN FORM INTERACTIONS
   ============================================================ */
document.getElementById('platform-select').addEventListener('change', function () {
  updatePreviewCard(this.value); validateForm();
});
document.querySelectorAll('input[name="contact-method"]').forEach(r =>
  r.addEventListener('change', function () { handleContactUI(this.value); validateForm(); })
);
document.getElementById('uptime-slider').addEventListener('input', function () {
  document.getElementById('uptime-display').textContent = `${this.value} day${this.value > 1 ? 's' : ''}`;
});
document.getElementById('generate-btn').addEventListener('click', handleGenerate);
document.querySelectorAll('.contact-detail-input, #input-whatsapp, #input-telegram, #input-chatbot')
  .forEach(el => el.addEventListener('input', validateForm));

function handleContactUI(method) {
  ['input-email','input-whatsapp-wrap','input-telegram','input-chatbot-wrap','contact-details-group']
    .forEach(id => document.getElementById(id).style.display = 'none');
  if (!method) return;
  document.getElementById('contact-details-group').style.display = 'flex';
  const lbl = document.getElementById('contact-details-label');
  const map = {
    email:    ['Support Email Address',              'input-email',        'block'],
    whatsapp: ['WhatsApp Number (with country code)','input-whatsapp-wrap','flex'],
    telegram: ['Telegram Username or Link',          'input-telegram',     'block'],
    chatbot:  ['Chat Widget Embed Code',             'input-chatbot-wrap', 'block'],
  };
  if (map[method]) { lbl.textContent = map[method][0]; document.getElementById(map[method][1]).style.display = map[method][2]; }
}

function getSelectedMethod() {
  const r = document.querySelector('input[name="contact-method"]:checked');
  return r ? r.value : null;
}
function getContactDetails(method) {
  if (!method) return '';
  const ids = { email:'input-email', whatsapp:'input-whatsapp', telegram:'input-telegram', chatbot:'input-chatbot' };
  return ids[method] ? document.getElementById(ids[method]).value.trim() : '';
}
function validateForm() {
  const ok = document.getElementById('platform-select').value &&
             getSelectedMethod() && getContactDetails(getSelectedMethod()).length > 0;
  document.getElementById('generate-btn').disabled = !ok;
}

function updatePreviewCard(key) {
  const empty = document.getElementById('preview-empty');
  const card  = document.getElementById('preview-card');
  if (!key || !PLATFORMS[key]) { empty.style.display = 'flex'; card.style.display = 'none'; return; }
  const p = PLATFORMS[key];
  empty.style.display = 'none';
  card.style.display  = 'block';
  document.getElementById('preview-band').style.background =
    `linear-gradient(135deg,${p.secondaryColor} 0%,${p.accentColor} 100%)`;
  document.getElementById('preview-logo').innerHTML = renderLogoHTML(key, 38);
  const nameEl = document.getElementById('preview-name');
  nameEl.textContent  = p.name;
  nameEl.style.color  = p.primaryColor;
  nameEl.style.fontFamily = p.fontFamily;
  const chip = document.getElementById('preview-chip');
  chip.textContent = p.chipLabel;
  chip.style.cssText = `background:${p.primaryColor}22;color:${p.primaryColor};border:1px solid ${p.primaryColor}44;`;
  document.getElementById('preview-colors').innerHTML =
    [p.primaryColor, p.accentColor, p.surfaceColor].map(c =>
      `<div class="preview-color-swatch" style="background:${c};" title="${c}"></div>`).join('');
}

function handleGenerate() {
  const platformKey    = document.getElementById('platform-select').value;
  const contactMethod  = getSelectedMethod();
  const contactDetails = getContactDetails(contactMethod);
  const uptimeDays     = document.getElementById('uptime-slider').value;
  if (!platformKey || !contactMethod || !contactDetails) return;

  const site = createSiteObject({ platformKey, contactMethod, contactDetails, uptimeDays });
  addSite(site); renderSitesList(); updateHeaderCount();

  const btn = document.getElementById('generate-btn');
  btn.innerHTML = '✅ Site Generated!'; btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 9H15M10.5 4.5L15 9L10.5 13.5" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      Generate Support Site`;
    validateForm();
  }, 2000);
  document.getElementById('sites-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast(`${PLATFORMS[platformKey].name} site created!`);
}

/* ============================================================
   SITES LIST
   ============================================================ */
function renderSitesList() {
  const sites = loadSites();
  const grid  = document.getElementById('sites-grid');
  const desc  = document.getElementById('sites-count-desc');
  grid.innerHTML = '';

  if (!sites.length) {
    desc.textContent = 'No sites yet — create your first one above.';
    grid.innerHTML = `<div class="sites-empty">
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <rect width="56" height="56" rx="16" fill="rgba(255,92,22,0.06)"/>
        <path d="M18 26C18 22.69 20.69 20 24 20H32C35.31 20 38 22.69 38 26V34C38 37.31 35.31 40 32 40H24C20.69 40 18 37.31 18 34V26Z" stroke="#FF5C16" stroke-width="1.4" stroke-opacity="0.35"/>
        <path d="M23 29H33M23 33H28" stroke="#FF5C16" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.35"/>
      </svg><p>Your generated microsites will appear here.</p></div>`;
    return;
  }
  desc.textContent = `${sites.length} site${sites.length !== 1 ? 's' : ''} generated.`;

  sites.forEach(site => {
    const p = PLATFORMS[site.platformKey];
    if (!p) return;
    const daysLeft   = Math.ceil((site.createdAt + site.uptimeDays*86400000 - Date.now()) / 86400000);
    const isExpiring = daysLeft <= 2 && daysLeft > 0;
    const isExpired  = daysLeft <= 0;
    const statusLabel = isExpired ? 'Expired' : isExpiring ? `Expires in ${daysLeft}d` : `Active · ${site.uptimeDays}d`;
    const statusClass = (isExpired || isExpiring) ? 'expiring' : 'active';
    const accessLink  = `${window.location.origin}${window.location.pathname}#site=${site.id}`;
    const createdDate = new Date(site.createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });

    const card = document.createElement('div');
    card.className = 'site-card';
    card.innerHTML = `
      <div class="site-card-top" style="background:linear-gradient(90deg,${p.primaryColor},${p.chipColor}88);"></div>
      <div class="site-card-body">
        <div class="site-card-header">
          <div class="site-card-icon" style="background:${p.primaryColor}18;border:1px solid ${p.primaryColor}33;">
            ${renderLogoHTML(site.platformKey, 26)}</div>
          <div class="site-card-info">
            <div class="site-card-platform" style="font-family:${p.fontFamily}">${p.name}</div>
            <div class="site-card-method">${CONTACT_METHODS[site.contactMethod]?.icon} ${CONTACT_METHODS[site.contactMethod]?.label}</div>
          </div>
          <span class="site-status ${statusClass}">${statusLabel}</span>
        </div>
        <div class="site-card-meta">
          <div class="meta-item"><span class="meta-label">Created</span><span class="meta-value">${createdDate}</span></div>
          <div class="meta-item"><span class="meta-label">Uptime</span><span class="meta-value">${site.uptimeDays} days</span></div>
          <div class="meta-item"><span class="meta-label">Contact</span><span class="meta-value">${truncate(site.contactDetails, 22)}</span></div>
          <div class="meta-item"><span class="meta-label">ID</span><span class="meta-value" style="font-family:monospace;font-size:11px;">${site.id}</span></div>
        </div>
        <div class="site-card-actions">
          <button class="btn btn-secondary" onclick="copyLink('${escapeAttr(accessLink)}')">📋 Copy Link</button>
          <button class="btn btn-ghost" onclick="navigateToSite('${site.id}')">🔗 View Site</button>
          <button class="btn btn-secondary" onclick="handleDeleteSite('${site.id}')" title="Delete" style="flex:0;padding:8px 12px;">🗑️</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function handleDeleteSite(id) {
  if (!confirm('Delete this support site?')) return;
  deleteSite(id); renderSitesList(); updateHeaderCount(); showToast('Site deleted.');
}
function updateHeaderCount() {
  const n = loadSites().length;
  document.getElementById('header-sites-count').textContent = `${n} site${n !== 1 ? 's' : ''}`;
}

/* ============================================================
   LOGO RENDERER
   ============================================================
   Fallback chain per image:
     1. logoUrl  — Wikimedia SVG/PNG or Google favicon (primary)
     2. logoUrl2 — Google favicon (secondary, always works)
     3. Branded SVG data-URI with platform initial + brand color

   The onerror chain is written so each step only fires once,
   preventing infinite loops if all sources fail.
   ============================================================ */
function renderLogoHTML(platformKey, size = 32) {
  const p = PLATFORMS[platformKey];
  if (!p) return '?';

  const letter = p.logoLetter || p.name[0];
  const r      = Math.round(size * 0.22);
  const fs     = Math.round(size * 0.46);

  /* Branded SVG letter badge — the guaranteed last resort.
     Encoded as a data URI so it works fully offline / GitHub Pages. */
  const svgFallback = `data:image/svg+xml,%3Csvg width='${size}' height='${size}' viewBox='0 0 ${size} ${size}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='${size}' height='${size}' rx='${r}' fill='${encodeURIComponent(p.primaryColor)}'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-family='Inter,Arial,sans-serif' font-weight='700' font-size='${fs}' fill='%23ffffff'%3E${letter}%3C/text%3E%3C/svg%3E`;

  const url1 = p.logoUrl;
  const url2 = p.logoUrl2 || googleFavicon(p.logoLetter ? p.name.toLowerCase() + '.com' : 'example.com');

  /* Two-step onerror chain:
     • First error  → try url2
     • Second error → use inline SVG data URI (never fails)        */
  const onErr = `this.onerror=function(){this.onerror=null;this.src='${svgFallback}';};this.src='${url2}';`;

  return `<img
    src="${url1}"
    alt="${p.name} logo"
    width="${size}"
    height="${size}"
    style="width:${size}px;height:${size}px;object-fit:contain;display:block;border-radius:${Math.round(size * 0.1)}px;"
    onerror="${onErr}"
  />`;
}

/* ============================================================
   SUPPORT SITE VIEW
   ============================================================ */
function showSupportSiteView(site) {
  document.getElementById('admin-shell').style.display = 'none';
  const container = document.getElementById('support-site-view');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.innerHTML = renderSupportSiteHTML(site);
  container.classList.remove('entering');
  void container.offsetWidth;
  container.classList.add('entering');

  const p = PLATFORMS[site.platformKey];
  if (p) document.body.setAttribute('style', p.bgStyle);

  // FAQ accordion
  container.querySelectorAll('.ss-faq-q').forEach(btn =>
    btn.addEventListener('click', () => btn.closest('.ss-faq-item').classList.toggle('open'))
  );
  // Chatbot embed
  if (site.contactMethod === 'chatbot' && site.contactDetails.trim()) {
    const wrap = container.querySelector('.ss-chatbot-wrap');
    if (wrap) wrap.appendChild(document.createRange().createContextualFragment(site.contactDetails));
  }
}

function renderSupportSiteHTML(site) {
  const p = PLATFORMS[site.platformKey];
  if (!p) return '<p style="color:white;padding:40px;">Platform not found.</p>';

  const topics = PLATFORM_TOPICS[site.platformKey] || [];
  const faqs   = buildFAQs(site.platformKey, p.name);
  const isDark = p.darkMode !== false;
  const tc     = p.textColor;
  const mc     = p.mutedColor;

  /* ---- Topic cards ---- */
  const topicsHTML = topics.map(t => `
    <div class="ss-topic-card" style="background:${p.surfaceColor};border:1px solid ${p.primaryColor}1A;">
      <div class="ss-topic-icon-wrap" style="background:${p.primaryColor}1A;color:${p.primaryColor};">${t.icon}</div>
      <div class="ss-topic-content">
        <div class="ss-topic-name" style="color:${tc};font-family:${p.fontFamily};">${t.name}</div>
        <div class="ss-topic-desc" style="color:${mc};">${t.desc}</div>
      </div>
      <svg class="ss-topic-arr" width="16" height="16" viewBox="0 0 16 16" fill="none" style="color:${p.primaryColor};flex-shrink:0;">
        <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>`).join('');

  /* ---- FAQ ---- */
  const faqHTML = faqs.map(f => `
    <div class="ss-faq-item" style="background:${p.surfaceColor};border:1px solid ${p.primaryColor}18;">
      <div class="ss-faq-q" style="color:${tc};font-family:${p.fontFamily};">${f.q}
        <svg class="faq-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="${p.primaryColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="ss-faq-a" style="color:${mc};font-family:${p.fontFamily};">${f.a}</div>
    </div>`).join('');

  /* ---- Contact block + FAB ---- */
  const contactBlock = buildContactBlock(site, p);
  const fabBlock     = buildFAB(site, p);

  return `
    <!-- HEADER -->
    <header class="ss-header" style="background:${p.headerBg};border-bottom:1px solid ${p.primaryColor}18;">
      <div class="ss-header-inner">
        <div class="ss-logo">
          <div class="ss-logo-icon-wrap" style="background:${p.primaryColor}15;border:1px solid ${p.primaryColor}30;border-radius:12px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${renderLogoHTML(site.platformKey, 30)}
          </div>
          <div class="ss-logo-text">
            <span class="ss-logo-name" style="color:${tc};font-family:${p.fontFamily};">${p.name}</span>
            <span class="ss-logo-sub" style="color:${mc};">Help Center</span>
          </div>
        </div>
        <nav class="ss-nav">
          <a class="ss-nav-link" style="color:${mc};font-family:${p.fontFamily};" href="#">Help Center</a>
          <a class="ss-nav-link" style="color:${mc};font-family:${p.fontFamily};" href="#">My Account</a>
          <a class="ss-nav-cta" style="background:${p.primaryColor};color:#fff;font-family:${p.fontFamily};" href="#ss-contact-anchor">Contact Us</a>
        </nav>
      </div>
    </header>

    <!-- HERO -->
    <section class="ss-hero" style="background:linear-gradient(180deg,${p.accentColor} 0%,transparent 100%);">
      <div class="ss-hero-inner">
        <span class="ss-hero-badge" style="background:${p.primaryColor}18;color:${p.primaryColor};border:1px solid ${p.primaryColor}30;font-family:${p.fontFamily};">
          ${p.name} Support Center
        </span>
        <h1 class="ss-hero-title" style="color:${tc};font-family:${p.fontFamily};">How can we help you?</h1>
        <p class="ss-hero-sub" style="color:${mc};font-family:${p.fontFamily};">
          Search our knowledge base, browse topics below, or speak directly with our team.
        </p>
        <div class="ss-search-bar" style="background:${p.surfaceColor};border:1.5px solid ${p.primaryColor}30;">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style="color:${mc};flex-shrink:0;">
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12.5 12.5L16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input class="ss-search-input" type="text"
            placeholder="Search articles, guides, and FAQs…"
            style="color:${tc};font-family:${p.fontFamily};" />
          <button class="ss-search-btn" style="background:${p.primaryColor};color:#fff;font-family:${p.fontFamily};">Search</button>
        </div>
        <div class="ss-quick-links" style="font-family:${p.fontFamily};">
          <span style="color:${mc};">Popular: </span>
          <a href="#" style="color:${p.primaryColor};">Reset password</a>
          <a href="#" style="color:${p.primaryColor};">KYC status</a>
          <a href="#" style="color:${p.primaryColor};">Withdrawal limits</a>
        </div>
      </div>
    </section>

    <!-- TOPICS -->
    <section class="ss-topics-section">
      <div class="ss-section-hdr">
        <h2 class="ss-section-title" style="color:${tc};font-family:${p.fontFamily};">Browse Help Topics</h2>
        <p class="ss-section-sub" style="color:${mc};font-family:${p.fontFamily};">Step-by-step guides for the most common questions.</p>
      </div>
      <div class="ss-topics-grid">${topicsHTML}</div>
    </section>

    <!-- FAQ -->
    <section class="ss-faq-section">
      <div class="ss-section-hdr">
        <h2 class="ss-section-title" style="color:${tc};font-family:${p.fontFamily};">Frequently Asked Questions</h2>
        <p class="ss-section-sub" style="color:${mc};font-family:${p.fontFamily};">Quick answers to common account questions.</p>
      </div>
      <div class="ss-faq-list">${faqHTML}</div>
    </section>

    <!-- CONTACT CTA -->
    <section class="ss-contact-section" id="ss-contact-anchor">
      <div class="ss-contact-card" style="background:${p.surfaceColor};border:1px solid ${p.primaryColor}25;">
        <div class="ss-contact-left">
          <div class="ss-contact-icon-ring" style="background:${p.primaryColor}18;border:1.5px solid ${p.primaryColor}35;">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" style="color:${p.primaryColor};">
              <path d="M3.5 7C3.5 6.17 4.17 5.5 5 5.5H21C21.83 5.5 22.5 6.17 22.5 7V19C22.5 19.83 21.83 20.5 21 20.5H5C4.17 20.5 3.5 19.83 3.5 19V7Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M3.5 7L13 14L22.5 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div>
            <h3 class="ss-contact-title" style="color:${tc};font-family:${p.fontFamily};">Still need help?</h3>
            <p class="ss-contact-sub" style="color:${mc};font-family:${p.fontFamily};">
              Our support team is available around the clock and typically responds within a few hours.
            </p>
          </div>
        </div>
        <div class="ss-contact-right">${contactBlock}</div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="ss-footer" style="border-top:1px solid ${p.primaryColor}14;">
      <div class="ss-footer-inner">
        <div class="ss-footer-brand">
          <div style="width:26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:${p.primaryColor}18;border:1px solid ${p.primaryColor}30;">
            ${renderLogoHTML(site.platformKey, 18)}
          </div>
          <span style="font-weight:600;font-size:14px;color:${tc};font-family:${p.fontFamily};">${p.name} Help Center</span>
        </div>
        <p class="ss-disclaimer" style="color:${mc};font-family:${p.fontFamily};">
          ⚠ This is a support official site 
          It is <strong>the</strong> official ${p.name} support page. we will never request for your private key Do not share real credentials.
        </p>
        <button class="ss-back-btn" onclick="navigateToDashboard()" style="color:${mc};font-family:${p.fontFamily};">
          ← 
        </button>
      </div>
    </footer>

    <!-- FLOATING CONTACT BUTTON -->
    ${fabBlock}
  `;
}

/* ============================================================
   CONTACT BLOCK (inside CTA card)
   ============================================================ */
function buildContactBlock(site, p) {
  const mc = p.mutedColor;

  if (site.contactMethod === 'email') {
    return `<a href="mailto:${site.contactDetails}" class="ss-cta-btn" style="background:${p.primaryColor};">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 5C2 4.45 2.45 4 3 4H15C15.55 4 16 4.45 16 5V13C16 13.55 15.55 14 15 14H3C2.45 14 2 13.55 2 13V5Z" stroke="white" stroke-width="1.4"/><path d="M2 5L9 10L16 5" stroke="white" stroke-width="1.4" stroke-linecap="round"/></svg>
        Email Support
      </a>
      <p class="ss-cta-hint" style="color:${mc};">${site.contactDetails}</p>`;
  }
  if (site.contactMethod === 'whatsapp') {
    const n = site.contactDetails.replace(/\D/g, '');
    return `<a href="https://wa.me/${n}" target="_blank" rel="noopener noreferrer" class="ss-cta-btn" style="background:#25D366;">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 10.36 1.87 11.64 2.52 12.73L1.5 16.5L5.38 15.49C6.44 16.08 7.68 16.42 9 16.42C13.14 16.42 16.5 13.06 16.5 8.92C16.5 4.78 13.14 1.5 9 1.5Z" stroke="white" stroke-width="1.4"/></svg>
        WhatsApp Support
      </a>
      <p class="ss-cta-hint" style="color:${mc};">+${n}</p>`;
  }
  if (site.contactMethod === 'telegram') {
    let link = site.contactDetails;
    if (!link.startsWith('http')) link = `https://t.me/${link.replace(/^@/, '')}`;
    return `<a href="${link}" target="_blank" rel="noopener noreferrer" class="ss-cta-btn" style="background:#229ED9;">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M15.5 3L1.5 8.5L6.5 10M15.5 3L10 16.5L6.5 10M15.5 3L6.5 10" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Telegram Support
      </a>
      <p class="ss-cta-hint" style="color:${mc};">${site.contactDetails}</p>`;
  }
  if (site.contactMethod === 'chatbot') {
    return `<p class="ss-cta-hint" style="color:${mc};margin-bottom:10px;">Live chat is active below:</p>
      <div class="ss-chatbot-wrap"></div>`;
  }
  return '';
}

/* ============================================================
   FLOATING ACTION BUTTON
   ============================================================
   Positioned top-right, always visible while scrolling.
   Links directly to the configured contact method.
   No hiding logic — it stays visible at all times.
   ============================================================ */
function buildFAB(site, p) {
  const label  = p.contactLabel || 'Contact Support';
  const method = site.contactMethod;

  let href     = '#ss-contact-anchor';
  let external = false;

  if (method === 'email') {
    href = `mailto:${site.contactDetails}`;
  } else if (method === 'whatsapp') {
    href = `https://wa.me/${site.contactDetails.replace(/\D/g, '')}`;
    external = true;
  } else if (method === 'telegram') {
    const d = site.contactDetails;
    href = d.startsWith('http') ? d : `https://t.me/${d.replace(/^@/, '')}`;
    external = true;
  }

  const icons = {
    email:    `<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M2.5 5.5C2.5 4.95 2.95 4.5 3.5 4.5H16.5C17.05 4.5 17.5 4.95 17.5 5.5V14.5C17.5 15.05 17.05 15.5 16.5 15.5H3.5C2.95 15.5 2.5 15.05 2.5 14.5V5.5Z" stroke="white" stroke-width="1.6"/><path d="M2.5 5.5L10 11L17.5 5.5" stroke="white" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    whatsapp: `<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 2C5.58 2 2 5.58 2 10C2 11.48 2.41 12.86 3.12 14.04L2 18L6.08 16.9C7.22 17.55 8.57 17.93 10 17.93C14.42 17.93 18 14.35 18 9.93C18 5.51 14.42 2 10 2Z" stroke="white" stroke-width="1.6"/></svg>`,
    telegram: `<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M17.5 3.5L2.5 9.5L7.5 11.5M17.5 3.5L11.5 18L7.5 11.5M17.5 3.5L7.5 11.5" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    chatbot:  `<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="2" y="3.5" width="16" height="11" rx="2.5" stroke="white" stroke-width="1.6"/><path d="M6.5 9H13.5M6.5 12H10" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  };
  const iconSVG = icons[method] || icons.email;
  const target  = external ? 'target="_blank" rel="noopener noreferrer"' : '';

  return `
    <!-- FLOATING CONTACT BUTTON — top-right, always visible -->
    <a href="${href}" ${target}
       class="ss-fab"
       style="background:${p.primaryColor};box-shadow:0 4px 20px ${p.primaryColor}60;"
       aria-label="${label}">
      <span class="ss-fab-icon">${iconSVG}</span>
      <span class="ss-fab-label" style="font-family:${p.fontFamily};">${label}</span>
    </a>`;
}

/* ============================================================
   CLIPBOARD & TOAST
   ============================================================ */
function copyLink(link) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(link).then(() => showToast('Link copied to clipboard!'));
  } else {
    const ta = Object.assign(document.createElement('textarea'), { value: link });
    Object.assign(ta.style, { position:'fixed', opacity:'0' });
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    showToast('Link copied!');
  }
}
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.style.borderColor = isError ? 'rgba(255,92,22,0.4)' : 'rgba(52,211,153,0.3)';
  toast.style.color        = isError ? '#FFA680' : '#34D399';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ============================================================
   UTILITIES
   ============================================================ */
function truncate(str, max) { return str.length > max ? str.slice(0, max) + '…' : str; }
function escapeAttr(str)    { return str.replace(/'/g, "\\'").replace(/"/g, '&quot;'); }

/* ============================================================
   INIT
   ============================================================ */
function init() {
  renderSitesList();
  updateHeaderCount();
  handleRouting();
  window.addEventListener('hashchange', handleRouting);
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', e => e.preventDefault()));
  console.log('%cSupportCenterX 🚀', 'color:#FF5C16;font-size:16px;font-weight:bold;');
  console.log('%cLogos: Clearbit CDN → Google Favicon → Branded SVG', 'color:#9896A8;font-size:12px;');
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
