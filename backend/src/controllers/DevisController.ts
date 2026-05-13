import { Request, Response } from 'express';
import DevisService from '../services/DevisService';

class DevisController {
  async getAll(_req: Request, res: Response) {
    try {
      const data = await DevisService.getAll();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const data = await DevisService.getById(req.params.id as string);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = await DevisService.create(req.body);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = await DevisService.update(req.params.id as string, req.body);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await DevisService.delete(req.params.id as string);
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStats(_req: Request, res: Response) {
    try {
      const data = await DevisService.getStats();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new DevisController();
