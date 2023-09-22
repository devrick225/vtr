const mongoose = require("mongoose");
const typeMouvementSchema = new mongoose.Schema({
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

const TypeMouvementSchema = mongoose.model("TypeMouvement", typeMouvementSchema);

module.exports = TypeMouvementSchema;
