import { Request, Response } from 'express';
import { RetoucheService } from '../services/RetoucheService';

export class RetoucheController {
  static async create(req: Request, res: Response) {
    try {
      console.log("🛠️ [BACKEND] Creating Retouche with data:", JSON.stringify(req.body, null, 2));
      const retouche = await RetoucheService.create(req.body);
      res.status(201).json(retouche);
    } catch (error: any) {
      console.error("❌ [BACKEND] Retouche Creation Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }

  static async getByProject(req: Request, res: Response) {
    try {
      const projectId = req.params.projectId as string;
      const retouches = await RetoucheService.getByProject(projectId);
      res.json(retouches);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
