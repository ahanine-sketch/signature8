import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Dashboard data is sensitive — requires authentication
router.get('/stats', authenticate, DashboardController.getAdminStats);

export default router;
