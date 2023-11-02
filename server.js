import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import RootRoute from './routes/RootRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
dotenv.config();


mongoose.set("strictQuery", true);

// const connect = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO);
//         console.log("Connected to mongoDB!");
//     } catch (error) {
//         console.log(error);
//     }
// };
// const connect = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO);
//         console.log("Connected to mongoDB!");

//         // Place the index creation logic here
//         const collection = mongoose.connection.collection('HsCodes'); // Replace 'HsCodes' with your actual collection name

//         const indexDefinition = {
//             "mappings": {
//                 "dynamic": true,
//                 "fields": {
//                     "DescriptionENEmbedding": {
//                         "dimensions": 1536,
//                         "similarity": "cosine",
//                         "type": "knnVector"
//                     }
//                 }
//             }
//         };

//         // Checking if the index exists is optional as MongoDB will not create a duplicate
//         await collection.createIndex(indexDefinition);
//         console.log("Search index created/verified");

//     } catch (error) {
//         console.log(error);
//     }
// };
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB!");

        const collection = mongoose.connection.collection('HsCodes'); // Replace 'HsCodes' with your actual collection name

        const indexDefinition = {
            "BrickAttributeTitleEmbedding": "text" // Assuming "text" index type for searching
        };

        // Create the vector search index using MongoDB Atlas Search
        await collection.createIndex(indexDefinition);

        console.log("Vector search index created/verified");
    } catch (error) {
        console.log(error);
    }
};

const allowedOrigins = [
    "http://localhost:3080",
    "http://gs1ksa.org:3080",

];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/api', RootRoute);



app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";

    return res.status(errorStatus).send(errorMessage);
});



const PORT = process.env.PORT || 3077;
app.listen(PORT, () => {
    connect();
    console.log(`Server is running on port ${PORT}`);
});
