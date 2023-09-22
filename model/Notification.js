const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // L'utilisateur qui envoie la notification
    receivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Liste des utilisateurs destinataires
    message: String,
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
});

module.exports = mongoose.model('Notification', notificationSchema);
