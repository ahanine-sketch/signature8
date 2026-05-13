import { Router } from 'express';
import { DemandeController } from '../controllers/DemandeController';
import { authenticate } from '../middleware/auth';

const router = Router();

// ─── Pre-flight Handler ──────────────────────────────────────────────────────
router.options('/:id', (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(204).end();
});

// Public route: submit a lead
router.post('/', DemandeController.create);

// Admin routes: protected by authenticate
router.get('/', authenticate, DemandeController.getAll);
router.patch('/:id/statut', authenticate, DemandeController.updateStatus);
router.patch('/:id', authenticate, DemandeController.update);
router.delete('/:id', authenticate, DemandeController.delete);

export default router;
