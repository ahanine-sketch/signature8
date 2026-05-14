import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

// Route Modules
import authRoutes from '../src/routes/auth.routes';
import demandeRoutes from '../src/routes/demande.routes';
import projectRoutes from '../src/routes/project.routes';
import clientRoutes from '../src/routes/client.routes';
import responsableRoutes from '../src/routes/responsable.routes';
import publicRoutes from '../src/routes/public.routes';
import dashboardRoutes from '../src/routes/dashboard.routes';
import operationalRoutes from '../src/routes/operational.routes';
import uploadRoutes from '../src/routes/upload.routes';
import devisRoutes from '../src/routes/devis.routes';
import retoucheRoutes from '../src/routes/retouche.routes';
import commercialRoutes from '../src/routes/commercial.routes';
import strategicRoutes from '../src/routes/strategic.routes';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

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








// Request Logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Remove the old cors() call if I had one
// app.use(cors(...)); 

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Disable CSP for local dev to avoid interference
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

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
