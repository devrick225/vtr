const mongoose = require("mongoose");
const documentSchema = new mongoose.Schema({
    full_path: {
        type: String
    },
    file_name: {
        type: String,
    },
    reject_reason: {
        type: String,
    },
    escale:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Escale"
        },
    etat:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Etat"
        },
    typeDocument:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TypeDocument"
        },
    valider_par:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    deposer_par: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

const DocumentSchema = mongoose.model("Document", documentSchema);

module.exports = DocumentSchema;
