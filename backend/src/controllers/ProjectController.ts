import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/ProjectService';

export class ProjectController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ProjectService.getAll();
      console.log("📤 [BACKEND] ProjectController.getAll - Sending:", data?.length, "projects");
      res.json(data);
    } catch (error) {

      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ProjectService.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = await ProjectService.update(id, req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await ProjectService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ProjectService.getStats();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
