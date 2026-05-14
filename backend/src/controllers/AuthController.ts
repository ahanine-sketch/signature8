import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis.' });
      }

      const data = await AuthService.login(email, password);
      res.json({ session: data.session, user: data.user });
    } catch (error: any) {
      console.error('❌ Login Error Trace:', {
        message: error.message,
        stack: error.stack,
        details: error
      });
      res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.logout();
      res.json({ message: 'Déconnexion réussie.' });
    } catch (error) {
      next(error);
    }
  }
}
