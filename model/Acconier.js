const mongoose = require("mongoose");
const acconierSchema = new mongoose.Schema({

    libelle: {
        type: String,
    },
    code: {
        type: String,
    },
    code_pgop: {
        type: String,
    },
    port: {
        type: String,
        default: "Port Autonome de Cotonou"
    },
}, {
    timestamps: true
})

const AcconierSchema = mongoose.model("Acconier", acconierSchema);

module.exports = AcconierSchema;
