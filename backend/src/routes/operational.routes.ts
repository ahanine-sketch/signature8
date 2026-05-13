import { Router } from 'express';
import { OperationalService } from '../services/OperationalService';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const data = await OperationalService.getOperationalKpis();
    res.json(data);
  } catch (error: any) {
    console.error("Error in Operational KPIs route:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
