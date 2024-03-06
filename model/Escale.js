const mongoose = require("mongoose");
const escaleSchema = new mongoose.Schema({
    date_accostage_prevue: {
        type: Date,
    },
    date_appareillage_prevue: {
        type: Date,

    },
    heure_accostage_prevue: {
        type: String,
    },
    heure_appareillage_prevue: {
        type: String,

    },
    date_accostage_estimee: {
        type: Date,
    },
    date_appareillage_estimee: {
        type: Date,
    },
    heure_accostage_estimee: {
        type: String,
    },
    heure_appareillage_estimee: {
        type: String,
    },

    is_commerciale: {
        type: Boolean,
    },

    is_dangerous: {
        type: Boolean,
    },
    agence: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agence"
    },
    quai: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quai"
    },
    acconier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Acconier"
    },
    navire:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Navire"
        },
    etat:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Etat"
        },
    zone:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Zone"
        },
    user:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

    dossierEscale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DossierEscale', // Reference to the Escale model
    },

}, {
    timestamps: true
})

const EscaleSchema = mongoose.model("Escale", escaleSchema);

module.exports = EscaleSchema;
