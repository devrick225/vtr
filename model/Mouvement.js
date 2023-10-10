const mongoose = require("mongoose");
const mouvementSchema = new mongoose.Schema({
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

    date_accostage_effective: {
        type: Date,
    },
    date_appareillage_effective: {
        type: Date,
    },
    heure_accostage_effective: {
        type: String,
    },
    heure_appareillage_effective: {
        type: String,
    },
    debordement_avant: {
        type: String,
    },
    debordement_arriere: {
        type: String,
    },
    nombre_remorque_demande: {
        type: Number,
    },

    leaving_reason: {
        type: String,
    },
    escale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Escale"
    },
    zone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Zone"
    },
    quai: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quai"
    },
    positionNavire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PositionNavire"
    },
    etat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Etat"
    },
    mouvement_accostage: {
        type: String,
        enum: ['Entrée', 'Sortie', 'Mouvement'],
    },
    mouvement_appareillage: {
        type: String,
        enum: ['Entrée', 'Sortie', 'Mouvement'],
    },
    pab_accostage_date: {
        type: Date,

    },
    pab_accostage_heure: {
        type: String,

    },
    pab_appareillage_date: {
        type: Date,

    },
    pab_appareillage_heure: {
        type: String,

    },

}, {
    timestamps: true
})

const MouvementSchema = mongoose.model("Mouvement", mouvementSchema);

module.exports = MouvementSchema;
