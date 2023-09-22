const mongoose = require("mongoose");
const typeDocumentSchema = new mongoose.Schema({
    libelle: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    required: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const TypeDocumentSchema = mongoose.model("TypeDocument", typeDocumentSchema);

module.exports = TypeDocumentSchema;
