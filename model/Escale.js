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

}, {
    timestamps: true
})

const EscaleSchema = mongoose.model("Escale", escaleSchema);

module.exports = EscaleSchema;
