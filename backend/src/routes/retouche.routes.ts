import { Router } from 'express';
import { RetoucheController } from '../controllers/RetoucheController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, RetoucheController.create);
router.get('/project/:projectId', authenticate, RetoucheController.getByProject);

export default router;
