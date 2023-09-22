const mongoose = require("mongoose");
const quaiSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    }
}, {
    timestamps: true
})

const QuaiSchema = mongoose.model("Quai", quaiSchema);

module.exports = QuaiSchema;
