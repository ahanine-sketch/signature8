import { Request, Response, NextFunction } from 'express';
import { DemandeService } from '../services/DemandeService';

export class DemandeController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DemandeService.getAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DemandeService.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { statut } = req.body;
      const data = await DemandeService.updateStatus(id, statut);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await DemandeService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = await DemandeService.update(id, req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
