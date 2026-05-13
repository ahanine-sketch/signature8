import { Request, Response } from 'express';
import { StrategicService } from '../services/StrategicService';

export class StrategicController {
  static async getStrategicKpis(req: Request, res: Response) {
    try {
      const kpis = await StrategicService.getStrategicKpis();
      res.json(kpis);
    } catch (error: any) {
      console.error("❌ Error in getStrategicKpis:", error);
      res.status(500).json({ error: error.message });
    }
  }
}
