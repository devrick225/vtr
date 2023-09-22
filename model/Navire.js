const mongoose = require("mongoose");
const navireSchema = new mongoose.Schema({
    ancien_nom: {
        type: String,
        required: true,
    },
    nom: {
        type: String,
        required: true,
    },
    code_radio: {
        type: String,
    },
    longueur: {
        type: Number,
    },
    largeur: {
        type: Number,
    },
    imo: {
        type: String,
    },
    mmsi: {
        type: String,
    },
    tirant_eau: {
        type: Number,
    },
    type: {
        type: String,
    },
    volume: {
        type: Number,
    },
    tirant_eau_arriere: {
        type: Number,
    },
    tirant_eau_avant: {
        type: Number,
    },

}, {
    timestamps: true
})

const NavireSchema = mongoose.model("Navire", navireSchema);

module.exports = NavireSchema;
