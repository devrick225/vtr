const mongoose = require("mongoose");
const typeOperationSchema = new mongoose.Schema({
    libelle: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})

const TypeOperationSchema = mongoose.model("TypeOperation", typeOperationSchema);

module.exports = TypeOperationSchema;
