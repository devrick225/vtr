const mongoose = require("mongoose");
const dossierEscaleSchema = new mongoose.Schema({
    date_arrivee_rade: {
        type: Date,
    },
    heure_arrivee_rade: {
        type: String,

    },
    date_mouillage: {
        type: Date,
    },
    heure_mouillage: {
        type: String,
    },
    destination: {
        type: String,
    },
    provenance: {
        type: String,
    },
    motif_attente: {
        type: String,
    },
    numero_atp: {
        type: String,

    },
    tirant_deau_arr: {
        type: String,
    },
    tirant_eau_:{

    },
    numero_escale: { // Numéro PGOP

    },
    escale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Escale"
    },

}, {
    timestamps: true
})

const DossierEscaleSchema = mongoose.model("DossierEscale", dossierEscaleSchema);

module.exports = DossierEscaleSchema;
