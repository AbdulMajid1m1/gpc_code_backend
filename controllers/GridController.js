// controllers/GridController.js
import { getTextEmbedding } from '../utils/createEmbedding.js';
import GridModel from '../models/GridModel.js';

export const createGrid = async (req, res) => {
    try {
        const { HarmonizedCode, ItemArabicName, ItemEnglishName, DutyRate, Procedures, Date } = req.body;
        const ItemEnglishNameEmbedding = await getTextEmbedding(ItemEnglishName);

        const newGrid = new GridModel({
            HarmonizedCode,
            ItemArabicName,
            ItemEnglishName,
            DutyRate,
            Procedures,
            Date,
            ItemEnglishNameEmbedding
        });

        await newGrid.save();
        res.status(201).json(newGrid);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const searchSimilarGrid = async (req, res) => {
    try {
        const queryItemEnglishName = req.query.item;
        const queryEmbedding = await getTextEmbedding(queryItemEnglishName);

        const pipeline = [
            {
                "$vectorSearch": {
                    "queryVector": queryEmbedding,
                    "path": "ItemEnglishNameEmbedding",
                    "numCandidates": 100,
                    "limit": 2,
                    "index": "textEmbeddingsItemEnglishName"
                }
            }
        ];

        const similarRecords = await GridModel.aggregate(pipeline).exec();
        res.status(200).json(similarRecords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
