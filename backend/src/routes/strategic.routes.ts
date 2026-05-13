import { Router } from 'express';
import { StrategicController } from '../controllers/StrategicController';

const router = Router();

router.get('/', StrategicController.getStrategicKpis);

export default router;
