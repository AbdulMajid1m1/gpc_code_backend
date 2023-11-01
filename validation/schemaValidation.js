// validation/schemaValidation.js
import Joi from 'joi';

const schemaValidation = Joi.object({
    SegmentCode: Joi.string().required(),
    SegmentTitle: Joi.string().required(),
    SegmentDefinition: Joi.string().required(),
    FamilyCode: Joi.string().required(),
    FamilyTitle: Joi.string().required(),
    FamilyDefinition: Joi.string().required(),
    ClassCode: Joi.string().required(),
    ClassTitle: Joi.string().required(),
    ClassDefinition: Joi.string().required(),
    BrickCode: Joi.string().required(),
    BrickTitle: Joi.string().required(),
    BrickDefinition_Includes: Joi.string().required(),
    BrickDefinition_Excludes: Joi.string().required(),
    AttributeCode: Joi.string().required(),
    AttributeTitle: Joi.string().required(),
    AttributeDefinition: Joi.string().required(),
    AttributeValueCode: Joi.string().required(),
    AttributeValueTitle: Joi.string().required(),
    AttributeValueDefinition: Joi.string().required(),
    // No need to validate embedding field as it is generated server-side
});

export default schemaValidation;
