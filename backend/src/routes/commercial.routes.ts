import { Router } from 'express';
import { CommercialController } from '../controllers/CommercialController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', CommercialController.getKpis);
router.post('/objective', CommercialController.updateObjective);
router.post('/expense', CommercialController.addExpense);

export default router;
