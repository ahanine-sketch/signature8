import { Request, Response } from 'express';
import { CommercialService } from '../services/CommercialService';

export class CommercialController {
  static async getKpis(req: Request, res: Response) {
    try {
      const data = await CommercialService.getCommercialKpis();
      res.json(data);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des KPIs commerciaux:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateObjective(req: Request, res: Response) {
    try {
      const { objectif } = req.body;
      if (typeof objectif !== 'number') {
        return res.status(400).json({ error: 'Objectif invalide' });
      }
      const data = await CommercialService.updateMonthlyObjective(objectif);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addExpense(req: Request, res: Response) {
    try {
      const { source, montant } = req.body;
      if (!source || typeof montant !== 'number') {
        return res.status(400).json({ error: 'Source ou montant invalide' });
      }
      const data = await CommercialService.addMarketingExpense(source, montant);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
