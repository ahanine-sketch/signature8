import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/DashboardService';

export class DashboardController {
  static async getAdminStats(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getAdminStats();
      res.json(data);
    } catch (error) { next(error); }
  }
}
