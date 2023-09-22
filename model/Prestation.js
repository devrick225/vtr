const mongoose = require("mongoose");
const prestationSchema = new mongoose.Schema({
    date_commande: {
        type: Date,
    },
    heure_commande: {
        type: String,
    },
    date_realisation: {
        type: Date,
    },
    heure_realisation: {
        type: String,
    },
    date_debut_prestation: {
        type: Date,
    },
    heure_debut_prestation: {
        type: String,
    },
    date_fin_prestation: {
        type: Date,
    },
    heure_fin_prestation: {
        type: String,
    },
    serviceAssistance : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceAssistance"
    },
    etat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Etat"
    },
    mouvement : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mouvement"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type_prestation: {
        type: String,
        enum: ['Entrée', 'Sortie'],
        default: 'Entrée'
    },
    okConsignataire: {
        type: Boolean,
        default: false,
    },
    okPrestataire: {
        type: Boolean,
        default: false,
    },
    okCommandant: {
        type: Boolean,
        default: false,
    },
    okCapitainerie: {
        type: Boolean,
        default: false,
    },
    commandant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    consignataire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    capitaine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {
    timestamps: true
})

const PrestationSchema = mongoose.model("Prestation", prestationSchema);

module.exports = PrestationSchema;
