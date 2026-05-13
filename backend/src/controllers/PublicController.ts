import { Request, Response, NextFunction } from 'express';
import { PublicService } from '../services/PublicService';

export class PublicController {
  static async getServices(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PublicService.getServices();
      res.json(data);
    } catch (error) { next(error); }
  }

  static async getTestimonials(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PublicService.getTestimonials();
      res.json(data);
    } catch (error) { next(error); }
  }

  static async getPortfolio(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PublicService.getPortfolio();
      res.json(data);
    } catch (error) { next(error); }
  }

  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PublicService.getStats();
      res.json(data);
    } catch (error) { next(error); }
  }

  static async createContact(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PublicService.createContact(req.body);
      res.status(201).json(data);
    } catch (error) { next(error); }
  }
}
