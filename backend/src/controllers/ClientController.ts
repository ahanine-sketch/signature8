import { Request, Response, NextFunction } from 'express';
import { ClientService } from '../services/ClientService';

export class ClientController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ClientService.getAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ClientService.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await ClientService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = await ClientService.update(id, req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
