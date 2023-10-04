const mongoose = require("mongoose");
const historiqueActionSchema = new mongoose.Schema({
    user:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
        required: true,
    },

}, {
    timestamps: true
})

const HistoriqueActionSchema = mongoose.model("HistoriqueAction", historiqueActionSchema);

module.exports = HistoriqueActionSchema;
