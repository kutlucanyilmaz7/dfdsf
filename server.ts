import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { User, ChatMessage } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple file-based DB for development
const DB_FILE = path.join(__dirname, 'db.json');
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: {}, systems: {} }));
}

function getDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function updateDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Get current session user
  app.get('/api/user', (req, res) => {
    // In a real app, use session/cookie. For demo, we still use 'default' if it exists.
    const db = getDB();
    const userRole = req.headers['x-user-id'] as string || 'default';
    const user = db.users[userRole];
    
    if (!user) {
      return res.status(401).json({ error: 'Giriş yapılmadı' });
    }
    res.json(user);
  });

  // Auth: Register
  app.post('/api/auth/register', (req, res) => {
    const { email, password, firstName, lastName, phone, country, city } = req.body;
    const db = getDB();
    
    if (db.users[email]) {
      return res.status(400).json({ error: 'Bu e-posta adresi zaten kullanımda.' });
    }

    const newUser: User = {
      id: email,
      email,
      firstName,
      lastName,
      phone,
      country,
      city,
      credits: 10 // 10 credits for new users
    };

    db.users[email] = { ...newUser, password }; // In real app, hash password
    updateDB(db);

    res.json({ success: true, user: newUser });
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const db = getDB();
    const user = db.users[email];

    if (user && user.password === password) {
      const { password: _, ...userWithoutPassword } = user;
      return res.json({ success: true, user: userWithoutPassword });
    }

    res.status(401).json({ error: 'E-posta veya şifre hatalı.' });
  });

  // AI Chat Proxy
  app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;
    const db = getDB();
    const userId = req.headers['x-user-id'] as string || 'default';
    const user = db.users[userId];

    if (!user || user.credits <= 0) {
      return res.status(403).json({ error: 'Yetersiz kredi.' });
    }

    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    if (!DEEPSEEK_API_KEY) {
      return res.status(500).json({ error: 'AI API anahtarı ayarlanmamış.' });
    }

    try {
      db.users[userId].credits -= 1;
      updateDB(db);

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: messages,
          stream: true
        })
      });

      // Forward headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      if (!response.body) throw new Error('No response body');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();

    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'AI servisi ile bağlantı kurulamadı.' });
    }
  });

  // PayTR Payment Proxy (Skeleton)
  app.post('/api/paytr/create-session', async (req, res) => {
    // PayTR logic would go here: 
    // 1. Generate hash
    // 2. Call PayTR API
    // 3. Return iframe URL
    res.json({ url: 'https://www.paytr.com/odeme/guvenli/mock-session' });
  });

  // Akbank POS Proxy (Skeleton)
  app.post('/api/akbank/process', async (req, res) => {
    // Akbank XML/JSON API logic
    res.json({ success: true, message: 'Ödeme başarılı (Simülasyon)' });
  });

  // --- ADMIN API ROUTES ---

  // Get admin stats
  app.get('/api/admin/stats', (req, res) => {
    try {
      const db = getDB();
      const usersData = db.users || {};
      const users = Object.values(usersData) as any[];
      const totalCredits = users.reduce((sum: number, u: any) => sum + (u.credits || 0), 0);
      const totalIncome = users.length * 50; // Mock calculation
      
      console.log('[Admin] Stats requested, user count:', users.length);
      
      // Generate some chart data
      const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          date: d.toLocaleDateString('tr-TR', { weekday: 'short' }),
          users: Math.floor(Math.random() * 10) + 1,
          usage: Math.floor(Math.random() * 100) + 50
        };
      });

      res.json({
        totalUsers: users.length,
        totalCredits: totalCredits,
        totalIncome: totalIncome,
        activeSessions: Math.floor(Math.random() * 20) + 5,
        chartData: last7Days
      });
    } catch (error) {
      console.error('[Admin] Error fetching stats:', error);
      res.status(500).json({ error: 'İstatistikler alınamadı' });
    }
  });

  // Get all users
  app.get('/api/admin/users', (req, res) => {
    try {
      const db = getDB();
      const usersData = db.users || {};
      const users = Object.values(usersData);
      console.log(`[Admin] Returning ${users.length} users`);
      res.json(users);
    } catch (error) {
      console.error('[Admin] Error fetching users:', error);
      res.status(500).json({ error: 'Kullanıcılar alınamadı' });
    }
  });

  // Update user
  app.post('/api/admin/update-user', (req, res) => {
    const { userId, credits, isAdmin, status } = req.body;
    const db = getDB();
    if (db.users[userId]) {
      if (credits !== undefined) db.users[userId].credits = parseInt(credits);
      if (isAdmin !== undefined) db.users[userId].isAdmin = isAdmin;
      if (status !== undefined) db.users[userId].status = status;
      updateDB(db);
      return res.json({ success: true });
    }
    res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  });

  // Delete user
  app.delete('/api/admin/users/:userId', (req, res) => {
    const { userId } = req.params;
    const db = getDB();
    if (db.users[userId]) {
      delete db.users[userId];
      updateDB(db);
      return res.json({ success: true });
    }
    res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  });

  // Get system logs
  app.get('/api/admin/logs', (req, res) => {
    const logs = [
      { id: 1, type: 'info', message: 'Sistem başlatıldı', timestamp: new Date().toISOString() },
      { id: 2, type: 'warning', message: 'Yüksek CPU kullanımı: %85', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 3, type: 'success', message: 'Yeni kullanıcı kaydı: test@example.com', timestamp: new Date(Date.now() - 7200000).toISOString() },
      { id: 4, type: 'error', message: 'API bağlantısı reddedildi', timestamp: new Date(Date.now() - 10800000).toISOString() },
    ];
    res.json(logs);
  });

  // Update settings
  app.post('/api/admin/settings', (req, res) => {
    const { deepseekKey, paytrId, paytrKey } = req.body;
    // In a real app, you'd save these to a secure location or the DB
    console.log('Ayarlar güncellendi:', { deepseekKey, paytrId });
    res.json({ success: true });
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CroopsAI running on http://localhost:${PORT}`);
  });
}

startServer();
