import { Router } from 'express';
import { ClientController } from '../controllers/ClientController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Admin-only Client management
router.get('/', authenticate, ClientController.getAll);
router.post('/', authenticate, ClientController.create);
router.delete('/:id', authenticate, ClientController.delete);
router.patch('/:id', authenticate, ClientController.update);

export default router;
