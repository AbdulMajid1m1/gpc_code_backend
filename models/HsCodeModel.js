// models/HsCode.js
import mongoose from 'mongoose';

const HsCodeSchema = new mongoose.Schema({
    CNKEY: { type: String, required: true },
    HSCODES: String,
    DescriptionEN: String,
    DescriptionENEmbedding: [Number],
    addBy: Number
}, { timestamps: true, autoCreate: true });

HsCodeSchema.index({
    DescriptionENEmbedding: 'knnVector',
}, {
    knnVectorOptions: {
        dimensions: 1536,
        similarity: "cosine"
    }
});

export default mongoose.model("HsCode", HsCodeSchema);