const mongoose = require("mongoose");
const demandeSchema = new mongoose.Schema({
    incoming: {
        type: Boolean,
        default: false
    },
    escale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Escale"
    },
    etat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Etat"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
    },
    te_av: {
        type: Number
    },
    te_ar: {
        type: Number
    },
    heure: {
        type: String
    },
    rejection_reason: {
        type: String
    },
}, {
    timestamps: true
})

const DemandeSchema = mongoose.model("Demande", demandeSchema);

module.exports = DemandeSchema;
