const mongoose = require("mongoose");
const quaiSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
   libelle: {
       type: String,
       required: true,
   },
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    },
    longueur: {
        type: Number,
        default: 0
    },
    tirant_eau: {
        type:Number,
        default: 0
    },
    code_pgop: {
        type: String
    }
}, {
    timestamps: true
})

const QuaiSchema = mongoose.model("Quai", quaiSchema);

module.exports = QuaiSchema;
