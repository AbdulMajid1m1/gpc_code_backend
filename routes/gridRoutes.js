// routes/gridRoutes.js
import express from 'express';
import { bulkInsertGrids, createGrid, searchSimilarGrid } from '../controllers/GridController.js';

const router = express.Router();

router.post('/insertIntoGrid', createGrid);

router.post('/bulkInsertGrids', bulkInsertGrids);
router.get('/getSimilarGrid', searchSimilarGrid);

export default router;
