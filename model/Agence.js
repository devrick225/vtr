const mongoose = require("mongoose");
const agenceSchema = new mongoose.Schema({

    libelle: {
        type: String,
    },
    code: {
        type: String,
    },
    code_pgop: {
        type: String,
    }

}, {
    timestamps: true
})

const AgenceSchema = mongoose.model("Agence", agenceSchema);

module.exports = AgenceSchema;
