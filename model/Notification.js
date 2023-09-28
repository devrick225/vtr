const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // L'utilisateur qui envoie la notification
    receivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Liste des utilisateurs destinataires
    message: String,
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
});

notificationSchema.methods.markAsRead = async function (userId) {
    if (!this.isRead && this.receivers.includes(userId)) {
        this.isRead = true;
        await this.save();
    }
};
module.exports = mongoose.model('Notification', notificationSchema);
