// routes/schemaRoutes.js
import express from 'express';
import { bulkInsertSchemas, countSchemas, createSchema, searchSimilarSchemas } from '../controllers/SchemaController.js';

const router = express.Router();

router.post('/createSchema', createSchema);
router.get('/findSimilarSchemas', searchSimilarSchemas);
router.get('/countSchemas', countSchemas);
router.post('/bulkInsertSchemas', bulkInsertSchemas);

export default router;
