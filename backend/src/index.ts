import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

// Route Modules
import authRoutes from './routes/auth.routes';
import demandeRoutes from './routes/demande.routes';
import projectRoutes from './routes/project.routes';
import clientRoutes from './routes/client.routes';
import responsableRoutes from './routes/responsable.routes';
import publicRoutes from './routes/public.routes';
import dashboardRoutes from './routes/dashboard.routes';
import operationalRoutes from './routes/operational.routes';
import uploadRoutes from './routes/upload.routes';
import devisRoutes from './routes/devis.routes';
import retoucheRoutes from './routes/retouche.routes';
import commercialRoutes from './routes/commercial.routes';
import strategicRoutes from './routes/strategic.routes';

try {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
} catch (e) {
  // Silent fail on Vercel
}

const app = express();
const PORT = process.env.PORT || 5000;

// Manual Preflight Fallback
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});








// Env Check Log
console.log('Backend Initialization:', {
  hasUrl: !!process.env.SUPABASE_URL,
  hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  cwd: process.cwd()
});

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Disable CSP for local dev to avoid interference
}));
app.use(express.json());

// Safer path for Vercel
const uploadsPath = path.join(process.cwd(), 'public/uploads');
app.use('/uploads', express.static(uploadsPath));

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'Signature 8 API is live ✅', timestamp: new Date().toISOString() });
});

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/demandes', demandeRoutes);
app.use('/api/admin/projects', projectRoutes);
app.use('/api/admin/clients', clientRoutes);
app.use('/api/responsables', responsableRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/kpis/operational', operationalRoutes);
app.use('/api/kpis/commercial', commercialRoutes);
app.use('/api/kpis/strategic', strategicRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/devis', devisRoutes);
app.use('/api/retouches', retoucheRoutes);

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('⚠️  Unhandled Error:', err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Erreur interne du serveur.' });
});

// ─── Server Start ────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`
    🚀 Signature 8 Backend — Modular Architecture
    ─────────────────────────────────────────────
    🌐 API Root  : http://localhost:${PORT}/api
    `);
  });
}

export default app;
