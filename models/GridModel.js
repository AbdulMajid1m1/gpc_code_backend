// models/GridModel.js
import mongoose from 'mongoose';

const GridSchema = new mongoose.Schema({
    HarmonizedCode: { type: String, required: true },
    ItemArabicName: String,
    ItemEnglishName: String,
    DutyRate: String,
    Procedures: String,
    Date: String,
    ItemEnglishNameEmbedding: [Number]
}, { timestamps: true, autoCreate: true });

GridSchema.index({
    ItemEnglishNameEmbedding: 'knnVector',
}, {
    knnVectorOptions: {
        dimensions: 1536,
        similarity: "cosine"
    }
});

export default mongoose.model("Grid", GridSchema);
