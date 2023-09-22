const mongoose = require("mongoose");
const bollardSchema = new mongoose.Schema({

    libelle: {
        type: String,
    },
    code: {
        type: String,
    },
    longitude: {
        type: String,
    },
    latitude: {
        type: String,
    },
    quai: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quai"
    },
}, {
    timestamps: true
})

const BollardSchema = mongoose.model("Bollard", bollardSchema);

module.exports = BollardSchema;
