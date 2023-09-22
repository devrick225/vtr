const mongoose = require("mongoose");
const prestataireSchema = new mongoose.Schema({
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

const PrestataireSchema = mongoose.model("Prestataire", prestataireSchema);

module.exports = PrestataireSchema;
