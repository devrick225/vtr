const mongoose = require("mongoose");
const conferenceSchema = new mongoose.Schema({
    close_at: {
        type: Date,
    },
    closed: {
        type: Boolean,
        default: false,
    },
    heure_debut: {
        type: String
    },
    heure_fin: {
        type: String
    },
    user_run: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    user_off: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }


}, {
    timestamps: true
})

const ConferenceSchema = mongoose.model("Conference", conferenceSchema);

module.exports = ConferenceSchema;
