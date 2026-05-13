import { Router } from 'express';
import DevisController from '../controllers/DevisController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protect all routes
router.use(authenticate);

router.get('/', DevisController.getAll);
router.get('/stats', DevisController.getStats);
router.get('/:id', DevisController.getById);
router.post('/', DevisController.create);
router.patch('/:id', DevisController.update);
router.delete('/:id', DevisController.delete);

export default router;
