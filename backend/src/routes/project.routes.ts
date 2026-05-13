import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public route: for the public site portfolio/grid
router.get('/', ProjectController.getAll);

// Admin-specific routes
router.post('/', authMiddleware, ProjectController.create);
router.get('/stats', authMiddleware, ProjectController.getStats);
router.patch('/:id', authMiddleware, ProjectController.update);
router.delete('/:id', authMiddleware, ProjectController.delete);

export default router;
