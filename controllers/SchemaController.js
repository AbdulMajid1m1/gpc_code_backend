// controllers/SchemaController.js
import fs from 'fs';
import csvParser from 'csv-parser';
import multer from 'multer';
import SchemaModel from '../models/SchemaModel.js';
import { getBulkTextEmbeddings, getTextEmbedding } from '../utils/createEmbedding.js';
import schemaValidation from '../validation/schemaValidation.js';

export const createSchema = async (req, res) => {
    try {
        const validation = schemaValidation.validate(req.body);
        if (validation.error) {
            return res.status(400).json({ message: validation.error.details[0].message });
        }

        const schemaData = req.body;
        // add attribute value title plus  brick title
        schemaData.BrickAttributeTitleEmbedding = await getTextEmbedding(`${schemaData.BrickTitle} plus ${schemaData.AttributeValueTitle}`);


        const newSchema = new SchemaModel(schemaData);
        await newSchema.save();
        res.status(201).json(newSchema);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// async function deleteAllRecords() {
//     try {
//         // Use the .deleteMany() method to delete all records
//         const deleteResult = await SchemaModel.deleteMany({});
//         console.log(`Deleted ${deleteResult.deletedCount} records.`);
//     } catch (error) {
//         console.error('Error deleting records:', error);
//     }
// }



export const searchSimilarSchemas = async (req, res) => {

    try {
        const queryAttributeValueTitle = req.query.valueTitle;
        const queryEmbedding = await getTextEmbedding(queryAttributeValueTitle);

        const pipeline = [
            {
                "$vectorSearch": {
                    "queryVector": queryEmbedding,
                    "path": "BrickAttributeTitleEmbedding",
                    "numCandidates": 100,
                    "limit": 10,
                    "index": "textEmbeddingsAttributeValueTitle"
                }
            }
        ];

        const similarSchemas = await SchemaModel.aggregate(pipeline).exec();
        res.status(200).json(similarSchemas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// export const bulkInsertSchemas = async (req, res) => {
//     const upload = multer({ dest: 'temp/' }).single('file');
//     upload(req, res, async (err) => {
//         if (err) {
//             return res.status(400).json({ message: err.message });
//         }

//         let results = [];
//         const batchSize = 500; // Number of records to process in a batch

//         // Store the Readable Stream in a variable
//         const readStream = fs.createReadStream(req.file.path);

//         readStream
//             .pipe(csvParser())
//             .on('data', async (data) => {
//                 results.push(data);

//                 if (results.length >= batchSize) {
//                     readStream.pause();  // Pause the stream
//                     await insertBatch(results);
//                     results = [];
//                     readStream.resume();  // Resume the stream
//                 }
//             })
//             .on('end', async () => {
//                 if (results.length > 0) {
//                     await insertBatch(results);
//                 }
//                 fs.unlinkSync(req.file.path);
//                 res.status(200).json({ message: 'Data imported successfully.' });
//             });
//     });

//     //     async function insertBatch(records) {
//     //         const embeddings = await Promise.all(records.map(record => getTextEmbedding(record.AttributeValueTitle)));
//     //         for (let i = 0; i < records.length; i++) {
//     //             records[i].AttributeValueTitleEmbedding = embeddings[i];
//     //         }
//     //         await SchemaModel.insertMany(records);
//     //     }
//     // };

//     async function insertBatch(records) {
//         // Batch texts for OpenAI API call
//         // combine brick title and attribute value title
//         const texts = records.map(record => `${record.BrickTitle} plus ${record.AttributeValueTitle}`);
//         //  return `${record.BrickTitle} pulse ${record.AttributeValueTitle}`;
//         console.log(texts);
//         const embeddings = await getBulkTextEmbeddings(texts);
//         console.log(embeddings);
//         // Attach embeddings to records
//         for (let i = 0; i < records.length; i++) {
//             records[i].BrickAttributeTitleEmbedding = embeddings[i];
//         }

//         // Insert into MongoDB
//         await SchemaModel.insertMany(records);
//     }
// };

// Bulk insert and process CSV records

// export const countSchemas = async (req, res) => {
//     try {
//         const count = await SchemaModel.countDocuments();
//         res.status(200).json({ count });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

export const countSchemas = async (req, res) => {
    try {
        const stats = await SchemaModel.collection.stats();
        const collectionSize = stats.size; // size in bytes
        const storageSize = stats.storageSize; // storage size in bytes

        res.status(200).json({
            collectionSize,
            storageSize
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// export const bulkInsertSchemas = async (req, res) => {
//     const upload = multer({ dest: 'temp/' }).single('file');
//     upload(req, res, async (err) => {
//         if (err) {
//             return res.status(400).json({ message: err.message });
//         }

//         let results = [];
//         const batchSize = 500; // Number of records to process in a batch
//         const stream = fs.createReadStream(req.file.path).pipe(csvParser());

//         for await (const record of stream) {
//             results.push(record);

//             if (results.length >= batchSize) {
//                 await insertBatch(results);
//                 results = [];
//             }
//         }

//         if (results.length > 0) {
//             await insertBatch(results);
//         }

//         fs.unlinkSync(req.file.path);
//         res.status(200).json({ message: 'Data imported successfully.' });
//     });
// };

// Batch processing and insert into MongoDB
async function insertBatch(records) {
    const texts = records.map(record => `${record.BrickTitle} plus ${record.AttributeValueTitle}`);
    const embeddings = await getBulkTextEmbeddings(texts);

    records.forEach((record, index) => {
        record.BrickAttributeTitleEmbedding = embeddings[index];
    });

    await SchemaModel.insertMany(records);
}



export const bulkInsertSchemas = async (req, res) => {
    const upload = multer({ dest: 'temp/' }).single('file');
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const filePath = req.file.path;
        let allRecords = await readCSV(filePath);
        const batchSize = 500;

        while (allRecords.length > 0) {
            let batch = allRecords.slice(0, batchSize);
            await processBatch(batch);
            allRecords = allRecords.slice(batchSize); // Remove processed batch
            await writeCSV(filePath, allRecords); // Rewrite the remaining records
        }

        res.status(200).json({ message: 'Data imported successfully.' });
    });
};

async function processBatch(records) {
    try {
        await insertBatch(records);
        // Implement a delay if necessary for API rate limits
    } catch (error) {
        console.error("Error in processing batch: ", error);
        // Handle or log error appropriately
    }
}




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

async function writeCSV(filePath, records) {
    if (records.length === 0 || !records[0]) {
        console.log('No records to write.');
        return;
    }
    const header = Object.keys(records[0]).join(',') + '\n';
    const csvData = records.map(record => Object.values(record).join(',')).join('\n');
    fs.writeFileSync(filePath, header + csvData);
}
