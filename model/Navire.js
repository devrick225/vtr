const mongoose = require("mongoose");
const navireSchema = new mongoose.Schema({

    mmsi: String,
    imo: String,
    nom: String,
    lieu_de_construction: String,
    construit_le: String,
    largeur: String,
    call_sign: String,
    draught: String,
    longueur: String,
    _FUEL_CONSUMPTION: String,
    _SPEED_MAX: String,
    _SPEED_SERVICE: String,
    _LIQUID_OIL: String,
    _OWNER: String,
    _MANAGER: String,
    _FINANCIAL_OWNER: String,
    _TECHNICAL_MANAGER: String,
    _VESSEL_TYPE: String,

}, {
    timestamps: true
})

const NavireSchema = mongoose.model("Navire", navireSchema);

module.exports = NavireSchema;
