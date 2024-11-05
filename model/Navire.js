const mongoose = require("mongoose");
const navireSchema = new mongoose.Schema({

    ancien_nom: String,
    imo: String,
    nom: String,
    largeur: String,
    type: String,
    longueur: String,
    volume: String,
    mmsi: String,
}, {
    timestamps: true
})

const NavireSchema = mongoose.model("Navire", navireSchema);

module.exports = NavireSchema;
