// routes/hsCodeRoutes.js
import express from 'express';
import { createHsCode, searchSimilarHsCode } from '../controllers/HsCodeControllers.js';

const router = express.Router();
router.post('/create', createHsCode);
router.get('/search', searchSimilarHsCode);
// Add more routes as needed

export default router;
