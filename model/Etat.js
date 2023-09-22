const mongoose = require("mongoose");
const etatSchema = new mongoose.Schema({
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

const EtatSchema = mongoose.model("Etat", etatSchema);

module.exports = EtatSchema;
