const mongoose = require("mongoose");
const marchandiseSchema = new mongoose.Schema({
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

const MarchandiseSchema = mongoose.model("Marchandise", marchandiseSchema);

module.exports = MarchandiseSchema;
