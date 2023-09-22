const mongoose = require("mongoose");
const positionNavireSchema = new mongoose.Schema({
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

const PositionNavireSchema = mongoose.model("PositionNavire", positionNavireSchema);

module.exports = PositionNavireSchema;
