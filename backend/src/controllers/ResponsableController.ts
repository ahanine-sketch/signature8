import { Request, Response, NextFunction } from 'express';
import { ResponsableService } from '../services/ResponsableService';

export class ResponsableController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ResponsableService.getAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ResponsableService.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ResponsableService.update(req.params.id as string, req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ResponsableService.delete(req.params.id as string);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.query;
      if (!email) return res.status(400).json({ error: 'Email requis' });
      const data = await ResponsableService.getByEmail(email as string);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
