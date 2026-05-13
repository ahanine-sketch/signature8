import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  console.log(`🔒 [AUTH] Request: ${req.method} ${req.path}`);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn(`⚠️ [AUTH] Missing or invalid Authorization header for: ${req.path}`);
    return res.status(401).json({ error: 'Identification requise.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error(`❌ [AUTH] Supabase verification failed for ${req.path}:`, error?.message || "User not found");
      return res.status(401).json({ error: 'Session invalide ou expirée.' });
    }

    console.log(`✅ [AUTH] Authenticated user: ${user.email}`);
    // Attach user to request
    (req as any).user = user;
    next();
  } catch (err: any) {
    console.error(`💥 [AUTH] Internal Error:`, err.message);
    res.status(401).json({ error: "Erreur d'authentification." });
  }
};

// Compatibility export
export const authMiddleware = authenticate;

