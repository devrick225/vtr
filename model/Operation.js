const mongoose = require("mongoose");
const operationSchema = new mongoose.Schema({

    nombre_prevu: {
        type: Number,
    },
    tonnage_prevu: {
        type: Number,

    },
    escale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Escale"
    },
    marchandise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Marchandise"
    },
    typeOperation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TypeOperation"
    },
    conditionnement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conditionnement"
    },
}, {
    timestamps: true
})

const OperationSchema = mongoose.model("Operation", operationSchema);

module.exports = OperationSchema;
