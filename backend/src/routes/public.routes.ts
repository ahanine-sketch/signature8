import { Router } from 'express';
import { PublicController } from '../controllers/PublicController';

const router = Router();

// All public — no auth required
router.get('/services', PublicController.getServices);
router.get('/testimonials', PublicController.getTestimonials);
router.get('/portfolio', PublicController.getPortfolio);
router.get('/stats', PublicController.getStats);
router.post('/contact', PublicController.createContact);

export default router;
