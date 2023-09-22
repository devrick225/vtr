const mongoose = require("mongoose");
const conditionnementSchema = new mongoose.Schema({
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

const ConditionnementSchema = mongoose.model("Conditionnement", conditionnementSchema);

module.exports = ConditionnementSchema;
