// controllers/HsCodeController.js
import { getTextEmbedding } from '../utils/createEmbedding.js';
import HsCodeModel from '../models/HsCodeModel.js';

export const createHsCode = async (req, res) => {
    try {
        const { CNKEY, HSCODES, DescriptionEN, addBy } = req.body;
        const DescriptionENEmbedding = await getTextEmbedding(DescriptionEN);

        const newHsCode = new HsCodeModel({
            CNKEY,
            HSCODES,
            DescriptionEN,
            DescriptionENEmbedding,
            addBy
        });

        await newHsCode.save();
        res.status(201).json(newHsCode);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


export const searchSimilarHsCode = async (req, res) => {
    try {
        const queryDescription = req.query.desc; // Taking description from query parameters
        const queryEmbedding = await getTextEmbedding(queryDescription);

        // Aggregation pipeline for semantic search
        const pipeline = [
            {
                "$vectorSearch": {
                    "queryVector": queryEmbedding,
                    "path": "DescriptionENEmbedding",
                    "numCandidates": 100,
                    "limit": 2,
                    "index": "textEmbeddingsDesc"
                }
            }
        ];

        const similarDocuments = await HsCodeModel.aggregate(pipeline).exec();

        res.status(200).json(similarDocuments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

