import { Router } from 'express';
import { ResponsableController } from '../controllers/ResponsableController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Admin-only Team management
router.get('/', authMiddleware, ResponsableController.getAll);
router.get('/profile', authMiddleware, ResponsableController.getProfile);
router.post('/', authMiddleware, ResponsableController.create);
router.patch('/:id', authMiddleware, ResponsableController.update);
router.delete('/:id', authMiddleware, ResponsableController.delete);

export default router;
