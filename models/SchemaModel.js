// models/SchemaModel.js
import mongoose from 'mongoose';

const SchemaSchema = new mongoose.Schema({
    SegmentCode: String,
    SegmentTitle: String,
    SegmentDefinition: String,
    FamilyCode: String,
    FamilyTitle: String,
    FamilyDefinition: String,
    ClassCode: String,
    ClassTitle: String,
    ClassDefinition: String,
    BrickCode: String,
    BrickTitle: String,
    BrickDefinition_Includes: String,
    BrickDefinition_Excludes: String,
    AttributeCode: String,
    AttributeTitle: String,
    AttributeDefinition: String,
    AttributeValueCode: String,
    AttributeValueTitle: String,
    AttributeValueDefinition: String,
    // AttributeValueTitleEmbedding: [Number] // Embedding field
    BrickAttributeTitleEmbedding: [Number] // Embedding field
}, { timestamps: true });

SchemaSchema.index({
    BrickAttributeTitleEmbedding: 'knnVector',
}, {
    knnVectorOptions: {
        dimensions: 1536,
        similarity: "cosine"
    }
});

export default mongoose.model("Schema", SchemaSchema);

