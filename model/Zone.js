const mongoose = require("mongoose");
const zoneSchema = new mongoose.Schema({
    libelle: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,

    },
    rank: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true
})

const ZoneSchema = mongoose.model("Zone", zoneSchema);

module.exports = ZoneSchema;
