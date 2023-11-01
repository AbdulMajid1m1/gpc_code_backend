// routes/gridRoutes.js
import express from 'express';
import { createGrid, searchSimilarGrid } from '../controllers/GridController.js';

const router = express.Router();

router.post('/insertIntoGrid', createGrid);
router.get('/getSimilarGrid', searchSimilarGrid);

export default router;
