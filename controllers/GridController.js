// controllers/GridController.js
import { getBulkTextEmbeddings, getTextEmbedding } from '../utils/createEmbedding.js';
import GridModel from '../models/GridModel.js';


import multer from 'multer';
import fs from 'fs';
import csvParser from 'csv-parser';
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

// async function deleteAllRecords() {
//     try {
//         // Use the .deleteMany() method to delete all records
//         const deleteResult = await GridModel.deleteMany({});
//         console.log(`Deleted ${deleteResult.deletedCount} records.`);
//     } catch (error) {
//         console.error('Error deleting records:', error);
//     }
// }


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




// Function to read CSV
async function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        const stream = fs.createReadStream(filePath).pipe(csvParser());

        stream.on('data', (record) => {
            results.push(record);
        });

        stream.on('end', () => {
            resolve(results);
        });

        stream.on('error', (error) => {
            reject(error);
        });
    });
}

// Function to write CSV
async function writeCSV(filePath, records) {
    if (records.length === 0) {
        console.log('No records to write.');
        return;
    }
    const header = Object.keys(records[0]).join(',') + '\n';
    const csvData = records.map(record => Object.values(record).join(',')).join('\n');
    fs.writeFileSync(filePath, header + csvData);
}

// Function to insert a batch into MongoDB
async function insertBatch(records) {
    // Here we are assuming that ItemEnglishName is the text to get embeddings for
    // const texts = records.map(record => record.ItemEnglishName);
    // const embeddings = await getBulkTextEmbeddings(texts);

    // const processedRecords = records.map((record, index) => ({
    //     ...record,
  
    // }));

    await GridModel.insertMany(records);
}

// Function to process each batch
async function processBatch(records) {
    try {
        await insertBatch(records);
        // Implement a delay if necessary for API rate limits
    } catch (error) {
        console.error("Error in processing batch: ", error);
        // Handle or log error appropriately
    }
}

// Main function to handle bulk insertion
export const bulkInsertGrids = async (req, res) => {
    const upload = multer({ dest: 'temp/' }).single('file');
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const filePath = req.file.path;
        let allRecords = await readCSV(filePath);
        const batchSize = 500;  // Adjust the batch size as needed

        while (allRecords.length > 0) {
            let batch = allRecords.slice(0, batchSize);
            await processBatch(batch);
            allRecords = allRecords.slice(batchSize);
            await writeCSV(filePath, allRecords); // Update CSV with unprocessed records
        }

        res.status(200).json({ message: 'Grid data imported successfully.' });
    });
};
