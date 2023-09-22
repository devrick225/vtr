const mongoose = require("mongoose");
const serviceAssistanceSchema = new mongoose.Schema({
    libelle: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    auto_generated: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

const ServiceAssistanceSchema = mongoose.model("ServiceAssistance", serviceAssistanceSchema);

module.exports = ServiceAssistanceSchema;
