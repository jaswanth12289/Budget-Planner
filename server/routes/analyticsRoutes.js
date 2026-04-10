import express from 'express';
import { getInsights } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/insights', protect, getInsights);

export default router;
