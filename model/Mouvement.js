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
    zone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Zone"
    },
    typeMouvement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TypeMouvement"
    },
    quai: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quai"
    },
    operation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Operation"
    },
    positionNavire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PositionNavire"
    },
    etat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Etat"
    }
}, {
    timestamps: true
})

const MouvementSchema = mongoose.model("Mouvement", mouvementSchema);

module.exports = MouvementSchema;
