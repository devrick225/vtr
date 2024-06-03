const mongoose = require('mongoose');

// Schéma de la conférence
const conferenceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    date: {
        type: Date,
        required: true,
        default: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]
});
conferenceSchema.index({ host: 1, date: 1 }, { unique: true });

// Création du modèle
const Conference = mongoose.model('Conference', conferenceSchema);

module.exports = Conference;
