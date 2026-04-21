import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

// Load env vars in dev
if (process.env.NODE_ENV !== 'production') {
  const dotenv = await import('dotenv');
  dotenv.config();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security and utilities
  app.use(helmet({ contentSecurityPolicy: false })); // Disable CSP in dev to allow Vite HMR
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Entropy Tools API' });
  });

  app.post('/api/paystack/initialize', async (req, res) => {
    try {
      const { email, amount } = req.body;
      const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
      
      if (!PAYSTACK_SECRET) {
        return res.status(500).json({ status: false, message: 'Paystack Secret Key is not configured in .env' });
      }

      // We use axios dynamically or fetch
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          amount: amount * 100, // Paystack operates in kobo (cents)
          callback_url: `${process.env.APP_URL || 'http://localhost:3000'}/dashboard/deposit/callback`
        })
      });

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('Paystack init error:', error);
      res.status(500).json({ status: false, message: error.message });
    }
  });

  // Paystack webhook for verification (in a real scenario, handle signatures)
  app.post('/api/paystack/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    // Handling webhooks securely. Usually requires verifying crypto signature header `x-paystack-signature`
    // We'll acknowledge receipt
    res.sendStatus(200);
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
